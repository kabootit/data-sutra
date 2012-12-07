/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"857CB60B-1D9C-4178-B2FE-38B05D20B438"}
 */
function FORM_on_load(event) {
	
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"35196D43-C612-49B4-A8B8-34A0758AD4CF"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		//configure list tab
		elements.tab_list.dividerSize = 0
		elements.tab_list.dividerLocation = 30
		elements.tab_list.continuousLayout = true
//		elements.tab_list.bgcolor = '#d1d7e2'
		elements.tab_list.resizeWeight = 0
	}
}