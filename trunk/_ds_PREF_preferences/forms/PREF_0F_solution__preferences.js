/**
 *
 * @properties={typeid:24,uuid:"3481a90d-c535-449b-bade-00f5a70ed5a2"}
 */
function FLD_data_change__auto_collapse()
{

/*
 *	TITLE    :	FLD_data_change__auto_collapse
 *			  	
 *	MODULE   :	ds_PREF_preferences
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

if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs) {
	solutionPrefs.config.navigationCollapse = (navigation_collapse_auto) ? true : false
}


}

/**
 *
 * @properties={typeid:24,uuid:"2b4b08da-b53a-4117-b6da-900ed45a5a8f"}
 */
function FLD_data_change__color_background()
{

/*
 *	TITLE    :	FLD_data_change__color_background
 *			  	
 *	MODULE   :	ds_PREF_preferences
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

if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs) {
	solutionPrefs.listSetup.listBackground = (list_color_background) ? list_color_background : '#D1D7E2'
}



}

/**
 *
 * @properties={typeid:24,uuid:"e9d7a864-6c66-4139-afd7-0a07068f09a7"}
 */
function FLD_data_change__jasper_directory()
{

/*
 *	TITLE    :	FLD_data_change__jasper_directory
 *			  	
 *	MODULE   :	ds_PREF_preferences
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
 * @properties={typeid:24,uuid:"abac71dc-c579-4500-bcd7-a795f5a36a35"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_PREF_preferences
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

globals.CALLBACK_tooltip_set()


}

/**
 *
 * @properties={typeid:24,uuid:"1800a2ee-a7cf-4eca-b0ec-69917ad9299e"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_PREF_preferences
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

application.setValueListItems('PREF_global_methods', globalMethods)


}

/**
 *
 * @properties={typeid:24,uuid:"399a6f51-ba12-4545-9caf-49412a7c18d1"}
 */
function PREF_count_reset()
{

/*
 *	TITLE    :	PREF_count_reset
 *			  	
 *	MODULE   :	ds_PREF_preferences
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

if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs) {
	solutionPrefs.recCount = list_count
}
}

/**
 *
 * @properties={typeid:24,uuid:"3aabc096-713d-4c4c-9f84-811897a8b0fd"}
 */
function PREF_date_format()
{

/*
 *	TITLE    :	PREF_date_format
 *			  	
 *	MODULE   :	ds_PREF_preferences
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

if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs && solutionPrefs.fastFind) {
	solutionPrefs.fastFind.dateFormat = (find_dateformat) ? find_dateformat : i18n.getDefaultDateFormat()
	
	//check that not different than locale date setting
	if (i18n.getDefaultDateFormat() != solutionPrefs.fastFind.dateFormat) {
		var whatToDo = plugins.dialogs.showQuestionDialog(
					'Inconsistent date format',
					'<html>The date format specified in the Locale Servoy Preference is different from<br>'+
					'the date format just entered.  Do you want to keep the value you just entered<br>' +
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
 * @properties={typeid:24,uuid:"4136c884-d488-430c-8fdf-c835791df153"}
 */
function PREF_find_reset()
{

/*
 *	TITLE    :	PREF_find_reset
 *			  	
 *	MODULE   :	ds_PREF_preferences
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

if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs && solutionPrefs.fastFind) {
	solutionPrefs.fastFind.findWildcard = (find_wildcard) ? find_wildcard : '#'
}
}

/**
 *
 * @properties={typeid:24,uuid:"458d701b-7c23-434a-81b9-54c40064ff73"}
 */
function PREF_get_directory()
{

/*
 *	TITLE    :	PREF_get_directory
 *			  	
 *	MODULE   :	ds_PREF_preferences
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
 * @properties={typeid:24,uuid:"e1d99387-8c39-4a02-8ad1-6536a6350b85"}
 */
function PREF_list_reset()
{

/*
 *	TITLE    :	PREF_list_reset
 *			  	
 *	MODULE   :	ds_PREF_preferences
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

if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs) {
//TODO: warning!! will overwrite any attributes added later
	solutionPrefs.listSetup = globals.PREF_set_list_attrib()
}


}

/**
 *
 * @properties={typeid:24,uuid:"3b65495b-6f6b-405f-bafc-78124bcb59d6"}
 */
function PREF_save_screen()
{

/*
 *	TITLE    :	PREF_save_screen
 *			  	
 *	MODULE   :	ds_PREF_preferences
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

if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs) {
	screen_width = application.getWindowWidth()
	screen_height = application.getWindowHeight()
	location_x = application.getWindowX()
	location_y = application.getWindowY()
	
	databaseManager.saveData()
}
}

/**
 *
 * @properties={typeid:24,uuid:"ded5272e-7724-4818-ae06-2b6af7a89401"}
 */
function PREF_set_kiosk()
{

/*
 *	TITLE    :	PREF_set_kiosk
 *			  	
 *	MODULE   :	ds_PREF_preferences
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

if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs) {
	databaseManager.saveData()
	
	var myKiosk = solutionPrefs.screenAttrib.kiosk = new Object()
	myKiosk.fullScreen = kiosk_fullscreen
	myKiosk.showMenu = kiosk_menu
	myKiosk.showStatusBar = kiosk_statusbar
	myKiosk.showToolbar = kiosk_toolbar
}
}
