/**
 *
 * @properties={typeid:24,uuid:"205FA2F3-DD18-4B1D-8F3E-92EBC89D8C46"}
 */
function ACTION_filter()
{

/*
 *	TITLE    :	ACTION_filter
 *			  	
 *	MODULE   :	rsrc_VL_valuelist
 *			  	
 *	ABOUT    :	do filtering
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_filter()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'MGR_0F_valuelist_1L'
var elem = application.getMethodTriggerElementName()

var vlName = forms[formName].valuelist_name

//find on filtered values
forms[formName].controller.find()
	
	//only search in selected valuelist
	forms[formName].valuelist_name = vlName
		
	if (globals.VL_filter_valuelist) {forms[formName].valuelist_name = '%' + globals.VL_filter_valuelist + '%'}
	if (globals.VL_filter_visible) {forms[formName].visible = '%' + globals.VL_filter_visible + '%'}
	if (globals.VL_filter_saved) {forms[formName].saved = '%' + globals.VL_filter_saved + '%'}
	if (globals.VL_filter_orderby) {forms[formName].order_by = globals.VL_filter_orderby}
	if (globals.VL_filter_search_table) {forms[formName].search_table = '%' + globals.VL_filter_search_table + '%'}
	if (globals.VL_filter_search_field) {forms[formName].search_field = '%' + globals.VL_filter_search_field + '%'}
	if (globals.VL_filter_relation_1) {forms[formName].relation_1 = '%' + globals.VL_filter_relation_1 + '%'}
	if (globals.VL_filter_relation_2) {forms[formName].relation_2 = '%' + globals.VL_filter_relation_2 + '%'}
	if (globals.VL_filter_flag_edit) {forms[formName].flag_edit = globals.VL_filter_flag_edit}

var results = forms[formName].controller.search()

//sort if there are results
if (results) {
	controller.sort('valuelist_name asc, relation_1 asc, relation_2 asc, order_by asc')
}

if (elem && elements[elem]) {
	elements[elem].requestFocus(false)
}



}

/**
 *
 * @properties={typeid:24,uuid:"8C799AF1-91A6-497A-9809-E724DED83C21"}
 */
function FILTER_clear(recSelect)
{

/*
 *	TITLE    :	FILTER_clear
 *			  	
 *	MODULE   :	rsrc_VL_valuelist
 *			  	
 *	ABOUT    :	clear filter globals
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FILTER_clear()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// clear filters

globals.VL_filter_orderby = null
globals.VL_filter_relation_1 = null
globals.VL_filter_relation_2 = null
globals.VL_filter_saved = null
globals.VL_filter_search_field = null
globals.VL_filter_search_table = null
globals.VL_filter_valuelist = null
globals.VL_filter_visible = null
globals.VL_filter_flag_edit = null

if (recSelect) {
	forms.MGR_0L_valuelist_1L.REC_on_select()
}
}
