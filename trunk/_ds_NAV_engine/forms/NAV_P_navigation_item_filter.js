/**
 *
 * @properties={typeid:24,uuid:"699d7244-c0a8-41f5-b517-868fb20ba585"}
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
 *	MODIFIED :	Jan 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */
//not already ok to close, cancel
if (!globals.CODE_hide_form) {
	//rollback edited records
	databaseManager.rollbackEditedRecords()
	
	//turn autosave back on
	databaseManager.setAutoSave(true)
	
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	application.closeFormDialog('navitemFilterDetails')
}
}

/**
 *
 * @properties={typeid:24,uuid:"7529a945-5e0c-496b-a7c4-45f65926ad67"}
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
 *	MODIFIED :	Jan 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

//turn autosave back on
databaseManager.setAutoSave(true)

//enaable closing the form
globals.CODE_hide_form = 1

application.closeFormDialog('navitemFilterDetails')
}

/**
 *
 * @properties={typeid:24,uuid:"8202432d-9321-409a-911d-8941b9888202"}
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
var tableReln = (foundset.getSize()) ? column_relation : null

//check if form_to_load is a valid entry
if (!forms[formLoad] || tableReln == '----') {
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
 * @properties={typeid:24,uuid:"b159e4d6-0ff7-402b-ad38-b0fca3c355ca"}
 */
function FLD_data_change__filter_type()
{

/*
 *	TITLE    :	FLD_data_change__filter_type
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	show/hide entry values depending on filter type
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

switch (filter_type) {
	case 'Value':
		elements.lbl_method_name.visible = false
		elements.fld_method_name.visible = false
		elements.lbl_column_value.visible = true
		elements.fld_column_value.visible = true
		
		elements.lbl_column_value.text = 'Value'
		
		elements.lbl_column_value.setLocation(10,170)
		elements.fld_column_value.setLocation(10,188)
		elements.fld_column_value.setSize(elements.lbl_size.getWidth()-20,22)
		break
	case 'Function':
		elements.lbl_method_name.visible = true
		elements.fld_method_name.visible = true
		elements.lbl_column_value.visible = true
		elements.fld_column_value.visible = true
		
		elements.lbl_column_value.text = 'Argument'
		
		elements.lbl_column_value.setLocation(elements.lbl_size.getWidth()-80,170)
		elements.fld_column_value.setLocation(elements.lbl_size.getWidth()-80,188)
		elements.fld_column_value.setSize(70,22)
		break
	default:
		elements.lbl_method_name.visible = false
		elements.fld_method_name.visible = false
		elements.lbl_column_value.visible = false
		elements.fld_column_value.visible = false
		break
}
}

/**
 *
 * @properties={typeid:24,uuid:"01c3f7db-7524-4ebd-b353-06487d343de4"}
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
}

/**
 *
 * @properties={typeid:24,uuid:"41ca1287-0e96-47b0-99d7-7adb126ea0bd"}
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

//set up basics
FLD_data_change__column_relation()
FLD_data_change__filter_type()

//elements.fld_column_relation.requestFocus(false)
}
