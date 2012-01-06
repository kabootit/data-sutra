/**
 *
 * @properties={typeid:24,uuid:"23ae7f62-e8c4-4240-91a9-0b245fd6089b"}
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
}
}

/**
 *
 * @properties={typeid:24,uuid:"e1f07aa4-8f6c-4e48-9ebd-6e90142223e3"}
 */
function REC_edit()
{

/*
 *	TITLE    :	REC_edit
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	opens a FiD to edit the selected address
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_edit()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var addressID = address_id

//select the right row
forms.CRM_P_addresses.controller.find()
forms.CRM_P_addresses.address_id = addressID
forms.CRM_P_addresses.controller.search()

//show form in dialog
application.showFormInDialog(forms.CRM_P_addresses,-1,-1,-1,-1,'Edit',false,false,'crm1EditAddress')
}

/**
 *
 * @properties={typeid:24,uuid:"5444902d-b5da-4216-bc7a-6b58a0959336"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	creates a new address record and shows FiD for data entry
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

forms.CRM1_0F_companies.crm_companies_to_addresses.newRecord(false,true)
databaseManager.saveData()

var addressID = address_id

//select the right row
forms.CRM_P_addresses.controller.find()
forms.CRM_P_addresses.address_id = addressID
forms.CRM_P_addresses.controller.search()

//show form in dialog
application.showFormInDialog(forms.CRM_P_addresses,-1,-1,-1,-1,'New address',false,false,false,'crm1EditAddress')
}
