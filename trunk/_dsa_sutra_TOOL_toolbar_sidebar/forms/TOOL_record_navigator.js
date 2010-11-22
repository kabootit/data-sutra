/**
 *
 * @properties={typeid:24,uuid:"99491a64-2a9a-466b-9b0d-aca6ecc22abd"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
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
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	var formNameBase = solutionPrefs.config.formNameBase
	
	//if not 'previewing' the status area
	if (solutionPrefs.config.currentFormName != 'MGR_0F_toolbar') {	
		//update record navigator
		globals.CALLBACK_toolbar_record_navigator_set()
	}
}

}
