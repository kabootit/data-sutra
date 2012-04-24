/**
 * @properties={typeid:35,uuid:"13ac385c-d2d3-445c-b326-b1445aa2241f",variableType:93}
 */
var DATE_date_range_end;

/**
 * @properties={typeid:35,uuid:"9fd5f3f9-6ea2-4573-8694-fb7696b9fd01"}
 */
var DATE_date_range_entry = '';

/**
 * @properties={typeid:35,uuid:"7854b20f-d6b2-4e94-9d98-8df4edae8ee4"}
 */
var DATE_date_range_field_name = '';

/**
 * @properties={typeid:35,uuid:"498fed39-ea82-494e-9a5c-04c95f5ed59e"}
 */
var DATE_date_range_search_form = '';

/**
 * @properties={typeid:35,uuid:"cd073e4c-5749-4ca1-ba74-4b5340764528",variableType:93}
 */
var DATE_date_range_start;

/**
 * @properties={typeid:35,uuid:"323e0d44-6842-402c-9721-764e1d9f5302",variableType:93}
 */
var DATE_date_range_track;

/**
 * @properties={typeid:35,uuid:"9fe78f81-5ddc-4590-b78b-03f6a2853a81"}
 */
var DATE_date_range_type = 'Day';

/**
 *
 * @properties={typeid:24,uuid:"f57c42a4-d178-40b6-afa5-00a5861491c2"}
 */
function DATE_range_search()
{

/*
 *	TITLE    :	DATE_range_search
 *			  	
 *	MODULE   :	rsrc_DATE_date_picker
 *			  	
 *	ABOUT    :	open form in dialogue to enter date range search criteria for ONE field
 *			  	call from a button on your form associated with a date field to search
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	element labeled ==>  btn_<field_name>
 *			  	
 *	MODIFIED :	Jan 2007 -- David Workman, Data Mosaic
 *			  	
 */

//grab form name
globals.DATE_date_range_search_form = application.getMethodTriggerFormName()

//grab field name
globals.DATE_date_range_field_name = application.getMethodTriggerElementName().substr(4)

//make sure the frameworks flag is false
forms.DATE_P__search.FrameworksFastFind = false

//show form in dialog
globals.CODE_form_in_dialog(forms.DATE_P__search,-1,-1,-1,-1,"Search",false,false,"datePicker")

}
