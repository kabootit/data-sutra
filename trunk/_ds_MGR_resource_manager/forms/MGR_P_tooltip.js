
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"EE13142C-3DE0-4798-B54C-02C95F894102"}
 */
function ACTION_done(event) {
	//enable closing the form
	globals.CODE_hide_form = 1
	
	globals.CODE_form_in_dialog_close('tooltipFID')
}
