/**
 * @param {Number} currentNavItem
 *
 * @properties={typeid:24,uuid:"9832B2AD-76A5-4DBF-869A-95D4B672340E"}
 */
function BUTTONS_toggle(currentNavItem) {
	//toggle tabs button
	if (navigationPrefs.byNavItemID[currentNavItem].buttons.tabs) {
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
 * Cycles through display options; shift refreshes current display
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D00D6B0C-6539-448F-BAB3-E9B60AD0F823"}
 */
function DISPLAY_cycle(event) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
	
	if (application.__parent__.solutionPrefs) {
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
function DISPLAY_list(event) {
	
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
		Arguments.push(arguments[i])
	}
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
	
	if (application.__parent__.solutionPrefs) {
		var formName = solutionPrefs.config.currentFormName
		var currentNavItem = solutionPrefs.config.currentFormID
		var recSelected = forms[formName].controller.getSelectedIndex()
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
function DISPLAY_list_control(rawDisplay,theDisplayID,listTitle,formName,recSelected,rowPreview,theDisplayPosn,syncRecords) {
	if (application.__parent__.solutionPrefs) {
		
//		var rawDisplay = arguments[0]
//		var theDisplayID = arguments[1]
//		var listTitle = arguments[2]
//		var formName = arguments[3]
//		var recSelected = arguments[4]
//		var rowPreview = arguments[5]
//		var theDisplayPosn = arguments[6]
//		var syncRecords = arguments[7]
		
		var currentNavItem = solutionPrefs.config.currentFormID
		var serverName = forms[solutionPrefs.config.currentFormName].controller.getServerName()
		var tableName = forms[solutionPrefs.config.currentFormName].controller.getTableName()
		
		var tabPanel = solutionPrefs.config.webClient ? forms.NAV_T_universal_list__WEB__list.elements.tab_ul : elements.tab_ul
		
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
		
		//get the form, destroy it, put new one in its place
		var uniList = 'NAV_T_universal_list_1L'
					
		//new form name (UL__set000_item000_CRM_0F_companies)
		var newFormName = navigationPrefs.byNavItemID[currentNavItem].listData.tabFormInstance
		var newFormTab = navigationPrefs.byNavItemID[currentNavItem].listData.tabNumber
		
		//if form already defined, remove
		if (forms[newFormName]) {
			//remove from tabpanel
			tabPanel.removeTabAt(newFormTab)
		}
		
		//create new forms
		var template = globals.NAV_universal_list_form_to_template(uniList)
		var myForm = globals.NAV_universal_list_template_to_form(template,newFormName)
		
		//set datasource
		myForm.serverName = serverName
		myForm.tableName = tableName
		
		//set events
		myForm.onShow = solutionModel.getGlobalMethod('globals','NAV_universal_list_show')
		myForm.onRecordSelection = solutionModel.getGlobalMethod('globals','NAV_universal_list_select')
		if (!solutionPrefs.config.webClient) {
			myForm.onRender = solutionModel.getGlobalMethod('globals','NAV_universal_list_render')
			myForm.rowBGColorCalculation = 'globals.NAV_universal_list_row_background'
		}
		
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
			
			//create check field
			if (lineItem.formatMask == 'Check') {
				var myField = myForm.newCheck(
								nameNameField,			//dataprovider
								i,						//x
								0,						//y
								lineItem.width,			//width
								20						//height
							)
			}
			//create normal field
			else {
				var myField = myForm.newTextField(
								nameNameField,			//dataprovider
								i,						//x
								0,						//y
								lineItem.width,			//width
								20						//height
							)
			}
			
			myField.name = application.getUUID().toString()
//			myField.onFocusGained = solutionModel.getGlobalMethod('globals','NAV_universal_list_select__unhilite')
			myField.anchors = SM_ANCHOR.ALL
			myField.horizontalAlignment = horizAlign
			myField.styleClass = 'universallist'
			myField.editable = lineItem.editable
			myField.selectOnEnter = false
			myField.scrollbars = 0
			myField.transparent = true
			myField.text = (lineItem.header) ? lineItem.header : nameNameField
			if (fieldFormat) {
				myField.format = fieldFormat
			}
			if (fieldVL) {
				myField.valuelist = solutionModel.getValueList(fieldVL)
			}
			//on right column, give a small margin
			if (i == initialUL.length - 1) {
				myField.margin = '0,4,0,4'
			}
			
			if (lineItem.editable) {
				myField.onRightClick = solutionModel.getGlobalMethod('globals','NAV_universal_list_edit')
			}
			else {
				myField.onRightClick = solutionModel.getGlobalMethod('globals','NAV_universal_list_right_click')
			}
		}
		
		var dsNode = solutionModel.getDataSourceNode('db:/' + serverName + '/' + tableName)
		
		//width/height for favorite and arrow
		var height = solutionPrefs.config.webClient ? 18 : 17
		var width = solutionPrefs.config.webClient ? 15 : 12
					
		//add favorite column to universal list
		if (solutionPrefs.access.accessControl && navigationPrefs.byNavItemID[currentNavItem].navigationItem.favoritable) {
			//add calculation to show favorite star if hasn't been added already
			var starCalc = dsNode.getCalculation('sutra_favorite_badge')
			if (!starCalc) {
				starCalc = dsNode.newCalculation(
						['function sutra_favorite_badge() {',
							'var badge = "";',
							'var record = foundset.getRecord(currentRecordIndex);',
							'function favExists (item) {',
								'return item && item.datasource == record.getDataSource() && item.pk == record.getPKs()[0];',
							'}',
							//this is a favorite, we need some kind of image
							'if (solutionPrefs.access.favorites.some(favExists)) {',
								'badge += \'<html><center><img src="media:///\';',
								
								//web client
								'if (solutionPrefs.config.webClient) {',
									'badge += "btn_favorite_web_selected.png";',
								'}',
								//smart client row is selected
								'else if (foundset.getSelectedIndex() == foundset.getRecordIndex(record)) {',
									'badge += "btn_favorite_selected.png";',
								'}',
								//smart client row is not selected
								'else {',
									'badge += "btn_favorite_unselected.png";',
								'}',
								'badge += \'" width=15 height=20></center>\';',
							'}',
							'return badge;',
						'}'].join('')
					)
			}
			
			var starField = myForm.newLabel(
								'',						//text on label
								i++,					//x
								0,						//y
								(solutionPrefs.config.webClient ? 25 : 23),						//width
								20						//height
							)

			starField.name = 'sutra_favorite_badge'
			starField.dataProviderID = 'sutra_favorite_badge'
			starField.onAction = solutionModel.getGlobalMethod('globals','NAV_universal_list_favorite')
			starField.onRightClick = solutionModel.getGlobalMethod('globals','NAV_universal_list_right_click')
			starField.anchors = SM_ANCHOR.DEFAULT
			starField.horizontalAlignment = SM_ALIGNMENT.LEFT
			starField.styleClass = 'universallist'
			starField.borderType = 'EmptyBorder,0,0,0,0'
			starField.transparent = true
			starField.displaysTags = true
			starField.rolloverCursor = SM_CURSOR.HAND_CURSOR
			//commented out because gets stuck on when updating a record
//			starField.rolloverImageMedia = solutionModel.getMedia('btn_favorite_rollover.png')
			starField.toolTipText = 'Toggle favorite'//'%%sutra_favorite_tooltip%%'
			starField.showClick = solutionPrefs.config.activeSpace == 'workflow flip'
			var headStar = solutionPrefs.config.webClient ? 'btn_favorite_web_selected.png' : 'btn_favorite_dark.png'
			starField.text = '<html><center><img src="media:///' + headStar + '" width=' + width + ' height=' + height + '></center>'
				
			//override sort on form so that will toggle favorite mode on off for this field
			myForm.onSortCmd = solutionModel.getGlobalMethod('globals','NAV_universal_list_sort')
		}
		
		//add detail button for workflow when in maximized list view
		var detailView = myForm.newLabel(
							'',						//text on label
							i++,					//x
							0,						//y
							(solutionPrefs.config.webClient ? 25 : 24),						//width
							20						//height
						)
		
		var detailCalc = dsNode.getCalculation('sutra_detail_view')
		if (!detailCalc) {
			detailCalc = dsNode.newCalculation(
					['function sutra_detail_view() {',
						'var badge = \'<html><center><img src="media:///\';',
						'badge += "arrow_right.png";',
						'badge += \'" width=20 height=20></center>\';',
						'return badge;',
					'}'].join('')
				)
		}
		
		detailView.name = 'sutra_detail_view'
		detailView.dataProviderID = 'sutra_detail_view'
		detailView.onAction = solutionModel.getGlobalMethod('globals','NAV_universal_list_detail_view')
		detailView.anchors = SM_ANCHOR.DEFAULT
		detailView.horizontalAlignment = SM_ALIGNMENT.LEFT
		detailView.styleClass = 'universallist'
		detailView.borderType = 'EmptyBorder,0,0,0,0'
		detailView.transparent = true
		detailView.displaysTags = true
		detailView.rolloverCursor = SM_CURSOR.HAND_CURSOR
		detailView.toolTipText = 'View details'
		detailView.showClick = false
		detailView.text = '<html><center><img src="media:///arrow_white_right_over.png" width=' + height + ' height=' + height + '></center>'
		detailView.visible = solutionPrefs.config.activeSpace == 'workflow flip'
		
		//assign the secondary form to the main UL at the tab right behind where it used to be (when deleted, the others slid over to fill its spot)
		tabPanel.addTab(forms[newFormName],'UL Record: ' + theDisplayPosn,null,null,null,null,null,null,newFormTab - 1)
		navigationPrefs.byNavItemID[currentNavItem].listData.dateAdded = application.getServerTimeStamp()
		
		tabPanel.tabIndex = newFormTab
		
		//make UL prettified again
		scopes.DS.webULPrettify()
		
		//LOG ul display change
		var serverName = forms[formName].controller.getServerName()
		var tableName = forms[formName].controller.getTableName()
		globals.TRIGGER_log_create('UL Displays',
							rowPreview,
							serverName,
							tableName
							)
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"EABA6105-8242-4BC3-936D-360376E8CBE1"}
 */
function FORM_on_show(firstShow, event) {
	if (application.__parent__.solutionPrefs) {
		var currentNavItem = solutionPrefs.config.currentFormID
		var formName = navigationPrefs.byNavItemID[currentNavItem].navigationItem.formToLoad
		
		//things to do on the initial show only
		if (firstShow) {
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
		}
		
		//set record navigator to reflect current index and found set
		globals.TRIGGER_toolbar_record_navigator_set()
		
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
 * @properties={typeid:24,uuid:"45AF6843-E5B1-4BE8-BB40-DB1DF8167476"}
 */
function FX_sort() {
	if (application.__parent__.solutionPrefs) {
		
		var formName = solutionPrefs.config.currentFormName
		var currentNavItem = solutionPrefs.config.currentFormID
		var listName = application.getMethodTriggerFormName()
		var colName = arguments[0]
		
		//logging
		var serverName = forms[formName].controller.getServerName()
		var tableName = forms[formName].controller.getTableName()
		//only run when using query based way to hit repository
		if (solutionPrefs.repository && solutionPrefs.repository.allFormsByTable && solutionPrefs.repository.allFormsByTable[serverName] && solutionPrefs.repository.allFormsByTable[serverName][tableName] && solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey) {
			var pkName = solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey
			var pkActedOn = forms[formName][pkName]
		}
		else {
			var pkName = 'repositoryAPINotImplemented'
			var pkActedOn = 0
		}
		
		//flip sort direction if same field was sorted on already, otherwise, sort asc
		if (navigationPrefs.byNavItemID[currentNavItem].listData.sortField == colName) {
			switch (navigationPrefs.byNavItemID[currentNavItem].listData.sortDirection) {
					case 'asc':
						var sortDirection = 'desc'
						break
					case 'desc':
						var sortDirection = 'asc'
						break
					default:
						var sortDirection = 'asc'
						break
			}
		}
		else {
			var sortDirection = 'asc'
		}
		
		//sort list
		forms[formName].controller.sort(colName + ' ' + sortDirection)
		
		//store current field sorted by and direction on main tab form
		navigationPrefs.byNavItemID[currentNavItem].listData.sortField = colName
		navigationPrefs.byNavItemID[currentNavItem].listData.sortDirection = sortDirection
		
		var serverName = forms[formName].controller.getServerName()
		var tableName = forms[formName].controller.getTableName()
		
		//add server name if not already
		if (!solutionPrefs.fastFind.currentSearch[serverName]) {
			solutionPrefs.fastFind.currentSearch[serverName] = new Object()
		}
		//add table name if not already
		if (!solutionPrefs.fastFind.currentSearch[serverName][tableName]) {
			solutionPrefs.fastFind.currentSearch[serverName][tableName] = new Object()
		}
		//only run when using query based way to hit repository
		if (solutionPrefs.repository && solutionPrefs.repository.allFormsByTable && solutionPrefs.repository.allFormsByTable[serverName] && solutionPrefs.repository.allFormsByTable[serverName][tableName] && solutionPrefs.repository.allFormsByTable[serverName][tableName][formName]) {
			//check if not using separateFoundset
			if (!solutionPrefs.repository.allFormsByTable[serverName][tableName][formName].useSeparateFoundset) {
				solutionPrefs.fastFind.currentSearch[serverName][tableName].sortField = colName
				solutionPrefs.fastFind.currentSearch[serverName][tableName].sortDirection = sortDirection
			}
		}
		
		//update record navigator
		globals.TRIGGER_toolbar_record_navigator_set()
		
		//LOG ul sort
		globals.TRIGGER_log_create('UL Sorts',
							colName,
							sortDirection,
							serverName,
							tableName,
							pkName,
							pkActedOn
						)
	}
}


/**
 * Handle focus gained event of the element.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"C607E006-399A-497F-A290-A6C8612A4391"}
 */
function UL_unfocus(event) {
	elements.fld_constant.visible = false
	elements.fld_constant.visible = true
}
