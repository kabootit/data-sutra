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
		//web client from swc block; don't launch into data sutra in the web
		if (globals.WEB_swc_arguments && globals.WEB_swc_arguments.hasOwnProperty('form')) {
			globals.WEB_servoy_wc_controller(null,globals.WEB_swc_arguments)
			return
		}
		
		//solutionModel to replace out images and attach style classes
		var smForms = solutionModel.getForms()
		for (var i = 0; i < smForms.length; i++) {
			var smForm = smForms[i]
			var smLabels = smForm.getLabels()
			var smFields = smForm.getFields()
			var touched = false
			
			for (var j = 0; j < smLabels.length; j++) {
				var smLabel = smLabels[j]
				
				//subheader
				if (smLabel.imageMedia && smLabel.imageMedia.getName() == 'bck_subheader.png') {
					smLabel.imageMedia = null
					smLabel.styleClass = 'gfx_subheader'
					smLabel.borderType = SM_DEFAULTS.DEFAULT
					
					//make sure that there is a name so can attach css class to it
					if (!smLabel.name) {
						smLabel.name = application.getUUID().toString().replace('-','')
					}
					
					touched = true
				}
				
				//lightly colored poke boxes
				if (smLabel.styleClass == 'color_light') {
					//make sure that there is a name so can attach css class to it
					if (!smLabel.name) {
						smLabel.name = application.getUUID().toString().replace('-','')
					}
					
					touched = true
				}
			}
			
			for (var j = 0; j < smFields.length; j++) {
				var smField = smFields[j]
				
				//only comboboxes
				if (smField.displayType == JSField.COMBOBOX) {
					//comboboxes in grid
					if (smField.styleClass == 'standard_table' || smField.styleClass == 'bold_table') {
						//create label for bordering
						smLabel = smForm.newLabel('',smField.x,smField.y,smField.width,smField.height)
						smLabel.anchors = smField.anchors
//						smLabel.formIndex = 0
						smLabel.showClick = false
						smLabel.showFocus = false
						smLabel.styleClass = 'standard_table_check'
						smLabel.transparent = true
						smLabel.name = smField.name + '__outline'
						
						//adjust size
						smField.width = smField.width - 6
						smField.height = smField.height - 4
						smField.x = smField.x + 4
						smField.y = smField.y + 1
					}
					
					//comboboxes at bottom of grid
					if (smField.styleClass == 'standard_table_bottom' || smField.styleClass == 'bold_table_bottom') {
						//create label for bordering
						smLabel = smForm.newLabel('',smField.x,smField.y,smField.width,smField.height)
						smLabel.anchors = smField.anchors
//						smLabel.formIndex = 0
						smLabel.showClick = false
						smLabel.showFocus = false
						smLabel.styleClass = 'standard_table_check_bottom'
						smLabel.transparent = true
						smLabel.name = smField.name + '__outline'
						
						//adjust size
						smField.width = smField.width - 6
						smField.height = smField.height - 4
						smField.x = smField.x + 4
						smField.y = smField.y + 1
					}
					
					//comboboxes flagged to be mini
					if (smForm.onLoad && smForm.onLoad.code && smForm.onLoad.code.match(/globals.CODE_property_combobox\((.*)mini/) && smForm.onLoad.code.match(/globals.CODE_property_combobox\((.*)mini/).length) {
						//adjust size
						smField.width = smField.width - 2
						smField.height = smField.height - 3
						smField.y = smField.y + 1
					}
					
					//comboboxes we want to appear not so large
					if (smField.styleClass == 'normal') {
						//adjust size
						smField.width = smField.width - 3
						smField.height = smField.height - 3
						smField.x = smField.x + 2
						smField.y = smField.y + 1
					}
				}
				
				//design time property for placeholder text
				if (smField.getDesignTimeProperty('placeholderText')) {
					//make sure element has a name
					if (!smField.name) {
						smField.name = application.getUUID().toString().replace('-','')
					}
					
					touched = true
				}
			}
			
			//this form was modified, attach a new on show method
			if (touched) {
				//there is already an onshow
				if (smForm.onShow && smForm.onShow.getName()) {
					//now update the code
					smForm.onShow.code = smForm.onShow.code.substr(0,smForm.onShow.code.length - 2) + ";scopes.DS.webStyleCSS(arguments[0],arguments[1])" + smForm.onShow.code.substr(smForm.onShow.code.length - 2)
				}
				//need new on show method
				else {
					//now create new on show method
					smForm.onShow = solutionModel.getGlobalMethod('DS','webStyleCSS')
				}
			}
		}
		
		//slick grid component available, replace out all tables flagged
		if (scopes.SLICK) {
			scopes.SLICK.hookup()
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

		if (history.getFormName(history.getCurrentIndex()) == 'DATASUTRA__error') {
			history.removeForm('DATASUTRA_0F_solution')			
		}
		else {
			history.go(+1)
		}

		history.removeForm('DATASUTRA')
		history.removeForm('DATASUTRA_0F_solution__blank_4')		
	}
}
