/**
 * Toggles expanded status of current navigation item
 * 
 * @param	{JSEvent}	event The event that triggered the action.
 * @param	{Number}	idNavItem Which navigation item was clicked.
 * @param	{String}	forceToggle Specified status for triangle.
 * @param	{Number}	[idNavSet=globals.DATASUTRA_navigation_set] The navigation set we're working on.
 *
 * @properties={typeid:24,uuid:"C1541788-56BF-4EA2-B855-3A5DA1829D82"}
 */
function LIST_expand_collapse(event, idNavItem, forceToggle, idNavSet) {
	var idNavItem = arguments[1]
	var forceToggle = arguments[2]
	var idNavSet = (arguments[3]) ? arguments[3] : globals.DATASUTRA_navigation_set
	
	if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
		
		//triggered by clicking on element in list
		if (event instanceof JSEvent) {
			var navDetails = forms.NAV__navigation_tree._rows[event.getElementName().split('_').pop()]
			idNavItem = navDetails.navItemID
		}
		
		//if navigation items in this set, do the appropriate toggle
		if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length) {
			//find position in array
			var found = -1
			for (var i = 0; i < navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length && !(found >= 0); i++) {
				if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder[i].navigationItem.idNavigationItem == idNavItem) {
					found = i
				}
			}
			
			if (found >= 0) {
				//current status
				var currentStatus = (navigationPrefs.byNavSetID[idNavSet].itemsByOrder[found].navigationItem.rowStatusExpanded) ? true : false
				var currentTree = navigationPrefs.byNavSetID[idNavSet].itemsByOrder[found].navigationItem.nodeOne
				
				//only have one opened at a time; close all others
				if (solutionPrefs.config.navigationCollapse) {
					for (var i = 0; i < navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length; i++) {
						//hide all nodeTwos
						if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder[i].navigationItem.nodeTwo) {
							navigationPrefs.byNavSetID[idNavSet].itemsByOrder[i].navigationItem.rowStatusShow = false
						}
						//collapse all nodeOnes
						else {
							navigationPrefs.byNavSetID[idNavSet].itemsByOrder[i].navigationItem.rowStatusExpanded = false
						}
					}
				}
							
				//toggle open/closed selected node
				for (var i = found; i < navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length && navigationPrefs.byNavSetID[idNavSet].itemsByOrder[i].navigationItem.nodeOne == currentTree ; i++) {
					//toggle status specified
					if (forceToggle) {
						switch (forceToggle) {
							case 'open':
								var toggle = true
								break
							case 'close':
								var toggle = false
								break
							default :
								var toggle = !currentStatus
								break
						}
					}
					//use default
					else {
						var toggle = !currentStatus
					}
					
					//toggle all nodeTwos
					if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder[i].navigationItem.nodeTwo) {
						navigationPrefs.byNavSetID[idNavSet].itemsByOrder[i].navigationItem.rowStatusShow = toggle
					}
					//toggle all nodeOnes
					else {// if (i != found) {	//TODO: picking up when no children
						navigationPrefs.byNavSetID[idNavSet].itemsByOrder[i].navigationItem.rowStatusExpanded = toggle
					}
				}
				
				//redraw list
				LIST_redraw(null,idNavItem,true)
			}
		}
	}
}

/**
 * Redraws the fake list
 * 
 * @param	{JSEvent}	event The event that triggered the action.
 * @param	{Number}	itemID Which navigation item was clicked.
 * @param	{Boolean}	reScroll Set the scroll position afterwards.
 * @param	{Boolean}	skipLoadForms Do not reload the workflow and list area forms.
 * @param	{Boolean}	favoriteMode Work on favorites.
 *
 * @properties={typeid:24,uuid:"85E9B237-1118-4C13-98F4-8147DA35322F"}
 */
function LIST_redraw(event,itemID,reScroll,skipLoadForms,favoriteMode,selected) {
	if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
		//triggered by clicking on element in list
		if (event instanceof JSEvent) {
			var selected = utils.stringToNumber(event.getElementName().split('_').pop())
			var itemDetails = forms.NAV__navigation_tree._rows[selected]
			itemID = itemDetails.navItemID
			
			//this is favorites
			if (itemDetails.datasource) {
				var favoriteMode = true
			}			
			
			//get current scroll position
			if (plugins.ScrollerPlus) {
				var scrollRows = plugins.ScrollerPlus.getScroller(controller.getName(), SCROLLER_TYPE.FORM, SCROLL_ORIENTATION.VERTICAL)
			}
			var scrollY = scrollRows ? scrollRows.position : 0
		}
		
		//redo form of favorite records
		if (favoriteMode) {
			forms.NAV__navigation_tree.LIST_favorites(selected)
			
			if (selected && forms.NAV__navigation_tree._rows.length < selected + 1) {
				selected = forms.NAV__navigation_tree._rows.length - 1
			}
			
			var itemDetails = forms.NAV__navigation_tree._rows[selected || 0]
			itemID = itemDetails.navItemID
		}
		//redo form of navigation items
		else {
			forms.NAV__navigation_tree.LIST_generate(itemID)
		}
		
		//if rescroll requested, rescroll (not possible for favorites at this point)
		if (reScroll && !favoriteMode) {
			forms.NAV__navigation_tree.LIST_rescroll(itemID)
		}
		
		//return to original scroll position
		if (scrollRows) {
			application.updateUI()
			scrollRows.position = scrollY
		}
		
		//go to selected form
		if (!skipLoadForms) {
			globals.NAV_workflow_load(itemID)
			
			//make sure we're on the right record
			if (favoriteMode) {
				var workflow = solutionPrefs.config.currentFormName
				forms[workflow].foundset.selectRecord(itemDetails.pk)
				
				//not selected, do find cause not in current foundset
				if (itemDetails.pk != forms[workflow].foundset.getSelectedRecord()[itemDetails.pkName]) {
					forms[workflow].foundset.find()
					forms[workflow].foundset[itemDetails.pkName] = itemDetails.pk
					forms[workflow].foundset.search()
					
					globals.TRIGGER_fastfind_display_set('FAVORITE: ' + navigationPrefs.byNavItemID[itemDetails.navItemID].navigationItem.fwListTitle, navigationPrefs.byNavItemID[itemDetails.navItemID]._about_)
				}
			}
		}
	}
}

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} input the event that triggered the action
 *
 * @properties={typeid:24,uuid:"DBCB16DE-9B1E-408C-9A25-1737B3AB544D"}
 */
function FAVE_right_click(input,fave,oldSelected) {
	//called to depress menu
	if (input instanceof JSEvent) {
		var selected = utils.stringToNumber(input.getElementName().split('_').pop())
		var fave = forms.NAV__navigation_tree._rows[selected]
		
		//build menu
		var menu = new Array()
		menu.push(plugins.popupmenu.createMenuItem('Remove favorite', FAVE_right_click))
		menu[0].setMethodArguments(null,fave,selected)
	
		var elem = forms[input.getFormName()].elements[input.getElementName()]
		
		//pop up the popup menu
		if (elem != null) {
		    plugins.popupmenu.showPopupMenu(elem, menu)
		}
	}
	//make favorite
	else {
		solutionPrefs.access.favorites.splice(solutionPrefs.access.favorites.map(favExists).indexOf(true),1)
		
		//assign back into record
		solutionPrefs.access.user.record.favorites = solutionPrefs.access.favorites
		databaseManager.saveData(solutionPrefs.access.user.record)
		
		if (oldSelected && solutionPrefs.access.favorites.length < oldSelected + 1) {
			oldSelected = solutionPrefs.access.favorites.length - 1
		}
		
		//redraw favorites mode
		LIST_redraw(null,null,true,false,true,oldSelected)
	}
	
	//checks if already exists
	function favExists(item) {
		return item && item.datasource == fave.datasource && item.pk == fave.pk
	}
}
