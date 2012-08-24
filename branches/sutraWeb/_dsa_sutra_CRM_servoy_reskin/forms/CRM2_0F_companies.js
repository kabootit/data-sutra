/**
 *
 * @properties={typeid:24,uuid:"c7dcf4f4-9c8a-404d-a30c-5c8a8ea00c35"}
 */
function FORM_on_show()
{
//	var wicketID = plugins.WebClientUtils.getElementMarkupId(elements.fld_company_name)	
//	var js = "$('#" + wicketID + "').attr('placeholder', 'Enter company name...')"	
//	plugins.WebClientUtils.executeClientSideJS(js)

}

/**
 *
 * @properties={typeid:24,uuid:"db67c811-b242-4a93-bf43-1f6f68269536"}
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
 * @properties={typeid:24,uuid:"b8c8faaa-1ab8-4c4e-a565-f7277302f3e0"}
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
