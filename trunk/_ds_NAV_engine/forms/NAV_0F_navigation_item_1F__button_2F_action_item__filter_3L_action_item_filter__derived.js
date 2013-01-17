/**
 *
 * @properties={typeid:24,uuid:"1f743a28-5ad3-48ea-ace3-7306ba803e35"}
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
 * @properties={typeid:24,uuid:"1eda67a4-0abe-4759-9272-fdc017b626d2"}
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

databaseManager.saveData()

switch (filter_type) {
	case 'Value':
		elements.lbl_method_name.visible = false
		elements.fld_method_name.visible = false
		elements.lbl_column_value.visible = true
		elements.fld_column_value.visible = true
		
		elements.lbl_column_value.text = 'Value'
		
		elements.lbl_column_value.setLocation(20,205)
		elements.fld_column_value.setLocation(20,223)
		elements.fld_column_value.setSize(elements.fld_filter_type.getWidth(),22)
		break
	case 'Function':
		elements.lbl_method_name.visible = true
		elements.fld_method_name.visible = true
		elements.lbl_column_value.visible = true
		elements.fld_column_value.visible = true
		
		elements.lbl_column_value.text = 'Argument'
		
		elements.lbl_column_value.setLocation(elements.fld_method_name.getWidth() + 30,205)
		elements.fld_column_value.setLocation(elements.fld_method_name.getWidth() + 30,223)
		elements.fld_column_value.setSize(90,22)
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
 * @properties={typeid:24,uuid:"3c122a46-37e1-4a6e-883d-4c3c31dbb634"}
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
 * @properties={typeid:24,uuid:"578235ac-eb44-4015-934e-2ef22e124861"}
 */
function FORM_on_show()
{



//get all valuelists
var valueList = application.getValueListNames()
application.setValueListItems('NAV_valuelist_all',valueList)

FLD_data_change__column_relation()
}

/**
 *
 * @properties={typeid:24,uuid:"53b01bea-968d-428a-a3d2-a218ffd40efd"}
 */
function SHOW_sort()
{

//show sort picker if form available
if (nav_action_item_filter_to_action_item && nav_action_item_filter_to_action_item.nav_action_item_to_navigation_item) {
	var formName = nav_action_item_filter_to_action_item.nav_action_item_to_navigation_item.form_to_load
	if (forms[formName]) {
		globals.DIALOGS.showInfoDialog('Choose sort','<html>1- Specify the desired sort<br>2- Press the COPY button<br>3- Close the sort chooser')
		application.setClipboardContent('')
		forms[formName].controller.sortDialog(nav_action_item_filter_to_action_item.filter_sort)
		var clip = application.getClipboardString()
		if (clip) {
			nav_action_item_filter_to_action_item.filter_sort = clip
			databaseManager.saveData()
		}
	}
	else {
		globals.DIALOGS.showErrorDialog('Form error','The workflow form specified does not exist')
	}
}

}
