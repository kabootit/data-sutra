/**
 *
 * @properties={typeid:24,uuid:"B7332B04-7F30-46E6-BBDB-BFA41C181313"}
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
var relnName1 = 'mgr_report_to_action_item'
var relnName2 = 'mgr_action_item_to_navigation_item'

//find on filtered values
forms[formName].controller.find()

	if (globals.MGR_report_filter_navitem) {forms[formName][relnName1][relnName2].item_name = '%' + globals.MGR_report_filter_navitem + '%'}
	if (globals.MGR_report_filter_navid) {forms[formName][relnName1][relnName2].item_id = globals.MGR_report_filter_navid}
	if (globals.MGR_report_filter_menu) {forms[formName][relnName1].menu_name = '%' + globals.MGR_report_filter_menu + '%'}

var results = forms[formName].controller.search()

//sort if there are results
if (results) {
	controller.sort('report_module asc, report_form asc, report_method asc')
}


// clear filters
globals.MGR_report_filter_description = null
globals.MGR_report_filter_form = null
globals.MGR_report_filter_method = null
globals.MGR_report_filter_module = null
}

/**
 *
 * @properties={typeid:24,uuid:"F7C5D5DF-389C-4ADD-A0BC-B3992C234F3B"}
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

globals.MGR_report_filter_navitem = null
globals.MGR_report_filter_navid = null
globals.MGR_report_filter_menu = null

forms.MGR_0F_report_1L_2L.controller.loadAllRecords()

}
