/**
 *
 * @properties={typeid:24,uuid:"D056C61D-E05C-4B98-A134-559D9861A48F"}
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

	if (globals.RPT_filter_description) {forms[formName].report_description = '%' + globals.RPT_filter_description + '%'}
	if (globals.RPT_filter_form) {forms[formName].report_form = '%' + globals.RPT_filter_form + '%'}
	if (globals.RPT_filter_method) {forms[formName].report_method = '%' + globals.RPT_filter_method + '%'}
	if (globals.RPT_filter_module) {forms[formName].report_module = '%' + globals.RPT_filter_module + '%'}
	if (globals.RPT_filter_wrapper) {forms[formName].flag_wrapper = globals.RPT_filter_wrapper}

var results = forms[formName].controller.search()

//sort if there are results
if (results) {
	controller.sort('report_module asc, report_form asc, report_method asc')
}


//	clear filters

globals.RPT_filter_navitem = null
globals.RPT_filter_navid = null
globals.RPT_filter_menu = null
}

/**
 *
 * @properties={typeid:24,uuid:"A9F835D3-0B0E-4531-9BC0-596CD3AC3A0D"}
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
globals.RPT_filter_description = null
globals.RPT_filter_form = null
globals.RPT_filter_method = null
globals.RPT_filter_module = null
globals.RPT_filter_wrapper = null

globals.RPT_filter_navitem = null
globals.RPT_filter_navid = null
globals.RPT_filter_menu = null

forms.MGR_0F_report_1L_2L.controller.loadAllRecords()

}
