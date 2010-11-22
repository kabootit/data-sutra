/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"9FAF96FC-245A-4FBD-A2C0-A263A86D37CD"}
 */
function FORM_on_load(event) {
	elements.bean_drag.cursor = Packages.java.awt.Cursor.getPredefinedCursor(Packages.java.awt.Cursor.N_RESIZE_CURSOR)
	elements.bean_drag.addMouseMotionListener(new Packages.java.awt.event.MouseMotionAdapter({mouseDragged:ELEM_divider_drag}))
}

/**
 *
 * @properties={typeid:24,uuid:"5BF683C1-DA95-4EC5-A1D2-2455BF2E2B84"}
 */
function ELEM_divider_drag() {
	
	var mouseEvent = arguments[0]
	
	var splitPane = forms.AC_0F_organization__saas_1F__people.elements.bean_main
	
	splitPane.dividerLocation = splitPane.dividerLocation + mouseEvent.getY()
	
	
		
}
