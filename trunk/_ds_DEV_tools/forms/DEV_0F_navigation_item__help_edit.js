/**
 *
 * @properties={typeid:24,uuid:"4d2cc694-b7e0-49dc-8cbc-804d5cb8793a"}
 */
function ACTION_mode()
{

/*
 *	TITLE    :	ACTION_mode
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	enter help mode with editable description
 *			  	
 *	INPUT    :	1) current form in list position
 *			  	2) current form in workflow position
 *			  	3) standard list form for list position
 *			  	4) standard form for workflow position
 *			  	5) help form for workflow position
 *			  	
 *	REQUIRES :	solutionPrefs
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
var helpNote = 'DEV_0F_navigation_item__help'
var baseForm = solutionPrefs.config.formNameBase

//leave current mode if already there
if ((currentListForm == devNote || currentListForm == helpNote) && !stayPut) {
	//set flag that no longer in help
	globals.DEV_clear_modes()
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
	//get if in preview mode
	var helpPreview = solutionPrefs.config.helpMode
	
	//set flag that in help
	globals.DEV_clear_modes()
	solutionPrefs.design.modes.help = true
	solutionPrefs.design.currentMode = 'help'
	
	//mark that not in help mode if just entering this mode
	//if called when navigation item changed, leave helpmode alone
	if (helpPreview && !stayPut) {
		solutionPrefs.config.helpMode = true
	}
	
	//reset help/edit label
	forms.DEV_0F_solution__designbar_1F__help.PREVIEW_toggle()
	//reset (de)activate label
	forms.DEV_0F_solution__designbar_1F__help.ACTIVATE_toggle()
	
	//dim workflow
	globals.DEV_lock_workflow(true)
	
	//replace list area with help description
	//if not loaded, add tab
	var prefName = 'DevTool Help Edit'
	if (!navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		
		//assign to list tab panel
		forms[baseForm].elements.tab_content_B.addTab(forms[devNote],'Edit help',null,null,null,null)
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
 * @properties={typeid:24,uuid:"626b988d-9d29-426a-b822-d182d90dbb20"}
 */
function FLD_data_change__help_description()
{

/*
 *	TITLE    :	FLD_data_change__help_description
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	punch in new help text
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	April 2, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

navigationPrefs.byNavItemID[id_navigation_item].navigationItem.helpDescription = help_description
}

/**
 *
 * @properties={typeid:24,uuid:"ffa43c5e-e5cb-4365-a032-9e4b3db33458"}
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
	
	//replace workflow area with help screen, if defined and available
	if ((helpForm) ? forms[helpForm] : false) {
		if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
			forms[baseForm].elements.tab_content_C.removeTabAt(1)
		}
		forms[baseForm].elements.tab_content_C.addTab(forms[helpForm],'')
		forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
	}
	
	//select correct record
	controller.find()
	id_navigation_item = currentNavItem
	controller.search()
	
	//enter help field
	elements.fld_help.requestFocus()
	
	//put cursor at end of field
	if (help_description) {
		elements.fld_help.caretPosition = help_description.length
	}
}
}
