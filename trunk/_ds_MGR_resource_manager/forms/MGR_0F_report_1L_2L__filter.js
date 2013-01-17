/**
 *
 * @properties={typeid:24,uuid:"D056C61D-E05C-4B98-A134-559D9861A48F"}
 * @AllowToRunInFind
 */
function ACTION_filter()
{

/*
 *	TITLE    :	ACTION_filter
 *			  	
 *	MODULE   :	rsrc_RPT_report
 *			  	
 *	ABOUT    :	do the filter
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_filter()
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'MGR_0F_report_1L_2L'

//find on filtered values
forms[formName].controller.find()

	if (globals.MGR_report_filter_description) {forms[formName].report_description = '%' + globals.MGR_report_filter_description + '%'}
	if (globals.MGR_report_filter_form) {forms[formName].report_form = '%' + globals.MGR_report_filter_form + '%'}
	if (globals.MGR_report_filter_method) {forms[formName].report_method = '%' + globals.MGR_report_filter_method + '%'}
	if (globals.MGR_report_filter_module) {forms[formName].report_module = '%' + globals.MGR_report_filter_module + '%'}
	if (globals.MGR_report_filter_wrapper) {forms[formName].flag_wrapper = globals.MGR_report_filter_wrapper}

var results = forms[formName].controller.search()

//sort if there are results
if (results) {
	controller.sort('report_module asc, report_form asc, report_method asc')
}


//	clear filters

globals.MGR_report_filter_navitem = null
globals.MGR_report_filter_navid = null
globals.MGR_report_filter_menu = null
}

/**
 *
 * @properties={typeid:24,uuid:"A9F835D3-0B0E-4531-9BC0-596CD3AC3A0D"}
 * @AllowToRunInFind
 */
function FILTER_clear()
{

/*
 *	TITLE    :	FILTER_clear
 *			  	
 *	MODULE   :	rsrc_RPT_report
 *			  	
 *	ABOUT    :	reset the filter
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FILTER_clear()
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// clear filters
globals.MGR_report_filter_description = null
globals.MGR_report_filter_form = null
globals.MGR_report_filter_method = null
globals.MGR_report_filter_module = null
globals.MGR_report_filter_wrapper = null

globals.MGR_report_filter_navitem = null
globals.MGR_report_filter_navid = null
globals.MGR_report_filter_menu = null

forms.MGR_0F_report_1L_2L.controller.loadAllRecords()

}
