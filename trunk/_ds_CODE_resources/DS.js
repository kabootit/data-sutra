/**
 * Enable small scrollbars
 * 
 * @type {Boolean}
 * @properties={typeid:35,uuid:"BC212301-4A96-48A9-90AB-CC0C2CF1C0A0",variableType:-4}
 */
var smallScroll = false;

/**
 * Valid values are Desktop, iPad, iPhone
 * @type {String}
 *
 * @properties={typeid:35,uuid:"780AFC6C-1B34-4D59-B6DE-EAAE9C393BD6"}
 */
var deviceFactor = 'Desktop';

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
	 * @param {Form} form Form to modify
	 * @param {Boolean} [toggle=true] Show/hide status
	 */
	this.toggle = function(form,toggle) {
		if (form) {
			//default to showing
			if (typeof toggle != 'boolean') {
				toggle = true
			}
			
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
				
				//checks are not editable, try enabled
				if (solutionModel.getForm(form.controller.getName()).getComponent(elem).displayType == JSField.CHECKS && typeof form.elements[elem].enabled != 'undefined') {
					form.elements[elem].enabled = toggle
					
					//can set transparent on this property
					if (typeof form.elements[elem].transparent != undefined) {
						form.elements[elem].transparent = toggle
					}
				}
				//can set editable on this property
				else if (form.elements[elem] && typeof form.elements[elem].editable != 'undefined') {
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
	 * @param {String} [reportName] File name for report
	 * @param {byte[]|String} source PDF byte array (for reports generated) or URL of pre-generated PDF
	 * @return {String|undefined} Link to PDF
	 * 
	 */
	this.preview = function(reportName,source) {
		//this is a byte array
		if (source instanceof Array) {
			//no report name specified
			if (!reportName) {
				reportName = application.getUUID().toString() + '.pdf'
			}
			
			//webclient
			if (solutionPrefs.config.webClient) {
				//router
				if (globals.DATASUTRA_router_enable) {
					var reportPath = scopes.DS_internal.utils.getReportDir()
					var userDir = scopes.DS_internal.utils.getUserDir()
					
					//print file
					var printFile = plugins.file.createFile(reportPath + userDir + reportName)
					var success = printFile.setBytes(source,true)
					
					//load pdf in browser and show it
					if (success) {
						plugins.WebClientUtils.executeClientSideJS('window.parent.printLoad("/reports' + userDir + reportName + '");')
						return '/reports' + userDir + reportName
					}
					else {
						globals.DIALOGS.showErrorDialog('Error','Report was not run successfully.')
					}
				}
			}
			//smart client, use standard print preview
			else {
				globals.DIALOGS.showInfoDialog(
							'Smart client',
							'API call not implemented\nUse the web!'
					)
				
			}
		}
		//this is a url, feed it to the preview routine
		else if (typeof source == 'string') {
			//webclient
			if (solutionPrefs.config.webClient) {
				plugins.WebClientUtils.executeClientSideJS('window.parent.printLoad("' + source + '");')
				return source
			}
			//smart client, use standard print preview
			else {
				globals.DIALOGS.showInfoDialog(
							'Smart client',
							'API call not implemented\nUse the web!'
					)
				
			}
		}
	}
	
	/**
	 * Download requested PDF
	 * 
	 * @param {String} [reportName] File name for report
	 * @param {byte[]|String} source PDF byte array (for reports generated) or URL of pre-generated PDF
	 * @return {String|undefined} Link to PDF
	 * 
	 */
	this.download = function(reportName,source) {
		//this is a byte array
		if (source instanceof Array) {
			//no report name specified
			if (!reportName) {
				reportName = application.getUUID().toString() + '.pdf'
			}
			
			//webclient
			if (solutionPrefs.config.webClient) {
				//router
				if (globals.DATASUTRA_router_enable) {
					var reportPath = scopes.DS_internal.utils.getReportDir()
					var userDir = scopes.DS_internal.utils.getUserDir()
					
					//print file
					var printFile = plugins.file.createFile(reportPath + userDir + reportName)
					var success = printFile.setBytes(source,true)
					
					//download pdf
					if (success) {
						plugins.WebClientUtils.executeClientSideJS('window.parent.printSave("/reports' + userDir + reportName + '");')
						return '/reports' + userDir + reportName
					}
					else {
						globals.DIALOGS.showErrorDialog('Error','Report was not run successfully.')
					}
				}
			}
			//smart client, use standard print preview
			else {
				globals.DIALOGS.showInfoDialog(
							'Smart client',
							'API call not implemented\nUse the web!'
					)
			}
		}
		//this is a url, feed it to the preview routine
		else if (typeof source == 'string') {
			//webclient
			if (solutionPrefs.config.webClient) {
				plugins.WebClientUtils.executeClientSideJS('window.parent.printSave("' + source + '");')
				return source
			}
			//smart client, use standard print preview
			else {
				globals.DIALOGS.showInfoDialog(
							'Smart client',
							'API call not implemented\nUse the web!'
					)
				
			}
		}
	}
	
	/**
	 * Programatically run registered report
	 * 
	 * @param {String} registry Report registry ID
	 * @return {Boolean} Report was run
	 * 
	 */
	this.trigger = function(registry) {
		if (registry) {
			/** @type {JSFoundSet<db:/sutra/sutra_report>} */
			var fsReport = databaseManager.getFoundSet('db:/sutra/sutra_report')
			fsReport.find()
			fsReport.report_id = registry
			var results = fsReport.search()
			if (results == 1) {
				var reportRec = fsReport.getSelectedRecord()
				
				scopes.DS_buttons.REPORTS_list_control(reportRec.report_form,reportRec.report_method,reportRec.flag_wrapper,reportRec.source,reportRec.report_description,reportRec.id_report)
				
				return true
			}
			else {
				return false
			}
		}
		else {
			return false
		}
	}
	
	/**
	 * Printing utilities
	 */
	this.utils = new function() {
		
		/**
		 * Convert to PDF from...
		 */
		this.convertToPDFByteArray = new function() {
			/**
			 * Convert Servoy form to PDF
			 * 
			 * @param {String} formName Servoy form
			 * @return {byte[]|undefined} PDF
			 */
			this.fromServoyForm = function(formName) {
				//enough information to proceed
				if (formName && forms[formName]) {
					//get pdf
					plugins.pdf_output.startMetaPrintJob()
					forms[formName].controller.print(false, false, plugins.pdf_output.getPDFPrinter())
					return plugins.pdf_output.endMetaPrintJob()
				}
			}
			
			/**
			 * Convert HTML to PDF
			 * 
			 * @param {String} html Block of code to be rendered as PDF
			 * @return {byte[]|undefined} PDF
			 */
			this.fromHTMLData = function(html) {
				//enough information to proceed
				if (html && plugins.VelocityReport) {
					return plugins.VelocityReport.getPDFReport(html,{})
				}
			}
			
			/**
			 * Convert URL to PDF
			 * 
			 * @param {String} url URL to be rendered as PDF
			 * @param {Object} [auth] Authorization credentials to access url
			 * @return {byte[]|undefined} PDF
			 */
			this.fromHTMLURL = function(url,auth) {
				//enough information to proceed
				if (url) {
					var html = plugins.http.getPageData(url)
					
					//TODO: need to sanitize the resulting html
					return print.utils.convertToPDFByteArray.fromHTMLData(html)
				}
			}
		}
		
		/**
		 * Grab pre-existing PDF from...
		 */
		this.getPDFByteArray = new function() {
			/**
			 * Get PDF from file
			 * 
			 * @param {String} [location] Location of pdf
			 * @return {byte[]|undefined} PDF
			 * 
			 * @SuppressWarnings (deprecated)
			 */
			this.fromFileSystem = function(location) {
				/** @type {Function} */
				var readCall
				
				//webclient
				if (solutionPrefs.config.webClient) {
					readCall = 'plugins.file.convertToRemoteJSFile'
				}
				//smart client
				else {
					readCall = 'plugins.file.convertToJSFile'
					
					//prompt for file (only smart client)
					if (!location) {
						location = plugins.file.showFileOpenDialog(1, null, false)
						if (location) {
							location = location.getAbsolutePath()
						}
					}
				}
				
				//enough information to proceed
				if (location) {
					/** @type {JSFile} */
					var filePDF = eval(readCall + "(location)")
					if (filePDF.exists() && filePDF.getContentType() == 'application/pdf') {
						var bytes = filePDF.getBytes()
						return bytes
					}
				}
			}
			
			/**
			 * Get PDF from media library
			 * 
			 * @param {String} location Location of pdf
			 * @return {byte[]|undefined} PDF
			 */
			this.fromMediaLibrary = function(location) {
				//enough information to proceed
				if (location) {
					var smMedia = solutionModel.getMedia(location)
					
					//get pdf
					if (smMedia.mimeType == 'application/pdf') {
						return smMedia.bytes
					}
				}
			}
		}
	}
}

/**
 * Status of setting the URL
 * 
 * @type {Boolean}
 * @properties={typeid:35,uuid:"1FF81510-A80F-48D4-8BEB-548888A52A0C",variableType:-4}
 */
var webURLSetStatus = true;

/**
 * Change the URL for a given page
 * 
 * @param {String} [pageTitle] Title of the page (shows up in history/window title)
 * @param {String} [pageURL] Actual url of page
 * @param {Object} [pageData] Data to be associated with this history entry
 * @param {Number} [delay=0] How long to wait before pushing the history item (n/a with replace)
 * @param {Boolean} [replace=false] Repalce the current history or push; Default is push
 * 
 * @properties={typeid:24,uuid:"DAABCA5F-61E1-4656-B56C-058A9146DFA8"}
 */
function webURLSet(pageTitle,pageURL,pageData,delay,replace) {
	//update url with the pk for this record
	if (solutionPrefs.config.webClient && globals.DATASUTRA_router_enable) {
		//only show debug messages on troy's computer
		var itsTroy = utils.stringPatternCount(plugins.sutra.getWorkspace(),'/Users/troj/Documents/Serclipse')
		
		if (webURLSetStatus) {
			//pass in null string when no pageData specified
			if (!pageData) {
				pageData = 'null'
			}
			
			//content should already be sanitized, but check once more
			if (typeof pageURL == 'string') {
				//doesn't replace out / like the other ones do
				pageURL = pageURL.toLowerCase().replace(/([{}\(\)\^$&._%#!@=<>:;,~`\s\*\?\+\|\[\\\\]|\]|\-)/g,'-').replace(/\-{2,}/g,'-')
			}
			
			//replace current history item
			if (replace) {
				plugins.WebClientUtils.executeClientSideJS('window.parent.routerReplace(' + pageData + ',"' + pageTitle + '","' + pageURL + '");')
				if (itsTroy) {application.output(globals.CODE_debug_context(arguments.callee,null,true) + 'replaced ' + pageURL,LOGGINGLEVEL.DEBUG)}
			}
			//push to history stack
			else {
				if (typeof delay != 'number') {
					delay = 0
				}
				plugins.WebClientUtils.executeClientSideJS('window.parent.routerDelay(' + pageData + ',"' + pageTitle + '","' + pageURL + '",' + delay + ');')
				if (itsTroy) {application.output(globals.CODE_debug_context(arguments.callee,null,true) + 'pushed ' + pageURL,LOGGINGLEVEL.DEBUG)}
			}
		}
		//skipping for some reason
		else {
			//first skips (when first launching web client) needs a little help
			if (!webURLSet.firstRan) {
				webURLSet.firstRan = true
				plugins.WebClientUtils.executeClientSideJS("setTimeout(function(){$('#" + plugins.WebClientUtils.getElementMarkupId(forms.DATASUTRA_WEB_0F__header__actions.elements.btn_edit) + "').on('click',null,function(){triggerInterfaceLock(true);});},2000);")
			}
			else {
				plugins.WebClientUtils.executeClientSideJS("setTimeout(function(){triggerInterfaceLock(true);},4000);")
			}
			
			if (itsTroy) {application.output(globals.CODE_debug_context(arguments.callee,null,true) + 'skipped',LOGGINGLEVEL.DEBUG)}
		}
	}
}

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
 * @param {String} [formName]
 *
 * @properties={typeid:24,uuid:"5F9F8E54-8AED-4C2B-8DDC-542AC91B0D40"}
 */
function webStyleCSS(firstShow, event, formName) {
	if (event instanceof JSEvent) {
		if (!formName) {
			formName = event.getFormName()
		}
		var allElems = forms[formName].elements.allnames
		var smForm = solutionModel.getForm(formName)
		
		var placeHolderElem = new Array()
		var placeHolderText = new Array()
		
		for (var i = 0; i < allElems.length; i++) {
			var elem = allElems[i]
			var smElem = smForm.getComponent(elem)
			
			//only need to do the first time
			if (firstShow) {
				//subheader images
				if (smElem && smElem.styleClass == 'gfx_subheader') {
					plugins.WebClientUtils.setExtraCssClass(forms[formName].elements[elem], 'gfxSubHeader')
				}
				
				//light boxes to delineate input field areas
				if (smElem && smElem.styleClass == 'color_light') {
					plugins.WebClientUtils.setExtraCssClass(forms[formName].elements[elem], 'gfxColorLight')
				}
			}
			
			//check for place holder text
			if (smElem && smElem.getDesignTimeProperty('placeholderText')) {
				placeHolderElem.push(plugins.WebClientUtils.getElementMarkupId(forms[formName].elements[elem]))
				placeHolderText.push(forms[formName].elements[elem].getDesignTimeProperty('placeholderText'))
			}
		}
		
		//set place holder text
		if (placeHolderElem.length) {
			plugins.WebClientUtils.executeClientSideJS('setPlaceHolders(' + JSON.stringify(placeHolderElem) + ',' + JSON.stringify(placeHolderText) + ');')
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
 * @param {Boolean} [toggle=true] Status
 * @param {Number}	[delay] How long to wait before executing
 * @param {String}	[text] Text to display on blocker (default text is "Loading...").  Note: Keep text to 12 characters or less
 *
 * @properties={typeid:24,uuid:"A8A520A8-7B81-4974-805B-E7E3A49CFE3E"}
 */
function webBlockerCentered(toggle,delay,text) {
	if (solutionPrefs.config.webClient) {
		if (typeof toggle != 'boolean') {
			toggle = true
		}
		if (typeof delay != 'number') {
			delay = 'null'
		}
		if (text) {
			text = '"' + text + '"'
		}
		else {
			text = 'null'
		}
		
//		var fade = toggle ? 'fadeIn' : 'fadeOut'
//		plugins.WebClientUtils.executeClientSideJS("$('#HUDcenter1')." + fade + "();")
		plugins.WebClientUtils.executeClientSideJS("bigIndicator(" + (toggle ? 'true' : 'false') + "," + delay + "," + text + ");")
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
	
	//adjust transaction z-index client-side to get around 1st time not working
	plugins.WebClientUtils.executeClientSideJS("$('#" + plugins.WebClientUtils.getElementMarkupId(forms.DATASUTRA_WEB_0F__header__actions.elements.btn_edit) + "').on('click',null,function(){triggerInterfaceLock(true);});")
}

/**
 * Helper function to make pop ups go in the right place.
 * Once I figure out how continuations work, I won't need this anymore.
 * 
 * @param {String}	[posn] The co-ordinates just fired.
 * 
 * @properties={typeid:24,uuid:"487DA917-3C82-490A-8F2C-2DAF78FCC5D2"}
 */
function webPopup(posn) {
	if (solutionPrefs.config.webClient) {
		//need to grab position
		if (typeof posn != 'string') {
			plugins.WebClientUtils.executeClientSideJS('var posn = Wicket.clickPosition;', webPopup, ['posn'])
		}
		else {
			posn = posn.split(',')
			
			//deprecated popupmenu
			if (webPopup.popupMenu instanceof Array) {
				plugins.popupmenu.showPopupMenu(posn[0], posn[1], webPopup.popupMenu)
			}
			//supported popup call
			else if (webPopup.popupMenu instanceof Popup) {
				webPopup.popupMenu.show(posn[0], posn[1])
			}
		}
	}
}

/**
 * Set placeholder property of fast find fields
 * 
 * @param {String}	[findField] Pretty name of find field selected.
 * 
 * @properties={typeid:24,uuid:"10ECF00C-A563-49A2-8A26-74A1D433FD5B"}
 */
function webFindSet(findField) {
	if (solutionPrefs.config.webClient) {
		var placeHolderElem = [
				plugins.WebClientUtils.getElementMarkupId(forms.NAV_P__fastfind.elements.fld_find),
				plugins.WebClientUtils.getElementMarkupId(forms.NAV_T_universal_list__WEB__fastfind.elements.fld_find)
			]
		var placeHolderText = [
				findField,
				findField
			]
		
		//set place holder text
		plugins.WebClientUtils.executeClientSideJS('setPlaceHolders(' + JSON.stringify(placeHolderElem) + ',' + JSON.stringify(placeHolderText) + ');')
	}
}