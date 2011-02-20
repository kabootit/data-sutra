/**
 *
 * @properties={typeid:24,uuid:"c4c522e3-68c5-411a-a352-23c92c3e1363"}
 */
function ACTIONS_list()
{


/*
 *	TITLE:		ACTIONS_list
 *
 *	MODULE:		ds_NAV_navigation_standard
 *
 *	ABOUT:		
 *				pop the menu up instead of the default down
 *				uses a secondary invisible object on the layout which is behind the clicked button
 *				move secondary object up far enough to drop down a popup that hits the top edge
 *					of clicked btn
 *				when menu item is selected, return secondary object to original location
 *
 *	MODIFIED:	Sept 5, 2007 - Troy Elliott, Data Mosaic
 *
 */

var navItemRec = forms.NAV_0L_navigation_item_1L.foundset.getSelectedRecord()

//navigation set list
var fsNavigation = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation')
fsNavigation.loadAllRecords()
fsNavigation.sort('order_by asc')

//popup menu with navigation sets
var navSets = new Array()
for ( var i = 0 ; i < fsNavigation.getSize() ; i++ ) {
	var navRec = fsNavigation.getRecord(i + 1)
	
	//add non-config sets and not this set
	if (!navRec.flag_config && navItemRec.id_navigation != navRec.id_navigation) {
		navSets[i] = plugins.popupmenu.createMenuItem(navRec.nav_name + "", ACTIONS_list_control)
		navSets[i].setMethodArguments(4,navRec.id_navigation)
	}
}

//navigation item list
//popup menu with navigation items
var navItems = new Array()
for ( var i = 0 ; i < forms.NAV_0L_navigation_item_1L.nav_navigation_to_navigation_item__set.getSize() ; i++ ) {
	var itemRec = nav_navigation_to_navigation_item__set.getRecord(i + 1)
	
	if (itemRec.node_2 == 0 && itemRec.id_navigation_item != navItemRec.id_navigation_item) {
		navItems.push(plugins.popupmenu.createMenuItem(itemRec.item_name + "", ACTIONS_list_control))
		navItems[navItems.length - 1].setMethodArguments(3,itemRec.id_navigation_item)
	}
}

//get menu list from a value list
var valueList = [
		'New main navigation item',
		'New sub navigation item',
	//	'Duplicate navigation item',
		'-',
		'sub main sub',
		'Move to navigation set',
		'-',
		'Refresh columns with backend',
		'-',
		'Delete record'
	]

//insert correct conversion depending on what selected
//this is a sub item
if (navItemRec.node_2) {
	valueList.splice(3,1,'Main item <= sub item')
}
//this is a main item
else {
	valueList.splice(3,1,'Main item => sub item')
}

//build menu
var menu = new Array
for ( var i = 0 ; i < valueList.length ; i++ ) {
	//navigation sub to main
	if (i == 3 && !navItemRec.node_2) {
		menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", navItems)
	}
	//to new navigation set
	else if (i == 4) {
		menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", navSets)
	}
	//standard menu
	else {
		menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_control)
	}
}

//set menu method arguments
var x = 0
while (menu[x]) {
	//pass arguments
	menu[x].setMethodArguments(x)
	
	//disable dividers
	if (valueList[x] == '-') {
		menu[x].setEnabled(false)
	}
	
	x++
}

//hack not required
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//pop up the popup menu
	var elem = elements[application.getMethodTriggerElementName()]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menu)
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
 * @properties={typeid:24,uuid:"e67e8cd6-91e8-4552-bda4-b29120cb08cf"}
 */
function ACTIONS_list_control()
{


/*
 *	TITLE:		ACTIONS_list_control
 *
 *	MODULE:		ds_NAV_navigation_standard
 *
 *	ABOUT:		Contains actual code for actions popup menu item
 *				0: Create new node_1
 *				1: Create new node_2 on selected node_1
 *				: duplicate record
 *				3: Move node_1 to node_2
 *				4: Move node_2 to node_1
 *				6: Force column refresh (DEBUGGING)
 *				: Check 100% widths
 *				8: Delete record
 *
 *	MODIFIED:	Sept 5, 2007 - Troy Elliott, Data Mosaic
 *
 */

switch (arguments[0]) {
	case 0: //new main level item
		REC_new()
		break

	case 1: //new sub level in current main
		REC_new_sub()
		break
		
	case 2:	//duplicate navigation item
		REC_duplicate()
		break
		
	case 3: //convert main to sub
		CHANGE_main_sub_main(arguments[1])
		break
		
	case 4: //convert main to sub
		CHANGE_navigation_set(arguments[1])
		break
		
	case 6: //refresh columns
		var answer = plugins.dialogs.showQuestionDialog('Refresh','<html>Refresh column list with backend?<br>(Currently experimental - may hang system)','Yes','No')
		if (answer == 'Yes') {
			UPDATE_table_columns()
		}
		break
	
	case 8:	//delete record
		REC_delete()
		break	
}
}

/**
 *
 * @properties={typeid:24,uuid:"5d19dc1c-9281-45fc-adf8-8941696ca111"}
 */
function BTN_rec_new()
{

var keyPressed = globals.CODE_key_pressed()

//shift-key held down, create new sub
if (keyPressed == 1) {
	REC_new_sub()
}
else {
	REC_new()
}
}

/**
 *
 * @properties={typeid:24,uuid:"a6b31f38-f1f6-46ad-bd60-8fbde29d3e3d"}
 */
function CHANGE_main_sub_main(itemID)
{

	var formName = 'NAV_0L_navigation_item_1L'
		//hint: this is a global relation!
	var relationName = 'nav_navigation_to_navigation_item__set'
	
	var recordCurr = forms.NAV_0L_navigation_item_1L.foundset.getSelectedRecord()
	
	//if a main, make it a sub of the thing above/below; else make it the last main
	switch (recordCurr.node_2) {
		case 0:    //main to sub
			//passed in navID to attach to
			if (itemID) {
				var fsNavItem = databaseManager.getFoundSet(controller.getServerName(),controller.getTableName())
				fsNavItem.loadRecords(itemID)
				
				var recNavItem = fsNavItem.getRecord(1)
				
				if (recNavItem) {
					//where is the current bottom of stack?
					var lastNodeTwo = recNavItem.nav_navigation_item_to_navigation_item__children__all.getSize()
					
					//hook up all children (skip first record as it is the parent)
					for (var i = 2; i <= recordCurr.nav_navigation_item_to_navigation_item__children__all.getSize(); i++) {
						var childRec = recordCurr.nav_navigation_item_to_navigation_item__children__all.getRecord(i)
						
						childRec.node_1 = recNavItem.node_1
						childRec.node_2 = lastNodeTwo + i - 1
					}
					
					//hook up parent
					recordCurr.node_1 = recNavItem.node_1
					recordCurr.node_2 = lastNodeTwo
				}
			}
			else {
				plugins.dialogs.showErrorDialog(
							'Error',
							'No navigation set selected'
						)
			}
			break
			
		default:   //sub to last main
			var record = forms[formName].foundset.getRecord(forms[formName].foundset.getSize())
			
			recordCurr.node_1 = record.node_1 + 1
			recordCurr.node_2 = 0
			break
	}
	
	//sort lists
	forms[formName][relationName].sort('node_1 asc, node_2 asc')
}

/**
 * @properties={typeid:24,uuid:"25499B27-BB38-4585-8738-056A30FEA29E"}
 */
function CHANGE_navigation_set(navID) {
	var recordCurr = forms.NAV_0L_navigation_item_1L.foundset.getSelectedRecord()
	
	//passed in navID to attach to
	if (navID) {
		var fsNavigation = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation')
		fsNavigation.loadRecords(navID)
		
		recNav = fsNavigation.getRecord(1)
		
		if (recNav) {
			//where is the current bottom of stack?
			var lastNodeOne = recNav.nav_navigation_to_navigation_item__all.getRecord(recNav.nav_navigation_to_navigation_item__all.getSize()).node_1 + 1

			//hook up all children (skip first record as it is the parent)
			for (var i = 2; i <= recordCurr.nav_navigation_item_to_navigation_item__children__all.getSize(); i++) {
				var childRec = recordCurr.nav_navigation_item_to_navigation_item__children__all.getRecord(i)
				
				childRec.id_navigation = recNav.id_navigation
				childRec.node_1 = lastNodeOne
			}
			
			//hook up parent
			recordCurr.id_navigation = recNav.id_navigation
			recordCurr.node_1 = lastNodeOne
			
			//select the navigation set moved to
			forms.NAV_0L_navigation_1L.foundset.selectRecord(recNav.id_navigation)
			forms.NAV_0L_navigation_item_1L.foundset.selectRecord(recordCurr.id_navigation_item)
		}
	}
	else {
		plugins.dialogs.showErrorDialog(
					'Error',
					'No navigation set selected'
				)
	}
}

/**
 *
 * @properties={typeid:24,uuid:"8c26c896-0030-44f7-913d-df3b2bcfd84a"}
 */
function DIR_down()
{

/*
 *	TITLE    :	DIR_down
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	move navigation_item down in list
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	DIR_down()
 *			  	
 *	MODIFIED :	February 17, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'NAV_0L_navigation_item_1L'
var relationName = 'nav_navigation_to_navigation_item__set'

var fsNavItem = databaseManager.getFoundSet(forms[formName].controller.getServerName(), forms[formName].controller.getTableName())

//if max index, exit (no more records of same node-level below)
var recordLast = forms[formName][relationName].getRecord(forms[formName][relationName].getSize())
if (forms[formName].node_1 == recordLast.node_1 && ((forms[formName].node_2 == recordLast.node_2) || (forms[formName].node_2 == 0))) {
	return
}

//get pk of field started on
var pkRecSelect = forms[formName].id_navigation_item

//get current record
var recordCurr = forms[formName][relationName].getRecord(forms[formName][relationName].getSelectedIndex())

//get next record
var recordNext = forms[formName][relationName].getRecord(forms[formName][relationName].getSelectedIndex() + 1)

//if on top level, move block
if (recordCurr.node_2 == 0) {
	/**** setup ****/
	
	var navigationID = forms[formName].id_navigation
	var currentNode = recordCurr.node_1
	var nextNode = recordCurr.node_1 + 1
	
	//clear foundset flag
	var fsUpdater = databaseManager.getFoundSetUpdater(forms[formName].foundset)
	fsUpdater.setColumn('foundset_flag',0)
	fsUpdater.performUpdate()
	
	/**** section one ****/
	
	//get node values on current block
	fsNavItem.find()
	fsNavItem.id_navigation = navigationID
	fsNavItem.node_1 = currentNode
	fsNavItem.search()
		
	//tag foundset flag
	var fsUpdater = databaseManager.getFoundSetUpdater(fsNavItem)
	fsUpdater.setColumn('foundset_flag',1)
	fsUpdater.performUpdate()
	
	/**** section two ****/
	
	//get node values on next block
	fsNavItem.find()
	fsNavItem.id_navigation = navigationID
	fsNavItem.node_1 = nextNode
	fsNavItem.search()
	
	//set next block to current block
	var fsUpdaterNext = databaseManager.getFoundSetUpdater(fsNavItem)
	fsUpdaterNext.setColumn('node_1', currentNode)
	fsUpdaterNext.performUpdate()
	
	/**** section three ****/
	
	//get node values on current block
	fsNavItem.find()
	fsNavItem.id_navigation = navigationID
	fsNavItem.foundset_flag = 1
	fsNavItem.search()
	
	//set current block to next block
	var fsUpdaterCurrent = databaseManager.getFoundSetUpdater(fsNavItem)
	fsUpdaterCurrent.setColumn('node_1', nextNode)
	fsUpdaterCurrent.setColumn('foundset_flag', 0)
	fsUpdaterCurrent.performUpdate()
	
	/**** finish up ****/
	
	//select record we were on at start
	forms[formName].foundset.selectRecord(pkRecSelect)
}
//swap with next record (within block)
else {
	if (recordNext.node_2 != 0) {
		recordCurr.node_2 = recordNext.node_2
		recordNext.node_2 --
	}/*
	else {
		recordCurr.node_1 = recordNext.node_1
		recordNext.node_1 --
		recordCurr.node_2 = recordNext.node_2
		recordNext.node_2 = 0
	}*/
}

//sort lists
forms[formName][relationName].sort('node_1 asc, node_2 asc')


}

/**
 *
 * @properties={typeid:24,uuid:"8461d0d7-ad5b-4261-8e5e-96156eec509f"}
 */
function DIR_up()
{

/*
 *	TITLE    :	DIR_up
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	move navigation_item up in list
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	DIR_up()
 *			  	
 *	MODIFIED :	February 17, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'NAV_0L_navigation_item_1L'
var relationName = 'nav_navigation_to_navigation_item__set'

var fsNavItem = databaseManager.getFoundSet(forms[formName].controller.getServerName(), forms[formName].controller.getTableName())

//if index = 1, exit (no more records of same node-level above)
var recordFirst = forms[formName][relationName].getRecord(1)
if (forms[formName].node_1 == recordFirst.node_1 && ((forms[formName].node_2 == recordFirst.node_2) || (forms[formName].node_2 == 1))) {
	return
}

//get pk of field started on
var pkRecSelect = forms[formName].id_navigation_item

//get current record
var recordCurr = forms[formName][relationName].getRecord(forms[formName][relationName].getSelectedIndex())

//get previous record
var recordPrev = forms[formName][relationName].getRecord(forms[formName][relationName].getSelectedIndex() - 1)

//if on top level, move block
if (recordCurr.node_2 == 0) {
	/**** setup ****/
	
	var navigationID = forms[formName].id_navigation
	var currentNode = recordCurr.node_1
	var previousNode = recordCurr.node_1 - 1
	
	//clear foundset flag
	var fsUpdater = databaseManager.getFoundSetUpdater(forms[formName].foundset)
	fsUpdater.setColumn('foundset_flag',0)
	fsUpdater.performUpdate()
	
	/**** section one ****/
	
	//get node values on current block
	fsNavItem.find()
	fsNavItem.id_navigation = navigationID
	fsNavItem.node_1 = currentNode
	fsNavItem.search()
	
	//tag foundset flag
	var fsUpdater = databaseManager.getFoundSetUpdater(fsNavItem)
	fsUpdater.setColumn('foundset_flag',1)
	fsUpdater.performUpdate()
	
	/**** section two ****/
	
	//get node values on previous block
	fsNavItem.find()
	fsNavItem.id_navigation = navigationID
	fsNavItem.node_1 = previousNode
	fsNavItem.search()
	
	//set to previous block to current block
	var fsUpdaterPrevious = databaseManager.getFoundSetUpdater(fsNavItem)
	fsUpdaterPrevious.setColumn('node_1', currentNode)
	fsUpdaterPrevious.performUpdate()
	
	/**** section three ****/
	
	//get node values on previous block
	fsNavItem.find()
	fsNavItem.id_navigation = navigationID
	fsNavItem.foundset_flag = 1
	fsNavItem.search()
	
	//set to current block to previous block
	var fsUpdaterCurrent = databaseManager.getFoundSetUpdater(fsNavItem)
	fsUpdaterCurrent.setColumn('node_1', previousNode)
	fsUpdaterCurrent.setColumn('foundset_flag', 0)
	fsUpdaterCurrent.performUpdate()

	/**** finish up ****/
	
	//select record we were on at start
	forms[formName].foundset.selectRecord(pkRecSelect)
}
//swap with previous record (within block)
else {
	if (recordCurr.node_2 > 1) {
		recordCurr.node_2 = recordPrev.node_2
		recordPrev.node_2 ++
	}/*
	else {
		recordCurr.node_1 = recordPrev.node_1
		recordPrev.node_1 ++
		recordCurr.node_2 = recordPrev.node_2
		recordPrev.node_2 = 0
	}*/
}

//sort lists
forms[formName][relationName].sort('node_1 asc, node_2 asc')


}

/**
 *
 * @properties={typeid:24,uuid:"48372d2f-3981-4eda-81bf-a1a2c48f5197"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	form setup
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	September 15, 2008 -- David Workman, Data Mosaic
 *			  	
 */


// load tooltips from tooltip module
globals.TRIGGER_tooltip_set()
}

/**
 *
 * @properties={typeid:24,uuid:"5b7d056a-9f97-45af-97d2-a005e1587b26"}
 */
function REC_delete()
{

//TODO: beef up clean up
var formName = 'NAV_0L_navigation_item_1L'
var relationName = 'nav_navigation_item_to_navigation_item__children__all'
var relnAction = 'nav_navigation_item_to_action_item__filter'

var delRec = plugins.dialogs.showWarningDialog('Delete item','Do you really want to delete this navigation item?','Yes','No')
if (delRec == 'Yes') {
	
	var record = (arguments[0]) ? arguments[0] : forms[formName].foundset.getRecord(forms[formName].foundset.getSelectedIndex())
	
	if (record.node_2 == 0) {
		//checking for children
		if (utils.hasRecords(record[relationName]) && record[relationName].getSize() > 1) {
			var childCheck = true
			
			var confirm = plugins.dialogs.showWarningDialog(
							'Delete item',
							'This navigation item has children.  They will all be deleted.  Continue?',
							'Yes',
							'No'
						)
			
			if (confirm != 'Yes') {
				return
			}
		}
		
		//filter relations valid
		if (utils.hasRecords(record[relationName]) && utils.hasRecords(record[relationName][relnAction])) {
			var fsActions = record[relationName][relnAction]
			
			//fire my funky delete through all relations
			for (var i = 0; i < fsActions.getSize() ; i++) {
				//this is a hack to get around the funky relation web i have going on
					//MEMO: it will leave orphans if there are action items 2 levels deep
				var serverName = controller.getServerName()
				var tableName = 'sutra_action_item'
				
				var sql = databaseManager.getSQL(fsActions)
				var args = databaseManager.getSQLParameters(fsActions)
				
				//pks so can delete child records
				var filterIDs = databaseManager.getFoundSetDataProviderAsArray(fsActions, 'id_action_item')
				
				//modify sql to be delete statement
				sql = utils.stringReplace(sql, 'select id_action_item', 'delete')
				sql = utils.stringLeft(sql,utils.stringPosition(sql,')',0,1))
				
				var success = plugins.rawSQL.executeSQL(serverName,tableName,sql,args)
				
				//clean up and flush cache if successfully deleted
				if (success) {
					//clean up
					sql = 'DELETE from sutra_action_item_filter WHERE id_action_item IN ('
						for (var i = 0; i < filterIDs.length; i++) {
							sql += '?'
							
							//comma on all but the last element
							if (i + 1 < filterIDs.length) {
								sql += ','
							}
						}
					sql += ')'
					
					success = plugins.rawSQL.executeSQL(serverName,'sutra_action_item_filter',sql,filterIDs)
					
					//notify servoy of action_item deletions
					success = plugins.rawSQL.notifyDataChange(serverName, tableName,databaseManager.convertToDataSet(filterIDs),1)
					
				//	forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L.REC_on_select()
				}
			}
		}
		record[relationName].deleteAllRecords()
	}
	else {
		//filter relations valid
		if (utils.hasRecords(record[relnAction])) {
			var fsActions = record[relnAction]
			
			//fire my funky delete through all relations
			for (var i = 0; i < fsActions.getSize() ; i++) {
				//this is a hack to get around the funky relation web i have going on
					//MEMO: it will leave orphans if there are action items 2 levels deep
				var serverName = controller.getServerName()
				var tableName = 'sutra_action_item'
				
				var sql = databaseManager.getSQL(fsActions)
				var args = databaseManager.getSQLParameters(fsActions)
				
				//pks so can delete child records
				var filterIDs = databaseManager.getFoundSetDataProviderAsArray(fsActions, 'id_action_item')
				
				//modify sql to be delete statement
				sql = utils.stringReplace(sql, 'select id_action_item', 'delete')
				sql = utils.stringLeft(sql,utils.stringPosition(sql,')',0,1))
				
				var success = plugins.rawSQL.executeSQL(serverName,tableName,sql,args)
				
				//clean up and flush cache if successfully deleted
				if (success) {
					//clean up
					sql = 'DELETE from sutra_action_item_filter WHERE id_action_item IN ('
						for (var i = 0; i < filterIDs.length; i++) {
							sql += '?'
							
							//comma on all but the last element
							if (i + 1 < filterIDs.length) {
								sql += ','
							}
						}
					sql += ')'
					
					success = plugins.rawSQL.executeSQL(serverName,'sutra_action_item_filter',sql,filterIDs)
					
					//notify servoy of action_item deletions
					success = plugins.rawSQL.notifyDataChange(serverName, tableName,databaseManager.convertToDataSet(filterIDs),1)
					
				//	forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L.REC_on_select()
				}
			}
		}
		record.foundset.deleteRecord()
	}
	application.updateUI()
	
	//called from design mode, redraw nav item
	if (arguments[0]) {
		var idNavItem = solutionPrefs.config.currentFormID
		var idNavSet = globals.DATASUTRA_navigation_set
		var displayNavSet = application.getValueListDisplayValue('NAV_navigation_set',idNavSet)
		
		//if navigation items in this set, find posn of selected one
		if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length) {
			//find position in array
			var itemPosn = -1
			for (var i = 0; i < navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length && !(itemPosn >= 0); i++) {
				if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder[i].navigationItem.idNavigationItem == idNavItem) {
					itemPosn = i
				}
			}
			
			//not found, tack on at the end
			if (itemPosn < 0) {
				itemPosn = navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length
			}
		}
		
		//there were children, just rebuild the whole damn thing
		if (childCheck) {
			//select the first item
			var theItem = null
			
			var IDNavSet = globals.DATASUTRA_navigation_set
			var nameNavSet = application.getValueListDisplayValue('NAV_navigation_set',IDNavSet)
			
			//foundset with all navitems
			var fsNavItems = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation_item')
			fsNavItems.find()
			fsNavItems.id_navigation = IDNavSet
			fsNavItems.search()

			//sort lists
			fsNavItems.sort('node_1 asc, node_2 asc')
			
			//rebuild this entire nav set
			var navPrefs = {
						navSetID : IDNavSet,
						navSetName : nameNavSet,
						itemsByName : new Object(),
						itemsByOrder : new Array()
					}
			
			//loop through nav items and recreate them
			for (var j = 1; j <= fsNavItems.getSize(); j++) {
				var record = fsNavItems.getRecord(j)
				
				//create nav item node(s)
				navPrefs.itemsByName[record.item_name] = 
				navPrefs.itemsByOrder[j-1] = 
				navigationPrefs.byNavItemID[record.id_navigation_item] = 
					globals.NAV_navigation_item_load(record,true)
			}
			
			//assign new navPrefs back to navigationPrefs
			navigationPrefs.byNavSetID[IDNavSet] = 
			navigationPrefs.byNavSetName[nameNavSet] = 
				navPrefs
		}
		else {
			//pump in data for newly changed stuff
			if (itemPosn >= 0) {
				navigationPrefs.byNavSetName[displayNavSet].itemsByName.splice(itemPosn,1)
				navigationPrefs.byNavSetName[displayNavSet].itemsByOrder.splice(itemPosn,1)
			}
			delete navigationPrefs.byNavItemID[idNavItem]
			
			//there are items remaining
			if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length) {
				//try to get the one right below the deleted one
				if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length > itemPosn) {
					var theItem = navigationPrefs.byNavSetID[idNavSet].itemsByOrder[itemPosn].navigationItem.idNavigationItem
				}
				//else get the last one
				else {
					var theItem = navigationPrefs.byNavSetID[idNavSet].itemsByOrder[navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length - 1].navigationItem.idNavigationItem
				}
			}
			else {
				var theItem = null
			}
		}
		
		//redraw navitem list
		forms.NAV_0L_solution.LIST_redraw(theItem,true)
		
	}
	//called in frameworks engine, refresh main workflow are if needed
	else {
		//load no records into main pane
		relationName = 'nav_navigation_to_navigation_item__set'
		if (forms[formName][relationName].getSize() == 0) {
			forms.NAV_0F_navigation_item__inline.controller.loadRecords(forms[formName][relationName])
		}
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"6d3f1ffc-6795-433a-8a9c-2800186a896f"}
 */
function REC_duplicate()
{

/*
 *	TITLE    :	REC_duplicate
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	duplicate a navigation item
 *			  	
 *	INPUT    :	1- record to copy (optional)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_duplicate()
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
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

var subMethod = arguments[0]

if (subMethod || utils.hasRecords(foundset)) {
	
	var formName = 'NAV_0L_navigation_item_1L'
	
	//what record am i on?
	var record = (arguments[0]) ? arguments[0] : forms[formName].foundset.getRecord(forms[formName].foundset.getSelectedIndex())
	
	//turn on progress bar
	if (!subMethod) {
		globals.CODE_cursor_busy(true)
		globals.TRIGGER_progressbar_start(-273, 'Duplicating "' + record.item_name + '" to "' + record.item_name + ' copy"....')
	}
	
	var formNameNavItem = 'NAV_R_navigation_item'
	var relnNameColumn = 'nav_navigation_item_to_column'
	var relnNameDisplay = 'nav_navigation_item_to_list_display'
	var relnNameDisplayItem = 'nav_list_display_to_list_display_item'
	var relnNameAction = 'nav_navigation_item_to_action_item'
	var relnNameActionFilter = 'nav_action_item_to_action_item_filter'
	var relnNameChildren = 'nav_navigation_item_to_navigation_item__children__all'
	
	//get foundset
	var fsNavItem = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation_item')
	fsNavItem.clear()
	
	//create new navigation item
	var newRec = fsNavItem.getRecord(fsNavItem.newRecord(false,true))
	
	//copy the matching columns
	databaseManager.copyMatchingColumns(record,newRec)
	
	//null out registry
	newRec.item_id = null
	
	//add copy to name
	newRec.item_name = newRec.item_name + ' copy'
	
	//over-ride auto enter things
	newRec.use_fw_list = record.use_fw_list
	newRec.row_status_show = record.row_status_show
	newRec.bar_item_add = record.bar_item_add
	newRec.bar_item_action = record.bar_item_action
	newRec.bar_item_filter = record.bar_item_filter
	newRec.bar_item_report = record.bar_item_report
	newRec.bar_item_tab = record.bar_item_tab
	//databaseManager.saveData()
	
	//add to bottom of stack
	if (!subMethod) {
		//a node_1 nav item
		if (!record.node_2) {
			newRec.node_1 = foundset.getRecord(foundset.getSize()).node_1 + 1
		}
		//a node_2 nav item
		else {
			newRec.node_2 = record[relnNameChildren].getSize() + 1
		}
	}
	
	//select correct navigation_item
	forms[formNameNavItem].controller.find()
	forms[formNameNavItem].id_navigation_item = record.id_navigation_item
	forms[formNameNavItem].controller.search()
	
	//get column foundset object
	var columns = databaseManager.getFoundSet(controller.getServerName(),'sutra_column')
	columns.clear()
	
	//copy all columns over
	for (var j = 0; j < forms[formNameNavItem][relnNameColumn].getSize() ; j++) {
		//copy source action to a newly created one
		var srcRec = forms[formNameNavItem][relnNameColumn].getRecord(j+1)
		var destRec = columns.newRecord(false,true)
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
		var srcRec = forms[formNameNavItem][relnNameDisplay].getRecord(j+1)
		var destRec = display.newRecord(false,true)
		databaseManager.copyMatchingColumns(srcRec,destRec)
		
		destRec.id_navigation_item = newRec.id_navigation_item
		
		//copy all display items
		for (var k = 0; k < srcRec[relnNameDisplayItem].getSize() ; k++) {
			//copy all display items from original to new universal list display
			var displayItemRec = destRec[relnNameDisplayItem].getRecord(k+1)
			var destChildRec = display[relnNameDisplayItem].newRecord(false,true)
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
		var srcRec = forms[formNameNavItem][relnNameAction].getRecord(j+1)
		var destRec = actions.newRecord(false,true)
		databaseManager.copyMatchingColumns(srcRec,destRec)
		destRec.id_navigation_item = newRec.id_navigation_item
		
		if (srcRec.category == 'Filters') {
			//keep track of new id_action_item of item
			filterLevels[srcRec.id_action_item] = destRec.id_action_item
			
			//if sub level, update with value of new filter
			if (destRec.id_action_item_parent) {
				destRec.id_action_item_parent = filterLevels[destRec.id_action_item_parent]
			}
			
			//copy all filters over
			for (var k = 0; k < srcRec[relnNameActionFilter].getSize() ; k++) {
				var srcRec = srcRec[relnNameActionFilter].getRecord(k+1)
				var destRec = actions[relnNameActionFilter].newRecord(false,true)
				databaseManager.copyMatchingColumns(srcRec,destRec)
			}
		}
	}				
	
	//turn off progress bar
	if (!subMethod) {
		globals.TRIGGER_progressbar_stop()
		globals.CODE_cursor_busy(false)
		databaseManager.saveData()
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"fa741380-1c4d-4ad3-98ac-c4adc13e8373"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_NAV_navigation
 *			  	
 *	ABOUT    :	create new navigation item at the bottom of the stack
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_new()
 *			  	
 *	MODIFIED :	February 17, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'NAV_0L_navigation_item_1L'
var fsNavItem = databaseManager.getFoundSet(forms[formName].controller.getServerName(), forms[formName].controller.getTableName())

var record = fsNavItem.getRecord(fsNavItem.newRecord(false,true))
record.id_navigation = globals.NAV_navigation_selected
record.row_status_show = 1
//record.module_filter = globals.NAV_module_filter
record.space_available = '1\n10\n11\n12\n13\n14\n2\n3\n4\n5\n6\n7\n8\n9'

//if no navigation records
if (!databaseManager.hasRecords(forms[formName].foundset)) {
	//create new record
	record.node_1 = 1
	record.node_2 = 0
}
//at least one navigation record exists
else {
	//find max of current record
	var recordTwo = forms[formName].foundset.getRecord(forms[formName].foundset.getSize())
	
	record.node_1 = recordTwo.node_1 + 1
	record.node_2 = 0
}

databaseManager.saveData()

//resort in preferences list
forms[formName].controller.sort('node_1 asc, node_2 asc')

//select newly created record
forms[formName].foundset.selectRecord(record.id_navigation_item)

//change to forms tab if not already there
if (forms.NAV_0F_navigation_item.elements.tab_navigation.tabIndex != 1) {
	forms.NAV_0F_navigation_item.TAB_change(1)
}

//highlight navigation item name
forms.NAV_0F_navigation_item_1F__detail.elements.fld_item_name.requestFocus()


/*

old aug 2007 version


var formName = 'NAV_0L_navigation_item_1L'
var relationName = 'nav_navigation_to_navigation_item__set'

//if no navigation records
if (!databaseManager.hasRecords(forms[formName][relationName])) {
	//create new record
	forms[formName][relationName].newRecord(true,true)
	forms[formName].node_1 = 1
	forms[formName].node_2 = 0
}
else {
	//find max of current record
	var record = forms[formName].foundset.getRecord(forms[formName].foundset.getSize())
	
	//create new record
	forms[formName][relationName].newRecord(true,true)
	forms[formName].node_1 = record.node_1 + 1
	forms[formName].node_2 = 0
}

var pkNewRecord = forms[formName].id_navigation_item

//fill in remaining fields
formName = 'NAV_0L_navigation_item_1L'
forms[formName].row_status_show = 1
forms[formName].module_filter = globals.NAV_module_filter
forms[formName].space_available = '1\n10\n11\n12\n13\n14\n2\n3\n4\n5\n6\n7\n8\n9'
databaseManager.saveData()

//resort in preferences list
forms[formName].controller.sort('node_1 asc, node_2 asc')

//select newly created record
forms[formName].foundset.selectRecord(pkNewRecord)

//resort in main list
formName = 'NAV_0LA_navigation'
relationName = 'nav_navigation_to_navigation_item'
if (forms[formName].controller.getMaxRecordIndex()) {
	forms[formName][relationName].sort('node_1 asc, node_2 asc')
}

//select correct record in main form
forms.NAV_0L_navigation_item_1L.REC_on_select()

//change to forms tab if not already there
if (forms.NAV_0F_navigation_item.elements.tab_navigation.tabIndex != 1) {
	forms.NAV_0F_navigation_item.TAB_change(1)
}

//highlight navigation item name
forms.NAV_0F_navigation_item_1F__detail.elements.fld_item_name.requestFocus()
*/
}

/**
 *
 * @properties={typeid:24,uuid:"3cd32a13-61e6-419e-8709-2cdcbc8fb7db"}
 */
function REC_new_sub()
{

/*
 *	TITLE    :	REC_new_sub
 *			  	
 *	MODULE   :	ds_NAV_navigation
 *			  	
 *	ABOUT    :	creates new second-tiered navigation item record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_new()
 *			  	
 *	MODIFIED :	February 17, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'NAV_0L_navigation_item_1L'
var fsNavItem = databaseManager.getFoundSet(forms[formName].controller.getServerName(), forms[formName].controller.getTableName())

//get current node 1
var nodeOne = forms[formName].node_1 || 1

//get max of node 2
fsNavItem.find()
fsNavItem.id_navigation = globals.NAV_navigation_selected
fsNavItem.node_1 = nodeOne
var nodeTwoMax = fsNavItem.search()

//if there are items at the same node level, sort them so we can get the parent
if (nodeTwoMax) {
	fsNavItem.sort('node_2 asc')
	
	var parent = fsNavItem.getRecord(1)
	
	//make sure default on parent is expanded	
	if (!parent.row_status_expanded) {
		parent.row_status_expanded = 1
	}
}

var record = fsNavItem.getRecord(fsNavItem.newRecord(false,true))
record.id_navigation = globals.NAV_navigation_selected
record.row_status_show = 1
//record.module_filter = globals.NAV_module_filter
record.space_available = '1\n10\n11\n12\n13\n14\n2\n3\n4\n5\n6\n7\n8\n9'
record.node_1 = nodeOne
record.node_2 = nodeTwoMax

databaseManager.saveData()

//resort in preferences list
forms[formName].controller.sort('node_1 asc, node_2 asc')

//select newly created record
forms[formName].foundset.selectRecord(record.id_navigation_item)

//change to forms tab if not already there
if (forms.NAV_0F_navigation_item.elements.tab_navigation.tabIndex != 1) {
	forms.NAV_0F_navigation_item.TAB_change(1)
}

//highlight navigation item name
forms.NAV_0F_navigation_item_1F__detail.elements.fld_item_name.requestFocus()

/*

var formName = 'NAV_0L_navigation_item_1L'
var relationName = 'nav_navigation_to_navigation_item__set'
var relationChild = 'nav_navigation_item_to_navigation_item__children__all'

//get current node 1
var node1 = forms[formName].node_1
//get max of node 2
var maxNode2 = forms[formName][relationChild].getSize()

//make sure default on parent is expanded
if (utils.hasRecords(forms[formName][relationChild]) && !forms[formName][relationChild].row_status_expanded) {
	forms[formName][relationChild].row_status_expanded = 1
}

//create new record
forms[formName][relationName].newRecord(true,true)

var pkNewRecord = forms[formName].id_navigation_item

//fill in fields
//formName = 'NAV_0L_navigation_item_1L'
forms[formName].node_1 = node1
forms[formName].node_2 = maxNode2
forms[formName].row_status_show = 1
forms[formName].module_filter = globals.NAV_module_filter
forms[formName].space_available = '1\n10\n11\n12\n13\n14\n2\n3\n4\n5\n6\n7\n8\n9'
databaseManager.saveData()

//resort in preferences list
forms[formName].foundset.sort('node_1 asc, node_2 asc')

//select newly created record
forms[formName].foundset.selectRecord(pkNewRecord)

//select correct record in main form
forms.NAV_0L_navigation_item_1L.REC_on_select()

//change to forms tab if not already there
if (forms.NAV_0F_navigation_item.elements.tab_navigation.tabIndex != 1) {
	forms.NAV_0F_navigation_item.TAB_change(1)
}

//highlight navigation item name
forms.NAV_0F_navigation_item_1F__detail.elements.fld_item_name.requestFocus()
*/
}

/**
 *
 * @properties={typeid:24,uuid:"c1d6023e-88e3-48f1-8b2d-cad653136305"}
 */
function TOGGLE_fields()
{

/*
 *	TITLE    :	TOGGLE_fields
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
 *	MODIFIED :	July 22, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */


if (globals.CODE_key_pressed() == 2) {	
	var formName = 'NAV_0L_navigation_item_1L'
	
	forms[formName].elements.fld_id_navigation.visible = !forms[formName].elements.fld_id_navigation.visible
	forms[formName].elements.fld_node_1.visible = !forms[formName].elements.fld_node_1.visible
	forms[formName].elements.fld_node_2.visible = !forms[formName].elements.fld_node_2.visible
	forms[formName].elements.fld_show.visible = !forms[formName].elements.fld_show.visible
	forms[formName].elements.fld_expanded.visible = !forms[formName].elements.fld_expanded.visible
}

}

/**
 *
 * @properties={typeid:24,uuid:"c1bdd812-d031-4de9-b11f-083796ae6ab0"}
 */
function UPDATE_table_columns()
{

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

//TODO: error with refresh

var formName = 'NAV_0F_navigation_item_1F__detail'
var relnName = 'nav_navigation_item_to_column'

var formLoad = forms[formName].form_to_load
var tableReln = (arguments[0]) ? arguments[0] : forms[formName].form_to_load_table

//check if form_to_load is a valid entry
if (!forms[formLoad]) {
	plugins.dialogs.showErrorDialog('Form missing','The selected form to load does not exist in this solution','OK')
	forms[formName].elements.fld_form_to_load.requestFocus(false)
}
else {
	var tableName = forms[formLoad].controller.getTableName()
	var serverName = forms[formLoad].controller.getServerName()
	
	//set table name to current value, delete column records if table values are different
	if (tableName != forms[formName].form_to_load_table) {
		//set new table name
		forms[formName].form_to_load_table = tableName
		
		//delete all column records
		if (utils.hasRecords(forms[formName][relnName])) {
			forms[formName][relnName].deleteAllRecords()
		}
	}
	
	
	//check for new column names and add
	
	//get sorted array of columnNames from backend
	var jsTable = databaseManager.getTable(serverName, tableName)
	var aColumnName = jsTable.getColumnNames()
	var columnNames = new Array()
		
	for ( var i = 0 ; i < aColumnName.length ; i++ ) {
		var jsColumn = jsTable.getColumn(aColumnName[i])
		var columnInfo = new Object()
		
		columnInfo['nameColumn'] = jsColumn.getSQLName().toLowerCase() //format as lower case
		columnInfo['typeColumn'] = jsColumn.getTypeAsString().toUpperCase() //format as upper case
		
		columnNames[i] = columnInfo
	}
	columnNames.sort()
	
	
	
	//get current column values from in sutra_column (columnNamesStored)
	var columnNamesStored = new Array()
	
	if (utils.hasRecords(forms[formName][relnName])) {
		for (var i = 0 ; i < forms[formName][relnName].getSize() ; i++) {
			var columnInfo = new Object()
			
			var record = forms[formName][relnName].getRecord(i+1)
			
			columnInfo['nameColumn'] = record.name_column
			columnInfo['idNavItem'] = record.id_navigation_item
			columnInfo['typeColumn'] = record.type_column
			
			columnNamesStored[i] = columnInfo
		}
		columnNamesStored.sort()
	}
	
	
	var k = 0
	for ( var j = 0 ; j < columnNames.length ; j++ ) {
		
		if (columnNamesStored.length <= k) {
			var columnValue = null
			var columnType = null
		}
		else {
			var columnValue = columnNamesStored[k].nameColumn
			var columnType = columnNamesStored[k].typeColumn
		}
		
		//if columnName AND columnType in both sets, advance
		if ((columnNames[j].nameColumn == columnValue) && (columnNames[j].typeColumn == columnType)) {
			k++
		}
		//"smart update" column names; adds new columns and deletes those no longer present
		else {
			//position of columnValue in columnNames
			var posn = globals.CODE_search_object_array(columnNames,columnValue,'nameColumn')
			
			//if columnName not in columnNames, delete from sutra_column	
			if (posn == -1) {		
				forms[formName][relnName].selectRecord(columnNamesStored[k].id_column)
				forms[formName][relnName].deleteRecord()
				
				//leave j on same counter (after auto-increment) so that it will be triggered again
				j--
				
				//advance k to next value
				k++
			}
			//add all items in between current position and next backend column present to sutra_column
			else if (posn && columnType) {
				var skippedColumns = posn - j
				
				var m
				for (m = 0 ; m < skippedColumns ; m++) {		
					var colName = columnNames[j+m].nameColumn
					var colType = columnNames[j+m].typeColumn
					
					forms[formName][relnName].newRecord(false,true)
					forms[formName][relnName].name_column = colName
					forms[formName][relnName].type_column = colType
				}
				//TODO some funky loop is gotten into here
				if (skippedColumns == 1) {
					j += m
				}
				else {
					j += m - 1
				}
			}
			else {
				var posn = globals.CODE_search_object_array(columnNamesStored,columnNames[j].nameColumn,'nameColumn')
				
				//columnType is different, update
				if (posn != -1) {
					forms[formName][relnName].selectRecord(columnNamesStored[k].id_column)
					forms[formName][relnName].type_column = columnType
					
					//advance k to next value
					k++
				}
				//columnName not in columnNameStored, so add to sutra_column
				else {
					var colName = columnNames[j].nameColumn
					var colType = columnNames[j].typeColumn
					
					forms[formName][relnName].newRecord(false,true)
					forms[formName][relnName].name_column = colName
					forms[formName][relnName].type_column = colType
					forms[formName][relnName].table_or_relation = tableReln
					forms[formName][relnName].status_relation = 0
				}
			}
		}
	}
	
	//if remaining records in find_item that have not been processed already, delete
	while (k < columnNamesStored.length) {
		forms[formName][relnName].selectRecord(columnNamesStored[k].id_column)
		forms[formName][relnName].deleteRecord()
		
		k++ //advance k to next value
	}
	
	databaseManager.saveData()
	
	//resort list on FORMS layout
	forms[formName][relnName].sort('name_column asc')
	forms[formName][relnName].setSelectedIndex(1)
	
	//resort list on FIND layout
	formName = 'NAV_0F_navigation_item_1F_column__fastfind'
	relnName = 'nav_column_to_column'
	
	if (forms[formName].controller.getMaxRecordIndex()) {
		forms[formName][relnName].sort('name_column asc')
		forms[formName][relnName].setSelectedIndex(1)
	}
}
}
