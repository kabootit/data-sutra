/**
 * 
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"A1AEC829-1410-4497-A9B6-6DE734FA294D"}
 */
function HERE_auto(event) {
	globals.TRIGGER_dialog_small(true,'floater','CODE__blank',true,elements[event.getElementName()].getLocationX() + 200,elements[event.getElementName()].getLocationY() + 44)
}

/**
 * 
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"0A266C84-1EDF-4EF1-B8E3-EF702908A933"}
 */
function HERE_big(event) {
	globals.TRIGGER_dialog_small(true,'floater','CODE__blank',true,elements[event.getElementName()].getLocationX() + 200,elements[event.getElementName()].getLocationY() + 44,640,480)
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"234780EB-5CCB-44BB-AD6C-C577352C1C4D"}
 */
function HERE_modal(event) {
	globals.TRIGGER_dialog_small(true,'floater','CODE__blank',false,elements[event.getElementName()].getLocationX() + 200,elements[event.getElementName()].getLocationY() + 44)
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"2CA4350A-931A-4584-8F3C-C3E5A00775C7"}
 */
function HERE_popdown(event) {
	//minus offset to center of graphic plus space offset
	var x = elements.btn_popdown.getLocationX() - 10 + 200
	//position plus header plus (if toolbars showing) plus offset to top of workflow form
	var y = elements.btn_popdown.getLocationY() + 44 + 20
	
	//show the form
	globals.TRIGGER_dialog_small(
				true,
				'touch',
				'CODE__blank',
				false,
				x,y,null,null,
				null,
				null,
				null,
				true,
				0
			)
}
