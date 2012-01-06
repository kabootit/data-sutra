/**
 *
 * @properties={typeid:24,uuid:"af09a5fd-6744-4fd4-bd22-e2953e94d38c"}
 */
function ACTION_clear()
{


var field = application.getMethodTriggerElementName()

if (field) {
	field = field.slice(4)
	
	foundset[field] = null
}

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"9666601f-d5d7-42db-81fb-c00d2851b6ff"}
 */
function FILTER_forms()
{

if (application.__parent__.solutionPrefs) {
	
	//only run when using query based way to hit repository
	if (!solutionPrefs.repository.api) {
		//load formNames for selected module
		var moduleForms = solutionPrefs.repository.allForms[help_module_filter]
		var formNames = new Array()
		var j = 0
		
		if (moduleForms) { //check to make sure module_filter has a loaded value (they chose something)
			for (var i in moduleForms) {
				formNames[j] = moduleForms[i].formName
				j++
			}
		}
	}
	//get from the workspace
	else if (solutionPrefs.repository.workspace) {
		var moduleForms = solutionPrefs.repository.workspace[module_filter]
	
		var formNames = new Array()
		var j = 0
		
		if (moduleForms) { //check to make sure module_filter has a loaded value (they chose something)
			for (var i in moduleForms) {
				formNames[j] = i
				j++
			}
		}
	}
	else {
		var formNames = forms.allnames
	}
	
	formNames = formNames.sort()
	
	application.setValueListItems('NAV_current_module_forms', formNames)

}
}

/**
 *
 * @properties={typeid:24,uuid:"aaa62eb7-6dda-43be-9eb5-924d0943f348"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	form setup
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	September 15, 2008 -- David Workman, Data Mosaic
 *			  	
 */


// load tooltips from tooltip module
globals.TRIGGER_tooltip_set()
}
