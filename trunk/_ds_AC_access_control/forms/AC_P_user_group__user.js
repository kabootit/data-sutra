/**
 *
 * @properties={typeid:24,uuid:"1c5d37a7-05c2-48b7-9cf9-5588b8e1e47e"}
 */
function ACTION_cancel()
{

//not already ok to close, cancel
if (!globals.CODE_hide_form) {
		
	for ( var i = 0 ; i < foundset.getSize() ; i++ ) {
		var record = foundset.getRecord(i + 1)
		record.flag_chosen = 0
	}
	
	//turn autosave back on
	databaseManager.setAutoSave(true)
	
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	application.closeFormDialog('accessAssignUsers')
}
}

/**
 *
 * @properties={typeid:24,uuid:"b5ed3cd5-983b-4830-afdc-37d37f1be0d8"}
 */
function ACTION_ok()
{
databaseManager.saveData()

//turn autosave back on
databaseManager.setAutoSave(true)

//enaable closing the form
globals.CODE_hide_form = 1

application.closeFormDialog('accessAssignUsers')
}

/**
 *
 * @properties={typeid:24,uuid:"e1229bbf-106c-46cb-917b-b806f4bbd708"}
 */
function ACTION_toggle_flags()
{

/*
 *	TITLE    :	ACTION_toggle_flags
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle flag_chosen field in FID
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

//toggle logic
if (globals.AC_P_flag) {
	//toggle on
	var toggle = 1
}
else {
	//toggle off
	var toggle = 0
}

for ( var i = 0 ; i < foundset.getSize() ; i++ ) {
	var record = foundset.getRecord(i + 1)
	record.flag_chosen = toggle
}

application.updateUI()
}

/**
 *
 * @properties={typeid:24,uuid:"98768b81-689f-44ec-85fa-d45b1b933829"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	set default status of check box
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

var state = 1

for ( var i = 0 ; i < foundset.getSize() && state ; i++ ) {
	var record = foundset.getRecord(i + 1)
	
	if (record.flag_chosen == 0 || record.flag_chosen == null) {
		state = 0
	}
}

globals.AC_P_flag = state

//disable closing the form
globals.CODE_hide_form = 0

}
