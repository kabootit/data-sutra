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
 * 
 * @properties={typeid:24,uuid:"85E9B237-1118-4C13-98F4-8147DA35322F"}
 */
function LIST_redraw(event,itemID,reScroll,skipLoadForms) {
	if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
		//triggered by clicking on element in list
		if (event instanceof JSEvent) {
			var navDetails = forms.NAV__navigation_tree._rows[event.getElementName().split('_').pop()]
			itemID = navDetails.navItemID
			
			//get current scroll position
			var scrollRows = plugins.ScrollerPlus.getScroller(controller.getName(), SCROLLER_TYPE.FORM, SCROLL_ORIENTATION.VERTICAL)
			var scrollY = scrollRows.position			
		}
		
		//redo form
		forms.NAV__navigation_tree.LIST_generate(itemID)
		
		//if rescroll requested, rescroll
		if (reScroll) {
			forms.NAV__navigation_tree.LIST_rescroll('NAV_0L_solution',itemID)
		}
		
		//return to original scroll position
		if (scrollRows) {
			application.updateUI()
			scrollRows.position = scrollY
		}
		
		//go to selected form
		if (!skipLoadForms) {
			globals.NAV_workflow_load(itemID)
		}
	}

}
