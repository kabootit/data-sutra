/**
 *
 * @properties={typeid:24,uuid:"e98e22a6-f4af-457c-99d3-d0dfd4c4fcab"}
 */
function ACTION_toggle_detail()
{

/*
 *	TITLE    :	ACTION_toggle_detail
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle detail form view
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Aug 31, 2007 -- David Workman, Data Mosaic
 *			  	
 */

if (elements.btn_detail_right.visible == false) {

	//turn on detail
	elements.tab_detail.visible = true
	
	//resize list
	var x1 = elements.tab_list.getWidth()
	var x2 = elements.tab_detail.getWidth()
	var y = elements.tab_list.getHeight()
	
	elements.tab_list.setSize(x1 - x2, y)
	
	//set buttons visibility
	elements.btn_detail_right.visible = true
	elements.btn_detail_left.visible = false
	

}
else {
	
	//turn off detail
	elements.tab_detail.visible = false
	
	//resize list
	var x1 = elements.tab_list.getWidth()
	var x2 = elements.tab_detail.getWidth()
	var y = elements.tab_list.getHeight()

	elements.tab_list.setSize(x1 + x2, y)
	
	//set buttons visibility
	elements.btn_detail_right.visible = false
	elements.btn_detail_left.visible = true

}
}

/**
 *
 * @properties={typeid:24,uuid:"1b73374b-4291-4642-a575-fd2876d3effe"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	load tooltips; init tab panel
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

globals.TRIGGER_tooltip_set()

globals.TAB_change_grid_init()
}

/**
 *
 * @properties={typeid:24,uuid:"305fa2e0-3da7-4fc9-b18f-43cdc4391e39"}
 * @AllowToRunInFind
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	get the modes and navigation sets based on the available options
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//find configuration navigation set
var navigationSet = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation')
navigationSet.find()
navigationSet.flag_config = 1
var results = navigationSet.search()

//what is the configuration navigation set
if (results) {
	var navSetID = navigationSet.id_navigation
}
else {
	var navSetID = null
}

//grab the admin modes available
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'select item_name, id_navigation_item from sutra_navigation_item ' +
					'where id_navigation = ? and row_status_show = ? and config_type = ? order by node_1',
                [navSetID,1,'Admin'],
                100)
var valueList = dataset.getColumnAsArray(1)
var idList = dataset.getColumnAsArray(2)

application.setValueListItems('AC_sutra_modes_admin',valueList,idList)

//grab the user modes available
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'select item_name, id_navigation_item from sutra_navigation_item ' +
					'where id_navigation = ? and row_status_show = ? and config_type = ? order by node_1',
                [navSetID,1,'User'],
                100)
var valueList = dataset.getColumnAsArray(1)
var idList = dataset.getColumnAsArray(2)

application.setValueListItems('AC_sutra_modes_user',valueList,idList)

//grab the navigation sets available
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'select nav_name, id_navigation from sutra_navigation where id_navigation != ? order by nav_name',
                [navSetID],
                100)
var valueList = dataset.getColumnAsArray(1)
var formList = dataset.getColumnAsArray(2)

application.setValueListItems('AC_navigation_sets',valueList,formList)
application.setValueListItems('AC_navigation_sets_int',valueList,formList)

//get global methods for use in login routine
var globalMethods = globals.allmethods
application.setValueListItems('AC_group_method', globalMethods)

//fire onselect again because it fires before form on show
REC_on_select()
}

/**
 *
 * @properties={typeid:24,uuid:"15ef530e-436e-48f3-a23d-1f766d88ca56"}
 */
function FOUNDSET_update_record()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	update navigation set, item, and sub-item for all foundset with options on current record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var dialog = globals.DIALOGS.showQuestionDialog('Update foundset','Do you want to update all records in foundset with the login options of the selected user?','Yes','No')

if (dialog == 'Yes') {
	var navSet = ac_access_group_to_access_user_group__selected.ac_access_user_group_to_access_user.login_nav_set
	var navItem = ac_access_group_to_access_user_group__selected.ac_access_user_group_to_access_user.login_nav_main
	var navSubItem = ac_access_group_to_access_user_group__selected.ac_access_user_group_to_access_user.login_nav_sub
	
	var fsUpdater = databaseManager.getFoundSetUpdater(ac_access_group_to_access_user_group.ac_access_user_group_to_access_user)
	fsUpdater.setColumn('login_nav_set', navSet)
	fsUpdater.setColumn('login_nav_main', navItem)
	fsUpdater.setColumn('login_nav_sub', navSubItem)
	fsUpdater.performUpdate()
	
	databaseManager.saveData()
}

}

/**
 *
 * @properties={typeid:24,uuid:"b0d98d01-eb1d-41ef-9169-702aa40ed2ba"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	delete group record (and all users)
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */


var delRec = globals.DIALOGS.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')

if (delRec == 'Yes') {
	controller.deleteRecord()
	globals.TRIGGER_ul_refresh_all()
}
}

/**
 *
 * @properties={typeid:24,uuid:"65b0c87d-8112-4338-8485-d3211611b9ab"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	create new group record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

controller.newRecord(true)
databaseManager.saveData()

application.updateUI()
elements.fld_group_name.requestFocus(false)
}

/**
 *
 * @properties={typeid:24,uuid:"2d1e3d7e-6263-41f3-8359-0c80cd39bb39"}
 * @AllowToRunInFind
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	set valuelist based on navigation sets chosen
 *				flag invalid naviation control sets (original navigation set was deleted)
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//find configuration navigation set
var navigationSet = databaseManager.getFoundSet(controller.getServerName(),'sutra_control_navigation')
navigationSet.clear()
navigationSet.find()
navigationSet.flag_chosen = 1
navigationSet.id_group = id_group
var results = navigationSet.search()

if (results) {
	//get navigation ids and display values
	var navSets = new Array()
	var navDisplay = new Array()
	for (var i = 0 ; i < results ; i++) {
		var record = navigationSet.getRecord(i+1)
		navSets[i] = record.id_navigation
		navDisplay[i] = record.nav_name
	}
}
else {
	var navSets = new Array()
	var navDisplay = new Array()
}

//set new valuelist
application.setValueListItems('AC_navigation_set__active',navDisplay,navSets)

//load correct toolbar records
forms.AC_0F_group__toolbar.LOAD_records()
}

/**
 *
 * @properties={typeid:24,uuid:"ff1325dd-37ba-453b-907b-e047308dcd7f"}
 */
function SET_logging()
{

/*
 *	TITLE    :	SET_logging
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle null/all value
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */


//menu items
var menu = new Array(
	plugins.popupmenu.createMenuItem('Select all', SET_logging_control),
	plugins.popupmenu.createMenuItem('Select none', SET_logging_control)
)

//set arguments
for ( var i = 0 ; i < menu.length ; i++ ) {
	menu[i].setMethodArguments(i)
}

//popup
var elem = elements[application.getMethodTriggerElementName()]
if (elem != null) {
	plugins.popupmenu.showPopupMenu(elem, menu)
}
}

/**
 *
 * @properties={typeid:24,uuid:"5966e4b5-a423-4cc9-a0ca-99ce2abe03ab"}
 */
function SET_logging_control()
{

/*
 *	TITLE    :	SET_loggin_control
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle null/all value
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

switch (arguments[0]) {
	case 0:
		var listItems = application.getValueListArray('AC_logging')
		log_items = ""
		for ( var i in listItems ) {
			log_items += listItems[i] + "\n"
		}
		break
	case 1:
		log_items = null
		break

}

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"0847d01b-3683-4436-bad1-f0fcc31a563e"}
 */
function SET_modes_admin()
{

/*
 *	TITLE    :	SET_nav_sets
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle null/all value of nav sets
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

//menu items
var menu = new Array(
	plugins.popupmenu.createMenuItem('Select all', SET_modes_admin_control),
	plugins.popupmenu.createMenuItem('Select none', SET_modes_admin_control)
)

//set arguments
for ( var i = 0 ; i < menu.length ; i++ ) {
	menu[i].setMethodArguments(i)
}

//popup
var elem = elements[application.getMethodTriggerElementName()]
if (elem != null) {
	plugins.popupmenu.showPopupMenu(elem, menu)
}

}

/**
 *
 * @properties={typeid:24,uuid:"9be0b6cf-93bb-4dd7-839f-e64f2f09a78d"}
 */
function SET_modes_admin_control()
{

/*
 *	TITLE    :	SET_nav_sets
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle null/all value of toolbars
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	toggle null/all value of nav set
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	March 2008 -- David Workman, Data Mosaic
 *			  	
 */

switch(arguments[0]) {
	case 0:
		var listItems = application.getValueListArray('AC_sutra_modes_admin')
		modes_admin = ""
		for ( var i in listItems ) {
			modes_admin += listItems[i] + "\n"
		}
		break
	case 1:
		modes_admin = null
		break

}

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"b3a943b4-e993-4939-b65a-ce588b03eed8"}
 */
function SET_modes_user()
{

/*
 *	TITLE    :	SET_modes
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle null/all value of modes
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */


//menu items
var menu = new Array(
	plugins.popupmenu.createMenuItem('Select all', SET_modes_user_control),
	plugins.popupmenu.createMenuItem('Select none', SET_modes_user_control)
)

//set arguments
for ( var i = 0 ; i < menu.length ; i++ ) {
	menu[i].setMethodArguments(i)
}

//popup
var elem = elements[application.getMethodTriggerElementName()]
if (elem != null) {
	plugins.popupmenu.showPopupMenu(elem, menu)
}
}

/**
 *
 * @properties={typeid:24,uuid:"4fbe68ee-5b8e-4b4a-b395-1f9eecb3dd09"}
 */
function SET_modes_user_control()
{

/*
 *	TITLE    :	SET_modes
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle null/all value of modes
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

switch(arguments[0]) {
	case 0:
		var listItems = application.getValueListArray('AC_sutra_modes_user')
		modes_user = ""
		for ( var i in listItems ) {
			modes_user += listItems[i] + "\n"
		}
		break
	case 1:
		modes_user = null
		break

}

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"b6288bf5-6703-4fad-bca8-b1f2796c26d5"}
 */
function SET_toolbars()
{

/*
 *	TITLE    :	SET_nav_sets
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle null/all value of toolbars
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */


//menu items
var menu = new Array(
	plugins.popupmenu.createMenuItem('Select all', SET_toolbars_control),
	plugins.popupmenu.createMenuItem('Select none', SET_toolbars_control)
)

//set arguments
for ( var i = 0 ; i < menu.length ; i++ ) {
	menu[i].setMethodArguments(i)
}

//popup
var elem = elements[application.getMethodTriggerElementName()]
if (elem != null) {
	plugins.popupmenu.showPopupMenu(elem, menu)
}
}

/**
 *
 * @properties={typeid:24,uuid:"20ad5262-f359-499f-a640-edfb44b32d05"}
 */
function SET_toolbars_control()
{

/*
 *	TITLE    :	SET_nav_sets
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle null/all value of toolbars
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

switch(arguments[0]) {
	case 0:
		var listItems = application.getValueListArray('AC_toolbars')
		toolbars = ""
		for ( var i in listItems ) {
			toolbars += listItems[i] + "\n"
		}
		break
	case 1:
		toolbars = null
		break

}

databaseManager.saveData()
}
