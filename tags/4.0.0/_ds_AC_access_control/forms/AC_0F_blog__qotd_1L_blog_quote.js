/**
 *
 * @properties={typeid:24,uuid:"fdef6b0b-223f-4a83-8bbb-9b16e5818649"}
 */
function FLD_data_change__default()
{

/*
 *	TITLE    :	FLD_data_change__default
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	set current quote as only default
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if (quote_default) {
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset)
	fsUpdater.setColumn('quote_default',0)
	fsUpdater.performUpdate()
	quote_default = 1
}

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"be2eeb49-720e-4452-8d2a-aa82773dcf5f"}
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

var delRec = globals.DIALOGS.showWarningDialog('Delete record','Do you really want to delete the selected quote of the day?','Yes','No')

if (delRec == 'Yes') {
	controller.deleteRecord()
}
}
