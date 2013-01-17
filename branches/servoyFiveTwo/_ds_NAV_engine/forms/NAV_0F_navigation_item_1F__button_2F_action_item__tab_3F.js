/**
 *
 * @properties={typeid:24,uuid:"bbad5519-062f-4c45-aa6b-de14f40f3356"}
 */
function FILTER_forms()
{

if (application.__parent__.solutionPrefs) {
	databaseManager.saveData()
	
	if (utils.hasRecords(foundset)) {
		//only run when using query based way to hit repository
		if (!solutionPrefs.repository.api && solutionPrefs.repository.allForms) {
			//load formNames for selected module
			var moduleForms = solutionPrefs.repository.allForms[module_filter]
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
	//only show error message if trying to change a module with no record
	else if (arguments[2]) {
		plugins.dialogs.showErrorDialog(
						'Tab error',
						'You must create a record before you can choose a module'
					)
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"08d02d12-43f3-4dd1-9e05-1d32a2e0b578"}
 */
function REC_on_select()
{

FILTER_forms()

}
