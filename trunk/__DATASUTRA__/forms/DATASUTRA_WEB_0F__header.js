/**
 *
 * @properties={typeid:24,uuid:"E0887C17-8E9E-4FF6-AD2D-1100B3680C3D"}
 */
function SIDEBAR_expand() {
	var splitToolFind = elements.split_tool_find
	var divLocation = splitToolFind.dividerLocation

	//in flexible spaces
	var flexOn = solutionPrefs.config.flexibleSpace
	
	if (flexOn) {
		ACTION_space_flexible(null,true)
	}
	
	globals.DS_sidebar_toggle(true)
	
	if (flexOn) {
		ACTION_space_flexible(null,true)
	}
	
	if (solutionPrefs.screenAttrib.sidebar.status) {
		splitToolFind.dividerLocation = divLocation - solutionPrefs.screenAttrib.sidebar.currentSize
	}
	else {
		splitToolFind.dividerLocation = divLocation
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"B9BE7D7C-32E1-4A9E-8ADD-F1A28A4A290E"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		var splitOffset = 630
		
		//set up split bean
		elements.split_tool_find.continuousLayout = true
		elements.split_tool_find.transparent = true
		elements.split_tool_find.resizeWeight = 1
		elements.split_tool_find.dividerSize = 0
		elements.split_tool_find.dividerLocation = application.getWindowWidth(null) - splitOffset - (solutionPrefs.screenAttrib.sidebar.status ? solutionPrefs.screenAttrib.sidebar.currentSize : 0)
		
		//css classes
		plugins.WebClientUtils.setExtraCssClass(elements.gfx_header, 'gfxHeader')
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"4F731E8C-0772-47EF-9489-5C5E8F8EDA95"}
 */
function ACTION_space_change(event) {
	if (application.__parent__.solutionPrefs) {	
		//timed out, throw up error
		if (solutionPrefs.config.prefs.thatsAllFolks) {
			forms.NSTL_0F_solution__license.ACTION_status()
			
			globals.DIALOGS.showErrorDialog(
								'Trial expired',
								'Trial time expired\n' +
								'Please restart.'
							)
		}
		
		var baseForm = solutionPrefs.config.formNameBase
		var buttonName = event instanceof JSEvent ? event.getElementName() : event
		var skipCustomMethod = arguments[1]
		var noFlip = arguments[2]
		var skipUI = arguments[3]
		
		var prefix = 'btn_space_'
		var suffix = utils.stringToNumber(buttonName.substr(prefix.length))
		var oldSpace = solutionPrefs.config.activeSpace
		
		//the only implemented spaces are standard, list, list flip, vertical, workflow flip, workflow
		var spaceRealNames = [	'standard','list','vertical','centered','classic','wide','workflow',
								'standard flip','list flip','vertical flip','centered flip','classic flip','wide flip','workflow flip']
		
		if (application.__parent__.navigationPrefs && solutionPrefs.config.currentFormID && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]) {
			var spacesOK = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].spaceSetup
		}
		else {
			var spacesOK = [true,true,true,true,true,true,true,true,true,true,true,true,true,true]
		}
		
		//find out what last button 'pressed' was
		var oldIndex = spaceRealNames.indexOf(oldSpace)
		
		//activate correct button and set space to that value
		for (var i = 1 ; i <= 14; i++) {
		
			//name of space button
			var elem = prefix + i
			
			//get details about the space we're in
			switch (elem) {
				case 'btn_space_1':
					var spaceName = 'standard'
					
					var imageURL = 'media:///spacew_standard.png'
					var imageOverURL = 'media:///spacew_standard_over.png'
					var imageActiveURL = 'media:///spacew_standard_active.png'
					
					var mainLevelOrient = SM_ALIGNMENT.SPLIT_HORIZONTAL
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.standard.currentHorizontal
					var mainLevelResizeWeight = 0
					
					var listLevelOrient = SM_ALIGNMENT.SPLIT_VERTICAL
					var listLevelDivLocation = solutionPrefs.screenAttrib.spaces.standard.currentVertical
					var listLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.standard.currentHorizontal
					var dimensionTwo = solutionPrefs.screenAttrib.spaces.standard.currentVertical
					
					break
				
				case 'btn_space_2':
					var spaceName = 'list'
					
					var imageURL = 'media:///spacew_list.png'
					var imageOverURL = 'media:///spacew_list_over.png'
					var imageActiveURL = 'media:///spacew_list_active.png'
					
					var mainLevelOrient = SM_ALIGNMENT.SPLIT_HORIZONTAL
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.list.currentHorizontal
					var mainLevelResizeWeight = 0
					
					var listLevelOrient = SM_ALIGNMENT.SPLIT_VERTICAL
					var listLevelDivLocation = 0
					var listLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.list.currentHorizontal
					
					break
				
				case 'btn_space_3':
					var spaceName = 'vertical'
					
					var imageURL = 'media:///spacew_vertical.png'
					var imageOverURL = 'media:///spacew_vertical_over.png'
					var imageActiveURL = 'media:///spacew_vertical_active.png'
					
					var mainLevelOrient = SM_ALIGNMENT.SPLIT_HORIZONTAL
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne + solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo
					var mainLevelResizeWeight = 0
					
					var listLevelOrient = SM_ALIGNMENT.SPLIT_HORIZONTAL
					var listLevelDivLocation = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne
					var listLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne
					var dimensionTwo = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo
					
					break
				
				case 'btn_space_7':
					var spaceName = 'workflow'
					
					var imageURL = 'media:///spacew_workflow.png'
					var imageOverURL = 'media:///spacew_workflow_over.png'
					var imageActiveURL = 'media:///spacew_workflow_active.png'
					
					var mainLevelOrient = SM_ALIGNMENT.SPLIT_HORIZONTAL
					var mainLevelDivLocation = 0
					var mainLevelResizeWeight = 0
					
					var listLevelOrient = SM_ALIGNMENT.SPLIT_VERTICAL
					var listLevelDivLocation = solutionPrefs.screenAttrib.spaces.standard.currentVertical
					var listLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = 0
					
					break
				
				case 'btn_space_9':
					var spaceName = 'list flip'
					
					var imageURL = 'media:///spacew_navigation.png'
					var imageOverURL = 'media:///spacew_navigation_over.png'
					var imageActiveURL = 'media:///spacew_navigation_active.png'
					
					var mainLevelOrient = SM_ALIGNMENT.SPLIT_HORIZONTAL
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.list.currentHorizontal
					var mainLevelResizeWeight = 0
					
					var listLevelOrient = SM_ALIGNMENT.SPLIT_VERTICAL
					var listLevelDivLocation = forms.DATASUTRA_WEB_0F.elements.tab_wrapper.getHeight() - 45  //wrapper - header - 1px for bordering
					var listLevelResizeWeight = 1
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.list.currentHorizontal
					
					break
				
				case 'btn_space_14':
					var spaceName = 'workflow flip'
					
					var imageURL = 'media:///spacew_records.png'
					var imageOverURL = 'media:///spacew_records_over.png'
					var imageActiveURL = 'media:///spacew_records_active.png'
					
					var mainLevelOrient = SM_ALIGNMENT.SPLIT_HORIZONTAL
					var mainLevelDivLocation = forms.DATASUTRA_WEB_0F__main.elements.tab_main.getWidth()
					var mainLevelResizeWeight = 1
					
					var listLevelOrient = SM_ALIGNMENT.SPLIT_VERTICAL
					var listLevelDivLocation = 0
					var listLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = 0
					
					break
			}
			
			//update graphics shown
			if (forms[baseForm + '__header'].elements[elem] != undefined) {
				//set graphic to be depressed
				if (buttonName == elem) {
//					forms[baseForm + '__header'].elements[elem].imageURL = imageActiveURL
//					forms[baseForm + '__header'].elements[elem].rolloverImageURL = imageActiveURL
					forms[baseForm + '__header'].elements[elem].enabled = false
				}
				//set graphic to normal state (non-depressed)
				else {
//					forms[baseForm + '__header'].elements[elem].imageURL = imageURL
//					forms[baseForm + '__header'].elements[elem].rolloverImageURL = imageOverURL
					forms[baseForm + '__header'].elements[elem].enabled = true
				}
			}
			
			//don't press the same button twice
			if (oldIndex + 1 == suffix) {
				return
			}
				
			//activate this space; only if the space switching to is different (unless forced to fire)
			if (buttonName == elem && (oldSpace != spaceName || noFlip)) {
				
//				globals.CODE_cursor_busy(true)
				//SPLIT TAB PANEL SETUP
					//top-level bean
					var smMain = solutionModel.getForm(baseForm + '__main')
					if (smMain.getTabPanel('tab_main').tabOrientation != mainLevelOrient) {
						smMain.getTabPanel('tab_main').tabOrientation = mainLevelOrient
						forms[baseForm + '__main'].controller.recreateUI()
						
						forms[baseForm + '__main'].elements.tab_main.dividerSize = 0
					}
					forms[baseForm + '__main'].elements.tab_main.dividerLocation = mainLevelDivLocation
					forms[baseForm + '__main'].elements.tab_main.resizeWeight = mainLevelResizeWeight
					
				
					//left-side (list) bean
					var smList = solutionModel.getForm(baseForm + '__list')
					if (smList.getTabPanel('tab_list').tabOrientation != listLevelOrient) {
						smList.getTabPanel('tab_list').tabOrientation = listLevelOrient
						forms[baseForm + '__list'].controller.recreateUI()
						
						forms[baseForm + '__list'].elements.tab_list.dividerSize = 0
					}
					forms[baseForm + '__list'].elements.tab_list.dividerLocation = listLevelDivLocation
					forms[baseForm + '__list'].elements.tab_list.resizeWeight = listLevelResizeWeight
					
				//save down which space we are in
				solutionPrefs.config.activeSpace = spaceName
				
				//using ul
				if (solutionPrefs.config.currentFormID && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]) {
					var currentNavItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]
					
					//we have a form to work on
					if (currentNavItem.listData.tabFormInstance) {
						//when in workflow flip, show click through	//MEMO: this isn't currently firing because we need to force a UL refresh
						if (spaceName == 'workflow flip') {
							if (currentNavItem.navigationItem.useFwList) {
								if (forms[currentNavItem.listData.tabFormInstance].elements.sutra_detail_view) {
									forms[currentNavItem.listData.tabFormInstance].elements.sutra_detail_view.visible = true
								}
							}
						}
						else {
							if (forms[currentNavItem.listData.tabFormInstance].elements.sutra_detail_view) {
								forms[currentNavItem.listData.tabFormInstance].elements.sutra_detail_view.visible = false
							}
						}
					}
				}
				
				//LOG windowing
				globals.TRIGGER_log_create('Flexible windowing',
						oldSpace,
						spaceName,
						null,
						null,
						dimensionOne,
						dimensionTwo,
						application.getWindowWidth(),
						application.getWindowHeight()
						)
				
				//DS_space_flexible method sets the correct border and turns off dividers if showing
				ACTION_space_flexible(true,skipUI)
				
				//fast find showing and leaving navigation-only view, reset divider location
				var navWeb = 'NAV_T_universal_list__WEB'
				if (oldSpace == 'list flip' && forms[navWeb].elements.tab_list.getLeftForm().controller.getName() == 'NAV_T_universal_list__WEB__fastfind') {
					forms[navWeb].elements.tab_list.dividerLocation = 32
				}
				
				//leaving workflow-only view, re-fire UL
				if (application.__parent__.navigationPrefs && solutionPrefs.config.currentFormID) { 
					var currentNavItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]
					if (oldSpace == 'workflow' && currentNavItem.navigationItem.useFwList) {
						var methodRefresh = currentNavItem.listData.withButtons ? forms.NAV_T_universal_list__WEB__buttons.DISPLAY_cycle : forms.NAV_T_universal_list__WEB__no_buttons.DISPLAY_cycle
						methodRefresh(true)
					}
				}
				
				//run post-space change method
				if (!skipCustomMethod && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID] && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].navigationItem.spaceMethod) {
					var spaceManMethod = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].navigationItem.spaceMethod.split('.')
					
					//check to see if it is a global method
					if (spaceManMethod[0] ==  'globals') {
						spaceManMethod.shift()
						var spaceManGlobal = true
					}
					
					//if global method and it exists
					if (spaceManMethod[0] && globals[spaceManMethod[0]]) {
						globals[navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].navigationItem.spaceMethod](oldSpace,spaceName,mainLevelDivLocation,listLevelDivLocation,workflowLevelDivLocation)
					}
					
					//if form (non-global) method and it exists
					if (spaceManMethod[0] && forms[currentNavItem.navigationItem.formToLoad][spaceManMethod[0]]) {
						forms[currentNavItem.navigationItem.formToLoad][spaceManMethod[0]](oldSpace,spaceName,mainLevelDivLocation,listLevelDivLocation,workflowLevelDivLocation)
					}
				}
				
//				globals.CODE_cursor_busy(false)
			}		
		}
		
		//when no ul, manually turn off center spinner
		if (application.__parent__.navigationPrefs && solutionPrefs.config.currentFormID && 
			navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID] && 
			!navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].navigationItem.useFwList) {
			
			scopes.DS.webBlockerCentered(false)
		}
		//prettify UL
		else if (application.__parent__.navigationPrefs && navigationPrefs.byNavItemID && solutionPrefs.config.currentFormID) {
			scopes.DS.webULPrettify(false,true)
		}
	}

}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"1CD87DB1-A01A-4E12-AE14-38B561F1B3C0"}
 */
function ACTION_space_flexible(event) {
	if (application.__parent__.solutionPrefs) {
//		
//		solutionPrefs.config.flexibleSpace = !solutionPrefs.config.flexibleSpace
//		
//		if (solutionPrefs.config.flexibleSpace) {
//			var dividerSize = 9
//			
//			//turn on additional bordering
//			forms.NAV__navigation_tree.elements.tab_rows.border = 'MatteBorder,0,0,1,0,#333333'
//			forms.DATASUTRA_WEB_0F__workflow.elements.tab_workflow.border = 'MatteBorder,0,0,0,1,#333333'
//		}
//		else {
//			var dividerSize = 0
//			
//			//turn off additional bordering
//			forms.NAV__navigation_tree.elements.tab_rows.border = 'EmptyBorder,0,0,0,0'
//			forms.DATASUTRA_WEB_0F__workflow.elements.tab_workflow.border = 'EmptyBorder,0,0,0,0'
//		}
//		
//		forms.DATASUTRA_WEB_0F.elements.tab_wrapper.dividerSize = dividerSize
//		elements.split_tool_find.dividerSize = dividerSize
//		forms.DATASUTRA_WEB_0F__list.elements.tab_list.dividerSize = dividerSize
//		forms.DATASUTRA_WEB_0F__main.elements.tab_main.dividerSize = dividerSize
//		
//		return
		
		
	//MEMO: need to somehow put this section in a Function of it's own
	//running in Tano...strip out jsevents for now
	if (utils.stringToNumber(application.getVersion()) >= 5) {
		//cast Arguments to array
		var Arguments = new Array()
		for (var i = 0; i < arguments.length; i++) {
		//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
			Arguments.push(arguments[i])
		}
		
		//reassign arguments without jsevents
		arguments = Arguments.filter(globals.CODE_jsevent_remove)
	}
		
		//listen to changes in size of the left hand pane
		if (solutionPrefs.config.activeSpace != 'workflow') {
			scopes.DS.webULResizeMonitor()
		}
		
		//hide UL area
//		if (solutionPrefs.config.activeSpace != 'workflow') {
//			plugins.WebClientUtils.executeClientSideJS('hideUL();');
//		}
		
		var baseForm = solutionPrefs.config.formNameBase
		var forceHide = arguments[0]
		var skipUI = arguments[1]
		var sidebarStatus = solutionPrefs.screenAttrib.sidebar.status
		
		var borderEmpty = 'EmptyBorder,0,0,0,0'
		var leftPaneColor = '#666666'
		
		//determine which ones to show and which to hide
		switch (solutionPrefs.config.activeSpace) {
				case 'standard':
					var mainLevel = true
					var listLevel = true
					
					var contentArea_A_Show = 'MatteBorder,0,1,1,0,' + leftPaneColor
					var contentArea_B_Show = 'MatteBorder,1,1,0,0,' + leftPaneColor
					var contentArea_C_Show = 'MatteBorder,0,0,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_C_Show = 'MatteBorder,0,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = 'MatteBorder,1,0,0,0,' + leftPaneColor
					var contentArea_C_Hide = 'MatteBorder,0,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.standard.currentHorizontal : 0
					var dimensionTwoStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.standard.currentVertical : 0
					var dimensionOneEnd = forms[baseForm + '__main'].elements.tab_main.dividerLocation
					var dimensionTwoEnd = forms[baseForm + '__list'].elements.tab_list.dividerLocation
					
					break
					
				case 'list flip':
					var mainLevel = true
					var listLevel = false
					
					var contentArea_A_Show = 'MatteBorder,0,1,0,0,' + leftPaneColor
					var contentArea_B_Show = borderEmpty
					var contentArea_C_Show = 'MatteBorder,0,0,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_C_Show = 'MatteBorder,0,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = borderEmpty
					var contentArea_C_Hide = 'MatteBorder,0,0,0,1,' + leftPaneColor
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.list.currentHorizontal : 0
					var dimensionOneEnd = forms[baseForm + '__main'].elements.tab_main.dividerLocation
					
					break
				
				case 'list':
					var mainLevel = true
					var listLevel = false
					
					var contentArea_A_Show = borderEmpty
					var contentArea_B_Show = 'MatteBorder,0,1,0,0,' + leftPaneColor
					var contentArea_C_Show = 'MatteBorder,0,0,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_C_Show = 'MatteBorder,0,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = borderEmpty
					var contentArea_C_Hide = 'MatteBorder,0,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.list.currentHorizontal : 0
					var dimensionOneEnd = forms[baseForm + '__main'].elements.tab_main.dividerLocation
					
					break
					
				case 'vertical':
					var mainLevel = true
					var listLevel = true
					
					var contentArea_A_Show = 'MatteBorder,0,1,0,0,' + leftPaneColor
					var contentArea_B_Show = 'MatteBorder,0,1,0,1,' + leftPaneColor
					var contentArea_C_Show = 'MatteBorder,0,0,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_C_Show = 'MatteBorder,0,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = 'MatteBorder,0,0,0,1,' + leftPaneColor
					var contentArea_C_Hide = 'MatteBorder,0,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne : 0
					var dimensionTwoStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo : 0
					var dimensionOneEnd = forms[baseForm + '__list'].elements.tab_list.dividerLocation
					var dimensionTwoEnd = forms[baseForm + '__main'].elements.tab_main.dividerLocation - forms[baseForm + '__list'].elements.tab_list.dividerLocation
					
					break
				
				case 'workflow flip':
					var mainLevel = false
					var listLevel = false
					
					var contentArea_A_Show = borderEmpty
					var contentArea_B_Show = borderEmpty
					var contentArea_C_Show = borderEmpty
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_B_Show = 'MatteBorder,0,1,0,0,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = borderEmpty
					var contentArea_C_Hide = borderEmpty
					
					break					
				
				case 'workflow':
					var mainLevel = false
					var listLevel = false
					
					var contentArea_A_Show = borderEmpty
					var contentArea_B_Show = borderEmpty
					var contentArea_C_Show = borderEmpty
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_C_Show = 'MatteBorder,0,1,0,0,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = borderEmpty
					var contentArea_C_Hide = borderEmpty
					
					break
			}
		
		
		//dividers showing, hide
		if (forceHide || solutionPrefs.config.flexibleSpace) {
			//Navigation item area
			forms[baseForm + '__list__navigation'].elements.tab_content_A.border = contentArea_A_Hide
			
			//UL record area
			forms[baseForm + '__list__universal'].elements.tab_content_B.border = contentArea_B_Hide
			
			//bottom part of right-side tab panel
			forms[baseForm + '__workflow'].elements.tab_workflow.border = contentArea_C_Hide
			
			//pseudo-border in header
			forms[baseForm + '__main'].elements.tab_header.border = borderEmpty
			forms.DATASUTRA__sidebar__header.elements.gfx_flexible.visible = false
			
			//status of flexible spaces
			solutionPrefs.config.flexibleSpace = false
			
			//save status, log current view, and refresh UL if not forceHidden
			if (!forceHide) {
				switch (solutionPrefs.config.activeSpace) {
					case 'standard' :  
							solutionPrefs.screenAttrib.spaces.standard.currentHorizontal = forms[baseForm + '__main'].elements.tab_main.dividerLocation
							solutionPrefs.screenAttrib.spaces.standard.currentVertical = forms[baseForm + '__list'].elements.tab_list.dividerLocation
							
							solutionPrefs.screenAttrib.spaces.list.currentHorizontal = forms[baseForm + '__main'].elements.tab_main.dividerLocation
							
							solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne = forms[baseForm + '__main'].elements.tab_main.dividerLocation
							break
								
					case 'list' : 
					case 'list flip' : 
							solutionPrefs.screenAttrib.spaces.standard.currentHorizontal = forms[baseForm + '__main'].elements.tab_main.dividerLocation
					
							solutionPrefs.screenAttrib.spaces.list.currentHorizontal = forms[baseForm + '__main'].elements.tab_main.dividerLocation
							
							solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne = forms[baseForm + '__main'].elements.tab_main.dividerLocation
							break
								
					case 'vertical' : 
							solutionPrefs.screenAttrib.spaces.standard.currentHorizontal = forms[baseForm + '__main'].elements.tab_main.dividerLocation
							
							solutionPrefs.screenAttrib.spaces.list.currentHorizontal = forms[baseForm + '__main'].elements.tab_main.dividerLocation
							
							solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne = forms[baseForm + '__list'].elements.tab_list.dividerLocation
							solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo = forms[baseForm + '__main'].elements.tab_main.dividerLocation - forms[baseForm + '__list'].elements.tab_list.dividerLocation
							break
				}
				
				if (sidebarStatus) {
					solutionPrefs.screenAttrib.sidebar.currentSize = application.getWindow(null).getWidth() - forms[baseForm].elements.tab_wrapper.dividerLocation
				}
				
				//LOG windowing
				globals.TRIGGER_log_create('Flexible windowing',
						solutionPrefs.config.activeSpace,
						solutionPrefs.config.activeSpace,
						dimensionOneStart,
						dimensionTwoStart,
						dimensionOneEnd,
						dimensionTwoEnd,
						application.getWindow(null).getWidth(),
						application.getWindow(null).getHeight()
					)
				
				//TODO: only do if changed spaces have different dimensions
				//favorites mode on, refresh so get full width available
				if (globals.DATASUTRA_navigation_set == 0) {
					//which record is selected
					var navForm = solutionModel.getForm('NAV__navigation_tree__rows')
					var allComponents = navForm.getComponents()
					for (var i = 0; i < allComponents.length; i++) {
						var thisComponent = allComponents[i]
						
						if (thisComponent.imageMedia && thisComponent.imageMedia.getName() == "row_selected.png") {
							var selected = utils.stringToNumber(thisComponent.name.split('_').pop())
							break
						}
					}
					
					forms.NAV__navigation_tree__rows.LIST_redraw(null,null,true,false,true,selected)
				}
			}
			
			//top-level bean
			forms[baseForm + '__main'].elements.tab_main.dividerSize = 0
			
			//left-side (list) bean
			forms[baseForm + '__list'].elements.tab_list.dividerSize = 0
			
			//sidebar bean
			forms[baseForm].elements.tab_wrapper.dividerSize = 0
			forms.DATASUTRA__sidebar.elements.lbl_cliff.visible = true
			forms.DATASUTRA__sidebar__header.elements.lbl_cliff.visible = true
			
			//header tool/find bean
			forms[baseForm + '__header'].elements.split_tool_find.dividerSize = 0
			
			//TODO: only do if changed spaces have different dimensions; can remove this tweak once interior anchoring working better in webclient
			//re-fire UL if configured and changing spaces
//			if (solutionPrefs.config.currentFormID && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]) {
//				var currentNavItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]
//				if (currentNavItem.navigationItem.useFwList) {
//					var methodRefresh = currentNavItem.listData.withButtons ? forms.NAV_T_universal_list__WEB.DISPLAY_cycle : forms.NAV_T_universal_list__WEB__no_buttons.DISPLAY_cycle
//					
//					var callback = plugins.WebClientUtils.generateCallbackScript(methodRefresh, ['true'])
//					var jsCallback = 'function repaintUL(){' + callback + '}';
//					plugins.WebClientUtils.executeClientSideJS('refreshUL(' + jsCallback + ');')
//				}
//			}
		}
		//show dividers
		else {
			//Navigation item area
			forms[baseForm + '__list__navigation'].elements.tab_content_A.border = contentArea_A_Show
			
			//UL record area
			forms[baseForm + '__list__universal'].elements.tab_content_B.border = contentArea_B_Show
			
			//bottom part of right-side tab panel
			forms[baseForm + '__workflow'].elements.tab_workflow.border = contentArea_C_Show
			
			//pseudo-border in header
			if (sidebarStatus) {
				forms[baseForm + '__main'].elements.tab_header.border = 'MatteBorder,0,1,0,0,#757575'
				forms.DATASUTRA__sidebar__header.elements.gfx_flexible.visible = true
			}
			
			//status of flexible spaces
			solutionPrefs.config.flexibleSpace = true
			
			//top-level bean
			forms[baseForm + '__main'].elements.tab_main.dividerSize = (mainLevel) ? 8 : 0
			
			//left-side (list) bean
			forms[baseForm + '__list'].elements.tab_list.dividerSize  = (listLevel) ? 8 : 0
			
			//sidebar bean
			forms[baseForm].elements.tab_wrapper.dividerSize = (sidebarStatus) ? 8 : 0
			forms.DATASUTRA__sidebar.elements.lbl_cliff.visible = false
			forms.DATASUTRA__sidebar__header.elements.lbl_cliff.visible = false
			
			//header tool/find bean
			forms[baseForm + '__header'].elements.split_tool_find.dividerSize = 8
		}
		
//		//don't fire when exiting design mode and going into preference
//		if (!skipUI) {
//			application.updateUI()
//		}
		
		//in design mode and locked, update lock
		if (solutionPrefs.design.statusDesign && solutionPrefs.design.statusLockWorkflow) {
			globals.DEV_lock_workflow(true,solutionPrefs.design.statusLockList)
		}
		
		//attach fancy scrollbars
		if (application.__parent__.navigationPrefs && navigationPrefs.byNavItemID && solutionPrefs.config.currentFormID) {
//			scopes.DS.webULPrettify(false,true)
		}
	}
}

/**
 * @param {JSEvent|String}	input Event that called the method or the item chosen.
 * @param {String}			[itemFormName] Form for the item chosen.
 * @param {String}			[itemID] Navigation Item ID for the item chosen.
 * @param {String}			[itemType] Type of item chosen.
 *
 * @properties={typeid:24,uuid:"676491D0-595C-4C08-912E-4C8DEBD64A23"}
 */
function ACTIONS_list(input) {
	globals.DS_actions(input)
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"F5485AD9-2E9A-45F8-9CBB-2682B96ED6B9"}
 */
function ACTION_find(event) {
	plugins.window.showFormPopup(elements.btn_find_popdown,forms.NAV_P__fastfind,forms.DATASUTRA_WEB_0F__header,'_search')
}
