/**
 *
 * @properties={typeid:24,uuid:"0490d69e-6240-4b11-9c58-b2f2ce3808f5"}
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
navigationPrefs.byNavItemID[idNavItem].navigationItem.barItemReport = !navigationPrefs.byNavItemID[idNavItem].navigationItem.barItemReport

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
	
	record.bar_item_report = (navigationPrefs.byNavItemID[idNavItem].navigationItem.barItemReport) ? 1 : 0
}

//rebuild current navigation item
globals.DEV_rebuild_navitem(idNavItem)

if (navigationPrefs.byNavItemID[idNavItem].navigationItem.useFwList) {
	//re-fire ul button show method
	forms[navigationPrefs.byNavItemID[idNavItem].listData.tabFormInstance].BUTTONS_toggle(idNavItem)
}
}

/**
 * @properties={typeid:24,uuid:"c9fa3842-2c9a-4640-93ac-615e7622474d"}
 */
function ACTION_assign()
{
}

/**
 *
 * @properties={typeid:24,uuid:"585d6e10-6e5a-4fd4-a867-c0792de0e020"}
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
if (navigationPrefs.byNavItemID[idNavItem].navigationItem.barItemReport) {
	elements.lbl_activate.text = 'Deactivate'
}
//deactivated, option to activate
else {
	elements.lbl_activate.text = 'Activate'
}
}

/**
 *
 * @properties={typeid:24,uuid:"48c8185a-49fa-4936-867e-6710953f1c52"}
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
var fsActionItem = forms.DEV_0L_action_item__report.foundset

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
 * @properties={typeid:24,uuid:"effb2703-42d6-4f51-ab20-4e65f77cc977"}
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
var fsActionItem = forms.DEV_0L_action_item__report.foundset

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
 * @properties={typeid:24,uuid:"18d6130f-2413-46c2-8223-b672e6b13715"}
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


}

/**
 * @properties={typeid:24,uuid:"48d3518c-3613-4dd2-9231-b9cc886f8fec"}
 */
function REC_delete()
{
}

/**
 *
 * @properties={typeid:24,uuid:"be8923d8-2acf-46da-9ef0-f6e376e16273"}
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

var formName = 'DEV_D_0F_action_item__report_name'

//create new action item record
forms[formName].controller.newRecord(false)

//fill in fields
forms[formName].id_navigation_item = solutionPrefs.config.currentFormID
forms[formName].category = 'Reports'
forms[formName].order_by = forms[formName].foundset.getSize()

//show the popup
globals.DEV_quickedit_toggle(formName,'fld_menu_name')


}
