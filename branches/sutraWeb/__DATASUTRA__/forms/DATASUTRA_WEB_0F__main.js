/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"02C82E54-792A-4A8F-BE2D-B8C5F979C87A"}
 */
function FORM_on_load(event) {
	
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"EF34DFC6-9AF9-4B5A-B6F7-FE23033E373A"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		//configure main tab
		elements.tab_main.dividerSize = 0
		elements.tab_main.dividerLocation = 200
		elements.tab_main.continuousLayout = true
		elements.tab_main.bgcolor = '#d1d7e2'
		elements.tab_main.resizeWeight = 0
	}
}