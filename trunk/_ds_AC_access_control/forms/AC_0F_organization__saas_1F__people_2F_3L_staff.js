/**
 *
 * @properties={typeid:24,uuid:"E8655115-B031-4113-A48A-06A903251A88"}
 */
function GOTO_staff()
{

/*
 *	TITLE    :	GOTO_staff
 *			  	
 *	MODULE   :	wb_ORG_organization
 *			  	
 *	ABOUT    :	navigates to the staff screen, preserving the current company's staff
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GOTO_order()
 *			  	
 *	MODIFIED :	September 22, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */


//change the selected navigation record
globals.TRIGGER_navigation_set(7,true) //staff is 7

}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"7E9AEC9A-BEAF-4E6E-99F6-65F000102CB4"}
 */
function REC_on_select(event) {
	globals.AC_staff_selected = id_staff
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"5CCD19B0-F04D-444B-8F3A-418DE25A1414"}
 */
function REC_delete(event) {
	var delRec = plugins.dialogs.showWarningDialog(
					'Delete record',
					'Do you really want to delete the selected filter?',
					'Yes',
					'No'
				)
	
	if (delRec == 'Yes') {
		controller.deleteRecord()
	}
}
