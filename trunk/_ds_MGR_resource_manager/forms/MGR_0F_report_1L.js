/**
 *
 * @properties={typeid:24,uuid:"85BB5F29-42E7-4857-B9B3-CB063FFD972C"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	rsrc_RPT_report
 *			  	
 *	ABOUT    :	set up the split bean
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_load()
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// split bean setup
elements.bean_split.topComponent	= elements.tab_top
elements.bean_split.bottomComponent	= elements.tab_bottom

elements.bean_split.orientation = 0
elements.bean_split.resizeWeight = 1
elements.bean_split.dividerLocation = 415

}
