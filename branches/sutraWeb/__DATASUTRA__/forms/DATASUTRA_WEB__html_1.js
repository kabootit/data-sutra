
/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"7A37EFD7-CDC0-40A7-8070-124F761E604B"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow && !utils.hasRecords(foundset)) {
		foundset.newRecord()
	}
}
