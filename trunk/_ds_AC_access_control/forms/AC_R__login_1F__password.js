/**
 *
 * @properties={typeid:24,uuid:"6744a9a7-1834-4e80-9800-37b244a491a3"}
 */
function CAPS_off()
{
CAPS_toggle(false)
}

/**
 *
 * @properties={typeid:24,uuid:"24225ed4-72a2-464b-bcba-15627ab5cfce"}
 */
function CAPS_pressed()
{

//key that was pressed
var keyEvent = arguments[0]

//if key pressed was the caps lock key, run caps toggle
if (keyEvent.keyCode == java.awt.event.KeyEvent.VK_CAPS_LOCK) {
	CAPS_toggle()
}


}

/**
 *
 * @properties={typeid:24,uuid:"e20dd0d6-422a-4440-acaa-47860aa7af74"}
 */
function CAPS_toggle()
{

/*
 *	TITLE    :	TOGGLE_capslock
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle status of element gfx_capslock on calling form depending on state of CAPS key
 *			  	
 *	INPUT    :	(optional) true/false to force hide/show the graphic
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	TOGGLE_capslock()
 *			  	
 *	MODIFIED :	March 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//focrce the indicator on/off
var capStatus = arguments[0]

//no arguments passed, just take curret state of caps lock key
if (!(typeof capStatus == 'boolean')) {
	capStatus = java.awt.Toolkit.getDefaultToolkit().getLockingKeyState(java.awt.event.KeyEvent.VK_CAPS_LOCK)
}

//if current visibility different than one needed, set it
	//TODO: don't show cap status when on mac...probably java version related
if (elements.gfx_capslock.visible != capStatus && 	!(application.getOSName() == 'Mac OS X')) {
	elements.gfx_capslock.visible = capStatus
}



}

/**
 *
 * @properties={typeid:24,uuid:"7e75009b-aac6-4a35-ac24-8ee99cd4fa04"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	attach listeners for caps lock key
 *			  		NOTE: only works in pre-4 Servoy
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	March 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//running in servoy < 4
if (utils.stringToNumber(application.getVersion()) < 4 || utils.stringToNumber(application.getVersion()) >= 5) {
	
	var elem = globals.CODE_java_component(elements.fld_AC_login_password)
	
	elem.addKeyListener(new Packages.java.awt.event.KeyListener({keyPressed:CAPS_pressed}))
	elem.addKeyListener(new Packages.java.awt.event.KeyListener({keyReleased:CAPS_pressed}))
	
}


}

/**
 *
 * @properties={typeid:24,uuid:"b8567f5f-5d9e-4d3e-974f-5ce7a126b671"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	set last logged in user
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	August 10, 2010 -- Troy Elliott, Data Mosaic
 *			  	
 */

//turn caps lock off
elements.gfx_capslock.visible = false

//read previous login from properties
globals.AC_login_user = application.getUserProperty('sutra' + application.getServerURL().substr(7) + 'User')

//request focus on user field if empty
if (!globals.AC_login_user) {
	elements.fld_AC_login_user.requestFocus(false)
}
//request focus on password
else {
	elements.fld_AC_login_password.requestFocus(true)
}



}

/**
 *
 * @properties={typeid:24,uuid:"72e21a43-7e05-4ab7-a8b7-c0d048fd9c8c"}
 */
function LOGIN_user()
{

/*
 *	TITLE    :	LOGIN_user
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	check if credentials supplied are valid and navigate to appropriate navigation set and item
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	April 7, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (!globals.AC_login_user && !globals.AC_login_password) {
	plugins.dialogs.showErrorDialog(
				"Invalid login", 
				"You must enter a username and password to log in"
			)
	elements.fld_AC_login_user.requestFocus()
}
else if (!globals.AC_login_user && globals.AC_login_password) {
	plugins.dialogs.showErrorDialog(
				"Empty user", 
				"You must enter a username to log in"
			)
	elements.fld_AC_login_user.requestFocus()
}
else if (globals.AC_login_user && !globals.AC_login_password) {
	plugins.dialogs.showErrorDialog(
				"Empty password", 
				"You must enter a password to log in"
			)
	elements.fld_AC_login_password.requestFocus()
}
else {

	var baseForm = solutionPrefs.config.formNameBase
	var navigationList = 'NAV__navigation_tree'

	// // //
	//		1. validate login
	// // //

	//zero out
	globals.AC_login_id = null

	//get md5 of password to check against stored value
	var passwordMD5 = plugins.sutra.encrypt(globals.AC_login_password)

	var serverName = controller.getServerName()
	var maxReturnedRows = 100
	var query = 'SELECT id_user, account_disabled, date_password_changed, id_organization, id_staff, ' +
					'pass_change_at_login, pass_never_expires, pass_unchangeable, ' +
					'screen_width, screen_height, screen_location_center, screen_location_x, screen_location_y, ' +
					'space_centered_horizontal_1, space_centered_horizontal_2, space_classic_horizontal, ' +
					'space_classic_vertical, space_list_horizontal, space_standard_horizontal, space_standard_vertical, ' +
					'space_vertical_horizontal_1, space_vertical_horizontal_2, space_wide_horizontal, space_wide_vertical, ' +
					'sidebar_width, developer_mode, id_user ' +
				'FROM sutra_access_user ' +
				'WHERE user_name = ? and user_password = ?'
	var args = new Array(globals.AC_login_user, passwordMD5)
	var dataset = databaseManager.getDataSetByQuery(serverName, query, args, maxReturnedRows)

	//if not one record returned = login error
	if (dataset.getMaxRowIndex() != 1) {
		plugins.dialogs.showErrorDialog(
				"Login error",
				"Login doesn't exist"
			)
		globals.AC_login_password = null
		elements.fld_AC_login_password.requestFocus()
		return
	}

	// // //
	//		2. set login parameters: filters, log table, footer display, security level, etc
	// // //

	//login is good so far
	try {
		var userID = globals.AC_login_id = dataset.getValue(1,1)
		var accountDisabled = dataset.getValue(1,2)
		var expirationDate = dataset.getValue(1,3)	
		var organizationID = globals.AC_current_organization = dataset.getValue(1,4)	
		var staffID = globals.AC_current_staff = dataset.getValue(1,5)
		var changePassword = dataset.getValue(1,6)
		var expirationNever = dataset.getValue(1,7) 
		var passNoChange = dataset.getValue(1,8)

		var initialScreenWidth = dataset.getValue(1,9)
		var initialScreenHeight = dataset.getValue(1,10)
		var screenCenter = dataset.getValue(1,11)
		var screenX = dataset.getValue(1,12)
		var screenY = dataset.getValue(1,13)

		var spaceCenteredHorizontalOne = dataset.getValue(1,14)
		var spaceCenteredHorizontalTwo = dataset.getValue(1,15)
		var spaceClassicHorizontal = dataset.getValue(1,16)
		var spaceClassicVertical = dataset.getValue(1,17)
		var spaceListHorizontal = dataset.getValue(1,18)
		var spaceStandardHorizontal = dataset.getValue(1,19)
		var spaceStandardVertical = dataset.getValue(1,20)
		var spaceVerticalHorizontalOne = dataset.getValue(1,21)
		var spaceVerticalHorizontalTwo = dataset.getValue(1,22)
		var spaceWideHorizontal = dataset.getValue(1,23)
		var spaceWideVertical = dataset.getValue(1,24)

		var sidebarSize = dataset.getValue(1,25)

		var designMode = dataset.getValue(1,26)
		
		var fsUser = databaseManager.getFoundSet(serverName,'sutra_access_user')
		fsUser.loadRecords(dataset.getValue(1,27))
	}
	catch (error) {
		plugins.dialogs.showErrorDialog(
					"Login error", 
					"Your account is not fully setup"
				)
		return
	} 

	// // //
	//		2-1. login disabled
	// // //

	//
	if (accountDisabled) {
		plugins.dialogs.showErrorDialog(
					"Account disabled", 
					"Your login has been disabled."
				)
		return	
	}	

	// // //
	//		2-1. login expired
	// // //

	//get expire rules
	query = 'SELECT expire_flag, expire_days FROM sutra_access_rules'
	dataset = databaseManager.getDataSetByQuery(serverName, query, null, 1)

	//rule to expire password			
	if (dataset.getValue(1,1)) {

		var expireDays = dataset.getValue(1,2)

		var today = application.getServerTimeStamp()
		today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
		var startDate = (expirationDate) ? new Date(expirationDate.getFullYear(),expirationDate.getMonth(),expirationDate.getDate()) : application.getServerTimeStamp()
		var expire = expireDays - Math.floor(((today - startDate) / 864E5))

		//password expired, quit
		if (expire <= 0 && !expirationNever) {
			plugins.dialogs.showErrorDialog(
						"Login error", 
						"Your login has expired. Please see administrator."
					)
			return		
		}
		//password will expire in a week, prompt to change
		else if (expire < 7 && !expirationNever) {
			var changePass = plugins.dialogs.showQuestionDialog(
						'Password expiring',
						'Your password will expire in '+expire+' days. Do you want to change it now?',
						'Yes',
						'No'
					)
			if (changePass == 'Yes') {
				forms.AC_P_password.FORM_fid(userID)
			}
		}
	}

	// // //
	//		2-1. must change password
	// // //

	//
	if (changePassword) {
		plugins.dialogs.showInfoDialog(
					"Change password", 
					"You must change your password."
				)
		forms.AC_P_password.FORM_fid(userID)

		//password not changed
		if (forms.AC_P_password.cancelled) {
			plugins.dialogs.showErrorDialog(
						"Login aborted", 
						"You did not change your password.  Login will not continue."
					)
			return
		}
		//reset requirement to change password at login
		else {
			forms.AC_P_password.pass_change_at_login = 0
		}
	}	

	// // //
	//		2-1. user login valid....get group information
	// // //
	query = 'SELECT a.id_group, '+
				'(SELECT group_name FROM sutra_access_group b WHERE a.id_group = b.id_group) ' +
			'FROM sutra_access_user_group a WHERE a.id_user = ? AND a.flag_chosen = ?'
	args = [userID,1]
	dataset = databaseManager.getDataSetByQuery(serverName, query, args, maxReturnedRows)
	var groupIDs = dataset.getColumnAsArray(1)
	var groupNames = dataset.getColumnAsArray(2)


	//show pop-up to choose which group entering as
	if (groupIDs && groupIDs.length > 1) {
		//convert array to dataset for use in loading
		groupIDs = databaseManager.convertToDataSet(groupIDs)

		//load found records onto FiD
		forms.AC_P_group.controller.loadRecords(groupIDs)
		globals.CODE_form_in_dialog(
					forms.AC_P_group,
					-1,-1,200,300,
					'Groups',
					false,
					false,
					'accessLoginGroup'
				)
	}
	//only one group, populate field
	else if (groupIDs.length == 1) {
		globals.AC_P_group = groupIDs[0]
	}
	//throw error
	else {
		plugins.dialogs.showErrorDialog(
					"Login error",
					"You are not a member of any group. Please see administrator."
				)
		return
	}

	if (globals.AC_P_group) {
		globals.AC_current_group = globals.AC_P_group
	}
	//if no group selected, break
	else {
		plugins.dialogs.showErrorDialog(
				"Login error", 
				"You must choose a group in order to login"
			)
		return
	}

	//get information about selected group
	query = 'SELECT group_name, login_nav_set, login_nav_main, login_nav_sub '+
			'FROM sutra_access_group WHERE id_group = ?'
	args = [globals.AC_P_group]
	dataset = databaseManager.getDataSetByQuery(serverName, query, args, maxReturnedRows)

	try {
		var groupID = globals.AC_P_group
		var groupName = dataset.getValue(1,1)
		var navSet = dataset.getValue(1,2)
		var navMain = dataset.getValue(1,3)
		var navSub = dataset.getValue(1,4)
	}
	catch (error) {
		plugins.dialogs.showErrorDialog(
					"Login error", 
					"The group you are a member of has an error. Please see administrator."
				)
		return
	} 


	//TURN ON BUSY
	globals.CODE_cursor_busy(true)
	globals.TRIGGER_progressbar_start(-273, 'Logging in...')

	// // //
	//		2-2. set lower right display logged in status
	// // //

	//if a real name, use it
	if (staffID) {
		query = 'SELECT name_fl FROM sutra_access_staff WHERE id_staff = ?'
		args = [staffID]
		dataset = databaseManager.getDataSetByQuery(serverName, query, args, maxReturnedRows)
		var loggedUser = dataset.getValue(1,1)
	}
	//otherwise, use login user
	else {
		var loggedUser = globals.AC_login_user
	}
	var loggedIn = globals.CODE_date_format() + utils.dateFormat(new Date(),  " H:mm")
	var loggedHost = solutionPrefs.clientInfo.hostName
	var loggedUserIP = (solutionPrefs.clientInfo.externalIP == 'UNDEFINED' || utils.stringPatternCount(solutionPrefs.clientInfo.externalIP,'Error') || solutionPrefs.clientInfo.externalIP == 'UNKNOWN') ? solutionPrefs.clientInfo.internalIP : solutionPrefs.clientInfo.externalIP

	forms[baseForm + '__footer'].elements.lbl_status.text = ((loggedUser) ? 'USER: ' + loggedUser + '    ' : '') + 'LOGIN TIME: ' + loggedIn // + '    HOST: ' + loggedHost 
	var lblStatus = '<html><head></head><body>' +
					'USER: ' + loggedUser + '<br>' +
					'HOST: ' + loggedHost + '<br>' +
					'IP: ' + loggedUserIP + '<br>'
				if (!expirationNever && typeof expire == 'number') {
					lblStatus += 'PASSWORD EXPIRES: ' + expire + ' day'
					lblStatus += (expire == 1) ? ' ' : 's '
				}
					lblStatus +='</body></html>'
	forms[baseForm + '__footer'].elements.lbl_status.toolTipText = lblStatus


	// // //
	//		2-3. create log record
	// // //

	var fsAccessLog = databaseManager.getFoundSet(serverName,'sutra_access_log')

	var accessLog = fsAccessLog.getRecord(fsAccessLog.newRecord())
	accessLog.id_user = userID
	accessLog.id_group = groupID

	if (staffID) {
		accessLog.id_staff = staffID
	}

	if (application.__parent__.solutionPrefs && solutionPrefs.clientInfo) {
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
	}

	databaseManager.saveData()
	solutionPrefs.clientInfo.logID = accessLog.id_log


	// // //
	//		2-3.5. add user info to code global
	// // //

	solutionPrefs.access.organizationID = organizationID
	solutionPrefs.access.groupID = groupID
	solutionPrefs.access.userID = userID
	if (staffID) {
		solutionPrefs.access.staffID = staffID
		solutionPrefs.access.staffName = loggedUser
	}
	solutionPrefs.access.userName = globals.AC_login_user
	solutionPrefs.access.groupName = groupName
	solutionPrefs.access.passNoChange = passNoChange
	solutionPrefs.access.passExpiration = expirationDate
	solutionPrefs.access.user = {record : fsUser.getRecord(1)}
	solutionPrefs.access.favorites = solutionPrefs.access.user.record.favorites || new Array()
	
	//place for user extensions; usually used for SaaS preferences
	solutionPrefs.access.extend = new Object()


	// // //
	//		2-4. add client info to the server
	// // //

	//clear current info
	application.removeAllClientInfo()

	var clientInfo = '<!-- User information begin -->'+
			'<table border="0" cellpadding="0" cellspacing="0" width="100%">'+
	        '<tr><td width="125">Organization:</td><td>'+application.getValueListDisplayValue('AC_organization_all',organizationID)+'</td>'+
			'<tr><td width="125">User ID:</td><td>'+userID+'</td>'+
	        '<tr><td width="125">User name:</td><td>'+globals.AC_login_user+'</td>'+
			'<tr><td width="125">Group name:</td><td><b>'+groupName+'</b></td>'+
			'<tr><td width="125">Operating system:</td><td>'+solutionPrefs.clientInfo.typeOS+'</td>'+
			'<tr><td width="125">OS version:</td><td>'+solutionPrefs.clientInfo.verOS+'</td>'+
			'<tr><td width="125">Java version:</td><td>'+solutionPrefs.clientInfo.verJava+'</td>'+
			'<tr><td width="125">Servoy LAF:</td><td>'+solutionPrefs.clientInfo.typeLAF+'</td>'+
			'<tr><td width="125">Host name:</td><td>'+solutionPrefs.clientInfo.hostName+'</td>'+
			'<tr><td width="125">LAN IP:</td><td>'+solutionPrefs.clientInfo.internalIP+'</td>'+
			'<tr><td width="125">WAN IP:</td><td>'+solutionPrefs.clientInfo.externalIP+'</td>'+
			'<tr><td width="125">Server URL:</td><td>'+application.getServerURL()+'</td>'+
			'<tr><td width="125">Time offset:</td><td>'+solutionPrefs.clientInfo.timeOffset+' seconds</td>'+
			'<tr><td width="125">Log ID:</td><td>'+solutionPrefs.clientInfo.logID+'</td>'+
	        '</table>' +
			'<!-- User information end -->'

	//set newly logged in user info
	application.addClientInfo(clientInfo)
	solutionPrefs.clientInfo.adminPage = clientInfo


	// // //
	//		2-5. add client info to the properties file on the local machine
	// // //

	application.setUserProperty('sutra' + application.getServerURL().substr(7) + 'User',globals.AC_login_user)
	application.setUserProperty('sutra' + application.getServerURL().substr(7) + 'Group',groupID)
	application.setUserProperty('sutra' + application.getServerURL().substr(7) + 'Organization',organizationID)
		
	//reset wrapper bean 2 to show header
	forms[baseForm].elements.bean_wrapper_2.topComponent = forms[baseForm].elements.bean_header
//	forms[baseForm].elements.bean_wrapper_2.bottomComponent = forms[baseForm].elements.bean_main
	application.updateUI()
	forms[baseForm].elements.bean_wrapper_2.dividerLocation = 44
	
	

	// // //
	//		5. load modes, toolbars, and logging prefs
	// // //

	//get toolbars values
	query = 'SELECT modes_admin, modes_user, toolbars, log_items, login_method_a, login_method_b, logout_method FROM sutra_access_group WHERE id_group = ?'
	args = [groupID]
	dataset = databaseManager.getDataSetByQuery(serverName, query, args, maxReturnedRows)

	var adminModeValues = dataset.getValue(1,1)
	var userModeValues = dataset.getValue(1,2)
	var toolbars = dataset.getValue(1,3)
	var logItems = dataset.getValue(1,4)
	var methodLoginA = dataset.getValue(1,5)
	var methodLoginB = dataset.getValue(1,6)
	var methodLogout = dataset.getValue(1,7)

	//store logoutMethod in code global
	if (methodLogout && globals[methodLogout]) {
		solutionPrefs.access.logoutMethod = methodLogout
	}

	//turn on toolbars allowed, turn others off
	var toolbarsDefault = new Array("align","design","distribute","draw","edit","text")
	if (toolbars == null) {
		toolbars = new Array('')
	}
	else {
		toolbars = toolbars.toLowerCase()
		toolbars = toolbars.split("\n")
	}

	//in serclipse or 3.5 non-developer, remove possible toolbars
	if (utils.stringToNumber(solutionPrefs.clientInfo.verServoy) >= 4 || solutionPrefs.clientInfo.typeServoy != 'developer') {
		//MEMO: edit is ok, but looks nasty...therefore text is only allowable menu
		toolbarsDefault = new Array("edit","text")
	}

	var j = 0
	for (var i = 0 ; i < toolbarsDefault.length ; i++) {
		if (toolbars[j] == toolbarsDefault[i]) {
			application.setToolbarVisible(toolbarsDefault[i],true)
			j++
		}
		else {
			application.setToolbarVisible(toolbarsDefault[i],false)
		}
	}

	//punch in what logging preferences are to code global
	solutionPrefs.analytics = new Object()
	var logging = solutionPrefs.analytics.logging = new Object()
	if (logItems == null) {
		logItems = new Array('')
	}
	else {
		logItems = utils.stringReplace(logItems,' ','_')
		logItems = logItems.split("\n")
	}

	for (var i = 0 ; i < logItems.length ; i++) {
		logging[logItems[i]] = true
	}


	//set developer mode status
	if (designMode) {
		solutionPrefs.design.statusDesign = true
	}

	//run custom method for this group before filters applied
	if (methodLoginA && globals[methodLoginA]) {
		globals[methodLoginA]()
	}

	// // //
	//		2-6. filter tables if configured
	// // //

	/*
		LOGIC....
			1- If there is a database filter and one of the tables in that
			database connection also has a filter on it, the database filter is
			removed and its equivalent is added to each table in the database at
			runtime.
			2- The first filter record arrived at for a particular database/table
			combination is considered to be 'master'.  This means that any
			subsequent filters for the same database/table must use the same
			operator and the same column.  If not, it is ignored.
			3- If there are multiple values for a given database/table at this point...
			       A- an array is passed with all the values
			       B- operator = becomes IN
			       C- operator != only passes the first value in the array
			       D- operators >, >= sort the array and pass in the last (largest) value
			       E- operators <, <= sort the array and pass in the first (smallest) value
			       F- operator LIKE passes in the first value
			4- If there is only one value for a given database/table and the
			operator is IN, the operator is changed to =
			5- If there is only one value for a given database/table and the operator is LIKE, 
			the value has % pre- and post-pended

			At this point, the resulting parameters are executed and saved into
			the code global: solutionPrefs.access.filters.  If the
			addTableFilterParam returns false, an ERROR node is created under the
			params node with details about what did not work.

			solutionPrefs.access.filters
			 - flattened: the status after step 1
			 - blueprint: the status after step 2
			 - params: the status after step 5
	*/

	var fsFilters = forms.AC_0F_filter.foundset
	var restoreFilters = fsFilters.duplicateFoundSet()

	fsFilters.clear()

	var filterables = {
				byConnection : new Object(),
				byType : new Object()
			}

	//sort parameter
	globals.CODE_ddarray_field = 'filterScope'

	//loop over four types of filters, create object representation
	for (var i = 0; i < 4; i++) {
		switch (i) {
			case 0:	//database-wide solution-level
				var filterScope = 'solution'
				var filterType = 'database'

				fsFilters.find()
				fsFilters.filter_on = 1
				fsFilters.id_group = 0
				fsFilters.filter_type = 1
				var filterRecords = fsFilters.search()
				break
			case 1:	//database-wide group-level
				var filterScope = 'group'
				var filterType = 'database'

				fsFilters.find()
				fsFilters.filter_on = 1
				fsFilters.id_group = groupID
				fsFilters.filter_type = 1
				var filterRecords = fsFilters.search()
				break
			case 2:	//table solution-level
				var filterScope = 'solution'
				var filterType = 'table'

				fsFilters.find()
				fsFilters.filter_on = 1
				fsFilters.id_group = 0
				fsFilters.filter_type = 2
				var filterRecords = fsFilters.search()
				break
			case 3:	//group solution-level
				var filterScope = 'group'
				var filterType = 'table'

				fsFilters.find()
				fsFilters.filter_on = 1
				fsFilters.id_group = groupID
				fsFilters.filter_type = 2
				var filterRecords = fsFilters.search()
				break
		}

		//there are records
		if (filterRecords) {

			//no container, create (database, table)
			if (!filterables.byType[filterType]) {
				filterables.byType[filterType] = new Object()
			}
			//create sub container (solution, group) 
			filterables.byType[filterType][filterScope] = new Array()

			//add filter information
			for (var j = 1; j <= fsFilters.getSize(); j++) {
				var theRecord = fsFilters.getRecord(j)
				var objRecord = globals.CODE_record_object(theRecord,true,true)

				//tack on classification to objRecord
				objRecord.filterScope = filterScope

				//no db container, create
				if (!filterables.byConnection[theRecord.filter_database]) {
					filterables.byConnection[theRecord.filter_database] = {
										database : new Array(),
									//	tables : new Array(),
										table :	{
																length : 0
											}
								}
				}
				//no table container, create
				if (theRecord.filter_table && !filterables.byConnection[theRecord.filter_database].table[theRecord.filter_table]) {
					filterables.byConnection[theRecord.filter_database].table[theRecord.filter_table] = new Array()
				}

				//add filter object under the connection node
				//database
				if (i == 0 || i == 1) {
					filterables.byConnection[theRecord.filter_database].database.push(objRecord)
				}
				//table
				else if (i == 2 || i == 3) {
					filterables.byConnection[theRecord.filter_database].table[theRecord.filter_table].push(objRecord)
					//filterables.byConnection[theRecord.filter_database].tables.push(objRecord)

					//set length flag
					filterables.byConnection[theRecord.filter_database].table.length++
				}

				//add filter object under the type of node
				filterables.byType[filterType][filterScope].push(objRecord)
			}
		}
	}


	//reset filter foundset
	forms.AC_0F_filter.controller.loadRecords(restoreFilters)

	//flatten out instances where there are both database and table filters
	for (var i in filterables.byConnection) {
		if (filterables.byConnection[i].database.length && filterables.byConnection[i].table.length) {
			//get list of all tables in this db connection
			var dbTables = databaseManager.getTableNames(i)

			//loop through all db filters
			while (filterables.byConnection[i].database.length) {
				//remove db filter
				var dbFilter = filterables.byConnection[i].database.pop()

				//add equivalent to all tables
				for (var j = 0; j < dbTables.length; j++) {
					//no table container, create
					if (dbTables[j] && !filterables.byConnection[i].table[dbTables[j]]) {
						filterables.byConnection[i].table[dbTables[j]] = new Array()
					}

					//add db rule to this table
					filterables.byConnection[i].table[dbTables[j]].push(dbFilter)
				}
			}
		}
	}


	//create and save down blueprint used to filter stuff
		//MEMO: the assumption here is that for each db connection there will only be either db filters or table filters
	var recordFilters = 
	solutionPrefs.access.filters = {
						flattened : filterables,
						blueprint : new Object(),
						params : new Array()
				}

	//database level
	for (var i in filterables.byConnection) {
		if (filterables.byConnection[i].database.length) {
			//create array for db filters
			recordFilters.blueprint[i] = new Array()

			//sort database connection so that all group filters are first, followed by solution filters
			filterables.byConnection[i].database.sort(globals.CODE_sort_dd_array)

			//first field
			var firstField = filterables.byConnection[i].database[0]

			//database filter
			for (var j = 0; j < filterables.byConnection[i].database.length; j++) {
				var filter = filterables.byConnection[i].database[j]

				//only add filter to array if fieldName and operator is the same as first
				if (filter.filterField == firstField.filterField && filter.filterOperator == firstField.filterOperator) {
					recordFilters.blueprint[i].push(filter)
				}
			}

			//replace all values in stored array with their values at the given time
			//TODO: what if they pass in an array?
			var globalVals = new Array()
			for (var j = 0; j < recordFilters.blueprint[i].length; j++) {
				globalVals.push(globals[recordFilters.blueprint[i][j].filterValue])
			}

			//filter param statement
			recordFilters.params.push({
							database	: i,
							table		: null,		//null value here means for the whole database
							field		: firstField.filterField,
							operator	: firstField.filterOperator,
							value		: (globalVals.length > 1) ? globalVals : globalVals[0]
					})

			//modify param statement if needed
			if (globalVals.length > 1) {
				switch (recordFilters.params[recordFilters.params.length - 1].operator) {
					case '=' :		//= becomes IN
						recordFilters.params[recordFilters.params.length - 1].operator = 'IN'
						break
					case '!=' :		//use first value
						//recordFilters.params[recordFilters.params.length - 1].operator = 'NOT IN'
						recordFilters.params[recordFilters.params.length - 1].value = globalVals[0]
						break
					case '>' :		//use largest value
						globalVals.sort()
						recordFilters.params[recordFilters.params.length - 1].value = globalVals[globalVals.length - 1]
						break
					case '<' :		//use largest value
						globalVals.sort()
						recordFilters.params[recordFilters.params.length - 1].value = globalVals[0]
						break
					case '>=' :		//use smallest value
						globalVals.sort()
						recordFilters.params[recordFilters.params.length - 1].value = globalVals[globalVals.length - 1]
						break
					case '<=' :		//use smallest value
						globalVals.sort()
						recordFilters.params[recordFilters.params.length - 1].value = globalVals[0]
						break
					case 'LIKE' :	//use first like value only
						recordFilters.params[recordFilters.params.length - 1].value = globalVals[0]
						break
				}
			}
			//length of only 1 and IN operator
			else if (globalVals.length && recordFilters.params[recordFilters.params.length - 1].operator == 'IN') {
				//MEMO: will not work if single value is actually an array
				recordFilters.params[recordFilters.params.length - 1].operator = '='
			}

			//like operator, add '%'
			if (recordFilters.params[recordFilters.params.length - 1].operator == 'LIKE') {
				recordFilters.params[recordFilters.params.length - 1].value = '%' + globalVals[0] + '%'
			}
		}

		if (filterables.byConnection[i].table.length) {
			//create object for tables
			recordFilters.blueprint[i] = new Object()

			//table level
			for (var j in filterables.byConnection[i].table) {
				//ignore the length property
				if (j != 'length') {
					//sort table connection so that all group filters are first, followed by solution filters
					filterables.byConnection[i].table[j].sort(globals.CODE_sort_dd_array)

					//first field
					var firstField = filterables.byConnection[i].table[j][0]

					//no table container, create
					if (!recordFilters.blueprint[i][j]) {
						recordFilters.blueprint[i][j] = new Array()
					}

					//table filter
					for (var k = 0; k < filterables.byConnection[i].table[j].length; k++) {
						var filter = filterables.byConnection[i].table[j][k]

						//only add filter to array if fieldName and operator is the same as first
						if (filter.filterField == firstField.filterField && filter.filterOperator == firstField.filterOperator) {
							recordFilters.blueprint[i][j].push(filter)
						}
					}

					//replace all values in stored array with their values at the given time
					var globalVals = new Array()
					for (var k = 0; k < recordFilters.blueprint[i][j].length; k++) {
						globalVals.push(globals[recordFilters.blueprint[i][j][k].filterValue])
					}

					//filter param statement
					recordFilters.params.push({
									database	: i,
									table		: j,
									field		: firstField.filterField,
									operator	: firstField.filterOperator,
									value		: (globalVals.length > 1) ? globalVals : globalVals[0]
							})


					//modify param statement if needed
					if (globalVals.length > 1) {
						switch (recordFilters.params[recordFilters.params.length - 1].operator) {
							case '=' :		//= becomes IN
								recordFilters.params[recordFilters.params.length - 1].operator = 'IN'
								break
							case '!=' :		//use first value
								//recordFilters.params[recordFilters.params.length - 1].operator = 'NOT IN'
								recordFilters.params[recordFilters.params.length - 1].value = globalVals[0]
								break
							case '>' :		//use largest value
								globalVals.sort()
								recordFilters.params[recordFilters.params.length - 1].value = globalVals[globalVals.length - 1]
								break
							case '<' :		//use largest value
								globalVals.sort()
								recordFilters.params[recordFilters.params.length - 1].value = globalVals[0]
								break
							case '>=' :		//use smallest value
								globalVals.sort()
								recordFilters.params[recordFilters.params.length - 1].value = globalVals[globalVals.length - 1]
								break
							case '<=' :		//use smallest value
								globalVals.sort()
								recordFilters.params[recordFilters.params.length - 1].value = globalVals[0]
								break
							case 'LIKE' :	//use first like value only
								recordFilters.params[recordFilters.params.length - 1].value = globalVals[0]
								break
						}
					}

					//like operator, add '%'
					if (recordFilters.params[recordFilters.params.length - 1].operator == 'LIKE') {
						recordFilters.params[recordFilters.params.length - 1].value = '%' + globalVals[0] + '%'
					}
				}
			}
		}
	}

	//apply configured filters
	for (var i = 0; i < recordFilters.params.length; i++) {
		var filterSpec = recordFilters.params[i]
		var success = databaseManager.addTableFilterParam(filterSpec.database,filterSpec.table,filterSpec.field,filterSpec.operator,filterSpec.value)

		//if error in filtering, flag it
		if (!success) {
			//create error object if not already existing
			if (!recordFilters.ERROR) {
				recordFilters.ERROR = new Object()
			}

			recordFilters.ERROR[i] = recordFilters.params[i]
		}
	}


	//SaaS organization overrides

	//valuelists
		//grab all valuelists for this organization
		var fsValuelist = databaseManager.getFoundSet('sutra','sutra_access_valuelist')

		fsValuelist.find()
		fsValuelist.id_organization = organizationID
		var results = fsValuelist.search()

		var allValuelists = application.getValueListNames()

		if (results) {
			fsValuelist.sort('valuelist_name asc, relation_1 asc, relation_2 asc, order_by asc')

			//when there are sub valuelists, they will all be rewritten the first time through, but the looping will still hit once for each sub-vl and do nothing
			for (var i = 1; i <= fsValuelist.getSize(); i++) {
				var theRecord = fsValuelist.getRecord(i)

				var vlName = theRecord.valuelist_name
				var vlRelation = theRecord.relation_1
				var vlDisplay = new Array()
				var vlReal = new Array()

				//MEMO: this will only get the parent records of a cascading vl; this is ok because they use relations to work anyway
				while (theRecord.valuelist_name == vlName && theRecord.relation_1 == vlRelation) {
					vlReal.push((theRecord.saved) ? theRecord.saved : theRecord.visible)
					vlDisplay.push(theRecord.visible)

					i++
					theRecord = fsValuelist.getRecord(i)
				}

				i--

				function subValues(item) {
					if (utils.stringPatternCount(item,vlName)) {
						return true
					}
					else {
						return false
					}
				}

				//override those that are already defined
				if (allValuelists.indexOf(vlName) >= 0) {
					var subValuelists = allValuelists.filter(subValues)

					//loop over all valuelists with same name, usually will only be 1
						//MEMO: may do some valuelists twice, but not a huge performance hit
					for (var j = 0; j < subValuelists.length; j++) {
						var thisVL = solutionModel.getValueList(subValuelists[j])

						//based on a relation, check to see which table and modify relation
						if (thisVL.relationName) {
							var relationVL = solutionModel.getRelation(thisVL.relationName)

							//based on relation, modify to point to access table
							if (databaseManager.getDataSourceTableName(relationVL.foreignDataSource) == 'sutra_valuelist') {
//								relationVL.foreignDataSource = 'db:/sutra/sutra_access_valuelist'
								var oldItems = relationVL.getRelationItems()

								//make new relation to replace out existing one with
								var newRelnName = 'saas_' + organizationID + '_' + thisVL.relationName

								//make sure a relation with this name doesn't already exist
								var cnt = 1
								while (solutionModel.getRelation(newRelnName)) {
									newRelnName = 'saas_' + organizationID + '_' + thisVL.relationName + '_' + cnt++
								}

								var newReln = solutionModel.newRelation(
												newRelnName,  
												relationVL.primaryDataSource,  
												'db:/sutra/sutra_access_valuelist',  
												relationVL.joinType
											)

								//only this saas org
								newReln.newRelationItem(
													'globals.AC_current_organization',
													'=',
													'id_organization'
												)

								//create all items that make up this relation
								for (var k = 0; k < oldItems.length; k++) {
									var oldItem = oldItems[k]

									var newItem = newReln.newRelationItem(
														oldItem.primaryDataProviderID,
														oldItem.operator,
														oldItem.foreignColumnName
													)

								}

								//rewrite valuelist
								thisVL.relationName = newRelnName

								//get to skip over sub-vls already created
								while (theRecord.valuelist_name == vlName) {
									i++
									theRecord = fsValuelist.getRecord(i)
								}
								i--
							}
						}
						//not relation-based (no sub-types), just make custom and call it a day
							//MEMO: the last time this code is fired for a particular vl, it will have the correct values
						else if (subValuelists[j] == vlName) {
							//flip on custom flag
							thisVL.valueListType = JSValueList.CUSTOM_VALUES
							application.setValueListItems(vlName,vlDisplay,vlReal)
						}
					}
				}
				//define those that aren't
				else {
					var newVL = solutionModel.newValueList(vlName, JSValueList.CUSTOM_VALUES)

					//same display and stored
					if (vlReal[0] == vlDisplay[0]) {
						newVL.customValues = vlDisplay.join('\n')
					}
					//different display and stored
					else {
						var customVal = ''
						for (var j = 0; j < vlReal.length; j++) {
							customVal += vlDisplay[j] + '|' + vlReal[j]

							if (j != vlReal.length) {
								customVal += '\n'
							}
						}

						newVL.customValues = customVal
					}
				}
			}
		}

	// // //
	//		3. load navigation sets
	// // //

	navigationPrefs = solutionPrefs.config.navEngine = new Object()
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

	//load navigation sets assigned to the selected group; if there aren't any, give an error
	if (!globals.NAV_navigation_load(true,groupID)) {
		//TURN OFF BUSY
		globals.TRIGGER_progressbar_stop()
		globals.CODE_cursor_busy(false)

		plugins.dialogs.showErrorDialog(
					"Login error", 
					"The group you are a member of has an error. Please see administrator."
				)
		return	
	}

	//set up user/admin modes
	//MEMO: must be done after NAV_navigation_load in order for things to work
		if (adminModeValues) {
			//create array from text string
			adminModeValues = adminModeValues.split("\n")
			//create object
			adminModeValues = globals.NAV_preference_mode_get('Admin',solutionPrefs.config.navigationSetID,adminModeValues)
		}
		else {
			adminModeValues = {itemName:[],formName:[],navItemID:[],itemDescription:[]}
		}

		if (userModeValues) {
			//create array from text string
			userModeValues = userModeValues.split("\n")
			//create object
			userModeValues = globals.NAV_preference_mode_get('User',solutionPrefs.config.navigationSetID,userModeValues)
		}
		else {
			userModeValues = {itemName:[],formName:[],navItemID:[],itemDescription:[]}
		}

		//store available "modes" in code global
		solutionPrefs.access.allowedAdminPrefs = adminModeValues
		solutionPrefs.access.allowedUserPrefs = userModeValues


	//there are navigation records
	if (navigationPrefs) {
		var defaultNavSet = navigationPrefs.byNavSetID.defaultSet

		//the default for this group is the NOT same as the standard default
		if (navSet && navSet != defaultNavSet) {
			//check to see if this nav set is even available
			var found = false
			for (var i in navigationPrefs.byNavSetID) {
				if (!found) {
					if (navigationPrefs.byNavSetID[i].navSetID == navSet) {
						found = true
					}
				}
			}

			//selected navigation set to land on is no longer present; pick a random one and give an error
			if (!found) {
				navSet = null
			}
		}

		//no default selected for group, choose the first non-config layout
		if (!navSet) {
			plugins.dialogs.showErrorDialog(
						'Error',
						'No default navigation set defined\nReport to administrator'
					)
			globals.TRIGGER_feedback_create('No default navigation set')

			//how to do this without a loop?
			for (var i in navigationPrefs.byNavSetID) {
				if (!navSet && navigationPrefs.byNavSetID[i] && navigationPrefs.byNavSetID[i].navSetName != 'configPanes') {
					navSet = navigationPrefs.byNavSetID[i].navSetID
					break
				}
			}
		}
	}
	else {
		plugins.dialogs.showErrorDialog(
					'Error',
					'No navigation sets defined\nReport to administrator'
				)
		globals.TRIGGER_feedback_create('No navigation sets')
		return
	}


	//loop through all items in navPrefs and put each form in the main screen except for navigation preference items
	if (solutionPrefs.config.prefs.formPreload) {
		
		//set flag that preload happening
		solutionPrefs.config.prefs.formPreloading = true
		
		//we are using the transparent way
		if (solutionPrefs.config.prefs.formPreloadGray) {
			//figure out how many nav items we are looking at
			var totalForms = 0
			for (var i in navigationPrefs.byNavItemID) {
				//selected nav item is to be preloaded
				if (navigationPrefs.byNavItemID[i].navigationItem.preloadForm) {
					var wfForm = navigationPrefs.byNavItemID[i].navigationItem.formToLoad

					//form is to be preloaded
					if (wfForm && forms[wfForm] && !navigationPrefs.byNavItemID[i].navigationItem.configType) {
						totalForms++
					}
				}
			}

			if (totalForms) {
				globals.TRIGGER_progressbar_start(0,'Pre-loading forms.  Please wait...')
				globals.TRIGGER_interface_lock(true,true)
			}
		}
		//non-transparent way
		else {
			globals.TRIGGER_interface_lock(true,true,true,true,'Please wait...Pre-loading')
		}

		var formCount = 0
		for (var i in navigationPrefs.byNavItemID) {
			var wfForm = navigationPrefs.byNavItemID[i].navigationItem.formToLoad

			//main form
			if (wfForm && forms[wfForm] && !navigationPrefs.byNavItemID[i].navigationItem.configType) {
				//selected nav item is to be preloaded
				if (navigationPrefs.byNavItemID[i].navigationItem.preloadForm) {
					formCount++

					//we are using the transparent way
					if (solutionPrefs.config.prefs.formPreloadGray) {
						globals.TRIGGER_progressbar_set((formCount / totalForms) * 100)
					}
					//non-transparent
					else {
						forms[baseForm].elements.gfx_curtain.text = 'Please wait...Pre-loading ' + navigationPrefs.byNavItemID[i]._about_ +'.'
					}

					forms[baseForm].elements.tab_content_C.addTab(forms[wfForm],'')
					forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()

					application.updateUI()

					//loop over all elements, find tab panels
					for (var j in forms[wfForm].elements) {

						//this is a tabpanel
						if (forms[wfForm].elements[j].getElementType && forms[wfForm].elements[j].getElementType() == 'TABPANEL' && forms[wfForm].elements[j].getMaxTabIndex()) {

							//loop through all tabs, setting each as the active one; return to first tab when completed
							for (var k = 2; k <= forms[wfForm].elements[j].getMaxTabIndex(); k++) {
								forms[wfForm].elements[j].tabIndex = k
								application.updateUI()
							}

							forms[wfForm].elements[j].tabIndex = 1
						}
					}
				}
			}
		}

		//remove all the tabs just added
		forms[baseForm].elements.tab_content_C.removeAllTabs()
	}

	//set up favorites
	if (solutionPrefs.access.favorites.length) {
		
	}

	//run custom method for this group after filters applied
	if (methodLoginB && globals[methodLoginB]) {
		globals[methodLoginB]()
	}


	// // //
	//		6. go to selected entry point
	// // //

	//navigation set specified
	if (navSet) {
		//set value and fire method
		globals.DATASUTRA_navigation_set = navSet

		//go to selected entry point == node_2
		if (navSub) {
			navigationPrefs.byNavSetID[navSet].lastNavItem = navSub
		}
		//go to selected entry point == node_1
		else if (navMain) {
			navigationPrefs.byNavSetID[navSet].lastNavItem = navMain
		}
		//go to selected entry point == none specified (top of the stack)
		else {
			navigationPrefs.byNavSetID[navSet].lastNavItem = navigationPrefs.byNavSetID[navSet].itemsByOrder[0].navigationItem.idNavigationItem
		}

		//load navigation list in
		if (forms[baseForm].elements.tab_content_A.tabIndex > 0) {
			forms[baseForm].elements.tab_content_A.removeAllTabs()
		}

		//use html based approach for navigation item navigation pane
		forms[baseForm].elements.tab_content_A.addTab(forms[navigationList],'')
	}

	// // //
	//		13. load toolbars
	// // //

	solutionPrefs.panel = globals.DS_panel_load(groupID)


	if (solutionPrefs.config.prefs.formPreload) {
		//we are using the transparent way
		if (solutionPrefs.config.prefs.formPreloadGray) {
			globals.TRIGGER_progressbar_set(null,'Finishing up...')
		}

		globals.TRIGGER_interface_lock(false)
		
		//remove flag that preload happening
		delete solutionPrefs.config.prefs.formPreloading
	}

	// // //
	//		7. load forms in and un-maximize
	// // //
	/*
	//load navigation list in
	if (forms[baseForm].elements.tab_content_A.tabIndex > 0) {
		forms[baseForm].elements.tab_content_A.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_A.addTab(forms[listForm],'',null,null,null,null)
	forms[baseForm].elements.tab_content_A.tabIndex = forms[baseForm].elements.tab_content_A.getMaxTabIndex()
	*/

	// // //
	//		2.something-or-another resize window if different
	// // //

	//if the screen vars have a value and it is different than solutionPrefs, use it
	solutionPrefs.screenAttrib.initialScreenHeight = (initialScreenHeight && initialScreenHeight != solutionPrefs.screenAttrib.initialScreenHeight) ? initialScreenHeight : solutionPrefs.screenAttrib.initialScreenHeight
	solutionPrefs.screenAttrib.initialScreenWidth = (initialScreenWidth && initialScreenWidth != solutionPrefs.screenAttrib.initialScreenWidth) ? initialScreenWidth : solutionPrefs.screenAttrib.initialScreenWidth
	if (screenCenter != null) {
		solutionPrefs.screenAttrib.locationCenter = screenCenter
	}
	if (solutionPrefs.screenAttrib.locationCenter == 0) {
		solutionPrefs.screenAttrib.locationX = (screenX != solutionPrefs.screenAttrib.locationX) ? screenX : solutionPrefs.screenAttrib.locationX
		solutionPrefs.screenAttrib.locationY = (screenY != solutionPrefs.screenAttrib.locationY) ? screenY : solutionPrefs.screenAttrib.locationY
	}

	//custom sidebar width
	if (sidebarSize) {
		solutionPrefs.screenAttrib.sidebar.defaultSize = sidebarSize
		solutionPrefs.screenAttrib.sidebar.currentSize = sidebarSize
	}

	//custom spaces for this user
	solutionPrefs.screenAttrib.spaces = {
			standard	: {
							defaultHorizontal	: (spaceStandardHorizontal) ? spaceStandardHorizontal : solutionPrefs.screenAttrib.spaces.standard.defaultHorizontal,
							currentHorizontal	: (spaceStandardHorizontal) ? spaceStandardHorizontal : solutionPrefs.screenAttrib.spaces.standard.defaultHorizontal,
							defaultVertical		: (spaceStandardVertical) ? spaceStandardVertical : solutionPrefs.screenAttrib.spaces.standard.defaultVertical,
							currentVertical		: (spaceStandardVertical) ? spaceStandardVertical : solutionPrefs.screenAttrib.spaces.standard.defaultVertical
						},

			list		: {
							defaultHorizontal	: (spaceListHorizontal) ? spaceListHorizontal : solutionPrefs.screenAttrib.spaces.list.defaultHorizontal,
							currentHorizontal	: (spaceListHorizontal) ? spaceListHorizontal : solutionPrefs.screenAttrib.spaces.list.defaultHorizontal
						},

			vertical	: {
							defaultHorizontalOne	: (spaceVerticalHorizontalOne) ? spaceVerticalHorizontalOne : solutionPrefs.screenAttrib.spaces.vertical.defaultHorizontalOne,
							currentHorizontalOne	: (spaceVerticalHorizontalOne) ? spaceVerticalHorizontalOne : solutionPrefs.screenAttrib.spaces.vertical.defaultHorizontalOne,
							defaultHorizontalTwo	: (spaceVerticalHorizontalTwo) ? spaceVerticalHorizontalTwo : solutionPrefs.screenAttrib.spaces.vertical.defaultHorizontalTwo,
							currentHorizontalTwo	: (spaceVerticalHorizontalTwo) ? spaceVerticalHorizontalTwo : solutionPrefs.screenAttrib.spaces.vertical.defaultHorizontalTwo
						},

			centered	: {
							defaultHorizontalOne	: (spaceCenteredHorizontalOne) ? spaceCenteredHorizontalOne : solutionPrefs.screenAttrib.spaces.vertical.defaultHorizontalOne,
							currentHorizontalOne	: (spaceCenteredHorizontalOne) ? spaceCenteredHorizontalOne : solutionPrefs.screenAttrib.spaces.vertical.defaultHorizontalOne,
							defaultHorizontalTwo	: (spaceCenteredHorizontalTwo) ? spaceCenteredHorizontalTwo : solutionPrefs.screenAttrib.spaces.vertical.defaultHorizontalTwo,
							currentHorizontalTwo	: (spaceCenteredHorizontalTwo) ? spaceCenteredHorizontalTwo : solutionPrefs.screenAttrib.spaces.vertical.defaultHorizontalTwo
						},

			classic		: {
							defaultHorizontal	: (spaceClassicHorizontal) ? spaceClassicHorizontal : solutionPrefs.screenAttrib.spaces.classic.defaultHorizontal,
							currentHorizontal	: (spaceClassicHorizontal) ? spaceClassicHorizontal : solutionPrefs.screenAttrib.spaces.classic.defaultHorizontal,
							defaultVertical		: (spaceClassicVertical) ? spaceClassicVertical : solutionPrefs.screenAttrib.spaces.classic.defaultVertical,
							currentVertical		: (spaceClassicVertical) ? spaceClassicVertical : solutionPrefs.screenAttrib.spaces.classic.defaultVertical
						},

			wide		: {
							defaultHorizontal	: (spaceWideHorizontal) ? spaceWideHorizontal : solutionPrefs.screenAttrib.spaces.wide.defaultHorizontal,
							currentHorizontal	: (spaceWideHorizontal) ? spaceWideHorizontal : solutionPrefs.screenAttrib.spaces.wide.defaultHorizontal,
							defaultVertical		: (spaceWideVertical) ? spaceWideVertical : solutionPrefs.screenAttrib.spaces.wide.defaultVertical,
							currentVertical		: (spaceWideVertical) ? spaceWideVertical : solutionPrefs.screenAttrib.spaces.wide.defaultVertical
						},

			workflow	: {

						}
		}

	//resize on first run of the app on this computer when fullscreen is false
	if (solutionPrefs.config.firstRun && (!solutionPrefs.screenAttrib.kiosk.fullScreen || solutionPrefs.clientInfo.typeServoy == 'developer')) {
		application.setWindowSize(solutionPrefs.screenAttrib.initialScreenWidth,solutionPrefs.screenAttrib.initialScreenHeight)

		if (solutionPrefs.screenAttrib.locationCenter) {
			application.setWindowLocation(-1,-1)
		}
		else {
			application.setWindowLocation(solutionPrefs.screenAttrib.locationX,solutionPrefs.screenAttrib.locationY)
		}
	}

	//TURN OFF BUSY
	globals.TRIGGER_progressbar_stop()
	globals.CODE_cursor_busy(false)	

	//toolbar and sidebar load
	globals.DS_toolbar_load()
	globals.DS_sidebar_load()

	//sidebar default to on
	if (solutionPrefs.screenAttrib.sidebar.status) {
		globals.DS_sidebar_toggle(true,null,true)
	}


	// // //
	//		8. clean up
	// // //

	//clear login globals
	globals.AC_login_user = null
	globals.AC_login_password = null
	globals.AC_P_group = null

	//turn all disabled elements back on
	solutionPrefs.config.helpMode = false
	forms[baseForm + '__header'].elements.btn_navset.visible = true
	forms[baseForm + '__header'].elements.btn_space_1.visible = true
	forms[baseForm + '__header'].elements.btn_space_2.visible = true
	forms[baseForm + '__header'].elements.btn_space_3.visible = true
	forms[baseForm + '__header'].elements.btn_space_4.visible = true
	forms[baseForm + '__header'].elements.btn_space_5.visible = true
	forms[baseForm + '__header'].elements.btn_space_6.visible = true
	forms[baseForm + '__header'].elements.btn_space_7.visible = true
	forms[baseForm + '__header'].elements.btn_space_8.visible = false
	forms[baseForm + '__header'].elements.btn_space_9.visible = false
	forms[baseForm + '__header'].elements.btn_space_10.visible = false
	forms[baseForm + '__header'].elements.btn_space_11.visible = false
	forms[baseForm + '__header'].elements.btn_space_12.visible = false
	forms[baseForm + '__header'].elements.btn_space_13.visible = false
	forms[baseForm + '__header'].elements.btn_space_14.visible = false
	forms[baseForm + '__header'].elements.btn_space_dividers.visible = true
	forms[baseForm + '__header__fastfind'].elements.btn_find.visible = true
	forms[baseForm + '__header__fastfind'].elements.find_mid.visible = true
	forms[baseForm + '__header__fastfind'].elements.find_end.visible = true
	forms[baseForm + '__header__fastfind'].elements.fld_find.visible = true
	forms[baseForm + '__header'].elements.btn_pref.visible = true
	forms[baseForm + '__header'].elements.btn_fw_action.visible = true
	forms[baseForm + '__footer'].elements.lbl_status.visible = true


	//enter design mode if specified
	if (designMode) {
		globals.DEV_mode_toggle()
	}
}


}
