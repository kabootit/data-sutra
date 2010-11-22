/**
 *
 * @properties={typeid:24,uuid:"187e324b-bebc-4849-b757-969b2750ec0d"}
 */
function ACTION_filter()
{

var formName = 'AC_0F_solution__workflow_1F_action_2L'

//find on filtered values
forms[formName].controller.find()

	if (globals.AC_filter_action_name) {forms[formName].action_name = '%' + globals.AC_filter_action_name + '%'}
	if (globals.AC_filter_action_id) {forms[formName].action_id = '%' + globals.AC_filter_action_id + '%'}
	if (globals.AC_filter_description) {forms[formName].description = '%' + globals.AC_filter_description + '%'}
	
var results = forms[formName].controller.search()

//sort if there are results
if (results) {
	controller.sort('action_name asc')
}



}

/**
 *
 * @properties={typeid:24,uuid:"895acdc7-bf23-49a3-be3f-7a1f72fa1134"}
 */
function FILTER_clear()
{

// clear filters

globals.AC_filter_action_name = null
globals.AC_filter_action_id = null
globals.AC_filter_description = null

forms.AC_0F_solution__workflow_1F_action_2L.controller.loadAllRecords()

}
