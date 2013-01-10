/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"095B1A4C-2266-4F38-B262-F2B1A43910FB"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		//css classes
		plugins.WebClientUtils.setExtraCssClass(elements.gfx_header, 'gfxHeader')
	}
}
