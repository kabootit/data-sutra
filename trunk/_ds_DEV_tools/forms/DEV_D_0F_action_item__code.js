/**
 *
 * @properties={typeid:24,uuid:"21d1cc8b-fef8-4919-a5a6-915ccd575aab"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	create new nav item representation
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_ok()
 *			  	
 *	MODIFIED :	February 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.DEV_rebuild_navitem(solutionPrefs.config.currentFormID)


}

/**
 *
 * @properties={typeid:24,uuid:"02493042-e121-4b75-8507-daf46455bf51"}
 */
function FLD_data_change__method_type()
{


forms.NAV_R_action_item__code.FLD_data_change__method_type(foundset.getRecord(foundset.getSelectedIndex()))

TOGGLE_elements()
}

/**
 *
 * @properties={typeid:24,uuid:"1b20ad38-acf8-4986-b41c-51f3bd7ee146"}
 */
function GET_action_record()
{

/*
 *	TITLE    :	GET_action_record
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	selected action for selected nav item
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	February 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	//find correct action_item
	var fsActionItem = foundset
	fsActionItem.clear()
	fsActionItem.find()
	fsActionItem.id_action_item = forms.DEV_0L_action_item__action.id_action_item
	var results = fsActionItem.search()
	
	return results
}
}

/**
 *
 * @properties={typeid:24,uuid:"4494baed-9349-4740-bf10-51231d967542"}
 */
function GET_add_record()
{

/*
 *	TITLE    :	GET_add_record
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	add action for selected nav item
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	February 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	//find correct action_item
	var fsActionItem = foundset
	fsActionItem.clear()
	fsActionItem.find()
	fsActionItem.id_navigation_item = solutionPrefs.config.currentFormID
	fsActionItem.category = 'Add'
	return fsActionItem.search()
}
}

/**
 *
 * @properties={typeid:24,uuid:"a334b6fc-8f94-4be4-81f2-e2d1e21ea3cb"}
 */
function REC_on_select()
{

if (utils.hasRecords(foundset)) {
	
	//update
	TOGGLE_elements()
	
	//get methods for current form, ----, globals
	var formName = (utils.hasRecords(nav_action_item_to_navigation_item)) ? nav_action_item_to_navigation_item.form_to_load : null
	var formMethods = (formName && forms[formName]) ? forms[formName].allmethods : new Array()
	var globalMethods = globals.allmethods
	
	for (var i = 0; i < globalMethods.length; i++) {
		globalMethods[i] = 'globals.'+globalMethods[i]
	}
	
	var shownMethods = formMethods
	var shownMethodsSaved = new Array()
	
	//show/hide divider
	if (formMethods.length && globalMethods.length) {
		shownMethods.push('----')
	}
	if (globalMethods.length) {
		if (shownMethods.length) {
			shownMethods = new Array().concat(shownMethods,globalMethods)
		}
		else {
			shownMethods = globalMethods
		}
	}
	
	for (var i = 0; i < shownMethods.length; i++) {
		if (i == '----') {
			shownMethodsSaved.push(null)
			continue
		}
		
		shownMethodsSaved.push(shownMethods[i] + '()')
	}
	
	application.setValueListItems('NAV_current_form_methods', shownMethods, shownMethodsSaved)

}
}

/**
 *
 * @properties={typeid:24,uuid:"35d2425c-a65c-4da9-9344-1b170cb51d6a"}
 */
function TOGGLE_elements()
{

/*
 *	TITLE    :	TOGGLE_elements
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	TOGGLE_elements()
 *			  	
 *	MODIFIED :	February 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (method_type == 'Method') {
	elements.lbl_method.text = 'Method name'
	
	elements.fld_method__eval.visible = false
	elements.fld_method__real.visible = true
}
else if (method_type == 'Custom code') {	
	elements.lbl_method.text = 'Code'
	
	elements.fld_method__eval.visible = true
	elements.fld_method__real.visible = false
}

//force user to select method_type before editing
if (method_type == null || method_type == '') {
	elements.fld_method__eval.enabled = false
	elements.fld_method__real.enabled = false
}
else {
	elements.fld_method__eval.enabled = true
	elements.fld_method__real.enabled = true
}
}
