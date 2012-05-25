/**
 *
 * @properties={typeid:24,uuid:"954c8d0b-a147-4f85-97a8-eb566eb5bfd5"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	disable login elements
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	September 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

elements.fld_AC_login_password.enabled = false
elements.fld_AC_login_user.enabled = false
controller.enabled = false

}
