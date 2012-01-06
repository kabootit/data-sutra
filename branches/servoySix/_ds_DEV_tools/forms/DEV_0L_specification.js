/**
 *
 * @properties={typeid:24,uuid:"e6efc812-e2e5-416d-8ce1-a6a933eeeae7"}
 */
function ACTION_mode()
{

/*
 *	TITLE    :	ACTION_mode
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	enter specification note mode
 *			  	
 *	INPUT    :	1) current form in list position
 *			  	2) current form in workflow position
 *			  	3) standard list form for list position
 *			  	4) standard form for workflow position
 *			  	5) help form for workflow position
 *			  	
 *	REQUIRES :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	Jan 30, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var currentListForm = arguments[0]
var currentWorkForm = arguments[1]
var listForm = arguments[2]
var workForm = arguments[3]
var helpForm = arguments[4]
var stayPut = arguments[5]
var devNote = controller.getName()
var baseForm = solutionPrefs.config.formNameBase

//exit current mode
if (currentListForm == devNote && !stayPut) {
	//set flag that no longer in specMode
	solutionPrefs.design.modes.spec = false
	solutionPrefs.design.currentMode = null
	
	//undim workflow
	globals.DEV_lock_workflow(false)
	
	//return workflow area to default workflow if it is on the help
	if (currentWorkForm == helpForm) {
		if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
			forms[baseForm].elements.tab_content_C.removeTabAt(1)
		}
		forms[baseForm].elements.tab_content_C.addTab(forms[workForm],'')
		forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
	}
	
	//return list area to default list
	forms[baseForm].elements.tab_content_B.tabIndex = (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.tabNumber) ? navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.tabNumber : 1
}
//enter clicked mode
else {	
	//set flag that in specMode
	globals.DEV_clear_modes()
	solutionPrefs.design.modes.spec = true
	solutionPrefs.design.currentMode = 'spec'
	
	//dim workflow
	globals.DEV_lock_workflow(true)
	
	//if not loaded, add tab
	var prefName = 'DevTool Spec Notes'
	if (!navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		
		//assign to list tab panel
		forms[baseForm].elements.tab_content_B.addTab(forms[devNote],'Spec Notes',null,null,null,null)
		forms[baseForm].elements.tab_content_B.tabIndex = forms[baseForm].elements.tab_content_B.getMaxTabIndex()
		
		//save status info
		navigationPrefs.byNavSetName.configPanes.itemsByName[prefName] = new Object()
		navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData = {
									tabNumber : forms[baseForm].elements.tab_content_B.tabIndex,
									dateAdded : application.getServerTimeStamp()
							}
		
	}
	//set tab to this action mode
	else {
		forms[baseForm].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData.tabNumber
	}
	
	//load correct records
	GET_record()
}

}

/**
 *
 * @properties={typeid:24,uuid:"02fe8dfc-739d-4fee-9945-c5483d026a5f"}
 */
function ACTION_open()
{

/*
 *	TITLE    :	ACTION_open
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
 *	USAGE    :	ACTION_open()
 *			  	
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (utils.hasRecords(foundset)) {
	
	var record = foundset.getRecord(foundset.getSelectedIndex())
	
	if (record.flag_file) {
		globals.CODE_file_open(record.file_blob,record.file_name,record.file_ext)
	}
	else {
		plugins.dialogs.showErrorDialog(
					'Attachment error',
					'No file is attached to this specification item'
				)
	}
}
else {
	plugins.dialogs.showErrorDialog(
				'No record error',
				'No file is attached to this specification item'
			)
}
}

/**
 *
 * @properties={typeid:24,uuid:"ad89a058-52a4-44db-9e56-25879b63d513"}
 */
function FLD_on_action__notes()
{


//put cursor at end of field
if (notes) {
	elements.fld_notes.caretPosition = notes.length
}


//enter field
elements.fld_notes.requestFocus()

}

/**
 *
 * @properties={typeid:24,uuid:"3465fe2c-091a-43c5-89bf-7e4135667662"}
 */
function GET_record()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	find note for currently selected navigation item
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	Mar 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase
	var currentNavItem = solutionPrefs.config.currentFormID
	var currentListForm = forms[baseForm].elements.tab_content_B.getTabFormNameAt(forms[baseForm].elements.tab_content_B.tabIndex)
	var currentWorkForm = forms[baseForm].elements.tab_content_C.getTabFormNameAt(1)
	var listForm = (navigationPrefs.byNavItemID[currentNavItem].navigationItem.useFwList) ? navigationPrefs.byNavItemID[currentNavItem].listData.tabFormInstance : ((navigationPrefs.byNavItemID[currentNavItem].navigationItem.listToLoad) ? navigationPrefs.byNavItemID[currentNavItem].navigationItem.listToLoad : 'DATASUTRA_0F_solution__blank_2')
	var workForm = navigationPrefs.byNavItemID[currentNavItem].navigationItem.formToLoad
	var helpForm = navigationPrefs.byNavItemID[currentNavItem].navigationItem.helpFormToLoad
	var devNote = controller.getName()
	
	//return workflow area to default workflow if it is on the help
	if (currentWorkForm == helpForm) {
		if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
			forms[baseForm].elements.tab_content_C.removeTabAt(1)
		}
		forms[baseForm].elements.tab_content_C.addTab(forms[workForm],'')
		forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
	}
	
	//find correct specification
	var fsSpec = foundset
	fsSpec.clear()
	fsSpec.find()
	fsSpec.id_navigation_item = currentNavItem
	var results = fsSpec.search()
	
	//sort if there are results
	if (results) {
		fsSpec.sort('date_created desc')
	}
	//create one record
	else {
		controller.newRecord()
		id_navigation_item = currentNavItem
		//notes = '[' + navigationPrefs.byNavItemID[currentNavItem].navigationItem.moduleFilter + '] ' + navigationPrefs.byNavItemID[currentNavItem].navigationItem.formToLoad + '\n\n'
		databaseManager.saveData()
	}
	
	//enter field
	elements.fld_notes.requestFocus()
	
	//put cursor at end of field
	if (notes) {
		elements.fld_notes.caretPosition = notes.length
	}
	
}
}

/**
 *
 * @properties={typeid:24,uuid:"5ec5458c-5494-4430-b6e7-19e672e8ec25"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle the open file button in the toolbar depending on if file is actually attached
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_on_select()
 *			  	
 *	MODIFIED :	December 16, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (utils.hasRecords(foundset)) {
	if (flag_file) {
		forms.DEV_0F_solution__designbar_1F__spec.elements.lbl_open.visible = true
		forms.DEV_0F_solution__designbar_1F__spec.elements.btn_open.visible = true
	}
	else {
		forms.DEV_0F_solution__designbar_1F__spec.elements.lbl_open.visible = false
		forms.DEV_0F_solution__designbar_1F__spec.elements.btn_open.visible = false
	}
}

//enter editable field
elements.fld_notes.requestFocus()

//put cursor at end of field
if (notes) {
	elements.fld_notes.caretPosition = notes.length
}
}
