/**
 *
 * @properties={typeid:24,uuid:"6fdd8c88-818b-4543-a637-e7c91f625cc0"}
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
application.showFormInDialog(forms.CRM_P_order_items,-1,-1,-1,-1,'Edit',false,false,false,'crm1OrderItem')
}

/**
 *
 * @properties={typeid:24,uuid:"a6ac93ba-23a6-464c-bfb3-ad2fd9a7fc43"}
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
