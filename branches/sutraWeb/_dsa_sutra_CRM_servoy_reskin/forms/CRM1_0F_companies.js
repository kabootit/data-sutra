/**
 *
 * @properties={typeid:24,uuid:"770061eb-3fb3-4ec1-9ee2-128733b3ab41"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	create a new company record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_delete()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var delRec = globals.DIALOGS.showWarningDialog(
						'Delete record',
						'Do you really want to delete this record?',
						'Yes',
						'No'
					)

if (delRec == 'Yes') {
	controller.deleteRecord()
	globals.TRIGGER_ul_refresh_all()
}
}

/**
 *
 * @properties={typeid:24,uuid:"2cd564d6-76a7-4eb0-8142-05bd645ef060"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	create a new company record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_new()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//new record
controller.newRecord(true)

//refresh UL
globals.TRIGGER_ul_refresh_all()

//enter first field
elements.fld_company_name.requestFocus()
}
