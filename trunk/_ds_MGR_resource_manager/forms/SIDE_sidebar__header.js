/**
 *
 * @properties={typeid:24,uuid:"FD157E89-EAC8-4CD5-8746-11EAB3328BB9"}
 */
function ACTION_collapse()
{

if (application.__parent__.solutionPrefs) {
	//in flexible spaces
	var flexOn = solutionPrefs.config.flexibleSpace
	
	if (flexOn) {
		globals.SPACE_flexible(null,true)
	}
	
	globals.SIDEBAR_toggle(false)
	
	if (flexOn) {
		globals.SPACE_flexible(null,true)
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"FDF77439-B539-4614-966C-19ADDA1ADE51"}
 */
function ACTION_popin()
{


globals.TOOL_popout(false)
}

/**
 *
 * @properties={typeid:24,uuid:"663CCD5F-6F67-43DB-8E1F-641D7C0C9BF4"}
 */
function ACTION_popout()
{


globals.TOOL_popout(true)
}

/**
 * @properties={typeid:24,uuid:"A648DC0B-F5FE-437F-9B43-FB2C112A6AD6"}
 */
function ACTIONS_popdown(event)
{
	var sideForm = forms.SIDE_sidebar.elements.tab_content.getTabFormNameAt(forms.SIDE_sidebar.elements.tab_content.tabIndex)

	if (forms[sideForm] && forms[sideForm].ACTIONS_list) {
		forms[sideForm].ACTIONS_list(event)
	}
}

/**
 *
 * @properties={typeid:24,uuid:"9F03A500-2FD5-4D7E-AE2F-AF28C56BA789"}
 */
function BUTTONS_toggle()
{

/*
 *	TITLE    :	BUTTONS_toggle
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	toggle which buttons are showing
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	BUTTONS_toggle()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//what form are we operating on?
if (forms.SIDE_sidebar.elements.tab_content.tabIndex) {
	var tabForm = forms.SIDE_sidebar.elements.tab_content.getTabFormNameAt(forms.SIDE_sidebar.elements.tab_content.tabIndex)

	var sideBar = solutionPrefs.panel.sidebar[forms.SIDE_sidebar.elements.tab_content.tabIndex - 2]
}

//color and gradient options
if (sideBar) {
	//do the color
	if (sideBar.gradientColor) {
		forms.SIDE_sidebar.elements.lbl_color.bgcolor = sideBar.gradientColor
		forms.SIDE_sidebar.elements.lbl_color.visible = true
	}
	else {
		forms.SIDE_sidebar.elements.lbl_color.visible = false
	}
	
	//do the gradient
	forms.SIDE_sidebar.elements.gfx_gradient.visible = sideBar.gradient
}

//toggle add record button
if (tabForm && forms[tabForm] && forms[tabForm].REC_new) {
	elements.btn_add.visible = true
}
else {
	elements.btn_add.visible = false
}

//toggle delete record button
if (tabForm && forms[tabForm] && forms[tabForm].REC_delete) {
	elements.btn_delete.visible = true
}
else {
	elements.btn_delete.visible = false
}

//toggle actions button
if (tabForm && forms[tabForm] && forms[tabForm].ACTIONS_list) {
	elements.btn_actions.visible = true
}
else {
	elements.btn_actions.visible = false
}

/*
//toggle xxx button
if (tabForm && forms[tabForm] && forms[tabForm].) {
	elements.btn_add.visible = true
}
else {
	elements.btn_add.visible = false
}
*/


}

/**
 *
 * @properties={typeid:24,uuid:"0A3172C9-45C3-439D-A686-082D2A7AA028"}
 */
function FORM_on_load()
{
//elements.btn_popin.visible = false
elements.gfx_flexible.visible = false
}

/**
 * @properties={typeid:24,uuid:"054F6E63-6D72-4DE1-B9DE-309B8E2D7B8B"}
 */
function REC_delete(event)
{
	var sideForm = forms.SIDE_sidebar.elements.tab_content.getTabFormNameAt(forms.SIDE_sidebar.elements.tab_content.tabIndex)

	if (forms[sideForm] && forms[sideForm].REC_delete) {
		forms[sideForm].REC_delete(event)
	}
}

/**
 * @properties={typeid:24,uuid:"41BFB3FA-86FC-4C6F-8C11-BFD3CDBECC78"}
 */
function REC_new(event)
{
	var sideForm = forms.SIDE_sidebar.elements.tab_content.getTabFormNameAt(forms.SIDE_sidebar.elements.tab_content.tabIndex)

	if (forms[sideForm] && forms[sideForm].REC_new) {
		forms[sideForm].REC_new(event)
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"7708E438-7134-4A69-AE90-A33D605A1C50"}
 */
function TAB_popdown(event)
{
	
/*
 *	TITLE    :	TAB_popdown
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	TAB_popdown()
 *			  	
 *	MODIFIED :	September 11, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//running in frameworks and their are sidebars
if (application.__parent__.solutionPrefs && solutionPrefs.panel && solutionPrefs.panel.sidebar && solutionPrefs.panel.sidebar.length) {
	
	var input = arguments[0]
	var baseForm = solutionPrefs.config.formNameBase
	var sideForm = 'SIDE_sidebar'
	var noName = '*Sidebar without name*'
	
	var currentNavItem = solutionPrefs.config.currentFormID
	
	/*
	//help available?
	//TODO: switch away from navigation item based help
	if (navigationPrefs.byNavItemID[currentNavItem] && navigationPrefs.byNavItemID[currentNavItem].navigationItem) {
		var helpForm = navigationPrefs.byNavItemID[currentNavItem].navigationItem.helpFormToLoad
		var helpList = navigationPrefs.byNavItemID[currentNavItem].navigationItem.helpListToLoad
		var helpDesc = navigationPrefs.byNavItemID[currentNavItem].navigationItem.helpDescription
		
		var helpAvailable = helpForm || helpList || helpDesc
	}
	*/	var helpAvailable
	
	//create arrays
	var valueList = new Array()
	var descList = new Array()
	var argList = new Array()
	
	/*
	//help is available
	if (helpAvailable) {
		valueList.push('Help','----')
		descList.push('Inline help guide','')
		argList.push(1,null)
	}
	*/
	
	//punch down all active sidebars
	for (var i = 0; i < solutionPrefs.panel.sidebar.length; i++) {
		valueList.push((solutionPrefs.panel.sidebar[i].tabName) ? solutionPrefs.panel.sidebar[i].tabName : noName)
		descList.push(solutionPrefs.panel.sidebar[i].description)
		argList.push((helpAvailable) ? argList.length : argList.length + 1)
	}
	
	//called to depress menu
	if (typeof input != 'number') {
		//set up menu with arguments
		var menu = new Array()
		
		for ( var i = 0 ; i < valueList.length ; i++ ) {
			
			//create checked menu item
			if (forms[sideForm].elements.tab_content.tabIndex == ((helpAvailable) ? argList[i] : argList[i] + 1)) {
				menu[i] = plugins.popupmenu.createCheckboxMenuItem(valueList[i] + "", TAB_popdown)
				menu[i].setSelected(true)	
			}
			//create a normal menu item
			else {
				menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", TAB_popdown)
			}
			
			//pass arguments (tab number)
			menu[i].setMethodArguments(argList[i])
			
			//set tooltip, if there is one
//			if (descList[i]) {
//				menu[i].setToolTipText(descList[i])
//			}
			
			//disable dividers
			if (valueList[i] == '----') {
				menu[i].setEnabled(false)
			}
		}
		
		//popup
		var elem = elements[application.getMethodTriggerElementName()]
		if (elem != null) {
			plugins.popupmenu.showPopupMenu(elem, menu)
		}
	}
	//menu shown and item chosen
	else {
		if (helpAvailable) {
			var thisSidebar = solutionPrefs.panel.sidebar[input - 2]
			
			var index = input
		}
		else {
			var thisSidebar = solutionPrefs.panel.sidebar[input - 1]
			
			var index = input + 1
		}
		
		//only change if tab different
		if (forms[sideForm].elements.tab_content.tabIndex != index) {
			forms[sideForm].elements.tab_content.tabIndex = index
			
			solutionPrefs.panel.sidebar.selectedTab = index
			
			BUTTONS_toggle()
		}
		
		//help doesn't have a popdown
		if (thisSidebar) {
			//toggle popout button
		//	forms[sideForm + '__header'].elements.btn_popout.visible = (thisSidebar.popDown) ? true : false
			
			//name
			var sideName = thisSidebar.tabName
		}
		else {
			//toggle popout button
		//	forms[sideForm + '__header'].elements.btn_popout.visible = true
			
			//name
			var sideName = 'Help'
			
			solutionPrefs.config.helpMode = true
		}
		
		if (!sideName) {
			var sideName = 'Sidebar'
		}
		
		//set title
		//forms[sideForm + '__header'].elements.lbl_header.text = sideName.toUpperCase()
		
		//show sidebar
		globals.SIDEBAR_toggle(true,null,true)
	}

}





}
