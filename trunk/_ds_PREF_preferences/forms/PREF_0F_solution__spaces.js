/**
 *
 * @properties={typeid:24,uuid:"db9218c2-fa9d-45fb-a899-7d58e4beaf6b"}
 */
function FILL_centered()
{

/*
 *	TITLE    :	FILL_vertical
 *			  	
 *	MODULE   :	ds_PREF_preferences
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
if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs) {
	
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
 * @properties={typeid:24,uuid:"d90ff1f2-bd51-4026-b87d-42adea73e9e3"}
 */
function FILL_classic()
{

/*
 *	TITLE    :	FILL_classic
 *			  	
 *	MODULE   :	ds_PREF_preferences
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
if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs) {
	
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
 * @properties={typeid:24,uuid:"fbb4d86c-012a-4172-a683-0aba48704e76"}
 */
function FILL_list()
{

/*
 *	TITLE    :	FILL_list
 *			  	
 *	MODULE   :	ds_PREF_preferences
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
if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs) {
	
	var baseForm = solutionPrefs.config.formNameBase
	
	//check that this space is displayed
	if (solutionPrefs.config.activeSpace == 'list flip') {
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
 * @properties={typeid:24,uuid:"96d13c6a-b5b0-42c1-beed-a865a9fb92fd"}
 */
function FILL_standard()
{

/*
 *	TITLE    :	FILL_standard
 *			  	
 *	MODULE   :	ds_PREF_preferences
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
if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs) {
	
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
 * @properties={typeid:24,uuid:"8b7b1fac-1207-496f-801c-8033c9fa89ef"}
 */
function FILL_vertical()
{

/*
 *	TITLE    :	FILL_vertical
 *			  	
 *	MODULE   :	ds_PREF_preferences
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
if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs) {
	
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
 * @properties={typeid:24,uuid:"a6d599d1-1c88-4e9a-8b3e-815bd1171d65"}
 */
function FILL_wide()
{

/*
 *	TITLE    :	FILL_list
 *			  	
 *	MODULE   :	ds_PREF_preferences
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
if ((application.getSolutionName() != 'ds_PREF_preferences') && application.__parent__.solutionPrefs) {
	
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
 * @properties={typeid:24,uuid:"5f269049-f388-4260-9daf-bb66898aed9c"}
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
