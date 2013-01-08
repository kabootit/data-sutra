/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"2DE5F719-9BBB-4EA2-9AC3-01D062E19DFB"}
 */
function FORM_on_load(event) {
	//set images on curtains
	elements.gfx_curtain_header.setImageURL('media:///curtain_5E6166.png')
	elements.gfx_curtain.setImageURL('media:///curtain_5E6166.png')
	elements.gfx_curtain_left_1.setImageURL('media:///curtain_5E6166.png')
	elements.gfx_curtain_left_2.setImageURL('media:///curtain_5E6166.png')
	elements.gfx_curtain_leftright.setImageURL('media:///curtain_5E6166.png')
	elements.gfx_curtain_right_1.setImageURL('media:///curtain_5E6166.png')
	elements.gfx_curtain_right_2.setImageURL('media:///curtain_5E6166.png')
	elements.gfx_curtain_top.setImageURL('media:///curtain_5E6166.png')
	
	if (! application.__parent__.solutionPrefs) {
		globals.DATASUTRA_init()
		
		solutionPrefs.config.webClient = true
//		solutionPrefs.config.activeSpace = 'standard'
		
		FORM_setup(controller.getName(),'DATASUTRA_0F_solution__blank_4')
		
		//over ride client properties
		application.putClientProperty(APP_WEB_PROPERTY.WEBCLIENT_TEMPLATES_DIR,'datasutra')
		application.putClientProperty(APP_UI_PROPERTY.TABLEVIEW_WC_DEFAULT_SCROLLABLE,true)
		application.putClientProperty(APP_UI_PROPERTY.TABLEVIEW_WC_SCROLLABLE_KEEP_LOADED_ROWS,true)
		
		//force inclusion of jquery
		plugins.WebClientUtils.addJsReference(SERVOY_WEB_RESOURCES.JQUERY)
		plugins.WebClientUtils.addCssReference(SERVOY_WEB_RESOURCES.YUI_CSS_MENU)
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"5A5449FC-4D7E-4339-A0F4-1E1A3AD60716"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		//configure main tab
		elements.tab_wrapper.dividerSize = 0
		elements.tab_wrapper.dividerLocation = application.getWindow().getWidth()
		elements.tab_wrapper.continuousLayout = true
		elements.tab_wrapper.bgcolor = '#d1d7e2'
		elements.tab_wrapper.resizeWeight = 1
		
		//go to small login form
		if (globals.DATASUTRA_router_login) {
			forms.AC_R__login_WEB__small.controller.show()
		}
		//go to big login form
		else {
			forms.AC_R__login_WEB.controller.show()
		}
	}
	
	//set up callback on form for navigating when in router wrapper
	scopes.DS.webCallbacks()
}

/**
 * @properties={typeid:24,uuid:"5F7AFB52-69FC-473C-AB8E-99D0408EFA16"}
 */
function CURTAIN_action() {
	//screen locked and quick login box not displayed already, show quick login
	if (solutionPrefs.access.lockStatus) {
		
	}
}

/**
 * @properties={typeid:24,uuid:"7F5490B9-3940-406A-B839-4E662D306B8D"}
 */
function FORM_setup(baseForm,prefForm) {
	var serverName = 'sutra'
	
	//access and control is bypassed --> running in single user mode
	if (forms[prefForm].login_disabled) {
		
		//login form
		forms.AC_R__login.elements.tab_login.tabIndex = 2
		forms.AC_R__login.loginDisabled = true
		forms.DATASUTRA_WEB_0F__workflow.setForm('AC_R__login')
		
		//set up title toolbar
		solutionPrefs.panel = globals.DS_panel_load(null,true)
		
		//set flag that access and control is disabled
		solutionPrefs.access = new Object()
		solutionPrefs.access.accessControl = false
		
		//create log entry for this user
		var fsAccessLog = databaseManager.getFoundSet(serverName,'sutra_access_log')
		
		accessLog = fsAccessLog.getRecord(fsAccessLog.newRecord())
	
		accessLog.servoy_uuid = solutionPrefs.clientInfo.servoyUUID
		accessLog.os_type = solutionPrefs.clientInfo.typeOS
		accessLog.os_version = solutionPrefs.clientInfo.verOS
		accessLog.java_version = solutionPrefs.clientInfo.verJava
		accessLog.servoy_type = solutionPrefs.clientInfo.typeServoy
		accessLog.servoy_version = solutionPrefs.clientInfo.verServoy
		accessLog.laf_type = solutionPrefs.clientInfo.typeLAF
		accessLog.host_name = solutionPrefs.clientInfo.hostName
		accessLog.ip_internal = solutionPrefs.clientInfo.internalIP
		accessLog.ip_external = solutionPrefs.clientInfo.externalIP
		accessLog.time_difference = solutionPrefs.clientInfo.timeOffset
		
		databaseManager.saveData(accessLog)
		
		//save down the access record created
		solutionPrefs.clientInfo.logID = accessLog.id_log
		
		// //PART VII: load navigation sets
		//navigation code global
		navigationPrefs = solutionPrefs.config.navEngine = new Object()
		
		//rebuild navigationPrefs fresh each time
		navigationPrefs.foundsetPool = {
										recyclePKs : new Array(),
										omitPKs : new Array(),
										resetRequired : false
									}
		
		//starting position
		var dsUniversalList = databaseManager.getDataSetByQuery(
								serverName, 
								'SELECT id_universal_list FROM sutra_universal_list',
								null,
								1)
		navigationPrefs.foundsetPool.nextFreePK = dsUniversalList.getValue(1,1)
		
		//build navigationPrefs with all navigation sets available
		globals.NAV_navigation_load(true)
		
		// //PART VIII: set display status and client info
		
		// set lower right display logged in status
			var loggedUserIP = (solutionPrefs.clientInfo.externalIP == 'UNDEFINED' || utils.stringPatternCount(solutionPrefs.clientInfo.externalIP,'Error') || solutionPrefs.clientInfo.externalIP == 'UNKNOWN') ? solutionPrefs.clientInfo.internalIP : solutionPrefs.clientInfo.externalIP
			
			var loggedHost = solutionPrefs.clientInfo.hostName
			
			var loggedIn = globals.CODE_date_format() + utils.dateFormat(new Date(),  " H:mm")
			globals.DATASUTRA_log_status = 'HOST: ' + loggedHost + '    LOGIN TIME: ' + loggedIn
			
			var lblStatus = '<html><head></head><body>' +
							'HOST: ' + loggedHost + '<br>' +
							'IP: ' + loggedUserIP + '<br>' +
							'</body></html>'
			forms[baseForm + '__footer'].elements.lbl_status.toolTipText = lblStatus
			
	
		// add client info to the server
	
			//clear current info
			application.removeAllClientInfo()
			
			//flag that this client has been validated
			application.addClientInfo('<strong>Data Sutra client</strong>')
			
			var clientInfo = '<!-- User information begin -->'+
					'<table border="0" cellpadding="0" cellspacing="0" width="100%">\n'+
					'<tr><td width="125">Operating system:</td><td>'+solutionPrefs.clientInfo.typeOS+'</td>\n'+
					'<tr><td width="125">OS version:</td><td>'+solutionPrefs.clientInfo.verOS+'</td>\n'+
					'<tr><td width="125">Java version:</td><td>'+solutionPrefs.clientInfo.verJava+'</td>\n'+
					'<tr><td width="125">Servoy LAF:</td><td>'+solutionPrefs.clientInfo.typeLAF+'</td>\n'+
					'<tr><td width="125">Host name:</td><td>'+solutionPrefs.clientInfo.hostName+'</td>\n'+
					'<tr><td width="125">LAN IP:</td><td>'+solutionPrefs.clientInfo.internalIP+'</td>\n'+
					'<tr><td width="125">WAN IP:</td><td>'+solutionPrefs.clientInfo.externalIP+'</td>\n'+
					'<tr><td width="125">Server URL:</td><td>'+application.getServerURL()+'</td>\n'+
					'<tr><td width="125">Time offset:</td><td>'+solutionPrefs.clientInfo.timeOffset+' seconds</td>\n'+
					'<tr><td width="125">Log ID:</td><td>'+solutionPrefs.clientInfo.logID+'</td>\n'+
			        '</table>' +
					'<!-- User information end -->'
					
			//set newly logged in user info
			application.addClientInfo(clientInfo)
			solutionPrefs.clientInfo.adminPage = clientInfo
			
			// //PART IV: Set window size/location and toolbars showing
			//only runs on first time solution loaded if fullscreen isn't active
			if (solutionPrefs.config.firstRun && (!solutionPrefs.screenAttrib.kiosk.fullScreen || solutionPrefs.clientInfo.typeServoy == 'developer')) {
				application.setWindowSize(solutionPrefs.screenAttrib.initialScreenWidth,solutionPrefs.screenAttrib.initialScreenHeight)
				
				if (solutionPrefs.screenAttrib.locationCenter) {
					application.setWindowLocation(-1,-1)
				}
				else {
					application.setWindowLocation(solutionPrefs.screenAttrib.locationX,solutionPrefs.screenAttrib.locationY)
				}
			}
	}
	//access and control
	else {
		//used to tack on password to actions list
			//deprecated....set flag for FORM_on_load to finish loading in access/control pages
		solutionPrefs.access = {accessControl : true}
		
		//login form
		forms.AC_R__login.elements.tab_login.tabIndex = 1
		forms.DATASUTRA_WEB_0F__workflow.setForm('AC_R__login')
		
		//re-size screen if too small
		if (application.getWindowWidth() < 950 || application.getWindowHeight() < 650) {
			application.setWindowSize(solutionPrefs.screenAttrib.initialScreenWidth,solutionPrefs.screenAttrib.initialScreenHeight)
			
			if (solutionPrefs.screenAttrib.locationCenter) {
				application.setWindowLocation(-1,-1)
			}
			else {
				application.setWindowLocation(solutionPrefs.screenAttrib.locationX,solutionPrefs.screenAttrib.locationY)
			}
		}
		
		//	LOAD defaults for password
		globals.AC_password_set()
			
		//set up title toolbar
		solutionPrefs.panel = globals.DS_panel_load(null,true)
		
	}
	
	//	//PART XXXX: deactivate all buttons
	forms[baseForm + '__header'].elements.btn_navset.visible = false
//	for (var i = 1; i <= 14; i++) {
//		if (forms[baseForm + '__header'].elements['btn_space_' + i] != undefined) {
//			forms[baseForm + '__header'].elements['btn_space_' + i].visible = false
//		}
//	}
	forms[baseForm + '__header'].elements.btn_space_dividers.visible = false
	forms[baseForm + '__header__toolbar'].elements.btn_toolbar_toggle.visible = false
	forms[baseForm + '__header__toolbar'].elements.btn_toolbar_popdown.visible = false
//	forms[baseForm + '__header__fastfind'].elements.btn_find.visible = false
//	forms[baseForm + '__header__fastfind'].elements.find_mid.visible = false
//	forms[baseForm + '__header__fastfind'].elements.find_end.visible = false
//	forms[baseForm + '__header__fastfind'].elements.fld_find.visible = false
	forms[baseForm + '__header'].elements.btn_pref.visible = false
	forms[baseForm + '__header'].elements.btn_fw_action.visible = false
	forms[baseForm + '__header'].elements.btn_sidebar_expand.visible = false
	forms[baseForm + '__footer'].elements.lbl_status.visible = false
	
	//set top border on graphic (commented out because then anchoring doesn't work)
//	forms[baseForm + '__header'].elements.gfx_header.setBorder('MatteBorder,1,0,1,0,#333333')
//	forms.DATASUTRA__sidebar__header.elements.gfx_header.setBorder('MatteBorder,1,0,1,0,#333333')
	
	//trigger spaces (to fill images and set bordering lines)
	forms.DATASUTRA_WEB_0F__header.ACTION_space_change('btn_space_1',true)
	
	// //PART IX: load up title toolbar
	globals.DS_toolbar_load()
}
