/**
 *
 * @properties={typeid:24,uuid:"88b5d307-12cb-4a81-8ffb-060568fb6d9b"}
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
for (var i = 0; i < navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.actions.length ; i++) {
	var actionItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.actions[i]
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
 * @properties={typeid:24,uuid:"985af376-9b15-406b-ac52-5dd457665148"}
 */
function ACTIONS_list_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	ds_NAV_engine
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
	if (!solutionPrefs.repository.api && solutionPrefs.repository.allForms) {
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
		//controller
		method = utils.stringReplace(method, 'controller', 'forms.' + formName + '.controller')
		//elements
		method = utils.stringReplace(method, 'elements', 'forms.' + formName + '.elements')
		//foundset
		method = utils.stringReplace(method, 'foundset', 'forms.' + formName + '.foundset')
		//currentcontroller
		method = utils.stringReplace(method, 'currentcontroller', 'forms.' + formName + '.controller')
		
		//field (our own addition)
		method = utils.stringReplace(method, 'field', 'forms.' + formName)
		
		//return; set to be a random variable, and set this value
		//MEMO: do not preface zeroblahblah with var - we need it to survive the mangling
		var returnUUID = 'zero1123581321',
			zero1123581321
		
		//TODO: must trap for when return just used to break out of situation
		method = utils.stringReplace(method, 'return', returnUUID + ' =')
		method = 'var zero1123581321\n'+method
	
	}
	else if (methodType == 'Method') {
		//if method does not exist on the form, do not run
		if (forms[formName] && forms[formName][method.slice(0,method.length-2)]) {
			method = 'forms.' + formName + '.' + method
		}
		else {
			method = null
		}
	}
	//*/
	
	if (methodType != null || methodType != '' && method) {
		//with (forms[formName]) {
			eval(method)
		//}
	}
	else {
		globals.DIALOGS.showInfoDialog('Config incomplete', 'Return to navigation setup to complete this action', 'OK')
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
 * @properties={typeid:24,uuid:"b342caa1-9520-43e4-88e7-61db01ec8e9c"}
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
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].buttons.add) {
	elements.btn_add.visible = true
}
else {
	elements.btn_add.visible = false
}

//toggle actions button
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].buttons.actions) {
	elements.btn_actions.visible = true
}
else {
	elements.btn_actions.visible = false
}

//toggle filters button
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].buttons.filters) {
	elements.btn_filters.visible = true
}
else {
	elements.btn_filters.visible = false
}

//toggle reports button
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].buttons.reports) {
	elements.btn_reports.visible = true
}
else {
	elements.btn_reports.visible = false
}

//toggle tabs button
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].buttons.tabs) {
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
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].buttons.add && navigationPrefs.byNavItemID[currentNavItem].buttons.actions) {
	elements.divider_add_action.visible = true
}
else {
	elements.divider_add_action.visible = false
}

//toggle line between actions and filters
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].buttons.actions && navigationPrefs.byNavItemID[currentNavItem].buttons.filters) {
	elements.divider_action_filter.visible = true
}
else {
	elements.divider_action_filter.visible = false
}


}

/**
 *
 * @properties={typeid:24,uuid:"240980de-efee-4f7d-a397-f70c6c16e029"}
 */
function DISPLAY_cycle()
{

/*
 *	TITLE    :	DISPLAY_cycle
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	this Function cycles through display options; shift refreshes current display
 *			  	
 *	INPUT    :	
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

if (application.__parent__.solutionPrefs) {
	var formName = solutionPrefs.config.currentFormName
	var currentNavItem = solutionPrefs.config.currentFormID
	var recSelected = forms[formName].controller.getSelectedIndex()
	
	//get menu list from active sort items
	var displayItems = navigationPrefs.byNavItemID[currentNavItem].universalList.displays
	
	//new display specified and there is a display there
	if (typeof refreshPosn == 'number' && displayItems.length >= refreshPosn) {
		globals.DATASUTRA_display = displayItems[refreshPosn - 1].displayID
	}
	
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
		if (!globals.CODE_key_pressed('shift')) {
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
 * @properties={typeid:24,uuid:"acb65605-7de7-4302-8945-2fafbb867f38"}
 */
function DISPLAY_list(event)
{
	
/*
 *	TITLE    :	DISPLAY_list
 *			  	
 *	MODULE   :	ds_NAV_engine
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

if (application.__parent__.solutionPrefs) {

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
 * @properties={typeid:24,uuid:"5e2397e6-5174-455c-ba11-09af84e651c3"}
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
		var theListTitle = navigationPrefs.byNavItemID[currentNavItem].universalList.displays[theDisplayPosn].listTitle
	}
	else {
		var theListTitle = navigationPrefs.byNavItemID[currentNavItem].navigationItem.fwListTitle
	}
	
	if (theListTitle) {
		elements.record_heading.text = theListTitle.toUpperCase()
	}
	else {
		elements.record_heading.text = (navigationPrefs.byNavItemID[currentNavItem].navigationItem.itemName) ? navigationPrefs.byNavItemID[currentNavItem].navigationItem.itemName.toUpperCase() : 'RECORDS'
	}
	
	//pump new data in
	if (syncRecords) {
		UL_sync_records()
	}
	else {
		UL_fill_data()
	}
	
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
 * @properties={typeid:24,uuid:"f0b07e8d-af91-4e8c-bb19-493da98e8ebb"}
 */
function FILTERS_list()
{

/*
 *	TITLE    :	FILTERS_list
 *			  	
 *	MODULE   :	ds_NAV_engine
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
query = 	'SELECT id_action_item, id_action_item_parent, filter_type from sutra_action_item ' +
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
	query =	'SELECT id_action_item, menu_name, filter_type, filter_sort, filter_limit, filter_method FROM sutra_action_item ' +
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
			query =	'SELECT column_relation, column_name, column_operator, column_value, filter_type, method_name FROM sutra_action_item_filter WHERE id_action_item = ?'
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
			
			query =	'SELECT column_relation, column_name, column_operator, valuelist, valuelist_type FROM sutra_action_item_filter WHERE id_action_item = ?'
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

var menuMain = FX_multitier_menu(navigationPrefs.byNavItemID[navigationID].buttons.filters)

//only show pop-up if there are enabled values
if (menuMain.length) {
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
	
	//pop up the popup menuMain
	var elem = elements[btnInvisible]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menuMain);
	}
	
	//set invisible btn back to original location
	elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
}
}

/**
 *
 * @properties={typeid:24,uuid:"d4d7a728-5bb1-41fc-90ac-ccf0f16da36e"}
 * @AllowToRunInFind
 */
function FILTERS_list_control()
{

/*
 *	TITLE    :	FILTERS_list_control
 *			  	
 *	MODULE   :	ds_NAV_engine
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
 *	MODIFIED :	April 6, 2009 -- Troy Elliott, Data Mosaic
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
	if (!solutionPrefs.repository.api && solutionPrefs.repository.allForms) {
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
		if (filters[i].filterType == 'Function' && filters[i].methodName) {
			//if global, strip out global text
			if (filters[i].methodName.indexOf('globals.',0) >= 0) {
				var method = globals[filters[i].methodName.substr(8)]
			}
			else {
				var method = forms[solutionPrefs.config.currentFormName][filters[i].methodName]
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
		
		//fire restriction enzyme
		var restrict = globals.NAV_foundset_restrict(true)
		
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
		//if restricted, restrict even further; otherwise do normal find
			//MEMO: technically, it doesn't matter...the records are all loaded at the beginning irregardless
		if (restrict) {
			var results = forms[formName].controller.search(false,true)
		}
		else {
			var results = forms[formName].controller.search()
		}
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
		UL_fill_data()
		globals.DIALOGS.showInfoDialog('No records found','No records found while filtering ' + filterTitle + '.')
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
 * @properties={typeid:24,uuid:"1e35385e-1d74-423f-87d7-9e4964759d72"}
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
 * @properties={typeid:24,uuid:"89fb41b3-f16f-4ac7-a581-f08730dd58dc"}
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
 * @properties={typeid:24,uuid:"6b6a3898-ded3-47fc-9533-3d5c4243f3b7"}
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

	var currentNavItem = (this.navItemID) ? this.navItemID : solutionPrefs.config.currentFormID
	var formName = navigationPrefs.byNavItemID[currentNavItem].navigationItem.formToLoad
	//solutionPrefs.config.currentFormName
	
	var tabName = elements.tab_ul.getTabFormNameAt(1)
	
	//timer for debugging purposes
	globals.TRIGGER_timer('start')
	
	//things to do on the initial show only
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
		this.navItemID = currentNavItem
		
		//set hide/show on all buttons
		BUTTONS_toggle(currentNavItem)
	}
	//frameworks engine data has changed since form first displayed
	else if (solutionPrefs.config.prefs.navEngineTouch && solutionPrefs.config.prefs.navEngineTouch > navigationPrefs.byNavItemID[currentNavItem].listData.dateAdded) {
		//set hide/show on all buttons
		BUTTONS_toggle(currentNavItem)
	}
	
	//if records, get selected one
	if (forms[tabName].foundset && forms[tabName].foundset.getSize()) {
		var record = forms[tabName].foundset.getRecord(forms[tabName].foundset.getSelectedIndex())
	}
	
	//if no data, fill it
	if (!record || !record.display) {
		UL_fill_data()
	}
	//set highlighted and refresh global header
	else {
		//TODO: remove this fill data; once garbage collection is more efficient, the commented out way is much prefered
		UL_sync_records()
		/*
		forms[tabName].UL_set_selected()
		globals.NAV_list_header = navigationPrefs.byNavItemID[currentNavItem].listData.headerHTML
		*/
	}
	
	//set record navigator to reflect current index and found set
	globals.TRIGGER_toolbar_record_navigator_set()
	
	//only run when using query based way to hit repository and form present
	if (!solutionPrefs.repository.api && solutionPrefs.repository.allForms && forms[formName]) {			
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
 * @properties={typeid:24,uuid:"2f09b1f7-fb14-4dd2-a3f7-1d6ea5c0dc22"}
 */
function FX_multitier_menu()
{

/*
 *	TITLE    :	FX_multitier_menu
 *			  	
 *	MODULE   :	ds_NAV_engine
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
				menu[menu.length - 1].setMethodArguments(
									allMenus[j].menuName,
									plugins.serialize.toJSON((allMenus[j] instanceof Array) ? allMenus[j].slice(0) : new Array()),
									breadCrumb+allMenus[j].menuName,
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
 * @properties={typeid:24,uuid:"1dc7ee86-5e86-4ca3-8520-943b4c8c8004"}
 */
function FX_sort()
{

/*
 *	TITLE:		FX_sort
 *
 *	MODULE:		ds_NAV_engine
 *
 *	ABOUT:		this Function sorts list views and displays the correct sort directional graphic
 *
 *	MODIFIED:	Sept 4, 2007 - Troy Elliott, Data Mosaic
 *
 */

if (application.__parent__.solutionPrefs) {

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
	
	var formName = solutionPrefs.config.currentFormName
	var currentNavItem = solutionPrefs.config.currentFormID
	var colName = arguments[0]
	
	//logging
	var serverName = forms[formName].controller.getServerName()
	var tableName = forms[formName].controller.getTableName()
	//only run when using query based way to hit repository
	if (!solutionPrefs.repository.api && solutionPrefs.repository.allForms) {
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
	if (!solutionPrefs.repository.api && solutionPrefs.repository.allForms) {
		//check if not using separateFoundset
		if (!solutionPrefs.repository.allFormsByTable[serverName][tableName][formName].useSeparateFoundset) {
			solutionPrefs.fastFind.currentSearch[serverName][tableName].sortField = colName
			solutionPrefs.fastFind.currentSearch[serverName][tableName].sortDirection = sortDirection
		}
	}
	
	//redraw html records
	UL_sync_records()
	
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
 * @properties={typeid:24,uuid:"df6df34f-806c-41c5-bea1-f04ebd065fc8"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_NAV_engine
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
	if (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.add) {
		var actionItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.add
		methodTypes = actionItem.methodType
		methods = actionItem.method
	}
	
	//replace foundset with functional equivalent, less relational boundaries
	//forms[formName].controller.loadRecords(forms[formName].foundset.unrelate())
	
	//if default add method overridden
	if (methods) {
		//if custom code, scope all form-specific attributes to that form
		if (methodTypes == 'Custom code') {
			//controller
			methods = utils.stringReplace(methods, 'controller', 'forms.' + formName + '.controller')
			//elements
			methods = utils.stringReplace(methods, 'elements', 'forms.' + formName + '.elements')
			//foundset
			methods = utils.stringReplace(methods, 'foundset', 'forms.' + formName + '.foundset')
			//currentcontroller
			methods = utils.stringReplace(methods, 'currentcontroller', 'forms.' + formName + '.controller')
			
			//field (our own addition)
			methods = utils.stringReplace(methods, 'field', 'forms.' + formName)
		}
		//if method, scope it
		else if (methodTypes == 'Method') {
			methods = 'forms.' + formName + '.' + methods
		}
		
		//only eval method if method type set properly
		if (methodTypes != null || methodTypes != '' && methods) {
			eval(methods)
		}
		else {
			globals.DIALOGS.showInfoDialog('Config incomplete', 'Return to navigation setup to complete this action', 'OK')
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
		forms[controller.getName() + '_1L'].REC_new(true)
	}

	//LOG ul add
	var serverName = forms[formName].controller.getServerName()
	var tableName = forms[formName].controller.getTableName()
	//only run when using query based way to hit repository
	if (!solutionPrefs.repository.api && solutionPrefs.repository.allForms) {
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
 * @properties={typeid:24,uuid:"b06dca24-2e45-4888-8e7b-444c71ffe6cc"}
 * @AllowToRunInFind
 */
function REPORTS_list()
{

/*
 *	TITLE    :	REPORTS_list
 *			  	
 *	MODULE   :	ds_NAV_engine
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
var allReports = databaseManager.getFoundSet(controller.getServerName(),'sutra_report')

for (var i = 0; i < navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.reports.length ; i++) {
	var reportItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.reports[i]
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
 * @properties={typeid:24,uuid:"be1eb556-ed13-4cea-88ac-2c72358fe281"}
 */
function REPORTS_list_control()
{

/*
 *	TITLE    :	TABS_list_control
 *			  	
 *	MODULE   :	ds_NAV_engine
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
		var whatPrint = globals.DIALOGS.showQuestionDialog(
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
		globals.DIALOGS.showErrorDialog(
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
		//TODO: check that based on same table!
		
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
 * @properties={typeid:24,uuid:"1f602694-59c6-4c97-8e2f-4f2f9d49871f"}
 */
function TABS_list()
{

/*
 *	TITLE    :	TABS_list
 *			  	
 *	MODULE   :	ds_NAV_engine
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
for (var i = 0; i < navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs.length ; i++) {
	var actionItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs[i]
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
			menu[i].setMethodArguments(formNames[i],valueList[i],i-1)
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
 * @properties={typeid:24,uuid:"e8f1c89f-fd36-47ca-8cca-fbf2fdb147f4"}
 */
function TABS_list_control()
{

/*
 *	TITLE    :	TABS_list_control
 *			  	
 *	MODULE   :	ds_NAV_engine
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
var tabSelected = arguments[2]
var formNameBase = solutionPrefs.config.formNameBase
var prefName = 'Custom tab ' + solutionPrefs.config.currentFormID + ': ' + formName

if (forms[formName]) {
	//set global that end users use in their code
	globals.NAV_universal_selected_tab = formName
	
	//if not loaded, add tab
	if (formName != 'DATASUTRA_0F_solution__blank_2' && !navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		
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
	else if (listTab == 'DATASUTRA_0F_solution__blank_2') {
		forms[formNameBase].elements.tab_content_B.tabIndex = 1
	}
	//set tab to this preference
	else {
		forms[formNameBase].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData.tabNumber
	}
	
	//using a custom tab, note which one it is
	if (tabSelected >= 0) {
		navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs.tabPosn = tabSelected
	}
	//using default list (UL or other)
	else if (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs) {
		delete navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs.tabPosn
	}
	
	//LOG ul tab change
	globals.TRIGGER_log_create('UL Tabs',
						itemName,
						formName
						)
}
}

/**
 *
 * @properties={typeid:24,uuid:"da374f33-7aaf-41f6-affb-62248ee9310d"}
 */
function UL_fill_data()
{

/*
 *	TITLE    :	UL_fill_data
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	refreshes the UL records with live data
 *			  	
 *	INPUT    :	1) selected record is not in last chunk to be drawn
 *			  	2) refresh one record only
 *			  	
 *			  	//old
 *			  	1) index of selected record
 *			  	2) name of workflow form
 *			  	3) array of objects
 *			  		align, fieldName, format, formatMask, header, 
 *			  		numChars, width, and rowDisplay are the properties
 *			  			rowDisplay is an array of objects
 *			  			isField and value are the properties
 *			  	4) first record in display window (optional)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	globals.NAV_universal_list_header_generate()
 *			  	
 *	USAGE    :	UL_fill_data([postRecSelectedHasData, refreshOneRec]) Punches data into dummy records
 *			  	
 *	MODIFIED :	June 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {

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

	//timings
	globals.TRIGGER_timer('start')
	
	var updateRecord = arguments[1]
	var baseForm = solutionPrefs.config.formNameBase
	
	var formUniListTab = elements.tab_ul.getTabFormNameAt(1)
	var formName = solutionPrefs.config.currentFormName
	var currentNavItem = solutionPrefs.config.currentFormID
	var rowSelected = forms[formName].foundset.getSelectedIndex()
	var rawDisplay = navigationPrefs.byNavItemID[currentNavItem].universalList.displays[navigationPrefs.byNavItemID[currentNavItem].universalList.displays.displayPosn].rawDisplay
	
	//rawDisplay null? (they don't have any list_display_items configured in setup
	if (!rawDisplay) {
		rawDisplay = new Array()
		rawDisplay.push({
				rowDisplay : [{
							isField : 0,
							value: 'Display unconfigured'
						}],
				width : 100,
				align : 'left',
				format : null,
				formatMask : null,
				header : 'N/A',
				fieldName : null
			})
	}
	
	//figure out which space we're in
	switch (solutionPrefs.config.activeSpace) {
		case 'standard':
		case 'standard flip':
			var widthUL = solutionPrefs.screenAttrib.spaces.list.currentHorizontal
			break
			
		case 'list':
		case 'list flip':
			var widthUL = solutionPrefs.screenAttrib.spaces.list.currentHorizontal
			break
			
		case 'vertical':
			var widthUL = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo
			break
			
		case 'vertical flip':
			var widthUL = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne
			break
			
		case 'centered':
			var widthUL = solutionPrefs.screenAttrib.spaces.centered.currentHorizontalTwo
			break
			
		case 'centered flip':
			var widthUL = solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne
			break
			
		case 'classic':
			var widthUL = forms[baseForm].elements.bean_main.getWidth() - solutionPrefs.screenAttrib.spaces.classic.currentHorizontal
			break
			
		case 'classic flip':
			var widthUL = solutionPrefs.screenAttrib.spaces.classic.currentHorizontal
			break
			
		case 'wide':
			var widthUL = forms[baseForm].elements.bean_main.getWidth() - solutionPrefs.screenAttrib.spaces.wide.currentVertical
			break
			
		case 'wide flip':
			var widthUL = solutionPrefs.screenAttrib.spaces.wide.currentVertical
			break
			
		case 'workflow':
			var widthUL = 0
			break
			
		case 'workflow flip':
			var widthUL = forms[baseForm].elements.bean_main.getWidth()
			break
		
		default:
			var widthUL = 250
	}
	
	//character setting based on platform
	var charMapping = 8
	
	//next multiple of 200 >= maxRecords
	var maxRec = solutionPrefs.listSetup.maxRecords
	//var halfMax = Math.floor(maxRec / 2) - 1
	var displayEndRec = arguments[0]

	//first/last record in list
	//choose position based on selected rec (if in first 'set', 1)
	var startRec = 1 //(Math.floor(rowSelected / maxRec)) ? Math.floor(rowSelected / maxRec) * maxRec : 1
	//convoluted way to make sure that display ends on an even hundred, if possible
		//ternary: when there is data in a chunk later than the selected record, get and display that data
	var endRec = ((displayEndRec) ? (Math.ceil(rowSelected / maxRec) + 1) : Math.ceil(rowSelected / maxRec)) * maxRec

	var foundsetCount = databaseManager.getFoundSetCount(forms[formName].foundset)
	//set start and end to be 0 if no records
	if (foundsetCount == 0) {
		startRec = 0
		endRec = 0
	}
	//endRec larger than total number of records, set smaller
	else if (endRec > foundsetCount) {
		endRec = foundsetCount
	}
	
	//don't mess with sizes if record refresh requested
	if (!updateRecord) {
		//make foundset as large as set
		var chunk = Math.ceil(forms[formName].foundset.getSize() / 200) * 200
		if (forms[formName].foundset.getSize() < endRec) {
			while (forms[formName].foundset.getSize() < endRec) {
				//go to break-point record (will bring in next 200)
				forms[formName].foundset.setSelectedIndex(chunk)
				chunk += 200
			}
			
			//return index to correct location
			forms[formName].foundset.setSelectedIndex(rowSelected)
		}

		//sync up records, but do NOT refire data fill
		UL_sync_records(true)
	}
	
	//save down current start/end position
	//MEMO: these values should ONLY be needed for the record navigtaor display...do NOT use elsewhere
	navigationPrefs.byNavItemID[currentNavItem].listData.index.start = startRec
	navigationPrefs.byNavItemID[currentNavItem].listData.index.end = endRec
	navigationPrefs.byNavItemID[currentNavItem].listData.index.selected = rowSelected
	
	//don't mess with endRec if record refresh requested
	if (!updateRecord) {
		//endRec equal to last loaded record (which is not the last possible record), set back one to keep from loading in next set
		if (endRec == forms[formName].foundset.getSize() && endRec != foundsetCount) {
			endRec --
			var moreRecs = true
		}
	}
	
	//character to use for repeated padding
	var whiteSpace = '&nbsp;'
	
	//first row
	var htmlHead = '<html><head>'
	
	//css
	htmlHead += '<style type="text/css" media="screen"><!--'
	htmlHead += 'table { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
	htmlHead += 'td { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding-top: 2px; padding-right: 3px; padding-bottom: 2px; padding-left: 3px; height: 20; line-height: 20; background-color: ' + solutionPrefs.listSetup.listBackground + '; }'
	htmlHead += 'th { font-weight: normal; text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding-top: 2px; padding-right: 3px; padding-bottom: 2px; padding-left: 3px; height: 20; line-height: 20; background-color: transparent; }' //hackjob extrodinaire: first/last rows (when more data) are th with transparency
	htmlHead += '.rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }'
	htmlHead += 'td.rowSelected a { color: white; text-decoration: none; font-weight: bold; }'
	htmlHead += 'a { color: black; text-decoration: none; }'
	htmlHead += '--></style></head>'
	
	//body
	htmlHead += '<body>'
	
	//table
	htmlHead += '<table>'
	
	//all other rows
	var html = '<html><head><body><table>'
	
	//if records for a universal list, build it; otherwise clear it, but still set the header
	if (endRec >= startRec && endRec && startRec) {
		
		//disable rec on select
		forms[formUniListTab].configured = false
				
		//BEGIN FOUNDSET PROCESSING
		
		//loop through range of records and build html list
			//MEMO: if updateRecord, then only run on it; else whole foundset
		for (var i = ((updateRecord) ? updateRecord : startRec); ((updateRecord) ? i <= updateRecord : i <= endRec); i++) {
			
			//PROCESS RECORD BEGIN
			
			var rowDisplayFormat = new Array()
			//record that has all data
			var record = forms[formName].foundset.getRecord(i)
			
			//process one record in universal list, one column at a time
			for ( var j = 0 ; j < rawDisplay.length ; j++ ) {
				var arrayItem = rawDisplay[j].rowDisplay
				var rowDisplayItem = ''
				
				var rowDisp = new Object()
				//if width field left blank, set at 20%
				rowDisp.width = (rawDisplay[j].width) ? rawDisplay[j].width : 20
				//figure how many characters based on current list width and it's percentage
				rowDisp.numChars = (rowDisp.width / 100) * widthUL / charMapping
				rowDisp.align = rawDisplay[j].align
				rowDisp.header = rawDisplay[j].header
				rowDisp.field = rawDisplay[j].fieldName
				
				//PROCESS COLUMN BEGIN
				
				//process column of record in universal list, one element at a time
				for ( var k = 0 ; k < arrayItem.length ; k++ ) {
					var fieldNameItem = arrayItem[k].value
					//if element is a field, evaluate it
					if (arrayItem[k].isField) {
						var formatField = (record[fieldNameItem]) ? record[fieldNameItem] : ''
						
						//if there is a format specified, format the field
						if (rawDisplay[j].format) {
							switch (rawDisplay[j].formatMask) {
									case 'Number':
										formatField = utils.numberFormat(formatField, rawDisplay[j].format)
										break
									
									case 'Date':		//typeof formatField == 'object' && formatField.__proto__ == 'Invalid Date'
										formatField = (formatField) ? utils.dateFormat(formatField, rawDisplay[j].format) : formatField
										break
									
									case 'Text':
										//input is a Function to operate on a string
										//' | ' divides Function from parameters
										//'*this' in parameters inserts the value of the field itself
										var validTexts = application.getValueListItems('NAV_format_text')
										validTexts = validTexts.getColumnAsArray(1)
										
										var stringFormat = rawDisplay[j].format.split(' | ')
										
										//TODO check to see that option is valid against string commands
										//if (stringFormat && stringFormat.length >= 1 && stringFormat[0] in validTexts) {
											var parameter
											if (stringFormat.length == 2) {
												parameter = stringFormat[1]
												
												var thisValue = parameter.split('*this')
												if (thisValue.length) {
													var actualField = ''
													for (var n = 0 ; n < thisValue.length ; n++) {
														actualField += thisValue[n]
														if (n == thisValue.length - 1 == 0) {
															actualField += formatField
														}
														else if (n == thisValue.length - 2) {
															actualField += formatField
														}
													}
													parameter = actualField
												}
												else {
													parameter = formatField
												}
											}
											else {
												parameter = ''
											}
											//format text
											if (formatField) {
												if (stringFormat[0] != 'toInitialCase') {
													formatField = formatField[stringFormat[0]](parameter)
												}
												//custom case for initial caps
												else {
													formatField = globals.CODE_text_initial_caps(formatField)
												}
											}
										//}
										break
									
									case 'Bool':
										var boolValue = rawDisplay[j].format
										boolValue = boolValue.split(' | ')
										
										if (formatField) {
											formatField = boolValue[0]
										}
										else {
											formatField = boolValue[1]
										}
										break
									
									case 'Valuelist':
										//shows displayValue for storedValue in valueList (rawDisplay[j].format is the name of the valueList, formatField is the storedValue)
										formatField = application.getValueListDisplayValue(rawDisplay[j].format,formatField)
										break
									
									default :
										break
							}
						}
						rowDisplayItem += formatField
					}
					//otherwise add literal string to display
					else {
						rowDisplayItem += fieldNameItem
					}
				}
				//PROCESS COLUMN END 
				
				//TRUNCATE DISPLAY BEGIN
	
				//element inside of html tags, only count content
				var htmlTags = rowDisplayItem.match(/<([A-Z][A-Z0-9]*)[^>]*>(.*?)<\/\1>/i)
				if (htmlTags) {
					rowDisplayItem = htmlTags[2]
				}
				rowDisplayItem = rowDisplayItem.substring(0,rowDisp.numChars)
				
				//for the last record in foundset (the one that gets passed to create the header), pad header if needed
				//right now only does for left align by adding space after the word
				if (i == endRec) { //&& rowDisp.header.length < rowDisp.numChars) {
					var widthInitial = rowDisp.header.length
					
					//trunc if too long
					rowDisp.header = rowDisp.header.substring(0,rowDisp.numChars - 1)
					
					//pad
					if (rowDisp.align == 'right') {
						rowDisp.header = rowDisp.header + whiteSpace + whiteSpace + whiteSpace + whiteSpace
					}
					
					/*
					//TODO: come up with offset based on number of upper/lower case.  used to be: + rowDisp.numChars/(1.6)
					while (widthInitial < (rowDisp.numChars/(1.6))) {// - 2)) {
						rowDisp.header += whiteSpace
						widthInitial++
					
					switch (rowDisp.align) {
							case 'left':
								while (widthInitial < rowDisp.numChars - 1) {
									rowDisp.header = rowDisp.header + whiteSpace
									widthInitial++
								}
								break
							case 'center':
								while (widthInitial < rowDisp.numChars - 2) {
									rowDisp.header = whiteSpace + rowDisp.header + whiteSpace
									widthInitial++
								}
								break
							case 'right':
								while (widthInitial < rowDisp.numChars - 3) {
									rowDisp.header = whiteSpace + rowDisp.header
									widthInitial++
								}
								break
					}
					}*/
					
				}
				
				//replace < with html equivalent
				rowDisplayItem = utils.stringReplace(rowDisplayItem, '<', '&lt;')
				
				//pad display if necessary
				if (rowDisplayItem.length < rowDisp.numChars) {
					var widthInitial = rowDisplayItem.length
					switch (rowDisp.align) {
							case 'left':
								while (widthInitial < rowDisp.numChars) {
									rowDisplayItem = rowDisplayItem + whiteSpace
									widthInitial++
								}
								break
							case 'center':
								while (widthInitial < rowDisp.numChars - 1) {
									rowDisplayItem = whiteSpace + rowDisplayItem + whiteSpace
									widthInitial++
								}
								break
							case 'right':
								while (widthInitial < rowDisp.numChars) {
									rowDisplayItem = whiteSpace + rowDisplayItem
									widthInitial++
								}
								break
					}
				}
				//TRUNCATE DISPLAY END
				
				//put html tags back around formatted contents
				if (htmlTags) {
					rowDisp.rowDisplay = utils.stringIndexReplace(htmlTags[0],utils.stringPosition(htmlTags[0],'>',0,1)+1,htmlTags[2].length,rowDisplayItem)
				}
				else {
					rowDisp.rowDisplay = rowDisplayItem
				}
				rowDisplayFormat[j] = globals.CODE_copy_object(rowDisp)		
				
			}
			//PROCESS RECORD END
			
			//OUTPUT HTML BEGIN
			
			//record that we will pump data into
			var recordUL = forms[formUniListTab].foundset.getRecord(i)
			
			//only put css stuff on first row...
				// -when doing a full refresh OR
				// -when first record in UL
			if (i == 1 || (updateRecord && endRec == 1)) {
				recordUL.display = htmlHead
			}
			else {
				recordUL.display = html
			}
			
			//output html row
			recordUL.display += '<tr>'
			
			//row selected, highlight
			if (i == rowSelected) {
				for ( var m = 0 ; m < rowDisplayFormat.length ; m++ ) {
					recordUL.display += '<td class="rowSelected" width="'+rowDisplayFormat[m].width+'%" align="'+rowDisplayFormat[m].align+'">'+rowDisplayFormat[m].rowDisplay+'</td>'
				}
				//extra column makes sure that background row image covers entire possible row
				recordUL.display += '<td class="rowSelected" width></td>'
			}
			else {/*
				//last record, bring half of the maxRec following records into display, rescroll to selected record
				if (i == endRec) {
					//if no more records at bottom, make normal row; else, show more arrow background
					if (endRec == foundsetCount) {					
						for ( var m = 0 ; m < rowDisplayFormat.length ; m++ ) {
							recordUL.display += '<td width="'+rowDisplayFormat[m].width+'%" align="'+rowDisplayFormat[m].align+'">'+rowDisplayFormat[m].rowDisplay+'</td>'
						}
						//extra column makes sure that background row image covers entire possible row
						recordUL.display += '<td width></td>'
						
						//hide arrow
						forms[formUniListTab].elements.lbl_rec_bottom.visible = false
					}
					else {
						for ( var m = 0 ; m < rowDisplayFormat.length ; m++ ) {
							recordUL.display += '<th width="'+rowDisplayFormat[m].width+'%" align="'+rowDisplayFormat[m].align+'">'+rowDisplayFormat[m].rowDisplay+'</th>'
						}
						//extra column makes sure that background row image covers entire possible row
						recordUL.display += '<th width></th>'
						
						//show arrow
						forms[formUniListTab].elements.lbl_rec_bottom.visible = true
					}
				}
				//all middle, non selected records
				else {*/
					for ( var m = 0 ; m < rowDisplayFormat.length ; m++ ) {
						recordUL.display += '<td width="'+rowDisplayFormat[m].width+'%" align="'+rowDisplayFormat[m].align+'">'+rowDisplayFormat[m].rowDisplay+'</td>'
					}
					//extra column makes sure that background row image covers entire possible row
					recordUL.display += '<td width></td>'
			//	}
			}
			//wrap up
			recordUL.display +=	'</tr></table></body></html>'
			
			//OUTPUT HTML END
		}
		//END FOUNDSET PROCESSING
		
		//don't mess with header if record refresh requested
		if (!updateRecord) {
			//output html header
			globals.NAV_universal_list_header_generate(rowDisplayFormat)
		}
		
		//change record index away and then back to force a redraw
		forms[formUniListTab].foundset.setSelectedIndex(((rowSelected == endRec) ? startRec : endRec))
		forms[formUniListTab].foundset.setSelectedIndex(rowSelected)
		
		//show that ran one time -- enable rec on select
		forms[formUniListTab].configured = true
		
		//punch down when ran
		navigationPrefs.byNavItemID[currentNavItem].listData.dateFullRefresh = navigationPrefs.byNavItemID[currentNavItem].listData.dateModified = application.getServerTimeStamp()
	}
	//no records; set header
	else {
		var rowDisplayFormat = new Array()
		
		//process one record in universal list, one column at a time
		for ( var j = 0 ; j < rawDisplay.length ; j++ ) {
			var arrayItem = rawDisplay[j].rowDisplay
			
			var rowDisp = new Object()
			//if width field left blank, set at 20%
			rowDisp.width = (rawDisplay[j].width) ? rawDisplay[j].width : 20
			//figure how many characters based on current list width and it's percentage
			rowDisp.numChars = (rowDisp.width / 100) * widthUL / charMapping
			rowDisp.align = rawDisplay[j].align
			rowDisp.header = rawDisplay[j].header
			rowDisp.rowDisplay = ''
			
			//trunc if too long
			rowDisp.header = rowDisp.header.substring(0,rowDisp.numChars - 1)
			
			//pad when right display
			if (rowDisp.align == 'right') {
				rowDisp.header = rowDisp.header + whiteSpace + whiteSpace + whiteSpace + whiteSpace
			}
			
			//copy back in
			rowDisplayFormat[j] = globals.CODE_copy_object(rowDisp)	
		}
				
		//header call
		globals.NAV_universal_list_header_generate(rowDisplayFormat)
	}
	
	
	//there are more records, tack on down arrow row
	if (moreRecs) {
		//record that we will pump data into
		var recordUL = forms[formUniListTab].foundset.getRecord(i)
		
		//down arrows html stuff
		recordUL.display = html
		recordUL.display += '<td width="100%" height="16" align="center"><img height="16" width="146" border="0" src="media:///btn_ul_more_recs.png"></td>'
		recordUL.display +=	'</tr></table></body></html>'
	}
	
	globals.TRIGGER_timer('stop')
}
}

/**
 *
 * @properties={typeid:24,uuid:"1c4694d6-10c4-4887-ab3c-6c4764b2664d"}
 */
function UL_sync_records()
{

/*
 *	TITLE    :	UL_sync_records
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	syncs the # of UL records with live data
 *			  	
 *	INPUT    :	1) skipDataFill (true/false)
 *			  	2) whichEndRec (true/false)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	June 18, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: find way to add to foundset so that a full redraw is not necessary

if (application.__parent__.solutionPrefs) {

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

	var formUniListTab = elements.tab_ul.getTabFormNameAt(1)
	var formName = solutionPrefs.config.currentFormName
	var currentNavItem = solutionPrefs.config.currentFormID
	var maxRows = forms[formName].foundset.getSize()
	var foundsetCount = databaseManager.getFoundSetCount(forms[formName].foundset)
	var currentRows = forms[formUniListTab].foundset.getSize()
	var skipDataFill = arguments[0]
	var whichEndRec = arguments[1]
	
	if (maxRows != currentRows) {
		
		var bluPrint = navigationPrefs.byNavItemID[currentNavItem].listData.foundsets.blueprint.length
		
		//chop off records if blu < max < current
		if (bluPrint <= maxRows && maxRows < currentRows) {
			var pkUL = databaseManager.getFoundSetDataProviderAsArray(forms[formUniListTab].foundset, 'id_universal_list')
			//TODO: if pk after the next pk index, release from blacklist
			//TODO: if pk before next pk index, add to recycle list
			//pkUL.sort(globals.CODE_sort_numeric)
			
			//all pks to be released
			var pkToRecycle = pkUL.slice(maxRows)
			
			//classify recycling pks
			var afterBreakPoint = false
			//start at high end of array and work backwards
				//runs at least once
				//when pk smaller than nextFreePK found, stop
			for (var i = pkToRecycle.length - 1; i > 0 && ((i == pkToRecycle.length - 1) ? true : afterBreakPoint); i--) {
				if (pkToRecycle[i] >= navigationPrefs.foundsetPool.nextFreePK) {
					afterBreakPoint = true
				}
				else {
					afterBreakPoint = false
					
					//mark breakpoint only if didn't stop the first time through
					if (i != pkToRecycle.length - 1) {
						var pkToRecycleSplit = i + 1
					}
				}
			}
			
			//we have things to recycle/release
			if (pkToRecycle.length) {
				//pk after the next pk index, release from blacklist
				if (pkToRecycleSplit) {
					var pkToUnomit = pkToRecycle.slice(pkToRecycleSplit)
					pkToRecycle = pkToRecycle.slice(0,pkToRecycleSplit)
					
					//find value to release from blacklist and remove
					for (var i = 0; i < pkToUnomit.length; i++) {
						var unOmitPosn = globals.CODE_search_array(navigationPrefs.foundsetPool.omitPKs,pkToUnomit[i])
						
						if (unOmitPosn) {
							navigationPrefs.foundsetPool.omitPKs.splice(unOmitPosn[0],1)
						}
					}
				}
				//pk before next pk index, add to recycle list
				if (pkToRecycle.length) {
					for (var i = 0; i < pkToRecycle.length; i++) {
						navigationPrefs.foundsetPool.recyclePKs[navigationPrefs.foundsetPool.recyclePKs.length] = pkToRecycle[i]
					}
				}
			}
			
			//truncate current set
			pkUL = pkUL.slice(0,maxRows)
		}
		//use blueprint and then restrict
		else if (maxRows <= bluPrint) {
			var pkUL = globals.CODE_copy_object(navigationPrefs.byNavItemID[currentNavItem].listData.foundsets.blueprint)
			pkUL = pkUL.slice(0,maxRows)
		}
		//add more records if more than blueprint
		else {
			//start with current foundset as starting point
			if (currentRows > bluPrint) {
				var pkUL = databaseManager.getFoundSetDataProviderAsArray(forms[formUniListTab].foundset, 'id_universal_list')
			}
			//start with blueprint as starting point
			else {
				var pkUL = globals.CODE_copy_object(navigationPrefs.byNavItemID[currentNavItem].listData.foundsets.blueprint)
			}
			
			//TODO: is it possible to not need more records at this point?
			//get more
			if (maxRows - pkUL.length) {
				//get as many contents of recycle array as possible
				if (navigationPrefs.foundsetPool.recyclePKs.length) {
					//sort array to be recycled
					navigationPrefs.foundsetPool.recyclePKs.sort(globals.CODE_sort_numeric)
					
					//use only as much of recycle array as needed
					var recycledLength = (navigationPrefs.foundsetPool.recyclePKs.length > (maxRows - pkUL.length)) ? maxRows - pkUL.length : navigationPrefs.foundsetPool.recyclePKs.length
					
					//new values from recycler
					var pkFromRecycle = navigationPrefs.foundsetPool.recyclePKs.slice(0,recycledLength)
					
					//truncate recycler
					navigationPrefs.foundsetPool.recyclePKs.splice(0,recycledLength)
					
					//combine recycled with current array
					pkUL = new Array().concat(pkUL,pkFromRecycle)
				}
				
				//get more records from backend if more needed
				if (maxRows - pkUL.length) {
					var query = 'SELECT id_universal_list FROM sutra_universal_list WHERE id_universal_list >= ?'
					var args = [navigationPrefs.foundsetPool.nextFreePK]
					
					//tack on records to omit
					if (navigationPrefs.foundsetPool.omitPKs.length) {
						//sort omit by array
						navigationPrefs.foundsetPool.omitPKs.sort(globals.CODE_sort_numeric)
						
						query += ' AND id_universal_list NOT IN ('
						
						//add ? and values to query/args array
						for (var i = 0; i < navigationPrefs.foundsetPool.omitPKs.length; i++) {
							if (i == 0) {
								query += '?'
							}
							else {
								query += ',?'
							}
							args[args.length] = navigationPrefs.foundsetPool.omitPKs[i]
						}
						
						query += ')'
					}
					
					//get more records
					var dsUniversalList = databaseManager.getDataSetByQuery(
											controller.getServerName(), 
											query,
											args,
											//+1 to get next pk
											maxRows - pkUL.length + 1)	
					var arULNew = dsUniversalList.getColumnAsArray(1)
					
					/*
					//if more unloaded records exist in this foundset
					if (foundsetCount > maxRows) {
						//punch down which record can be used next
						//navigationPrefs.foundsetPool.nextFreeRec += maxRows - pkUL.length - 1
						navigationPrefs.foundsetPool.nextFreePK = arULNew[arULNew.length - 2]
						
						//remove last 2 records (to prevent from loading in next 200 chunk)
						arULNew.pop()
						arULNew.pop()
					}
					//all possible records are already loaded into the foundset
					else {
						//punch down which record can be used next
						//navigationPrefs.foundsetPool.nextFreeRec += maxRows - pkUL.length
						navigationPrefs.foundsetPool.nextFreePK = arULNew[arULNew.length - 1]
						
						//remove last record
						arULNew.pop()
					}
					*/
					
					//save down what the next available record in the ul is
					navigationPrefs.foundsetPool.nextFreePK = arULNew.pop()
					
					//combine arrays
					pkUL = new Array().concat(pkUL,arULNew)
				}
			}
			//recycle
			else {
				
			}
		}
		
		//disable rec on select
		forms[formUniListTab].configured = false
		
		//load records
		forms[formUniListTab].foundset.clear()
		forms[formUniListTab].foundset.loadRecords(databaseManager.convertToDataSet(pkUL))
		
		//enable rec on select
		forms[formUniListTab].configured = true
	}
	
	//set indicator for which record is highlighted
	navigationPrefs.byNavItemID[currentNavItem].listData.index.selected = forms[formName].foundset.getSelectedIndex()
	
	//populate data unless skipped
	if (!skipDataFill) {
		//TODO: pass true as second parameter to keep from loading in additional 200?
		UL_fill_data(whichEndRec)
	}
}


}
