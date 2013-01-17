/**
 *
 * @properties={typeid:24,uuid:"08b81340-eaff-48d0-88a2-94ccb1b871fa"}
 */
function ADD_find_field()
{

/*
 *	TITLE    :	FLD_data_change__name_display
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	check to make sure no other active finds have the same display name
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	February 23, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var pkFind = id_column

status_find = 1
databaseManager.saveData()

//remove record from foundset
foundset.omitRecord()

//select record
forms.NAV_0F_navigation_item_1F_column__fastfind_2L__left.foundset.selectRecord(pkFind)

//request focus if unnamed
if (forms.NAV_0F_navigation_item_1F_column__fastfind_2L__left.name_display == null || forms.NAV_0F_navigation_item_1F_column__fastfind_2L__left.name_display == '') {
	forms.NAV_0F_navigation_item_1F_column__fastfind_2L__left.elements.fld_name_display.requestFocus()
}

//check for uniqueness
forms.NAV_0F_navigation_item_1F_column__fastfind_2L__left.FLD_data_change__name_display()



}
