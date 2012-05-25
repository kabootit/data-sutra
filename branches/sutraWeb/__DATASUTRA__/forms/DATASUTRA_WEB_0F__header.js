/**
 *
 * @properties={typeid:24,uuid:"3D120E24-1DA1-43FD-AAE8-305E57C35798"}
 */
function FORM_on_load() {
	//set up split bean
	elements.split_tool_find.continuousLayout = true
	elements.split_tool_find.transparent = true
	
	//turn trial mode off
	forms.DATASUTRA_0F_solution__header__toolbar.elements.lbl_trial_mode.visible = false
}

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
		application.updateUI()
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
		elements.split_tool_find.dividerLocation = application.getWindowWidth(null) - 580
	}
}

/**
 *
 * @param {JSEvent} input
 *
 * @properties={typeid:24,uuid:"FA038C2B-4059-4139-A1EF-AD5C5F101163"}
 */
function ACTION_navigation(input) {
	//validate license
	forms.NSTL_0F_solution__license.ACTION_validate(true,true)
	
	//timed out, throw up error
	if (solutionPrefs.config.prefs.thatsAllFolks) {
		forms.NSTL_0F_solution__license.ACTION_status()
		
		plugins.dialogs.showErrorDialog(
							'Trial expired',
							'Trial time expired\n' +
							'Please restart.'
						)
	}
	
	//get menu list from a value list
	var vlItems = application.getValueListItems('NAV_navigation_set')
	var vlDisplay = vlItems.getColumnAsArray(1)
	var vlReal = vlItems.getColumnAsArray(2)
	
	//are there favorites?
	if (application.__parent__.solutionPrefs && solutionPrefs.access && solutionPrefs.access.favorites && solutionPrefs.access.favorites.length) {
		vlDisplay.push('-','Favorites')
		vlReal.push(null,0)
	}
	
	//called to depress menu
	if (input instanceof JSEvent) {
	
		//build menu
		var menu = new Array()
		for ( var i = 0 ; i < vlDisplay.length ; i++ ) {
			//create checkbox menu item if selected
			if (globals.DATASUTRA_navigation_set == vlReal[i]) {
				menu[i] = plugins.popupmenu.createCheckboxMenuItem(vlDisplay[i] + "", ACTION_navigation)
				menu[i].setSelected(true)
			}
			//create a normal menu item
			else {
				menu[i] = plugins.popupmenu.createMenuItem(vlDisplay[i] + "", ACTION_navigation)
			}
			
			//set arguments
			menu[i].setMethodArguments(vlReal[i])
			
			//disable dividers
			if (vlDisplay[i] == '-') {
				menu[i].setEnabled(false)
			}
		}
		
		//pop menu down
		var elem = forms[input.getFormName()].elements[input.getElementName()]
		if (elem != null && menu.length) {
			plugins.popupmenu.showPopupMenu(elem, menu)
		}
	
	}
	//menu shown and item chosen
	else if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
	
		var oldItem = globals.DATASUTRA_navigation_set
		
		if (input >= 0) {
			//save last selected item when changing navigation sets
			if (oldItem != input) {
				if (oldItem) {
					navigationPrefs.byNavSetID[oldItem].lastNavItem = solutionPrefs.config.currentFormID
				}
				
				globals.DATASUTRA_navigation_set = input
				
				globals.NAV_navigation_set_load()
			}
		}
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
	return
	if (application.__parent__.solutionPrefs) {	

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

		//timed out, throw up error
		if (solutionPrefs.config.prefs.thatsAllFolks) {
			forms.NSTL_0F_solution__license.ACTION_status()
			
			plugins.dialogs.showErrorDialog(
								'Trial expired',
								'Trial time expired\n' +
								'Please restart.'
							)
		}
		
		var baseForm = solutionPrefs.config.formNameBase
		var buttonName = (arguments[0]) ? arguments[0] : application.getMethodTriggerElementName()
		var skipCustomMethod = arguments[1]
		var noFlip = arguments[2]
		var skipUI = arguments[3]
		
		var prefix = 'btn_space_'
		var suffix = utils.stringToNumber(buttonName.substr(prefix.length))
		var oldSpace = solutionPrefs.config.activeSpace
		
		var spaceRealNames = [	'standard','list','vertical','centered','classic','wide','workflow',
								'standard flip','list flip','vertical flip','centered flip','classic flip','wide flip','workflow flip']
		
		if (application.__parent__.navigationPrefs && solutionPrefs.config.currentFormID && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]) {
			var spacesOK = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].spaceSetup
		}
		else {
			var spacesOK = [true,true,true,true,true,true,true,true,true,true,true,true,true,true]
		}
		
		//find out what last button 'pressed' was
		var found = false
		for (var i = 0; i < spaceRealNames.length && !found; i++) {
			if (spaceRealNames[i] == oldSpace) {
				found = true
			}
		}
		//if same button pressed twice, go to opposite if available
		if (prefix + i == buttonName && !noFlip) {
			//get other value
			if (suffix < 8) {
				var complement = suffix + 7
			}
			else {
				var complement = suffix - 7
			}
			
			//if complement is available, show it and continue method running as it; otherwise do nothing
			if (spacesOK[complement - 1]) {
				forms[baseForm + '__header'].elements['btn_space_'+complement].visible = true
				forms[baseForm + '__header'].elements['btn_space_'+suffix].visible = false
				
				buttonName = prefix + complement
			}
		}
		
		
		//activate correct button and set space to that value
		for (var i = 1 ; i <= 14; i++) {
		
			//name of space button
			var elem = prefix + i
			
			//get details about the space we're in
			switch (elem) {
				case 'btn_space_1':
					var spaceName = 'standard'
					
					var imageURL = 'media:///space_standard.png'
					var imageActiveURL = 'media:///space_standard_active.png'
					
					var mainLevel_A = 'bean_list'
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 1	//left-right orientation
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.standard.currentHorizontal
					
					var listLevel_A = 'tab_content_A'
					var listLevel_B = 'tab_content_B'
					var listLevelOrient = 0	//top-bottom orientation
					var listLevelDivLocation = solutionPrefs.screenAttrib.spaces.standard.currentVertical
					
					var workflowLevel_A = null
					var workflowLevel_B = 'tab_content_C'
					var workflowLevelOrient = 0	//top-bottom orientation
					var workflowLevelDivLocation = 0
					var workflowLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.standard.currentHorizontal
					var dimensionTwo = solutionPrefs.screenAttrib.spaces.standard.currentVertical
					
					break
				
				case 'btn_space_2':
					var spaceName = 'list'
					
					var imageURL = 'media:///space_list.png'
					var imageActiveURL = 'media:///space_list_active.png'
					
					var mainLevel_A = 'bean_list'
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 1	//left-right orientation
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.list.currentHorizontal
					
					var listLevel_A = 'tab_content_B'
					var listLevel_B = null
					var listLevelOrient = 0	//top-bottom orientation
					var listLevelDivLocation = 0
					
					var workflowLevel_A = null
					var workflowLevel_B = 'tab_content_C'
					var workflowLevelOrient = 0	//top-bottom orientation
					var workflowLevelDivLocation = 0
					var workflowLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.list.currentHorizontal
					
					break
				
				case 'btn_space_3':
					var spaceName = 'vertical'
					
					var imageURL = 'media:///space_vertical.png'
					var imageActiveURL = 'media:///space_vertical_active.png'
					
					var mainLevel_A = 'bean_list'
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 1	//left-right orientation
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne + solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo
					
					var listLevel_A = 'tab_content_A'
					var listLevel_B = 'tab_content_B'
					var listLevelOrient = 1	//left-right orientation
					var listLevelDivLocation = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne
					
					var workflowLevel_A = null
					var workflowLevel_B = 'tab_content_C'
					var workflowLevelOrient = 0	//top-bottom orientation
					var workflowLevelDivLocation = 0
					var workflowLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne
					var dimensionTwo = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo
					
					break
				
				case 'btn_space_4':
					var spaceName = 'centered'
					
					var imageURL = 'media:///space_centered.png'
					var imageActiveURL = 'media:///space_centered_active.png'
					
					var mainLevel_A = 'bean_list'
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 1	//left-right orientation
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne
					
					var listLevel_A = 'tab_content_A'
					var listLevel_B = null
					var listLevelOrient = 0	//top-bottom orientation
					var listLevelDivLocation = 2000
					
					var workflowLevel_A = 'tab_content_C'
					var workflowLevel_B = 'tab_content_B'
					var workflowLevelOrient = 1	//left-right orientation
					var workflowLevelDivLocation = forms[baseForm].elements.bean_main.getWidth() - solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne - solutionPrefs.screenAttrib.spaces.centered.currentHorizontalTwo
					var workflowLevelResizeWeight = 1
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne
					var dimensionTwo = solutionPrefs.screenAttrib.spaces.centered.currentHorizontalTwo
					
					break
				
				case 'btn_space_5':
					var spaceName = 'classic'
					
					var imageURL = 'media:///space_classic.png'
					var imageActiveURL = 'media:///space_classic_active.png'
					
					var mainLevel_A = 'bean_list'
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 1	//left-right orientation
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.classic.currentHorizontal
					
					var listLevel_A = 'tab_content_A'
					var listLevel_B = null
					var listLevelOrient = 0	//top-bottom orientation
					var listLevelDivLocation = 2000
					
					var workflowLevel_A = 'tab_content_B'
					var workflowLevel_B = 'tab_content_C'
					var workflowLevelOrient =  0	//top-bottom orientation
					var workflowLevelDivLocation = solutionPrefs.screenAttrib.spaces.classic.currentVertical
					var workflowLevelResizeWeight = 1 / 4
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.classic.currentHorizontal
					var dimensionTwo = solutionPrefs.screenAttrib.spaces.classic.currentVertical
					
					break
				
				case 'btn_space_6':
					var spaceName = 'wide'
					
					var imageURL = 'media:///space_wide.png'
					var imageActiveURL = 'media:///space_wide_active.png'
					
					var mainLevel_A = 'bean_list'
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 0	//top-bottom orientation
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.wide.currentVertical
					
					var listLevel_A = 'tab_content_A'
					var listLevel_B = 'tab_content_B'
					var listLevelOrient = 1	//left-right orientation
					var listLevelDivLocation = solutionPrefs.screenAttrib.spaces.wide.currentHorizontal
					
					var workflowLevel_A = null
					var workflowLevel_B = 'tab_content_C'
					var workflowLevelOrient = 0	//top-bottom orientation
					var workflowLevelDivLocation = 0
					var workflowLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.wide.currentHorizontal
					var dimensionTwo = solutionPrefs.screenAttrib.spaces.wide.currentVertical
					
					break
				
				case 'btn_space_7':
					var spaceName = 'workflow'
					
					var imageURL = 'media:///space_workflow.png'
					var imageActiveURL = 'media:///space_workflow_active.png'
					
					var mainLevel_A = null
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 1	//left-right orientation
					var mainLevelDivLocation = 0
					
					var listLevel_A = null
					var listLevel_B = null
					var listLevelOrient = 0	//top-bottom orientation
					var listLevelDivLocation = 180
					
					var workflowLevel_A = null
					var workflowLevel_B = 'tab_content_C'
					var workflowLevelOrient = 0	//top-bottom orientation
					var workflowLevelDivLocation = 0
					var workflowLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = 0
					
					break
			
				case 'btn_space_8':
					var spaceName = 'standard flip'
					
					var imageURL = 'media:///space_standard_flip.png'
					var imageActiveURL = 'media:///space_standard_flip_active.png'
					
					var mainLevel_A = 'bean_list'
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 1	//left-right orientation
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.standard.currentHorizontal
					
					var listLevel_A = 'tab_content_B'
					var listLevel_B = 'tab_content_A'
					var listLevelOrient = 0	//top-bottom orientation
					var listLevelDivLocation = solutionPrefs.screenAttrib.spaces.standard.currentVertical
					
					var workflowLevel_A = null
					var workflowLevel_B = 'tab_content_C'
					var workflowLevelOrient = 0	//top-bottom orientation
					var workflowLevelDivLocation = 0
					var workflowLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.standard.currentHorizontal
					var dimensionTwo = solutionPrefs.screenAttrib.spaces.standard.currentVertical
					
					break
				
				case 'btn_space_9':
					var spaceName = 'list flip'
					
					var imageURL = 'media:///space_list_flip.png'
					var imageActiveURL = 'media:///space_list_flip_active.png'
					
					var mainLevel_A = 'bean_list'
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 1	//left-right orientation
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.list.currentHorizontal
					
					var listLevel_A = 'tab_content_A'
					var listLevel_B = null
					var listLevelOrient = 0	//top-bottom orientation
					var listLevelDivLocation = 0
					
					var workflowLevel_A = null
					var workflowLevel_B = 'tab_content_C'
					var workflowLevelOrient = 0	//top-bottom orientation
					var workflowLevelDivLocation = 0
					var workflowLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.list.currentHorizontal
					
					break
				
				case 'btn_space_10':
					var spaceName = 'vertical flip'
					
					var imageURL = 'media:///space_vertical_flip.png'
					var imageActiveURL = 'media:///space_vertical_flip_active.png'
					
					var mainLevel_A = 'bean_list'
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 1	//left-right orientation
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne + solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo
					
					var listLevel_A = 'tab_content_B'
					var listLevel_B = 'tab_content_A'
					var listLevelOrient = 1	//left-right orientation
					var listLevelDivLocation = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne
					
					var workflowLevel_A = null
					var workflowLevel_B = 'tab_content_C'
					var workflowLevelOrient = 0	//top-bottom orientation
					var workflowLevelDivLocation = 0
					var workflowLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne
					var dimensionTwo = solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo
					
					break
				
				case 'btn_space_11':
					var spaceName = 'centered flip'
					
					var imageURL = 'media:///space_centered_flip.png'
					var imageActiveURL = 'media:///space_centered_flip_active.png'
					
					var mainLevel_A = 'bean_list'
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 1	//left-right orientation
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne
					
					var listLevel_A = 'tab_content_B'
					var listLevel_B = null
					var listLevelOrient = 0	//top-bottom orientation
					var listLevelDivLocation = 2000
					
					var workflowLevel_A = 'tab_content_C'
					var workflowLevel_B = 'tab_content_A'
					var workflowLevelOrient = 1	//left-right orientation
					var workflowLevelDivLocation = forms[baseForm].elements.bean_main.getWidth() - solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne - solutionPrefs.screenAttrib.spaces.centered.currentHorizontalTwo
					var workflowLevelResizeWeight = 1
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne
					var dimensionTwo = solutionPrefs.screenAttrib.spaces.centered.currentHorizontalTwo
					
					break
				
				case 'btn_space_12':
					var spaceName = 'classic flip'
					
					var imageURL = 'media:///space_classic_flip.png'
					var imageActiveURL = 'media:///space_classic_flip_active.png'
					
					var mainLevel_A = 'bean_list'
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 1	//left-right orientation
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.classic.currentHorizontal
					
					var listLevel_A = 'tab_content_B'
					var listLevel_B = null
					var listLevelOrient = 0	//top-bottom orientation
					var listLevelDivLocation = 2000
					
					var workflowLevel_A = 'tab_content_A'
					var workflowLevel_B = 'tab_content_C'
					var workflowLevelOrient =  0	//top-bottom orientation
					var workflowLevelDivLocation = solutionPrefs.screenAttrib.spaces.classic.currentVertical
					var workflowLevelResizeWeight = 1 / 4
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.classic.currentHorizontal
					var dimensionTwo = solutionPrefs.screenAttrib.spaces.classic.currentVertical
					
					break
				
				case 'btn_space_13':
					var spaceName = 'wide flip'
					
					var imageURL = 'media:///space_wide_flip.png'
					var imageActiveURL = 'media:///space_wide_flip_active.png'
					
					var mainLevel_A = 'bean_list'
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 0	//top-bottom orientation
					var mainLevelDivLocation = solutionPrefs.screenAttrib.spaces.wide.currentVertical
					
					var listLevel_A = 'tab_content_B'
					var listLevel_B = 'tab_content_A'
					var listLevelOrient = 1	//left-right orientation
					var listLevelDivLocation = solutionPrefs.screenAttrib.spaces.wide.currentHorizontal
					
					var workflowLevel_A = null
					var workflowLevel_B = 'tab_content_C'
					var workflowLevelOrient = 0	//top-bottom orientation
					var workflowLevelDivLocation = 0
					var workflowLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = solutionPrefs.screenAttrib.spaces.wide.currentHorizontal
					var dimensionTwo = solutionPrefs.screenAttrib.spaces.wide.currentVertical
					
					break
				
				case 'btn_space_14':
					var spaceName = 'workflow flip'
					
					var imageURL = 'media:///space_workflow_flip.png'
					var imageActiveURL = 'media:///space_workflow_flip_active.png'
					
					var mainLevel_A = null
					var mainLevel_B = 'bean_workflow'
					var mainLevelOrient = 1	//left-right orientation
					var mainLevelDivLocation = 0
					
					var listLevel_A = null
					var listLevel_B = null
					var listLevelOrient = 0	//top-bottom orientation
					var listLevelDivLocation = 180
					
					var workflowLevel_A = null
					var workflowLevel_B = 'tab_content_B'
					var workflowLevelOrient = 0	//top-bottom orientation
					var workflowLevelDivLocation = 0
					var workflowLevelResizeWeight = 0
					
					//needed for logging
					var dimensionOne = 0
					
					break
			}
				
			//activate this space; only if the space switching to is different (unless forced to fire)
			if (buttonName == elem && (oldSpace != spaceName || noFlip)) {
				globals.CODE_cursor_busy(true)
				
				var bkgndLight = new Packages.java.awt.Color(13752290)
				var bkgndDark = new Packages.java.awt.Color(10596559)
				
				//set background color to be light so we don't notice the massive redraws as much
					forms[baseForm].elements.bean_wrapper_1.background = bkgndLight
					forms[baseForm].elements.bean_wrapper_2.background = bkgndLight
					forms[baseForm].elements.bean_main.background = bkgndLight
					forms[baseForm].elements.bean_list.background = bkgndLight
					forms[baseForm].elements.bean_workflow.background = bkgndLight
				
				//BEAN SETUP
					//null everything out so we don't get any lockouts
					forms[baseForm].elements.bean_main.leftComponent = null
					forms[baseForm].elements.bean_main.rightComponent = null
					forms[baseForm].elements.bean_list.topComponent = null
					forms[baseForm].elements.bean_list.bottomComponent = null
					forms[baseForm].elements.bean_workflow.topComponent = null
					forms[baseForm].elements.bean_workflow.bottomComponent = null
					
					//top-level bean
					forms[baseForm].elements.bean_main.leftComponent = forms[baseForm].elements[mainLevel_A]
					forms[baseForm].elements.bean_main.rightComponent = forms[baseForm].elements[mainLevel_B]
					forms[baseForm].elements.bean_main.orientation = mainLevelOrient
					forms[baseForm].elements.bean_main.dividerLocation = mainLevelDivLocation
					
					
					//left-side (list) bean
					forms[baseForm].elements.bean_list.topComponent = forms[baseForm].elements[listLevel_A]
					forms[baseForm].elements.bean_list.bottomComponent = forms[baseForm].elements[listLevel_B]
					forms[baseForm].elements.bean_list.orientation = listLevelOrient
					forms[baseForm].elements.bean_list.dividerLocation = listLevelDivLocation
					
					
					//right-side (workflow) bean
					forms[baseForm].elements.bean_workflow.topComponent = forms[baseForm].elements[workflowLevel_A]
					forms[baseForm].elements.bean_workflow.bottomComponent = forms[baseForm].elements[workflowLevel_B]
					forms[baseForm].elements.bean_workflow.resizeWeight = workflowLevelResizeWeight
					forms[baseForm].elements.bean_workflow.orientation = workflowLevelOrient
					forms[baseForm].elements.bean_workflow.dividerLocation = workflowLevelDivLocation
				
				//re-wiggle beans if needed for the wide space
				if (spaceName == 'wide' || oldSpace == 'wide' || spaceName == 'wide flip' || oldSpace == 'wide flip') {
					application.updateUI()
					
					//main bean setup
					forms[baseForm].elements.bean_main.orientation = mainLevelOrient
					forms[baseForm].elements.bean_main.dividerLocation = mainLevelDivLocation
					
					//list bean setup
					forms[baseForm].elements.bean_list.orientation = listLevelOrient
					forms[baseForm].elements.bean_list.dividerLocation = listLevelDivLocation
					
					//workflow bean setup
					forms[baseForm].elements.bean_workflow.orientation = workflowLevelOrient
					forms[baseForm].elements.bean_workflow.dividerLocation = workflowLevelDivLocation
				}
				
				//save down which space we are in
				solutionPrefs.config.activeSpace = spaceName
				
				//TODO: only do if changed spaces have different dimensions
				//running in 3.5?
				if (utils.stringToNumber(solutionPrefs.clientInfo.verServoy) < 4) {
					//re-fire UL if configured and changing spaces
					if (solutionPrefs.config.currentFormID && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]) {
						var currentNavItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]
						if (oldSpace != spaceName && currentNavItem.navigationItem.useFwList) {
							forms[currentNavItem.listData.tabFormInstance].UL_fill_data()
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
				
				//set graphic to be depressed
				forms[baseForm + '__header'].elements[elem].setImageURL(imageActiveURL)
				
				//DS_space_flexible method sets the correct border and turns off dividers if showing
				globals.DS_space_flexible(true,skipUI)
				
				//set background color to be dark again (so dividers show up)
					forms[baseForm].elements.bean_wrapper_1.background = bkgndDark
					forms[baseForm].elements.bean_wrapper_2.background = bkgndDark
					forms[baseForm].elements.bean_main.background = bkgndDark
					forms[baseForm].elements.bean_list.background = bkgndDark
					forms[baseForm].elements.bean_workflow.background = bkgndDark
					
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
				
				globals.CODE_cursor_busy(false)
			}
			//leave graphic on depressed state if same button clicked
			else if (buttonName == elem && oldSpace == spaceName) {
				forms[baseForm + '__header'].elements[elem].setImageURL(imageActiveURL)
			}
			//set graphic to normal state (non-depressed)
			else {
				forms[baseForm + '__header'].elements[elem].setImageURL(imageURL)
			}		
		}
		
		//refresh screen if required
		if (solutionPrefs.config.activeSpace != oldSpace) {
			application.updateUI()
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
		
		solutionPrefs.config.flexibleSpace = !solutionPrefs.config.flexibleSpace
		
		if (solutionPrefs.config.flexibleSpace) {
			var dividerSize = 9
			
			//turn on additional bordering
			forms.NAV__navigation_tree.elements.tab_rows.border = 'MatteBorder,0,0,1,0,#333333'
			forms.DATASUTRA_WEB_0F__workflow.elements.tab_workflow.border = 'MatteBorder,0,0,0,1,#333333'
		}
		else {
			var dividerSize = 0
			
			//turn off additional bordering
			forms.NAV__navigation_tree.elements.tab_rows.border = 'EmptyBorder,0,0,0,0'
			forms.DATASUTRA_WEB_0F__workflow.elements.tab_workflow.border = 'EmptyBorder,0,0,0,0'
		}
		
		forms.DATASUTRA_WEB_0F.elements.tab_wrapper.dividerSize = dividerSize
		elements.split_tool_find.dividerSize = dividerSize
		forms.DATASUTRA_WEB_0F__list.elements.tab_list.dividerSize = dividerSize
		forms.DATASUTRA_WEB_0F__main.elements.tab_main.dividerSize = dividerSize
		forms.DATASUTRA_WEB_0F__workflow.elements.tab_workflow.dividerSize = dividerSize
		
		return
		
		
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

		var baseForm = solutionPrefs.config.formNameBase
		var forceHide = arguments[0]
		var skipUI = arguments[1]
		var sidebarStatus = solutionPrefs.screenAttrib.sidebar.status
		
		var borderTop = 'MatteBorder,1,0,0,0,#333333'
		var borderEmpty = 'EmptyBorder,0,0,0,0'
		
		//determine which ones to show and which to hide
		switch (solutionPrefs.config.activeSpace) {
				case 'standard':
					var mainLevel = true
					var listLevel = true
					var workflowLevel = false
					
					var contentArea_A_Show = 'MatteBorder,0,1,1,0,#333333'
					var contentArea_B_Show = 'MatteBorder,1,1,0,0,#333333'
					var contentArea_C_Show = 'MatteBorder,0,0,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_C_Show = 'MatteBorder,0,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = 'MatteBorder,1,0,0,0,#333333'
					var contentArea_C_Hide = 'MatteBorder,0,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.standard.currentHorizontal : 0
					var dimensionTwoStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.standard.currentVertical : 0
					var dimensionOneEnd = forms[baseForm].elements.bean_main.dividerLocation
					var dimensionTwoEnd = forms[baseForm].elements.bean_list.dividerLocation
					
					break
					
				case 'list':
					var mainLevel = true
					var listLevel = false
					var workflowLevel = false
					
					var contentArea_A_Show = borderEmpty
					var contentArea_B_Show = 'MatteBorder,0,1,0,0,#333333'
					var contentArea_C_Show = 'MatteBorder,0,0,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_C_Show = 'MatteBorder,0,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = borderEmpty
					var contentArea_C_Hide = 'MatteBorder,0,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.list.currentHorizontal : 0
					var dimensionOneEnd = forms[baseForm].elements.bean_main.dividerLocation
					
					break
					
				case 'vertical':
					var mainLevel = true
					var listLevel = true
					var workflowLevel = false
					
					var contentArea_A_Show = 'MatteBorder,0,1,0,0,#333333'
					var contentArea_B_Show = 'MatteBorder,0,1,0,1,#333333'
					var contentArea_C_Show = 'MatteBorder,0,0,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_C_Show = 'MatteBorder,0,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = 'MatteBorder,0,0,0,1,#333333'
					var contentArea_C_Hide = 'MatteBorder,0,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne : 0
					var dimensionTwoStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo : 0
					var dimensionOneEnd = forms[baseForm].elements.bean_list.dividerLocation
					var dimensionTwoEnd = forms[baseForm].elements.bean_main.dividerLocation - forms[baseForm].elements.bean_list.dividerLocation
					
					break
					
				case 'centered':
					var mainLevel = true
					var listLevel = false
					var workflowLevel = true
					
					var contentArea_A_Show = 'MatteBorder,0,1,0,0,#333333'
					var contentArea_B_Show = 'MatteBorder,0,0,0,1,#333333'
					var contentArea_C_Show = 'MatteBorder,0,1,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_B_Show = 'MatteBorder,0,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = 'MatteBorder,0,0,0,1,#333333'
					var contentArea_C_Hide = 'MatteBorder,0,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne : 0
					var dimensionTwoStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne : 0
					var dimensionOneEnd = forms[baseForm].elements.bean_main.dividerLocation
					var dimensionTwoEnd = forms[baseForm].elements.bean_main.getWidth() - forms[baseForm].elements.bean_main.dividerLocation - forms[baseForm].elements.bean_workflow.dividerLocation
					
					break
					
				case 'classic':
					var mainLevel = true
					var listLevel = false
					var workflowLevel = true
					
					var contentArea_A_Show = 'MatteBorder,0,1,0,0,#333333'
					var contentArea_B_Show = 'MatteBorder,0,0,1,1,#333333'
					var contentArea_C_Show = 'MatteBorder,1,0,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_B_Show = 'MatteBorder,0,1,1,1,#333333'
						contentArea_C_Show = 'MatteBorder,1,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = 'MatteBorder,0,0,0,1,#333333'
					var contentArea_C_Hide = 'MatteBorder,1,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.classic.currentHorizontal : 0
					var dimensionTwoStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.classic.currentVertical : 0
					var dimensionOneEnd = forms[baseForm].elements.bean_main.dividerLocation
					var dimensionTwoEnd = forms[baseForm].elements.bean_workflow.dividerLocation
					
					break
					
				case 'wide':
					var mainLevel = true
					var listLevel = true
					var workflowLevel = false
					
					var contentArea_A_Show = 'MatteBorder,0,1,1,0,#333333'
					var contentArea_B_Show = 'MatteBorder,0,0,1,1,#333333'
					var contentArea_C_Show = 'MatteBorder,1,0,0,0,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_B_Show = 'MatteBorder,0,1,1,1,#333333'
						contentArea_C_Show = 'MatteBorder,1,1,0,0,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = 'MatteBorder,0,0,0,1,#333333'
					var contentArea_C_Hide = 'MatteBorder,1,0,0,0,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.wide.currentVertical : 0
					var dimensionTwoStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.wide.currentHorizontal : 0
					var dimensionOneEnd = forms[baseForm].elements.bean_main.dividerLocation
					var dimensionTwoEnd = forms[baseForm].elements.bean_list.dividerLocation
					
					break
					
				case 'workflow':
					var mainLevel = false
					var listLevel = false
					var workflowLevel = false
					
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
				
				case 'standard flip':
					var mainLevel = true
					var listLevel = true
					var workflowLevel = false
					
					var contentArea_A_Show = 'MatteBorder,1,1,0,0,#333333'
					var contentArea_B_Show = 'MatteBorder,0,1,1,0,#333333'
					var contentArea_C_Show = 'MatteBorder,0,0,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_C_Show = 'MatteBorder,0,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = 'MatteBorder,1,0,0,0,#333333'
					var contentArea_B_Hide = borderEmpty
					var contentArea_C_Hide = 'MatteBorder,0,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.standard.currentHorizontal : 0
					var dimensionTwoStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.standard.currentVertical : 0
					var dimensionOneEnd = forms[baseForm].elements.bean_main.dividerLocation
					var dimensionTwoEnd = forms[baseForm].elements.bean_list.dividerLocation
					
					break
					
				case 'list flip':
					var mainLevel = true
					var listLevel = false
					var workflowLevel = false
					
					var contentArea_A_Show = 'MatteBorder,0,1,0,0,#333333'
					var contentArea_B_Show = borderEmpty
					var contentArea_C_Show = 'MatteBorder,0,0,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_C_Show = 'MatteBorder,0,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = borderEmpty
					var contentArea_B_Hide = borderEmpty
					var contentArea_C_Hide = 'MatteBorder,0,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.list.currentHorizontal : 0
					var dimensionOneEnd = forms[baseForm].elements.bean_main.dividerLocation
					
					break
					
				case 'vertical flip':
					var mainLevel = true
					var listLevel = true
					var workflowLevel = false
					
					var contentArea_A_Show = 'MatteBorder,0,1,0,1,#333333'
					var contentArea_B_Show = 'MatteBorder,0,1,0,0,#333333'
					var contentArea_C_Show = 'MatteBorder,0,0,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_C_Show = 'MatteBorder,0,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = 'MatteBorder,0,0,0,1,#333333'
					var contentArea_B_Hide = borderEmpty
					var contentArea_C_Hide = 'MatteBorder,0,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne : 0
					var dimensionTwoStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo : 0
					var dimensionOneEnd = forms[baseForm].elements.bean_list.dividerLocation
					var dimensionTwoEnd = forms[baseForm].elements.bean_main.dividerLocation - forms[baseForm].elements.bean_list.dividerLocation
					
					break
					
				case 'centered flip':
					var mainLevel = true
					var listLevel = false
					var workflowLevel = true
					
					var contentArea_A_Show = 'MatteBorder,0,0,0,1,#333333'
					var contentArea_B_Show = 'MatteBorder,0,1,0,0,#333333'
					var contentArea_C_Show = 'MatteBorder,0,1,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_A_Show = 'MatteBorder,0,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = 'MatteBorder,0,0,0,1,#333333'
					var contentArea_B_Hide = borderEmpty
					var contentArea_C_Hide = 'MatteBorder,0,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne : 0
					var dimensionTwoStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne : 0
					var dimensionOneEnd = forms[baseForm].elements.bean_main.dividerLocation
					var dimensionTwoEnd = forms[baseForm].elements.bean_main.getWidth() - forms[baseForm].elements.bean_main.dividerLocation - forms[baseForm].elements.bean_workflow.dividerLocation
					
					break
					
				case 'classic flip':
					var mainLevel = true
					var listLevel = false
					var workflowLevel = true
					
					var contentArea_A_Show = 'MatteBorder,0,0,1,1,#333333'
					var contentArea_B_Show = 'MatteBorder,0,1,0,0,#333333'
					var contentArea_C_Show = 'MatteBorder,1,0,0,1,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_A_Show = 'MatteBorder,0,1,1,1,#333333'
						contentArea_C_Show = 'MatteBorder,1,1,0,1,#333333'
					}
					
					var contentArea_A_Hide = 'MatteBorder,0,0,0,1,#333333'
					var contentArea_B_Hide = borderEmpty
					var contentArea_C_Hide = 'MatteBorder,1,0,0,1,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.classic.currentHorizontal : 0
					var dimensionTwoStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.classic.currentVertical : 0
					var dimensionOneEnd = forms[baseForm].elements.bean_main.dividerLocation
					var dimensionTwoEnd = forms[baseForm].elements.bean_workflow.dividerLocation
					
					break
					
				case 'wide flip':
					var mainLevel = true
					var listLevel = true
					var workflowLevel = false
					
					var contentArea_A_Show = 'MatteBorder,0,0,1,1,#333333'
					var contentArea_B_Show = 'MatteBorder,0,1,1,0,#333333'
					var contentArea_C_Show = 'MatteBorder,1,0,0,0,#333333'
					
					//override defaults when sidebar visible
					if (sidebarStatus) {
						contentArea_A_Show = 'MatteBorder,0,1,1,1,#333333'
						contentArea_C_Show = 'MatteBorder,1,1,0,0,#333333'
					}
					
					var contentArea_A_Hide = 'MatteBorder,0,0,0,1,#333333'
					var contentArea_B_Hide = borderEmpty
					var contentArea_C_Hide = 'MatteBorder,1,0,0,0,#333333'
					
					var dimensionOneStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.wide.currentVertical : 0
					var dimensionTwoStart = (solutionPrefs.screenAttrib) ? solutionPrefs.screenAttrib.spaces.wide.currentHorizontal : 0
					var dimensionOneEnd = forms[baseForm].elements.bean_main.dividerLocation
					var dimensionTwoEnd = forms[baseForm].elements.bean_list.dividerLocation
					
					break
					
				case 'workflow flip':
					var mainLevel = false
					var listLevel = false
					var workflowLevel = false
					
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
			}
		
		
		//dividers showing, hide
		if (forceHide || solutionPrefs.config.flexibleSpace) {
			//Navigation item area
			forms[baseForm].elements.tab_content_A.setBorder(contentArea_A_Hide)
			
			//UL record area
			forms[baseForm].elements.tab_content_B.setBorder(contentArea_B_Hide)
			
			//bottom part of right-side tab panel
			forms[baseForm].elements.tab_content_C.setBorder(contentArea_C_Hide)
			
			//pseudo-border in header
			forms[baseForm].elements.tab_header.setBorder(borderEmpty)
			forms.DATASUTRA__sidebar__header.elements.gfx_flexible.visible = false
			forms[baseForm].elements.gfx_flexible.visible = false
			
			//status of flexible spaces
			solutionPrefs.config.flexibleSpace = false
			
			//save status, log current view, and refresh UL if not forceHidden
			if (!forceHide) {
				switch (solutionPrefs.config.activeSpace) {
					case 'standard' : 
					case 'standard flip' : 
							solutionPrefs.screenAttrib.spaces.standard.currentHorizontal = forms[baseForm].elements.bean_main.dividerLocation
							solutionPrefs.screenAttrib.spaces.standard.currentVertical = forms[baseForm].elements.bean_list.dividerLocation
							break
								
					case 'list' : 
					case 'list flip' : 
							solutionPrefs.screenAttrib.spaces.list.currentHorizontal = forms[baseForm].elements.bean_main.dividerLocation
							break
								
					case 'vertical' : 
					case 'vertical flip' : 
							solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne = forms[baseForm].elements.bean_list.dividerLocation
							solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo = forms[baseForm].elements.bean_main.dividerLocation - forms[baseForm].elements.bean_list.dividerLocation
							break
								
					case 'centered' :
					case 'centered flip' : 
							solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne = forms[baseForm].elements.bean_main.dividerLocation
							solutionPrefs.screenAttrib.spaces.centered.currentHorizontalTwo = forms[baseForm].elements.bean_main.getWidth() - forms[baseForm].elements.bean_main.dividerLocation - forms[baseForm].elements.bean_workflow.dividerLocation
							break
								
					case 'classic' : 
					case 'classic flip' : 
							solutionPrefs.screenAttrib.spaces.classic.currentHorizontal = forms[baseForm].elements.bean_main.dividerLocation
							solutionPrefs.screenAttrib.spaces.classic.currentVertical = forms[baseForm].elements.bean_workflow.dividerLocation
							break
								
					case 'wide' : 
					case 'wide flip' : 
							solutionPrefs.screenAttrib.spaces.wide.currentVertical = forms[baseForm].elements.bean_main.dividerLocation
							solutionPrefs.screenAttrib.spaces.wide.currentHorizontal = forms[baseForm].elements.bean_list.dividerLocation
							break
				}
				
				if (sidebarStatus) {
					solutionPrefs.screenAttrib.sidebar.currentSize = application.getWindowWidth(null) - forms[baseForm].elements.bean_wrapper_1.dividerLocation
				}
				
				//LOG windowing
				globals.TRIGGER_log_create('Flexible windowing',
						solutionPrefs.config.activeSpace,
						solutionPrefs.config.activeSpace,
						dimensionOneStart,
						dimensionTwoStart,
						dimensionOneEnd,
						dimensionTwoEnd,
						application.getWindowWidth(),
						application.getWindowHeight()
						)
				
				//TODO: only do if changed spaces have different dimensions
				//running in 3.5?
				if (utils.stringToNumber(solutionPrefs.clientInfo.verServoy) < 4) {
					//re-fire UL if configured and changing spaces
					if (solutionPrefs.config.currentFormID && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]) {
						var currentNavItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]
						if (currentNavItem.navigationItem.useFwList) {
							forms[currentNavItem.listData.tabFormInstance].UL_fill_data()
						}
					}
				}
				
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
			forms[baseForm].elements.bean_main.dividerSize = 0
			
			//left-side (list) bean
			forms[baseForm].elements.bean_list.dividerSize = 0
			
			//right-side (workflow) bean
			forms[baseForm].elements.bean_workflow.dividerSize = 0
			
			//sidebar bean
			forms[baseForm].elements.bean_wrapper_1.dividerSize = 0
			
			//header tool/find bean
			forms[baseForm + '__header'].elements.split_tool_find.dividerSize = 0
		}
		//show dividers
		else {
			//Navigation item area
			forms[baseForm].elements.tab_content_A.setBorder(contentArea_A_Show)
			
			//UL record area
			forms[baseForm].elements.tab_content_B.setBorder(contentArea_B_Show)
			
			//bottom part of right-side tab panel
			forms[baseForm].elements.tab_content_C.setBorder(contentArea_C_Show)
			
			//pseudo-border in header
			if (sidebarStatus) {
				forms[baseForm].elements.tab_header.setBorder('MatteBorder,0,1,0,0,#757575')
				forms.DATASUTRA__sidebar__header.elements.gfx_flexible.visible = true
			//	forms[baseForm].elements.gfx_flexible.visible = true
			}
			
			//status of flexible spaces
			solutionPrefs.config.flexibleSpace = true
			
			//top-level bean
			forms[baseForm].elements.bean_main.dividerSize = (mainLevel) ? 8 : 0
			
			//left-side (list) bean
			forms[baseForm].elements.bean_list.dividerSize = (listLevel) ? 8 : 0
			
			//right-side (workflow) bean
			forms[baseForm].elements.bean_workflow.dividerSize = (workflowLevel) ? 8 : 0
			
			//sidebar bean
			forms[baseForm].elements.bean_wrapper_1.dividerSize = (sidebarStatus) ? 8 : 0
			
			//header tool/find bean
			forms[baseForm + '__header'].elements.split_tool_find.dividerSize = 8
		}
		
		//don't fire when exiting design mode and going into preference
		if (!skipUI) {
			application.updateUI()
		}
		
		//in design mode and locked, update lock
		if (solutionPrefs.design.statusDesign && solutionPrefs.design.statusLockWorkflow) {
			globals.DEV_lock_workflow(true,solutionPrefs.design.statusLockList)
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
	//check license
	forms.NSTL_0F_solution__license.ACTION_validate(true,true)
	
	//name for non-named item
	var noName = '**No name**'
	
	if (application.__parent__.solutionPrefs) {
		
		//timed out, throw up error
		if (solutionPrefs.config.prefs.thatsAllFolks) {
			forms.NSTL_0F_solution__license.ACTION_status()
			
			plugins.dialogs.showErrorDialog(
								'Trial expired',
								'Trial time expired\n' +
								'Please restart.'
							)
		}
		
		var baseForm = solutionPrefs.config.formNameBase
		var btnInvisible = 'btn_fw_action_left'
		var inPref = solutionPrefs.config.prefs.preferenceMode
		var currentNavItem = solutionPrefs.config.currentFormID
		
		
		//called to depress menu
		if (input instanceof JSEvent) {	
			//using access and control, need allowed configuration modes
			if (solutionPrefs.access && solutionPrefs.access.accessControl) {
				var admin = globals.CODE_copy_object(solutionPrefs.access.allowedAdminPrefs)
				var user = globals.CODE_copy_object(solutionPrefs.access.allowedUserPrefs)
			}
			//no access and control, use default configuration modes
			else {
				var navigationSets = new Array()
				
				//there is a fw config navigation set
				if (solutionPrefs.config.navigationSetID) {
					//get admin prefs
					var admin = globals.NAV_preference_mode_get('Admin',solutionPrefs.config.navigationSetID)
					
					//get user prefs
					var user = globals.NAV_preference_mode_get('User',solutionPrefs.config.navigationSetID)
				}
			}
			
			//help available?
			if (navigationPrefs.byNavItemID[currentNavItem] && navigationPrefs.byNavItemID[currentNavItem].navigationItem) {
			//	var helpAvailable = navigationPrefs.byNavItemID[currentNavItem].navigationItem.helpAvailable
				
				var helpForm = navigationPrefs.byNavItemID[currentNavItem].navigationItem.helpFormToLoad
				var helpList = navigationPrefs.byNavItemID[currentNavItem].navigationItem.helpListToLoad
				var helpDesc = navigationPrefs.byNavItemID[currentNavItem].navigationItem.helpDescription
				
				var helpAvailable = helpForm || helpList || helpDesc
			}
			
			//loop over admin modes
			for (var i = 0; i < admin.itemName.length ; i++) {
				//check for design mode
				if (admin.itemName[i] == 'Design mode') {
					var designMode = {
							name	: admin.itemName[i],
							tooltip	: admin.itemDescription[i]
						}
					
					admin.itemName.splice(i,1)
					admin.formName.splice(i,1)
					admin.navItemID.splice(i,1)
					admin.itemDescription.splice(i,1)
					
					//set counter back one
					i--
				}
			}
			
			//loop over user modes
			for (var i = 0; i < user.itemName.length ; i++) {
				//remove if present
					//1- power replace
					//2- feedback when in a preference
					//3- lock solution
					//4- help
				if (user.itemName[i] == 'Power Replace' || 
					(inPref && user.itemName[i] == 'Feedback') ||
					user.itemName[i] == 'Lock session' ||
					user.itemName[i] == 'Help') {
					
					if (user.itemName[i] == 'Lock session') {
						var lockSession = {
								name	: user.itemName[i],
								tooltip	: user.itemDescription[i]
							}
					}
					else if (user.itemName[i] == 'Help' && helpAvailable) {
						var flagHelp = {
								name	: user.itemName[i],
								tooltip	: user.itemDescription[i]
							}
					}
					
					user.itemName.splice(i,1)
					user.formName.splice(i,1)
					user.navItemID.splice(i,1)
					user.itemDescription.splice(i,1)
					
					//set counter back one
					i--
				}
			}
			
			//tack on help when not in a preference or devmode
			if (flagHelp && !inPref && !solutionPrefs.design.statusDesign) {
				var helpText = (solutionPrefs.config.helpMode) ? 'Leave help' : 'Help'
				user.itemName.unshift(helpText)
				user.formName.unshift(null)
				user.navItemID.unshift(null)
				user.itemDescription.unshift(flagHelp.tooltip)
			}
			//add option to change password if access and control enabled and password changing isn't disabled
			if (solutionPrefs.access && solutionPrefs.access.accessControl && !solutionPrefs.access.passNoChange) {
				user.itemName.push('Change password')
				user.formName.push('AC_P_password')
				user.navItemID.push(null)
				user.itemDescription.push('Periodically change your password to ensure security')
			}
			//add option to set custom screen size if access and control
			if (solutionPrefs.access && solutionPrefs.access.accessControl ) {
				user.itemName.push('Save window metrics')
				user.formName.push('AC_P_screen')
				user.navItemID.push(null)
				user.itemDescription.push('Set the current window size, position, and spaces as your new default')
			}
			
			//create arrays
			var valueList = new Array()
			var formList = new Array()
			var navIDList = new Array()
			var descList = new Array()
			var typeList = new Array()
			
			//design mode toggle
			if (!inPref) {
				//design mode is an option, show it
				if (designMode) {
					valueList[valueList.length] = '<html><body><strong>' + ((designMode.name) ? designMode.name : noName) + '</strong></body></html>'
					formList[formList.length] = ''
					navIDList[navIDList.length] = ''
					descList[descList.length] = designMode.tooltip
					typeList.push(null)
				}
				
				//divider required
				if (designMode && ((admin.itemName && admin.itemName.length) || (user.itemName && user.itemName.length))) {
					valueList[valueList.length] = '-'
					formList[formList.length] = ''
					navIDList[navIDList.length] = ''
					descList[descList.length] = ''
					typeList.push(null)
				}
			}
			
			//admin screens
			if (admin.itemName && admin.itemName.length) {
				for (var i = 0; i < admin.itemName.length; i++) {
					valueList[valueList.length] = ((admin.itemName[i]) ? admin.itemName[i] : noName)
					formList[formList.length] = admin.formName[i]
					navIDList[navIDList.length] = admin.navItemID[i]
					descList[descList.length] = admin.itemDescription[i]
					typeList.push('Admin')
				}
			}
			
		/*	//sidebars
			if (!inPref && solutionPrefs.panel.sidebar && solutionPrefs.panel.sidebar.length) {
				//there are admin modes, show divider
				if (admin.itemName && admin.itemName.length) {
					valueList[valueList.length] = '-'
					formList[formList.length] = ''
					navIDList[navIDList.length] = ''
					descList[descList.length] = ''
					typeList.push(null)
				}
				
				//punch down all active sidebars
				for (var i = 0; i < solutionPrefs.panel.sidebar.length; i++) {
					valueList[valueList.length] = (solutionPrefs.panel.sidebar[i].tabName) ? solutionPrefs.panel.sidebar[i].tabName : noName
					formList[formList.length] = solutionPrefs.panel.sidebar[i].formName
					navIDList[navIDList.length] = i + 1
					descList[descList.length] = solutionPrefs.panel.sidebar[i].description
					typeList.push('Sidebar')
				}
				
				//there are user modes, show divider
				if (user.itemName && user.itemName.length) {
					valueList[valueList.length] = '-'
					formList[formList.length] = ''
					navIDList[navIDList.length] = ''
					descList[descList.length] = ''
					typeList.push(null)
				}
			}
			//there are admin modes and user modes, show divider
			else*/ if (admin.itemName && admin.itemName.length && user.itemName && user.itemName.length) {
				valueList[valueList.length] = '-'
				formList[formList.length] = ''
				navIDList[navIDList.length] = ''
				descList[descList.length] = ''
				typeList.push(null)
			}
			
			//user screens
			if (user.itemName && user.itemName.length) {
				for (var i = 0; i < user.itemName.length; i++) {
					valueList[valueList.length] = ((user.itemName[i]) ? user.itemName[i] : noName)
					formList[formList.length] = user.formName[i]
					navIDList[navIDList.length] = user.navItemID[i]
					descList[descList.length] = user.itemDescription[i]
					typeList.push('User')
				}
			}
			
			//add on exit preference if in one
			if (inPref) {
				valueList.push('-','<html><body><font color="#FF2823">Exit configuration</font></body></html>')
				formList.push(null,null)
				navIDList.push(null,null)
				descList.push(null,'Return to workflow')
				typeList.push(null)
			}
			
			//there are already some values, show divider
			if (valueList.length) {
				valueList[valueList.length] = '-'
				formList[formList.length] = ''
				navIDList[navIDList.length] = ''
				descList[descList.length] = ''
				typeList.push(null)
			}
			
			//lock screen if a/c enabled, it is an option, and not in a preference
			if (solutionPrefs.access.accessControl && lockSession && !inPref) {
				valueList.push(lockSession.name)
				formList.push(null)
				navIDList.push(null)
				descList.push(lockSession.tooltip)
				typeList.push(null)
			}
			
			//logout
			valueList.push('<html><body><font color="#FF2823">Logout</font></body></html>')
			formList.push(null)
			navIDList.push(null)
			descList.push('Re-open solution as a different user')
			typeList.push(null)
			
			//build menu and set arguments
			var menu = new Array()
			var maxLength = 0
			for ( var j = 0 ; j < valueList.length ; j++ ) {
				//strip away all html until the centermost text piece remains
				var htmlTags = new Array(null,null,valueList[j])
				var htmlTags2 = htmlTags
				while (typeof htmlTags2 == 'object' && htmlTags2 != null) {
					htmlTags2 = htmlTags2[2].match(/<([A-Z][A-Z0-9]*)[^>]*>(.*?)<\/\1>/i)
					if (htmlTags2 != null) {
						htmlTags = htmlTags2
					}
				}
				
				//determine left shift amount
				if (htmlTags[0] != null) {
					if (htmlTags[2].length > maxLength) {
						maxLength = htmlTags[2].length
					}
				}
				else {
					if (valueList[j].length > maxLength) {
						maxLength = valueList[j].length
					}
				}
				
				//when...  ...create checkbox menu item if selected
					//1- in a preference, 
					//2- design mode active
					//3- sidebar showing
				if ((solutionPrefs.config.prefs.preferenceMode && solutionPrefs.config.prefs.paneSelected == navIDList[j]) || 
					(solutionPrefs.design.statusDesign && designMode && designMode.tooltip == descList[j]) || 
					(solutionPrefs.screenAttrib.sidebar.status && typeList[j] == 'Sidebar' && forms[baseForm].elements.tab_content_D.tabIndex == navIDList[j])) {
					
					menu[j] = plugins.popupmenu.createCheckboxMenuItem(valueList[j] + "", ACTIONS_list)
					menu[j].setSelected(true)
				}
				//create a normal menu item
				else {
					menu[j] = plugins.popupmenu.createMenuItem(valueList[j] + "", ACTIONS_list)
				}
				
				//pass arguments
				menu[j].setMethodArguments(htmlTags[2],formList[j],navIDList[j],typeList[j])
				
				//set tooltip, if there is one
		//		if (descList[j]) {
		//			menu[j].setToolTipText(descList[j])
		//		}
				
				//disable dividers
				if (valueList[j] == '-') {
					menu[j].setEnabled(false)
				}
			}
			
			//move "left" button to correct location
			var currentLocationX = forms[baseForm + '__header'].elements[btnInvisible].getLocationX()
			var currentLocationY = forms[baseForm + '__header'].elements[btnInvisible].getLocationY()
			
			forms[baseForm + '__header'].elements[btnInvisible].setLocation(currentLocationX - maxLength * 5.5, currentLocationY)
			
			//pop left popup menu
			var elem = forms[baseForm + '__header'].elements[btnInvisible]
			if (elem != null) {
				plugins.popupmenu.showPopupMenu(elem, menu)
			}
			
			//set invisible btn back to original location
			forms[baseForm + '__header'].elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
		}
		//menu shown and item chosen
		else {
			
			var itemClicked = input
			var itemFormName = arguments[1]
			var itemID = arguments[2]
			var itemType = arguments[3]
			
			//if a sidebar
			//MEMO: not used; seet DATASUTRA__sidebar__header.TAB_popdown()
			if (itemType == 'Sidebar') {
				//MEMO: itemID overloaded with the tab number of the sidepanel
				
				//turn sidebar off
				if (forms[baseForm].elements.tab_content_D.tabIndex == itemID && forms[baseForm].elements.tab_content_D.visible) {
					globals.DS_sidebar_toggle(false)
				}
				//set tab in sidebar
				else {
					forms[baseForm].elements.tab_content_D.tabIndex = itemID
					
					//if not showing, show sidebar
					globals.DS_sidebar_toggle(true)
				}
				
		
			}
			//check for non-standard prefpane logout
			else if (itemClicked == 'Logout') {
				security.logout(application.getSolutionName(),'DATASUTRA_open','true')
			}
			//check for non-standard prefpane lock session
			else if (itemClicked == 'Lock session') {
				//blank screen out
				forms[baseForm].elements.gfx_curtain.transparent = false
				forms[baseForm].elements.gfx_curtain.setImageURL(null)
				forms[baseForm].elements.gfx_curtain.setBorder('MatteBorder,0,0,100,0,#323A4B')
				
				//set location
				forms[baseForm].elements.gfx_curtain.setLocation(0,0)
				//set size
				forms[baseForm].elements.gfx_curtain.setSize(application.getWindowWidth(),application.getWindowHeight())
				
				//set text
				forms[baseForm].elements.gfx_curtain.text = forms[baseForm].solution_name + ' is locked'
				forms[baseForm].elements.gfx_curtain.toolTipText = 'Click to unlock'
				
				//show curtain
				forms[baseForm].elements.gfx_curtain.enabled = true
				forms[baseForm].elements.gfx_curtain.visible = true
				
				//set flag
				solutionPrefs.access.lockStatus = true
			}
			//check for non-standard prefpane feedback
			else if (itemClicked == 'Feedback') {
				//get screensize of window
				var x = application.getWindowX()
				var y = application.getWindowY()
				var width = application.getWindowWidth()
				var height =  application.getWindowHeight()
				
				//make pop-up get out of the way
				forms[baseForm + '__header'].elements.fld_constant.requestFocus(false)
				application.sleep(175)
				
				//get screenshot
				var screenShot = (new java.awt.Robot()).createScreenCapture(new java.awt.Rectangle(x,y,width,height))
				var rawData = new java.io.ByteArrayOutputStream()
				Packages.javax.imageio.ImageIO.write(screenShot,'png',rawData)
				globals.DATASUTRA_feedback = rawData.toByteArray()
				
				//show popup dialog
				globals.CODE_form_in_dialog(forms.DEV_P_feedback,-1,-1,-1,-1,'Submit feedback',false,false,'feedback',true)
			}
			//check for non-standard prefpane design mode
			else if (itemClicked == 'Design mode') {
				//make sure not in help mode
				if (solutionPrefs.config.helpMode) {
					globals.DS_help()
				}
				
				solutionPrefs.design.statusDesign = !solutionPrefs.design.statusDesign
				globals.DEV_mode_toggle()
			}
			//check for non-standard prefpane change password
			else if (itemClicked == 'Change password') {
				forms.AC_P_password.FORM_fid(solutionPrefs.access.userID)
			}
			//check for non-standard prefpane configure screen
			else if (itemClicked == 'Save window metrics') {
				forms.AC_P_screen.FORM_on_show(solutionPrefs.access.userID)
			}
			//anything that needs to exit design mode (help or preferences)
			else {
				//if in design mode, exit it
					//MEMO: we do this to eliminate using design mode where it shouldn't be used
				if (solutionPrefs.design.statusDesign) {
					//we were in design mode
					var designMode = true
					
					//check for where exactly we are
					var possibleModes = new Array(
											'buttonaction',
											'buttonadd',
											'buttonreport',
											'navigation',
											'fastfind',
											'universallist',
											'spec',
											'task',
											'help',
											'prototyper'
										)
					for (var i = 0; i < possibleModes.length; i++) {
						if (solutionPrefs.design.modes[possibleModes[i]]) {
							solutionPrefs.config.prefs.currentMode = possibleModes[i]
							break
						}
					}
					
					solutionPrefs.design.statusDesign = false
					globals.DEV_mode_toggle(true)
				}
				
				//check for non-standard prefpane help
				if (itemClicked == 'Help' || itemClicked == 'Leave help') {
					globals.DS_help()
				}
				//exit from settings mode
				else if (itemClicked == 'Exit configuration') {
					//turn on progress indicator
					globals.TRIGGER_progressbar_start(-273,'Loading new configuration data...','This process will soon only update changed information')
					
					//recreate navigationPrefs
					//with a/c
					if (solutionPrefs.access && solutionPrefs.access.accessControl) {
						globals.NAV_navigation_load(false,solutionPrefs.access.groupID)
					}
					//login disabled
					else {
						globals.NAV_navigation_load(false)
					}
					
					//save information about current config space setup
					if (solutionPrefs.config.currentFormID && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]) {
						navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].spaceStatus = new Array()
						navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].spaceStatus.lastSpace = solutionPrefs.config.activeSpace
						
						for (var i = 1; i <= 14; i++) {
							navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].spaceStatus.push(forms[baseForm + '__header'].elements['btn_space_' + i].visible)
						}
					}
					
					//enable nav_chooser, find, and toolbar toggle buttons
					forms[baseForm + '__header'].elements.btn_navset.enabled = true
					forms[baseForm + '__header__fastfind'].elements.btn_find.enabled = true
					forms[baseForm + '__header__fastfind'].elements.find_mid.enabled = true
					forms[baseForm + '__header__fastfind'].elements.find_end.enabled = true
					forms[baseForm + '__header__fastfind'].elements.fld_find.enabled = true
					forms[baseForm + '__header__toolbar'].elements.btn_toolbar_toggle.visible = true
					
					//set current form back to workflow
						//MEMO: may be changed by other stuff below
					solutionPrefs.config.currentFormName = solutionPrefs.config.prefs.workflowFormName
					solutionPrefs.config.currentFormID = solutionPrefs.config.prefs.workflowFormID
					
					//load navigation set list back in
					if (forms[baseForm].elements.tab_content_A.tabIndex > 0) {
						forms[baseForm].elements.tab_content_A.removeTabAt(1)
					}
					forms[baseForm].elements.tab_content_A.addTab(forms.NAV__navigation_tree)
					forms[baseForm].elements.tab_content_A.tabIndex = forms[baseForm].elements.tab_content_A.getMaxTabIndex()
					
					//check that last viewed navigation set still ok
					var foundSet = false
					for (var i in navigationPrefs.byNavSetID ) {
						if (i == globals.DATASUTRA_navigation_set && navigationPrefs.byNavSetID[i] != null) {
							foundSet = true
						}
					}
					
					//check that last viewed navigation item still ok
					var foundItem = false
					if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set]) {
						for (var j = 0; j < navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length && !foundItem; j++) {
							if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[j].navigationItem.idNavigationItem == solutionPrefs.config.currentFormID) {
								foundItem = true
							}
						}
					}
					
					//this hack disables our licensing checks until after the navigation item list has redrawn
					//it is necessary to prevent our unofficial way of getting two threads going in servoy
					//from backfiring and killing the whole solution
					if (solutionPrefs.config.prefs.thatsAllFolks) {
						var baDeeBaDee = true
						solutionPrefs.config.prefs.thatsAllFolks = null
					}
					
					//last navigation set still present, load at will
					if (foundSet && foundItem) {
						globals.NAV_navigation_set_load(true)
						
						//refire load forms method to bring in previous display
						globals.NAV_workflow_load(null,solutionPrefs.config.currentHistoryPosition,null,null,solutionPrefs.config.prefs.workflowSpace)
					}
					//find how much has changed
					else {
						//get new item to highlight
						if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set]) {
							if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].lastNavItem) {
								var lastItemID = navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].lastNavItem
							}
							//go to first item in the navigation set
							else if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length) {
								var lastItemID = navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[0].navigationItem.idNavigationItem
							}
							//there aren't any nav items in this set, load blanks
							else {
								
							}
						}
						
						//there are still items in this set, go to one of them
						if (foundSet && lastItemID) {
							globals.NAV_navigation_set_load(true,true)
							
							//refire default load forms method
							globals.NAV_workflow_load(lastItemID,null,true)
						}
						//load blank screen
						else {
							globals.DATASUTRA_navigation_set = 0
							
							globals.NAV_navigation_set_load(true,null)
							
							//refire default load forms method
							globals.NAV_workflow_load(null,null)
						}
					}
					
					//reload toolbars and sidebars
					solutionPrefs.panel = globals.DS_panel_load(globals.AC_current_group)
					globals.DS_toolbar_load()
					globals.DS_sidebar_load()
					
					//return toolbar window to most recent position and then clear out the stored value
					if (solutionPrefs.config.prefs.toolbarTabSelected) {
						//formerly selected tab no longer available
//						if (solutionPrefs.config.prefs.toolbarTabSelected <= forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getMaxTabIndex()) {
							forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex = solutionPrefs.config.prefs.toolbarTabSelected
//						}
						delete solutionPrefs.config.prefs.toolbarTabSelected
					}
					
					//return sidebar window to most recent position and then clear out the stored value
					if (solutionPrefs.config.prefs.sidebarTabSelected) {
						//formerly selected tab no longer available
						if (solutionPrefs.config.prefs.sidebarTabSelected <= forms[baseForm].elements.tab_content_D.getMaxTabIndex()) {
							forms[baseForm].elements.tab_content_D.tabIndex = solutionPrefs.config.prefs.sidebarTabSelected
						}
						delete solutionPrefs.config.prefs.sidebarTabSelected
					}
					
					//show sidebar
					if (solutionPrefs.config.prefs.sidebar) {
						globals.DS_sidebar_toggle(true,null,true)
						
						delete solutionPrefs.config.prefs.sidebar
					}
					
					//reload tooltips
					solutionPrefs.i18n = globals.DS_tooltip_load()
					
					//if we were in designMode, go back to it
					if (solutionPrefs.config.prefs.designMode) {
						solutionPrefs.design.statusDesign = true
						
						if (solutionPrefs.config.prefs.currentMode) {
							solutionPrefs.design.modes[solutionPrefs.config.prefs.currentMode] = true
						}
						
						globals.DEV_mode_toggle()
					}
					
					//show normal frameworks action graphic if not in design mode
					if (!solutionPrefs.design.statusDesign) {
						forms[baseForm + '__header'].elements.btn_fw_action.visible = true
					}
					
					//remove preference related flags
					//solutionPrefs.config.prefs.preferenceMode = false	//MEMO: moved to NAV_workflow_load
					delete solutionPrefs.config.prefs.workflowSpace
					delete solutionPrefs.config.prefs.workflowFormName
					delete solutionPrefs.config.prefs.workflowFormID
					delete solutionPrefs.config.prefs.preferenceMode
					delete solutionPrefs.config.prefs.designMode
					
					//in servoy 4 or greater
					if (utils.stringToNumber(solutionPrefs.clientInfo.verServoy) >= 4) {
						//a custom tab was actually being shown
						if (false) {
							forms[baseForm].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName['Custom tab ' + solutionPrefs.config.currentFormID + ': ' + solutionPrefs.config.currentFormName].listData.tabNumber
						}
						//retrigger the shown UL to reload
						else {
							//with buttons
							if (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.withButtons) {
								forms.NAV_T_universal_list.DISPLAY_cycle(true)
							
								forms.NAV_T_universal_list.FORM_on_show(true)
								forms[baseForm].elements.tab_content_B.tabIndex = 2
								forms.NAV_T_universal_list.elements.tab_ul.tabIndex = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.tabNumber
							}
							//without buttons
							else {
								forms.NAV_T_universal_list__no_buttons.DISPLAY_cycle(true)
								
								forms.NAV_T_universal_list__no_buttons.FORM_on_show(true)
								forms[baseForm].elements.tab_content_B.tabIndex = 3
								forms.NAV_T_universal_list__no_buttons.elements.tab_ul.tabIndex = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.tabNumber
							}
						}
					}
					
					//re-set progress indicator toolbar => issue with restoring last selected toolbar
					globals.TRIGGER_progressbar_stop()
					forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex = 1
					
					//turn licensing check back on
					if (baDeeBaDee) {
						solutionPrefs.config.prefs.thatsAllFolks = true
					}
				}
				//go to a specific preference
				else if (itemClicked != '-' && itemClicked != 'Design mode') {
					
					//turn on progress indicator when enabled
					if (solutionPrefs.config.prefs.configNotify) {
						var currentToolbar = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex
						
						globals.CODE_cursor_busy(true)
						globals.TRIGGER_progressbar_start(-273,'Loading ' + itemClicked + '. Please wait...')
					}
					
					//entering a preference for the first time
					if (!solutionPrefs.config.prefs.preferenceMode) {
						//web client
						if (solutionPrefs.config.webClient) {
							forms[baseForm].elements.tab_toolbar_popdown.visible = false
						}
						//smart client
						else {
							forms[baseForm].elements.sheetz.visible = false
						}
						
						//add preference flag
						solutionPrefs.config.prefs.preferenceMode = true
						
						//save current toolbar tab
						solutionPrefs.config.prefs.toolbarTabSelected = currentToolbar
						
						//web client
						if (solutionPrefs.config.webClient) {
							//save current sidebar tab
							solutionPrefs.config.prefs.sidebarTabSelected = forms.DATASUTRA__sidebar.elements.tab_content.tabIndex
						}
						//smart client
						else {
							//save current sidebar tab
							solutionPrefs.config.prefs.sidebarTabSelected = forms[baseForm].elements.tab_content_D.tabIndex
						}
						
						//if sidebar showing, save it and turn off
						if (solutionPrefs.screenAttrib.sidebar.status) {
							solutionPrefs.config.prefs.sidebar = true
							
							globals.DS_sidebar_toggle(false,null,true)
							application.updateUI()
						}
						
						//if we were in design mode, save it
						if (designMode) {
							solutionPrefs.config.prefs.designMode = true
						}
						
						//save down workflow name, id and selected space
						solutionPrefs.config.prefs.workflowFormName = solutionPrefs.config.currentFormName
						solutionPrefs.config.prefs.workflowFormID = 
						navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].lastNavItem = 
							solutionPrefs.config.currentFormID
						solutionPrefs.config.prefs.workflowSpace = solutionPrefs.config.activeSpace
						
						//save information about current workflow space setup
						if (solutionPrefs.config.prefs.workflowFormID && navigationPrefs.byNavItemID[solutionPrefs.config.prefs.workflowFormID]) {
							navigationPrefs.byNavItemID[solutionPrefs.config.prefs.workflowFormID].spaceStatus = new Array()
							navigationPrefs.byNavItemID[solutionPrefs.config.prefs.workflowFormID].spaceStatus.lastSpace = solutionPrefs.config.prefs.workflowSpace
							
							for (var i = 1; i <= 14; i++) {
								navigationPrefs.byNavItemID[solutionPrefs.config.prefs.workflowFormID].spaceStatus.push(forms[baseForm + '__header'].elements['btn_space_' + i].visible)
							}
						}
						
						//make sure find graphics are the unselected variety
						forms[baseForm + '__header__fastfind'].elements.btn_find.setImageURL('media:///find_magnify.png')
						forms[baseForm + '__header__fastfind'].elements.find_mid.setImageURL('media:///find_middle.png')
						forms[baseForm + '__header__fastfind'].elements.find_end.setImageURL('media:///find_stop.png')
						forms[baseForm + '__header'].elements.fld_constant.requestFocus(false)
						
						//disable nav_chooser, find, and toolbar cycle button
						forms[baseForm + '__header'].elements.btn_navset.enabled = false
						forms[baseForm + '__header__fastfind'].elements.btn_find.enabled = false
						forms[baseForm + '__header__fastfind'].elements.find_mid.enabled = false
						forms[baseForm + '__header__fastfind'].elements.find_end.enabled = false
						forms[baseForm + '__header__fastfind'].elements.fld_find.enabled = false
						forms[baseForm + '__header__toolbar'].elements.btn_toolbar_toggle.visible = false
						
						//hide frameworks action graphic, showing red outline underneath
						forms[baseForm + '__header'].elements.btn_fw_action.visible = false
						
						//set background color to be frameworks yellow
						forms[baseForm + '__header__toolbar'].elements.lbl_color.bgcolor = '#f5fbd4'
					}
					
					//set flag for check of selected preference
					solutionPrefs.config.prefs.paneSelected = itemID
					
					//load selected preference
					globals.NAV_preference_load(itemClicked,itemID)
					
					//turn off progress indicator when enabled
					if (solutionPrefs.config.prefs.configNotify) {
//						globals.TRIGGER_progressbar_stop()
						globals.CODE_cursor_busy(false)
					}
					
					//change header to display preference selected
					forms.TOOL_config_pane.elements.lbl_title.text = itemClicked
					forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex = 2
				}
			}
		}
	}
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"42D5D916-7E64-45FE-882A-23A6CD198989"}
 */
function dimensions(event) {
	globals.CODE_form_in_dialog(forms.DATASUTRA_WEB_P,-1,-1,-1,-1,'Dims',false)
}
