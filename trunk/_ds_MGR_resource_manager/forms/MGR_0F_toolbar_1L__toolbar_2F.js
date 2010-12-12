/**
 *
 * @properties={typeid:24,uuid:"721E4A10-0BB4-47AC-BBA8-8680EAF9910C"}
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
 * @properties={typeid:24,uuid:"5A643AC0-1187-4BD2-A2B0-58942FB272BD"}
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
 * @properties={typeid:24,uuid:"24F79A50-0CBD-4752-9D22-2B74C2A9FF6C"}
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
 * @properties={typeid:24,uuid:"9EC9F24B-7F3C-4AD8-BD1D-8C68B627D465"}
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
 * @properties={typeid:24,uuid:"D449F72C-3CEE-4AF6-89BD-4F1EB88B6239"}
 */
function FORM_on_show()
{

//set preview size to be accurate of current window dimensions
if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase
	
	var width = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getWidth()
	
	elements.header_preview.setSize(width + 60, elements.header_preview.getHeight())
	elements.tab_preview.setSize(width, elements.tab_preview.getHeight())
	elements.gfx_tool_center.setSize(width - 12,elements.gfx_tool_center.getHeight())
	elements.gfx_tool_right.setLocation(elements.gfx_tool_center.getLocationX() + elements.gfx_tool_center.getWidth(),elements.gfx_tool_right.getLocationY())
}

//set grid line to be same size as preview
elements.grid_preview_1.setSize(elements.header_preview.getWidth() + 1 + elements.lbl_tab_name.getWidth() + 20, elements.grid_preview_1.getHeight())

}

/**
 *
 * @properties={typeid:24,uuid:"1A487E2C-FF3E-47A0-ADB5-ADAFA18D4561"}
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
}

/**
 *
 * @properties={typeid:24,uuid:"90F22732-107D-45FB-A263-3E416BAEDB8B"}
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
 * @properties={typeid:24,uuid:"14746999-561C-434F-B1B9-E1D8951BD822"}
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
elements.grid_preview_1.visible = showPreview
elements.grid_preview_2.visible = showPreview
elements.header_preview.visible = showPreview
elements.tab_preview.visible = showPreview


}
