/**
 *
 * @properties={typeid:24,uuid:"36cffaa2-91c7-40bc-9654-29e4ee21b98b"}
 */
function ACTION_mode()
{

/*
 *	TITLE    :	ACTION_mode
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	enter task note mode
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

//leave current mode if already there
if (currentListForm == devNote && !stayPut) {
	//set flags that not in universallist
	solutionPrefs.design.modes.universallist = false
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
	//set flags that in universallist
	globals.DEV_clear_modes()
	solutionPrefs.design.modes.universallist = true
	solutionPrefs.design.currentMode = 'universallist'
	
	//dim workflow
	globals.DEV_lock_workflow(true)
	
	//if not loaded, add tab
	var prefName = 'DevTool Engine UL'
	if (!navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		
		//assign to list tab panel
		forms[baseForm].elements.tab_content_B.addTab(forms[devNote],'Engine: UL',null,null,null,null)
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
 * @properties={typeid:24,uuid:"59c31ed8-4e07-443a-af6b-66de4a70546c"}
 */
function FLD_action__unhighlight()
{

/*
 *	TITLE    :	FLD_action__unhighlight
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	unfocus current row so selector visible
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_action__unhighlight()
 *			  	
 *	MODIFIED :	December 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

elements.fld_blank.requestFocus(false)
}

/**
 *
 * @properties={typeid:24,uuid:"86dae769-bd37-45bf-8966-bafc97ff73f1"}
 */
function FLD_data_change__display_default()
{

/*
 *	TITLE    :	FLD_data_change__display_default
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	set current list display record as only default
 *			  	not allowed to deselect record (correct usage is to click on new default)
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__display_default()
 *			  	
 *	MODIFIED :	December 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if (display_default) {
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset)
	fsUpdater.setColumn('display_default',0)
	fsUpdater.performUpdate()
	display_default = 1
}
else {
	display_default = 1
	globals.DIALOGS.showErrorDialog(
				'Missing default display', 
				'There must be a default display when using the universal list', 
				'OK'
			)
}

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"42f61a14-1715-4e33-83f8-ceae4a6d8ebf"}
 * @AllowToRunInFind
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
	var currentListForm = forms[baseForm].elements.tab_content_B.getTabFormNameAt(forms[baseForm].elements.tab_content_B.getMaxTabIndex())
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
	
	//find correct task
	var fsListDisplay = foundset
	fsListDisplay.clear()
	fsListDisplay.find()
	fsListDisplay.id_navigation_item = currentNavItem
	var results = fsListDisplay.search()
	
	//sort if there are results
	if (results) {
		fsListDisplay.sort('row_order asc')
	}
}
}
