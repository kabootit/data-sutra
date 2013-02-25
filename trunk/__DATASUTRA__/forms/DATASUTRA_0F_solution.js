/**
 *
 * @properties={typeid:24,uuid:"73261329-fc04-437b-bfd0-e9e6a1277029"}
 */
function CURTAIN_action()
{

/*
 *	TITLE    :	CURTAIN_action
 *			  	
 *	MODULE   :	_DATASUTRA_
 *			  	
 *	ABOUT    :	a blank method prevents things below an object from firing
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CURTAIN_action()
 *			  	
 *	MODIFIED :	December 16, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//screen locked and quick login box not displayed already, show quick login
if (solutionPrefs.access.lockStatus && !elements.lock.visible) {
	var widthWindow = application.getWindowWidth(null)
	var heightWindow = application.getWindowHeight(null)
	
	var widthLock = elements.lock.getWidth()
	var heightLock = elements.lock.getHeight()
	
	//location x, location y, width, height
	elements.lock.reshape((widthWindow / 2 - widthLock / 2), (heightWindow / 2 - 4 * heightLock / 5),widthLock,heightLock)
	
	elements.lock.visible = true
}
}

/**
 *
 * @properties={typeid:24,uuid:"f5f953e8-1275-4823-afd8-dfab31b6bb8f"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	_DATASUTRA_
 *			  	
 *	ABOUT    :	set up split beans and tab panels
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */	

//don't run in headless or web client (they use whatever solution is activated as context)
if (application.getApplicationType() == APPLICATION_TYPES.SMART_CLIENT || application.getApplicationType() == APPLICATION_TYPES.RUNTIME_CLIENT) {	
	if (! application.__parent__.solutionPrefs) {
		globals.DATASUTRA_init()
	}
	
	var formName = 'DATASUTRA_0F_solution'
	
	//continue setting things up if no error in login
	if (currentcontroller.getName() != 'DATASUTRA__error') {
		//see forms.DATASUTRA.FORM_on_show for more detail
		if (history.getFormName(history.getCurrentIndex()) == formName) {
			//remove datasutra if it is the last thing in the history stack so don't get two entries here
			history.removeIndex(history.getCurrentIndex())
		}
		forms.DATASUTRA_0F_solution__blank_4.controller.show()
		forms[formName].controller.show()
	
		//configure form (used to be part of DATASUTRA_init; broken out for parity with webclient
		FORM_setup(formName,'DATASUTRA_0F_solution__blank_4')
		
		//wrapper bean 1
		elements.bean_wrapper_1.leftComponent = elements.bean_wrapper_2
		elements.bean_wrapper_1.rightComponent = null
		
		//wrapper bean 2
		elements.bean_wrapper_2.topComponent = elements.bean_header
		elements.bean_wrapper_2.bottomComponent = elements.bean_main
		elements.bean_wrapper_2.dividerLocation = 44
		
		//header bean
		elements.bean_header.topComponent = null
		elements.bean_header.bottomComponent = elements.tab_header
		
		//main bean
		elements.bean_main.leftComponent = elements.bean_list
		elements.bean_main.rightComponent = elements.bean_workflow
		
		//list bean
		elements.bean_list.topComponent = elements.tab_content_A
		elements.bean_list.bottomComponent = elements.tab_content_B
		
		//workflow bean
		elements.bean_workflow.topComponent = null
		elements.bean_workflow.bottomComponent = elements.tab_content_C
		
		//unlock content
		elements.lock.contentPane = elements.tab_lock
		elements.lock.frameIcon = new Packages.javax.swing.ImageIcon(new Packages.java.net.URL('media:///toolbar_lock.png'))
		elements.lock.visible = false
		
		//hide locking curtains; set image
		elements.gfx_curtain_header.visible = false
		elements.gfx_curtain_header.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain.visible = false
		elements.gfx_curtain.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain_left_1.visible = false
		elements.gfx_curtain_left_1.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain_left_2.visible = false
		elements.gfx_curtain_left_2.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain_leftright.visible = false
		elements.gfx_curtain_leftright.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain_right_1.visible = false
		elements.gfx_curtain_right_1.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain_right_2.visible = false
		elements.gfx_curtain_right_2.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain_top.visible = false
		elements.gfx_curtain_top.setImageURL('media:///curtain_5E6166.png')
//		elements.gfx_spinner.setSize(32,32)
//		application.updateUI()
//		elements.gfx_spinner.setLocation((application.getWindowWidth() / 2) - 66, (application.getWindowHeight() / 2 - 200))
		elements.gfx_spinner.visible = false
//		elements.gfx_spinner.setImageURL('media:///progressbar_facebook.gif')
		
		//hide designbar popdown
		elements.tab_design_popdown.visible = false
		
		//hide flexible spaces with sidebar showing top-border hack
		elements.gfx_flexible.visible = false
		
		//toolbar area pop-down
	//	elements.sheetz.contentPane = elements.tab_toolbar_popdown
		elements.tab_toolbar_popdown.visible = false
		
		//fastfind area pop
		elements.tab_fastfind.visible = false
		
		//floater tab panel
		elements.tab_dialog.visible = false
		
		//inliner tab panel
		elements.tab_dialog.visible = false		
		
		//turn off loading hider (happens in onShow of AC_R__login)
//		elements.gfx_curtain_blank.visible = false
		
		//tack on listener to my bean
	//	var listener = new Packages.java.beans.PropertyChangeListener({propertyChange:popUp})
	//	elements.bean_main.addPropertyChangeListener('dividerLocation',listener)
		
		application.updateUI()
	}
}
//run startup method specified in meta data for web client (for sutra cms)
else if (application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT) {
	//we need data...
	foundset.loadAllRecords()
	
	if (method_startup && solutionModel.getGlobalMethod(method_startup)) {
		globals[method_startup]()
	}
}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"6f7d6e0a-d0cc-42be-9565-8ad8a387418f"}
 */
function FORM_on_show(firstShow, event)
{
	
/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	_DATASUTRA_
 *			  	
 *	ABOUT    :	request focus on an element (trigger onFocusGainedMethod) to set solution title
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 29, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	

//don't run in headless or web client (they use whatever solution is activated as context)
if (application.getApplicationType() == APPLICATION_TYPES.SMART_CLIENT || application.getApplicationType() == APPLICATION_TYPES.RUNTIME_CLIENT) {
	//only fire first time shown
	//if (firstShow) {	//application.__parent__.solutionPrefs && 
		elements.fld_trigger_name.requestFocus(true)
	//}
}

}

/**
 *
 * @properties={typeid:24,uuid:"2893a3d9-ffdc-4d8e-8ea1-12aa9f8bdd2e"}
 */
function FRAME_rename()
{

/*
 *	TITLE    :	FRAME_rename
 *			  	
 *	MODULE   :	_DATASUTRA_
 *			  	
 *	ABOUT    :	set solution title
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 29, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	

if (solution_name || solution_icon_blob) {
	globals.TRIGGER_frame_title_set(solution_name,solution_icon_blob) // + ' — Data Sutra'
}
}

/**
 * @param {String}	baseForm
 * @param {String}	prefForm
 *
 * @properties={typeid:24,uuid:"2144182A-1A5A-4F78-8576-21377EDA8E0E"}
 */
function FORM_setup(baseForm,prefForm) {
	var serverName = 'sutra'
	
	//hack to get rid of color flashing issues
	var bkgndLight = new Packages.java.awt.Color(13752290)
	forms[baseForm].elements.bean_wrapper_1.background = bkgndLight
	forms[baseForm].elements.bean_wrapper_2.background = bkgndLight
	
	//access and control is bypassed --> running in single user mode
	if (forms[prefForm].login_disabled) {
		
		//login form
		forms.AC_R__login.elements.tab_login.tabIndex = 2
		forms.AC_R__login.loginDisabled = true
		forms[baseForm].elements.tab_content_C.addTab(forms.AC_R__login_SMART,'')
		
		//go to workflow maximized view
		globals.DS_space_change('btn_space_7',true)
		
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
		
		//when in developer, rebuild navigationPrefs fresh each time
		if (true) {//solutionPrefs.clientInfo.typeServoy == 'developer') {
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
			
		}
		//not in developer, use navigation_node
		else if (forms[prefForm].navigation_node_date && forms[prefForm].navigation_node) {
		//globals.DIALOGS.showErrorDialog('client')
			navigationPrefs = forms[prefForm].navigation_node
			
			//set value list used for changing navigation sets
			var navSetNames = new Array()
			var navigationSets = new Array()
			
			for (var i in navigationPrefs.byNavSetName) {
				if (i != 'configPanes') {
					navSetNames.push(navigationPrefs.byNavSetName[i].navSetName)
					navigationSets.push(navigationPrefs.byNavSetName[i].navSetID)
				}
			}
			
			application.setValueListItems('NAV_navigation_set', navSetNames, navigationSets)
		}
		//something not set up correctly
		else {
			return
		}
		
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
		forms[baseForm].elements.tab_content_C.addTab(forms.AC_R__login_SMART,'')
		
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
		
		//go to workflow maximized view
		globals.DS_space_change('btn_space_7',true)
		
		//	LOAD defaults for password
		globals.AC_password_set()
			
		//set up title toolbar
		solutionPrefs.panel = globals.DS_panel_load(null,true)
		
	}
	
	//	//PART XXXX: deactivate all buttons
	forms[baseForm + '__header'].elements.btn_navset.visible = false
	forms[baseForm + '__header'].elements.btn_space_1.visible = false
	forms[baseForm + '__header'].elements.btn_space_2.visible = false
	forms[baseForm + '__header'].elements.btn_space_3.visible = false
	forms[baseForm + '__header'].elements.btn_space_4.visible = false
	forms[baseForm + '__header'].elements.btn_space_5.visible = false
	forms[baseForm + '__header'].elements.btn_space_6.visible = false
	forms[baseForm + '__header'].elements.btn_space_7.visible = false
	forms[baseForm + '__header'].elements.btn_space_8.visible = false
	forms[baseForm + '__header'].elements.btn_space_9.visible = false
	forms[baseForm + '__header'].elements.btn_space_10.visible = false
	forms[baseForm + '__header'].elements.btn_space_11.visible = false
	forms[baseForm + '__header'].elements.btn_space_12.visible = false
	forms[baseForm + '__header'].elements.btn_space_13.visible = false
	forms[baseForm + '__header'].elements.btn_space_14.visible = false
	forms[baseForm + '__header'].elements.btn_space_dividers.visible = false
	forms[baseForm + '__header__toolbar'].elements.toolbar_navigator.visible = false
	forms[baseForm + '__header__fastfind'].elements.btn_find.visible = false
	forms[baseForm + '__header__fastfind'].elements.find_mid.visible = false
	forms[baseForm + '__header__fastfind'].elements.find_end.visible = false
	forms[baseForm + '__header__fastfind'].elements.fld_find.visible = false
	forms[baseForm + '__header'].elements.btn_pref.visible = false
	forms[baseForm + '__header'].elements.btn_fw_action.visible = false
	forms[baseForm + '__header'].elements.btn_sidebar_expand.visible = false
	forms[baseForm + '__footer'].elements.lbl_status.visible = false
	
	//no top border when... //TODO: really when no toolbars showing on mac
		//mac client or >4 developer
	if (solutionPrefs.clientInfo.typeOS == 'Mac OS X' && !(solutionPrefs.clientInfo.typeServoy == 'developer' && utils.stringToNumber(solutionPrefs.clientInfo.verServoy) < 4)) {
		forms[baseForm + '__header'].elements.gfx_header.setBorder('MatteBorder,0,0,1,0,#333333')
		forms.DATASUTRA__sidebar__header.elements.gfx_header.setBorder('MatteBorder,0,0,1,0,#333333')
	}
	//set top border on graphic when...
	else {
		forms[baseForm + '__header'].elements.gfx_header.setBorder('MatteBorder,1,0,1,0,#333333')
		forms.DATASUTRA__sidebar__header.elements.gfx_header.setBorder('MatteBorder,1,0,1,0,#333333')
	}
}