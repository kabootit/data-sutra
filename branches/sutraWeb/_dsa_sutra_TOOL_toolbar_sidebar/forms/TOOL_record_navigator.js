/**
 *
 * @properties={typeid:24,uuid:"99491a64-2a9a-466b-9b0d-aca6ecc22abd"}
 */
function FORM_on_show(firstShow,event) {
	if (application.__parent__.solutionPrefs) {
		//when first shown on web, make sure to double fire it after elements available in the DOM
			//TODO: should also refire every time the window size was changed since last shown
			//(servoy server doesn't know what size the elements currently are)
		if (solutionPrefs.config.webClient && firstShow) {
			//don't show indicator when this runs (we hope people don't notice it happens after the fact)
			var callback = plugins.WebClientUtils.generateCallbackScript(globals.TRIGGER_toolbar_record_navigator_set,null,false)
			var jsCallback = 'function recNavFirstShow(){' + callback + '}';
			plugins.WebClientUtils.executeClientSideJS('recordNavigatorFirstShow(' + jsCallback + ');')
		}
		
		//when 'previewing' this toolbar, disabled (on the form)
		if (solutionPrefs.config.currentFormName != 'MGR_0F_toolbar') {	
			//update record navigator
			globals.TRIGGER_toolbar_record_navigator_set()
		}
	}
}
