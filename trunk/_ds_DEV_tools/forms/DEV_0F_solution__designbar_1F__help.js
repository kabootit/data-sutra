/**
 *
 * @properties={typeid:24,uuid:"f4a91dcd-8aa1-451d-b140-a2598c0e4012"}
 */
function ACTION_activate()
{

/*
 *	TITLE    :	ACTION_activate
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle help on/off
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_activate()
 *			  	
 *	MODIFIED :	February 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var idNavItem = solutionPrefs.config.currentFormID

navigationPrefs.byNavItemID[idNavItem].navigationItem.helpAvailable = !navigationPrefs.byNavItemID[idNavItem].navigationItem.helpAvailable


//get this nav item record
var fsNavItem = databaseManager.getFoundSet(controller.getServerName(), 'sutra_navigation_item')
fsNavItem.clear()
fsNavItem.find()
fsNavItem.id_navigation_item = idNavItem
var results = fsNavItem.search()

if (results) {	
	var record = fsNavItem.getRecord(1)
	
	record.help_available = (navigationPrefs.byNavItemID[idNavItem].navigationItem.helpAvailable) ? 1 : 0
}

//re-update layout
ACTIVATE_toggle()


}

/**
 *
 * @properties={typeid:24,uuid:"b83f012b-b67e-491e-afb0-0cd27f7dc2f1"}
 */
function ACTION_colors()
{

/*
 *	TITLE    :	ACTION_colors
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_colors()
 *			  	
 *	MODIFIED :	December 11, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'DEV_D_0F_navigation_item__help_color'

//load the right records
forms[formName].GET_record()

//show the popup
globals.DEV_quickedit_toggle(formName)
}

/**
 *
 * @properties={typeid:24,uuid:"438c940e-176b-42d8-a2e6-fd5f8ed474c3"}
 */
function ACTION_forms()
{

/*
 *	TITLE    :	ACTION_forms
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_forms()
 *			  	
 *	MODIFIED :	December 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'DEV_D_0F_navigation_item__help_form'

//load the right records
forms[formName].GET_record()

//show the popup
globals.DEV_quickedit_toggle(formName)
}

/**
 *
 * @properties={typeid:24,uuid:"540b6c25-d861-4257-9b6a-f7e0dc8f24cc"}
 */
function ACTION_preview()
{

/*
 *	TITLE    :	ACTION_preview
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_preview()
 *			  	
 *	MODIFIED :	December 11, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//in preview, go to edit
if (solutionPrefs.config.helpMode) {
	globals.DEV_quick_buttons('help',true)
}
//in edit mode, go to preview
else if (solutionPrefs.design.modes.help) {
	globals.DS_help()
}

PREVIEW_toggle()


}

/**
 *
 * @properties={typeid:24,uuid:"034e2da9-0d47-4ced-8193-292c9657fb19"}
 */
function ACTIVATE_toggle()
{

/*
 *	TITLE    :	ACTIVATE_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle help on/off
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTIVATE_toggle()
 *			  	
 *	MODIFIED :	December 18, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

/*
var idNavItem = solutionPrefs.config.currentFormID

//activated, option to deactivate
if (navigationPrefs.byNavItemID[idNavItem].navigationItem.helpAvailable) {
	elements.lbl_activate.text = 'Deactivate'
}
//deactivated, option to activate
else {
	elements.lbl_activate.text = 'Activate'
}
*/
}

/**
 *
 * @properties={typeid:24,uuid:"30c67330-bca9-439e-955f-2b0f6a7d2585"}
 */
function NAV_ITEM_on_select()
{

/*
 *	TITLE    :	NAV_ITEM_on_select
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	what to do everytime a new navigation item is selected
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	NAV_ITEM_on_select()
 *			  	
 *	MODIFIED :	February 22, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

ACTIVATE_toggle()
}

/**
 *
 * @properties={typeid:24,uuid:"fbf33d0b-6994-4d0f-afd6-7a18b805ea2e"}
 */
function PREVIEW_toggle()
{

/*
 *	TITLE    :	PREVIEW_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle help on/off
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	PREVIEW_toggle()
 *			  	
 *	MODIFIED :	December 18, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//in preview, edit to option
if (solutionPrefs.config.helpMode) {
	elements.lbl_preview.text = 'Edit'
}
//in edit mode, option to preview
else if (solutionPrefs.design.modes.help) {
	elements.lbl_preview.text = 'Preview'
}

}
