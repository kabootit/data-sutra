/**
 *
 * @properties={typeid:24,uuid:"902098dd-1a5b-4010-8e07-197e18035827"}
 */
function GOTO_order()
{

/*
 *	TITLE    :	GOTO_order
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	navigates to the orders screen, preserving the current company's orders
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GOTO_order()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//change the selected navigation record
globals.CALLBACK_navigation_set(10,true) //orders is 10

}

/**
 *
 * @properties={typeid:24,uuid:"41a1f327-6a6a-4507-b783-2231e4f2ee51"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	if address and contact on file, create new order
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_new()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//make sure the company has at least ONE address & ONE contact
var addrCnt = crm_orders_company_to_addresses.getSize()
var contCnt = crm_order_company_to_contacts.getSize()

if (addrCnt && contCnt) {
	var record = forms.CRM1_0F_companies.crm_companies_to_orders.getRecord(forms.CRM1_0F_companies.crm_companies_to_orders.newRecord(false,true))
	
	//do the auto-enter stuff
	//set the next order number
	if (databaseManager.getFoundSetCount(foundset) == 0) {
		//never been an order number
		record.order_number = 1000
	}
	else {
		//sql query to get the highest invoice number = then add 1
		var query = 'select order_number from orders order by order_number desc'
		var dataset = databaseManager.getDataSetByQuery(controller.getServerName(), query, null, 1)
		record.order_number = dataset.getValue(1, 1) + 1
	}
	record.order_date = new Date()
	record.is_active = 1
		
	databaseManager.saveData()
	
	//change the selected navigation record
	GOTO_order()
	
	forms.CRM1_0F_orders.foundset.selectRecord(record.order_id)
	forms.CRM1_0F_orders.elements.fld_order_number.requestFocus(false)
}
else if (addrCnt == 0) {
	//show error
	plugins.dialogs.showErrorDialog(
					'Missing address',
					'There needs to be at least one address defined for this customer before you can create an order.',
					'OK')
	//address tab
	globals.TAB_change_inline('CRM1_0F_companies_1L_orders','tab_d2')
}
else if (contCnt == 0) {
	//show error
	plugins.dialogs.showErrorDialog(
					'Missing contact',
					'There needs to be at least one contact defined for this customer before you can create an order.',
					'OK')
	//contact tab
	globals.TAB_change_inline('CRM1_0F_companies_1L_orders','tab_d1')
}
}
