/**
 *
 * @properties={typeid:24,uuid:"86743a47-40f0-4723-ba93-3cbe3c4aee31"}
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


//find all available groups
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'SELECT id_group FROM sutra_access_group',
                null,
                10000)
var allGroups = dataset.getColumnAsArray(1)

//find user group merge records
var fsUserGroup = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_user_group')
fsUserGroup.clear()
fsUserGroup.find()
fsUserGroup.id_user = globals.AC_user_selected
var results = fsUserGroup.search()

//create user_group merge records if don't exist
for ( var i = 0 ; i < allGroups.length ; i++ ) {
	var matchFlag = false
	for (var j = 0 ; j < fsUserGroup.getSize() && !matchFlag ; j++ ) {
		var record = fsUserGroup.getRecord(j + 1)
		if (record.id_group == allGroups[i]) {
			matchFlag = true
		}
	}
	//if no match found, create record
	if(!matchFlag) {
		var record = fsUserGroup.getRecord(fsUserGroup.newRecord())
		record.id_group = allGroups[i]
		record.id_user = globals.AC_user_selected
	}
}


// load FID with unassigned navigation records

//find groups that this user is not a member of
fsUserGroup.find()
fsUserGroup.id_user = globals.AC_user_selected
fsUserGroup.flag_chosen = '^='
var results = fsUserGroup.search()

if (results) {
	forms.AC_P_user_group__group.controller.loadRecords(fsUserGroup)
	
	//temporarily turn of auto save
	databaseManager.setAutoSave(false)
	
	//show FID
	application.showFormInDialog(forms.AC_P_user_group__group,-1,-1,-1,-1,"Groups",false,false,'accessAssignGroups')
}
else {
	plugins.dialogs.showInfoDialog('No groups','This user is already a member of all available groups')
}



}

/**
 *
 * @properties={typeid:24,uuid:"97b49606-91ee-43b2-b0de-76150f4901de"}
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

var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to remove the selected group?','Yes','No')

if (delRec == 'Yes') {
	flag_chosen = 0
	databaseManager.saveData()
}


}
