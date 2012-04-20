/**
 *
 * @properties={typeid:24,uuid:"11E0705D-9D11-4364-8BF7-629DF4CDF0CB"}
 */
function CLEAR_custom_list()
{
phone_list = null
databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"D9F81DB7-0BCD-4168-84B7-5C063BF03EFF"}
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
if (application.__parent__.solutionPrefs && foundset.getSize() && phone_module) {
	//get from repository via queries way
	if (!solutionPrefs.repository.api && solutionPrefs.repository.allForms) {
		
		var moduleForms = solutionPrefs.repository.allForms[phone_module]
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
		var moduleForms = solutionPrefs.repository.workspace[phone_module]
	
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
 * @properties={typeid:24,uuid:"63C3ED89-2117-4A97-AD7C-6472209F2F83"}
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
 * @properties={typeid:24,uuid:"C14AA75A-EA99-4935-88A5-49BEDBE6FA50"}
 */
function FLD_data_change__module_filter()
{

FILTER_forms()

//null out if really changed
phone_form = null


}

/**
 *
 * @properties={typeid:24,uuid:"E528D414-529C-4401-94A2-D4D01FBF6302"}
 */
function FLD_data_change__use_fw_list()
{
databaseManager.saveData()

REC_on_select()

var relnDisplay = nav_navigation_item_to_list_display

//create display and display item if none present
if (!utils.hasRecords(relnDisplay) && phone_flag_ul) {
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
if (phone_flag_ul && !phone_list_title) {
	phone_list_title = item_name
	elements.fld_list_title.caretPosition = (phone_list_title) ? phone_list_title.length : 0
	elements.fld_list_title.requestFocus()
}
}

/**
 *
 * @properties={typeid:24,uuid:"DBAA6FC6-F31F-4FE8-AEA8-228747707394"}
 */
function GOTO_form()
{

//check for value
if (phone_form) {
	//check if exists in solution
	if (forms[phone_form]) {
		forms[phone_form].controller.show()
	}
	//display error message
	else {
		plugins.dialogs.showErrorDialog('Form error',
			'<html><body>The workflow area, <font color="green">forms</font>.' + phone_form + ',<br>' +
			'does not exist in this solution or any of its included modules.','OK')
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"011BF928-4E25-42A6-9870-56E5896A93B0"}
 */
function REC_on_select()
{

//enable/disable elements
if (phone_form) {
	elements.fld_use_fw_list.enabled = true
	
	elements.btn_goto_form.enabled = true
}
else {
	elements.btn_goto_form.enabled = false
	elements.fld_use_fw_list.enabled = false
	if (utils.hasRecords(foundset)) {
		phone_flag_ul = 0
	}
	databaseManager.saveData()
}

var useFWList = (phone_flag_ul) ? true : false

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
 * @properties={typeid:24,uuid:"4B4D3A1E-727F-4368-B90B-6D809BAA1023"}
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
