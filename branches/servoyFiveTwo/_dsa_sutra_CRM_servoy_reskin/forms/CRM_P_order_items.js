/**
 *
 * @properties={typeid:24,uuid:"7dce009e-65c8-4d37-bdb9-8679fc89051c"}
 */
function ACTION_done()
{


//enaable closing the form
globals.CODE_hide_form = 1

globals.CODE_form_in_dialog_close()
}

/**
 *
 * @properties={typeid:24,uuid:"9e9cae27-e014-4ebc-ae5e-41c87f00afc9"}
 */
function FORM_on_show()
{

//disable closing the form
globals.CODE_hide_form = 0
}

/**
 *
 * @properties={typeid:24,uuid:"1ec6ce0e-208d-49b2-ab76-a3d9660f0777"}
 */
function POPULATE_fields()
{

/*
 *	TITLE    :	POPULATE_fields
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	set some default values
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	POPULATE_fields()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

description = crm_order_items_to_products.order_description
price_each = crm_order_items_to_products.price_each
cost_each = crm_order_items_to_products.cost_each

if (!quantity) {
	quantity = 1
}
}
