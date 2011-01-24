/**
 *
 * @properties={typeid:24,uuid:"a8232f28-a2cf-41e8-807c-a824ebff67a9"}
 */
function ACTION_cancel()
{

/*
 *	TITLE    :	ACTION_cancel
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	 
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//not already ok to close, cancel
if (!globals.CODE_hide_form) {
	//rollback edited records
	databaseManager.rollbackEditedRecords()
	
	//turn autosave back on
	databaseManager.setAutoSave(true)
	
	//enable the filter place
	forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L_action_item_filter__custom.TOGGLE_readonly(false)
	
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	application.closeFormDialog('filterValuelist')
}
}

/**
 *
 * @properties={typeid:24,uuid:"8e8c634e-236a-425c-9c31-6cf3f8ccdfe0"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	 
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (globals.NAV_filter_column && globals.NAV_filter_operator && globals.NAV_filter_relation && globals.NAV_filter_value && globals.NAV_filter_valuelist) {
	//get correct form based on currently selected tab
	switch (globals.NAV_filter_level) {
		case 1:
			var formName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L'
			break
		case 2:
			var formName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L__sub1'
			break
		case 3:
			var formName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L__sub2'
			break
	}
		
	//check for existing records, prompt to delete
	if (forms[formName].foundset.getSize()) {
		var answer = plugins.dialogs.showQuestionDialog('Delete filters','There are existing filters in the current list.  Delete?','Yes','No')
		if (answer == 'Yes') {
			//call to delete records from backend; can be replace with standard deleteAllRecords in the future
			forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter.ACTIONS_list_control('Delete all items','Yes')
		}
	}
	
	//allow method to run
	var proceed = true
	
	//get valuelist items
	var valuelist = application.getValueListItems(globals.NAV_filter_valuelist)
	var valuelistDisplay = valuelist.getColumnAsArray(1)
	var valuelistReal = valuelist.getColumnAsArray(2)
	
	if (valuelistDisplay.length > 30 && valuelistDisplay.length <= 100) {
		var answer = plugins.dialogs.showWarningDialog('Many items','The resulting filter list will be quite long.  Proceed?','Yes','No')
		if (answer != 'Yes') {
			proceed = false
		}
	}
	else if (valuelistDisplay.length > 100) {
		plugins.dialogs.showErrorDialog('Too many items','The valuelist you have chosen has over 100 entries.  Unable to proceed.')
		proceed = false
	}
	
	if (proceed) {
		//create filter items
		for (var i = 0; i < valuelistDisplay.length; i++) {
			if (valuelistReal[i] != null) {
				//create new menu item record
				forms[formName].REC_new()
				forms[formName].menu_name = valuelistDisplay[i]
				
				//create new spec record
				var record = forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L_action_item_filter__custom.REC_new(true)
				
				record.column_name = globals.NAV_filter_column
				record.column_operator = globals.NAV_filter_operator
				record.column_relation = globals.NAV_filter_relation
				record.column_value = (globals.NAV_filter_value == 'Stored') ? valuelistReal[i] : valuelistDisplay[i]
				record.filter_type = 'Value'
			}
		}
	}
	
	databaseManager.saveData()
	
	//turn autosave back on
	databaseManager.setAutoSave(true)
	
	//enable closing the form
	globals.CODE_hide_form = 1
	
	//close the form
	application.closeFormDialog('filterValuelist')
	
	forms[formName].REC_on_select()
}
else {
	plugins.dialogs.showErrorDialog('Not enough data', 'You must fill out all of the fields in order to create a valuelist','OK')
}
}

/**
 *
 * @properties={typeid:24,uuid:"8fe80745-85c3-420e-a684-2ca94debf80f"}
 */
function FLD_data_change__column_relation()
{

/*
 *	TITLE    :	FLD_data_change__column_relation
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	gets columns for currently selected relation
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'NAV_0L_navigation_item_1L'
var formLoad = forms[formName].form_to_load
var tableReln = globals.NAV_filter_relation

//check if form_to_load is a valid entry
if (!forms[formLoad] || tableReln == '-') {
	var aColumnName = new Array()
}
else {
	//a relation has been chosen
	//base table
	if (!tableReln || tableReln == forms[formName].form_to_load_table) {
		var tableName = forms[formLoad].controller.getTableName()
		var serverName = forms[formLoad].controller.getServerName()
	}
	//relation
	else {
		var tableName = forms[formLoad][tableReln].getTableName()
		var serverName = forms[formLoad][tableReln].getServerName()
	}
	
	//get sorted array of columnNames from backend
	var jsTable = databaseManager.getTable(serverName, tableName)
	var aColumnName = jsTable.getColumnNames()
	aColumnName.sort()
	
	/*
	var columnNames = new Array()
	for ( var i = 0 ; i < aColumnName.length ; i++ ) {
		var jsColumn = jsTable.getColumn(aColumnName[i])
		var columnInfo = new Object()
		
		columnInfo['nameColumn'] = jsColumn.getSQLName().toLowerCase() //format as lower case
		columnInfo['typeColumn'] = jsColumn.getTypeAsString().toUpperCase() //format as upper case
		
		columnNames[i] = columnInfo
	}
	globals.CODE_ddarray_field = 'nameColumn'
	columnNames.sort(globals.CODE_sort_dd_array)
	*/
}

//set valuelist
application.setValueListItems('NAV_filter_columns', aColumnName)
}

/**
 *
 * @properties={typeid:24,uuid:"c17697ec-9010-43c3-9452-38c4b0a83459"}
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
 * @properties={typeid:24,uuid:"b4e1d02f-87e9-4320-87cd-96d315c81616"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	gets columns for currently selected relation, set up form based on filter_type
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//disable closing the form
globals.CODE_hide_form = 0

//get all valuelists
var valueList = application.getValueListNames()
application.setValueListItems('NAV_valuelist_all',valueList)

//clear all globals
globals.NAV_filter_column = null
globals.NAV_filter_operator = '='
globals.NAV_filter_relation = forms.NAV_0L_navigation_item_1L.form_to_load_table
globals.NAV_filter_value = 'Stored'
globals.NAV_filter_valuelist = null

//populate columns list
FLD_data_change__column_relation()
}
