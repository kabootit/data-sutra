/**
 *
 * @properties={typeid:24,uuid:"95866189-8823-4734-b756-3163cead9e69"}
 */
function CAPS_off()
{
CAPS_toggle(false)
}

/**
 *
 * @properties={typeid:24,uuid:"5cff1c06-2d1e-4568-989d-67b04d843815"}
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
 * @properties={typeid:24,uuid:"4287c93a-d661-4532-b1a6-e2fad7259063"}
 */
function CAPS_toggle()
{

/*
 *	TITLE    :	TOGGLE_capslock
 *			  	
 *	MODULE   :	start_CRM_mosaic
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
if (elements.gfx_capslock.visible != capStatus) {
	elements.gfx_capslock.visible = capStatus
}



}

/**
 *
 * @properties={typeid:24,uuid:"050d0aa0-9491-4751-949c-f8711628a16d"}
 */
function FLD_focus_gained__login_user()
{

/*
 *	TITLE    :	FLD_focus_gained__login_user
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	trick to fire onShow-esque method
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_focus_gained__login_user()
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */


}

/**
 *
 * @properties={typeid:24,uuid:"1101ca87-e518-4ee9-aac0-a2e57ddc4175"}
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

	var elem = globals.CODE_java_component(elements.fld_AC_login_password)
	
	elem.addKeyListener(new Packages.java.awt.event.KeyListener({keyPressed:CAPS_pressed}))
	elem.addKeyListener(new Packages.java.awt.event.KeyListener({keyReleased:CAPS_pressed}))

}



}

/**
 *
 * @properties={typeid:24,uuid:"468cabd2-e1b8-45b8-b790-4c59697583e7"}
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
 *	MODIFIED :	March 27, 2009 -- Troy Elliott, Data Mosaic
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
 * @properties={typeid:24,uuid:"722a3cf9-5e82-4846-8529-ed03e1d5d25b"}
 */
function LOGIN_user()
{

var baseForm = solutionPrefs.config.formNameBase

//check credentials
	//MEMO: only user from same group can come into this session, otherwise, throw back out and do a compleat login

//check ok, unlock
if (true) {
	//hide window and curtain
	forms[baseForm].elements.lock.visible = false
	forms[baseForm].elements.gfx_curtain.visible = false
	
	//return curtain to default state
	forms[baseForm].elements.gfx_curtain.transparent = true
	forms[baseForm].elements.gfx_curtain.setImageURL('media:///curtain_5E6166.png')
	forms[baseForm].elements.gfx_curtain.setBorder('EmptyBorder,0,0,0,0')
	
	forms[baseForm].elements.gfx_curtain.text = null
	forms[baseForm].elements.gfx_curtain.toolTipText = null
	
	//unset locked flag
	solutionPrefs.access.lockStatus = false
}
}
