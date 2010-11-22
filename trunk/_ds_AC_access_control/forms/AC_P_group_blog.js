/**
 *
 * @properties={typeid:24,uuid:"6c1f952e-5871-41ae-af35-c90fbd6e5a5a"}
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
	
	application.closeFormDialog('accessGroupBlogs')
}
}

/**
 *
 * @properties={typeid:24,uuid:"5b669d0d-8af4-4bfe-befa-616b2fa199fd"}
 */
function ACTION_ok()
{

var blogsSelected = 0

//check to make sure only one blog selected
for ( var i = 0 ; i < foundset.getSize() ; i++ ) {
	var record = foundset.getRecord(i + 1)
	
	if (record.flag_chosen) {
		blogsSelected++
	}
}

if (blogsSelected > 1) {
	plugins.dialogs.showErrorDialog('Too many blogs','Only one blog can be assigned to a group at a time')
}
else {
	databaseManager.saveData()
	
	//turn autosave back on
	databaseManager.setAutoSave(true)
	
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	application.closeFormDialog('accessGroupBlogs')
}
}

/**
 *
 * @properties={typeid:24,uuid:"630c1974-f162-4e1d-bbb7-083d6ceea968"}
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
 * @properties={typeid:24,uuid:"bdd8de3d-3741-4c58-b768-9f0cedc9da32"}
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
