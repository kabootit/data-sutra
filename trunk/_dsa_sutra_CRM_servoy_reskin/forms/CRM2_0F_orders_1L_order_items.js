/**
 *
 * @properties={typeid:24,uuid:"10e182fe-d9dd-43b7-a114-3fa94cea0f90"}
 * @AllowToRunInFind
 */
function EDIT_order_item() {
	//select the right row
	forms.CRM_P_order_items.foundset.loadRecords(foundset)
	
	//show form in dialog
	globals.CODE_form_in_dialog(forms.CRM_P_order_items,-1,-1,-1,-1,'Edit',false,false,'crmOrderItem')
}

/**
 *
 * @properties={typeid:24,uuid:"fee4a4d2-ce16-4a1c-a0aa-b12bceaef5ff"}
 */
function REC_delete() {
	var delRec = globals.DIALOGS.showWarningDialog(
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
function REC_new() {
	//enter transaction
	databaseManager.saveData()
	databaseManager.setAutoSave(false)
	
	//create a new record
	foundset.newRecord(false, true)
	
	//edit newly created record
	EDIT_order_item()
}
