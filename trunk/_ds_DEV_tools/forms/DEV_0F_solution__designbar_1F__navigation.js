/**
 *
 * @properties={typeid:24,uuid:"cb0bbd7f-ed7c-4b4d-9d1a-dfdfdf0b98ed"}
 */
function ITEM_move_down()
{

/*
 *	TITLE    :	ITEM_move_down
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	move selected navigation item down
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ITEM_move_down()
 *			  	
 *	MODIFIED :	December 10, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var relationName = 'nav_navigation_to_navigation_item__set'
var IDNavSet = globals.DATASUTRA_navigation_set
var nameNavSet = application.getValueListDisplayValue('NAV_navigation_set',IDNavSet)

var fsNavItems = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation_item')
fsNavItems.find()
fsNavItems.id_navigation = IDNavSet
fsNavItems.search()

//if this navigation set has items
if (utils.hasRecords(fsNavItems) && solutionPrefs.config.currentFormID) {
	
	fsNavItems.sort('node_1 asc, node_2 asc')
	
	//load all navitems
	var i = 1
	var navItemOrig = 0
	//if size of fs is different now than on previous loop and set size equal to multiple of 200
	while (navItemOrig != fsNavItems.getSize() && fsNavItems.getSize() == (200 * i)) {
		navItemOrig = fsNavItems.getSize()
		fsNavItems.setSelectedIndex(200 * i)
		i++
	}
	
	//if max index, exit (no more records of same node-level below)
	var selectedItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].navigationItem
	var lastItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[navigationPrefs.byNavSetID[IDNavSet].itemsByOrder.length - 1].navigationItem
	
	//find where the node ends
	for (var i = 0; i < navigationPrefs.byNavSetID[IDNavSet].itemsByOrder.length; i++) {
		var meItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[i].navigationItem
		
		//if nodeOne > than selected's nodeOne, set and break
		if (meItem.nodeOne > selectedItem.nodeOne) {
			var lastNodeItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[i-1].navigationItem
			break
		}
		//if we're on the last item, set it
		else if (i == navigationPrefs.byNavSetID[IDNavSet].itemsByOrder.length - 1) {
			var lastNodeItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[i].navigationItem
		}
	}
	
	//absolute last item
	if (selectedItem.nodeOne == lastItem.nodeOne && ((selectedItem.nodeTwo == lastItem.nodeTwo) || (selectedItem.nodeTwo == 0))) {
		return
	}
	//last item within a node
	else if (selectedItem.nodeOne == lastNodeItem.nodeOne && (selectedItem.nodeTwo == lastNodeItem.nodeTwo) && selectedItem.nodeTwo != 0) {
		return
	}
	
	//get pk of field started on
	var pkRecSelect = selectedItem.idNavigationItem
	
	//select current record
	fsNavItems.selectRecord(pkRecSelect)
	
	//get current record
	var recordCurr = fsNavItems.getRecord(fsNavItems.getSelectedIndex())
	
	//get previous record
	var recordNext = fsNavItems.getRecord(fsNavItems.getSelectedIndex() + 1)
	
	//if on top level, move block
	if (recordCurr.node_2 == 0) {
		/**** setup ****/
		
		var navigationID = selectedItem.idNavigation
		var currentNode = recordCurr.node_1
		var nextNode = recordCurr.node_1 + 1
		
		//clear foundset flag
		var fsUpdater = databaseManager.getFoundSetUpdater(fsNavItems)
		fsUpdater.setColumn('foundset_flag',0)
		fsUpdater.performUpdate()
		
		/**** section one ****/
		
		//get node values on current block
		fsNavItems.find()
		fsNavItems.id_navigation = navigationID
		fsNavItems.node_1 = currentNode
		fsNavItems.search()
		
		//tag foundset flag
		var fsUpdater = databaseManager.getFoundSetUpdater(fsNavItems)
		fsUpdater.setColumn('foundset_flag',1)
		fsUpdater.performUpdate()
		
		/**** section two ****/
		
		//get node values on next block
		fsNavItems.find()
		fsNavItems.id_navigation = navigationID
		fsNavItems.node_1 = nextNode
		fsNavItems.search()
		
		//set next block to current block
		var fsUpdaterNext = databaseManager.getFoundSetUpdater(fsNavItems)
		fsUpdaterNext.setColumn('node_1', currentNode)
		fsUpdaterNext.performUpdate()
		
		/**** section three ****/
		
		//get node values on current block
		fsNavItems.find()
		fsNavItems.id_navigation = navigationID
		fsNavItems.foundset_flag = 1
		fsNavItems.search()
		
		//set current block to next block
		var fsUpdaterCurrent = databaseManager.getFoundSetUpdater(fsNavItems)
		fsUpdaterCurrent.setColumn('node_1', nextNode)
		fsUpdaterCurrent.setColumn('foundset_flag',0)
		fsUpdaterCurrent.performUpdate()
	
		/**** finish up ****/
		
		//restore records
		fsNavItems.find()
		fsNavItems.id_navigation = navigationID
		fsNavItems.search()
	}
	//swap with next record (within block)
	else {
		if (recordNext.node_2 != 0) {
			recordCurr.node_2 = recordNext.node_2
			recordNext.node_2 --
		}
	}
	
	//sort lists
	databaseManager.saveData()
	fsNavItems.sort('node_1 asc, node_2 asc')
	
	//rebuild this entire nav set
	var navPrefs = {
				navSetID : IDNavSet,
				navSetName : nameNavSet,
				itemsByName : new Object(),
				itemsByOrder : new Array()
			}
	
	//loop through nav items and recreate them
	for (var j = 1; j <= fsNavItems.getSize(); j++) {
		var record = fsNavItems.getRecord(j)
		
		//create nav item node(s)
		navPrefs.itemsByName[record.item_name] = 
		navPrefs.itemsByOrder[j-1] = 
		navigationPrefs.byNavItemID[record.id_navigation_item] = 
			globals.NAV_navigation_item_load(record,true)
	}
	
	//assign new navPrefs back to navigationPrefs
	navigationPrefs.byNavSetID[IDNavSet] = 
	navigationPrefs.byNavSetName[nameNavSet] = 
		navPrefs
		
	//redraw
	forms.NAV__navigation_tree.LIST_redraw(null,pkRecSelect,true)
}




}

/**
 *
 * @properties={typeid:24,uuid:"ffe3749a-ad68-49d4-b2f5-9e821f3687e1"}
 */
function ITEM_move_up()
{

/*
 *	TITLE    :	ITEM_move_up
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	move selected navigation item up
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ITEM_move_up()
 *			  	
 *	MODIFIED :	December 10, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var relationName = 'nav_navigation_to_navigation_item__set'
var IDNavSet = globals.DATASUTRA_navigation_set
var nameNavSet = application.getValueListDisplayValue('NAV_navigation_set',IDNavSet)

var fsNavItems = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation_item')
fsNavItems.find()
fsNavItems.id_navigation = IDNavSet
fsNavItems.search()

//if this navigation set has items
if (utils.hasRecords(fsNavItems) && solutionPrefs.config.currentFormID) {
	
	fsNavItems.sort('node_1 asc, node_2 asc')
	
	//load all navitems
	var i = 1
	var navItemOrig = 0
	//if size of fs is different now than on previous loop and set size equal to multiple of 200
	while (navItemOrig != fsNavItems.getSize() && fsNavItems.getSize() == (200 * i)) {
		navItemOrig = fsNavItems.getSize()
		fsNavItems.setSelectedIndex(200 * i)
		i++
	}
	
	//if index = 1, exit (no more records of same node-level above)
	var selectedItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].navigationItem
	var firstItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[0].navigationItem
	
	//find where the node ends
	for (var i = 0; i < navigationPrefs.byNavSetID[IDNavSet].itemsByOrder.length; i++) {
		var meItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[i].navigationItem
		
		//go to next item
		if (meItem.nodeOne < selectedItem.nodeOne) {
			continue
		}
		
		//1- if nodeOne = selected's nodeOne AND
		//2- nodeTwo = 1 (if children) OR nodeTwo = 0 (no children)
			//THEN set and break
		//nodeOne = selected's nodeOne
		if (meItem.nodeOne == selectedItem.nodeOne) {
			//this is not the last item, check the next one
			if (navigationPrefs.byNavSetID[IDNavSet].itemsByOrder.length > i + 1) {
				//is the next nav item in the same nodeOne grouping?, if it is; it must be the first nodeTwo
				if (navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[i + 1].navigationItem.nodeOne == selectedItem.nodeOne) {
					var firstNodeItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[i + 1].navigationItem
					break
				}
				//the next nav item is NOT in the same nodeOne grouping, so the selected record is the first (and last) nodeTwo; in other words, no children
				else {	
					var firstNodeItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[i].navigationItem
					break
				}
			}
			//this is the last item, choose it
			else {
				var firstNodeItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[i].navigationItem
			}
		}
	}
	
	//absolute first item
	if (selectedItem.nodeOne == firstItem.nodeOne && ((selectedItem.nodeTwo == firstItem.nodeTwo) || (selectedItem.nodeTwo == 1))) {
		return
	}
	//first item within a node
	else if (selectedItem.nodeOne == firstNodeItem.nodeOne && (selectedItem.nodeTwo == firstNodeItem.nodeTwo) && selectedItem.nodeTwo != 0) {
		return
	}
	
	//get pk of field started on
	var pkRecSelect = selectedItem.idNavigationItem
	
	//select current record
	fsNavItems.selectRecord(pkRecSelect)
	
	//get current record
	var recordCurr = fsNavItems.getRecord(fsNavItems.getSelectedIndex())
	
	//get previous record
	var recordPrev = fsNavItems.getRecord(fsNavItems.getSelectedIndex() - 1)
	
	//if on top level, move block
	if (recordCurr.node_2 == 0) {
		/**** setup ****/
		
		var navigationID = selectedItem.idNavigation
		var currentNode = recordCurr.node_1
		var previousNode = recordCurr.node_1 - 1
		
		//clear foundset flag
		var fsUpdater = databaseManager.getFoundSetUpdater(fsNavItems)
		fsUpdater.setColumn('foundset_flag',0)
		fsUpdater.performUpdate()
		
		/**** section one ****/
		
		//get node values on current block
		fsNavItems.find()
		fsNavItems.id_navigation = navigationID
		fsNavItems.node_1 = currentNode
		fsNavItems.search()
		
		//tag foundset flag
		var fsUpdater = databaseManager.getFoundSetUpdater(fsNavItems)
		fsUpdater.setColumn('foundset_flag',1)
		fsUpdater.performUpdate()
		
		/**** section two ****/
		
		//get node values on previous block
		fsNavItems.find()
		fsNavItems.id_navigation = navigationID
		fsNavItems.node_1 = previousNode
		fsNavItems.search()
		
		//set to previous block to current block
		var fsUpdaterPrevious = databaseManager.getFoundSetUpdater(fsNavItems)
		fsUpdaterPrevious.setColumn('node_1', currentNode)
		fsUpdaterPrevious.performUpdate()
		
		/**** section three ****/
		
		//get node values on previous block
		fsNavItems.find()
		fsNavItems.id_navigation = navigationID
		fsNavItems.foundset_flag = 1
		fsNavItems.search()
		
		//set to current block to previous block
		var fsUpdaterCurrent = databaseManager.getFoundSetUpdater(fsNavItems)
		fsUpdaterCurrent.setColumn('node_1', previousNode)
		fsUpdaterCurrent.setColumn('foundset_flag',0)
		fsUpdaterCurrent.performUpdate()
	
		/**** finish up ****/
		
		//restore records
		fsNavItems.find()
		fsNavItems.id_navigation = navigationID
		fsNavItems.search()
	}
	//swap with previous record (within block)
	else {
		if (recordCurr.node_2 > 1) {
			recordCurr.node_2 = recordPrev.node_2
			recordPrev.node_2 ++
		}
	}
	
	//sort lists
	databaseManager.saveData()
	fsNavItems.sort('node_1 asc, node_2 asc')
	
	//rebuild this entire nav set
	var navPrefs = {
				navSetID : IDNavSet,
				navSetName : nameNavSet,
				itemsByName : new Object(),
				itemsByOrder : new Array()
			}
	
	//loop through nav items and recreate them
	for (var j = 1; j <= fsNavItems.getSize(); j++) {
		var record = fsNavItems.getRecord(j)
		
		//create nav item node(s)
		navPrefs.itemsByName[record.item_name] = 
		navPrefs.itemsByOrder[j-1] = 
		navigationPrefs.byNavItemID[record.id_navigation_item] = 
			globals.NAV_navigation_item_load(record,true)
	}
	
	//assign new navPrefs back to navigationPrefs
	navigationPrefs.byNavSetID[IDNavSet] = 
	navigationPrefs.byNavSetName[nameNavSet] = 
		navPrefs
	
	//redraw
	forms.NAV__navigation_tree.LIST_redraw(null,pkRecSelect,true)
}




}

/**
 *
 * @properties={typeid:24,uuid:"a34144df-8d8a-4768-93b2-55615279582e"}
 */
function ITEM_REC_delete()
{

/*
 *	TITLE    :	ITEM_REC_delete
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	delete selected navigation item
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ITEM_REC_delete()
 *			  	
 *	MODIFIED :	December 10, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var fsNavItem = databaseManager.getFoundSet(controller.getServerName(), 'sutra_navigation_item')
fsNavItem.find()
fsNavItem.id_navigation_item = solutionPrefs.config.currentFormID
var results = fsNavItem.search()

if (results) {
	forms.NAV_0L_navigation_item.REC_delete(fsNavItem.getRecord(1))
}


}

/**
 *
 * @properties={typeid:24,uuid:"1c061733-1e4b-4071-873d-ad490ad61a05"}
 */
function ITEM_REC_edit()
{

/*
 *	TITLE    :	ITEM_REC_edit
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	edit selected navigation item
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ITEM_REC_edit()
 *			  	
 *	MODIFIED :	December 10, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'DEV_D_0F_navigation_item__setup'

//load the right records
var results = forms[formName].GET_record()

//show the popup
if (results) {
	globals.DEV_quickedit_toggle(formName)
}


}

/**
 *
 * @properties={typeid:24,uuid:"db193ea8-2d67-46ec-adbc-4840423d3ef2"}
 */
function ITEM_REC_new()
{

/*
 *	TITLE    :	ITEM_REC_new
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	create a new navigation item
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ITEM_REC_new()
 *			  	
 *	MODIFIED :	January 12, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'DEV_D_0F_navigation_item__new'
var relnName = 'nav_navigation_to_navigation_item__all'

//get the navigation foundset
var fsNav = databaseManager.getFoundSet(controller.getServerName(), 'sutra_navigation')
fsNav.clear()
fsNav.find()
fsNav.id_navigation = globals.DATASUTRA_navigation_set
var results = fsNav.search()

var x = fsNav.getRecord(fsNav.getSelectedIndex())

if (results) {
	//if no navigation item records
	if (!databaseManager.hasRecords(fsNav[relnName])) {
		//create new record
		var record = fsNav[relnName].getRecord(fsNav[relnName].newRecord(false,true))
		
		record.node_1 = 1
		record.node_2 = 0
	}
	//navigation items already
	else {
		//sort appropriately
		fsNav[relnName].sort('node_1 asc, node_2 asc')
		
		//find max node_1
		var recordMax = fsNav[relnName].getRecord(fsNav[relnName].getSize())
		
		//create new record
		var record = fsNav[relnName].getRecord(fsNav[relnName].newRecord(false,true))
		record.node_1 = recordMax.node_1 + 1
		record.node_2 = 0
	}
	
	record.row_status_show = 1
	record.space_available = '1\n10\n11\n12\n13\n14\n2\n3\n4\n5\n6\n7\n8\n9'
	
	//punch this new record onto the new form
	forms.DEV_D_0F_navigation_item__new.controller.loadAllRecords()
	forms.DEV_D_0F_navigation_item__new.controller.loadRecords(databaseManager.convertToDataSet([record.id_navigation_item]))
	
	//show the popup
	globals.DEV_quickedit_toggle(formName,'fld_item_name')
	
}

/*
code for creating sub items

//shift-key held down, create new sub
if (globals.CODE_key_pressed('shift')) {
	REC_new_sub()
}
else {
	REC_new()
}
*/

/*
original navigation item in popup
//turn autosave off
databaseManager.setAutoSave(false)

var formName = 'NAV_P_navigation_item'
var IDNavSet = globals.DATASUTRA_navigation_set

var fsNavItem = databaseManager.getFoundSet(controller.getServerName(), 'sutra_navigation_item')
fsNavItem.clear()

//shift-key held down, create new sub if there are already main records
if (globals.CODE_key_pressed('shift') && (navigationPrefs.byNavSetID[IDNavSet].itemsByOrder && navigationPrefs.byNavSetID[IDNavSet].itemsByOrder.length)) {
	//currently selected item
	var selectedItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].navigationItem
	
	//find the first and last nodeTwo of selectedItem's nodeOne
	for (var i = 0; i < navigationPrefs.byNavSetID[IDNavSet].itemsByOrder.length; i++) {
		var meItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[i].navigationItem
		
		//first and parent node
		if (meItem.nodeOne == selectedItem.nodeOne) {
			var parentNodeItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[i].navigationItem
		}
		
		//if nodeOne > than selected's nodeOne, set and break
		if (meItem.nodeOne > selectedItem.nodeOne) {
			var lastNodeItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[i-1].navigationItem
			break
		}
		//if we're on the last item, set it
		else if (i == navigationPrefs.byNavSetID[IDNavSet].itemsByOrder.length - 1) {
			var lastNodeItem = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[i].navigationItem
		}
	}
	
	//make sure default on parent is expanded
	if (!parentNodeItem.rowStatusExpanded) {
		//set in meta data
		parentNodeItem.rowStatusExpanded = 1
		
		//update in database
		var fsNavItemTemp = databaseManager.getFoundSet(controller.getServerName(), 'sutra_navigation_item')
		fsNavItemTemp.find()
		fsNavItemTemp.id_navigation_item = parentNodeItem.idNavigationItem
		var results = fsNavItemTemp.search()
		
		if (results) {
			fsNavItemTemp.row_status_expanded = 1
		}
	}
	
	//create new record
	var recNavItem = fsNavItem.getRecord(fsNavItem.newRecord(false,true))
	
	recNavItem.id_navigation = IDNavSet
	recNavItem.node_1 = selectedItem.nodeOne
	recNavItem.node_2 = lastNodeItem.nodeTwo + 1
}
//create regular nav item
else {
	//if no navigation item records
	if (!(navigationPrefs.byNavSetID[IDNavSet].itemsByOrder && navigationPrefs.byNavSetID[IDNavSet].itemsByOrder.length)) {
		//create new record
		var recNavItem = fsNavItem.getRecord(fsNavItem.newRecord(false,true))
		
		recNavItem.id_navigation = IDNavSet
		recNavItem.node_1 = 1
		recNavItem.node_2 = 0
	}
	else {
		//max of current max nav item
		var nodeOneMax = navigationPrefs.byNavSetID[IDNavSet].itemsByOrder[navigationPrefs.byNavSetID[IDNavSet].itemsByOrder.length - 1].navigationItem.nodeOne
		
		//create new record
		var recNavItem = fsNavItem.getRecord(fsNavItem.newRecord(false,true))
		
		recNavItem.id_navigation = IDNavSet
		recNavItem.node_1 = nodeOneMax + 1
		recNavItem.node_2 = 0
	}
}

//fill in remaining fields
recNavItem.row_status_show = 1
recNavItem.space_available = '1\n10\n11\n12\n13\n14\n2\n3\n4\n5\n6\n7\n8\n9'

//select correct record in popup form
forms[formName].controller.loadRecords(fsNavItem)

//change to forms tab if not already there
if (forms.NAV_0F_navigation_item.elements.tab_navigation.tabIndex != 1) {
	forms.NAV_0F_navigation_item.TAB_change(1)
}

//show popup
globals.CODE_form_in_dialog(
			forms[formName],
			-1,-1,875,675,
			'Navigation item',
			true,
			false,
			'inlineNavItem',
			false
		)

//highlight navigation item name
application.updateUI()
forms.NAV_0F_navigation_item_1F__detail.elements.fld_item_name.requestFocus()
*/

}

/**
 *
 * @properties={typeid:24,uuid:"6a6af5d3-e740-4310-933d-b07844a4a7ba"}
 */
function SET_REC_edit()
{

/*
 *	TITLE    :	SET_REC_edit
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	edit the currently selected navigation set
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	SET_REC_edit()
 *			  	
 *	MODIFIED :	December 10, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'DEV_D_0F_navigation__set'

//load the right records
var results = forms[formName].GET_record()

//show the popup
if (results) {
	globals.DEV_quickedit_toggle(formName,'fld_nav_name')
	
	//set flags on form that editing
	forms[formName].flagEdit = true
	forms[formName].flagNew = false
}
}

/**
 *
 * @properties={typeid:24,uuid:"1af29e3d-b863-49b4-9203-1a7219ae00f0"}
 */
function SET_REC_new()
{

/*
 *	TITLE    :	SET_REC_new
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	create a new navigation set and select it
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	SET_REC_new()
 *			  	
 *	MODIFIED :	January 12, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'DEV_D_0F_navigation__set'

//get the navigation foundset
var fsNav = databaseManager.getFoundSet(controller.getServerName(), 'sutra_navigation')
fsNav.clear()
fsNav.find()
fsNav.flag_config = '^='
var results = fsNav.search()

//create new navigation set record
forms[formName].controller.newRecord(false)

//set new navigation set as active
forms[formName].nav_status = 1
forms[formName].order_by = results + 1

//show the popup
globals.DEV_quickedit_toggle(formName,'fld_nav_name')

//set flags on form that editing
forms[formName].flagEdit = false
forms[formName].flagNew = true
}
