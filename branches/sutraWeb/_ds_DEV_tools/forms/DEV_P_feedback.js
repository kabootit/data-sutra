/**
 *
 * @properties={typeid:24,uuid:"81b07259-9b70-4b2f-89e9-da3c7727e318"}
 */
function ACTION_cancel()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	rollback new feedback record
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	Mar 25, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//rollback edited records
databaseManager.rollbackEditedRecords()

//turn autosave back on
databaseManager.setAutoSave(true)

//enaable closing the form
globals.CODE_hide_form = 1

globals.CODE_form_in_dialog_close('feedback')


}

/**
 *
 * @properties={typeid:24,uuid:"cf9c87b2-58bc-4e56-be3a-7854bdeacd72"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	commit new feedback record
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	Mar 25, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//turn autosave back on
databaseManager.setAutoSave(true)

//enaable closing the form
globals.CODE_hide_form = 1

globals.CODE_form_in_dialog_close('feedback')

}

/**
 *
 * @properties={typeid:24,uuid:"7420e393-ebad-4f99-90ca-be086695d5d7"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	create new feedback record
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	Mar 25, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//disable closing the form
globals.CODE_hide_form = 0

//turn autosave off
databaseManager.setAutoSave(false)

controller.newRecord()

//load values
feedback_status = 'Pending'
id_log = solutionPrefs.clientInfo.logID
id_navigation = globals.DATASUTRA_navigation_set
id_navigation_item = solutionPrefs.config.currentFormID
feedback_screenshot = globals.DATASUTRA_feedback

if (solutionPrefs.access && solutionPrefs.access.userName) {
	feedback_author = solutionPrefs.access.userName
}

//clear out screenshot global
globals.DATASUTRA_feedback = null

if (!feedback_author) {
	elements.fld_feedback_author.requestFocus(false)
}
else {
	elements.fld_feedback_summary.requestFocus(false)
}



}
