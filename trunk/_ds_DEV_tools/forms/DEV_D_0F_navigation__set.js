/**
 *
 * @properties={typeid:24,uuid:"328953db-2657-45d7-8f5b-ec4d396d0a51"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
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
 *	USAGE    :	ACTION_ok()
 *			  	
 *	MODIFIED :	January 12, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var idNavItem = solutionPrefs.config.currentFormID
var idNavSet = id_navigation
var displayNavSet = application.getValueListDisplayValue('NAV_navigation_set',idNavSet)

//edit only
if (this.flagEdit) {
	//get old name
	var oldName = navigationPrefs.byNavSetID[idNavSet].navSetName
	
	//name was changed
	if (oldName != nav_name) {
		//set new name
		navigationPrefs.byNavSetID[idNavSet].navSetName = nav_name
		navigationPrefs.byNavSetName[nav_name] = navigationPrefs.byNavSetID[idNavSet]
		
		//delete the old name
		navigationPrefs.byNavSetName[oldName] = undefined
		
		//rebuild nav set valuelist
		var navSetNames = new Array()
		var navigationSets = new Array()
		
		for (var i in navigationPrefs.byNavSetID) {
			if (navigationPrefs.byNavSetID[i] && navigationPrefs.byNavSetID[i].navSetName  && navigationPrefs.byNavSetID[i].navSetName != 'configPanes') {
				navSetNames.push(navigationPrefs.byNavSetID[i].navSetName)
				navigationSets.push(navigationPrefs.byNavSetID[i].navSetID)
			}
		}
		
		application.setValueListItems('NAV_navigation_set', navSetNames, navigationSets)
		
		//update text display with new navigation set name
		var displayValue = application.getValueListDisplayValue('NAV_navigation_set',globals.DATASUTRA_navigation_set)
		forms.NAV_0L_solution.elements.lbl_header.text = (displayValue) ? displayValue.toUpperCase() : 'NAVIGATION'
	}
}
//new navigation set
else if (this.flagNew) {
	//a/c turned on, add merge record to add this new nav set to user's group 
	if (solutionPrefs.access.groupID) {
		var navSet = databaseManager.getFoundSet(controller.getServerName(),'sutra_control_navigation')
		navSet.clear()
		navSet.newRecord()
		
		var record = navSet.getRecord(navSet.newRecord(true,true))
		record.id_navigation = idNavSet
		record.id_group = solutionPrefs.access.groupID
		record.flag_chosen = 1
	}
	
	//recreate navPrefs
	globals.NAV_navigation_load(false,solutionPrefs.access.groupID,false,idNavSet)
	
	//refind sets in frameworks engine, proper
	forms.NAV_0L_navigation.TOGGLE_config_set(false)
	
	//set global to new set
	globals.DATASUTRA_navigation_set = idNavSet
	
	//redraw list, bring in forms
	globals.NAV_navigation_set_load()
}

/*
//get the navigation foundset
var fsNav = databaseManager.getFoundSet(controller.getServerName(), 'sutra_navigation')
fsNav.clear()
fsNav.find()
fsNav.flag_config = '^='
var results = fsNav.search()

if (results) {	
	var record = fsNav.getRecord(1)
	
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
	if (record) {
		//pump in data for newly changed stuff
		navigationPrefs.byNavSetName[displayNavSet].itemsByName[record.item_name] = 
		navigationPrefs.byNavSetName[displayNavSet].itemsByOrder[itemPosn] = 
		navigationPrefs.byNavItemID[idNavItem] = 
			globals.NAV_navigation_item_load(record,true)
	}
}


*/
}

/**
 *
 * @properties={typeid:24,uuid:"486acac5-fca4-43b1-9b2c-aa0d7f1047f3"}
 */
function GET_record()
{

/*
 *	TITLE    :	GET_record
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	find currently selected navigation set
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	OUTPUT   :	number of records found (if there is a navigation set selected)
 *			  	
 *	MODIFIED :	January 12, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	//select correct record
	controller.find()
	id_navigation = globals.DATASUTRA_navigation_set
	return controller.search()
}
}
