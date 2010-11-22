/**
 *
 * @properties={typeid:24,uuid:"fa5ba3c5-5ce1-4d83-8998-ccc38897f95e"}
 */
function ACTION_cancel()
{

/*
 *	TITLE    :	ACTION_cancel
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Jan 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//not already ok to close, cancel
if (!globals.CODE_hide_form) {
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	globals.NAV_search_valuelist = null
	
	application.closeFormDialog('findValuelist')
}
}

/**
 *
 * @properties={typeid:24,uuid:"a92ffc1b-b4f6-4a17-820c-6955a9d07490"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Jan 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//enaable closing the form
globals.CODE_hide_form = 1

//close FiD
application.closeFormDialog('findValuelist')

//continue searching
globals.DATASUTRA_find = globals.NAV_search_valuelist
globals.FIND_end_normal()

}

/**
 *
 * @properties={typeid:24,uuid:"8c319376-a42b-4280-b256-ca6dd4a8889b"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	disable closing of dialog box
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Jan 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//disable closing the form
globals.CODE_hide_form = 0

globals.NAV_search_valuelist = null
}
