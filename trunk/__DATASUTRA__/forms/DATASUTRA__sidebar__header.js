/**
 *
 * @properties={typeid:24,uuid:"6F34FC2B-7EED-4619-A8E9-D07E78B920AB"}
 */
function ACTION_collapse()
{

if (application.__parent__.solutionPrefs) {
	//in flexible spaces
	var flexOn = solutionPrefs.config.flexibleSpace
	
	if (flexOn) {
		globals.DS_space_flexible(null,true)
	}
	
	globals.DS_sidebar_toggle(false)
	
	if (flexOn) {
		globals.DS_space_flexible(null,true)
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"E1D1E38A-CF0B-4CCC-92D7-CB20DA3E8540"}
 */
function ACTION_popin()
{


globals.DS_toolbar_popout(false)
}

/**
 *
 * @properties={typeid:24,uuid:"A01DE310-60E2-4C6B-9467-14FF5772381A"}
 */
function ACTION_popout()
{


globals.DS_toolbar_popout(true)
}

/**
 * @properties={typeid:24,uuid:"6FE3D5FD-3BBC-4ED2-A894-8CD08B488FA2"}
 */
function ACTIONS_popdown(event)
{
	var sideForm = forms.DATASUTRA__sidebar.elements.tab_content.getTabFormNameAt(forms.DATASUTRA__sidebar.elements.tab_content.tabIndex)

	if (forms[sideForm] && forms[sideForm].ACTIONS_list) {
		forms[sideForm].ACTIONS_list(event)
	}
}

/**
 *
 * @properties={typeid:24,uuid:"094601EE-82AD-4637-9344-09B193F79D45"}
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
if (forms.DATASUTRA__sidebar.elements.tab_content.tabIndex) {
	var tabForm = forms.DATASUTRA__sidebar.elements.tab_content.getTabFormNameAt(forms.DATASUTRA__sidebar.elements.tab_content.tabIndex)

	var sideBar = solutionPrefs.panel.sidebar[forms.DATASUTRA__sidebar.elements.tab_content.tabIndex - 2]
}

//color and gradient options
if (sideBar) {
	//do the color
	if (sideBar.gradientColor) {
		forms.DATASUTRA__sidebar.elements.lbl_color.bgcolor = sideBar.gradientColor
		forms.DATASUTRA__sidebar.elements.lbl_color.visible = true
	}
	else {
		forms.DATASUTRA__sidebar.elements.lbl_color.visible = false
	}
	
	//do the gradient
	forms.DATASUTRA__sidebar.elements.gfx_gradient.visible = sideBar.gradient
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
 * @properties={typeid:24,uuid:"09060AAE-8FDF-4C19-ABF7-C0F76EE807EC"}
 */
function FORM_on_load()
{
//elements.btn_popin.visible = false
elements.gfx_flexible.visible = false
}

/**
 * @properties={typeid:24,uuid:"D6B4D12F-261F-4905-9AF8-B562CD862B9D"}
 */
function REC_delete(event)
{
	var sideForm = forms.DATASUTRA__sidebar.elements.tab_content.getTabFormNameAt(forms.DATASUTRA__sidebar.elements.tab_content.tabIndex)

	if (forms[sideForm] && forms[sideForm].REC_delete) {
		forms[sideForm].REC_delete(event)
	}
}

/**
 * @properties={typeid:24,uuid:"FAA9E8DA-AC22-4EBC-BD99-8307CE76A2C8"}
 */
function REC_new(event)
{
	var sideForm = forms.DATASUTRA__sidebar.elements.tab_content.getTabFormNameAt(forms.DATASUTRA__sidebar.elements.tab_content.tabIndex)

	if (forms[sideForm] && forms[sideForm].REC_new) {
		forms[sideForm].REC_new(event)
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"286DE741-A810-484B-92F5-0CCEE7BB65B9"}
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
	var sideForm = 'DATASUTRA__sidebar'
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
	if (input instanceof JSEvent) {
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
		if (elem != null && menu.length) {
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
		globals.DS_sidebar_toggle(true,null,true)
	}

}





}
