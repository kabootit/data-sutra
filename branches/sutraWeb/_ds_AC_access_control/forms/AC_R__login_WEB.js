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
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"5B798C58-937C-4967-82CC-1C59FF1F5D95"}
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
 * @properties={typeid:24,uuid:"ABCDFAF8-CFCB-4AFB-8267-1111535B8547"}
 */
function RESET(event) {
	if (_userEmail) {
		var msg = 'Reset complete'
	}
	else {
		var msg = 'Not a valid email address'
	}
	
//	plugins.WebClientUtils.executeClientSideJS('alert("' + msg + '");')
	plugins.WebClientUtils.executeClientSideJS('alert("Email your username or email to reset@data-mosaic.com");')
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
		plugins.WebClientUtils.setExtraCssClass(elements.var_dialog, 'dialogDS')
		plugins.WebClientUtils.setExtraCssClass(elements.btn_login, 'loginDS')
		plugins.WebClientUtils.setExtraCssClass(elements.btn_signup, 'signupDS')
		
		_shown = true
	}
	
	//fill place holder texts
	var elems = [
		plugins.WebClientUtils.getElementMarkupId(elements.var_userName),
		plugins.WebClientUtils.getElementMarkupId(elements.var_userPass),
		plugins.WebClientUtils.getElementMarkupId(elements.var_newUser),
		plugins.WebClientUtils.getElementMarkupId(elements.var_newPass)
	]
	var texts = [
		'Username / Email',
		'Password',
		'Email',
		'Password'
	]
	plugins.WebClientUtils.executeClientSideJS('setPlaceHolders(' + JSON.stringify(elems) + ',' + JSON.stringify(texts) + ');')
	
	//turn off auto-capitalize on iOS
	plugins.WebClientUtils.executeClientSideJS('$("#' + plugins.WebClientUtils.getElementMarkupId(elements.var_userName) +'").attr("autocapitalize","off");')
	
	// attach style to form to center it
	plugins.WebClientUtils.executeClientSideJS('centerForm("' + controller.getName() + '");')
	
	// move indicator to beside the login button
	INDICATOR()
	
	elements.var_userName.requestFocus()
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
 */
function CREATE(event) {
	globals.DIALOGS.showInfoDialog('Coming soon','Before you know it...')
	
	//email validation
	
	//create new SaaS org and populate with data
	
	
	//send email with successful blah
	
}

/**
 * Handle changed data.
 *
 * @param {String} [oldValue] old value
 * @param {String} [newValue] new value
 * @param {JSEvent} [event] the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D3E23C6B-CBEE-44DD-8EE1-52779CEE571A"}
 */
function INDICATOR(oldValue, newValue, event) {
	//put indicator next to sign up
	if (event && utils.stringPatternCount(event.getElementName(),'new')) {
		plugins.WebClientUtils.executeClientSideJS('loginIndicator(true);')
	}
	//indicator next to sign in
	else {
		plugins.WebClientUtils.executeClientSideJS('loginIndicator();')
	}
}
