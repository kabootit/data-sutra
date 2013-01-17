/**
 *
 * @properties={typeid:24,uuid:"c5b87264-279f-4ce5-82af-751dcb970294"}
 * @AllowToRunInFind
 */
function ACTION_activate()
{

/*
 *	TITLE    :	ACTION_activate
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle UL on/off
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

navigationPrefs.byNavItemID[idNavItem].navigationItem.useFwList = !navigationPrefs.byNavItemID[idNavItem].navigationItem.useFwList


//get this nav item record
var fsNavItem = databaseManager.getFoundSet(controller.getServerName(), 'sutra_navigation_item')
fsNavItem.clear()
fsNavItem.find()
fsNavItem.id_navigation_item = idNavItem
var results = fsNavItem.search()

if (results) {	
	var record = fsNavItem.getRecord(1)
	
	record.use_fw_list = (navigationPrefs.byNavItemID[idNavItem].navigationItem.use_fw_list) ? 1 : 0
}

//re-update layout
ACTIVATE_toggle()


}

/**
 *
 * @properties={typeid:24,uuid:"01f0324e-d67f-4c2f-91fd-ff373e094c01"}
 */
function ACTION_edit()
{


//throw up big thing into windows
}

/**
 *
 * @properties={typeid:24,uuid:"34973f32-e732-43f9-a228-013e74266328"}
 * @AllowToRunInFind
 */
function ACTION_title()
{


var formName = 'DEV_D_0F_list_display'

//find correct list display
forms[formName].controller.find()
forms[formName].id_list_display = forms.DEV_0L_list_display.id_list_display
forms[formName].controller.search()
	
//show the popup
globals.DEV_quickedit_toggle(formName,'fld_fw_list_display')
}

/**
 *
 * @properties={typeid:24,uuid:"1717d363-07cb-436f-bea7-266e14282a8a"}
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

var idNavItem = solutionPrefs.config.currentFormID

//activated, option to deactivate
if (navigationPrefs.byNavItemID[idNavItem].navigationItem.useFwList) {
	elements.lbl_activate.text = 'Deactivate'
}
//deactivated, option to activate
else {
	elements.lbl_activate.text = 'Activate'
}
}

/**
 *
 * @properties={typeid:24,uuid:"23bacb8c-303d-4407-a6cf-c6f7ff2c7a33"}
 */
function MOVE_down()
{

/*
 *	TITLE    :	MOVE_down
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	reorder universal lists
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
var fsListDisplay = forms.DEV_0L_list_display.foundset

//if max index, exit
if (fsListDisplay.getSelectedIndex() == fsListDisplay.getSize()) {
	return
}

//if index == 1, set flag to avoid glitch recSelected
//TODO: find issue
if (fsListDisplay.getSelectedIndex() == 1) {
	var recOne = true
}

//get current record
var recordCurr = fsListDisplay.getRecord(fsListDisplay.getSelectedIndex())

//get next record
var recordNext = fsListDisplay.getRecord(fsListDisplay.getSelectedIndex() + 1)

//swap with next record
recordCurr.row_order = recordNext.row_order
recordNext.row_order --

fsListDisplay.sort('row_order asc')

//TODO: find issue
if (recOne) {
	fsListDisplay.setSelectedIndex(2)
}
}

/**
 *
 * @properties={typeid:24,uuid:"9c310aba-9d11-499d-93e8-771d59454af1"}
 */
function MOVE_up()
{

/*
 *	TITLE    :	MOVE_up
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	reorder universal lists
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
var fsListDisplay = forms.DEV_0L_list_display.foundset

//if index = 1, exit
if (fsListDisplay.getSelectedIndex() == 1) {
	return
}

//get current record
var recordCurr = fsListDisplay.getRecord(fsListDisplay.getSelectedIndex())

//get previous record
var recordPrev = fsListDisplay.getRecord(fsListDisplay.getSelectedIndex() - 1)

//swap with previous record
recordCurr.row_order = recordPrev.row_order
recordPrev.row_order ++

fsListDisplay.sort('row_order asc')
}

/**
 *
 * @properties={typeid:24,uuid:"1079213d-c2e3-445e-8373-3b181e0680c0"}
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
 * @properties={typeid:24,uuid:"09b38f55-7837-4a2e-b359-a7adc2ccbc27"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	delete record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var relnName = 'nav_list_display_to_navigation_item'

//get foundset
var fsListDisplay = forms.DEV_0L_list_display.foundset

if (utils.hasRecords(fsListDisplay)) {
	var delRec = globals.DIALOGS.showWarningDialog(
					'Delete record',
					'Do you really want to delete this record?',
					'Yes',
					'No'
				)
	
	//delete record
	if (delRec == 'Yes') {
		//check if selected record is default display
		if (fsListDisplay.display_default) {
			var defaultDisplay = true
		}
		fsListDisplay.deleteRecord()
	}
	
	//de-activate universal list if no displays
	if (!fsListDisplay.getSize()) {
		fsListDisplay[relnName].use_fw_list = 0
		
		var idNavItem = solutionPrefs.config.currentFormID

		navigationPrefs.byNavItemID[idNavItem].navigationItem.useFwList = 0
		
		ACTIVATE_toggle()
	}
	//if deleted display was the default, set the currently selected one to be the default
	else if (defaultDisplay) {
		fsListDisplay.display_default = 1
	}
}
else {
	globals.DIALOGS.showErrorDialog(
			'Delete error',
			'There are no records to delete'
		)
}

}

/**
 *
 * @properties={typeid:24,uuid:"07bad13c-8f04-43f8-a8d8-73cdd99465f1"}
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
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get foundset
var fsListDisplay = forms.DEV_0L_list_display.foundset

//new record
var record = fsListDisplay.getRecord(fsListDisplay.newRecord(true,true))

record.id_navigation_item = solutionPrefs.config.currentFormID
record.row_order = fsListDisplay.getSize()
record.display_default = (record.row_order == 1) ? 1 : 0


}
