/**
 *
 * @properties={typeid:24,uuid:"c1c626b7-62aa-4d7f-8536-346ae9dd5fd0"}
 */
function GRID_actions()
{

/*
 *	TITLE    :	TAB_actions_list
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	uses ACTIONS_list() from the currently selected tab
 *			  	
 *	INPUT    :	ALL inputs are optional
 *			  	1)	form name with tab panel
 *			  	2)	tab panel name
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	January 5, 2009 -- Troy Elliott, Data Mosaic
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

var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
var tabPanelName = (arguments[1]) ? arguments[1] : 'tab_detail'

//if there is a tabpanel on the selected form
if (forms[formName] && forms[formName].elements[tabPanelName]) {
	var tabFormName = forms[formName].elements[tabPanelName].getTabFormNameAt(forms[formName].elements[tabPanelName].tabIndex)
	
	//if there is a form in this tab position and it has an ACTIONS_list method on it
	if (forms[tabFormName] && forms[tabFormName].ACTIONS_list) {
		var elem = forms[formName].elements[application.getMethodTriggerElementName()]
		
		//pass the actions_list sub method the element that called it
		forms[tabFormName].ACTIONS_list(elem)
	}
}
}

/**
*
* @properties={typeid:24,uuid:"17675F8B-840F-476C-A084-137F035C3D81"}
*/
function GRID_help()
{

/*
*	TITLE    :	TAB_actions_list
*			  	
*	MODULE   :	rsrc_CODE_sutra
*			  	
*	ABOUT    :	uses ACTIONS_list() from the currently selected tab
*			  	
*	INPUT    :	ALL inputs are optional
*			  	1)	form name with tab panel
*			  	2)	tab panel name
*			  	
*	OUTPUT   :	
*			  	
*	REQUIRES :	
*			  	
*	MODIFIED :	October 6, 2008 -- Troy Elliott, Data Mosaic
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

var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
var tabPanelName = (arguments[1]) ? arguments[1] : 'tab_detail'

//if there is a tabpanel on the selected form
if (forms[formName] && forms[formName].elements[tabPanelName]) {
	globals.TRIGGER_tooltip_help_popup(tabPanelName,formName,'btn_help')
}
}

/**
*
* @properties={typeid:24,uuid:"d7d0db6e-a736-4395-a0e3-da757d161a37"}
*/
function GRID_new(formName, tabPanelName)
{

/*
 *	TITLE    :	TAB_actions_list
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	uses ACTIONS_list() from the currently selected tab
 *			  	
 *	INPUT    :	ALL inputs are optional
 *			  	1)	form name with tab panel
 *			  	2)	tab panel name
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	October 6, 2008 -- Troy Elliott, Data Mosaic
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

formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
tabPanelName = (arguments[1]) ? arguments[1] : 'tab_detail'

//if there is a tabpanel on the selected form
if (forms[formName] && forms[formName].elements[tabPanelName]) {
	var tabFormName = forms[formName].elements[tabPanelName].getTabFormNameAt(forms[formName].elements[tabPanelName].tabIndex)
	
	//if there is a form in this tab position and it has an REC_new method on it
	if (forms[tabFormName] && forms[tabFormName].REC_new) {
		var elem = forms[formName].elements[application.getMethodTriggerElementName()]

		//pass the new record method the element that called it
		forms[tabFormName].REC_new(elem)
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"1d11e845-6036-42a2-8367-5c8d524edad3"}
 */
function GRID_change(formName,buttonName,tabPanelName,prefix,btnAdd,btnActions,btnHelp,lblDivider,currentTab)
{

/*
 *	TITLE    :	TAB_change_grid
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	change tabIndex and all associated labels
 *			  		- finds the colors of a selected/unselected tab and then goes to work
 *			  		- if tab controller label has text, but no tooltip, set tooltip with value of text
 *			  	
 *	INPUT    :	ALL inputs are optional
 *			  	1)	form name with tab panel
 *			  	2)	tab to be activated eg. 'tab_d1'
 *			  	3)	name of tab panel
 *			  	4)	prefix on all tab labels
 *			  	5)	btn_add name
 *			  	6)	btn_actions name
 *			  	7)	btn_help name
 *			  	8)	btn_divider name
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	tab panel named 'tab_detail', labels named 'tab_d'+[1,2,...n]
 *			  	
 *	MODIFIED :	August 5, 2009 -- Troy Elliott, Data Mosaic
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

var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
var buttonName = (arguments[1]) ? arguments[1] : application.getMethodTriggerElementName()
var tabPanelName = (arguments[2]) ? arguments[2] : 'tab_detail'
var prefix = (arguments[3]) ? arguments[3] : 'tab_d'
var btnAdd = (arguments[4]) ? arguments[4] : 'btn_add'
var btnActions = (arguments[5]) ? arguments[5] : 'btn_actions'
var btnHelp = (arguments[6]) ? arguments[6] : 'btn_help'
var lblDivider = (arguments[7]) ? arguments[7] : 'lbl_' + tabPanelName + '_divider'
var currentTab = (arguments[8]) ? arguments[8] : forms[formName].elements[tabPanelName].tabIndex

//make sure that element clicked is actually a custom tab controller
if (!utils.stringPatternCount(buttonName,prefix)) {
	return
}

//get number of tabs
var tabTotal = forms[formName].elements[tabPanelName].getMaxTabIndex()

//this tab panel doesn't have any tabs, try to still work
if (!tabTotal) {
	return
}

function webFontAdjust(fontString) {
	if (solutionPrefs.config.webClient) {
		fontString = fontString.split(',')
//		fontString[2] = parseInt(fontString[2]) - 1
		fontString[2] = 10
		return fontString.join(',')
	}
	else {
		return fontString
	}
}

//get foreground/background colors, transparency, and font
var foreSelect = forms[formName].elements[prefix + currentTab].fgcolor
var backSelect = forms[formName].elements[prefix + currentTab].bgcolor
var transparentSelect = forms[formName].elements[prefix + currentTab].transparent
var fontSelect = webFontAdjust(forms[formName].elements[prefix + currentTab].font)
//if not tab 1, get from itself and previous
if (currentTab > 1) {
	var foreUnselect = forms[formName].elements[prefix + (currentTab - 1)].fgcolor
	var backUnselect = forms[formName].elements[prefix + (currentTab - 1)].bgcolor
	var transparentUnselect = forms[formName].elements[prefix + (currentTab - 1)].transparent
	var fontUnselect = webFontAdjust(forms[formName].elements[prefix + (currentTab - 1)].font)
}
//if not last tab, get from itself and next
else if (currentTab < tabTotal) {
	var foreUnselect = forms[formName].elements[prefix + (currentTab + 1)].fgcolor
	var backUnselect = forms[formName].elements[prefix + (currentTab + 1)].bgcolor
	var transparentUnselect = forms[formName].elements[prefix + (currentTab + 1)].transparent
	var fontUnselect = webFontAdjust(forms[formName].elements[prefix + (currentTab + 1)].font)
}
//only one tab, do not need unselected values
else if (currentTab == tabTotal && currentTab == 1) {
	var foreUnselect = forms[formName].elements[prefix + currentTab].fgcolor
	var backUnselect = forms[formName].elements[prefix + currentTab].bgcolor
	var transparentUnselect = forms[formName].elements[prefix + currentTab].transparent
	var fontUnselect = webFontAdjust(forms[formName].elements[prefix + currentTab].font)
}
//break out of method, something is not set up correctly
else {
	return
}

//activate correct tab and flip tab buttons
for ( var i = 1 ; i <= tabTotal ; i++ ) {	
	var tabName = prefix + i
	
	if (tabName == buttonName) {
		forms[formName].elements[tabName].fgcolor = foreSelect
		forms[formName].elements[tabName].bgcolor = backSelect
		forms[formName].elements[tabName].transparent = transparentSelect
		forms[formName].elements[tabName].setFont(fontSelect)
	}
	else {
		forms[formName].elements[tabName].fgcolor = foreUnselect
		forms[formName].elements[tabName].bgcolor = backUnselect
		forms[formName].elements[tabName].transparent = transparentUnselect
		forms[formName].elements[tabName].setFont(fontUnselect)
	}
	
	//set tooltip text if element can take a tooltip, tooltip is not already set, and tab has text
	if (typeof forms[formName].elements[tabName].toolTipText != undefined && 
		!forms[formName].elements[tabName].toolTipText && 
		typeof forms[formName].elements[tabName].text != undefined && 
		forms[formName].elements[tabName].text) {
		
		forms[formName].elements[tabName].toolTipText = forms[formName].elements[tabName].text
	}
}

if (buttonName) {
	//set up quickvars
	i = utils.stringToNumber(buttonName)
	tabName = prefix + i
	
	//set tab index
	forms[formName].elements[tabPanelName].tabIndex = i
	
	//show/hide +, actinon wheel, help buttons
	var tabFormName = forms[formName].elements[tabPanelName].getTabFormNameAt(i)
	if (forms[tabFormName]) {
		//this is an initialized slick grid, update (when first loading a form, don't run)
		if (forms[tabFormName].controller.getDesignTimeProperty('SlickGrid') && solutionModel.getForm(tabFormName).getMethod('SLICK_call') && forms[tabFormName]._gridShown) {
			forms[tabFormName].SLICK_call(false)
		}
		
		var txnEnable = (solutionPrefs.config.webClient && application.__parent__.navigationPrefs && solutionPrefs.config.currentFormID) ? (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].transactions ? true : false) : false
		
		var showAdd = forms[tabFormName].REC_new && (!txnEnable || (txnEnable && (scopes.DS.transaction.getStatus() || forms[tabFormName].TXN_new))) ? true : false
		var showActions = (forms[tabFormName].ACTIONS_list) ? true : false
		var showDivider = showAdd && showActions
		var showHelp = false
		if (application.__parent__.solutionPrefs && solutionPrefs.i18n && solutionPrefs.config.language && solutionPrefs.i18n[solutionPrefs.config.language][tabFormName]) {
			//get the bloody tooltip
			for (var k in solutionPrefs.i18n[solutionPrefs.config.language][tabFormName]) {
				//only get the first help tip
				if (solutionPrefs.i18n[solutionPrefs.config.language][tabFormName][k].help) {
					var helpTip = solutionPrefs.i18n[solutionPrefs.config.language][tabFormName][k].toolTip
					showHelp = true
					break
				}
			}	
		}
		
		if (forms[formName].elements[btnAdd]) {
			forms[formName].elements[btnAdd].visible = showAdd
		}
		if (forms[formName].elements[btnActions]) {
			forms[formName].elements[btnActions].visible = showActions
		}
		if (forms[formName].elements[btnHelp]) {
			forms[formName].elements[btnHelp].visible = showHelp
			
			//showHelp enabled and element can take a tooltip, set tooltip text
			if (showHelp && typeof forms[formName].elements[btnHelp].toolTipText != undefined) {
				forms[formName].elements[btnHelp].toolTipText = helpTip
			}
		}
		if (forms[formName].elements[lblDivider]) {
			forms[formName].elements[lblDivider].visible = showDivider
		}
		
		//css4 parent selectors (for comboboxes)
		scopes.DS.webStyleCSS4()
	}
	
	/*	//TODO: what to do if there is a title header?
	//put line on tab panel if tab's form is in solution and type is table
	var tabFormName = forms[formName].elements[tabPanelName].getTabFormNameAt(i)
	if (forms[tabFormName] && forms[tabFormName].controller.view == 3) {
		forms[formName].elements[tabPanelName].setBorder('MatteBorder,1,0,0,0,#808080')
	}
	//set default border type
	else {
		forms[formName].elements[tabPanelName].setBorder('EmptyBorder,0,0,0,0')
	}
	*/
}

}

/**
 *
 * @properties={typeid:24,uuid:"54fc4dcd-e1b8-441b-8fac-a32764a63b54"}
 */
function GRID_init()
{

/*
 *	TITLE    :	TAB_change_grid_init
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	change tabIndex and all associated labels
 *			  		-finds the colors of a selected/unselected tab and then goes to work
 *			  	
 *	INPUT    :	ALL inputs are optional
 *			  	1)	form name with tab panel
 *			  	2)	tab to be activated eg. 'tab_d1'
 *			  	3)	name of tab panel
 *			  	4)	prefix on all tab labels
 *			  	5)	btn_add name
 *			  	6)	btn_actions name
 *			  	7)	btn_help name
 *			  	8)	btn_divider name
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	October 6, 2008 -- Troy Elliott, Data Mosaic
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

var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
var tabPanelName = (arguments[2]) ? arguments[2] : 'tab_detail'
var prefix = (arguments[3]) ? arguments[3] : 'tab_d'
var buttonName = (arguments[1]) ? arguments[1] : prefix + '1'
var btnAdd = (arguments[4]) ? arguments[4] : 'btn_add'
var btnActions = (arguments[5]) ? arguments[5] : 'btn_actions'
var btnHelp = (arguments[6]) ? arguments[6] : 'btn_help'
var lblDivider = (arguments[7]) ? arguments[7] : 'lbl_' + tabPanelName + '_divider'

if (forms[formName] && forms[formName].elements[tabPanelName]) {
	scopes.TAB.GRID_change(formName,buttonName,tabPanelName,prefix,btnAdd,btnActions,btnHelp,lblDivider)
}
}

/**
 *
 * @properties={typeid:24,uuid:"15b31c9f-f3b0-4efb-ba8f-4f3163c962b2"}
 */
function INLINE_change(formName,buttonName,tabPanelName,prefix)
{

/*
 *	TITLE    :	TAB_change_inline
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
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
 *	MODIFIED :	Dec 6, 2007 -- Troy Elliott, Data Mosaic
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

var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
var buttonName = (arguments[1]) ? arguments[1] : application.getMethodTriggerElementName()
var tabPanelName = (arguments[2]) ? arguments[2] : 'tab_detail'
var prefix = (arguments[3]) ? arguments[3] : 'tab_d'

//get number of tabs
var tabTotal = forms[formName].elements[tabPanelName].getMaxTabIndex()

//get current tab
var currentTab = forms[formName].elements[tabPanelName].tabIndex

//get foreground/background colors, transparency, and font
var foreSelect = forms[formName].elements[prefix + currentTab].fgcolor
var backSelect = forms[formName].elements[prefix + currentTab].bgcolor
var transparentSelect = forms[formName].elements[prefix + currentTab].transparent
var fontSelect = forms[formName].elements[prefix + currentTab].font
//if not tab 1, get from itself and previous
if (currentTab > 1) {
	var foreUnselect = forms[formName].elements[prefix + (currentTab - 1)].fgcolor
	var backUnselect = forms[formName].elements[prefix + (currentTab - 1)].bgcolor
	var transparentUnselect = forms[formName].elements[prefix + (currentTab - 1)].transparent
	var fontUnselect = forms[formName].elements[prefix + (currentTab - 1)].font
}
//if not last tab, get from itself and next
else if (currentTab < tabTotal) {
	var foreUnselect = forms[formName].elements[prefix + (currentTab + 1)].fgcolor
	var backUnselect = forms[formName].elements[prefix + (currentTab + 1)].bgcolor
	var transparentUnselect = forms[formName].elements[prefix + (currentTab + 1)].transparent
	var fontUnselect = forms[formName].elements[prefix + (currentTab + 1)].font
}
//only one tab, do not need unselected values
else if (currentTab == tabTotal && currentTab == 1) {
	var foreUnselect = forms[formName].elements[prefix + currentTab].fgcolor
	var backUnselect = forms[formName].elements[prefix + currentTab].bgcolor
	var transparentUnselect = forms[formName].elements[prefix + currentTab].transparent
	var fontUnselect = forms[formName].elements[prefix + currentTab].font
}
//break out of method, something is not set up correctly
else {
	return
}

//activate correct tab and flip tab buttons
for ( var i = 1 ; i <= tabTotal ; i++ ) {	
	var tabName = prefix + i
	if (buttonName == tabName) {
		forms[formName].elements[tabName].fgcolor = foreSelect
		forms[formName].elements[tabName].bgcolor = backSelect
		forms[formName].elements[tabName].transparent = transparentSelect
		forms[formName].elements[tabName].setFont(fontSelect)
		
		//set tab index
		forms[formName].elements[tabPanelName].tabIndex = i
		
		/*	//TODO: what to do if there is a title header?
		//put line on tab panel if tab's form is in solution and type is table
		var tabFormName = forms[formName].elements[tabPanelName].getTabFormNameAt(i)
		if (forms[tabFormName] && forms[tabFormName].controller.view == 3) {
			forms[formName].elements[tabPanelName].setBorder('MatteBorder,1,0,0,0,#808080')
		}
		//set default border type
		else {
			forms[formName].elements[tabPanelName].setBorder('EmptyBorder,0,0,0,0')
		}
		*/
	}
	else {
		forms[formName].elements[tabName].fgcolor = foreUnselect
		forms[formName].elements[tabName].bgcolor = backUnselect
		forms[formName].elements[tabName].transparent = transparentUnselect
		forms[formName].elements[tabName].setFont(fontUnselect)
	}				
}



}

/**
 * @properties={typeid:24,uuid:"05CA6E53-E55F-4F8E-84F3-E436986B9FD5"}
 */
function SET_change(input, formParent) {
	if (!formParent) {
		var formName = application.getMethodTriggerFormName()
		var elem = forms[formName].elements[application.getMethodTriggerElementName()]
		
		//get parent form
		var formStack = forms[formName].controller.getFormContext()
		
		//this form is included on some other form
		if (formStack.getMaxRowIndex() > 1) {
			formParent = formStack.getValue(formStack.getMaxRowIndex()-1,2)
		}
	}
		
	//check for form variable that sets up tab controllers
	if (forms[formParent]) {
		//all tabs
		var valuelist = forms[formParent].tabSets
		
		//selected tab
		var tabSelected = forms[formParent].elements.tab_sets.tabIndex
			
		//called to depress menu
		if (typeof input != 'number') {
			//set up menu with arguments
			var menu = new Array()
			
			for ( var i = 0 ; i < valuelist.length ; i++ ) {
				
				if (i + 1 == tabSelected) {
					menu[i] = plugins.popupmenu.createCheckboxMenuItem(valuelist[i],SET_change)
					menu[i].setMethodArguments(i + 1,formParent)
					menu[i].setSelected(true)
				}
				else {
					menu[i] = plugins.popupmenu.createMenuItem(valuelist[i],SET_change)
					menu[i].setMethodArguments(i + 1,formParent)
				}
				
				if (utils.stringPatternCount(menu[i].text,'---')) {
					menu[i].setEnabled(false)
				}
			}
			
			//popup
			if (elem != null) {
				plugins.popupmenu.showPopupMenu(elem, menu)
			}
		}
		//menu shown and item chosen
		else {
			forms[formParent].elements.tab_sets.tabIndex = input
		}
	}
}

/**
 * Methods for "DETAIL" tab panel (same as calling default methods)
 */

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"A7B3910A-ACED-4674-B9E4-264DC9D58E53"}
 */
function GRID_actions__detail(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_actions(formName,'tab_detail')
}

/**
 * @param {JSEvent}	[event]
 * @param {String}	[formName]
 * @param {String}	[elemName]
 * @param {Number}	[selectedTab]
 * 
 * @properties={typeid:24,uuid:"98E39441-7771-41AB-857A-0D1090C5011E"}
 */
function GRID_change__detail(event,formName,elemName,selectedTab) {
	if (event instanceof JSEvent) {
		//no form name specified, try to get from event
		if (!formName) {
			formName = event.getFormName()
		}
		//no element name specified, try to get from event
		if (!elemName) {
			elemName = event.getElementName()
		}
	}
	
	GRID_change(
			formName,
			elemName,
			'tab_detail',
			'tab_d',
			'btn_add',
			'btn_actions',
			'btn_help',
			'lbl_tab_detail_divider',
			selectedTab
		)
}


/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"0FDCF4EC-E690-48B2-9621-F649477F9A95"}
 */
function GRID_init__detail(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_init(
			formName,
			null,
			'tab_detail',
			'tab_d',
			'btn_add',
			'btn_actions',
			'btn_help',
			'lbl_tab_detail_divider'
		)
}

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"B8712358-9249-4A08-BD9F-6801DBEC8829"}
 */
function GRID_help__detail(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_help(formName,'tab_detail')
}

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"A060CB8C-748F-40EC-96E0-E9797753CF69"}
 */
function GRID_new__detail(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_new(formName,'tab_detail')
}

/**
 * Methods for "LIST" tab panel
 */

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"20C677A7-11A3-4331-994F-53743CFC4AF2"}
 */
function GRID_actions__list(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_actions(formName,'tab_list')
}

/**
 * @param {JSEvent}	[event]
 * @param {String}	[formName]
 * @param {String}	[elemName]
 * @param {Number}	[selectedTab]
 * 
 * @properties={typeid:24,uuid:"9BFB8469-3A06-4129-9A6E-56E07AFCB59E"}
 */
function GRID_change__list(event,formName,elemName,selectedTab) {
	if (event instanceof JSEvent) {
		//no form name specified, try to get from event
		if (!formName) {
			formName = event.getFormName()
		}
		//no element name specified, try to get from event
		if (!elemName) {
			elemName = event.getElementName()
		}
	}
	
	GRID_change(
			formName,
			elemName,
			'tab_list',
			'tab_l',
			'btn_list_add',
			'btn_list_actions',
			'btn_list_help',
			'lbl_tab_list_divider',
			selectedTab
		)
}


/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"09F102A2-8E0A-4505-8400-8A04C080B71E"}
 */
function GRID_init__list(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_init(
			formName,
			null,
			'tab_list',
			'tab_l',
			'btn_list_add',
			'btn_list_actions',
			'btn_list_help',
			'lbl_tab_list_divider'
		)
}

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"48F1AE51-816E-4A78-8648-FB562EA1F81B"}
 */
function GRID_help__list(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_help(formName,'tab_list')
}

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"8B1E69BC-30D6-4E89-B4AF-5B97C9939C25"}
 */
function GRID_new__list(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_new(formName,'tab_list')
}

/**
 * Methods for "PRIMARY" tab panel
 */

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"05305861-D32C-4F5D-837E-513B34999633"}
 */
function GRID_actions__primary(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_actions(formName,'tab_primary')
}

/**
 * @param {JSEvent}	[event]
 * @param {String}	[formName]
 * @param {String}	[elemName]
 * @param {Number}	[selectedTab]
 * 
 * @properties={typeid:24,uuid:"B0BE29D2-B40A-4FA2-84B1-1C643C7E4A6D"}
 */
function GRID_change__primary(event,formName,elemName,selectedTab) {
	if (event instanceof JSEvent) {
		//no form name specified, try to get from event
		if (!formName) {
			formName = event.getFormName()
		}
		//no element name specified, try to get from event
		if (!elemName) {
			elemName = event.getElementName()
		}
	}
	
	GRID_change(
			formName,
			elemName,
			'tab_primary',
			'tab_p',
			'btn_primary_add',
			'btn_primary_actions',
			'btn_primary_help',
			'lbl_tab_primary_divider',
			selectedTab	
		)
}


/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"76D64D0F-126F-4C89-88A0-335F3D891B9F"}
 */
function GRID_init__primary(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_init(
			formName,
			null,
			'tab_primary',
			'tab_p',
			'btn_primary_add',
			'btn_primary_actions',
			'btn_primary_help',
			'lbl_tab_primary_divider'
		)
}

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"3E612008-D5D0-4E42-833E-B3A24F8243EC"}
 */
function GRID_help__primary(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_help(formName,'tab_primary')
}

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"E5434E8D-0170-49A0-A51C-0810E7D7D223"}
 */
function GRID_new__primary(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_new(formName,'tab_primary')
}

/**
 * Methods for "SECONDARY" tab panel
 */

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"A04B7FD9-8D75-4F70-91D6-B0D514CBEFE4"}
 */
function GRID_actions__secondary(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_actions(formName,'tab_secondary')
}

/**
 * @param {JSEvent}	event
 * @param {String}	[formName]
 * @param {String}	[elemName]
 * @param {Number}	[selectedTab]
 * 
 * @properties={typeid:24,uuid:"4715371F-B77E-4E00-B931-0DBE79C3E229"}
 */
function GRID_change__secondary(event,formName,elemName,selectedTab) {
	if (event instanceof JSEvent) {
		//no form name specified, try to get from event
		if (!formName) {
			formName = event.getFormName()
		}
		//no element name specified, try to get from event
		if (!elemName) {
			elemName = event.getElementName()
		}
	}
	
	GRID_change(
			formName,
			elemName,
			'tab_secondary',
			'tab_s',
			'btn_secondary_add',
			'btn_secondary_actions',
			'btn_secondary_help',
			'lbl_tab_secondary_divider',
			selectedTab
		)
}


/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"FA4FABF9-A26B-4011-942E-487D0F27C9FF"}
 */
function GRID_init__secondary(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_init(
			formName,
			null,
			'tab_secondary',
			'tab_s',
			'btn_secondary_add',
			'btn_secondary_actions',
			'btn_secondary_help',
			'lbl_tab_secondary_divider'
		)
}

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"DDFC3DAA-2C4A-4FEF-88DB-EAF6A55FC279"}
 */
function GRID_help__secondary(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_help(formName,'tab_secondary')
}

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"EA351284-2881-4865-9A26-90FC7AACF715"}
 */
function GRID_new__secondary(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_new(formName,'tab_secondary')
}

/**
 * Methods for "SUMMARY" tab panel
 */

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"E56FAE6B-5027-4ECD-9779-C1E2F1E75562"}
 */
function GRID_actions__summary(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_actions(formName,'tab_summary')
}

/**
 * @param {JSEvent}	[event]
 * @param {String}	[formName]
 * @param {String}	[elemName]
 * @param {Number}	[selectedTab]
 * 
 * @properties={typeid:24,uuid:"C03F856C-B58B-46FE-B51B-9558D76FF926"}
 */
function GRID_change__summary(event,formName,elemName,selectedTab) {
	if (event instanceof JSEvent) {
		//no form name specified, try to get from event
		if (!formName) {
			formName = event.getFormName()
		}
		//no element name specified, try to get from event
		if (!elemName) {
			elemName = event.getElementName()
		}
	}
	
	GRID_change(
			formName,
			elemName,
			'tab_summary',
			'tab_ss',
			'btn_summary_add',
			'btn_summary_actions',
			'btn_summary_help',
			'lbl_tab_summary_divider',
			selectedTab
		)
}


/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"8B697B0D-6C56-4487-A533-630D0D33F5F2"}
 */
function GRID_init__summary(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_init(
			formName,
			null,
			'tab_summary',
			'tab_ss',
			'btn_summary_add',
			'btn_summary_actions',
			'btn_summary_help',
			'lbl_tab_summary_divider'
		)
}

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"DC75BE47-0F97-4A40-A1CF-74A4A9EBD643"}
 */
function GRID_help__summary(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_help(formName,'tab_summary')
}

/**
 * @param {JSEvent} [event]
 * @param {String} [formName]
 * 
 * @properties={typeid:24,uuid:"F13BBA63-88DF-4736-84A8-F1D73F714095"}
 */
function GRID_new__summary(event,formName) {
	//no formname specified, try to get from event
	if (!formName && event instanceof JSEvent) {
		formName = event.getFormName()
	}
	
	GRID_new(formName,'tab_summary')
}