/**
 *
 * @properties={typeid:24,uuid:"C0A456CB-09EB-41F6-B7C7-5C8241212013"}
 */
function ACTION_select_all()
{

/*
 *	TITLE    :	ACTION_select_all
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_select_all()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// go through tooltips and set selected value to control value (0 or 1)

databaseManager.saveData()

for ( var i = 1 ; i <= foundset.getSize() ; i++ ) {

	var record = foundset.getRecord(i)
	record.selected = globals.MGR_tooltip_select_all

}

application.updateUI()
}

/**
 *
 * @properties={typeid:24,uuid:"486FBD04-60D5-45FF-9D60-7527464C1ACC"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_delete()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var input =	plugins.dialogs.showWarningDialog(
			"Warning!",
			"Delete this record?",
			"Yes",
			"No")

if (input == "Yes") {
	if (application.__parent__.solutionPrefs) {
		//get language where to find this piece of info, probably
		if (i18n_language) {
			var locale = solutionPrefs.i18n[i18n_language]
		}
		else {
			var locale = solutionPrefs.i18n.en
		}
		
		//remove from code global
		if (locale && form_name && element_name && locale[form_name][element_name]) {
			//delete tip
			delete locale[form_name][element_name]
		}
	}
	
	controller.deleteRecord()
}
}

/**
 *
 * @properties={typeid:24,uuid:"6283ECB6-0058-4573-BC7C-864E3E72B24A"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
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
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (foundset.getSize()) {
	SET_forms()
	SET_elements()
	
	//if form in dialog showing, change form
	var popUps = Packages.java.awt.Frame.getFrames()[0].getOwnedWindows()
	
	//loop over all popups; start with most recently created
	for (var i = popUps.length - 1; i >= 0; i--) {
		//tooltip preview found
		if (popUps[i].name == 'toolTipPreview') {
			//tooltip preview currently showing
			if (popUps[i].visible) {
				var theTitle = popUps[i].title
				theTitle = theTitle.substr(9)
				
				//get title of form and compare with form of selected record
				if (theTitle != form_name) {
					application.closeFormDialog('toolTipPreview')
					forms.MGR_0F_tooltip.POPUP_tooltip_form()
				}
			}
			
			//quit loop
			break
		}
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"7D7802C3-CBAB-4C7C-B62B-F506FC4758C5"}
 */
function SET_elements()
{

/*
 *	TITLE    :	SET_elements
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	SET_elements()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if (foundset.getSize() && form_name && forms[form_name]) {
	var allElements = forms[form_name].elements.allnames
	if (allElements && allElements.length) {
		application.setValueListItems('MGR_tooltip_element_names',allElements)
	}
	else {
		application.setValueListItems('MGR_tooltip_element_names',new Array())
	}
}
else {
	application.setValueListItems('MGR_tooltip_element_names',new Array())
}
}

/**
 *
 * @properties={typeid:24,uuid:"074D4CA5-79E8-4AAD-925A-02751D85895F"}
 */
function SET_forms()
{

/*
 *	TITLE    :	SET_forms
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	SET_forms()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//only show forms from selected module when in top level form and api the old way
if (application.__parent__.solutionPrefs && foundset.getSize() && module_filter) {
	
	//get from the repository via a few queries
	if (!solutionPrefs.repository.api && solutionPrefs.repository.allForms) {
		//load formNames for report module
		var moduleForms = solutionPrefs.repository.allForms[module_filter]
		var formNames = new Array()
		var j = 0
		
		//check to make sure that there are forms in the report module
		if (moduleForms) {
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
}
//when in reporting module, show forms anyway
else {
	var formNames = forms.allnames
}

formNames = formNames.sort()

//set valuelist
application.setValueListItems('MGR_tooltip_form_names', formNames)


}

/**
 *
 * @properties={typeid:24,uuid:"46402D50-EA46-4B62-BA79-4CCE1C387D00"}
 */
function SORT()
{

/*
 *	TITLE    :	SORT
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	if selected column header clicked, toggle selection of all showing
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	SORT()
 *			  	
 *	MODIFIED :	September 18, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: need to change status of all showing records

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

var colName = arguments[0]
var sortDirection = (arguments[1]) ? 'asc' : 'desc'
var status =
	this.value = (this.value) ? 0 : 1

//choose 
if (colName == 'selected') {
	
	globals.MGR_tooltip_select_all = status
	
	ACTION_select_all()
}
//normal sort
else {
	controller.sort(colName + ' ' + sortDirection)
}
}
