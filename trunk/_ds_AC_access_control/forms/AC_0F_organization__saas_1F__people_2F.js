/**
 *
 * @properties={typeid:24,uuid:"F2F11860-3D9B-4682-82F5-D6FD8D84272A"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	create new staff record for selected organization
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	April 14, 2010 -- Troy Elliott, Data Mosaic
 *			  	
 */

ac_access_organization_to_access_staff.newRecord(1,true)
forms.AC_0F_organization__saas_1F__people_2F_3L_staff.elements.fld_name_first.requestFocus(false)

}
