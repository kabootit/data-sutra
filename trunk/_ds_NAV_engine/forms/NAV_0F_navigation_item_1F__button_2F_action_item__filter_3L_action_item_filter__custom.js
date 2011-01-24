/**
 *
 * @properties={typeid:24,uuid:"35ca5cc3-628f-4f5d-b40b-6705d2460974"}
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
 * @properties={typeid:24,uuid:"440335d2-6a12-4cd3-8444-4abb303b5155"}
 */
function REC_delete()
{

var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')

if (delRec == 'Yes') {
	controller.deleteRecord()
}
}

/**
 *
 * @properties={typeid:24,uuid:"87a64fe2-eb1f-4e91-ad2e-2aff6f01aeb8"}
 */
function REC_edit()
{

/*
 *	TITLE    :	REC_edit
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	open form in dialog
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

forms.NAV_P_action_item_filter.controller.find()
forms.NAV_P_action_item_filter.id_action_item_filter = id_action_item_filter
forms.NAV_P_action_item_filter.controller.search()

//turn autosave off
databaseManager.setAutoSave(false)

//enable cancelling
forms.NAV_P_action_item_filter.elements.btn_cancel.visible = true

application.showFormInDialog(forms.NAV_P_action_item_filter,-1,-1,-1,-1,'Edit',false,false,'filterDetails')
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"5caf2221-192a-41d5-adb4-97f25508675f"}
 */
function REC_new(event)
{
	
//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
var noPopup = arguments[0]

//create new action filter item through appropriate relation
var formName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter'
var relnMain = 'nav_action_item_to_action_item__main'
var relnSub1 = 'nav_action_item_to_action_item__sub1'
var relnSub2 = 'nav_action_item_to_action_item__sub2'

//create record
var record = foundset.getRecord(foundset.newRecord(false,true))

//scope id to currently selected list
switch (globals.NAV_filter_level) {
	case 1:
		id_action_item = forms[formName][relnMain].id_action_item
		break
	case 2:
		id_action_item = forms[formName][relnSub1].id_action_item
		break
	case 3:
		id_action_item = forms[formName][relnSub2].id_action_item
		break
		
}

//default location of relation is base table
column_relation = forms.NAV_0L_navigation_item_1L.form_to_load_table
//default is value
filter_type = 'Value'

databaseManager.saveData()

//show dialog, default behavior
if (!noPopup) {
	forms.NAV_P_action_item_filter.controller.find()
	forms.NAV_P_action_item_filter.id_action_item_filter = id_action_item_filter
	forms.NAV_P_action_item_filter.controller.search()
	
	//disable cancelling
	forms.NAV_P_action_item_filter.elements.btn_cancel.visible = false
	
	application.showFormInDialog(forms.NAV_P_action_item_filter,-1,-1,-1,-1,'New filter',false,false,'filterDetails')
}
//return record object for additional processing
else {
	return record
}


}

/**
 *
 * @properties={typeid:24,uuid:"29e843c4-503d-47ef-8e38-2e6d28b662cc"}
 */
function SHOW_sort()
{

//show sort picker if form available
if (nav_action_item_filter_to_action_item && nav_action_item_filter_to_action_item.nav_action_item_to_navigation_item) {
	var formName = nav_action_item_filter_to_action_item.nav_action_item_to_navigation_item.form_to_load
	if (forms[formName]) {
		plugins.dialogs.showInfoDialog('Choose sort','<html>1- Specify the desired sort<br>2- Press the COPY button<br>3- Close the sort chooser')
		application.setClipboardContent('')
		forms[formName].controller.sortDialog(nav_action_item_filter_to_action_item.filter_sort)
		var clip = application.getClipboardString()
		if (clip) {
			nav_action_item_filter_to_action_item.filter_sort = clip
			databaseManager.saveData()
		}
	}
	else {
		plugins.dialogs.showErrorDialog('Form error','The workflow form specified does not exist')
	}
}

}

/**
 *
 * @properties={typeid:24,uuid:"6dacf6b8-7f6c-4bcf-8c25-42b4b0454013"}
 */
function TOGGLE_readonly()
{

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var readOnly = arguments[0]

var formName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter'
var relnMain = 'nav_action_item_to_action_item__main'
var relnSub1 = 'nav_action_item_to_action_item__sub1'
var relnSub2 = 'nav_action_item_to_action_item__sub2'

//scope id to currently selected list
switch (globals.NAV_filter_level) {
	case 1:
		var fsSize = (forms[formName].foundset.getSize()) ? forms[formName][relnMain].getSize() : 0
		break
	case 2:
		var fsSize = (forms[formName].foundset.getSize()) ? forms[formName][relnSub1].getSize() : 0
		break
	case 3:
		var fsSize = (forms[formName].foundset.getSize()) ? forms[formName][relnSub2].getSize() : 0
		break
}

//show blank tab in detail area
if (readOnly) {
	forms[formName].elements.tab_detail.tabIndex = 4
	//controller.enabled = false
}
//show list in detail area
else if (fsSize) {
	forms[formName].elements.tab_detail.tabIndex = 1
	//controller.enabled = true
}
}
