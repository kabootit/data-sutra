
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"C9D30714-B177-4EAF-A303-EACB175DA75D"}
 */
function FIND_fields(event) {
	globals.NAV_find_fields(event)
}
/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"2F82B9AA-8D52-4DCD-8734-B744043EE275"}
 */
function FORM_on_hide(event) {
	return true
}


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"BC0555DA-21D9-4440-AD68-F6A6B936C090"}
 */
function FIND_clear(event) {
	globals.NAV_find_clear()
	
//	plugins.window.closeFormPopup(false)
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"9396FD73-63FD-45EF-B3F9-D104B7AA5A46"}
 */
function FIND_normal(event) {
	globals.NAV_find_end_normal()
	
	plugins.window.closeFormPopup(false)
}

