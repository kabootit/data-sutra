/**
 *
 * @properties={typeid:24,uuid:"60bd3cd2-7953-467d-9d4e-d7bb8114a564"}
 */
function GOTO_contact()
{

/*
 *	TITLE    :	GOTO_contact
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	navigates to the contact screen, preserving the current company's contats
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GOTO_contact()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//change the selected navigation record
globals.TRIGGER_navigation_set(9,true) //contacts is 9
}

/**
 *
 * @properties={typeid:24,uuid:"ab3e692b-6e4e-47f5-b8af-bf9eb8c31687"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	create a new contact record and then go to the contact screen
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

var record = forms.CRM1_0F_companies.crm_companies_to_contacts.getRecord(forms.CRM1_0F_companies.crm_companies_to_contacts.newRecord(false,true))

GOTO_contact()

forms.CRM1_0F_contacts.foundset.selectRecord(record.contact_id)
forms.CRM1_0F_contacts.elements.fld_name_first.requestFocus(false)
}
