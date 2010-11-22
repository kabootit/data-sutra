/**
 *
 * @properties={typeid:24,uuid:"8de7d4f6-9de7-4aec-af69-a0229a76f751"}
 */
function ACTION_cancel()
{

/*
 *	TITLE    :	ACTION_cancel
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	rollback screen changes, close FiD
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Jan 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//not already ok to close, cancel
if (!globals.CODE_hide_form) {
	//rollback edited records
	databaseManager.rollbackEditedRecords()
	
	//turn autosave back on
	databaseManager.setAutoSave(true)
	
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	application.closeFormDialog('accessScreen')
}

}

/**
 *
 * @properties={typeid:24,uuid:"7dfa6ba7-bc9b-4a7d-89aa-9270f83e90d5"}
 */
function ACTION_fill()
{

/*
 *	TITLE    :	PREF_save_screen
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	saves current value for screen location, size and jsplitbean dividers as defaults
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

if ((application.getSolutionName() != 'ds_AC_access_control') && application.__parent__.solutionPrefs) {
	screen_width = application.getWindowWidth()
	screen_height = application.getWindowHeight()
	screen_location_x = application.getWindowX()
	screen_location_y = application.getWindowY()
	screen_location_center = 0
}
}

/**
 *
 * @properties={typeid:24,uuid:"dd43ae31-3eaa-495c-a032-2d8ff0ac66b8"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	save screen, close FiD
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

//turn autosave back on
databaseManager.setAutoSave(true)

//enaable closing the form
globals.CODE_hide_form = 1

application.closeFormDialog('accessScreen')

//resize window
if (this.reSize) {
	//turn flag off
	this.reSize = undefined
	
	solutionPrefs.screenAttrib = globals.PREF_set_screen_attrib()
	
	//set window size/location
	application.setWindowSize(solutionPrefs.screenAttrib.initialScreenWidth,solutionPrefs.screenAttrib.initialScreenHeight)
	if (solutionPrefs.screenAttrib.locationCenter) {
		application.setWindowLocation(-1,-1)
	}
	else {
		application.setWindowLocation(solutionPrefs.screenAttrib.locationX,solutionPrefs.screenAttrib.locationY)
	}
	
	application.updateUI()
	
	//refire current space
	switch (solutionPrefs.config.activeSpace) {
		case 'standard':
			var spaceNumber = 'btn_space_1'
			break			
		case 'list':
			var spaceNumber = 'btn_space_2'
			break
		case 'vertical':
			var spaceNumber = 'btn_space_3'
			break
		case 'classic':	
			var spaceNumber = 'btn_space_5'
			break
		case 'wide':
			var spaceNumber = 'btn_space_6'
			break
	}
	if (spaceNumber) {
		globals.SPACE_change(spaceNumber,true)
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"a5842f55-f9cd-4744-9421-8b53da23f5da"}
 */
function ACTION_reset()
{

/*
 *	TITLE    :	ACTION_reset
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	resets all user windowing options to default values
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_reset()
 *			  	
 *	MODIFIED :	July 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var input = plugins.dialogs.showQuestionDialog(
					'Confirm reset',
					'All custom window and space settings will be lost. Continue?',
					'Yes',
					'No')

if (input == 'Yes') {
	screen_height = null
	screen_width = null
	screen_location_center = null
	screen_location_x = null
	screen_location_y = null
	space_classic_horizontal = null
	space_classic_vertical = null
	space_list_horizontal = null
	space_standard_horizontal = null
	space_standard_vertical = null
	space_vertical_horizontal_1 = null
	space_vertical_horizontal_2 = null
	space_wide_horizontal = null
	space_wide_vertical = null
	
	//set flag to resize window if changes accepted
	this.reSize = true
}
}

/**
 *
 * @properties={typeid:24,uuid:"e19bbe9f-f1c5-4740-89b8-3ff7338174b8"}
 */
function FILL_centered()
{

/*
 *	TITLE    :	FILL_centered
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	saves current value for jsplitbean dividers
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//check that running in frameworks
if ((application.getSolutionName() != 'ds_AC_access_control') && application.__parent__.solutionPrefs) {
	
	var baseForm = solutionPrefs.config.formNameBase
	
	space_centered_horizontal_1 = forms[baseForm].elements.bean_main.dividerLocation
	space_centered_horizontal_2 = forms[baseForm].elements.bean_main.getWidth() - forms[baseForm].elements.bean_main.dividerLocation - forms[baseForm].elements.bean_workflow.dividerLocation
	
	databaseManager.saveData()
	
	plugins.dialogs.showInfoDialog('Success','You have successfully set new default dimensions for Centered')
	
}
//throw error
else {
	plugins.dialogs.showErrorDialog('Not running in Data Sutra','You must be in Data Sutra to fill the split bean values')
}
}

/**
 *
 * @properties={typeid:24,uuid:"950148ae-2e00-46dd-83bc-f8fc7690cad7"}
 */
function FILL_classic()
{

/*
 *	TITLE    :	FILL_classic
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	saves current value for jsplitbean dividers
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//check that running in frameworks
if ((application.getSolutionName() != 'ds_AC_access_control') && application.__parent__.solutionPrefs) {
	
	var baseForm = solutionPrefs.config.formNameBase
	
	space_classic_horizontal = forms[baseForm].elements.bean_main.dividerLocation
	space_classic_vertical = forms[baseForm].elements.bean_workflow.dividerLocation
	
	databaseManager.saveData()
	
	plugins.dialogs.showInfoDialog('Success','You have successfully set new default dimensions for Classic')
}
//throw error
else {
	plugins.dialogs.showErrorDialog('Not running in Data Sutra','You must be in Data Sutra to fill the split bean values')
}
}

/**
 *
 * @properties={typeid:24,uuid:"c760d929-2fd6-44c1-970e-8248fbaff400"}
 */
function FILL_list()
{

/*
 *	TITLE    :	FILL_list
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	saves current value for jsplitbean dividers
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//check that running in frameworks
if ((application.getSolutionName() != 'ds_AC_access_control') && application.__parent__.solutionPrefs) {
	
	var baseForm = solutionPrefs.config.formNameBase
	
	space_list_horizontal = forms[baseForm].elements.bean_main.dividerLocation
	
	databaseManager.saveData()
	
	plugins.dialogs.showInfoDialog('Success','You have successfully set new default dimensions for List')

}
//throw error
else {
	plugins.dialogs.showErrorDialog('Not running in Data Sutra','You must be in Data Sutra to fill the split bean values')
}
}

/**
 *
 * @properties={typeid:24,uuid:"72bdfcc8-bc22-4986-96e4-5577e624d32d"}
 */
function FILL_standard()
{

/*
 *	TITLE    :	FILL_standard
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	saves current value for jsplitbean dividers
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//check that running in frameworks
if ((application.getSolutionName() != 'ds_AC_access_control') && application.__parent__.solutionPrefs) {
	
	var baseForm = solutionPrefs.config.formNameBase
	
	space_standard_horizontal = forms[baseForm].elements.bean_main.dividerLocation
	space_standard_vertical = forms[baseForm].elements.bean_list.dividerLocation
	
	databaseManager.saveData()
	
	plugins.dialogs.showInfoDialog('Success','You have successfully set new default dimensions for Standard')

}
//throw error
else {
	plugins.dialogs.showErrorDialog('Not running in Data Sutra','You must be in Data Sutra to fill the split bean values')
}
}

/**
 *
 * @properties={typeid:24,uuid:"c3b58774-e8a3-48b5-b7af-1c755c11256f"}
 */
function FILL_vertical()
{

/*
 *	TITLE    :	FILL_vertical
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	saves current value for jsplitbean dividers
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//check that running in frameworks
if ((application.getSolutionName() != 'ds_AC_access_control') && application.__parent__.solutionPrefs) {
	
	var baseForm = solutionPrefs.config.formNameBase
	
	space_vertical_horizontal_1 = forms[baseForm].elements.bean_list.dividerLocation
	space_vertical_horizontal_2 = forms[baseForm].elements.bean_main.dividerLocation - forms[baseForm].elements.bean_list.dividerLocation
	
	databaseManager.saveData()
	
	plugins.dialogs.showInfoDialog('Success','You have successfully set new default dimensions for Vertical')
	
}
//throw error
else {
	plugins.dialogs.showErrorDialog('Not running in Data Sutra','You must be in Data Sutra to fill the split bean values')
}
}

/**
 *
 * @properties={typeid:24,uuid:"e2e1b650-4cd9-449c-841a-6b7e0bdb9280"}
 */
function FILL_wide()
{

/*
 *	TITLE    :	FILL_list
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	saves current value for jsplitbean dividers
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//check that running in frameworks
if ((application.getSolutionName() != 'ds_AC_access_control') && application.__parent__.solutionPrefs) {
	
	var baseForm = solutionPrefs.config.formNameBase
	
	space_wide_horizontal = forms[baseForm].elements.bean_list.dividerLocation
	space_wide_vertical = forms[baseForm].elements.bean_main.dividerLocation
	
	databaseManager.saveData()
	
	plugins.dialogs.showInfoDialog('Success','You have successfully set new default dimensions for Wide')

}
//throw error
else {
	plugins.dialogs.showErrorDialog('Not running in Data Sutra','You must be in Data Sutra to fill the split bean values')
}
}

/**
 *
 * @properties={typeid:24,uuid:"e79a5bff-51a2-4755-8563-4c56ee08a2d9"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	go to passed in user, show FiD
 *			  	
 *	INPUT    :	1) id_user for user record to be modified
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

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var userID = arguments[0]

//disable closing the form
globals.CODE_hide_form = 0

//find correct field
controller.find()
id_user = userID
controller.search()

//turn autosave off
databaseManager.setAutoSave(false)

//show form in dialog
application.showFormInDialog(forms.AC_P_screen,-1,-1,-1,-1,'Screen',false,false,'accessScreen')





}
