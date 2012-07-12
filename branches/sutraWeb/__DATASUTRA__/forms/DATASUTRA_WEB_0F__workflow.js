/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"DC4ED6D0-D2B6-4177-B429-9E4D6E8BA5F5"}
 */
function FORM_on_load(event) {
	
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"A864A2AB-2C31-4F08-A03B-48F92AB26A11"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		//configure main tab
		elements.tab_workflow.dividerSize = 0
		//TODO: figure out the correct divider location dimesnions
		elements.tab_workflow.dividerLocation = 3000//elements.tab_workflow.getHeight()
		elements.tab_workflow.continuousLayout = true
		elements.tab_workflow.bgcolor = '#d1d7e2'
		elements.tab_workflow.resizeWeight = 1
	}
}

/**
 * @properties={typeid:24,uuid:"A85181C0-9059-4283-99A0-F56EDAA24405"}
 */
function reelTest() {
	//some code
}