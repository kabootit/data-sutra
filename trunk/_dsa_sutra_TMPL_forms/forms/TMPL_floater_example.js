/**
 * 
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"A1AEC829-1410-4497-A9B6-6DE734FA294D"}
 */
function HERE_auto(event) {
	globals.TRIGGER_floater_set(true,'CODE__blank',true,elements[event.getElementName()].getLocationX() + 200,elements[event.getElementName()].getLocationY() + 44)
}

/**
 * 
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"0A266C84-1EDF-4EF1-B8E3-EF702908A933"}
 */
function HERE_big(event) {
	globals.TRIGGER_floater_set(true,'CODE__blank',true,elements[event.getElementName()].getLocationX() + 200,elements[event.getElementName()].getLocationY() + 44,640,480)
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"234780EB-5CCB-44BB-AD6C-C577352C1C4D"}
 */
function HERE_modal(event) {
	globals.TRIGGER_floater_set(true,'CODE__blank',false,elements[event.getElementName()].getLocationX() + 200,elements[event.getElementName()].getLocationY() + 44)
}
