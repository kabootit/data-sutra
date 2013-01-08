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
	
	//when not running on ipad, request focus into user/pass field
	if (deviceFactor != 'iPad') {
		if (forms.AC_R__login_WEB._focusPass) {
			forms.AC_R__login_WEB.elements.var_userPass.requestFocus()
		}
		else if (forms.AC_R__login_WEB._focusUser) {
			forms.AC_R__login_WEB.elements.var_userName.requestFocus()
		}
	}
}

/**
 * On show method for form that will hook up css class to subheader graphic
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"5F9F8E54-8AED-4C2B-8DDC-542AC91B0D40"}
 */
function webStyleCSS(firstShow, event) {
	if (firstShow && event instanceof JSEvent) {
		var formName = event.getFormName()
		var allElems = forms[formName].elements.allnames
		var smForm = solutionModel.getForm(formName)
		
		for (var i = 0; i < allElems.length; i++) {
			var elem = allElems[i]
			var smElem = smForm.getComponent(elem)
			
			//subheader images
			if (smElem && smElem.styleClass == 'gfx_subheader') {
				plugins.WebClientUtils.setExtraCssClass(forms[formName].elements[elem], 'gfxSubHeader')
			}
			
			//light boxes to delineate input field areas
			if (smElem && smElem.styleClass == 'color_light') {
				plugins.WebClientUtils.setExtraCssClass(forms[formName].elements[elem], 'gfxColorLight')
			}
		}
	}
}

/**
 * Convert passed in form/id to use small scrollbars
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"DF6762C3-C8E0-4A4A-92B1-8CF985EC5BFF"}
 */
function webSmallScroller(formName) {
	//currently can only attach to ULs...need to also do for other list-based forms
	if (solutionPrefs.config.webClient && smallScroll && solutionPrefs.config.currentFormID && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData) {
		if (!formName) {
			formName = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.tabFormInstance
		}
		
		plugins.WebClientUtils.executeClientSideJS('scrollbarSmall("' + formName + '");')
	}
}

/**
 * @param {Boolean} [ulClick]
 * @param {Boolean} [extraPause]
 *
 * @properties={typeid:24,uuid:"E2571884-7D85-4BDC-9A61-AC1351B784C9"}
 */
function webULPrettify(ulClick,extraPause) {
	if (solutionPrefs.config.webClient) {
		//check to see how many records are loaded
		var chunks = Math.ceil(forms[solutionPrefs.config.currentFormName].foundset.getSize() / 50)
		
		//no delay when clicking in UL
		if (ulClick) {
			plugins.WebClientUtils.executeClientSideJS('prettifyUL();')
		}
		//delay and scrollbars
		else {
			if (extraPause) {
				plugins.WebClientUtils.executeClientSideJS('setTimeout(function(){prettifyUL(100,' + chunks + ')},500);')
			}
			else {
				plugins.WebClientUtils.executeClientSideJS('prettifyUL(100,' + chunks + ');')
			}
			webSmallScroller()
		}
	}
}

/**
 * @properties={typeid:24,uuid:"82CC64E3-C1BC-4A88-8D8A-3CD6A35BDE98"}
 */
function webULResizeMonitor() {
	plugins.WebClientUtils.executeClientSideJS('lefthandListen();')
}

/**
 * @param [toggle=true]
 *
 * @properties={typeid:24,uuid:"A8A520A8-7B81-4974-805B-E7E3A49CFE3E"}
 */
function webNavSwitchProgress(toggle) {
	if (solutionPrefs.config.webClient) {
		if (typeof toggle != 'boolean') {
			toggle = true
		}
		
//		var fade = toggle ? 'fadeIn' : 'fadeOut'
//		plugins.WebClientUtils.executeClientSideJS("$('#HUDcenter1')." + fade + "();")
		plugins.WebClientUtils.executeClientSideJS("bigIndicator(" + (toggle ? 'true' : 'false') + ");")
	}
}

/**
 * @properties={typeid:24,uuid:"49E0E69D-3364-44CD-823C-FCCA36A9385F"}
 */
function webCallbacks() {
	//on orientation change events
	if (scopes.DS.deviceFactor == 'iPad') {
		var callback = plugins.WebClientUtils.generateCallbackScript(globals.DS_space_change,['"btn_space_7"'],true)
		var jsCallback = 'function orientPortrait(){' + callback + '}';
		plugins.WebClientUtils.executeClientSideJS('callbackConfig(' + jsCallback + ');')
		
		var callback = plugins.WebClientUtils.generateCallbackScript(globals.DS_space_change,['"btn_space_1"'],true)
		var jsCallback = 'function orientLandscape(){' + callback + '}';
		plugins.WebClientUtils.executeClientSideJS('callbackConfig(' + jsCallback + ');')
	}
	
	//running in the router
	if (globals.DATASUTRA_router_enable) {
		var callback = plugins.WebClientUtils.generateCallbackScript(globals.DS_router_callback,null,false)
		var jsCallback = 'function navigate(){' + callback + '}';
		plugins.WebClientUtils.executeClientSideJS('callbackConfig(' + jsCallback + ');')
	}
}