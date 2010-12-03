/**
 * @properties={typeid:35,uuid:"20dbaa74-b6ea-4925-8c3c-9ad43e3e327a"}
 */
var PREF_license_agreement = '<html><head></head><body>Testing</body></html>';

/**
 *
 * @properties={typeid:24,uuid:"49841ec0-699b-41e2-957d-87d009fa5ef8"}
 */
function PREF_client_info_set()
{

/*
 *	TITLE    :	PREF_client_info_set
 *			  	
 *	MODULE   :	ds_PREF_preferences
 *			  	
 *	ABOUT    :	fills solutionPrefs.clientInfo with information about how servoy is running on this client
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get uuid of client (comes from clients_stats table in repository)
var uuidServoy = plugins.sutra.getClientID()

//process os and servoy version
var nameOS = application.getOSName()
var servoyType = application.getApplicationType()

//tano and higher has special developer check
if (utils.stringToNumber(application.getVersion()) >= 5 && application.isInDeveloper()) {
	if (application.isInDeveloper()) {
		switch (servoyType) {
				case 2:
					servoyType = 'developer'
					break
				
				case 4:
					servoyType = 'headless client'
					break
				
				case 5:
					servoyType = 'web client'
					break
		}
	}
}
//4 and below
else {
	switch (servoyType) {
			case 1:
				servoyType = 'server'
				break
			
			case 2:
				servoyType = 'client'
				break
			
			case 3:
				servoyType = 'developer'
				break
			
			case 4:
				servoyType = 'headless client'
				break
			
			case 5:
				servoyType = 'web client'
				break
			
			case 6:
				servoyType = 'runtime'
				break	
	}
}

//test to see if internet connection — has a maximum delay of ~10 seconds
	//MEMO: ip address used is D.root-servers.net. (aka terp.umd.edu); housed at my alma mater, the University of Maryland
//if (utils.stringPatternCount(nameOS,'Windows')) {
//	var ping = application.executeProgram('ping','-n','4','-w','1000','128.8.10.90')
//	//check if ping successful
//	if (ping.length && !utils.stringPatternCount(ping, 'Ping request could not find host')) {
//		var pingPosn = utils.stringPosition(ping,'Received = ',0,1) + 11
//		var pingResult = utils.stringToNumber(utils.stringMiddle(ping,pingPosn,1))
//	}
//	else {
//		var pingResult = false
//	}
//}
//else {
//	var ping = application.executeProgram('ping','-c','4','-o','128.8.10.90')
//	//check if ping successful
//	if (ping.length) {
//		var pingPosn = utils.stringPosition(ping,'packets received',0,1) - 2
//		var pingResult = utils.stringToNumber(utils.stringMiddle(ping,pingPosn,1))
//	}
//	else {
//		var pingResult = false
//	}
//}
var pingResult = false

//get external ip address if connection available
if (pingResult) {
	var ipExternal = plugins.http.getPageData('http://whatismyip.com/automation/n09230945.asp')
}
if (!ipExternal || ipExternal.indexOf('Error',0) != -1) {
	ipExternal = 'UNKNOWN'
}

//time difference between server and client (- means client ahead) (+ means server ahead)
var clientTime = application.getTimeStamp()
var serverTime = application.getServerTimeStamp()
var timeDiff = (serverTime - clientTime) / 1000 //gives offset in seconds

//hack to pop up the popupmenu (instead of down)
//move "up" button to correct location based on platform and look and feel
//if not using kunstoff, windows, metal, or mac, menu will pop down
//
//if using xp or vista and the default (luna/glass) scheme is used, but servoy is set to use windows classic laf, popups will be incorrect

var lookNFeel = application.getCurrentLookAndFeelName()
var lineHeight = 0
var topShift = 0
var osVer = (plugins.sutra) ? plugins.sutra.getOSVersion() : ''

if (nameOS == 'Mac OS X' && lookNFeel != 'Metal') {
	if (utils.stringPatternCount(osVer,'10.5') || utils.stringPatternCount(osVer,'10.6')) {
		lineHeight = 18
		topShift = 27
	}
	else {
		lineHeight = 16
		topShift = 22
	}
}
else if (lookNFeel == 'Kunststoff') {
	lineHeight = 21
	topShift = 26
}
else if (lookNFeel == 'Windows') {
	var theme = plugins.sutra.getWindowsTheme()
	
	//win2k
	if (utils.stringPatternCount(osVer,'5.0')) {
		lineHeight = 19
		topShift = 26
	}
	//winxp
	else if (utils.stringPatternCount(osVer,'5.1') && theme == 'Luna') {
		lineHeight = 19
		topShift = 22
	}
	//vista (6) and windows 7 (6.1)...anything that can do Aero
	else if (utils.stringToNumber(osVer) > 6 && theme != 'Classic') {
		lineHeight = 22
		topShift = 26
	}
	//default
	else {
		lineHeight = 19
		topShift = 26
	}
}
else if (lookNFeel == 'CDE/Motif') {
	lineHeight = 21
	topShift = 22
}
else if (lookNFeel == 'Metal' || lookNFeel == 'SkinLF') {
	lineHeight = 19
	topShift = 25
}

var clientInfo = {
	servoyUUID		: uuidServoy,
	typeOS			: nameOS,
	verOS			: osVer,
	verJava			: plugins.sutra.getJavaVersion(),
	typeServoy		: servoyType,
	verServoy		: application.getVersion(),
	typeLAF			: lookNFeel,
	hostName		: application.getHostName(),
	internalIP		: application.getIPAddress(),
	externalIP		: ipExternal,
	printers		: application.getPrinters(),
	timeOffset		: timeDiff,
	popupHack		: {lineHeight: lineHeight, topShift : topShift},
	startTime		: serverTime
}

return clientInfo
}

/**
 *
 * @properties={typeid:24,uuid:"302a91cd-529d-4c1f-8794-9dfa123c82f5"}
 */
function PREF_list_set()
{

/*
 *	TITLE    :	PREF_list_set
 *			  	
 *	MODULE   :	ds_PREF_preferences
 *			  	
 *	ABOUT    :	returns solutionPrefs.listSetup with default values (currently only smart list sleep)
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 18, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var listSetup = new Object()
var formName = 'PREF_0L__solution_config'

//listSetup.sleepTime = (forms[formName].list_sleep) ? forms[formName].list_sleep : 250
//listSetup.formName
//listSetup.tableName
//listSetup.displayName
//listSetup.labelName
listSetup.delay = (forms[formName].recnav_delay) ? forms[formName].recnav_delay : 100
listSetup.lastStart = new Date()
listSetup.listBackground = (forms[formName].list_color_background) ? forms[formName].list_color_background : '#D1D7E2'

//fully functional, but not something for public consumption yet....although if you uncomment it and remove line 37....(and put a value in list_maxrecs...)
/*		
	//custom foundset sizes
	listSetup.maxRecords = (forms[formName].list_maxrecs) ? forms[formName].list_maxrecs : 200
	//make sure it is a multiple of 200
	listSetup.maxRecords = (Math.floor(listSetup.maxRecords / 200) + ((listSetup.maxRecords % 200) ? 1 : 0)) * 200
*/
listSetup.maxRecords = 200

return listSetup
}

/**
 *
 * @properties={typeid:24,uuid:"c20bb860-2153-4ca9-833b-8661f988f513"}
 */
function PREF_screen_set()
{

/*
 *	TITLE    :	PREF_screen_set
 *			  	
 *	MODULE   :	ds_PREF_preferences
 *			  	
 *	ABOUT    :	fills solutionPrefs.screenAttrib with default screen x, y, height, width, bean splits, and centering preference
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

var screenAttrib = new Object()
var formName = 'DATASUTRA_0F_solution__blank_4'

//window/screen
screenAttrib.screenWidth = application.getScreenWidth() 
screenAttrib.screenHeight = application.getScreenHeight()
screenAttrib.initialScreenWidth = (forms[formName].screen_width) ? forms[formName].screen_width : 1012
screenAttrib.initialScreenHeight = (forms[formName].screen_height) ? forms[formName].screen_height : 750
if (forms[formName].location_center) {
	screenAttrib.locationCenter = true
}
else {
	screenAttrib.locationX = (forms[formName].location_x) ? forms[formName].location_x : 50
	screenAttrib.locationY = (forms[formName].location_y) ? forms[formName].location_y : 50
}

//existing sidebar, use it
if (application.__parent__.solutionPrefs && solutionPrefs.screenAttrib && solutionPrefs.screenAttrib.sidebar) {
	screenAttrib.sidebar = solutionPrefs.screenAttrib.sidebar
}
//default sidebar
else {
	screenAttrib.sidebar = {
							status	: (forms[formName].sidebar_status) ? true : false,
							defaultSize	: (forms[formName].sidebar_size) ? forms[formName].sidebar_size : 200,
							currentSize	: (forms[formName].sidebar_size) ? forms[formName].sidebar_size : 200
						}
}

//kiosk
screenAttrib.kiosk = new Object()
screenAttrib.kiosk.fullScreen = (forms[formName].kiosk_fullscreen) ? true : false
screenAttrib.kiosk.showMenu = (forms[formName].kiosk_menu) ? true : false
screenAttrib.kiosk.showStatusBar = (forms[formName].kiosk_statusbar) ? true : false
screenAttrib.kiosk.showToolbar = (forms[formName].kiosk_toolbar) ? true : false

//spaces
screenAttrib.spaces = {
				standard	: {
								defaultHorizontal	: (forms[formName].space_standard_horizontal) ? forms[formName].space_standard_horizontal : 200,
								currentHorizontal	: (forms[formName].space_standard_horizontal) ? forms[formName].space_standard_horizontal : 200,
								defaultVertical		: (forms[formName].space_standard_vertical) ? forms[formName].space_standard_vertical : 200,
								currentVertical		: (forms[formName].space_standard_vertical) ? forms[formName].space_standard_vertical : 200
							},
							
				list		: {
								defaultHorizontal	: (forms[formName].space_list_horizontal) ? forms[formName].space_list_horizontal : 200,
								currentHorizontal	: (forms[formName].space_list_horizontal) ? forms[formName].space_list_horizontal : 200,
							},
							
				vertical	: {
								defaultHorizontalOne	: (forms[formName].space_vertical_horizontal_1) ? forms[formName].space_vertical_horizontal_1 : 200,
								currentHorizontalOne	: (forms[formName].space_vertical_horizontal_1) ? forms[formName].space_vertical_horizontal_1 : 200,
								defaultHorizontalTwo	: (forms[formName].space_vertical_horizontal_2) ? forms[formName].space_vertical_horizontal_2 : 200,
								currentHorizontalTwo	: (forms[formName].space_vertical_horizontal_2) ? forms[formName].space_vertical_horizontal_2 : 200
							},
							
				centered	: {
								defaultHorizontalOne	: (forms[formName].space_centered_horizontal_1) ? forms[formName].space_centered_horizontal_1 : 200,
								currentHorizontalOne	: (forms[formName].space_centered_horizontal_1) ? forms[formName].space_centered_horizontal_1 : 200,
								defaultHorizontalTwo	: (forms[formName].space_centered_horizontal_2) ? forms[formName].space_centered_horizontal_2 : 200,
								currentHorizontalTwo	: (forms[formName].space_centered_horizontal_2) ? forms[formName].space_centered_horizontal_2 : 200
							},
							
				classic		: {
								defaultHorizontal	: (forms[formName].space_classic_horizontal) ? forms[formName].space_classic_horizontal : 200,
								currentHorizontal	: (forms[formName].space_classic_horizontal) ? forms[formName].space_classic_horizontal : 200,
								defaultVertical		: (forms[formName].space_classic_vertical) ? forms[formName].space_classic_vertical : 200,
								currentVertical		: (forms[formName].space_classic_vertical) ? forms[formName].space_classic_vertical : 200
							},
							
				wide		: {
								defaultHorizontal	: (forms[formName].space_wide_horizontal) ? forms[formName].space_wide_horizontal : 200,
								currentHorizontal	: (forms[formName].space_wide_horizontal) ? forms[formName].space_wide_horizontal : 200,
								defaultVertical		: (forms[formName].space_wide_vertical) ? forms[formName].space_wide_vertical : 200,
								currentVertical		: (forms[formName].space_wide_vertical) ? forms[formName].space_wide_vertical : 200
							},
							
				workflow	: {
								
							}
			}


return screenAttrib
}
