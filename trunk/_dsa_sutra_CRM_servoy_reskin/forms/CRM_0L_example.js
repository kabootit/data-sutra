/**
 *
 * @properties={typeid:24,uuid:"CDDF6C4C-8D9F-4601-8B84-5E386D041CE7"}
 */
function REC_delete() {
	var delRec = globals.DIALOGS.showWarningDialog(
					'Delete record',
					'Do you really want to delete this color?',
					'Yes',
					'No')
	
	if (delRec == 'Yes') {
		controller.deleteRecord()
	}
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"AFDE4670-E2E0-4AF8-A170-F484BD3A3792"}
 */
function onRecordSelection(event) {
	globals.TRIGGER_toolbar_record_navigator_set()
//	application.output('onrecselect: ' + foundset.getSelectedIndex())
}
