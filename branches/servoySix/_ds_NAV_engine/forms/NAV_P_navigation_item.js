/**
 *
 * @properties={typeid:24,uuid:"3ef9ca71-2690-4dba-84a5-06f2bbed8b21"}
 */
function ACTION_cancel()
{

/*
 *	TITLE    :	ACTION_cancel
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	 
 *			  	
 *	MODIFIED :	December 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//rollback edited records
databaseManager.rollbackEditedRecords()

//turn autosave back on
databaseManager.setAutoSave(true)

//enaable closing the form
globals.CODE_hide_form = 1

application.closeFormDialog('inlineNavItem')


}

/**
 *
 * @properties={typeid:24,uuid:"41a5d9c6-4c7f-42b6-86f6-34f3a00e704f"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	 
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//commit edited records
databaseManager.saveData()

//turn autosave back on
databaseManager.setAutoSave(true)

//get this nav item record
var record = foundset.getRecord(foundset.getSelectedIndex())

//set flag to redraw list
var redraw = true

var idNavItem = record.id_navigation_item
var idNavSet = globals.DATASUTRA_navigation_set
var displayNavSet = application.getValueListDisplayValue('NAV_navigation_set',idNavSet)

//smart update or not
if (!navigationPrefs.byNavItemID[idNavItem]) {
	var smartUpdate = false
}
else {
	var smartUpdate = true
	
	//name is the same
	if (record.item_name == navigationPrefs.byNavItemID[idNavItem].navigationItem.itemName) {
		redraw = false
	}
	//name has changed, clear out old name
	else {
		delete navigationPrefs.byNavSetName[displayNavSet].itemsByName[navigationPrefs.byNavItemID[idNavItem].navigationItem.itemName]
	}
}


//if navigation items in this set, find posn of selected one
if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length) {
	//find position in array
	var itemPosn = -1
	for (var i = 0; i < navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length && !(itemPosn >= 0); i++) {
		if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder[i].navigationItem.idNavigationItem == idNavItem) {
			itemPosn = i
		}
	}
	
	//not found, tack on at the end
	if (itemPosn < 0) {
		itemPosn = navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length
	}
}
else {
	var itemPosn = 0
}

//update this record alone
if (record.node_2 > 1) {
	//pump in data for newly changed stuff
	navigationPrefs.byNavSetName[displayNavSet].itemsByName[record.item_name] = 
	navigationPrefs.byNavSetName[displayNavSet].itemsByOrder[itemPosn] = 
	navigationPrefs.byNavItemID[idNavItem] = 
		globals.NAV_navigation_item_load(record,smartUpdate)
}
//update whole navigation set
else {
	var fsNavItems = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation_item')
	fsNavItems.find()
	fsNavItems.id_navigation = idNavSet
	fsNavItems.search()
	
	fsNavItems.sort('node_1 asc, node_2 asc')
	
	//rebuild this entire nav set
	var navPrefs = {
				navSetID : idNavSet,
				navSetName : displayNavSet,
				itemsByName : new Object(),
				itemsByOrder : new Array()
			}
	
	//loop through nav items and recreate them
	for (var j = 1; j <= fsNavItems.getSize(); j++) {
		var record2 = fsNavItems.getRecord(j)
		
		//create nav item node(s)
		navPrefs.itemsByName[record2.item_name] = 
		navPrefs.itemsByOrder[j-1] = 
		navigationPrefs.byNavItemID[record2.id_navigation_item] = 
			globals.NAV_navigation_item_load(record2,true)
	}
	
	//assign new navPrefs back to navigationPrefs
	navigationPrefs.byNavSetID[idNavSet] = 
	navigationPrefs.byNavSetName[displayNavSet] = 
		navPrefs
}

//enaable closing the form
globals.CODE_hide_form = 1

application.closeFormDialog('inlineNavItem')

//nav item name changed, redraw navitem list
if (redraw) {
	forms.NAV__navigation_tree.LIST_redraw(null,record.id_navigation_item,true)
}


}

/**
 *
 * @properties={typeid:24,uuid:"c5c1a349-284c-486f-94d8-96725f35fab5"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//disable closing the form
globals.CODE_hide_form = 0


}
