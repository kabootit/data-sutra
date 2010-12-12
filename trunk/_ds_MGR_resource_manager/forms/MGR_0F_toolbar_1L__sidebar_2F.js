/**
 *
 * @properties={typeid:24,uuid:"A4F8895D-711B-47E7-89AB-379121A12159"}
 */
function FILTER_forms()
{

/*
 *	TITLE    :	FILTER_forms
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FILTER_forms()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//only run when inside frameworks
if (application.__parent__.solutionPrefs) {
	//load formNames for selected module
	if (!solutionPrefs.repository.api) {
		var moduleForms = solutionPrefs.repository.allForms[module_filter]
	}
	else {
		var moduleForms = solutionPrefs.repository.workspace[module_filter]
	}
	
	var formNames = new Array()
	var j = 0
	
	//check to make sure module_filter has a loaded value (they chose something)
	if (moduleForms) {
		for (var i in moduleForms) {
			//make sure that they cannot add this form
			if (controller.getName() != moduleForms[i].formName) {	
				formNames[j] = moduleForms[i].formName
				j++
			}
		}
	}
}
else {
	var formNames = forms.allnames
}

formNames = formNames.sort()

application.setValueListItems('MGR_toolbar_current_module_forms_a', formNames)

}

/**
 *
 * @properties={typeid:24,uuid:"6C2417E8-918E-45D4-82B4-A6B7B760C471"}
 */
function FILTER_forms_2()
{

/*
 *	TITLE    :	FILTER_forms
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FILTER_forms()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//only run when inside frameworks
if (application.__parent__.solutionPrefs) {
	//load formNames for selected module
	if (!solutionPrefs.repository.api) {
		var moduleForms = solutionPrefs.repository.allForms[module_filter_2]
	}
	else {
		var moduleForms = solutionPrefs.repository.workspace[module_filter_2]
	}
	
	var formNames = new Array()
	var j = 0
	
	//check to make sure module_filter has a loaded value (they chose something)
	if (moduleForms) {
		for (var i in moduleForms) {
			//make sure that they cannot add this form
			if (controller.getName() != moduleForms[i].formName) {	
				formNames[j] = moduleForms[i].formName
				j++
			}
		}
	}
}
else {
	var formNames = forms.allnames
}

formNames = formNames.sort()

application.setValueListItems('MGR_toolbar_current_module_forms_b', formNames)


}

/**
 *
 * @properties={typeid:24,uuid:"FD9D4D4F-878B-4239-B40A-9CCAE5134605"}
 */
function FILTER_methods()
{

/*
 *	TITLE    :	FILTER_methods
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FILTER_methods()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */


//get methods for current form, ----, globals
var formName = pop_down_form
var formMethods = (formName && forms[formName]) ? forms[formName].allmethods : new Array()
var globalMethods = globals.allmethods

for (var i = 0; i < globalMethods.length; i++) {
	globalMethods[i] = 'globals.'+globalMethods[i]
}

var shownMethods = formMethods
var shownMethodsSaved = new Array()

//show/hide divider
if (formMethods.length && globalMethods.length) {
	shownMethods.push('-')
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
	if (i == '-') {
		shownMethodsSaved.push(null)
		continue
	}
	
	shownMethodsSaved.push(shownMethods[i] + '()')
}

application.setValueListItems('MGR_toolbar_method_list', shownMethods, shownMethodsSaved)


}

/**
 *
 * @properties={typeid:24,uuid:"54385DCF-17F4-488C-8C04-E70ECD225EC5"}
 */
function FLD_data_change__pop_down_form()
{

/*
 *	TITLE    :	FLD_data_change__pop_down_form
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__pop_down_form()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get methods for current form, ----, globals
var formName = pop_down_form
var formMethods = (formName && forms[formName]) ? forms[formName].allmethods : new Array()
var globalMethods = globals.allmethods

for (var i = 0; i < globalMethods.length; i++) {
	globalMethods[i] = 'globals.'+globalMethods[i]
}

var shownMethods = formMethods
var shownMethodsSaved = new Array()

//show/hide divider
if (formMethods.length && globalMethods.length) {
	shownMethods.push('-')
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
	if (i == '-') {
		shownMethodsSaved.push(null)
		continue
	}
	
	shownMethodsSaved.push(shownMethods[i] + '()')
}

application.setValueListItems('MGR_toolbar_method_list', shownMethods, shownMethodsSaved)


}

/**
 *
 * @properties={typeid:24,uuid:"8F801055-38EF-4163-A02E-1474EC763DE8"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	set up everything for this record item
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_on_select()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//show preview if present
TOGGLE_tab_preview()

//show popdown fields if needed
TOGGLE_popdown_size()


//fill valuelists
FILTER_forms()
FILTER_forms_2()

FILTER_methods()

//set color gradient //MEMO: must have transparency set on form
TOGGLE_color()

}

/**
 * @properties={typeid:24,uuid:"D06F7A08-C212-4D14-A995-F8BA20EC207B"}
 */
function TOGGLE_color() {
	//do the color
	if (background_color) {
		elements.lbl_color.bgcolor = background_color
		elements.lbl_color.visible = true
	}
	else {
		elements.lbl_color.visible = false
	}
	
	//do the gradient
	if (flag_gradient) {
		elements.gfx_gradient.visible = true
	}
	else {
		elements.gfx_gradient.visible = false
	}
}

/**
 *
 * @properties={typeid:24,uuid:"395B0563-14DA-47A6-968A-D03F32BE1A60"}
 */
function TOGGLE_popdown_size()
{

/*
 *	TITLE    :	TOGGLE_popdown_size
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	TOGGLE_popdown_size()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (pop_down_show && !pop_down_autosize) {
	var showPops = true
}
else {
	var showPops = false
}

var autoSize = (pop_down_autosize) ? true : false

elements.fld_pop_down_width.visible = showPops
elements.grid_lbl_width.visible = showPops
elements.fld_pop_down_height.visible = showPops
elements.grid_lbl_height.visible = showPops

elements.grid_lbl_autosize.visible = !autoSize
elements.grid_autosize.visible = !autoSize
elements.grid_lbl_autosize_bottom.visible = autoSize
elements.grid_autosize_bottom.visible = autoSize

elements.grid_lbl_width.visible = !autoSize
elements.fld_pop_down_width.visible = !autoSize
elements.grid_lbl_height.visible = !autoSize
elements.fld_pop_down_height.visible = !autoSize

}

/**
 *
 * @properties={typeid:24,uuid:"5704434B-1384-4F39-80EC-F21866DE44D5"}
 */
function TOGGLE_tab_preview()
{

/*
 *	TITLE    :	TOGGLE_tab_preview
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	TOGGLE_tab_preview()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//show the preview pane
if (forms[form_name]) {
	var showPreview = true
	
	//load preview tab
	elements.tab_preview.removeAllTabs()
	elements.tab_preview.addTab(forms[form_name],form_name,form_name,null,null) //important not to label it tab_name so won't conflict with main area

}
else {
	var showPreview = false
}

//set visibility of preview stuff
elements.tab_preview.visible = showPreview


}
