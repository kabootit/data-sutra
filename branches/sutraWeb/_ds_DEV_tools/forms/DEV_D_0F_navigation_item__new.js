/**
 *
 * @properties={typeid:24,uuid:"3cf33efa-29b8-478e-90e1-bfdaf00d023d"}
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

var idNavItem = id_navigation_item
var idNavSet = globals.DATASUTRA_navigation_set
var displayNavSet = application.getValueListDisplayValue('NAV_navigation_set',idNavSet)

//recreate current nav set
//TODO: rework to be able to rebuild only one navigation item
globals.NAV_navigation_load(false,solutionPrefs.access.groupID,false,idNavSet)

//redraw list, selecting new record
navigationPrefs.byNavSetID[idNavSet].lastNavItem = idNavItem
globals.NAV_navigation_set_load()


}
