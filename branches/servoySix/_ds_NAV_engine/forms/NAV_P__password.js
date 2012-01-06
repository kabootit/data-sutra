/**
 *
 * @properties={typeid:24,uuid:"a199ba2c-492a-4ce2-b738-d30919799a22"}
 */
function ACTION_cancel()
{

/*
 *	TITLE    :	DS_help
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
	
	globals.NAV_password = 'passwordDialogCancelled'
	application.closeFormDialog('passwordOverride')
}
}

/**
 *
 * @properties={typeid:24,uuid:"09305cbf-7832-4106-afed-b782bffc0b49"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	DS_help
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

application.closeFormDialog('passwordOverride')
}

/**
 *
 * @properties={typeid:24,uuid:"0ba21edb-609d-4332-8333-7db9cb227e69"}
 */
function FORM_on_show()
{


//disable closing the form
globals.CODE_hide_form = 0

globals.NAV_password = null
elements.fld_NAV_password.requestFocus()
}
