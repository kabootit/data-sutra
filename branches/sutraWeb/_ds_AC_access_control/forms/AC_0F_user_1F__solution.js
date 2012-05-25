/**
 *
 * @properties={typeid:24,uuid:"33800553-3b2e-4ab9-a292-20728f920385"}
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
	
	//check that this space is displayed
	if (solutionPrefs.config.activeSpace == 'centered') {
		space_centered_horizontal_1 = forms[baseForm].elements.bean_main.dividerLocation
		space_centered_horizontal_2 = forms[baseForm].elements.bean_main.getWidth() - forms[baseForm].elements.bean_main.dividerLocation - forms[baseForm].elements.bean_workflow.dividerLocation
		
		/*	//TODO: reference for beans
		//top-level bean
		forms[baseForm].elements.bean_main.dividerLocation
		
		//left-side (list) bean
		forms[baseForm].elements.bean_list.dividerLocation
		
		//right-side (workflow) bean
		forms[baseForm].elements.bean_workflow.dividerLocation
		*/
		
		databaseManager.saveData()
	}
	//error that must be in that space to get the value
	else {
		plugins.dialogs.showErrorDialog('Incorrect space','You must be in the centered space to do this')
	}
}
//throw error
else {
	plugins.dialogs.showErrorDialog('Not running in Data Sutra','You must be in Data Sutra to fill the split bean values')
}
}

/**
 *
 * @properties={typeid:24,uuid:"71db0abc-fc62-4c83-8d3f-268b1e4834ae"}
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
	
	//check that this space is displayed
	if (solutionPrefs.config.activeSpace == 'classic') {
		space_classic_horizontal = forms[baseForm].elements.bean_main.dividerLocation
		space_classic_vertical = forms[baseForm].elements.bean_workflow.dividerLocation
		
		/*	//TODO: reference for beans
		//top-level bean
		forms[baseForm].elements.bean_main.dividerLocation
		
		//left-side (list) bean
		forms[baseForm].elements.bean_list.dividerLocation
		
		//right-side (workflow) bean
		forms[baseForm].elements.bean_workflow.dividerLocation
		*/
		
		databaseManager.saveData()
	}
	//error that must be in that space to get the value
	else {
		plugins.dialogs.showErrorDialog('Incorrect space','You must be in the classic space to do this')
	}
}
//throw error
else {
	plugins.dialogs.showErrorDialog('Not running in Data Sutra','You must be in Data Sutra to fill the split bean values')
}
}

/**
 *
 * @properties={typeid:24,uuid:"0509a5f7-6dc3-4f5b-9ef1-15cedccb1229"}
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
	
	//check that this space is displayed
	if (solutionPrefs.config.activeSpace == 'list') {
		space_list_horizontal = forms[baseForm].elements.bean_main.dividerLocation
		
		/*	//TODO: reference for beans
		//top-level bean
		forms[baseForm].elements.bean_main.dividerLocation
		
		//left-side (list) bean
		forms[baseForm].elements.bean_list.dividerLocation
		
		//right-side (workflow) bean
		forms[baseForm].elements.bean_workflow.dividerLocation
		*/
		
		databaseManager.saveData()
	}
	//error that must be in that space to get the value
	else {
		plugins.dialogs.showErrorDialog('Incorrect space','You must be in the list space to do this')
	}
}
//throw error
else {
	plugins.dialogs.showErrorDialog('Not running in Data Sutra','You must be in Data Sutra to fill the split bean values')
}
}

/**
 *
 * @properties={typeid:24,uuid:"64bff5c4-984f-4d39-b867-961354f174e9"}
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
	
	//check that this space is displayed
	if (solutionPrefs.config.activeSpace == 'standard') {
		space_standard_horizontal = forms[baseForm].elements.bean_main.dividerLocation
		space_standard_vertical = forms[baseForm].elements.bean_list.dividerLocation
		
		/*	//TODO: reference for beans
		//top-level bean
		forms[baseForm].elements.bean_main.dividerLocation
		
		//left-side (list) bean
		forms[baseForm].elements.bean_list.dividerLocation
		
		//right-side (workflow) bean
		forms[baseForm].elements.bean_workflow.dividerLocation
		*/
		
		databaseManager.saveData()
	}
	//error that must be in that space to get the value
	else {
		plugins.dialogs.showErrorDialog('Incorrect space','You must be in the standard space to do this')
	}
}
//throw error
else {
	plugins.dialogs.showErrorDialog('Not running in Data Sutra','You must be in Data Sutra to fill the split bean values')
}
}

/**
 *
 * @properties={typeid:24,uuid:"1f901b4e-42c6-4505-9ae8-f0ab6c8abb1d"}
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
	
	//check that this space is displayed
	if (solutionPrefs.config.activeSpace == 'vertical') {
		space_vertical_horizontal_1 = forms[baseForm].elements.bean_list.dividerLocation
		space_vertical_horizontal_2 = forms[baseForm].elements.bean_main.dividerLocation - forms[baseForm].elements.bean_list.dividerLocation
		
		/*	//TODO: reference for beans
		//top-level bean
		forms[baseForm].elements.bean_main.dividerLocation
		
		//left-side (list) bean
		forms[baseForm].elements.bean_list.dividerLocation
		
		//right-side (workflow) bean
		forms[baseForm].elements.bean_workflow.dividerLocation
		*/
		
		databaseManager.saveData()
	}
	//error that must be in that space to get the value
	else {
		plugins.dialogs.showErrorDialog('Incorrect space','You must be in the vertical space to do this')
	}
}
//throw error
else {
	plugins.dialogs.showErrorDialog('Not running in Data Sutra','You must be in Data Sutra to fill the split bean values')
}
}

/**
 *
 * @properties={typeid:24,uuid:"176f90e0-eb01-4657-b2a8-83c3f48db3b2"}
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
	
	//check that this space is displayed
	if (solutionPrefs.config.activeSpace == 'wide') {
		space_wide_horizontal = forms[baseForm].elements.bean_list.dividerLocation
		space_wide_vertical = forms[baseForm].elements.bean_main.dividerLocation
		
		/*	//TODO: reference for beans
		//top-level bean
		forms[baseForm].elements.bean_main.dividerLocation
		
		//left-side (list) bean
		forms[baseForm].elements.bean_list.dividerLocation
		
		//right-side (workflow) bean
		forms[baseForm].elements.bean_workflow.dividerLocation
		*/
		
		databaseManager.saveData()
	}
	//error that must be in that space to get the value
	else {
		plugins.dialogs.showErrorDialog('Incorrect space','You must be in the wide space to do this')
	}
}
//throw error
else {
	plugins.dialogs.showErrorDialog('Not running in Data Sutra','You must be in Data Sutra to fill the split bean values')
}
}

/**
 *
 * @properties={typeid:24,uuid:"71deb79e-f7b6-408e-998b-a1b803721420"}
 */
function PREF_save_screen()
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
	
	databaseManager.saveData()
}
}

/**
 *
 * @properties={typeid:24,uuid:"34f065cc-df40-4b79-984a-17c7696dbbb2"}
 */
function PREF_sidebar_width()
{

/*
 *	TITLE    :	PREF_save_screen
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	saves current value sidebar width
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	February 2, 2010 -- Troy Elliott, Data Mosaic
 *			  	
 */

if ((application.getSolutionName() != 'ds_AC_access_control') && application.__parent__.solutionPrefs) {
	
	sidebar_width = solutionPrefs.screenAttrib.sidebar.currentSize
	
	databaseManager.saveData()
}
}
