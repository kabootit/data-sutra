/**
 *
 * @properties={typeid:24,uuid:"9A7014D3-E4C7-4417-BB1C-B4346AA45035"}
 */
function CLEAR_custom_list()
{
list_to_load = null
databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"9B15CC4E-D0F2-4668-BB93-45B57BA05D97"}
 */
function CLEAR_default_space()
{
space_default = null
databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"6022A030-166C-4BDE-8949-D3C734F92B15"}
 */
function CLEAR_space_method()
{
space_method = null
databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"89D19203-EBFF-4280-8F7A-4559888FAFA3"}
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
if (application.__parent__.solutionPrefs && foundset.getSize() && module_filter) {
	//get from repository via queries way
	if (!solutionPrefs.repository.api && solutionPrefs.repository.allForms) {
		
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

formNames = formNames.sort()

//set valuelist
application.setValueListItems('NAV_current_module_forms', formNames)

}

/**
 *
 * @properties={typeid:24,uuid:"4EB40797-4DC9-4152-80E0-DE7E50B4F225"}
 */
function FLD_data_change__form_to_load()
{

databaseManager.saveData()

forms.NAV_0F_navigation_item_1F__detail.GET_table_columns()

REC_on_select()

forms.NAV_0F_navigation_item.REC_on_select()

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
databaseManager.saveData()

}

/**
 *
 * @properties={typeid:24,uuid:"C94DB874-61C5-42D1-A707-128B6C4B54F2"}
 */
function FLD_data_change__module_filter()
{

FILTER_forms()

//null out if really changed
form_to_load = null


}

/**
 *
 * @properties={typeid:24,uuid:"6B764287-3F5B-49C6-9F21-F970794B51D0"}
 */
function FLD_data_change__space_available()
{

databaseManager.saveData()

SPACE_options()
}

/**
 *
 * @properties={typeid:24,uuid:"37F8637A-EFA7-4017-925A-96D1B937421F"}
 */
function FLD_data_change__use_fw_list()
{
databaseManager.saveData()

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
	
	//flag for this platform
	record.flag_platform = application.getValueListArray('NAV_platform').Desktop
	
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
 * @properties={typeid:24,uuid:"BA5D2A80-EECC-454C-A6BC-65EA0AABC85D"}
 */
function GOTO_form()
{

//check for value
if (form_to_load) {
	//check if exists in solution
	if (forms[form_to_load]) {
		forms[form_to_load].controller.show()
	}
	//display error message
	else {
		globals.DIALOGS.showErrorDialog('Form error',
			'<html><body>The workflow area, <font color="green">forms</font>.' + form_to_load + ',<br>' +
			'does not exist in this solution or any of its included modules.','OK')
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"06B6B9C1-631D-4E33-BADE-678CC3BBFC7F"}
 */
function SPACE_list()
{

/*
 *	TITLE    :	SPACE_list
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
 *	MODIFIED :	August 1, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//menu items
var menu = new Array(
	plugins.popupmenu.createMenuItem("Select all", SPACE_list_control),
	plugins.popupmenu.createMenuItem("Select none", SPACE_list_control),
	plugins.popupmenu.createMenuItem('-'),
	plugins.popupmenu.createMenuItem("Select normal views", SPACE_list_control),
	plugins.popupmenu.createMenuItem("Select flipped views", SPACE_list_control)
)

//set arguments
for ( var i = 0 ; i < menu.length ; i++ ) {
	menu[i].setMethodArguments(i)
	
	//disable dividers
	if (menu[i].getText() == '-') {
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
 * @properties={typeid:24,uuid:"9FFC07F4-80CB-4196-ABBD-39135627697A"}
 */
function SPACE_list_control()
{

/*
 *	TITLE    :	SPACE_control
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
 *	MODIFIED :	August 1, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch(arguments[0]) {
	case 0:
		space_available = '1\n10\n11\n12\n13\n14\n2\n3\n4\n5\n6\n7\n8\n9'
		break
	case 1:
		space_available = null
		break
	case 3:
		space_available = '1\n2\n3\n4\n5\n6\n7'
		break
	case 4:
		space_available = '10\n11\n12\n13\n14\n8\n9'
		break

}

databaseManager.saveData()

SPACE_options()
}

/**
 *
 * @properties={typeid:24,uuid:"2BA6CFC5-8905-47FA-8D6B-DD961AD7D039"}
 */
function SPACE_options()
{
if (utils.hasRecords(foundset)) {
	if (space_available) {
		var availableSpaces = space_available.split('\n')
	}
	else {
		var availableSpaces = []
	}
	var arrayDisplay = []
	var arrayStored = []
	
	//convert to numbers so they'll sort
	for (var i = 0; i < availableSpaces.length; i++) {
		availableSpaces[i] = utils.stringToNumber(availableSpaces[i])
	}
	
	availableSpaces.sort(globals.CODE_sort_numeric)
	
	var foundInOptions = false
	
	for (var i = 0 ; i < availableSpaces.length ; i++) {
		arrayDisplay[i] = application.getValueListDisplayValue('NAV_space_type',availableSpaces[i])
		arrayStored[i] = availableSpaces[i]
		
		if (space_default == availableSpaces[i]) {
			foundInOptions = true
		}
	}
	
	application.setValueListItems('NAV_space_choice',arrayDisplay,arrayStored)
	
	//clear default if it is no longer an option
	if (!foundInOptions) {
		space_default = null
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"E1D4F0EC-9526-4174-9FD5-EDBCDF09EE26"}
 */
function SHOW_sort()
{

//show sort picker if form available
if (form_to_load && forms[form_to_load]) {
	//globals.DIALOGS.showInfoDialog('Choose sort','<html>1- Specify the desired sort<br>2- Press the COPY button<br>3- Close the sort chooser')
	application.setClipboardContent('')
	forms[form_to_load].controller.sortDialog(fw_sort_string)
	var clip = application.getClipboardString()
	if (clip) {
		sort_string = clip
		databaseManager.saveData()
	}
}
else {
	globals.DIALOGS.showErrorDialog('Form error','The workflow form specified does not exist')
}


}

/**
 *
 * @properties={typeid:24,uuid:"4A495CD9-0A2D-462A-88B5-C373637DAF40"}
 */
function REC_on_select()
{

//enable/disable elements
if (form_to_load) {
	elements.fld_use_fw_list.enabled = true
	
	elements.btn_goto_form.enabled = true
	
	if (forms[form_to_load]) {
		elements.btn_sort_string.enabled = true
	}
	else {
		elements.btn_sort_string.enabled = false
	}
}
else {
	elements.btn_goto_form.enabled = false
	elements.fld_use_fw_list.enabled = false
	elements.btn_sort_string.enabled = false
	if (utils.hasRecords(foundset)) {
		use_fw_list = 0
	}
	databaseManager.saveData()
}

var useFWList = (use_fw_list) ? true : false

if (useFWList) {
	elements.lbl_list_title.text = 'List title'
	elements.fld_custom_list.visible = false
	elements.fld_list_title.visible = true
	elements.btn_custom_list.visible = false
	
	elements.fld_favoritbale.enabled = true
	elements.lbl_favoritable_2.transparent = true
}
else {
	elements.lbl_list_title.text = 'List area'
	elements.fld_custom_list.visible = true
	elements.fld_list_title.visible = false
	elements.btn_custom_list.visible = true
	
	elements.fld_favoritbale.enabled = false
	elements.lbl_favoritable_2.transparent = false
}

//load appropriate form valuelist
FILTER_forms()

//set options for spaces
SPACE_options()




}

/**
 *
 * @properties={typeid:24,uuid:"0252f55e-958d-424b-9d97-a4388f7aa3e7"}
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
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"503739E5-9E23-412F-A8EB-6618561C48B0"}
 */
function FLD_data_change__sort_string() {

	databaseManager.saveData()
	
	var formSort = (form_to_load && forms[form_to_load]) ? forms[form_to_load].foundset.getCurrentSort() : 'ERROR! Workflow form not present'
	var newSort = sort_string
	
	if (newSort != '') {
		sort_string = newSort
	}
	else {
		sort_string = formSort
	}
	
	databaseManager.saveData()

}
