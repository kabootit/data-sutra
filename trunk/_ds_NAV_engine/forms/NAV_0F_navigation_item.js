/**
 *
 * @properties={typeid:24,uuid:"70a66bf1-d7cf-47be-b6a7-14d02017bc96"}
 */
function FORM_on_hide()
{

/*
 *	TITLE    :	FORM_on_hide
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	sets information for find tab
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	July 25, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */


if (application.__parent__.solutionPrefs) {
	solutionPrefs.config.prefs.frameworksEngine = application.getServerTimeStamp()
}
}

/**
 *
 * @properties={typeid:24,uuid:"f3928a37-b2f9-4309-bae1-cdb0f72afb02"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	sets information for find tab
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */ //TODO: only active release of relations


//turn busy on
plugins.sutra.busyCursor = true

//show/hide config type
if (nav_navigation_item_to_navigation && nav_navigation_item_to_navigation.flag_config) {
	forms.NAV_0F_navigation_item_1F__detail.elements.lbl_registry.text = 'Config type'
	forms.NAV_0F_navigation_item_1F__detail.elements.fld_config_type.visible = true
	forms.NAV_0F_navigation_item_1F__detail.elements.fld_item_id.visible = false
}
else {
	forms.NAV_0F_navigation_item_1F__detail.elements.lbl_registry.text = 'Registry'
	forms.NAV_0F_navigation_item_1F__detail.elements.fld_config_type.visible = false
	forms.NAV_0F_navigation_item_1F__detail.elements.fld_item_id.visible = true
}

//make sure table name on file is correct still and get serverName
if (form_to_load && forms[form_to_load]) {
	var tableName = form_to_load_table = forms[form_to_load].controller.getTableName()
	var serverName = forms[form_to_load].controller.getServerName()
}
//user table name on file
else {
	var tableName = form_to_load_table
	var serverName = 'NONE'
}

//get all relations for this server/table combo in 4.1 developer
if (tableName && serverName != 'NONE' && 
	application.__parent__.solutionPrefs && 
	solutionPrefs.clientInfo.typeServoy == 'developer' && utils.stringToNumber(solutionPrefs.clientInfo.verServoy) >= 4 && 
	solutionPrefs.repository.relations && 
	solutionPrefs.repository.relations[serverName] && solutionPrefs.repository.relations[serverName][tableName]) {
	
	var relations = new Array()
	
	for (var i in solutionPrefs.repository.relations[serverName][tableName]) {
		relations.push(i)
	}
	
}
//get all relations for this server/table combo in 3.5 developer or client any version 
else if (tableName && serverName != 'NONE' && 
	application.__parent__.solutionPrefs && 
	!solutionPrefs.repository.api && 
	solutionPrefs.repository.relations && 
	solutionPrefs.repository.relations[serverName] && solutionPrefs.repository.relations[serverName][tableName]) {
	
	var relations = new Array()
	
	for (var i in solutionPrefs.repository.relations[serverName][tableName]) {
		relations.push(i)
	}
	
}
//error, set relations to be empty
else {
	var relations = new Array()
}

//set valuelist with relation values
var divider = (relations.length) ? true : false

var columnFilter = relations
columnFilter.sort()

if (divider) {
	columnFilter.unshift(tableName,'----')
}
else {
	columnFilter.unshift(tableName)
}

//get methods for current form, ----, globals
var formMethods = (form_to_load && forms[form_to_load]) ? forms[form_to_load].allmethods : new Array()
var globalMethods = globals.allmethods

for (var i = 0; i < globalMethods.length; i++) {
	globalMethods[i] = 'globals.'+globalMethods[i]
}

var shownMethods = formMethods
//shownMethods.unshift(null)

//show/hide divider
if (formMethods.length && globalMethods.length) {
	shownMethods.push('----')
}
if (globalMethods.length) {
	if (shownMethods.length) {
		shownMethods = new Array().concat(shownMethods,globalMethods)
	}
	else {
		shownMethods = globalMethods
	}
}
application.setValueListItems('NAV_filter_method_name', shownMethods)
application.setValueListItems('NAV_space_methods', shownMethods)



//set find valuelist and default global
application.setValueListItems('NAV_find_relation', columnFilter)
globals.NAV_find_relation = tableName
//trigger method to load in the correct values
forms.NAV_0F_navigation_item_1F_column__fastfind.FILTER_find_fields()

//get all configured finds; set up valuelist for default when nothing checked on the ff field
forms.NAV_0F_navigation_item_1F_column__fastfind_2L__left.SET_find_valuelist()

//set UL setup valuelist and default global
application.setValueListItems('NAV_column_relation', columnFilter)
globals.NAV_column_relation = tableName
//trigger method to load in the correct values
forms.NAV_0F_navigation_item_1F__universal_lists_2F_list_display__right.FILTER_find_fields()

//set filter valuelist
application.setValueListItems('NAV_filter_relation', columnFilter)
//load no records into filter list form
forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L_action_item_filter__custom.controller.find()
forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L_action_item_filter__custom.id_action_item_filter = 0
forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L_action_item_filter__custom.controller.search()
//if records, fire on select
if (nav_navigation_item_to_action_item__filter && nav_navigation_item_to_action_item__filter.nav_action_item_to_action_item__main) {
	forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L.REC_on_select()
}
//disallow entry into filter specs
else {
	forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L_action_item_filter__custom.TOGGLE_readonly(true)
}

//turn busy off
plugins.sutra.busyCursor = false



}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"75e20b90-4a43-4e41-9c68-7edc3d90fecb"}
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
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

//turn busy on
plugins.sutra.busyCursor = true

//set formname
var formName = 'NAV_0F_navigation_item'

//set the tab panel name
var tabPanelName = 'tab_navigation'

//set prefix for element
var prefix = 'tab_'

//get button that called
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
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

var max = 6

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

//turn busy off
plugins.sutra.busyCursor = false
}

/**
 *
 * @properties={typeid:24,uuid:"abc094f3-d623-49f6-b52e-8cff399c1989"}
 */
function UTIL_update_columns()
{
/*
	update all column records with new data structure
	
	NOTE: only run one time, BEFORE you start adding in new stuff
	this method was required the week of RC4
*/

//hit all navigation_item records
for (var i = 1 ; i <= foundset.getSize() ; i++) {
	controller.setSelectedIndex(i)
	//loop through all columns
	for (var j = 1 ; j <= nav_navigation_item_to_column.getSize() ; j++) {
		var record = nav_navigation_item_to_column.getRecord(j)
		record.table_or_relation = form_to_load_table
	}
}
}
