/**
 *
 * @properties={typeid:24,uuid:"8220769b-5e5a-41d8-948f-2a4816c36732"}
 */
function ACTION_cancel()
{
//not already ok to close, cancel
if (!globals.CODE_hide_form) {
	for ( var i = 0 ; i < foundset.getSize() ; i++ ) {
		var record = foundset.getRecord(i + 1)
		record.flag_chosen = 0
		record.flag_enabled = 0
	}
	
	//turn autosave back on
	databaseManager.setAutoSave(true)
	
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	globals.CODE_form_in_dialog_close('accessGroupActions')
}
}

/**
 *
 * @properties={typeid:24,uuid:"a1ece47b-6a54-4bda-bc2e-be5a5a2055f2"}
 */
function ACTION_ok()
{
databaseManager.saveData()

//turn autosave back on
databaseManager.setAutoSave(true)

//enaable closing the form
globals.CODE_hide_form = 1

globals.CODE_form_in_dialog_close('accessGroupActions')
}

/**
 *
 * @properties={typeid:24,uuid:"8bda6273-ebbc-4c52-b6ec-0cb58dcebf9a"}
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
	record.flag_enabled = toggle
}

application.updateUI()
}

/**
 *
 * @properties={typeid:24,uuid:"8439af89-c2f3-4e5a-8c5c-2c3f9e99ccb2"}
 */
function FLD_data_change__flag_chosen()
{

/*
 *	TITLE    :	FLD_data_change__flag_chosen
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	set enabled status of current item to whatever flag_enabled status is
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

flag_enabled = flag_chosen
}

/**
 *
 * @properties={typeid:24,uuid:"082fd57b-a1c4-4e73-8b44-e3c2c51a500c"}
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
