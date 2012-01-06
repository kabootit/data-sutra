/**
 *
 * @properties={typeid:24,uuid:"f0ad8b3e-c9c3-4bd7-92b0-5a44bb0440a1"}
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
				'Do you really want to delete this address?',
				'Yes',
				'No')

if (delRec == 'Yes') {
	controller.deleteRecord()
}
}

/**
 *
 * @properties={typeid:24,uuid:"525d7f83-4145-4b46-ad0a-56c18ff0aa12"}
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
application.showFormInDialog(forms.CRM_P_addresses,-1,-1,-1,-1,'Edit',false,false,'crm2EditAddress')
}

/**
 *
 * @properties={typeid:24,uuid:"cd9bfe64-8dd7-4bea-887b-8787290bf8ec"}
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

forms.CRM2_0F_companies.crm_companies_to_addresses.newRecord(false,true)
databaseManager.saveData()

var addressID = address_id

//select the right row
forms.CRM_P_addresses.controller.find()
forms.CRM_P_addresses.address_id = addressID
forms.CRM_P_addresses.controller.search()

//show form in dialog
application.showFormInDialog(forms.CRM_P_addresses,-1,-1,-1,-1,'New address',false,false,false,'crm2EditAddress')
}
