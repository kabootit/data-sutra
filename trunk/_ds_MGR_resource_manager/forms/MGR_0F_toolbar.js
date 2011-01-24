/**
 *
 * @properties={typeid:24,uuid:"D7E59CC6-5F99-439F-8458-49DADDCF766E"}
 */
function ACTIONS_list()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	toolbar actions
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	September 18, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//menu items
var valuelist = new Array('Delete all...')

//set up menu with arguments
var menu = new Array()
for ( var i = 0 ; i < valuelist.length ; i++ ) {
	menu[i] = plugins.popupmenu.createMenuItem(valuelist[i],ACTIONS_list_control)
	
	menu[i].setMethodArguments(i)
	
	if (menu[i].text == '-') {
		menu[i].setEnabled(false)
	}
}

//popup
var elem = elements[application.getMethodTriggerElementName()]
if (elem != null) {
	plugins.popupmenu.showPopupMenu(elem, menu)
}


}

/**
 *
 * @properties={typeid:24,uuid:"014A5D29-6017-4061-B81F-5337476675C1"}
 */
function ACTIONS_list_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	toolbar actions
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	September 18, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch( arguments[0] ) {
	case 0:	//delete all
		var input = plugins.dialogs.showWarningDialog("Warning", "Delete all records?", "Yes", "No")
		
		switch (elements.tab_detail.tabIndex) {
			case 1:
				var formName = 'MGR_0F_toolbar_1L__toolbar_2L'
				break
			case 2:
				var formName = 'MGR_0F_toolbar_1L__sidebar_2L'
				break
		}
		
		if (input == "Yes" && formName) {	
			forms[formName].controller.deleteAllRecords()
		}
		break
}
}

/**
 *
 * @properties={typeid:24,uuid:"2DBFB3C4-D4BD-4AB0-80E5-9F20FF33A803"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TRIGGER_tooltip_set()

globals.TAB_change_grid_init()
}

/**
 *
 * @properties={typeid:24,uuid:"A8D2A883-3C5F-4AC2-826A-D4475C40E371"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_new()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch (elements.tab_detail.tabIndex) {
	case 1:
		var formName = 'MGR_0F_toolbar_1L__toolbar_2L'
		break
	case 2:
		var formName = 'MGR_0F_toolbar_1L__sidebar_2L'
		break
}

forms[formName].controller.newRecord(false)

//set tab number
forms[formName].row_order = forms[formName].foundset.getSize()

//set type of bar
forms[formName].toolbar_type = elements.tab_detail.tabIndex

forms[formName].elements.fld_tab_name.requestFocus(false)
}

/**
 *
 * @properties={typeid:24,uuid:"939741C4-B9D2-48E6-89C7-7BDF86E75EFA"}
 */
function SET_preference()
{
//deprecated
/*
 *	TITLE    :	SET_preference
 *			  	
 *	MODULE   :	
 *			  	
 *	ABOUT    :	set current record as only preference
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */
/*
var needToSet = false
databaseManager.saveData()

//set to be displayed during preferences
if (pref_default) {
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset)
	fsUpdater.setColumn('pref_default',0)
	fsUpdater.performUpdate()
	pref_default = 1
	
	//zero out other fields
	rec_nav_show = 0
	row_status_show = 0
	row_order = 0
}
//make it a normal tab
else {
	row_order = foundset.getSize()
	needToSet = true
}

databaseManager.saveData()

controller.sort('row_order asc')

//need to put former preference into the tab order
if (needToSet) {
	controller.setSelectedIndex(foundset.getSize())
}
//need to re-serialize the other non-preference tabs
else if (foundset.getSize() > 1) {
	controller.setSelectedIndex(2)
	var count = 1
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset)
	while(fsUpdater.next())
	{
		fsUpdater.setColumn('row_order',count++)
	}
	controller.setSelectedIndex(1)
}

*/
}
