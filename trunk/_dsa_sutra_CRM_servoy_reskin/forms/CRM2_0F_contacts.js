/**
 *
 * @properties={typeid:24,uuid:"4b9d5a7f-3696-462e-b0d6-1e0ba6248a05"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	hides the default highlighter object
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//hide field highlighter
globals.CODE_highlight_off('CRM2_0F_contacts')


}

/**
 *
 * @properties={typeid:24,uuid:"034cb42d-c379-4847-ace5-207ca1f29a0d"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	prompts to delete the currently selected record
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

var delRec = plugins.dialogs.showWarningDialog(
				'Delete record',
				'Do you really want to delete this contact?',
				'Yes',
				'No')

if (delRec == 'Yes') {
	controller.deleteRecord()
	globals.TRIGGER_ul_refresh_all()
}



}

/**
 *
 * @properties={typeid:24,uuid:"9a073649-b31c-46fc-a3fe-7c9b236236f4"}
 */
function REC_duplicate()
{

/*
 *	TITLE    :	REC_duplicate
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	duplicate current record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_duplicate()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

controller.duplicateRecord(false)
globals.TRIGGER_ul_refresh_all()
}

/**
 *
 * @properties={typeid:24,uuid:"35d51f37-aece-4459-9012-fc893f3f53e0"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	create a new contact record
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
elements.fld_name_first.requestFocus(false)
}

/**
 *
 * @properties={typeid:24,uuid:"ec0dbe50-5c65-4523-a077-a81c9dda8d54"}
 */
function STATUS_adjust()
{

/*
 *	TITLE    :	STATUS_adjust
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	change status of selected contact
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

if (utils.hasRecords(foundset)) {
	var newStatus = plugins.dialogs.showSelectDialog(
						'Change contact status',
						'Please set the contact status',
						'Active',
						'Inactive'
					)
	
	if (newStatus == 'Active') {
		is_active = 1
	}
	else if (newStatus == 'Inactive') {
		is_active = 0
	}
}
}
