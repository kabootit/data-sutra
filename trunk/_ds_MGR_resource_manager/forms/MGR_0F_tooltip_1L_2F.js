/**
 *
 * @properties={typeid:24,uuid:"EC9154AB-7F72-47B1-B9AA-32B66EB63D9A"}
 */
function TAB_change()
{

/*
 *	TITLE    :	TAB_change
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	tab change
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	TAB_change()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TAB_change_grid()

//switch preview tab also
elements.tab_preview.tabIndex = elements.tab_detail.tabIndex

}
