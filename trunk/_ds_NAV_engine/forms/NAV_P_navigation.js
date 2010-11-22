/**
 *
 * @properties={typeid:24,uuid:"6f1ff0d0-5423-49d3-ae6c-bb6f3fb233e5"}
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
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	//clear all globals
	globals.NAV_importexport_areas = null
	globals.NAV_export_navset = null
	globals.NAV_import_navset = null
	globals.NAV_export_access = null
	globals.NAV_import_access = null
	
	application.closeFormDialog('fwImportExport')
}
}

/**
 *
 * @properties={typeid:24,uuid:"00b993c5-7bd6-4a7a-b57f-4190d7a42907"}
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

if (globals.NAV_export_navset || globals.NAV_import_navset || globals.NAV_export_access || globals.NAV_import_access || globals.NAV_importexport_areas) {
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	//clear out toggle all global
	globals.NAV_P_all = null
	
	application.closeFormDialog('fwImportExport')
}
else {
	plugins.dialogs.showErrorDialog('Nothing selected', 'You must choose something','OK')
}
}

/**
 *
 * @properties={typeid:24,uuid:"2e5d0fbb-da9e-40ea-9fdf-d202d9f8d5f0"}
 */
function ACTION_toggle_flags()
{

/*
 *	TITLE    :	ACTION_toggle_flags
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	toggle flag_chosen field in FID
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	June 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//which things to import
if (elements.fld_what.visible) {
	var elem = 'fld_what'
}
//which sets to import
else if (elements.fld_import_navset.visible) {
	var elem = 'fld_import_navset'
}
//which sets to export
else if (elements.fld_export_navset.visible) {
	var elem = 'fld_export_navset'
}
//which groups to import
else if (elements.fld_import_access.visible) {
	var elem = 'fld_import_access'
}
//which groups to export
else if (elements.fld_export_access.visible) {
	var elem = 'fld_export_access'
}

var valueLists = elements[elem].getValueListName()
var global = elements[elem].getDataProviderID().split('.')[1]

//toggle logic
if (globals.NAV_P_all) {
	//toggle on
	var listItems = application.getValueListArray(valueLists)
	globals[global] = ''
	for (var i in listItems) {
		globals[global] += listItems[i] + '\n'
	}
}
else {
	//toggle off
	globals[global] = null
}

}

/**
 *
 * @properties={typeid:24,uuid:"00ec06d6-aa78-48a5-b14c-6ad8484b76bf"}
 */
function FLD_data_change__navset_flag()
{


var allValues = globals.NAV_import_navset_flag.split('\n')

var count = 0
for (var i = 0; i < allValues.length; i++) {
	if (allValues[i] == '<html><body>&nbsp;</body></html>') {
		count++
	}
}

if (count > 1) {
	plugins.dialogs.showErrorDialog( dialog_title,  msg,  button1,  [button2],  [buttonN])
}
}

/**
 *
 * @properties={typeid:24,uuid:"a13b5fd5-44f6-4398-a5d5-25d545b8b9a9"}
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

//clear all globals
globals.NAV_importexport_areas = null
globals.NAV_export_navset = null
globals.NAV_import_navset = null
globals.NAV_export_access = null
globals.NAV_import_access = null
globals.NAV_P_all = null
}
