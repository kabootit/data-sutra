/**
 *
 * @properties={typeid:24,uuid:"a0d45641-6566-4841-9e44-b997daf971bb"}
 * @AllowToRunInFind
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	create new nav item representation
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_ok()
 *			  	
 *	MODIFIED :	December 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var idNavItem = solutionPrefs.config.currentFormID
var idNavSet = globals.DATASUTRA_navigation_set
var displayNavSet = application.getValueListDisplayValue('NAV_navigation_set',idNavSet)

//get this nav item record
var fsNavItem = databaseManager.getFoundSet(controller.getServerName(), 'sutra_navigation_item')
fsNavItem.clear()
fsNavItem.find()
fsNavItem.id_navigation_item = idNavItem
var results = fsNavItem.search()

if (results) {	
	var record = fsNavItem.getRecord(1)
	
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

//if in help preview mode, refire it
if (solutionPrefs.config.helpMode) {
	globals.DS_help(true)
}


}

/**
 *
 * @properties={typeid:24,uuid:"d3f49fc0-28e3-44cd-929d-68f4cf13ebcc"}
 * @AllowToRunInFind
 */
function GET_record()
{

/*
 *	TITLE    :	GET_record
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	find currently selected navigation item
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
	//select correct record
	controller.find()
	id_navigation_item = solutionPrefs.config.currentFormID
	controller.search()
	
}
}
