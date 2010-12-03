/**
 *
 * @properties={typeid:24,uuid:"375eadd4-d757-40c9-b2c8-6029d62ef5aa"}
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
 *	MODIFIED :	February 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.DEV_rebuild_navitem(solutionPrefs.config.currentFormID,true)

//fire form loader if form different
var baseForm = solutionPrefs.config.formNameBase
var formName = forms[baseForm].elements.tab_content_C.getTabFormNameAt(1)

if (formName != form_to_load) {
	globals.NAV_workflow_load(id_navigation_item,null)
}



}

/**
 *
 * @properties={typeid:24,uuid:"80e45fb6-2181-4a9c-b50a-1523f7dbc55e"}
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
	return controller.search()
}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"92c0a544-c4f1-4003-ab6c-8d554ff2561f"}
 */
function TAB_change(event)
{
	
/*
 *	TITLE    :	TAB_change
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	change tabIndex and all associated labels
 *			  		-finds the colors of a selected/unselected tab and then goes to work
 *			  	activates action buttons for log and detail tab panels 
 *			  	
 *	INPUT    :	ALL inputs are optional
 *			  	1)	form name with tab panel
 *			  	2)	tab to be activated eg. 'tab_d1'
 *			  	3)	name of tab panel
 *			  	4)	prefix on all tab labels
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	tab panel named 'tab_detail', labels named 'tab_d'+[1,2,...n]
 *			  	
 *	MODIFIED :	March 23, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
var buttonName = (arguments[1]) ? arguments[1] : application.getMethodTriggerElementName()
var tabPanelName = (arguments[2]) ? arguments[2] : 'tab_detail'
var prefix = (arguments[3]) ? arguments[3] : 'tab_d'

//get number of tabs
var tabTotal = forms[formName].elements[tabPanelName].getMaxTabIndex()

//get current tab
var currentTab = forms[formName].elements[tabPanelName].tabIndex

//get foreground/background color
var foreSelect = forms[formName].elements[prefix + currentTab].fgcolor
var backSelect = forms[formName].elements[prefix + currentTab].bgcolor
//if not tab 1, get from itself and previous
if (currentTab > 1) {
	var foreUnselect = forms[formName].elements[prefix + (currentTab - 1)].fgcolor
	var backUnselect = forms[formName].elements[prefix + (currentTab - 1)].bgcolor
}
//if not last tab, get from itself and next
else if (currentTab < tabTotal) {
	var foreUnselect = forms[formName].elements[prefix + (currentTab + 1)].fgcolor
	var backUnselect = forms[formName].elements[prefix + (currentTab + 1)].bgcolor
}
//only one tab, do not need unselected values
else if (currentTab == tabTotal && currentTab == 1) {
	var foreUnselect = forms[formName].elements[prefix + currentTab].fgcolor
	var backUnselect = forms[formName].elements[prefix + currentTab].bgcolor
}
//break out of method, something is not set up correctly
else {
	return
}

//get font string (font,normal/bold/italic/bolditalic,size)
if (application.__parent__.solutionPrefs) {
	//on a mac
	if (solutionPrefs.clientInfo.typeOS == 'Mac OS X') {
		var fontSelect = 'TrebuchetMS,1,13'
		var fontUnselect = 'TrebuchetMS,0,13'
	}
	//on windows, linux, etc.
	else {
		var fontSelect = 'Trebuchet MS,1,13'
		var fontUnselect = 'Trebuchet MS,0,13'	
	}
}
//use mac settings when not running in the shell //TODO: change to windows settings when deployed
else {
	var fontSelect = 'Trebuchet MS,1,13'
	var fontUnselect = 'Trebuchet MS,0,13'	
}



//activate correct tab and flip tab buttons
for ( var i = 1 ; i <= tabTotal ; i++ ) {	
	var tabName = prefix + i
	if (buttonName == tabName) {
		forms[formName].elements[tabName].fgcolor = foreSelect
		forms[formName].elements[tabName].bgcolor = backSelect
		forms[formName].elements[tabName].setFont(fontSelect)
		
		//set tab index
		forms[formName].elements[tabPanelName].tabIndex = i
		
	}
	else {
		forms[formName].elements[tabName].fgcolor = foreUnselect
		forms[formName].elements[tabName].bgcolor = backUnselect
		forms[formName].elements[tabName].setFont(fontUnselect)
	}				
}



}
