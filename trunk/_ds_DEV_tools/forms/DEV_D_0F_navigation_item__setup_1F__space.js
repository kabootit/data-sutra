/**
 *
 * @properties={typeid:24,uuid:"9a440517-d89c-4cc9-a80e-d9899a79b884"}
 */
function REC_on_select()
{

//get methods for current form, ----, globals
var formMethods = (form_to_load && forms[form_to_load]) ? forms[form_to_load].allmethods : new Array()
var globalMethods = globals.allmethods

for (var i = 0; i < globalMethods.length; i++) {
	globalMethods[i] = 'globals.'+globalMethods[i]
}

var shownMethods = formMethods

//show/hide divider
if (formMethods.length && globalMethods.length) {
	shownMethods.push('-')
}
if (globalMethods.length) {
	if (shownMethods.length) {
		shownMethods = new Array().concat(shownMethods,globalMethods)
	}
	else {
		shownMethods = globalMethods
	}
}

application.setValueListItems('NAV_space_methods', shownMethods)


//set options for spaces
SPACE_options()




}

/**
 *
 * @properties={typeid:24,uuid:"0ad76d0b-ddbf-4637-a4bf-8a21cbbfe5d4"}
 */
function SPACE_options()
{


if (utils.hasRecords(foundset)) {
	if (space_available) {
		var availableSpaces = space_available.split('\n')
	}
	else {
		var availableSpaces = []
	}
	var arrayDisplay = []
	var arrayStored = []
	
	//convert to numbers so they'll sort
	for (var i = 0; i < availableSpaces.length; i++) {
		availableSpaces[i] = utils.stringToNumber(availableSpaces[i])
	}
	
	availableSpaces.sort(globals.CODE_sort_numeric)
	
	var foundInOptions = false
	
	for (var i = 0 ; i < availableSpaces.length ; i++) {
		arrayDisplay[i] = application.getValueListDisplayValue('NAV_space_type',availableSpaces[i])
		arrayStored[i] = availableSpaces[i]
		
		if (space_default == availableSpaces[i]) {
			foundInOptions = true
		}
	}
	
	application.setValueListItems('NAV_space_choice',arrayDisplay,arrayStored)
	
	//clear default if it is no longer an option
	if (!foundInOptions) {
		space_default = null
	}
}
}
