/**
 *
 * @properties={typeid:24,uuid:"4f7fddc4-1eaa-4dd8-a55f-91e0bf611c43"}
 */
function ACTION_close()
{

/*
 *	TITLE    :	ACTION_close
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
 *	USAGE    :	ACTION_close()
 *			  	
 *	MODIFIED :	July 11, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.CODE_hide_form = 1
globals.CODE_text = null

application.closeFormDialog('inlineHelp')
}

/**
 *
 * @properties={typeid:24,uuid:"be218f44-6a3e-4046-8e1d-33f991abc74e"}
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

var useHTML = '<html>'.equalsIgnoreCase(utils.stringLeft(globals.CODE_text, 6))

elements.fld_text__html.visible = useHTML
elements.fld_text__plain.visible = !useHTML
}

/**
 *
 * @properties={typeid:24,uuid:"474988a3-88d3-49f9-ba3e-ba1f63ae7793"}
 */
function PRINT_help()
{

/*
 *	TITLE    :	PRINT_help
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
 *	USAGE    :	PRINT_help()
 *			  	
 *	MODIFIED :	November 4, 2008 -- David Workman, Data Mosaic
 *			  	
 */

// close inline help form
globals.CODE_hide_form = 1
application.closeFormDialog('inlineHelp')

// print form
forms.CODE_RPT_inline_help.controller.showPrintPreview(true)
//forms.CODE_RPT_inline_help.controller.show()

// clean up
//globals.CODE_text = null
}
