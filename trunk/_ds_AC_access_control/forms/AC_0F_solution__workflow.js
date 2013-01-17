/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"478900CF-C394-4B2A-B9EE-7FE1EF778582"}
 */
function TAB_change(event)
{
	
/*
 *	TITLE    :	TAB_change
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	fancy tab panel method
 *			  	
 *	INPUT    :	name of element 'clicked'
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	element labeled ==> tab_navigation (tab panel), tab_# (graphic), tab_lbl_# (label)
 *			  	
 *	MODIFIED :	Aug 29, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

//set formname
var formName = application.getMethodTriggerFormName()

//set the tab panel name
var tabPanelName = 'tab_saas'

//set prefix for element
var prefix = 'tab_'

//get button that called
if (arguments[0]) {
	var btnClicked = prefix + arguments[0]
}
else {
	var btnClicked = application.getMethodTriggerElementName()
}

//get number of tabs
var tab_num = forms[formName].elements[tabPanelName].getMaxTabIndex()

var orig = btnClicked.split("_")
orig = utils.stringToNumber(orig[1])

var max = 1

var j = ""
var x = ""


//1. process unclicked buttons

for ( var i = 1; i <= max ; i++ ) {

	//figure out what graphic to load
	if ( i == 1 ) {
		switch (orig) {
			case (i) :
				x = 1
				break
			case (i + 1) :
				x = 2
				break
			default :
				x = 3
				break
		}
		j = 1
	}
	
	else if ( (i > 1) && (i < max) ) {
		switch (orig) {
			case (i) :
				x = 1
				break
			case (i - 1) :
				x = 2
				break
			case (i + 1) :
				x = 3
				break
			default :
				x = 4
				break
		}
		j = 2
	}
	
	else if ( i = max ) {
		switch (orig) {
			case (i) :
				x = 1
				break
			case (i - 1) :
				x = 2
				break
			default :
				x = 3
				break
		}
		j = 3
	}
	
	//set image URL
	elements["tab_" + i].setImageURL('media:///tab_' + j + '_' + x + '.gif')
	
	//activate correct tab and set label foreground color
	if ( i == orig ) {
		elements["tab_lbl_" + i].fgcolor = '#333333'
		
		//set tab index
		forms[formName].elements[tabPanelName].tabIndex = i;	
	}
	else {
		elements["tab_lbl_" + i].fgcolor = '#ffffff'
	}
}
}

/**
 * Update registry actions
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"59BAA793-4171-4C9F-9737-67B7A226A477"}
 * @AllowToRunInFind
 */
function REGISTRY_update(event) {
	//fs for actions registry
	/** @type {JSFoundSet<db:/sutra/sutra_access_action>} */
	var fsRegistry = databaseManager.getFoundSet('db:/sutra/sutra_access_action')
	var recRegistry
	
	
	//loop over all scopes to get all identifiers
	var allIDs = new Array()
	for (var i in scopes) {
		if (i != 'globals') {
			allIDs.push(i)
		}
	}
	//check all scopes for init method
	for (var h = 0; h < allIDs.length; h++) {
		var id = allIDs[h]
		var myApp = null
		
		//check in named scope
		if (scopes[id] && scopes[id].init && scopes[id].init.items instanceof Array && scopes[id].init.name) {
			myApp = scopes[id].init
		}
		//check in global scope
		else if (globals[id] && globals[id].init && globals[id].init.items instanceof Array && globals[id].init.name) {
			myApp = globals[id].init
		}
		
		//there is an app and it has length
		if (myApp && myApp.items.length) {
			//flag that need to reload records
			var refresh = true
			
			/**
		  	 * @type {Object[]}
			 */
			var registryItems = myApp.items
			
			for (var i = 0; i < registryItems.length; i++) {
				/**
				 * @type {{name: String, registry: String, description: String, uuid: UUID}}
				 */
				var registryItem = registryItems[i]
				
				fsRegistry.find()
				//TODO: flip around to uuids
				fsRegistry.action_id = registryItem.registry
				var results = fsRegistry.search()
				
				//we have a registry already, smart update
				if (results == 1) {
					recRegistry = fsRegistry.getSelectedRecord()
				}
				//create a new one
				else {
					recRegistry = fsRegistry.getRecord(fsRegistry.newRecord())
				}
				
				//punch in new data points
				recRegistry.action_name = registryItem.name
				recRegistry.action_id = registryItem.registry
				recRegistry.action_uuid = registryItem.uuid
				recRegistry.description = registryItem.description
				
				databaseManager.saveData(recRegistry)
			}
		}
	}
	
	//clear out filters and load all records
	if (refresh) {
		forms.AC_0F_solution__workflow_1F_action_2L__filter.FILTER_clear()
		forms.AC_0F_solution__workflow_1F_action_2L.controller.sort('action_id asc')
	}
}
