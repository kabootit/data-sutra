/**
 *
 * @properties={typeid:24,uuid:"7c05e0e5-f583-466e-a4ea-739466c82d60"}
 * @AllowToRunInFind
 */
function GOTO_order()
{

/*
 *	TITLE    :	GOTO_order
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	navigates to the orders screen, and selects the order the current order item came from
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GOTO_order()
 *			  	
 *	MODIFIED :	February 23, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get an order foundset to send across
var fsOrders = databaseManager.getFoundSet(controller.getServerName(),'orders')

fsOrders.clear()

fsOrders.find()

for (var i = 1; i <= foundset.getSize(); i++) {
	var record = foundset.getRecord(i)
	fsOrders.order_id = record.order_id
	fsOrders.newRecord()
}
var results = fsOrders.search()

//make sure we don't send in anything that looks like a foundset if we shouldn't
if (!results) {
	fsOrders = null
}

//change the selected navigation record
globals.TRIGGER_navigation_set(14,true,fsOrders) //orders is 14

//set selected index
forms.CRM2_0F_orders.foundset.selectRecord(order_id)
}
