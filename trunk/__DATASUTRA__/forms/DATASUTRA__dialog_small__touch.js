/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"C036A355-7BB2-4B41-B095-161FFD4CA65E"}
 */
function ACTION_cancel(event) {
	var formName = elements.tab_content.getTabFormNameAt(elements.tab_content.tabIndex)
	
	if (forms[formName].ACTION_cancel) {
		var closeOK = forms[formName].ACTION_cancel(event)
	}
	
	//hide
	if (typeof closeOK != 'boolean' || closeOK) {
		globals.TRIGGER_dialog_small(false)
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"209E1EE7-2A47-4140-AECD-DB1ACC9C1722"}
 */
function ACTION_save(event) {
	var formName = elements.tab_content.getTabFormNameAt(elements.tab_content.tabIndex)
	
	if (forms[formName].ACTION_save) {
		var closeOK = forms[formName].ACTION_save(event)
	}
	
	//hide
	if (typeof closeOK != 'boolean' || closeOK) {
		globals.TRIGGER_dialog_small(false)
	}
}
