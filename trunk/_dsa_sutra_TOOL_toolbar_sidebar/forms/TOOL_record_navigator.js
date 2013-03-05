/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"DC9210E9-7EC2-440E-BE24-E940CFDFD3E4",variableType:-4}
 */
var _shown = false;

/**
 *
 * @properties={typeid:24,uuid:"99491a64-2a9a-466b-9b0d-aca6ecc22abd"}
 */
function FORM_on_show(firstShow,event) {
	if (application.__parent__.solutionPrefs) {
		//when first shown on web, make sure to double fire it after elements available in the DOM
			//TODO: should also refire every time the window size was changed since last shown
			//(servoy server doesn't know what size the elements currently are)
		if (solutionPrefs.config.webClient && !_shown) {
			forms.DATASUTRA_WEB_0F__header.elements.split_tool_find.dividerLocation = forms.DATASUTRA_WEB_0F__header.elements.split_tool_find.dividerLocation - 1
			forms.DATASUTRA_WEB_0F__header.elements.split_tool_find.dividerLocation = forms.DATASUTRA_WEB_0F__header.elements.split_tool_find.dividerLocation + 1
			
			//don't show indicator when this runs (we hope people don't notice it happens after the fact)
			var callback = plugins.WebClientUtils.generateCallbackScript(globals.TRIGGER_toolbar_record_navigator_set,null,false)
			var jsCallback = 'function recNavFirstShow(){' + callback + '}';
			plugins.WebClientUtils.executeClientSideJS('recordNavigatorFirstShow(' + jsCallback + ');')
			_shown = true
			
			plugins.WebClientUtils.setExtraCssClass(elements.obj_records_max,'gfxRecNavigator')
		}
		
		//when 'previewing' this toolbar, disabled (on the form)
		if (solutionPrefs.config.currentFormName != 'MGR_0F_toolbar' && solutionPrefs.config.recordNavigatorStatus) {	
			//update record navigator
			globals.TRIGGER_toolbar_record_navigator_set()
		}
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"E7933AB3-B528-4987-9C34-211301683361"}
 */
function GO_next(event) {
	//make sure we know about the correct sizing of the form
	if (solutionPrefs.config.webClient) {
		plugins.WebClientUtils.executeClientSideJS('recNavFirstShow();')
	}
	
	globals.NAV_record_next()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"14A63430-18D6-4250-A50D-9C0834DF9313"}
 */
function GO_previous(event) {
	//make sure we know about the correct sizing of the form
	if (solutionPrefs.config.webClient) {
		plugins.WebClientUtils.executeClientSideJS('recNavFirstShow();')
	}
	
	globals.NAV_record_previous()
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"7E9D620D-DFB8-4D93-B3F8-C68B2D19D41B"}
 */
function FORM_on_load(event) {
	if (solutionPrefs.config.webClient) {
		elements.obj_records_max.fgcolor = '#CCCCCC'
		elements.obj_records_max.bgcolor = '#CCCCCC'
		elements.obj_records.bgcolor = '#CCCCCC'
		elements.obj_records.fgcolor = '#CCCCCC'
	}
}
