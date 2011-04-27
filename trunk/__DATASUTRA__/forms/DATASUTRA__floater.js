/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"62A1C335-DA52-40A0-97D5-D195D3CE044C"}
 */
function ACTION_cancel(event) {
	var formName = elements.tab_content.getTabFormNameAt(elements.tab_content.tabIndex)
	
	if (forms[formName].ACTION_cancel) {
		var closeOK = forms[formName].ACTION_cancel(event)
	}
	
	//hide
	if (typeof closeOK != 'boolean' || closeOK) {
		globals.TRIGGER_floater_set(false)
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"0595EA34-BADE-4FC1-9AB7-24E71B0F5DF3"}
 */
function ACTION_save(event) {
	var formName = elements.tab_content.getTabFormNameAt(elements.tab_content.tabIndex)
	
	if (forms[formName].ACTION_save) {
		var closeOK = forms[formName].ACTION_save(event)
	}
	
	//hide
	if (typeof closeOK != 'boolean' || closeOK) {
		globals.TRIGGER_floater_set(false)
	}
}
