/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"7855377A-F606-48E4-BD0B-ECB2C2D7C43E"}
 */
function FORM_on_load(event) {
	
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"6D20E13B-CD8A-40AB-BCD4-E14B5B44ADD5"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		//configure list tab
		elements.tab_list.dividerSize = 0
		elements.tab_list.dividerLocation = 175
		elements.tab_list.continuousLayout = true
		elements.tab_list.resizeWeight = 0
		
		//set style class for background image
		plugins.WebClientUtils.setExtraCssClass(elements.color,'gfxLeftHand')
	}
}
