/**
 *
 * @properties={typeid:24,uuid:"1D956AD6-A86F-4C69-BBE5-78569E04CC4E"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	rsrc_RPT_report
 *			  	
 *	ABOUT    :	delete record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_delete()
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var input =	plugins.dialogs.showWarningDialog(
			"Warning!",
			"Delete this record?",
			"Yes",
			"No")

if (input == "Yes") {
	controller.deleteRecord()
}
}

/**
 *
 * @properties={typeid:24,uuid:"C04E918E-DC49-4A44-992F-B4D4D4720A1C"}
 */
function REC_eval()
{

/*
 *	TITLE    :	REC_eval
 *			  	
 *	MODULE   :	rsrc_RPT_report
 *			  	
 *	ABOUT    :	test out report
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_eval()
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//if form and method selected and they exist in the solution
if (report_form && report_method && forms[report_form] && forms[report_form][report_method]) {
	forms[report_form][report_method]()
}
//if form selected and it exists
else if (report_form && forms[report_form]) {
	forms[report_form].controller.showPrintPreview()
}
}

/**
 *
 * @properties={typeid:24,uuid:"F8E754F9-5490-4B0B-B33E-FCE078C83C1C"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	rsrc_RPT_report
 *			  	
 *	ABOUT    :	set form and method valuelists based on module/form of selected report
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_on_select()
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (foundset.getSize()) {
	SET_forms()
	SET_methods()
}


}

/**
 *
 * @properties={typeid:24,uuid:"674ACC9E-03E5-4867-87B9-E4D1CCA90E93"}
 */
function SET_forms()
{

/*
 *	TITLE    :	SET_forms
 *			  	
 *	MODULE   :	rsrc_RPT_report
 *			  	
 *	ABOUT    :	get the names of the forms
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	SET_forms()
 *			  	
 *	MODIFIED :	February 20, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//only show forms from selected module when in top level form
if (application.__parent__.solutionPrefs && foundset.getSize() && report_module) {
	//get from repository via queries way
	if (!solutionPrefs.repository.api) {
		//load formNames for report module
		var moduleForms = solutionPrefs.repository.allForms[report_module]
		var formNames = new Array()
		var j = 0
		
		//check to make sure that there are forms in the report module
		if (moduleForms) {
			for (var i in moduleForms) {
				formNames[j++] = moduleForms[i].formName
			}
		}
	}
	//get from the workspace
	else if (solutionPrefs.repository.workspace) {
		var moduleForms = solutionPrefs.repository.workspace[report_module]
	
		var formNames = new Array()
		var j = 0
		
		if (moduleForms) { //check to make sure module_filter has a loaded value (they chose something)
			for (var i in moduleForms) {
				formNames[j++] = i
			}
		}
	}
}
//when in reporting module, show forms anyway
else {
	var formNames = forms.allnames
}

formNames = formNames.sort()

//set valuelist
application.setValueListItems('RPT_form_names', formNames)


}

/**
 *
 * @properties={typeid:24,uuid:"F9A1717C-B492-4943-8940-54C31F2DAD48"}
 */
function SET_methods()
{

/*
 *	TITLE    :	SET_methods
 *			  	
 *	MODULE   :	rsrc_RPT_report
 *			  	
 *	ABOUT    :	methods on chosen form
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	SET_methods()
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: add in global methods

databaseManager.saveData()

if (utils.hasRecords(foundset) && report_form && forms[report_form]) {
	var allMethods = forms[report_form].allmethods
	if (allMethods && allMethods.length) {
		application.setValueListItems('RPT_method_names',allMethods)
	}
	else {
		application.setValueListItems('RPT_method_names',new Array())
	}
}
else {
	application.setValueListItems('RPT_method_names',new Array())
}
}
