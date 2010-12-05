/**
 *
 * @properties={typeid:24,uuid:"EED8255E-7CB6-4A23-9650-B39217AD2DB4"}
 */
function FILL_centered()
{

/*
 *	TITLE    :	FILL_vertical
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
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
if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs) {
	
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
 * @properties={typeid:24,uuid:"8B4CFB0C-1899-43C5-9ACE-39AFCDEEBF3B"}
 */
function FILL_classic()
{

/*
 *	TITLE    :	FILL_classic
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
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
if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs) {
	
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
 * @properties={typeid:24,uuid:"24A5ACCF-8F4F-4FFD-9D99-976C38D230E5"}
 */
function FILL_list()
{

/*
 *	TITLE    :	FILL_list
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
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
if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs) {
	
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
 * @properties={typeid:24,uuid:"7A6FD493-664B-4A64-956E-BCF661C0CFC4"}
 */
function FILL_standard()
{

/*
 *	TITLE    :	FILL_standard
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
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
if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs) {
	
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
 * @properties={typeid:24,uuid:"B8D9B9E0-B598-4F93-A340-44D84CBA3947"}
 */
function FILL_vertical()
{

/*
 *	TITLE    :	FILL_vertical
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
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
if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs) {
	
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
 * @properties={typeid:24,uuid:"B320084D-E7F6-4FF6-8F00-1BBA7AF9B36E"}
 */
function FILL_wide()
{

/*
 *	TITLE    :	FILL_list
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
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
if ((application.getSolutionName() != '_ds_MGR_resource_manager') && application.__parent__.solutionPrefs) {
	
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
 * @properties={typeid:24,uuid:"8DE86D2E-8070-49DA-A66F-07BB49065824"}
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

globals.CALLBACK_tooltip_set()


}
