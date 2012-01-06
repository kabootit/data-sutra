/**
 *
 * @properties={typeid:24,uuid:"7a331423-dde2-47a8-95b5-f099e7fb8430"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	reload the items into the list
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_ok()
 *			  	
 *	MODIFIED :	February 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//rebuild the nav item
globals.DEV_rebuild_navitem(solutionPrefs.config.currentFormID)

//what item are we on?
var pk = id_action_item

//load all actions onto list
forms.DEV_0L_action_item__action.GET_record()

//select the newest record
forms.DEV_0L_action_item__action.foundset.selectRecord(pk)
}
