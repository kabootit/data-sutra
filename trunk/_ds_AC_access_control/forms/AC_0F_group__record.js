/**
 *
 * @properties={typeid:24,uuid:"3843ff55-be8d-4c98-a52b-4196475037d7"}
 */
function FORM_on_show()
{
//controller.enabled = false
}

/**
 *
 * @properties={typeid:24,uuid:"bfc44b28-c9ac-4f33-9c3f-dc76791e9012"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	create new filterParam for this group record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = elements.tab_detail.getTabFormNameAt(elements.tab_detail.tabIndex)

//create new record
forms[formName].controller.newRecord(false)
forms[formName].filter_type = globals.AC_filter_type


}

/**
 *
 * @properties={typeid:24,uuid:"c7d22282-ecd0-48b3-9bde-578b3fa116d2"}
 */
function TAB_change()
{

/*
 *	TITLE    :	TAB_change
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	change tab
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TAB_change_grid()

switch (elements.tab_detail.tabIndex) {
	case 1: //database
		globals.AC_filter_type = 2
		break
	case 2: //table
		globals.AC_filter_type = 1
		break
}


}
