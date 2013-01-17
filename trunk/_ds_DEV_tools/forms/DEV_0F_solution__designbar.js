/**
 *
 * @properties={typeid:24,uuid:"7e08d144-7f0c-4f00-badf-7c70b504a5fb"}
 */
function CHECK_mode()
{

/*
 *	TITLE    :	CHECK_mode
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	checks to see if already in mode requested to navigate to
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	true if already in mode navigated to
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CHECK_mode()
 *			  	
 *	MODIFIED :	February 22, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: make it work with non-navigation modes

switch (globals.DEV_designbar_engine) {
	case 'Navigation':
		var mode = solutionPrefs.design.currentMode == 'navigation'
		break
	case 'Universal lists':
		var mode = solutionPrefs.design.currentMode == 'universallist'
		break
	case 'Fast find':
		var mode = solutionPrefs.design.currentMode == 'fastfind'
		break
	case 'Buttons':
		switch (globals.DEV_designbar_engine_button) {
			case 'Add':
				var mode = solutionPrefs.design.currentMode == 'buttonadd'
				break
			case 'Actions':
				var mode = solutionPrefs.design.currentMode == 'buttonaction'
				break
			case 'Reports':
				var mode = solutionPrefs.design.currentMode == 'buttonreport'
				break
		}
		break
}

/*
//if not in navigation mode, try all the others
if (typeof mode != 'boolean') {
	switch (solutionPrefs.design.currentMode) {
		case 'navigation':
			var mode = solutionPrefs.design.modes.navigation
			break
		case 'universallist':
			var mode = solutionPrefs.design.modes.universallist
			break
		case 'fastfind':
			var mode = solutionPrefs.design.modes.fastfind
			break
		case 'buttonadd':
			var mode = solutionPrefs.design.modes.buttonadd
			break
		case 'buttonaction':
			var mode = solutionPrefs.design.modes.buttonaction
			break
		case 'buttonreport':
			var mode = solutionPrefs.design.modes.buttonreport
			break
		case 'spec':
			var mode = solutionPrefs.design.modes.spec
			break
		case 'task':
			var mode = solutionPrefs.design.modes.task
			break
		case 'help':
			var mode = solutionPrefs.design.modes.help
			break
	}
}
*/

//are we in the mode we're going to?
return mode


}

/**
 *
 * @properties={typeid:24,uuid:"64cdc349-057f-4965-a490-15d9e080e25a"}
 */
function DO_highlight()
{

/*
 *	TITLE    :	DO_highlight
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	highlight on the item clicked
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	DO_highlight()
 *			  	
 *	MODIFIED :	December 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var elem = arguments[0]

if (elements[elem]) {
	elements.highlighter.setLocation(elements[elem].getLocationX() - 3,elements[elem].getLocationY() - 3)
	elements.highlighter.setSize(elements[elem].getWidth() + 6,elements[elem].getHeight())
	
	elements.highlighter.visible = true
}
else {
	elements.highlighter.visible = false
}

}

/**
 *
 * @properties={typeid:24,uuid:"0d1fbb86-68f8-4628-b8a2-2e7c874f76cc"}
 */
function EXIT_design_mode()
{

/*
 *	TITLE    :	EXIT_design_mode
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	exit design mode
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	EXIT_design_mode()
 *			  	
 *	MODIFIED :	December 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

solutionPrefs.design.statusDesign = false

globals.DEV_mode_toggle()

}

/**
 *
 * @properties={typeid:24,uuid:"ee1023bc-67a6-4ccb-b691-673b273d61cf"}
 */
function FORM_on_show()
{

DO_highlight()
}

/**
 *
 * @properties={typeid:24,uuid:"7e570e34-7fce-4c8b-9540-92e61d174c59"}
 */
function MODE_button_action_toggle()
{

/*
 *	TITLE    :	MODE_button_action_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle quick button action
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_button_action_toggle()
 *			  	
 *	MODIFIED :	February 25, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var activate = arguments[0]

//enter this mode
globals.DEV_quick_buttons('buttonaction',activate)

//show buttons for this mode
UPDATE_display('buttonaction','lbl_engine','Actions')



}

/**
 *
 * @properties={typeid:24,uuid:"7d364d16-7fb0-4e91-9c11-b97c1c962071"}
 */
function MODE_button_add_toggle()
{

/*
 *	TITLE    :	MODE_button_add_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle quick fw button add mode
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_button_add_toggle()
 *			  	
 *	MODIFIED :	December 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var activate = arguments[0]

//enter this mode
globals.DEV_quick_buttons('buttonadd',activate)

//show buttons for this mode
UPDATE_display('buttonadd','lbl_engine','Add')


}

/**
 *
 * @properties={typeid:24,uuid:"aea892e3-735c-49d9-8c81-b172a4cc1c7d"}
 */
function MODE_button_report_toggle()
{

/*
 *	TITLE    :	MODE_button_action_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle quick button action
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_button_action_toggle()
 *			  	
 *	MODIFIED :	February 25, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var activate = arguments[0]

//enter this mode
globals.DEV_quick_buttons('buttonreport',activate)

//show buttons for this mode
UPDATE_display('buttonreport','lbl_engine','Reports')



}

/**
 *
 * @properties={typeid:24,uuid:"ad8391e7-fae8-49cb-acb6-130c53b3c644"}
 */
function MODE_engine()
{

/*
 *	TITLE    :	MODE_engine
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	change between all navigation stuff
 *			  		- pop-down will show if an area has not been selected
 *			  		- pop-down will show if shift-key pressed
 *			  		- if coming from a non-navigation design area, will be returned to last used nav area without pop-down menu
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_engine()
 *			  	
 *	MODIFIED :	December 14, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//toggle to the last selected area if...
	//1- a navigation area selected
	//2- not currently in that area
	//3- shift key not held
if (globals.DEV_designbar_engine && !CHECK_mode() && !globals.CODE_key_pressed('shift')) {
	switch (globals.DEV_designbar_engine) {
		case 'Navigation':
			MODE_navigation_toggle()
			break
		case 'Universal lists':
			MODE_universallist_toggle()
			break
		case 'Fast find':
			MODE_fastfind_toggle()
			break
		case 'Buttons':
			switch (globals.DEV_designbar_engine_button) {
				case 'Add':
					MODE_button_add_toggle()
					break
				case 'Actions':
					MODE_button_action_toggle()
					break
				case 'Reports':
					MODE_button_report_toggle()
					break
			}
			break
	}
}
//show pop-up to choose which area of the engine
else {
	//values
	var valueList = ['Navigation','Universal lists','Fast find','Buttons']
	var vlButtons = ['Add','Actions','Reports']
	
	//build BUTTONS menu
	var buttons = new Array()
	for ( var i = 0 ; i < vlButtons.length ; i++ ) {
		//item selected, create checkbox
		if (globals.DEV_designbar_engine_button == vlButtons[i]) {
			buttons[i] = plugins.popupmenu.createCheckboxMenuItem(vlButtons[i] + "", MODE_engine_control)
			buttons[i].setSelected(true)
		}
		else {
			buttons[i] = plugins.popupmenu.createMenuItem(vlButtons[i] + "", MODE_engine_control)
		}
		
		//pass arguments
	    buttons[i].setMethodArguments('button_' + (i + 1))
		
		//disable dividers
		if (vlButtons[i] == '-') {
			buttons[i].setEnabled(false)
		}
	}
	
	//build menu
	var menu = new Array()
	for ( var i = 0 ; i < valueList.length ; i++ ) {
		//button menu
		if (valueList[i] == 'Buttons') {
			menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", buttons)
		}
		//item selected, create checkbox
		else if (globals.DEV_designbar_engine == valueList[i]) {
			menu[i] = plugins.popupmenu.createCheckboxMenuItem(valueList[i] + "", MODE_engine_control)
			menu[i].setSelected(true)
		}
		else {
			menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", MODE_engine_control)
		}
		
		//pass arguments
	    menu[i].setMethodArguments(i + 1)
		
		//disable dividers
		if (valueList[i] == '-') {
			menu[i].setEnabled(false)
		}
	}
	
	//popdown popup menu
	var elem = elements.lbl_engine
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menu)
	}
}
	

}

/**
 *
 * @properties={typeid:24,uuid:"47b24eb6-04ea-4509-9a29-582a5155d7c5"}
 */
function MODE_engine_control()
{

/*
 *	TITLE    :	MODE_engine_control
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	change between all engine stuff
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_engine_control()
 *			  	
 *	MODIFIED :	December 14, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var input = arguments[0]
var forceShow = arguments[1]

switch (input) {
	case 1:	//navigation
		MODE_navigation_toggle(forceShow)
		
		if (solutionPrefs.design.modes.navigation) {
			globals.DEV_designbar_engine = 'Navigation'
			globals.DEV_designbar_engine_button = null
			elements.lbl_earmark.text = 'NAV'
		}
		else {
			globals.DEV_designbar_engine = null
			globals.DEV_designbar_engine_button = null
			elements.lbl_earmark.text = ''
		}
		
		break
	case 2:	//universal list
		MODE_universallist_toggle(forceShow)
		
		if (solutionPrefs.design.modes.universallist) {
			globals.DEV_designbar_engine = 'Universal lists'
			globals.DEV_designbar_engine_button = null
			elements.lbl_earmark.text = 'UL'
		}
		else {
			globals.DEV_designbar_engine = null
			globals.DEV_designbar_engine_button = null
			elements.lbl_earmark.text = ''
		}
		
		break
	case 3:	//fast find
		MODE_fastfind_toggle(forceShow)
		
		if (solutionPrefs.design.modes.fastfind) {
			globals.DEV_designbar_engine = 'Fast find'
			globals.DEV_designbar_engine_button = null
			elements.lbl_earmark.text = 'FF'
		}
		else {
			globals.DEV_designbar_engine = null
			globals.DEV_designbar_engine_button = null
			elements.lbl_earmark.text = ''
		}
		
		break
	case 'button_1':	//add
		MODE_button_add_toggle(forceShow)
		
		if (solutionPrefs.design.modes.buttonadd) {
			globals.DEV_designbar_engine = 'Buttons'
			globals.DEV_designbar_engine_button = 'Add'
			elements.lbl_earmark.text = 'ADD'
		}
		else {
			globals.DEV_designbar_engine = null
			globals.DEV_designbar_engine_button = null
			elements.lbl_earmark.text = ''
		}
		
		break
	case 'button_2':	//actions
		MODE_button_action_toggle(forceShow)
		
		if (solutionPrefs.design.modes.buttonaction) {
			globals.DEV_designbar_engine = 'Buttons'
			globals.DEV_designbar_engine_button = 'Actions'
			elements.lbl_earmark.text = 'ACT'
		}
		else {
			globals.DEV_designbar_engine = null
			globals.DEV_designbar_engine_button = null
			elements.lbl_earmark.text = ''
		}
		break
	case 'button_3':	//reports
		MODE_button_report_toggle(forceShow)
		
		if (solutionPrefs.design.modes.buttonreport) {
			globals.DEV_designbar_engine = 'Buttons'
			globals.DEV_designbar_engine_button = 'Reports'
			elements.lbl_earmark.text = 'RPT'
		}
		else {
			globals.DEV_designbar_engine = null
			globals.DEV_designbar_engine_button = null
			elements.lbl_earmark.text = ''
		}
		break
}

}

/**
 *
 * @properties={typeid:24,uuid:"5ff87522-aac8-4c12-9e6f-278113192198"}
 */
function MODE_fastfind_toggle()
{

/*
 *	TITLE    :	MODE_fastfind_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle quick ul mode
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_fastfind_toggle()
 *			  	
 *	MODIFIED :	December 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var activate = arguments[0]

//enter this mode
globals.DEV_quick_buttons('fastfind',activate)

//show buttons for this mode
UPDATE_display('fastfind','lbl_engine','Find')



}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"39a2b990-7229-46b0-90fd-8430db7534d9"}
 */
function MODE_help_toggle(event)
{
	
/*
 *	TITLE    :	MODE_help_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle mode -- help
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_help_toggle()
 *			  	
 *	MODIFIED :	December 11, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
var activate = arguments[0]

//enter this mode
globals.DEV_quick_buttons('help',activate)

//show buttons for this mode
UPDATE_display('help','lbl_help','Help')


}

/**
 *
 * @properties={typeid:24,uuid:"50b87cda-f979-4763-ab3d-e626eb8a645e"}
 */
function MODE_navigation_toggle()
{

/*
 *	TITLE    :	MODE_navigation_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle quick fw engine mode
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_navigation_toggle()
 *			  	
 *	MODIFIED :	December 11, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var activate = arguments[0]

//enter this mode
globals.DEV_quick_buttons('navigation',activate)

//show buttons for this mode
UPDATE_display('navigation','lbl_engine','Navigation')


}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"515955bf-d64b-47fb-b6e7-19ac2bcd40c6"}
 */
function MODE_prototyper_toggle(event)
{
	
/*
 *	TITLE    :	MODE_prototyper_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle mode -- help
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_prototyper_toggle()
 *			  	
 *	MODIFIED :	December 11, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
var activate = arguments[0]

//enter this mode
globals.DEV_quick_buttons('prototyper',activate)

//show buttons for this mode
UPDATE_display('prototyper','lbl_proto','Proto')



}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"79fe2b32-f107-4a10-acfd-5edb7925e75a"}
 */
function MODE_spec_toggle(event)
{
	
/*
 *	TITLE    :	MODE_spec_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle mode -- help
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_spec_toggle()
 *			  	
 *	MODIFIED :	December 11, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
var activate = arguments[0]

//enter this mode
globals.DEV_quick_buttons('spec',activate)

//show buttons for this mode
UPDATE_display('spec','lbl_specs','Specs')




}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"0a7fa3b4-6d1e-4685-9fed-44ce81274ccb"}
 */
function MODE_task_toggle(event)
{
	
/*
 *	TITLE    :	MODE_task_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle mode -- help
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_task_toggle()
 *			  	
 *	MODIFIED :	February 25, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
var activate = arguments[0]

//enter this mode
globals.DEV_quick_buttons('task',activate)

//show buttons for this mode
UPDATE_display('task','lbl_task','Tasks')



}

/**
 *
 * @properties={typeid:24,uuid:"298b5d6d-3fd3-4815-9775-6701131fbaed"}
 */
function MODE_universallist_toggle()
{

/*
 *	TITLE    :	MODE_universallist_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	toggle quick ul mode
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_universallist_toggle()
 *			  	
 *	MODIFIED :	February 25, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var activate = arguments[0]

//enter this mode
globals.DEV_quick_buttons('universallist',activate)

//show buttons for this mode
UPDATE_display('universallist','lbl_engine','UL')

}

/**
 *
 * @properties={typeid:24,uuid:"ef6c2b36-c424-4b72-b3e0-eece6716d91b"}
 */
function TAB_change()
{

/*
 *	TITLE    :	TAB_change
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	set tab for correct mode
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	TAB_change()
 *			  	
 *	MODIFIED :	December 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var mode = arguments[0]

for (var i = 1; i <= elements.tab_action.getMaxTabIndex() && !found; i++) {
	if (elements.tab_action.getTabTextAt(i) == mode) {
		var found = i
	}
}

if (found) {
	elements.tab_action.tabIndex = found
}
else {
	elements.tab_action.tabIndex = 1
}
}

/**
 *
 * @properties={typeid:24,uuid:"c2c4de53-c64c-4a3d-af77-44694e2baa1b"}
 */
function UPDATE_display()
{

/*
 *	TITLE    :	UPDATE_display
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	set highlighter and correct tab for the design bar item clicked
 *			  	
 *	INPUT    :	1- name of mode to check
 *			  	2- name of label to highlight
 *			  	3- name of tab to change to
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	UPDATE_display(modeName, labelName, tabName) Draw display so that correct tab shown and highlighted
 *			  	
 *	MODIFIED :	February 25, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var modeName = arguments[0]
var labelName = arguments[1]
var tabName = arguments[2]

var prefTab = 'TOOL_design_mode'

if (solutionPrefs.design.modes[modeName]) {
	//highlight the tab
	DO_highlight(labelName)
	
	//change to the spec buttons
	TAB_change(tabName)
	
	//update toolbar
	forms[prefTab].elements.lbl_title.text = tabName + ' mode'
//	forms[prefTab].elements.lbl_tag.text = null
}
else {
	//unhighlight the tab
	DO_highlight('')
	
	//change to default buttons
	TAB_change()
	
	//update toolbar
	forms[prefTab].elements.lbl_title.text = 'Design mode'
//	forms[prefTab].elements.lbl_tag.text = null
}


}
