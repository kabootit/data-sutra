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
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"5B798C58-937C-4967-82CC-1C59FF1F5D95"}
 */
function LOGIN(event) {
	//go back to main screen form
	history.go(-2)
	
	//continue method
	forms.AC_R__login_1F__nopassword.ACTION_continue()
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
	
	plugins.WebClientUtils.executeClientSideJS('alert("' + msg + '");')
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
	// attach style to form to center it
	// $("#form_AC_R__login_WEB__nopassword").css({width: '50%', margin: '0px auto'});
	
	plugins.WebClientUtils.executeClientSideJS('centerForm("' + controller.getName() + '");')
}
