
/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"5CD2ACB2-FA5C-48FF-9809-727E3A21739F"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		plugins.WebClientUtils.setExtraCssClass(elements.fld_find, 'fastFind')
	}
}
