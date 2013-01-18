/**
 * Focus password field
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"C88C4438-5171-4166-BB9D-332FC0F75E3E",variableType:-4}
 */
var _focusUser = false;

/**
 * Focus password field
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"450EB289-AC27-4436-8D0B-B46E03A922BC",variableType:-4}
 */
var _focusPass = false;

/**
 * Show fields that allow for auto-account creation
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"4143AA32-A679-4966-A6B4-24BF238B20C5",variableType:-4}
 */
var _createAccount = true;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B73D027C-6242-4823-96E3-6A44CBD08A64",variableType:4}
 */
var _rememberMe = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E413ED4B-CD8E-4B83-9B56-5C277E2C9AC4"}
 */
var _newName = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"FEC77D88-9590-4D66-A80F-21779CDE918C"}
 */
var _newPass = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"95303ECF-EAE3-488B-AD32-E35DE0A2BE43"}
 */
var _newUser = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"2A4594E7-5296-4234-8BA4-ECC847C3582D"}
 */
var _dialog = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9ED26EF9-9E46-49B3-826A-DA299FB30270"}
 */
var _userEmail = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"08880243-807F-4F12-84A2-85D9394D83A8"}
 */
var _userPass = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"DB9AC64B-8D1B-4AF2-9DA1-30E3C7B304D9"}
 */
var _userName = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"78DF5B61-BBED-40CF-A486-4A85AF584395",variableType:-4}
 */
var _shown = false;

/**
 * @param {String} title
 * @param {String} text
 *
 * @properties={typeid:24,uuid:"6F78801C-6F8C-42A0-B58A-0BA353ECEB0F"}
 */
function SET_dialog(title,text) {
	var html = '<html><body>'
	
	html += '<strong>' + (title || 'Login error') + '</strong><br/><br/>'
	if (text) {
		html += '<font color="#B00D00">' + text + '</font>'
	}
	
	html += '</body></html>'
	
	_dialog = html
	
	//show dialog after page renders, hide it 4 seconds later
	if (solutionPrefs.config.webClient) {
		plugins.WebClientUtils.executeClientSideJS('setTimeout(function(){$(".dialogDS").fadeIn("medium")},250);')
		plugins.WebClientUtils.executeClientSideJS('setTimeout(function(){$(".dialogDS").fadeOut("slow")},4500);')
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {Boolean} isWebkit Flag that ok to proceed with login
 *
 * @properties={typeid:24,uuid:"5B798C58-937C-4967-82CC-1C59FF1F5D95"}
 */
function LOGIN(event,webkit) {
	//browser sniffing
	if (typeof webkit == 'string') {
		webkit = eval(webkit)
	}
	else {
		plugins.WebClientUtils.executeClientSideJS('var isWebkit = browserCheck();',LOGIN,[null,'isWebkit'])
		return
	}
	
//	//disable pretty urls
//	if (!webkit) {
////		SET_dialog(
////			"Unsupported browser", 
////			"You are using an unsupported browser and cannot log in.<br><br>Please try again with Chrome or Safari."
////		)
////
////		globals.DATASUTRA_router_enable = false
//	}
	
	//only allow webkit
	if (!webkit) {
		SET_dialog(
			"Unsupported browser", 
			"You are using an unsupported browser and cannot log in.<br><br>Please try again with Chrome or Safari."
		)
	}
	else if (!_userName && !_userPass) {
		SET_dialog(
			"Invalid login", 
			"You must enter a username and password to log in"
		)
		elements.var_userName.requestFocus()
	}
	else if (!_userName && _userPass) {
		SET_dialog(
			"Empty user", 
			"You must enter a username to log in"
		)
		elements.var_userName.requestFocus()
	}
	else if (_userName && !_userPass) {
		SET_dialog(
			"Empty password", 
			"You must enter a password to log in"
		)
		elements.var_userPass.requestFocus()
	}
	else {
		//set globals to actually run login
		globals.AC_login_user = _userName
		globals.AC_login_password = _userPass
		
		//continue method
		var status = forms.AC_R__login_1F__password.LOGIN_user(null,SET_dialog)
		
		if (typeof status == 'boolean' && status) {
			//update the remember/forget status
			SET_remember()
			
			globals.DS_web_login_running = true
			
			plugins.WebClientUtils.executeClientSideJS('pulseOn();')
			
			//set global for busy cursor in webclient
			globals.DATASUTRA_web_cursor = true
			
			//go back to main screen form
			history.go(-(history.size() - 1))
			
			history.removeForm('DATASUTRA')
			history.removeForm(controller.getName())
			
			//add on the "you're already logged in, dummy form"
			forms.AC_R__login_WEB__small_loggedIn.controller.show()
			history.go(-1)
			
			//go to nav item requested
			var prefix = '/'
			if (globals.DATASUTRA_router.length && globals.DATASUTRA_router[0].pathString != prefix + 'login') {
				globals.DATASUTRA_router_initialHix = true
				globals.DS_router('DSHistory')
			}
		}
		else {
			_userName = globals.AC_login_user
			_userPass = globals.AC_login_password
			
			//some logic to enter correct field
			if (!_userName) {
				elements.var_userName.requestFocus()
			}
			else {
				elements.var_userPass.requestFocus()
			}
		}
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"ABCDFAF8-CFCB-4AFB-8267-1111535B8547"}
 */
function RESET(event) {
	if (_userEmail) {
		var msg = 'Reset complete'
	}
	else {
		var msg = 'Not a valid email address'
	}

	if (solutionPrefs.config.webClient) {
	//	plugins.WebClientUtils.executeClientSideJS('alert("' + msg + '");')
		plugins.WebClientUtils.executeClientSideJS('alert("Email your username or email to reset@data-mosaic.com");')
	}
	else {
		globals.DIALOGS.showInfoDialog('',"Email your username or email to reset@data-mosaic.com")
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"F9A8228A-2929-476D-846C-BE8A6E74B256"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		//css classes for transitions
		plugins.WebClientUtils.setExtraCssClass(elements.var_dialog, 'dialogDS')
		
		//css classes for positioning of indicator spinner
		plugins.WebClientUtils.setExtraCssClass(elements.btn_login, 'loginDS')
		
		//css class for underline hover behavior
		plugins.WebClientUtils.setExtraCssClass(elements.var_rememberMe, 'rememberMe')
		plugins.WebClientUtils.setExtraCssClass(elements.lbl_forgot_password, 'forgotPass')
		
		if (_createAccount) {
			plugins.WebClientUtils.setExtraCssClass(elements.lbl_new, 'newDS')
			plugins.WebClientUtils.setExtraCssClass(elements.var_newName, 'newDS')
			plugins.WebClientUtils.setExtraCssClass(elements.var_newUser, 'newDS')
			plugins.WebClientUtils.setExtraCssClass(elements.var_newPass, 'newDS')
			plugins.WebClientUtils.setExtraCssClass(elements.btn_signup, 'newDS')		
			plugins.WebClientUtils.setExtraCssClass(elements.lbl_new_success, 'newSuccessDS')
			
			plugins.WebClientUtils.setExtraCssClass(elements.btn_signup, 'signupDS')
		}
		
		//retrieve user name
		var user = application.getUserProperty('sutra' + application.getServerURL().substr(7) + 'User')
		if (user) {
			_rememberMe = 1
			_userName = user
			_focusPass = true
		}
		
		//store down if an ipad/iphone/desktop experience
		plugins.WebClientUtils.executeClientSideJS('var dsFormFactor = dsFactor();',scopes.DS.webFactorSet,['dsFormFactor'])
		
		_shown = true
	}
	
	//fill place holder texts
	var elems = [
		plugins.WebClientUtils.getElementMarkupId(elements.var_userName),
		plugins.WebClientUtils.getElementMarkupId(elements.var_userPass),
		plugins.WebClientUtils.getElementMarkupId(elements.var_newName),
		plugins.WebClientUtils.getElementMarkupId(elements.var_newUser),
		plugins.WebClientUtils.getElementMarkupId(elements.var_newPass)
	]
	var texts = [
		'Username / Email',
		'Password',
		'Full name',
		'Email',
		'Password'
	]
	plugins.WebClientUtils.executeClientSideJS('setPlaceHolders(' + JSON.stringify(elems) + ',' + JSON.stringify(texts) + ');')
	
	//turn off auto-capitalize on iOS and set to use email keyboard (<-- this breaks servoys tie-in)
	var id = plugins.WebClientUtils.getElementMarkupId(elements.var_userName)
//	plugins.WebClientUtils.executeClientSideJS('$("#' + id +'").get(0).type = "email";')
	plugins.WebClientUtils.executeClientSideJS('$("#' + id +'").attr("autocapitalize","off");')
	
	// attach style to form to center it
	plugins.WebClientUtils.executeClientSideJS('centerForm("' + controller.getName() + '");')
	
	// move indicator to beside the login button
	INDICATOR()
	
	// request focus in username field unless prefilled
	if (!_userName) {
		_focusUser = true
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"86418204-CDC1-403C-81DC-36A19F06F72A"}
 */
function DEMO(event) {
	//continue method with a/c off
	forms.AC_R__login_1F__nopassword.login_disabled = 1
	forms.DATASUTRA_WEB_0F.FORM_setup('DATASUTRA_WEB_0F','DATASUTRA_0F_solution__blank_4')
	forms.AC_R__login_1F__nopassword.ACTION_continue()
	forms.AC_R__login_1F__nopassword.login_disabled = 0
	
	//go back to main screen form
	history.go(-(history.size() - 1))
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"5AADF1F9-D7A2-4F65-BD40-4A98CC385F6E"}
 * @AllowToRunInFind
 */
function CREATE(event) {
	if (_newName && _newUser && _newPass) {
		/** @type {JSFoundSet<db:/sutra/sutra_access_user>} */
		var fsUser = databaseManager.getFoundSet('sutra','sutra_access_user')
		
		//check to make sure this email doesn't already have an account
		fsUser.find()
		fsUser.user_name = _newUser
		var results = fsUser.search()
		
		if (results) {
			SET_dialog(
				"Account exists",
				"An account already exists for this email address."
			)
			elements.var_newUser.requestFocus()
			return
		}
		
		//check to make sure this user/pass doesn't already exist
		fsUser.find()
		fsUser.user_name = _newUser
		fsUser.user_password = plugins.sutra.encrypt(_newPass)
		var results = fsUser.search()
		
		//already have a user/pass comobo here...make up some error
		if (results) {
			SET_dialog(
				"Password error",
				"The password you entered is not cryptographic enough.<br><br>Please try a different one."
			)
			return
		}
		
		//email validation
		
		
		//do we have a first and last name?
		var myName = _newName.split('_')
		if (myName.length > 1) {
			var lastName = myName[myName.length - 1]
			myName.pop()
			var firstName = myName.join(' ')
		}
		else {
			var lastName = _newName
			var firstName = ''
		}
		
		//create new SaaS org and populate with data
		
		/** @type {JSFoundSet<db:/sutra/sutra_access_organization>} */
		var fsOrg = databaseManager.getFoundSet('sutra','sutra_access_organization')
		var newOrg = fsOrg.getRecord(fsOrg.newRecord(false,true))
		newOrg.name_organization = _newUser
		
		var newStaff = newOrg.ac_access_organization_to_access_staff.getRecord(newOrg.ac_access_organization_to_access_staff.newRecord(false,true))
		newStaff.email = _newUser
		newStaff.name_last = lastName
		newStaff.name_first = firstName
		
		var newUser = fsUser.getRecord(fsUser.newRecord(false,true))
		newUser.id_organization = newOrg.id_organization
		newUser.user_name = _newUser
		//MEMO: all password rules are bypassed...we just take whatever they give us
		newUser.user_password = plugins.sutra.encrypt(_newPass)
		//hard coded everybody to developer group
		newUser.id_group = 3
		newUser.id_staff = newStaff.id_staff
		newUser.pass_never_expires = 1
		newUser.date_password_changed = application.getServerTimeStamp()
		
		var userGroup = newUser.ac_access_user_to_access_user_group.getRecord(newUser.ac_access_user_to_access_user_group.newRecord(false,true))
		//hard coded everybody to developer group
		userGroup.id_group = 3
		userGroup.id_user = newUser.id_user
		userGroup.flag_chosen = 1
		
		databaseManager.saveData()
		
		//create sample dataset
		globals.AC_sample_data(newOrg)
		
		_userName = _newUser
		_userPass = null
		elements.var_userPass.requestFocus()
		
		//send email with successful blah
		
		
		//go ahead and prefill user name
		SET_dialog(
			"Success",
			"Your account has been created.<br>Please enter your password to login..."
		)
		
		//toggle elements showing
		if (solutionPrefs.config.webClient) {
			plugins.WebClientUtils.executeClientSideJS('setTimeout(function(){$(".newSuccessDS").fadeIn("medium")},250);')
			plugins.WebClientUtils.executeClientSideJS('setTimeout(function(){$(".newDS").fadeOut("slow")},250);')
			plugins.WebClientUtils.executeClientSideJS('setTimeout(function(){$(".signupDS").fadeOut("slow")},250);')
		}
		else {
			elements.lbl_new.visible = false
			elements.var_newName.visible = false
			elements.var_newUser.visible = false
			elements.var_newPass.visible = false
			elements.btn_signup.visible = false
			elements.lbl_signup.visible = false
			elements.lbl_new_success.visible = true
			
			elements.lbl_newName.visible = false
			elements.lbl_newPass.visible = false
			elements.lbl_newUser.visible = false
			
			elements.btn_signup.visible = false
		}
	}
	else {
		SET_dialog(
			"Blank values",
			"You must enter your name, email, and password"
		)
	}
}

/**
 * Set indicator in appropriate place.
 *
 * @param {JSEvent} [event] the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D3E23C6B-CBEE-44DD-8EE1-52779CEE571A"}
 */
function INDICATOR(event) {
	if (solutionPrefs.config.webClient) {
		//put indicator next to sign up
		if (event && utils.stringPatternCount(event.getElementName(),'new')) {
			plugins.WebClientUtils.executeClientSideJS('loginIndicator(true);')
		}
		//indicator next to sign in
		else {
			plugins.WebClientUtils.executeClientSideJS('loginIndicator();')
		}
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} [event] the event that triggered the action
 *
 * @properties={typeid:24,uuid:"DD76B361-CB7E-4F15-9FFE-472AEBB9E65C"}
 */
function SET_remember(event) {
	//remember user
	if (_rememberMe) {
		application.setUserProperty('sutra' + application.getServerURL().substr(7) + 'User',_userName)
	}
	//forget user
	else {
		if (application.getUserProperty('sutra' + application.getServerURL().substr(7) + 'User')) {
			application.setUserProperty('sutra' + application.getServerURL().substr(7) + 'User',null)
		}
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"E30E75E2-F861-43A9-A855-C35991723B38"}
 */
function asdf(event) {
	var k = globals.CODE_appserver_get()
	if (k instanceof Continuation) {
	  application.output("k is a continuation");
	    k(200);
	 } else {
		 application.output("k is now a " + typeof(k));
	 }
	 application.output(k);
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"2990C7A7-7408-41C5-9D6A-11FED0B45CF3"}
 */
function FORM_on_load(event) {
	if (_createAccount) {
		elements.lbl_new.visible = true
		elements.var_newName.visible = true
		elements.var_newUser.visible = true
		elements.var_newPass.visible = true
		elements.btn_signup.visible = true
		elements.lbl_new_success.visible = true
	}
}
