/**
 *
 * @properties={typeid:24,uuid:"a4bebfe9-bf16-48a0-8ede-99d4e92d51f6"}
 */
function SELECT_address()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	set globals regarding contact
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_on_select()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

crm_gcurcontactid_to_contacts.mail_address_id = address_id
databaseManager.saveData()
}
