/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D7681810-DAC1-4099-8CE2-D19A2EA3AB3F"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		plugins.WebClientUtils.setExtraCssClass(elements.fld_find, 'noWebkitOutline fastFind')
		
		plugins.WebClientUtils.setExtraCssClass(elements.color, 'gfxLeftHand')
	}
}