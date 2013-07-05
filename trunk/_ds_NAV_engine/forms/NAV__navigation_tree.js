/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"D711A8F9-DB0C-4C1A-B62E-0FD72DC276C9",variableType:4}
 */
var _faveMode = 0;

/**
 * Array that will hold information about currently showing rows.
 * 
 * @properties={typeid:35,uuid:"8BEF2D83-B94F-4611-BEC9-D0E272F3F73D",variableType:-4}
 */
var _rows = null;

/**
 * @properties={typeid:24,uuid:"835C298B-5875-4CDB-9C5F-B719F27951F6"}
 */
function ACTIONS_list(input) {
	//actions to perform for favorites
	if (globals.DATASUTRA_navigation_set == 0) {
		var valueList = [
			'Flat list',
			'Grouped'
		]
	}
	//actions to perform for regular
	else {
		var valueList = [
			'Toggle expand/collapse status'
		]
	}
	
	//called to depress menu
	if (input instanceof JSEvent) {
		var elem = forms[input.getFormName()].elements[input.getElementName()]
		
		//build menu
		var menu = new Array()
		for ( var i = 0 ; i < valueList.length ; i++ ) {
			//in favorites mode, show check next to right mode
			if (globals.DATASUTRA_navigation_set == 0 && _faveMode == i) {
				menu[i] = plugins.popupmenu.createCheckboxMenuItem(valueList[i] + "", ACTIONS_list)
				menu[menu.length - 1].setSelected(true)
			}
			else {
				menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list)
			}
			
			//pass arguments
			menu[i].setMethodArguments(i)
			
			//disable dividers
			if (valueList[i] == '-') {
				menu[i].setEnabled(false)
			}
		}
		
		//pop down the popup menu
		if (elem != null) {
			plugins.popupmenu.showPopupMenu(elem, menu)
		}
	}
	else {
		//favorites mode
		if (globals.DATASUTRA_navigation_set == 0) {
			switch (input) {
				case 0:	//flat list
					_faveMode = 0
					forms.NAV__navigation_tree__rows.LIST_redraw(null,null,true,false,true)
					break
				case 1: //grouped
					_faveMode = 1
					forms.NAV__navigation_tree__rows.LIST_redraw(null,null,true,false,true)
					break
			}
		}
		//normal mode
		else {
			switch (input) {
				case 0:	//toggle tree
					LIST_toggle_all()
					break
			}
		}
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param	{Boolean}	firstShow Form is shown first time after load.
 * @param	{JSEvent}	event The event that triggered the action.
 *
 * @properties={typeid:24,uuid:"647B48B0-374A-4486-9665-C7ABD85D302A"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow && application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
		//url was requested before login; go there now
		if (globals.DATASUTRA_router.length && globals.DATASUTRA_router[0] && globals.DATASUTRA_router[0].pathString) {
			var path = globals.DATASUTRA_router[0].pathString
			path = path.split('/')
			//pop off first and last /
			if (!path[0]) {
				path.splice(0,1)
			}
			if (!path[path.length - 1]) {
				path.pop()
			}
			
			var url = {
				set : path[0],
				item : path[1]
			}
			
			var nav = navigationPrefs.siteMap
			var itemID
			
			//don't navigtate to login
			if (url.set != 'DSLogin') {
				//particular item specified
				if (url.set && nav[url.set] && url.item) {
					//this item exists
					if (nav[url.set][url.item]) {
						itemID = nav[url.set][url.item].navItemID
					}
				}
				//only nav set specified, grab first navigation item
				else if (url.set && nav[url.set]) {
					//don't really need a loop, but need to grab an element inside the set referenced
					for (var i in nav[url.set]) {
						itemID = navigationPrefs.byNavSetID[nav[url.set][i].details.navigationItem.idNavigation].itemsByOrder[0].navigationItem.idNavigationItem
						break
					}
				}
			}
		}
		
		//use 1st item in history for itemID or last item in this navigation set or default item for this navset
		var navItemID = itemID || navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].lastNavItem || navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[0].navigationItem.idNavigationItem
		
		//create list
		var treeDepth = LIST_generate(navItemID)
		
		//call router to switch entire page
		if (globals.DATASUTRA_router_enable) {
			//reset flag that this is initial history load
			if (globals.DATASUTRA_router_initialHix) {
				globals.DATASUTRA_router_initialHix = false
			}
			//when running history on login, do not draw navigation pane
			else {
				//4th param is special case for embedded login from external site
				globals.DS_router(null,null,navItemID,globals.DATASUTRA_router_login)
			}
		}
		//smart or straight-up web client
		else {
			//update labels
			LABEL_update(treeDepth > 1)
			
			//go to selected form; notify load forms routine that this is the first one loaded
			globals.NAV_workflow_load(
								navItemID,
								null,
								null,
								true
							)
		}
		
		//web only events
		if (solutionPrefs.config.webClient) {
			//show highlighter
			plugins.WebClientUtils.setExtraCssClass(forms.NAV__navigation_tree__rows.elements[forms.NAV__navigation_tree__rows._elementSelected], 'gfxLeftHilite')
			
			//flip on navigation switcher immediately
			plugins.WebClientUtils.executeClientSideJS("setTimeout(function(){$('#form_NAV__navigation_tree__rows div > div > div > span:parent:not([id])').on('click',null,function(){bigIndicator(true);});},7500);")
		}
	}
}

/**
 * Set the navigation set label and option wheel status
 * 
 * @param {Number}	[optionsVisible] Show/hide the option wheel
 * 
 * @properties={typeid:24,uuid:"849FC6DA-C63E-411E-A99E-F13E64909928"}
 */
function LABEL_update(optionsVisible) {
	//favorites mode
	if (globals.DATASUTRA_navigation_set == 0) {
		var displayValue = 'FAVORITES'
		
		//show action wheel
		elements.btn_options.visible = true
	}
	//non-favorites mode
	else {
		//nothing passed in
		if (typeof optionsVisible != 'boolean') {
			optionsVisible = false
			
			//loop over all shown navigation items looking for two levels
			for (var i = 0; i < _rows.length && !optionsVisible; i++) {
				//there's two levels deep at some place in the tree
				if (_rows[i].nodeTwo) {
					optionsVisible = true
				}
			}
		}
		
		//toggle action wheel
		elements.btn_options.visible = optionsVisible
	
		var displayValue = application.getValueListDisplayValue('NAV_navigation_set',globals.DATASUTRA_navigation_set)
	}
	
	//update label
	elements.lbl_header.text = (displayValue) ? displayValue.toUpperCase() : 'WORKSPACE'
	elements.lbl_header.toolTipText = (displayValue) ? '<html><strong>' + displayValue + '</strong> workspace' : ''
}

/**
 * Trash existing rows and add new ones.
 * 
 * @param	{Number}	selected The navigation item id to be selected.
 * 
 * @properties={typeid:24,uuid:"20597BDD-71FC-4E4A-A985-A5EA2E1E66F8"}
 */
function LIST_generate(selected) {
	//how many levels in this tree
	var treeDepth = 1
	
	if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
		
		//get things to display
		var navigationSet = 
		_rows = 
			new Array()
		
		if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set] && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder) {
			for (var i = 0; i < navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length ; i++) {
				var navItem = navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i]
				
				//only work with showing navigation items
				if (navItem.navigationItem.rowStatusShow) {
					navigationSet.push({
									navItemID : navItem.navigationItem.idNavigationItem,
									navItemName : navItem.navigationItem.itemName,
									nodeOne : navItem.navigationItem.nodeOne,
									nodeTwo : navItem.navigationItem.nodeTwo,
									description : navItem.navigationItem.description,
									expanded : navItem.navigationItem.rowStatusExpanded,
									fave : navItem.navigationItem.favorite,
									arrayPosn : i
								})
					
				}
				
				//there's two levels deep at some place in the tree
				if (navItem.navigationItem.nodeTwo) {
					treeDepth = 2
				}
			}
		}
		
		//get form and clear
		var formName = 'NAV__navigation_tree__rows'
		var thisForm = solutionModel.getForm(formName)
		
		//remove all elements from target form
		var allComponents = thisForm.getComponents()
		for (var i = 0; i < allComponents.length; i++) {
			var thisComponent = allComponents[i]
			thisForm.removeComponent(thisComponent.name)
		}
		
		//if navigation items, build them
		if (navigationSet.length) {
			//which one to select not specified, select first
			if (typeof selected != 'number') {
				selected = navigationSet[0].navItemID
			}
			
			//loop through range of records and build html list
			for ( var i = 0 ; i < navigationSet.length ; i++ ) {
				//nav item that has all data
				var details = navigationSet[i]
				
				var rowDisplay = details.navItemName
				
				var triangleOpen = false
				var triangleClosed = false
				
				// expanded
				if (details.expanded && !details.nodeTwo && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1] && (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1].navigationItem.nodeOne == details.nodeOne)) {
					triangleOpen = true
				}
				// collapsed (not expanded with children)
				else if (!details.nodeTwo && !details.expanded && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1] && (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1].navigationItem.nodeOne == details.nodeOne)) {
					triangleClosed = true
				}
				
				//HIGHLIGHT
				var lblClick = thisForm.newLabel('',0,i * 20,thisForm.width,20)
				lblClick.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST
				lblClick.formIndex = 1
				lblClick.name = 'lbl_rowback_' + i
				lblClick.showClick = false
				lblClick.showFocus = false
				lblClick.transparent = true
				lblClick.mediaOptions = SM_MEDIAOPTION.REDUCE | SM_MEDIAOPTION.ENLARGE
				lblClick.onAction = thisForm.getFormMethod('LIST_redraw')
				lblClick.rolloverCursor = SM_CURSOR.HAND_CURSOR
				if (!solutionPrefs.config.webClient) {
					lblClick.rolloverImageMedia = solutionModel.getMedia('row_selected_light.png')
				}
				if (details.description) {
					lblClick.toolTipText = details.description
				}
				
				//TRIANGLE
				//parent expanded
				if (triangleOpen) {
					var lblTriangle = thisForm.newLabel('',0,i * 20,15,20)
					lblTriangle.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.WEST
					lblTriangle.formIndex = 100
					lblTriangle.name = 'lbl_triangle_' + i
					lblTriangle.showClick = false
					lblTriangle.showFocus = false
					lblTriangle.transparent = true
					lblTriangle.styleClass = 'tree_arrow_open'
					lblTriangle.mediaOptions = SM_MEDIAOPTION.CROP
					lblTriangle.onAction = thisForm.getFormMethod('LIST_expand_collapse')
					lblTriangle.rolloverCursor = SM_CURSOR.HAND_CURSOR
					lblTriangle.toolTipText = 'Collapse'
//					lblTriangle.rolloverImageMedia = "media:///row_selected.png"
				}
				//parent collapsed (not expanded with children)
				else if (triangleClosed) {
					var lblTriangle = thisForm.newLabel('',0,i * 20,15,20)
					lblTriangle.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.WEST
					lblTriangle.formIndex = 100
					lblTriangle.name = 'lbl_triangle_' + i
					lblTriangle.showClick = false
					lblTriangle.showFocus = false
					lblTriangle.transparent = true
					lblTriangle.styleClass = 'tree_arrow_close'
					lblTriangle.mediaOptions = SM_MEDIAOPTION.CROP
					lblTriangle.onAction = thisForm.getFormMethod('LIST_expand_collapse')
					lblTriangle.rolloverCursor = SM_CURSOR.HAND_CURSOR
					lblTriangle.toolTipText = 'Expand'
//					lblTriangle.rolloverImageMedia = "media:///row_selected.png"
				}
				
				//DATA
				var lblData = thisForm.newLabel(rowDisplay,0,i * 20 ,thisForm.width,20)
				lblData.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST
				lblData.formIndex = 10
				lblData.name = 'lbl_row_' + i
				//put action on the text in webclient, but not smart client
				if (solutionPrefs.config.webClient) {// && !details.navItemID == selected) {
					lblData.onAction = thisForm.getFormMethod('LIST_redraw')
				}
				lblData.showClick = false
				lblData.showFocus = false
				lblData.transparent = true
				lblData.styleClass = 'tree'
				lblData.rolloverCursor = SM_CURSOR.HAND_CURSOR
				
				//there are no children anywhere in this branch
				if (treeDepth == 1) {
					lblData.x = 8
				}
				//more than one level of branches
				else {
					//this is a second-tier branch
					if (details.nodeTwo) {
						lblData.x = 28
					}
					//top-level branch
					else {
						lblData.x = 18
					}
				}
				
				//row selected, highlight
				if (details.navItemID == selected) {
					//HIGHLIGHT
					if (solutionPrefs.config.webClient) {
//						lblClick.imageMedia = solutionModel.getMedia("row_selected.png")
						var elem = lblClick.name
//						lblClick.background = '#262626'
//						lblClick.transparent = false
					}
					else {
						lblClick.imageMedia = solutionModel.getMedia("row_selected.png")
					}
					lblClick.onAction = null
					lblClick.rolloverCursor = SM_CURSOR.DEFAULT_CURSOR
					lblClick.rolloverImageMedia = null
					
					//TRIANGLE
					//parent expanded
					if (triangleOpen) {
//						<a href="javascript:LIST_expand_collapse(' + details.navItemID + ')">
						lblTriangle.styleClass = 'tree_select_arrow_open'
//						lblTriangle.rolloverImageMedia = "media:///row_selected.png"
					}
					//parent collapsed (not expanded with children)
					else if (triangleClosed) {
						lblTriangle.styleClass = 'tree_select_arrow_close'
//						lblTriangle.rolloverImageMedia = "media:///row_selected.png"
					}
					
					//DATA
					lblData.styleClass = 'tree_select'
					lblData.rolloverCursor = SM_CURSOR.DEFAULT_CURSOR
				}
			}
		}
		
		//set body part height
		thisForm.getBodyPart().height = i * 20
		
		//recreate ui
		forms[formName].controller.recreateUI()
		
		//an element is selected, add the style class
		if (elem && solutionPrefs.config.webClient) {
			forms.NAV__navigation_tree__rows._elementSelected = elem
		}
		
		//how many levels does this tree have
		return treeDepth
	}
}

/**
 * Adjusts scroll position of list so that selected 'record' is visible
 * 
 * @param	{String}	formName Name of form to scroll.
 * @param	{Number}	idNavItem List item to select.
 * 
 * @returns	{Boolean}	Scroll required.
 * 
 * @properties={typeid:24,uuid:"C8E2FCEF-C1C4-42B6-B179-4C73ECC94ED0"}
 */
function LIST_rescroll(idNavItem) {
	if (plugins.ScrollerPlus) {
		var scrollRows = plugins.ScrollerPlus.getScroller(controller.getName() + '__rows', plugins.ScrollerPlus.SCROLLER_TYPE.FORM, plugins.ScrollerPlus.SCROLL_ORIENTATION.VERTICAL)
	}
	
	//if navigation items in this set, do the appropriate toggle
	if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set] && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length) {
		var selected = -1
		var indexStart = 1
		var indexEnd = 0
		
		for (var i = 0; i < navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length; i++) {
			//this item is visible
			if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.rowStatusShow) {
				//this is the selected
				if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.idNavigationItem == idNavItem) {
					selected = indexEnd
				}
				indexEnd++
			}
		}
	}
	
	//information about scroll field
	var heightHTML = forms.DATASUTRA_0F_solution.elements.tab_content_A.getHeight()
	var rowHeight = 20
	var clickSize = Math.floor(heightHTML / 10) //the amount of one downward click in the scroll bar
	var rowScroll = heightHTML / rowHeight //Math.floor() gives the number of rows that can be displayed without scrolling
	var maxScroll = 5000 //(rowHeight * (indexEnd - indexStart + 1)) - heightHTML
	var currentScroll = scrollRows ? scrollRows.position : 0
	var currentTop = (currentScroll) ? Math.ceil(currentScroll / rowHeight) + 1 : 1 //index of record at top of scroll (add 1 to account for partial records)
	var currentBottom = currentTop + Math.floor(rowScroll) - 1 //subtract 1 to account for partial records, 1 for selected offset (in defintion of selected)
	var scrollPosn = null
	
	//selected item in loaded set
	if (indexStart <= selected && selected <= indexEnd) {
		//scroll up
		if (selected < currentTop) {
			//can fit without scroll
			if (selected <= Math.floor(rowScroll)) {
				scrollPosn = 0
			}
			//set to be a few down
			else {
				var scrollY = ((selected - 1) * 20) //-1 to get the bottom of the prior record (in other words, the top of the record we want)
				//if there is room, set the scroll position to be slightly above the selected record
				if (Math.floor(rowScroll) > 4) {
					scrollY -= 40
				}
				scrollPosn = scrollY
			}
		}
		//scroll down
		else if (selected > currentBottom) {
			//can fit with scroll all the way to the bottom
			if ((indexEnd - Math.floor(rowScroll) < selected) && (selected < indexEnd)) {
				scrollPosn = maxScroll
			}
			//set to be a few up
			else {
				var scrollY = ((selected - 1) * 20) //-1 to get the bottom of the prior record (in other words, the top of the record we want)
				//if there is room, set the scroll position to be slightly above the selected record
				if (Math.floor(rowScroll) > 4) {
					scrollY -= 60
				}
				scrollPosn = scrollY
			}
		
		}
		//otherwise selected item in viewable area; no action necessary
	}
	
	if (typeof scrollPosn == 'number' && scrollRows) {
		application.updateUI()
		scrollRows.position = scrollPosn
		return true
	}
	//if no scrolling took place, return false
	else {
		return false
	}
}

/**
 * Expands/collapses all (opposite of what currently clicked on item is)
 * 
 * @properties={typeid:24,uuid:"9EFCB0C9-C189-4CF6-82DF-C029FB818CCE"}
 */
function LIST_toggle_all() {
	if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
		var idNavItem = solutionPrefs.config.currentFormID
		
		//if navigation items in this set, toggle
		if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length) {
			//find position in array
			for (var i = 0; i < navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length; i++) {
				if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.idNavigationItem == idNavItem) {
					var found = i
					break
				}
			}
			
			if (typeof found == 'number') {
				//current status
				var currentStatus = (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[found].navigationItem.nodeTwo || navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[found].navigationItem.rowStatusExpanded) ? true : false
				
				//toggle all items
				for (var i = 0; i < navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length; i++) {
					//toggle all nodeTwos
					if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.nodeTwo) {
						navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.rowStatusShow = !currentStatus
					}
					//toggle all nodeOnes
					else {
						navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.rowStatusExpanded = !currentStatus
					}
				}
				
				//branch no longer visible, select parent
				if (currentStatus && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[found].navigationItem.nodeTwo) {
					//find position in array
					//TODO: will this be the same found as above?
					found = null
					for (var i = navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length - 1; i >= 0; i--) {
						if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.idNavigationItem == idNavItem) {
							found = i
							break
						}
					}
					
					//find parent
					for (var i = found; i >= 0; i--) {
						if (!navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.nodeTwo) {
							forms.NAV__navigation_tree__rows.LIST_redraw(null,navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.idNavigationItem,true)
							break
						}
					}
				}
				//expanded, so stay on parent
				else {
					forms.NAV__navigation_tree__rows.LIST_redraw(null,idNavItem,true)
				}
				
				//re set up the screen
				globals.DS_router_recreateUI()
			}
		}
	}
}

/**
 * Trash existing rows and add new ones.
 * 
 * @param	{Number}	selected The record to be selected (index).
 * 
 * @properties={typeid:24,uuid:"AB5B3911-DC3F-4D1F-8B02-F7A7E3D5C825"}
 */
function LIST_favorites(selected) {
	//TODO: refire when space change occurs
	if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
		
//		see globals.NAV_universal_list_right_click for full definition
//		var fave = {
//				navItemID : currentNavItem,
//				display : displayItems[i],
//				datasource : record.foundset.getDataSource(),
//				//won't work for compound pk
//				pkName : databaseManager.getTable(record).getRowIdentifierColumnNames()[0],
//				pk : record.getPKs()[0],
//				meta : {
//					dateCreated : application.getServerTimeStamp(),
//					createdBy : solutionPrefs.access.userID
//				}
//			}
		
		//group by favorite mode enabled, re-sort _rows and put in headings
		if (_faveMode) {
			var faveRecords = 
			_rows = 
				new Array()
			
			var faveHeaders = new Object()
			
			for (var i = 0; i < solutionPrefs.access.favorites.length; i++) {
				var currentFave = solutionPrefs.access.favorites[i]
				
				//if new datasource, find all similar datasource records and add them
				if (typeof faveHeaders[currentFave.datasource] != 'number') {
					//set flag where this grouping begins
					faveHeaders[currentFave.datasource] = faveRecords.length
					
					//find all records with same datasource
					var same = solutionPrefs.access.favorites.filter(sameDatasource)
					
					//add all those records
					for (var j = 0; j < same.length; j++) {
						faveRecords.push(same[j])
					}
				}
			}
		}
		//flat list in order that favorite records added
		else {
			//get things to display
			var faveRecords = 
			_rows = 
				solutionPrefs.access.favorites
		}
		
		//get form and clear
		var formName = 'NAV__navigation_tree__rows'
		var thisForm = solutionModel.getForm(formName)
		
		//grab width
		var parentForm = (solutionPrefs.config.webClient) ? 'NAV__navigation_tree__WEB' : 'NAV__navigation_tree'
		var newWidth = forms[parentForm].controller.getFormWidth()
		
		//remove all elements from target form
		var allComponents = thisForm.getComponents()
		for (var i = 0; i < allComponents.length; i++) {
			var thisComponent = allComponents[i]
			thisForm.removeComponent(thisComponent.name)
		}
		
		//if navigation items, build them
		if (faveRecords.length) {
			//which one to select not specified, select first
			if (typeof selected != 'number') {
				selected = 0
			}
			
			var headingOffset = 0
			
			//loop through range of records and build html list
			for ( var i = 0 ; i < faveRecords.length ; i++ ) {
				//favorite that has all data
				var details = faveRecords[i]
				
				//put in headings
				if (faveHeaders && faveHeaders[details.datasource] == i) {
					var lblHeadBack = thisForm.newLabel('',0,i * 20 + headingOffset,newWidth,20)
					lblHeadBack.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST
					lblHeadBack.formIndex = 1
					lblHeadBack.name = 'lbl_group_' + details.datasource.split('/').pop() + '_back'
					lblHeadBack.showClick = false
					lblHeadBack.showFocus = false
					lblHeadBack.transparent = true
					lblHeadBack.mediaOptions = SM_MEDIAOPTION.REDUCE | SM_MEDIAOPTION.ENLARGE
					lblHeadBack.imageMedia = solutionModel.getMedia("row_selected_dark.png")
					
					var lblHead = thisForm.newLabel(navigationPrefs.byNavItemID[details.navItemID].navigationItem.fwListTitle,0,i * 20 + headingOffset,newWidth,20)
					lblHead.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST
					lblHead.formIndex = 2
					lblHead.name = 'lbl_group_' + details.datasource.split('/').pop()
					lblHead.showClick = false
					lblHead.showFocus = false
					lblHead.styleClass = 'tree_header'
					lblHead.transparent = true
					
					headingOffset += 20
				}
				
				//find total width specified
				var totalWidth = 0
				for (var j = 0; j < details.display.rawDisplay.length; j++) {
					totalWidth += details.display.rawDisplay[j].width
				}
				
				//how wide are we showing
				var shownWidth = (solutionPrefs.config.webClient ? forms.DATASUTRA_WEB_0F__list__navigation.controller.getFormWidth() : forms.DATASUTRA_0F_solution.elements.tab_content_A.getWidth()) - 8
				
				//conversion factor
				var convFactor = shownWidth / totalWidth
				
				//get the record
				var fsRecord = databaseManager.getFoundSet(details.datasource)
				
				//need to handle uuids differently
				if (details.pk && application.getUUID(details.pk) && application.getUUID(details.pk).toString() == details.pk) {
					fsRecord.loadRecords(application.getUUID(details.pk))
				}
				//just load up whatever value is stored
				else {
					fsRecord.loadRecords(details.pk)
				}
				
				var faveRec = fsRecord.getRecord(1) 
				
				//what kind of record is this
				var toolTip = (details.display.listTitle || navigationPrefs.byNavItemID[details.navItemID].navigationItem.fwListTitle).toUpperCase() + ': ' + details.display.rowPreview
				
				var offset = 8
				
				//show data
				for (var j = 0; j < details.display.rawDisplay.length; j++) {
					var lineItem = details.display.rawDisplay[j]
					
					var datum = faveRec[lineItem.fieldName]
					
					//determine format
					if (lineItem.formatMask == 'Number') { // || lineItem.formatMask == 'Text') {
						datum = utils.numberFormat(datum,lineItem.format)
					}
					else if (lineItem.formatMask == 'Date') {
						datum = utils.dateFormat(datum,lineItem.format)
					}
					else if (lineItem.formatMask == 'Valuelist') {
						datum = application.getValueListDisplayValue(lineItem.format,datum)
					}	
					
					//DATA
					var lblData = thisForm.newLabel(datum,0,i * 20 + headingOffset,lineItem.width * convFactor,20)
					lblData.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.WEST
					lblData.formIndex = 10
					lblData.name = 'lbl_row_' + j + '_' + i
					lblData.showClick = false
					lblData.showFocus = false
					lblData.transparent = true
					lblData.styleClass = 'tree'
					lblData.rolloverCursor = SM_CURSOR.HAND_CURSOR
					lblData.x = offset
					
					offset += lineItem.width * convFactor
					
					//row selected, highlight
					if (i == selected) {
						//DATA
						lblData.styleClass = 'tree_select'
						lblData.rolloverCursor = SM_CURSOR.DEFAULT_CURSOR
					}
				}
				
				//HIGHLIGHT
				var lblClick = thisForm.newLabel('',0,i * 20 + headingOffset,newWidth,20)
				lblClick.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST
				lblClick.formIndex = 1
				lblClick.name = 'lbl_rowback_' + i
				lblClick.showClick = false
				lblClick.showFocus = false
				lblClick.transparent = true
				lblClick.toolTipText = toolTip
				lblClick.mediaOptions = SM_MEDIAOPTION.REDUCE | SM_MEDIAOPTION.ENLARGE
				lblClick.onAction = thisForm.getFormMethod('LIST_redraw')
				lblClick.onRightClick = thisForm.getFormMethod('FAVE_right_click')
				lblClick.rolloverCursor = SM_CURSOR.HAND_CURSOR
				lblClick.rolloverImageMedia = solutionModel.getMedia("row_selected_light.png")
				
				//row selected, highlight
				if (i == selected) {
					//HIGHLIGHT
					lblClick.imageMedia = solutionModel.getMedia("row_selected.png")
					lblClick.onAction = null
					lblClick.rolloverCursor = SM_CURSOR.DEFAULT_CURSOR
					lblClick.rolloverImageMedia = null
				}
			}
		}
		
		//set body part height
		thisForm.getBodyPart().height = i * 20 + headingOffset
		
		//recreate ui
		forms[formName].controller.recreateUI()
	}
	
	//checks for same datasource
	function sameDatasource(item) {
		return item && item.datasource == currentFave.datasource
	}
}
