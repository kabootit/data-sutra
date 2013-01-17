/**
 *
 * @properties={typeid:24,uuid:"4f069892-019a-4eda-b3e5-ad4530b49d81"}
 */
function FLD_data_change__sort_string()
{

/*
 *	TITLE    :	FLD_data_change__sort_string
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	override the default list header for this display
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formSort = (form_to_load && forms[form_to_load]) ? forms[form_to_load].foundset.getCurrentSort() : 'ERROR! Workflow form not present'
var newSort = sort_string

if (newSort != '') {
	sort_string = newSort
}
else {
	sort_string = formSort
}



}

/**
 *
 * @properties={typeid:24,uuid:"340e7946-623b-420a-a74c-baf9298eac41"}
 */
function REC_on_select()
{

//enable/disable elements
if (form_to_load && forms[form_to_load]) {
		elements.btn_sort_string.enabled = true
}
else {
	elements.btn_sort_string.enabled = false
}


 
}
