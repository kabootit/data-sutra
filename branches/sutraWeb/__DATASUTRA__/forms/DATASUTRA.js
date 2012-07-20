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
		//solutionModel to replace out subheader images
		var smForms = solutionModel.getForms()
		for (var i = 0; i < smForms.length; i++) {
			var smForm = smForms[i]
			var smLabels = smForm.getLabels()
			
			for (var j = 0; j < smLabels.length; j++) {
				var smLabel = smLabels[j]
				
				if (smLabel.imageMedia && smLabel.imageMedia.getName() == 'bck_subheader.png') {
					smLabel.imageMedia = null
					smLabel.styleClass = 'gfx_subheader'
					smLabel.borderType = SM_DEFAULTS.DEFAULT
				}
			}
		}
		
		forms.DATASUTRA_WEB_0F.controller.show()
	}
	//show empty form
	else {
		forms.CODE__blank.controller.show()
	}
}
/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"030CC132-F4E5-466B-95CF-F863B4FAE949"}
 */
function FORM_on_show(firstShow, event) {
	//these shenanigans have to do with switching to another form in the onload of the solutions default form
	if (firstShow && (application.getApplicationType() == APPLICATION_TYPES.SMART_CLIENT || application.getApplicationType() == APPLICATION_TYPES.RUNTIME_CLIENT)) {
		history.go(-2)
		history.go(+1)
		history.removeForm('DATASUTRA')
		history.removeForm('DATASUTRA_0F_solution__blank_4')
	}
}
