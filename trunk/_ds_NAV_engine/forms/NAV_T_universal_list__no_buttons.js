/**
 *
 * @properties={typeid:24,uuid:"9832B2AD-76A5-4DBF-869A-95D4B672340E"}
 */
function BUTTONS_toggle()
{

/*
 *	TITLE    :	BUTTONS_toggle
 *			  	
 *	MODULE   :	wf_NAV_engine
 *			  	
 *	ABOUT    :	toggle which buttons are showing
 *			  	
 *	INPUT    :	id_navigation_item
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

var currentNavItem = arguments[0]

//toggle tabs button
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].universalList.buttons.tabs) {
	elements.btn_tabs.visible = true
}
else {
	elements.btn_tabs.visible = false
}

//toggle display button
if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].universalList.displays && navigationPrefs.byNavItemID[currentNavItem].universalList.displays.length > 1) {
	elements.btn_display.visible = true
}
else {
	elements.btn_display.visible = false
}


}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D00D6B0C-6539-448F-BAB3-E9B60AD0F823"}
 */
function DISPLAY_cycle(event)
{
	
/*
 *	TITLE    :	DISPLAY_cycle
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	this Function cycles through display options; shift refreshes current display
 *			  	
 *	INPUT    :	1- force refresh
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	DISPLAY_list_control
 *			  	
 *	USAGE    :	DISPLAY_cycle() Cycles through all available display options (refreshes current display if shift held)
 *			  	
 *	MODIFIED :	September 26, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//cast Arguments to array
var Arguments = new Array()
for (var i = 0; i < arguments.length; i++) {
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
	Arguments.push(arguments[i])
}
//reassign arguments without jsevents
arguments = Arguments.filter(globals.CODE_jsevent_remove)

if (application.__parent__.solutionPrefs) {
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
	var refresh = arguments[0]
	var formName = solutionPrefs.config.currentFormName
	var currentNavItem = solutionPrefs.config.currentFormID
	var recSelected = forms[formName].controller.getSelectedIndex()
	
	//get menu list from active sort items
	var displayItems = navigationPrefs.byNavItemID[currentNavItem].universalList.displays
	
	//max number of displays
	var maxDisplays = displayItems.length
	
	//loop through display items to find the selected one
	var selectedDisplay = false
	for (var i = 0; i < maxDisplays && (typeof selectedDisplay == 'boolean'); i++) {
		if (globals.DATASUTRA_display == displayItems[i].displayID) {
			selectedDisplay = i
		}
	}
	
	//current display is a valid choice
	if (typeof selectedDisplay != 'boolean') {
		//shift key pressed not pressed; cycle to next available display
		if (!refresh && !globals.CODE_key_pressed('shift')) {
			//go to next display
			if (selectedDisplay < maxDisplays - 1) {
				selectedDisplay++
			}
			//end reached, loop to beginning
			else {
				selectedDisplay = 0
			}
		}
		
		//either refresh the current display or go to the next one
		DISPLAY_list_control(displayItems[selectedDisplay].rawDisplay,displayItems[selectedDisplay].displayID,displayItems[selectedDisplay].listTitle,formName,recSelected,displayItems[selectedDisplay].rowPreview,selectedDisplay,true)
	}
}

	

}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"1CA551D6-8238-4503-B7D7-F6F755D584DB"}
 */
function DISPLAY_list(event)
{
	
/*
 *	TITLE    :	DISPLAY_list
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	this Function displays display options; shift refreshes current display
 *			  	
 *	INPUT    :	1- force a refresh of currently selected display (true/false)
 *			  	2- display to refresh
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	DISPLAY_list_control
 *			  	
 *	USAGE    :	DISPLAY_list(refreshList,refreshListPosn) Shows pop-up of different display options (refreshes current display if shift held or true passed)
 *			  	
 *	MODIFIED :	June 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//cast Arguments to array
var Arguments = new Array()
for (var i = 0; i < arguments.length; i++) {
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
	Arguments.push(arguments[i])
}
//reassign arguments without jsevents
arguments = Arguments.filter(globals.CODE_jsevent_remove)

if (application.__parent__.solutionPrefs) {
	var formName = solutionPrefs.config.currentFormName
	var currentNavItem = solutionPrefs.config.currentFormID
	var recSelected = forms[formName].controller.getSelectedIndex()
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
	var refresh = arguments[0]
	var refreshPosn = arguments[1]
	
	//get menu list from active sort items
	var displayItems = navigationPrefs.byNavItemID[currentNavItem].universalList.displays
	
	//new display specified and there is a display there
	if (typeof refreshPosn == 'number' && displayItems.length >= refreshPosn) {
		globals.DATASUTRA_display = displayItems[refreshPosn - 1].displayID
	}
	
	//shift key pressed or force refresh requested; refresh current display
	if (globals.CODE_key_pressed() == 1 || refresh) {
		
		//loop through display items to find the selected one
		var recFound = false
		for (var i = 0; i < displayItems.length && (typeof recFound == 'boolean'); i++) {
			if (globals.DATASUTRA_display == displayItems[i].displayID) {
				recFound = i
			}
		}
		
		//fire refresh method
		if (typeof recFound != 'boolean') {
			DISPLAY_list_control(displayItems[recFound].rawDisplay,displayItems[recFound].displayID,displayItems[recFound].listTitle,formName,recSelected,displayItems[recFound].rowPreview,recFound,true)
		}
	}
	//show pop-up
	else {
		if (displayItems) {
			//build menu
			var menu = new Array ()
			for ( var i = 0 ; i < displayItems.length ; i++ ) {
				//set check mark
				if (globals.DATASUTRA_display == displayItems[i].displayID) {
					menu[i] = plugins.popupmenu.createCheckboxMenuItem(displayItems[i].rowPreview + "", DISPLAY_list_control)
					menu[i].setSelected(true)
				}
				else {
					menu[i] = plugins.popupmenu.createMenuItem(displayItems[i].rowPreview + "", DISPLAY_list_control)
				}
				
				//pass arguments
				menu[i].setMethodArguments(displayItems[i].rawDisplay,displayItems[i].displayID,displayItems[i].listTitle,formName,recSelected,displayItems[i].rowPreview,i)
			}
			
			//push menu down to the header line
			var btnInvisible = application.getMethodTriggerElementName() + "_down"
			var currentLocationX = elements[btnInvisible].getLocationX()
			var currentLocationY = elements[btnInvisible].getLocationY()
			
			elements[btnInvisible].setLocation(currentLocationX, currentLocationY + 3)
			
			//popup menu
			var elem = elements[btnInvisible]
			if (elem != null) {
			    plugins.popupmenu.showPopupMenu(elem, menu);
			}
			
			//set invisible btn back to original location
			elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
	
		}
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"CB8CEE85-87D3-4272-B0A1-242FBE2D87BC"}
 */
function DISPLAY_list_control()
{

if (application.__parent__.solutionPrefs) {
	
	var rawDisplay = arguments[0]
	var theDisplayID = arguments[1]
	var listTitle = arguments[2]
	var formName = arguments[3]
	var recSelected = arguments[4]
	var rowPreview = arguments[5]
	var theDisplayPosn = arguments[6]
	var syncRecords = arguments[7]
	
	var currentNavItem = solutionPrefs.config.currentFormID
	
	//set check box in display drop down
	globals.DATASUTRA_display = theDisplayID
	navigationPrefs.byNavItemID[currentNavItem].universalList.displays.displayID = theDisplayID
	navigationPrefs.byNavItemID[currentNavItem].universalList.displays.displayPosn = theDisplayPosn
	
	//if list_title overridden in display preferences, use it; otherwise, set record header to fw_list_title for that navigation item
	if (navigationPrefs.byNavItemID[currentNavItem].universalList.displays[theDisplayPosn].listTitle) {
		var listTitle = navigationPrefs.byNavItemID[currentNavItem].universalList.displays[theDisplayPosn].listTitle
	}
	else {
		var listTitle = navigationPrefs.byNavItemID[currentNavItem].navigationItem.fwListTitle
	}
	
	if (listTitle) {
		elements.record_heading.text = listTitle.toUpperCase()
	}
	else {
		elements.record_heading.text = (navigationPrefs.byNavItemID[currentNavItem].navigationItem.itemName) ? navigationPrefs.byNavItemID[currentNavItem].navigationItem.itemName.toUpperCase() : 'RECORDS'
	}
	
	//pump new data in
//	if (syncRecords) {
//		UL_sync_records()
//	}
//	else {
//		UL_fill_data()
//	}
	
	//get the form, destroy it, put new one in its place
	var uniList = 'NAV_T_universal_list_1L'
				
	//new form name (UL__set000_item000_CRM_0F_companies)
	var newFormName = navigationPrefs.byNavItemID[currentNavItem].listData.tabFormInstance
	var newFormTab = navigationPrefs.byNavItemID[currentNavItem].listData.tabNumber
	
	//if form already defined, remove
	if (forms[newFormName]) {
		//remove from tabpanel
		elements.tab_ul.removeTabAt(newFormTab)
	}
//	//if form already defined, remove
//	if (forms[newFormName]) {
//		//remove from tabpanel
//		elements.tab_ul.removeTabAt(newFormTab)
//		//first remove it from the current history, to destroy any active form instance
//		var success = history.removeForm(newFormName)
//		//removes the named form from this session
//		if (success) {
//			solutionModel.removeForm(newFormName)
//		}
//	}
	//create new forms
	var template = globals.NAV_universal_list_form_to_template(uniList)
	var myForm = globals.NAV_universal_list_template_to_form(template,newFormName)
	
	//set datasource
	myForm.serverName = forms[solutionPrefs.config.currentFormName].controller.getServerName()
	myForm.tableName = forms[solutionPrefs.config.currentFormName].controller.getTableName()
	
	//set events
	myForm.onShow = solutionModel.getGlobalMethod('NAV_universal_list_show')
	myForm.onRecordSelection = solutionModel.getGlobalMethod('NAV_universal_list_select')
	myForm.rowBGColorCalculation = 'globals.NAV_row_background'
	
	//get the UL data and set it up
	var allULDisplays = navigationPrefs.byNavItemID[currentNavItem].universalList.displays
	var initialUL = allULDisplays[allULDisplays.displayPosn].rawDisplay
	
	for (var i = 0; i < initialUL.length; i++) {
		var lineItem = initialUL[i]
		
		//determine alignment
		var horizAlign = 2
		switch (lineItem.align) {
			case 'left':
				horizAlign = 2
				break
			case 'right':
				horizAlign = 4
				break
			case 'center':
				horizAlign = 0
				break
		}
		
		var fieldFormat = null
		var fieldVL = null
		
		//determine format
		if (lineItem.formatMask == 'Number' || lineItem.formatMask == 'Date') { // || lineItem.formatMask == 'Text') {
			var fieldFormat = lineItem.format
		}
		else if (lineItem.formatMask == 'Valuelist') {
			var fieldVL = lineItem.format
		}	
		
		//TODO: check for better name
		var nameNameField = (lineItem.rowDisplay[0].isField) ? lineItem.rowDisplay[0].value : lineItem.fieldName
		
		//TODO: error checking for contents of rawDisplay
		if (!nameNameField) {
			continue
		}
		
		//create field
		var myField = myForm.newTextField(
						nameNameField,			//dataprovider
						i,						//x
						0,						//y
						lineItem.width,			//width
						20						//height
					)
		
		myField.setOnFocusGainedMethod(globals.NAV_universal_list_select__unhilite)
		myField.anchors = SM_ANCHOR.ALL
		myField.horizontalAlignment = horizAlign
		myField.styleClass = 'customlist'
		myField.editable = false
		myField.borderType = 'EmptyBorder,0,0,0,0'
		myField.margin = '0,4,0,4'
		myField.scrollbars = 0
		myField.transparent = false
		myField.text = (lineItem.header) ? lineItem.header : nameNameField
		if (fieldFormat) {
			myField.format = fieldFormat
		}
		if (fieldVL) {
			myField.valuelist = solutionModel.getValueList(fieldVL)
		}
	}
	
	//assign the secondary form to the main UL at the tab right behind where it used to be (when deleted, the others slid over to fill its spot)
	elements.tab_ul.addTab(forms[newFormName],'UL Record: ' + theDisplayPosn,null,null,null,null,null,null,newFormTab - 1)
	navigationPrefs.byNavItemID[currentNavItem].listData.dateAdded = application.getServerTimeStamp()
	
	elements.tab_ul.tabIndex = newFormTab
	
	//LOG ul display change
	var serverName = forms[formName].controller.getServerName()
	var tableName = forms[formName].controller.getTableName()
	globals.CALLBACK_log_create('UL Displays',
						rowPreview,
						serverName,
						tableName
						)
}
}

/**
 *
 * @properties={typeid:24,uuid:"46EC57A2-947E-4A0D-A346-74D600B19A93"}
 */
function FORM_on_hide()
{

/*
 *	TITLE    :	FORM_on_hide
 *			  	
 *	MODULE   :	wf_NAV_engine
 *			  	
 *	ABOUT    :	save header html
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

/*
if (this.navItemID && navigationPrefs.byNavItemID[this.navItemID] && navigationPrefs.byNavItemID[this.navItemID].listData) {
	navigationPrefs.byNavItemID[this.navItemID].listData.headerHTML = globals.NAV_list_header
}
*/
}

/**
 * @properties={typeid:24,uuid:"F61C433C-6153-442B-9227-8EE29AC38052"}
 */
function FORM_on_load()
{
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"EABA6105-8242-4BC3-936D-360376E8CBE1"}
 */
function FORM_on_show(firstShow, event)
{
	
/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	wf_NAV_engine
 *			  	
 *	ABOUT    :	set up universal list the first time it is visited
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	var currentNavItem = solutionPrefs.config.currentFormID
	var formName = navigationPrefs.byNavItemID[currentNavItem].navigationItem.formToLoad
	//solutionPrefs.config.currentFormName
	
	var tabName = elements.tab_ul.getTabFormNameAt(1)
	
	//timer for debugging purposes
	globals.CALLBACK_timer('start')
	
	//things to do on the initial show only
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
	if (arguments[0]) {
		var rawDisplayPosn = navigationPrefs.byNavItemID[currentNavItem].universalList.displays.displayPosn
		
		//if list_title overridden in display preferences, use it; otherwise, set record header to fw_list_title for that navigation item
		if (navigationPrefs.byNavItemID[currentNavItem].universalList.displays[rawDisplayPosn].listTitle) {
			var listTitle = navigationPrefs.byNavItemID[currentNavItem].universalList.displays[rawDisplayPosn].listTitle
		}
		else {
			var listTitle = navigationPrefs.byNavItemID[currentNavItem].navigationItem.fwListTitle
		}
		
		//set label on record list
		if (listTitle) {
			elements.record_heading.text = listTitle.toUpperCase()
		}
		else {
			elements.record_heading.text = 'RECORDS'
		}
		
		//save down navigationItemID to form
		//this.navItemID = currentNavItem
		
		//set hide/show on all buttons
		BUTTONS_toggle(currentNavItem)
	}
	//frameworks engine data has changed since form first displayed
	else if (solutionPrefs.config.prefs.frameworksEngine && solutionPrefs.config.prefs.frameworksEngine > navigationPrefs.byNavItemID[currentNavItem].listData.dateAdded) {
		//set hide/show on all buttons
		BUTTONS_toggle(currentNavItem)
	}
	
//	//if records, get selected one
//	if (forms[tabName].foundset && forms[tabName].foundset.getSize()) {
//		var record = forms[tabName].foundset.getRecord(forms[tabName].foundset.getSelectedIndex())
//	}
//	
//	//if no data, fill it
//	if (!record || !record.display) {
//		UL_fill_data()
//	}
//	//set highlighted and refresh global header
//	else {
//		//TODO: remove this fill data; once garbage collection is more efficient, the commented out way is much prefered
//		UL_sync_records()
//		/*
//		forms[tabName].UL_set_selected()
//		globals.NAV_list_header = navigationPrefs.byNavItemID[currentNavItem].listData.headerHTML
//		*/
//	}
	
	//set record navigator to reflect current index and found set
	globals.CALLBACK_toolbar_record_navigator_set()
	
	//only run when using query based way to hit repository and form present
	if (forms[formName] && solutionPrefs.repository && solutionPrefs.repository.allFormsByTable && solutionPrefs.repository.allFormsByTable[serverName] && solutionPrefs.repository.allFormsByTable[serverName][tableName] && solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey) {			
		var serverName = forms[formName].controller.getServerName()
		var tableName = forms[formName].controller.getTableName()
		
		var pkName = solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey
		var pkActedOn = forms[formName][pkName]
		
		//save time when pk of this record first accessed
		if (!navigationPrefs.byNavItemID[currentNavItem].listData.visitedPKs[pkActedOn]) {
			navigationPrefs.byNavItemID[currentNavItem].listData.visitedPKs[pkActedOn] = application.getServerTimeStamp()
		}
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"95275D68-F220-40AB-AC38-6C38D842FE01"}
 */
function TABS_list()
{

/*
 *	TITLE    :	TABS_list
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	forms to load from action_item table
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs, globals.NAV_navigation_item_selected containing pk of currently selected workflow area's navigation item
 *			  	
 *	MODIFIED :	Mar 11, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//grab the actions to this
var valueList = new Array()
var formNames = new Array()
for (var i = 0; i < navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].universalList.buttons.tabs.length ; i++) {
	var actionItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].universalList.buttons.tabs[i]
	valueList.push(actionItem.menuName)
	formNames.push(actionItem.formToLoad)
}

//only show pop-up if there are enabled values
if (valueList.length) {
	//tack on universal list to the top of the array
	valueList.unshift(globals.CODE_text_initial_caps(elements.record_heading.text))
	formNames.unshift(null)
	
	//build menu, load tabs, and set menu method arguments
	var menu = new Array()
	for ( var i = 0 ; i < valueList.length ; i++ ) {
	    //set check on universal list
		if (i == 0) {
			menu[i] = plugins.popupmenu.createCheckboxMenuItem(valueList[i] + "", TABS_list_control)
			menu[i].setSelected(true)
		}
		else {
			menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", TABS_list_control)
		}
		
		//pass method name as parameter if that form is currently included
		if (forms[formNames[i]]) {
			menu[i].setMethodArguments(formNames[i],valueList[i])
		}
		else {
			menu[i].setEnabled(false)
		}
		
		//disable dividers
		if (valueList[i] == '----') {
			menu[i].setEnabled(false)
		}
	}
	
	//push menu down to the header line
	var btnInvisible = application.getMethodTriggerElementName() + "_down"
	var currentLocationX = elements[btnInvisible].getLocationX()
	var currentLocationY = elements[btnInvisible].getLocationY()
	
	elements[btnInvisible].setLocation(currentLocationX, currentLocationY + 3)
	
	//popup menu
	var elem = elements[btnInvisible]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menu)
	}
	
	//set invisible btn back to original location
	elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
}
}

/**
 *
 * @properties={typeid:24,uuid:"56649AD0-1A4B-46BB-8615-3EBE098F4793"}
 */
function TABS_list_control()
{

/*
 *	TITLE    :	TABS_list_control
 *			  	
 *	MODULE   :	fw_NAV_engine
 *			  	
 *	ABOUT    :	switch out lower left tab (usually used for tabs)
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Nov 20, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = arguments[0]
var itemName = arguments[1]
var formNameBase = solutionPrefs.config.formNameBase
var prefName = 'Custom tab ' + solutionPrefs.config.currentFormID + ': ' + formName

if (forms[formName]) {
	//set global that end users use in their code
	globals.NAV_universal_selected_tab = formName
	
	//if not loaded, add tab
	if (formName != 'FRAMEWORKS_blank_1_list' && !navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		
		//assign to list tab panel
		forms[formNameBase].elements.tab_content_B.addTab(forms[formName],'',null,null,null,null)
		forms[formNameBase].elements.tab_content_B.tabIndex = forms[formNameBase].elements.tab_content_B.getMaxTabIndex()
		
		//save status info
		navigationPrefs.byNavSetName.configPanes.itemsByName[prefName] = new Object()
		navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData = {
									tabNumber : forms[formNameBase].elements.tab_content_B.tabIndex,
									dateAdded : application.getServerTimeStamp()
							}
		
	}
	//blank form, set to blank tab
	else if (listTab == 'FRAMEWORKS_blank_1_list') {
		forms[formNameBase].elements.tab_content_B.tabIndex = 1
	}
	//set tab to this preference
	else {
		forms[formNameBase].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData.tabNumber
	}
	
	//LOG ul tab change
	globals.CALLBACK_log_create('UL Tabs',
						itemName,
						formName
						)
}
}
