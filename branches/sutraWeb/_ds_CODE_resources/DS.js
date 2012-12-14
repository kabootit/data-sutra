/**
 * Enable small scrollbars
 * 
 * @type {Boolean}
 * @properties={typeid:35,uuid:"BC212301-4A96-48A9-90AB-CC0C2CF1C0A0",variableType:-4}
 */
var smallScroll = false;

/**
 * DS transaction hooks
 * 
 * @properties={typeid:35,uuid:"2E1E3EEB-3A16-4AF0-B50B-C9D93779D6CB",variableType:-4}
 */
var transaction = new function() {
	/**
	 * Begin default transaction
	 * 
	 * @param {JSRecord} [record] Record to be edited
	 * @return {Boolean} Transaction begun
	 */
	this.start = function(record) {
		databaseManager.saveData()
		
		return databaseManager.setAutoSave(false)
	}
	
	/**
	 * Save data and exit transaction
	 * 
	 * @param {JSRecord} [record] Record to be edited
	 * @param {Boolean} [onlyRecord] Only save data in record
	 * @return {Boolean} Transaction begun
	 */
	this.save = function(record,onlyRecord) {
		if (onlyRecord) {
			databaseManager.saveData(record)
			databaseManager.revertEditedRecords()
		}
		else {
			databaseManager.saveData()
		}
		
		return databaseManager.setAutoSave(true)
	}
	
	/**
	 * End default transaction
	 * 
	 * @param {JSRecord} [record] Record to be edited
	 * @return {Boolean} Transaction begun
	 */
	this.cancel = function(record) {
		databaseManager.revertEditedRecords()
		
		return databaseManager.setAutoSave(true)
	}
}

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
function webFactorSet(device) {
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
function webSubheader(firstShow, event) {
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

/**
 * Convert passed in form/id to use small scrollbars
 * 
 * @properties={typeid:24,uuid:"DF6762C3-C8E0-4A4A-92B1-8CF985EC5BFF"}
 */
function webSmallScroller(formName) {
	if (solutionPrefs.config.webClient && smallScroll) {
		plugins.WebClientUtils.executeClientSideJS('setTimeout(function(){scrollbarSmall("' + formName + '");},1500);')
	}
}