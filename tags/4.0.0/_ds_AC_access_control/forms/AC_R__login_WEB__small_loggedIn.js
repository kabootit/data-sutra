/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3BB5B68F-208C-44F3-8ECE-C078A2EE3A4F"}
 */
var _dialog = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"69C8F52C-D56D-48DA-9EDB-DB4E7F6F6D51",variableType:-4}
 */
var _shown = false;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D0C059DE-8AA5-4217-A81F-A96CCF3CF48D"}
 */
function TEST(event) {
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
	
	if (!application.__parent__.solutionPrefs) {
		dialog(
			"Invalid login", 
			"You must enter a username and password to log in"
		)
	}
	else {
		_dialog += ' +1'
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"CE6D5C0B-0841-460A-90DA-FE2BB3B60773"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		plugins.WebClientUtils.setExtraCssClass(elements.btn_login, 'loginDS')
		_shown = true
	}
	
	_dialog = solutionPrefs.access.userName + ' is logged in.'
	
	// attach style to form to center it
	plugins.WebClientUtils.executeClientSideJS('centerForm("' + controller.getName() + '");')
	
	// move indicator to beside the login button
	plugins.WebClientUtils.executeClientSideJS('loginIndicator(500);')
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"E604DACC-EACD-4B19-A288-F0954A541F36"}
 */
function LOGOUT(event) {
	plugins.WebClientUtils.executeClientSideJS('reLogin(true);')
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"FE4F9514-776E-4F83-87A3-B86119E0C7A6"}
 */
function CONT(event) {
	globals.DS_router(null,null,solutionPrefs.config.currentFormID,true)
}
