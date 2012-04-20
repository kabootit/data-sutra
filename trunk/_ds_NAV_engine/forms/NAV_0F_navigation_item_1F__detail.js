/**
 *
 * @properties={typeid:24,uuid:"c4fd89e5-01d2-4e54-881b-eef9bf7a0511"}
 */
function ACTION_toggle_show()
{



var formName = 'NAV_0F_navigation_item_1F__detail'
var relationName = 'nav_navigation_item_to_navigation_item__children__all'

var status_children = (forms[formName][relationName].getSize() > 1)


if (status_children && node_2 == 0) {
	
	/**********
		if expanded
		this record: expanded = 0 and show = 1
		all child records: show = 0
	***********/
	
	relationName = 'nav_navigation_item_to_navigation_item__children'
	if (row_status_expanded) {
	
		//set status on sub records
		var fsUpdater = databaseManager.getFoundSetUpdater(forms[formName][relationName])
		fsUpdater.setColumn('row_status_show', 0)
		fsUpdater.performUpdate()
	
	
		//set status fields on selected record
		row_status_expanded = 0
		databaseManager.saveData()
	}	
	
}

}

/**
 *
 * @properties={typeid:24,uuid:"f16224e3-fda8-49a6-96d3-b2802748f060"}
 */
function FLD_data_change__initial_form()
{

/*
 *	TITLE    :	FLD_data_change__initial_form
 *			  	
 *	MODULE   :	ds_PREF_prefereces
 *			  	
 *	ABOUT    :	set a default label if blank
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__initial_form()
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if (initial_form && (initial_form_label == null || initial_form_label == '')) {
	initial_form_label = 'Loading...'
	databaseManager.saveData()
}
}

/**
 *
 * @properties={typeid:24,uuid:"c1edd38e-2026-48fe-b897-e4e980f433cf"}
 */
function FLD_data_change__initial_record()
{

/*
 *	TITLE    :	FLD_data_change__initial_record
 *			  	
 *	MODULE   :	ds_PREF_prefereces
 *			  	
 *	ABOUT    :	set a default label if blank
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__initial_form()
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if (initial_record && (initial_record_label == null || initial_record_label == '')) {
	initial_record_label = 'Loading...'
	databaseManager.saveData()
}
}

/**
 *
 * @properties={typeid:24,uuid:"75dbeb6a-e9fa-4382-908f-d066ce92e88d"}
 */
function FLD_data_change__item_id()
{

/*
 *	TITLE    :	FLD_data_change__item_id
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	makes sure that there is not another item with this registry already in existence
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__item_id()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

var navItems = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation_item')
navItems.find()
navItems.item_id = item_id
var results = navItems.search()

if (results > 1 && item_id != '' && item_id != null) {
//	item_id = null
//	databaseManager.saveData()
	plugins.dialogs.showWarningDialog(
				'Warning',
				'This registry is not unique.\nAnother navigation item already has this one',
				'OK')
	//elements.fld_item_id.requestFocus(false)
}
}

/**
 *
 * @properties={typeid:24,uuid:"86700eb8-2f9a-4e42-90c2-417231b551bc"}
 */
function FLD_data_change__item_name()
{
databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"0252f55e-958d-424b-9d97-a3388f7aa3e7"}
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
 * @properties={typeid:24,uuid:"e846c606-82a1-4215-a65e-1cef8166c6e0"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

}

/**
 *
 * @properties={typeid:24,uuid:"5e730367-4cda-4ec7-8e74-a0066fa26b40"}
 */
function GET_table_columns()
{

var relnColumns = nav_navigation_item_to_column

//there are column records for associated navigation_item
if (utils.hasRecords(relnColumns)) {
	//stop if old and new table names are the same
	if (forms[form_to_load].controller.getTableName() == form_to_load_table) {
		return
	}
	//delete all column records if old and new table names are different
	else {
		var answer = plugins.dialogs.showWarningDialog(
							'Delete columns',
							'<html>You have selected a form based on a different table.<br>' +
								'All of the named columns will be deleted.<br>' +
								'This will break any universal list displays or<br>' +
								'fast finds that have been set up.  Continue?',
							'Yes',
							'No'
						)
		
		if (answer == 'Yes') {
			relnColumns.deleteAllRecords()
		}
		else {
			return
		}
	}
}

form_to_load_table = forms[form_to_load].controller.getTableName()

//create new associated column records if 1) new table or 2) no table
if (application.getSolutionName() != 'ds_NAV_engine') {
	forms.NAV_0L_navigation_item.UPDATE_table_columns()
}

}

/**
 *
 * @properties={typeid:24,uuid:"e11f7dab-4e71-433b-a644-48369fc60105"}
 */
function REC_delete()
{

/*
 *	TITLE:		REC_delete
 *
 *	MODULE:		ds_NAV_navigation_standard
 *
 *	ABOUT:		Deletes current record
 *
 *	MODIFIED:	Aug 29, 2007 - Troy Elliott, Data Mosaic
 *
 */

var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this list display?','Yes','No')

var formName = 'NAV_0F_navigation_item_1F__detail'
var relnName = 'nav_navigation_item_to_list_display'

var defaultDisplay = false

if (delRec == 'Yes') {
	//check if selected record is default display
	if (forms[formName][relnName].display_default) {
		defaultDisplay = true
	}
	forms[formName][relnName].deleteRecord()
}

//de-activate universal list if no displays
if (!forms[formName][relnName].getSize()) {
	use_fw_list = 0
	REC_on_select()
}
//if deleted display was the default, set the currently selected one to be the default
else if (defaultDisplay) {
	forms[formName][relnName].display_default = 1
}
}

/**
 *
 * @properties={typeid:24,uuid:"d241a5fc-453c-4f16-981a-008859fde9ba"}
 */
function REC_new()
{

var formName = 'NAV_0F_navigation_item_1F__detail'
var relnName = 'nav_navigation_item_to_list_display'

var displayDefault = false

if (!forms[formName][relnName].getSize()) {
	displayDefault = true
}

forms[formName][relnName].newRecord(false,true)

if (displayDefault) {
	forms[formName][relnName].display_default = 1
}
forms[formName][relnName].row_order = forms[formName][relnName].getSize()

databaseManager.saveData()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"9AE97696-E355-4415-A001-1999F47652EA"}
 */
function TAB_change(event) {
	globals.TAB_change_grid(null,null,'tab_platform','tab_p')
	
	//update vl
	forms[elements.tab_platform.getTabFormNameAt(elements.tab_platform.tabIndex)].FILTER_forms()
}
