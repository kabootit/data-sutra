/**
 *
 * @properties={typeid:24,uuid:"61f5b56b-82ff-461a-bc57-f8a0c970b648"}
 */
function FLD_data_change__fw_list_title()
{

/*
 *	TITLE    :	FLD_data_change__list_title
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	override the default list header for this display
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var newTitle = fw_list_title

if (newTitle != nav_list_display_to_navigation_item.fw_list_title && newTitle != '') {
	list_title = newTitle
}
else {
	list_title = null
}




}
