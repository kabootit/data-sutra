/**
 *
 * @properties={typeid:24,uuid:"4b91d6bd-bb32-41ed-89c9-565e68494512"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	show pop up where non-group members are available to be added
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

// CREATE RECORDS IN FID NOT ALREADY ASSIGNED
// distinction is flag_chosen


//find all available users
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'SELECT id_user FROM sutra_access_user',
                null,
                10000)
var allUsers = dataset.getColumnAsArray(1)

//find user group merge records
var fsUserGroup = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_user_group')
fsUserGroup.clear()
fsUserGroup.find()
fsUserGroup.id_group = globals.AC_group_selected
var results = fsUserGroup.search()

//create user_group merge records if don't exist
for ( var i = 0 ; i < allUsers.length ; i++ ) {
	var matchFlag = false
	for ( var j = 0 ; j < fsUserGroup.getSize() && !matchFlag ; j++ ) {
		var record = fsUserGroup.getRecord(j + 1)
		if (record.id_user == allUsers[i]) {
			matchFlag = true
		}
	}
	//if no match found, create record
	if(!matchFlag) {
		var record = fsUserGroup.getRecord(fsUserGroup.newRecord())
		record.id_user = allUsers[i]
		record.id_group = globals.AC_group_selected
	}
}


// load FID with unassigned navigation records

//find 'users' that are not assigned to this group
fsUserGroup.find()
fsUserGroup.id_group = globals.AC_group_selected
fsUserGroup.flag_chosen = '^='
var results = fsUserGroup.search()

if (results) {
	forms.AC_P_user_group__user.controller.loadRecords(fsUserGroup)
	
	//temporarily turn off auto save
	databaseManager.setAutoSave(false)
	
	//show FID
	application.showFormInDialog(forms.AC_P_user_group__user,-1,-1,-1,-1,"Users",false,false,'accessAssignUsers')
}
else {
	plugins.dialogs.showInfoDialog('No users','There are no users that are not already a member of this group')
}



}

/**
 *
 * @properties={typeid:24,uuid:"0da37ebf-c6f3-479f-abe5-e66159e02aab"}
 */
function REC_remove()
{

/*
 *	TITLE    :	REC_remove
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	remove record from chosen list
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


var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to remove the selected user?','Yes','No')

if (delRec == 'Yes') {
	flag_chosen = 0
	databaseManager.saveData()
}


}
