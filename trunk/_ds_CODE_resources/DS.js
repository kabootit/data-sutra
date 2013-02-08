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
	 * @type Boolean
	 */
	var status = false
	
	/**
	 * Begin default transaction
	 * 
	 * @param {JSRecord} [record] Record to be edited
	 * @return {Boolean} Transaction begun
	 */
	this.start = function(record) {
		databaseManager.saveData()
		
		status = databaseManager.setAutoSave(false)
		
		return status
	}
	
	/**
	 * Save data and exit transaction
	 * 
	 * @param {JSRecord} [record] Record to be edited
	 * @param {Boolean} [onlyRecord] Only save data in record
	 * @return {Boolean} Transaction successfully completed
	 */
	this.save = function(record,onlyRecord) {
		if (onlyRecord) {
			databaseManager.saveData(record)
			databaseManager.revertEditedRecords()
		}
		else {
			databaseManager.saveData()
		}
		
		status = databaseManager.setAutoSave(true)
		
		return status
	}
	
	/**
	 * End default transaction
	 * 
	 * @param {JSRecord} [record] Record to be edited
	 * @return {Boolean} Transaction cancelled
	 */
	this.cancel = function(record) {
		databaseManager.revertEditedRecords()
		
		status = databaseManager.setAutoSave(true)
		
		return status
	}
	
	/**
	 * Are in a transaction
	 * 
	 * @return {Boolean} Transaction cancelled
	 */
	this.getStatus = function() {
		return status
	}
	
	/**
	 * Toggle elements for given form
	 * 
	 * @param {JSForm} form Form to modify
	 * @param {Boolean} [toggle=true] Show/hide status
	 */
	this.toggle = function(form,toggle) {
		if (form) {
			//default to showing
			if (typeof toggle != 'boolean') {
				toggle = true
			}
			/** @type {Array} */
			var allElems = form.elements.allnames
			
			//elements that need to be treated differently
			var pairedElems = allElems.filter(function(item){
				return item.indexOf('__no_edit') > 0
			})
			//remove special element pairs
			var normalElems = allElems.filter(function(item) {
				return !pairedElems.some(function(item2){
					return utils.stringPatternCount(item2,item) > 0
				})
			})
			
			//special elements get visibility toggle
			for (var i = 0; i < pairedElems.length; i++) {
				var pairNoedit = pairedElems[0]
				var pairEdit = pairNoedit.substr(0,pairNoedit.length - '__no_edit'.length)
				
				if (form.elements[pairEdit]) {
					form.elements[pairEdit].visible = toggle
				}
				form.elements[pairNoedit].visible = !toggle
			}
			
			//normal elements get editability and transparency toggled
			for (var i = 0; i < normalElems.length; i++) {
				var elem = normalElems[i]
				
				//can set editable on this property
				if (form.elements[elem] && typeof form.elements[elem].editable != 'undefined') {
					form.elements[elem].editable = toggle
					
					//can set transparent on this property
					if (typeof form.elements[elem].transparent != undefined) {
						form.elements[elem].transparent = toggle
					}
				}
			}
		}
	}
}

/**
 * DS printing utilities
 *
 * @properties={typeid:35,uuid:"90D7E35E-0BAB-4199-80D7-AB0A0D406057",variableType:-4}
 */
var print = new function() {
	/**
	 * Show print preview
	 * 
	 * @param {JSRecord} reportName File name for report
	 * @param {Blob} reportBytes PDF byte array
	 * 
	 */
	this.preview = function(reportName,reportBytes) {
		//enough information to proceed
		if (reportName && reportBytes) {
			//webclient
			if (solutionPrefs.config.webClient) {
				//router
				if (scopes.globals.DATASUTRA_router_enable) {
					var reportPath = print.utils.getReportDir()
					var userDir = print.utils.getUserDir()
					
					//print file
					var printFile = plugins.file.createFile(reportPath + userDir + reportName)
					var success = printFile.setBytes(reportBytes,true)
					
					//load pdf in browser and show it
					if (success) {
						plugins.WebClientUtils.executeClientSideJS('window.parent.printLoad("/reports' + userDir + reportName + '");')
					}
					else {
						globals.DIALOGS.showErrorDialog('Error','Report was not run successfully.')
					}
				}
			}
			//smart client, use standard print preview
			else {
				plugins.dialogs.showInfoDialog(
							'Smart client',
							'API call not implemented\nUse the web!'
					)
			}
		}
	}
	
	/**
	 * Do Servoy form report
	 * 
	 * @param {String} formName Servoy form
	 * @return {byte[]} PDF
	 */
	this.formBased = function(formName) {
		//enough information to proceed
		if (formName && forms[formName]) {
			//webclient
			if (solutionPrefs.config.webClient) {
				//router
				if (scopes.globals.DATASUTRA_router_enable) {
					//get pdf
					var printerMeta = plugins.pdf_output.startMetaPrintJob()
					forms[formName].controller.print(false, false, plugins.pdf_output.getPDFPrinter())
					return plugins.pdf_output.endMetaPrintJob()
				}
			}
			//smart client, use standard print preview
			else {
				plugins.dialogs.showInfoDialog(
							'Smart client',
							'API call not implemented\nUse the web!'
					)
			}
		}
	}
	
	/**
	 * Printing utilities
	 */
	this.utils = new function() {
		/**
		 * Default location to store reports
		 * 
		 * @return {String} 
		 */
		this.getReportDir = function() {
			var allProps = plugins.sutra.getJavaProperties()
			for (var i = 0; i < allProps.length; i++) {
				var prop = allProps[i]
				if (prop[0] == 'catalina.base') {
					var serverInstall = prop[1]
					break
				}
			}
			
			return serverInstall + '/webapps/ROOT/ds/reports'
		}
		
		/**
		 * Default location to store reports
		 * 
		 * @return {String} 
		 */
		this.getUserDir = function() {
			var userDir = '/' + security.getClientID().replace(/-/g,'') + '/'
			
			//make sure user directory created
			var userTest = plugins.file.convertToJSFile(print.utils.getReportDir() + userDir)
			if (!userTest.exists()) {
				userTest.mkdirs()
			}
			
			return userDir
		}
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
 * On show method for form that will hook up additional css classes
 * 
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
 * @properties={typeid:24,uuid:"D82963A5-C7B5-4255-A254-D10E39FC59BE"}
 */
function webStyleCSS4() {
	if (solutionPrefs.config.webClient) {
		plugins.WebClientUtils.executeClientSideJS("styleCSS4Parent();");
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
 * @param {Boolean} [toggle=true]
 * @param {Number} delay
 *
 * @properties={typeid:24,uuid:"A8A520A8-7B81-4974-805B-E7E3A49CFE3E"}
 */
function webBlockerCentered(toggle,delay) {
	if (solutionPrefs.config.webClient) {
		if (typeof toggle != 'boolean') {
			toggle = true
		}
		
//		var fade = toggle ? 'fadeIn' : 'fadeOut'
//		plugins.WebClientUtils.executeClientSideJS("$('#HUDcenter1')." + fade + "();")
		plugins.WebClientUtils.executeClientSideJS("bigIndicator(" + (toggle ? 'true' : 'false') + "," + delay + ");")
	}
}

/**
 * @properties={typeid:24,uuid:"49E0E69D-3364-44CD-823C-FCCA36A9385F"}
 */
function webCallbacks() {
	//on orientation change events
	if (scopes.DS.deviceFactor == 'iPad') {
//		var spaceChange = plugins.WebClientUtils.generateCallbackScript(globals.DS_space_change,['"btn_space_7"'],true)
//		var sidebarToggle = plugins.WebClientUtils.generateCallbackScript(globals.DS_sidebar_enable,[false],true).replace('wcall','wcall2')
//		var toolbarToggle = plugins.WebClientUtils.generateCallbackScript(globals.DS_toolbar_enable,[false],true).replace('wcall','wcall3')
//		var jsCallback = 'function orientPortrait(){' + spaceChange + '\n\n' + sidebarToggle + '\n\n' + toolbarToggle + '}';
//		plugins.WebClientUtils.executeClientSideJS('callbackConfig(' + jsCallback + ');')
//		
//		var spaceChange = plugins.WebClientUtils.generateCallbackScript(globals.DS_space_change,['"btn_space_1"'],true)
//		var sidebarToggle = plugins.WebClientUtils.generateCallbackScript(globals.DS_sidebar_enable,[true],true).replace('wcall','wcall2')
//		var toolbarToggle = plugins.WebClientUtils.generateCallbackScript(globals.DS_toolbar_enable,[true],true).replace('wcall','wcall3')
//		var jsCallback = 'function orientLandscape(){' + spaceChange + '\n\n' + sidebarToggle + '\n\n' + toolbarToggle + '}';
//		plugins.WebClientUtils.executeClientSideJS('callbackConfig(' + jsCallback + ');')
	}
	
	//running in the router
	if (globals.DATASUTRA_router_enable) {
		var callback = plugins.WebClientUtils.generateCallbackScript(globals.DS_router_callback,null,false)
		var jsCallback = 'function dsNavigate(){' + callback + '}';
		plugins.WebClientUtils.executeClientSideJS('callbackConfig(' + jsCallback + ');')
	}
}