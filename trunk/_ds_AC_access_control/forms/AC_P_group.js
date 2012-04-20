/**
 *
 * @properties={typeid:24,uuid:"a5357316-c42d-4013-ad38-75fdc5e993ca"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	close form dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//enaable closing the form
globals.CODE_hide_form = 1

globals.CODE_form_in_dialog_close('accessLoginGroup')
}

/**
 *
 * @properties={typeid:24,uuid:"8476f403-86be-4047-a890-c7234e08523e"}
 */
function FLD_focus_gained__group_name()
{
elements.fld_constant.requestFocus(false)
}

/**
 *
 * @properties={typeid:24,uuid:"3f75f6e0-9870-4256-be57-0196614afa94"}
 */
function FORM_on_show()
{


//disable closing the form
globals.CODE_hide_form = 0
}

/**
 *
 * @properties={typeid:24,uuid:"1457e140-34f6-4126-a149-075667fa90bf"}
 */
function REC_on_select()
{

globals.AC_P_group = id_group
}
