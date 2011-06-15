/**
 *
 * @properties={typeid:24,uuid:"d908f932-3e17-4f55-87c1-7b526fd19f66"}
 */
function FLD_data_change()
{

/*
 *	TITLE    :	FLD_data_change
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	reset global values
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

globals.AC_password_set()
plugins.dialogs.showWarningDialog('Password rule','This new rule will only take effect for new or changed passwords')
}

/**
 *
 * @properties={typeid:24,uuid:"33b98829-a4cb-4681-ab37-799bf15ad4ee"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	ensures there is only one record
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

controller.loadAllRecords()

//if there isn't exactly one record, delete all and create a new one
if (controller.getMaxRecordIndex() != 1) {
	controller.deleteAllRecords()
	controller.newRecord()
	databaseManager.saveData()
}

globals.TRIGGER_tooltip_set()
}
