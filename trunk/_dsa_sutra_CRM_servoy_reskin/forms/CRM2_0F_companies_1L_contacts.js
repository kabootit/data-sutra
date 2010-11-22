/**
 *
 * @properties={typeid:24,uuid:"f608fe5c-0c0b-4d43-93fe-bd9e66320cb0"}
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
globals.CALLBACK_navigation_set(13,true) //contacts is 13

}

/**
 *
 * @properties={typeid:24,uuid:"c9f20044-2d52-4feb-ada2-521fea2baced"}
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

var record = forms.CRM2_0F_companies.crm_companies_to_contacts.getRecord(forms.CRM2_0F_companies.crm_companies_to_contacts.newRecord(false,true))

GOTO_contact()

forms.CRM2_0F_contacts.foundset.selectRecord(record.contact_id)
forms.CRM2_0F_contacts.elements.fld_name_first.requestFocus(false)
}
