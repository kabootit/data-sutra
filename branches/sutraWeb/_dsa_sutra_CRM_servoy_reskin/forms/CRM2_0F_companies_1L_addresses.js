/**
 *
 * @properties={typeid:24,uuid:"f0ad8b3e-c9c3-4bd7-92b0-5a44bb0440a1"}
 */
function REC_delete() {
	var delRec = globals.DIALOGS.showWarningDialog(
					'Delete record',
					'Do you really want to delete this address?',
					'Yes',
					'No')
	
	if (delRec == 'Yes') {
		controller.deleteRecord()
	}
}

/**
 *
 * @properties={typeid:24,uuid:"525d7f83-4145-4b46-ad0a-56c18ff0aa12"}
 * @AllowToRunInFind
 */
function REC_edit() {
	//enter transaction
	databaseManager.saveData()
	databaseManager.setAutoSave(false)
	
	forms.CRM_P_addresses.foundset.loadRecords(foundset)
	
	//show form in dialog
	globals.CODE_form_in_dialog(forms.CRM_P_addresses,-1,-1,-1,-1,'New address',false,false,'crmEditAddress')
}

/**
 *
 * @properties={typeid:24,uuid:"cd9bfe64-8dd7-4bea-887b-8787290bf8ec"}
 * @AllowToRunInFind
 */
function REC_new() {
	//enter transaction
	databaseManager.saveData()
	databaseManager.setAutoSave(false)
	
	foundset.newRecord(false,true)
	
	forms.CRM_P_addresses.foundset.loadRecords(foundset)
	
	//show form in dialog
	globals.CODE_form_in_dialog(forms.CRM_P_addresses,-1,-1,-1,-1,'New address',false,false,'crmEditAddress')
}
