/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"110FDFB5-8737-4E27-9567-4B146942D8C7",variableType:4}
 */
var test_id = null;


/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"C16F26D2-2D21-4534-8337-A22AED6827C0"}
 */
function REC_on_select(event) {
	if (scopes.NT) {
		scopes.NT.sidebarSet(event)
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"FE467E4A-4FB9-4B7C-AE65-4E35CABA4571"}
 */
function FORM_on_show(firstShow, event) {
	if (scopes.NT) {
		scopes.NT.sidebarSet(event)
	}
}