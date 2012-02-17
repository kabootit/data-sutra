/**
 *
 * @properties={typeid:24,uuid:"db3a1de6-f206-48f8-8bbc-5c75555c2c9e"}
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

var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to remove the selected registered action?','Yes','No')

if (delRec == 'Yes') {
	controller.deleteRecord()
}


}

/**
 *
 * @properties={typeid:24,uuid:"6660dbd9-fd74-4b7f-a1d7-16a832f89265"}
 * @AllowToRunInFind
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


//find all available actions
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'SELECT id_action FROM sutra_access_action',
                null,
                10000)
var allActions = dataset.getColumnAsArray(1)

//find user group merge records
var groupAction = forms.AC_P_group_action.foundset //databaseManager.getFoundSet(controller.getServerName(),'sutra_access_group_action')
groupAction.clear()
groupAction.find()
groupAction.id_group = globals.AC_group_selected
var results = groupAction.search()

//create group_action merge records if don't exist
for ( var i = 0 ; i < allActions.length ; i++ ) {
	var matchFlag = false
	for ( var j = 0 ; j < groupAction.getSize() && !matchFlag ; j++ ) {
		var record = groupAction.getRecord(j + 1)
		if (record.id_action == allActions[i]) {
			matchFlag = true
		}
	}
	//if no match found, create record
	if(!matchFlag) {
		var record = groupAction.getRecord(groupAction.newRecord())
		record.id_action = allActions[i]
		record.id_group = globals.AC_group_selected
	}
}


// load FID with unassigned navigation records

//find actions that are not assigned to this group
groupAction.find()
groupAction.id_group = globals.AC_group_selected
groupAction.flag_chosen = '^='
var results = groupAction.search()

if (results) {
//	forms.AC_P_group_action.controller.loadRecords(groupAction)
	
	//temporarily turn of auto save
	databaseManager.setAutoSave(false)
	
	//show FID
	globals.CODE_form_in_dialog(forms.AC_P_group_action,-1,-1,-1,-1,"Actions",false,false,'accessGroupActions')
}
else {
	plugins.dialogs.showInfoDialog('No actions','There are no actions that are not already assigned to this group')
}



}
