/**
 * Perform the element default action.
 *
 * @param {JSEvent|String} input Event that triggered action or action to perform.
 *
 * @properties={typeid:24,uuid:"835C298B-5875-4CDB-9C5F-B719F27951F6"}
 */
function ACTIONS_list(input) {
	//actions to perform
	var valueList = [
			'Toggle expand/collapse status'
		]
	
	//called to depress menu
	if (input instanceof JSEvent) {
		var elem = forms[input.getFormName()].elements[input.getElementName()]
		
		//build menu
		var menu = new Array()
		for ( var i = 0 ; i < valueList.length ; i++ ) {
			menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list)
			
			//pass arguments
			menu[i].setMethodArguments(valueList[i])
			
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
		switch (input) {
			case 'Toggle expand/collapse status':	//toggle tree
				LIST_toggle_all()
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
		var navItemID = navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].lastNavItem
		
		//recreate list
		var treeDepth = LIST_generate(navItemID)
		
		//update labels
		LABEL_update(treeDepth > 1)
		
		//go to selected form; notify load forms routine that this is the first one loaded
		globals.NAV_workflow_load(
							navItemID || navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[0].navigationItem.idNavigationItem,
							null,
							null,
							true
						)
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
	
	//update label
	var displayValue = application.getValueListDisplayValue('NAV_navigation_set',globals.DATASUTRA_navigation_set)
	elements.lbl_header.text = (displayValue) ? displayValue.toUpperCase() : 'NAVIGATION'
}

/**
 * Array that will hold information about currently showing rows.
 * 
 * @properties={typeid:35,uuid:"8BEF2D83-B94F-4611-BEC9-D0E272F3F73D",variableType:-4}
 */
var _rows = null;

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
		var formName = controller.getName() + '__rows'
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
				lblClick.rolloverImageMedia = solutionModel.getMedia("row_selected_light.png")
				
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
					lblClick.imageMedia = solutionModel.getMedia("row_selected.png")
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
function LIST_rescroll(formName,idNavItem) {
//
//	//arguments
//	var formName = arguments[0]
//	var elem = arguments[1]
//	var idNavItem = arguments[2]
//	
//	//if navigation items in this set, do the appropriate toggle
//	if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set] && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length) {
//		//find position in array
//		var selected = -1
//		var indexStart = 1
//		var indexEnd = 0
//		
//		for (var i = 0; i < navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length; i++) {
//			//this item is visible
//			if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.rowStatusShow) {
//				//this is the selected
//				if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.idNavigationItem == idNavItem) {
//					selected = indexEnd
//				}
//				indexEnd++
//			}
//		}
//	}
//	
//	//information about scroll field
//	var heightHTML = forms[formName].elements[elem].getHeight()
//	var rowHeight = 20 //this is set in the css for the html field...may be overridden in top level style sheet
//	var clickSize = Math.floor(heightHTML / 10) //the amount of one downward click in the scroll bar
//	var rowScroll = heightHTML / rowHeight //Math.floor() gives the number of rows that can be displayed without scrolling
//	var maxScroll = (rowHeight * (indexEnd - indexStart + 1)) - heightHTML
//	var currentScroll = forms[formName].elements[elem].getScrollY()
//	var currentTop = (currentScroll) ? Math.ceil(currentScroll / rowHeight) + 1 : 1 //index of record at top of scroll (add 1 to account for parital records)
//	var currentBottom = currentTop + Math.floor(rowScroll) - 1 //subtract 1 to account for partial records, 1 for selected offset (in defintion of selected)
//	
//	//selected item in loaded set
//	if (indexStart <= selected && selected <= indexEnd) {
//		//scroll up
//		if (selected < currentTop) {
//			//can fit without scroll
//			if (selected <= Math.floor(rowScroll)) {
//				forms[formName].elements[elem].setScroll(0,0)
//				return true
//			}
//			//set to be a few down
//			else {
//				var scrollY = ((selected - 1) * 20) //-1 to get the bottom of the prior record (in other words, the top of the record we want)
//				//if there is room, set the scroll position to be slightly above the selected record
//				if (Math.floor(rowScroll) > 4) {
//					scrollY -= 40
//				}
//				forms[formName].elements[elem].setScroll(0,scrollY)
//				return true
//			}
//		}
//		//scroll down
//		else if (selected > currentBottom) {
//			//can fit with scroll all the way to the bottom
//			if ((indexEnd - Math.floor(rowScroll) < selected) && (selected < indexEnd)) {
//				forms[formName].elements[elem].setScroll(0,maxScroll)
//				return true
//			}
//			//set to be a few up
//			else {
//				var scrollY = ((selected - 1) * 20) //-1 to get the bottom of the prior record (in other words, the top of the record we want)
//				//if there is room, set the scroll position to be slightly above the selected record
//				if (Math.floor(rowScroll) > 4) {
//					scrollY -= 60
//				}
//				forms[formName].elements[elem].setScroll(0,scrollY)
//				return true
//			}
//		
//		}
//		//otherwise selected item in viewable area; no action necessary
//	}
//	
//	//if no scrolling took place, return false
//	return false
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
							forms.NAV__navigation_tree__rows.LIST_redraw(navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.idNavigationItem,true)
							break
						}
					}
				}
				//expanded, so stay on parent
				else {
					forms.NAV__navigation_tree__rows.LIST_redraw(null,idNavItem,true)
				}
			}
		}
	}
}
