/**
 *
 * @properties={typeid:24,uuid:"0c61bf3d-bf12-4793-9e91-7acba68dc6e2"}
 */
function FORM_on_show()
{

}

/**
 *
 * @properties={typeid:24,uuid:"60c35e28-4d02-4e79-b418-97632f605ffa"}
 */
function GOTO_company()
{

/*
 *	TITLE    :	GOTO_company
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	navigate to the parent company
 *			  	NOTE: will not select correct record if more than 200 companies
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GOTO_company()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TRIGGER_navigation_set(8,true,crm_contacts_to_companies) 

}

/**
 *
 * @properties={typeid:24,uuid:"4955a8a3-77d1-4175-917d-b03c2e3d9ed5"}
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

var delRec = globals.DIALOGS.showWarningDialog(
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
 * @properties={typeid:24,uuid:"e02826bc-321d-4883-b0ef-33364a3d1361"}
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
 * @properties={typeid:24,uuid:"e8979974-2019-4eda-92ce-e3733c3b7a52"}
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
 * @properties={typeid:24,uuid:"bd5acef1-d571-46ab-bde1-c26092e684e0"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	set globals regarding contact
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_on_select()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.CRM_contact_id = contact_id
globals.CRM_company_id = company_id

}

/**
 *
 * @properties={typeid:24,uuid:"5d9ce2c0-f132-4f24-a56c-cb736ad097b1"}
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
	var newStatus = globals.DIALOGS.showSelectDialog(
						'Change contact status',
						'Please set the contact status',
						['Active',
						'Inactive']
					)
	
	if (newStatus == 'Active') {
		is_active = 1
	}
	else if (newStatus == 'Inactive') {
		is_active = 0
	}
}
}
