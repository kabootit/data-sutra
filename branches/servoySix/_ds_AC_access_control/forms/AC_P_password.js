/**
 *
 * @properties={typeid:24,uuid:"a2814548-b52d-4c22-a714-69b43180991a"}
 */
function ACTION_cancel()
{

/*
 *	TITLE    :	ACTION_cancel
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Jan 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//not already ok to close, cancel
if (!globals.CODE_hide_form) {
	globals.AC_password_edit_1 = null
	globals.AC_password_edit_2 = null
	
	//set flag for login method that password form cancelled
	this.cancelled = true
	
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	globals.CODE_form_in_dialog_close('accessPassEdit')
}
}

/**
 *
 * @properties={typeid:24,uuid:"9b14aac9-0712-49c1-9b08-929c5abf7fa1"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	check password, save md5, close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */ //TODO alpha check is ok for digits

if (application.__parent__.solutionPrefs && solutionPrefs.access) {
	
	var alphaNum = solutionPrefs.access.password.alphaNum
	var nonAlphaNum = solutionPrefs.access.password.nonAlphaNum
	var alphaCase = solutionPrefs.access.password.alphaCase
	var notUserName = solutionPrefs.access.password.notUserName
	var prevMatchCount = (solutionPrefs.access.password.prevMatch) ? solutionPrefs.access.password.prevMatchCount : null
	var lengthMin = (solutionPrefs.access.password.length) ? solutionPrefs.access.password.lengthMin : null
	var lengthMax = (solutionPrefs.access.password.length) ? solutionPrefs.access.password.lengthMax : null
	
	//check that not empty
	if (globals.AC_password_edit_1 == null) {
		plugins.dialogs.showErrorDialog('Password error','The password cannot be empty')
		elements.fld_AC_password_edit.requestFocus(false)
	}
	//check 1 against 2
	else if (globals.AC_password_edit_1 != globals.AC_password_edit_2) {
		plugins.dialogs.showErrorDialog('Password error','The two passwords entered do not match')
		elements.fld_AC_password_edit.requestFocus(false)
	}
	else {
		//check to make sure not username
		if (notUserName) {
			if (user_name && user_name.toLowerCase() == globals.AC_password_edit_1.toLowerCase()) {
				globals.AC_password_edit_1 = null
				globals.AC_password_edit_2 = null
				plugins.dialogs.showErrorDialog('Password error','Password cannot be the same as the user name')
				elements.fld_AC_password_edit.requestFocus(false)
				var userName = true
			}
		}
		
		//check for presence of at least one alpha and at least one numeric
		if (alphaNum && !userName) {
			var alpha = globals.AC_password_edit_1.search(/[a-zA-Z]/)
			var number = globals.AC_password_edit_1.search(/\d/)
			
			if (alpha == -1 || number == -1) {
				globals.AC_password_edit_1 = null
				globals.AC_password_edit_2 = null
				plugins.dialogs.showErrorDialog('Password error','Password must contain at least one letter and one number')
				elements.fld_AC_password_edit.requestFocus(false)
				var alphaNumFailed = true
			}
		}
		
		//check for presence of at least one non alpha-numeric character
		if (nonAlphaNum && !alphaNumFailed && !userName) {
			var non = globals.AC_password_edit_1.search(/[^a-zA-Z\d]/)
			
			if (non == -1) {
				globals.AC_password_edit_1 = null
				globals.AC_password_edit_2 = null
				plugins.dialogs.showErrorDialog('Password error','Password must contain at least one non-alphanumeric character')
				elements.fld_AC_password_edit.requestFocus(false)
				var nonAlphaFailed = true
			}
		}
		
		//check for presence upper and lower case
		if (alphaCase && !alphaNumFailed && !nonAlphaFailed && !userName) {
			var upperCase = globals.AC_password_edit_1.search(/[A-Z]/)
			var lowerCase = globals.AC_password_edit_1.search(/[a-z]/)
			
			if (upperCase == -1 || lowerCase == -1) {
				globals.AC_password_edit_1 = null
				globals.AC_password_edit_2 = null
				plugins.dialogs.showErrorDialog('Password error','Password must contain at least one upper case and one lower case letter')
				elements.fld_AC_password_edit.requestFocus(false)
				var camelCaseFailed = true
			}
		}
		
		//check length
		if (lengthMin != null && lengthMax != null && !alphaNumFailed && !nonAlphaFailed && !camelCaseFailed && !userName) {
			var length = globals.AC_password_edit_1.length
			if (lengthMin > length || lengthMax < length) {
				globals.AC_password_edit_1 = null
				globals.AC_password_edit_2 = null
				plugins.dialogs.showErrorDialog('Password error','Password must be between '+lengthMin+' and '+lengthMax+' characters long')
				elements.fld_AC_password_edit.requestFocus(false)
				var lengthFail = true
			}
		}
		
		//check that doesn't match previous n passwords
		if (prevMatchCount && !alphaNumFailed && !nonAlphaFailed && !camelCaseFailed && !userName && !lengthFail) {
			var previous = old_passwords
			if (previous && previous.length) {
				previous = previous.split('\n',prevMatchCount)
				
				var testPassword = plugins.sutra.encrypt(globals.AC_password_edit_1)
				var previousMatch = false
				
				for (var i = 0; i < previous.length && !previousMatch; i++) {
					if (testPassword == previous[i]) {
						globals.AC_password_edit_1 = null
						globals.AC_password_edit_2 = null
						plugins.dialogs.showErrorDialog('Password error','You have used this as a password in the previous '+prevMatchCount+' passwords.')
						elements.fld_AC_password_edit.requestFocus(false)
						previousMatch = true
					}
				}
			}
		}
		
		//check uniqueness of user/pass combo
		if (globals.AC_password_edit_1 != null) {
			var newPassword = plugins.sutra.encrypt(globals.AC_password_edit_1)
			
			var fsUser = databaseManager.getFoundSet(controller.getServerName(), controller.getTableName())
			fsUser.clear()
			fsUser.find()
			fsUser.user_name = user_name
			fsUser.user_password = newPassword
			fsUser.id_user = '!'+id_user
			var results = fsUser.search()
			
			//not unique, throw error
			if (results) {
				plugins.dialogs.showErrorDialog('Password error','The chosen password is unacceptable')
				elements.fld_AC_password_edit.requestFocus(false)
			}
			//unique, accept
			else {
				//check to see that password is actually different
				var proceed = 'No'
				if (user_password == newPassword) {
					proceed = plugins.dialogs.showWarningDialog(
									'Warning',
									'The password you just entered is not different from your current password.\n' +
									'This is NOT recommended.  Do you want to change your password again?',
									'Yes',
									'No'
								)
				}
				
				//change the password, even if it is the same
				if (proceed == 'No') {
					//set new password
					user_password = newPassword
					//log new password at top
					old_passwords = (old_passwords) ? newPassword + '\n' + old_passwords : newPassword
					//date changed
					date_password_changed = application.getServerTimeStamp()
					
					pass_change_at_login = 0
					plugins.dialogs.showInfoDialog('Password changed','The password has been successfully changed')
					globals.AC_password_edit_1 = null
					globals.AC_password_edit_2 = null
					
					//enaable closing the form
					globals.CODE_hide_form = 1
					
					globals.CODE_form_in_dialog_close('accessPassEdit')
				}
				//enter a new password
				else {
					globals.AC_password_edit_1 = null
					globals.AC_password_edit_2 = null
					elements.fld_AC_password_edit.requestFocus(false)
				}
			}
		}
	}
}
else {
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	globals.CODE_form_in_dialog_close('accessPassEdit')
}
}

/**
 *
 * @properties={typeid:24,uuid:"c2f98799-7fbd-4aee-a0eb-a9c8da0a1483"}
 */
function CAPS_off()
{
CAPS_toggle(false)
}

/**
 *
 * @properties={typeid:24,uuid:"457f2de2-20ec-4c2a-8a9e-2ea911d54330"}
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
 * @properties={typeid:24,uuid:"dd9f6e59-5d79-4c48-8a2b-d97d507d796d"}
 */
function CAPS_toggle()
{

/*
 *	TITLE    :	TOGGLE_capslock
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	toggle status of element gfx_capslock on calling form depending on state of CAPS key
 *			  	move capslock graphic to correct place
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

var formName = application.getMethodTriggerFormName()
var elemName = application.getMethodTriggerElementName()

//focrce the indicator on/off
var capStatus = arguments[0]

//no arguments passed, just take curret state of caps lock key
if (!(typeof capStatus == 'boolean')) {
	capStatus = java.awt.Toolkit.getDefaultToolkit().getLockingKeyState(java.awt.event.KeyEvent.VK_CAPS_LOCK)
}

//if current location is incorrect, move to correct place
if (formName && elemName && forms[formName] && forms[formName].elements[elemName] && forms[formName].elements.gfx_capslock &&
	(forms[formName].elements[elemName].getLocationY() + 4) != forms[formName].elements.gfx_capslock.getLocationY()) {
	
	forms[formName].elements.gfx_capslock.setLocation(forms[formName].elements.gfx_capslock.getLocationX(),forms[formName].elements[elemName].getLocationY() + 4)
}

//if current visibility different than one needed, set it
	//TODO: don't show cap status when on mac...probably java version related
if (elements.gfx_capslock.visible != capStatus && 	!(application.getOSName() == 'Mac OS X')) {
	elements.gfx_capslock.visible = capStatus
}



}

/**
 *
 * @properties={typeid:24,uuid:"ad9e99a4-cbc9-4d1c-8e58-45a942208c9b"}
 */
function FORM_fid()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	get current rules for passwords, show FiD
 *			  	
 *	INPUT    :	1) id_user for user record to be modified
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var userID = arguments[0]

//refresh password prefs
globals.AC_password_set()

//find correct field
controller.find()
id_user = userID
controller.search()

globals.AC_password_edit_1 = null
globals.AC_password_edit_2 = null

//show form in dialog
globals.CODE_form_in_dialog(
		forms.AC_P_password,
		-1,-1,-1,-1,
		'Password',
		false,
		false,
		'accessPassEdit'
	)
}

/**
 *
 * @properties={typeid:24,uuid:"1976476c-5892-401a-b7ab-d74c81e42cd0"}
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

//running in servoy < 4 or >= 5
if (utils.stringToNumber(application.getVersion()) < 4 || utils.stringToNumber(application.getVersion()) >= 5) {
	
	var elems = new Array(elements.fld_AC_password_edit,elements.fld_AC_password_confirm)
	
	for (var i = 0; i < elems.length; i++) {
		var elem = globals.CODE_java_component(elems[i])
		
		elem.addKeyListener(new Packages.java.awt.event.KeyListener({keyPressed:CAPS_pressed}))
		elem.addKeyListener(new Packages.java.awt.event.KeyListener({keyReleased:CAPS_pressed}))
	}

}


}

/**
 *
 * @properties={typeid:24,uuid:"d731728d-001f-4ed8-8177-4d268eda4150"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	get current rules for passwords, show FiD
 *			  	
 *	INPUT    :	1) id_user for user record to be modified
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//disable closing the form
globals.CODE_hide_form = 0

//turn caps lock off
elements.gfx_capslock.visible = false

//request focus in password field
application.updateUI()
elements.fld_AC_password_edit.requestFocus(false)
}
