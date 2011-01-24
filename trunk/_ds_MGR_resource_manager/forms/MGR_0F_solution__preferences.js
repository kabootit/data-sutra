/**
 *
 * @properties={typeid:24,uuid:"42E0638C-C157-40B6-B819-137EE381470B"}
 */
function FLD_data_change__auto_collapse()
{

/*
 *	TITLE    :	FLD_data_change__auto_collapse
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	changes solutionPrefs.config.navigationCollapse
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 29, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs) {
	solutionPrefs.config.navigationCollapse = (navigation_collapse_auto) ? true : false
}


}

/**
 *
 * @properties={typeid:24,uuid:"0DAEA066-2734-40C5-AD5A-F32B4866BAF3"}
 */
function FLD_data_change__color_background()
{

/*
 *	TITLE    :	FLD_data_change__color_background
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	changes solutionPrefs.config.navigationCollapse
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 29, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs) {
	solutionPrefs.listSetup.listBackground = (list_color_background) ? list_color_background : '#D1D7E2'
}



}

/**
 *
 * @properties={typeid:24,uuid:"FF7E5BEA-39A5-4C65-BB2E-AD781CF9D38C"}
 */
function FLD_data_change__jasper_directory()
{

/*
 *	TITLE    :	FLD_data_change__jasper_directory
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	configure jasper report directory
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__jasper_directory()
 *			  	
 *	MODIFIED :	June 12, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var jasperDir = utils.stringReplace(jasper_directory,"\\", "/")

if (plugins.jasperPluginRMI) {
	plugins.jasperPluginRMI.reportDirectory = jasperDir
}
}

/**
 *
 * @properties={typeid:24,uuid:"BCDD55B9-DD19-43A0-8B24-FE566D9F58FD"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TRIGGER_tooltip_set()


}

/**
 *
 * @properties={typeid:24,uuid:"A0988D03-9C58-457A-BF2E-E4A587ED3AA1"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	get global methods
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var globalMethods = globals.allmethods

/*
for (var i = 0; i < globalMethods.length; i++) {
	globalMethods[i] = 'globals.'+globalMethods[i]
}
*/

application.setValueListItems('MGR_solution_global_methods', globalMethods)


}

/**
 *
 * @properties={typeid:24,uuid:"089B2AA5-8AF4-4A49-AA87-87B8F332DE32"}
 */
function PREF_count_reset()
{

/*
 *	TITLE    :	PREF_count_reset
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	updates solutionPrefs.recCount with new preference for displaying total count information
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs) {
	solutionPrefs.recCount = list_count
}
}

/**
 *
 * @properties={typeid:24,uuid:"815A8732-19F5-4EBF-891A-787711069B27"}
 */
function PREF_date_format()
{

/*
 *	TITLE    :	PREF_date_format
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	punch down this as default format; warn if different than locale setting
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs && solutionPrefs.fastFind) {
	solutionPrefs.fastFind.dateFormat = (find_dateformat) ? find_dateformat : i18n.getDefaultDateFormat()
	
	//check that not different than locale date setting
	if (i18n.getDefaultDateFormat() != solutionPrefs.fastFind.dateFormat) {
		var whatToDo = plugins.dialogs.showQuestionDialog(
					'Inconsistent date format',
					'<html>The date format specified in the Locale Servoy Preference (' + i18n.getDefaultDateFormat() + ') is different from<br>'+
					'the date format just entered (' + solutionPrefs.fastFind.dateFormat + ').  Do you want to keep the value you just entered<br>' +
					'or revert to the Servoy default format?',
					'Revert',
					'Keep')
		if (whatToDo == 'Revert') {
			solutionPrefs.fastFind.dateFormat = find_dateformat = i18n.getDefaultDateFormat()
			databaseManager.saveData()
		}
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"8469FD15-0BF8-4F0D-8CAC-6F1CD9850EDA"}
 */
function PREF_find_reset()
{

/*
 *	TITLE    :	PREF_find_reset
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	default behavior for fast find (contains, starts, ends, exact)
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs && solutionPrefs.fastFind) {
	solutionPrefs.fastFind.findWildcard = (find_wildcard) ? find_wildcard : '#'
}
}

/**
 *
 * @properties={typeid:24,uuid:"83390185-10C1-48E2-A3FA-12ADD26C753D"}
 */
function PREF_get_directory()
{

/*
 *	TITLE    :	PREF_get_directory
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	PREF_get_directory()
 *			  	
 *	MODIFIED :	July 6, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var jasperDir = plugins.file.showDirectorySelectDialog()

if (jasperDir) {
	jasper_directory = jasperDir
	FLD_data_change__jasper_directory()
}

}

/**
 *
 * @properties={typeid:24,uuid:"71E0F7B8-7872-4171-9010-C6794AF95308"}
 */
function PREF_list_reset()
{

/*
 *	TITLE    :	PREF_list_reset
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	clears solutionPrefs.listSetup
 *			  	change default sleep time for universal list
 *			  	change max record display for universal list
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

databaseManager.saveData()

if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs) {
//TODO: warning!! will overwrite any attributes added later
	solutionPrefs.listSetup = globals.DS_list_load()
}


}

/**
 *
 * @properties={typeid:24,uuid:"A8E083A4-5B9F-40F7-9777-9C836ECD68BE"}
 */
function PREF_save_screen()
{

/*
 *	TITLE    :	PREF_save_screen
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
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

if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs) {
	screen_width = application.getWindowWidth()
	screen_height = application.getWindowHeight()
	location_x = application.getWindowX()
	location_y = application.getWindowY()
	
	databaseManager.saveData()
}
}

/**
 *
 * @properties={typeid:24,uuid:"150D8F2B-ADE7-4AB4-847D-790C2A71A5AB"}
 */
function PREF_set_kiosk()
{

/*
 *	TITLE    :	PREF_set_kiosk
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	saves current value for kiosk settings
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

if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs) {
	databaseManager.saveData()
	
	var myKiosk = 
	solutionPrefs.screenAttrib.kiosk = 
		new Object()
	
	myKiosk.fullScreen = kiosk_fullscreen
	myKiosk.showMenu = kiosk_menu
	myKiosk.showStatusBar = kiosk_statusbar
	myKiosk.showToolbar = kiosk_toolbar
}
}
