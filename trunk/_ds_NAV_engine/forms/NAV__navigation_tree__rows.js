/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"656E16CA-9238-45B4-A53A-D8B28DE43893"}
 */
var _elementSelected = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"18CAFD09-470D-465D-81E3-C1E60732CBDD"}
 */
var _parentForm = (solutionPrefs.config.webClient) ? 'NAV__navigation_tree__WEB' : 'NAV__navigation_tree';

/**
 * @properties={typeid:35,uuid:"90C2111C-4A1E-4642-B0CC-3E830147BBD5",variableType:-4}
 */
var _variableWC = new Object();

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"80983960-9DCF-468E-8A01-300AABBCA3AD",variableType:4}
 */
var _scrollTop = 0;

/**
 * @type {Continuation}
 * 
 * @properties={typeid:35,uuid:"A75A9293-D32F-442D-8DC0-1760F30C0A7C",variableType:-4}
 */
var _redrawWC;

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
			var navDetails = forms[_parentForm]._rows[event.getElementName().split('_').pop()]
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
				LIST_redraw(event,idNavItem,true)
				
				//re set up the screen
				globals.DS_router_recreateUI()
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
 * @AllowToRunInFind
 */
function LIST_redraw(event,itemID,reScroll,skipLoadForms,favoriteMode,selected) {
	//web client
	if (solutionPrefs.config.webClient) {
		LIST_redraw__webclient(event,itemID,reScroll,skipLoadForms,favoriteMode,selected)
	}
	//smart client
	else {
		LIST_redraw__smartclient(event,itemID,reScroll,skipLoadForms,favoriteMode,selected)
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
 * @properties={typeid:24,uuid:"DD2B6DB2-1018-4138-92A1-0D03AEB98891"}
 * @AllowToRunInFind
 */
function zLIST_redraw(event,itemID,reScroll,skipLoadForms,favoriteMode,selected) {
	//continuation code
	if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
		//triggered by clicking on element in list
		if (event instanceof JSEvent) {
			var selected = utils.stringToNumber(event.getElementName().split('_').pop())
			var itemDetails = forms[_parentForm]._rows[selected]
			itemID = itemDetails.navItemID
			
			//this is favorites
			if (itemDetails.datasource) {
				var favoriteMode = true
			}			
			
			//web client
			if (solutionPrefs.config.webClient) {
				var getScroll = 'var scrollRows = $("#form_NAV__navigation_tree__rows").find(".formpart")[0].scrollTop;'
//				var getScroll = 'alert("Scroll is: " + $("#form_NAV__navigation_tree__rows").find(".formpart")[0].scrollTop);'
				
				//saves the current methodStack into variable x
				_redrawWC = new Continuation()
				
				//grab the current scroll position
				plugins.WebClientUtils.executeClientSideJS(getScroll, LIST_redraw__continue, ['scrollRows'])
				
				//stops the execution of the current methodStack
				new Packages.org.mozilla.javascript.continuations.Continuation()()
				
				var scrollY = _scrollTop
			}
			//smart client
			else {
				//get current scroll position
				if (plugins.ScrollerPlus) {
					var scrollRows = plugins.ScrollerPlus.getScroller(controller.getName(), plugins.ScrollerPlus.SCROLLER_TYPE.FORM, plugins.ScrollerPlus.SCROLL_ORIENTATION.VERTICAL)
				}
				
				var scrollY = scrollRows ? scrollRows.position : 0
			}
		}
		
		//redo form of favorite records
		if (favoriteMode) {
			forms[_parentForm].LIST_favorites(selected)
			
			if (selected && forms[_parentForm]._rows.length < selected + 1) {
				selected = forms[_parentForm]._rows.length - 1
			}
			
			var itemDetails = forms[_parentForm]._rows[selected || 0]
			itemID = itemDetails.navItemID
		}
		//redo form of navigation items
		else {
			forms[_parentForm].LIST_generate(itemID)
		}
		
		//if rescroll requested, rescroll (not possible for favorites at this point)
		if (reScroll && !favoriteMode) {
			forms[_parentForm].LIST_rescroll(itemID)
		}
		
		//web client
		if (solutionPrefs.config.webClient) {
			//return to original scroll position
			var setScroll = '$("#form_NAV__navigation_tree__rows").find(".formpart")[0].scrollTop = ' + scrollY
			plugins.WebClientUtils.executeClientSideJS(setScroll)

		}
		//smart client
		else {
			//return to original scroll position
			if (scrollRows) {
				application.updateUI()
				scrollRows.position = scrollY
			}
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
 * @properties={typeid:24,uuid:"ED4B2BAF-912A-4A77-8963-AE58D50E0A83"}
 */
function zLIST_redraw__continue(scrollRows) {
	//set form variable used to do method
	_scrollTop = scrollRows || 0
	
	plugins.WebClientUtils.executeClientSideJS('alert("Scroll was: ' + _scrollTop + '");')
	
	//continue method
	_redrawWC()
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
		var fave = forms[_parentForm]._rows[selected]
		
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
		
		//update display to show/hide the star
		var fsStar = forms[navigationPrefs.byNavItemID[fave.navItemID].listData.tabFormInstance].foundset
		databaseManager.recalculate(fsStar)
		
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


/**
 * Redraws the fake list
 * 
 * @param	{JSEvent}	event The event that triggered the action.
 * @param	{Number}	itemID Which navigation item was clicked.
 * @param	{Boolean}	reScroll Set the scroll position afterwards.
 * @param	{Boolean}	skipLoadForms Do not reload the workflow and list area forms.
 * @param	{Boolean}	favoriteMode Work on favorites.
 *
 * @properties={typeid:24,uuid:"4657CF72-4786-4C99-BF51-B8E55B38B31B"}
 * @AllowToRunInFind
 */
function LIST_redraw__smartclient(event,itemID,reScroll,skipLoadForms,favoriteMode,selected) {
	if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
		//triggered by clicking on element in list
		if (event instanceof JSEvent) {
			var selected = utils.stringToNumber(event.getElementName().split('_').pop())
			var itemDetails = forms[_parentForm]._rows[selected]
			itemID = itemDetails.navItemID
			
			//this is favorites
			if (itemDetails.datasource) {
				var favoriteMode = true
			}			
			
		
			//get current scroll position
			if (plugins.ScrollerPlus) {
				var scrollRows = plugins.ScrollerPlus.getScroller(controller.getName(), plugins.ScrollerPlus.SCROLLER_TYPE.FORM, plugins.ScrollerPlus.SCROLL_ORIENTATION.VERTICAL)
			}
			
			var scrollY = scrollRows ? scrollRows.position : 0
		}
		
		//redo form of favorite records
		if (favoriteMode) {
			forms[_parentForm].LIST_favorites(selected)
			
			if (selected && forms[_parentForm]._rows.length < selected + 1) {
				selected = forms[_parentForm]._rows.length - 1
			}
			
			var itemDetails = forms[_parentForm]._rows[selected || 0]
			itemID = itemDetails.navItemID
		}
		//redo form of navigation items
		else {
			forms[_parentForm].LIST_generate(itemID)
		}
		
		//if rescroll requested, rescroll (not possible for favorites at this point)
		if (reScroll && !favoriteMode) {
			forms[_parentForm].LIST_rescroll(itemID)
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
 * Redraws the fake list
 * 
 * @param	{JSEvent}	event The event that triggered the action.
 * @param	{Number}	idItem Which navigation item was clicked.
 * @param	{Boolean}	scrollRe Set the scroll position afterwards.
 * @param	{Boolean}	loadFormsSkip Do not reload the workflow and list area forms.
 * @param	{Boolean}	modeFavorite Work on favorites.
 * @param 	{Number}	selector Selected index.
 *
 * @properties={typeid:24,uuid:"4E970329-B660-4626-867E-8183F4A445CF"}
 * @AllowToRunInFind
 */
function LIST_redraw__webclient(event,idItem,scrollRe,loadFormsSkip,modeFavorite,selector) {
	if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
		//don't run again
		if (_variableWC.pause) {
			return
		}
		
		//reset object used to store all info for part 2
		_variableWC = {
				itemID: idItem,
				reScroll: scrollRe,
				skipLoadForms: loadFormsSkip,
				favoriteMode: modeFavorite,
				selected: selector
			}
		
		//triggered by clicking on element in list
		if (event instanceof JSEvent) {
			//triggered by arrow
			if (utils.stringPatternCount(event.getElementName(),'triangle')) {
				//already there; don't load in form again
				if (_variableWC.itemID == solutionPrefs.config.currentFormID) {
					_variableWC.skipLoadForms = true
				}
				
				//redraw the list
				forms[controller.getName()].LIST_redraw__webclient__continue(0)
				
				//call router to push history state
				if (globals.DATASUTRA_router_enable) {
					globals.DS_router(null,null,_variableWC.itemID)
				}
				
				//make sure to turn off UL spinny when no UL
				if (true) {
					scopes.DS.webBlockerCentered(false,1000)
				}
			}
			else {
				var selectedRow = utils.stringToNumber(event.getElementName().split('_').pop())
				var itemDetails = forms[_parentForm]._rows[selectedRow]
				
				_variableWC.itemID = itemDetails.navItemID
				
				//already there; halt
				if (_variableWC.itemID == solutionPrefs.config.currentFormID) {
					return
				}		
				
				//call router to push history state
				if (globals.DATASUTRA_router_enable) {
					globals.DS_router(null,null,_variableWC.itemID)
					return
				}
				
				//this is favorites
				if (itemDetails.datasource) {
					_variableWC.favoriteMode = true
				}
				
				var getScroll = 'var scrollRows = $("#form_NAV__navigation_tree__rows").find(".formpart")[0].scrollTop;'
				
				//grab the current scroll position
				plugins.WebClientUtils.executeClientSideJS(getScroll, forms[controller.getName()].LIST_redraw__webclient__continue, ['scrollRows'])
			}
		}
		//continue redrawing the screen
		else {
			//already there; halt
			if (_variableWC.itemID == solutionPrefs.config.currentFormID) {
				return
			}
			
			forms[controller.getName()].LIST_redraw__webclient__continue(0)
		}
	}
}

/**
 * @param {Number} scrollTop
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"EF3C1382-852F-4F6F-8A31-EA3478C8F844"}
 */
function LIST_redraw__webclient__continue(scrollTop) {
	var itemDetails = forms[_parentForm]._rows[_variableWC.selected]
		
	//redo form of favorite records
	if (_variableWC.favoriteMode) {
		forms[_parentForm].LIST_favorites(_variableWC.selected)
		
		if (_variableWC.selected && forms[_parentForm]._rows.length < _variableWC.selected + 1) {
			_variableWC.selected = forms[_parentForm]._rows.length - 1
		}
		
		var itemDetails = forms[_parentForm]._rows[_variableWC.selected || 0]
		_variableWC.itemID = itemDetails.navItemID
	}
	//redo form of navigation items
	else {
		forms[_parentForm].LIST_generate(_variableWC.itemID)
	}
	
	//if rescroll requested, rescroll (not possible for favorites at this point)
	if (_variableWC.reScroll && !_variableWC.favoriteMode) {
		forms[_parentForm].LIST_rescroll(_variableWC.itemID)
	}
	
	//return to original scroll position
	var setScroll = '$("#form_NAV__navigation_tree__rows").find(".formpart")[0].scrollTop = ' + scrollTop + ';'
	plugins.WebClientUtils.executeClientSideJS(setScroll)
	
	//go to selected form
	if (!_variableWC.skipLoadForms) {
//		//set flag to avoid infinite loop
//		_variableWC.pause = true
//		globals.DS_router(null,null,_variableWC.itemID)
//		delete _variableWC.pause
		globals.NAV_workflow_load(_variableWC.itemID)
		
		//make sure we're on the right record
		if (_variableWC.favoriteMode) {
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
	
	//not running through wrapper router, need to call this for straight up webclient
	if (!globals.DATASUTRA_router_enable) {
		//disable selected spaces button
		var spaceConversion = {
				standard: 1,
				'list flip': 9,
				list: 2,
				'workflow flip': 14,
				'workflow': 7
			}
		var elemID = plugins.WebClientUtils.getElementMarkupId(forms.DATASUTRA_WEB_0F__header.elements['btn_space_' + spaceConversion[solutionPrefs.config.activeSpace]])
		plugins.WebClientUtils.executeClientSideJS('dimSpace("' + elemID +'");')
	}
	
	//try setting my class now
	if (_elementSelected) {
		plugins.WebClientUtils.setExtraCssClass(elements[_elementSelected], 'gfxLeftHilite')
	}
	
	//flip on navigation switcher immediately
	plugins.WebClientUtils.executeClientSideJS("setTimeout(function(){$('#form_NAV__navigation_tree__rows div > div > div > span:parent:not([id])').on('click',null,function(){bigIndicator(true);});},7500);")
}