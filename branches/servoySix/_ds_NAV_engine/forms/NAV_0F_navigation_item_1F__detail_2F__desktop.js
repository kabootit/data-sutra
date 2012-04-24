/**
 *
 * @properties={typeid:24,uuid:"5d44ad48-9f35-4647-95e4-e229bf35c4a9"}
 */
function CLEAR_custom_list()
{
list_to_load = null
databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"fd0e18c7-3f1a-4bd2-a593-8a9fca630757"}
 */
function CLEAR_default_space()
{
space_default = null
databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"0d53324c-05d4-4bb9-88d7-cdb9eb371feb"}
 */
function CLEAR_space_method()
{
space_method = null
databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"d2c9fdca-3d8b-416e-87a9-44c53f1fd52f"}
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
 * @properties={typeid:24,uuid:"91bad264-dc94-490e-a999-98c651b3ce1b"}
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
 * @properties={typeid:24,uuid:"176c7d10-5764-4ada-af9f-67811b454972"}
 */
function FLD_data_change__module_filter()
{

FILTER_forms()

//null out if really changed
form_to_load = null


}

/**
 *
 * @properties={typeid:24,uuid:"fcca2dc6-0684-4ab0-9df3-f0eef12bfced"}
 */
function FLD_data_change__space_available()
{

databaseManager.saveData()

SPACE_options()
}

/**
 *
 * @properties={typeid:24,uuid:"c2e4b77f-f2c7-4d54-96c5-a6236bbe044a"}
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
 * @properties={typeid:24,uuid:"9c42672f-8b35-43c7-8da5-0d9b418a0d56"}
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
		plugins.dialogs.showErrorDialog('Form error',
			'<html><body>The workflow area, <font color="green">forms</font>.' + form_to_load + ',<br>' +
			'does not exist in this solution or any of its included modules.','OK')
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"de99c6a5-9808-40fc-9945-191831d36e73"}
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
 * @properties={typeid:24,uuid:"828054b3-3181-485a-a28b-7f438f042c5f"}
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
 * @properties={typeid:24,uuid:"60330ba1-8406-409a-b8c9-e33a638b448d"}
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
 * @properties={typeid:24,uuid:"cb68f7a5-5d37-4c7b-8e22-6389d17a5a7d"}
 */
function SHOW_sort()
{

//show sort picker if form available
if (form_to_load && forms[form_to_load]) {
	//plugins.dialogs.showInfoDialog('Choose sort','<html>1- Specify the desired sort<br>2- Press the COPY button<br>3- Close the sort chooser')
	application.setClipboardContent('')
	forms[form_to_load].controller.sortDialog(fw_sort_string)
	var clip = application.getClipboardString()
	if (clip) {
		sort_string = clip
		databaseManager.saveData()
	}
}
else {
	plugins.dialogs.showErrorDialog('Form error','The workflow form specified does not exist')
}


}

/**
 *
 * @properties={typeid:24,uuid:"88b40dc3-1a45-4ade-99ee-7635c9af5185"}
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
