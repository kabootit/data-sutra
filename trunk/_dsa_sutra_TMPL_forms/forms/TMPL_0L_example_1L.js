/**
 *
 * @properties={typeid:24,uuid:"b2d6ccd4-4ef9-43f7-875b-47c397a65683"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	rsrc_TMPL_template
 *			  	
 *	ABOUT    :	populates global var so that display_x and rec_selected calculations highlight list views
 *			  	updates record navigator (usually, this would not be the place to do that -> attach to onRecSave of workflow FORM, not list)
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	globals.TMPL_example
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */


globals.TMPL_example = id_example

globals.CALLBACK_toolbar_record_navigator_set()
}
