/**
 * @properties={typeid:35,uuid:"5f3ab9ad-ae76-42f9-832a-7f142065daf4"}
 */
var DEV_designbar_engine = '';

/**
 * @properties={typeid:35,uuid:"a2205ea2-0751-445b-a50e-877c6dfd0236"}
 */
var DEV_designbar_engine_button = '';

/**
 * @properties={typeid:35,uuid:"89d297ad-447c-4dea-9fbf-1c9f341da002",variableType:4}
 */
var DEV_filter_task = 1;

/**
 * @properties={typeid:35,uuid:"1cda9c06-4302-4631-af5b-d497e615a541"}
 */
var DEV_help_description = '';

/**
 * @properties={typeid:35,uuid:"73a74178-dcf6-494b-8779-e3a659dbd72a"}
 */
var DEV_html_global = '';

/**
 * @properties={typeid:35,uuid:"b232f3ba-5a33-4fb2-b0f6-5d0b642fa71d",variableType:4}
 */
var DEV_P_all;

/**
 * @properties={typeid:35,uuid:"817e167c-5549-43b8-b0f1-b03cb3c9fca0"}
 */
var DEV_P_navigation = '';

/**
 * @properties={typeid:35,uuid:"d51af929-dcde-4fd5-bf34-9bc896d49a86"}
 */
var DEV_today = '';

/**
 *
 * @properties={typeid:24,uuid:"c6a78411-0aef-4de7-896d-7051ce483528"}
 */
function DEV_clear_modes()
{

/*
 *	TITLE    :	DEV_clear_modes
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	reset flags on all modes; if true passed, actually exit mode currently in
 *			  	
 *	INPUT    :	1- exit mode instead of flag reset 
 *			  	2- calling mode
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	DEV_clear_modes(exitMode)
 *			  	
 *	MODIFIED :	December 16, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var clear = arguments[0]
var callingMode = arguments[1]

//clear other modes and refire to exit them
if (clear) {
	//clear prototyper mode
	if (solutionPrefs.design.modes.prototyper) {
		solutionPrefs.design.modes.prototyper = false
		globals.DEV_quick_buttons('prototyper')
	}
	//clear navigation mode
	else if (solutionPrefs.design.modes.navigation && callingMode != 'navigation') {
		solutionPrefs.design.modes.navigation = false
		globals.DEV_quick_buttons('navigation',false)
	}
	//clear universallist mode
	else if (solutionPrefs.design.modes.universallist) {
		solutionPrefs.design.modes.universallist = false
		globals.DEV_quick_buttons('universallist')
	}
	//clear fastfind mode
	else if (solutionPrefs.design.modes.fastfind) {
		solutionPrefs.design.modes.fastfind = false
		globals.DEV_quick_buttons('fastfind')
	}
	//clear buttonadd mode
	else if (solutionPrefs.design.modes.buttonadd && callingMode != 'buttonadd') {
		solutionPrefs.design.modes.buttonadd = false
		globals.DEV_quick_buttons('buttonadd',false)
	}
	//clear buttonaction mode
	else if (solutionPrefs.design.modes.buttonaction) {
		solutionPrefs.design.modes.buttonaction = false
		globals.DEV_quick_buttons('buttonaction')
	}
	//clear buttonreport mode
	else if (solutionPrefs.design.modes.buttonreport) {
		solutionPrefs.design.modes.buttonreport = false
		globals.DEV_quick_buttons('buttonreport')
	}
	//clear spec mode
	else if (solutionPrefs.design.modes.spec) {
		solutionPrefs.design.modes.spec = false
		globals.DEV_quick_buttons('spec')
	}
	//clear task mode
	else if (solutionPrefs.design.modes.task) {
		solutionPrefs.design.modes.task = false
		globals.DEV_quick_buttons('task')
	}
	//clear help mode
	else if (solutionPrefs.design.modes.help) {
		solutionPrefs.design.modes.help = false
		globals.DEV_quick_buttons('help')
	}
}
else {
	solutionPrefs.design.modes.prototyper = false
	solutionPrefs.design.modes.navigation = false
	solutionPrefs.design.modes.universallist = false
	solutionPrefs.design.modes.fastfind = false
	solutionPrefs.design.modes.buttonadd = false
	solutionPrefs.design.modes.buttonaction = false
	solutionPrefs.design.modes.buttonreport = false
	solutionPrefs.design.modes.spec = false
	solutionPrefs.design.modes.task = false
	solutionPrefs.design.modes.help = false
	
	solutionPrefs.config.helpMode = false
	
	delete solutionPrefs.design.statusLockWorkflow
	delete solutionPrefs.design.statusLockList
}
}

/**
 *
 * @properties={typeid:24,uuid:"53866723-d098-4a46-9997-dbb6b4d99f45"}
 */
function DEV_lock_workflow()
{

/*
 *	TITLE    :	DEV_lock_workflow
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	lock the workflow form (opposite of globals.CALLBACK_interface_lock)
 *			  	
 *	INPUT    :	1- true/false to lock/unlock the workflow
 *			  	2- true/false to lock/unlock the list area
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	DEV_lock_workflow([lockWorkflow], [lockList]) Locks the workflow and/or list areas; when called without arguments, refires current state
 *			  	
 *	MODIFIED :	February 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */
	
var lockWorkflow = (typeof arguments[0] == 'boolean') ? arguments[0] : solutionPrefs.design.statusLockWorkflow
var lockList = (typeof arguments[1] == 'boolean') ? arguments[1] : solutionPrefs.design.statusLockList

if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase
	
	//lock the workflow
	if (lockWorkflow) {
		
		var x = 0
		var y = 86 		//offset for design mode and normal header
		var divider = 8
		
		var x2 = 0
		var y2 = 86
		
		//figure out location of curtain
		switch (solutionPrefs.config.activeSpace) {
			case 'standard':
				y2 += solutionPrefs.screenAttrib.spaces.standard.currentVertical
				
				if (solutionPrefs.config.flexibleSpace) {
					y2 += divider
				}
			case 'standard flip':
				x += solutionPrefs.screenAttrib.spaces.standard.currentHorizontal
				
				if (solutionPrefs.config.flexibleSpace) {
					x += divider
				}
				break
				
			case 'list':
			case 'list flip':
				x += solutionPrefs.screenAttrib.spaces.list.currentHorizontal
				
				if (solutionPrefs.config.flexibleSpace) {
					x += divider
				}
				
				if (solutionPrefs.config.activeSpace == 'list flip') {
					var nonList = true
				}
				break
				
			case 'vertical':
				x2 += solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne
				
				if (solutionPrefs.config.flexibleSpace) {
					x2 += divider
				}
			case 'vertical flip':
				x += solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne + solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo
				
				if (solutionPrefs.config.flexibleSpace) {
					x += divider
				}
				break
				
			case 'centered':
				x2 += application.getWindowWidth(null) - solutionPrefs.screenAttrib.spaces.centered.currentHorizontalTwo
				
				if (solutionPrefs.config.flexibleSpace) {
					x2 += divider
				}
			case 'centered flip':
				x += solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne
				
				if (solutionPrefs.config.flexibleSpace) {
					x += divider
				}
				
				break
				
			case 'classic':
				x2 += solutionPrefs.screenAttrib.spaces.classic.currentHorizontal
				
				if (solutionPrefs.config.flexibleSpace) {
					x2 += divider
				}
			case 'classic flip':
				x += solutionPrefs.screenAttrib.spaces.classic.currentHorizontal
				y += solutionPrefs.screenAttrib.spaces.classic.currentVertical
				
				if (solutionPrefs.config.flexibleSpace) {
					x += divider
					y += divider
				}
				break
				
			case 'wide':
				x2 += solutionPrefs.screenAttrib.spaces.wide.currentHorizontal
				
				if (solutionPrefs.config.flexibleSpace) {
					x2 += divider
				}
			case 'wide flip':
				y += solutionPrefs.screenAttrib.spaces.wide.currentVertical
				
				if (solutionPrefs.config.flexibleSpace) {
					y += divider
				}
				break
				
			case 'workflow':
				if (solutionPrefs.config.activeSpace == 'workflow') {
					var nonList = true
				}
				break
				
			case 'workflow flip':
				if (!lockList) {
					forms[baseForm].elements.gfx_curtain.visible = false
					forms[baseForm].elements.gfx_curtain_2.visible = false
					return
				}
				else {
					nonList = true
				}
				break
		}
		
	//CURTAIN ONE
		//set location
		forms[baseForm].elements.gfx_curtain.setLocation(x,y)
		//set size
		forms[baseForm].elements.gfx_curtain.setSize(
								forms[baseForm].elements.tab_content_C.getWidth(),
								forms[baseForm].elements.tab_content_C.getHeight()
							)
		
		//turn on curtain
		forms[baseForm].elements.gfx_curtain.visible = true
	
	//CURTAIN TWO
		if (lockList && !nonList) {
			//set location
			forms[baseForm].elements.gfx_curtain_2.setLocation(x2,y2)
			//set size
			forms[baseForm].elements.gfx_curtain_2.setSize(
									forms[baseForm].elements.tab_content_B.getWidth(),
									forms[baseForm].elements.tab_content_B.getHeight()
								)
			
			//turn on curtain
			forms[baseForm].elements.gfx_curtain_2.visible = true
		}
		else {
			//turn off curtain
			forms[baseForm].elements.gfx_curtain_2.visible = false
		}
		
//		//turn off tabpanel
//		forms[baseForm].elements.tab_content_C.enabled = false
//				
//		//there is a form in tab panel
//		if (forms[baseForm].elements.tab_content_C.tabIndex) {
//			var formName = forms[baseForm].elements.tab_content_C.getTabFormNameAt(forms[baseForm].elements.tab_content_C.tabIndex)
//			
//			//if a subheader present, turn it on
//			if (forms[formName].elements.gfx_subheader) {
//				forms[formName].elements.gfx_subheader.enabled = true
//			}
//		}
	}
	//unlock the workflow
	else {
		//turn off curtains
		forms[baseForm].elements.gfx_curtain.visible = false
		forms[baseForm].elements.gfx_curtain_2.visible = false
		
//		//turn on tabpanel
//		forms[baseForm].elements.tab_content_C.enabled = true
	}
	
	//track state of workflow lockedness
	solutionPrefs.design.statusLockWorkflow = lockWorkflow
	solutionPrefs.design.statusLockList = lockWorkflow && lockList
}
}

/**
 *
 * @properties={typeid:24,uuid:"25a6505d-b910-4681-a7be-3c9eb89cfae4"}
 */
function DEV_mode_toggle()
{

/*
 *	TITLE    :	DEV_mode_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	hide/show developer related elements on the top level screen
 *			  		return to lastly selected mode
 *			  	
 *	INPUT    :	1- skip the application.updateUI in the DS_space_flexible method to minimize on screen flicker
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	DEV_mode_toggle()
 *			  	
 *	MODIFIED :	December 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	
//	var frame = Packages.java.awt.Frame.getFrames()[0]
//	forms.DATASUTRA_0F_solution.elements.bean_main.ignoreRepaint = true
//	forms.DATASUTRA_0F_solution.elements.bean_list.ignoreRepaint = true
//	forms.DATASUTRA_0F_solution.elements.bean_header.ignoreRepaint = true
//	forms.DATASUTRA_0F_solution.elements.bean_workflow.ignoreRepaint = true
//	frame.ignoreRepaint = true
	
//	application.updateUI()
	
	var skipUI = arguments[0]
	
	var baseForm = solutionPrefs.config.formNameBase
	var toolbarHeight = 42
	
	//toolbar indicator of where we are
	var prefTab = 'TOOL_design_mode'
	
	//store what was there
	var beanMainLeft = forms[baseForm].elements.bean_main.leftComponent
	var beanMainRight = forms[baseForm].elements.bean_main.rightComponent
	var beanHeaderTop = forms[baseForm].elements.bean_header.topComponent
	var beanHeaderBottom = forms[baseForm].elements.bean_header.bottomComponent
	
	//null everything out so we don't get any lockouts
	forms[baseForm].elements.bean_main.leftComponent = null
	forms[baseForm].elements.bean_main.rightComponent = null
	forms[baseForm].elements.bean_header.topComponent = null
	forms[baseForm].elements.bean_header.bottomComponent = null
	
	//turn on
	if (solutionPrefs.design.statusDesign) {
		//hide sheet if showing
		forms[baseForm].elements.sheetz.visible = false
		
		//show red fw action buttion by hiding default black version
		forms[baseForm + '__header'].elements.btn_fw_action.visible = false
			
		//move main bean down
		forms[baseForm].elements.bean_main.setLocation(forms[baseForm].elements.bean_main.getX(),forms[baseForm].elements.bean_main.getY() + toolbarHeight)
		
		//resize beans
		forms[baseForm].elements.bean_header.setSize(application.getWindowWidth(),forms[baseForm].elements.bean_header.getHeight() + toolbarHeight)
		forms[baseForm].elements.bean_main.setSize(application.getWindowWidth(),forms[baseForm].elements.bean_main.getHeight() - toolbarHeight)
		
		//add in bean tab panels
			//design mode toolbar
			forms[baseForm].elements.bean_header.topComponent = forms[baseForm].elements.tab_design_bar
			//normal frameworks header
			forms[baseForm].elements.bean_header.bottomComponent = beanHeaderBottom
			//main left side
			forms[baseForm].elements.bean_main.leftComponent = beanMainLeft
			//main right side
			forms[baseForm].elements.bean_main.rightComponent = beanMainRight
		
		//move divider
		application.updateUI()
		forms[baseForm].elements.bean_header.dividerLocation = toolbarHeight
		
		//turn on top graphic line on standard header
		forms[baseForm + '__header'].elements.gfx_header.setBorder('MatteBorder,1,0,1,0,#333333')
		forms.DATASUTRA__sidebar__header.elements.gfx_header.setBorder('MatteBorder,1,0,1,0,#333333')
		
		//top graphic line if needed
		if (solutionPrefs.clientInfo.typeServoy == 'developer') {
			forms.DEV_0F_solution__designbar.elements.gfx_header.setBorder('MatteBorder,1,0,0,0,#333333')
			forms.DEV_0F_solution__designbar.elements.tab_action.setBorder('MatteBorder,1,0,0,0,#333333')
		}
		else {
			forms.DEV_0F_solution__designbar.elements.gfx_header.setBorder('EmptyBorder,0,0,0,0')
			forms.DEV_0F_solution__designbar.elements.tab_action.setBorder('EmptyBorder,0,0,0,0')
		}
		
		if (forms[prefTab]) {
			//save down active toolbar to restore
			solutionPrefs.config.lastSelectedToolbar = forms[baseForm + '__header'].elements.tab_toolbar.tabIndex
			
			//load preference tab tab
			forms[baseForm + '__header__toolbar'].elements.tab_toolbar.addTab(forms[prefTab],'')
			forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getMaxTabIndex()
			
			//hide toolbar controls
			forms[baseForm + '__header__toolbar'].elements.btn_toolbar_toggle.visible = false
			forms[baseForm + '__header__toolbar'].elements.btn_toolbar_popdown.visible = false
			
			//change header to display that we're in design mode
		//	forms[prefTab].elements.lbl_title.text = 'Design mode'
		//	forms[prefTab].elements.lbl_tag.text = null
		}
		
		//refire selected design mode if there is one selected
		if (solutionPrefs.design.currentMode) {
			globals.DEV_quick_buttons(solutionPrefs.design.currentMode,true)
		}
	}
	//turn off
	else {
		
		//show default black fw action button
		forms[baseForm + '__header'].elements.btn_fw_action.visible = true
		
		//move main bean up
		forms[baseForm].elements.bean_main.setLocation(forms[baseForm].elements.bean_main.getX(),forms[baseForm].elements.bean_main.getY() - toolbarHeight)
		
		//resize beans
		forms[baseForm].elements.bean_header.setSize(application.getWindowWidth(),forms[baseForm].elements.bean_header.getHeight() - toolbarHeight)
		forms[baseForm].elements.bean_main.setSize(application.getWindowWidth(),forms[baseForm].elements.bean_main.getHeight() + toolbarHeight)
		
		//add in bean tab panels
			//design mode toolbar
			forms[baseForm].elements.bean_header.topComponent = null
			//normal frameworks header
			forms[baseForm].elements.bean_header.bottomComponent = beanHeaderBottom
			//main left side
			forms[baseForm].elements.bean_main.leftComponent = beanMainLeft
			//main right side
			forms[baseForm].elements.bean_main.rightComponent = beanMainRight
		
		//move divider
		application.updateUI()
//		forms[baseForm].elements.bean_header.dividerLocation = 0	//forms[baseForm].elements.bean_header.getHeight()
		
		//reset graphic line on standard header
		if (solutionPrefs.clientInfo.typeServoy == 'developer') {
			forms[baseForm + '__header'].elements.gfx_header.setBorder('MatteBorder,1,0,1,0,#333333')
			forms.DATASUTRA__sidebar__header.elements.gfx_header.setBorder('MatteBorder,1,0,1,0,#333333')
		}
		else {
			forms[baseForm + '__header'].elements.gfx_header.setBorder('MatteBorder,0,0,1,0,#333333')
			forms.DATASUTRA__sidebar__header.elements.gfx_header.setBorder('MatteBorder,0,0,1,0,#333333')
		}
		
		//remove progress toolbar if it is present
		if (forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getTabFormNameAt(forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getMaxTabIndex()) == prefTab) {
			forms[baseForm + '__header__toolbar'].elements.tab_toolbar.removeTabAt(forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getMaxTabIndex())
			
			//set toolbar to previous if it wasn't the last tab
			if (solutionPrefs.config.lastSelectedToolbar != forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getMaxTabIndex()) {
				globals.DS_toolbar_cycle(solutionPrefs.config.lastSelectedToolbar)
			}
			
			//show toolbar controls
			forms[baseForm + '__header__toolbar'].elements.btn_toolbar_toggle.visible = true
		}
		
		//clear out lastSelectedToolbar
		solutionPrefs.config.lastSelectedToolbar = null
		
		//turn everything off, but remember where were for next entrance into design mode
		var saveMode = solutionPrefs.design.currentMode
		globals.DEV_clear_modes(true)
		solutionPrefs.design.currentMode = saveMode
	}
	
	//refire current space
	globals.CALLBACK_spaces_set(solutionPrefs.config.activeSpace,true,skipUI)
	
//	forms.DATASUTRA_0F_solution.elements.bean_main.ignoreRepaint = false
//	forms.DATASUTRA_0F_solution.elements.bean_list.ignoreRepaint = false
//	forms.DATASUTRA_0F_solution.elements.bean_header.ignoreRepaint = false
//	forms.DATASUTRA_0F_solution.elements.bean_workflow.ignoreRepaint = false
//	frame.ignoreRepaint = false
}
}

/**
 *
 * @properties={typeid:24,uuid:"27c1e01f-9681-4099-9c69-fb23ba4783d3"}
 */
function DEV_quick_buttons()
{

/*
 *	TITLE    :	DEV_quick_buttons
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	switch between various modes
 *			  	
 *	INPUT    :	1- name of mode to enter/exit
 *			  	2- stay in this mode
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	February 25, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	
	var flagName = arguments[0]
	var stayThere = arguments[1]
	var currentNavItem = solutionPrefs.config.currentFormID
	var baseForm = solutionPrefs.config.formNameBase
	var formName = forms[baseForm].elements.tab_content_B.getTabFormNameAt(forms[baseForm].elements.tab_content_B.tabIndex)
	var listName = (navigationPrefs.byNavItemID[currentNavItem].navigationItem.useFwList) ? 'NAV_0L_universal_list' : ((navigationPrefs.byNavItemID[currentNavItem].navigationItem.listToLoad) ? navigationPrefs.byNavItemID[currentNavItem].navigationItem.listToLoad : 'DATASUTRA_0F_solution__blank_2')
	var workflowName = forms[baseForm].elements.tab_content_C.getTabFormNameAt(1)
	var workflowNameStd = navigationPrefs.byNavItemID[currentNavItem].navigationItem.formToLoad
	var helpName = navigationPrefs.byNavItemID[currentNavItem].navigationItem.helpFormToLoad
	
	switch (flagName) {
		case 'prototyper' :
			if (globals.PROTO_quick_buttons) {
				globals.PROTO_quick_buttons(formName,workflowName,listName,workflowNameStd,stayThere)
			}
			else {
				plugins.dialogs.showErrorDialog(
								'Prototyper error',
								'Prototyper is not available. Please check your license key'
							)
				globals.DEV_clear_modes(true)
			}
			break
		case 'universallist' :
			forms.DEV_0L_list_display.ACTION_mode(formName,workflowName,listName,workflowNameStd,helpName,stayThere)
			break
		case 'fastfind' :
			forms.DEV_0L_column__fastfind.ACTION_mode(formName,workflowName,listName,workflowNameStd,helpName,stayThere)
			break
		case 'buttonaction' :
			forms.DEV_0L_action_item__action.ACTION_mode(formName,workflowName,listName,workflowNameStd,helpName,stayThere)
			break
		case 'buttonreport' :
			forms.DEV_0L_action_item__report.ACTION_mode(formName,workflowName,listName,workflowNameStd,helpName,stayThere)
			break
		case 'spec' :
			forms.DEV_0L_specification.ACTION_mode(formName,workflowName,listName,workflowNameStd,helpName,stayThere)
			break
		case 'task' :
			forms.DEV_0L_task.ACTION_mode(formName,workflowName,listName,workflowNameStd,helpName,stayThere)
			break
		case 'help' :
			forms.DEV_0F_navigation_item__help_edit.ACTION_mode(formName,workflowName,listName,workflowNameStd,helpName,stayThere)
			break
		default:	//aka navigation and buttonadd
			//a design area that does not have a custom list must black-out the normal UL/custom list
			
			//force this mode
			if (typeof stayThere == 'boolean') {
				solutionPrefs.design.modes[flagName] = stayThere
			}
			//toggle
			else {
				solutionPrefs.design.modes[flagName] = !solutionPrefs.design.modes[flagName]
			}
			
			if (solutionPrefs.design.modes[flagName]) {
				//clear other modes and refire to exit them
				globals.DEV_clear_modes(true,flagName)
				
				//dim workflow
				globals.DEV_lock_workflow(true,true)
				
				//punch down this mode as current
				solutionPrefs.design.currentMode = flagName
			}
			else {
				//undim workflow
				globals.DEV_lock_workflow(false)
				
				//not in any mode
				solutionPrefs.design.currentMode = null
			}
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"26342b22-f1e8-4747-8f0f-a5f82ec99b14"}
 */
function DEV_quickedit_cancel()
{

/*
 *	TITLE    :	DEV_quickedit_cancel
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	rollback changes made, turn autosave on, hide me and unlock
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	DEV_quickedit_cancel()
 *			  	
 *	MODIFIED :	December 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//rollback edited records
databaseManager.rollbackEditedRecords()

//turn autosave back on
databaseManager.setAutoSave(true)

//hide hoverguy
forms[solutionPrefs.config.formNameBase].elements.tab_design_popdown.visible = false

//toggle everything back on
globals.CALLBACK_interface_lock(false,false)

//set status to unlocked
solutionPrefs.config.lockStatus = false

//if method on calling form, execute it
var formName = application.getMethodTriggerFormName()
if (formName && forms[formName] && forms[formName].ACTION_cancel) {
	forms[formName].ACTION_cancel()
}


}

/**
 *
 * @properties={typeid:24,uuid:"68f09504-c61d-41d4-95ff-629a883d5e37"}
 */
function DEV_quickedit_ok()
{

/*
 *	TITLE    :	DEV_quickedit_ok
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	commit changes made, turn autosave on, hide me and unlock
 *			  	- check for ACTION_validate method on form
 *			  		- if present, validate data
 *			  			- proceed
 *			  			- error
 *			  		- proceed
 *			  	- commit/autosave on hide/unlock
 *			  	- check for ACTION_ok on form
 *			  		- present, run
 *			  	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	DEV_quickedit_ok()
 *			  	
 *	MODIFIED :	December 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//calling form
var formName = application.getMethodTriggerFormName()

//validate the data
if (formName && forms[formName] && forms[formName].ACTION_validate) {
	var proceed = forms[formName].ACTION_validate()
}
//no validation required, commit
else {
	var proceed = true
}

//everything ok, save the data
if (proceed) {
	//save outstanding data
	databaseManager.saveData()
	
	//turn autosave back on
	databaseManager.setAutoSave(true)
	
	//toggle things off
	globals.DEV_quickedit_toggle()
	
	//if method on calling form, execute it
	if (formName && forms[formName] && forms[formName].ACTION_ok) {
		forms[formName].ACTION_ok()
	}
}
//something went wrong with validation, show error
else {
	plugins.dialogs.showErrorDialog(
					'Validation error',
					'Get message to input here'
				)
}
}

/**
 *
 * @properties={typeid:24,uuid:"0bb016be-92f9-458f-ac33-1b7853f603fe"}
 */
function DEV_quickedit_toggle()
{

/*
 *	TITLE    :	DEV_quickedit_toggle
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	1- form name to load in the hovercraft
 *			  	2- element name to request focus on
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	DEV_quickedit_toggle()
 *			  	
 *	MODIFIED :	December 16, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = arguments[0]
var elemName = arguments[1]
var baseForm = solutionPrefs.config.formNameBase

//enter quickedit mode
if (formName) {
	if (forms[formName]) {
		//turn off autosave to mimic transaction
		databaseManager.setAutoSave(false)
		
		//lock screen
		globals.CALLBACK_interface_lock(true,true)
		
		//remove hover guy window if new one different than currently displayed one
		if (forms[baseForm].elements.tab_design_popdown.tabIndex > 0  && (forms[baseForm].elements.tab_design_popdown.getTabFormNameAt(1) != formName)) {
			forms[baseForm].elements.tab_design_popdown.removeTabAt(1)
		}
		//load hover guy window if no tab currently there
		if (!forms[baseForm].elements.tab_design_popdown.getMaxTabIndex()) {
			forms[baseForm].elements.tab_design_popdown.addTab(forms[formName],'')
			forms[baseForm].elements.tab_design_popdown.tabIndex = forms[baseForm].elements.tab_design_popdown.getMaxTabIndex()
		}
		
		//get size of child form
		var serverName = forms[formName].foundset.getServerName()
		var tableName = forms[formName].foundset.getTableName()
		if (solutionPrefs.repository.allFormsByTable[serverName] && 
				solutionPrefs.repository.allFormsByTable[serverName][tableName] && 
				solutionPrefs.repository.allFormsByTable[serverName][tableName][formName] && 
				solutionPrefs.repository.allFormsByTable[serverName][tableName][formName].formSize) {
			var size = solutionPrefs.repository.allFormsByTable[serverName][tableName][formName].formSize
		}
		else {
			var size = '450,450'
		}
		size = size.split(',')
		
		//get location of child form
		var windowWidth = application.getWindowWidth(null)
		var formWidth = size[0]
		var x = (windowWidth / 2) - (formWidth / 2)
		var y = 43
		
		//set size/location of hover guy
		forms[baseForm].elements.tab_design_popdown.setLocation(x,y)
		forms[baseForm].elements.tab_design_popdown.setSize(size[0],size[1])
		
		//enable hover guy
		forms[baseForm].elements.tab_design_popdown.enabled = true
		
		//turn hover guy on
		forms[baseForm].elements.tab_design_popdown.visible = true
		
		//highlight first field for data entry
		if (forms[formName].elements[elemName]) {
			forms[formName].elements[elemName].requestFocus()
			
			//what is the data provider
			var field = forms[formName].elements[elemName].getDataProviderID()
			
			//there is data and correct type of field, put caret at end
			if (forms[formName][field] && 
				(forms[formName].elements[elemName].getElementType() == 'TEXT_FIELD' ||
				forms[formName].elements[elemName].getElementType() == 'TEXT_AREA' ||
				forms[formName].elements[elemName].getElementType() == 'TYPE_AHEAD')) {
				
				forms[formName].elements[elemName].caretPosition = forms[formName][field].length
			}
		}
	}
}
//exit quickedit mode
else {
	//turn hover guy off
	forms[baseForm].elements.tab_design_popdown.visible = false
	
	//unlock screen
	globals.CALLBACK_interface_lock(false,false)
}



}

/**
 *
 * @properties={typeid:24,uuid:"660e5b08-c1f4-4843-a444-41f27a064304"}
 */
function DEV_rebuild_navitem()
{

/*
 *	TITLE    :	DEV_rebuild_navitem
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	rebuild current navigation item representation
 *			  	
 *	INPUT    :	1- navigation item
 *			  	2- redraw navigation item list (name has changed)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	DEV_rebuild_navitem(navItemID, [redrawRequired]) Rebuild selected navigation item, optionally redrawing the navigation item list
 *			  	
 *	MODIFIED :	February 27, 2009 -- Troy Elliott, Data Mosaic	
 *			  	
 */

var idNavItem = arguments[0]
var redraw = arguments[1]

//get id_navigation from the navitem, if exists
if (idNavItem && navigationPrefs.byNavItemID[idNavItem] && navigationPrefs.byNavItemID[idNavItem].navigationItem) {
	var idNavSet = navigationPrefs.byNavItemID[idNavItem].navigationItem.idNavigation
}
//use selected navigation set
else {
	var idNavSet = globals.DATASUTRA_navigation_set
}

var displayNavSet = application.getValueListDisplayValue('NAV_navigation_set',idNavSet)

//get this nav item record
var fsNavItem = databaseManager.getFoundSet(forms.CODE_0F_solution.controller.getServerName(), 'sutra_navigation_item')
fsNavItem.clear()
fsNavItem.find()
fsNavItem.id_navigation_item = idNavItem
var results = fsNavItem.search()

if (results) {	
	var record = fsNavItem.getRecord(1)
	
	//set flag to redraw list
	var redrawRequired = true
	
	//name is the same
	if (record.item_name == navigationPrefs.byNavItemID[idNavItem].navigationItem.itemName) {
		redrawRequired = false
	}
	//name has changed, clear out old name
	else {
		delete navigationPrefs.byNavSetName[displayNavSet].itemsByName[navigationPrefs.byNavItemID[idNavItem].navigationItem.itemName]
	}
	
	
	//if navigation items in this set, find posn of selected one
	if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length) {
		//find position in array
		var itemPosn = -1
		for (var i = 0; i < navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length && !(itemPosn >= 0); i++) {
			if (navigationPrefs.byNavSetID[idNavSet].itemsByOrder[i].navigationItem.idNavigationItem == idNavItem) {
				itemPosn = i
			}
		}
		
		//not found, tack on at the end
		if (itemPosn < 0) {
			itemPosn = navigationPrefs.byNavSetID[idNavSet].itemsByOrder.length
		}
	}
	else {
		var itemPosn = 0
	}
	
	//update this record alone
	navigationPrefs.byNavSetName[displayNavSet].itemsByName[record.item_name] = 
	navigationPrefs.byNavSetName[displayNavSet].itemsByOrder[itemPosn] = 
	navigationPrefs.byNavItemID[idNavItem] = 
		globals.NAV_navigation_item_load(record,true)
	
	//nav item name changed, redraw navitem list
	if (redraw && redrawRequired) {
		forms.NAV_0L_solution.LIST_redraw(record.id_navigation_item,true)
	}

}



}
