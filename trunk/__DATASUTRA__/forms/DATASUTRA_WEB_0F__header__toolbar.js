/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"2D4DB995-F619-4572-8B51-0C517A1A2B0F"}
 */
function DS_toolbar_cycle(event) {
 	if (application.__parent__.solutionPrefs) {
 		
 		if (event instanceof JSEvent) {
 			var rightClick = event.getType() == JSEvent.RIGHTCLICK
 			var elemName = event.getElementName()
 		}
 		
 		//strip out jsevents
 		if (utils.stringToNumber(application.getVersion()) >= 5) {
 			//cast Arguments to array
 			var Arguments = new Array()
 			for (var i = 0; i < arguments.length; i++) {
 				Arguments.push(arguments[i])
 			}
 			
 			//reassign arguments without jsevents
 			arguments = Arguments.filter(globals.CODE_jsevent_remove)
 		}
 	
 		//timed out, throw up error
 		if (solutionPrefs.config.prefs.thatsAllFolks) {
 			forms.NSTL_0F_solution__license.ACTION_status()
 			
 			globals.DIALOGS.showErrorDialog(
 								'Trial expired',
 								'Trial time expired\n' +
 								'Please restart.'
 							)
 		}
 		
 		var tabShow = arguments[0]
 		var baseForm = solutionPrefs.config.formNameBase
 		var popForm = 'DATASUTRA__toolbar__popdown'
 		
 		var currentTab = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex
 		var maxTab = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getMaxTabIndex()
 		var statusTabs = solutionPrefs.panel.toolbar
 		
 		//right-click or shift-click will open menu
 		var showMenu = rightClick || globals.CODE_key_pressed('shift')
 		
 		//hide popDown sheet when moving to a new item, but not when showing options to choose from
 		if (tabShow || !showMenu) {
 			forms[baseForm].elements.tab_toolbar_popdown.visible = false
 		}
 		
 		//if passed tab name equal to current tab, set tabShow to be index of it
 		for (var i = 0; typeof tabShow != 'number' && i < statusTabs.length ; i++) {
 			if (tabShow == statusTabs[i].tabName) {
 				tabShow = i + 4
 			}
 		}
 		
 		//if requested index, go to it
 		if (tabShow > 0) {
 			forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex = tabShow
 		}
 		//change visible view
 		else {
 			//show popup of views to be chosen if shift key held
 			if (showMenu) {
 				//get menu list and build menu
 				var menu = new Array()
 				for ( var i = 0 ; i < statusTabs.length ; i++ ) {
 					var thisTab = statusTabs[i]
 					//only show enabled toolbars
 					if (thisTab.enabled) {	
 						menu[i] = plugins.popupmenu.createCheckboxMenuItem(thisTab.tabName, DS_toolbar_cycle)
 						
 						//set menu method arguments
 						menu[i].setMethodArguments(thisTab.tabName)
 						
 						//set check mark
 						if (i + 4 == forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex ||
 							(forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex == 1 && thisTab.formName == 'TOOL_title')) {
 							
 							menu[i].setSelected(true)
 						}
 						else {
 							menu[i].setSelected(false)
 						}	
 					}
 				}
 				
 				//popup menu
 				globals.CODE_popup.popupMenu = menu
 				globals.CODE_popup(null,null,forms[baseForm + '__header__toolbar'].elements[application.getMethodTriggerElementName()])
 				
 				return
 			}
 			//cycle through views
 			else {
 				function nextTab(currentTab) {
 					//check to find next enabled tab
 					while (!thisTab || !thisTab.enabled) {
 						//if not the last tab
 						if (currentTab < maxTab) {
 							currentTab ++
 						}
 						//last tab, loop
 						else {
 							currentTab = 4
 							
 							//check to make sure only loop through past the first entry once to avoid infinite loop if nothing enabled
 							if (looped) {
 								//show title toolbar
 								currentTab = 1
 								break
 							}
 							var looped = true
 						}
 						
 						var thisTab = statusTabs[currentTab - 4]
 					}
 					
 					return currentTab
 				}
 				
 				function prevTab(currentTab) {
					//check to find next enabled tab
					while (!thisTab || !thisTab.enabled) {
						//if not the last tab
						if (currentTab > 4) {
							currentTab --
						}
						//last tab, loop
						else {
							currentTab = maxTab
							
							//check to make sure only loop through past the first entry once to avoid infinite loop if nothing enabled
							if (looped) {
								//show title toolbar
								currentTab = 1
								break
							}
							var looped = true
						}
						
						var thisTab = statusTabs[currentTab - 4]
					}
					
					return currentTab
				}
 				
				switch (elemName) {
					case 'btn_toolbar_prev':
						//show previous enabled view
						forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex = prevTab(currentTab)
						break
						
					default:
					case 'btn_toolbar_next':
						//show next enabled view
						forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex = nextTab(currentTab)
						break
				}
 			}
 		}
 		
 		//save which tab is currently selected if different
 		if (solutionPrefs.panel.toolbar.selectedTab != tabShow) {
 			solutionPrefs.panel.toolbar.selectedTab = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex
 		}
 		
 		var statusTab = statusTabs[solutionPrefs.panel.toolbar.selectedTab - 4]
 		
 		if (statusTab) {
 			//set color appropriately (defaults to white if not explicitly set)
 			forms[baseForm + '__header__toolbar'].elements.lbl_color.bgcolor = statusTab.gradientColor
 			
			//enable group
			forms[baseForm + '__header__toolbar'].elements.toolbar_navigator.visible = true
			
 			//set up popDown, if activated
 			var thePopDown = statusTab.popDown
 			var tabParent = statusTab.formName
 			
 			if (thePopDown) {
 				//popdown available
				forms[baseForm + '__header__toolbar'].elements.btn_toolbar_expand.visible = forms[tabParent].popDown != 'show'
				forms[baseForm + '__header__toolbar'].elements.btn_toolbar_collapse.visible = forms[tabParent].popDown == 'show'
				
 				forms[popForm].elements.tab_toolbar_popdown.tabIndex = thePopDown.tabIndex
 				
 				//show if showing
 				if (forms[statusTab.formName].popDown == 'show') {
 					DS_toolbar_popdown(true)
 				}
 				//hide
 				else {
 					forms[baseForm].elements.tab_toolbar_popdown.visible = false
 				}
 			}
 			else {
 				forms[baseForm + '__header__toolbar'].elements.btn_toolbar_expand.visible = false
				forms[baseForm + '__header__toolbar'].elements.btn_toolbar_collapse.visible = false
				
 				forms[baseForm].elements.tab_toolbar_popdown.visible = false
 			}
 		}
 		else {
 			//set color appropriately (defaults to white if not explicitly set)
			forms[baseForm + '__header__toolbar'].elements.lbl_color.bgcolor = '#FFFFFF'
			
			//disable group
			forms[baseForm + '__header__toolbar'].elements.toolbar_navigator.visible = false
 		}
 	}
}


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"E23A5441-7A59-48CD-A1F8-2AF664E99B79"}
 */
function DS_toolbar_popdown(event)
{

if (application.__parent__.solutionPrefs) {

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

	var expanded = arguments[0]
	
	var baseForm = solutionPrefs.config.formNameBase
	var statusStartX = forms[baseForm + '__header'].elements.split_tool_find.getLocationX()
	var statusWidth = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getWidth()
	var indent = 40
	var tabWidth = statusWidth-(indent*2)
	var tabHeight = 390
	
	var currentTab = solutionPrefs.panel.toolbar.selectedTab
	var statusTabs = solutionPrefs.panel.toolbar
	
	//using a pop down
	if (statusTabs[currentTab - 4].popDown) {
		var downPop = statusTabs[currentTab - 4].popDown
		var tabName = downPop.formName
		var tabParent = statusTabs[currentTab - 4].formName
		
		//location offset for design mode
		if (solutionPrefs.design.statusDesign) {
			var y = 42 + 45
		}
		else {
			var y = 0 + 45
		}
		
		tabWidth = (downPop.width) ? downPop.width : tabWidth
		tabHeight = (downPop.height) ? downPop.height + 20 : tabHeight
		
		//check if larger than current window
		if (tabHeight >= (application.getWindowHeight() - (50 + y))) {
			tabHeight = application.getWindowHeight() - 42
		}	
		indent = (statusWidth-tabWidth)/2
		
		//first time popDown called
		if (! forms[tabParent].popDown) {
			forms[tabParent].popDown = 'hide'
		}
		
		//expand if called from toolbar_cycle method
		if (expanded) {
			//resize and show tabpanel
			forms[baseForm].elements.tab_toolbar_popdown.setLocation(statusStartX+indent,y)
			forms[baseForm].elements.tab_toolbar_popdown.setSize(tabWidth,tabHeight)
			forms[baseForm].elements.tab_toolbar_popdown.visible = true
		}
		//roll down
		else if (forms[tabParent].popDown == 'hide') {
			//set to up/down status to current status
			forms[tabParent].popDown = 'show'
			
			//resize and show tabpanel
			forms[baseForm].elements.tab_toolbar_popdown.setLocation(statusStartX+indent,y)
			forms[baseForm].elements.tab_toolbar_popdown.setSize(tabWidth,tabHeight)
			forms[baseForm].elements.tab_toolbar_popdown.visible = true
		}
		//roll up
		else {
			//set to up/down status to current status
			forms[tabParent].popDown = 'hide'
			forms[baseForm].elements.tab_toolbar_popdown.visible = false
		}
		
		var statusTab = statusTabs[currentTab - 4]
		//popdown showing
		if (forms[tabParent].popDown == 'show') {
			forms[baseForm + '__header__toolbar'].elements.btn_toolbar_expand.visible = false
			forms[baseForm + '__header__toolbar'].elements.btn_toolbar_collapse.visible = true
			
			//fire hook
			if (downPop.hook) {
				//global method
				if (downPop.hook.substr(0,7) == 'globals') {
					eval(downPop.hook)
				}
				//form method
				else if (forms[tabName] && forms[tabName][downPop.hook.slice(0,downPop.hook.length-2)]) {
					eval('forms.' + tabName + '.' + downPop.hook)
				}
			}
		}
		//popdown not showing
		else {
			forms[baseForm + '__header__toolbar'].elements.btn_toolbar_expand.visible = true
			forms[baseForm + '__header__toolbar'].elements.btn_toolbar_collapse.visible = false
			
			forms[baseForm].elements.tab_toolbar_popdown.visible = false
		}
	}
}

}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"61BCE02A-83C2-48D8-850C-AECCF9A099C3"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		//css classes
		plugins.WebClientUtils.setExtraCssClass(elements.gfx_header, 'gfxHeader')
	}
}
