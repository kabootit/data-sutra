/**
 *
 * @properties={typeid:24,uuid:"1f493439-4c0e-4d22-a238-4256d538827d"}
 */
function ACTION_mode()
{

/*
 *	TITLE    :	ACTION_mode
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	enter button action mode
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
 *	MODIFIED :	February 25, 2009 -- Troy Elliott, Data Mosaic
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
	//set flags that not in actionButtonMode
	solutionPrefs.design.modes.buttonaction = false
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
	//set flags that in actionButtonMode
	globals.DEV_clear_modes()
	solutionPrefs.design.modes.buttonaction = true
	solutionPrefs.design.currentMode = 'buttonaction'
	
	//reset (de)activate label
	forms.DEV_0F_solution__designbar_1F__button_action.ACTIVATE_toggle()
	
	//dim workflow
	globals.DEV_lock_workflow(true)
	
	//if not loaded, add tab
	var prefName = 'DevTool Engine ButtonAction'
	if (!navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		
		//assign to list tab panel
		forms[baseForm].elements.tab_content_B.addTab(forms[devNote],'Button: Action',null,null,null,null)
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
 * @properties={typeid:24,uuid:"02759fbf-7efb-47fa-a2df-f1574d66124a"}
 */
function FLD_action__menu_name()
{

/*
 *	TITLE    :	FLD_action__menu_name
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
 *	USAGE    :	FLD_action__menu_name()
 *			  	
 *	MODIFIED :	December 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

elements.fld_blank.requestFocus(false)
}

/**
 *
 * @properties={typeid:24,uuid:"1fa340a0-67cd-4446-8258-d99016830fcd"}
 */
function GET_record()
{

/*
 *	TITLE    :	GET_record
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	actions for selected nav item
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
	
	//find correct action items
	var fsActionItem = foundset
	fsActionItem.clear()
	fsActionItem.find()
	fsActionItem.id_navigation_item = currentNavItem
	fsActionItem.category = 'Actions'
	var results = fsActionItem.search()
	
	//sort if there are results
	if (results) {
		fsActionItem.sort('order_by asc')
	}
}
}
