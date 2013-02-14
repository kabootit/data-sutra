/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"319152F8-B311-41FB-B634-B3C8A0C55609"}
 */
var _dialog = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E075A426-1DA4-4DA4-AC09-0F953458B930"}
 */
var _userEmail = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"73B03401-29D4-4D0C-A55C-5DCD4054D525"}
 */
var _userPass = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3D751FF0-E1E6-4258-AA14-8FA53D4C8D9E"}
 */
var _userName = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"A016FD15-0D34-4B6A-95D2-B0C62E4AD9AF",variableType:-4}
 */
var _shown = false;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"CF67DCEA-F64F-4121-AFEC-8E1BD5951C37"}
 */
function LOGIN(event) {
	function dialog(title,text) {
		var html = '<html><body>'
		
		html += '<strong>' + (title || 'Login error') + '</strong><br/><br/>'
		if (text) {
			html += '<font color="#B00D00">' + text + '</font>'
		}
		
		html += '</body></html>'
		
		_dialog = html
		
		//show dialog after page renders, hide it 4 seconds later
		//$('.dialogDS').fadeIn('medium')
		//$('.dialogDS').fadeOut('slow')
		plugins.WebClientUtils.executeClientSideJS('setTimeout(function(){$(".dialogDS").fadeIn("medium")},250);')
		plugins.WebClientUtils.executeClientSideJS('setTimeout(function(){$(".dialogDS").fadeOut("slow")},4500);')
	}
	
	if (!_userName && !_userPass) {
		dialog(
			"Invalid login", 
			"You must enter a username and password to log in"
		)
		elements.var_userName.requestFocus()
	}
	else if (!_userName && _userPass) {
		dialog(
			"Empty user", 
			"You must enter a username to log in"
		)
		elements.var_userName.requestFocus()
	}
	else if (_userName && !_userPass) {
		dialog(
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
		var status = forms.AC_R__login_1F__password.LOGIN_user(null,dialog)
		
		if (typeof status == 'boolean' && status) {
			//set global for busy cursor in webclient
			globals.DATASUTRA_web_cursor = true
			
			//go back to main screen form
			history.go(-(history.size() - 1))
			
			history.removeForm('DATASUTRA')
			history.removeForm(controller.getName())
			
			//add on the "you're already logged in, dummy form"
			forms.AC_R__login_WEB__small_loggedIn.controller.show()
			history.go(-1)
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
 * @properties={typeid:24,uuid:"2FFB164E-9836-41E4-B919-FC869EEA3C09"}
 */
function RESET(event) {
	if (_userEmail) {
		var msg = 'Reset complete'
	}
	else {
		var msg = 'Not a valid email address'
	}
	
	plugins.WebClientUtils.executeClientSideJS('alert("' + msg + '");')
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"67667C49-C501-4DFE-BC4C-95363FAAD540"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		plugins.WebClientUtils.setExtraCssClass(elements.var_dialog, 'dialogDS')
		plugins.WebClientUtils.setExtraCssClass(elements.btn_login, 'loginDS')
		_shown = true
	}

	//turn off auto-capitalize on iOS
	plugins.WebClientUtils.executeClientSideJS('$("#' + plugins.WebClientUtils.getElementMarkupId(elements.var_userName) +'").attr("autocapitalize","off");')
	
	// attach style to form to center it
	plugins.WebClientUtils.executeClientSideJS('centerForm("' + controller.getName() + '");')
	
	// move indicator to beside the login button
//	plugins.WebClientUtils.executeClientSideJS('loginIndicator(500);')
	
	elements.var_userName.requestFocus()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"570800B0-7A77-40C7-9579-EC7672A7EBB1"}
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
