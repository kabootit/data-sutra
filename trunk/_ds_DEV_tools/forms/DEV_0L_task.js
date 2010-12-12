/**
 *
 * @properties={typeid:24,uuid:"68c55f6e-4f7c-49b1-8fba-c50e96913a1b"}
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
	//set flags that not in taskMode
	solutionPrefs.design.modes.task = false
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
	//set flags that in taskMode
	globals.DEV_clear_modes()
	solutionPrefs.design.modes.task = true
	solutionPrefs.design.currentMode = 'task'
	
	//dim workflow
	globals.DEV_lock_workflow(true)
	
	//if not loaded, add tab
	var prefName = 'DevTool To Do Notes'
	if (!navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		
		//assign to list tab panel
		forms[baseForm].elements.tab_content_B.addTab(forms[devNote],'To Do Notes',null,null,null,null)
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
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"db751e01-9471-4e3a-862a-3efb4d4a8608"}
 */
function FILTERS_list(event)
{
	
/*
 *	TITLE    :	FILTERS_list
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	FILTERS_list()
 *			  	
 *	MODIFIED :	February 22, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
var input = arguments[0]

//called to depress menu
if (typeof input != 'number') {
	//menu items
	var valueList = [
			'Show all',
			'Show open',
			'Show closed'
		]
	
	//set up menu with arguments
	var menu = new Array()
	for ( var i = 0 ; i < valueList.length ; i++ ) {
		if (globals.DEV_filter_task == i) {
			menu[i] = plugins.popupmenu.createCheckboxMenuItem(valueList[i],FILTERS_list)
			menu[i].setSelected(true)
		}
		else {
			menu[i] = plugins.popupmenu.createMenuItem(valueList[i],FILTERS_list)
		}
		
		menu[i].setMethodArguments(i)
		
		if (menu[i].text == '-') {
			menu[i].setEnabled(false)
		}
	}
	
	//popup
	var elem = elements[application.getMethodTriggerElementName()]
	if (elem != null && menu.length > 1) {
		plugins.popupmenu.showPopupMenu(elem, menu)
	}
}
//menu shown and item chosen
else {
	//update global used to track filter options
	globals.DEV_filter_task = input
	
	var currentNavItem = solutionPrefs.config.currentFormID
	
	switch (input) {
		case 0:	//find all tasks
			var fsTask = foundset
			fsTask.clear()
			fsTask.find()
			fsTask.id_navigation_item = currentNavItem
			var results = fsTask.search()
			
			//sort if there are results
			if (results) {
				fsTask.sort('date_created desc')
			}
			break
		case 1:	//find open tasks
			var fsTask = foundset
			fsTask.clear()
			fsTask.find()
			fsTask.id_navigation_item = currentNavItem
			fsTask.flag_done = '^='
			var results = fsTask.search()
			
			//sort if there are results
			if (results) {
				fsTask.sort('date_created desc')
			}
			break
		case 2:	//find closed tasks
			var fsTask = foundset
			fsTask.clear()
			fsTask.find()
			fsTask.id_navigation_item = currentNavItem
			fsTask.flag_done = 1
			var results = fsTask.search()
			
			//sort if there are results
			if (results) {
				fsTask.sort('date_created desc')
			}
			break
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"13886aba-fa49-403d-a5d2-a5ac8f1fdcec"}
 */
function FLD_data_change__flag_done()
{

/*
 *	TITLE    :	FLD_data_change__flag_done
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	prompt to reopen
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__flag_done()
 *			  	
 *	MODIFIED :	February 22, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if (flag_done) {
	date_completed = application.getServerTimeStamp()
}
else if (date_completed && !flag_done) {
	var answer = plugins.dialogs.showWarningDialog(
						'Re-open task item?',
						'The selected task item has already been closed.  Re-open?',
						'Yes',
						'No'
					)
	
	if (answer == 'Yes') {
		date_completed = null
	}
	else {
		flag_done = 1
	}
}

databaseManager.saveData()


}

/**
 *
 * @properties={typeid:24,uuid:"d1167629-68ce-419c-9e40-aac85f1d8211"}
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
	
	//find total tasks
	var fsTask = foundset
	fsTask.clear()
	fsTask.find()
	fsTask.id_navigation_item = currentNavItem
	var total = fsTask.search()
	
	//find tasks to do
	fsTask.find()
	fsTask.flag_done = '^='
	var results = fsTask.search(false,true)
	
	//set global that viewing open tasks
	globals.DEV_filter_task = 1
	
	//sort if there are results
	if (results) {
		fsTask.sort('date_created desc')
	}
	//create one record if none created already
	else if (!total) {
		fsTask.newRecord(true,true)
		fsTask.id_navigation_item = currentNavItem
		//fsTask.notes = '[' + navigationPrefs.byNavItemID[currentNavItem].navigationItem.moduleFilter + '] ' + navigationPrefs.byNavItemID[currentNavItem].navigationItem.formToLoad + '\n\n'
		databaseManager.saveData()
	}
	
	if (utils.hasRecords(foundset)) {
		//enter field
		elements.fld_notes.requestFocus()
		
		//put cursor at end of field
		if (notes) {
			elements.fld_notes.caretPosition = notes.length
		}
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"81b6ddc7-6a9c-4125-bf9c-6d09d918faf3"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	enter editable field
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_on_select()
 *			  	
 *	MODIFIED :	February 22, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (utils.hasRecords(foundset)) {
	//enter editable field
	elements.fld_notes.requestFocus()
	
	//put cursor at end of field
	if (notes) {
		elements.fld_notes.caretPosition = notes.length
	}
}
}
