/**
 *
 * @properties={typeid:24,uuid:"5E6F7A4D-9673-4993-908B-E02AA37861FF"}
 */
function CLEAR_custom_list()
{
tablet_list = null
databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"A3AED979-3626-42C4-9F6C-6A4489B63F62"}
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

//when in navigation module alone, show forms anyway
 var formNames = forms.allnames

//only show forms from selected module when in top level form
if (application.__parent__.solutionPrefs && foundset.getSize() && tablet_module) {
	//get from repository via queries way
	if (!solutionPrefs.repository.api && solutionPrefs.repository.allForms) {
		
		var moduleForms = solutionPrefs.repository.allForms[tablet_module]
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
		var moduleForms = solutionPrefs.repository.workspace[tablet_module]
	
		var formNames = new Array()
		var j = 0
		
		if (moduleForms) { //check to make sure module_filter has a loaded value (they chose something)
			for (var i in moduleForms) {
				formNames[j++] = i
			}
		}
	}
}

formNames = formNames.sort()

//set valuelist
application.setValueListItems('NAV_current_module_forms', formNames)

}

/**
 *
 * @properties={typeid:24,uuid:"0DD16B86-336D-4F54-B5FA-69F8EB39727D"}
 */
function FLD_data_change__form_to_load()
{

databaseManager.saveData()

//GET_table_columns()

REC_on_select()

forms.NAV_0F_navigation_item.REC_on_select()

databaseManager.saveData()

}

/**
 *
 * @properties={typeid:24,uuid:"8057ADE3-7CDA-4284-B7F9-C0F2B14D3F91"}
 */
function FLD_data_change__module_filter()
{

FILTER_forms()

//null out if really changed
tablet_form = null


}

/**
 *
 * @properties={typeid:24,uuid:"6764D15A-B8F2-4F17-936B-169E8E9D63BD"}
 */
function FLD_data_change__use_fw_list()
{
databaseManager.saveData()

REC_on_select()

var relnDisplay = nav_navigation_item_to_list_display

//create display and display item if none present
if (!utils.hasRecords(relnDisplay) && tablet_flag_ul) {
	var displayDefault = false
	
	if (!relnDisplay.getSize()) {
		displayDefault = true
	}
	
	var record = relnDisplay.getRecord(relnDisplay.newRecord(false,true))
	
	if (displayDefault) {
		record.display_default = 1
	}
	
	//flag for this platform
	record.flag_platform = application.getValueListArray('NAV_platform').Tablet
	
	record.row_order = relnDisplay.getSize()
}

//pre-fill if not already filled in
if (tablet_flag_ul && !tablet_list_title) {
	tablet_list_title = fw_list_title || item_name
	elements.fld_list_title.caretPosition = (tablet_list_title) ? tablet_list_title.length : 0
	elements.fld_list_title.requestFocus()
}
}

/**
 *
 * @properties={typeid:24,uuid:"3664D4A5-5A34-479B-8DC1-11B555ABAEBF"}
 */
function GOTO_form()
{

//check for value
if (tablet_form) {
	//check if exists in solution
	if (forms[tablet_form]) {
		forms[tablet_form].controller.show()
	}
	//display error message
	else {
		globals.DIALOGS.showErrorDialog('Form error',
			'<html><body>The workflow area, <font color="green">forms</font>.' + tablet_form + ',<br>' +
			'does not exist in this solution or any of its included modules.','OK')
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"25FE5EA3-CDBA-41A7-8F69-5EDDA8C7ED46"}
 */
function REC_on_select()
{

//enable/disable elements
if (tablet_form) {
	elements.fld_use_fw_list.enabled = true
	
	elements.btn_goto_form.enabled = true
}
else {
	elements.btn_goto_form.enabled = false
	elements.fld_use_fw_list.enabled = false
	if (utils.hasRecords(foundset)) {
		tablet_flag_ul = 0
	}
	databaseManager.saveData()
}

var useFWList = (tablet_flag_ul) ? true : false

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

/**
 *
 * @properties={typeid:24,uuid:"947DBB8B-47E4-4DBA-8AEC-2A8038B3BEDE"}
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
