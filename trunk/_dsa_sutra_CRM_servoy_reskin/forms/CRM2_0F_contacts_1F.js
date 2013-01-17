/**
 *
 * @properties={typeid:24,uuid:"b8290a5f-7f5f-4f70-b462-1ab136ddbb66"}
 */
function GOTO_company()
{

/*
 *	TITLE    :	GOTO_company
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	navigate to the parent company
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GOTO_company()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (utils.hasRecords(crm_contacts_to_companies)) {
	globals.TRIGGER_navigation_set(12,true,crm_contacts_to_companies) 
}
}
