/**
 *
 * @properties={typeid:24,uuid:"10e182fe-d9dd-43b7-a114-3fa94cea0f90"}
 */
function EDIT_order_item()
{

/*
 *	TITLE    :	EDIT_order_item
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	show order item in pop-up dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	EDIT_order_item()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var orderItemID = orderitem_id

//select the right row
forms.CRM_P_order_items.controller.find()
forms.CRM_P_order_items.orderitem_id = orderItemID
forms.CRM_P_order_items.controller.search()

//show form in dialog
application.showFormInDialog(forms.CRM_P_order_items,-1,-1,-1,-1,'Edit',false,false,false,'crm2OrderItem')
}

/**
 *
 * @properties={typeid:24,uuid:"fee4a4d2-ce16-4a1c-a0aa-b12bceaef5ff"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	prompts to delete the currently selected record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_delete()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var delRec = plugins.dialogs.showWarningDialog(
				'Delete record',
				'Do you really want to delete this order item?',
				'Yes',
				'No')

if (delRec == 'Yes') {
	controller.deleteRecord()
}

	
}

/**
 *
 * @properties={typeid:24,uuid:"2bece18d-58e6-4d06-ae05-3be0aba2a9c2"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	creates a new order item record
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

//create a new record
forms.CRM2_0F_orders.crm_orders_to_order_items.newRecord(false, true)

//edit newly created record
EDIT_order_item()
}
