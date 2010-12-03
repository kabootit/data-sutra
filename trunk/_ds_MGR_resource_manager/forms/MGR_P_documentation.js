/**
 *
 * @properties={typeid:24,uuid:"0F4C6924-B55A-4FCF-A3E3-8D7F7CDA8B07"}
 */
function ACTION_cancel()
{



globals.CODE_hide_form = 1

application.closeFormDialog('popoutHelp')

globals.DS_help()
}

/**
 *
 * @properties={typeid:24,uuid:"86A265A8-22F7-405E-957B-F2F783CB9603"}
 */
function FORM_on_load()
{
elements.fld_text__plain.visible = false
}

/**
 *
 * @properties={typeid:24,uuid:"F3055169-68B9-4C33-A137-F9380916DEBC"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	rsrc_CODE_code
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	July 11, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.CODE_hide_form = 0

/*
var useHTML = '<html>'.equalsIgnoreCase(utils.stringLeft(globals.CODE_text, 6))

elements.fld_text__html.visible = useHTML
elements.fld_text__plain.visible = !useHTML
*/
}
