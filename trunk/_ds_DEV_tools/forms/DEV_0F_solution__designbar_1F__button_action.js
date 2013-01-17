/**
 *
 * @properties={typeid:24,uuid:"e6b7facc-cd3d-4ca1-8111-3fafa881efb9"}
 * @AllowToRunInFind
 */
function ACTION_activate()
{

/*
 *	TITLE    :	ACTION_activate
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle action button on/off
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
navigationPrefs.byNavItemID[idNavItem].navigationItem.barItemAction = !navigationPrefs.byNavItemID[idNavItem].navigationItem.barItemAction

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
	
	record.bar_item_action = (navigationPrefs.byNavItemID[idNavItem].navigationItem.barItemAction) ? 1 : 0
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
 * @properties={typeid:24,uuid:"1aef171c-256e-40a3-bfa2-09c6446d146d"}
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
var results = forms[formName].GET_action_record()

//disable adding a method to a divider
if (forms[formName].menu_name && (forms[formName].menu_name == '-' || utils.stringPatternCount(forms[formName].menu_name, '---') > 0)) {
	globals.DIALOGS.showErrorDialog(
					'Divider error',
					'You cannot assign code to a divider'
				)
}
//check if it is possible to assign a method
else if (!forms[formName].menu_name) {
	globals.DIALOGS.showErrorDialog(
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
 * @properties={typeid:24,uuid:"1e35615a-a7a2-4958-849f-9b92ac05e042"}
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
if (navigationPrefs.byNavItemID[idNavItem].navigationItem.barItemAction) {
	elements.lbl_activate.text = 'Deactivate'
}
//deactivated, option to activate
else {
	elements.lbl_activate.text = 'Activate'
}
}

/**
 *
 * @properties={typeid:24,uuid:"36875ad6-424c-485f-ba5c-6eec01e3b63d"}
 */
function MOVE_down()
{

/*
 *	TITLE    :	MOVE_down
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	reorder action items
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MOVE_down()
 *			  	
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get foundset
var fsActionItem = forms.DEV_0L_action_item__action.foundset

//if max index, exit
if (fsActionItem.getSelectedIndex() == fsActionItem.getSize()) {
	return
}

//if index == 1, set flag to avoid glitch recSelected
//TODO: find issue
if (fsActionItem.getSelectedIndex() == 1) {
	var recOne = true
}

//get current record
var recordCurr = fsActionItem.getRecord(fsActionItem.getSelectedIndex())

//get next record
var recordNext = fsActionItem.getRecord(fsActionItem.getSelectedIndex() + 1)

//swap with next record
recordCurr.order_by = recordNext.order_by
recordNext.order_by --

fsActionItem.sort('order_by asc')

//TODO: find issue
if (recOne) {
	fsActionItem.setSelectedIndex(2)
}
}

/**
 *
 * @properties={typeid:24,uuid:"f6cb5439-0e51-4522-b671-c10a068b27f3"}
 */
function MOVE_up()
{

/*
 *	TITLE    :	MOVE_up
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	reorder action items
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MOVE_up()
 *			  	
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get foundset
var fsActionItem = forms.DEV_0L_action_item__action.foundset

//if index = 1, exit
if (fsActionItem.getSelectedIndex() == 1) {
	return
}

//get current record
var recordCurr = fsActionItem.getRecord(fsActionItem.getSelectedIndex())

//get previous record
var recordPrev = fsActionItem.getRecord(fsActionItem.getSelectedIndex() - 1)

//swap with previous record
recordCurr.order_by = recordPrev.order_by
recordPrev.order_by ++

fsActionItem.sort('order_by asc')
}

/**
 *
 * @properties={typeid:24,uuid:"07066422-17a5-4201-9e97-af5615213e17"}
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
 * @properties={typeid:24,uuid:"cf957318-acd2-4818-a870-b45e31aac6bd"}
 */
function REC_delete()
{


var delRec = globals.DIALOGS.showWarningDialog(
					'Delete record',
					'Do you really want to delete this record?',
					'Yes',
					'No'
				)

if (delRec == 'Yes') {
	var fsActionItem = forms.DEV_0L_action_item__action.foundset
	
	var recSelect = fsActionItem.getSelectedIndex()

	fsActionItem.deleteRecord()
		
	var loop = recSelect
	while (loop <= fsActionItem.getMaxRecordIndex()) {
		fsActionItem.setSelectedIndex(loop)
		fsActionItem.order_by --
		loop++
	}	
	fsActionItem.sort('order_by asc')
	fsActionItem.setSelectedIndex(recSelect)
	
	//rebuild the nav item
	globals.DEV_rebuild_navitem(solutionPrefs.config.currentFormID)
}

}

/**
 *
 * @properties={typeid:24,uuid:"08e73def-9a3f-4839-ada8-cbafe8ec3cc0"}
 * @AllowToRunInFind
 */
function REC_edit()
{


var formName = 'DEV_D_0F_action_item__action_name'

//move foundset correct action_item
forms[formName].controller.find()
forms[formName].id_action_item = forms.DEV_0L_action_item__action.id_action_item
forms[formName].controller.search()
	
//show the popup
globals.DEV_quickedit_toggle(formName,'fld_menu_name')
}

/**
 *
 * @properties={typeid:24,uuid:"abef128a-db42-44ce-bb57-597aa32a466b"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	create record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	February 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'DEV_D_0F_action_item__action_name'

//create new action item record
forms[formName].controller.newRecord(false)

//fill in fields
forms[formName].id_navigation_item = solutionPrefs.config.currentFormID
forms[formName].category = 'Actions'
forms[formName].order_by = forms[formName].foundset.getSize()

//show the popup
globals.DEV_quickedit_toggle(formName,'fld_menu_name')


}
