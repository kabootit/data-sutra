/**
 *
 * @properties={typeid:24,uuid:"db67c811-b242-4a93-bf43-1f6f68269536"}
 */
function REC_delete() {
	var delRec = globals.DIALOGS.showWarningDialog(
							'Delete record',
							'Do you really want to delete this record?',
							'Yes',
							'No'
						)
	
	if (delRec == 'Yes') {
		controller.deleteRecord()
	}
}

/**
 *
 * @properties={typeid:24,uuid:"b8c8faaa-1ab8-4c4e-a565-f7277302f3e0"}
 */
function REC_new(event) {
	scopes.DS_buttons.TRANSACTION_start(event)
	
	//new record
	controller.newRecord(true)
	
	//enter first field
	elements.fld_company_name.requestFocus()
}

/**
 * @properties={typeid:24,uuid:"8E125D3A-C2C4-47BD-B68E-107EC729CE9B"}
 */
function EDIT_start() {
	if (scopes.DS.transaction.start()) {
		EDIT_toggle(true)
		return true
	}
}

/**
 * @properties={typeid:24,uuid:"7C4A1EAA-3C34-4DFE-8472-6B793BA86EE0"}
 */
function EDIT_cancel() {
	if (scopes.DS.transaction.cancel()) {
		EDIT_toggle(false)
	}
}

/**
 * @properties={typeid:24,uuid:"1FC76E4D-F90E-4B07-B782-B757F8B95CE0"}
 */
function EDIT_save() {
	if (scopes.DS.transaction.save()) {
		EDIT_toggle(false)
	}
}

/**
 * @param {Boolean} toggle
 * @properties={typeid:24,uuid:"C2B27311-E1DE-4A92-A0CC-77D622359466"}
 */
function EDIT_toggle(toggle) {
	//main form
	scopes.DS.transaction.toggle(forms[controller.getName()],toggle)
	
	//related addresses
	forms.CRM2_0F_companies_1L_addresses.elements.btn_delete.visible = toggle
	forms.CRM2_0F_companies_1L_addresses.elements.btn_edit.visible = toggle
}
/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"88C0E6B5-3D78-4A55-9A7D-44FC7B428A59"}
 */
function FORM_on_show(firstShow, event) {
	//allow editing fields in smart client because transactions don't exist there
	if (firstShow && !solutionPrefs.config.webClient) {
		EDIT_toggle(true)
	}
	
	//re-run onSelect when form reloaded
	REC_on_select(event)
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"7B57CE2A-D456-4334-8970-30E7FE303A0D"}
 */
function FORM_on_load(event) {
	scopes.TAB.GRID_init__detail()
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D956855F-D1CC-4B08-9836-104BF744B1BF"}
 */
function REC_on_select(event) {
	if (scopes.NT) {
		scopes.NT.sidebarSet(event)
	}
	
	if (scopes.SLICK) {
		scopes.SLICK.parentRecSelect(controller.getName())
	}
}

/**
 * @properties={typeid:24,uuid:"913C4656-B407-4DAE-A3E0-3C8FCCF75DA1"}
 */
function REPORT_sample() {
	scopes.DS.print.preview('customer_activity_weekly.pdf',scopes.DS.print.utils.getPDFByteArray.fromMediaLibrary('report_example.pdf'))
}
