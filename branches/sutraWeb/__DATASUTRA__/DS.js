/**
 * Valid values are Desktop, iPad, iPhone
 * @type {String}
 *
 * @properties={typeid:35,uuid:"780AFC6C-1B34-4D59-B6DE-EAAE9C393BD6"}
 */
var deviceFactor = 'Desktop';

/**
 * @param {String} device The device factor used to view Data Sutra
 * 
 * @properties={typeid:24,uuid:"A7441E3D-7529-4930-8597-968C00F5948C"}
 */
function setFactor(device) {
	if (device && device != 'null') {
		deviceFactor = device
	}
}

/**
 * On show method for form that will hook up css class to subheader graphic
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"5F9F8E54-8AED-4C2B-8DDC-542AC91B0D40"}
 */
function subheaderWeb(firstShow, event) {
	if (firstShow && event instanceof JSEvent) {
		var formName = event.getFormName()
		var allElems = forms[formName].elements.allnames
		var smForm = solutionModel.getForm(formName)
		
		for (var i = 0; i < allElems.length; i++) {
			var elem = allElems[i]
			var smElem = smForm.getComponent(elem)
			
			if (smElem.styleClass == 'gfx_subheader') {
				plugins.WebClientUtils.setExtraCssClass(forms[formName].elements[elem], 'gfxSubHeader')
			}
		}
	}
}