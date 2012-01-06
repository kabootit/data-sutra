/**
 *
 * @properties={typeid:24,uuid:"ffed9146-7a49-419c-8071-93c1eb60924e"}
 */
function CLEAR_custom_list()
{


list_to_load = null


}

/**
 *
 * @properties={typeid:24,uuid:"75d27e14-d747-4de5-9b2f-daf76b8649eb"}
 */
function FILTER_forms()
{

/*
 *	TITLE    :	FILTER_forms
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	set valuelist with names of forms available
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FILTER_forms()
 *			  	
 *	MODIFIED :	March 23, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//only show forms from selected module when in top level form
if (application.__parent__.solutionPrefs && foundset.getSize() && module_filter) {
	//get from repository via queries way
	if (!solutionPrefs.repository.api) {
		//load formNames for report module
		var moduleForms = solutionPrefs.repository.allForms[module_filter]
		var formNames = new Array()
		var j = 0
		
		//check to make sure module_filter has a loaded value (they chose something)
		if (moduleForms) {
			for (var i in moduleForms) {
				formNames[j++] = moduleForms[i].formName
			}
			//save current value to global to prepopulate newly created records
			globals.NAV_module_filter = module_filter
		}
	}
	//get from the workspace
	else if (solutionPrefs.repository.workspace) {
		var moduleForms = solutionPrefs.repository.workspace[module_filter]
	
		var formNames = new Array()
		var j = 0
		
		if (moduleForms) { //check to make sure module_filter has a loaded value (they chose something)
			for (var i in moduleForms) {
				formNames[j++] = i
			}
		}
	}
}
//when in navigation module alone, show forms anyway
else {
	var formNames = forms.allnames
}

formNames = formNames.sort()

//set valuelist
application.setValueListItems('NAV_current_module_forms', formNames)

}

/**
 *
 * @properties={typeid:24,uuid:"b998dc7b-bde9-4d23-987e-506f8fb14618"}
 */
function FLD_data_change__form_to_load()
{


GET_table_columns()

REC_on_select()

//do sort string stuff
if (sort_string) {
	fw_sort_string = sort_string
}
else {
	if (form_to_load && forms[form_to_load]) {
		fw_sort_string =  forms[form_to_load].foundset.getCurrentSort()
	}
	else {
		fw_sort_string = 'ERROR! Workflow form not present'
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"71f8c755-2210-40df-a121-2afe3d0b0567"}
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

var itemID = item_id

var navItems = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation_item')
navItems.find()
navItems.item_id = itemID
var results = navItems.search()

if (results > 1 && itemID != '' && itemID != null) {
	item_id = null
	
	plugins.dialogs.showErrorDialog(
				'Error',
				'This registry is not unique.  Another navigation item\nalready has this one. Please choose a new registry',
				'OK')

	elements.fld_item_id.requestFocus(false)
}
}

/**
 *
 * @properties={typeid:24,uuid:"90b0a3a4-8bdd-4a75-8c55-e0863ff9f1ad"}
 */
function FLD_data_change__use_fw_list()
{

REC_on_select()

var relnDisplay = nav_navigation_item_to_list_display

//create display and display item if none present
if (!utils.hasRecords(relnDisplay) && use_fw_list) {
	var displayDefault = false
	
	if (!relnDisplay.getSize()) {
		displayDefault = true
	}
	
	var record = relnDisplay.getRecord(relnDisplay.newRecord(false,true))
	
	if (displayDefault) {
		record.display_default = 1
	}
	record.row_order = relnDisplay.getSize()
}

//pre-fill if not already filled in
if (use_fw_list && !fw_list_title) {
	fw_list_title = item_name
	elements.fld_list_title.caretPosition = (fw_list_title) ? fw_list_title.length : 0
	elements.fld_list_title.requestFocus()
}
}

/**
 *
 * @properties={typeid:24,uuid:"b6132f83-185d-42cd-bf35-dcbe9e0c3359"}
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
//if (application.getSolutionName() != 'ds_NAV_engine') {
//	forms.NAV_0L_navigation_item.UPDATE_table_columns()
//}

}

/**
 *
 * @properties={typeid:24,uuid:"dda2c112-bcf0-493b-8712-d3d3c282fe46"}
 */
function REC_on_select()
{

//enable/disable elements
if (form_to_load) {
	elements.fld_use_fw_list.enabled = true
	
//	elements.btn_goto_form.enabled = true
}
else {
//	elements.btn_goto_form.enabled = false
	elements.fld_use_fw_list.enabled = false

	use_fw_list = 0
}

var useFWList = (use_fw_list) ? true : false

if (useFWList) {
	elements.lbl_list_title.text = 'List title'
	elements.fld_custom_list.visible = false
	elements.fld_list_title.visible = true
	elements.btn_custom_list.visible = false
}
else {
	elements.lbl_list_title.text = 'List area'
	elements.fld_custom_list.visible = true
	elements.fld_list_title.visible = false
	elements.btn_custom_list.visible = true
}

//load appropriate form valuelist
FILTER_forms()




}
