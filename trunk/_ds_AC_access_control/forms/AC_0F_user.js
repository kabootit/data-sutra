/**
 *
 * @properties={typeid:24,uuid:"48ea30e3-bc54-4fd9-936d-e5b406ac75fe"}
 */
function EDIT_password()
{

/*
 *	TITLE    :	EDIT_password
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	popup fid to set new password
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (foundset) {
	forms.AC_P_password.FORM_fid(id_user)
}
else {
	plugins.dialogs.showErrorDialog('No records','Create a user record before assigning it a password','OK')
}
}

/**
 *
 * @properties={typeid:24,uuid:"5f8fe27c-0015-40b1-9bdd-59b5f86517af"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	load tooltips; init tab panel
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

globals.CALLBACK_tooltip_set()

globals.TAB_change_grid_init()
}

/**
 *
 * @properties={typeid:24,uuid:"16a1db31-c9d3-4653-be73-9db25d9f8584"}
 */
function REC_copy()
{

//some text so it's not blank
}

/**
 *
 * @properties={typeid:24,uuid:"9f38a5f5-421a-4bf8-8a02-d027b66cd2db"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	deletes record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete the selected user?','Yes','No')

if (delRec == 'Yes') {
	controller.deleteRecord()
}
}

/**
 *
 * @properties={typeid:24,uuid:"a0c498c8-60f6-42af-863c-151109216d8d"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	create new user record
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

controller.newRecord(true)
databaseManager.saveData()

application.updateUI()
elements.fld_user_name.requestFocus(false)
}

/**
 *
 * @properties={typeid:24,uuid:"68F536C5-6BD0-4F38-B193-EE3B1F875DE6"}
 */
function EDIT_organization() {
	if (utils.hasRecords(foundset)) {
		forms.AC_P_organization.FORM_fid(id_user)
	}
	else {
		plugins.dialogs.showErrorDialog(
						'No records',
						'Create a user record before assigning it a password',
						'OK'
					)
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} input the event that triggered the action
 *
 * @properties={typeid:24,uuid:"46E80DBD-0B71-40BC-B03B-A7E05660E3BA"}
 */
function EDIT_popdown(input) {
	//menu items
	var valuelist = new Array(
					'Edit...'
				)
	
	//called to depress menu
	if (typeof input != 'number') {
		//set up menu with arguments
		var menu = new Array()
		for ( var i = 0 ; i < valuelist.length ; i++ ) {
			menu[i] = plugins.popupmenu.createMenuItem(valuelist[i],EDIT_popdown)
			
			menu[i].setMethodArguments(i)
			
			if (menu[i].text == '-') {
				menu[i].setEnabled(false)
			}
		}
		
		//popup
		var elem = elements[input.getElementName()]
		if (elem != null) {
			plugins.popupmenu.showPopupMenu(elem, menu)
		}
	}
	//menu shown and item chosen
	else {
		switch( input ) {
			case 0:	//edit organization
				EDIT_organization()
				break
		}
	}
		
}
