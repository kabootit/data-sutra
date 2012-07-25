/**
 *
 * @properties={typeid:24,uuid:"971731ba-47ab-402a-90f2-755832283df1"}
 */
function ACTION_done() {
	databaseManager.saveData()
	
	//turn autosave back on
	databaseManager.setAutoSave(true)
	
	//enable closing the form
	globals.CODE_hide_form = 1	
	
	globals.CODE_form_in_dialog_close('crmEditAddress')
}

/**
 *
 * @properties={typeid:24,uuid:"f14b56cb-a381-4d45-b318-7e057112368d"}
 */
function FORM_on_show() {
	//disable closing the form
	globals.CODE_hide_form = 0
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"BC02D234-C436-4BBB-B835-26835049317A"}
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
		
		globals.CODE_form_in_dialog_close('crmEditAddress')

		return true
	}
}
