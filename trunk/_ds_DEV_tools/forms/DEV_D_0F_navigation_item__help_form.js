/**
 *
 * @properties={typeid:24,uuid:"b11a4edb-dc46-4a6b-92ae-3849ac0513bd"}
 */
function ACTION_clear()
{


var field = application.getMethodTriggerElementName()

if (field) {
	field = field.slice(4)
	
	foundset[field] = null
}

}

/**
 *
 * @properties={typeid:24,uuid:"b0e39ff7-5327-43a7-b5c9-2188fb2e1245"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	create new nav item representation
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_ok()
 *			  	
 *	MODIFIED :	December 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//rebuild current navigation item
globals.DEV_rebuild_navitem(solutionPrefs.config.currentFormID)

//fire form loader if form different
var baseForm = solutionPrefs.config.formNameBase
var formName = forms[baseForm].elements.tab_content_C.getTabFormNameAt(1)

if (formName != help_form_to_load) {
	//in preview
	if (solutionPrefs.config.helpMode) {
		globals.HELP()
	}
	//in edit mode
	else if (solutionPrefs.design.modes.help) {
		globals.FX_load_forms(id_navigation_item)
	}
}

/*
var idNavItem = solutionPrefs.config.currentFormID
var idNavSet = globals.DATASUTRA_navigation_set
var displayNavSet = application.getValueListDisplayValue('NAV_navigation_set',idNavSet)

if (utils.hasRecords(foundset)) {	
	var record = foundset.getRecord(1)
	
	//if navigation items in this set, find posn of selected one
	if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length) {
		//find position in array
		var itemPosn = -1
		for (var i = 0; i < navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length && !(itemPosn >= 0); i++) {
			if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder[i].navigationItem.idNavigationItem == idNavItem) {
				itemPosn = i
			}
		}
		
		//not found, tack on at the end
		if (itemPosn < 0) {
			itemPosn = navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length
		}
	}
	else {
		var itemPosn = 0
	}
	
	//update this record alone
	if (record) {
		//pump in data for newly changed stuff
		navigationPrefs.byNavSetName[displayNavSet].itemsByName[record.item_name] = 
		navigationPrefs.byNavSetName[displayNavSet].itemsByOrder[itemPosn] = 
		navigationPrefs.byNavItemID[idNavItem] = 
			globals.FX_load_navset_item(record,true)
	}
}
*/

//if in help preview mode, refire it
if (solutionPrefs.config.helpMode) {
	globals.HELP(true)
}


}

/**
 *
 * @properties={typeid:24,uuid:"36c07e1d-95fe-4f96-be9f-64dcc3e85d69"}
 */
function FILTER_forms()
{

/*
 *	TITLE    :	FILTER_forms
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	refilter valuelists for forms
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FILTER_forms()
 *			  	
 *	MODIFIED :	February 22, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	
	//load formNames for selected module
	//only run when using query based way to hit repository
	if (!solutionPrefs.repository.api) {
		var moduleForms = solutionPrefs.repository.allForms[help_module_filter]
	
		var formNames = new Array()
		var j = 0
		
		//check to make sure module_filter has a loaded value (they chose something)
		if (moduleForms) {
			for (var i in moduleForms) {
				formNames[j] = moduleForms[i].formName
				j++
			}
		}
	}
	//get from the workspace
	else if (solutionPrefs.repository.workspace) {
		var moduleForms = solutionPrefs.repository.workspace[help_module_filter]
	
		var formNames = new Array()
		var j = 0
		
		//check to make sure module_filter has a loaded value (they chose something)
		if (moduleForms) {
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
 * @properties={typeid:24,uuid:"fbf40182-967f-4648-93da-4cb35c4eece0"}
 */
function FLD_data_change__help_module()
{

/*
 *	TITLE    :	FLD_data_change__help_module
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	refilter valuelists for forms
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__help_module()
 *			  	
 *	MODIFIED :	December 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

FILTER_forms()
}

/**
 *
 * @properties={typeid:24,uuid:"5cfde065-fd56-49e2-a662-bec295e802de"}
 */
function GET_record()
{

/*
 *	TITLE    :	GET_record
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	find currently selected navigation item
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	Mar 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	//select correct record
	controller.find()
	id_navigation_item = solutionPrefs.config.currentFormID
	controller.search()
}
}

/**
 *
 * @properties={typeid:24,uuid:"a185865c-d146-4d62-b342-4ea93e79069a"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_on_select()
 *			  	
 *	MODIFIED :	February 22, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

FILTER_forms()
}
