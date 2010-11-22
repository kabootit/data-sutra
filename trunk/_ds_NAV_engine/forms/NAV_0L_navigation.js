/**
 *
 * @properties={typeid:24,uuid:"7c7a54d9-6406-4aaa-a7bf-bc1a2fd25920"}
 */
function ACTIONS_list()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	pop the menu up instead of the default down
 *			  	uses a secondary invisible object on the layout which is behind the clicked button
 *			  	move secondary object up far enough to drop down a popup that hits the top edge
 *			  		of clicked btn
 *			  	when menu item is selected, return secondary object to original location
 *			  	
 *			  	Change name, Duplicate navigation set, Delete record
 *			  	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	ACTIONS_list_control()
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get menu list from a value list
var valueList = [
		'Rename navigation set',
		'Duplicate navigation set',
		'----',
		'Delete record'
	] //,'Export framework settings','Import framework settings','----'

//build menu
var menu = new Array
for ( var i = 0 ; i < valueList.length ; i++ ) {
	menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_control)
}

//set menu method arguments
var x = 0
while (menu[x]) {
	//pass arguments
	menu[x].setMethodArguments(x)
	
	//disable dividers
	if (valueList[x] == '----') {
		menu[x].setEnabled(false)
	}
	
	x++
}


//hack not required
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//pop up the popup menu
	var elem = elements[application.getMethodTriggerElementName()]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menu);
	}
}
//legacy
else {
	//allow popup to approximately work even when solutionPrefs isn't defined
	if (application.__parent__.solutionPrefs) {
		var lineHeight = solutionPrefs.clientInfo.popupHack.lineHeight
		var topShift = solutionPrefs.clientInfo.popupHack.topShift
	}
	else {
		var lineHeight = 0
		var topShift = 0
	}
	
	var btnInvisible = application.getMethodTriggerElementName() + "_up"
	var currentLocationX = elements[btnInvisible].getLocationX()
	var currentLocationY = elements[btnInvisible].getLocationY()
	
	//move "up" button to correct location
	elements[btnInvisible].setLocation(currentLocationX, currentLocationY - (topShift + (menu.length * lineHeight)))
	
	//pop up the popup menu
	var elem = elements[btnInvisible]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menu);
	}
	
	//set invisible btn back to original location
	elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
}
}

/**
 *
 * @properties={typeid:24,uuid:"2892a60a-fb20-42f6-b3df-d58ea49b352e"}
 */
function ACTIONS_list_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	0: Rename navigation set
 *			  	1: Duplicate navigation set
 *			  	3: Export all settings
 *			  	4: Import settings
 *			  	6: Delete navigation set
 *			  	
 *	INPUT    :	position in array of action item
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch (arguments[0]) {
	case 0: //change name
		var navName = plugins.dialogs.showInputDialog('Change navigation set name', 'Enter new name:', nav_name)
		if (navName) {
			nav_name = navName
			databaseManager.saveData()
		}
		break

	case 1:	//dupe nav set
		var newNav = plugins.dialogs.showInputDialog('Duplicate set','What do you want the new navigation set to be called?')
		
		if (newNav) {
			//turn on progress bar
			plugins.sutra.busyCursor = true
			globals.CALLBACK_progressbar_start(-273, 'Duplicating ' + nav_name + ' to ' + newNav + '....')
			
			var formName = 'NAV_0L_navigation'
			var relnName = 'nav_navigation_to_navigation_item__all'
			
			var formNameNavItem = 'NAV_R_navigation_item'
			var relnNameColumn = 'nav_navigation_item_to_column'
			var relnNameDisplay = 'nav_navigation_item_to_list_display'
			var relnNameDisplayItem = 'nav_list_display_to_list_display_item'
			var relnNameAction = 'nav_navigation_item_to_action_item'
			var relnNameActionFilter = 'nav_action_item_to_action_item_filter'
			
			//get nav_items in array
			var navItems = new Array()
			for (var i = 0; i < forms[formName][relnName].getSize() ; i++) {
				navItems[i] = forms[formName][relnName].getRecord(i+1)
			}
			
			//duplicate nav_set and get new uuid for it
			var record = foundset.getRecord(foundset.duplicateRecord(foundset.getSelectedIndex(),false,true))
			record.nav_name = newNav
			record.nav_uuid = application.getNewUUID()
			record.nav_default = 0
			
			//copy all associated nav_items over
			for (var i = 0; i < navItems.length; i++) {
				//create new navigation item
				var newRec = record[relnName].getRecord(record[relnName].newRecord(false,true))
				//copy the matching columns
				databaseManager.copyMatchingColumns(navItems[i],newRec)
				//null out registry
			//	newRec.item_id = null
				//over-ride auto enter things
				newRec.use_fw_list = navItems[i].use_fw_list
				newRec.row_status_show = navItems[i].row_status_show
				newRec.bar_item_add = navItems[i].bar_item_add
				newRec.bar_item_action = navItems[i].bar_item_action
				newRec.bar_item_filter = navItems[i].bar_item_filter
				newRec.bar_item_report = navItems[i].bar_item_report
				newRec.bar_item_tab = navItems[i].bar_item_tab
				//databaseManager.saveData()
				
				//set selected index 
				forms.NAV_0L_navigation_item_1L.controller.setSelectedIndex(i+1)
				
				//select correct navigation_item
				forms[formNameNavItem].controller.find()
				forms[formNameNavItem].id_navigation_item = navItems[i].id_navigation_item
				forms[formNameNavItem].controller.search()
				
				//get column foundset object
				var columns = databaseManager.getFoundSet(controller.getServerName(),'sutra_column')
				columns.clear()
				
				//copy all columns over
				for (var j = 0; j < forms[formNameNavItem][relnNameColumn].getSize() ; j++) {
					//copy source action to a newly created one
					columns.newRecord(true,true)
					var destRec = columns.getRecord(1)
					var srcRec = forms[formNameNavItem][relnNameColumn].getRecord(j+1)
					databaseManager.copyMatchingColumns(srcRec,destRec)
					destRec.id_navigation_item = newRec.id_navigation_item
					destRec.status_find = srcRec.status_find
					destRec.status_relation = srcRec.status_relation
				}
				
				//get display foundset object
				var display = databaseManager.getFoundSet(controller.getServerName(),'sutra_list_display')
				display.clear()
				
				//copy all universal list displays over
				for (var j = 0; j < forms[formNameNavItem][relnNameDisplay].getSize() ; j++) {
					
					//copy source universal list display to a newly created one
					display.newRecord(true,true)
					var srcRec = forms[formNameNavItem][relnNameDisplay].getRecord(j+1)
					var destRec = display.getRecord(1)
					databaseManager.copyMatchingColumns(srcRec,destRec)
					destRec.id_navigation_item = newRec.id_navigation_item
					
					//set selected index for relation to work
					forms[formNameNavItem][relnNameDisplay].setSelectedIndex(j+1)
					//copy all display items
					for (var k = 0; k < forms[formNameNavItem][relnNameDisplay][relnNameDisplayItem].getSize() ; k++) {
						//copy all display items from original to new universal list display
						display[relnNameDisplayItem].newRecord(true,true)
						var displayItemRec = forms[formNameNavItem][relnNameDisplay][relnNameDisplayItem].getRecord(k+1)
						var destChildRec = display[relnNameDisplayItem].getRecord(1)
						databaseManager.copyMatchingColumns(displayItemRec,destChildRec)
					}
				}
				
				//get actions foundset object
				var actions = databaseManager.getFoundSet(controller.getServerName(),'sutra_action_item')
				actions.clear()
				
				//sort to make sure that sub levels of filters are 'in order'
				if (forms[formNameNavItem][relnNameAction].getSize()) {
					forms[formNameNavItem][relnNameAction].sort('id_action_item_parent asc')
				}
				
				var filterLevels = new Object()
				
				//copy all actions over
				for (var j = 0; j < forms[formNameNavItem][relnNameAction].getSize() ; j++) {
					//copy source action to a newly created one
					actions.newRecord(true,true)
					var srcRec = forms[formNameNavItem][relnNameAction].getRecord(j+1)
					var destRec = actions.getRecord(1)
					databaseManager.copyMatchingColumns(srcRec,destRec)
					destRec.id_navigation_item = newRec.id_navigation_item
					
					if (srcRec.category == 'Filters') {
						//keep track of new id_action_item of item
						filterLevels[srcRec.id_action_item] = destRec.id_action_item
						
						//if sub level, update with value of new filter
						if (destRec.id_action_item_parent) {
							destRec.id_action_item_parent = filterLevels[destRec.id_action_item_parent]
						}
						
						//set selected index for relation to work
						forms[formNameNavItem][relnNameAction].setSelectedIndex(j+1)
						
						//copy all filters over
						for (var k = 0; k < forms[formNameNavItem][relnNameAction][relnNameActionFilter].getSize() ; k++) {
							actions[relnNameActionFilter].newRecord(true,true)
							var srcRec = forms[formNameNavItem][relnNameAction][relnNameActionFilter].getRecord(k+1)
							var destRec = actions[relnNameActionFilter].getRecord(1)
							databaseManager.copyMatchingColumns(srcRec,destRec)
						}
					}
				}				
				
			}
			databaseManager.saveData()
			
			//turn off progress bar
			globals.CALLBACK_progressbar_stop()
			plugins.sutra.busyCursor = false
		}
		break
		
	case 13:	//export all settings
		EXPORT_engine()
		break
		
	case 14:	//import settings
		IMPORT_engine()
		break
	
	case 3:	//delete record
		var delRec = plugins.dialogs.showWarningDialog('Delete set','Do you really want to delete this navigation set?','Yes','No')
		var defaultDisplay = false
		
		if (delRec == 'Yes') {
			//turn on progress bar
			plugins.sutra.busyCursor = true
			globals.CALLBACK_progressbar_start(-273, 'Deleting the ' + nav_name + ' navigation set.  Please wait...')
			
			//check if selected record is default display
			if (nav_default) {
				defaultDisplay = true
			}
			controller.deleteRecord()
			
			//if deleted navigation set was the default, set the currently selected one to be the default (and activate it)
			if (defaultDisplay && controller.getMaxRecordIndex()) {
				nav_default = 1
				nav_status = 1
				databaseManager.saveData()
			}
			
			//turn off progress bar
			globals.CALLBACK_progressbar_stop()
			plugins.sutra.busyCursor = false
		}
		break	
}
}

/**
 *
 * @properties={typeid:24,uuid:"a10a5140-22d4-4525-bd9f-cf851a59e251"}
 */
function DIR_down()
{

/*
 *	TITLE:		DIR_down
 *
 *	MODULE:		ds_NAV_engine
 *
 *	ABOUT:		Move navigation_item down in list
 *
 *	MODIFIED:	Aug 27, 2007 - Troy Elliott, Data Mosaic
 *
 */

var formName = 'NAV_0L_navigation_1L'

//if max index, exit (no more records of same node-level below
var recordLast = forms[formName].foundset.getRecord(forms[formName].foundset.getSize())
if (forms[formName].order_by == recordLast.order_by) {
	plugins.dialogs.showErrorDialog('Error','This record is at the bottom of the list.  It cannot move any lower')
	return
}

//get pk of field started on
var pkRecSelect = forms[formName].id_navigation

//get current record
var recordCurr = forms[formName].foundset.getRecord(forms[formName].foundset.getSelectedIndex())

//get next record
var recordNext = forms[formName].foundset.getRecord(forms[formName].foundset.getSelectedIndex() + 1)

if (recordCurr.order_by < forms[formName].foundset.getSize()) {
	recordCurr.order_by = recordNext.order_by
	recordNext.order_by --
}

//sort lists
forms[formName].foundset.sort('order_by asc')

//select record we were on at start
forms[formName].foundset.selectRecord(pkRecSelect)



}

/**
 *
 * @properties={typeid:24,uuid:"24613cc4-7e2b-4ac8-b2eb-c53137e097ed"}
 */
function DIR_up()
{

/*
 *	TITLE:		DIR_up
 *
 *	MODULE:		ds_NAV_engine
 *
 *	ABOUT:		Move navigation_item up in list
 *
 *	MODIFIED:	Aug 27, 2007 - Troy Elliott, Data Mosaic
 *
 */

var formName = 'NAV_0L_navigation_1L'

//if index = 1, exit (no more records of same node-level above)
var recordFirst = forms[formName].foundset.getRecord(1)
if (forms[formName].order_by == recordFirst.order_by) {
	plugins.dialogs.showErrorDialog('Error','This record is at the top of the list.  It cannot move any higher')
	return
}

//get pk of field started on
var pkRecSelect = forms[formName].id_navigation

//get current record
var recordCurr = forms[formName].foundset.getRecord(forms[formName].foundset.getSelectedIndex())

//get previous record
var recordPrev = forms[formName].foundset.getRecord(forms[formName].foundset.getSelectedIndex() - 1)

if (recordCurr.order_by > 1) {
	recordCurr.order_by = recordPrev.order_by
	recordPrev.order_by ++
}

//sort lists
forms[formName].foundset.sort('order_by asc')

//select record we were on at start
forms[formName].foundset.selectRecord(pkRecSelect)

}

/**
 *
 * @properties={typeid:24,uuid:"7a9041c0-4bfb-49d2-b20f-d382f4b0665a"}
 */
function EXPORT_engine()
{

/*
 *	TITLE    :	EXPORT_engine
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	prompt to choose sets to export; prompt for location; create xml file
 *			  	
 *	INPUT    :	array of... (all optional)
 *			  		1- what to export
 *			  		2- navigation set IDs
 *			  		3- group IDs
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Jun 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var whatExport = arguments[0]
var navIDs = arguments[1]
var groupIDs = arguments[2]

var relnGroupAction = 'ac_access_group_to_access_group_action'
var relnGroupActionAction = 'ac_access_group_action_to_access_action'
var relnGroupToolbar = 'ac_access_group_to_access_group_toolbar'
var relnGroupToolbarToolbar = 'ac_access_group_toolbar_to_toolbar'
var relnGroupUser = 'ac_access_group_to_access_user_group__selected'
var relnGroupNav = 'ac_access_group_to_control_navigation'
var relnGroupNavSet = 'ac_control_navigation_to_navigation'
var relnGroupBlog = 'ac_access_group_to_access_group_blog__selected'
var relnGroupBlogBlog = 'ac_access_group_blog_to_blog'
var relnBlogEntry = 'ac_blog_to_blog_entry'
var relnBlogQuote = 'ac_blog_to_blog_quote'
var relnStaff = 'ac_access_organization_to_access_staff'
var relnNav = 'nav_navigation_to_navigation_item__all'
var relnNavColumn = 'nav_navigation_item_to_column'
var relnNavDisplay = 'nav_navigation_item_to_list_display'
var relnNavDisplayItem = 'nav_list_display_to_list_display_item'
var relnNavAction = 'nav_navigation_item_to_action_item'
var relnNavActionFilter = 'nav_action_item_to_action_item_filter'
var relnNavDevSpec = 'nav_navigation_item_to_specification'
var relnNavDevTask = 'nav_navigation_item_to_task'

//progress bar rations
	//xml creation is 95%
		//numAreas = whatExport.length
		//sizeArea = 95/numAreas
		//numAreaSize = numAreas/navsets
		//numItemSize = numAreaSize/navItems
	//zip creation is 5%
var numAreas
var currentArea = 1
var sizeArea
var numAreaSize
var numItemSize
globals.CALLBACK_progressbar_start(0,'Exporting...')

	
	//	choosing what to do will come in a later version
				
	// set to all false to avoid undefined error ~150 line
	var accessControl = false
	var blog = false
	var navEngine = false
	var reportRegistry = false
	var solConfig = false
	var toolbar = false
	var tooltip = false
	var valuelist = false
				
				//no arguments passed, prompt to choose what info to export
				if (!whatExport) {
					forms.NAV_P_navigation.elements.fld_what.visible = true
					forms.NAV_P_navigation.elements.fld_export_navset.visible = false
					forms.NAV_P_navigation.elements.fld_import_navset.visible = false
					forms.NAV_P_navigation.elements.fld_export_access.visible = false
					forms.NAV_P_navigation.elements.fld_import_access.visible = false
					forms.NAV_P_navigation.elements.lbl_header.text = 'Select what things to export'
					application.showFormInDialog(
								forms.NAV_P_navigation,
								-1,-1,-1,-1,
								'Export',
								false,
								false,
								'fwImportExport'
							)
					var z = ''
					if (globals.NAV_importexport_areas) {
						whatExport = globals.NAV_importexport_areas.split('\n')
						
						for (var i = 0; i < whatExport.length; i++) {
							switch (whatExport[i]) {
								case 'Access & control':
									var accessControl = true
									break
								case 'Blogs':
									var blog = true
									break
								case 'Navigation engine':
									var navEngine = true
									break
								case 'Report registry':
									var reportRegistry = true
									break
								case 'Solution configuration':
									var solConfig = true
									break
								case 'Toolbars':
									var toolbar = true
									break
								case 'Tooltips':
									var tooltip = true
									break
								case 'Value list':
									var valuelist = true
									break
							}
						}
						
						globals.NAV_importexport_areas = null
					}
				}
			/*	
				//something to export
				if (whatExport) {
				
					//how the progress bar should roll along....
					numAreas = whatExport.length
					
	//	end choosing what to do


//we are exporting all the areas
var accessControl = true
var blog = true
var navEngine = true
var reportRegistry = true
var solConfig = true
var toolbar = true
var tooltip = true
var valuelist = true
	*/


//if something to do, run
//TODO: when cancel button pressed, this line has a big error
if (accessControl || blog || navEngine || reportRegistry || solConfig || toolbar || tooltip || valuelist) {
	
	//how the progress bar should roll along....number of things being exported
	numAreas = 15 //navigation engine gets 8
	sizeArea = 95 / numAreas
	
	//prompt for file where to save
	plugins.dialogs.showInfoDialog('Save export file','Choose a location to save the exported frameworks settings','OK')
	var zipFileName = plugins.file.showFileSaveDialog('_FW_settings.mosaic')
	
	//check to see if zipFileName already exists, if it does throw up error
	if (zipFileName && zipFileName.exists()) {
		var fileGood = plugins.dialogs.showWarningDialog('File exists','Replace existing file?','Yes','No')
	}
	else if (zipFileName) {
		var fileGood = 'Yes'
	}
	
	//file chosen
	if (fileGood == 'Yes') {
	
		// Create document
		var exportXML = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument()
		var rootElem = exportXML.createElement('mosaicFrameworks')
		exportXML.appendChild(rootElem)
		
		
		//Export node
		//
		//
		var exportElem = exportXML.createElement('exportDetails')
		rootElem.appendChild(exportElem)
		
		/*	//MEMO
			ver 1 never worked
			ver 2 was the rc6.5 version (2008 May)
			ver 3 was new with 2 rc2 (2008 Sept)
			ver 4 was new with 2 rc6, 2.1 rc3 (2009 July)
		*/
		exportElem.appendChild(XML_text_node(exportXML,'xmlVersion','4'))
		exportElem.appendChild(XML_text_node(exportXML,'servoyVersion',solutionPrefs.clientInfo.verServoy))
		exportElem.appendChild(XML_text_node(exportXML,'osPlatform',solutionPrefs.clientInfo.typeOS))
		exportElem.appendChild(XML_text_node(exportXML,'osVersion',solutionPrefs.clientInfo.verOS))
		exportElem.appendChild(XML_text_node(exportXML,'javaVersion',solutionPrefs.clientInfo.verJava))
		exportElem.appendChild(XML_text_node(exportXML,'date',new Date()))
		exportElem.appendChild(XML_text_node(exportXML,'frameworksVersion',plugins.sutra.getVersion()))
		
		
		//Access & control node
		//
		//
		if (accessControl) {
			
			globals.CALLBACK_progressbar_set(null,'Adding access and control...')
			
			//Access & control node
			//
			//
			var accessControlElem = exportXML.createElement('accessControl')
			rootElem.appendChild(accessControlElem)
			
			//create containers
			var accessGroupsElem = exportXML.createElement('accessGroups')
			accessControlElem.appendChild(accessGroupsElem)
			var accessUsersElem = exportXML.createElement('accessUsers')
			accessControlElem.appendChild(accessUsersElem)
			var accessOrganizationsElem = exportXML.createElement('accessOrganizations')
			accessControlElem.appendChild(accessOrganizationsElem)
			var accessFiltersElem = exportXML.createElement('accessFilters')
			accessControlElem.appendChild(accessFiltersElem)
			var actionRegistryElem = exportXML.createElement('actionRegistry')
			accessControlElem.appendChild(actionRegistryElem)
			var passwordRulesElem = exportXML.createElement('passwordRules')
			accessControlElem.appendChild(passwordRulesElem)
			
				/*
				//	choosing groups removed
			
						//no arguments passed, prompt to choose access groups to export
						if (!groupIDs) {
							forms.NAV_P_navigation.elements.fld_what.visible = false
							forms.NAV_P_navigation.elements.fld_export_navset.visible = false
							forms.NAV_P_navigation.elements.fld_import_navset.visible = false
							forms.NAV_P_navigation.elements.fld_export_access.visible = true
							forms.NAV_P_navigation.elements.fld_import_access.visible = false
							forms.NAV_P_navigation.elements.lbl_header.text = 'Select groups to export'
							application.showFormInDialog(forms.NAV_P_navigation,-1,-1,-1,-1,'Export',false,false,'fwImportExport')
							
							if (globals.NAV_export_access) {
								groupIDs = globals.NAV_export_access.split('\n')
								globals.NAV_export_access = null
							}
							
							//remove value if it is blank
							for (var m = 0; m < groupIDs.length; m++) {
								if (!groupIDs[m]) {
									groupIDs.splice(m,1)
								}
							}
						}
						
						//convert array to dataset
						var dataset = databaseManager.convertToDataSet(groupIDs)
			
				//	end choosing what to do
				*/
			
			//get all groups to export
			groupIDs = application.getValueListItems('NAV_export_access').getColumnAsArray(2)
			var dataset = databaseManager.convertToDataSet(groupIDs)
			
			//load dataset into groups foundset
			var accessGroups = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_group')
			accessGroups.clear()
			accessGroups.loadRecords(dataset)
			
			//track users in groups
			var accessUsers = new Object()
			
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
			//progress updater
			numAreaSize = (endPosn - startPosn) / groupIDs.length
			
			//loop through selected group, export data
			for (var h = 1; h <= accessGroups.getSize(); h++) {		
				//set index
				accessGroups.setSelectedIndex(h)
				
				//progress updater
				globals.CALLBACK_progressbar_set(startPosn + Math.floor(numAreaSize * (h - 1)),'Access group: ' + accessGroups.group_name)
				
				//create xml definition for this access group
				var accessGroupElem = exportXML.createElement('group')
				accessGroupsElem.appendChild(accessGroupElem)
				
				//punch down uuid if this set doesn't have one
				if (accessGroups.group_uuid) {
					var accessGroupUUID = accessGroups.group_uuid
				}
				//use uuid for this set
				else {
					var accessGroupUUID = accessGroups.group_uuid = application.getNewUUID()
				}
				
				accessGroupElem.setAttribute('id',accessGroupUUID)
				accessGroupElem.setIdAttribute('id',true)
				
				accessGroupElem.appendChild(XML_text_node(exportXML,'groupID',accessGroups.id_group))
				accessGroupElem.appendChild(XML_text_node(exportXML,'groupName',accessGroups.group_name))
				accessGroupElem.appendChild(XML_text_node(exportXML,'notes',accessGroups.group_notes))
				accessGroupElem.appendChild(XML_text_node(exportXML,'loggingItems',accessGroups.log_items))
				accessGroupElem.appendChild(XML_text_node(exportXML,'groupLoginMethod',accessGroups.login_method))
				accessGroupElem.appendChild(XML_text_node(exportXML,'groupLogoutMethod',accessGroups.logout_method))
				accessGroupElem.appendChild(XML_text_node(exportXML,'onLoginSet',accessGroups.login_nav_set))
				accessGroupElem.appendChild(XML_text_node(exportXML,'onLoginItem',accessGroups.login_nav_main))
				accessGroupElem.appendChild(XML_text_node(exportXML,'onLoginNode',accessGroups.login_nav_main_node))
				accessGroupElem.appendChild(XML_text_node(exportXML,'onLoginSub',accessGroups.login_nav_sub))
				accessGroupElem.appendChild(XML_text_node(exportXML,'modesAdmin',accessGroups.modes_admin))
				accessGroupElem.appendChild(XML_text_node(exportXML,'modesUser',accessGroups.modes_user))
				accessGroupElem.appendChild(XML_text_node(exportXML,'toolbars',accessGroups.toolbars))
				
				//navigation sets for selected group
				//
				//check that relation valid
				if (accessGroups[relnGroupNav] && accessGroups[relnGroupNav].getSize()) {
					
					//create xml definition for navigationSets
					var allNavSetsElem = exportXML.createElement('navigationSets')
					accessGroupElem.appendChild(allNavSetsElem)
					
					//loop through selected navigation sets, export data
					for (var i = 1; i <= accessGroups[relnGroupNav].getSize(); i++) {
						//get nav item being worked on
						var groupNavigation = accessGroups[relnGroupNav].getRecord(i)
						
						//check if valid group
						if (groupNavigation[relnGroupNavSet] && groupNavigation[relnGroupNavSet].getSize()) {
							//punch down uuid if this set doesn't have one
							if (groupNavigation[relnGroupNavSet].nav_uuid) {
								var navSetUUID = groupNavigation[relnGroupNavSet].nav_uuid
							}
							//use uuid for this set
							else {
								var navSetUUID = groupNavigation[relnGroupNavSet].nav_uuid = application.getNewUUID()
							}
							
							//create xml definition for this navSet
							
							var navSetElem = exportXML.createElement('navigationSet')
							allNavSetsElem.appendChild(navSetElem)
							
							navSetElem.setAttribute('id',navSetUUID)
							navSetElem.setIdAttribute('id',true)
							
							navSetElem.appendChild(XML_text_node(exportXML,'groupID',groupNavigation.id_group))
							navSetElem.appendChild(XML_text_node(exportXML,'navigationID',groupNavigation.id_navigation))
							navSetElem.appendChild(XML_text_node(exportXML,'name',groupNavigation.nav_name))
							navSetElem.appendChild(XML_text_node(exportXML,'comments',groupNavigation.comments))
							navSetElem.appendChild(XML_text_node(exportXML,'flagChosen',groupNavigation.flag_chosen))
							navSetElem.appendChild(XML_text_node(exportXML,'uuid',navSetUUID))
						}
					}
				}
				
				//log users assigned to selected group (will add all users to export at end)
				for (var i = 1; i <= accessGroups[relnGroupUser].getSize(); i++) {
					var record = accessGroups[relnGroupUser].getRecord(i)
					if (!accessUsers[record.id_user]) {
						accessUsers[record.id_user] = new Array()
					}
					accessUsers[record.id_user].push(accessGroups.id_group)
				}
				
				//progres updater, push ahead half a stop
				if (startPosn + (h / accessGroups.getSize() * (endPosn - startPosn)) <= endPosn) {
					globals.CALLBACK_progressbar_set(startPosn + Math.floor(numAreaSize * (h - 1)) + numAreaSize / 2)
				}
				
				//actions
				//
				//check that relation valid
				if (accessGroups[relnGroupAction] && accessGroups[relnGroupAction].getSize()) {
					
					//create xml definition for assigned actions
					var allActionsElem = exportXML.createElement('actions')
					accessGroupElem.appendChild(allActionsElem)
					
					//loop through selected actions, export data
					for (var i = 1; i <= accessGroups[relnGroupAction].getSize(); i++) {
						//get action being worked on
						var groupAction = accessGroups[relnGroupAction].getRecord(i)
						
						//check if valid action
						if (groupAction[relnGroupActionAction] && groupAction[relnGroupActionAction].getSize()) {
							//punch down uuid if this set doesn't have one
							if (groupAction[relnGroupActionAction].action_uuid) {
								var actionUUID = groupAction[relnGroupActionAction].action_uuid
							}
							//use uuid for this set
							else {
								var actionUUID = groupAction[relnGroupActionAction].action_uuid = application.getNewUUID()
							}
							
							//create xml definition for this action
							
							var actionElem = exportXML.createElement('action')
							allActionsElem.appendChild(actionElem)
							
							actionElem.setAttribute('id',actionUUID)
							actionElem.setIdAttribute('id',true)
							
							actionElem.appendChild(XML_text_node(exportXML,'groupID',groupAction.id_group))
							actionElem.appendChild(XML_text_node(exportXML,'actionID',groupAction.id_action))
							actionElem.appendChild(XML_text_node(exportXML,'name',groupAction[relnGroupActionAction].nav_name))
							actionElem.appendChild(XML_text_node(exportXML,'flagChosen',groupAction.flag_chosen))
							actionElem.appendChild(XML_text_node(exportXML,'flagEnabled',groupAction.flag_enabled))
							actionElem.appendChild(XML_text_node(exportXML,'uuid',actionUUID))
						}
					}
				}
				
				
				//toolbar area
				//
				//check that toolbars selected for export and relation valid
				if (toolbar && accessGroups[relnGroupToolbar] && accessGroups[relnGroupToolbar].getSize()) {
				
					//create xml definition for assigned toolbars
					var allToolbarsElem = exportXML.createElement('toolbars')
					accessGroupElem.appendChild(allToolbarsElem)
					
					//loop through selected toolbars, export data
					for (var i = 1; i <= accessGroups[relnGroupToolbar].getSize(); i++) {
						//get action being worked on
						var groupToolbar = accessGroups[relnGroupToolbar].getRecord(i)
						
						//check if valid toolbar
						if (groupToolbar[relnGroupToolbarToolbar] && groupToolbar[relnGroupToolbarToolbar].getSize()) {
							//punch down uuid if this toolbar doesn't have one
							if (groupToolbar[relnGroupToolbarToolbar].toolbar_uuid) {
								var toolbarUUID = groupToolbar[relnGroupToolbarToolbar].toolbar_uuid
							}
							//use uuid for this set
							else {
								var toolbarUUID = groupToolbar[relnGroupToolbarToolbar].toolbar_uuid = application.getNewUUID()
							}
							
							//create xml definition for this toolbar
							
							var toolbarElem = exportXML.createElement('toolbar')
							allToolbarsElem.appendChild(toolbarElem)
							
							toolbarElem.setAttribute('id',toolbarUUID)
							toolbarElem.setIdAttribute('id',true)
							
							toolbarElem.appendChild(XML_text_node(exportXML,'groupID',groupToolbar.id_group))
							toolbarElem.appendChild(XML_text_node(exportXML,'toolbarID',groupToolbar.id_toolbar))
							toolbarElem.appendChild(XML_text_node(exportXML,'formName',groupToolbar[relnGroupToolbarToolbar].form_name))
							toolbarElem.appendChild(XML_text_node(exportXML,'flagChosen',groupToolbar.flag_chosen))
							toolbarElem.appendChild(XML_text_node(exportXML,'uuid',toolbarUUID))
						}
					}
				}
				
				
				//blog
				//
				//check that blog selected for export and relation valid
				if (blog && accessGroups[relnGroupBlog] && accessGroups[relnGroupBlog].getSize()) {
					
					//create xml definition for assigned blogs
					var allBlogsElem = exportXML.createElement('blogs')
					accessGroupElem.appendChild(allBlogsElem)
					
					//loop through selected blogs, export data
					for (var i = 1; i <= accessGroups[relnGroupBlog].getSize(); i++) {
						//group-blog merge record
						var groupBlog = accessGroups[relnGroupBlog].getRecord(i)
						
						//check if valid blog
						if (groupBlog[relnGroupBlogBlog] && groupBlog[relnGroupBlogBlog].getSize()) {
							
							//punch down uuid if this blog doesn't have one
							if (groupBlog[relnGroupBlogBlog].bloguuid) {
								var blogUUID = groupBlog[relnGroupBlogBlog].blog_uuid
							}
							//use uuid for this set
							else {
								var blogUUID = groupBlog[relnGroupBlogBlog].blog_uuid = application.getNewUUID()
							}
							
							//create xml definition for this blog
							
							var blogElem = exportXML.createElement('blog')
							allBlogsElem.appendChild(blogElem)
							
							blogElem.setAttribute('id',blogUUID)
							blogElem.setIdAttribute('id',true)
							
							blogElem.appendChild(XML_text_node(exportXML,'groupID',groupBlog.id_group))
							blogElem.appendChild(XML_text_node(exportXML,'blogID',groupBlog.id_blog))
							blogElem.appendChild(XML_text_node(exportXML,'name',groupBlog[relnGroupBlogBlog].blog_name))
							blogElem.appendChild(XML_text_node(exportXML,'flagChosen',groupBlog.flag_chosen))
							blogElem.appendChild(XML_text_node(exportXML,'uuid',blogUUID))
						}
					}
				}
			}
			
			//update with what doing
			globals.CALLBACK_progressbar_set(endPosn,'Adding all users...')
			
			//create users that were in selected groups
			var userIDs = new Array()
			
			for (var g in accessUsers) {
				userIDs.push(g)
			}
			
			//convert array to dataset
			var dataset = databaseManager.convertToDataSet(userIDs)
			
			//load dataset into navigation foundset
			var fsAccessUsers = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_user')
			fsAccessUsers.clear()
			fsAccessUsers.loadRecords(dataset)
			
			//loop through selected users, export data
			for (var h = 1; h <= fsAccessUsers.getSize(); h++) {	
				//get user record index
				var userRecord = fsAccessUsers.getRecord(h)
				
				//create xml definition for this access user
				
				var accessUserElem = exportXML.createElement('user')
				accessUsersElem.appendChild(accessUserElem)
				
				//punch down uuid if this user doesn't have one
				if (userRecord.user_uuid) {
					var accessUserUUID = userRecord.user_uuid
				}
				//use uuid for this user
				else {
					var accessUserUUID = userRecord.user_uuid = application.getNewUUID()
				}
				
				var userGroupAssigned = ''
				while (accessUsers[userRecord.id_user].length) {
					userGroupAssigned = accessUsers[userRecord.id_user].shift() + ((accessUsers[userRecord.id_user].length == 0) ? '' : ',')
				}
				
				accessUserElem.setAttribute('id',accessUserUUID)
				accessUserElem.setIdAttribute('id',true)
				
				accessUserElem.appendChild(XML_text_node(exportXML,'userID',userRecord.id_user))
				accessUserElem.appendChild(XML_text_node(exportXML,'organizationID',userRecord.id_organization))
				accessUserElem.appendChild(XML_text_node(exportXML,'staffID',userRecord.id_staff))
				accessUserElem.appendChild(XML_text_node(exportXML,'userName',userRecord.user_name))
				accessUserElem.appendChild(XML_text_node(exportXML,'notes',userRecord.user_notes))
				accessUserElem.appendChild(XML_text_node(exportXML,'password',userRecord.user_password))
				accessUserElem.appendChild(XML_text_node(exportXML,'uuid',accessUserUUID))
				
				accessUserElem.appendChild(XML_text_node(exportXML,'groupsAssigned',userGroupAssigned))
				
				accessUserElem.appendChild(XML_text_node(exportXML,'disabled',userRecord.account_disabled))
				accessUserElem.appendChild(XML_text_node(exportXML,'dateCreated',userRecord.date_created))
				accessUserElem.appendChild(XML_text_node(exportXML,'dateModified',userRecord.date_modified))
				accessUserElem.appendChild(XML_text_node(exportXML,'datePassword',userRecord.date_password_changed))
				accessUserElem.appendChild(XML_text_node(exportXML,'previousPasswords',userRecord.old_passwords))
				accessUserElem.appendChild(XML_text_node(exportXML,'passMustChangeAtNextLogin',userRecord.pass_change_at_login))
				accessUserElem.appendChild(XML_text_node(exportXML,'passNeverExpires',userRecord.pass_never_expires))
				accessUserElem.appendChild(XML_text_node(exportXML,'passUnchangeable',userRecord.pass_unchangeable))
				accessUserElem.appendChild(XML_text_node(exportXML,'screenHeight',userRecord.screen_height))
				accessUserElem.appendChild(XML_text_node(exportXML,'screenCenter',userRecord.screen_location_center))
				accessUserElem.appendChild(XML_text_node(exportXML,'screenX',userRecord.screen_location_x))
				accessUserElem.appendChild(XML_text_node(exportXML,'screenY',userRecord.screen_location_y))
				accessUserElem.appendChild(XML_text_node(exportXML,'screenWidth',userRecord.screen_width))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceCenteredH1',userRecord.space_centered_horizontal_1))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceCenteredH2',userRecord.space_centered_horizontal_2))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceClassicH',userRecord.space_classic_horizontal))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceClassicV',userRecord.space_classic_vertical))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceListH',userRecord.space_list_horizontal))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceStandardH',userRecord.space_standard_horizontal))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceStandardV',userRecord.space_standard_vertical))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceVertcialH1',userRecord.space_vertical_horizontal_1))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceVertcialH2',userRecord.space_vertical_horizontal_2))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceWideH',userRecord.space_wide_horizontal))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceWideV',userRecord.space_wide_vertical))
			}
			
		//create selected organizations (if they are using the provided organization structure)
			
			//update with what doing
			globals.CALLBACK_progressbar_set(null,'Adding default organizations...')
			
			var fsOrganization = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_organization')
			fsOrganization.loadAllRecords()
			
			//loop through all organizations
			for (var i = 1; i <= fsOrganization.getSize(); i++) {
				var record = fsOrganization.getRecord(i)
				
				//create xml definition for this organization
				var organizationItemElem = exportXML.createElement('organization')
				accessOrganizationsElem.appendChild(organizationItemElem)
				
				organizationItemElem.setAttribute('id',record.id_organization)
				organizationItemElem.setIdAttribute('id',true)
				
				organizationItemElem.appendChild(XML_text_node(exportXML,'addressOne',record.address_1))
				organizationItemElem.appendChild(XML_text_node(exportXML,'addressTwo',record.address_2))
				organizationItemElem.appendChild(XML_text_node(exportXML,'city',record.city))
				organizationItemElem.appendChild(XML_text_node(exportXML,'name',record.name_organization))
				organizationItemElem.appendChild(XML_text_node(exportXML,'phoneFax',record.phone_fax))
				organizationItemElem.appendChild(XML_text_node(exportXML,'phoneMain',record.phone_main))
				organizationItemElem.appendChild(XML_text_node(exportXML,'dateCreated',record.rec_created))
				organizationItemElem.appendChild(XML_text_node(exportXML,'dateModified',record.rec_modified))
				organizationItemElem.appendChild(XML_text_node(exportXML,'state',record.state))
				organizationItemElem.appendChild(XML_text_node(exportXML,'url',record.url))
				organizationItemElem.appendChild(XML_text_node(exportXML,'postalCode',record.zip))
				
				if (utils.hasRecords(fsOrganization[relnStaff])) {
					
					//create xml container for organization's staff
					var staffElem = exportXML.createElement('staff')
					organizationItemElem.appendChild(staffElem)
					
					//loop through all staff
					for (var j = 1; j <= fsOrganization[relnStaff].getSize(); j++) {
						var staffRec = fsOrganization[relnStaff].getRecord(j)
						
						//create xml definition for this staff
						var staffItemElem = exportXML.createElement('staff')
						staffElem.appendChild(staffItemElem)
						
						staffItemElem.setAttribute('id',record.id_staff)
						staffItemElem.setIdAttribute('id',true)
						
						staffItemElem.appendChild(XML_text_node(exportXML,'addressOne',staffRec.address_1))
						staffItemElem.appendChild(XML_text_node(exportXML,'addressTwo',staffRec.address_2))
						staffItemElem.appendChild(XML_text_node(exportXML,'city',staffRec.address_city))
						staffItemElem.appendChild(XML_text_node(exportXML,'country',staffRec.address_country))
						staffItemElem.appendChild(XML_text_node(exportXML,'state',staffRec.address_state))
						staffItemElem.appendChild(XML_text_node(exportXML,'postalCode',staffRec.address_zip))
						staffItemElem.appendChild(XML_text_node(exportXML,'bankAccount',staffRec.bank_account_number))
						staffItemElem.appendChild(XML_text_node(exportXML,'bankAccountType',staffRec.bank_account_type))
						staffItemElem.appendChild(XML_text_node(exportXML,'bankDeduction',staffRec.bank_deduction))
						staffItemElem.appendChild(XML_text_node(exportXML,'bankDeductionCode',staffRec.bank_deduction_code))
						staffItemElem.appendChild(XML_text_node(exportXML,'bankDepositTransit',staffRec.bank_deposit_transit))
						staffItemElem.appendChild(XML_text_node(exportXML,'bankDeposit',staffRec.bank_full_deposit))
						staffItemElem.appendChild(XML_text_node(exportXML,'percent401k',staffRec.benefit_401k_percent))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateBirth',staffRec.date_birth))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateCompPlan',staffRec.date_compplan_begin))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateHire',staffRec.date_hire))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateLeave',staffRec.date_leave))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateTerminated',staffRec.date_termination))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateVacation',staffRec.date_vacation))
						staffItemElem.appendChild(XML_text_node(exportXML,'email',staffRec.email))
						staffItemElem.appendChild(XML_text_node(exportXML,'fedExemptions',staffRec.federal_exemptions))
						staffItemElem.appendChild(XML_text_node(exportXML,'fedExtra',staffRec.federal_extra))
						staffItemElem.appendChild(XML_text_node(exportXML,'fedExtraPercent',staffRec.federal_extra_percent))
						staffItemElem.appendChild(XML_text_node(exportXML,'fedTaxBlockd',staffRec.federal_tax_block))
						staffItemElem.appendChild(XML_text_node(exportXML,'flag401k',staffRec.flag_401k))
						staffItemElem.appendChild(XML_text_node(exportXML,'flagActive',staffRec.flag_active))
						staffItemElem.appendChild(XML_text_node(exportXML,'flagHealthPlan',staffRec.flag_health_plan))
						staffItemElem.appendChild(XML_text_node(exportXML,'flagW4',staffRec.flag_w4))
						staffItemElem.appendChild(XML_text_node(exportXML,'gender',staffRec.gender))
						staffItemElem.appendChild(XML_text_node(exportXML,'listName',staffRec.list_name))
						staffItemElem.appendChild(XML_text_node(exportXML,'nameFirst',staffRec.name_first))
						staffItemElem.appendChild(XML_text_node(exportXML,'nameLast',staffRec.name_last))
						staffItemElem.appendChild(XML_text_node(exportXML,'nameMiddle',staffRec.name_middle))
						staffItemElem.appendChild(XML_text_node(exportXML,'namePrefix',staffRec.name_prefix))
						staffItemElem.appendChild(XML_text_node(exportXML,'nameSuffix',staffRec.name_suffix))
						staffItemElem.appendChild(XML_text_node(exportXML,'paycheckType',staffRec.paycheck_type))
						staffItemElem.appendChild(XML_text_node(exportXML,'payRate',staffRec.payrate_hourly))
						staffItemElem.appendChild(XML_text_node(exportXML,'phoneHome',staffRec.phone_home))
						staffItemElem.appendChild(XML_text_node(exportXML,'phoneMobile',staffRec.phone_mobile))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateCreated',staffRec.rec_created))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateModified',staffRec.rec_modified))
						staffItemElem.appendChild(XML_text_node(exportXML,'ssn',staffRec.social_security_number))
						staffItemElem.appendChild(XML_text_node(exportXML,'medicarTaxBlock',staffRec.ss_medicare_tax_block))
						staffItemElem.appendChild(XML_text_node(exportXML,'stateExemptions',staffRec.state_exemptions))
						staffItemElem.appendChild(XML_text_node(exportXML,'stateTaxBlock',staffRec.state_tax_block))
						staffItemElem.appendChild(XML_text_node(exportXML,'stateTaxExtra',staffRec.state_tax_extra))
						staffItemElem.appendChild(XML_text_node(exportXML,'stateTaxExtraPercent',staffRec.state_tax_extra_percent))
						staffItemElem.appendChild(XML_text_node(exportXML,'stateWorked',staffRec.state_worked))
						staffItemElem.appendChild(XML_text_node(exportXML,'typeStaff',staffRec.type_staff))
					}
				}
			}
			
			
		//create filters
			
			//update with what doing
			globals.CALLBACK_progressbar_set(null,'Adding filters...')
			
			var fsFilters = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_filter')
			fsFilters.loadAllRecords()
			
			//loop through all filters
			for (var i = 1; i <= fsFilters.getSize(); i++) {
				var record = fsFilters.getRecord(i)
				
				//create xml definition for this action
				var accessFiltersItemElem = exportXML.createElement('filter')
				accessFiltersElem.appendChild(accessFiltersItemElem)
				
				accessFiltersItemElem.setAttribute('id',record.filter_uuid)
				accessFiltersItemElem.setIdAttribute('id',true)
				
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'filterID',record.id_filter))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'dbServer',record.filter_database))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'table',record.filter_table))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'column',record.filter_field))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'enabled',record.filter_on))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'comparison',record.filter_operator))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'type',record.filter_type))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'value',record.filter_value))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'valueType',record.filter_value_type))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'groupID',record.id_group))
			}
			
		//create actions registry
			
			//update with what doing
			globals.CALLBACK_progressbar_set(null,'Adding actions registry...')
			
			var actionsRegistry = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_action')
			actionsRegistry.loadAllRecords()
			
			//loop through all actions
			for (var i = 1; i <= actionsRegistry.getSize(); i++) {
				var record = actionsRegistry.getRecord(i)
				
				//create xml definition for this action
				var actionsRegistryItemElem = exportXML.createElement('action')
				actionRegistryElem.appendChild(actionsRegistryItemElem)
				
				actionsRegistryItemElem.setAttribute('id',record.action_uuid)
				actionsRegistryItemElem.setIdAttribute('id',true)
				
				actionsRegistryItemElem.appendChild(XML_text_node(exportXML,'actionID',record.action_id))
				actionsRegistryItemElem.appendChild(XML_text_node(exportXML,'name',record.action_name))
				actionsRegistryItemElem.appendChild(XML_text_node(exportXML,'description',record.description))
			}
			
			
		//create password rules
			
			//update with what doing
			globals.CALLBACK_progressbar_set(null,'Adding password rules...')
			
			var passRules = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_rules')
			passRules.loadAllRecords()
			
			passwordRulesElem.appendChild(XML_text_node(exportXML,'requireUpplerLower',passRules.alpha_case_flag))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'requireAlphaNum',passRules.alphnum_flag))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'expireDays',passRules.expire_days))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'requireExpire',passRules.expire_flag))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'requireIdleKick',passRules.idle_flag))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'idleKickTime',passRules.idle_time))
			
			var passLengthElem = exportXML.createElement('length')
				passwordRulesElem.appendChild(passLengthElem)
				passLengthElem.appendChild(XML_text_node(exportXML,'requireLength',passRules.length_flag))
				passLengthElem.appendChild(XML_text_node(exportXML,'maxChars',passRules.length_max))
				passLengthElem.appendChild(XML_text_node(exportXML,'minChars',passRules.length_min))
			
			passwordRulesElem.appendChild(XML_text_node(exportXML,'requireNonAlpha',passRules.non_alphanum_flag))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'notUserName',passRules.not_user_name))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'previousPasswords',passRules.prev_match_count))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'notMatchPrevious',passRules.prev_match_flag))
			
			//advance progressbar updater to the next section
			currentArea++
		}
		
		
		
		//Blogs node
		//
		//
		if (blog) {
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
			//update with what doing
			globals.CALLBACK_progressbar_set(startPosn,'Adding blogs...')
			
			var blogElem = exportXML.createElement('blogs')
			rootElem.appendChild(blogElem)
			
			//get blog foundset
			var fsBlogs = databaseManager.getFoundSet(controller.getServerName(),'sutra_blog')
			fsBlogs.loadAllRecords()
			
			if (utils.hasRecords(fsBlogs)) {
				var numAreaSize = (endPosn - startPosn) / fsBlogs.getSize()
				
				//loop through all blogs
				for (var i = 1; i <= fsBlogs.getSize(); i++) {
					//update with what doing
					globals.CALLBACK_progressbar_set(startPosn + numAreaSize * (i - 1) / 2)
				
					var record = fsBlogs.getRecord(i)
					
					//create xml definition for this blog
					var blogItemElem = exportXML.createElement('blog')
					blogElem.appendChild(blogItemElem)
					
					//punch down uuid if this blog doesn't have one
					if (record.blog_uuid) {
						var blogUUID = record.blog_uuid
					}
					//use uuid for this toolbar
					else {
						var blogUUID = record.blog_uuid = application.getNewUUID()
					}
					
					blogItemElem.setAttribute('id',blogUUID)
					blogItemElem.setIdAttribute('id',true)
					
					blogItemElem.appendChild(XML_text_node(exportXML,'blogID',record.id_blog))
					blogItemElem.appendChild(XML_text_node(exportXML,'hideAuthor',record.blog_author_hide))
					blogItemElem.appendChild(XML_text_node(exportXML,'banner',record.blog_banner))
					blogItemElem.appendChild(XML_text_node(exportXML,'hideDate',record.blog_date_hide))
					blogItemElem.appendChild(XML_text_node(exportXML,'staticEntry',record.blog_fixed))
					blogItemElem.appendChild(XML_text_node(exportXML,'useStatic',record.blog_fixed_always))
					blogItemElem.appendChild(XML_text_node(exportXML,'footer',record.blog_footer))
					blogItemElem.appendChild(XML_text_node(exportXML,'header',record.blog_header))
					blogItemElem.appendChild(XML_text_node(exportXML,'misc',record.blog_misc))
					blogItemElem.appendChild(XML_text_node(exportXML,'name',record.blog_name))
					blogItemElem.appendChild(XML_text_node(exportXML,'displayPosts',record.blog_posts))
					blogItemElem.appendChild(XML_text_node(exportXML,'visible',record.blog_visible))
					blogItemElem.appendChild(XML_text_node(exportXML,'autoQuote',record.quote_auto))
					blogItemElem.appendChild(XML_text_node(exportXML,'dateCreated',record.rec_created))
					blogItemElem.appendChild(XML_text_node(exportXML,'dateModified',record.rec_modified))
					
					//blog entries
					if (utils.hasRecords(record[relnBlogEntry])) {
						//record[relnBlogEntry].sort('blog_posted desc')
						
						//container for posts
						var blogEntriesElem = exportXML.createElement('entries')
						blogItemElem.appendChild(blogEntriesElem)
						
						//loop through all blog entries
						for (var j = 1; j <= record[relnBlogEntry].getSize(); j++) {
							var blogEntry = record[relnBlogEntry].getRecord(j)
							
							//create xml definition for this blog post
							var blogEntryElem = exportXML.createElement('post')
							blogEntriesElem.appendChild(blogEntryElem)
							
							blogEntryElem.setAttribute('id',application.getNewUUID())
							blogEntryElem.setIdAttribute('id',true)
							
							blogEntryElem.appendChild(XML_text_node(exportXML,'blogEntryID',blogEntry.id_blog_entry))
							blogEntryElem.appendChild(XML_text_node(exportXML,'message',blogEntry.blog_message))
							blogEntryElem.appendChild(XML_text_node(exportXML,'datePosted',blogEntry.blog_posted))
							blogEntryElem.appendChild(XML_text_node(exportXML,'title',blogEntry.blog_title))
							blogEntryElem.appendChild(XML_text_node(exportXML,'visible',blogEntry.blog_visible))
							blogEntryElem.appendChild(XML_text_node(exportXML,'blogID',blogEntry.id_blog))
							blogEntryElem.appendChild(XML_text_node(exportXML,'groupID',blogEntry.id_group))
							blogEntryElem.appendChild(XML_text_node(exportXML,'userID',blogEntry.id_user))
							blogEntryElem.appendChild(XML_text_node(exportXML,'dateCreated',blogEntry.rec_created))
							blogEntryElem.appendChild(XML_text_node(exportXML,'dateModified',blogEntry.rec_modified))
						}
					}
					
					//qotd for this blog
					if (utils.hasRecords(record[relnBlogQuote])) {
						//record[relnBlogQuote].sort('date_display desc')
						
						//container for quotes
						var blogQuotesElem = exportXML.createElement('quotes')
						blogItemElem.appendChild(blogQuotesElem)
						
						//loop through all blog entries
						for (var j = 1; j <= record[relnBlogQuote].getSize(); j++) {
							var qotdRecord = record[relnBlogQuote].getRecord(j)
							
							//create xml definition for this quote
							var blogQuoteElem = exportXML.createElement('quote')
							blogQuotesElem.appendChild(blogQuoteElem)
							
							//punch down uuid if this qotd doesn't have one
							if (qotdRecord.quote_uuid) {
								var quoteUUID = qotdRecord.quote_uuid
							}
							//use uuid for this set
							else {
								var quoteUUID = qotdRecord.quote_uuid = application.getNewUUID()
							}
							
							blogQuoteElem.setAttribute('id',quoteUUID)
							blogQuoteElem.setIdAttribute('id',true)
							
							blogQuoteElem.appendChild(XML_text_node(exportXML,'dateCreated',qotdRecord.date_created))
							blogQuoteElem.appendChild(XML_text_node(exportXML,'dateModified',qotdRecord.date_modified))
							blogQuoteElem.appendChild(XML_text_node(exportXML,'dateDisplay',qotdRecord.date_display))
							blogQuoteElem.appendChild(XML_text_node(exportXML,'quote',qotdRecord.quote))
							blogQuoteElem.appendChild(XML_text_node(exportXML,'active',qotdRecord.quote_active))
							blogQuoteElem.appendChild(XML_text_node(exportXML,'author',qotdRecord.quote_author))
							blogQuoteElem.appendChild(XML_text_node(exportXML,'default',qotdRecord.quote_default))
						}
					}
				}
			}
			currentArea++
		}	
		
		
			
		//Navigation engine node
		//
		//
		if (navEngine) {
			
			globals.CALLBACK_progressbar_set(null,'Adding frameworks engine...')
			
				/*
				//	removed for ver1
				
							//no arguments passed, prompt to choose navigation sets to export
							if (!navIDs) {
								forms.NAV_P_navigation.elements.fld_what.visible = false
								forms.NAV_P_navigation.elements.fld_export_navset.visible = true
								forms.NAV_P_navigation.elements.fld_import_navset.visible = false
								forms.NAV_P_navigation.elements.fld_export_access.visible = false
								forms.NAV_P_navigation.elements.fld_import_access.visible = false
								forms.NAV_P_navigation.elements.lbl_header.text = 'Select navigation sets to export'
								application.showFormInDialog(forms.NAV_P_navigation,-1,-1,-1,-1,'Export',false,false,'fwImportExport')
								
								if (globals.NAV_export_navset) {
									navIDs = globals.NAV_export_navset.split('\n')
									globals.NAV_export_navset = null
								}
								else {
									navIDs = new Array()
								}
								
								//remove value if it is blank
								for (var m = 0; m < navIDs.length; m++) {
									if (!navIDs[m]) {
										navIDs.splice(m,1)
									}
								}
							}
							
							//sets are selected to be exported
							if (navIDs && navIDs.length && application.__parent__.solutionPrefs) {
				
				//	end removal
				*/
			
			
			//no arguments passed, prompt to choose navigation sets to export
			if (!navIDs) {
				forms.NAV_P_navigation.elements.fld_what.visible = false
				forms.NAV_P_navigation.elements.fld_export_navset.visible = true
				forms.NAV_P_navigation.elements.fld_import_navset.visible = false
				forms.NAV_P_navigation.elements.fld_export_access.visible = false
				forms.NAV_P_navigation.elements.fld_import_access.visible = false
				forms.NAV_P_navigation.elements.lbl_header.text = 'Select navigation sets to export'
				application.showFormInDialog(forms.NAV_P_navigation,-1,-1,-1,-1,'Export',false,false,'fwImportExport')
				
				if (globals.NAV_export_navset) {
					navIDs = globals.NAV_export_navset.split('\n')
					globals.NAV_export_navset = null
				}
				else {
					navIDs = new Array()
				}
				
				//remove value if it is blank
				for (var m = 0; m < navIDs.length; m++) {
					if (!navIDs[m]) {
						navIDs.splice(m,1)
					}
				}
			}
			
			/*
			//all navigations sets
			navIDs = application.getValueListItems('NAV_export_navsets').getColumnAsArray(2)
			*/
			
			//sets are selected to be exported
			if (navIDs && navIDs.length && application.__parent__.solutionPrefs) {
					
				//Navigation engine node
				//
				//
				var navEngineElem = exportXML.createElement('frameworksEngine')
				rootElem.appendChild(navEngineElem)
				
				//convert array to dataset
				var dataset = databaseManager.convertToDataSet(navIDs)
				
				//load dataset into navigation foundset
				var navSets = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation')
				navSets.clear()
				navSets.loadRecords(dataset)
				
				//start/end positions for progressbar
				var startPosn = sizeArea * (currentArea - 1)
				var endPosn = sizeArea * (currentArea + 9)
				
				//progress updater
				numAreaSize = (endPosn - startPosn) / navSets.getSize()
				
				//loop through selected navigation sets, export data
				for (var h = 1; h <= navSets.getSize(); h++) {		
					//get navset to be operated on
					var navigationSet = navSets.getRecord(h)
					
					//progress updater: check that all the way filled up to here
					globals.CALLBACK_progressbar_set(startPosn + numAreaSize * (h - 1),'Navigation set: ' + navigationSet.nav_name)
					
					//create xml definition for this navigation set
					
					var navSetElem = exportXML.createElement('navigationSet')
					navEngineElem.appendChild(navSetElem)
					
					//punch down uuid if this set doesn't have one
					if (navigationSet.nav_uuid) {
						var navSetUUID = navigationSet.nav_uuid
					}
					//use uuid for this set
					else {
						var navSetUUID = navigationSet.nav_uuid = application.getNewUUID()
					}
					
					navSetElem.setAttribute('id',navSetUUID)
					navSetElem.setIdAttribute('id',true)
					
					navSetElem.appendChild(XML_text_node(exportXML,'navigationID',navigationSet.id_navigation))
					navSetElem.appendChild(XML_text_node(exportXML,'navUUID',navigationSet.nav_uuid))
					navSetElem.appendChild(XML_text_node(exportXML,'name',navigationSet.nav_name))
					navSetElem.appendChild(XML_text_node(exportXML,'status',navigationSet.nav_status))
					navSetElem.appendChild(XML_text_node(exportXML,'description',navigationSet.nav_description))
					navSetElem.appendChild(XML_text_node(exportXML,'default',navigationSet.nav_default))
					navSetElem.appendChild(XML_text_node(exportXML,'flagConfig',navigationSet.flag_config))
					
					//check that relation valid
					if (navigationSet[relnNav] && navigationSet[relnNav].getSize()) {
						//sort
						navigationSet[relnNav].sort('node_1 asc, node_2 asc')
						
						//create xml definition for navigationItems
						var allNavItemsElem = exportXML.createElement('navigationItems')
						navSetElem.appendChild(allNavItemsElem)
						
						//progress updater
						numItemSize = numAreaSize / navigationSet[relnNav].getSize()
						var itemTenth = 1 / 10
						
						//loop through selected navigation items, export data
						for (var i = 1; i <= navigationSet[relnNav].getSize(); i++) {
							//get nav item being worked on
							var navigationItem = navigationSet[relnNav].getRecord(i)
							
							//progres updater size updated at most every 10 percent of navigation set
							if ((i / navigationSet[relnNav].getSize()) > itemTenth) {
								globals.CALLBACK_progressbar_set(startPosn + Math.floor(Math.floor(numAreaSize * (h - 1) + numItemSize * i)))
								itemTenth = Math.floor(10 * (i / navigationSet[relnNav].getSize())) / 10
							}
							
							//create xml definition for this navItem
							
							var navItemElem = exportXML.createElement('navigationItem')
							allNavItemsElem.appendChild(navItemElem)
							
							navItemElem.setAttribute('id',application.getNewUUID())
							navItemElem.setIdAttribute('id',true)
							
							navItemElem.appendChild(XML_text_node(exportXML,'navigationID',navigationItem.id_navigation))
							navItemElem.appendChild(XML_text_node(exportXML,'navigationItemID',navigationItem.id_navigation_item))
							navItemElem.appendChild(XML_text_node(exportXML,'configType',navigationItem.config_type))
							navItemElem.appendChild(XML_text_node(exportXML,'itemName',navigationItem.item_name))
							navItemElem.appendChild(XML_text_node(exportXML,'itemID',navigationItem.item_id))
							navItemElem.appendChild(XML_text_node(exportXML,'moduleFilter',navigationItem.module_filter))
							navItemElem.appendChild(XML_text_node(exportXML,'formLoad',navigationItem.form_to_load))
							navItemElem.appendChild(XML_text_node(exportXML,'listLoad',navigationItem.list_to_load))
							navItemElem.appendChild(XML_text_node(exportXML,'formLoadTable',navigationItem.form_to_load_table))
							navItemElem.appendChild(XML_text_node(exportXML,'description',navigationItem.description))
							navItemElem.appendChild(XML_text_node(exportXML,'nodeOne',navigationItem.node_1))
							navItemElem.appendChild(XML_text_node(exportXML,'nodeTwo',navigationItem.node_2))
							navItemElem.appendChild(XML_text_node(exportXML,'rowStatus',navigationItem.row_status_show))
							navItemElem.appendChild(XML_text_node(exportXML,'rowNodeExpanded',navigationItem.row_status_expanded))
							navItemElem.appendChild(XML_text_node(exportXML,'useUL',navigationItem.use_fw_list))
							navItemElem.appendChild(XML_text_node(exportXML,'titleUL',navigationItem.fw_list_title))
							navItemElem.appendChild(XML_text_node(exportXML,'sortString',navigationItem.sort_string))
							
							navItemElem.appendChild(XML_text_node(exportXML,'statusInitialForm',navigationItem.initial_form))
							navItemElem.appendChild(XML_text_node(exportXML,'statusInitialFormLabel',navigationItem.initial_form_label))
							navItemElem.appendChild(XML_text_node(exportXML,'statusInitialRecord',navigationItem.initial_record))
							navItemElem.appendChild(XML_text_node(exportXML,'statusInitialRecordLabel',navigationItem.initial_record_label))
							navItemElem.appendChild(XML_text_node(exportXML,'busyCursor',navigationItem.ul_busy_cursor))
							navItemElem.appendChild(XML_text_node(exportXML,'spaces',navigationItem.space_available))
							navItemElem.appendChild(XML_text_node(exportXML,'spaceDefault',navigationItem.space_default))
							navItemElem.appendChild(XML_text_node(exportXML,'spaceFlip',navigationItem.space_flip))
							navItemElem.appendChild(XML_text_node(exportXML,'spaceChangeMethod',navigationItem.space_method))
							
							navItemElem.appendChild(XML_text_node(exportXML,'actionULAdd',navigationItem.bar_item_add))
							navItemElem.appendChild(XML_text_node(exportXML,'actionULAction',navigationItem.bar_item_action))
							navItemElem.appendChild(XML_text_node(exportXML,'actionULFilter',navigationItem.bar_item_filter))
							navItemElem.appendChild(XML_text_node(exportXML,'actionULPrint',navigationItem.bar_item_report))
							navItemElem.appendChild(XML_text_node(exportXML,'actionULTab',navigationItem.bar_item_tab))
							
							//create xml definition for help
							var navHelpElem = exportXML.createElement('help')
							navItemElem.appendChild(navHelpElem)
							
							navHelpElem.appendChild(XML_text_node(exportXML,'enabled',navigationItem.help_available))
							navHelpElem.appendChild(XML_text_node(exportXML,'moduleFilter',navigationItem.help_module_filter))
							navHelpElem.appendChild(XML_text_node(exportXML,'formLoad',navigationItem.help_form_to_load))
							navHelpElem.appendChild(XML_text_node(exportXML,'listLoad',navigationItem.help_list_to_load))
							navHelpElem.appendChild(XML_text_node(exportXML,'description',navigationItem.help_description))
							navHelpElem.appendChild(XML_text_node(exportXML,'textColor',navigationItem.help_color_text))
							navHelpElem.appendChild(XML_text_node(exportXML,'textBackground',navigationItem.help_color_background))
							
							//create xml definition for developer notes
							var navDevNotesElem = exportXML.createElement('developerNotes')
							navItemElem.appendChild(navDevNotesElem)
							
							navDevNotesElem.appendChild(XML_text_node(exportXML,'specification',(navigationItem[relnNavDevSpec]) ? navigationItem[relnNavDevSpec].notes : ''))
							navDevNotesElem.appendChild(XML_text_node(exportXML,'task',(navigationItem[relnNavDevTask]) ? navigationItem[relnNavDevTask].notes : ''))
							
							
							//create xml definition for columnInfo
							var allColumnsElem = exportXML.createElement('columnInfo')
							navItemElem.appendChild(allColumnsElem)
							
							//copy all columns over
							for (var j = 1; j <= navigationItem[relnNavColumn].getSize() ; j++) {
								var record = navigationItem[relnNavColumn].getRecord(j)
								
								//create xml definition for this column
								
								var columnElem = exportXML.createElement('column')
								allColumnsElem.appendChild(columnElem)
								
								columnElem.setAttribute('id',application.getNewUUID())
								columnElem.setIdAttribute('id',true)
								
								columnElem.appendChild(XML_text_node(exportXML,'columnID',record.id_column))
								columnElem.appendChild(XML_text_node(exportXML,'navigationItemID',record.id_navigation_item))
								columnElem.appendChild(XML_text_node(exportXML,'statusRelation',record.status_relation))
								columnElem.appendChild(XML_text_node(exportXML,'tableOrRelation',record.table_or_relation))
								columnElem.appendChild(XML_text_node(exportXML,'columnName',record.name_column))
								columnElem.appendChild(XML_text_node(exportXML,'columnType',record.type_column))
								columnElem.appendChild(XML_text_node(exportXML,'prettyName',record.name_display))
								columnElem.appendChild(XML_text_node(exportXML,'statusFind',record.status_find))
								columnElem.appendChild(XML_text_node(exportXML,'statusNamed',record.status_named))
								columnElem.appendChild(XML_text_node(exportXML,'valueList',record.valuelist))
							}
							
							//create xml definition for universal list
							var universalListElem = exportXML.createElement('universalList')
							navItemElem.appendChild(universalListElem)
							
							if (utils.hasRecords(navigationItem[relnNavDisplay])) {
								//create xml container for displays
								var displayContainerElem = exportXML.createElement('displays')
								universalListElem.appendChild(displayContainerElem)
								
								navigationItem[relnNavDisplay].sort('row_order asc')
								
								//loop through selected UL displays, export data
								for (var j = 1; j <= navigationItem[relnNavDisplay].getSize() ; j++) {
									var displayItem = navigationItem[relnNavDisplay].getRecord(j)
									
									//create xml definition for this display
									var displayElem = exportXML.createElement('display')
									displayContainerElem.appendChild(displayElem)
									
									displayElem.setAttribute('id',application.getNewUUID())
									displayElem.setIdAttribute('id',true)
									
									displayElem.appendChild(XML_text_node(exportXML,'navigationItemID',displayItem.id_navigation_item))
									displayElem.appendChild(XML_text_node(exportXML,'listDisplayID',displayItem.id_list_display))
									displayElem.appendChild(XML_text_node(exportXML,'ulTitleOverride',displayItem.list_title))
									displayElem.appendChild(XML_text_node(exportXML,'defaultDisplay',displayItem.display_default))
									displayElem.appendChild(XML_text_node(exportXML,'rowOrder',displayItem.row_order))
									
									//create xml definition for configuration
									var displayConfigElem = exportXML.createElement('displayConfig')
									displayElem.appendChild(displayConfigElem)
									
									//display items
									if (displayItem[relnNavDisplayItem] && displayItem[relnNavDisplayItem].getSize()) {
										displayItem[relnNavDisplayItem].sort('row_order asc')
										
										//loop through selected UL display items, export data
										for (var k = 1; k <= displayItem[relnNavDisplayItem].getSize() ; k++) {
											var record = displayItem[relnNavDisplayItem].getRecord(k)
											
											//create xml definition for this display item
											var displayItemElem = exportXML.createElement('displayItem')
											displayConfigElem.appendChild(displayItemElem)
											
											displayItemElem.setAttribute('id',application.getNewUUID())
											displayItemElem.setIdAttribute('id',true)
											
											displayItemElem.appendChild(XML_text_node(exportXML,'listDisplayID',record.id_list_display))
											displayItemElem.appendChild(XML_text_node(exportXML,'listDisplayItemID',record.id_list_display_item))
											displayItemElem.appendChild(XML_text_node(exportXML,'rowOrder',record.row_order))
											displayItemElem.appendChild(XML_text_node(exportXML,'renderValue',record.display))
											displayItemElem.appendChild(XML_text_node(exportXML,'header',record.header))
											displayItemElem.appendChild(XML_text_node(exportXML,'sortBy',record.field_name))
											displayItemElem.appendChild(XML_text_node(exportXML,'width',record.display_width_percent))
											displayItemElem.appendChild(XML_text_node(exportXML,'align',record.display_align))
											var formatElem = exportXML.createElement('format')
											displayItemElem.appendChild(formatElem)
											formatElem.appendChild(XML_text_node(exportXML,'type',record.display_format))
											formatElem.appendChild(XML_text_node(exportXML,'mask',record.format_mask))
										}
									}
									
								}
							}
							
							
							//sort to make sure that sub levels of filters are 'in order'
							if (navigationItem[relnNavAction].getSize()) {
								navigationItem[relnNavAction].sort('category asc, id_action_item_parent asc, order_by asc')
							}
							
							var filterLevels = new Object()
							var actionCategory = 'Chewbacca Defense'
							var filterPrefix = new Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z')
							var filterSortA = 0
							var filterSortB = 0
							
							//container for buttons
							var buttonElem = exportXML.createElement('buttons')
							navItemElem.appendChild(buttonElem)
														
							//loop through selected actions, export data
							for (var j = 1; j <= navigationItem[relnNavAction].getSize() ; j++) {
								var record = navigationItem[relnNavAction].getRecord(j)
								
								if (record.category != actionCategory) {
									actionCategory = record.category
									
									//create xml definition container for this category
									switch (actionCategory) {
										case 'Add':
											break
										case 'Actions':
											var actionElem = exportXML.createElement('actions')
											buttonElem.appendChild(actionElem)
											break
										case 'Filters':
											var filterElem = exportXML.createElement('filters')
											buttonElem.appendChild(filterElem)
											break
										case 'Reports':
											var reportElem = exportXML.createElement('reports')
											buttonElem.appendChild(reportElem)
											break
										case 'Tabs':
											var tabElem = exportXML.createElement('tabs')
											buttonElem.appendChild(tabElem)
											break
									}
								}
								
								if (actionCategory == 'Add') {
									//create xml definition for this action item
									var addElem = exportXML.createElement('add')
									buttonElem.appendChild(addElem)
									
									addElem.appendChild(XML_text_node(exportXML,'menuName',record.menu_name))
									addElem.appendChild(XML_text_node(exportXML,'methodType',record.method_type))
									addElem.appendChild(XML_text_node(exportXML,'method',record.method))
									addElem.appendChild(XML_text_node(exportXML,'displayMethod',record.method_from_form))
									addElem.appendChild(XML_text_node(exportXML,'displayCustom',record.method_from_custom))
								}
								
								else if (actionCategory == 'Actions') {
									//create xml definition for this action item
									var actionItemElem = exportXML.createElement('action')
									actionElem.appendChild(actionItemElem)
									
									actionItemElem.setAttribute('id',application.getNewUUID())
									actionItemElem.setIdAttribute('id',true)
									
									actionItemElem.appendChild(XML_text_node(exportXML,'menuName',record.menu_name))
									actionItemElem.appendChild(XML_text_node(exportXML,'methodType',record.method_type))
									actionItemElem.appendChild(XML_text_node(exportXML,'method',record.method))
									actionItemElem.appendChild(XML_text_node(exportXML,'displayMethod',record.method_from_form))
									actionItemElem.appendChild(XML_text_node(exportXML,'displayCustom',record.method_from_custom))
									actionItemElem.appendChild(XML_text_node(exportXML,'order',record.order_by))
								}
								
								else if (actionCategory == 'Filters') {
									//keep track of uuid of filter item
									if (filterSortB == 26) {
										filterSortA++
										filterSortB = 0
									}
									var filterUUID = filterPrefix[filterSortA] + filterPrefix[filterSortB++] + '-' + application.getNewUUID()
									filterLevels[record.id_action_item] = filterUUID
									
									//create xml definition for this action item
									var filterItemElem = exportXML.createElement('filter')
									filterElem.appendChild(filterItemElem)
									
									filterItemElem.setAttribute('id',filterUUID)
									filterItemElem.setIdAttribute('id',true)
									
									filterItemElem.appendChild(XML_text_node(exportXML,'menuName',record.menu_name))
									filterItemElem.appendChild(XML_text_node(exportXML,'order',record.order_by))
									filterItemElem.appendChild(XML_text_node(exportXML,'sort',record.filter_sort))
									filterItemElem.appendChild(XML_text_node(exportXML,'limit',record.filter_limit))
									filterItemElem.appendChild(XML_text_node(exportXML,'method',record.filter_method))
									filterItemElem.appendChild(XML_text_node(exportXML,'subFilterType',record.filter_type))
									
									//if sub level, update with value of new filter
									if (record.id_action_item_parent) {
										filterItemElem.appendChild(XML_text_node(exportXML,'parentElement',filterLevels[record.id_action_item_parent]))
									}
									else {
										filterItemElem.appendChild(XML_text_node(exportXML,'parentElement',0))
									}
									
									//get selected index for relation to work
									var filterItem = navigationItem[relnNavAction].getRecord(j)
									
									//create filter specification if exists
									if (filterItem[relnNavActionFilter] && filterItem[relnNavActionFilter].getSize()) {
										var filterConfigElem = exportXML.createElement('filterConfig')
										filterItemElem.appendChild(filterConfigElem)
										
										//loop through selected filter specificiations, export data
										for (var k = 1; k <= filterItem[relnNavActionFilter].getSize() ; k++) {
											var record = filterItem[relnNavActionFilter].getRecord(k)
											
											//create xml definition for this filter specification
											var filterConfigItemElem = exportXML.createElement('filterItem')
											filterConfigElem.appendChild(filterConfigItemElem)
											
											filterConfigItemElem.setAttribute('id',application.getNewUUID())
											filterConfigItemElem.setIdAttribute('id',true)
											
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'filterType',record.filter_type))
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'method',record.method_name))
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'relation',record.column_relation))
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'columnName',record.column_name))
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'columnOperator',record.column_operator))
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'columnValue',record.column_value))
											
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'valuelist',record.valuelist))
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'valuelistType',record.valuelist_type))
										}
									}
								}
								
								else if (actionCategory == 'Reports') {
									//create xml definition for this action item
									var reportItemElem = exportXML.createElement('print')
									reportElem.appendChild(reportItemElem)
									
									reportItemElem.setAttribute('id',application.getNewUUID())
									reportItemElem.setIdAttribute('id',true)
									
									reportItemElem.appendChild(XML_text_node(exportXML,'menuName',record.menu_name))
									reportItemElem.appendChild(XML_text_node(exportXML,'order',record.order_by))
									reportItemElem.appendChild(XML_text_node(exportXML,'reportID',record.id_report))
									
								}
								
								else if (actionCategory == 'Tabs') {
									//create xml definition for this action item
									var tabItemElem = exportXML.createElement('tab')
									tabElem.appendChild(tabItemElem)
									
									tabItemElem.setAttribute('id',application.getNewUUID())
									tabItemElem.setIdAttribute('id',true)
									
									tabItemElem.appendChild(XML_text_node(exportXML,'menuName',record.menu_name))
									tabItemElem.appendChild(XML_text_node(exportXML,'order',record.order_by))
									tabItemElem.appendChild(XML_text_node(exportXML,'formLoad',record.form_to_load))
									
								}
							}
						}
					}
				}
			}
			//advance progressbar updater to the next section
			currentArea += 9
		}
		//no sets
		else {
		//	plugins.dialogs.showErrorDialog('No export','No navigation sets were selected for export')
			
			//advance progressbar updater to the next section
			currentArea += 9
		}
		
	//TODO: numbers not adding up here
		//plugins.dialogs.showInfoDialog('Hello','This is the value' + globals.CALLBACK_progressbar_get()[0])
		
		//Reports node
		//
		//
		if (reportRegistry) {
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
	//TODO: numbers not adding up here
		//plugins.dialogs.showInfoDialog('Hello','This is the value' + startPosn + ', ' + endPosn)
			
			//update with what doing
			globals.CALLBACK_progressbar_set(startPosn + (startPosn / endPosn) / 2,'Adding report registry...')
			
			var reportElem = exportXML.createElement('reportRegistry')
			rootElem.appendChild(reportElem)
			
			//get report foundset
			var fsReports = databaseManager.getFoundSet(controller.getServerName(),'sutra_report')
			fsReports.loadAllRecords()
			
			//loop through all reports
			for (var i = 1; i <= fsReports.getSize(); i++) {
				var record = fsReports.getRecord(i)
				
				//create xml definition for this action
				var reportItemElem = exportXML.createElement('report')
				reportElem.appendChild(reportItemElem)
				
				//punch down uuid if this report doesn't have one
				if (record.report_uuid) {
					var reportUUID = record.report_uuid
				}
				//use uuid for this toolbar
				else {
					var reportUUID = record.report_uuid = application.getNewUUID()
				}
				
				reportItemElem.setAttribute('id',reportUUID)
				reportItemElem.setIdAttribute('id',true)
				
				reportItemElem.appendChild(XML_text_node(exportXML,'reportID',record.id_report))
				reportItemElem.appendChild(XML_text_node(exportXML,'description',record.report_description))
				reportItemElem.appendChild(XML_text_node(exportXML,'form',record.report_form))
				reportItemElem.appendChild(XML_text_node(exportXML,'method',record.report_method))
				reportItemElem.appendChild(XML_text_node(exportXML,'module',record.report_module))
				reportItemElem.appendChild(XML_text_node(exportXML,'dateCreated',record.date_created))
				reportItemElem.appendChild(XML_text_node(exportXML,'dateModified',record.date_modified))
			}
			
			currentArea++
		}
		
		
		
		//Solution node
		//
		//
		if (solConfig) {
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
			//go to midway point of solConfig's progress...not much to do here
			globals.CALLBACK_progressbar_set(startPosn + ((endPosn - startPosn) / 2),'Adding solution configuration...')
			
			var fsSolution = databaseManager.getFoundSet(controller.getServerName(),'sutra_solution')
			fsSolution.loadAllRecords()
			
			var solutionElem = exportXML.createElement('solutionDetails')
			rootElem.appendChild(solutionElem)
			
			solutionElem.appendChild(XML_text_node(exportXML,'brandingName',fsSolution.solution_name))
			solutionElem.appendChild(XML_text_node(exportXML,'brandingTagline',fsSolution.solution_tagline))
			solutionElem.appendChild(XML_text_node(exportXML,'brandingIcon',fsSolution.solution_icon))
			solutionElem.appendChild(XML_text_node(exportXML,'brandingIconTooltip',fsSolution.solution_icon_tooltip))
			solutionElem.appendChild(XML_text_node(exportXML,'brandingIconLink',fsSolution.solution_icon_url))
			
			solutionElem.appendChild(XML_text_node(exportXML,'enableBlog',fsSolution.blog_enable))
			solutionElem.appendChild(XML_text_node(exportXML,'showErrorPopup',fsSolution.error_popup))
			solutionElem.appendChild(XML_text_node(exportXML,'navigationCollapse',fsSolution.navigation_collapse_auto))
			solutionElem.appendChild(XML_text_node(exportXML,'licenseEmail',fsSolution.license_email))
			solutionElem.appendChild(XML_text_node(exportXML,'licenseKey',fsSolution.license_key))
			solutionElem.appendChild(XML_text_node(exportXML,'licenseName',fsSolution.license_name))
			solutionElem.appendChild(XML_text_node(exportXML,'disableRepository',fsSolution.repository_api))
			solutionElem.appendChild(XML_text_node(exportXML,'ulMaxRecords',fsSolution.list_maxrecs))
			solutionElem.appendChild(XML_text_node(exportXML,'ulClickDelay',fsSolution.recnav_delay))
			solutionElem.appendChild(XML_text_node(exportXML,'listBackgroundColor',fsSolution.list_color_background))
			
			solutionElem.appendChild(XML_text_node(exportXML,'startupMethod',fsSolution.method_startup))
			solutionElem.appendChild(XML_text_node(exportXML,'logoutMethod',fsSolution.method_logout))
			solutionElem.appendChild(XML_text_node(exportXML,'shutdownMethod',fsSolution.method_shutdown))
			
			solutionElem.appendChild(XML_text_node(exportXML,'findControlChar',fsSolution.find_wildcard))
			solutionElem.appendChild(XML_text_node(exportXML,'findDateFormat',fsSolution.find_dateformat))
			
			solutionElem.appendChild(XML_text_node(exportXML,'loginNone',fsSolution.login_disabled))
			
			solutionElem.appendChild(XML_text_node(exportXML,'kioskFullScreen',fsSolution.kiosk_fullscreen))
			solutionElem.appendChild(XML_text_node(exportXML,'kioskMenu',fsSolution.kiosk_menu))
			solutionElem.appendChild(XML_text_node(exportXML,'kioskStatusBar',fsSolution.kiosk_statusbar))
			solutionElem.appendChild(XML_text_node(exportXML,'kioskToolbar',fsSolution.kiosk_toolbar))
			
			solutionElem.appendChild(XML_text_node(exportXML,'windowCenter',fsSolution.location_center))
			solutionElem.appendChild(XML_text_node(exportXML,'windowX',fsSolution.location_x))
			solutionElem.appendChild(XML_text_node(exportXML,'windowY',fsSolution.location_y))
			solutionElem.appendChild(XML_text_node(exportXML,'windowHeight',fsSolution.screen_height))
			solutionElem.appendChild(XML_text_node(exportXML,'windowWidth',fsSolution.screen_width))
			
			solutionElem.appendChild(XML_text_node(exportXML,'spaceStandardH',fsSolution.space_standard_horizontal))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceStandardV',fsSolution.space_standard_vertical))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceListH',fsSolution.space_list_horizontal))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceVertcialH1',fsSolution.space_vertical_horizontal_1))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceVertcialH2',fsSolution.space_vertical_horizontal_2))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceCenteredH1',fsSolution.space_centered_horizontal_1))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceCenteredH2',fsSolution.space_centered_horizontal_2))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceClassicH',fsSolution.space_classic_horizontal))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceClassicV',fsSolution.space_classic_vertical))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceWideH',fsSolution.space_wide_horizontal))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceWideV',fsSolution.space_wide_vertical))
			
			//advance progressbar updater to the next section
			currentArea++
		}
		
		
		
		//Toolbars node
		//
		//
		if (toolbar) {
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
			//update with what doing
			globals.CALLBACK_progressbar_set(startPosn + (startPosn / endPosn) / 2,'Adding toolbars...')
			
			var toolbarElem = exportXML.createElement('toolbars')
			rootElem.appendChild(toolbarElem)
			
			//get toolbar foundset
			var fsToolbar = databaseManager.getFoundSet(controller.getServerName(),'sutra_toolbar')
			fsToolbar.loadAllRecords()
			
			//loop through all toolbars
			for (var i = 1; i <= fsToolbar.getSize(); i++) {
				var record = fsToolbar.getRecord(i)
				
				//create xml definition for this action
				var toolbarItemElem = exportXML.createElement('toolbar')
				toolbarElem.appendChild(toolbarItemElem)
				
				//punch down uuid if this toolbar doesn't have one
				if (record.toolbar_uuid) {
					var toolbarUUID = record.toolbar_uuid
				}
				//use uuid for this toolbar
				else {
					var toolbarUUID = record.toolbar_uuid = application.getNewUUID()
				}
				
				toolbarItemElem.setAttribute('id',toolbarUUID)
				toolbarItemElem.setIdAttribute('id',true)
				
				toolbarItemElem.appendChild(XML_text_node(exportXML,'toolbarID',record.id_toolbar))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'description',record.description))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'tabName',record.tab_name))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'formName',record.form_name))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'module',record.module_filter))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'popAutoSize',record.pop_down_autosize))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'popFormName',record.pop_down_form))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'popHeight',record.pop_down_height))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'popEnabled',record.pop_down_show))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'popWidth',record.pop_down_width))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'visible',record.row_status_show))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'orderBy',record.row_order))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'dateCreated',record.rec_created))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'dateModified',record.rec_modified))
			}
			
			currentArea++
		}
		
		
		//Tooltip node
		//
		//
		if (tooltip) {
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
			//update with what doing
			globals.CALLBACK_progressbar_set(startPosn + (startPosn / endPosn) / 2,'Adding tooltip registry...')
			
			var tooltipElem = exportXML.createElement('tooltips')
			rootElem.appendChild(tooltipElem)
			
			//get tooltip foundset
			var fsTooltips = databaseManager.getFoundSet(controller.getServerName(),'sutra_tooltip')
			fsTooltips.loadAllRecords()
			
			//loop through all tooltips
			for (var i = 1; i <= fsTooltips.getSize(); i++) {
				var record = fsTooltips.getRecord(i)
				
				//create xml definition for this tooltip
				var tooltipItemElem = exportXML.createElement('tooltip')
				tooltipElem.appendChild(tooltipItemElem)
				
				//punch down uuid if this report doesn't have one
				if (record.tooltip_uuid) {
					var tooltipUUID = record.tooltip_uuid
				}
				//use uuid for this toolbar
				else {
					var tooltipUUID = record.tooltip_uuid = application.getNewUUID()
				}
				
				tooltipItemElem.setAttribute('id',tooltipUUID)
				tooltipItemElem.setIdAttribute('id',true)
				
				tooltipItemElem.appendChild(XML_text_node(exportXML,'tooltipID',record.id_tooltip))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'dateCreated',record.date_created))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'dateModified',record.date_modified))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'element',record.element_name))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'flagHelp',record.flag_help))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'formName',record.form_name))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'language',record.i18n_language))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'help',record.inline_help))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'module',record.module_filter))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'tooltip',record.tooltip))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'useHTML',record.use_html))
			}
			
			currentArea++
		}
		
		
		//Value list node
		//
		//
		if (valuelist) {
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
			//update with what doing
			globals.CALLBACK_progressbar_set(startPosn + (startPosn / endPosn) / 2,'Adding value list registry...')
			
			var valuelistElem = exportXML.createElement('valuelists')
			rootElem.appendChild(valuelistElem)
			
			//get report foundset
			var fsValuelists = databaseManager.getFoundSet(controller.getServerName(),'sutra_valuelist')
			fsValuelists.loadAllRecords()
			
			//loop through all reports
			for (var i = 1; i <= fsValuelists.getSize(); i++) {
				var record = fsValuelists.getRecord(i)
				
				//create xml definition for this action
				var valuelistItemElem = exportXML.createElement('valuelist')
				valuelistElem.appendChild(valuelistItemElem)
				
				//punch down uuid if this report doesn't have one
				if (record.valuelist_uuid) {
					var valuelistUUID = record.valuelist_uuid
				}
				//use uuid for this toolbar
				else {
					var valuelistUUID = record.valuelist_uuid = application.getNewUUID()
				}
				
				valuelistItemElem.setAttribute('id',valuelistUUID)
				valuelistItemElem.setIdAttribute('id',true)
				
				valuelistItemElem.appendChild(XML_text_node(exportXML,'valuelistID',record.id_valuelist))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'orderBy',record.order_by))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'relationOne',record.relation_1))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'relationTwo',record.relation_2))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'saved',record.saved))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'searchField',record.search_field))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'searchTable',record.search_table))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'name',record.valuelist_name))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'visible',record.visible))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'dateCreated',record.date_created))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'dateModified',record.date_modified))
			}
			
			currentArea++
		}
		
		
		
			
		//proces xml
		var sourceXML = new Packages.javax.xml.transform.dom.DOMSource(exportXML)
		var stringWriter = new Packages.java.io.StringWriter()
		var streamResult = new Packages.javax.xml.transform.stream.StreamResult(stringWriter)
		new Packages.javax.xml.transform.TransformerFactory.newInstance().newTransformer().transform(sourceXML, streamResult)
		var stringXML = stringWriter.toString()
		
		//write temp xml file
		var XmlMF = plugins.file.createTempFile('mosaicFrameworks','.xml')
		var success = plugins.file.writeXMLFile(XmlMF, stringXML)
		
		if (success) {
			//progress updater
			globals.CALLBACK_progressbar_set(null,'Compressing data...')
			
			//zip xml and output
			XML_zip([XmlMF],zipFileName)
			
			globals.CALLBACK_progressbar_set(100,'Export complete')
			plugins.dialogs.showInfoDialog('Export complete','Selected frameworks settings have been successfully exported')
		}
		else {
			plugins.dialogs.showErrorDialog('No export','Error writing export file')
		}
	}
	//no file
	else if (!fileGood) {
		plugins.dialogs.showErrorDialog('No export','No name given for the exported file')
	}
}
else {
	plugins.dialogs.showErrorDialog('No export','Nothing selected to export')
}

globals.CALLBACK_progressbar_stop()



/*
// Create root element and append to document
var rootElem = exportXML.createElement("root")
exportXML.appendChild(rootElem)
// Insert a comment in front of the root element
var comment = exportXML.createComment("I am a comment")
exportXML.insertBefore(comment, rootElem)
// Create a child element ("child1") of the root element
var childElem = exportXML.createElement("child1")
rootElem.appendChild(childElem)
// Create an attribute for child element1
childElem.setAttribute("attr", "value")
// Add a text node to childElem
childElem.appendChild(exportXML.createTextNode("Child 1"))
*/
}

/**
 *
 * @properties={typeid:24,uuid:"fb27a700-d029-4fe5-9d70-99d65822859d"}
 */
function EXPORT_engine__archive()
{

/*
 *	TITLE    :	EXPORT_engine
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	prompt to choose sets to export; prompt for location; create xml file
 *			  	
 *	INPUT    :	array of... (all optional)
 *			  		1- what to export
 *			  		2- navigation set IDs
 *			  		3- group IDs
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Jun 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var whatExport = arguments[0]
var navIDs = arguments[1]
var groupIDs = arguments[2]

var relnGroupAction = 'ac_access_group_to_access_group_action'
var relnGroupActionAction = 'ac_access_group_action_to_access_action'
var relnGroupToolbar = 'ac_access_group_to_access_group_toolbar'
var relnGroupToolbarToolbar = 'ac_access_group_toolbar_to_toolbar'
var relnGroupUser = 'ac_access_group_to_access_user_group__selected'
var relnGroupNav = 'ac_access_group_to_control_navigation'
var relnGroupNavSet = 'ac_control_navigation_to_navigation'
var relnGroupBlog = 'ac_access_group_to_access_group_blog__selected'
var relnGroupBlogBlog = 'ac_access_group_blog_to_blog'
var relnBlogEntry = 'ac_blog_to_blog_entry'
var relnBlogQuote = 'ac_blog_to_blog_quote'
var relnStaff = 'ac_access_organization_to_access_staff'
var relnNav = 'nav_navigation_to_navigation_item__all'
var relnNavColumn = 'nav_navigation_item_to_column'
var relnNavDisplay = 'nav_navigation_item_to_list_display'
var relnNavDisplayItem = 'nav_list_display_to_list_display_item'
var relnNavAction = 'nav_navigation_item_to_action_item'
var relnNavActionFilter = 'nav_action_item_to_action_item_filter'
var relnNavDevSpec = 'nav_navigation_item_to_specification'
var relnNavDevTask = 'nav_navigation_item_to_task'

//progress bar rations
	//xml creation is 95%
		//numAreas = whatExport.length
		//sizeArea = 95/numAreas
		//numAreaSize = numAreas/navsets
		//numItemSize = numAreaSize/navItems
	//zip creation is 5%
var numAreas
var currentArea = 1
var sizeArea
var numAreaSize
var numItemSize
globals.CALLBACK_progressbar_start(0,'Exporting...')

	
	//	choosing what to do will come in a later version
				
	// set to all false to avoid undefined error ~150 line
	var accessControl = false
	var blog = false
	var navEngine = false
	var reportRegistry = false
	var solConfig = false
	var toolbar = false
	var tooltip = false
	var valuelist = false
				
				//no arguments passed, prompt to choose what info to export
				if (!whatExport) {
					forms.NAV_P_navigation.elements.fld_what.visible = true
					forms.NAV_P_navigation.elements.fld_export_navset.visible = false
					forms.NAV_P_navigation.elements.fld_import_navset.visible = false
					forms.NAV_P_navigation.elements.fld_export_access.visible = false
					forms.NAV_P_navigation.elements.fld_import_access.visible = false
					forms.NAV_P_navigation.elements.lbl_header.text = 'Select what things to export'
					application.showFormInDialog(
								forms.NAV_P_navigation,
								-1,-1,-1,-1,
								'Export',
								false,
								false,
								'fwImportExport'
							)
					var z = ''
					if (globals.NAV_importexport_areas) {
						whatExport = globals.NAV_importexport_areas.split('\n')
						
						for (var i = 0; i < whatExport.length; i++) {
							switch (whatExport[i]) {
								case 'Access & control':
									var accessControl = true
									break
								case 'Blogs':
									var blog = true
									break
								case 'Frameworks engine':
									var navEngine = true
									break
								case 'Report registry':
									var reportRegistry = true
									break
								case 'Solution configuration':
									var solConfig = true
									break
								case 'Toolbars':
									var toolbar = true
									break
								case 'Tooltips':
									var tooltip = true
									break
								case 'Value list':
									var valuelist = true
									break
							}
						}
						
						globals.NAV_importexport_areas = null
					}
				}
			/*	
				//something to export
				if (whatExport) {
				
					//how the progress bar should roll along....
					numAreas = whatExport.length
					
	//	end choosing what to do


//we are exporting all the areas
var accessControl = true
var blog = true
var navEngine = true
var reportRegistry = true
var solConfig = true
var toolbar = true
var tooltip = true
var valuelist = true
	*/


//if something to do, run
//TODO: when cancel button pressed, this line has a big error
if (accessControl || blog || navEngine || reportRegistry || solConfig || toolbar || tooltip || valuelist) {
	
	//how the progress bar should roll along....number of things being exported
	numAreas = 15 //navigation engine gets 8
	sizeArea = 95 / numAreas
	
	//prompt for file where to save
	plugins.dialogs.showInfoDialog('Save export file','Choose a location to save the exported frameworks settings','OK')
	var zipFileName = plugins.file.showFileSaveDialog('_FW_settings.mosaic')
	
	//check to see if zipFileName already exists, if it does throw up error
	if (zipFileName && zipFileName.exists()) {
		var fileGood = plugins.dialogs.showWarningDialog('File exists','Replace existing file?','Yes','No')
	}
	else if (zipFileName) {
		var fileGood = 'Yes'
	}
	
	//file chosen
	if (fileGood == 'Yes') {
	
		// Create document
		var exportXML = Packages.javax.xml.parsers.DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument()
		var rootElem = exportXML.createElement('mosaicFrameworks')
		exportXML.appendChild(rootElem)
		
		
		//Export node
		//
		//
		var exportElem = exportXML.createElement('exportDetails')
		rootElem.appendChild(exportElem)
		
		/*	//MEMO
			ver 1 never worked
			ver 2 was the rc6.5 version (2008 May)
			ver 3 was new with 2 rc2 (2008 Sept)
			ver 4 was new with 2 rc6, 2.1 rc3 (2009 July)
		*/
		exportElem.appendChild(XML_text_node(exportXML,'xmlVersion','4'))
		exportElem.appendChild(XML_text_node(exportXML,'servoyVersion',solutionPrefs.clientInfo.verServoy))
		exportElem.appendChild(XML_text_node(exportXML,'osPlatform',solutionPrefs.clientInfo.typeOS))
		exportElem.appendChild(XML_text_node(exportXML,'osVersion',solutionPrefs.clientInfo.verOS))
		exportElem.appendChild(XML_text_node(exportXML,'javaVersion',solutionPrefs.clientInfo.verJava))
		exportElem.appendChild(XML_text_node(exportXML,'date',new Date()))
		exportElem.appendChild(XML_text_node(exportXML,'frameworksVersion',plugins.sutra.getVersion()))
		
		
		//Access & control node
		//
		//
		if (accessControl) {
			
			globals.CALLBACK_progressbar_set(null,'Adding access and control...')
			
			//Access & control node
			//
			//
			var accessControlElem = exportXML.createElement('accessControl')
			rootElem.appendChild(accessControlElem)
			
			//create containers
			var accessGroupsElem = exportXML.createElement('accessGroups')
			accessControlElem.appendChild(accessGroupsElem)
			var accessUsersElem = exportXML.createElement('accessUsers')
			accessControlElem.appendChild(accessUsersElem)
			var accessOrganizationsElem = exportXML.createElement('accessOrganizations')
			accessControlElem.appendChild(accessOrganizationsElem)
			var accessFiltersElem = exportXML.createElement('accessFilters')
			accessControlElem.appendChild(accessFiltersElem)
			var actionRegistryElem = exportXML.createElement('actionRegistry')
			accessControlElem.appendChild(actionRegistryElem)
			var passwordRulesElem = exportXML.createElement('passwordRules')
			accessControlElem.appendChild(passwordRulesElem)
			
				/*
				//	choosing groups removed
			
						//no arguments passed, prompt to choose access groups to export
						if (!groupIDs) {
							forms.NAV_P_navigation.elements.fld_what.visible = false
							forms.NAV_P_navigation.elements.fld_export_navset.visible = false
							forms.NAV_P_navigation.elements.fld_import_navset.visible = false
							forms.NAV_P_navigation.elements.fld_export_access.visible = true
							forms.NAV_P_navigation.elements.fld_import_access.visible = false
							forms.NAV_P_navigation.elements.lbl_header.text = 'Select groups to export'
							application.showFormInDialog(forms.NAV_P_navigation,-1,-1,-1,-1,'Export',false,false,'fwImportExport')
							
							if (globals.NAV_export_access) {
								groupIDs = globals.NAV_export_access.split('\n')
								globals.NAV_export_access = null
							}
							
							//remove value if it is blank
							for (var m = 0; m < groupIDs.length; m++) {
								if (!groupIDs[m]) {
									groupIDs.splice(m,1)
								}
							}
						}
						
						//convert array to dataset
						var dataset = databaseManager.convertToDataSet(groupIDs)
			
				//	end choosing what to do
				*/
			
			//get all groups to export
			groupIDs = application.getValueListItems('NAV_export_access').getColumnAsArray(2)
			var dataset = databaseManager.convertToDataSet(groupIDs)
			
			//load dataset into groups foundset
			var accessGroups = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_group')
			accessGroups.clear()
			accessGroups.loadRecords(dataset)
			
			//track users in groups
			var accessUsers = new Object()
			
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
			//progress updater
			numAreaSize = (endPosn - startPosn) / groupIDs.length
			
			//loop through selected group, export data
			for (var h = 1; h <= accessGroups.getSize(); h++) {		
				//set index
				accessGroups.setSelectedIndex(h)
				
				//progress updater
				globals.CALLBACK_progressbar_set(startPosn + Math.floor(numAreaSize * (h - 1)),'Access group: ' + accessGroups.group_name)
				
				//create xml definition for this access group
				var accessGroupElem = exportXML.createElement('group')
				accessGroupsElem.appendChild(accessGroupElem)
				
				//punch down uuid if this set doesn't have one
				if (accessGroups.group_uuid) {
					var accessGroupUUID = accessGroups.group_uuid
				}
				//use uuid for this set
				else {
					var accessGroupUUID = accessGroups.group_uuid = application.getNewUUID()
				}
				
				accessGroupElem.setAttribute('id',accessGroupUUID)
				accessGroupElem.setIdAttribute('id',true)
				
				accessGroupElem.appendChild(XML_text_node(exportXML,'groupID',accessGroups.id_group))
				accessGroupElem.appendChild(XML_text_node(exportXML,'groupName',accessGroups.group_name))
				accessGroupElem.appendChild(XML_text_node(exportXML,'notes',accessGroups.group_notes))
				accessGroupElem.appendChild(XML_text_node(exportXML,'loggingItems',accessGroups.log_items))
				accessGroupElem.appendChild(XML_text_node(exportXML,'groupLoginMethod',accessGroups.login_method))
				accessGroupElem.appendChild(XML_text_node(exportXML,'groupLogoutMethod',accessGroups.logout_method))
				accessGroupElem.appendChild(XML_text_node(exportXML,'onLoginSet',accessGroups.login_nav_set))
				accessGroupElem.appendChild(XML_text_node(exportXML,'onLoginItem',accessGroups.login_nav_main))
				accessGroupElem.appendChild(XML_text_node(exportXML,'onLoginNode',accessGroups.login_nav_main_node))
				accessGroupElem.appendChild(XML_text_node(exportXML,'onLoginSub',accessGroups.login_nav_sub))
				accessGroupElem.appendChild(XML_text_node(exportXML,'modesAdmin',accessGroups.modes_admin))
				accessGroupElem.appendChild(XML_text_node(exportXML,'modesUser',accessGroups.modes_user))
				accessGroupElem.appendChild(XML_text_node(exportXML,'toolbars',accessGroups.toolbars))
				
				//navigation sets for selected group
				//
				//check that relation valid
				if (accessGroups[relnGroupNav] && accessGroups[relnGroupNav].getSize()) {
					
					//create xml definition for navigationSets
					var allNavSetsElem = exportXML.createElement('navigationSets')
					accessGroupElem.appendChild(allNavSetsElem)
					
					//loop through selected navigation sets, export data
					for (var i = 1; i <= accessGroups[relnGroupNav].getSize(); i++) {
						//get nav item being worked on
						var groupNavigation = accessGroups[relnGroupNav].getRecord(i)
						
						//check if valid group
						if (groupNavigation[relnGroupNavSet] && groupNavigation[relnGroupNavSet].getSize()) {
							//punch down uuid if this set doesn't have one
							if (groupNavigation[relnGroupNavSet].nav_uuid) {
								var navSetUUID = groupNavigation[relnGroupNavSet].nav_uuid
							}
							//use uuid for this set
							else {
								var navSetUUID = groupNavigation[relnGroupNavSet].nav_uuid = application.getNewUUID()
							}
							
							//create xml definition for this navSet
							
							var navSetElem = exportXML.createElement('navigationSet')
							allNavSetsElem.appendChild(navSetElem)
							
							navSetElem.setAttribute('id',navSetUUID)
							navSetElem.setIdAttribute('id',true)
							
							navSetElem.appendChild(XML_text_node(exportXML,'groupID',groupNavigation.id_group))
							navSetElem.appendChild(XML_text_node(exportXML,'navigationID',groupNavigation.id_navigation))
							navSetElem.appendChild(XML_text_node(exportXML,'name',groupNavigation.nav_name))
							navSetElem.appendChild(XML_text_node(exportXML,'comments',groupNavigation.comments))
							navSetElem.appendChild(XML_text_node(exportXML,'flagChosen',groupNavigation.flag_chosen))
							navSetElem.appendChild(XML_text_node(exportXML,'uuid',navSetUUID))
						}
					}
				}
				
				//log users assigned to selected group (will add all users to export at end)
				for (var i = 1; i <= accessGroups[relnGroupUser].getSize(); i++) {
					var record = accessGroups[relnGroupUser].getRecord(i)
					if (!accessUsers[record.id_user]) {
						accessUsers[record.id_user] = new Array()
					}
					accessUsers[record.id_user].push(accessGroups.id_group)
				}
				
				//progres updater, push ahead half a stop
				if (startPosn + (h / accessGroups.getSize() * (endPosn - startPosn)) <= endPosn) {
					globals.CALLBACK_progressbar_set(startPosn + Math.floor(numAreaSize * (h - 1)) + numAreaSize / 2)
				}
				
				//actions
				//
				//check that relation valid
				if (accessGroups[relnGroupAction] && accessGroups[relnGroupAction].getSize()) {
					
					//create xml definition for assigned actions
					var allActionsElem = exportXML.createElement('actions')
					accessGroupElem.appendChild(allActionsElem)
					
					//loop through selected actions, export data
					for (var i = 1; i <= accessGroups[relnGroupAction].getSize(); i++) {
						//get action being worked on
						var groupAction = accessGroups[relnGroupAction].getRecord(i)
						
						//check if valid action
						if (groupAction[relnGroupActionAction] && groupAction[relnGroupActionAction].getSize()) {
							//punch down uuid if this set doesn't have one
							if (groupAction[relnGroupActionAction].action_uuid) {
								var actionUUID = groupAction[relnGroupActionAction].action_uuid
							}
							//use uuid for this set
							else {
								var actionUUID = groupAction[relnGroupActionAction].action_uuid = application.getNewUUID()
							}
							
							//create xml definition for this action
							
							var actionElem = exportXML.createElement('action')
							allActionsElem.appendChild(actionElem)
							
							actionElem.setAttribute('id',actionUUID)
							actionElem.setIdAttribute('id',true)
							
							actionElem.appendChild(XML_text_node(exportXML,'groupID',groupAction.id_group))
							actionElem.appendChild(XML_text_node(exportXML,'actionID',groupAction.id_action))
							actionElem.appendChild(XML_text_node(exportXML,'name',groupAction[relnGroupActionAction].nav_name))
							actionElem.appendChild(XML_text_node(exportXML,'flagChosen',groupAction.flag_chosen))
							actionElem.appendChild(XML_text_node(exportXML,'flagEnabled',groupAction.flag_enabled))
							actionElem.appendChild(XML_text_node(exportXML,'uuid',actionUUID))
						}
					}
				}
				
				
				//toolbar area
				//
				//check that toolbars selected for export and relation valid
				if (toolbar && accessGroups[relnGroupToolbar] && accessGroups[relnGroupToolbar].getSize()) {
				
					//create xml definition for assigned toolbars
					var allToolbarsElem = exportXML.createElement('toolbars')
					accessGroupElem.appendChild(allToolbarsElem)
					
					//loop through selected toolbars, export data
					for (var i = 1; i <= accessGroups[relnGroupToolbar].getSize(); i++) {
						//get action being worked on
						var groupToolbar = accessGroups[relnGroupToolbar].getRecord(i)
						
						//check if valid toolbar
						if (groupToolbar[relnGroupToolbarToolbar] && groupToolbar[relnGroupToolbarToolbar].getSize()) {
							//punch down uuid if this toolbar doesn't have one
							if (groupToolbar[relnGroupToolbarToolbar].toolbar_uuid) {
								var toolbarUUID = groupToolbar[relnGroupToolbarToolbar].toolbar_uuid
							}
							//use uuid for this set
							else {
								var toolbarUUID = groupToolbar[relnGroupToolbarToolbar].toolbar_uuid = application.getNewUUID()
							}
							
							//create xml definition for this toolbar
							
							var toolbarElem = exportXML.createElement('toolbar')
							allToolbarsElem.appendChild(toolbarElem)
							
							toolbarElem.setAttribute('id',toolbarUUID)
							toolbarElem.setIdAttribute('id',true)
							
							toolbarElem.appendChild(XML_text_node(exportXML,'groupID',groupToolbar.id_group))
							toolbarElem.appendChild(XML_text_node(exportXML,'toolbarID',groupToolbar.id_toolbar))
							toolbarElem.appendChild(XML_text_node(exportXML,'formName',groupToolbar[relnGroupToolbarToolbar].form_name))
							toolbarElem.appendChild(XML_text_node(exportXML,'flagChosen',groupToolbar.flag_chosen))
							toolbarElem.appendChild(XML_text_node(exportXML,'uuid',toolbarUUID))
						}
					}
				}
				
				
				//blog
				//
				//check that blog selected for export and relation valid
				if (blog && accessGroups[relnGroupBlog] && accessGroups[relnGroupBlog].getSize()) {
					
					//create xml definition for assigned blogs
					var allBlogsElem = exportXML.createElement('blogs')
					accessGroupElem.appendChild(allBlogsElem)
					
					//loop through selected blogs, export data
					for (var i = 1; i <= accessGroups[relnGroupBlog].getSize(); i++) {
						//group-blog merge record
						var groupBlog = accessGroups[relnGroupBlog].getRecord(i)
						
						//check if valid blog
						if (groupBlog[relnGroupBlogBlog] && groupBlog[relnGroupBlogBlog].getSize()) {
							
							//punch down uuid if this blog doesn't have one
							if (groupBlog[relnGroupBlogBlog].bloguuid) {
								var blogUUID = groupBlog[relnGroupBlogBlog].blog_uuid
							}
							//use uuid for this set
							else {
								var blogUUID = groupBlog[relnGroupBlogBlog].blog_uuid = application.getNewUUID()
							}
							
							//create xml definition for this blog
							
							var blogElem = exportXML.createElement('blog')
							allBlogsElem.appendChild(blogElem)
							
							blogElem.setAttribute('id',blogUUID)
							blogElem.setIdAttribute('id',true)
							
							blogElem.appendChild(XML_text_node(exportXML,'groupID',groupBlog.id_group))
							blogElem.appendChild(XML_text_node(exportXML,'blogID',groupBlog.id_blog))
							blogElem.appendChild(XML_text_node(exportXML,'name',groupBlog[relnGroupBlogBlog].blog_name))
							blogElem.appendChild(XML_text_node(exportXML,'flagChosen',groupBlog.flag_chosen))
							blogElem.appendChild(XML_text_node(exportXML,'uuid',blogUUID))
						}
					}
				}
			}
			
			//update with what doing
			globals.CALLBACK_progressbar_set(endPosn,'Adding all users...')
			
			//create users that were in selected groups
			var userIDs = new Array()
			
			for (var g in accessUsers) {
				userIDs.push(g)
			}
			
			//convert array to dataset
			var dataset = databaseManager.convertToDataSet(userIDs)
			
			//load dataset into navigation foundset
			var fsAccessUsers = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_user')
			fsAccessUsers.clear()
			fsAccessUsers.loadRecords(dataset)
			
			//loop through selected users, export data
			for (var h = 1; h <= fsAccessUsers.getSize(); h++) {	
				//get user record index
				var userRecord = fsAccessUsers.getRecord(h)
				
				//create xml definition for this access user
				
				var accessUserElem = exportXML.createElement('user')
				accessUsersElem.appendChild(accessUserElem)
				
				//punch down uuid if this user doesn't have one
				if (userRecord.user_uuid) {
					var accessUserUUID = userRecord.user_uuid
				}
				//use uuid for this user
				else {
					var accessUserUUID = userRecord.user_uuid = application.getNewUUID()
				}
				
				var userGroupAssigned = ''
				while (accessUsers[userRecord.id_user].length) {
					userGroupAssigned = accessUsers[userRecord.id_user].shift() + ((accessUsers[userRecord.id_user].length == 0) ? '' : ',')
				}
				
				accessUserElem.setAttribute('id',accessUserUUID)
				accessUserElem.setIdAttribute('id',true)
				
				accessUserElem.appendChild(XML_text_node(exportXML,'userID',userRecord.id_user))
				accessUserElem.appendChild(XML_text_node(exportXML,'organizationID',userRecord.id_organization))
				accessUserElem.appendChild(XML_text_node(exportXML,'staffID',userRecord.id_staff))
				accessUserElem.appendChild(XML_text_node(exportXML,'userName',userRecord.user_name))
				accessUserElem.appendChild(XML_text_node(exportXML,'notes',userRecord.user_notes))
				accessUserElem.appendChild(XML_text_node(exportXML,'password',userRecord.user_password))
				accessUserElem.appendChild(XML_text_node(exportXML,'uuid',accessUserUUID))
				
				accessUserElem.appendChild(XML_text_node(exportXML,'groupsAssigned',userGroupAssigned))
				
				accessUserElem.appendChild(XML_text_node(exportXML,'disabled',userRecord.account_disabled))
				accessUserElem.appendChild(XML_text_node(exportXML,'dateCreated',userRecord.date_created))
				accessUserElem.appendChild(XML_text_node(exportXML,'dateModified',userRecord.date_modified))
				accessUserElem.appendChild(XML_text_node(exportXML,'datePassword',userRecord.date_password_changed))
				accessUserElem.appendChild(XML_text_node(exportXML,'previousPasswords',userRecord.old_passwords))
				accessUserElem.appendChild(XML_text_node(exportXML,'passMustChangeAtNextLogin',userRecord.pass_change_at_login))
				accessUserElem.appendChild(XML_text_node(exportXML,'passNeverExpires',userRecord.pass_never_expires))
				accessUserElem.appendChild(XML_text_node(exportXML,'passUnchangeable',userRecord.pass_unchangeable))
				accessUserElem.appendChild(XML_text_node(exportXML,'screenHeight',userRecord.screen_height))
				accessUserElem.appendChild(XML_text_node(exportXML,'screenCenter',userRecord.screen_location_center))
				accessUserElem.appendChild(XML_text_node(exportXML,'screenX',userRecord.screen_location_x))
				accessUserElem.appendChild(XML_text_node(exportXML,'screenY',userRecord.screen_location_y))
				accessUserElem.appendChild(XML_text_node(exportXML,'screenWidth',userRecord.screen_width))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceCenteredH1',userRecord.space_centered_horizontal_1))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceCenteredH2',userRecord.space_centered_horizontal_2))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceClassicH',userRecord.space_classic_horizontal))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceClassicV',userRecord.space_classic_vertical))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceListH',userRecord.space_list_horizontal))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceStandardH',userRecord.space_standard_horizontal))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceStandardV',userRecord.space_standard_vertical))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceVertcialH1',userRecord.space_vertical_horizontal_1))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceVertcialH2',userRecord.space_vertical_horizontal_2))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceWideH',userRecord.space_wide_horizontal))
				accessUserElem.appendChild(XML_text_node(exportXML,'spaceWideV',userRecord.space_wide_vertical))
			}
			
		//create selected organizations (if they are using the provided organization structure)
			
			//update with what doing
			globals.CALLBACK_progressbar_set(null,'Adding default organizations...')
			
			var fsOrganization = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_organization')
			fsOrganization.loadAllRecords()
			
			//loop through all organizations
			for (var i = 1; i <= fsOrganization.getSize(); i++) {
				var record = fsOrganization.getRecord(i)
				
				//create xml definition for this organization
				var organizationItemElem = exportXML.createElement('organization')
				accessOrganizationsElem.appendChild(organizationItemElem)
				
				organizationItemElem.setAttribute('id',record.id_organization)
				organizationItemElem.setIdAttribute('id',true)
				
				organizationItemElem.appendChild(XML_text_node(exportXML,'addressOne',record.address_1))
				organizationItemElem.appendChild(XML_text_node(exportXML,'addressTwo',record.address_2))
				organizationItemElem.appendChild(XML_text_node(exportXML,'city',record.city))
				organizationItemElem.appendChild(XML_text_node(exportXML,'name',record.name_organization))
				organizationItemElem.appendChild(XML_text_node(exportXML,'phoneFax',record.phone_fax))
				organizationItemElem.appendChild(XML_text_node(exportXML,'phoneMain',record.phone_main))
				organizationItemElem.appendChild(XML_text_node(exportXML,'dateCreated',record.rec_created))
				organizationItemElem.appendChild(XML_text_node(exportXML,'dateModified',record.rec_modified))
				organizationItemElem.appendChild(XML_text_node(exportXML,'state',record.state))
				organizationItemElem.appendChild(XML_text_node(exportXML,'url',record.url))
				organizationItemElem.appendChild(XML_text_node(exportXML,'postalCode',record.zip))
				
				if (utils.hasRecords(fsOrganization[relnStaff])) {
					
					//create xml container for organization's staff
					var staffElem = exportXML.createElement('staff')
					organizationItemElem.appendChild(staffElem)
					
					//loop through all staff
					for (var j = 1; j <= fsOrganization[relnStaff].getSize(); j++) {
						var staffRec = fsOrganization[relnStaff].getRecord(j)
						
						//create xml definition for this staff
						var staffItemElem = exportXML.createElement('staff')
						staffElem.appendChild(staffItemElem)
						
						staffItemElem.setAttribute('id',record.id_staff)
						staffItemElem.setIdAttribute('id',true)
						
						staffItemElem.appendChild(XML_text_node(exportXML,'addressOne',staffRec.address_1))
						staffItemElem.appendChild(XML_text_node(exportXML,'addressTwo',staffRec.address_2))
						staffItemElem.appendChild(XML_text_node(exportXML,'city',staffRec.address_city))
						staffItemElem.appendChild(XML_text_node(exportXML,'country',staffRec.address_country))
						staffItemElem.appendChild(XML_text_node(exportXML,'state',staffRec.address_state))
						staffItemElem.appendChild(XML_text_node(exportXML,'postalCode',staffRec.address_zip))
						staffItemElem.appendChild(XML_text_node(exportXML,'bankAccount',staffRec.bank_account_number))
						staffItemElem.appendChild(XML_text_node(exportXML,'bankAccountType',staffRec.bank_account_type))
						staffItemElem.appendChild(XML_text_node(exportXML,'bankDeduction',staffRec.bank_deduction))
						staffItemElem.appendChild(XML_text_node(exportXML,'bankDeductionCode',staffRec.bank_deduction_code))
						staffItemElem.appendChild(XML_text_node(exportXML,'bankDepositTransit',staffRec.bank_deposit_transit))
						staffItemElem.appendChild(XML_text_node(exportXML,'bankDeposit',staffRec.bank_full_deposit))
						staffItemElem.appendChild(XML_text_node(exportXML,'percent401k',staffRec.benefit_401k_percent))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateBirth',staffRec.date_birth))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateCompPlan',staffRec.date_compplan_begin))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateHire',staffRec.date_hire))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateLeave',staffRec.date_leave))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateTerminated',staffRec.date_termination))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateVacation',staffRec.date_vacation))
						staffItemElem.appendChild(XML_text_node(exportXML,'email',staffRec.email))
						staffItemElem.appendChild(XML_text_node(exportXML,'fedExemptions',staffRec.federal_exemptions))
						staffItemElem.appendChild(XML_text_node(exportXML,'fedExtra',staffRec.federal_extra))
						staffItemElem.appendChild(XML_text_node(exportXML,'fedExtraPercent',staffRec.federal_extra_percent))
						staffItemElem.appendChild(XML_text_node(exportXML,'fedTaxBlockd',staffRec.federal_tax_block))
						staffItemElem.appendChild(XML_text_node(exportXML,'flag401k',staffRec.flag_401k))
						staffItemElem.appendChild(XML_text_node(exportXML,'flagActive',staffRec.flag_active))
						staffItemElem.appendChild(XML_text_node(exportXML,'flagHealthPlan',staffRec.flag_health_plan))
						staffItemElem.appendChild(XML_text_node(exportXML,'flagW4',staffRec.flag_w4))
						staffItemElem.appendChild(XML_text_node(exportXML,'gender',staffRec.gender))
						staffItemElem.appendChild(XML_text_node(exportXML,'listName',staffRec.list_name))
						staffItemElem.appendChild(XML_text_node(exportXML,'nameFirst',staffRec.name_first))
						staffItemElem.appendChild(XML_text_node(exportXML,'nameLast',staffRec.name_last))
						staffItemElem.appendChild(XML_text_node(exportXML,'nameMiddle',staffRec.name_middle))
						staffItemElem.appendChild(XML_text_node(exportXML,'namePrefix',staffRec.name_prefix))
						staffItemElem.appendChild(XML_text_node(exportXML,'nameSuffix',staffRec.name_suffix))
						staffItemElem.appendChild(XML_text_node(exportXML,'paycheckType',staffRec.paycheck_type))
						staffItemElem.appendChild(XML_text_node(exportXML,'payRate',staffRec.payrate_hourly))
						staffItemElem.appendChild(XML_text_node(exportXML,'phoneHome',staffRec.phone_home))
						staffItemElem.appendChild(XML_text_node(exportXML,'phoneMobile',staffRec.phone_mobile))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateCreated',staffRec.rec_created))
						staffItemElem.appendChild(XML_text_node(exportXML,'dateModified',staffRec.rec_modified))
						staffItemElem.appendChild(XML_text_node(exportXML,'ssn',staffRec.social_security_number))
						staffItemElem.appendChild(XML_text_node(exportXML,'medicarTaxBlock',staffRec.ss_medicare_tax_block))
						staffItemElem.appendChild(XML_text_node(exportXML,'stateExemptions',staffRec.state_exemptions))
						staffItemElem.appendChild(XML_text_node(exportXML,'stateTaxBlock',staffRec.state_tax_block))
						staffItemElem.appendChild(XML_text_node(exportXML,'stateTaxExtra',staffRec.state_tax_extra))
						staffItemElem.appendChild(XML_text_node(exportXML,'stateTaxExtraPercent',staffRec.state_tax_extra_percent))
						staffItemElem.appendChild(XML_text_node(exportXML,'stateWorked',staffRec.state_worked))
						staffItemElem.appendChild(XML_text_node(exportXML,'typeStaff',staffRec.type_staff))
					}
				}
			}
			
			
		//create filters
			
			//update with what doing
			globals.CALLBACK_progressbar_set(null,'Adding filters...')
			
			var fsFilters = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_filter')
			fsFilters.loadAllRecords()
			
			//loop through all filters
			for (var i = 1; i <= fsFilters.getSize(); i++) {
				var record = fsFilters.getRecord(i)
				
				//create xml definition for this action
				var accessFiltersItemElem = exportXML.createElement('filter')
				accessFiltersElem.appendChild(accessFiltersItemElem)
				
				accessFiltersItemElem.setAttribute('id',record.filter_uuid)
				accessFiltersItemElem.setIdAttribute('id',true)
				
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'filterID',record.id_filter))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'dbServer',record.filter_database))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'table',record.filter_table))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'column',record.filter_field))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'enabled',record.filter_on))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'comparison',record.filter_operator))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'type',record.filter_type))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'value',record.filter_value))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'valueType',record.filter_value_type))
				accessFiltersItemElem.appendChild(XML_text_node(exportXML,'groupID',record.id_group))
			}
			
		//create actions registry
			
			//update with what doing
			globals.CALLBACK_progressbar_set(null,'Adding actions registry...')
			
			var actionsRegistry = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_action')
			actionsRegistry.loadAllRecords()
			
			//loop through all actions
			for (var i = 1; i <= actionsRegistry.getSize(); i++) {
				var record = actionsRegistry.getRecord(i)
				
				//create xml definition for this action
				var actionsRegistryItemElem = exportXML.createElement('action')
				actionRegistryElem.appendChild(actionsRegistryItemElem)
				
				actionsRegistryItemElem.setAttribute('id',record.action_uuid)
				actionsRegistryItemElem.setIdAttribute('id',true)
				
				actionsRegistryItemElem.appendChild(XML_text_node(exportXML,'actionID',record.action_id))
				actionsRegistryItemElem.appendChild(XML_text_node(exportXML,'name',record.action_name))
				actionsRegistryItemElem.appendChild(XML_text_node(exportXML,'description',record.description))
			}
			
			
		//create password rules
			
			//update with what doing
			globals.CALLBACK_progressbar_set(null,'Adding password rules...')
			
			var passRules = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_rules')
			passRules.loadAllRecords()
			
			passwordRulesElem.appendChild(XML_text_node(exportXML,'requireUpplerLower',passRules.alpha_case_flag))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'requireAlphaNum',passRules.alphnum_flag))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'expireDays',passRules.expire_days))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'requireExpire',passRules.expire_flag))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'requireIdleKick',passRules.idle_flag))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'idleKickTime',passRules.idle_time))
			
			var passLengthElem = exportXML.createElement('length')
				passwordRulesElem.appendChild(passLengthElem)
				passLengthElem.appendChild(XML_text_node(exportXML,'requireLength',passRules.length_flag))
				passLengthElem.appendChild(XML_text_node(exportXML,'maxChars',passRules.length_max))
				passLengthElem.appendChild(XML_text_node(exportXML,'minChars',passRules.length_min))
			
			passwordRulesElem.appendChild(XML_text_node(exportXML,'requireNonAlpha',passRules.non_alphanum_flag))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'notUserName',passRules.not_user_name))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'previousPasswords',passRules.prev_match_count))
			passwordRulesElem.appendChild(XML_text_node(exportXML,'notMatchPrevious',passRules.prev_match_flag))
			
			//advance progressbar updater to the next section
			currentArea++
		}
		
		
		
		//Blogs node
		//
		//
		if (blog) {
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
			//update with what doing
			globals.CALLBACK_progressbar_set(startPosn,'Adding blogs...')
			
			var blogElem = exportXML.createElement('blogs')
			rootElem.appendChild(blogElem)
			
			//get blog foundset
			var fsBlogs = databaseManager.getFoundSet(controller.getServerName(),'sutra_blog')
			fsBlogs.loadAllRecords()
			
			if (utils.hasRecords(fsBlogs)) {
				var numAreaSize = (endPosn - startPosn) / fsBlogs.getSize()
				
				//loop through all blogs
				for (var i = 1; i <= fsBlogs.getSize(); i++) {
					//update with what doing
					globals.CALLBACK_progressbar_set(startPosn + numAreaSize * (i - 1) / 2)
				
					var record = fsBlogs.getRecord(i)
					
					//create xml definition for this blog
					var blogItemElem = exportXML.createElement('blog')
					blogElem.appendChild(blogItemElem)
					
					//punch down uuid if this blog doesn't have one
					if (record.blog_uuid) {
						var blogUUID = record.blog_uuid
					}
					//use uuid for this toolbar
					else {
						var blogUUID = record.blog_uuid = application.getNewUUID()
					}
					
					blogItemElem.setAttribute('id',blogUUID)
					blogItemElem.setIdAttribute('id',true)
					
					blogItemElem.appendChild(XML_text_node(exportXML,'blogID',record.id_blog))
					blogItemElem.appendChild(XML_text_node(exportXML,'hideAuthor',record.blog_author_hide))
					blogItemElem.appendChild(XML_text_node(exportXML,'banner',record.blog_banner))
					blogItemElem.appendChild(XML_text_node(exportXML,'hideDate',record.blog_date_hide))
					blogItemElem.appendChild(XML_text_node(exportXML,'staticEntry',record.blog_fixed))
					blogItemElem.appendChild(XML_text_node(exportXML,'useStatic',record.blog_fixed_always))
					blogItemElem.appendChild(XML_text_node(exportXML,'footer',record.blog_footer))
					blogItemElem.appendChild(XML_text_node(exportXML,'header',record.blog_header))
					blogItemElem.appendChild(XML_text_node(exportXML,'misc',record.blog_misc))
					blogItemElem.appendChild(XML_text_node(exportXML,'name',record.blog_name))
					blogItemElem.appendChild(XML_text_node(exportXML,'displayPosts',record.blog_posts))
					blogItemElem.appendChild(XML_text_node(exportXML,'visible',record.blog_visible))
					blogItemElem.appendChild(XML_text_node(exportXML,'autoQuote',record.quote_auto))
					blogItemElem.appendChild(XML_text_node(exportXML,'dateCreated',record.rec_created))
					blogItemElem.appendChild(XML_text_node(exportXML,'dateModified',record.rec_modified))
					
					//blog entries
					if (utils.hasRecords(record[relnBlogEntry])) {
						//record[relnBlogEntry].sort('blog_posted desc')
						
						//container for posts
						var blogEntriesElem = exportXML.createElement('entries')
						blogItemElem.appendChild(blogEntriesElem)
						
						//loop through all blog entries
						for (var j = 1; j <= record[relnBlogEntry].getSize(); j++) {
							var blogEntry = record[relnBlogEntry].getRecord(j)
							
							//create xml definition for this blog post
							var blogEntryElem = exportXML.createElement('post')
							blogEntriesElem.appendChild(blogEntryElem)
							
							blogEntryElem.setAttribute('id',application.getNewUUID())
							blogEntryElem.setIdAttribute('id',true)
							
							blogEntryElem.appendChild(XML_text_node(exportXML,'blogEntryID',blogEntry.id_blog_entry))
							blogEntryElem.appendChild(XML_text_node(exportXML,'message',blogEntry.blog_message))
							blogEntryElem.appendChild(XML_text_node(exportXML,'datePosted',blogEntry.blog_posted))
							blogEntryElem.appendChild(XML_text_node(exportXML,'title',blogEntry.blog_title))
							blogEntryElem.appendChild(XML_text_node(exportXML,'visible',blogEntry.blog_visible))
							blogEntryElem.appendChild(XML_text_node(exportXML,'blogID',blogEntry.id_blog))
							blogEntryElem.appendChild(XML_text_node(exportXML,'groupID',blogEntry.id_group))
							blogEntryElem.appendChild(XML_text_node(exportXML,'userID',blogEntry.id_user))
							blogEntryElem.appendChild(XML_text_node(exportXML,'dateCreated',blogEntry.rec_created))
							blogEntryElem.appendChild(XML_text_node(exportXML,'dateModified',blogEntry.rec_modified))
						}
					}
					
					//qotd for this blog
					if (utils.hasRecords(record[relnBlogQuote])) {
						//record[relnBlogQuote].sort('date_display desc')
						
						//container for quotes
						var blogQuotesElem = exportXML.createElement('quotes')
						blogItemElem.appendChild(blogQuotesElem)
						
						//loop through all blog entries
						for (var j = 1; j <= record[relnBlogQuote].getSize(); j++) {
							var qotdRecord = record[relnBlogQuote].getRecord(j)
							
							//create xml definition for this quote
							var blogQuoteElem = exportXML.createElement('quote')
							blogQuotesElem.appendChild(blogQuoteElem)
							
							//punch down uuid if this qotd doesn't have one
							if (qotdRecord.quote_uuid) {
								var quoteUUID = qotdRecord.quote_uuid
							}
							//use uuid for this set
							else {
								var quoteUUID = qotdRecord.quote_uuid = application.getNewUUID()
							}
							
							blogQuoteElem.setAttribute('id',quoteUUID)
							blogQuoteElem.setIdAttribute('id',true)
							
							blogQuoteElem.appendChild(XML_text_node(exportXML,'dateCreated',qotdRecord.date_created))
							blogQuoteElem.appendChild(XML_text_node(exportXML,'dateModified',qotdRecord.date_modified))
							blogQuoteElem.appendChild(XML_text_node(exportXML,'dateDisplay',qotdRecord.date_display))
							blogQuoteElem.appendChild(XML_text_node(exportXML,'quote',qotdRecord.quote))
							blogQuoteElem.appendChild(XML_text_node(exportXML,'active',qotdRecord.quote_active))
							blogQuoteElem.appendChild(XML_text_node(exportXML,'author',qotdRecord.quote_author))
							blogQuoteElem.appendChild(XML_text_node(exportXML,'default',qotdRecord.quote_default))
						}
					}
				}
			}
			currentArea++
		}	
		
		
			
		//Navigation engine node
		//
		//
		if (navEngine) {
			
			globals.CALLBACK_progressbar_set(null,'Adding frameworks engine...')
			
				/*
				//	removed for ver1
				
							//no arguments passed, prompt to choose navigation sets to export
							if (!navIDs) {
								forms.NAV_P_navigation.elements.fld_what.visible = false
								forms.NAV_P_navigation.elements.fld_export_navset.visible = true
								forms.NAV_P_navigation.elements.fld_import_navset.visible = false
								forms.NAV_P_navigation.elements.fld_export_access.visible = false
								forms.NAV_P_navigation.elements.fld_import_access.visible = false
								forms.NAV_P_navigation.elements.lbl_header.text = 'Select navigation sets to export'
								application.showFormInDialog(forms.NAV_P_navigation,-1,-1,-1,-1,'Export',false,false,'fwImportExport')
								
								if (globals.NAV_export_navset) {
									navIDs = globals.NAV_export_navset.split('\n')
									globals.NAV_export_navset = null
								}
								else {
									navIDs = new Array()
								}
								
								//remove value if it is blank
								for (var m = 0; m < navIDs.length; m++) {
									if (!navIDs[m]) {
										navIDs.splice(m,1)
									}
								}
							}
							
							//sets are selected to be exported
							if (navIDs && navIDs.length && application.__parent__.solutionPrefs) {
				
				//	end removal
				*/
			
			
			//no arguments passed, prompt to choose navigation sets to export
			if (!navIDs) {
				forms.NAV_P_navigation.elements.fld_what.visible = false
				forms.NAV_P_navigation.elements.fld_export_navset.visible = true
				forms.NAV_P_navigation.elements.fld_import_navset.visible = false
				forms.NAV_P_navigation.elements.fld_export_access.visible = false
				forms.NAV_P_navigation.elements.fld_import_access.visible = false
				forms.NAV_P_navigation.elements.lbl_header.text = 'Select navigation sets to export'
				application.showFormInDialog(forms.NAV_P_navigation,-1,-1,-1,-1,'Export',false,false,'fwImportExport')
				
				if (globals.NAV_export_navset) {
					navIDs = globals.NAV_export_navset.split('\n')
					globals.NAV_export_navset = null
				}
				else {
					navIDs = new Array()
				}
				
				//remove value if it is blank
				for (var m = 0; m < navIDs.length; m++) {
					if (!navIDs[m]) {
						navIDs.splice(m,1)
					}
				}
			}
			
			/*
			//all navigations sets
			navIDs = application.getValueListItems('NAV_export_navsets').getColumnAsArray(2)
			*/
			
			//sets are selected to be exported
			if (navIDs && navIDs.length && application.__parent__.solutionPrefs) {
					
				//Navigation engine node
				//
				//
				var navEngineElem = exportXML.createElement('frameworksEngine')
				rootElem.appendChild(navEngineElem)
				
				//convert array to dataset
				var dataset = databaseManager.convertToDataSet(navIDs)
				
				//load dataset into navigation foundset
				var navSets = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation')
				navSets.clear()
				navSets.loadRecords(dataset)
				
				//start/end positions for progressbar
				var startPosn = sizeArea * (currentArea - 1)
				var endPosn = sizeArea * (currentArea + 9)
				
				//progress updater
				numAreaSize = (endPosn - startPosn) / navSets.getSize()
				
				//loop through selected navigation sets, export data
				for (var h = 1; h <= navSets.getSize(); h++) {		
					//get navset to be operated on
					var navigationSet = navSets.getRecord(h)
					
					//progress updater: check that all the way filled up to here
					globals.CALLBACK_progressbar_set(startPosn + numAreaSize * (h - 1),'Navigation set: ' + navigationSet.nav_name)
					
					//create xml definition for this navigation set
					
					var navSetElem = exportXML.createElement('navigationSet')
					navEngineElem.appendChild(navSetElem)
					
					//punch down uuid if this set doesn't have one
					if (navigationSet.nav_uuid) {
						var navSetUUID = navigationSet.nav_uuid
					}
					//use uuid for this set
					else {
						var navSetUUID = navigationSet.nav_uuid = application.getNewUUID()
					}
					
					navSetElem.setAttribute('id',navSetUUID)
					navSetElem.setIdAttribute('id',true)
					
					navSetElem.appendChild(XML_text_node(exportXML,'navigationID',navigationSet.id_navigation))
					navSetElem.appendChild(XML_text_node(exportXML,'navUUID',navigationSet.nav_uuid))
					navSetElem.appendChild(XML_text_node(exportXML,'name',navigationSet.nav_name))
					navSetElem.appendChild(XML_text_node(exportXML,'status',navigationSet.nav_status))
					navSetElem.appendChild(XML_text_node(exportXML,'description',navigationSet.nav_description))
					navSetElem.appendChild(XML_text_node(exportXML,'default',navigationSet.nav_default))
					navSetElem.appendChild(XML_text_node(exportXML,'flagConfig',navigationSet.flag_config))
					
					//check that relation valid
					if (navigationSet[relnNav] && navigationSet[relnNav].getSize()) {
						//sort
						navigationSet[relnNav].sort('node_1 asc, node_2 asc')
						
						//create xml definition for navigationItems
						var allNavItemsElem = exportXML.createElement('navigationItems')
						navSetElem.appendChild(allNavItemsElem)
						
						//progress updater
						numItemSize = numAreaSize / navigationSet[relnNav].getSize()
						var itemTenth = 1 / 10
						
						//loop through selected navigation items, export data
						for (var i = 1; i <= navigationSet[relnNav].getSize(); i++) {
							//get nav item being worked on
							var navigationItem = navigationSet[relnNav].getRecord(i)
							
							//progres updater size updated at most every 10 percent of navigation set
							if ((i / navigationSet[relnNav].getSize()) > itemTenth) {
								globals.CALLBACK_progressbar_set(startPosn + Math.floor(Math.floor(numAreaSize * (h - 1) + numItemSize * i)))
								itemTenth = Math.floor(10 * (i / navigationSet[relnNav].getSize())) / 10
							}
							
							//create xml definition for this navItem
							
							var navItemElem = exportXML.createElement('navigationItem')
							allNavItemsElem.appendChild(navItemElem)
							
							navItemElem.setAttribute('id',application.getNewUUID())
							navItemElem.setIdAttribute('id',true)
							
							navItemElem.appendChild(XML_text_node(exportXML,'navigationID',navigationItem.id_navigation))
							navItemElem.appendChild(XML_text_node(exportXML,'navigationItemID',navigationItem.id_navigation_item))
							navItemElem.appendChild(XML_text_node(exportXML,'configType',navigationItem.config_type))
							navItemElem.appendChild(XML_text_node(exportXML,'itemName',navigationItem.item_name))
							navItemElem.appendChild(XML_text_node(exportXML,'itemID',navigationItem.item_id))
							navItemElem.appendChild(XML_text_node(exportXML,'moduleFilter',navigationItem.module_filter))
							navItemElem.appendChild(XML_text_node(exportXML,'formLoad',navigationItem.form_to_load))
							navItemElem.appendChild(XML_text_node(exportXML,'listLoad',navigationItem.list_to_load))
							navItemElem.appendChild(XML_text_node(exportXML,'formLoadTable',navigationItem.form_to_load_table))
							navItemElem.appendChild(XML_text_node(exportXML,'description',navigationItem.description))
							navItemElem.appendChild(XML_text_node(exportXML,'nodeOne',navigationItem.node_1))
							navItemElem.appendChild(XML_text_node(exportXML,'nodeTwo',navigationItem.node_2))
							navItemElem.appendChild(XML_text_node(exportXML,'rowStatus',navigationItem.row_status_show))
							navItemElem.appendChild(XML_text_node(exportXML,'rowNodeExpanded',navigationItem.row_status_expanded))
							navItemElem.appendChild(XML_text_node(exportXML,'useUL',navigationItem.use_fw_list))
							navItemElem.appendChild(XML_text_node(exportXML,'titleUL',navigationItem.fw_list_title))
							navItemElem.appendChild(XML_text_node(exportXML,'sortString',navigationItem.sort_string))
							
							navItemElem.appendChild(XML_text_node(exportXML,'statusInitialForm',navigationItem.initial_form))
							navItemElem.appendChild(XML_text_node(exportXML,'statusInitialFormLabel',navigationItem.initial_form_label))
							navItemElem.appendChild(XML_text_node(exportXML,'statusInitialRecord',navigationItem.initial_record))
							navItemElem.appendChild(XML_text_node(exportXML,'statusInitialRecordLabel',navigationItem.initial_record_label))
							navItemElem.appendChild(XML_text_node(exportXML,'busyCursor',navigationItem.ul_busy_cursor))
							navItemElem.appendChild(XML_text_node(exportXML,'spaces',navigationItem.space_available))
							navItemElem.appendChild(XML_text_node(exportXML,'spaceDefault',navigationItem.space_default))
							navItemElem.appendChild(XML_text_node(exportXML,'spaceFlip',navigationItem.space_flip))
							navItemElem.appendChild(XML_text_node(exportXML,'spaceChangeMethod',navigationItem.space_method))
							
							navItemElem.appendChild(XML_text_node(exportXML,'actionULAdd',navigationItem.bar_item_add))
							navItemElem.appendChild(XML_text_node(exportXML,'actionULAction',navigationItem.bar_item_action))
							navItemElem.appendChild(XML_text_node(exportXML,'actionULFilter',navigationItem.bar_item_filter))
							navItemElem.appendChild(XML_text_node(exportXML,'actionULPrint',navigationItem.bar_item_report))
							navItemElem.appendChild(XML_text_node(exportXML,'actionULTab',navigationItem.bar_item_tab))
							
							//create xml definition for help
							var navHelpElem = exportXML.createElement('help')
							navItemElem.appendChild(navHelpElem)
							
							navHelpElem.appendChild(XML_text_node(exportXML,'enabled',navigationItem.help_available))
							navHelpElem.appendChild(XML_text_node(exportXML,'moduleFilter',navigationItem.help_module_filter))
							navHelpElem.appendChild(XML_text_node(exportXML,'formLoad',navigationItem.help_form_to_load))
							navHelpElem.appendChild(XML_text_node(exportXML,'listLoad',navigationItem.help_list_to_load))
							navHelpElem.appendChild(XML_text_node(exportXML,'description',navigationItem.help_description))
							navHelpElem.appendChild(XML_text_node(exportXML,'textColor',navigationItem.help_color_text))
							navHelpElem.appendChild(XML_text_node(exportXML,'textBackground',navigationItem.help_color_background))
							
							//create xml definition for developer notes
							var navDevNotesElem = exportXML.createElement('developerNotes')
							navItemElem.appendChild(navDevNotesElem)
							
							navDevNotesElem.appendChild(XML_text_node(exportXML,'specification',(navigationItem[relnNavDevSpec]) ? navigationItem[relnNavDevSpec].notes : ''))
							navDevNotesElem.appendChild(XML_text_node(exportXML,'task',(navigationItem[relnNavDevTask]) ? navigationItem[relnNavDevTask].notes : ''))
							
							
							//create xml definition for columnInfo
							var allColumnsElem = exportXML.createElement('columnInfo')
							navItemElem.appendChild(allColumnsElem)
							
							//copy all columns over
							for (var j = 1; j <= navigationItem[relnNavColumn].getSize() ; j++) {
								var record = navigationItem[relnNavColumn].getRecord(j)
								
								//create xml definition for this column
								
								var columnElem = exportXML.createElement('column')
								allColumnsElem.appendChild(columnElem)
								
								columnElem.setAttribute('id',application.getNewUUID())
								columnElem.setIdAttribute('id',true)
								
								columnElem.appendChild(XML_text_node(exportXML,'columnID',record.id_column))
								columnElem.appendChild(XML_text_node(exportXML,'navigationItemID',record.id_navigation_item))
								columnElem.appendChild(XML_text_node(exportXML,'statusRelation',record.status_relation))
								columnElem.appendChild(XML_text_node(exportXML,'tableOrRelation',record.table_or_relation))
								columnElem.appendChild(XML_text_node(exportXML,'columnName',record.name_column))
								columnElem.appendChild(XML_text_node(exportXML,'columnType',record.type_column))
								columnElem.appendChild(XML_text_node(exportXML,'prettyName',record.name_display))
								columnElem.appendChild(XML_text_node(exportXML,'statusFind',record.status_find))
								columnElem.appendChild(XML_text_node(exportXML,'statusNamed',record.status_named))
								columnElem.appendChild(XML_text_node(exportXML,'valueList',record.valuelist))
							}
							
							//create xml definition for universal list
							var universalListElem = exportXML.createElement('universalList')
							navItemElem.appendChild(universalListElem)
							
							if (utils.hasRecords(navigationItem[relnNavDisplay])) {
								//create xml container for displays
								var displayContainerElem = exportXML.createElement('displays')
								universalListElem.appendChild(displayContainerElem)
								
								navigationItem[relnNavDisplay].sort('row_order asc')
								
								//loop through selected UL displays, export data
								for (var j = 1; j <= navigationItem[relnNavDisplay].getSize() ; j++) {
									var displayItem = navigationItem[relnNavDisplay].getRecord(j)
									
									//create xml definition for this display
									var displayElem = exportXML.createElement('display')
									displayContainerElem.appendChild(displayElem)
									
									displayElem.setAttribute('id',application.getNewUUID())
									displayElem.setIdAttribute('id',true)
									
									displayElem.appendChild(XML_text_node(exportXML,'navigationItemID',displayItem.id_navigation_item))
									displayElem.appendChild(XML_text_node(exportXML,'listDisplayID',displayItem.id_list_display))
									displayElem.appendChild(XML_text_node(exportXML,'ulTitleOverride',displayItem.list_title))
									displayElem.appendChild(XML_text_node(exportXML,'defaultDisplay',displayItem.display_default))
									displayElem.appendChild(XML_text_node(exportXML,'rowOrder',displayItem.row_order))
									
									//create xml definition for configuration
									var displayConfigElem = exportXML.createElement('displayConfig')
									displayElem.appendChild(displayConfigElem)
									
									//display items
									if (displayItem[relnNavDisplayItem] && displayItem[relnNavDisplayItem].getSize()) {
										displayItem[relnNavDisplayItem].sort('row_order asc')
										
										//loop through selected UL display items, export data
										for (var k = 1; k <= displayItem[relnNavDisplayItem].getSize() ; k++) {
											var record = displayItem[relnNavDisplayItem].getRecord(k)
											
											//create xml definition for this display item
											var displayItemElem = exportXML.createElement('displayItem')
											displayConfigElem.appendChild(displayItemElem)
											
											displayItemElem.setAttribute('id',application.getNewUUID())
											displayItemElem.setIdAttribute('id',true)
											
											displayItemElem.appendChild(XML_text_node(exportXML,'listDisplayID',record.id_list_display))
											displayItemElem.appendChild(XML_text_node(exportXML,'listDisplayItemID',record.id_list_display_item))
											displayItemElem.appendChild(XML_text_node(exportXML,'rowOrder',record.row_order))
											displayItemElem.appendChild(XML_text_node(exportXML,'renderValue',record.display))
											displayItemElem.appendChild(XML_text_node(exportXML,'header',record.header))
											displayItemElem.appendChild(XML_text_node(exportXML,'sortBy',record.field_name))
											displayItemElem.appendChild(XML_text_node(exportXML,'width',record.display_width_percent))
											displayItemElem.appendChild(XML_text_node(exportXML,'align',record.display_align))
											var formatElem = exportXML.createElement('format')
											displayItemElem.appendChild(formatElem)
											formatElem.appendChild(XML_text_node(exportXML,'type',record.display_format))
											formatElem.appendChild(XML_text_node(exportXML,'mask',record.format_mask))
										}
									}
									
								}
							}
							
							
							//sort to make sure that sub levels of filters are 'in order'
							if (navigationItem[relnNavAction].getSize()) {
								navigationItem[relnNavAction].sort('category asc, id_action_item_parent asc, order_by asc')
							}
							
							var filterLevels = new Object()
							var actionCategory = 'Chewbacca Defense'
							var filterPrefix = new Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z')
							var filterSortA = 0
							var filterSortB = 0
							
							//container for buttons
							var buttonElem = exportXML.createElement('buttons')
							navItemElem.appendChild(buttonElem)
														
							//loop through selected actions, export data
							for (var j = 1; j <= navigationItem[relnNavAction].getSize() ; j++) {
								var record = navigationItem[relnNavAction].getRecord(j)
								
								if (record.category != actionCategory) {
									actionCategory = record.category
									
									//create xml definition container for this category
									switch (actionCategory) {
										case 'Add':
											break
										case 'Actions':
											var actionElem = exportXML.createElement('actions')
											buttonElem.appendChild(actionElem)
											break
										case 'Filters':
											var filterElem = exportXML.createElement('filters')
											buttonElem.appendChild(filterElem)
											break
										case 'Reports':
											var reportElem = exportXML.createElement('reports')
											buttonElem.appendChild(reportElem)
											break
										case 'Tabs':
											var tabElem = exportXML.createElement('tabs')
											buttonElem.appendChild(tabElem)
											break
									}
								}
								
								if (actionCategory == 'Add') {
									//create xml definition for this action item
									var addElem = exportXML.createElement('add')
									buttonElem.appendChild(addElem)
									
									addElem.appendChild(XML_text_node(exportXML,'menuName',record.menu_name))
									addElem.appendChild(XML_text_node(exportXML,'methodType',record.method_type))
									addElem.appendChild(XML_text_node(exportXML,'method',record.method))
									addElem.appendChild(XML_text_node(exportXML,'displayMethod',record.method_from_form))
									addElem.appendChild(XML_text_node(exportXML,'displayCustom',record.method_from_custom))
								}
								
								else if (actionCategory == 'Actions') {
									//create xml definition for this action item
									var actionItemElem = exportXML.createElement('action')
									actionElem.appendChild(actionItemElem)
									
									actionItemElem.setAttribute('id',application.getNewUUID())
									actionItemElem.setIdAttribute('id',true)
									
									actionItemElem.appendChild(XML_text_node(exportXML,'menuName',record.menu_name))
									actionItemElem.appendChild(XML_text_node(exportXML,'methodType',record.method_type))
									actionItemElem.appendChild(XML_text_node(exportXML,'method',record.method))
									actionItemElem.appendChild(XML_text_node(exportXML,'displayMethod',record.method_from_form))
									actionItemElem.appendChild(XML_text_node(exportXML,'displayCustom',record.method_from_custom))
									actionItemElem.appendChild(XML_text_node(exportXML,'order',record.order_by))
								}
								
								else if (actionCategory == 'Filters') {
									//keep track of uuid of filter item
									if (filterSortB == 26) {
										filterSortA++
										filterSortB = 0
									}
									var filterUUID = filterPrefix[filterSortA] + filterPrefix[filterSortB++] + '-' + application.getNewUUID()
									filterLevels[record.id_action_item] = filterUUID
									
									//create xml definition for this action item
									var filterItemElem = exportXML.createElement('filter')
									filterElem.appendChild(filterItemElem)
									
									filterItemElem.setAttribute('id',filterUUID)
									filterItemElem.setIdAttribute('id',true)
									
									filterItemElem.appendChild(XML_text_node(exportXML,'menuName',record.menu_name))
									filterItemElem.appendChild(XML_text_node(exportXML,'order',record.order_by))
									filterItemElem.appendChild(XML_text_node(exportXML,'sort',record.filter_sort))
									filterItemElem.appendChild(XML_text_node(exportXML,'limit',record.filter_limit))
									filterItemElem.appendChild(XML_text_node(exportXML,'method',record.filter_method))
									filterItemElem.appendChild(XML_text_node(exportXML,'subFilterType',record.filter_type))
									
									//if sub level, update with value of new filter
									if (record.id_action_item_parent) {
										filterItemElem.appendChild(XML_text_node(exportXML,'parentElement',filterLevels[record.id_action_item_parent]))
									}
									else {
										filterItemElem.appendChild(XML_text_node(exportXML,'parentElement',0))
									}
									
									//get selected index for relation to work
									var filterItem = navigationItem[relnNavAction].getRecord(j)
									
									//create filter specification if exists
									if (filterItem[relnNavActionFilter] && filterItem[relnNavActionFilter].getSize()) {
										var filterConfigElem = exportXML.createElement('filterConfig')
										filterItemElem.appendChild(filterConfigElem)
										
										//loop through selected filter specificiations, export data
										for (var k = 1; k <= filterItem[relnNavActionFilter].getSize() ; k++) {
											var record = filterItem[relnNavActionFilter].getRecord(k)
											
											//create xml definition for this filter specification
											var filterConfigItemElem = exportXML.createElement('filterItem')
											filterConfigElem.appendChild(filterConfigItemElem)
											
											filterConfigItemElem.setAttribute('id',application.getNewUUID())
											filterConfigItemElem.setIdAttribute('id',true)
											
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'filterType',record.filter_type))
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'method',record.method_name))
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'relation',record.column_relation))
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'columnName',record.column_name))
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'columnOperator',record.column_operator))
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'columnValue',record.column_value))
											
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'valuelist',record.valuelist))
											filterConfigItemElem.appendChild(XML_text_node(exportXML,'valuelistType',record.valuelist_type))
										}
									}
								}
								
								else if (actionCategory == 'Reports') {
									//create xml definition for this action item
									var reportItemElem = exportXML.createElement('print')
									reportElem.appendChild(reportItemElem)
									
									reportItemElem.setAttribute('id',application.getNewUUID())
									reportItemElem.setIdAttribute('id',true)
									
									reportItemElem.appendChild(XML_text_node(exportXML,'menuName',record.menu_name))
									reportItemElem.appendChild(XML_text_node(exportXML,'order',record.order_by))
									reportItemElem.appendChild(XML_text_node(exportXML,'reportID',record.id_report))
									
								}
								
								else if (actionCategory == 'Tabs') {
									//create xml definition for this action item
									var tabItemElem = exportXML.createElement('tab')
									tabElem.appendChild(tabItemElem)
									
									tabItemElem.setAttribute('id',application.getNewUUID())
									tabItemElem.setIdAttribute('id',true)
									
									tabItemElem.appendChild(XML_text_node(exportXML,'menuName',record.menu_name))
									tabItemElem.appendChild(XML_text_node(exportXML,'order',record.order_by))
									tabItemElem.appendChild(XML_text_node(exportXML,'formLoad',record.form_to_load))
									
								}
							}
						}
					}
				}
			}
			//advance progressbar updater to the next section
			currentArea += 9
		}
		//no sets
		else {
		//	plugins.dialogs.showErrorDialog('No export','No navigation sets were selected for export')
			
			//advance progressbar updater to the next section
			currentArea += 9
		}
		
	//TODO: numbers not adding up here
		//plugins.dialogs.showInfoDialog('Hello','This is the value' + globals.CALLBACK_progressbar_get()[0])
		
		//Reports node
		//
		//
		if (reportRegistry) {
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
	//TODO: numbers not adding up here
		//plugins.dialogs.showInfoDialog('Hello','This is the value' + startPosn + ', ' + endPosn)
			
			//update with what doing
			globals.CALLBACK_progressbar_set(startPosn + (startPosn / endPosn) / 2,'Adding report registry...')
			
			var reportElem = exportXML.createElement('reportRegistry')
			rootElem.appendChild(reportElem)
			
			//get report foundset
			var fsReports = databaseManager.getFoundSet(controller.getServerName(),'sutra_report')
			fsReports.loadAllRecords()
			
			//loop through all reports
			for (var i = 1; i <= fsReports.getSize(); i++) {
				var record = fsReports.getRecord(i)
				
				//create xml definition for this action
				var reportItemElem = exportXML.createElement('report')
				reportElem.appendChild(reportItemElem)
				
				//punch down uuid if this report doesn't have one
				if (record.report_uuid) {
					var reportUUID = record.report_uuid
				}
				//use uuid for this toolbar
				else {
					var reportUUID = record.report_uuid = application.getNewUUID()
				}
				
				reportItemElem.setAttribute('id',reportUUID)
				reportItemElem.setIdAttribute('id',true)
				
				reportItemElem.appendChild(XML_text_node(exportXML,'reportID',record.id_report))
				reportItemElem.appendChild(XML_text_node(exportXML,'description',record.report_description))
				reportItemElem.appendChild(XML_text_node(exportXML,'form',record.report_form))
				reportItemElem.appendChild(XML_text_node(exportXML,'method',record.report_method))
				reportItemElem.appendChild(XML_text_node(exportXML,'module',record.report_module))
				reportItemElem.appendChild(XML_text_node(exportXML,'dateCreated',record.date_created))
				reportItemElem.appendChild(XML_text_node(exportXML,'dateModified',record.date_modified))
			}
			
			currentArea++
		}
		
		
		
		//Solution node
		//
		//
		if (solConfig) {
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
			//go to midway point of solConfig's progress...not much to do here
			globals.CALLBACK_progressbar_set(startPosn + ((endPosn - startPosn) / 2),'Adding solution configuration...')
			
			var fsSolution = databaseManager.getFoundSet(controller.getServerName(),'sutra_solution')
			fsSolution.loadAllRecords()
			
			var solutionElem = exportXML.createElement('solutionDetails')
			rootElem.appendChild(solutionElem)
			
			solutionElem.appendChild(XML_text_node(exportXML,'brandingName',fsSolution.solution_name))
			solutionElem.appendChild(XML_text_node(exportXML,'brandingTagline',fsSolution.solution_tagline))
			solutionElem.appendChild(XML_text_node(exportXML,'brandingIcon',fsSolution.solution_icon))
			solutionElem.appendChild(XML_text_node(exportXML,'brandingIconTooltip',fsSolution.solution_icon_tooltip))
			solutionElem.appendChild(XML_text_node(exportXML,'brandingIconLink',fsSolution.solution_icon_url))
			
			solutionElem.appendChild(XML_text_node(exportXML,'enableBlog',fsSolution.blog_enable))
			solutionElem.appendChild(XML_text_node(exportXML,'showErrorPopup',fsSolution.error_popup))
			solutionElem.appendChild(XML_text_node(exportXML,'navigationCollapse',fsSolution.navigation_collapse_auto))
			solutionElem.appendChild(XML_text_node(exportXML,'licenseEmail',fsSolution.license_email))
			solutionElem.appendChild(XML_text_node(exportXML,'licenseKey',fsSolution.license_key))
			solutionElem.appendChild(XML_text_node(exportXML,'licenseName',fsSolution.license_name))
			solutionElem.appendChild(XML_text_node(exportXML,'disableRepository',fsSolution.repository_api))
			solutionElem.appendChild(XML_text_node(exportXML,'ulMaxRecords',fsSolution.list_maxrecs))
			solutionElem.appendChild(XML_text_node(exportXML,'ulClickDelay',fsSolution.recnav_delay))
			solutionElem.appendChild(XML_text_node(exportXML,'listBackgroundColor',fsSolution.list_color_background))
			
			solutionElem.appendChild(XML_text_node(exportXML,'startupMethod',fsSolution.method_startup))
			solutionElem.appendChild(XML_text_node(exportXML,'logoutMethod',fsSolution.method_logout))
			solutionElem.appendChild(XML_text_node(exportXML,'shutdownMethod',fsSolution.method_shutdown))
			
			solutionElem.appendChild(XML_text_node(exportXML,'findControlChar',fsSolution.find_wildcard))
			solutionElem.appendChild(XML_text_node(exportXML,'findDateFormat',fsSolution.find_dateformat))
			
			solutionElem.appendChild(XML_text_node(exportXML,'loginNone',fsSolution.login_disabled))
			
			solutionElem.appendChild(XML_text_node(exportXML,'kioskFullScreen',fsSolution.kiosk_fullscreen))
			solutionElem.appendChild(XML_text_node(exportXML,'kioskMenu',fsSolution.kiosk_menu))
			solutionElem.appendChild(XML_text_node(exportXML,'kioskStatusBar',fsSolution.kiosk_statusbar))
			solutionElem.appendChild(XML_text_node(exportXML,'kioskToolbar',fsSolution.kiosk_toolbar))
			
			solutionElem.appendChild(XML_text_node(exportXML,'windowCenter',fsSolution.location_center))
			solutionElem.appendChild(XML_text_node(exportXML,'windowX',fsSolution.location_x))
			solutionElem.appendChild(XML_text_node(exportXML,'windowY',fsSolution.location_y))
			solutionElem.appendChild(XML_text_node(exportXML,'windowHeight',fsSolution.screen_height))
			solutionElem.appendChild(XML_text_node(exportXML,'windowWidth',fsSolution.screen_width))
			
			solutionElem.appendChild(XML_text_node(exportXML,'spaceStandardH',fsSolution.space_standard_horizontal))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceStandardV',fsSolution.space_standard_vertical))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceListH',fsSolution.space_list_horizontal))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceVertcialH1',fsSolution.space_vertical_horizontal_1))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceVertcialH2',fsSolution.space_vertical_horizontal_2))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceCenteredH1',fsSolution.space_centered_horizontal_1))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceCenteredH2',fsSolution.space_centered_horizontal_2))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceClassicH',fsSolution.space_classic_horizontal))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceClassicV',fsSolution.space_classic_vertical))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceWideH',fsSolution.space_wide_horizontal))
			solutionElem.appendChild(XML_text_node(exportXML,'spaceWideV',fsSolution.space_wide_vertical))
			
			//advance progressbar updater to the next section
			currentArea++
		}
		
		
		
		//Toolbars node
		//
		//
		if (toolbar) {
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
			//update with what doing
			globals.CALLBACK_progressbar_set(startPosn + (startPosn / endPosn) / 2,'Adding toolbars...')
			
			var toolbarElem = exportXML.createElement('toolbars')
			rootElem.appendChild(toolbarElem)
			
			//get toolbar foundset
			var fsToolbar = databaseManager.getFoundSet(controller.getServerName(),'sutra_toolbar')
			fsToolbar.loadAllRecords()
			
			//loop through all toolbars
			for (var i = 1; i <= fsToolbar.getSize(); i++) {
				var record = fsToolbar.getRecord(i)
				
				//create xml definition for this action
				var toolbarItemElem = exportXML.createElement('toolbar')
				toolbarElem.appendChild(toolbarItemElem)
				
				//punch down uuid if this toolbar doesn't have one
				if (record.toolbar_uuid) {
					var toolbarUUID = record.toolbar_uuid
				}
				//use uuid for this toolbar
				else {
					var toolbarUUID = record.toolbar_uuid = application.getNewUUID()
				}
				
				toolbarItemElem.setAttribute('id',toolbarUUID)
				toolbarItemElem.setIdAttribute('id',true)
				
				toolbarItemElem.appendChild(XML_text_node(exportXML,'toolbarID',record.id_toolbar))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'description',record.description))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'tabName',record.tab_name))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'formName',record.form_name))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'module',record.module_filter))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'popAutoSize',record.pop_down_autosize))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'popFormName',record.pop_down_form))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'popHeight',record.pop_down_height))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'popEnabled',record.pop_down_show))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'popWidth',record.pop_down_width))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'visible',record.row_status_show))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'orderBy',record.row_order))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'dateCreated',record.rec_created))
				toolbarItemElem.appendChild(XML_text_node(exportXML,'dateModified',record.rec_modified))
			}
			
			currentArea++
		}
		
		
		//Tooltip node
		//
		//
		if (tooltip) {
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
			//update with what doing
			globals.CALLBACK_progressbar_set(startPosn + (startPosn / endPosn) / 2,'Adding tooltip registry...')
			
			var tooltipElem = exportXML.createElement('tooltips')
			rootElem.appendChild(tooltipElem)
			
			//get tooltip foundset
			var fsTooltips = databaseManager.getFoundSet(controller.getServerName(),'sutra_tooltip')
			fsTooltips.loadAllRecords()
			
			//loop through all tooltips
			for (var i = 1; i <= fsTooltips.getSize(); i++) {
				var record = fsTooltips.getRecord(i)
				
				//create xml definition for this tooltip
				var tooltipItemElem = exportXML.createElement('tooltip')
				tooltipElem.appendChild(tooltipItemElem)
				
				//punch down uuid if this report doesn't have one
				if (record.tooltip_uuid) {
					var tooltipUUID = record.tooltip_uuid
				}
				//use uuid for this toolbar
				else {
					var tooltipUUID = record.tooltip_uuid = application.getNewUUID()
				}
				
				tooltipItemElem.setAttribute('id',tooltipUUID)
				tooltipItemElem.setIdAttribute('id',true)
				
				tooltipItemElem.appendChild(XML_text_node(exportXML,'tooltipID',record.id_tooltip))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'dateCreated',record.date_created))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'dateModified',record.date_modified))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'element',record.element_name))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'flagHelp',record.flag_help))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'formName',record.form_name))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'language',record.i18n_language))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'help',record.inline_help))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'module',record.module_filter))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'tooltip',record.tooltip))
				tooltipItemElem.appendChild(XML_text_node(exportXML,'useHTML',record.use_html))
			}
			
			currentArea++
		}
		
		
		//Value list node
		//
		//
		if (valuelist) {
			//start/end positions for progressbar
			var startPosn = sizeArea * (currentArea - 1)
			var endPosn = sizeArea * currentArea
			
			//update with what doing
			globals.CALLBACK_progressbar_set(startPosn + (startPosn / endPosn) / 2,'Adding value list registry...')
			
			var valuelistElem = exportXML.createElement('valuelists')
			rootElem.appendChild(valuelistElem)
			
			//get report foundset
			var fsValuelists = databaseManager.getFoundSet(controller.getServerName(),'sutra_valuelist')
			fsValuelists.loadAllRecords()
			
			//loop through all reports
			for (var i = 1; i <= fsValuelists.getSize(); i++) {
				var record = fsValuelists.getRecord(i)
				
				//create xml definition for this action
				var valuelistItemElem = exportXML.createElement('valuelist')
				valuelistElem.appendChild(valuelistItemElem)
				
				//punch down uuid if this report doesn't have one
				if (record.valuelist_uuid) {
					var valuelistUUID = record.valuelist_uuid
				}
				//use uuid for this toolbar
				else {
					var valuelistUUID = record.valuelist_uuid = application.getNewUUID()
				}
				
				valuelistItemElem.setAttribute('id',valuelistUUID)
				valuelistItemElem.setIdAttribute('id',true)
				
				valuelistItemElem.appendChild(XML_text_node(exportXML,'valuelistID',record.id_valuelist))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'orderBy',record.order_by))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'relationOne',record.relation_1))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'relationTwo',record.relation_2))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'saved',record.saved))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'searchField',record.search_field))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'searchTable',record.search_table))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'name',record.valuelist_name))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'visible',record.visible))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'dateCreated',record.date_created))
				valuelistItemElem.appendChild(XML_text_node(exportXML,'dateModified',record.date_modified))
			}
			
			currentArea++
		}
		
		
		
			
		//proces xml
		var sourceXML = new Packages.javax.xml.transform.dom.DOMSource(exportXML)
		var stringWriter = new Packages.java.io.StringWriter()
		var streamResult = new Packages.javax.xml.transform.stream.StreamResult(stringWriter)
		new Packages.javax.xml.transform.TransformerFactory.newInstance().newTransformer().transform(sourceXML, streamResult)
		var stringXML = stringWriter.toString()
		
		//write temp xml file
		var XmlMF = plugins.file.createTempFile('mosaicFrameworks','.xml')
		var success = plugins.file.writeXMLFile(XmlMF, stringXML)
		
		if (success) {
			//progress updater
			globals.CALLBACK_progressbar_set(null,'Compressing data...')
			
			//zip xml and output
			XML_zip([XmlMF],zipFileName)
			
			globals.CALLBACK_progressbar_set(100,'Export complete')
			plugins.dialogs.showInfoDialog('Export complete','Selected frameworks settings have been successfully exported')
		}
		else {
			plugins.dialogs.showErrorDialog('No export','Error writing export file')
		}
	}
	//no file
	else if (!fileGood) {
		plugins.dialogs.showErrorDialog('No export','No name given for the exported file')
	}
}
else {
	plugins.dialogs.showErrorDialog('No export','Nothing selected to export')
}

globals.CALLBACK_progressbar_stop()



/*
// Create root element and append to document
var rootElem = exportXML.createElement("root")
exportXML.appendChild(rootElem)
// Insert a comment in front of the root element
var comment = exportXML.createComment("I am a comment")
exportXML.insertBefore(comment, rootElem)
// Create a child element ("child1") of the root element
var childElem = exportXML.createElement("child1")
rootElem.appendChild(childElem)
// Create an attribute for child element1
childElem.setAttribute("attr", "value")
// Add a text node to childElem
childElem.appendChild(exportXML.createTextNode("Child 1"))
*/
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"2eac4e12-5271-42db-81bb-19a480c72455"}
 */
function FORM_on_load(event)
{
	
/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	load all navigation records...except the navigation config
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *				Sept 2008 -- David Workman, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var keepSelected = arguments[0]
var selected = controller.getSelectedIndex()

//find config navigation set
foundset.find()
foundset.flag_config = 1
var results = foundset.search()

//find everything except navigation set
if (results) {
	var navSetID = foundset.id_navigation
	
	//check to make sure order by is 0
	if (typeof foundset.order_by != 'number') {
		foundset.order_by = 0
	}
	
	controller.find()
	id_navigation = '!' + navSetID
	controller.search()
	
	if (keepSelected) {
		controller.setSelectedIndex(selected)
	}
}
//set 12 to be the default navigation set
else {
	foundset.find()
	foundset.id_navigation = 12
	var results = foundset.search()
	
	//they are using my default set, set it
	if (results == 1) {
		foundset.flag_config = 1
		//check to make sure order by is 0
		if (typeof foundset.order_by != 'number') {
			foundset.order_by = 0
		}
		databaseManager.saveData()
		
		controller.find()
		id_navigation = '!12'
		controller.search()
	}
}

//if no order by present, show column, else hide
if (typeof forms.NAV_0L_navigation_1L.order_by == 'number') {
	forms.NAV_0L_navigation_1L.elements.fld_order_by.visible = false
}
else {
	forms.NAV_0L_navigation_1L.elements.fld_order_by.visible = true
	plugins.dialogs.showInfoDialog('Set order by','You must set the default sort order for navigation sets.\nNote: this is only used when A/C is disabled.','OK')
}

if (utils.hasRecords(foundset)) {
	foundset.sort('order_by asc')
}

// load tooltips from tooltip module
globals.CALLBACK_tooltip_set()


}

/**
 *
 * @properties={typeid:24,uuid:"0cf435a6-a0ac-41f5-abce-448fa4535795"}
 */
function IMPORT_engine()
{

/*
 *	TITLE    :	IMPORT_engine
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	prompt for xml file; prompt to choose sets for import
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Oct 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: smart update of nav set based on uuid

var relnGroupAction = 'ac_access_group_to_access_group_action'
var relnGroupActionAction = 'ac_access_group_action_to_access_action'
var relnGroupToolbar = 'ac_access_group_to_access_group_toolbar'
var relnGroupToolbarToolbar = 'ac_access_group_toolbar_to_toolbar'
var relnGroupUser = 'ac_access_group_to_access_user_group'
var relnGroupNav = 'ac_access_group_to_control_navigation'
var relnGroupNavSet = 'ac_control_navigation_to_navigation'
var relnGroupBlog = 'ac_access_group_to_access_group_blog'
var relnGroupBlogBlog = 'ac_access_group_blog_to_blog'
var relnBlogEntry = 'ac_blog_to_blog_entry'
var relnBlogQuote = 'ac_blog_to_blog_quote'
var relnUserGroup = 'ac_access_user_to_access_user_group'
var relnStaff = 'ac_access_organization_to_access_staff'
var relnNav = 'nav_navigation_to_navigation_item__all'
var relnNavColumn = 'nav_navigation_item_to_column'
var relnNavDisplay = 'nav_navigation_item_to_list_display'
var relnNavDisplayItem = 'nav_list_display_to_list_display_item'
var relnNavAction = 'nav_navigation_item_to_action_item'
var relnNavActionFilter = 'nav_action_item_to_action_item_filter'
var relnNavDevSpec = 'nav_navigation_item_to_specification'
var relnNavDevTask = 'nav_navigation_item_to_task'
		
	//read in xml is 20%
		//numAreas = whatImport.length
		//sizeArea = 80/numAreas
		//numAreaSize = numAreas/xxx
		//numItemSize = numAreaSize/yyy
var numAreas
var currentArea = 1
var sizeArea
var numAreaSize
var numItemSize
globals.CALLBACK_progressbar_start(0,'Importing...')

plugins.dialogs.showInfoDialog('Choose import','Choose the file containing the frameworks settings you wish to import','OK')
var importFile = plugins.file.showFileOpenDialog(1,null,false)

if (importFile) {
	var input = plugins.dialogs.showInfoDialog('Full import','Warning! This is import will overwrite all of your current data. Continue?','Yes','No')
	
	if (input == 'Yes') {
		//progress updater
		globals.CALLBACK_progressbar_set(null,'Reading in XML...')
		this.timeBegan = new Date()
		
		var zippedFiles = XML_unzip(importFile)
		var importXML = zippedFiles[0][0]
		
		//CREATE object from xml file
		var allSettings = XML_to_object(importXML)['mosaicFrameworks']
		
		var exportNode = allSettings.exportDetails
		/*
		switch (exportNode.xmlVersion) {
			case 1:	//ver 1 never worked
				
				break
			case 2:	//ver 2 was the rc6.5 version
				IMPORT_engine__ver2()
				break
			case 3:	//ver 3 was new with 2 rc2
			default:
				IMPORT_engine__ver3()
				break
		}
		*/
		
		var accessControlNode = allSettings.accessControl
		var blogNode = allSettings.blogs
		var engineNode = allSettings.frameworksEngine
		var reportNode = allSettings.reportRegistry
		var solutionNode = allSettings.solutionDetails
		var toolbarNode = allSettings.toolbars
		var tooltipNode = allSettings.tooltips
		var valuelistNode = allSettings.valuelists
		
		//TODO: here is where we throw up the option of what they can import
		//we are exporting all the areas
		var accessControl = true
		var blog = true
		var navEngine = true
		var reportRegistry = true
		var solConfig = true
		var toolbar = true
		var tooltip = true
		var valuelist = true
		
		//if something to do, run
		if (accessControl || blog || navEngine || reportRegistry || solConfig || toolbar || tooltip || valuelist) {
			
			//how the progress bar should roll along....number of things being exported
			numAreas = 15 //navigation engine gets 8
			sizeArea = 80 / numAreas
			
			
			//Access and control node
			//
			//
			if (accessControl && accessControlNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
					
				//update with what doing
				globals.CALLBACK_progressbar_set(startPosn,'Importing access and control...')
				
				if (accessControlNode.accessGroups) {
					//find out how many groups
					var groupCountTotal = 0
					for (var i in accessControlNode.accessGroups) {
						groupCountTotal++
					}
					
					//progress updater
					numAreaSize = (endPosn - startPosn) / groupCountTotal
					//numItemSize = numAreaSize / groupCountTotal
					
					var groupCount = 0
					
					//load groups foundset
					var fsGroups = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_group')
					fsGroups.loadAllRecords()
					
					//if records, delete
					if (fsGroups.getSize()) {
						fsGroups.deleteAllRecords()
						databaseManager.saveData()
					}
					
					//loop through all groups
					for (var i in accessControlNode.accessGroups) {
						//update with what doing
						globals.CALLBACK_progressbar_set(startPosn + (numAreaSize * groupCount) / 2, 'Access group: ' + accessControlNode.accessGroups[i].groupName)
						
						var groupRecord = fsGroups.getRecord(fsGroups.newRecord(false,true))
						
						groupRecord.id_group = accessControlNode.accessGroups[i].groupID
						groupRecord.group_name = accessControlNode.accessGroups[i].groupName
						groupRecord.group_notes = accessControlNode.accessGroups[i].notes
						groupRecord.log_items = accessControlNode.accessGroups[i].loggingItems
						groupRecord.login_method = accessControlNode.accessGroups[i].groupLoginMethod
						groupRecord.logout_method = accessControlNode.accessGroups[i].groupLogoutMethod
						groupRecord.login_nav_set = accessControlNode.accessGroups[i].onLoginSet
						groupRecord.login_nav_main = accessControlNode.accessGroups[i].onLoginItem
						groupRecord.login_nav_main_node = accessControlNode.accessGroups[i].onLoginNode
						groupRecord.login_nav_sub = accessControlNode.accessGroups[i].onLoginSub
						groupRecord.modes_admin = accessControlNode.accessGroups[i].modesAdmin
						groupRecord.modes_user = accessControlNode.accessGroups[i].modesUser
						groupRecord.toolbars = accessControlNode.accessGroups[i].toolbars
						
						//navigation sets for selected group
						if (accessControlNode.accessGroups[i].navigationSets) {
							//loop through all nav sets
							for (var j in accessControlNode.accessGroups[i].navigationSets) {
								var groupNavRecord = fsGroups[relnGroupNav].getRecord(fsGroups[relnGroupNav].newRecord(false,true))
								
								groupNavRecord.id_group = accessControlNode.accessGroups[i].navigationSets[j].groupID
								groupNavRecord.id_navigation = accessControlNode.accessGroups[i].navigationSets[j].navigationID
								groupNavRecord.comments = accessControlNode.accessGroups[i].navigationSets[j].comments
								groupNavRecord.flag_chosen = accessControlNode.accessGroups[i].navigationSets[j].flagChosen
							}
						}
						
						
						//progres updater, push ahead half a stop
						if (startPosn + (groupCount / groupCountTotal * (endPosn - startPosn)) <= endPosn) {
						//	globals.CALLBACK_progressbar_set(startPosn + Math.floor(numAreaSize * (groupCount - 1)) + numAreaSize / 2)
						}
						
						//actions assigned to this group
						if (accessControlNode.accessGroups[i].actions) {
							//loop through all actions
							for (var j in accessControlNode.accessGroups[i].actions) {
								var groupActionRecord = fsGroups[relnGroupAction].getRecord(fsGroups[relnGroupAction].newRecord(false,true))
								
								groupActionRecord.id_group = accessControlNode.accessGroups[i].actions[j].groupID
								groupActionRecord.id_action = accessControlNode.accessGroups[i].actions[j].actionID
								groupActionRecord.flag_chosen = accessControlNode.accessGroups[i].actions[j].flagChosen
								groupActionRecord.flag_enabled = accessControlNode.accessGroups[i].actions[j].flagEnabled
							}
						}
						
						//toolbars assigned to this group
						if (accessControlNode.accessGroups[i].toolbars) {
							//loop through all toolbars
							for (var j in accessControlNode.accessGroups[i].toolbars) {
								var groupToolbarRecord = fsGroups[relnGroupToolbar].getRecord(fsGroups[relnGroupToolbar].newRecord(false,true))
								
								groupToolbarRecord.id_group = accessControlNode.accessGroups[i].toolbars[j].groupID
								groupToolbarRecord.id_toolbar = accessControlNode.accessGroups[i].toolbars[j].toolbarID
								groupToolbarRecord.flag_chosen = accessControlNode.accessGroups[i].toolbars[j].flagChosen
							}
						}
						
						//blogs assigned to this group
						if (accessControlNode.accessGroups[i].blogs) {
							//loop through all blogs
							for (var j in accessControlNode.accessGroups[i].blogs) {
								var groupBlogRecord = fsGroups[relnGroupBlog].getRecord(fsGroups[relnGroupBlog].newRecord(false,true))
								
								groupBlogRecord.id_group = accessControlNode.accessGroups[i].blogs[j].groupID
								groupBlogRecord.id_blog = accessControlNode.accessGroups[i].blogs[j].blogID
								groupBlogRecord.flag_chosen = accessControlNode.accessGroups[i].blogs[j].flagChosen
							}
						}
						
						groupCount++
					}
					
					//users
					if (accessControlNode.accessUsers) {
						//update with what doing
						globals.CALLBACK_progressbar_set(endPosn,'Importing users...')
						
						//get foundset and delete all records
						var fsAccessUsers = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_user')
						fsAccessUsers.loadAllRecords()
						fsAccessUsers.deleteAllRecords()
						
						//loop through all users
						for (var i in accessControlNode.accessUsers) {
							var userRecord = fsAccessUsers.getRecord(fsAccessUsers.newRecord(false,true))
							
							userRecord.id_user = accessControlNode.accessUsers[i].userID
							userRecord.id_organization = accessControlNode.accessUsers[i].organizationID
							userRecord.id_staff = accessControlNode.accessUsers[i].staffID
							userRecord.user_name = accessControlNode.accessUsers[i].userName
							userRecord.user_notes = accessControlNode.accessUsers[i].notes
							userRecord.user_password = accessControlNode.accessUsers[i].password
							userRecord.user_uuid = accessControlNode.accessUsers[i].uuid
							
							userRecord.account_disabled = accessControlNode.accessUsers[i].disabled
							userRecord.date_created = (accessControlNode.accessUsers[i].dateCreated) ? new Date(accessControlNode.accessUsers[i].dateCreated) : null
							userRecord.date_modified = (accessControlNode.accessUsers[i].dateModified) ? new Date(accessControlNode.accessUsers[i].dateModified) : null
							userRecord.date_password_changed = (accessControlNode.accessUsers[i].datePassword) ? new Date(accessControlNode.accessUsers[i].datePassword) : null
							userRecord.old_passwords = accessControlNode.accessUsers[i].previousPasswords
							userRecord.pass_change_at_login = accessControlNode.accessUsers[i].passMustChangeAtNextLogin
							userRecord.pass_never_expires = accessControlNode.accessUsers[i].passNeverExpires
							userRecord.pass_unchangeable = accessControlNode.accessUsers[i].passUnchangeable
							userRecord.screen_height = accessControlNode.accessUsers[i].screenHeight
							userRecord.screen_location_center = accessControlNode.accessUsers[i].screenCenter
							userRecord.screen_location_x = accessControlNode.accessUsers[i].screenX
							userRecord.screen_location_y = accessControlNode.accessUsers[i].screenY
							userRecord.screen_width = accessControlNode.accessUsers[i].screenWidth
							userRecord.space_centered_horizontal_1 = accessControlNode.accessUsers[i].spaceCenteredH1
							userRecord.space_centered_horizontal_2 = accessControlNode.accessUsers[i].spaceCenteredH2
							userRecord.space_classic_horizontal = accessControlNode.accessUsers[i].spaceClassicH
							userRecord.space_classic_vertical = accessControlNode.accessUsers[i].spaceClassicV
							userRecord.space_list_horizontal = accessControlNode.accessUsers[i].spaceListH
							userRecord.space_standard_horizontal = accessControlNode.accessUsers[i].spaceStandardH
							userRecord.space_standard_vertical = accessControlNode.accessUsers[i].spaceStandardV
							userRecord.space_vertical_horiztonal_1 = accessControlNode.accessUsers[i].spaceVerticalH1
							userRecord.space_vertical_horizontal_2 = accessControlNode.accessUsers[i].spaceVerticalH2
							userRecord.space_wide_horizontal = accessControlNode.accessUsers[i].spaceWideH
							userRecord.space_wide_vertical = accessControlNode.accessUsers[i].spaceWideV
							
							//create all user-group merge records
							var userGroupAssigned = accessControlNode.accessUsers[i].groupsAssigned.split(',')
							
							for (var k = 0; k < userGroupAssigned.length; k++) {
								var userGroupRecord = userRecord[relnUserGroup].getRecord(userRecord[relnUserGroup].newRecord(false,true))
								
								userGroupRecord.id_group = userGroupAssigned[k]
								userGroupRecord.flag_chosen = 1
							}
						}
					}
					
					//organizations
					if (accessControlNode.accessOrganizations) {
						//update with what doing
						globals.CALLBACK_progressbar_set(null,'Importing default organizations...')
						
						//get foundsets and delete all records
						var fsOrganizations = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_organization')
						fsOrganizations.loadAllRecords()
						fsOrganizations.deleteAllRecords()
						
						//loop through all orgas
						for (var i in accessControlNode.accessOrganizations) {
							var orgRecord = fsOrganizations.getRecord(fsOrganizations.newRecord(false,true))
							
							orgRecord.id_organization = i
							orgRecord.address_1 = accessControlNode.accessOrganizations[i].addressOne
							orgRecord.address_2 = accessControlNode.accessOrganizations[i].addressTwo
							orgRecord.city = accessControlNode.accessOrganizations[i].city
							orgRecord.name_organization = accessControlNode.accessOrganizations[i].name
							orgRecord.phone_fax = accessControlNode.accessOrganizations[i].phoneFax
							orgRecord.phone_main = accessControlNode.accessOrganizations[i].phoneMain
							orgRecord.rec_created = (accessControlNode.accessOrganizations[i].dateCreated) ? new Date(accessControlNode.accessOrganizations[i].dateCreated) : null
							orgRecord.rec_modified = (accessControlNode.accessOrganizations[i].dateModified) ? new Date(accessControlNode.accessOrganizations[i].dateModified) : null
							orgRecord.state = accessControlNode.accessOrganizations[i].state
							orgRecord.url = accessControlNode.accessOrganizations[i].url
							orgRecord.zip = accessControlNode.accessOrganizations[i].postalCode
							
							//loop through all related staff
							if (accessControlNode.accessOrganizations[i].staff) {
								for (var j in accessControlNode.accessOrganizations[i].staff) {
									var staffRecord = orgRecord[relnStaff].getRecord(orgRecord[relnStaff].newRecord(false,true))
									
									staffRecord.address_1 = accessControlNode.accessOrganizations[i].staff[j].addressOne
									staffRecord.address_2 = accessControlNode.accessOrganizations[i].staff[j].addressTwo
									staffRecord.address_city = accessControlNode.accessOrganizations[i].staff[j].city
									staffRecord.address_country = accessControlNode.accessOrganizations[i].staff[j].country
									staffRecord.address_state = accessControlNode.accessOrganizations[i].staff[j].state
									staffRecord.address_zip = accessControlNode.accessOrganizations[i].staff[j].postalCode
									staffRecord.date_birth = accessControlNode.accessOrganizations[i].staff[j].dateBirth
									staffRecord.email = accessControlNode.accessOrganizations[i].staff[j].email
									staffRecord.gender = accessControlNode.accessOrganizations[i].staff[j].gender
									staffRecord.name_first = accessControlNode.accessOrganizations[i].staff[j].nameFirst
									staffRecord.name_last = accessControlNode.accessOrganizations[i].staff[j].nameLast
									staffRecord.name_middle = accessControlNode.accessOrganizations[i].staff[j].nameMiddle
									staffRecord.phone_home = accessControlNode.accessOrganizations[i].staff[j].phoneHome
									staffRecord.phone_mobile = accessControlNode.accessOrganizations[i].staff[j].phoneMobile
									//TODO finish more data points
								}
							}
						}
					
					}
					
					//filters
					if (accessControlNode.accessFilters) {
						//update with what doing
						globals.CALLBACK_progressbar_set(null,'Importing filters...')
						
						//get foundset and delete all records
						var fsAccessFilters = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_filter')
						fsAccessFilters.loadAllRecords()
						fsAccessFilters.deleteAllRecords()
						
						//loop through all filters
						for (var i in accessControlNode.accessFilters) {
							var filterRecord = fsAccessFilters.getRecord(fsAccessFilters.newRecord(false,true))
							
							filterRecord.id_filter = accessControlNode.accessFilters[i].filterID
							filterRecord.filter_database = accessControlNode.accessFilters[i].dbServer
							filterRecord.filter_table = accessControlNode.accessFilters[i].table
							filterRecord.filter_field = accessControlNode.accessFilters[i].column
							filterRecord.filter_on = accessControlNode.accessFilters[i].enabled
							filterRecord.filter_operator = accessControlNode.accessFilters[i].comparison
							filterRecord.filter_type = accessControlNode.accessFilters[i].type
							filterRecord.filter_value = accessControlNode.accessFilters[i].value
							filterRecord.filter_value_type = accessControlNode.accessFilters[i].valueType
							filterRecord.id_group = accessControlNode.accessFilters[i].groupID
						}
					}
					
					//action registry
					if (accessControlNode.actionRegistry) {
						//update with what doing
						globals.CALLBACK_progressbar_set(null,'Importing actions registry...')
						
						//get foundset and delete all records
						var fsAccessActions = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_action')
						fsAccessActions.loadAllRecords()
						fsAccessActions.deleteAllRecords()
						
						//loop through all actions
						for (var i in accessControlNode.actionRegistry) {
							var actionRecord = fsAccessActions.getRecord(fsAccessActions.newRecord(false,true))
							
							actionRecord.action_id = accessControlNode.actionRegistry[i].actionID
							actionRecord.action_name = accessControlNode.actionRegistry[i].name
							actionRecord.description = accessControlNode.actionRegistry[i].description
						}
					}
					
					//password rules
					if (accessControlNode.passwordRules) {
						//update with what doing
						globals.CALLBACK_progressbar_set(null,'Importing password rules...')
						
						//get foundset and delete all records
						var fsAccessPass = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_rules')
						fsAccessPass.loadAllRecords()
						fsAccessPass.deleteAllRecords()
						
						var passRecord = fsAccessPass.getRecord(fsAccessPass.newRecord(false,true))
						
						passRecord.alpha_case_flag = accessControlNode.passwordRules.requireUpperLower
						passRecord.alphnum_flag = accessControlNode.passwordRules.requireAlphaNum
						passRecord.expire_days = accessControlNode.passwordRules.expireDays
						passRecord.expire_flag = accessControlNode.passwordRules.requireExpire
						passRecord.idle_flag = accessControlNode.passwordRules.requireIdleKick
						passRecord.idle_time = accessControlNode.passwordRules.idleKickTime
						passRecord.length_flag = accessControlNode.passwordRules.length.requireLength
						passRecord.length_max = accessControlNode.passwordRules.length.maxChars
						passRecord.length_min = accessControlNode.passwordRules.length.minChars
						passRecord.non_alphanum_flag = accessControlNode.passwordRules.requireNonAlpha
						passRecord.not_user_name = accessControlNode.passwordRules.notUserName
						passRecord.prev_match_count = accessControlNode.passwordRules.previousPasswords
						passRecord.prev_match_flag = accessControlNode.passwordRules.notMatchPasswords
					}
					
					
					databaseManager.saveData()
				}
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			
			//Blog node
			//
			//
			if (blog && blogNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
				
				//find out how many blogs
				var blogCountTotal = 0
				for (var i in blogNode) {
					blogCountTotal++
				}
				
				//progress updater
				numAreaSize = endPosn - startPosn
				numItemSize = numAreaSize / blogCountTotal
				
				var blogCount = 0
				
				//update with what doing
				globals.CALLBACK_progressbar_set(startPosn,'Importing blogs...')
				
				//load blog foundset
				var fsBlogs = databaseManager.getFoundSet(controller.getServerName(),'sutra_blog')
				fsBlogs.loadAllRecords()
				
				//if records, delete
				if (fsBlogs.getSize()) {
					fsBlogs.deleteAllRecords()
				}
				
				//loop through all blogs
				for (var i in blogNode) {
					//update with what doing
					globals.CALLBACK_progressbar_set(startPosn + (numItemSize * blogCount) / 2)
					
					var blogRecord = fsBlogs.getRecord(fsBlogs.newRecord(false,true))
					
					blogRecord.id_blog = blogNode[i].blogID
					blogRecord.blog_uuid = i
					blogRecord.blog_author_hide = blogNode[i].hideAuthor
					blogRecord.blog_banner = blogNode[i].banner
					blogRecord.blog_date_hide = blogNode[i].hideDate
					blogRecord.blog_fixed = blogNode[i].staticEntry
					blogRecord.blog_fixed_always = blogNode[i].useStatic
					blogRecord.blog_header = blogNode[i].header
					blogRecord.blog_footer = blogNode[i].footer
					blogRecord.blog_misc = blogNode[i].misc
					blogRecord.blog_name = blogNode[i].name
					blogRecord.blog_posts = blogNode[i].displayPosts
					blogRecord.blog_visible = blogNode[i].visible
					blogRecord.quote_auto = blogNode[i].autoQuote
					blogRecord.rec_created = (blogNode[i].dateCreated) ? new Date(blogNode[i].dateCreated) : null
					blogRecord.rec_modified = (blogNode[i].dateModified) ? new Date(blogNode[i].dateModified) : null
					
					if (blogNode[i].entries) {
						//loop through all blog entries
						for (var j in blogNode[i].entries) {
							//update with what doing
						//	globals.CALLBACK_progressbar_set(startPosn + numItemSize * blogCount + (numItemSize * ()))
							
							var blogEntryRecord = fsBlogs[relnBlogEntry].getRecord(fsBlogs[relnBlogEntry].newRecord(false,true))
							
							blogEntryRecord.rec_created = (blogNode[i].entries[j].dateCreated) ? new Date(blogNode[i].entries[j].dateCreated) : null
							blogEntryRecord.rec_modified = (blogNode[i].entries[j].dateModified) ? new Date(blogNode[i].entries[j].dateModified) : null
							blogEntryRecord.blog_message = blogNode[i].entries[j].message
							blogEntryRecord.blog_posted = (blogNode[i].entries[j].datePosted) ? new Date(blogNode[i].entries[j].datePosted) : null
							blogEntryRecord.blog_title = blogNode[i].entries[j].title
							blogEntryRecord.blog_visible = blogNode[i].entries[j].visible
							blogEntryRecord.id_group = blogNode[i].entries[j].groupID
							blogEntryRecord.id_user = blogNode[i].entries[j].userID
						}
					}
					
					
					if (blogNode[i].quotes) {
						//loop through all blog quotes
						for (var j in blogNode[i].quotes) {
							var blogQuoteRecord = fsBlogs[relnBlogQuote].getRecord(fsBlogs[relnBlogQuote].newRecord(false,true))
							
							blogQuoteRecord.date_created = (blogNode[i].quotes[j].dateCreated) ? new Date(blogNode[i].quotes[j].dateCreated) : null
							blogQuoteRecord.date_modified = (blogNode[i].quotes[j].dateModified) ? new Date(blogNode[i].quotes[j].dateModified) : null
							blogQuoteRecord.date_display = (blogNode[i].quotes[j].dateDisplay) ? new Date(blogNode[i].quotes[j].dateDisplay) : null
							blogQuoteRecord.quote = blogNode[i].quotes[j].quote
							blogQuoteRecord.quote_active = blogNode[i].quotes[j].active
							blogQuoteRecord.quote_author = blogNode[i].quotes[j].author
							blogQuoteRecord.quote_default = blogNode[i].quotes[j]['default']
							blogQuoteRecord.quote_uuid = j
						}
					}
					
					blogCount++
				}
				
				databaseManager.saveData()
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			
			//Navigation engine node
			//
			//
			if (navEngine && engineNode) {
				
				//progress updater => set to place where should be
				globals.CALLBACK_progressbar_set(20,'Importing frameworks engine...')
				
				//load navigation foundset
				var navSets = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation')
				navSets.clear()
				
				var navConfig = 0
				var navDefault = 0
				
				/*
				//find config navigation set
				navSets.find()
				navSets.flag_config = 1
				var navConfig = navSets.search()
				navSets.clear()
				
				//find default navigation set
				navSets.find()
				navSets.nav_default = 1
				var navDefault = navSets.search()
				navSets.clear()
				*/
				
				//existing nav set names
				navSets.loadAllRecords()
				var navSetsExisting = new Array()
				for (var a = 1; a <= navSets.getSize() ; a++) {
					navSetsExisting[a-1] = navSets.getRecord(a)
				}
				navSets.clear()
				
				
				//get navigation sets in import
				var displayVals = new Array()
				var realVals = new Array()
				var idVals = new Array()
				for (var g in engineNode) {
					displayVals[displayVals.length] = engineNode[g].name
					realVals.push(engineNode[g].navigationID)
					idVals.push(g)
					//realVals[realVals.length] = g
				}
				
				navSets.loadAllRecords()
				navSets.deleteAllRecords()
				//databaseManager.saveData()
				
				/*
				//check navigation sets in import against those in solution
				for (var i = 0; i < realVals.length; i++) {
					navSets.find()
					navSets.id_navigation = realVals[i]
					var results = navSets.search()
					
					//highlight row
					if (results) {
						displayVals[i] = '<html><body><table><tr><td bgcolor="#FF0000" width="100%">' + displayVals[i] + '<img height="12" width="400" border="0" src="media:///spacer.gif"></td></tr></table></body></html>'
					}
				}
				navSets.clear()
				
				//set valuelists for navigation sets
				application.setValueListItems('NAV_import_navsets',displayVals,realVals)
				
				forms.NAV_P_navigation.elements.fld_what.visible = false
				forms.NAV_P_navigation.elements.fld_export_navset.visible = false
				forms.NAV_P_navigation.elements.fld_import_navset.visible = true
				forms.NAV_P_navigation.elements.fld_export_access.visible = false
				forms.NAV_P_navigation.elements.fld_import_access.visible = false
				forms.NAV_P_navigation.elements.lbl_header.text = 'Select navigation sets to import'
				application.showFormInDialog(forms.NAV_P_navigation,-1,-1,-1,-1,'Import',false,false,'fwImportExport')
			
				if (globals.NAV_import_navset) {
					var importNavSets = globals.NAV_import_navset.split('\n')
					globals.NAV_import_navset = null
				}
				
				//sets are selected to be imported
				if (importNavSets && importNavSets.length) {
				*/	
				if (true) {
					//start/end positions for progressbar
					var startPosn = 20 + sizeArea * (currentArea)
					var endPosn = 20 + sizeArea * (currentArea + 9)
					
					//progress updater
					numAreaSize = (endPosn - startPosn) / realVals.length
					
					//loop through selected navigation sets, import data
					for (var h = 0; h < realVals.length; h++) {		
						/*
						//if navigation set already exists, delete it
						var found = false
						for (var b = 0; b < navSetsExisting.length && !found; b++) {
							if (navSetsExisting[b].nav_uuid in engineNode) {
								found = true
								for (var c = 1; c < navSetsExisting[b].foundset.getSize() && !thisIndex; c++) {
									if (navSetsExisting[b].foundset.getRecord(c).nav_uuid) {
										var thisIndex = c
									}
								}
								navSetsExisting[b].foundset.deleteRecord(thisIndex)
								databaseManager.saveData()
							}
						}
						*/
						//progress updater
						globals.CALLBACK_progressbar_set(startPosn + numAreaSize * (h - 1),'Creating records for navigation set: ' + engineNode[idVals[h]].name)
						
						//create record for this navigation set
						var navSetRecord = navSets.getRecord(navSets.newRecord(false,true))
						
						navSetRecord.id_navigation = engineNode[idVals[h]].navigationID
						navSetRecord.nav_uuid = engineNode[idVals[h]].navUUID
						navSetRecord.nav_name = engineNode[idVals[h]].name
						navSetRecord.nav_status = engineNode[idVals[h]].status
						navSetRecord.nav_description = engineNode[idVals[h]].description
						navSetRecord.nav_default = (navDefault) ? 0 : engineNode[idVals[h]]['default']
						navSetRecord.flag_config = (navConfig) ? 0 : engineNode[idVals[h]].flagConfig
						
						//check that there are items to add
						if (engineNode[idVals[h]].navigationItems) {
							
							var navItems = engineNode[idVals[h]].navigationItems
							
							//find out how many navItems
							var navItemCountTotal = 0
							for (var i in navItems) {
								navItemCountTotal++
							}
							
							//progress updater
							numItemSize = numAreaSize / navItemCountTotal
							var navItemCount = 0
							var itemTenth = 1 / 10
								
							//loop through selected navigation items, import data
							for (var i in navItems) {
								navItemCount++
								
								//progres updater size updated at most every 10 percent of navigation set
								if ((navItemCount / navItemCountTotal) > itemTenth) {
									globals.CALLBACK_progressbar_set(startPosn + Math.floor(Math.floor(numAreaSize * (h - 1) + numItemSize * navItemCount)))
									itemTenth = Math.floor(10 * (navItemCount / navItemCountTotal)) / 10
								}
								
								//create record for this navItem
								var navItemRecord = navSets[relnNav].getRecord(navSets[relnNav].newRecord(false,true))
								
								navItemRecord.config_type = navItems[i].configType
								navItemRecord.item_name = navItems[i].itemName
								navItemRecord.item_id = navItems[i].itemID
								navItemRecord.module_filter = navItems[i].moduleFilter
								navItemRecord.form_to_load = navItems[i].formLoad
								navItemRecord.list_to_load = navItems[i].listLoad
								navItemRecord.form_to_load_table = navItems[i].formLoadTable
								navItemRecord.description = navItems[i].description
								navItemRecord.node_1 = navItems[i].nodeOne
								navItemRecord.node_2 = navItems[i].nodeTwo
								navItemRecord.row_status_show = navItems[i].rowStatus
								navItemRecord.row_status_expanded = navItems[i].rowNodeExpanded
								navItemRecord.use_fw_list = navItems[i].useUL
								navItemRecord.fw_list_title = navItems[i].titleUL
								navItemRecord.sort_string = navItems[i].sortString
								
								
								navItemRecord.initial_form = navItems[i].statusInitialForm
								navItemRecord.inital_form_lable = navItems[i].statusInitialFormLabel
								navItemRecord.initial_record = navItems[i].statusInitialRecord
								navItemRecord.initial_record_label = navItems[i].statusInitialRecordLabel
								navItemRecord.ul_busy_cursor = navItems[i].busyCursor
								navItemRecord.space_available = navItems[i].spaces
								navItemRecord.space_default = navItems[i].spaceDefault
								navItemRecord.space_flip = navItems[i].spaceFlip
								navItemRecord.space_method = navItems[i].spaceChangedMethod
								
								navItemRecord.bar_item_add = navItems[i].actionULAdd
								navItemRecord.bar_item_action = navItems[i].actionULAction
								navItemRecord.bar_item_filter = navItems[i].actionULFilter
								navItemRecord.bar_item_report = navItems[i].actionULPrint
								navItemRecord.bar_item_tab = navItems[i].actionULTab
								
								//help info
								navItemRecord.help_available = navItems[i].help.enabled
								navItemRecord.help_module_filter = navItems[i].help.moduleFilter
								navItemRecord.help_form_to_load = navItems[i].help.formLoad
								navItemRecord.help_list_to_load = navItems[i].help.listLoad
								navItemRecord.help_description = navItems[i].help.description
								navItemRecord.help_color_text = navItems[i].help.textColor
								navItemRecord.help_color_background = navItems[i].help.textBackground
								
								//create records for developer notes if they have values
								if (navItems[i].developerNotes.specification) {
									var specRecord = navSets[relnNav][relnNavDevSpec].getRecord(navSets[relnNav][relnNavDevSpec].newRecord(false,true))
									specRecord.notes = navItems[i].developerNotes.specification
								}
								if (navItems[i].developerNotes.task) {
									var taskRecord = navSets[relnNav][relnNavDevTask].getRecord(navSets[relnNav][relnNavDevTask].newRecord(false,true))
									taskRecord.notes = navItems[i].developerNotes.task
								}
								
								
								var columnItems = navItems[i].columnInfo
								if (columnItems) {
									//copy all columns over
									for (var j in columnItems) {
										
										//create record for this column
										var columnItem = navSets[relnNav][relnNavColumn].getRecord(navSets[relnNav][relnNavColumn].newRecord(false,true))
										
										columnItem.status_relation = columnItems[j].statusRelation
										columnItem.table_or_relation = columnItems[j].tableOrRelation
										columnItem.name_column = columnItems[j].columnName
										columnItem.type_column = columnItems[j].columnType
										columnItem.name_display = columnItems[j].prettyName
										columnItem.status_find = columnItems[j].statusFind
										columnItem.status_named = columnItems[j].statusNamed
										columnItem.valuelist = columnItems[j].valueList
									}
								}
								
								var UL = navItems[i].universalList
								
								if (UL) {
									//if displays
									if (UL.displays) {
										//loop through selected UL displays, import data
										for (var j in UL.displays) {
											
											//create record for this display
											var display = navSets[relnNav][relnNavDisplay].getRecord(navSets[relnNav][relnNavDisplay].newRecord(false,true))
											
											display.list_title = UL.displays[j].ulTitleOverride
											display.display_default = UL.displays[j].defaultDisplay
											display.row_order = UL.displays[j].rowOrder
											
											var columnUL = UL.displays[j].displayConfig
											//if there are columns in this display (display items)
											if (columnUL) {
												//loop through selected UL display items, import data
												for (var k in columnUL) {
													
													//create record for this display item
													var displayColumn = navSets[relnNav][relnNavDisplay][relnNavDisplayItem].getRecord(navSets[relnNav][relnNavDisplay][relnNavDisplayItem].newRecord(false,true))
													
													displayColumn.row_order = columnUL[k].rowOrder
													displayColumn.display = columnUL[k].renderValue
													displayColumn.header = columnUL[k].header
													displayColumn.field_name = columnUL[k].sortBy
													displayColumn.display_width_percent = columnUL[k].width
													displayColumn.display_align = columnUL[k].align
													displayColumn.display_format = columnUL[k].format.type
													displayColumn.format_mask = columnUL[k].format.mask
												}
											}
										}
									}
								}
								
								if (navItems[i].buttons) {
									//loop through available actions, import data
										
									if (navItems[i].buttons.add) {
										var addSpecs = navItems[i].buttons.add
										
										//create record for this action item
										var actionRecord = navSets[relnNav][relnNavAction].getRecord(navSets[relnNav][relnNavAction].newRecord(false,true))
										
										actionRecord.category = 'Add'
										actionRecord.menu_name = addSpecs.menuName
										actionRecord.method_type = addSpecs.methodType
										actionRecord.method = addSpecs.method
										actionRecord.method_from_form = addSpecs.displayMethod
										actionRecord.method_from_custom = addSpecs.displayCustom
									}
									
									if (navItems[i].buttons.actions) {
										var actionSpecs = navItems[i].buttons.actions
										
										//loop through all actions
										for (var j in actionSpecs) {
											//create record for this action item
											var actionRecord = navSets[relnNav][relnNavAction].getRecord(navSets[relnNav][relnNavAction].newRecord(false,true))
											
											actionRecord.category = 'Actions'
											actionRecord.menu_name = actionSpecs[j].menuName
											actionRecord.method_type = actionSpecs[j].methodType
											actionRecord.method = actionSpecs[j].method
											actionRecord.method_from_form = actionSpecs[j].displayMethod
											actionRecord.method_from_custom = actionSpecs[j].displayCustom
											actionRecord.order_by = actionSpecs[j].order
										}
									}
									
									if (navItems[i].buttons.filters) {
										var filterSpecs = navItems[i].buttons.filters
										
										//put all objects into an array
										var sortedFilters = new Array()
										for (var j in filterSpecs) {
											sortedFilters[sortedFilters.length] = filterSpecs[j]
											sortedFilters[sortedFilters.length-1].id = j
										}
										//sort array by id
										globals.CODE_ddarray_field = 'id'
										sortedFilters.sort(globals.CODE_sort_dd_array)
										//reassign sorted values into object
										filterSpecs = sortedFilters
										
										//loop through all filters
										for (var j = 0; j < filterSpecs.length; j++) {
											//create record for this action item
											var actionRecord = navSets[relnNav][relnNavAction].getRecord(navSets[relnNav][relnNavAction].newRecord(false,true))
											
											//track new record id so sub filters can hook back up
											filterSpecs[j].actionItemID = actionRecord.id_action_item
											
											actionRecord.category = 'Filters'
											actionRecord.menu_name = filterSpecs[j].menuName
											actionRecord.order_by = filterSpecs[j].order
											actionRecord.filter_sort = filterSpecs[j].sort
											actionRecord.filter_limit = filterSpecs[j].limit
											actionRecord.filter_method = filterSpecs[j].method
											actionRecord.filter_type = filterSpecs[j].subFilterType
											
											//if sub level, update with value of new filter
											if (filterSpecs[j].parentElement) {
												if (filterSpecs[j].parentElement != 0) {
													actionRecord.id_action_item_parent = navItems[i].buttons.filters[filterSpecs[j].parentElement].actionItemID
												}
												else {
													actionRecord.id_action_item_parent = 0
												}
											}
											
											//create filter specification if exists
											if (filterSpecs[j].filterConfig) {
												var filterSpecItems = filterSpecs[j].filterConfig
												
												//loop through selected filter specificiations, import data
												for (var k in filterSpecItems) {
													
													//create record for this filter specification
													var filterRecord = navSets[relnNav][relnNavAction][relnNavActionFilter].getRecord(navSets[relnNav][relnNavAction][relnNavActionFilter].newRecord(false,true))
													
													filterRecord.id_action_item = actionRecord.id_action_item
													filterRecord.filter_type = filterSpecItems[k].filterType
													filterRecord.method_name = filterSpecItems[k].method
													filterRecord.column_relation = filterSpecItems[k].relation
													filterRecord.column_name = filterSpecItems[k].columnName
													filterRecord.column_operator = filterSpecItems[k].columnOperator
													filterRecord.column_value = filterSpecItems[k].columnValue
													
													filterRecord.valuelist = filterSpecItems[k].valuelist
													filterRecord.valuelist_type = filterSpecItems[k].valuelistType
												}
											}
										}
									}
									
									if (navItems[i].buttons.reports) {
										var printSpecs = navItems[i].buttons.reports
										
										//loop through all actions
										for (var j in printSpecs) {
										
											//create record for this action item
											var actionRecord = navSets[relnNav][relnNavAction].getRecord(navSets[relnNav][relnNavAction].newRecord(false,true))
											
											actionRecord.category = 'Reports'
											actionRecord.menu_name = printSpecs[j].menuName
											actionRecord.order_by = printSpecs[j].order
											actionRecord.id_report = printSpecs[j].reportID
										}
									}
									
									if (navItems[i].buttons.tabs) {
										var tabSpecs = navItems[i].buttons.tabs
										
										//loop through all actions
										for (var j in tabSpecs) {
										
											//create record for this action item
											var actionRecord = navSets[relnNav][relnNavAction].getRecord(navSets[relnNav][relnNavAction].newRecord(false,true))
											
											actionRecord.category = 'Tabs'
											actionRecord.menu_name = tabSpecs[j].menuName
											actionRecord.order_by = tabSpecs[j].order
											actionRecord.form_to_load = tabSpecs[j].formLoad
										}
									}
								}
							}
						}
						databaseManager.saveData()
					}
					
					//reload navigation sets into form
					FORM_on_load()
					
					//advance progressbar updater to the next section
					currentArea += 9
				}
				else {
					//advance progressbar updater to the next section
					currentArea += 9
					
				//	plugins.dialogs.showErrorDialog('No import','No navigation sets were selected for import')
				}
			}
			
			//Report node
			//
			//
			if (reportRegistry && reportNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
				
				//go to midway point...not much to do here
				globals.CALLBACK_progressbar_set(startPosn + ((endPosn - startPosn) / 2),'Importing report registry...')
				
				//load report foundset
				var fsReports = databaseManager.getFoundSet(controller.getServerName(),'sutra_report')
				fsReports.loadAllRecords()
				
				//if records, delete
				if (fsReports.getSize()) {
					fsReports.deleteAllRecords()
				}
				
				//loop through all reports
				for (var i in reportNode) {
					var reportRecord = fsReports.getRecord(fsReports.newRecord(false,true))
					
					reportRecord.id_report = reportNode[i].reportID
					reportRecord.report_description = reportNode[i].description
					reportRecord.report_form = reportNode[i].form
					reportRecord.report_method = reportNode[i].method
					reportRecord.report_module = reportNode[i].module
					reportRecord.date_created = (reportNode[i].dateCreated) ? new Date(reportNode[i].dateCreated) : null
					reportRecord.date_modified = (reportNode[i].dateModified) ? new Date(reportNode[i].dateModified) : null
				}
				
				databaseManager.saveData()
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			
			//Solution configuration node
			//
			//
			if (solConfig && solutionNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
				
				//go to midway point of solConfig's progress...not much to do here
				globals.CALLBACK_progressbar_set(startPosn + ((endPosn - startPosn) / 2),'Importing solution configuration...')
				
				//load solution foundset
				var fsSolution = databaseManager.getFoundSet(controller.getServerName(),'sutra_solution')
				fsSolution.loadAllRecords()
				
				//if no records, create one
				if (!fsSolution.getSize()) {
					var solutionRecord = fsSolution.getRecord(fsSolution.newRecord(false,true))
				}
				else  {
					var solutionRecord = fsSolution.getRecord(1)
				}
				
				solutionRecord.solution_name = solutionNode.brandingName
				solutionRecord.solution_tagline = solutionNode.brandingTagline
				solutionRecord.icon = solutionNode.brandingIcon
				solutionRecord.icon_tooltip = solutionNode.brandingIconTooltip
				solutionRecord.icon_url = solutionNode.brandingIconLink
				
				solutionRecord.blog_enable = solutionNode.enableBlog
				solutionRecord.error_popup = solutionNode.showErrorPopup
				solutionRecord.navigation_collapse_auto = solutionNode.navigationCollapse
				solutionRecord.license_email = solutionNode.licenseEmail
				solutionRecord.license_key = solutionNode.licenseKey
				solutionRecord.license_name = solutionNode.licenseName
				solutionRecord.repository_api = solutionNode.disableRepository
				solutionRecord.list_maxrecs = solutionNode.ulMaxRecords
				solutionRecord.recnav_delay = solutionNode.ulClickDelay
				solutionRecord.list_color_background = solutionNode.listBackgroundColor
				
				solutionRecord.method_startup = solutionNode.startupMethod
				solutionRecord.method_logout = solutionNode.logoutMethod
				solutionRecord.method_shutdown = solutionNode.shutdownMethod
				
				solutionRecord.find_wildcard = solutionNode.findControlChar
				solutionRecord.find_dateformat = solutionNode.findDateFormat
				
				solutionRecord.login_disabled = solutionNode.loginNone
				
				solutionRecord.kiosk_fullscreen = solutionNode.kioskFullScreen
				solutionRecord.kiosk_menu = solutionNode.kioskMenu
				solutionRecord.kiosk_statusbar = solutionNode.kioskStatusBar
				solutionRecord.kiosk_toolbar = solutionNode.kioskToolbar
				
				solutionRecord.location_center = solutionNode.windowCenter
				solutionRecord.location_x = solutionNode.windowX
				solutionRecord.location_y = solutionNode.windowY
				solutionRecord.screen_height = solutionNode.windowHeight
				solutionRecord.screen_width = solutionNode.windowWidth
				
				solutionRecord.space_standard_horizontal = solutionNode.spaceStandardH
				solutionRecord.space_standard_vertical = solutionNode.spaceStandardV
				solutionRecord.space_list_horizontal = solutionNode.spaceListH
				solutionRecord.space_vertical_horizontal_1 = solutionNode.spaceVerticalH1
				solutionRecord.space_vertical_horizontal_2 = solutionNode.spaceVerticalH2
				solutionRecord.space_centered_horizontal_1 = solutionNode.spaceCenteredH1
				solutionRecord.space_centered_horizontal_2 = solutionNode.spaceCenteredH2
				solutionRecord.space_classic_horizontal = solutionNode.spaceClassicH
				solutionRecord.space_classic_vertical = solutionNode.spaceClassicV
				solutionRecord.space_wide_horizontal = solutionNode.spaceWideH
				solutionRecord.space_wide_vertical = solutionNode.spaceWideV
				
				databaseManager.saveData()
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			//Toolbar node
			//
			//
			if (toolbar && toolbarNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
				
				//go to midway point...not much to do here
				globals.CALLBACK_progressbar_set(startPosn + ((endPosn - startPosn) / 2),'Importing toolbars...')
				
				//load toolbar foundset
				var fsToolbar = databaseManager.getFoundSet(controller.getServerName(),'sutra_toolbar')
				fsToolbar.loadAllRecords()
				
				//if records, delete
				if (fsToolbar.getSize()) {
					fsToolbar.deleteAllRecords()
				}
				
				//get toolbars in import
				var toolbarImport = new Array()
				for (var g in toolbarNode) {
					toolbarImport.push(toolbarNode[g])
				}
				//sort toolbars by order
				globals.CODE_ddarray_field = 'orderBy'
				toolbarImport.sort(globals.CODE_sort_dd_array)
				
				//loop through all toolbars
				for (var i = 0; i < toolbarImport.length; i++) {
					var toolbarRecord = fsToolbar.getRecord(fsToolbar.newRecord(false,true))
					
					toolbarRecord.id_toolbar = toolbarImport[i].toolbarID
					toolbarRecord.description = toolbarImport[i].description
					toolbarRecord.tab_name = toolbarImport[i].tabName
					toolbarRecord.form_name = toolbarImport[i].formName
					toolbarRecord.module_filter = toolbarImport[i].moduel
					toolbarRecord.pop_down_autosize = toolbarImport[i].popAutoSize
					toolbarRecord.pop_down_form = toolbarImport[i].popFormName
					toolbarRecord.pop_down_height = toolbarImport[i].popHeight
					toolbarRecord.pop_down_show = toolbarImport[i].popEnabled
					toolbarRecord.pop_down_width = toolbarImport[i].popWidth
					toolbarRecord.row_status_show = toolbarImport[i].visible
					toolbarRecord.row_order = toolbarImport[i].orderBy
					toolbarRecord.rec_created = (toolbarImport[i].dateCreated) ? new Date(toolbarImport[i].dateCreated) : null
					toolbarRecord.rec_modified = (toolbarImport[i].dateModified) ? new Date(toolbarImport[i].dateModified) : null
				}
				
				databaseManager.saveData()
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			//Tooltip node
			//
			//
			if (tooltip && tooltipNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
				
				//go to midway point...not much to do here
				globals.CALLBACK_progressbar_set(startPosn + ((endPosn - startPosn) / 2),'Importing tooltip registry...')
				
				//load tooltip foundset
				var fsTooltips = databaseManager.getFoundSet(controller.getServerName(),'sutra_tooltip')
				fsTooltips.loadAllRecords()
				
				//if records, delete
				if (fsTooltips.getSize()) {
					fsTooltips.deleteAllRecords()
				}
				
				//loop through all tooltips
				for (var i in tooltipNode) {
					var tooltipRecord = fsTooltips.getRecord(fsTooltips.newRecord(false,true))
					
					tooltipRecord.date_created = (tooltipNode[i].dateCreated) ? new Date(tooltipNode[i].dateCreated) : null
					tooltipRecord.date_modifed = (tooltipNode[i].dateModified) ? new Date(tooltipNode[i].dateModified) : null
					tooltipRecord.element_name = tooltipNode[i].element
					tooltipRecord.flag_help = tooltipNode[i].flagHelp
					tooltipRecord.form_name = tooltipNode[i].formName
					tooltipRecord.i18n_language = tooltipNode[i].language
					tooltipRecord.inline_help = tooltipNode[i].help
					tooltipRecord.module_filter = tooltipNode[i].module
					tooltipRecord.tooltip = tooltipNode[i].tooltip
					tooltipRecord.use_html = tooltipNode[i].useHTML
				}
				
				databaseManager.saveData()
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			//Valuelist node
			//
			//
			if (valuelist && valuelistNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
				
				//go to midway point...not much to do here
				globals.CALLBACK_progressbar_set(startPosn + ((endPosn - startPosn) / 2),'Importing value list registry...')
				
				//load valuelist foundset
				var fsValuelists = databaseManager.getFoundSet(controller.getServerName(),'sutra_valuelist')
				fsValuelists.loadAllRecords()
				
				//if records, delete
				if (fsValuelists.getSize()) {
					fsValuelists.deleteAllRecords()
				}
				
				//loop through all valuelists
				for (var i in valuelistNode) {
					var valuelistRecord = fsValuelists.getRecord(fsValuelists.newRecord(false,true))
					
					valuelistRecord.date_created = (valuelistNode[i].dateCreated) ? new Date(valuelistNode[i].dateCreated) : null
					valuelistRecord.date_modified = (valuelistNode[i].dateModified) ? new Date(valuelistNode[i].dateModified) : null
					valuelistRecord.order_by = valuelistNode[i].orderBy
					valuelistRecord.relation_1 = valuelistNode[i].relationOne
					valuelistRecord.relation_2 = valuelistNode[i].relationTwo
					valuelistRecord.saved = valuelistNode[i].saved
					valuelistRecord.search_field = valuelistNode[i].searchField
					valuelistRecord.search_table = valuelistNode[i].searchTable
					valuelistRecord.valuelist_name = valuelistNode[i].name
					valuelistRecord.visible = valuelistNode[i].visible
				}
				
				databaseManager.saveData()
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			plugins.dialogs.showInfoDialog('Import success','You have imported the frameworks settings')
		}
	}
}
else {
	plugins.dialogs.showErrorDialog('No import','No file selected for import')
}


globals.CALLBACK_progressbar_stop()

}

/**
 *
 * @properties={typeid:24,uuid:"bc6ff2d5-ee0e-468f-b10e-04224dcc03c6"}
 */
function IMPORT_engine__ver2()
{

/*
 *	TITLE    :	IMPORT_engine
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	prompt for xml file; prompt to choose sets for import
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: smart update of nav set based on uuid

var relnName = 'nav_navigation_to_navigation_item__all'
var relnNameColumn = 'nav_navigation_item_to_column'
var relnNameDisplay = 'nav_navigation_item_to_list_display'
var relnNameDisplayItem = 'nav_list_display_to_list_display_item'
var relnNameAction = 'nav_navigation_item_to_action_item'
var relnNameActionFilter = 'nav_action_item_to_action_item_filter'
var relnNameDevSpec = 'nav_navigation_item_to_specification'
var relnNameDevTask = 'nav_navigation_item_to_task'

//progress bar rations
	//read in xml is 20%
		//numSetSize = 20/navsets
		//numItemSize = numSetSize/navItems
	//create records is 80%
		//numSetSize = 80/navsets
		//numItemSize = numSetSize/navItems
var numSetSize
var numItemSize
//var progressLabel = forms.DEV_0F_solution__import_export.elements.lbl_progress
//var progressBean = forms.DEV_0F_solution__import_export.elements.bean_progress
globals.CALLBACK_progressbar_start(0,'Importing...')

plugins.dialogs.showInfoDialog('Choose import','Choose the file containing the navigation sets you wish to import','OK')
var importFile = plugins.file.showFileOpenDialog(1,null,false)

if (importFile) {
	//progress updater
	globals.CALLBACK_progressbar_start(0,'Reading in XML...')
	this.timeBegan = new Date()
	
	var zippedFiles = XML_unzip(importFile)
	var importXML = zippedFiles[0][0]
	
	//CREATE object from xml file
	var allSettings= solutionPrefs.lastXML = XML_to_object(importXML)['mosaicFrameworks']
	
	var navEngine = allSettings.navigationEngine
	var frameworksExport = allSettings.exportDetails
	var frameworksSolution = allSettings.solutionDetails
	
	//Navigation engine node
	//
	//
	
	
	//load navigation foundset
	var navSets = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation')
	navSets.clear()
	
	//find config navigation set
	navSets.find()
	navSets.flag_config = 1
	var navConfig = navSets.search()
	
	navSets.clear()
	
	//find default navigation set
	navSets.find()
	navSets.nav_default = 1
	var navDefault = navSets.search()
	
	navSets.clear()
	
	//existing nav set names
	navSets.loadAllRecords()
	var navSetsExisting = new Array()
	for (var a = 1; a <= navSets.getSize() ; a++) {
		var record = navSets.getRecord(a)
		navSetsExisting[a-1] = record.nav_name
	}
	
	navSets.clear()
	
	//progress updater
	globals.CALLBACK_progressbar_set(20)
	
	//ask which navigation sets to import
	var displayVals = new Array()
	var realVals = new Array()
	for (var g in navEngine) {
		displayVals[displayVals.length] = navEngine[g].name
		realVals[realVals.length] = g
	}
	application.setValueListItems('NAV_import_navsets',displayVals,realVals)
	
	forms.NAV_P_navigation.elements.fld_what.visible = false
	forms.NAV_P_navigation.elements.fld_export_navset.visible = false
	forms.NAV_P_navigation.elements.fld_import_navset.visible = true
	forms.NAV_P_navigation.elements.fld_export_access.visible = false
	forms.NAV_P_navigation.elements.fld_import_access.visible = false
	forms.NAV_P_navigation.elements.lbl_header.text = 'Select navigation sets to import'
	application.showFormInDialog(forms.NAV_P_navigation,-1,-1,-1,-1,'Import',false,false,'fwImportExport')

	if (globals.NAV_import_navset) {
		var importNavSets = globals.NAV_import_navset.split('\n')
		globals.NAV_import_navset = null
	}
	
	//sets are selected to be imported
	if (importNavSets && importNavSets.length) {
		
		//progress updater
		numSetSize = 80 / importNavSets.length
		
		//loop through selected navigation sets, import data
		for (var h = 0; h < importNavSets.length; h++) {		
			
			//prompt to rename navigation set if already exists
			var found = false
			for (var b = 0; b < navSetsExisting.length && !found; b++) {
				if (navSetsExisting[b] == navEngine[importNavSets[h]].name) {
					found = true
					var newName = plugins.dialogs.showInputDialog('Rename navigation set','A navigation set named ' + navSetsExisting[b] + ' already exists.  Please rename',navSetsExisting[b])
				}
			}
			
			//progress updater
			globals.CALLBACK_progressbar_set(null,'Creating records for navigation set... ' + ((found && newName) ? newName : navEngine[importNavSets[h]].name))
			if (globals.CALLBACK_progressbar_get()[0] < 20 + Math.floor(numSetSize * (h))) {
				globals.CALLBACK_progressbar_set(20 + Math.floor(numSetSize * (h)))
			}
			
			//create record for this navigation set
			var navSetRecord = navSets.getRecord(navSets.newRecord(false,true))
			
			navSetRecord.nav_name = (found && newName) ? newName : navEngine[importNavSets[h]].name
			navSetRecord.nav_status = navEngine[importNavSets[h]].status
			navSetRecord.nav_description = navEngine[importNavSets[h]].description
			navSetRecord.nav_default = (navDefault) ? 0 : navEngine[importNavSets[h]]['default']
			navSetRecord.flag_config = (navConfig) ? 0 : navEngine[importNavSets[h]].flagConfig
			
			//check that there are items to add
			if (navEngine[importNavSets[h]].navigationItems) {
				
				var navItems = navEngine[importNavSets[h]].navigationItems
				
				//find out how many navItems
				var navItemCountTotal = 0
				for (var i in navItems) {
					navItemCountTotal++
				}
				
				//progress updater
				numItemSize = numSetSize / navItemCountTotal
				var navItemCount = 0
				
				//loop through selected navigation items, import data
				for (var i in navItems) {
					//progres updater size updated every 4 percent
					if (globals.CALLBACK_progressbar_get()[0] + 4 <= 20 + Math.floor(numSetSize * h + numItemSize * navItemCount++)) {
						globals.CALLBACK_progressbar_set(20 + Math.floor(numSetSize * h + numItemSize * navItemCount))
					}
					
					//create record for this navItem
					var navItemRecord = navSets[relnName].getRecord(navSets[relnName].newRecord(false,true))
					
					navItemRecord.config_type = navItems[i].configType
					navItemRecord.item_name = navItems[i].itemName
					navItemRecord.item_id = navItems[i].itemID
					navItemRecord.module_filter = navItems[i].moduleFilter
					navItemRecord.form_to_load = navItems[i].formLoad
					navItemRecord.list_to_load = navItems[i].listLoad
					navItemRecord.form_to_load_table = navItems[i].formLoadTable
					navItemRecord.description = navItems[i].description
					navItemRecord.node_1 = navItems[i].nodeOne
					navItemRecord.node_2 = navItems[i].nodeTwo
					navItemRecord.row_status_show = navItems[i].rowStatus
					navItemRecord.row_status_expanded = navItems[i].rowNodeExpanded
					navItemRecord.use_fw_list = navItems[i].useUL
					navItemRecord.fw_list_title = navItems[i].titleUL
					navItemRecord.bar_item_add = navItems[i].actionULAdd
					navItemRecord.bar_item_action = navItems[i].actionULAction
					navItemRecord.bar_item_filter = navItems[i].actionULFilter
					navItemRecord.bar_item_report = navItems[i].actionULPrint
					navItemRecord.bar_item_tab = navItems[i].actionULTab
					
					//help info
					navItemRecord.help_available = navItems[i].help.enabled
					navItemRecord.help_module_filter = navItems[i].help.moduleFilter
					navItemRecord.help_form_to_load = navItems[i].help.formLoad
					navItemRecord.help_list_to_load = navItems[i].help.listLoad
					navItemRecord.help_description = navItems[i].help.description
					navItemRecord.help_color_text = navItems[i].help.textColor
					navItemRecord.help_color_background = navItems[i].help.textBackground
					
					//create records for developer notes if they have values
					if (navItems[i].developerNotes.specification) {
						var specRecord = navSets[relnName][relnNameDevSpec].getRecord(navSets[relnName][relnNameDevSpec].newRecord(false,true))
						specRecord.notes = navItems[i].developerNotes.specification
					}
					if (navItems[i].developerNotes.task) {
						var taskRecord = navSets[relnName][relnNameDevTask].getRecord(navSets[relnName][relnNameDevTask].newRecord(false,true))
						taskRecord.notes = navItems[i].developerNotes.task
					}
					
					
					var columnItems = navItems[i].columnInfo
					if (columnItems) {
						//copy all columns over
						for (var j in columnItems) {
							
							//create record for this column
							var columnItem = navSets[relnName][relnNameColumn].getRecord(navSets[relnName][relnNameColumn].newRecord(false,true))
							
							columnItem.status_relation = columnItems[j].statusRelation
							columnItem.table_or_relation = columnItems[j].tableOrRelation
							columnItem.name_column = columnItems[j].columnName
							columnItem.type_column = columnItems[j].columnType
							columnItem.name_display = columnItems[j].prettyName
							columnItem.status_find = columnItems[j].statusFind
							columnItem.status_named = columnItems[j].statusNamed
							columnItem.valuelist = columnItems[j].valueList
						}
					}
					
					var UL = navItems[i].universalList
					if (UL) {
						//loop through selected UL displays, import data
						for (var j in UL) {
							
							//create record for this display
							var display = navSets[relnName][relnNameDisplay].getRecord(navSets[relnName][relnNameDisplay].newRecord(false,true))
							
							display.list_title = UL[j].ulTitleOverride
							display.display_default = UL[j].defaultDisplay
							
							var columnUL = UL[j].displayConfig
							//if there are columns
							if (columnUL) {
								//loop through selected UL display items, import data
								for (var k in columnUL) {
									
									//create record for this display item
									var displayColumn = navSets[relnName][relnNameDisplay][relnNameDisplayItem].getRecord(navSets[relnName][relnNameDisplay][relnNameDisplayItem].newRecord(false,true))
									
									displayColumn.display = columnUL[k].renderValue
									displayColumn.header = columnUL[k].header
									displayColumn.field_name = columnUL[k].sortBy
									displayColumn.display_width = columnUL[k].widthChar
									displayColumn.display_align = columnUL[k].align
									displayColumn.display_format = columnUL[k].format.type
									displayColumn.format_mask = columnUL[k].format.mask
								}
							}
						}
					}
					
					
					//loop through available actions, import data
						
					if (navItems[i].actionAdd) {
						var addSpecs = navItems[i].actionAdd
						
						//create record for this action item
						var actionRecord = navSets[relnName][relnNameAction].getRecord(navSets[relnName][relnNameAction].newRecord(false,true))
						
						actionRecord.category = 'Add'
						actionRecord.menu_name = addSpecs.menuName
						actionRecord.method_type = addSpecs.methodType
						actionRecord.method = addSpecs.method
						actionRecord.method_from_form = addSpecs.displayMethod
						actionRecord.method_from_custom = addSpecs.displayCustom
					}
					
					if (navItems[i].actionActions) {
						var actionSpecs = navItems[i].actionActions
						
						//loop through all actions
						for (var j in actionSpecs) {
							//create record for this action item
							var actionRecord = navSets[relnName][relnNameAction].getRecord(navSets[relnName][relnNameAction].newRecord(false,true))
							
							actionRecord.category = 'Actions'
							actionRecord.menu_name = actionSpecs[j].menuName
							actionRecord.method_type = actionSpecs[j].methodType
							actionRecord.method = actionSpecs[j].method
							actionRecord.method_from_form = actionSpecs[j].displayMethod
							actionRecord.method_from_custom = actionSpecs[j].displayCustom
							actionRecord.order_by = actionSpecs[j].order
						}
					}
					
					if (navItems[i].filterActions) {
						var filterSpecs = navItems[i].filterActions
						
						//put all objects into an array
						var sortedFilters = new Array()
						for (var j in filterSpecs) {
							sortedFilters[sortedFilters.length] = filterSpecs[j]
							sortedFilters[sortedFilters.length-1].id = j
						}
						//sort array by id
						globals.CODE_ddarray_field = 'id'
						sortedFilters.sort(globals.CODE_sort_dd_array)
						//reassign sorted values into object
						filterSpecs = sortedFilters
						
						//loop through all filters
						for (var j = 0; j < filterSpecs.length; j++) {
							//create record for this action item
							var actionRecord = navSets[relnName][relnNameAction].getRecord(navSets[relnName][relnNameAction].newRecord(false,true))
							
							//track new record id so sub filters can hook back up
							filterSpecs[j].actionItemID = actionRecord.id_action_item
							
							actionRecord.category = 'Filters'
							actionRecord.menu_name = filterSpecs[j].menuName
							actionRecord.order_by = filterSpecs[j].order
							actionRecord.filter_sort = filterSpecs[j].sort
							actionRecord.filter_limit = filterSpecs[j].limit
							actionRecord.filter_method = filterSpecs[j].method
							actionRecord.filter_type = filterSpecs[j].hasChildren
							
							//if sub level, update with value of new filter
							if (filterSpecs[j].parentElement) {
								if (filterSpecs[j].parentElement != 0) {
									actionRecord.id_action_item_parent = navItems[i].filterActions[filterSpecs[j].parentElement].actionItemID
								}
								else {
									actionRecord.id_action_item_parent = 0
								}
							}
							
							//create filter specification if exists
							if (filterSpecs[j].filterConfig) {
								var filterSpecItems = filterSpecs[j].filterConfig
								
								//loop through selected filter specificiations, export data
								for (var k in filterSpecItems) {
									
									//create record for this filter specification
									var filterRecord = navSets[relnName][relnNameAction][relnNameActionFilter].getRecord(navSets[relnName][relnNameAction][relnNameActionFilter].newRecord(false,true))
									
									filterRecord.id_action_item = actionRecord.id_action_item
									filterRecord.filter_type = filterSpecItems[k].filterType
									filterRecord.method_name = filterSpecItems[k].method
									filterRecord.column_relation = filterSpecItems[k].relation
									filterRecord.column_name = filterSpecItems[k].columnName
									filterRecord.column_operator = filterSpecItems[k].columnOperator
									filterRecord.column_value = filterSpecItems[k].columnValue
								}
							}
						}
					}
					
					if (navItems[i].printActions) {
						var printSpecs = navItems[i].printActions
						
						//loop through all actions
						for (var j in printSpecs) {
						
							//create record for this action item
							var actionRecord = navSets[relnName][relnNameAction].getRecord(navSets[relnName][relnNameAction].newRecord(false,true))
							
							actionRecord.category = 'Reports'
							actionRecord.menu_name = printSpecs[j].menuName
							actionRecord.order_by = printSpecs[j].order
							actionRecord.id_report = printSpecs[j].reportID
						}
					}
					
					if (navItems[i].tabActions) {
						var tabSpecs = navItems[i].tabActions
						
						//loop through all actions
						for (var j in tabSpecs) {
						
							//create record for this action item
							var actionRecord = navSets[relnName][relnNameAction].getRecord(navSets[relnName][relnNameAction].newRecord(false,true))
							
							actionRecord.category = 'Tabs'
							actionRecord.menu_name = tabSpecs[j].menuName
							actionRecord.order_by = tabSpecs[j].order
							actionRecord.form_to_load = tabSpecs[j].formLoad
						}
					}
				}
			}
			databaseManager.saveData()
		}
		globals.CALLBACK_progressbar_set(100)
		
		plugins.dialogs.showInfoDialog('Import complete','Selected navigation sets have been successfully imported')
		FORM_on_load(true)
	}
	else {
		plugins.dialogs.showErrorDialog('No import','No navigation sets were selected for import')
	}
}
else {
	plugins.dialogs.showErrorDialog('No import','No file selected for import')
}


globals.CALLBACK_progressbar_stop()

}

/**
 *
 * @properties={typeid:24,uuid:"1c00a228-a974-4bd6-8d0b-1e93e4416005"}
 */
function IMPORT_engine__ver3()
{

/*
 *	TITLE    :	IMPORT_engine
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	prompt for xml file; prompt to choose sets for import
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Oct 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: smart update of nav set based on uuid

var relnGroupAction = 'ac_access_group_to_access_group_action'
var relnGroupActionAction = 'ac_access_group_action_to_access_action'
var relnGroupToolbar = 'ac_access_group_to_access_group_toolbar'
var relnGroupToolbarToolbar = 'ac_access_group_toolbar_to_toolbar'
var relnGroupUser = 'ac_access_group_to_access_user_group'
var relnGroupNav = 'ac_access_group_to_control_navigation'
var relnGroupNavSet = 'ac_control_navigation_to_navigation'
var relnGroupBlog = 'ac_access_group_to_access_group_blog'
var relnGroupBlogBlog = 'ac_access_group_blog_to_blog'
var relnBlogEntry = 'ac_blog_to_blog_entry'
var relnBlogQuote = 'ac_blog_to_blog_quote'
var relnUserGroup = 'ac_access_user_to_access_user_group'
var relnStaff = 'ac_access_organization_to_access_staff'
var relnNav = 'nav_navigation_to_navigation_item__all'
var relnNavColumn = 'nav_navigation_item_to_column'
var relnNavDisplay = 'nav_navigation_item_to_list_display'
var relnNavDisplayItem = 'nav_list_display_to_list_display_item'
var relnNavAction = 'nav_navigation_item_to_action_item'
var relnNavActionFilter = 'nav_action_item_to_action_item_filter'
var relnNavDevSpec = 'nav_navigation_item_to_specification'
var relnNavDevTask = 'nav_navigation_item_to_task'
		
	//read in xml is 20%
		//numAreas = whatImport.length
		//sizeArea = 80/numAreas
		//numAreaSize = numAreas/xxx
		//numItemSize = numAreaSize/yyy
var numAreas
var currentArea = 1
var sizeArea
var numAreaSize
var numItemSize
globals.CALLBACK_progressbar_start(0,'Importing...')

plugins.dialogs.showInfoDialog('Choose import','Choose the file containing the frameworks settings you wish to import','OK')
var importFile = plugins.file.showFileOpenDialog(1,null,false)

if (importFile) {
	var input = plugins.dialogs.showInfoDialog('Full import','Warning! This is import will overwrite all of your current data. Continue?','Yes','No')
	
	if (input == 'Yes') {
		//progress updater
		globals.CALLBACK_progressbar_set(null,'Reading in XML...')
		this.timeBegan = new Date()
		
		var zippedFiles = XML_unzip(importFile)
		var importXML = zippedFiles[0][0]
		
		//CREATE object from xml file
		var allSettings = XML_to_object(importXML)['mosaicFrameworks']
		
		var exportNode = allSettings.exportDetails
		/*
		switch (exportNode.xmlVersion) {
			case 1:	//ver 1 never worked
				
				break
			case 2:	//ver 2 was the rc6.5 version
				IMPORT_engine__ver2()
				break
			case 3:	//ver 3 was new with 2 rc2
			default:
				IMPORT_engine__ver3()
				break
		}
		*/
		
		var accessControlNode = allSettings.accessControl
		var blogNode = allSettings.blogs
		var engineNode = allSettings.frameworksEngine
		var reportNode = allSettings.reportRegistry
		var solutionNode = allSettings.solutionDetails
		var toolbarNode = allSettings.toolbars
		var tooltipNode = allSettings.tooltips
		var valuelistNode = allSettings.valuelists
		
		//TODO: here is where we throw up the option of what they can import
		//we are exporting all the areas
		var accessControl = true
		var blog = true
		var navEngine = true
		var reportRegistry = true
		var solConfig = true
		var toolbar = true
		var tooltip = true
		var valuelist = true
		
		//if something to do, run
		if (accessControl || blog || navEngine || reportRegistry || solConfig || toolbar || tooltip || valuelist) {
			
			//how the progress bar should roll along....number of things being exported
			numAreas = 15 //navigation engine gets 8
			sizeArea = 80 / numAreas
			
			
			//Access and control node
			//
			//
			if (accessControl && accessControlNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
					
				//update with what doing
				globals.CALLBACK_progressbar_set(startPosn,'Importing access and control...')
				
				if (accessControlNode.accessGroups) {
					//find out how many groups
					var groupCountTotal = 0
					for (var i in accessControlNode.accessGroups) {
						groupCountTotal++
					}
					
					//progress updater
					numAreaSize = (endPosn - startPosn) / groupCountTotal
					//numItemSize = numAreaSize / groupCountTotal
					
					var groupCount = 0
					
					//load groups foundset
					var fsGroups = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_group')
					fsGroups.loadAllRecords()
					
					//if records, delete
					if (fsGroups.getSize()) {
						fsGroups.deleteAllRecords()
						databaseManager.saveData()
					}
					
					//loop through all groups
					for (var i in accessControlNode.accessGroups) {
						//update with what doing
						globals.CALLBACK_progressbar_set(startPosn + (numAreaSize * groupCount) / 2, 'Access group: ' + accessControlNode.accessGroups[i].groupName)
						
						var groupRecord = fsGroups.getRecord(fsGroups.newRecord(false,true))
						
						groupRecord.id_group = accessControlNode.accessGroups[i].groupID
						groupRecord.group_name = accessControlNode.accessGroups[i].groupName
						groupRecord.group_notes = accessControlNode.accessGroups[i].notes
						groupRecord.log_items = accessControlNode.accessGroups[i].loggingItems
						groupRecord.login_method = accessControlNode.accessGroups[i].groupLoginMethod
						groupRecord.logout_method = accessControlNode.accessGroups[i].groupLogoutMethod
						groupRecord.login_nav_set = accessControlNode.accessGroups[i].onLoginSet
						groupRecord.login_nav_main = accessControlNode.accessGroups[i].onLoginItem
						groupRecord.login_nav_main_node = accessControlNode.accessGroups[i].onLoginNode
						groupRecord.login_nav_sub = accessControlNode.accessGroups[i].onLoginSub
						groupRecord.modes_admin = accessControlNode.accessGroups[i].modesAdmin
						groupRecord.modes_user = accessControlNode.accessGroups[i].modesUser
						groupRecord.toolbars = accessControlNode.accessGroups[i].toolbars
						
						//navigation sets for selected group
						if (accessControlNode.accessGroups[i].navigationSets) {
							//loop through all nav sets
							for (var j in accessControlNode.accessGroups[i].navigationSets) {
								var groupNavRecord = fsGroups[relnGroupNav].getRecord(fsGroups[relnGroupNav].newRecord(false,true))
								
								groupNavRecord.id_group = accessControlNode.accessGroups[i].navigationSets[j].groupID
								groupNavRecord.id_navigation = accessControlNode.accessGroups[i].navigationSets[j].navigationID
								groupNavRecord.comments = accessControlNode.accessGroups[i].navigationSets[j].comments
								groupNavRecord.flag_chosen = accessControlNode.accessGroups[i].navigationSets[j].flagChosen
							}
						}
						
						
						//progres updater, push ahead half a stop
						if (startPosn + (groupCount / groupCountTotal * (endPosn - startPosn)) <= endPosn) {
						//	globals.CALLBACK_progressbar_set(startPosn + Math.floor(numAreaSize * (groupCount - 1)) + numAreaSize / 2)
						}
						
						//actions assigned to this group
						if (accessControlNode.accessGroups[i].actions) {
							//loop through all actions
							for (var j in accessControlNode.accessGroups[i].actions) {
								var groupActionRecord = fsGroups[relnGroupAction].getRecord(fsGroups[relnGroupAction].newRecord(false,true))
								
								groupActionRecord.id_group = accessControlNode.accessGroups[i].actions[j].groupID
								groupActionRecord.id_action = accessControlNode.accessGroups[i].actions[j].actionID
								groupActionRecord.flag_chosen = accessControlNode.accessGroups[i].actions[j].flagChosen
								groupActionRecord.flag_enabled = accessControlNode.accessGroups[i].actions[j].flagEnabled
							}
						}
						
						//toolbars assigned to this group
						if (accessControlNode.accessGroups[i].toolbars) {
							//loop through all toolbars
							for (var j in accessControlNode.accessGroups[i].toolbars) {
								var groupToolbarRecord = fsGroups[relnGroupToolbar].getRecord(fsGroups[relnGroupToolbar].newRecord(false,true))
								
								groupToolbarRecord.id_group = accessControlNode.accessGroups[i].toolbars[j].groupID
								groupToolbarRecord.id_toolbar = accessControlNode.accessGroups[i].toolbars[j].toolbarID
								groupToolbarRecord.flag_chosen = accessControlNode.accessGroups[i].toolbars[j].flagChosen
							}
						}
						
						//blogs assigned to this group
						if (accessControlNode.accessGroups[i].blogs) {
							//loop through all blogs
							for (var j in accessControlNode.accessGroups[i].blogs) {
								var groupBlogRecord = fsGroups[relnGroupBlog].getRecord(fsGroups[relnGroupBlog].newRecord(false,true))
								
								groupBlogRecord.id_group = accessControlNode.accessGroups[i].blogs[j].groupID
								groupBlogRecord.id_blog = accessControlNode.accessGroups[i].blogs[j].blogID
								groupBlogRecord.flag_chosen = accessControlNode.accessGroups[i].blogs[j].flagChosen
							}
						}
						
						groupCount++
					}
					
					//users
					if (accessControlNode.accessUsers) {
						//update with what doing
						globals.CALLBACK_progressbar_set(endPosn,'Importing users...')
						
						//get foundset and delete all records
						var fsAccessUsers = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_user')
						fsAccessUsers.loadAllRecords()
						fsAccessUsers.deleteAllRecords()
						
						//loop through all users
						for (var i in accessControlNode.accessUsers) {
							var userRecord = fsAccessUsers.getRecord(fsAccessUsers.newRecord(false,true))
							
							userRecord.id_user = accessControlNode.accessUsers[i].userID
							userRecord.id_organization = accessControlNode.accessUsers[i].organizationID
							userRecord.id_staff = accessControlNode.accessUsers[i].staffID
							userRecord.user_name = accessControlNode.accessUsers[i].userName
							userRecord.user_notes = accessControlNode.accessUsers[i].notes
							userRecord.user_password = accessControlNode.accessUsers[i].password
							userRecord.user_uuid = accessControlNode.accessUsers[i].uuid
							
							userRecord.account_disabled = accessControlNode.accessUsers[i].disabled
							userRecord.date_created = (accessControlNode.accessUsers[i].dateCreated) ? new Date(accessControlNode.accessUsers[i].dateCreated) : null
							userRecord.date_modified = (accessControlNode.accessUsers[i].dateModified) ? new Date(accessControlNode.accessUsers[i].dateModified) : null
							userRecord.date_password_changed = (accessControlNode.accessUsers[i].datePassword) ? new Date(accessControlNode.accessUsers[i].datePassword) : null
							userRecord.old_passwords = accessControlNode.accessUsers[i].previousPasswords
							userRecord.pass_change_at_login = accessControlNode.accessUsers[i].passMustChangeAtNextLogin
							userRecord.pass_never_expires = accessControlNode.accessUsers[i].passNeverExpires
							userRecord.pass_unchangeable = accessControlNode.accessUsers[i].passUnchangeable
							userRecord.screen_height = accessControlNode.accessUsers[i].screenHeight
							userRecord.screen_location_center = accessControlNode.accessUsers[i].screenCenter
							userRecord.screen_location_x = accessControlNode.accessUsers[i].screenX
							userRecord.screen_location_y = accessControlNode.accessUsers[i].screenY
							userRecord.screen_width = accessControlNode.accessUsers[i].screenWidth
							userRecord.space_centered_horizontal_1 = accessControlNode.accessUsers[i].spaceCenteredH1
							userRecord.space_centered_horizontal_2 = accessControlNode.accessUsers[i].spaceCenteredH2
							userRecord.space_classic_horizontal = accessControlNode.accessUsers[i].spaceClassicH
							userRecord.space_classic_vertical = accessControlNode.accessUsers[i].spaceClassicV
							userRecord.space_list_horizontal = accessControlNode.accessUsers[i].spaceListH
							userRecord.space_standard_horizontal = accessControlNode.accessUsers[i].spaceStandardH
							userRecord.space_standard_vertical = accessControlNode.accessUsers[i].spaceStandardV
							userRecord.space_vertical_horiztonal_1 = accessControlNode.accessUsers[i].spaceVerticalH1
							userRecord.space_vertical_horizontal_2 = accessControlNode.accessUsers[i].spaceVerticalH2
							userRecord.space_wide_horizontal = accessControlNode.accessUsers[i].spaceWideH
							userRecord.space_wide_vertical = accessControlNode.accessUsers[i].spaceWideV
							
							//create all user-group merge records
							var userGroupAssigned = accessControlNode.accessUsers[i].groupsAssigned.split(',')
							
							for (var k = 0; k < userGroupAssigned.length; k++) {
								var userGroupRecord = userRecord[relnUserGroup].getRecord(userRecord[relnUserGroup].newRecord(false,true))
								
								userGroupRecord.id_group = userGroupAssigned[k]
								userGroupRecord.flag_chosen = 1
							}
						}
					}
					
					//organizations
					if (accessControlNode.accessOrganizations) {
						//update with what doing
						globals.CALLBACK_progressbar_set(null,'Importing default organizations...')
						
						//get foundsets and delete all records
						var fsOrganizations = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_organization')
						fsOrganizations.loadAllRecords()
						fsOrganizations.deleteAllRecords()
						
						//loop through all orgas
						for (var i in accessControlNode.accessOrganizations) {
							var orgRecord = fsOrganizations.getRecord(fsOrganizations.newRecord(false,true))
							
							orgRecord.id_organization = i
							orgRecord.address_1 = accessControlNode.accessOrganizations[i].addressOne
							orgRecord.address_2 = accessControlNode.accessOrganizations[i].addressTwo
							orgRecord.city = accessControlNode.accessOrganizations[i].city
							orgRecord.name_organization = accessControlNode.accessOrganizations[i].name
							orgRecord.phone_fax = accessControlNode.accessOrganizations[i].phoneFax
							orgRecord.phone_main = accessControlNode.accessOrganizations[i].phoneMain
							orgRecord.rec_created = (accessControlNode.accessOrganizations[i].dateCreated) ? new Date(accessControlNode.accessOrganizations[i].dateCreated) : null
							orgRecord.rec_modified = (accessControlNode.accessOrganizations[i].dateModified) ? new Date(accessControlNode.accessOrganizations[i].dateModified) : null
							orgRecord.state = accessControlNode.accessOrganizations[i].state
							orgRecord.url = accessControlNode.accessOrganizations[i].url
							orgRecord.zip = accessControlNode.accessOrganizations[i].postalCode
							
							//loop through all related staff
							if (accessControlNode.accessOrganizations[i].staff) {
								for (var j in accessControlNode.accessOrganizations[i].staff) {
									var staffRecord = orgRecord[relnStaff].getRecord(orgRecord[relnStaff].newRecord(false,true))
									
									staffRecord.address_1 = accessControlNode.accessOrganizations[i].staff[j].addressOne
									staffRecord.address_2 = accessControlNode.accessOrganizations[i].staff[j].addressTwo
									staffRecord.address_city = accessControlNode.accessOrganizations[i].staff[j].city
									staffRecord.address_country = accessControlNode.accessOrganizations[i].staff[j].country
									staffRecord.address_state = accessControlNode.accessOrganizations[i].staff[j].state
									staffRecord.address_zip = accessControlNode.accessOrganizations[i].staff[j].postalCode
									staffRecord.date_birth = accessControlNode.accessOrganizations[i].staff[j].dateBirth
									staffRecord.email = accessControlNode.accessOrganizations[i].staff[j].email
									staffRecord.gender = accessControlNode.accessOrganizations[i].staff[j].gender
									staffRecord.name_first = accessControlNode.accessOrganizations[i].staff[j].nameFirst
									staffRecord.name_last = accessControlNode.accessOrganizations[i].staff[j].nameLast
									staffRecord.name_middle = accessControlNode.accessOrganizations[i].staff[j].nameMiddle
									staffRecord.phone_home = accessControlNode.accessOrganizations[i].staff[j].phoneHome
									staffRecord.phone_mobile = accessControlNode.accessOrganizations[i].staff[j].phoneMobile
									//TODO finish more data points
								}
							}
						}
					
					}
					
					//filters
					if (accessControlNode.accessFilters) {
						//update with what doing
						globals.CALLBACK_progressbar_set(null,'Importing filters...')
						
						//get foundset and delete all records
						var fsAccessFilters = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_filter')
						fsAccessFilters.loadAllRecords()
						fsAccessFilters.deleteAllRecords()
						
						//loop through all filters
						for (var i in accessControlNode.accessFilters) {
							var filterRecord = fsAccessFilters.getRecord(fsAccessFilters.newRecord(false,true))
							
							filterRecord.id_filter = accessControlNode.accessFilters[i].filterID
							filterRecord.filter_database = accessControlNode.accessFilters[i].dbServer
							filterRecord.filter_table = accessControlNode.accessFilters[i].table
							filterRecord.filter_field = accessControlNode.accessFilters[i].column
							filterRecord.filter_on = accessControlNode.accessFilters[i].enabled
							filterRecord.filter_operator = accessControlNode.accessFilters[i].comparison
							filterRecord.filter_type = accessControlNode.accessFilters[i].type
							filterRecord.filter_value = accessControlNode.accessFilters[i].value
							filterRecord.filter_value_type = accessControlNode.accessFilters[i].valueType
							filterRecord.id_group = accessControlNode.accessFilters[i].groupID
						}
					}
					
					//action registry
					if (accessControlNode.actionRegistry) {
						//update with what doing
						globals.CALLBACK_progressbar_set(null,'Importing actions registry...')
						
						//get foundset and delete all records
						var fsAccessActions = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_action')
						fsAccessActions.loadAllRecords()
						fsAccessActions.deleteAllRecords()
						
						//loop through all actions
						for (var i in accessControlNode.actionRegistry) {
							var actionRecord = fsAccessActions.getRecord(fsAccessActions.newRecord(false,true))
							
							actionRecord.action_id = accessControlNode.actionRegistry[i].actionID
							actionRecord.action_name = accessControlNode.actionRegistry[i].name
							actionRecord.description = accessControlNode.actionRegistry[i].description
						}
					}
					
					//password rules
					if (accessControlNode.passwordRules) {
						//update with what doing
						globals.CALLBACK_progressbar_set(null,'Importing password rules...')
						
						//get foundset and delete all records
						var fsAccessPass = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_rules')
						fsAccessPass.loadAllRecords()
						fsAccessPass.deleteAllRecords()
						
						var passRecord = fsAccessPass.getRecord(fsAccessPass.newRecord(false,true))
						
						passRecord.alpha_case_flag = accessControlNode.passwordRules.requireUpperLower
						passRecord.alphnum_flag = accessControlNode.passwordRules.requireAlphaNum
						passRecord.expire_days = accessControlNode.passwordRules.expireDays
						passRecord.expire_flag = accessControlNode.passwordRules.requireExpire
						passRecord.idle_flag = accessControlNode.passwordRules.requireIdleKick
						passRecord.idle_time = accessControlNode.passwordRules.idleKickTime
						passRecord.length_flag = accessControlNode.passwordRules.length.requireLength
						passRecord.length_max = accessControlNode.passwordRules.length.maxChars
						passRecord.length_min = accessControlNode.passwordRules.length.minChars
						passRecord.non_alphanum_flag = accessControlNode.passwordRules.requireNonAlpha
						passRecord.not_user_name = accessControlNode.passwordRules.notUserName
						passRecord.prev_match_count = accessControlNode.passwordRules.previousPasswords
						passRecord.prev_match_flag = accessControlNode.passwordRules.notMatchPasswords
					}
					
					
					databaseManager.saveData()
				}
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			
			//Blog node
			//
			//
			if (blog && blogNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
				
				//find out how many blogs
				var blogCountTotal = 0
				for (var i in blogNode) {
					blogCountTotal++
				}
				
				//progress updater
				numAreaSize = endPosn - startPosn
				numItemSize = numAreaSize / blogCountTotal
				
				var blogCount = 0
				
				//update with what doing
				globals.CALLBACK_progressbar_set(startPosn,'Importing blogs...')
				
				//load blog foundset
				var fsBlogs = databaseManager.getFoundSet(controller.getServerName(),'sutra_blog')
				fsBlogs.loadAllRecords()
				
				//if records, delete
				if (fsBlogs.getSize()) {
					fsBlogs.deleteAllRecords()
				}
				
				//loop through all blogs
				for (var i in blogNode) {
					//update with what doing
					globals.CALLBACK_progressbar_set(startPosn + (numItemSize * blogCount) / 2)
					
					var blogRecord = fsBlogs.getRecord(fsBlogs.newRecord(false,true))
					
					blogRecord.id_blog = blogNode[i].blogID
					blogRecord.blog_uuid = i
					blogRecord.blog_author_hide = blogNode[i].hideAuthor
					blogRecord.blog_banner = blogNode[i].banner
					blogRecord.blog_date_hide = blogNode[i].hideDate
					blogRecord.blog_fixed = blogNode[i].staticEntry
					blogRecord.blog_fixed_always = blogNode[i].useStatic
					blogRecord.blog_header = blogNode[i].header
					blogRecord.blog_footer = blogNode[i].footer
					blogRecord.blog_misc = blogNode[i].misc
					blogRecord.blog_name = blogNode[i].name
					blogRecord.blog_posts = blogNode[i].displayPosts
					blogRecord.blog_visible = blogNode[i].visible
					blogRecord.quote_auto = blogNode[i].autoQuote
					blogRecord.rec_created = (blogNode[i].dateCreated) ? new Date(blogNode[i].dateCreated) : null
					blogRecord.rec_modified = (blogNode[i].dateModified) ? new Date(blogNode[i].dateModified) : null
					
					if (blogNode[i].entries) {
						//loop through all blog entries
						for (var j in blogNode[i].entries) {
							//update with what doing
						//	globals.CALLBACK_progressbar_set(startPosn + numItemSize * blogCount + (numItemSize * ()))
							
							var blogEntryRecord = fsBlogs[relnBlogEntry].getRecord(fsBlogs[relnBlogEntry].newRecord(false,true))
							
							blogEntryRecord.rec_created = (blogNode[i].entries[j].dateCreated) ? new Date(blogNode[i].entries[j].dateCreated) : null
							blogEntryRecord.rec_modified = (blogNode[i].entries[j].dateModified) ? new Date(blogNode[i].entries[j].dateModified) : null
							blogEntryRecord.blog_message = blogNode[i].entries[j].message
							blogEntryRecord.blog_posted = (blogNode[i].entries[j].datePosted) ? new Date(blogNode[i].entries[j].datePosted) : null
							blogEntryRecord.blog_title = blogNode[i].entries[j].title
							blogEntryRecord.blog_visible = blogNode[i].entries[j].visible
							blogEntryRecord.id_group = blogNode[i].entries[j].groupID
							blogEntryRecord.id_user = blogNode[i].entries[j].userID
						}
					}
					
					
					if (blogNode[i].quotes) {
						//loop through all blog quotes
						for (var j in blogNode[i].quotes) {
							var blogQuoteRecord = fsBlogs[relnBlogQuote].getRecord(fsBlogs[relnBlogQuote].newRecord(false,true))
							
							blogQuoteRecord.date_created = (blogNode[i].quotes[j].dateCreated) ? new Date(blogNode[i].quotes[j].dateCreated) : null
							blogQuoteRecord.date_modified = (blogNode[i].quotes[j].dateModified) ? new Date(blogNode[i].quotes[j].dateModified) : null
							blogQuoteRecord.date_display = (blogNode[i].quotes[j].dateDisplay) ? new Date(blogNode[i].quotes[j].dateDisplay) : null
							blogQuoteRecord.quote = blogNode[i].quotes[j].quote
							blogQuoteRecord.quote_active = blogNode[i].quotes[j].active
							blogQuoteRecord.quote_author = blogNode[i].quotes[j].author
							blogQuoteRecord.quote_default = blogNode[i].quotes[j]['default']
							blogQuoteRecord.quote_uuid = j
						}
					}
					
					blogCount++
				}
				
				databaseManager.saveData()
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			
			//Navigation engine node
			//
			//
			if (navEngine && engineNode) {
				
				//progress updater => set to place where should be
				globals.CALLBACK_progressbar_set(20,'Importing frameworks engine...')
				
				//load navigation foundset
				var navSets = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation')
				navSets.clear()
				
				var navConfig = 0
				var navDefault = 0
				
				/*
				//find config navigation set
				navSets.find()
				navSets.flag_config = 1
				var navConfig = navSets.search()
				navSets.clear()
				
				//find default navigation set
				navSets.find()
				navSets.nav_default = 1
				var navDefault = navSets.search()
				navSets.clear()
				*/
				
				//existing nav set names
				navSets.loadAllRecords()
				var navSetsExisting = new Array()
				for (var a = 1; a <= navSets.getSize() ; a++) {
					navSetsExisting[a-1] = navSets.getRecord(a)
				}
				navSets.clear()
				
				
				//get navigation sets in import
				var displayVals = new Array()
				var realVals = new Array()
				var idVals = new Array()
				for (var g in engineNode) {
					displayVals[displayVals.length] = engineNode[g].name
					realVals.push(engineNode[g].navigationID)
					idVals.push(g)
					//realVals[realVals.length] = g
				}
				
				navSets.loadAllRecords()
				navSets.deleteAllRecords()
				//databaseManager.saveData()
				
				/*
				//check navigation sets in import against those in solution
				for (var i = 0; i < realVals.length; i++) {
					navSets.find()
					navSets.id_navigation = realVals[i]
					var results = navSets.search()
					
					//highlight row
					if (results) {
						displayVals[i] = '<html><body><table><tr><td bgcolor="#FF0000" width="100%">' + displayVals[i] + '<img height="12" width="400" border="0" src="media:///spacer.gif"></td></tr></table></body></html>'
					}
				}
				navSets.clear()
				
				//set valuelists for navigation sets
				application.setValueListItems('NAV_import_navsets',displayVals,realVals)
				
				forms.NAV_P_navigation.elements.fld_what.visible = false
				forms.NAV_P_navigation.elements.fld_export_navset.visible = false
				forms.NAV_P_navigation.elements.fld_import_navset.visible = true
				forms.NAV_P_navigation.elements.fld_export_access.visible = false
				forms.NAV_P_navigation.elements.fld_import_access.visible = false
				forms.NAV_P_navigation.elements.lbl_header.text = 'Select navigation sets to import'
				application.showFormInDialog(forms.NAV_P_navigation,-1,-1,-1,-1,'Import',false,false,'fwImportExport')
			
				if (globals.NAV_import_navset) {
					var importNavSets = globals.NAV_import_navset.split('\n')
					globals.NAV_import_navset = null
				}
				
				//sets are selected to be imported
				if (importNavSets && importNavSets.length) {
				*/	
				if (true) {
					//start/end positions for progressbar
					var startPosn = 20 + sizeArea * (currentArea)
					var endPosn = 20 + sizeArea * (currentArea + 9)
					
					//progress updater
					numAreaSize = (endPosn - startPosn) / realVals.length
					
					//loop through selected navigation sets, import data
					for (var h = 0; h < realVals.length; h++) {		
						/*
						//if navigation set already exists, delete it
						var found = false
						for (var b = 0; b < navSetsExisting.length && !found; b++) {
							if (navSetsExisting[b].nav_uuid in engineNode) {
								found = true
								for (var c = 1; c < navSetsExisting[b].foundset.getSize() && !thisIndex; c++) {
									if (navSetsExisting[b].foundset.getRecord(c).nav_uuid) {
										var thisIndex = c
									}
								}
								navSetsExisting[b].foundset.deleteRecord(thisIndex)
								databaseManager.saveData()
							}
						}
						*/
						//progress updater
						globals.CALLBACK_progressbar_set(startPosn + numAreaSize * (h - 1),'Creating records for navigation set: ' + engineNode[idVals[h]].name)
						
						//create record for this navigation set
						var navSetRecord = navSets.getRecord(navSets.newRecord(false,true))
						
						navSetRecord.id_navigation = engineNode[idVals[h]].navigationID
						navSetRecord.nav_uuid = engineNode[idVals[h]].navUUID
						navSetRecord.nav_name = engineNode[idVals[h]].name
						navSetRecord.nav_status = engineNode[idVals[h]].status
						navSetRecord.nav_description = engineNode[idVals[h]].description
						navSetRecord.nav_default = (navDefault) ? 0 : engineNode[idVals[h]]['default']
						navSetRecord.flag_config = (navConfig) ? 0 : engineNode[idVals[h]].flagConfig
						
						//check that there are items to add
						if (engineNode[idVals[h]].navigationItems) {
							
							var navItems = engineNode[idVals[h]].navigationItems
							
							//find out how many navItems
							var navItemCountTotal = 0
							for (var i in navItems) {
								navItemCountTotal++
							}
							
							//progress updater
							numItemSize = numAreaSize / navItemCountTotal
							var navItemCount = 0
							var itemTenth = 1 / 10
								
							//loop through selected navigation items, import data
							for (var i in navItems) {
								navItemCount++
								
								//progres updater size updated at most every 10 percent of navigation set
								if ((navItemCount / navItemCountTotal) > itemTenth) {
									globals.CALLBACK_progressbar_set(startPosn + Math.floor(Math.floor(numAreaSize * (h - 1) + numItemSize * navItemCount)))
									itemTenth = Math.floor(10 * (navItemCount / navItemCountTotal)) / 10
								}
								
								//create record for this navItem
								var navItemRecord = navSets[relnNav].getRecord(navSets[relnNav].newRecord(false,true))
								
								navItemRecord.config_type = navItems[i].configType
								navItemRecord.item_name = navItems[i].itemName
								navItemRecord.item_id = navItems[i].itemID
								navItemRecord.module_filter = navItems[i].moduleFilter
								navItemRecord.form_to_load = navItems[i].formLoad
								navItemRecord.list_to_load = navItems[i].listLoad
								navItemRecord.form_to_load_table = navItems[i].formLoadTable
								navItemRecord.description = navItems[i].description
								navItemRecord.node_1 = navItems[i].nodeOne
								navItemRecord.node_2 = navItems[i].nodeTwo
								navItemRecord.row_status_show = navItems[i].rowStatus
								navItemRecord.row_status_expanded = navItems[i].rowNodeExpanded
								navItemRecord.use_fw_list = navItems[i].useUL
								navItemRecord.fw_list_title = navItems[i].titleUL
								navItemRecord.sort_string = navItems[i].sortString
								
								
								navItemRecord.initial_form = navItems[i].statusInitialForm
								navItemRecord.inital_form_lable = navItems[i].statusInitialFormLabel
								navItemRecord.initial_record = navItems[i].statusInitialRecord
								navItemRecord.initial_record_label = navItems[i].statusInitialRecordLabel
								navItemRecord.ul_busy_cursor = navItems[i].busyCursor
								navItemRecord.space_available = navItems[i].spaces
								navItemRecord.space_default = navItems[i].spaceDefault
								navItemRecord.space_flip = navItems[i].spaceFlip
								navItemRecord.space_method = navItems[i].spaceChangedMethod
								
								navItemRecord.bar_item_add = navItems[i].actionULAdd
								navItemRecord.bar_item_action = navItems[i].actionULAction
								navItemRecord.bar_item_filter = navItems[i].actionULFilter
								navItemRecord.bar_item_report = navItems[i].actionULPrint
								navItemRecord.bar_item_tab = navItems[i].actionULTab
								
								//help info
								navItemRecord.help_available = navItems[i].help.enabled
								navItemRecord.help_module_filter = navItems[i].help.moduleFilter
								navItemRecord.help_form_to_load = navItems[i].help.formLoad
								navItemRecord.help_list_to_load = navItems[i].help.listLoad
								navItemRecord.help_description = navItems[i].help.description
								navItemRecord.help_color_text = navItems[i].help.textColor
								navItemRecord.help_color_background = navItems[i].help.textBackground
								
								//create records for developer notes if they have values
								if (navItems[i].developerNotes.specification) {
									var specRecord = navSets[relnNav][relnNavDevSpec].getRecord(navSets[relnNav][relnNavDevSpec].newRecord(false,true))
									specRecord.notes = navItems[i].developerNotes.specification
								}
								if (navItems[i].developerNotes.task) {
									var taskRecord = navSets[relnNav][relnNavDevTask].getRecord(navSets[relnNav][relnNavDevTask].newRecord(false,true))
									taskRecord.notes = navItems[i].developerNotes.task
								}
								
								
								var columnItems = navItems[i].columnInfo
								if (columnItems) {
									//copy all columns over
									for (var j in columnItems) {
										
										//create record for this column
										var columnItem = navSets[relnNav][relnNavColumn].getRecord(navSets[relnNav][relnNavColumn].newRecord(false,true))
										
										columnItem.status_relation = columnItems[j].statusRelation
										columnItem.table_or_relation = columnItems[j].tableOrRelation
										columnItem.name_column = columnItems[j].columnName
										columnItem.type_column = columnItems[j].columnType
										columnItem.name_display = columnItems[j].prettyName
										columnItem.status_find = columnItems[j].statusFind
										columnItem.status_named = columnItems[j].statusNamed
										columnItem.valuelist = columnItems[j].valueList
									}
								}
								
								var UL = navItems[i].universalList
								
								if (UL) {
									//if displays
									if (UL.displays) {
										//loop through selected UL displays, import data
										for (var j in UL.displays) {
											
											//create record for this display
											var display = navSets[relnNav][relnNavDisplay].getRecord(navSets[relnNav][relnNavDisplay].newRecord(false,true))
											
											display.list_title = UL.displays[j].ulTitleOverride
											display.display_default = UL.displays[j].defaultDisplay
											display.row_order = UL.displays[j].rowOrder
											
											var columnUL = UL.displays[j].displayConfig
											//if there are columns in this display (display items)
											if (columnUL) {
												//loop through selected UL display items, import data
												for (var k in columnUL) {
													
													//create record for this display item
													var displayColumn = navSets[relnNav][relnNavDisplay][relnNavDisplayItem].getRecord(navSets[relnNav][relnNavDisplay][relnNavDisplayItem].newRecord(false,true))
													
													displayColumn.row_order = columnUL[k].rowOrder
													displayColumn.display = columnUL[k].renderValue
													displayColumn.header = columnUL[k].header
													displayColumn.field_name = columnUL[k].sortBy
													displayColumn.display_width_percent = columnUL[k].width
													displayColumn.display_align = columnUL[k].align
													displayColumn.display_format = columnUL[k].format.type
													displayColumn.format_mask = columnUL[k].format.mask
												}
											}
										}
									}
								}
								
								if (navItems[i].buttons) {
									//loop through available actions, import data
										
									if (navItems[i].buttons.add) {
										var addSpecs = navItems[i].buttons.add
										
										//create record for this action item
										var actionRecord = navSets[relnNav][relnNavAction].getRecord(navSets[relnNav][relnNavAction].newRecord(false,true))
										
										actionRecord.category = 'Add'
										actionRecord.menu_name = addSpecs.menuName
										actionRecord.method_type = addSpecs.methodType
										actionRecord.method = addSpecs.method
										actionRecord.method_from_form = addSpecs.displayMethod
										actionRecord.method_from_custom = addSpecs.displayCustom
									}
									
									if (navItems[i].buttons.actions) {
										var actionSpecs = navItems[i].buttons.actions
										
										//loop through all actions
										for (var j in actionSpecs) {
											//create record for this action item
											var actionRecord = navSets[relnNav][relnNavAction].getRecord(navSets[relnNav][relnNavAction].newRecord(false,true))
											
											actionRecord.category = 'Actions'
											actionRecord.menu_name = actionSpecs[j].menuName
											actionRecord.method_type = actionSpecs[j].methodType
											actionRecord.method = actionSpecs[j].method
											actionRecord.method_from_form = actionSpecs[j].displayMethod
											actionRecord.method_from_custom = actionSpecs[j].displayCustom
											actionRecord.order_by = actionSpecs[j].order
										}
									}
									
									if (navItems[i].buttons.filters) {
										var filterSpecs = navItems[i].buttons.filters
										
										//put all objects into an array
										var sortedFilters = new Array()
										for (var j in filterSpecs) {
											sortedFilters[sortedFilters.length] = filterSpecs[j]
											sortedFilters[sortedFilters.length-1].id = j
										}
										//sort array by id
										globals.CODE_ddarray_field = 'id'
										sortedFilters.sort(globals.CODE_sort_dd_array)
										//reassign sorted values into object
										filterSpecs = sortedFilters
										
										//loop through all filters
										for (var j = 0; j < filterSpecs.length; j++) {
											//create record for this action item
											var actionRecord = navSets[relnNav][relnNavAction].getRecord(navSets[relnNav][relnNavAction].newRecord(false,true))
											
											//track new record id so sub filters can hook back up
											filterSpecs[j].actionItemID = actionRecord.id_action_item
											
											actionRecord.category = 'Filters'
											actionRecord.menu_name = filterSpecs[j].menuName
											actionRecord.order_by = filterSpecs[j].order
											actionRecord.filter_sort = filterSpecs[j].sort
											actionRecord.filter_limit = filterSpecs[j].limit
											actionRecord.filter_method = filterSpecs[j].method
											actionRecord.filter_type = filterSpecs[j].subFilterType
											
											//if sub level, update with value of new filter
											if (filterSpecs[j].parentElement) {
												if (filterSpecs[j].parentElement != 0) {
													actionRecord.id_action_item_parent = navItems[i].buttons.filters[filterSpecs[j].parentElement].actionItemID
												}
												else {
													actionRecord.id_action_item_parent = 0
												}
											}
											
											//create filter specification if exists
											if (filterSpecs[j].filterConfig) {
												var filterSpecItems = filterSpecs[j].filterConfig
												
												//loop through selected filter specificiations, import data
												for (var k in filterSpecItems) {
													
													//create record for this filter specification
													var filterRecord = navSets[relnNav][relnNavAction][relnNavActionFilter].getRecord(navSets[relnNav][relnNavAction][relnNavActionFilter].newRecord(false,true))
													
													filterRecord.id_action_item = actionRecord.id_action_item
													filterRecord.filter_type = filterSpecItems[k].filterType
													filterRecord.method_name = filterSpecItems[k].method
													filterRecord.column_relation = filterSpecItems[k].relation
													filterRecord.column_name = filterSpecItems[k].columnName
													filterRecord.column_operator = filterSpecItems[k].columnOperator
													filterRecord.column_value = filterSpecItems[k].columnValue
													
													filterRecord.valuelist = filterSpecItems[k].valuelist
													filterRecord.valuelist_type = filterSpecItems[k].valuelistType
												}
											}
										}
									}
									
									if (navItems[i].buttons.reports) {
										var printSpecs = navItems[i].buttons.reports
										
										//loop through all actions
										for (var j in printSpecs) {
										
											//create record for this action item
											var actionRecord = navSets[relnNav][relnNavAction].getRecord(navSets[relnNav][relnNavAction].newRecord(false,true))
											
											actionRecord.category = 'Reports'
											actionRecord.menu_name = printSpecs[j].menuName
											actionRecord.order_by = printSpecs[j].order
											actionRecord.id_report = printSpecs[j].reportID
										}
									}
									
									if (navItems[i].buttons.tabs) {
										var tabSpecs = navItems[i].buttons.tabs
										
										//loop through all actions
										for (var j in tabSpecs) {
										
											//create record for this action item
											var actionRecord = navSets[relnNav][relnNavAction].getRecord(navSets[relnNav][relnNavAction].newRecord(false,true))
											
											actionRecord.category = 'Tabs'
											actionRecord.menu_name = tabSpecs[j].menuName
											actionRecord.order_by = tabSpecs[j].order
											actionRecord.form_to_load = tabSpecs[j].formLoad
										}
									}
								}
							}
						}
						databaseManager.saveData()
					}
					
					//reload navigation sets into form
					FORM_on_load()
					
					//advance progressbar updater to the next section
					currentArea += 9
				}
				else {
					//advance progressbar updater to the next section
					currentArea += 9
					
				//	plugins.dialogs.showErrorDialog('No import','No navigation sets were selected for import')
				}
			}
			
			//Report node
			//
			//
			if (reportRegistry && reportNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
				
				//go to midway point...not much to do here
				globals.CALLBACK_progressbar_set(startPosn + ((endPosn - startPosn) / 2),'Importing report registry...')
				
				//load report foundset
				var fsReports = databaseManager.getFoundSet(controller.getServerName(),'sutra_report')
				fsReports.loadAllRecords()
				
				//if records, delete
				if (fsReports.getSize()) {
					fsReports.deleteAllRecords()
				}
				
				//loop through all reports
				for (var i in reportNode) {
					var reportRecord = fsReports.getRecord(fsReports.newRecord(false,true))
					
					reportRecord.id_report = reportNode[i].reportID
					reportRecord.report_description = reportNode[i].description
					reportRecord.report_form = reportNode[i].form
					reportRecord.report_method = reportNode[i].method
					reportRecord.report_module = reportNode[i].module
					reportRecord.date_created = (reportNode[i].dateCreated) ? new Date(reportNode[i].dateCreated) : null
					reportRecord.date_modified = (reportNode[i].dateModified) ? new Date(reportNode[i].dateModified) : null
				}
				
				databaseManager.saveData()
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			
			//Solution configuration node
			//
			//
			if (solConfig && solutionNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
				
				//go to midway point of solConfig's progress...not much to do here
				globals.CALLBACK_progressbar_set(startPosn + ((endPosn - startPosn) / 2),'Importing solution configuration...')
				
				//load solution foundset
				var fsSolution = databaseManager.getFoundSet(controller.getServerName(),'sutra_solution')
				fsSolution.loadAllRecords()
				
				//if no records, create one
				if (!fsSolution.getSize()) {
					var solutionRecord = fsSolution.getRecord(fsSolution.newRecord(false,true))
				}
				else  {
					var solutionRecord = fsSolution.getRecord(1)
				}
				
				solutionRecord.solution_name = solutionNode.brandingName
				solutionRecord.solution_tagline = solutionNode.brandingTagline
				solutionRecord.icon = solutionNode.brandingIcon
				solutionRecord.icon_tooltip = solutionNode.brandingIconTooltip
				solutionRecord.icon_url = solutionNode.brandingIconLink
				
				solutionRecord.blog_enable = solutionNode.enableBlog
				solutionRecord.error_popup = solutionNode.showErrorPopup
				solutionRecord.navigation_collapse_auto = solutionNode.navigationCollapse
				solutionRecord.license_email = solutionNode.licenseEmail
				solutionRecord.license_key = solutionNode.licenseKey
				solutionRecord.license_name = solutionNode.licenseName
				solutionRecord.repository_api = solutionNode.disableRepository
				solutionRecord.list_maxrecs = solutionNode.ulMaxRecords
				solutionRecord.recnav_delay = solutionNode.ulClickDelay
				solutionRecord.list_color_background = solutionNode.listBackgroundColor
				
				solutionRecord.method_startup = solutionNode.startupMethod
				solutionRecord.method_logout = solutionNode.logoutMethod
				solutionRecord.method_shutdown = solutionNode.shutdownMethod
				
				solutionRecord.find_wildcard = solutionNode.findControlChar
				solutionRecord.find_dateformat = solutionNode.findDateFormat
				
				solutionRecord.login_disabled = solutionNode.loginNone
				
				solutionRecord.kiosk_fullscreen = solutionNode.kioskFullScreen
				solutionRecord.kiosk_menu = solutionNode.kioskMenu
				solutionRecord.kiosk_statusbar = solutionNode.kioskStatusBar
				solutionRecord.kiosk_toolbar = solutionNode.kioskToolbar
				
				solutionRecord.location_center = solutionNode.windowCenter
				solutionRecord.location_x = solutionNode.windowX
				solutionRecord.location_y = solutionNode.windowY
				solutionRecord.screen_height = solutionNode.windowHeight
				solutionRecord.screen_width = solutionNode.windowWidth
				
				solutionRecord.space_standard_horizontal = solutionNode.spaceStandardH
				solutionRecord.space_standard_vertical = solutionNode.spaceStandardV
				solutionRecord.space_list_horizontal = solutionNode.spaceListH
				solutionRecord.space_vertical_horizontal_1 = solutionNode.spaceVerticalH1
				solutionRecord.space_vertical_horizontal_2 = solutionNode.spaceVerticalH2
				solutionRecord.space_centered_horizontal_1 = solutionNode.spaceCenteredH1
				solutionRecord.space_centered_horizontal_2 = solutionNode.spaceCenteredH2
				solutionRecord.space_classic_horizontal = solutionNode.spaceClassicH
				solutionRecord.space_classic_vertical = solutionNode.spaceClassicV
				solutionRecord.space_wide_horizontal = solutionNode.spaceWideH
				solutionRecord.space_wide_vertical = solutionNode.spaceWideV
				
				databaseManager.saveData()
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			//Toolbar node
			//
			//
			if (toolbar && toolbarNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
				
				//go to midway point...not much to do here
				globals.CALLBACK_progressbar_set(startPosn + ((endPosn - startPosn) / 2),'Importing toolbars...')
				
				//load toolbar foundset
				var fsToolbar = databaseManager.getFoundSet(controller.getServerName(),'sutra_toolbar')
				fsToolbar.loadAllRecords()
				
				//if records, delete
				if (fsToolbar.getSize()) {
					fsToolbar.deleteAllRecords()
				}
				
				//get toolbars in import
				var toolbarImport = new Array()
				for (var g in toolbarNode) {
					toolbarImport.push(toolbarNode[g])
				}
				//sort toolbars by order
				globals.CODE_ddarray_field = 'orderBy'
				toolbarImport.sort(globals.CODE_sort_dd_array)
				
				//loop through all toolbars
				for (var i = 0; i < toolbarImport.length; i++) {
					var toolbarRecord = fsToolbar.getRecord(fsToolbar.newRecord(false,true))
					
					toolbarRecord.id_toolbar = toolbarImport[i].toolbarID
					toolbarRecord.description = toolbarImport[i].description
					toolbarRecord.tab_name = toolbarImport[i].tabName
					toolbarRecord.form_name = toolbarImport[i].formName
					toolbarRecord.module_filter = toolbarImport[i].moduel
					toolbarRecord.pop_down_autosize = toolbarImport[i].popAutoSize
					toolbarRecord.pop_down_form = toolbarImport[i].popFormName
					toolbarRecord.pop_down_height = toolbarImport[i].popHeight
					toolbarRecord.pop_down_show = toolbarImport[i].popEnabled
					toolbarRecord.pop_down_width = toolbarImport[i].popWidth
					toolbarRecord.row_status_show = toolbarImport[i].visible
					toolbarRecord.row_order = toolbarImport[i].orderBy
					toolbarRecord.rec_created = (toolbarImport[i].dateCreated) ? new Date(toolbarImport[i].dateCreated) : null
					toolbarRecord.rec_modified = (toolbarImport[i].dateModified) ? new Date(toolbarImport[i].dateModified) : null
				}
				
				databaseManager.saveData()
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			//Tooltip node
			//
			//
			if (tooltip && tooltipNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
				
				//go to midway point...not much to do here
				globals.CALLBACK_progressbar_set(startPosn + ((endPosn - startPosn) / 2),'Importing tooltip registry...')
				
				//load tooltip foundset
				var fsTooltips = databaseManager.getFoundSet(controller.getServerName(),'sutra_tooltip')
				fsTooltips.loadAllRecords()
				
				//if records, delete
				if (fsTooltips.getSize()) {
					fsTooltips.deleteAllRecords()
				}
				
				//loop through all tooltips
				for (var i in tooltipNode) {
					var tooltipRecord = fsTooltips.getRecord(fsTooltips.newRecord(false,true))
					
					tooltipRecord.date_created = (tooltipNode[i].dateCreated) ? new Date(tooltipNode[i].dateCreated) : null
					tooltipRecord.date_modifed = (tooltipNode[i].dateModified) ? new Date(tooltipNode[i].dateModified) : null
					tooltipRecord.element_name = tooltipNode[i].element
					tooltipRecord.flag_help = tooltipNode[i].flagHelp
					tooltipRecord.form_name = tooltipNode[i].formName
					tooltipRecord.i18n_language = tooltipNode[i].language
					tooltipRecord.inline_help = tooltipNode[i].help
					tooltipRecord.module_filter = tooltipNode[i].module
					tooltipRecord.tooltip = tooltipNode[i].tooltip
					tooltipRecord.use_html = tooltipNode[i].useHTML
				}
				
				databaseManager.saveData()
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			//Valuelist node
			//
			//
			if (valuelist && valuelistNode) {
				//start/end positions for progressbar
				var startPosn = 20 + sizeArea * (currentArea - 1)
				var endPosn = 20 + sizeArea * currentArea
				
				//go to midway point...not much to do here
				globals.CALLBACK_progressbar_set(startPosn + ((endPosn - startPosn) / 2),'Importing value list registry...')
				
				//load valuelist foundset
				var fsValuelists = databaseManager.getFoundSet(controller.getServerName(),'sutra_valuelist')
				fsValuelists.loadAllRecords()
				
				//if records, delete
				if (fsValuelists.getSize()) {
					fsValuelists.deleteAllRecords()
				}
				
				//loop through all valuelists
				for (var i in valuelistNode) {
					var valuelistRecord = fsValuelists.getRecord(fsValuelists.newRecord(false,true))
					
					valuelistRecord.date_created = (valuelistNode[i].dateCreated) ? new Date(valuelistNode[i].dateCreated) : null
					valuelistRecord.date_modified = (valuelistNode[i].dateModified) ? new Date(valuelistNode[i].dateModified) : null
					valuelistRecord.order_by = valuelistNode[i].orderBy
					valuelistRecord.relation_1 = valuelistNode[i].relationOne
					valuelistRecord.relation_2 = valuelistNode[i].relationTwo
					valuelistRecord.saved = valuelistNode[i].saved
					valuelistRecord.search_field = valuelistNode[i].searchField
					valuelistRecord.search_table = valuelistNode[i].searchTable
					valuelistRecord.valuelist_name = valuelistNode[i].name
					valuelistRecord.visible = valuelistNode[i].visible
				}
				
				databaseManager.saveData()
				
				//advance progressbar updater to the next section
				currentArea++
			}
			
			plugins.dialogs.showInfoDialog('Import success','You have imported the frameworks settings')
		}
	}
}
else {
	plugins.dialogs.showErrorDialog('No import','No file selected for import')
}


globals.CALLBACK_progressbar_stop()

}

/**
 *
 * @properties={typeid:24,uuid:"8149fa7a-8cea-41bc-8457-0742d5f13d8b"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	creates new navigation set record and one navigation_item
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Aug 29, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */	//MEMO: if config set is showing, the orderby numbering will get out of whack

var navName = plugins.dialogs.showInputDialog('Navigation set name', 'Enter name for navigation set:')
if (navName) {
	//create new navigation set record
	controller.newRecord(false)
	
	//name the newly created set and set as active
	nav_name = navName
	nav_status = 1
	order_by = foundset.getSize()
	databaseManager.saveData()

	//create one child record (so workflow area will not show data from other set)
	forms.NAV_0L_navigation_item.REC_new()
}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"ff3c6d3f-f3a6-495d-9b4a-6132c7e05763"}
 */
function TOGGLE_config_set(event)
{
	
/*
 *	TITLE    :	TOGGLE_config_set
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	show/hide the configuration records...if the ctrl key is pressed on the title
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: if we call a busy on, servoy's busy off over-rides ours; giving an undesired blinking effect

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var forceShow = arguments[0]

if (globals.CODE_key_pressed() == 2 || typeof forceShow == 'boolean') {
	//busy on
//	plugins.sutra.busyCursor = true
	
	//loop through all records looking for config
	var foundIt = false
	for (var i = 1; i <= foundset.getSize() && !foundIt; i++) {
		var record = foundset.getRecord(i)
		if (record.flag_config == 1) {
			foundIt = true
		}
	}
	
	//show all records
	if (forceShow || !foundIt) {
		controller.loadAllRecords()
	}
	//config record showing, hide
	else {
		controller.find()
		flag_config = '^'
		controller.search()
		controller.find()
		flag_config = '0'
		controller.search(false,false)
	}
	
	if (utils.hasRecords(foundset)) {
		foundset.sort('order_by asc')
	}
	
	//busy off
//	plugins.sutra.busyCursor = false
}
}

/**
 *
 * @properties={typeid:24,uuid:"8f311123-d510-4869-86e8-b8c51476cf29"}
 */
function UTIL_convert_to_percent()
{

/*
 *	TITLE    :	UTIL_convert_to_percent
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	convert all display char width ULs to percentage based ones
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'NAV_0L_navigation'
var relnName = 'nav_navigation_to_navigation_item__all'
var relnNameDisplay = 'nav_navigation_item_to_list_display'
var relnNameDisplayItem = 'nav_list_display_to_list_display_item'

if (forms[formName][relnName] && forms[formName][relnName].getSize()) {
	//sort, for my sanity
	forms[formName][relnName].sort('nav_navigation_item_to_navigation.nav_name asc, node_1 asc, node_2 asc')
	
	//loop through all navigation items in this nav set and update
	for (var i = 1; i <= forms[formName][relnName].getSize() ; i++) {
		//set selected index 
		forms[formName][relnName].setSelectedIndex(i)
		
		//loop through displays
		for (var j = 1; forms[formName][relnName][relnNameDisplay] && j <= forms[formName][relnName][relnNameDisplay].getSize() ; j++) {
			//set selected index 
			forms[formName][relnName][relnNameDisplay].setSelectedIndex(j)
			
			//if items in this display, go for it....
			if (forms[formName][relnName][relnNameDisplay][relnNameDisplayItem] && forms[formName][relnName][relnNameDisplay][relnNameDisplayItem].getSize()) {
				//get total characters for
				var totalCharWidth = forms[formName][relnName][relnNameDisplay][relnNameDisplayItem].total_width_old
				
				//loop through the display items
				for (var k = 1; k <= forms[formName][relnName][relnNameDisplay][relnNameDisplayItem].getSize() ; k++) {
					//copy all display items from original to new universal list display
					var record = forms[formName][relnName][relnNameDisplay][relnNameDisplayItem].getRecord(k)
					record.display_width_percent = (record.display_width / record.total_width_old) * 100 //totalCharWidth
				}
				
				databaseManager.saveData()
				
				//finished looping, if greater than 100 %, remove from last item
				if (record.total_width != 100) {
					record.display_width_percent = record.display_width_percent - (record.total_width - 100)
				}
			}
		}
	}
	
	databaseManager.saveData()
}



}

/**
 *
 * @properties={typeid:24,uuid:"45f804ab-b351-4b7d-ab3f-1708af3f1439"}
 */
function XML_text_node()
{

/*
 *	TITLE    :	XML_text_node
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	create text node in given xml doc
 *			  	
 *	INPUT    :	1) xml doc to add to
 *			  	2) name of element
 *			  	3) text value
 *			  	
 *	OUTPUT   :	an xml textNode
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var exportXML = arguments[0]
var element = arguments[1]
var textNode = arguments[2]

//if date with value, format as string
var dateTest = new Date(textNode)
if (dateTest != 'Invalid Date' && utils.dateFormat(textNode,'MMM d, yyyy H:mm:ss')) {
	textNode = utils.dateFormat(textNode,'MMM d, yyyy H:mm:ss')
}

var textNodeType = typeof textNode

//if no name passed, create a dummy
if (element) {
	var elem = exportXML.createElement(element)
}
else {
	var elem = exportXML.createElement('errorWithElement')
}

if (textNodeType == 'string' || textNode == null) {
	elem.appendChild(exportXML.createTextNode((textNode) ? textNode : ''))
}
else if (textNodeType == 'number' || textNodeType == 'boolean') {
	elem.appendChild(exportXML.createTextNode(textNode))
}

return elem



}

/**
 *
 * @properties={typeid:24,uuid:"c16659c7-de13-4c17-974d-6ced23241245"}
 */
function XML_to_object()
{

/*
 *	TITLE    :	XML_to_object
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	recursively calls itself to create object mirroring xml structure
 *			  	
 *	INPUT    :	1st xml node (subsequent passes pass in object that is being created)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var importNode = arguments[0]
var objectXML = (arguments[1]) ? arguments[1] : new Object()

//read in xml is 20%

//hack alert: update after ~1.5 seconds
	//TODO: base on size of file
var nowTime = new Date()
var nowProgress = globals.CALLBACK_progressbar_get()[0]
if (nowProgress < 20 && (nowTime - this.timeBegan >= 1500)) {
	globals.CALLBACK_progressbar_set(nowProgress + 5)
	this.timeBegan = new Date()
}

switch (importNode.getType()) {
	case 'ELEMENT':
		var childNodes = importNode.getChildNodes()
		
		//create object to hold all children -- if it has an attribute (id), set the name to be that
		var thisAttribs = importNode.getAttributeNames()
		if (thisAttribs.length) {
			//create object with all non-id properties
			for (var j = 0; j < thisAttribs.length; j++) {
				var attribProps = new Object()
				
				if (thisAttribs[j] == 'id') {
					var thisNode = objectXML[importNode.getAttributeValue(thisAttribs[j])] = new Object()
				}
				else {
					attribProps[thisAttribs[j]] = [importNode.getAttributeValue(thisAttribs[j])]
				}
			}
			
			//only attach non-id properties if there are any
			for (var k in attribProps && !stop) {
				thisNode.attributes = attribProps
				var stop = true
			}
		}
		else {
			//there are children or properties, create as an object
			if (childNodes.length || stop) {
				var thisNode = objectXML[importNode.getName()] = new Object()
			}
			//null or empty value; treat like text below
			else {
				objectXML[importNode.getName()] = importNode.getTextValue()
			}
		}
		
		//loop through all children and pass to this method
		for (var i = 0; i < childNodes.length; i++) {
			XML_to_object(childNodes[i],thisNode)
		}
		
		break
	
	case 'TEXT':
		objectXML[importNode.getName()] = importNode.getTextValue()
		break
}

return objectXML


}

/**
 *
 * @properties={showInMenu:true,typeid:24,uuid:"17328451-f083-40d2-8742-725eb4c3fc05"}
 */
function XML_unzip()
{

/*
 *	TITLE    :	XML_unzip
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	unzip a zip file return array of files
 *			  	
 *	INPUT    :	1) filename to unzip
 *			  	
 *	OUTPUT   :	zipped file
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: delete temp files

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var fileToUnzip = arguments[0]
var filesUnzipped = new Array()

//Specify destination where file will be unzipped (the temp directory)
var destinationDirectory = plugins.file.createTempFile('mf_where','.tmp').getParent()

var sourceZipFile = new java.io.File(fileToUnzip)
var unzipDestinationDirectory = new java.io.File(destinationDirectory)

//Open Zip file for reading
var zipFile = new java.util.zip.ZipFile(sourceZipFile, Packages.java.util.zip.ZipFile.OPEN_READ)

//create an enumeration of the entries in the zip file
var zipFileEntries = zipFile.entries()
var bufferSize = 2048

//process each entry
while (zipFileEntries.hasMoreElements()) {
	
	//grab a zip file entry
	var entry = zipFileEntries.nextElement()
	var currentEntry = entry.getName()
	var destFile = new java.io.File(unzipDestinationDirectory, currentEntry)

	//grab file's parent directory structure
	var destinationParent = destFile.getParentFile()
	
	//create the parent directory structure if needed
	destinationParent.mkdirs()
	
	// extract file if not a directory
	if (!entry.isDirectory()) {
		var testing = zipFile.getInputStream(entry)
		var is = new java.io.BufferedInputStream(testing)
		var currentByte
		
		//establish buffer for writing file
		//var data = new Packages.java.lang.Byte(bufferSize)
		var data = new Packages.java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, bufferSize) 
		
		//plugins.file.readFile(plugins.file.createTempFile('mosaic','.temp'))
		//plugins.file.writeTXTFile(plugins.file.createTempFile('mosaic','.temp'),'')
		
		//write the current file to disk
		var fos = new java.io.FileOutputStream(destFile)
		var dest = new java.io.BufferedOutputStream(fos, bufferSize)
		
		//read and write until last byte is encountered
		while ((currentByte = is.read(data)) > 0) {
			dest.write(data, 0, currentByte)
		}
		
		dest.flush()
		dest.close()
		is.close()
	}
	
	filesUnzipped[filesUnzipped.length] = plugins.XmlReader.readXmlDocumentFromFile(destFile)
}

zipFile.close()

return filesUnzipped
}

/**
 *
 * @properties={typeid:24,uuid:"a5983bf3-506b-44ce-ac64-cc5a765fcd51"}
 */
function XML_zip()
{

/*
 *	TITLE    :	XML_zip
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	create zip file
 *			  	
 *	INPUT    :	1) array of filenames to zip
 *			  	
 *	OUTPUT   :	zipped file
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var filesToZip = arguments[0]
var zipFileName = arguments[1]

//get a placeholder for our file
plugins.file.writeTXTFile(zipFileName,'')

//where we're dumping stuff
var outFile = new java.util.zip.ZipOutputStream(new java.io.FileOutputStream(zipFileName))

//set the compression ratio
outFile.setLevel(java.util.zip.Deflater.BEST_COMPRESSION)

//iterate through the array of files, adding each to the zip file
for (var i = 0; i < filesToZip.length; i++) {
	//create buffer
	var buffer = plugins.file.readFile(filesToZip[i])
	
	//associate a file input stream for the current file
	var inFile = new java.io.FileInputStream(filesToZip[i])
	
	//add ZIP entry to output stream
	//var name = utils.stringRight(filesToZip[i],filesToZip[i].length-utils.stringPosition(filesToZip[i],'/',0,utils.stringPatternCount(filesToZip[i],'/')))
	switch (i) {
		case 0:
			var name = 'sutra_frameworks.xml'
			break
		case 1:
			var name = 'sutra_frameworks.dtd'
			break
		default:
			var name = 'sutra_frameworks_'+ i+1 +'.txt'
			break
	}
	outFile.putNextEntry(new java.util.zip.ZipEntry(name))
	
	//update progress
	globals.CALLBACK_progressbar_set(90 + (i + 1 / filesToZip.length) * 10)
	
	// Transfer bytes from the current file to the ZIP file
	var len
	while ((len = inFile.read(buffer)) > 0) {
		outFile.write(buffer, 0, len)
	}
	
	//Close the current entry
	outFile.closeEntry()
	
	//Close the current file input stream
	inFile.close()
	
}

//Close the ZipOutPutStream
outFile.close()



}

/**
 *
 * @properties={typeid:24,uuid:"893db2bb-475f-44a3-ac69-6951a90e6975"}
 */
function zzexport()
{


//prompt for which areas to do

//loop
	
	//prompt for which records in selected area to do
	
	//loop
	
		//look up mapping for..
			//relations
			//columns (and corresponding name)
		
		//call to helper Function to create node
			//recursion built in here
			
}

/**
 *
 * @properties={typeid:24,uuid:"788ed8be-c78b-411e-87cc-190c0e30a980"}
 */
function zzimport()
{


//prompt for import file
	
	//prompt for which available areas to import
	
	//loop
		
		//which specific items to import
		//how to import
			//overwrite
			//add, no delete
			//update
		
		//loop
			
			//look up mapping for..
				//relations
				//columns for 'mapped' name
			
			//call to helper Function to create node
				//recursion built in here
			
}
