/**
 *
 * @param {JSEvent} event
 * @param {Any} webkit
 *
 * @properties={typeid:24,uuid:"A0AAFB46-5E98-4A7F-8BEA-104D554E6B66"}
 */
function LOGIN(event, webkit) {
	if (!_userName && !_userPass) {
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
			
			//go back to main screen form
			history.go(-(history.size() - 1))
			
			history.removeForm('DATASUTRA')
			history.removeForm(controller.getName())
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
*
* @param {Boolean} firstShow
* @param {JSEvent} event
*
* @properties={typeid:24,uuid:"04E173AB-C7A4-4B83-BEA2-DEA8F9276D36"}
*/
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		//turn off loading hider for smart client
		if (!solutionPrefs.config.webClient) {
			forms.DATASUTRA_0F_solution.elements.gfx_curtain_blank.visible = false
		}
		
		//login is disabled, why don't we show some different fields? strawberry, perhaps
		if (forms.AC_R__login.loginDisabled) {
			elements.btn_demo.visible = true
			elements.lbl_demo.visible = true
			
			elements.lbl_userName.visible = false
			elements.var_userName.visible = false
			elements.lbl_userPass.visible = false
			elements.var_userPass.visible = false
			elements.lbl_login.visible = false
			elements.btn_login.visible = false
		}
		//when login disabled, doesn't matter about new account creation
		else if (_createAccount) {
			elements.lbl_new.visible = true
			elements.var_newName.visible = true
			elements.var_newUser.visible = true
			elements.var_newPass.visible = true
			elements.btn_signup.visible = true
			elements.lbl_signup.visible = true
			elements.lbl_new_success.visible = false
			
			elements.lbl_newName.visible = true
			elements.lbl_newPass.visible = true
			elements.lbl_newUser.visible = true
			
			elements.btn_signup.visible = true
		}
		
		//retrieve user name
		var user = application.getUserProperty('sutra' + application.getServerURL().substr(7) + 'User')
		if (user) {
			_rememberMe = 1
			_userName = user
			elements.var_userPass.requestFocus()
		}
		
		_shown = true
	}
	
	// request focus in username field unless prefilled
	if (!_userName) {
		elements.var_userName.requestFocus()
	}
}
