/**
 *
 * @properties={typeid:24,uuid:"eb69ea23-fea2-43e0-a63d-1748c1bc1cb3"}
 * @AllowToRunInFind
 */
function FLD_data_change__action_id()
{

/*
 *	TITLE    :	FLD_data_change__action_id
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	checks for uniqueness of id
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()
var fsAction = databaseManager.getFoundSet(controller.getServerName(),controller.getTableName())
fsAction.clear()
fsAction.find()
fsAction.action_id = action_id
var results = fsAction.search()

if (results > 1) {
	globals.DIALOGS.showErrorDialog('Error','The action registry ID must be unique.  Please enter a new ID.')
	action_id = null
	elements.fld_action_id.requestFocus(false)
}
}

/**
 *
 * @properties={typeid:24,uuid:"d10b5ebc-35b8-4c94-9bac-ecc3a1f68262"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	deletes record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var delRec = globals.DIALOGS.showWarningDialog('Delete record','Do you really want to delete the selected action?','Yes','No')

if (delRec == 'Yes') {
	controller.deleteRecord()
}


}
