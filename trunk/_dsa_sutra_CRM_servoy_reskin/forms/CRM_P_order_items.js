/**
 *
 * @properties={typeid:24,uuid:"7dce009e-65c8-4d37-bdb9-8679fc89051c"}
 */
function ACTION_done() {
	databaseManager.saveData()
	
	//turn autosave back on
	databaseManager.setAutoSave(true)
	
	//enable closing the form
	globals.CODE_hide_form = 1	
	
	globals.CODE_form_in_dialog_close('crmOrderItem')
}

/**
 *
 * @properties={typeid:24,uuid:"9e9cae27-e014-4ebc-ae5e-41c87f00afc9"}
 */
function FORM_on_show() {
	//disable closing the form
	globals.CODE_hide_form = 0
	
	//custom form setup for iOS FiD
	globals.CODE_form_in_dialog_setup_ipad()
}

/**
 *
 * @properties={typeid:24,uuid:"1ec6ce0e-208d-49b2-ab76-a3d9660f0777"}
 */
function POPULATE_fields() {
	description = crm_order_items_to_products.order_description
	price_each = crm_order_items_to_products.price_each
	cost_each = crm_order_items_to_products.cost_each
	
	if (!quantity) {
		quantity = 1
	}
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"1B94F29A-1471-44C2-8776-2EAD218FC39D"}
 */
function ACTION_cancel(event) {
	//not already ok to close, cancel
	if (!globals.CODE_hide_form) {
		//rollback edited records
		databaseManager.revertEditedRecords()
		
		//turn autosave back on
		databaseManager.setAutoSave(true)
		
		//enable closing the form
		globals.CODE_hide_form = 1
		
		globals.CODE_form_in_dialog_close('crmOrderItem')
		
		return true
	}
}
