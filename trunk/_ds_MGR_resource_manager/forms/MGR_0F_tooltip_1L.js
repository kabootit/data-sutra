/**
 *
 * @properties={typeid:24,uuid:"994BD6DA-5E56-4C1B-BE9E-7B2D7955CE4F"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
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
elements.bean_split.dividerLocation = 250

}
