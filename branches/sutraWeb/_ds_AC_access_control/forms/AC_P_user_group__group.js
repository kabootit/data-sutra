/**
 *
 * @properties={typeid:24,uuid:"b13c90fa-0f5d-45f3-a56e-055dc127f85f"}
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
	
	globals.CODE_form_in_dialog_close('accessAssignGroups')
}
}

/**
 *
 * @properties={typeid:24,uuid:"2b9925a9-6457-4154-8541-e701bf647d87"}
 */
function ACTION_ok()
{
databaseManager.saveData()

//turn autosave back on
databaseManager.setAutoSave(true)

//enaable closing the form
globals.CODE_hide_form = 1

globals.CODE_form_in_dialog_close('accessAssignGroups')
}

/**
 *
 * @properties={typeid:24,uuid:"6a25f3f8-7be8-45fb-ad0c-3ef51ac7c8f9"}
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
 * @properties={typeid:24,uuid:"c829ed16-2e8a-484c-8c02-6f183fbb1764"}
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

//custom form setup for iOS FiD
globals.CODE_form_in_dialog_setup_ipad()

}
