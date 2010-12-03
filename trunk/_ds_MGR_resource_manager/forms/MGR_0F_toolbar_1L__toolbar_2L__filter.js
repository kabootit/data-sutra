/**
 *
 * @properties={typeid:24,uuid:"7AF8FA65-0DA8-4B27-ADD9-216C1AFD8B6F"}
 */
function ACTION_filter()
{

var formName = 'MGR_0F_toolbar_1L__toolbar_2L'

//find on filtered values
forms[formName].controller.find()

	if (globals.MGR_tool_filter_formname) {forms[formName].form_name = '%' + globals.MGR_tool_filter_formname + '%'}
	if (typeof globals.MGR_tool_filter_popdown == 'number') {forms[formName].pop_down_show = (globals.MGR_tool_filter_popdown) ? 1 : '^='}
	if (typeof globals.MGR_tool_filter_show == 'number') {forms[formName].row_status_show = (globals.MGR_tool_filter_show) ? 1 : '^='}
	if (globals.MGR_tool_filter_tabname) {forms[formName].tab_name = '%' + globals.MGR_tool_filter_tabname + '%'}

var results = forms[formName].controller.search()

//sort if there are results
if (results) {
	controller.sort('row_order asc')
}



}

/**
 *
 * @properties={typeid:24,uuid:"68B7E00E-7887-48DC-99CC-9F01259FBC42"}
 */
function FILTER_clear()
{

// clear filters

globals.MGR_tool_filter_tabname = null
globals.MGR_tool_filter_formname = null
globals.MGR_tool_filter_show = null
globals.MGR_tool_filter_popdown = null


mgr_toolbar__toolbar.loadAllRecords()

}
