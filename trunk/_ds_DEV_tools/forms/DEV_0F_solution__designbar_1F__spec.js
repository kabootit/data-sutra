/**
 *
 * @properties={typeid:24,uuid:"3c8388c6-b0a9-4085-b982-25494ab6db0d"}
 */
function FILE_upload()
{

/*
 *	TITLE    :	FILE_upload
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	adds a file
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FILE_upload()
 *			  	
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get foundset
var fsNote = forms.DEV_0L_specification.foundset

//there are records, upload a file
if (utils.hasRecords(fsNote)) {
	var record = fsNote.getRecord(fsNote.getSelectedIndex())
	
	//no file attached or ok to overwrite
	if (!record.flag_file || plugins.dialogs.showWarningDialog('Overwrite file','This spec note already has an attached file.\nDo you want to overwrite it?','Yes','No') == 'Yes') {
		globals.CODE_file_import(null,record)
		
		forms.DEV_0L_specification.REC_on_select()
	}
}
else {
	plugins.dialogs.showErrorDialog(
			'Upload error',
			'There are no specifications to upload a file to'
		)
}
}

/**
 *
 * @properties={typeid:24,uuid:"ca61cb53-831d-4750-aa7d-ff19b3be4029"}
 */
function FILE_view()
{

/*
 *	TITLE    :	FILE_view
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	view an added file
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FILE_view()
 *			  	
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get foundset
var fsNote = forms.DEV_0L_specification.foundset

//there are records, upload a file
if (utils.hasRecords(fsNote)) {
	var record = fsNote.getRecord(fsNote.getSelectedIndex())
	
	//file attached, show preview
	if (record.flag_file) {
		globals.CODE_file_open(record.file_blob,record.file_name,record.file_ext)
	}
	else {
		plugins.dialogs.showErrorDialog(
				'No file',
				'There is not a file attached to this specification record'
			)
	}
}
else {
	plugins.dialogs.showErrorDialog(
			'Record error',
			'There are no specification note records'
		)
}
}

/**
 *
 * @properties={typeid:24,uuid:"945d2598-39bb-4c5e-91c9-2017eba14fa0"}
 */
function PRINT_spec()
{

forms.DEV_0F_solution__report.PRINT_spec_notes()
}

/**
 *
 * @properties={typeid:24,uuid:"c52ebcf0-f8a4-48ab-9dd2-718cb24c5ef1"}
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
var fsNote = forms.DEV_0L_specification.foundset

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
 * @properties={typeid:24,uuid:"ae31153c-856d-47c8-940a-93aaa7ffef7b"}
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
var fsNote = forms.DEV_0L_specification.foundset

//new record
var record = fsNote.getRecord(fsNote.newRecord(true,true))

record.id_navigation_item = solutionPrefs.config.currentFormID

//enter field
forms.DEV_0L_specification.elements.fld_notes.requestFocus()


}
