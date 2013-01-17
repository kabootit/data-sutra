/**
 *
 * @properties={typeid:24,uuid:"08e79903-e3f8-48dc-a596-6bdc00ef2de3"}
 */
function ACTION_mode()
{

/*
 *	TITLE    :	ACTION_mode
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	enter fastfind mode
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
	//set flags that not in fastfind
	solutionPrefs.design.modes.fastfind = false
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
	//set flags that in fastfind
	globals.DEV_clear_modes()
	solutionPrefs.design.modes.fastfind = true
	solutionPrefs.design.currentMode = 'fastfind'
	
	//dim workflow
	globals.DEV_lock_workflow(true)
	
	//if not loaded, add tab
	var prefName = 'DevTool Engine FastFind'
	if (!navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		
		//assign to list tab panel
		forms[baseForm].elements.tab_content_B.addTab(forms[devNote],'Engine: FF',null,null,null,null)
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
 * @properties={typeid:24,uuid:"5cb490c3-41f4-4098-9db7-9b6d3d17402e"}
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
 * @properties={typeid:24,uuid:"82997394-03f9-48c6-b7e4-c4aa17305ef4"}
 */
function GET_record()
{

/*
 *	TITLE    :	GET_record
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	fast finds for selected nav item
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
	var fsColumn = foundset
	fsColumn.clear()
	fsColumn.find()
	fsColumn.id_navigation_item = currentNavItem
	fsColumn.status_find = 1
	var results = fsColumn.search()
	
	//sort if there are results
	if (results) {
		fsColumn.sort('name_display asc')
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"5d2dff55-3930-4702-827d-1471efd7a7f4"}
 */
function SET_find_valuelist()
{

/*
 *	TITLE    :	SET_find_valuelist
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	loop through foundset and set up valuelist
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	SET_find_valuelist()
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var optionsDisplay = new Array()
var optionsStored = new Array()

if (utils.hasRecords(foundset)) {
	var found = false
	var textFlag = false
	var numberFlag = false
	var dateFlag = false
	
	for (var i = 1; i < foundset.getSize(); i++) {
		var record = foundset.getRecord(i)
		
		if (record.flag_default) {
			found = record.name_column
			tooltTip = (record.name_display) ? record.name_display : record.name_column
		}
		
		if (record.type_column == 'DATETIME') {
			dateFlag = true
		}
		if (record.type_column == 'TEXT') {
			textFlag = true
		}
		if (record.type_column == 'INTEGER' || record.type_column == 'NUMBER') {
			numberFlag = true
		}
		
	}
	
	//none option
	optionsDisplay.push('None','-')
	optionsStored.push(null,null)
	
	//all dates
	if (dateFlag) {
		optionsDisplay.push('All dates')
		optionsStored.push('All dates')
	}
	//all numbers
	if (numberFlag) {
		optionsDisplay.push('All numbers')
		optionsStored.push('All numbers')
	}
	//all text
	if (textFlag) {
		optionsDisplay.push('All text')
		optionsStored.push('All text')
	}
	
	//tack on stored if needed
	if (found) {
		//add divider if last item is not stored
		if (optionsDisplay[optionsDisplay.length - 1] != '-') {
			optionsDisplay.push('-')
			optionsStored.push(null)
		}
		//stored value
		optionsDisplay.push('Column selected')
		optionsStored.push(found)
	}
	
	//remove divider if last item is divider
	if (optionsDisplay[optionsDisplay.length - 1] == '-') {
		optionsDisplay.pop()
		optionsStored.pop()
	}
}

application.setValueListItems('NAV_find_default', optionsDisplay, optionsStored)


}
