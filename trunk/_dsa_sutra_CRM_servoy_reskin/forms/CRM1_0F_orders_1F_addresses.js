/**
 *
 * @properties={typeid:24,uuid:"e597e0d0-6a79-4958-a5f4-08bafd3dc18f"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	show correct address
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

if (utils.hasRecords(crm_addresses_to_companies)) {
	globals.CRM_address_display = crm_addresses_to_companies.company_name +'\n'+ address_display_calc
}
else {
	globals.CRM_address_display = null
}
}
