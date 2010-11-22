/**
 *
 * @properties={typeid:24,uuid:"B7332B04-7F30-46E6-BBDB-BFA41C181313"}
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
var relnName1 = 'rpt_report_to_action_item'
var relnName2 = 'rpt_action_item_to_navigation_item'

//find on filtered values
forms[formName].controller.find()

	if (globals.RPT_filter_navitem) {forms[formName][relnName1][relnName2].item_name = '%' + globals.RPT_filter_navitem + '%'}
	if (globals.RPT_filter_navid) {forms[formName][relnName1][relnName2].item_id = globals.RPT_filter_navid}
	if (globals.RPT_filter_menu) {forms[formName][relnName1].menu_name = '%' + globals.RPT_filter_menu + '%'}

var results = forms[formName].controller.search()

//sort if there are results
if (results) {
	controller.sort('report_module asc, report_form asc, report_method asc')
}


// clear filters
globals.RPT_filter_description = null
globals.RPT_filter_form = null
globals.RPT_filter_method = null
globals.RPT_filter_module = null
}

/**
 *
 * @properties={typeid:24,uuid:"F7C5D5DF-389C-4ADD-A0BC-B3992C234F3B"}
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

globals.RPT_filter_navitem = null
globals.RPT_filter_navid = null
globals.RPT_filter_menu = null

forms.MGR_0F_report_1L_2L.controller.loadAllRecords()

}
