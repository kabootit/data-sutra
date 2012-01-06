/**
 *
 * @properties={typeid:24,uuid:"7dc9e4d7-73ce-4512-b6a4-4f4a58afdaf8"}
 */
function ACTION_activate()
{

/*
 *	TITLE    :	ACTION_activate
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle add button on/off
 *			  		- if no menu item present when toggled on, creates one
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

//toggle activation status
navigationPrefs.byNavItemID[idNavItem].navigationItem.barItemAdd = !navigationPrefs.byNavItemID[idNavItem].navigationItem.barItemAdd

//re-update layout
ACTIVATE_toggle()


//get this nav item record
var fsNavItem = databaseManager.getFoundSet(controller.getServerName(), 'sutra_navigation_item')
fsNavItem.clear()
fsNavItem.find()
fsNavItem.id_navigation_item = idNavItem
var results = fsNavItem.search()

if (results) {	
	var record = fsNavItem.getRecord(1)
	
	record.bar_item_add = (navigationPrefs.byNavItemID[idNavItem].navigationItem.barItemAdd) ? 1 : 0
	
	//get the action_item foundset
	var fsActionItem = databaseManager.getFoundSet(controller.getServerName(), 'sutra_action_item')
	fsActionItem.clear()
	fsActionItem.find()
	fsActionItem.id_navigation_item = idNavItem
	fsActionItem.category = 'Add'
	var results = fsActionItem.search()
	
	//create add action item
	if (!results) {
		var record2 = fsActionItem.getRecord(fsActionItem.newRecord(false,true))
		
		record2.id_navigation_item = idNavItem
		record2.category =  'Add'
		record2.menu_name = 'Add'
	}
}

//rebuild current navigation item
globals.DEV_rebuild_navitem(idNavItem)

if (navigationPrefs.byNavItemID[idNavItem].navigationItem.useFwList) {
	//re-fire ul button show method
	forms[navigationPrefs.byNavItemID[idNavItem].listData.tabFormInstance].BUTTONS_toggle(idNavItem)
}
}

/**
 *
 * @properties={typeid:24,uuid:"bd83f742-6ff1-4ec2-b731-e542f62fd446"}
 */
function ACTION_assign()
{

/*
 *	TITLE    :	ACTION_assign
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	show popup to assign code
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_assign()
 *			  	
 *	MODIFIED :	February 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'DEV_D_0F_action_item__code'

//load the right records
var results = forms[formName].GET_add_record()

//there isn't an add record yet, create one
if (!results) {
	var record = forms[formName].foundset.getRecord(forms[formName].foundset.newRecord(false,true))
	
	record.id_navigation_item = solutionPrefs.config.currentFormID
	record.category =  'Add'
	record.menu_name = 'Add'
}

//disable adding a method to a divider
if (forms[formName].menu_name && (forms[formName].menu_name == '-' || utils.stringPatternCount(forms[formName].menu_name, '---') > 0)) {
	plugins.dialogs.showErrorDialog(
					'Divider error',
					'You cannot assign code to a divider'
				)
}
//check if it is possible to assign a method
else if (!forms[formName].menu_name) {
	plugins.dialogs.showErrorDialog(
				'Error',
				'You must create and name a menu item first',
				'OK'
			)
}
else {
	//show the popup
	globals.DEV_quickedit_toggle(formName)
}


}

/**
 *
 * @properties={typeid:24,uuid:"b1d903f3-9610-4726-a098-44e71770d4a3"}
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
 *	MODIFIED :	February 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var idNavItem = solutionPrefs.config.currentFormID

//activated, option to deactivate
if (navigationPrefs.byNavItemID[idNavItem].navigationItem.barItemAdd) {
	elements.lbl_activate.text = 'Deactivate'
}
//deactivated, option to activate
else {
	elements.lbl_activate.text = 'Activate'
}
}

/**
 *
 * @properties={typeid:24,uuid:"db442603-90aa-4ef3-b623-90147ee2a0fc"}
 */
function FORM_on_show()
{

ACTIVATE_toggle()
}

/**
 *
 * @properties={typeid:24,uuid:"7554fc35-4561-471c-9d19-98248eaecd40"}
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
