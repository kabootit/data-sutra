/**
 *
 * @properties={typeid:24,uuid:"1fbe10db-c4f7-4b3d-bbff-112a500b39f6"}
 */
function FIND_showall()
{

//load all task records for this nav item
forms.DEV_0L_task.FILTERS_list(0)
}

/**
 *
 * @properties={typeid:24,uuid:"dd873c78-284c-46ca-8485-805be293569f"}
 */
function PRINT_task()
{


forms.DEV_0F_solution__report.PRINT_task_notes()
}

/**
 *
 * @properties={typeid:24,uuid:"6e79a057-614b-4ae2-aed8-af43f4584da4"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	delete record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get foundset
var fsNote = forms.DEV_0L_task.foundset

if (utils.hasRecords(fsNote)) {
	var delRec = plugins.dialogs.showWarningDialog(
					'Delete record',
					'Do you really want to delete this record?',
					'Yes',
					'No'
				)
	
	if (delRec == 'Yes') {
		fsNote.deleteRecord()	
	}
}
else {
	plugins.dialogs.showErrorDialog(
			'Delete error',
			'There are no records to delete'
		)
}
}

/**
 *
 * @properties={typeid:24,uuid:"e6dec809-b728-4100-af42-421e86058042"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	create record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get foundset
var fsNote = forms.DEV_0L_task.foundset

//new record
var record = fsNote.getRecord(fsNote.newRecord(true,true))

record.id_navigation_item = solutionPrefs.config.currentFormID

//enter field
forms.DEV_0L_task.elements.fld_notes.requestFocus()


}
