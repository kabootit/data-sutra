/**
 *
 * @properties={typeid:24,uuid:"7AF8FA65-0DA8-4B27-ADD9-216C1AFD8B6F"}
 */
function ACTION_filter()
{

var formName = 'MGR_0F_toolbar_1L__toolbar_2L'

//find on filtered values
forms[formName].controller.find()

	if (globals.TOOL_filter_formname) {forms[formName].form_name = '%' + globals.TOOL_filter_formname + '%'}
	if (typeof globals.TOOL_filter_popdown == 'number') {forms[formName].pop_down_show = (globals.TOOL_filter_popdown) ? 1 : '^='}
	if (typeof globals.TOOL_filter_show == 'number') {forms[formName].row_status_show = (globals.TOOL_filter_show) ? 1 : '^='}
	if (globals.TOOL_filter_tabname) {forms[formName].tab_name = '%' + globals.TOOL_filter_tabname + '%'}

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

globals.TOOL_filter_tabname = null
globals.TOOL_filter_formname = null
globals.TOOL_filter_show = null
globals.TOOL_filter_popdown = null


tool_toolbar__toolbar.loadAllRecords()

}
