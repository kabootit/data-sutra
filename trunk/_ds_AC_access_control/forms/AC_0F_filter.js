/**
 *
 * @properties={typeid:24,uuid:"016b2d63-79c4-4dcd-8d89-1b9d4fc2986d"}
 */
function ACTION_toggle_flags()
{

/*
 *	TITLE    :	ACTION_toggle_flags
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle filter_on field
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	September 22, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (elements.tab_detail.tabIndex == 1) {
	var formName = 'AC_0F_filter_1L__table'
	var relnName = 'ac_access_filter_to_access_filter__database'
	var filterType = (forms[formName][relnName]) ? forms[formName][relnName].total_active : 0
}
else if (elements.tab_detail.tabIndex == 2) {
	var formName = 'AC_0F_filter_1L__database'
	var relnName = 'ac_access_filter_to_access_filter__table'
	var filterType = (forms[formName][relnName]) ? forms[formName][relnName].total_active : 0
}

//prompt to disable filters
if (filterType && globals.AC_filters_toggle) {
	forms[formName].FLD_data_change__filter_on(1)
}

//refresh filter status
databaseManager.recalculate(forms[formName][relnName])
filterType = (forms[formName][relnName]) ? forms[formName][relnName].total_active : 0

//check for active dbFilters
if (globals.AC_filters_toggle && !filterType) {
	var toggle = 1
}
else {
	var toggle = 0
	globals.AC_filters_toggle = toggle
}

//toggle
for ( var i = 0 ; i < foundset.getSize() ; i++ ) {
	var record = foundset.getRecord(i + 1)
	record.filter_on = toggle
}

application.updateUI()


}

/**
 *
 * @properties={typeid:24,uuid:"2931d200-4c99-4bd8-b169-2e612a94347b"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	load tooltips; init tab panel
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

globals.TRIGGER_tooltip_set()

globals.TAB_change_grid_init()
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"020803D8-D993-4224-8B0A-C1ED2EF3A3E8"}
 */
function FORM_on_show(firstShow, event) {
	var listTabForm = (solutionPrefs.config.webClient) ? forms.DATASUTRA_WEB_0F__list__universal : forms.DATASUTRA_0F_solution
	
	//turn list area off
//	listTabForm.elements.tab_content_B.tabIndex = 1
}
