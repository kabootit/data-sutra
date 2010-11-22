/**
 *
 * @properties={typeid:24,uuid:"8e1203e0-8b1f-4256-814a-df90001ac374"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	resets bean
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

elements.bn_progress.value = 0

//disable closing the form
globals.CODE_hide_form = 0
}
