/**
 *
 * @properties={typeid:24,uuid:"157349b9-1118-4632-924b-efcc9fc8752d"}
 */
function ACTIONS_preview()
{

/*
 *	TITLE    :	ACTIONS_preview
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	action values retrieved from action_item table
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

//grab the actions to this
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'select menu_name, order_by from sutra_action_item ' +
					'where category = ? and id_navigation_item = ? order by order_by asc',
                ["Actions",globals.NAV_navigation_item_selected],
                100)
var valueList = dataset.getColumnAsArray(1)

//only show pop-up if there are enabled values
if (bar_item_action && valueList.length) {
	//build menu
	var menu = new Array
	for ( var i = 0 ; i < valueList.length ; i++ ) {
	    menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "")
	
		//disable dividers
		if (valueList[i] == '----') {
			menu[i].setEnabled(false)
		}
	}
	
	//popdown popup menu
	var elem = elements[application.getMethodTriggerElementName()]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menu)
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"66a52e8d-6ce0-4f90-8814-acd34a5f94b8"}
 */
function FILTERS_preview()
{

/*
 *	TITLE    :	FILTERS_preview
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	filter values retrieved from action_item table
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


var serverName = controller.getServerName()
var query = ''
var args = new Array()
var maxRecords = 100

var prefix = 'actionItem_'
var navigationID = globals.NAV_navigation_item_selected

//get the pk for items that have submenus
query = 	'select id_action_item, id_action_item_parent from sutra_action_item ' +
			'where id_navigation_item = ? and category = ? and filter_type = ? ' +
			'order by id_action_item_parent asc'
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
	query =	'SELECT id_action_item, menu_name, filter_type FROM sutra_action_item ' +
			'WHERE id_navigation_item = ? AND category = ? AND id_action_item_parent = ? ' +
			'ORDER BY order_by ASC'
	args = [navigationID,'Filters',allSubMenuID[i]]
	dataset = databaseManager.getDataSetByQuery(serverName,query,args,maxRecords)
	
	var menu = new Object()
	menu.menuID = dataset.getColumnAsArray(1)
	menu.menuItem = dataset.getColumnAsArray(2)
	menu.menuType = dataset.getColumnAsArray(3)
	var filterItems = menu.menuFilters = new Array()
	
	//loop through all menu items
	for (var k = 0; k < menu.menuID.length; k++) {
		//if it is not a submenu, get the filter_items
		if (menu.menuType[k] == 0 || menu.menuType[k] == null) {
			query =	'SELECT column_relation, column_name, column_operator, column_value FROM sutra_action_item_filter WHERE id_action_item = ?'
			args = [menu.menuID[k]]
			dataset = databaseManager.getDataSetByQuery(serverName,query,args,maxRecords)
			var tableReln = dataset.getColumnAsArray(1)
			var columnName = dataset.getColumnAsArray(2)
			var operator = dataset.getColumnAsArray(3)
			var columnValue = dataset.getColumnAsArray(4)
			
			var oneFilter = new Array()
			//create array that has objects describing what finds must be done for filter
			for (var j = 0; j < columnName.length; j++) {
				var filterItem = new Object()
				filterItem.tableReln = tableReln[j]
				filterItem.columnName = columnName[j]
				filterItem.operator = operator[j]
				filterItem.columnValue = columnValue[j]
				
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
				var filterSpec = []
				for (var j = 0; j < displayValues.length && j < 100; j++) {
					uuid.push(application.getNewUUID())
					itemName.push(displayValues[j])
					//MEMO: we are attaching an array with one object in it here
					filterSpec.push([{
								tableReln : tableReln,
								columnName : columnName,
								operator : operator,
								columnValue : (vlType == 'Display') ? displayValues[j] : ((vlType == 'Stored') ? realValues[j] : null),
								filterType : 'Value',
								filterMethod : null
							}])
				}
				
				//create nodes in menu object for all values (up to 100) in selected valuelist
				allMenus[prefix + menu.menuID[k]] = {
					menuID : uuid,
					menuItem : itemName,
					menuType : new Array((displayValues.length > 100) ? 100 : displayValues.length),
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

//only show pop-up if there are enabled values
if (bar_item_filter && menuMain.length) {
	//popdown popup menu
	var elem = elements[application.getMethodTriggerElementName()]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menuMain)
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"3acb51cb-f40b-44be-91d7-c2c89b9b9550"}
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
globals.CALLBACK_tooltip_set()

//globals.TAB_change_grid_init(null,null,'tab_buttons','tab_b')

}

/**
 *
 * @properties={typeid:24,uuid:"ca9e9b4e-28eb-417e-9174-2aecde7f379c"}
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
var prefix = 'actionItem_'
var menuItem = prefix + arguments[1]
var menu = new Array()

//all items for specified menu
for ( var j = 0 ; j < allMenus[menuItem].menuID.length ; j++ ) {
	//only attach menus with a name
	if (allMenus[menuItem].menuItem[j]) {
		//if a filter node, attach submenu
		if (allMenus[menuItem].menuType[j] == 1) {
			var subMenu = FX_multitier_menu(allMenus,allMenus[menuItem].menuID[j])
			if (subMenu.length) {
				menu.push(plugins.popupmenu.createMenuItem(allMenus[menuItem].menuItem[j], subMenu))
			}
		}
		//if a filter item, attach item
		else {
			menu.push(plugins.popupmenu.createCheckboxMenuItem(allMenus[menuItem].menuItem[j] + ""))	
		
			//disable dividers
			if (menu[menu.length - 1].text == '----') {
				menu[menu.length - 1].setEnabled(false)
			}
		}
	}
}

return menu


}

/**
 *
 * @properties={typeid:24,uuid:"43e1472a-892f-49fb-9c68-e9c7a98686ce"}
 */
function REC_data_change__add()
{

//if no record and value is true, create one action record
databaseManager.saveData()

if (bar_item_add && nav_navigation_item_to_action_item__add.getSize() == 0) {
	nav_navigation_item_to_action_item__add.newRecord()
	nav_navigation_item_to_action_item__add.menu_name = 'Add'
}

databaseManager.saveData()
//switch tabs
//TAB_enable()
}

/**
 *
 * @properties={typeid:24,uuid:"26ec0599-0298-48fa-a8f8-45446ea1907f"}
 */
function REC_on_select()
{

//set tab enabled status
//TAB_enable()

//get method names of current form
var formName = form_to_load

if (forms[formName]) {
	var methodNamesDisplay = forms[formName].allmethods
	var methodNames = new Array()
	
	for ( var i = 0 ; i < methodNamesDisplay.length ; i++ ) {
		methodNames[i] = methodNamesDisplay[i] + '()'
	}
	
	//assign methodNames to value list
	application.setValueListItems('NAV_current_form_methods',methodNamesDisplay,methodNames)
}

}

/**
 *
 * @properties={typeid:24,uuid:"49de605a-7eba-467e-90ed-77cf4c3a2c0b"}
 */
function REPORTS_preview()
{

/*
 *	TITLE    :	TABS_preview
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	filter values retrieved from action_item table
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

//grab the reports for this
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'select menu_name, order_by from sutra_action_item ' +
					'where category = ? and id_navigation_item = ? order by order_by asc',
                ["Reports",globals.NAV_navigation_item_selected],
                100)
var valueList = dataset.getColumnAsArray(1)

//only show pop-up if there are enabled values
if (bar_item_report && valueList.length) {
	//build menu
	var menu = new Array
	for ( var i = 0 ; i < valueList.length ; i++ ) {
	    menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "")
	
		//disable dividers
		if (valueList[i] == '----') {
			menu[i].setEnabled(false)
		}
	}
	
	//popdown popup menu
	var elem = elements[application.getMethodTriggerElementName()]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menu)
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"098a6d6c-f9c7-4e8e-8450-08915e9b3871"}
 */
function TAB_control()
{

/*
 *	TITLE:		TAB_control
 *
 *	MODULE:		ds_NAV_navigation_standard
 *
 *	ABOUT:		Tab panel method change
 *
 *	MODIFIED:	Sept 13, 2007 - Troy Elliott, Data Mosaic
 *
 */

globals.TAB_change_grid(null,null,'tab_buttons','tab_b')

/*
//set the tab panel name for this method
var tabPanelName = 'tab_buttons'

var formName = controller.getName()

if (!arguments[0]) {
	var btn_name = application.getMethodTriggerElementName()
}
else {
	var btn_name = arguments[0]
}

//get font string (font,normal/bold/italic/bolditalic,size)
if (application.__parent__.solutionPrefs) {
	//on a mac
	if (solutionPrefs.clientInfo == 'Mac OS X') {
		var fontSelect = 'Verdana,1,10'
		var fontUnselect = 'Verdana,0,10'
	}
	//on windows, linux, etc.
	else {
		var fontSelect = 'Tahoma,1,11'
		var fontUnselect = 'Tahoma,0,11'	
	}
}
//use mac settings when not running in the shell //TODO: change to windows settings when deployed
else {
	var fontSelect = 'Verdana,1,10'
	var fontUnselect = 'Verdana,0,10'
}

//get number of tabs
var tab_num = elements[tabPanelName].getMaxTabIndex()

//activate correct tab and flip tab buttons
for ( var i = 1 ; i <= tab_num ; i++ ) {	
	var tab_name = 'tab_b' + i
	
	if (btn_name == tab_name) {
		elements[tab_name].bgcolor = '#d1d7e2'
		elements[tab_name].setFont(fontSelect)
		
		//set tab index
		elements[tabPanelName].tabIndex = i
	}
	else {
		elements[tab_name].bgcolor = '#a1b0cf'
		elements[tab_name].setFont(fontUnselect)
	}

}
*/
/*

var count = utils.stringToNumber(btn_name.split('_')[1])

//get field worked on
switch (count) {
	case 1:
		var fieldName = 'bar_item_add'
		break
	case 2:
		var fieldName = 'bar_item_action'
		break
	case 3:
		var fieldName = 'bar_item_filter'
		break
	case 4:
		var fieldName = 'bar_item_report'
		break
	case 5:
		var fieldName = 'bar_item_tab'
		break
}

//enable/disable
if (forms[formName][fieldName]) { //if turned on
	elements[tabPanelName].enabled = true
	
	//check if there are not filters
	if (fieldName == 'bar_item_filter' && !utils.hasRecords(nav_navigation_item_to_action_item__filter)) {
		var formFilter = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter'
		forms[formFilter].elements.tab_list_sub1.enabled = false
		forms[formFilter].elements.lbl_list_sub1.enabled = false
		forms[formFilter].elements.tab_list_sub2.enabled = false
		forms[formFilter].elements.lbl_list_sub2.enabled = false
	}
}
else {
	elements[tabPanelName].enabled = false
}	

*/


}

/**
 *
 * @properties={typeid:24,uuid:"b008f8b1-6b46-45a6-b1c0-d12bcb8ee128"}
 */
function TAB_enable()
{
/*
databaseManager.saveData()

TAB_control('tab_b'+elements.tab_buttons.tabIndex)
*/
}

/**
 *
 * @properties={typeid:24,uuid:"31afd315-b9f0-4e0e-b87a-3309847fb13b"}
 */
function TABS_preview()
{

/*
 *	TITLE    :	TABS_preview
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	filter values retrieved from action_item table
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

//grab the tabs for this
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'select menu_name, order_by from sutra_action_item ' +
					'where category = ? and id_navigation_item = ? order by order_by asc',
                ["Tabs",globals.NAV_navigation_item_selected],
                100)
var valueList = dataset.getColumnAsArray(1)


//only show pop-up if there are enabled values
if (bar_item_tab && valueList.length) {
	//tack on universal list to the top of the array
	valueList.unshift(globals.CODE_text_initial_caps(fw_list_title))
	
	//build menu
	var menu = new Array
	for ( var i = 0 ; i < valueList.length ; i++ ) {
	    menu[i] = plugins.popupmenu.createCheckboxMenuItem(valueList[i] + "")
	
		//set check on universal list
		if (i == 0) {
			menu[i].setSelected(true)
		}
		
		//disable dividers
		if (valueList[i] == '----') {
			menu[i].setEnabled(false)
		}
	}
	
	
	//popdown popup menu
	var elem = elements[application.getMethodTriggerElementName()]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menu)
	}
}
}
