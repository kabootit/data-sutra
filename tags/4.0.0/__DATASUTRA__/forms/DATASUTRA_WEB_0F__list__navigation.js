/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"25F0517B-A1EC-4594-B283-BDB7CEE6AC18"}
 */
function FORM_on_load(event) {
	
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"EB430CF8-C96D-43B6-BD66-93CA65B5F2BA"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		//set style class for background image
		plugins.WebClientUtils.setExtraCssClass(elements.color,'gfxLeftHand')
	}
}
