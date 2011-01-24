/**
 *
 * @properties={typeid:24,uuid:"0CB9F20C-8E7A-44FA-A691-97398613F61C"}
 */
function ACTIONS_list()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	pop the menu up instead of the default down
 *			  	uses a secondary invisible object on the layout which is behind the clicked button
 *			  	move secondary object up far enough to drop down a popup that hits the top edge
 *			  		of clicked btn
 *			  	when menu item is selected, return secondary object to original location
 *			  	
 *			  	action values retrieved from action_item table
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs, globals.NAV_navigation_item_selected containing pk of currently selected workflow area's navigation item
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//grab the actions to this
var valueList = new Array()
var methodTypes = new Array()
var methods = new Array()
for (var i = 0; i < navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].universalList.buttons.actions.length ; i++) {
	var actionItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].universalList.buttons.actions[i]
	valueList.push(actionItem.menuName)
	methodTypes.push(actionItem.methodType)
	methods.push(actionItem.method)
}

//only show pop-up if there are enabled values
if (valueList.length) {
	//build menu
	var menu = new Array()
	for (var i = 0 ; i < valueList.length ; i++) {
		menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_control)
		menu[i].setMethodArguments(valueList[i], methodTypes[i], methods[i])
		
		//disable dividers
		if (valueList[i] == '-') {
			menu[i].setEnabled(false)
		}
		else {
			if (methodTypes[i] == 'Method') {
				//if no method or method does not exist on the form, do not run
				if (!(solutionPrefs.config.currentFormName in forms && methods[i] && forms[solutionPrefs.config.currentFormName][methods[i].slice(0,methods[i].length-2)])) {
					menu[i].setEnabled(false)
				}
			}
			else if (methodTypes[i] == 'Custom code') {
				if (methods[i] == null || methods[i] == '') {
					menu[i].setEnabled(false)
				}
			}
			else {
				menu[i].setEnabled(false)
			}
		}
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
}

/**
 *
 * @properties={typeid:24,uuid:"4C283E66-F5DA-483A-83B7-144D7CF8B063"}
 */
function ACTIONS_list_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	prepare method to be run by:
 *			  		1) scoping controller to the correct form
 *			  		2) replacing 'field' with a scoped reference
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs, globals.NAV_navigation_item_selected containING pk of currently selected workflow area's navigation item
 *			  	
 *	MODIFIED :	Nov 20, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: switch over to call with context from plugin

if (application.__parent__.solutionPrefs) {
	
	var formName = solutionPrefs.config.currentFormName
	var methodItem = arguments[0]
	var methodType = arguments[1]
	var method = arguments[2]
	
	//logging
	var serverName = forms[formName].controller.getServerName()
	var tableName = forms[formName].controller.getTableName()
	//only run when using query based way to hit repository
	if (solutionPrefs.repository && solutionPrefs.repository.allFormsByTable && solutionPrefs.repository.allFormsByTable[serverName] && solutionPrefs.repository.allFormsByTable[serverName][tableName] && solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey) {
		var pkName = solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey
		var pkActedOn = forms[formName][pkName]
	}
	else {
		var pkName = 'repositoryAPINotImplemented'
		var pkActedOn = 0
	}
	
	///*
	//if custom code, scope all form-specific attributes to that form
	if (methodType == 'Custom code') {
//		//controller
//		method = utils.stringReplace(method, 'controller', 'forms.' + formName + '.controller')
//		//elements
//		method = utils.stringReplace(method, 'elements', 'forms.' + formName + '.elements')
//		//foundset
//		method = utils.stringReplace(method, 'foundset', 'forms.' + formName + '.foundset')
//		//currentcontroller
//		method = utils.stringReplace(method, 'currentcontroller', 'forms.' + formName + '.controller')
//		
//		//field (our own addition)
//		method = utils.stringReplace(method, 'field', 'forms.' + formName)
//		
//		//return; set to be a random variable, and set this value
//		//MEMO: do not preface zeroblahblah with var - we need it to survive the mangling
//		var returnUUID = 'zero1123581321',
//			zero1123581321
//		
//		//TODO: must trap for when return just used to break out of situation
//		method = utils.stringReplace(method, 'return', returnUUID + ' =')
//		method = 'var zero1123581321\n'+method
	
	}
	else if (methodType == 'Method') {
		//if method does not exist on the form, do not run
		if (forms[formName] && forms[formName][method.slice(0,method.length-2)]) {
			//method = 'forms.' + formName + '.' + method
		}
		else {
			method = null
		}
	}
	//*/
	
	if (methodType != null || methodType != '' && method) {
		with (forms[formName]) {
			eval(method)
		}
	}
	else {
		plugins.dialogs.showInfoDialog('Config incomplete', 'Return to navigation setup to complete this action', 'OK')
	}
	
	//LOG ul action
	globals.TRIGGER_log_create('UL Actions',
						methodItem,
						method,
						serverName,
						tableName,
						pkName,
						pkActedOn
						)
	
	/*
	//if value returned from method, return it
	if (zero1123581321 != undefined) {
		return zero1123581321
	}
	*/
}
}

/**
 *
 * @properties={typeid:24,uuid:"7A04CD35-4E33-43EA-8D2F-E6AC45FA22D3"}
 */
function BUTTONS_toggle()
{

/*
 *	TITLE    :	BUTTONS_toggle
 *			  	
 *	MODULE   :	wf_NAV_engine
 *			  	
 *	ABOUT    :	toggle which buttons are showing
 *			  	
 *	INPUT    :	id_navigation_item
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	BUTTONS_toggle()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var currentNavItem = arguments[0]

//toggle add record button
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].universalList.buttons.add) {
	elements.btn_add.visible = true
}
else {
	elements.btn_add.visible = false
}

//toggle actions button
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].universalList.buttons.actions) {
	elements.btn_actions.visible = true
}
else {
	elements.btn_actions.visible = false
}

//toggle filters button
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].universalList.buttons.filters) {
	elements.btn_filters.visible = true
}
else {
	elements.btn_filters.visible = false
}

//toggle reports button
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].universalList.buttons.reports) {
	elements.btn_reports.visible = true
}
else {
	elements.btn_reports.visible = false
}

//toggle tabs button
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].universalList.buttons.tabs) {
	elements.btn_tabs.visible = true
}
else {
	elements.btn_tabs.visible = false
}

//toggle display button
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].universalList.displays && navigationPrefs.byNavItemID[currentNavItem].universalList.displays.length > 1) {
	elements.btn_display.visible = true
}
else {
	elements.btn_display.visible = false
}

//toggle line between add and actions
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].universalList.buttons.add && navigationPrefs.byNavItemID[currentNavItem].universalList.buttons.actions) {
	elements.divider_add_action.visible = true
}
else {
	elements.divider_add_action.visible = false
}

//toggle line between actions and filters
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].universalList.buttons.actions && navigationPrefs.byNavItemID[currentNavItem].universalList.buttons.filters) {
	elements.divider_action_filter.visible = true
}
else {
	elements.divider_action_filter.visible = false
}


}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"A7F66836-3F91-4821-8077-681B47C0BB3D"}
 */
function DISPLAY_cycle(event)
{
	
/*
 *	TITLE    :	DISPLAY_cycle
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	this Function cycles through display options; shift refreshes current display
 *			  	
 *	INPUT    :	1- force refresh
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	DISPLAY_list_control
 *			  	
 *	USAGE    :	DISPLAY_cycle() Cycles through all available display options (refreshes current display if shift held)
 *			  	
 *	MODIFIED :	September 26, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//cast Arguments to array
var Arguments = new Array()
for (var i = 0; i < arguments.length; i++) {
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
	Arguments.push(arguments[i])
}
//reassign arguments without jsevents
arguments = Arguments.filter(globals.CODE_jsevent_remove)

if (application.__parent__.solutionPrefs) {
	var refresh = arguments[0]
	var formName = solutionPrefs.config.currentFormName
	var currentNavItem = solutionPrefs.config.currentFormID
	var recSelected = forms[formName].controller.getSelectedIndex()
	
	//get menu list from active sort items
	var displayItems = navigationPrefs.byNavItemID[currentNavItem].universalList.displays
	
	//max number of displays
	var maxDisplays = displayItems.length
	
	//loop through display items to find the selected one
	var selectedDisplay = false
	for (var i = 0; i < maxDisplays && (typeof selectedDisplay == 'boolean'); i++) {
		if (globals.DATASUTRA_display == displayItems[i].displayID) {
			selectedDisplay = i
		}
	}
	
	//current display is a valid choice
	if (typeof selectedDisplay != 'boolean') {
		//shift key pressed not pressed; cycle to next available display
		if (!refresh && !globals.CODE_key_pressed('shift')) {
			//go to next display
			if (selectedDisplay < maxDisplays - 1) {
				selectedDisplay++
			}
			//end reached, loop to beginning
			else {
				selectedDisplay = 0
			}
		}
		
		//either refresh the current display or go to the next one
		DISPLAY_list_control(displayItems[selectedDisplay].rawDisplay,displayItems[selectedDisplay].displayID,displayItems[selectedDisplay].listTitle,formName,recSelected,displayItems[selectedDisplay].rowPreview,selectedDisplay,true)
	}
}

	

}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D32840FC-FE0B-4276-AF3C-E8FB47B94FD8"}
 */
function DISPLAY_list(event)
{
	
/*
 *	TITLE    :	DISPLAY_list
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	this Function displays display options; shift refreshes current display
 *			  	
 *	INPUT    :	1- force a refresh of currently selected display (true/false)
 *			  	2- display to refresh
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	DISPLAY_list_control
 *			  	
 *	USAGE    :	DISPLAY_list(refreshList,refreshListPosn) Shows pop-up of different display options (refreshes current display if shift held or true passed)
 *			  	
 *	MODIFIED :	June 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//cast Arguments to array
var Arguments = new Array()
for (var i = 0; i < arguments.length; i++) {
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
	Arguments.push(arguments[i])
}
//reassign arguments without jsevents
arguments = Arguments.filter(globals.CODE_jsevent_remove)

if (application.__parent__.solutionPrefs) {
	var formName = solutionPrefs.config.currentFormName
	var currentNavItem = solutionPrefs.config.currentFormID
	var recSelected = forms[formName].controller.getSelectedIndex()
	var refresh = arguments[0]
	var refreshPosn = arguments[1]
	
	//get menu list from active sort items
	var displayItems = navigationPrefs.byNavItemID[currentNavItem].universalList.displays
	
	//new display specified and there is a display there
	if (typeof refreshPosn == 'number' && displayItems.length >= refreshPosn) {
		globals.DATASUTRA_display = displayItems[refreshPosn - 1].displayID
	}
	
	//shift key pressed or force refresh requested; refresh current display
	if (globals.CODE_key_pressed() == 1 || refresh) {
		
		//loop through display items to find the selected one
		var recFound = false
		for (var i = 0; i < displayItems.length && (typeof recFound == 'boolean'); i++) {
			if (globals.DATASUTRA_display == displayItems[i].displayID) {
				recFound = i
			}
		}
		
		//fire refresh method
		if (typeof recFound != 'boolean') {
			DISPLAY_list_control(displayItems[recFound].rawDisplay,displayItems[recFound].displayID,displayItems[recFound].listTitle,formName,recSelected,displayItems[recFound].rowPreview,recFound,true)
		}
	}
	//show pop-up
	else {
		if (displayItems) {
			//build menu
			var menu = new Array ()
			for ( var i = 0 ; i < displayItems.length ; i++ ) {
				//set check mark
				if (globals.DATASUTRA_display == displayItems[i].displayID) {
					menu[i] = plugins.popupmenu.createCheckboxMenuItem(displayItems[i].rowPreview + "", DISPLAY_list_control)
					menu[i].setSelected(true)
				}
				else {
					menu[i] = plugins.popupmenu.createMenuItem(displayItems[i].rowPreview + "", DISPLAY_list_control)
				}
				
				//pass arguments
				menu[i].setMethodArguments(displayItems[i].rawDisplay,displayItems[i].displayID,displayItems[i].listTitle,formName,recSelected,displayItems[i].rowPreview,i)
			}
			
			//push menu down to the header line
			var btnInvisible = application.getMethodTriggerElementName() + "_down"
			var currentLocationX = elements[btnInvisible].getLocationX()
			var currentLocationY = elements[btnInvisible].getLocationY()
			
			elements[btnInvisible].setLocation(currentLocationX, currentLocationY + 3)
			
			//popup menu
			var elem = elements[btnInvisible]
			if (elem != null) {
			    plugins.popupmenu.showPopupMenu(elem, menu);
			}
			
			//set invisible btn back to original location
			elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
	
		}
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"4D963B51-6DE9-45B1-A091-C6275DC590BF"}
 */
function DISPLAY_list_control()
{

if (application.__parent__.solutionPrefs) {
	
	var rawDisplay = arguments[0]
	var theDisplayID = arguments[1]
	var listTitle = arguments[2]
	var formName = arguments[3]
	var recSelected = arguments[4]
	var rowPreview = arguments[5]
	var theDisplayPosn = arguments[6]
	var syncRecords = arguments[7]
	
	var currentNavItem = solutionPrefs.config.currentFormID
	
	//set check box in display drop down
	globals.DATASUTRA_display = theDisplayID
	navigationPrefs.byNavItemID[currentNavItem].universalList.displays.displayID = theDisplayID
	navigationPrefs.byNavItemID[currentNavItem].universalList.displays.displayPosn = theDisplayPosn
	
	//if list_title overridden in display preferences, use it; otherwise, set record header to fw_list_title for that navigation item
	if (navigationPrefs.byNavItemID[currentNavItem].universalList.displays[theDisplayPosn].listTitle) {
		var listTitle = navigationPrefs.byNavItemID[currentNavItem].universalList.displays[theDisplayPosn].listTitle
	}
	else {
		var listTitle = navigationPrefs.byNavItemID[currentNavItem].navigationItem.fwListTitle
	}
	
	if (listTitle) {
		elements.record_heading.text = listTitle.toUpperCase()
	}
	else {
		elements.record_heading.text = (navigationPrefs.byNavItemID[currentNavItem].navigationItem.itemName) ? navigationPrefs.byNavItemID[currentNavItem].navigationItem.itemName.toUpperCase() : 'RECORDS'
	}
	
	//pump new data in
//	if (syncRecords) {
//		UL_sync_records()
//	}
//	else {
//		UL_fill_data()
//	}
	
	//get the form, destroy it, put new one in its place
	var uniList = 'NAV_T_universal_list_1L'
				
	//new form name (UL__set000_item000_CRM_0F_companies)
	var newFormName = navigationPrefs.byNavItemID[currentNavItem].listData.tabFormInstance
	var newFormTab = navigationPrefs.byNavItemID[currentNavItem].listData.tabNumber

	//if form already defined, remove
	if (forms[newFormName]) {
		//remove from tabpanel
		elements.tab_ul.removeTabAt(newFormTab)
	}
//	//if form already defined, remove
//	if (forms[newFormName]) {
//		//remove from tabpanel
//		elements.tab_ul.removeTabAt(newFormTab)
//		//first remove it from the current history, to destroy any active form instance
//		var success = history.removeForm(newFormName)
//		//removes the named form from this session
//		if (success) {
//			solutionModel.removeForm(newFormName)
//		}
//	}
	//create new forms
	var template = globals.NAV_universal_list_form_to_template(uniList)
	var myForm = globals.NAV_universal_list_template_to_form(template,newFormName)
	
	//set datasource
	myForm.serverName = forms[solutionPrefs.config.currentFormName].controller.getServerName()
	myForm.tableName = forms[solutionPrefs.config.currentFormName].controller.getTableName()
	
	//set events
	myForm.onShow = solutionModel.getGlobalMethod('NAV_universal_list_show')
	myForm.onRecordSelection = solutionModel.getGlobalMethod('NAV_universal_list_select')
	myForm.rowBGColorCalculation = 'globals.NAV_row_background'
	
	//get the UL data and set it up
	var allULDisplays = navigationPrefs.byNavItemID[currentNavItem].universalList.displays
	var initialUL = allULDisplays[allULDisplays.displayPosn].rawDisplay
	
	for (var i = 0; i < initialUL.length; i++) {
		var lineItem = initialUL[i]
		
		//determine alignment
		var horizAlign = 2
		switch (lineItem.align) {
			case 'left':
				horizAlign = 2
				break
			case 'right':
				horizAlign = 4
				break
			case 'center':
				horizAlign = 0
				break
		}
		
		var fieldFormat = null
		var fieldVL = null
		
		//determine format
		if (lineItem.formatMask == 'Number' || lineItem.formatMask == 'Date') { // || lineItem.formatMask == 'Text') {
			var fieldFormat = lineItem.format
		}
		else if (lineItem.formatMask == 'Valuelist') {
			var fieldVL = lineItem.format
		}	
		
		//TODO: check for better name
		var nameNameField = (lineItem.rowDisplay[0].isField) ? lineItem.rowDisplay[0].value : lineItem.fieldName
		
		//TODO: error checking for contents of rawDisplay
		if (!nameNameField) {
			continue
		}
		
		//create field
		var myField = myForm.newTextField(
						nameNameField,			//dataprovider
						i,						//x
						0,						//y
						lineItem.width,			//width
						20						//height
					)
		
		myField.setOnFocusGainedMethod(globals.NAV_universal_list_select__unhilite)
		myField.anchors = SM_ANCHOR.ALL
		myField.horizontalAlignment = horizAlign
		myField.styleClass = 'customlist'
		myField.editable = false
		myField.borderType = 'EmptyBorder,0,0,0,0'
		myField.margin = '0,4,0,4'
		myField.scrollbars = 0
		myField.transparent = true
		myField.text = (lineItem.header) ? lineItem.header : nameNameField
		if (fieldFormat) {
			myField.format = fieldFormat
		}
		if (fieldVL) {
			myField.valuelist = solutionModel.getValueList(fieldVL)
		}
	}
	
	//assign the secondary form to the main UL at the tab right behind where it used to be (when deleted, the others slid over to fill its spot)
	elements.tab_ul.addTab(forms[newFormName],'UL Record: ' + theDisplayPosn,null,null,null,null,null,null,newFormTab - 1)
	navigationPrefs.byNavItemID[currentNavItem].listData.dateAdded = application.getServerTimeStamp()
	
	elements.tab_ul.tabIndex = newFormTab
	
	//LOG ul display change
	var serverName = forms[formName].controller.getServerName()
	var tableName = forms[formName].controller.getTableName()
	globals.TRIGGER_log_create('UL Displays',
						rowPreview,
						serverName,
						tableName
						)
}
}

/**
 *
 * @properties={typeid:24,uuid:"6A29BEC1-59E1-4019-9015-4CC9710153F8"}
 */
function FILTERS_list()
{

/*
 *	TITLE    :	FILTERS_list
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	pop the menu up instead of the default down
 *			  	uses a secondary invisible object on the layout which is behind the clicked button
 *			  	move secondary object up far enough to drop down a popup that hits the top edge
 *			  		of clicked btn
 *			  	when menu item is selected, return secondary object to original location
 *			  	
 *			  	get filter values and set parameters
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs, globals.NAV_navigation_item_selected containing pk of currently selected workflow area's navigation item
 *			  	
 *	MODIFIED :	July 16, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var serverName = controller.getServerName()
var query = ''
var args = new Array()
var maxRecords = 100

var prefix = 'actionItem_'
var navigationID = solutionPrefs.config.currentFormID

/*	//MEMO: this uses queries to hit the backend
//get the pk for items that have submenus and post-processing information
query = 	'SELECT id_action_item, id_action_item_parent, filter_type from mosaic_action_item ' +
			'WHERE id_navigation_item = ? AND category = ? AND filter_type = ? ' +
			'ORDER BY id_action_item_parent ASC'
args = [navigationID,'Filters',1]
var dataset = databaseManager.getDataSetByQuery(serverName,query,args,maxRecords)

var allSubMenuID = dataset.getColumnAsArray(1)
var allSubMenuParentID = dataset.getColumnAsArray(2)

//tack on main filter items to top
allSubMenuID.unshift(0)
allSubMenuParentID.unshift(null)

var allMenus = new Object()
//get all menus
for (var i = 0; i < allSubMenuID.length; i++) {
	query =	'SELECT id_action_item, menu_name, filter_type, filter_sort, filter_limit, filter_method FROM mosaic_action_item ' +
			'WHERE id_navigation_item = ? AND category = ? AND id_action_item_parent = ? ' +
			'ORDER BY order_by ASC'
	args = [navigationID,'Filters',allSubMenuID[i]]
	dataset = databaseManager.getDataSetByQuery(serverName,query,args,maxRecords)
	
	var menu = new Object()
	menu.menuID = dataset.getColumnAsArray(1)
	menu.menuItem = dataset.getColumnAsArray(2)
	menu.menuType = dataset.getColumnAsArray(3)
	menu.filterSort = dataset.getColumnAsArray(4)
	menu.filterLimit = dataset.getColumnAsArray(5)
	menu.filterMethod = dataset.getColumnAsArray(6)
	var filterItems = 
	menu.menuFilters = 
		new Array()
	
	//loop through all menu items
	for (var k = 0; k < menu.menuID.length; k++) {
		//if it is not a submenu, get the filter_items
		if (menu.menuType[k] == 0 || menu.menuType[k] == null) {
			query =	'SELECT column_relation, column_name, column_operator, column_value, filter_type, method_name FROM mosaic_action_item_filter WHERE id_action_item = ?'
			args = [menu.menuID[k]]
			dataset = databaseManager.getDataSetByQuery(serverName,query,args,maxRecords)
			var filterType = dataset.getColumnAsArray(5)
			var tableReln = dataset.getColumnAsArray(1)
			var columnName = dataset.getColumnAsArray(2)
			var operator = dataset.getColumnAsArray(3)
			var columnValue = dataset.getColumnAsArray(4)
			var methodName = dataset.getColumnAsArray(6)
			
			var oneFilter = new Array()
			//create array that has objects describing what finds must be done for filter
			for (var j = 0; j < columnName.length; j++) {
				var filterItem = new Object()
				filterItem.theTableReln = tableReln[j]
				filterItem.theColumnName = columnName[j]
				filterItem.theOperator = operator[j]
				filterItem.theColumnValue = columnValue[j]
				filterItem.theFilterType = filterType[j]
				filterItem.theFilterMethod = methodName[j]
				
				oneFilter[oneFilter.length] = filterItem
			}
		}
		//build derived filters on the fly
		else if (menu.menuType[k] == 2) {
			//set flag that a normal filter with sub-nodes
			menu.menuType[k] = 1
			
			//no filtering happens on this item, set blank
			var oneFilter = new Array()
			
			query =	'SELECT column_relation, column_name, column_operator, valuelist, valuelist_type FROM mosaic_action_item_filter WHERE id_action_item = ?'
			args = [menu.menuID[k]]
			dataset = databaseManager.getDataSetByQuery(serverName,query,args,1)
			
			var tableReln = dataset.getValue(1,1)
			var columnName = dataset.getValue(1,2)
			var operator = dataset.getValue(1,3)
			var vlName = dataset.getValue(1,4)
			var vlType = dataset.getValue(1,5)
			
			var vlItems = application.getValueListItems(vlName)
			
			//there are values for this sub menu
			if (vlItems && vlItems.getMaxRowIndex()) {
				//display/real values
				var displayValues = vlItems.getColumnAsArray(1)
				var realValues = vlItems.getColumnAsArray(2)
				
				//create arrays to pump in
				var uuid = []
				var itemName = []
				var sortType = []
				var limit = []
				var method = []
				var filterSpec = []
				for (var j = 0; j < displayValues.length && j < 100; j++) {
					uuid.push(application.getNewUUID())
					itemName.push(displayValues[j])
					sortType.push(menu.filterSort[k])
					limit.push(menu.filterLimit[k])
					method.push(menu.filterMethod[k])
					//MEMO: we are attaching an array with one object in it here
					filterSpec.push([{
								theTableReln : tableReln,
								theColumnName : columnName,
								theOperator : operator,
								theColumnValue : (vlType == 'Display') ? displayValues[j] : ((vlType == 'Stored') ? realValues[j] : null),
								theFilterType : 'Value',
								theFilterMethod : null
							}])
				}
				
				//create nodes in menu object for all values (up to 100) in selected valuelist
				allMenus[prefix + menu.menuID[k]] = {
					menuID : uuid,
					menuItem : itemName,
					menuType : new Array((displayValues.length > 100) ? 100 : displayValues.length),
					filterSort : sortType,
					filterLimit : limit,
					filterMethod : method,
					menuFilters : filterSpec
				}
			}
			
		}
		//no filtering, set blank
		else {
			var oneFilter = new Array()
		}
		
		//punch in array that has formula for filter recipe
		filterItems[k] = oneFilter
	}
	
	allMenus[prefix + allSubMenuID[i]] = menu
}

//build menuMain (pass in parent level object)
var menuMain = FX_multitier_menu(allMenus,0)

*/

var menuMain = FX_multitier_menu(navigationPrefs.byNavItemID[navigationID].universalList.buttons.filters)

//only show pop-up if there are enabled values
if (menuMain.length) {
	//hack not required
	if (utils.stringToNumber(application.getVersion()) >= 5) {
		//pop up the popup menu
		var elem = elements[application.getMethodTriggerElementName()]
		if (elem != null) {
		    plugins.popupmenu.showPopupMenu(elem, menuMain);
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
		elements[btnInvisible].setLocation(currentLocationX, currentLocationY - (topShift + (menuMain.length * lineHeight)))
		
		//pop up the popup menu
		var elem = elements[btnInvisible]
		if (elem != null) {
		    plugins.popupmenu.showPopupMenu(elem, menuMain);
		}
		
		//set invisible btn back to original location
		elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"E87B2803-802A-49FE-9484-53FD0BF89D81"}
 */
function FILTERS_list_control()
{

/*
 *	TITLE    :	FILTERS_list_control
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	run filter recipe, update fast find area
 *			  	
 *	INPUT    :		1) name of the filter
 *			  		2) array with recipe of find requests
 *			  		3) toolTip of filter hierarchy
 *			  		4) sort string to perform on returned records
 *			  		5) maximum number of records to load
 *			  		6) method to run at the very end
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs, globals.NAV_navigation_item_selected containING pk of currently selected workflow area's navigation item
 *			  	
 *	MODIFIED :	Mar 14, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var currentNavItem = solutionPrefs.config.currentFormID
var filterTitle = arguments[0]
var filters = plugins.serialize.fromJSON(arguments[1])
var toolTipItems = arguments[2].split(',')
var toolTip = '<html><head></head><body><strong>Filter stack:</strong><br>'
for (var i = 0 ; i < toolTipItems.length; i++) {
	toolTip += '&#160;'
	for (var j = 0 ; j < i * 2; j++) {
		toolTip += '&#160;'
	}
	toolTip += '- ' + toolTipItems[i] + '&#160;&#160;<br>'
}
toolTip += '</body></html>'
var postSort = arguments[3]
var postLimit = arguments[4]
var postMethod = arguments[5]


//if there are filters, run
if (filters.length) {
	var formName = navigationPrefs.byNavItemID[currentNavItem].navigationItem.formToLoad
	var tblName = navigationPrefs.byNavItemID[currentNavItem].navigationItem.formToLoadTable
	var origFoundset = forms[formName].foundset.duplicateFoundSet()
	
	//logging
	var serverName = forms[formName].controller.getServerName()
	var tableName = forms[formName].controller.getTableName()
	//only run when using query based way to hit repository
	if (solutionPrefs.repository && solutionPrefs.repository.allFormsByTable && solutionPrefs.repository.allFormsByTable[serverName] && solutionPrefs.repository.allFormsByTable[serverName][tableName] && solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey) {
		var pkName = solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey
		var pkActedOn = forms[formName][pkName]
	}
	else {
		var pkName = 'repositoryAPINotImplemented'
		var pkActedOn = 0
	}
	
	//for all filter line items that call a Fxion, eval it to get the return value
	for (var i = 0; i < filters.length; i++) {
		
		//a Fxion and a method specified
		if (filters[i].filterType == 'Function' && filters[i].filterMethod) {
			//if global, strip out global text
			if (filters[i].filterMethod.indexOf('globals.',0) >= 0) {
				var method = globals[filters[i].filterMethod.substr(8)]
			}
			else {
				var method = forms[solutionPrefs.config.currentFormName][filters[i].filterMethod]
			}
			
			//set argument if exist, otherwise null
			var args = (filters[i].columnValue) ? filters[i].columnValue : null
			
			//update value
			filters[i].columnValue = method(args)
		}
	}
	
	//there filters to apply
	if (filters.length) {
		//load all records so we can search on them
		forms[formName].controller.loadAllRecords()
		if (navigationPrefs.byNavItemID[currentNavItem].navigationItem.useFwList) { forms[navigationPrefs.byNavItemID[currentNavItem].listData.tabFormInstance].controller.loadAllRecords() }
		
		//start find
		forms[formName].controller.find()
		
		for (var i = 0; i < filters.length; i++) {
			var step = filters[i]
			
			var prefix = ''
			var suffix = ''
			
			switch (step.columnOperator) {
				case '>':
					prefix = '>'
					break
				case '<':
					prefix = '<'
					break
				case '>=':
					prefix = '>='
					break
				case '<=':
					prefix = '<='
					break
				case '!=':
					prefix = '!'
					break
				case 'like':
					prefix = suffix = '%'
					break
			}
			
			//if on current table, find there
			if (step.columnRelation == tblName) {
				forms[formName][step.columnName] = prefix + step.columnValue + suffix
			}
			//find through relation
			else {
				forms[formName][step.columnRelation][step.columnName] = prefix + step.columnValue + suffix
			}
		}
		//execute find
		var results = forms[formName].controller.search()
	}
	
	//post-processing and set find/filter text if results
	if (results) {
		//post sort specified
		if (postSort) {
			forms[formName].controller.sort(postSort)
			
			//clear current field sorted by and direction on workflow form
			navigationPrefs.byNavItemID[currentNavItem].listData.sortField = null
			navigationPrefs.byNavItemID[currentNavItem].listData.sortDirection = null
		}
		//existing sort on that foundset
		else if (navigationPrefs.byNavItemID[currentNavItem].listData.sortField && navigationPrefs.byNavItemID[currentNavItem].listData.sortDirection) {
			forms[formName].controller.sort(navigationPrefs.byNavItemID[currentNavItem].listData.sortField + ' ' + navigationPrefs.byNavItemID[currentNavItem].listData.sortDirection)
		}
		if (postLimit) {
			var jsTable = databaseManager.getTable(forms[formName].foundset)
			var pkCols = jsTable.getRowIdentifierColumnNames()
			
			//MEMO: does not account for multiple primary keys on a table
			var primaryKey = pkCols[0]
			if (primaryKey) {
				var originalIDs = databaseManager.getFoundSetDataProviderAsArray(forms[formName].foundset,primaryKey)
				originalIDs = originalIDs.slice(0,postLimit)
				var loadSet = databaseManager.convertToDataSet(originalIDs)
				forms[formName].controller.loadRecords(loadSet)
			}
		}
		if (postMethod) {
			//if global, strip out global text
			if (postMethod.indexOf('globals.',0) >= 0) {
				globals[postMethod.substr(8)]()
			}
			else {
				forms[solutionPrefs.config.currentFormName][postMethod]()
			}
		}
		
		globals.TRIGGER_fastfind_display_set('Filter: ' + filterTitle,toolTip,filterTitle)
		globals.TRIGGER_ul_refresh_all()
	}
	//return original foundset
	else {
		forms[formName].controller.loadRecords(origFoundset)
		forms[navigationPrefs.byNavItemID[currentNavItem].listData.tabFormInstance].controller.loadRecords(origFoundset)
//		UL_fill_data()
		plugins.dialogs.showInfoDialog('No records found','No records found while filtering ' + filterTitle + '.')
	}
	
	//LOG ul filter
	globals.TRIGGER_log_create('UL Filters',
						filterTitle,
						serverName,
						tableName,
						pkName,
						pkActedOn,
						results
						)
}


}

/**
 *
 * @properties={typeid:24,uuid:"234469C3-E319-4832-A92E-01EF0E3B9977"}
 */
function FORM_on_hide()
{

/*
 *	TITLE    :	FORM_on_hide
 *			  	
 *	MODULE   :	wf_NAV_engine
 *			  	
 *	ABOUT    :	save header html
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

/*
if (this.navItemID && navigationPrefs.byNavItemID[this.navItemID] && navigationPrefs.byNavItemID[this.navItemID].listData) {
	navigationPrefs.byNavItemID[this.navItemID].listData.headerHTML = globals.NAV_list_header
}
*/
}

/**
 * @properties={typeid:24,uuid:"0CF28B8B-58A2-464D-BFD5-FD2847046B63"}
 */
function FORM_on_load()
{
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"C99E5060-30AA-4445-A665-2381D8BCCD75"}
 */
function FORM_on_show(firstShow, event)
{
	
/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	wf_NAV_engine
 *			  	
 *	ABOUT    :	set up universal list the first time it is visited
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	var currentNavItem = solutionPrefs.config.currentFormID
	var formName = navigationPrefs.byNavItemID[currentNavItem].navigationItem.formToLoad
	//solutionPrefs.config.currentFormName
	
	var tabName = elements.tab_ul.getTabFormNameAt(1)
	
	//timer for debugging purposes
	globals.TRIGGER_timer('start')
	
	//things to do on the initial show only
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
	if (arguments[0]) {
		var rawDisplayPosn = navigationPrefs.byNavItemID[currentNavItem].universalList.displays.displayPosn
		
		//if list_title overridden in display preferences, use it; otherwise, set record header to fw_list_title for that navigation item
		if (navigationPrefs.byNavItemID[currentNavItem].universalList.displays[rawDisplayPosn].listTitle) {
			var listTitle = navigationPrefs.byNavItemID[currentNavItem].universalList.displays[rawDisplayPosn].listTitle
		}
		else {
			var listTitle = navigationPrefs.byNavItemID[currentNavItem].navigationItem.fwListTitle
		}
		
		//set label on record list
		if (listTitle) {
			elements.record_heading.text = listTitle.toUpperCase()
		}
		else {
			elements.record_heading.text = 'RECORDS'
		}
		
		//save down navigationItemID to form
		//this.navItemID = currentNavItem
		
		//set hide/show on all buttons
		BUTTONS_toggle(currentNavItem)
	}
	//frameworks engine data has changed since form first displayed
	else if (solutionPrefs.config.prefs.navEngineTouch && solutionPrefs.config.prefs.navEngineTouch > navigationPrefs.byNavItemID[currentNavItem].listData.dateAdded) {
		//set hide/show on all buttons
		BUTTONS_toggle(currentNavItem)
	}
	
//	//if records, get selected one
//	if (forms[tabName].foundset && forms[tabName].foundset.getSize()) {
//		var record = forms[tabName].foundset.getRecord(forms[tabName].foundset.getSelectedIndex())
//	}
//	
//	//if no data, fill it
//	if (!record || !record.display) {
//		UL_fill_data()
//	}
//	//set highlighted and refresh global header
//	else {
//		//TODO: remove this fill data; once garbage collection is more efficient, the commented out way is much prefered
//		UL_sync_records()
//		/*
//		forms[tabName].UL_set_selected()
//		globals.NAV_list_header = navigationPrefs.byNavItemID[currentNavItem].listData.headerHTML
//		*/
//	}
	
	//set record navigator to reflect current index and found set
	globals.TRIGGER_toolbar_record_navigator_set()
	
	//only run when using query based way to hit repository and form present
	if (forms[formName] && solutionPrefs.repository && solutionPrefs.repository.allFormsByTable && solutionPrefs.repository.allFormsByTable[serverName] && solutionPrefs.repository.allFormsByTable[serverName][tableName] && solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey) {			
		var serverName = forms[formName].controller.getServerName()
		var tableName = forms[formName].controller.getTableName()
		
		var pkName = solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey
		var pkActedOn = forms[formName][pkName]
		
		//save time when pk of this record first accessed
		if (!navigationPrefs.byNavItemID[currentNavItem].listData.visitedPKs[pkActedOn]) {
			navigationPrefs.byNavItemID[currentNavItem].listData.visitedPKs[pkActedOn] = application.getServerTimeStamp()
		}
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"B4F40B97-AF64-4A4F-8550-F79BC5B4E299"}
 */
function FX_multitier_menu()
{

/*
 *	TITLE    :	FX_multitier_menu
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	recursively build filter pop-up menu
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	July 16, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var allMenus = arguments[0]
//var prefix = 'actionItem_'
//var menuItem = prefix + arguments[1]
var breadCrumb = (arguments[1]) ? (arguments[1]+',') : ''
var menu = new Array()
var check = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].lastFindField

if (allMenus) {
	//all items for specified menu
	for ( var j = 0 ; j < allMenus.length ; j++ ) {
		//only work with menus with a name (unless deriving, and then proceed)
		if (allMenus[j].menuName || !(allMenus[j] instanceof Array)) {
			//if derived (position is not an array), build it
			if (!(allMenus[j] instanceof Array)) {
				var vlItems = application.getValueListItems(allMenus[j].valuelist)
				
				//there are values in this value list
				if (vlItems && vlItems.getMaxRowIndex()) {
					//display/real values
					var displayValues = vlItems.getColumnAsArray(1)
					var realValues = vlItems.getColumnAsArray(2)
			
					//create array for filter specs
					var dynamicFilters = new Array()
					
					//create up to the first 100 values of specified valuelist
					for (var k = 0; k < displayValues.length && k < 100; k++) {
						//new position
						dynamicFilters.push(new Array())
						var dynamicFilter = dynamicFilters[dynamicFilters.length - 1]
						
						//add menu name
						dynamicFilter.menuName = (displayValues[k]) ? displayValues[k] : null
						
						//add post processing information
						dynamicFilter.postSort = (allMenus[j].postSort) ? allMenus[j].postSort : null
						dynamicFilter.postMethod = (allMenus[j].postMethod) ? allMenus[j].postMethod : null
						dynamicFilter.postLimit = (allMenus[j].postLimit) ? allMenus[j].postLimit : null
						
						//go through filter spec items and plop down filter spec
						dynamicFilter.push({
									columnName	:	allMenus[j].columnName,
									columnOperator	: allMenus[j].operator,
									columnRelation	: allMenus[j].columnRelation,
									columnValue	:	(allMenus[j].valuelistType == 'Display') ? displayValues[k] : ((allMenus[j].valuelistType == 'Stored') ? realValues[k] : null),
									filterType	:	'Value',
									filterMethod	:	null
								})
					}
				}
				
				var subMenu = FX_multitier_menu(dynamicFilters,breadCrumb + allMenus[j].menuName)
				if (subMenu.length) {
					menu.push(plugins.popupmenu.createMenuItem(allMenus[j].menuName + "", subMenu))
				}
			}
			//if a filter node, attach submenu
			else if (allMenus[j].actionID) {
				var subMenu = FX_multitier_menu(allMenus[j],breadCrumb + allMenus[j].menuName)
				if (subMenu.length) {
					menu.push(plugins.popupmenu.createMenuItem(allMenus[j].menuName + "", subMenu))
				}
			}
			//if a filter item, attach item
			else {
				menu.push(plugins.popupmenu.createCheckboxMenuItem(allMenus[j].menuName + "", FILTERS_list_control))
				
				var theArray = (allMenus[j] instanceof Array) ? allMenus[j].slice(0) : new Array()
				
				menu[menu.length - 1].setMethodArguments(
									allMenus[j].menuName,
									plugins.serialize.toJSON(theArray),
									breadCrumb + allMenus[j].menuName,
									allMenus[j].postSort,
									allMenus[j].postLimit,
									allMenus[j].postMethod
									)
				
				//set check mark
				if (check == menu[menu.length - 1].text) {
					menu[menu.length - 1].setSelected(true)
				}
				else {
					menu[menu.length - 1].setSelected(false)
				}
				
				//disable dividers
				if (menu[menu.length - 1].text == '-') {
					menu[menu.length - 1].setEnabled(false)
				}
			}
		}
	}
}

return menu
}

/**
 *
 * @properties={typeid:24,uuid:"45AF6843-E5B1-4BE8-BB40-DB1DF8167476"}
 */
function FX_sort()
{

/*
 *	TITLE:		FX_sort
 *
 *	MODULE:		_FRAMEWORKS_navigation
 *
 *	ABOUT:		this Function sorts list views and displays the correct sort directional graphic
 *
 *	MODIFIED:	Sept 4, 2007 - Troy Elliott, Data Mosaic
 *
 */

if (application.__parent__.solutionPrefs) {
	
	var formName = solutionPrefs.config.currentFormName
	var currentNavItem = solutionPrefs.config.currentFormID
	var listName = application.getMethodTriggerFormName()
	var colName = arguments[0]
	
	//logging
	var serverName = forms[formName].controller.getServerName()
	var tableName = forms[formName].controller.getTableName()
	//only run when using query based way to hit repository
	if (solutionPrefs.repository && solutionPrefs.repository.allFormsByTable && solutionPrefs.repository.allFormsByTable[serverName] && solutionPrefs.repository.allFormsByTable[serverName][tableName] && solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey) {
		var pkName = solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey
		var pkActedOn = forms[formName][pkName]
	}
	else {
		var pkName = 'repositoryAPINotImplemented'
		var pkActedOn = 0
	}
	
	//flip sort direction if same field was sorted on already, otherwise, sort asc
	if (navigationPrefs.byNavItemID[currentNavItem].listData.sortField == colName) {
		switch (navigationPrefs.byNavItemID[currentNavItem].listData.sortDirection) {
				case 'asc':
					var sortDirection = 'desc'
					break
				case 'desc':
					var sortDirection = 'asc'
					break
				default:
					var sortDirection = 'asc'
					break
		}
	}
	else {
		var sortDirection = 'asc'
	}
	
	//sort list
	forms[formName].controller.sort(colName + ' ' + sortDirection)
	
	//store current field sorted by and direction on main tab form
	navigationPrefs.byNavItemID[currentNavItem].listData.sortField = colName
	navigationPrefs.byNavItemID[currentNavItem].listData.sortDirection = sortDirection
	
	var serverName = forms[formName].controller.getServerName()
	var tableName = forms[formName].controller.getTableName()
	//add server name if not already
	if (!solutionPrefs.fastFind.currentSearch[serverName]) {
		solutionPrefs.fastFind.currentSearch[serverName] = new Object()
	}
	//add table name if not already
	if (!solutionPrefs.fastFind.currentSearch[serverName][tableName]) {
		solutionPrefs.fastFind.currentSearch[serverName][tableName] = new Object()
	}
	//only run when using query based way to hit repository
	if (solutionPrefs.repository && solutionPrefs.repository.allFormsByTable && solutionPrefs.repository.allFormsByTable[serverName] && solutionPrefs.repository.allFormsByTable[serverName][tableName] && solutionPrefs.repository.allFormsByTable[serverName][tableName][formName]) {
		//check if not using separateFoundset
		if (!solutionPrefs.repository.allFormsByTable[serverName][tableName][formName].useSeparateFoundset) {
			solutionPrefs.fastFind.currentSearch[serverName][tableName].sortField = colName
			solutionPrefs.fastFind.currentSearch[serverName][tableName].sortDirection = sortDirection
		}
	}
//	
//	//redraw html records
//	UL_sync_records()
	
	//update record navigator
	globals.TRIGGER_toolbar_record_navigator_set()
	
	//LOG ul sort
	globals.TRIGGER_log_create('UL Sorts',
						colName,
						sortDirection,
						serverName,
						tableName,
						pkName,
						pkActedOn
						)
}
}

/**
 *
 * @properties={typeid:24,uuid:"456C9EA5-9A98-416A-946A-F67F91665287"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	creates new record using method selected or controller.newRecord(false)
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Oct 11, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	
	var formName = solutionPrefs.config.currentFormName
	
	//grab the actions to this
	if (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].universalList.buttons.add) {
		var actionItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].universalList.buttons.add
		methodTypes = actionItem.methodType
		methods = actionItem.method
	}
	
	//if default add method overridden
	if (methods) {
//		//if custom code, scope all form-specific attributes to that form
//		if (methodTypes == 'Custom code') {
//			//controller
//			methods = utils.stringReplace(methods, 'controller', 'forms.' + formName + '.controller')
//			//elements
//			methods = utils.stringReplace(methods, 'elements', 'forms.' + formName + '.elements')
//			//foundset
//			methods = utils.stringReplace(methods, 'foundset', 'forms.' + formName + '.foundset')
//			//currentcontroller
//			methods = utils.stringReplace(methods, 'currentcontroller', 'forms.' + formName + '.controller')
//			
//			//field (our own addition)
//			methods = utils.stringReplace(methods, 'field', 'forms.' + formName)
//		}
//		//if method, scope it
//		else if (methodTypes == 'Method') {
//			methods = 'forms.' + formName + '.' + methods
//		}
		
		//only eval method if method type set properly
		if (methodTypes != null || methodTypes != '' && methods) {
			with (forms[formName]) {
				eval(methods)
			}
		}
		else {
			plugins.dialogs.showInfoDialog('Config incomplete', 'Return to navigation setup to complete this action', 'OK')
		}
	}
	//execute default record add
	else {
		//turn off UL_refresh_selected (if attached to onRecEditStop, will fire when new Record created)
		skipULRefreshOne = true
		
		forms[formName].foundset.newRecord(true,true)
		
		var rowSelected = forms[formName].foundset.getSelectedIndex()
		
		//turn on UL_refresh_selected
		skipULRefreshOne = null
		
		//update UL
	//	forms[controller.getName() + '_1L'].REC_new(true)
	}

	//LOG ul add
	var serverName = forms[formName].controller.getServerName()
	var tableName = forms[formName].controller.getTableName()
	//only run when using query based way to hit repository
	if (solutionPrefs.repository && solutionPrefs.repository.allFormsByTable && solutionPrefs.repository.allFormsByTable[serverName] && solutionPrefs.repository.allFormsByTable[serverName][tableName] && solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey) {
		var pkName = solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey
		var pkActedOn = forms[formName][pkName]
	}
	else {
		var pkName = 'repositoryAPINotImplemented'
		var pkActedOn = 0
	}
	globals.TRIGGER_log_create('UL Add',
						((methods) ? methods : 'Default add'),
						serverName,
						tableName,
						pkName,
						pkActedOn
						)
	
}
}

/**
 *
 * @properties={typeid:24,uuid:"C5E9A8BF-661D-415E-AAE2-3B79A8D2AAC6"}
 */
function REPORTS_list()
{

/*
 *	TITLE    :	REPORTS_list
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	pop the menu up instead of the default down
 *			  	uses a secondary invisible object on the layout which is behind the clicked button
 *			  	move secondary object up far enough to drop down a popup that hits the top edge
 *			  		of clicked btn
 *			  	when menu item is selected, return secondary object to original location
 *			  	
 *			  	forms to load from action_item table
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs, globals.NAV_navigation_item_selected containing pk of currently selected workflow area's navigation item
 *			  	
 *	MODIFIED :	Nov 20, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//grab the id_report for all reports
var valueList = new Array()
var reportIDs = new Array()
var reportForms = new Array()
var reportMethods = new Array()
var reportWrappers = new Array()
var allReports = databaseManager.getFoundSet('sutra','sutra_report')

for (var i = 0; i < navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].universalList.buttons.reports.length ; i++) {
	var reportItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].universalList.buttons.reports[i]
	valueList.push(reportItem.menuName)
	reportIDs.push(reportItem.idReport)
	
	if (reportItem.idReport) {
		allReports.find()
		allReports.id_report = reportItem.idReport
		var results = allReports.search()
		
		if (results) {
			var reportForm = allReports.report_form
			var reportMethod = allReports.report_method
			var reportWrapper = allReports.flag_wrapper
		}
		else {
			var reportForm = null
			var reportMethod = null
			var reportWrapper = null
		}
	}
	else {
		var reportForm = null
		var reportMethod = null
		var reportWrapper = null
	}
	
	reportForms.push(reportForm)
	reportMethods.push(reportMethod)
	reportWrappers.push(reportWrapper)
}

//only show pop-up if there are enabled values
if (valueList.length) {
	//build menu, set menu method arguments
	var menu = new Array()
	for ( var i = 0 ; i < valueList.length ; i++ ) {
	    menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", REPORTS_list_control)
		menu[i].setMethodArguments(reportForms[i],reportMethods[i],reportWrappers[i],valueList[i],reportIDs[i])
		
		//disable dividers
		if (valueList[i] == '-') {
			menu[i].setEnabled(false)
		}
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
}

/**
 *
 * @properties={typeid:24,uuid:"348B1945-7524-40E4-9B1A-E1C2BFCC6981"}
 */
function REPORTS_list_control()
{

/*
 *	TITLE    :	TABS_list_control
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	switch out lower left tab (usually used for tabs)
 *			  	
 *	INPUT    :	formName, methodName
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 10, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = arguments[0]
var methodName = arguments[1]
var wrapper = arguments[2]
var itemName = arguments[3]
var reportID = arguments[4]
var navItemForm = solutionPrefs.config.currentFormName

//prompt for how many records to print
if (wrapper) {
	if (navItemForm && forms[navItemForm] && utils.hasRecords(forms[navItemForm].foundset)) {
		var whatPrint = plugins.dialogs.showQuestionDialog(
						'Print report',
						'How many records do you want to print?',
						'Selected record',
						'Found records'/*,
						'Subset of records'*/
					)
		
		if (whatPrint) {
			var serverName = forms[navItemForm].foundset.getServerName()
			var tableName = forms[navItemForm].foundset.getTableName()
			
			var fsToPrint = databaseManager.getFoundSet(serverName, tableName)
			fsToPrint.clear()
			
			switch (whatPrint) {
				case 'Selected record':
					//get the pk of the selected record and load into foundset
					var record = forms[navItemForm][solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey]
					fsToPrint.loadRecords(databaseManager.convertToDataSet([record]))
					break
					
				case 'Found records':
					//get the recipe of found records and load into foundset
					var sql = databaseManager.getSQL(forms[navItemForm].foundset)
					var params = databaseManager.getSQLParameters(forms[navItemForm].foundset)
					fsToPrint.loadRecords(sql, params)
					break
					
				case 'Subset of records':
					//show FiD to specify first/last/start from current and how many
					break
			}
		}
	}
	else {
		plugins.dialogs.showErrorDialog(
				'Print error',
				'There are no records to print'
			)
		return
	}
}

//a form to print, a method to run, and they both exist
if (formName && methodName && forms[formName] && forms[formName][methodName]) {
	//pass foundset from wrapper method (if any), formname
	if (fsToPrint) {
		forms[formName][methodName](fsToPrint,navItemForm)
	}
	//no foundset from wrapper, pass only formname
	else {
		forms[formName][methodName](navItemForm)
	}
}
//no method, show print preview
else if (formName && forms[formName]) {
	//something to print from wrapper method, load it
	if (utils.hasRecords(fsToPrint)) {
		forms[formName].controller.loadRecords(fsToPrint)
	}
	
	forms[formName].controller.showPrintPreview()
	
	var onlyPreview = true
}

//LOG ul reporting
globals.TRIGGER_log_create('UL Reports',
					reportID,
					itemName,
					formName,
					((onlyPreview) ? 'Default print preview' : formName + '.' + methodName)
					)
}

/**
 *
 * @properties={typeid:24,uuid:"B5878712-AAE0-4E32-93C0-D62AA6F1DE87"}
 */
function TABS_list()
{

/*
 *	TITLE    :	TABS_list
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	forms to load from action_item table
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs, globals.NAV_navigation_item_selected containing pk of currently selected workflow area's navigation item
 *			  	
 *	MODIFIED :	Mar 11, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//grab the actions to this
var valueList = new Array()
var formNames = new Array()
for (var i = 0; i < navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].universalList.buttons.tabs.length ; i++) {
	var actionItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].universalList.buttons.tabs[i]
	valueList.push(actionItem.menuName)
	formNames.push(actionItem.formToLoad)
}

//only show pop-up if there are enabled values
if (valueList.length) {
	//tack on universal list to the top of the array
	valueList.unshift(globals.CODE_text_initial_caps(elements.record_heading.text))
	formNames.unshift(null)
	
	//build menu, load tabs, and set menu method arguments
	var menu = new Array()
	for ( var i = 0 ; i < valueList.length ; i++ ) {
	    //set check on universal list
		if (i == 0) {
			menu[i] = plugins.popupmenu.createCheckboxMenuItem(valueList[i] + "", TABS_list_control)
			menu[i].setSelected(true)
		}
		else {
			menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", TABS_list_control)
		}
		
		//pass method name as parameter if that form is currently included
		if (forms[formNames[i]]) {
			menu[i].setMethodArguments(formNames[i],valueList[i])
		}
		else {
			menu[i].setEnabled(false)
		}
		
		//disable dividers
		if (valueList[i] == '-') {
			menu[i].setEnabled(false)
		}
	}
	
	//push menu down to the header line
	var btnInvisible = application.getMethodTriggerElementName() + "_down"
	var currentLocationX = elements[btnInvisible].getLocationX()
	var currentLocationY = elements[btnInvisible].getLocationY()
	
	elements[btnInvisible].setLocation(currentLocationX, currentLocationY + 3)
	
	//popup menu
	var elem = elements[btnInvisible]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menu)
	}
	
	//set invisible btn back to original location
	elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
}
}

/**
 *
 * @properties={typeid:24,uuid:"73A07072-55E3-4AE9-96D8-E3F215E66D03"}
 */
function TABS_list_control()
{

/*
 *	TITLE    :	TABS_list_control
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	switch out lower left tab (usually used for tabs)
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Nov 20, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = arguments[0]
var itemName = arguments[1]
var formNameBase = solutionPrefs.config.formNameBase
var prefName = 'Custom tab ' + solutionPrefs.config.currentFormID + ': ' + formName

if (forms[formName]) {
	//set global that end users use in their code
	globals.NAV_universal_selected_tab = formName
	
	//if not loaded, add tab
	if (formName != 'FRAMEWORKS_blank_1_list' && !navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		
		//assign to list tab panel
		forms[formNameBase].elements.tab_content_B.addTab(forms[formName],'',null,null,null,null)
		forms[formNameBase].elements.tab_content_B.tabIndex = forms[formNameBase].elements.tab_content_B.getMaxTabIndex()
		
		//save status info
		navigationPrefs.byNavSetName.configPanes.itemsByName[prefName] = new Object()
		navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData = {
									tabNumber : forms[formNameBase].elements.tab_content_B.tabIndex,
									dateAdded : application.getServerTimeStamp()
							}
		
	}
	//blank form, set to blank tab
	else if (listTab == 'FRAMEWORKS_blank_1_list') {
		forms[formNameBase].elements.tab_content_B.tabIndex = 1
	}
	//set tab to this preference
	else {
		forms[formNameBase].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData.tabNumber
	}
	
	//LOG ul tab change
	globals.TRIGGER_log_create('UL Tabs',
						itemName,
						formName
						)
}
}
