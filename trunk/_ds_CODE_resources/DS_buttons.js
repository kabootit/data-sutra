/**
 * @param {JSEvent} [event]
 * @param {Boolean} [list] Return the popupmenu list only
 * 
 * @properties={typeid:24,uuid:"0CB9F20C-8E7A-44FA-A691-97398613F61C"}
 */
function ACTIONS_list(event,list) {
	
	/*
	 *	TITLE    :	ACTIONS_list
	 *			  	
	 *	MODULE   :	fw_NAV_engine
	 *			  	
	 *	ABOUT    :	pop the menu up instead of the default down
	 *			  	uses a secondary invisible object on the layout which is behind the clicked button
	 *			  	move secondary object up far enough to drop down a popup that hits the top edge
	 *			  		of clicked btn
	 *			  	when menu item is selected, return secondary object to original location
	 *			  	
	 *			  	action values retrieved from action_item table
	 *			  	
	 *	INPUT    :	
	 *			  	
	 *	OUTPUT   :	
	 *			  	
	 *	REQUIRES :	solutionPrefs, globals.NAV_navigation_item_selected containing pk of currently selected workflow area's navigation item
	 *			  	
	 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
	 *			  	
	 */
	
	
	//override with custom action
	if (solutionPrefs.config.currentFormName && solutionModel.getForm(solutionPrefs.config.currentFormName).getMethods(true).map(function (item) {return item.getName()}).indexOf('OV_ACTIONS_list') != -1) {
		forms[solutionPrefs.config.currentFormName].OV_ACTIONS_list()
		return
	}
	
	//grab the actions to this
	var valueList = new Array()
	var methodTypes = new Array()
	var methods = new Array()
	
	if (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.actions) {
		for (var i = 0; i < navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.actions.length ; i++) {
			var actionItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.actions[i]
			valueList.push(actionItem.menuName)
			methodTypes.push(actionItem.methodType)
			methods.push(actionItem.method)
		}
	}
	
	//only show pop-up if there are enabled values
	if (valueList.length) {
		//build menu
		var menu = new Array()
		for (var i = 0 ; i < valueList.length ; i++) {
			menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_control)
			menu[i].setMethodArguments(valueList[i], methodTypes[i], methods[i])
			
			//disable dividers
			if (valueList[i] == '-') {
				menu[i].setEnabled(false)
			}
			else {
				if (methodTypes[i] == 'Method') {
					//if no method or method does not exist on the form, do not run
					if (!(solutionPrefs.config.currentFormName in forms && methods[i] && forms[solutionPrefs.config.currentFormName][methods[i].slice(0,methods[i].length-2)])) {
						menu[i].setEnabled(false)
					}
				}
				else if (methodTypes[i] == 'Custom code') {
					if (methods[i] == null || methods[i] == '') {
						menu[i].setEnabled(false)
					}
				}
				else {
					menu[i].setEnabled(false)
				}
			}
		}
		
		//we need this list to use elsewhere
		if (list) {
			return menu
		}
		
		//hack not required
		if (utils.stringToNumber(application.getVersion()) >= 5) {
			//pop up the popup menu
			var elem = event.getSource()
			if (elem != null) {
			    plugins.popupmenu.showPopupMenu(elem, menu);
			}
		}
		//legacy
		else {
			//allow popup to approximately work even when solutionPrefs isn't defined
			if (application.__parent__.solutionPrefs) {
				var lineHeight = solutionPrefs.clientInfo.popupHack.lineHeight
				var topShift = solutionPrefs.clientInfo.popupHack.topShift
			}
			else {
				var lineHeight = 0
				var topShift = 0
			}
			
			var btnInvisible = event.getElementName() + "_up"
			var currentLocationX = elements[btnInvisible].getLocationX()
			var currentLocationY = elements[btnInvisible].getLocationY()
			
			//move "up" button to correct location
			elements[btnInvisible].setLocation(currentLocationX, currentLocationY - (topShift + (menu.length * lineHeight)))
			
			//popup menu
			globals.CODE_popup.popupMenu = menu
			globals.CODE_popup(null,null,elements[btnInvisible])
			
			//set invisible btn back to original location
			elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
		}
	}
}

/**
 *
 * @properties={typeid:24,uuid:"4C283E66-F5DA-483A-83B7-144D7CF8B063"}
 */
function ACTIONS_list_control() {
	
	/*
	 *	TITLE    :	ACTIONS_list_control
	 *			  	
	 *	MODULE   :	fw_NAV_engine
	 *			  	
	 *	ABOUT    :	prepare method to be run by:
	 *			  		1) scoping controller to the correct form
	 *			  		2) replacing 'field' with a scoped reference
	 *			  	
	 *	INPUT    :	
	 *			  	
	 *	OUTPUT   :	
	 *			  	
	 *	REQUIRES :	solutionPrefs, globals.NAV_navigation_item_selected containING pk of currently selected workflow area's navigation item
	 *			  	
	 *	MODIFIED :	Nov 20, 2007 -- Troy Elliott, Data Mosaic
	 *			  	
	 */	//TODO: switch over to call with context from plugin
	
	if (application.__parent__.solutionPrefs) {
		
		var formName = solutionPrefs.config.currentFormName
		var methodItem = arguments[0]
		var methodType = arguments[1]
		var method = arguments[2]
		
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
		
		//if custom code, scope all form-specific attributes to that form
		if (methodType == 'Custom code') {
			
		}
		else if (methodType == 'Method') {
			//if method does not exist on the form, do not run
			if (forms[formName] && forms[formName][method.slice(0,method.length-2)]) {
				//method = 'forms.' + formName + '.' + method
			}
			else {
				method = null
			}
		}
		
		if (methodType != null || methodType != '' && method) {
			with (forms[formName]) {
				eval(method)
			}
		}
		else {
			globals.DIALOGS.showInfoDialog('Config incomplete', 'Return to navigation setup to complete this action', 'OK')
		}
		
		//LOG ul action
		globals.TRIGGER_log_create('UL Actions',
					methodItem,
					method,
					serverName,
					tableName,
					pkName,
					pkActedOn
				)
	}
}


/**
 * @param {JSEvent} [event]
 * @param {Boolean} [list] Return the popupmenu list only
 * 
 * @properties={typeid:24,uuid:"6A29BEC1-59E1-4019-9015-4CC9710153F8"}
 */
function FILTERS_list(event,list) {
	/*
	 *	TITLE    :	FILTERS_list
	 *			  	
	 *	MODULE   :	fw_NAV_engine
	 *			  	
	 *	ABOUT    :	pop the menu up instead of the default down
	 *			  	uses a secondary invisible object on the layout which is behind the clicked button
	 *			  	move secondary object up far enough to drop down a popup that hits the top edge
	 *			  		of clicked btn
	 *			  	when menu item is selected, return secondary object to original location
	 *			  	
	 *			  	get filter values and set parameters
	 *			  	
	 *	INPUT    :	
	 *			  	
	 *	OUTPUT   :	
	 *			  	
	 *	REQUIRES :	solutionPrefs, globals.NAV_navigation_item_selected containing pk of currently selected workflow area's navigation item
	 *			  	
	 *	MODIFIED :	July 16, 2008 -- Troy Elliott, Data Mosaic
	 *			  	
	 */
	
	//override with custom action
	if (solutionPrefs.config.currentFormName && solutionModel.getForm(solutionPrefs.config.currentFormName).getMethods(true).map(function (item) {return item.getName()}).indexOf('OV_FILTERS_list') != -1) {
		forms[solutionPrefs.config.currentFormName].OV_FILTERS_list()
		return
	}
	
	var navigationID = solutionPrefs.config.currentFormID
	
	var menuMain = FX_multitier_menu(navigationPrefs.byNavItemID[navigationID].buttons.filters)
	
	//we need this list to use elsewhere
	if (list) {
		return menuMain
	}
	
	//only show pop-up if there are enabled values
	if (menuMain.length) {
		//hack not required
		if (utils.stringToNumber(application.getVersion()) >= 5) {
			//pop up the popup menu
			var elem = event.getSource()
			if (elem != null) {
			    plugins.popupmenu.showPopupMenu(elem, menuMain);
			}
		}
		//legacy
		else {
			//allow popup to approximately work even when solutionPrefs isn't defined
			if (application.__parent__.solutionPrefs) {
				var lineHeight = solutionPrefs.clientInfo.popupHack.lineHeight
				var topShift = solutionPrefs.clientInfo.popupHack.topShift
			}
			else {
				var lineHeight = 0
				var topShift = 0
			}
			
			var btnInvisible = event.getElementName() + "_up"
			var currentLocationX = elements[btnInvisible].getLocationX()
			var currentLocationY = elements[btnInvisible].getLocationY()
			
			//move "up" button to correct location
			elements[btnInvisible].setLocation(currentLocationX, currentLocationY - (topShift + (menuMain.length * lineHeight)))
			
			//popup menu
			globals.CODE_popup.popupMenu = menuMain
			globals.CODE_popup(null,null,elements[btnInvisible])
			
			//set invisible btn back to original location
			elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
		}
	}
}

/**
 *
 * @properties={typeid:24,uuid:"E87B2803-802A-49FE-9484-53FD0BF89D81"}
 * @AllowToRunInFind
 */
function FILTERS_list_control() {
	
	/*
	 *	TITLE    :	FILTERS_list_control
	 *			  	
	 *	MODULE   :	fw_NAV_engine
	 *			  	
	 *	ABOUT    :	run filter recipe, update fast find area
	 *			  	
	 *	INPUT    :		1) name of the filter
	 *			  		2) array with recipe of find requests
	 *			  		3) toolTip of filter hierarchy
	 *			  		4) sort string to perform on returned records
	 *			  		5) maximum number of records to load
	 *			  		6) method to run at the very end
	 *			  	
	 *	OUTPUT   :	
	 *			  	
	 *	REQUIRES :	solutionPrefs, globals.NAV_navigation_item_selected containING pk of currently selected workflow area's navigation item
	 *			  	
	 *	MODIFIED :	Mar 14, 2008 -- Troy Elliott, Data Mosaic
	 *			  	
	 */
	
	var currentNavItem = solutionPrefs.config.currentFormID
	var filterTitle = arguments[0]
	var filters = plugins.serialize.fromJSON(arguments[1])
	var toolTipItems = arguments[2].split(',')
	var toolTip = '<html><head></head><body><strong>Filter stack:</strong><br>'
	for (var i = 0 ; i < toolTipItems.length; i++) {
		toolTip += '&#160;'
		for (var j = 0 ; j < i * 2; j++) {
			toolTip += '&#160;'
		}
		toolTip += '- ' + toolTipItems[i] + '&#160;&#160;<br>'
	}
	toolTip += '</body></html>'
	var postSort = arguments[3]
	var postLimit = arguments[4]
	var postMethod = arguments[5]
	
	
	//if there are filters, run
	if (filters.length) {
		var formName = navigationPrefs.byNavItemID[currentNavItem].navigationItem.formToLoad
		var tblName = navigationPrefs.byNavItemID[currentNavItem].navigationItem.formToLoadTable
		var origFoundset = forms[formName].foundset.duplicateFoundSet()
		
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
		
		//for all filter line items that call a Fxion, eval it to get the return value
		for (var i = 0; i < filters.length; i++) {
			
			//a Fxion and a method specified
			if (filters[i].filterType == 'Function' && filters[i].filterMethod) {
				//if global, strip out global text
				if (filters[i].filterMethod.indexOf('globals.',0) >= 0) {
					var method = globals[filters[i].filterMethod.substr(8)]
				}
				else {
					var method = forms[solutionPrefs.config.currentFormName][filters[i].filterMethod]
				}
				
				//set argument if exist, otherwise null
				var args = (filters[i].columnValue) ? filters[i].columnValue : null
				
				//update value
				filters[i].columnValue = method(args)
			}
		}
		
		//there filters to apply
		if (filters.length) {
			//load all records so we can search on them
			forms[formName].controller.loadAllRecords()
			if (navigationPrefs.byNavItemID[currentNavItem].navigationItem.useFwList) { forms[navigationPrefs.byNavItemID[currentNavItem].listData.tabFormInstance].controller.loadAllRecords() }
			
			//start find
			forms[formName].controller.find()
			
			for (var i = 0; i < filters.length; i++) {
				var step = filters[i]
				
				var prefix = ''
				var suffix = ''
				
				switch (step.columnOperator) {
					case '>':
						prefix = '>'
						break
					case '<':
						prefix = '<'
						break
					case '>=':
						prefix = '>='
						break
					case '<=':
						prefix = '<='
						break
					case '!=':
						prefix = '!'
						break
					case 'like':
						prefix = suffix = '%'
						break
				}
				
				//if on current table, find there
				if (step.columnRelation == tblName) {
					forms[formName][step.columnName] = prefix + step.columnValue + suffix
				}
				//find through relation
				else {
					forms[formName][step.columnRelation][step.columnName] = prefix + step.columnValue + suffix
				}
			}
			//execute find
			var results = forms[formName].controller.search()
		}
		
		//post-processing and set find/filter text if results
		if (results) {
			//post sort specified
			if (postSort) {
				forms[formName].controller.sort(postSort)
				
				//clear current field sorted by and direction on workflow form
				navigationPrefs.byNavItemID[currentNavItem].listData.sortField = null
				navigationPrefs.byNavItemID[currentNavItem].listData.sortDirection = null
			}
			//existing sort on that foundset
			else if (navigationPrefs.byNavItemID[currentNavItem].listData.sortField && navigationPrefs.byNavItemID[currentNavItem].listData.sortDirection) {
				forms[formName].controller.sort(navigationPrefs.byNavItemID[currentNavItem].listData.sortField + ' ' + navigationPrefs.byNavItemID[currentNavItem].listData.sortDirection)
			}
			if (postLimit) {
				var jsTable = databaseManager.getTable(forms[formName].foundset)
				var pkCols = jsTable.getRowIdentifierColumnNames()
				
				//MEMO: does not account for multiple primary keys on a table
				var primaryKey = pkCols[0]
				if (primaryKey) {
					var originalIDs = databaseManager.getFoundSetDataProviderAsArray(forms[formName].foundset,primaryKey)
					originalIDs = originalIDs.slice(0,postLimit)
					var loadSet = databaseManager.convertToDataSet(originalIDs)
					forms[formName].controller.loadRecords(loadSet)
				}
			}
			if (postMethod) {
				//if global, strip out global text
				if (postMethod.indexOf('globals.',0) >= 0) {
					globals[postMethod.substr(8)]()
				}
				else {
					forms[solutionPrefs.config.currentFormName][postMethod]()
				}
			}
			
			globals.TRIGGER_fastfind_display_set('Filter: ' + filterTitle,toolTip,filterTitle)
			globals.TRIGGER_ul_refresh_all()
		}
		//return original foundset
		else {
			forms[formName].controller.loadRecords(origFoundset)
			forms[navigationPrefs.byNavItemID[currentNavItem].listData.tabFormInstance].controller.loadRecords(origFoundset)
	//		UL_fill_data()
			globals.DIALOGS.showInfoDialog('No records found','No records found while filtering ' + filterTitle + '.')
		}
		
		//LOG ul filter
		globals.TRIGGER_log_create('UL Filters',
					filterTitle,
					serverName,
					tableName,
					pkName,
					pkActedOn,
					results
				)
	}
}

/**
 *
 * @properties={typeid:24,uuid:"B4F40B97-AF64-4A4F-8550-F79BC5B4E299"}
 */
function FX_multitier_menu() {
	
	/*
	 *	TITLE    :	FX_multitier_menu
	 *			  	
	 *	MODULE   :	fw_NAV_engine
	 *			  	
	 *	ABOUT    :	recursively build filter pop-up menu
	 *			  	
	 *	INPUT    :	
	 *			  	
	 *	OUTPUT   :	
	 *			  	
	 *	REQUIRES :	
	 *			  	
	 *	MODIFIED :	July 16, 2008 -- Troy Elliott, Data Mosaic
	 *			  	
	 */
	
	var allMenus = arguments[0]
	//var prefix = 'actionItem_'
	//var menuItem = prefix + arguments[1]
	var breadCrumb = (arguments[1]) ? (arguments[1]+',') : ''
	var menu = new Array()
	var check = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].lastFindField
	
	if (allMenus) {
		//all items for specified menu
		for ( var j = 0 ; j < allMenus.length ; j++ ) {
			//only work with menus with a name (unless deriving, and then proceed)
			if (allMenus[j].menuName || !(allMenus[j] instanceof Array)) {
				//if derived (position is not an array), build it
				if (!(allMenus[j] instanceof Array)) {
					var vlItems = application.getValueListItems(allMenus[j].valuelist)
					
					//there are values in this value list
					if (vlItems && vlItems.getMaxRowIndex()) {
						//display/real values
						var displayValues = vlItems.getColumnAsArray(1)
						var realValues = vlItems.getColumnAsArray(2)
				
						//create array for filter specs
						var dynamicFilters = new Array()
						
						//create up to the first 100 values of specified valuelist
						for (var k = 0; k < displayValues.length && k < 100; k++) {
							//new position
							dynamicFilters.push(new Array())
							var dynamicFilter = dynamicFilters[dynamicFilters.length - 1]
							
							//add menu name
							dynamicFilter.menuName = (displayValues[k]) ? displayValues[k] : null
							
							//add post processing information
							dynamicFilter.postSort = (allMenus[j].postSort) ? allMenus[j].postSort : null
							dynamicFilter.postMethod = (allMenus[j].postMethod) ? allMenus[j].postMethod : null
							dynamicFilter.postLimit = (allMenus[j].postLimit) ? allMenus[j].postLimit : null
							
							//go through filter spec items and plop down filter spec
							dynamicFilter.push({
										columnName	:	allMenus[j].columnName,
										columnOperator	: allMenus[j].operator,
										columnRelation	: allMenus[j].columnRelation,
										columnValue	:	(allMenus[j].valuelistType == 'Display') ? displayValues[k] : ((allMenus[j].valuelistType == 'Stored') ? realValues[k] : null),
										filterType	:	'Value',
										filterMethod	:	null
									})
						}
					}
					
					var subMenu = FX_multitier_menu(dynamicFilters,breadCrumb + allMenus[j].menuName)
					if (subMenu.length) {
						menu.push(plugins.popupmenu.createMenuItem(allMenus[j].menuName + "", subMenu))
					}
				}
				//if a filter node, attach submenu
				else if (allMenus[j].actionID) {
					var subMenu = FX_multitier_menu(allMenus[j],breadCrumb + allMenus[j].menuName)
					if (subMenu.length) {
						menu.push(plugins.popupmenu.createMenuItem(allMenus[j].menuName + "", subMenu))
					}
				}
				//if a filter item, attach item
				else {
					menu.push(plugins.popupmenu.createCheckboxMenuItem(allMenus[j].menuName + "", FILTERS_list_control))
					
					var theArray = (allMenus[j] instanceof Array) ? allMenus[j].slice(0) : new Array()
					
					menu[menu.length - 1].setMethodArguments(
										allMenus[j].menuName,
										plugins.serialize.toJSON(theArray),
										breadCrumb + allMenus[j].menuName,
										allMenus[j].postSort,
										allMenus[j].postLimit,
										allMenus[j].postMethod
										)
					
					//set check mark
					if (check == menu[menu.length - 1].text) {
						menu[menu.length - 1].setSelected(true)
					}
					else {
						menu[menu.length - 1].setSelected(false)
					}
					
					//disable dividers
					if (menu[menu.length - 1].text == '-') {
						menu[menu.length - 1].setEnabled(false)
					}
				}
			}
		}
	}
	
	return menu
}


/**
 *
 * @properties={typeid:24,uuid:"456C9EA5-9A98-416A-946A-F67F91665287"}
 */
function REC_new() {
	if (application.__parent__.solutionPrefs) {
		
		var formName = solutionPrefs.config.currentFormName
		
		//grab the actions to this
		if (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.add) {
			var actionItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.add
			methodTypes = actionItem.methodType
			methods = actionItem.method
		}
		
		//if default add method overridden
		if (methods) {
			//only eval method if method type set properly
			if (methodTypes != null || methodTypes != '' && methods) {
				with (forms[formName]) {
					eval(methods)
				}
			}
			else {
				globals.DIALOGS.showInfoDialog('Config incomplete', 'Return to navigation setup to complete this action', 'OK')
			}
		}
		//execute default record add
		else {
			forms[formName].foundset.newRecord(forms[formName].foundset.getSelectedIndex(),true)
		}
		
		//add in new blank row when this is slickgrid
		if (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.slickGrid) {
			forms[navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.tabFormInstance].SLICK_newRecord()
		}
	
		//LOG ul add
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
		globals.TRIGGER_log_create('UL Add',
					((methods) ? methods : 'Default add'),
					serverName,
					tableName,
					pkName,
					pkActedOn
				)
		
	}
}

/**
 * @param {JSEvent} [event]
 * @param {Boolean} [list] Return the popupmenu list only
 *
 * @properties={typeid:24,uuid:"C5E9A8BF-661D-415E-AAE2-3B79A8D2AAC6"}
 * @AllowToRunInFind
 */
function REPORTS_list(event,list) {
	
	/*
	 *	TITLE    :	REPORTS_list
	 *			  	
	 *	MODULE   :	fw_NAV_engine
	 *			  	
	 *	ABOUT    :	pop the menu up instead of the default down
	 *			  	uses a secondary invisible object on the layout which is behind the clicked button
	 *			  	move secondary object up far enough to drop down a popup that hits the top edge
	 *			  		of clicked btn
	 *			  	when menu item is selected, return secondary object to original location
	 *			  	
	 *			  	forms to load from action_item table
	 *			  	
	 *	INPUT    :	
	 *			  	
	 *	OUTPUT   :	
	 *			  	
	 *	REQUIRES :	solutionPrefs, globals.NAV_navigation_item_selected containing pk of currently selected workflow area's navigation item
	 *			  	
	 *	MODIFIED :	Nov 20, 2007 -- Troy Elliott, Data Mosaic
	 *			  	
	 */
	
	//override with custom action
	if (solutionPrefs.config.currentFormName && solutionModel.getForm(solutionPrefs.config.currentFormName).getMethods(true).map(function (item) {return item.getName()}).indexOf('OV_REPORTS_list') != -1) {
		forms[solutionPrefs.config.currentFormName].OV_REPORTS_list()
		return
	}
	
	//grab the id_report for all reports
	var valueList = new Array()
	var reportIDs = new Array()
	var reportForms = new Array()
	var reportMethods = new Array()
	var reportWrappers = new Array()
	var reportHTMLs = new Array()
	var allReports = databaseManager.getFoundSet('sutra','sutra_report')
	
	for (var i = 0; i < navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.reports.length ; i++) {
		var reportItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.reports[i]
		valueList.push(reportItem.menuName)
		reportIDs.push(reportItem.idReport)
		
		if (reportItem.idReport) {
			allReports.find()
			allReports.id_report = reportItem.idReport
			var results = allReports.search()
			
			if (results) {
				var reportForm = allReports.report_form
				var reportMethod = allReports.report_method
				var reportWrapper = allReports.flag_wrapper
				var reportHTML = allReports.source
			}
			else {
				var reportForm = null
				var reportMethod = null
				var reportWrapper = null
				var reportHTML = null
			}
		}
		else {
			var reportForm = null
			var reportMethod = null
			var reportWrapper = null
			var reportHTML = null
		}
		
		reportForms.push(reportForm)
		reportMethods.push(reportMethod)
		reportWrappers.push(reportWrapper)
		reportHTMLs.push(reportHTML)
	}
	
	//only show pop-up if there are enabled values
	if (valueList.length) {
		//build menu, set menu method arguments
		var menu = new Array()
		for ( var i = 0 ; i < valueList.length ; i++ ) {
		    menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", REPORTS_list_control)
			menu[i].setMethodArguments(reportForms[i],reportMethods[i],reportWrappers[i],reportHTMLs[i],valueList[i],reportIDs[i])
			
			//disable dividers
			if (valueList[i] == '-') {
				menu[i].setEnabled(false)
			}
		}
		
		//we need this list to use elsewhere
		if (list) {
			return menu
		}
		
		//hack not required
		if (utils.stringToNumber(application.getVersion()) >= 5) {
			//pop up the popup menu
			var elem = event.getSource()
			if (elem != null) {
			    plugins.popupmenu.showPopupMenu(elem, menu);
			}
		}
		//legacy
		else {
			//allow popup to approximately work even when solutionPrefs isn't defined
			if (application.__parent__.solutionPrefs) {
				var lineHeight = solutionPrefs.clientInfo.popupHack.lineHeight
				var topShift = solutionPrefs.clientInfo.popupHack.topShift
			}
			else {
				var lineHeight = 0
				var topShift = 0
			}
			
			var btnInvisible = event.getElementName() + "_up"
			var currentLocationX = elements[btnInvisible].getLocationX()
			var currentLocationY = elements[btnInvisible].getLocationY()
			
			//move "up" button to correct location
			elements[btnInvisible].setLocation(currentLocationX, currentLocationY - (topShift + (menu.length * lineHeight)))
			
			//popup menu
			globals.CODE_popup.popupMenu = menu
			globals.CODE_popup(null,null,elements[btnInvisible])
			
			//set invisible btn back to original location
			elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
		}
	}
}

/**
 *
 * @properties={typeid:24,uuid:"348B1945-7524-40E4-9B1A-E1C2BFCC6981"}
 */
function REPORTS_list_control() {
	
	/*
	 *	TITLE    :	TABS_list_control
	 *			  	
	 *	MODULE   :	fw_NAV_engine
	 *			  	
	 *	ABOUT    :	switch out lower left tab (usually used for tabs)
	 *			  	
	 *	INPUT    :	formName, methodName
	 *			  	
	 *	OUTPUT   :	
	 *			  	
	 *	REQUIRES :	
	 *			  	
	 *	MODIFIED :	Mar 10, 2008 -- Troy Elliott, Data Mosaic
	 *			  	
	 */
	
	var formName = arguments[0]
	var methodName = arguments[1]
	var wrapper = arguments[2]
	var html = arguments[3]
	var itemName = arguments[4]
	var reportID = arguments[5]
	var navItemForm = solutionPrefs.config.currentFormName
	
	//prompt for how many records to print unless html specified
	if (wrapper && !html) {
		if (navItemForm && forms[navItemForm] && utils.hasRecords(forms[navItemForm].foundset)) {
			var whatPrint = globals.DIALOGS.showQuestionDialog(
							'Print report',
							'How many records do you want to print?',
							'Selected record',
							'Found records'/*,
							'Subset of records'*/
						)
			
			if (whatPrint) {
				var serverName = forms[navItemForm].foundset.getServerName()
				var tableName = forms[navItemForm].foundset.getTableName()
				
				var fsToPrint = databaseManager.getFoundSet(serverName, tableName)
				fsToPrint.clear()
				
				switch (whatPrint) {
					case 'Selected record':
						//get the pk of the selected record and load into foundset
						var record = forms[navItemForm][solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey]
						fsToPrint.loadRecords(databaseManager.convertToDataSet([record]))
						break
						
					case 'Found records':
						//get the recipe of found records and load into foundset
						var sql = databaseManager.getSQL(forms[navItemForm].foundset)
						var params = databaseManager.getSQLParameters(forms[navItemForm].foundset)
						fsToPrint.loadRecords(sql, params)
						break
						
					case 'Subset of records':
						//show FiD to specify first/last/start from current and how many
						break
				}
			}
		}
		else {
			globals.DIALOGS.showErrorDialog(
					'Print error',
					'There are no records to print'
				)
			return
		}
	}
	
	//a form to print, a method to run, and they both exist
	if (formName && methodName && forms[formName] && forms[formName][methodName]) {
		//pass foundset from wrapper method (if any), formname, html
		if (fsToPrint) {
			forms[formName][methodName](fsToPrint,navItemForm,html)
		}
		//no foundset from wrapper, pass only formname
			//TODO: should probably standardize on arguments
		else {
			forms[formName][methodName](navItemForm,html)
		}
	}
	//do something with html; ignoring form
	else if (html) {
		//check if valid url or just html
		if (html.indexOf('http') == 0) {
			scopes.DS.print.preview(itemName + '.pdf',scopes.DS.print.utils.convertToPDFByteArray.fromHTMLURL(html))
		}
		else {
			scopes.DS.print.preview(itemName + '.pdf',scopes.DS.print.utils.convertToPDFByteArray.fromHTMLData(html))
		}
	}
	//no method, show print preview
	else if (formName && forms[formName]) {
		//something to print from wrapper method, load it
		if (utils.hasRecords(fsToPrint)) {
			forms[formName].controller.loadRecords(fsToPrint)
		}
		
		//webclient from router, create pdf, show it inline
		if (solutionPrefs.config.webClient && scopes.globals.DATASUTRA_router_enable) {
			scopes.DS.print.preview(formName + '.pdf',scopes.DS.print.utils.convertToPDFByteArray.fromServoyForm(formName))
		}
		//smart client, use standard print preview
		else {
			forms[formName].controller.showPrintPreview()
		}
		
		var onlyPreview = true
	}
	
	//LOG ul reporting
	globals.TRIGGER_log_create('UL Reports',
				reportID,
				itemName,
				formName,
				((onlyPreview) ? 'Default print preview' : formName + '.' + methodName)
			)
}

/**
 * @param {JSEvent} [event]
 * 
 * @properties={typeid:24,uuid:"B5878712-AAE0-4E32-93C0-D62AA6F1DE87"}
 */
function TABS_list(event) {
	
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
	
	if (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs) {
	
		for (var i = 0; i < navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs.length ; i++) {
			var actionItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs[i]
			valueList.push(actionItem.menuName)
			formNames.push(actionItem.formToLoad)
		}
		
		var formName = event.getFormName()
		
		//only show pop-up if there are enabled values
		if (valueList.length) {
			//tack on universal list to the top of the array
			valueList.unshift(globals.CODE_text_initial_caps(forms[formName].elements.record_heading.text))
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
					menu[i].setMethodArguments(formNames[i],valueList[i],i-1)
				}
				else {
					menu[i].setEnabled(false)
				}
				
				//disable dividers
				if (valueList[i] == '-') {
					menu[i].setEnabled(false)
				}
			}
			
			//push menu down to the header line
			var btnInvisible = event.getElementName() + "_down"
			var currentLocationX = forms[formName].elements[btnInvisible].getLocationX()
			var currentLocationY = forms[formName].elements[btnInvisible].getLocationY()
			
			forms[formName].elements[btnInvisible].setLocation(currentLocationX, currentLocationY + 3)
			
			//popup menu
			globals.CODE_popup.popupMenu = menu
			globals.CODE_popup(null,null,forms[formName].elements[btnInvisible])
			
			//set invisible btn back to original location
			forms[formName].elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
		}
	}
}

/**
 *
 * @properties={typeid:24,uuid:"73A07072-55E3-4AE9-96D8-E3F215E66D03"}
 */
function TABS_list_control() {
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
	var tabSelected = arguments[2]
	var baseForm = solutionPrefs.config.formNameBase
	var prefName = 'Custom tab ' + solutionPrefs.config.currentFormID + ': ' + formName
	var listTabForm = (solutionPrefs.config.webClient) ? 'DATASUTRA_WEB_0F__list__universal' : 'DATASUTRA_0F_solution'
	
	if (forms[formName]) {
		//set global that end users use in their code
		globals.NAV_universal_selected_tab = formName
		
		//if not loaded, add tab
		if (formName != 'DATASUTRA_0F_solution__blank_2' && !navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
			
			//assign to list tab panel
			forms[listTabForm].elements.tab_content_B.addTab(forms[formName],'',null,null,null,null)
			forms[listTabForm].elements.tab_content_B.tabIndex = forms[listTabForm].elements.tab_content_B.getMaxTabIndex()
			
			//save status info
			navigationPrefs.byNavSetName.configPanes.itemsByName[prefName] = new Object()
			navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData = {
										tabNumber : forms[listTabForm].elements.tab_content_B.tabIndex,
										dateAdded : application.getServerTimeStamp()
								}
			
		}
		//set tab to this preference
		else {
			forms[listTabForm].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData.tabNumber
		}
		
		//using a custom tab, note which one it is
		if (tabSelected >= 0) {
			navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs.tabPosn = tabSelected
		}
		//using default list (UL or other)
		else if (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs) {
			delete navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs.tabPosn
		}
		
		//LOG ul tab change
		globals.TRIGGER_log_create('UL Tabs',
							itemName,
							formName
							)
	}
}

/**
* @param {JSEvent} [event]
* 
* @properties={typeid:24,uuid:"4FEC9A26-4000-4FCC-BCEF-F8049DEA2DC8"}
*/
function TRANSACTION_start(event) {
	if (application.__parent__.solutionPrefs) {
		
		var formName = solutionPrefs.config.currentFormName
		var currentNavItem = solutionPrefs.config.currentFormID
		
		//grab the actions to this
		if (navigationPrefs.byNavItemID[currentNavItem].transactions) {
			var actionItem = navigationPrefs.byNavItemID[currentNavItem].transactions[0]
			var methodTypes = actionItem.methodType
			var methods = actionItem.method
		}
		
		//custom edit method
		if (methods) {
			//only eval method if method type set properly
			if (methodTypes != null || methodTypes != '' && methods) {
				with (forms[formName]) {
					eval(methods)
				}
			}
			else {
				globals.DIALOGS.showInfoDialog('Config incomplete', 'Return to navigation setup to complete this action', 'OK')
			}
		}
		//execute default edit method
		else {
			scopes.DS.transaction.start()
		}
		
		//css4 parent selectors (for comboboxes)
		scopes.DS.webStyleCSS4()
		
		//LOG
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
		globals.TRIGGER_log_create('Transaction start',
					((methods) ? methods : 'Default'),
					serverName,
					tableName,
					pkName,
					pkActedOn
				)
		
	}
}

/**
* @param {JSEvent} [event]
* 
* @properties={typeid:24,uuid:"FAA198D9-93DE-4DAE-9653-9478C3FEA47A"}
*/
function TRANSACTION_save(event) {
	if (application.__parent__.solutionPrefs) {
		
		var formName = solutionPrefs.config.currentFormName
		var currentNavItem = solutionPrefs.config.currentFormID
		
		//grab the actions to this
		if (navigationPrefs.byNavItemID[currentNavItem].transactions) {
			var actionItem = navigationPrefs.byNavItemID[currentNavItem].transactions[1]
			var methodTypes = actionItem.methodType
			var methods = actionItem.method
		}
		
		//have any changes been made?
		var redrawUL = databaseManager.hasNewRecords(forms[formName].foundset) || databaseManager.hasRecordChanges(forms[formName].foundset)
		
		//custom save method
		if (methods) {
			//only eval method if method type set properly
			if (methodTypes != null || methodTypes != '' && methods) {
				with (forms[formName]) {
					eval(methods)
				}
			}
			else {
				globals.DIALOGS.showInfoDialog('Config incomplete', 'Return to navigation setup to complete this action', 'OK')
			}
		}
		//execute default save method
		else {
			scopes.DS.transaction.save()
		}
		
		//css4 parent selectors (for comboboxes)
		scopes.DS.webStyleCSS4()
		
		if (redrawUL) {
			scopes.DS.webULPrettify(true)
		}
		
		//LOG
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
		globals.TRIGGER_log_create('Transaction save',
					((methods) ? methods : 'Default'),
					serverName,
					tableName,
					pkName,
					pkActedOn
				)
		
	}
}

/**
* @param {JSEvent} [event]
* 
* @properties={typeid:24,uuid:"F53BDA26-BC1F-46E0-B5FB-92D6C3054F89"}
*/
function TRANSACTION_cancel(event) {
	if (application.__parent__.solutionPrefs) {
		
		var formName = solutionPrefs.config.currentFormName
		var currentNavItem = solutionPrefs.config.currentFormID
		
		//grab the actions to this
		if (navigationPrefs.byNavItemID[currentNavItem].transactions) {
			var actionItem = navigationPrefs.byNavItemID[currentNavItem].transactions[2]
			var methodTypes = actionItem.methodType
			var methods = actionItem.method
		}
		
		//have any changes been made?
		var redrawUL = databaseManager.hasNewRecords(forms[formName].foundset) || databaseManager.hasRecordChanges(forms[formName].foundset)
		
		//custom cancel method
		if (methods) {
			//only eval method if method type set properly
			if (methodTypes != null || methodTypes != '' && methods) {
				with (forms[formName]) {
					eval(methods)
				}
			}
			else {
				globals.DIALOGS.showInfoDialog('Config incomplete', 'Return to navigation setup to complete this action', 'OK')
			}
		}
		//execute default cancel method
		else {
			scopes.DS.transaction.cancel()
		}
		
		//css4 parent selectors (for comboboxes)
		scopes.DS.webStyleCSS4()
		
		if (redrawUL) {
			scopes.DS.webULPrettify(true)
		}
	
		//LOG
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
		globals.TRIGGER_log_create('Transaction save',
					((methods) ? methods : 'Default'),
					serverName,
					tableName,
					pkName,
					pkActedOn
				)
		
	}
}