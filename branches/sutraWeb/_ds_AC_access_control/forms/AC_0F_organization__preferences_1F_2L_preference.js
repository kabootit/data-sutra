/**
 *
 * @properties={typeid:24,uuid:"3DE884AA-7342-4DA9-BEAB-75528325EAB2"}
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

var delRec = globals.DIALOGS.showWarningDialog('Delete record','Do you really want to delete the selected record?','Yes','No')

if (delRec == 'Yes') {
	controller.deleteRecord()
}


}
