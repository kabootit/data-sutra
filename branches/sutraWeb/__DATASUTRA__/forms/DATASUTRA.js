
/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"12B9B302-DDE1-4C45-8140-88F5EA4A3A6C"}
 */
function FORM_on_load(event) {
	//smart client, go there
	if (application.getApplicationType() == APPLICATION_TYPES.SMART_CLIENT || application.getApplicationType() == APPLICATION_TYPES.RUNTIME_CLIENT) {	
		forms.DATASUTRA_0F_solution.controller.show()
	}
	//web client, go there
	else if (application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT) {
		forms.DATASUTRA_WEB_0F.controller.show()
	}
	//show empty form
	else {
		forms.CODE__blank.controller.show()
	}
}
