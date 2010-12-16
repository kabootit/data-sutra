/**
 * @properties={typeid:35,uuid:"36968bfc-a7ae-4a48-bf13-89b9db2ca70a",variableType:4}
 */
var CODE_constant_1 = 1;

/**
 * @properties={typeid:35,uuid:"0f826280-4af9-4738-a3eb-417d7e6510d8"}
 */
var CODE_ddarray_field = '';

/**
 * @properties={typeid:35,uuid:"1212d8f4-ea41-49b2-9bf7-be528a0b42a3",variableType:4}
 */
var CODE_hide_form = 0;

/**
 * @properties={typeid:35,uuid:"ed5f234f-6d84-4e88-9619-0f55d431ea33"}
 */
var CODE_text = null;

/**
 * @properties={typeid:35,uuid:"9d94760c-98ad-4b2d-bd75-021a7a87c5d0"}
 */
var consoleInput = '';

/**
 * @properties={typeid:35,uuid:"22fe62e8-0e3c-4d34-84d2-96f15d50543b"}
 */
var consoleOutput = '';

/**
 *
 * @properties={typeid:24,uuid:"f329a2ea-8dbe-40fa-a8dd-75a01b623979"}
 */
function CALLBACK_fastfind_display_set()
{

/*
 *	TITLE    :	CALLBACK_fastfind_display_set
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	set fast find text and (optionally) check box in fast find drop down
 *			  	
 *	INPUT    :	1) text to put into the fast find area
 *			  	2) tooltip for fast find area
 *			  	3) A) columnName to put check mark next to in drop down
 *			  			(if true/nothing passed, will select 'Filter applied...'; if false passed, nothing is checked)
 *			  	   B) item that should be checked in filter menu
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CALLBACK_fastfind_display_set(filterText [, toolTipText, setCheck]) Set the text in the fast find field, tooltip for the fast find field, and check box
 *			  	
 *	MODIFIED :	Mar 7 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs defined and frameworks not in a locked status
if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {

	var filterText = arguments[0]
	var toolTip = arguments[1]
	var setCheck = arguments[2]
	var baseForm = solutionPrefs.config.formNameBase
	var currentNavItem = solutionPrefs.config.currentFormID
	
	if (setCheck == undefined) {
		setCheck = true
	}
	
	//set text in fast find area
	globals.DATASUTRA_find = filterText
	
	//only show stop button if a message is passed
	if (filterText) {
		//show stop button
	//	forms[solutionPrefs.config.formNameBase].elements.find_end.setImageURL('media:///find_stop.png')
	}
	//set check to appear next to column which was filtered
	if (setCheck && setCheck != true) {
		globals.DATASUTRA_find_field = setCheck
	}
	//set check to appear next to 'Filter applied...'
	else if (setCheck) {
		globals.DATASUTRA_find_field = 'Filtered'
	}
	//set check to some weird value so nothing will be checked
	//MEMO: do not set to null because then it will be set to 'Show all' by default
	else if (!setCheck) {
		globals.DATASUTRA_find_field = 'NuttinHoney'
	}
	
	//save down values of last 'find'
	if (application.__parent__.solutionPrefs) {
		var formName = solutionPrefs.config.currentFormName
		var serverName = forms[formName].controller.getServerName()
		var tableName = forms[formName].controller.getTableName()
		
		//add server name if not already
		if (!solutionPrefs.fastFind.currentSearch[serverName]) {
			solutionPrefs.fastFind.currentSearch[serverName] = new Object()
		}
		//add table name if not already
		if (!solutionPrefs.fastFind.currentSearch[serverName][tableName]) {
			solutionPrefs.fastFind.currentSearch[serverName][tableName] = new Object()
		}
		//only run when data is available
		if (solutionPrefs.repository && solutionPrefs.repository.allFormsByTable && 
			solutionPrefs.repository.allFormsByTable[serverName] && 
			solutionPrefs.repository.allFormsByTable[serverName][tableName] && 
			solutionPrefs.repository.allFormsByTable[serverName][tableName][formName]) {
		
			//check if not using separateFoundset
			if (!solutionPrefs.repository.allFormsByTable[serverName][tableName][formName].useSeparateFoundset) {
				solutionPrefs.fastFind.currentSearch[serverName][tableName].lastFindValue = filterText
				solutionPrefs.fastFind.currentSearch[serverName][tableName].lastFindField = (setCheck && setCheck != true) ? setCheck : null
				solutionPrefs.fastFind.currentSearch[serverName][tableName].lastFindTip = toolTip
			}
		}
		
		//fast find is enabled, track
		if (navigationPrefs.byNavItemID[currentNavItem].fastFind) {
			navigationPrefs.byNavItemID[currentNavItem].fastFind.lastFindValue = filterText
			navigationPrefs.byNavItemID[currentNavItem].fastFind.lastFindField = (setCheck && setCheck != true) ? setCheck : null
			navigationPrefs.byNavItemID[currentNavItem].fastFind.lastFindTip = toolTip
		}
	}
	
	//set tooltip if provided
	if (toolTip != null) {
		forms[baseForm + '__header__fastfind'].elements.fld_find.toolTipText = toolTip
	}

}

}

/**
 *
 * @properties={typeid:24,uuid:"1544c9a7-7107-4c73-8d7e-eb00586dc023"}
 */
function CALLBACK_fastfind_override()
{

/*
 *	TITLE    :	CALLBACK_fastfind_override
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	override the fast find items for the selected navigation item
 *			  	
 *	INPUT    :	1) fast find array is an array of objects
 *			  		- array has property of "searchForm" to override starting point for find
 *			  			(default searchForm is a navigation item's form as defined in the navigation engine)
 *			  		- an array item object looks like:
	{
		//the name displayed in the fast find dropdown
		findName	: 'Display name',
		//type of column as reported from JSColumn.getTypeAsString()
		columnType	: 'TEXT',
		//name of the column in the backend
		columnName	: 'column_name',
		//relation(s) to above column
			//MEMO: if no relation, specify 'NONE'
		relation	: 'relation_name' || 'NONE',
		//valuelist to convert actual value in column to display value
		valuelist	: 'valuelist_name',
		//used in concert with valuelist; forces valuelist picker to display as a typeahead field instead of depending on number of elements in the value list
		typeahead	: 1,
		//displays more info about what the fast find item actually is
		toolTip		: 'ToolTip displayed when fast find item hovered over'
	}
 *			  	
 *			  	2) navigation item ID to work on (default is the current navItem)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CALLBACK_fastfind_override(findObject, [navItemID]) Override fast find settings
 *			  	CALLBACK_fastfind_override(false, [navItemID]) Revert to default fast find settings
 *			  	
 *	MODIFIED :	February 2, 2010 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs defined and frameworks not in a locked status
if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {

	var findOverride = arguments[0]
	var currentNavItem = arguments[1] || solutionPrefs.config.currentFormID
	
	var baseForm = solutionPrefs.config.formNameBase
	
	if (currentNavItem && navigationPrefs.byNavItemID[currentNavItem]) {
		var thisNav = navigationPrefs.byNavItemID[currentNavItem]
		
		//find override present, override
		if (findOverride) {
			//punch default for this form down (so can roll back)
			if (!thisNav.fastFindInitial) {
				thisNav.fastFindInitial = globals.CODE_copy_object(thisNav.fastFind)
			}
			
			thisNav.fastFind = findOverride
		}
		//revert to default
		else {
			if (thisNav.fastFindInitial) {
				thisNav.fastFind = globals.CODE_copy_object(thisNav.fastFindInitial)
			}
		}
	}
}



}

/**
 *
 * @properties={typeid:24,uuid:"c140d3ca-3af7-4bfd-871a-a601f7af59e8"}
 */
function CALLBACK_feedback_create()
{

/*
 *	TITLE    :	CALLBACK_feedback_create
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	leave feedback programatically
 *			  	
 *	INPUT    :	1) issue
 *			  	2) description of issue
 *			  	3) take screenshot of screen
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	September 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */


var issue = arguments[0]
var detail = arguments[1]
var takeScreenshot = arguments[2]

//any arguments given, run method
if (issue || detail || takeScreenshot) {
	//get foundset
	var formName = 'CODE_0F_solution'
	var fsFeedback = databaseManager.getFoundSet(forms[formName].controller.getServerName(),'sutra_feedback')
	var record = fsFeedback.getRecord(fsFeedback.newRecord(false,true))
	
	record.feedback_status = 'Pending'
	record.id_log = solutionPrefs.clientInfo.logID
	record.id_navigation = globals.DATASUTRA_navigation_set
	record.id_navigation_item = solutionPrefs.config.currentFormID
	record.feedback_issue = issue
	record.feedback_summary = detail
	
	if (takeScreenshot) {
		//get screensize of window
		var x = application.getWindowX()
		var y = application.getWindowY()
		var width = application.getWindowWidth()
		var height =  application.getWindowHeight()
		
		//get screenshot
		var screenShot = (new java.awt.Robot()).createScreenCapture(new java.awt.Rectangle(x,y,width,height))
		var rawData = new java.io.ByteArrayOutputStream()
		Packages.javax.imageio.ImageIO.write(screenShot,'png',rawData)
		
		record.feedback_screenshot = rawData.toByteArray()
	}
	
	if (solutionPrefs.access && solutionPrefs.access.userName) {
		record.feedback_author = solutionPrefs.access.userName
	}

	databaseManager.saveData(record)
}


}

/**
 *
 * @properties={typeid:24,uuid:"fc168413-17ed-4d6a-b0b3-7a69b8674f9e"}
 */
function CALLBACK_frame_title_set()
{

/*
 *	TITLE    :	CALLBACK_frame_title_set
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	sets the top level window title and/or icon
 *			  	
 *	INPUT    :	1- window title
 *			  	2- icon url ("media:///my_image.gif" is valid for accessing media in the servoy media library)
 *			  	3- name of window to set (when no argument passed, top level servoy window modified)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs; running in smart client or developer
 *			  	
 *	USAGE    :	CALLBACK_frame_title_set(windowTitle, [iconURL], [windowName]) Sets the window title and assigns an icon to the window specified
 *			  	
 *	MODIFIED :	March 1, 2008 -- Tom Parry, Prospect IT Consulting
 *			  	October 1, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: windowName find; more error checking

var windowTitle = arguments[0]
var windowIcon = arguments[1]
var frameName = arguments[2]
var callingForm = application.getMethodTriggerFormName()

//check if in developer or client
if (application.__parent__.solutionPrefs && solutionPrefs.clientInfo && (solutionPrefs.clientInfo.typeServoy == 'client' || solutionPrefs.clientInfo.typeServoy == 'developer')) {
	//all frames in use
	var allFrames = Packages.java.awt.Frame.getFrames()
	
	//find frame to operate on
	if (frameName) {
		
	}
	//use top level servoy window
	else {
		var frame = Packages.java.awt.Frame.getFrames()[0]
	}
	
	//set new window title
	if (windowTitle) {
		frame.setTitle(windowTitle)
	}
	
	//set new window icon
	if (windowIcon) {
		//image coming from media library
		if (utils.stringPatternCount(windowIcon,'media:///')) {
			var iconImage = new Packages.javax.swing.ImageIcon(new Packages.java.net.URL(windowIcon)).getImage()
		}
		//top-level window hack
		else if (callingForm == solutionPrefs.config.formNameBase) {
			var iconImage = new Packages.javax.swing.ImageIcon(windowIcon).getImage()
		}
		//image on disk someplace
		else {/*
			try  (
				new Packages.javax.swing.ImageIcon(windowIcon).getImage()
				//var iconImage = new Packages.java.awt.Toolkit.getDefaultToolkit().getImage(windowIcon)
			)
			catch {}
			*/
		}
		
		if (iconImage) {
			frame.setIconImage(iconImage)
		}
	}
}

}

/**
 *
 * @properties={typeid:24,uuid:"7e1bda42-9f42-4736-a207-4b324e59ec3c"}
 */
function CALLBACK_help_navigation_set()
{

/*
 *	TITLE    :	CALLBACK_help_navigation_set
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	jump to navigation items from within inline help
 *			  	
 *	INPUT    :	1- registry (item_id) of navigation_item to jump to
 *			  	2- prompt to leave current location
 *			  	3- sub tab panel/tab # to land on
 *			  	4- show related help pop up on arrival
 *			  	
 *	OUTPUT   :	true if navigated to new place, false if not navigated or unable to navigate there
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CALLBACK_help_navigation_set(registry) Navigates to a registered form
 *			  	
 *	MODIFIED :	February 9, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: check to see if group is allowed to navigate here

//solutionPrefs defined and frameworks not in a locked status
if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {

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

	var itemID = arguments[0]
	var confirm = arguments[1]
	var subLanding = arguments[2]
	var showHelp = arguments[3]
	
	var baseForm = solutionPrefs.config.formNameBase
	
/*	var subLanding = {
					form: ,			//name of form
					tabPanel: , 	//tab panel on form
					tabNumber: ,	//tab number of tab panel
					pseudo: true,	//pseudo record navigator (form is this pseudo nav...)
					action: 		//name of method on pseudo-form
				}
	var showHelp = {
					form: ,			//name of form
					tabPanel: , 	//tab panel on form
					element: 		//name of element with tooltip to trigger
				}
*/
	
	//loop through all available items until the specified one found (will find first occurrence)
	var navItemID = false
	for (var i in navigationPrefs.byNavItemID) {
		if (!navItemID && navigationPrefs.byNavItemID[i].navigationItem.itemId == itemID) {
			navItemID = i
		}
	}
	
	//selected navigation item is available for this user
	if (navItemID) {
		//confirm to leave current location
		if (confirm) {
			var proceed = plugins.dialogs.showQuestionDialog(
										'Navigate away',
										'If you continue, you will leave the screen you are currently viewing',
										'Yes',
										'No'
									)
		}
		else {
			var proceed = 'Yes'
		}
		
		if (proceed == 'Yes') {
			//close the opened help dialog box
			forms.CODE_P__konsole.ACTION_close()
			
			var navSetID = navigationPrefs.byNavItemID[navItemID].navigationItem.idNavigation
			var formNameWorkflow = navigationPrefs.byNavItemID[navItemID].navigationItem.formToLoad
			
			//if from a different navigation set
			if (globals.DATASUTRA_navigation_set != navSetID) {
				navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].lastNavItem = solutionPrefs.config.currentFormID
				globals.DATASUTRA_navigation_set = navSetID
			}
			
			//redraw list; make sure row is expanded if node2; load new item
			forms.NAV_0L_solution.LIST_expand_collapse(navItemID,'open',navSetID)
			
			//move around to land on correct spot of this form
			if (subLanding) {
				//quasi-record navigator
				if (subLanding.pseudo &&
					subLanding.form && forms[subLanding.form] && subLanding.action && forms[subLanding.form][subLanding.action]) {
					
					//get there
					forms[subLanding.form][subLanding.action]()
					
					//set tab
					if (forms[baseForm].elements.tab_content_C.getTabFormNameAt(1)) {
						subLanding.form = forms[baseForm].elements.tab_content_C.getTabFormNameAt(1)
					}
				}
				
				
			}
			
			//pop-up help screen for selected element
			if (showHelp) {
				globals.CALLBACK_tooltip_help_popup(showHelp.form,showHelp.element,showHelp.tabPanel)
			}
		}
	}
	else {
		plugins.dialogs.showErrorDialog(
							'Destination error',
							'The landing destination is not available.  See the administrator'
						)
		return false
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"8a2db575-a9de-4646-9936-14468a01d7f4"}
 */
function CALLBACK_interface_lock()
{

/*
 *	TITLE    :	CALLBACK_interface_lock
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	disables all frameworks related actions
 *			  		- including: CALLBACK_navigation_set
 *			  	
 *	INPUT    :	1- true/false - true freezes frameworks (everything except your workflow screen), false returns frameworks to normal operation
 *			  	2- true/false - true freezes frameworks, including workflow area (giving dimmed effect) (optional)
 *			  	3- true/false - true turns off transparency so stuff beneath invisible (optional)
 *			  	4- true/false - true puts facebook spinner in center of screen (optional)
 *			  	5- text to display when nonTransparent enabled (optional)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	USAGE    :	CALLBACK_interface_lock(lockFrameworks, [lockAll], [nonTransparent], [processingIndicator], [text]) Locks/unlocks frameworks, forcing user to stay on workflow screen
 *			  	
 *	MODIFIED :	March 27, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: either...
		//put multiple curtain graphics on the layout so everything except for the workflow is covered
		// OR
		//trap the state of everything on the workflow form and set it back as it was before being enabled/disabled

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

var freeze = arguments[0]
var freezeAll = arguments[1]
var nonTransparent = arguments[2]
var spinner = arguments[3]
var nonTransparentText = arguments[4]

//check to see that solutionPrefs is defined and parameter passed
if (application.__parent__.solutionPrefs && typeof freeze == 'boolean') {
	var baseForm = solutionPrefs.config.formNameBase
	var workflowForm = solutionPrefs.config.currentFormName
	
	//set up spinner to show progress
	if (spinner) {
	//	forms[baseForm].elements.gfx_curtain_3.setSize(32,32)
		forms[baseForm].elements.gfx_curtain_3.setLocation((application.getWindowWidth() / 2) - 16, (application.getWindowHeight() / 2) - 200)
		forms[baseForm].elements.gfx_curtain_3.visible = true
	}
	
	//resize curtain to cover everything and then show it
	if (freezeAll) {
		//height of normal header (44)
		var y = 0
		
		//if in design mode....
		if (solutionPrefs.design.statusDesign) {
			//height of design mode bar
			y += 42
			
			var designBar = 'DEV_0F_solution__designbar'
			
			//design bar form exists, go exploring
			if (forms[designBar]) {
				//turn off everything
				forms[designBar].controller.enabled = false
				
				//active tab
				var designTab = forms[designBar].elements.tab_action.getTabFormNameAt(forms[designBar].elements.tab_action.tabIndex)
				
				//light background in main design bar
				if (forms[designBar].elements.gfx_header) {
					forms[designBar].elements.gfx_header.enabled = true
				}
				
				//highlighter in main design bar
				if (forms[designBar].elements.highlighter) {
					forms[designBar].elements.highlighter.enabled = true
				}
				
				//design bar action form exists, go exploring
				if (forms[designTab]) {
					//light background in main design bar
					if (forms[designTab].elements.gfx_header) {
						forms[designTab].elements.gfx_header.enabled = true
					}
					
					//highlighter in main design bar
					if (forms[designTab].elements.highlighter) {
						forms[designTab].elements.highlighter.enabled = true
					}
				}
			}
			
			//just turn off the second curtain so don't get double effect
			forms[baseForm].elements.gfx_curtain_2.visible = false
		}
		
		//set location
		forms[baseForm].elements.gfx_curtain.setLocation(0,y)
		//set size
		forms[baseForm].elements.gfx_curtain.setSize(application.getWindowWidth(),application.getWindowHeight())
		
		//non-transparent, set up
		if (nonTransparent) {
			forms[baseForm].elements.gfx_curtain.transparent = false
			forms[baseForm].elements.gfx_curtain.setImageURL(null)
			forms[baseForm].elements.gfx_curtain.setBorder('MatteBorder,0,0,200,0,#323A4B')
			
			//set text
			if (nonTransparentText) {
				forms[baseForm].elements.gfx_curtain.text = nonTransparentText
			}
		}
		
		forms[baseForm].elements.gfx_curtain.enabled = true
		forms[baseForm].elements.gfx_curtain.visible = true
	}
	//lock everything
	else if (freeze) {
		//turn off everything
		forms[baseForm].controller.enabled = false
		
		//turn on grafx stuff
			//header/footer
			forms[baseForm + '__header'].elements.gfx_header.enabled = true
			forms[baseForm + '__footer'].elements.gfx_footer.enabled = true
			
			//check content panels for subheader element
			var tabPanels = ['A','B','C','D']
			for (var i = 0; i < tabPanels.length; i++) {
				var tabPanel = 'tab_content_' + tabPanels[i]
				
				//there is a form in this tab panel
				if (forms[baseForm].elements[tabPanel].tabIndex) {
					var formName = forms[baseForm].elements[tabPanel].getTabFormNameAt(forms[baseForm].elements[tabPanel].tabIndex)
					
					//if a subheader present, turn it on
					if (forms[formName] && forms[formName].elements.gfx_subheader) {
						forms[formName].elements.gfx_subheader.enabled = true
					}
				}
			}
			
			//check active toolbar for background elements
			if (forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex) {
				var formName = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getTabFormNameAt(forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex)
				
				//if toolbar background graphics present, turn them on
				if (forms[formName].elements.gfx_tool_left) {
					forms[formName].elements.gfx_tool_left.enabled = true
				}
				if (forms[formName].elements.gfx_tool_center) {
					forms[formName].elements.gfx_tool_center.enabled = true
				}
				if (forms[formName].elements.gfx_tool_right) {
					forms[formName].elements.gfx_tool_right.enabled = true
				}
			}
		
		//set space borders to light color
		var borderDisabled = 'MatteBorder,0,0,0,1,#797778'
		for (var i = 1; i <= 14 && ((i== 1 || i == 8) ? i++ : i); i++) {
			forms[baseForm + '__header'].elements['btn_space_' + i].setBorder(borderDisabled)
		}
		
		//turn on workflow form
		forms[workflowForm].controller.enabled = true
	}
	//unlock everything
	else {
		//turn on everything
		forms[baseForm].controller.enabled = true
		
		//turn off curtain
		if (forms[baseForm].elements.gfx_curtain.visible) {
			forms[baseForm].elements.gfx_curtain.visible = false
			
			//return curtain to default state
			forms[baseForm].elements.gfx_curtain.transparent = true
			forms[baseForm].elements.gfx_curtain.setImageURL('media:///curtain_5E6166.png')
			forms[baseForm].elements.gfx_curtain.setBorder('EmptyBorder,0,0,0,0')
			
			forms[baseForm].elements.gfx_curtain.text = null
			forms[baseForm].elements.gfx_curtain.toolTipText = null
		}
		
		//turn off curtain3
		if (forms[baseForm].elements.gfx_curtain_3.visible) {
			forms[baseForm].elements.gfx_curtain_3.visible = false
		}
		
		//developer was locked, return to that state
		if (solutionPrefs.design.statusLockWorkflow || solutionPrefs.design.statusLockList) {
			globals.DEV_lock_workflow()
		}
		
		//only show active space options
		var borderEnabled = 'MatteBorder,0,0,0,1,#333333'
		var borderDisabled = 'MatteBorder,0,0,0,1,#797778'
		var spacesOK = (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID] && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].spaceSetup) ? navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].spaceSetup : new Array(true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true)
		for (var i = 1; i <= 14; i++) {
			forms[baseForm + '__header'].elements['btn_space_' + i].enabled = spacesOK[i-1]
			
			if (i != 1 && i != 8) {
				forms[baseForm + '__header'].elements['btn_space_' + i].setBorder(spacesOK[i-1] ? borderEnabled : borderDisabled)
			}
		}
	}
	
	//save down current locked status
	solutionPrefs.config.lockStatus = freeze
}

}

/**
 *
 * @properties={typeid:24,uuid:"d905985b-6355-4c9c-9e36-d69a2cf797eb"}
 */
function CALLBACK_log_create()
{

/*
 *	TITLE    :	CALLBACK_log_create
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	logs a particular event
 *			  	
 *	INPUT    :	1) type of log
 *			  		values:	Custom,Configuration panes,Fast finds,Flexible windowing,Navigation items,
 *			  				Records,UL Add,UL Actions,UL Displays,UL Filters,UL Print,UL Sorts,UL Tabs
 *			  	2) value1
 *			  	3) value2
 *			  	4) value3
 *			  	5) etc
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: allow more values for custom type

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

var logType = arguments[0]
var valueOne = arguments[1]
var valueTwo = arguments[2]
var valueThree = arguments[3]
var valueFour = arguments[4]
var valueFive = arguments[5]
var valueSix = arguments[6]
var valueSeven = arguments[7]
var valueEight = arguments[8]
var valueNine = arguments[9]

//logType parameter passed in, solutionPrefs defined, analytics turned on, and logging for logType
if (logType && application.__parent__.solutionPrefs && solutionPrefs.analytics && solutionPrefs.analytics.logging[utils.stringReplace(logType,' ','_')]) {
	//get foundset
	var formName = currentcontroller.getName()
	var fsLog = databaseManager.getFoundSet(forms[formName].controller.getServerName(),'sutra_log')
	var record = fsLog.getRecord(fsLog.newRecord())
	
	//set basic log information
	record.log_type = logType
	record.id_organization = (solutionPrefs.access.organizationID) ? solutionPrefs.access.organizationID : null
	record.id_group = (solutionPrefs.access.groupID) ? solutionPrefs.access.groupID : null
	record.id_user = (solutionPrefs.access.userID) ? solutionPrefs.access.userID : null
	record.id_access_log = (solutionPrefs.clientInfo.logID) ? solutionPrefs.clientInfo.logID : null
	if (solutionPrefs.history && solutionPrefs.config.currentHistoryPosition >= 0) {
		record.id_navigation = solutionPrefs.history[solutionPrefs.config.currentHistoryPosition].navigationSetID
		record.id_navigation_item = solutionPrefs.history[solutionPrefs.config.currentHistoryPosition].navigationItemID
		record.navigation_set = solutionPrefs.history[solutionPrefs.config.currentHistoryPosition].navigationSetName
		record.navigation_item = solutionPrefs.history[solutionPrefs.config.currentHistoryPosition].navigationSetID
	}
	
	switch (logType) {
		case 'Custom':
			record.custom = valueOne
			break
		case 'Configuration panes':
			record.config_pane = valueOne
			record.id_navigation_item = valueTwo
			record.id_navigation = valueThree
			record.navigation_set = valueFour
			record.navigation_item = valueFive
			break
		case 'Fast finds':
			record.server_name = valueOne
			record.table_name = valueTwo
			record.find_type = valueThree
			record.find_relation = valueFour
			record.find_field = valueFive
			record.find_value = valueSix
			record.find_records_found = valueSeven
			break
		case 'Flexible windowing':
			record.window_space_from = valueOne
			record.window_space_to = valueTwo
			record.window_dimension_1_then = valueThree
			record.window_dimension_2_then = valueFour
			record.window_dimension_1_now = valueFive
			record.window_dimension_2_now = valueSix
			record.window_size_x = valueSeven
			record.window_size_y = valueEight
			break
		case 'Navigation items':
			record.navigation_form = valueOne
			record.navigation_list = valueTwo
			break
		case 'Records':
			record.serverName = valueOne
			record.tableName = valueTwo
			record.record_field = valueThree
			record.record_id = valueFour
			break
		case 'UL Add':
			record.actions_method = valueOne
			record.server_name = valueTwo
			record.table_name = valueThree
			record.record_field = valueFour
			record.record_id = valueFive
			break
		case 'UL Actions':
			record.actions_item = valueOne
			record.actions_method = valueTwo
			record.server_name = valueThree
			record.table_name = valueFour
			record.record_field = valueFive
			record.record_id = valueSix
			break
		case 'UL Displays':
			record.actions_item = valueOne
			record.server_name = valueTwo
			record.table_name = valueThree
			break
		case 'UL Filters':
			record.actions_item = valueOne
			record.server_name = valueTwo
			record.table_name = valueThree
			record.record_field = valueFour
			record.record_id = valueFive
			record.find_records_found = valueSix
			break
		case 'UL Reports':
			record.report_id = valueOne
			record.actions_item = valueTwo
			record.report_form = valueThree
			record.actions_method = valueFour
			break
		case 'UL Sorts':
			record.sort_field = valueOne
			record.sort_direction = valueTwo
			record.server_name = valueThree
			record.table_name = valueFour
			record.record_field = valueFive
			record.record_id = valueSix
			break
		case 'UL Tabs':
			record.actions_item = valueOne
			record.tab_form = valueTwo
			break
	}
	
//	databaseManager.saveData()
}


/*

			record. = valueOne
			record. = valueTwo
			record. = valueThree
			record. = valueFour
			record. = valueFive
			record. = valueSix
			record. = valueSeven
			record. = valueEight
			record. = valueNine
			record. = valueTen
			record. = valueEleven
*/
}

/**
 *
 * @properties={typeid:24,uuid:"c3da0de9-3fb6-48ba-8406-2bb1060e48f7"}
 */
function CALLBACK_navigation_filter_update()
{

/*
 *	TITLE    :	CALLBACK_navigation_filter_update
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	manually trigger navigation item filter parameter refresh
 *			  		- if any filters have changed, reset
 *			  	
 *	INPUT    :	1- force refresh even if filters haven't changed (optional)
 *			  		- NOTE: will reset all finds/filters/etc
 *			  	2- navigationItemID of worfklow to update (optional)
 *			  	
 *	OUTPUT   :	boolean whether refreshed or not
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CALLBACK_navigation_filter_update([navItemID], [forceRefresh]) Refresh filters on showing navigation item
 *			  	
 *	MODIFIED :	May 15, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs defined and frameworks not in a locked status
if (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.currentFormID && !solutionPrefs.config.lockStatus) {

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

	var forceRefresh = arguments[0]
	var navItemID = arguments[1]
	
	return globals.NAV_foundset_restrict(forceRefresh,navItemID)
}
else {
	return false
}
}

/**
 *
 * @properties={typeid:24,uuid:"e58b6503-e021-452d-b2b1-075c79e44ddd"}
 */
function CALLBACK_navigation_set()
{

/*
 *	TITLE    :	CALLBACK_navigation_set
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	jumps between navigation items; note: sort will be reset to whatever is specified (default would be to go in pk order)
 *			  	
 *	INPUT    :	1- registry (item_id) of navigation_item to jump to
 *			  	2- true/false to bring over related foundset from current form
 *			  	3- foundset/array of pks to restore on destination form
 *			  	
 *	OUTPUT   :	true if foundset loaded, false if foundset not loaded, null if no foundset operations performed or nothing happened
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CALLBACK_navigation_set(registry, [setFoundset], [specifyFoundset/pkArray]) Navigates to a registered form and sets its foundset
 *			  	
 *	MODIFIED :	June 17, 2010 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: when navitem filters on, record will not be preserved when new records loaded in

//solutionPrefs defined and frameworks not in a locked status
if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {

	var itemID = arguments[0]
	var setFoundset = arguments[1]
	var useFoundset = arguments[2]

	//loop through all available items, finding everything with this registry
	var navItemID = new Array()
	for (var i in navigationPrefs.byNavItemID) {
		if (navigationPrefs.byNavItemID[i] && navigationPrefs.byNavItemID[i].navigationItem.itemId == itemID) {
			navItemID.push(i)
		}
	}

	//try to find navigaion item from selected set
	for (var i = 0; i < navItemID.length; i++) {
		if (navigationPrefs.byNavItemID[navItemID[i]].navigationItem.idNavigation == globals.DATASUTRA_navigation_set) {
			var found = true
			break
		}
	}

	//prefer navigaion item from selected set
	if (found) {
		var navItem = navigationPrefs.byNavItemID[navItemID[i]].navigationItem
	}
	//take first navigation item with passed registry
	else if (navItemID.length) {
		var navItem = navigationPrefs.byNavItemID[navItemID[0]].navigationItem
	}

	if (navItem) {
		var navSetID = navItem.idNavigation
		var formNameWorkflow = navItem.formToLoad
		var formNameList = navItem.listToLoad
		var stringSort = navItem.sortString

		//if from a different navigation set
		if (globals.DATASUTRA_navigation_set != navSetID) {
			navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].lastNavItem = solutionPrefs.config.currentFormID
			globals.DATASUTRA_navigation_set = navSetID

			//update text display
			var displayValue = application.getValueListDisplayValue('NAV_navigation_set',globals.DATASUTRA_navigation_set)
			forms.NAV_0L_solution.elements.lbl_header.text = (displayValue) ? displayValue.toUpperCase() : 'NAVIGATION'
		}

		//redraw list; make sure row is expanded if node2; load new item
		forms.NAV_0L_solution.LIST_expand_collapse(navItem.idNavigationItem,'open',navSetID)

		//bring foundset over
		if (setFoundset) {
			var callingFoundset = (useFoundset) ? useFoundset : forms[application.getMethodTriggerFormName()].foundset

			//we're passed an array, convert to dataset
			if (callingFoundset instanceof Array) {
				var ds = databaseManager.convertToDataSet(callingFoundset)

				forms[formNameWorkflow].controller.loadRecords(ds)
			}
			//working with foundset, verify that based on same table
			else {

				var dataSourceOne = callingFoundset.getDataSource()
				var dataSourceTwo = forms[formNameWorkflow].controller.getDataSource()

				var formOne = databaseManager.getDataSourceServerName(dataSourceOne) + '—' + databaseManager.getDataSourceTableName(dataSourceOne)
				var formTwo = databaseManager.getDataSourceServerName(dataSourceTwo) + '—' + databaseManager.getDataSourceTableName(dataSourceTwo)

				//check that the two forms are based on the same table from the same server
				if (formOne == formTwo) {
					//load related foundset
					forms[formNameWorkflow].controller.loadRecords(callingFoundset.unrelate())

				}
			}

			//one of the above two is true, //TODO!
			if (true) {
				//restrict if required to
			//	globals.NAV_foundset_restrict(true,null,true)

				//reset the sort
				if (stringSort && forms[formNameWorkflow].controller.getMaxRecordIndex()) {
					forms[formNameWorkflow].controller.sort(stringSort)
				}

				//modified foundset
				var modifiedFoundset = forms[formNameWorkflow].foundset

				//show that only a portion of current foundset selected
				globals.DATASUTRA_find = 'Related subset'
				globals.DATASUTRA_find_field = null
			//	forms[solutionPrefs.config.formNameBase].elements.find_end.setImageURL('media:///find_stop.png')

				//using UL, refresh
				if (navItem.useFwList) {
					//serclipse 4
					if (utils.stringToNumber(solutionPrefs.clientInfo.verServoy) >= 4) {
						var formUL = navigationPrefs.byNavItemID[navItem.idNavigationItem].listData.tabFormInstance

						forms[formUL].controller.loadRecords(modifiedFoundset.unrelate())
					}
					//3.5
					else {
						globals.CALLBACK_ul_refresh_all()
					}
				}
				//custom list based on the same, set it too
				else if (formNameList && forms[formNameList]) {
					var dataSourceThree = forms[formNameWorkflow].controller.getDataSource()
					var formThree = databaseManager.getDataSourceServerName(dataSourceThree) + '—' + databaseManager.getDataSourceTableName(dataSourceThree)

					//check that the two forms are based on the same table from the same server
					if (formTwo == formThree) {
						//load related foundset
						forms[formNameList].controller.loadRecords(modifiedFoundset.unrelate())

						//crazy hack for our nested unrelated panes
						if (forms[formNameList + '_1L']) {
							var dataSourceFour = forms[formNameList + '_1L'].controller.getDataSource()
							var formFour = databaseManager.getDataSourceServerName(dataSourceFour) + '—' + databaseManager.getDataSourceTableName(dataSourceFour)
							if (formThree == formFour) {
								//load related foundset
								forms[formNameList + '_1L'].controller.loadRecords(modifiedFoundset.unrelate())
							}
						}

						return true
					}
				}
				else {
					return false
				}

				return true
			}
			else {
				return false
			}
		}
		else {
			return null
		}
	}
	else {
		plugins.dialogs.showErrorDialog(
					'Navigation error',
					'You do not have access to this screen.  Please see administrator'
			)
		return null
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"7e91ecfd-e090-4d7b-83cf-782473b41028"}
 */
function CALLBACK_progressbar_get()
{

/*
 *	TITLE    :	CALLBACK_progressbar_get
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	1- value of bean	(null means that either indeterminate or not showing)
 *			  	2- text 
 *			  	3- toolTip on text
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CALLBACK_progressbar_get()
 *			  	
 *	MODIFIED :	June 26, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs && forms[solutionPrefs.config.formNameBase+'__header__toolbar'].elements.tab_toolbar.getTabNameAt(forms[solutionPrefs.config.formNameBase+'__header__toolbar'].elements.tab_toolbar.getMaxTabIndex()) == 'TOOL_progress_bar') {
	var formName = 'TOOL_progress_bar'
	
	//get progressbar value if showing
	if (forms[formName].elements.bean_progress.visible && !forms[formName].elements.bean_progress.indeterminate) {
		var value = forms[formName].elements.bean_progress.value
	}
	else {
		var value = null
	}
	
	//get text
	if (forms[formName].elements.lbl_progress_text.visible && forms[formName].elements.lbl_progress_text.text) {
		var explanationText = forms[formName].elements.lbl_progress_text.text
	}
	else {
		var explanationText = null
	}
	
	//get toolTip
	if (forms[formName].elements.lbl_progress_text.visible && forms[formName].elements.lbl_progress_text.toolTipText) {
		var explanationToolTip = forms[formName].elements.lbl_progress_text.toolTipText
	}
	else if (explanationToolTip) {
		var explanationToolTip = null
	}
	
	return [value,explanationText,explanationToolTip]
}


}

/**
 *
 * @properties={typeid:24,uuid:"13108d13-f698-45c1-a3d7-0b1c4547e37f"}
 */
function CALLBACK_progressbar_set()
{

/*
 *	TITLE    :	CALLBACK_progressbar_set
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	1- value
 *			  	2- text (null will clear, empty will not change value, new value will be set)
 *			  	3- toolTip
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CALLBACK_progressbar_set()
 *			  	
 *	MODIFIED :	June 26, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

	var formName = 'TOOL_progress_bar'
	
	var value = arguments[0]
	var explanationText = arguments[1]
	var explanationToolTip = arguments[2]
	
	//set new progress value
	if (typeof value == 'number') {
		forms[formName].elements.bean_progress.value = value
		forms[formName].elements.bean_progress.updateUI()
	}
	
	//set text
	if (explanationText == null && typeof explanationText == 'object') {
		forms[formName].elements.lbl_progress_text.text = null
	}
	else if (explanationText) {
		forms[formName].elements.lbl_progress_text.text = explanationText
	}
	
	//set toolTip
	if (explanationToolTip == null && typeof explanationToolTip == 'object') {
		forms[formName].elements.lbl_progress_text.toolTipText = null
	}
	else if (explanationToolTip) {
		forms[formName].elements.lbl_progress_text.toolTipText = explanationToolTip
	}
	
	application.updateUI()
}

}

/**
 *
 * @properties={typeid:24,uuid:"99d4d8c5-a92a-4793-a10a-04bb647a2d68"}
 */
function CALLBACK_progressbar_start()
{

/*
 *	TITLE    :	CALLBACK_progressbar_start
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	sets up the progressbar
 *			  	
 *	INPUT    :	1- initial value (usually 0); if null, bar will be indeterminate; if -273, use gif
 *			  	2- explanation text; if empty, text will not be available
 *			  	3- explanation toolTip
 *			  	4- minimum (defaults to 0)
 *			  	5- maximum (defaults to 100)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CALLBACK_progressbar_start(startPosition,explanation,explanationTooltip,minValue,maxValue)
 *			  	
 *	MODIFIED :	June 26, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

	var formName = 'TOOL_progress_bar'
	var baseForm = solutionPrefs.config.formNameBase
	
	var initialValue = arguments[0]
	var explanationText = arguments[1]
	var explanationToolTip = arguments[2]
	var minimum = (typeof arguments[3] == 'number') ? arguments[3] : 0
	var maximum = (typeof arguments[4] == 'number') ? arguments[4] : 100
	
	//only run if progressbar not added
	if (forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getTabFormNameAt(forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getMaxTabIndex()) != formName) {

		//save down active toolbar to restore
		solutionPrefs.config.lastSelectedToolbar = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex
		
		//load scrollbar tab
		forms[baseForm + '__header__toolbar'].elements.tab_toolbar.addTab(forms[formName],'')
		forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getMaxTabIndex()
		
		//hide toolbar controls
		forms[baseForm + '__header__toolbar'].elements.btn_toolbar_toggle.visible = false
		forms[baseForm + '__header__toolbar'].elements.btn_toolbar_popdown.visible = false
	}
	//hide bean stuff to make sure the passed values are obeyed
	else {
		forms[formName].elements.lbl_progress_text.visible = false
		forms[formName].elements.bean_progress.indeterminate = false
		forms[formName].elements.bean_progress.value = 0
		forms[formName].elements.bean_progress.visible = false
		forms[formName].elements.gfx_progress.visible = false
	}
	
	//turn on progressbar elements
	forms[formName].elements.bean_progress.visible = true
	forms[formName].elements.lbl_progress_text.visible = (explanationText) ? true : false
	forms[formName].elements.gfx_progress.visible = false
	
	//indeterminate gif
	if (initialValue == -273) {
		forms[formName].elements.bean_progress.visible = false
		forms[formName].elements.gfx_progress.visible = true
		
	}
	//indeterminate scrollbar
	else if (initialValue == null && typeof initialValue == 'object') {
		forms[formName].elements.bean_progress.indeterminate = true
	}
	//normal scrollbar
	else {
		//initial value
		if (typeof initialValue == 'number') {
			forms[formName].elements.bean_progress.value = initialValue
		}
		else {
			forms[formName].elements.bean_progress.value = 0
		}
		
		//min/max
		forms[formName].elements.bean_progress.minimum = minimum
		forms[formName].elements.bean_progress.maximum = maximum
	}
	
	
	//set text
	if (explanationText) {
		forms[formName].elements.lbl_progress_text.text = explanationText
		forms[formName].elements.lbl_progress_text.toolTipText = explanationToolTip
	}
	
	//two updates (maybe more required)
	application.updateUI()
	application.updateUI()
	application.updateUI()
}


}

/**
 *
 * @properties={typeid:24,uuid:"705d0fdd-b2f9-48a4-9495-d3762c0cb104"}
 */
function CALLBACK_progressbar_stop()
{

/*
 *	TITLE    :	CALLBACK_progressbar_stop
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	reset toolbars and select last toolbar user was viewing
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CALLBACK_progressbar_stop()
 *			  	
 *	MODIFIED :	June 26, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */


if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase
	var formName = 'TOOL_progress_bar'
	
	//remove progress toolbar if it is present
	if (forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getTabFormNameAt(forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getMaxTabIndex()) == formName) {
		forms[baseForm + '__header__toolbar'].elements.tab_toolbar.removeTabAt(forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getMaxTabIndex())
		
		//set toolbar to previous if it wasn't the last tab
		if (solutionPrefs.config.lastSelectedToolbar != forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getMaxTabIndex()) {
			globals.DS_toolbar_cycle(solutionPrefs.config.lastSelectedToolbar)
		}
		
		//show toolbar controls
		forms[baseForm + '__header__toolbar'].elements.btn_toolbar_toggle.visible = true
		//forms[baseForm + '__header__toolbar'].elements.btn_toolbar_popdown.visible = false
	}
	
	//clear out lastSelectedToolbar
	solutionPrefs.config.lastSelectedToolbar = null
	
	//hide bean stuff to be ready for next time
	forms[formName].elements.lbl_progress_text.visible = false
	forms[formName].elements.bean_progress.indeterminate = false
	forms[formName].elements.bean_progress.value = 0
	forms[formName].elements.bean_progress.visible = false
	forms[formName].elements.gfx_progress.visible = false
}

}

/**
 *
 * @properties={typeid:24,uuid:"32c5064f-1136-410e-8f08-900c0872fc96"}
 */
function CALLBACK_registered_action_authenticate()
{

/*
 *	TITLE    :	CALLBACK_registered_action_authenticate
 *			  	
 *	MODULE   :	rsrc_CODE_frameworks
 *			  	
 *	ABOUT    :	checks if the group of the currently logged in user is permitted to perform action
 *			  	
 *	INPUT    :	action registry id; configured in Access and Control
 *			  	
 *	OUTPUT   :	true/false
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	USAGE    :	CALLBACK_registered_action_authenticate(actionRegisty) Returns whether currently logged in user is permitted to perform action
 *			  	
 *	MODIFIED :	December 16, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//check to see that solutionPrefs is defined
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
	
	//check to see that access and control is enabled
	if (solutionPrefs.access && solutionPrefs.access.groupID) {
		var actionRegistry = arguments[0]
		var serverName = forms[solutionPrefs.config.formNameBase].controller.getServerName()
		
		var allActions = databaseManager.getFoundSet(serverName, 'sutra_access_action')
		allActions.clear()
		
		allActions.find()
		allActions.action_id = actionRegistry
		var results = allActions.search()
		
		//the specified action does exist
		if (results) {
			var actionID = allActions.id_action
			
			var groupActions = databaseManager.getFoundSet(serverName, 'sutra_access_group_action')
			groupActions.clear()
			
			groupActions.find()
			groupActions.id_action = actionID
			groupActions.id_group = solutionPrefs.access.groupID
			groupActions.flag_enabled = 1
			results = groupActions.search()
			
			//action allowed
			if (results) {
				return true
			}
			//action disallowed
			else {
				return false
			}
		}
		//the specified action does not exist
		else {
			return false
		}
	}
	//solutionPrefs access and control is turned off, allow action
	else {
		return true
	}
}
//solutionPrefs not defined, therefore running in standalone module; allow action
else {
	return true
}


}

/**
 *
 * @properties={typeid:24,uuid:"16e4b4b2-b0ef-4af5-81e5-4a1fb2c76a84"}
 */
function CALLBACK_spaces_set()
{

/*
 *	TITLE    :	CALLBACK_spaces_set
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	change the current workflow to the specified space
 *			  	
 *	INPUT    :	1- space name to jump to
 *			  		Valid inputs are:
 *			  			'standard','list','vertical','centered','classic','wide','workflow',
 *						'standard flip','list flip','vertical flip','centered flip','classic flip','wide flip','workflow flip'
 *			  	2- go there even if already on that space
 *			  	3- do not fire application updateUIs
 *			  	
 *	OUTPUT   :	true if space changed, false if no change (already on that space or input was not valid)
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CALLBACK_spaces_set(spaceName) Makes the specified space active
 *			  	
 *	MODIFIED :	August 19, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: only allow spaces enabled for navItem to be navigable

//solutionPrefs defined and frameworks not in a locked status
if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {

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

	var oldSpace = solutionPrefs.config.activeSpace
	var newSpace = arguments[0]
	var alwaysFire = arguments[1]
	var skipUI = arguments[2]
	
	var spaceNames = [	'standard','list','vertical','centered','classic','wide','workflow',
						'standard flip','list flip','vertical flip','centered flip','classic flip','wide flip','workflow flip']
	
	//check to make sure that newSpace is a valid input
	var found = false
	for (var i = 0; i < spaceNames.length && !found; i++) {
		if (spaceNames[i] == newSpace) {
			found = true
		}
	}
	
	//destination space is valid and different than current space
	if ((newSpace != oldSpace || alwaysFire) && found) {
		var baseForm = solutionPrefs.config.formNameBase
		
		//hide complement and show current
		if (i < 8) {
			var complement = i + 7
		}
		else {
			var complement = i - 7
		}
		forms[baseForm + '__header'].elements['btn_space_'+i].visible = true
		forms[baseForm + '__header'].elements['btn_space_'+complement].visible = false
		
		//fire space changer	
		globals.DS_space_change('btn_space_'+i,true,alwaysFire,skipUI)
		
		return true
	}
	else {
		return false
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"388b465a-89a4-471f-9ad9-8a862a505fe3"}
 */
function CALLBACK_timer()
{

/*
 *	TITLE    :	CALLBACK_timer
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	starts/stops timer for debugging speed issues
 *			  	
 *	INPUT    :	1- 'start'/'stop'
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	USAGE    :	CALLBACK_timer(startStop) Starts/stops timer.  Displays value in status area when stopped
 *			  	
 *	MODIFIED :	July 21, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var startStop = arguments[0]

//check for solutionPrefs
if (!application.__parent__.solutionPrefs) {
	solutionPrefs = {config : {timer: new Object()}}
}
//check for config node
else if (!solutionPrefs.config) {
	solutionPrefs.config = {timer : new Object()}
}
//check for timer node
else if (!solutionPrefs.config.timer) {
	solutionPrefs.config.timer = new Object()
}


//start timing
if (startStop == 'start') {
	solutionPrefs.config.timer.timeStart = new Date().getTime()
}
//stop timing
else if (startStop == 'stop') {
	if (solutionPrefs.config.timer.timeStart) {
		var endTime = solutionPrefs.config.timer.timeEnd = new Date().getTime()
		
		var elapsed = solutionPrefs.config.timer.timeEnd - solutionPrefs.config.timer.timeStart
		
		//only set when demo mode not expired
		if (!solutionPrefs.config.demoModeExpired) {
			application.setStatusText('Elapsed time is: '+ elapsed +' ms.  Finished '+utils.dateFormat(endTime, 'H:MM:ss'))
		}
	}
	else {
		plugins.dialogs.showErrorDialog('Timer error','The timer has not been started yet')
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"545d621f-ead0-4ac5-99aa-7e3a05c85e41"}
 */
function CALLBACK_toolbar_record_navigator_set()
{

/*
 *	TITLE    :	CALLBACK_toolbar_record_navigator_set
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	update record navigator graphical objects to reflect current record
 *			  	
 *	INPUT    :	1- true/false to enable disable record navigator (if false passed, true must be specified before rn will work on other future forms)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	June 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs defined and frameworks not in a locked status
if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {

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

	/*************
		inputs
	*************/
	
	//record navigator status
	if (typeof arguments[0] == 'boolean') {
		var rnStatus = solutionPrefs.config.recordNavigatorStatus = arguments[0]
	}
	else {
		var rnStatus = solutionPrefs.config.recordNavigatorStatus
	}
	
	//get record navigator form name
	var formNameRN	 	= 'TOOL_record_navigator'
	
	//get form name
	var formName 		= solutionPrefs.config.currentFormName
	
	//get current index
	var thisIndex 			= forms[formName].controller.getSelectedIndex()
	
	//loaded records size
	var loaded			= forms[formName].controller.getMaxRecordIndex()
	
	//get max table size
	var size 			= databaseManager.getFoundSetCount(forms[formName].foundset)
	
	//set range
	var setSize			= ""
	
	//get current id of loaded form
	var currentNavItem	= solutionPrefs.config.currentFormID
	
	//update record navigator normally
	if (rnStatus) {
		//enable elements if needed
		if (!forms[formNameRN].elements.btn_rec_left.enabled) {
			forms[formNameRN].elements.btn_rec_left.enabled = true
			forms[formNameRN].elements.btn_rec_right.enabled = true
		}
		
		
		/***************************
			universal list specific
		****************************/
		
		//using universal list, do stuff
		if (navigationPrefs.byNavItemID[currentNavItem] && navigationPrefs.byNavItemID[currentNavItem].navigationItem.useFwList) {
			navigationPrefs.byNavItemID[currentNavItem].listData.index.selected = thisIndex
				
			var limitStart = navigationPrefs.byNavItemID[currentNavItem].listData.index.start
			var limitEnd = navigationPrefs.byNavItemID[currentNavItem].listData.index.end
			
			if (limitStart && limitEnd) {
				//setSize = " List showing " + utils.numberFormat(limitStart,'###,###,###,###') + "-" + utils.numberFormat(limitEnd,'###,###,###,###') + "."
			}
		}
		
			
		/***************************
			current record display
		****************************/
		
		//figure out record object display length
		var maxWidth		= forms[formNameRN].elements.obj_records_max.getWidth()
		
		var recordDivisor	= (thisIndex / loaded) ? thisIndex / loaded : 0
		var recordWidth		= maxWidth * recordDivisor
		
		//display record object
		forms[formNameRN].elements.obj_records.setSize(recordWidth, forms[formNameRN].elements.obj_records.getHeight())
				
		//display label
		var recDisplay = "Record " + utils.numberFormat(thisIndex,'###,###,###,###') + " of " + utils.numberFormat(loaded,'###,###,###,###')
		if (loaded == size) {
			recDisplay += " total records."
		}
		else {
			recDisplay += " loaded. " + utils.numberFormat(size,'###,###,###,###') + " total records."
		}
		recDisplay += setSize
		forms[formNameRN].elements.lbl_records.text = recDisplay
	}
	//null out value on record navigator
	else {
		forms[formNameRN].elements.obj_records.setSize(forms[formNameRN].elements.obj_records_max.getWidth(), forms[formNameRN].elements.obj_records.getHeight())
		forms[formNameRN].elements.lbl_records.text = 'Record Navigator inactive'
		
		//disable elements
		forms[formNameRN].elements.btn_rec_left.enabled = false
		forms[formNameRN].elements.btn_rec_right.enabled = false
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"900fee92-988b-4c95-aca8-0072b6277768"}
 */
function CALLBACK_toolbar_set()
{

/*
 *	TITLE    :	CALLBACK_toolbar_set
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	jumps between navigation items
 *			  	
 *	INPUT    :	1- toolbar name to jump to
 *			  		Valid inputs are the tab names as defined in the Toolbar setup configuration
 *			  	
 *	OUTPUT   :	true if toolbar changed, false if no change (toolbar already visible or input was not valid)
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CALLBACK_toolbar_set(toolbar) Navigates to the specified toolbar if it is available for the logged in user
 *			  	
 *	MODIFIED :	August 19, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs defined and frameworks not in a locked status
if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {

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

	var baseForm = solutionPrefs.config.formNameBase
	
	//only run when not in a preference
	if (!solutionPrefs.config.prefs.preferenceMode) {
		var newToolbar = arguments[0]
		var oldToolbar = solutionPrefs.panel.toolbar[forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex - 1].tabName
		
		var allToolbars = solutionPrefs.panel.toolbar
		
		//check to make sure that newToolbar is a valid input
		var found = false
		for (var i = 0; i < allToolbars.length; i++) {
			if (allToolbars[i].tabName == newToolbar) {
				found = true
				break
			}
		}
		
		//destination toolbar is valid and different than current toolbar, change
		if (newToolbar != oldToolbar && found) {
			globals.DS_toolbar_cycle(i + 1)
			
			return true
		}
		else {
			return false
		}
	}
}



}

/**
 *
 * @properties={typeid:24,uuid:"6a193823-8789-4ec3-a7bf-45d1238dc5bd"}
 */
function CALLBACK_tooltip_help_popup()
{

/*
 *	TITLE    :	CALLBACK_tooltip_help_popup
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	shows tooltip in larger pop-up window
 *			  	
 *	INPUT    :	1- name of tab panel that has the actual help (optional)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	USAGE    :	CALLBACK_tooltip_help_popup([tabPanelName])
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var tabPanelName = arguments[0] || 'tab_detail'
var formName = application.getMethodTriggerFormName() || arguments[1]
var elementName = application.getMethodTriggerElementName() || arguments[2]

if (application.__parent__.solutionPrefs) {
	//there is a default language configured
	if (solutionPrefs.config && solutionPrefs.config.language) {
		//special case where the additional help is located one tab level beneath the help button
		if (elementName == 'btn_help' && forms[formName].elements[tabPanelName]) {
			var tabFormName = forms[formName].elements[tabPanelName].getTabFormNameAt(forms[formName].elements[tabPanelName].tabIndex)
			var firstFound = false
			
			//loop through all inline help and get the first one available
			for (var j in solutionPrefs.i18n[solutionPrefs.config.language][tabFormName]) {
				if (!firstFound) {
					firstFound = solutionPrefs.i18n[solutionPrefs.config.language][tabFormName][j].inlineHelp
				}
			}
			
			//if help found, continue
			if (firstFound) {
				globals.CODE_text = firstFound
				forms.CODE_P__konsole.elements.lbl_header.text = 'Inline help'
				application.showFormInDialog(forms.CODE_P__konsole,-1,-1,-1,-1,' ',true,false,'inlineHelp')
			}
		}
		//check to see that there is additional help for this element
		else if (solutionPrefs.i18n[solutionPrefs.config.language][formName] && solutionPrefs.i18n[solutionPrefs.config.language][formName][elementName] && solutionPrefs.i18n[solutionPrefs.config.language][formName][elementName].inlineHelp) {
			globals.CODE_text = solutionPrefs.i18n[solutionPrefs.config.language][formName][elementName].inlineHelp
			forms.CODE_P__konsole.elements.lbl_header.text = 'Inline help'
			application.showFormInDialog(forms.CODE_P__konsole,-1,-1,-1,-1,' ',true,false,'inlineHelp')
		}
	}
	//no default language set up; abort
	else {
		plugins.dialogs.showErrorDialog(
						'Error',
						'No default language is specified'
				)
	}
}
else {
	plugins.dialogs.showErrorDialog(
						'Error',
						'Inline help/tooltips only work when in Data Sutra'
				)
}



}

/**
 *
 * @properties={typeid:24,uuid:"cdd6b7fe-1a1c-496d-857e-0ab7b32088f4"}
 */
function CALLBACK_tooltip_set()
{

/*
 *	TITLE    :	CALLBACK_tooltip_set
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	sets tooltip on all named elements of current form
 *			  	
 *	INPUT    :	all optional
 *			  	1- name of form
 *			  	2- clear tooltip on all elements not configured through frameworks
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	USAGE    :	CALLBACK_tooltip_set([formName], [clearTooltips])
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.language) {

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

	var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
	var clearAll = (arguments[1]) ? arguments[1] : false
	var langName = solutionPrefs.config.language
	
	//check to see that default language is specified, there are values for it, the form is specified, and exists
	if (langName && solutionPrefs.i18n[langName] && formName && forms[formName]) {
		var allElements = forms[formName].elements.allnames
		
		//loop through all named elements on this form
		for (var i = 0; i < allElements.length; i++) {
			var elementName = allElements[i]
			
			//a tooltip exists for this form/element combo and the element can take a tooltip
			if (solutionPrefs.i18n[langName][formName] && solutionPrefs.i18n[langName][formName][elementName] && typeof forms[formName].elements[elementName].toolTipText != undefined) {
				//set tooltip
				forms[formName].elements[elementName].toolTipText = solutionPrefs.i18n[langName][formName][elementName].toolTip
			}
			//clear tooltip if none specified and clearAll attribute set
			else if (clearAll && typeof forms[formName].elements[elementName].toolTipText != undefined) {
				forms[formName].elements[elementName].toolTipText = null
			}
		}
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"49c0f6ce-61b1-4b64-8b4b-f6d493783dc0"}
 */
function CALLBACK_ul_display_set()
{

/*
 *	TITLE    :	CALLBACK_ul_display_set
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	go to the specified display for the currently showing form
 *			  	
 *	INPUT    :	position in display array
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	USAGE    :	CALLBACK_ul_display_set(displayPosition) Pass in the position of the display on the currently showing form
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs defined and frameworks not in a locked status
if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {

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
	var displayPosn = arguments[0]
	
	//check that on a form that has a universal list
	if (solutionPrefs.config.currentFormID && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID] && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].navigationItem && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].navigationItem.useFwList) {
		forms[navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.tabFormInstance].DISPLAY_list(true,displayPosn)
	}
	
}


}

/**
 *
 * @properties={typeid:24,uuid:"80b5f03d-6fe0-4ee7-a801-7fd0c6a6238e"}
 */
function CALLBACK_ul_refresh_all()
{

/*
 *	TITLE    :	CALLBACK_ul_refresh_all
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	updates entire universal list if used on this form anywhere in the entire frameworks
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	universal list in use on current form, solutionPrefs
 *			  	
 *	MODIFIED :	Oct 26, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs & navigationPrefs defined and frameworks not in a locked status
	//and in less than 4
if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs && !solutionPrefs.config.lockStatus && 
	utils.stringToNumber(solutionPrefs.clientInfo.verServoy) < 4) {
	
	var navItemID = solutionPrefs.config.currentFormID
	
	//using universal list, do stuff
	if (navigationPrefs.byNavItemID[navItemID].navigationItem.useFwList) {
		databaseManager.saveData()
		
		var formUL = navigationPrefs.byNavItemID[navItemID].listData.tabFormInstance
		
		//only refresh if visited and UL for this nav item
		if (formUL && forms[formUL]) {
			forms[formUL].UL_sync_records()
			globals.CALLBACK_toolbar_record_navigator_set()
		}
	}
}



}

/**
 *
 * @properties={typeid:24,uuid:"02f4edfb-7cb2-4a99-aeda-ac167959430b"}
 */
function CALLBACK_ul_refresh_on_delete()
{
//TODO: COMING SOON!!!!
//MEMO only required for pre 4.0 servoy

/*
 *	TITLE    :	CALLBACK_ul_refresh_on_delete
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	updates universal list data after record deletion
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	universal list in use on current form, solutionPrefs, navigationPrefs
 *			  	
 *	USAGE    :	CALLBACK_ul_refresh_on_delete(displayPosition) Pass in the position of the display on the currently showing form
 *			  	
 *	MODIFIED :	August 6, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
	var navItemID = solutionPrefs.config.currentFormID
	var navItemForm = solutionPrefs.config.currentFormName
	
	//using universal list, do stuff
	if (navigationPrefs.byNavItemID[navItemID].navigationItem.useFwList) {
		
		globals.CALLBACK_ul_refresh_all()
		
		/*
		databaseManager.saveData()
		
		var formUL = navigationPrefs.byNavItemID[navItemID].listData.tabFormInstance
		
		var workflowFoundset = forms[navItemForm].foundset
		var ulFoundset = forms[formUL+'_1L'].foundset
		
		//check to see if index is different than workflow form; if it is omit selected - 1
		if (workflowFoundset.getSelectedIndex() != ulFoundset.getSelectedIndex()) {
			//TODO: add to garbage collector
			navigationPrefs.foundsetPool.recyclePKs.push(ulFoundset.getRecord(ulFoundset.getSelectedIndex() - 1).id_universal_list)
			
			//remove from foundset
			forms[formUL+'_1L'].foundset.omitRecord(ulFoundset.getSelectedIndex() - 1)
		}
		//omit selected index
		else {
			//TODO: add to garbage collector
			navigationPrefs.foundsetPool.recyclePKs.push(ulFoundset.id_universal_list)
			
			//remove from foundset
			forms[formUL+'_1L'].foundset.omitRecord(ulFoundset.getSelectedIndex())
		}
		
		//TODO: save down some state information and update the record_navigator
		
		//re-highlight the record under this index
		forms[formUL + '_1L'].REC_refresh()
		*/
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"50d8a27a-2321-4118-b4f7-db097f8c0f0a"}
 */
function CALLBACK_ul_refresh_selected()
{

/*
 *	TITLE    :	CALLBACK_ul_refresh_selected
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	updates universal list data for currently selected record
 *			  	method may be attached to onRecSave of form used in workflow area to keep UL in sync with changes that user is making
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	universal list in use on current form, solutionPrefs
 *			  	
 *	MODIFIED :	June 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs & navigationPrefs defined and not skipping a refresh
	//and in less than 4
if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs && 
	!application.__parent__.skipULRefreshOne && utils.stringToNumber(solutionPrefs.clientInfo.verServoy) < 4) {
	
	var navItemID = solutionPrefs.config.currentFormID
	
	//using universal list, do stuff
	if (navigationPrefs.byNavItemID[navItemID].navigationItem.useFwList) {
		databaseManager.saveData()
		
		var formUL = navigationPrefs.byNavItemID[navItemID].listData.tabFormInstance
		
		//only refresh if visited and UL for this nav item
		if (formUL && forms[formUL]) {
			forms[formUL + '_1L'].REC_refresh()
		}
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"2eb30059-9a36-47f9-8f8b-1fac91db90c8"}
 */
function CALLBACK_ul_tab_exit()
{

/*
 *	TITLE    :	CALLBACK_ul_tab_exit
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	remove tab navigated to using the tab controller on the universal list and return universal list
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	universal list in use on current form, solutionPrefs
 *			  	
 *	MODIFIED :	Oct 26, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs defined and frameworks not in a locked status
if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {
	forms[solutionPrefs.config.formNameBase].elements.tab_content_B.tabIndex = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.tabNumber
}
}

/**
 *
 * @properties={typeid:24,uuid:"bee951cd-c178-4304-9676-2576a15749da"}
 */
function CODE_color_method()
{

/*
 *	TITLE    :	CODE_color_method
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	color a given method
 *			  	
 *	INPUT    :	string to be colored
 *			  	
 *	REQUIRES :	globals.CODE_get_function(100, 104, 117), globals.CODE_color_method_fx
 *			  	
 *	OUTPUT   :	html colored string
 *			  	
 *	MODIFIED :	Oct 25, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: remove functions and create bona-fide servoy methods

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

//
// 1) set up for servoy style
//

var keywords =	'abstract boolean break byte case catch char class const continue debugger ' +
				'default delete do else enum export extends final finally float for ' +
				'Function if implements import in instanceof interface package return super switch ' +
				'this throw throws transient try typeof var void while with';

var servoy =	'application controller currentcontroller databaseManager elements forms foundset ' +
				'globals history i18n plugins security ServoyException utils';

var special =	'null undefined NaN';

var fxGetKeywords = globals.CODE_get_function(117)
var fxMatch = globals.CODE_get_function(100)
var fxGetMatches = globals.CODE_get_function(104)

var regexList = [
	{ regex: new RegExp('/\\*[\\s\\S]*?\\*/', 'gm'),				css: 'comment' },			// multiline comments //[0]
	{ regex: new RegExp('//[^TODO,MEMO].*$', 'gm'),					css: 'comment' },			// one line comments //[1]
	{ regex: new RegExp('"(?:\\.|(\\\\\\")|[^\\""\\n])*"','g'),		css: 'string' },			// double quoted strings //[2]
	{ regex: new RegExp("'(?:\\.|(\\\\\\')|[^\\''\\n])*'", 'g'),	css: 'string' },			// single quoted strings //[3]
	{ regex: new RegExp('[(){}]', 'gm'),							css: 'string' },			// brackets () {} //[4]
	{ regex: new RegExp('\\b([\\d]+(\\.[\\d]+)?|0x[a-f0-9]+)\\b', 'gi'),	css: 'number' },	// numbers //[5]
	{ regex: new RegExp('(?:\&lt;|<)(?:=)*|(?:\&gt;|>)(?:=)*|!(?:=)*|[[]|]|(?:==)', 'gm'), css: 'keyword'},	// comparison, square [] //[6]
	{ regex: new RegExp(fxGetKeywords(keywords), 'gm'),			css: 'keyword' },			// keywords //[7]
	{ regex: new RegExp(fxGetKeywords(servoy), 'gm'),			css: 'servoy' },			// servoy words //[8]
	{ regex: new RegExp(fxGetKeywords(special), 'gm'),			css: 'special' },			// special red words //[9]
	{ regex: new RegExp('[*-]|[+]|=[^=]|[/][^/*]', 'gm'),			css: 'special' },			// operators //[10]
	{ regex: new RegExp('//[TODO,MEMO].*$', 'gm'),					css: 'devnotes' }			// todo developer notes //[11]
	];

//
// 2) get variable filled with data
//

var method = arguments[0]

// a value present to be colored
if ((!(method == null || method == undefined)) ? method.length : false) { 
	var methodArray = method.split('\n')
	
	//replace each element of methodArray with an object containing the original contents
	//and an array where there is 1 letter per element
	for (var i = 0 ; i < methodArray.length ; i++) {
		var rowObject = new Object()
		rowObject.rowData = methodArray[i]
		rowObject.rowArray = new Array()
		rowObject.startRestrict = new Array()
		rowObject.endRestrict = new Array()
		//
		for (var j = 0 ; j < rowObject.rowData.length ; j++) {
			rowObject.rowArray[j] = rowObject.rowData.charAt(j)
			
			//replace tabs with spaces
			if (rowObject.rowArray[j] == '\t') {
				rowObject.rowArray[j] = '&nbsp;&nbsp;&nbsp;&nbsp;'
			}
			//replace space with space
			else if (rowObject.rowArray[j] == ' ') {
				rowObject.rowArray[j] = '&nbsp;'
			}
			//replace < with &lt;
			else if (rowObject.rowArray[j] == '<') {
				rowObject.rowArray[j] = '&lt;'
			}
		}
		methodArray[i] = rowObject //globals.CODE_copy_object(rowObject)
	}

//
// 3) parse
//

	//positions and lengths of all multiline comments
	var posnColor = fxGetMatches(method,regexList[0].regex,regexList[0].css,fxMatch)
	
	if (posnColor.length) {
		var spanInsert = '<span class="' + posnColor[0].css + '">'
		var j = 0 //cumulative character count
		var k = 0 //array index
		
		//go through all multiline comments
		for (var i = 0 ; i < posnColor.length ; i++) {
			var indexStart = posnColor[i].index
			var indexEnd = posnColor[i].index + posnColor[i].length - 1
			
			//go to starting position
			var exitLoop = false
			//k is row in methodArray, j is number of characters in all rows up to k - 1
			while (j < indexStart && !exitLoop) {
				if (j + methodArray[k].rowArray.length < indexStart) {
					j += methodArray[k].rowArray.length + 1
					k++
				}
				else {
					exitLoop = true
				}
			}
			
			//insert begin span for multiline comment (and restriction)
			methodArray[k].rowArray[indexStart - j] = spanInsert + methodArray[k].rowArray[indexStart - j]
			methodArray[k].startRestrict[methodArray[k].startRestrict.length] = indexStart - j
			
			//go to ending position
			exitLoop = false
			//k is row in methodArray, j is number of characters in all rows up to k - 1
			while (j < indexEnd && !exitLoop) {
				if (j + methodArray[k].rowArray.length < indexEnd) {
					//insert end span and start of next span (and restrictions)
					methodArray[k].rowArray[methodArray[k].rowArray.length - 1] += '</span>'
					methodArray[k].endRestrict[methodArray[k].endRestrict.length] = methodArray[k].rowArray.length - 1
					if (methodArray[k+1].rowArray[0] == undefined) {
						methodArray[k+1].rowArray[0] = spanInsert
					}
					else {
						methodArray[k+1].rowArray[0] = spanInsert + methodArray[k+1].rowArray[0]
					}
					methodArray[k+1].startRestrict[methodArray[k+1].startRestrict.length] = 0
					
					//advance
					j += methodArray[k].rowArray.length + 1
					k++
				}
				else {
					exitLoop = true
				}
			}
			//insert end span for multiline comment (and restriction)
			methodArray[k].rowArray[indexEnd - j] += '</span>'
			methodArray[k].endRestrict[methodArray[k].endRestrict.length] = indexEnd - j
		}
	}

	for (var i = 0 ; i < methodArray.length ; i++) {
		//todo developer notes
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[11],fxGetMatches,fxMatch)
		//oneline comments
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[1],fxGetMatches,fxMatch)
		//double/single quoted strings
		//TODO: '"' contained within each other doesn't work
		methodArray[i] = globals.CODE_color_method_fx(methodArray[i],regexList[3],fxGetMatches,fxMatch)
		methodArray[i] = globals.CODE_color_method_fx(methodArray[i],regexList[2],fxGetMatches,fxMatch)
		//() {} brackets
		methodArray[i] = globals.CODE_color_method_fx(methodArray[i],regexList[4],fxGetMatches,fxMatch)
		//numbers
		methodArray[i] = globals.CODE_color_method_fx(methodArray[i],regexList[5],fxGetMatches,fxMatch)
		//comparison operators and [] brackets
		methodArray[i] = globals.CODE_color_method_fx(methodArray[i],regexList[6],fxGetMatches,fxMatch)
		//keywords
		methodArray[i] = globals.CODE_color_method_fx(methodArray[i],regexList[7],fxGetMatches,fxMatch)
		//servoy words
		methodArray[i] = globals.CODE_color_method_fx(methodArray[i],regexList[8],fxGetMatches,fxMatch)
		//special red words
		methodArray[i] = globals.CODE_color_method_fx(methodArray[i],regexList[9],fxGetMatches,fxMatch)
		//operators
		methodArray[i] = globals.CODE_color_method_fx(methodArray[i],regexList[10],fxGetMatches,fxMatch)
	}
//
// 4) write out html
//
	var html = '<html><head>'
	
	//css
	html += '<style type="text/css" media="screen"><!--'
	html += '.syntax { font-family: "Consolas", "Courier New", Courier, mono, serif; font-size: 12pt; background-color: #E7E5DC; width: 100%; margin: 0px 0 18px 0 !important; }'
	html += '.syntax ol { background-color: #FFFFFF; margin: 0px 0px 1px 0px !important; padding: 0px; color: #5C5C5C; }'
	html += '.syntax ol li { background-color: #F8F8F8; padding: 0 3px 0 10px !important; }'
	html += '.syntax ol li.alt { background-color: #FFFFFF; }'
	html += '.syntax ol li span { color: black; font-weight: normal; }'
	
	//css servoy colors
	html += '.syntax .comment { color: #1B8A28; font-style: italic; font-weight: bold; }'
	html += '.syntax .string { color: gray; }'
	html += '.syntax .keyword { color: #4000FF; font-weight: bold; }'
	html += '.syntax .servoy { color: #00B400; font-weight: bold; }'
	html += '.syntax .special { color: #FF1300; font-weight: bold; }'
	html += '.syntax .devnotes { color: #B00D00; font-style: italic; }'
	html += '.syntax .number { color: #FF00FF; }'
	
	html += '--></style></head>'
	
	//body
	html += '<body>'
	var todayDate = new Date()
	html += '<div class="syntax">'
	html += 'The contents of this method were last refreshed on ' + utils.dateFormat(todayDate,'MM-d-yyyy') + ' at ' + utils.dateFormat(todayDate,'HH:mm:ss')
	html += '<ol>'
	
	for (var i = 0 ; i < methodArray.length ; i++) {
		if (i % 2 == 0) {
			html+= '\n<li class="alt">'
		}
		else {
			html+= '\n<li class="">'
		}
		html += '<span>' //put beginning span on the row
		for (var j = 0 ; j < methodArray[i].rowArray.length ; j++) {
			html += methodArray[i].rowArray[j]
		}
		html += '</span>' //put ending span on the row
		html += '</li>'
	}
	
	//continue alternating background color if less than ~20 rows
	if (i < 20) {
		for (i ; i < 21 ; i++) {
			if (i % 2 == 0) {
				html+= '\n<li class="alt">'
			}
			else {
				html+= '\n<li class="">'
			}
			html += '<span></span></li>' //empty row contents for row background
		}
	}
	
	//wrap up
	html += '</ol></div></body></html>'
	
	return html
}
}

/**
 *
 * @properties={typeid:24,uuid:"9034ab19-2bfb-47c2-98c2-e26612ee4ed4"}
 */
function CODE_color_method_fx()
{

/*
 *	TITLE    :	CODE_color_method_fx
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	process one line, skipping restrictions
 *			  	
 *	INPUT    :	object containing startRestrict, endRestrict, rowData, rowArray; regex; and two Functions
 *			  	
 *	OUTPUT   :	modified object
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Oct 25, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

var returnObject = arguments[0]
var regexItem = arguments[1]
var fxGetMatches = arguments[2]
var fxMatch = arguments[3]


var nonFormat = returnObject.rowData
var indexOffset

var loopEnd = returnObject.startRestrict.length

for (var j = 0 ; j <= loopEnd ; j++) { //to account for starting and ending
	//no restrictions
	if (j == 0 && loopEnd == 0) {
		var noFormat = nonFormat
		indexOffset = 0
	}
	//before first restriction
	else if (j == 0) {
		var noFormat = nonFormat.substring(0, returnObject.startRestrict[j])
		indexOffset = 0
	}
	//not the last restriction, begin with end of current restriction and go until beginning of next one
	else if (j < loopEnd) {
		var noFormat = nonFormat.substring(returnObject.endRestrict[j-1] + 1, returnObject.startRestrict[j])
		indexOffset = returnObject.endRestrict[j-1] + 1
	}
	//after last and only restriction
	else if (j == loopEnd == 1) {
		var noFormat = nonFormat.substring(returnObject.endRestrict[j-1] + 1, returnObject.rowArray.length)
		indexOffset = returnObject.endRestrict[j-1] + 1
	}
	//after last restriction
	else if (j == loopEnd) {
		var noFormat = nonFormat.substring(returnObject.endRestrict[j-1] + 1, returnObject.rowArray.length - 1)
		indexOffset = returnObject.endRestrict[j-1] + 1
	}
	//boundary conditions
	else {
		var noFormat = ''
		indexOffset = 0
	}

	var posnColor = fxGetMatches(noFormat,regexItem.regex,regexItem.css,fxMatch)
	
	//match found
	if (posnColor.length) {
		spanInsert = '<span class="' + posnColor[0].css + '">'	
		for (var k = 0 ; k < posnColor.length ; k++) {
			var indexStart = posnColor[k].index + indexOffset
			var indexEnd = posnColor[k].index + posnColor[k].length - 1 + indexOffset
			
			returnObject.rowArray[indexStart] = spanInsert + returnObject.rowArray[indexStart]
			returnObject.startRestrict[returnObject.startRestrict.length] = indexStart
			
			returnObject.rowArray[indexEnd] += '</span>'
			returnObject.endRestrict[returnObject.endRestrict.length] = indexEnd
		}
	}
}

//sort restriction arrays
returnObject.startRestrict.sort(globals.CODE_sort_numeric)
returnObject.endRestrict.sort(globals.CODE_sort_numeric)

return returnObject
}

/**
 *
 * @properties={typeid:24,uuid:"17abbea9-0fb1-4ba5-a20c-c3df82004085"}
 */
function CODE_copy_dataset()
{

/*
 *	TITLE    :	CODE_copy_dataset
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	creates a copy of a dataset (not a reference), and returns it
 *			  	
 *	INPUT    :	dataset
 *			  	
 *	OUTPUT   :	copy of dataset
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CODE_copy_dataset(dataset) Input a dataset to make a copy
 *			  	
 *	MODIFIED :	Jul 2008 -- David Workman, Data Mosaic
 *			  	
 */

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

var original	= arguments[0]

var columns		= new Array()

for ( var i = 1 ; i <= original.getMaxColumnIndex() ; i++ ) {
	columns.push(original.getColumnName(i))
}

var copyDataset = databaseManager.createEmptyDataSet(0, columns)

for ( var i = 1 ; i <= original.getMaxRowIndex() ; i++ ) {
	copyDataset.addRow([i], columns.length)
	var row = original.getRowAsArray(i)
	for ( var j = 1 ; j <= row.length ; j++ ) {
		copyDataset.setValue(i, j, original.getValue(i, j))
	}
}

return copyDataset
}

/**
 *
 * @properties={typeid:24,uuid:"38693332-be88-4fcd-8674-2e07bfc135dd"}
 */
function CODE_copy_object()
{

/*
 *	TITLE    :	CODE_copy_object
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	creates a copy of an object (not a reference), and returns it
 *			  	
 *	INPUT    :	object
 *			  	
 *	OUTPUT   :	copy of object
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var origObj = arguments[0]

//if passed an array, create an array
if (origObj instanceof Array) {
	var deepCopyObj = new Array(origObj.length)
}
//if passed an object, create an object
else {
	var deepCopyObj = new Object()
}

for (var i in origObj) {
	if (typeof origObj[i] == 'object' && origObj[i] != null) {
		deepCopyObj[i] = globals.CODE_copy_object(origObj[i])
	}
	else {
		deepCopyObj[i] = origObj[i]
	}
}

return deepCopyObj
}

/**
 *
 * @properties={typeid:24,uuid:"c9c2a1ab-d81f-408b-ac1c-4a38e7e342e7"}
 */
function CODE_date_format()
{

/*
 *	TITLE    :	CODE_date_format
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	formats input date as dayOfWeek, Month day, year
 *			  	
 *	INPUT    :	1) date field
 *			  	2) how to format (optional)
 *			  		- 'full' format – Tuesday, January 1, 1970 (default)
 *			  		- 'current' format – (see Preferences for i18n format)
 *			  		- 'specify' format – (see http://java.sun.com/j2se/1.4.2/docs/api/java/text/SimpleDateFormat.html for all options)
 *			  	3) custom format string (optional)
 *			  	4) locale to format date in (optional)
 *			  	
 *	OUTPUT   :	string
 *			  	
 *	REQUIRES :	solutionPrefs.config.language
 *			  	
 *	USAGE    :	CODE_date_format(dateField) Returns a formatted version of the date (Tuesday, January 1, 1970)
 *			  	
 *	MODIFIED :	January 16, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var dateIn = arguments[0] || new Date()
var formatType = arguments[1]
var customFormat = arguments[2]
var customLocale = arguments[3]

//we've got a date
if (dateIn instanceof Date) {
	var dateFormatSimple = (application.__parent__.solutionPrefs && solutionPrefs.fastFind && solutionPrefs.fastFind.dateFormat) ? solutionPrefs.fastFind.dateFormat : i18n.getDefaultDateFormat()
	var dateFormatFull = 'EEEE, MMMM d, yyyy'
	
	switch (formatType) {
		case 'specify':
			var dateFormat = (customFormat) ? customFormat : dateFormatSimple
			break
		case 'current':
			var dateFormat = dateFormatSimple
			break
		case 'full':
			var dateFormat = dateFormatFull
			break
		default:
			var dateFormat = dateFormatFull
			break
	}
	
	var currentLocale = new java.util.Locale((customLocale) ? customLocale : ((application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.language) ? solutionPrefs.config.language : 'en')) 
	var formatter = new java.text.SimpleDateFormat(dateFormat, currentLocale)
	var stringOut = formatter.format(dateIn)
	
	return stringOut
}
//passed some non-date thing; abort
else {
	return dateIn
}



}

/**
 *
 * @properties={typeid:24,uuid:"02f2f179-e06e-4fbf-9fac-2fab657131c7"}
 */
function CODE_dialog_button()
{

/*
 *	TITLE    :	CODE_dialog_button
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	switches placement of ok/cancel button depending on os in use
 *			  	attach to onLoad form event and buttons ok/cancel
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	btnOK, btnCancel elements
 *			  	
 *	MODIFIED :	Sept 2007 -- Robert Ivens, ROCLASI Software Solutions
 *			  	
 */


var sOSname    = application.getOSName(), 
    sFormName  = application.getMethodTriggerFormName(), 
    nOffset    = 0


if (sOSname != 'Mac OS X') { 
     var nOKPos       = forms[sFormName].elements.btnOK.getLocationX(), 
         nCancelPos   = forms[sFormName].elements.btnCancel.getLocationX(), 
         nOKWidth     = forms[sFormName].elements.btnOK.getWidth(), 
         nCancelWidth = forms[sFormName].elements.btnCancel.getWidth()
     nOffset = Math.abs(nOKWidth - nCancelWidth)
     forms[sFormName].elements.btnOK.setLocation(nCancelPos,forms[sFormName].elements.btnOK.getLocationY())
     forms[sFormName].elements.btnCancel.setLocation(nOKPos + nOffset,forms[sFormName].elements.btnCancel.getLocationY())
} 

}

/**
 *
 * @properties={typeid:24,uuid:"1f99a295-e894-4cef-bf1b-4b2e24208a03"}
 */
function CODE_fid_hide()
{

/*
 *	TITLE    :	CODE_fid_hide
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	attach to form in dialog formOnHide method to prevent close button
 *			  		- globals.CODE_hide_form == 1, form closes
 *			  		- globals.CODE_hide_form == 0, form doesn't close
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

return (globals.CODE_hide_form) ? true : false
}

/**
 *
 * @properties={typeid:24,uuid:"a4944da0-7962-411f-96a5-1e9e606c542e"}
 */
function CODE_file_import()
{

/*
 *	TITLE    :	CODE_file_import
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	open file in native viewer
 *			  	
 *	INPUT    :	1- foundset (optional)
 *			  	2- record (optional)
 *			  	3- file name to read in (optional)
 *			  	4- array of field names (optional)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var fsFile = (arguments[0]) ? (arguments[0]) : forms[application.getMethodTriggerFormName()].foundset
var recordFile = (arguments[1]) ? (arguments[1]) : false
var fileName = (arguments[2]) ? (arguments[3]) : plugins.file.showFileOpenDialog(1)
var fieldNames = (arguments[3]) ? (arguments[4]) : new Array(10)

//check for custom field names
var nameFile = fieldNames[0] || 'file_name'
var nameBlob = fieldNames[1] || 'file_blob'
var nameSize = fieldNames[2] || 'file_size'
var nameExt = fieldNames[3] || 'file_ext'
var nameType = fieldNames[4] || 'file_type'
var nameWidth = fieldNames[5] || 'file_width'
var nameHeight = fieldNames[6] || 'file_height'
var namePages = fieldNames[7] || 'file_pages'
var nameThumb = fieldNames[8] || 'file_thumb'
var nameText = fieldNames[9] || 'file_text'

//if file selected, punch in
if (fileName) {
	//replace backslashes with slashes so windows or other filename and path are the same
	var qualifiedFileName = utils.stringReplace(fileName, "\\", "/")
	
	if (qualifiedFileName) {
		//name of file
		var fileName = qualifiedFileName.substr(qualifiedFileName.lastIndexOf("/")+1)
		
		//get the document size
		var fileSize = plugins.file.getFileSize(qualifiedFileName)
		
		if (fileSize > 2 * (1024 * 1024)) {
			var proceed = plugins.dialogs.showQuestionDialog('Large file','The file selected is over 2 mb.  Continue?','Yes','No')
		}
		else {
			var proceed = 'Yes'
		}
		
		if (proceed == 'Yes') {
			
			//get the document specifications
			var fileBlob = plugins.file.readFile(qualifiedFileName)
			var imageTemp =  plugins.images.getImage(fileBlob)
			var fileType = imageTemp.getContentType()
			
			//get extension
			var ext = fileName.split('.')
			//file has an extension
			if (ext && ext.length > 1) {
				var fileExt = ext[ext.length-1].toLowerCase()
			}
			//get extension from file type
			else if (fileType) {
				var fileExt = fileType.substr(fileType.lastIndexOf("/")+1).toLowerCase()
			}
			
			//text file
			if (!fileType && (fileExt.equalsIgnoreCase('txt') || fileExt.equalsIgnoreCase('sql') || 
				fileExt.equalsIgnoreCase('xml') || fileExt.equalsIgnoreCase('js') || fileExt.equalsIgnoreCase('servoyjs') || 
				fileExt.equalsIgnoreCase('java') || fileExt.equalsIgnoreCase('php') || fileExt.equalsIgnoreCase('css') ||
				fileExt.equalsIgnoreCase('html') || fileExt.equalsIgnoreCase('htm') || fileExt.equalsIgnoreCase('properties'))) {
				
				var textFile = true
				
				fileType = 'text'
				
				var origText = new java.lang.String(fileBlob)
				origText = origText.substring(0,1000)
				
				var textSnippet = ''
				
				//put line breaks in
				for (var i = 1; i <= 10 && i <= Math.ceil(origText.length/100); i++) {
					
					var start = (posn) ? posn : 0
					var posn = i * 100
					
					//find place to chop
					if (origText.length >= posn) {
						while (origText.charAt(posn) != ' ') {
							posn--
						}
					}
					else {
						posn = origText.length
					}
					
					textSnippet += origText.substring(start,posn) + '<br>&nbsp;&nbsp;&nbsp;' //+ origText.substring(i*100)
				}
				
				//take off final <br>
				textSnippet = textSnippet.substr(0,textSnippet.length-28)
				
			}
			//unknown file type
			else if (!fileType && fileExt) {
				fileType = fileExt
			}
			//unknown file type
			else if (!fileType) {
				fileType = "UNKNOWN"
			}
			//unknown extension
			if (!fileExt) {
				var fileExt = '???'
			}
			
			//load pdf so i can get the page dimensions if jpedal available (in lib directory)
			if (false) {	//fileType == "application/pdf" && Packages.org.jpedal.PdfDecoder) {
				var pdfDecoder = new Packages.org.jpedal.PdfDecoder
				
				pdfDecoder.openPdfArray(fileBlob)
				pdfDecoder.setPageParameters(1,1)
				
				var pageCount = pdfDecoder.getPageCount()
				var width = pdfDecoder.getPDFWidth()	
				var height = pdfDecoder.getPDFHeight()
				
				var bufferedImage = pdfDecoder.getPageAsThumbnail(1,320)
				var rawData = new java.io.ByteArrayOutputStream()
				Packages.javax.imageio.ImageIO.write(bufferedImage,'jpg',rawData)
				
				var thumb = rawData.toByteArray()
			}
			//get dimensions using image
			else if (!textFile) {
				var width = imageTemp.getWidth()
				var height = imageTemp.getHeight()
				
				//a picture and large, make a small one
				if (width > 320 || height > 320) {
					var thumb = imageTemp.resize(320,320)
				}
				//assign non-picture or small picture data
				else {
					var thumb = fileBlob
				}
			}
			
			//create the new attachment record
			if (!recordFile) {
				var record = fsFile.getRecord(fsFile.newRecord(false,true))
			}
			//attachment record specified
			else {
				var record = recordFile
			}
			
			record[nameFile] = fileName
			record[nameBlob] = fileBlob
			record[nameSize] = fileSize
			record[nameExt] = fileExt
			record[nameType] = fileType
			record[nameWidth] = width
			record[nameHeight] = height
			record[namePages] = pageCount
			record[nameThumb] = thumb
			record[nameText] = (textSnippet) ? textSnippet : null
			
			databaseManager.saveData()
		}
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"b7fdbfae-b579-4031-b240-6d82fc489016"}
 */
function CODE_file_open()
{

/*
 *	TITLE    :	CODE_file_open
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	open file in native viewer
 *			  	
 *	INPUT    :	1- file blob
 *			  	2- file name
 *			  	3- file extension
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: integrate Westy code when in webclient

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

var fileBlob = arguments[0]
var fileName = (arguments[1]) ? arguments[1] : 'tempfile_.pdf'
var fileExt = (arguments[2]) ? arguments[2] : 'pdf'

var tmpfile

if (fileBlob) {
	tmpfile = plugins.file.createTempFile(fileName.substring(0,fileName.length - (fileExt.length)),'.' + fileExt)
	
	//replace backslashes with forward slashes to avoid escaping problems
	tmpfile = utils.stringReplace(tmpfile,"\\", "/")
	
	plugins.file.writeFile(tmpfile,fileBlob)
	
	if (utils.stringMiddle(application.getOSName(),1,7) == "Windows") { 
	   application.executeProgram('rundll32', 'url.dll,FileProtocolHandler',tmpfile) 
	}
	else if (utils.stringMiddle(application.getOSName(),1,7) == "FreeBSD" || utils.stringMiddle(application.getOSName(),1,5) == "Linux") { 
	   application.executeProgram('mozilla', tmpfile) 
	}
	else if (utils.stringMiddle(application.getOSName(),1,6) == "Mac OS") { 
	   application.executeProgram('open', tmpfile) 
	}
}

/*	Westy's web client code
if(application.getApplicationType()==5) {
	//wc from developer needs error trapping to use different install dir
		//adrian suggested
		installdir = utils.stringReplace(installdir,'developer','application_server')
	
	var installdir = java.lang.System.getProperty("user.dir")
	installdir = utils.stringReplace(installdir,'\\','\/')
	var uuid =application.getNewUUID()
	var filename = uuid+'.pdf'
	var filepath = installdir+'/server/webapps/ROOT/'+filename
	var success = plugins.file.writeFile(filepath,mediafield)
	if (success) {
		application.showURL('/'+filename,'_self')
	}
}
*/
}

/**
 *
 * @properties={typeid:24,uuid:"4d46769f-0c98-4c3d-88b2-52035b881c9d"}
 */
function CODE_get_function()
{

/*
 *	TITLE    :	CODE_get_function
 *			  	
 *	MODULE   :	_rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	creates void javascript Function
 *			  	//TODO!!! THIS IS ONLY FOR 3.5 (not for >4)
 *			  	
 *	INPUT    :	id_sutra_function
 *			  	
 *	OUTPUT   :	Function
 *			  	
 *	REQUIRES :	sutra_function table on the frameworks connection
 *			  	
 *	MODIFIED :	Oct 24, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var args = [arguments[0]] //argument contains the pk of said Function

var server = forms.CODE_0T_function.controller.getServerName()
var maxReturnedRows = 1
var query = "SELECT function_arg1, function_arg2, function_arg3, function_arg4, function_arg5, function_body, function_name FROM sutra_function WHERE id_function = ?"
var dataset = databaseManager.getDataSetByQuery(server, query, args, maxReturnedRows)

var test = new Object()

var fxArg1 = (dataset.getValue(1,1)) ? dataset.getValue(1,1) : undefined
var fxArg2 = (dataset.getValue(1,2)) ? dataset.getValue(1,2) : undefined
var fxArg3 = (dataset.getValue(1,3)) ? dataset.getValue(1,3) : undefined
var fxArg4 = (dataset.getValue(1,4)) ? dataset.getValue(1,4) : undefined
var fxArg5 = (dataset.getValue(1,5)) ? dataset.getValue(1,5) : undefined
var fxBody = dataset.getValue(1,6)
var fxName = dataset.getValue(1,7)

var fxReturn = new Function(fxArg1,fxArg2,fxArg3,fxArg4,fxArg5,fxBody)

return fxReturn



}

/**
 *
 * @properties={typeid:24,uuid:"422431ed-d24b-4f08-9f47-89da1d3d4c7b"}
 */
function CODE_highlight_off()
{

/*
 *	TITLE    :	CODE_highlight_off
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	turn off highlighter for selected field
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	'highlighter element' on form
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	Nov 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

//get form with highlighter
var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()

//hide highlighter(s) if they exist
var highlight = 'highlighter' // name of highlighter object
if (forms[formName].elements[highlight]) {
	forms[formName].elements[highlight].visible = false
}

highlight = 'highlighter2' // name of highlighter object
if (forms[formName].elements[highlight]) {
	forms[formName].elements[highlight].visible = false
}
}

/**
 *
 * @properties={typeid:24,uuid:"1cb4856c-317b-4bd0-acc5-1ffe6d18a3fc"}
 */
function CODE_highlight_on()
{

/*
 *	TITLE    :	CODE_highlight_on
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	turn on highlighter for selected field
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	calling element to be named, 'highlighter element' on form, z-axis to be set appropriately for highlighter (behind all fields, in front of all other objects)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	Nov 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get field to be surrounded
var elemName = application.getMethodTriggerElementName()
var formName = application.getMethodTriggerFormName()

//get location and size of field to be surrounded
var fldLocationX = forms[formName].elements[elemName].getLocationX()
var fldLocationY = forms[formName].elements[elemName].getLocationY()
var fldSizeX = forms[formName].elements[elemName].getWidth()
var fldSizeY = forms[formName].elements[elemName].getHeight()

//surround
var highlight = 'highlighter' // name of highlighter object
forms[formName].elements[highlight].setLocation(fldLocationX-3,fldLocationY-3)
forms[formName].elements[highlight].setSize(fldSizeX+6,fldSizeY+5)
forms[formName].elements[highlight].visible = true
highlight = 'highlighter2' // name of highlighter object
forms[formName].elements[highlight].setLocation(fldLocationX-5,fldLocationY-5)
forms[formName].elements[highlight].setSize(fldSizeX+10,fldSizeY+8)
forms[formName].elements[highlight].visible = true

//request focus of element
forms[formName].elements[elemName].requestFocus(false)
}

/**
 *
 * @properties={typeid:24,uuid:"3499217c-ddf4-42dd-8720-dbca10cfd6af"}
 */
function CODE_java_component()
{

/*
 *	TITLE    :	CODE_java_component
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	returns the java componenet for calling/passed in element
 *			  	
 *	INPUT    :	(optional) element to do deep magic on
 *			  	
 *	OUTPUT   :	java component or false if no element could be found
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CODE_java_component([elemName]) Returns the java componenet of any servoy element
 *			  	
 *	MODIFIED :	September 1, 2008 -- Matt and James, adBlocks
 *			  	
 */

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

//element passed
var elem = arguments[0]

//nothing passed, try to get from where called
if (!elem) {
	var formName = application.getMethodTriggerFormName()
	var elemName = application.getMethodTriggerElementName()
	
	if (formName && elemName && forms[formName] && forms[formName].elements[elemName]) {
		var elem = forms[formName].elements[elemName]
	}
}

//we have something, Scotty, where's my flux capacitor?  hmmm, wait a minute.... 
if (elem) {
	return new Packages.java.lang.ref.SoftReference(elem).get()
}
else {
	return false
}


}

/**
 *
 * @properties={typeid:24,uuid:"b1c0974f-1864-4262-9d1b-d9ee2a9a9066"}
 */
function CODE_jsevent_remove()
{
	var item = arguments[0]

	if (item instanceof JSEvent) {
		return false
	}
	else {
		return true
	}

	//if (item &&
	//	typeof item.getElementName == 'func' + 'tion' &&
	//	typeof item.getFormName == 'func' + 'tion' &&
	//	typeof item.getModifiers == 'func' + 'tion' &&
	//	typeof item.getSource == 'func' + 'tion' &&
	//	typeof item.getTimestamp == 'func' + 'tion' &&
	//	typeof item.getType == 'func' + 'tion') {
	//	
	//	return false
	//}
	//else {
	//	return true
	//}
}

/**
 *
 * @properties={typeid:24,uuid:"add587a7-848f-4c93-ab60-9bd0bb99c33f"}
 */
function CODE_key_pressed()
{

/*
 *	TITLE    :	CODE_key_pressed
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	there are two modes of operation; the first mode is the default
 *			  		1- return the number of the last key pressed; no input
 *			  		2- return true/false if key (combination) pressed; input required
 *			  	
 *	INPUT    :	key (combination) -- valid choices are: shift, ctrl, meta, and alt; they may be strung together with a - separating them
 *			  	
 *	OUTPUT   :	true/false whether that key (combination) pressed
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: check out RDC when on a mac

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

var input = arguments[0]
var	keyPressed = application.getLastKeyModifiers()

//offset for pc/mac values
if (keyPressed >= 16) {
	keyPressed -= 16
}

//MODE 2: verify a supplied key combination was pressed
if (input) {
	var keyValue = input.split('-')
	var keyValues = new Object()
	var keys = 0
	
	//convert array to object
	for (var i = 0; i < keyValue.length; i++) {
		keyValues[keyValue[i]] = true
	}
	
	//shift key
	if (keyValues.shift) {
		keys += 1
	}
	//control key
	if (keyValues.ctrl) {
		keys += 2
	}
	//windows start / apple command / *nix meta
	if (keyValues.meta) {
		keys += 4
	}
	//windows alt / apple option
	if (keyValues.alt) {
		keys += 8
	}
	//none
	if (keys == 0) {
		keys = 'none'
	}
	
	//application.setStatusText(input + ((keys == keyPressed) ? ' was ' : ' was NOT ') + 'pressed')
	return keys == keyPressed
}
//MODE 1: return which key was pressed
else {
	//application.setStatusText('Key(s) pressed is/are: ' + keyPressed)
	return keyPressed
}






}

/**
 *
 * @properties={typeid:24,uuid:"c8e2c219-36de-45e6-aac0-44544e6420aa"}
 */
function CODE_method_rewrite()
{

/*
 *	TITLE    :	CODE_method_rewrite
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	overwrites one method with another
 *			  	WARNING: this only works in client
 *			  	NOTE: if you are creating methods on the fly, they must be created in the context where you will use them
 *			  	
 *	INPUT    :	1- old method
 *			  	2- new method
 *			  	
 *	OUTPUT   :	success boolean
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	January 7, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var oldMethod = arguments[0]
var newMethod = arguments[1]

//method to overwrite is a Function and running in client
if (typeof newMethod == 'func' + 'tion' && application.getApplicationType() == 2) {
	var formName = oldMethod.__parent__._formname_
	var methodName = oldMethod._methodname_
	
	//overwrite old method with new
	if (formName) {
		forms[formName][methodName] = newMethod
		forms[formName][methodName]._methodname_ = methodName
	}
	else {
		globals[methodName] = newMethod
		globals[methodName]._methodname_ = methodName
	}
	
	//debugging
	//plugins.dialogs.showErrorDialog('Overwritten')
	return true
}
else {
	return false
}



}

/**
 *
 * @properties={typeid:24,uuid:"63e4da9e-40e3-4612-9488-7e9156b584bb"}
 */
function CODE_property_combobox()
{

/*
 *	TITLE    :	CODE_property_combobox
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	modifies comboboxes on Mac Leopard
 *			  	
 *	INPUT    :	1- boolean to set square status
 *			  	2- size (regular, small, mini)
 *			  	3- form name to work on (optional)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	October 6, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var square = (arguments[0]) ? arguments[0] : false
var size = (arguments[1]) ? arguments[1] : 'small'

//only modifies when running in frameworks, on OS X Leopard, and using the Aqua look and feel
if (application.__parent__.solutionPrefs && solutionPrefs.clientInfo.typeOS == 'Mac OS X' && solutionPrefs.clientInfo.typeLAF == 'Mac OS X' && solutionPrefs.clientInfo.verOS >= '10.5' && solutionPrefs.clientInfo.verServoy >= '3.5.7' && solutionPrefs.clientInfo.typeServoy != 'webclient') {
	var formName = (arguments[2]) ? arguments[2] : application.getMethodTriggerFormName()
	
	if (forms[formName]) {
		var allElems = forms[formName].elements.allnames
		
		for (var i = 0; i < allElems.length; i++) {
			var elemType = (forms[formName].elements[allElems[i]].getElementType) ? forms[formName].elements[allElems[i]].getElementType() : ''
			
			//it's a combobox
			if (elemType == 'COMBOBOX') {
				if (square) {
					forms[formName].elements[allElems[i]].putClientProperty('JComboBox.isSquare',true)
				}
				else if (size) {
					//valid options: regular, small, mini
					forms[formName].elements[allElems[i]].putClientProperty('JComponent.sizeVariant',size)
				}
			}
		}
	}
}



}

/**
 *
 * @properties={typeid:24,uuid:"a20c13c8-fc76-456f-ba90-cbe36521a4c6"}
 */
function CODE_record_duplicate()
{

	/*
	 *	TITLE    :	CODE_record_duplicate
	 *			  	
	 *	MODULE   :	rsrc_CODE_sutra
	 *			  	
	 *	ABOUT    :	create a duplicate of record, and optionally all children
	 *			  	
	 *	INPUT    :	1- a record from some foundset
	 *			  	2- array of relations to copy through
	 *			  	3- overwrite array (from autoenter/relations/etc) with values from copying record
	 * 					- array of arrays with info about which columns to overwrite
	 *			  	
	 *	OUTPUT   :	new parent record
	 *			  	
	 *	REQUIRES :	
	 *			  	
	 *	USAGE    :	CODE_record_duplicate(record, [relationArray], [overwrite]) Duplicates a record and (optionally) all children
	 *			  	
	 *	MODIFIED :	August 23, 2010 -- Troy Elliott, Data Mosaic
	 *			  	
	 */

	//first, create object of relations
	//under each relation, put all the child relations
	//loop through it that way

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

	var srcRecord = arguments[0]
	var relationArray = arguments[1]
	if (arguments[2] instanceof Array) {
		var overwriteOK = arguments[2]
	}
	else {
		var overwriteOK = new Array()

		for (var i = 0; i <= relationArray.length; i++) {
			overwriteOK[i] = (arguments[2]) ? true : false
		}
	}

	//object to store all relations
		//tree required for construction
	var relations = 
		tree = new Object()
	var tree

	//something was passed in
	if (srcRecord) {

		//if relations, convert array into object tree
		if (relationArray && relationArray.length) {
	//		relationArray.sort()

			//split up compound relations
			for (var i = 0; i < relationArray.length; i++) {
				var item = relationArray[i]

				//multiple levels of relations
				if (utils.stringPatternCount(item,'.')) {
					item = item.split('.')
				}
				//nothing to do, skip this iteration
				else if (!item) {
					continue
				}
				//one relation
				else {
					item = new Array(item)
				}

				//add all items to tree
				for (var j = 0; j < item.length; j++) {
					//no place holder for this object yet
					if (!tree[item[j]]) {
						tree[item[j]] = {
											_relation_ : item[j]
										}

						//punch down position of this item
						if (!tree.length) {
							tree.length = 1
						}
						else {
							tree.length++
						}

						//punch down name of this position
						tree[tree.length - 1] = item[j]
					}

					//on final branch, tag on overwrite rules
					if (j + 1 == item.length) {
						tree[item[j]].overwrite = overwriteOK[i + 1]
					}				

					//set tree to newly created item
					tree = tree[item[j]]
				}

				//reset tree for next go round
				tree = relations
			}
		}



		//get foundset of source record
		var serverName = srcRecord.foundset.getServerName()
		var tableName = srcRecord.foundset.getTableName()
		var fsThis = databaseManager.getFoundSet(serverName,tableName)

		//create duplicate record and copy data
		var destRecord = fsThis.getRecord(fsThis.newRecord(false,true))
		databaseManager.copyMatchingColumns(srcRecord,destRecord,overwriteOK[0] || false)

		//go through relations and duplicate sub-records
		for (var i = 0; i < relations.length; i++) {
			//this relation has multiple levels of children
			globals.CODE_record_duplicate_fx(srcRecord,destRecord,relations[relations[i]])
		}

		databaseManager.saveData()

		return destRecord
	}
}

/**
 *
 * @properties={typeid:24,uuid:"2AA00BD2-E0CB-4016-80FB-DA1E12AF1381"}
 */
function CODE_data_export() {
	// here we call the record duplicate method with a special parameter that returns the data that would have been exported
	
}

/**
 *
 * @properties={typeid:24,uuid:"a0a3989c-ff49-49af-9e7e-55b81fc75ab1"}
 */
function CODE_record_duplicate_fx()
{

/*
 *	TITLE    :	CODE_record_duplicate_fx
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	create a duplicate of record, and optionally all children
 *			  	
 *	INPUT    :	1- source record
 *			  	2- destination record
 *			  	3- object of relations
 *			  	4- overwrite bool
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CODE_record_duplicate_fx(sourceRecord, destinationRecord, subRelationArray, objectRecord, [overwrite]) Duplicates all children
 *			  	
 *	MODIFIED :	August 23, 2010 -- Troy Elliott, Data Mosaic
 *			  	
 */

var srcRecord = arguments[0]
var destRecord = arguments[1]
var node = arguments[2]
var overwriteOK = node.overwrite || false

var serverName = srcRecord.foundset.getServerName()
var tableName = srcRecord.foundset.getTableName()

var fsSource = eval('srcRecord.' + node._relation_)
var fsDest = eval('destRecord.' + node._relation_)

if (fsSource && utils.hasRecords(fsSource)) {
	//go through children, call 
	for (var i = 1; i <= fsSource.getSize(); i++) {
		//create duplicate record
		var srcChild = fsSource.getRecord(i)
		var destChild = fsDest.getRecord(fsDest.newRecord(false,true))

		databaseManager.copyMatchingColumns(srcChild,destChild,overwriteOK)

		//re-call this Function if there are more levels beneath
		for (var j = 0; j < node.length; j++) {
			globals.CODE_record_duplicate_fx(srcChild,destChild,node[node[j]])
		}
	}
}

}

/**
 *
 * @properties={typeid:24,uuid:"d8058130-d708-4d6a-b380-aa155713f1c8"}
 */
function CODE_record_object()
{

/*
 *	TITLE    :	CODE_record_object
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	1- a record from some foundset
 *			  	2- omit null values (optional)
 *			  	3- omit unstored calculations (optional)
 *			  	4- array of columns to omit (optional)
 *			  	
 *	OUTPUT   :	object with all info about record passed in
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CODE_record_object(record, [omitNull], [omitUnstoredCalc]) Creates an object representation of a record
 *			  	
 *	MODIFIED :	November 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: foundsets gotten through any other way then just from a table don't have a prototype

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

var record = arguments[0]
var omitNull = arguments[1]
var omitCalc = arguments[2]
var omitSpecify = arguments[3]

var returnObj = new Object()

//get list of calcs
if (omitCalc) {
	var omitColumns = new Object()
	
	//only run in less than 4
	if (utils.stringToNumber(application.getVersion()) < 4) {
		//hack to make omitCalc work on navigation_item and action_item tables
		if (record.foundset.__proto__ == undefined) {
			var serverName = record.foundset.getServerName()
			var tableName = record.foundset.getTableName()
			//var recordFS = databaseManager.getFoundSet(serverName, tableName)
			
			if (tableName == 'sutra_navigation_item') {
				var recordFS = forms.NAV_R_navigation_item.foundset
			}
			else if (tableName == 'sutra_action_item') {
				var recordFS = forms.NAV_R_action_item.foundset
			}
			else {
				var recordFS = {__proto__ : null}
			}
		}
		else {
			var recordFS = record.foundset
		}
		
		//does this table have calcs?
		if (recordFS.__proto__ != undefined) {
			for (var i in recordFS.foundset.__proto__) {
				omitColumns[i] = 'Calculation'
			}
			
			//get db columns
			var table = databaseManager.getTable(record.foundset.getServerName(),record.foundset.getTableName())
			var columnNames = table.getColumnNames()
			
			//remove calcs that have a column
			for (var i = 0; i < columnNames.length; i++) {
				if (omitColumns[columnNames[i]]) {
					omitColumns[columnNames[i]] = null
				}
			}
		}
	}
}

//there are more columns to omit
if (omitSpecify && omitSpecify.length) {
	if (!omitColumns) {
		var omitColumns = new Object()
	}

	for (var i = 0; i < omitSpecify.length; i++) {
		omitColumns[omitSpecify[i]] = 'User omitted'
	}
}

for (var i in record) {
	//omitNull and omitCalc options, record level functions (check if date/array so doesn't hiccup)
	if (!(omitNull && record[i] == null) && !(omitColumns && omitColumns[i]) && (record[i] instanceof Date || record[i] instanceof Array) || typeof record[i] != 'func' + 'tion') {
		var display = globals.CODE_text_camel_caps(i,'_')
		returnObj[display] = record[i]
	}
}

return returnObj


}

/**
 *
 * @properties={typeid:24,uuid:"e4cac4d3-9c81-4dce-b624-dcbc788c8cbf"}
 */
function CODE_row_background(index, selected, fieldType, fieldName, formName, fieldState)
{

//	var index = arguments[0]
//	var selected = arguments[1]
//	var fieldType = arguments[2]
//	var fieldName = arguments[3]
//	var formName = arguments[4]
//	var fieldState = arguments[5]
	
	//if empty, make it red
//	if (!fieldState[fieldName]) {
//		return "#FF0000"
//	}
	
	//white/tan with medium blue highlighter
	if (selected) {
		return '#BED7F7'
	}
	else {
		if (index % 2 == 0) {
			return '#F7F8EF'
		}
		else {
			return '#FFFFFF'
		}
	}
}

/**
 *
 * @properties={typeid:24,uuid:"e559f8ea-8821-43d7-bfe8-8eb5d975988c"}
 */
function CODE_search_array()
{

/*
 *	TITLE    :	CODE_search_array
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	returns an array of positions where an element is found in an array
 *			  	
 *	INPUT    :	1- array
 *			  	2- value to find
 *			  	
 *	OUTPUT   :	position(s) of found element
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 18, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var array = arguments[0]
var searchValue = arguments[1]
var returnArray = false

for (var i = 0; i < array.length; i++) {
	if (typeof(searchValue) == 'func' + 'tion') {
		if (searchValue.test(array[i])) {
			if (!returnArray) {
				returnArray = []
			}
			returnArray.push(i)
		}
	}
	else {
		if (array[i] === searchValue) {
			if (!returnArray) {
				returnArray = []
			}
			returnArray.push(i)
		}
	}
}

return returnArray

}

/**
 *
 * @properties={typeid:24,uuid:"99717390-3f56-4ec2-85b0-c76c1163c0ab"}
 */
function CODE_search_object_array()
{

/*
 *	TITLE    :	CODE_search_object_array
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	returns the position of an element (arg[1]) in an array of objects (arg[0])
 *			  	-1 means not in array
 *			  	
 *	INPUT    :	array of objects, value to find, property to search
 *			  	
 *	OUTPUT   :	position of found element
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

var arraySort = arguments[0]
var elementFind = arguments[1]
var searchIn = arguments[2]

if (elementFind) {
	for (var i = 0 ; i < arraySort.length ; i++) {
		if (arraySort[i][searchIn] == elementFind) {
			//position of element in array
			return i
		}
	}
}
else {
	//element is null
	return null
}

//element is not in array
return -1

}

/**
 *
 * @properties={typeid:24,uuid:"bd1590f7-f7f9-4f02-9545-37d98bc963ac"}
 */
function CODE_sort_dd_array()
{

/*
 *	TITLE    :	CODE_sort_dd_array
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	sorts multi-D array on the field/element of internal array
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	globals.CODE_ddarray_field to have valid property name, called as parameter to sort routine
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: globals.CODE_ddarray_field can be multiple fields

var a = arguments[0]
var b = arguments[1]
var fieldName = globals.CODE_ddarray_field

var x = a[fieldName] //.toLowerCase()
var y = b[fieldName] //.toLowerCase()

return ((x < y) ? -1 : ((x > y) ? 1 : 0))

}

/**
 *
 * @properties={typeid:24,uuid:"52eba58a-6d15-48bf-968d-b99a5f7b7c6f"}
 */
function CODE_sort_numeric()
{

/*
 *	TITLE    :	CODE_sort_numeric
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	sorts an array in numerical order
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	called as parameter to sort routine
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

var a = arguments[0]
var b = arguments[1]

return ((a < b) ? -1 : ((a > b) ? 1 : 0))
}

/**
 *
 * @properties={typeid:24,uuid:"85d559f7-1292-49cb-ab12-7bb40e05ecd8"}
 */
function CODE_text_camel_caps()
{

/*
 *	TITLE    :	CODE_text_camel_caps
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	returns camel caps of what is passed
 *			  	
 *	INPUT    :	1) text to be operated on
 *			  	2) regex describing dividing character (optional)
 *			  	
 *	OUTPUT   :	reformatted text
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Jun 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var stringOrig = arguments[0]
var divider = (arguments[1]) ? arguments[1] : /\s/

var reference = new Array('Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine')
var whiteSpace = divider
var stringTemp = stringOrig.split(whiteSpace)
whiteSpace = /(\S)(\S+)/

//initial word is lower case
if (stringTemp.length) {
	stringTemp[0] = stringTemp[0].toLowerCase()
}

//remaining words are upper case
for (var i = 1; i < stringTemp.length; i++) {
	var stringWord = stringTemp[i]
	
	//if string is a number, change to word representation
	if (utils.stringToNumber(stringWord.charAt(0)) == stringWord.charAt(0)) {
		stringWord = reference[utils.stringToNumber(stringWord.charAt(0))] + stringWord.slice(1)
	}
	
	whiteSpace.exec(stringWord)
	stringTemp[i] = RegExp.$1.toUpperCase() + RegExp.$2.toLowerCase()
}

return stringTemp.join('')





}

/**
 *
 * @properties={typeid:24,uuid:"befe06f8-7983-489d-94e5-000ecb067c1f"}
 */
function CODE_text_initial_caps()
{

/*
 *	TITLE    :	CODE_text_initial_caps
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	returns initial caps of what is passed
 *			  	
 *	INPUT    :	text to be operated on
 *			  	
 *	OUTPUT   :	reformatted text
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Jun 1, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var stringOrig = arguments[0]

var whiteSpace = /\s/
var stringTemp = stringOrig.split(whiteSpace)
whiteSpace = /(\S)(\S+)/

for (var i = 0; i < stringTemp.length; i++) {
	whiteSpace.exec(stringTemp[i])
	stringTemp[i] = RegExp.$1.toUpperCase() + RegExp.$2.toLowerCase()
}

return stringTemp.join(' ')

/*
var stringTemp = stringOrig.toLowerCase()
var stringLength = stringTemp.length

if (stringLength > 0)  {
	for (var index = 0 ; index < stringLength ; index++)  {
		if (index == 0)  {
			var stringChar = stringTemp.substring(0,1).toUpperCase()
			var stringPost = stringTemp.substring(1,stringLength)
			stringTemp = stringChar + stringPost
		}
		else {
			stringChar = stringTemp.substring(index, index+1)
			if (stringChar == " " && index < (stringLength-1))  {
				stringChar = stringTemp.substring(index+1, index+2).toUpperCase()
				var stringPre = stringTemp.substring(0, index+1)
				stringPost = stringTemp.substring(index+2,stringLength)
				stringTemp = stringPre + stringChar + stringPost
			}
		}
	}
}

return stringTemp
*/





}

/**
 *
 * @properties={typeid:24,uuid:"5c99cda3-c6b3-4bc9-a0f3-230b6f949392"}
 */
function CODE_url_handler()
{

/*
 *	TITLE    :	CODE_url_handler
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	opens the first argument passed
 *			  	
 *	INPUT    :	email address or website
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CODE_url_handler(weblocation) Opens web location using the default platform viewer
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */ 

var webloc = arguments[0]

if (webloc) {
	var email = utils.stringPatternCount(webloc,'@')
	
	//email
	if (email) {
		application.showURL('mailto:'+webloc)
	}
	//http
	else {
		if (utils.stringPatternCount(webloc,'://')) {
			application.showURL(webloc)
		}
		else {
			application.showURL('http://'+webloc)
		}
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"d300a03a-be45-4966-8b02-7bf1de59b511"}
 */
function CODE_workspace_data()
{
//	 *	INPUT    :	1- true to create a unique copy (non-reference) of everything; used when creating static object

	var tano = (Math.floor(utils.stringToNumber(application.getVersion())) == 5) ? true : false
	
	var nonRef = arguments[0]
	
	var vlForm = new Object()
	var vlReln = new Object()
	var formsByTable = new Object()
	formsByTable['No datasource'] = new Object()
	
	var workspace = plugins.sutra.getWorkspace().substr(5)
	var modules = plugins.file.getFolderContents(workspace, null, 2)
	
	for (var i = 0; i < modules.length; i++) {
		var module = modules[i]
		//var contents = plugins.file.getFolderContents(module)
		
		if (tano) {
			var theForms = plugins.file.getFolderContents(module.getAbsolutePath() + '/forms', '.frm', 1)
			var theRelations = plugins.file.getFolderContents(module.getAbsolutePath() + '/relations', '.rel', 1)
		}
		else {
			var theForms = plugins.file.getFolderContents(module.getAbsolutePath() + '/forms', '.obj', 1)
			var theRelations = plugins.file.getFolderContents(module.getAbsolutePath() + '/relations', '.obj', 1)
		}
		
		//if this 'module' has forms, proceed
		if (theForms.length) {
			//create container
			vlForm[module.getName()] = new Object()
			
			//fill it
			for (var j = 0; j < theForms.length; j++) {
				var thisForm = theForms[j]
				var nameForm = thisForm.getName().substr(0,thisForm.getName().length - 4)
				
				var aboutForm = plugins.file.readTXTFile(thisForm)
				
				//get rid of sub-items
				if (tano) {
					//this is the non-js regex... items:\[.*],
					aboutForm = aboutForm.replace(/items:\[[\s\S]*],\n/,'')
				}
				
				aboutForm = aboutForm.split(',\n')
				
				var formUUID = null
				var nameServer = null
				var nameTable = null
				var sizeForm = null
				var typeForm = null
				var separateFS = null
				
				for (var k = 0; k < aboutForm.length; k++) {
					if (utils.stringPosition(aboutForm[k], 'uuid:"', 0, 1) == 1) {
						var formUUID = aboutForm[k].substring(6,aboutForm[k].length - 1)
					}
					else if (utils.stringPosition(aboutForm[k], 'serverName:"', 0, 1) == 1) {
						var nameServer = aboutForm[k].substring(12,aboutForm[k].length - 1)
					}
					else if (utils.stringPosition(aboutForm[k], 'tableName:"', 0, 1) == 1) {
						var nameTable = aboutForm[k].substring(11,aboutForm[k].length - 1)
					}
					else if (utils.stringPosition(aboutForm[k], 'size:"', 0, 1) == 1) {
						var sizeForm = aboutForm[k].substring(6,aboutForm[k].length - 1)
					}
					else if (utils.stringPosition(aboutForm[k], 'view:', 0, 1) == 1) {
						var typeForm = aboutForm[k].substring(5,aboutForm[k].length)
					}
					else if (utils.stringPosition(aboutForm[k], 'useSeparateFoundSet:', 0, 1) == 1) {
						var separateFS = (aboutForm[k].substring(20,aboutForm[k].length) == 'true') ? true : false 
					}
					else if (utils.stringPosition(aboutForm[k], 'dataSource:', 0, 1) == 1) {
						var sections = aboutForm[k].split('/')
						
						var nameServer = sections[1]
						var nameTable = sections[2].substring(0,sections[2].length - 1)
					}
				}
				
				var formInfo = {
					moduleName : module.getName(),
					formName   : nameForm,
					elementID  : formUUID,
					useSeparateFoundset : ((separateFS) ? true : false),
					serverName : nameServer,
					tableName  : nameTable,
					formType  : (typeForm) ? typeForm : 0,
					formSize  : sizeForm
				}
				
				//add form to its parent module
				vlForm[module.getName()][nameForm] = formInfo
				
				//add to table view also
				
				
				//this is a form without a table
				if (!formInfo.serverName && !formInfo.tableName) {
					//add form
					if (nonRef) {
						formsByTable['No datasource'][formInfo.formName] = globals.CODE_copy_object(formInfo)
					}
					//only used in developer
					else {
						formsByTable['No datasource'][formInfo.formName] = formInfo
					}
				}
				//form with a table
				else {
					//add server if not encountered before
					if (!formsByTable[formInfo.serverName]) {
						formsByTable[formInfo.serverName] = new Object()
					}
					
					//add table if not encountered before
					if (!formsByTable[formInfo.serverName][formInfo.tableName]) {
						formsByTable[formInfo.serverName][formInfo.tableName] = new Object()
						
						//punch in pk info
						var jsTable = databaseManager.getTable(formInfo.serverName,formInfo.tableName)
						
						//possible to have db server offline for solutions
						if (jsTable) {
							var pkCols = jsTable.getRowIdentifierColumnNames()
							//MEMO: does not account for multiple primary keys on a table
							formsByTable[formInfo.serverName][formInfo.tableName].primaryKey = pkCols[0]
						}
					}
					
					//add form
					if (nonRef) {
						formsByTable[formInfo.serverName][formInfo.tableName][formInfo.formName] = globals.CODE_copy_object(formInfo)
					}
					//only used in developer
					else {
						formsByTable[formInfo.serverName][formInfo.tableName][formInfo.formName] = formInfo
					}
				}
			}
			
		}
		
		//if this 'module' has relations, proceed
		if (theRelations.length) {
//			//create container if not already existing
//			if (!vlForm[module.getName()]) {
//				vlForm[module.getName()] = new Object()
//			}
			
			//fill it
			for (var j = 0; j < theRelations.length; j++) {
				var thisRelation = theRelations[j]
				var nameRelation = thisRelation.getName().substr(0,thisRelation.getName().length - 4)
				
				var aboutRelation = plugins.file.readTXTFile(thisRelation)
				aboutRelation = aboutRelation.split(',\n')
				
				var relnUUID = null
				var priServer = null
				var priTable = null
				var foreignServer = null
				var foreignTable = null
				var createRelatedRecords = null
				var deleteRelatedRecords = null
				var allowParentDelete = null
				var joinTypes = null
//				var existsInDB = null
//				var duplicateRelatedRecords = null
				var sortOptions = null
				
				for (var k = 0; k < aboutRelation.length; k++) {
					if (utils.stringPosition(aboutRelation[k], 'uuid:"', 0, 1) == 1) {
						var relnUUID = aboutRelation[k].substring(6,aboutRelation[k].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'primaryServerName:"', 0, 1) == 1) {
						var priServer = aboutRelation[k].substring(19,aboutRelation[k].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'primaryTableName:"', 0, 1) == 1) {
						var priTable = aboutRelation[k].substring(18,aboutRelation[k].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'foreignServerName:"', 0, 1) == 1) {
						var foreignServer = aboutRelation[k].substring(19,aboutRelation[k].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'foreignTableName:"', 0, 1) == 1) {
						var foreignTable = aboutRelation[k].substring(18,aboutRelation[k].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'allowCreationRelatedRecords:', 0, 1) == 1) {
						var createRelatedRecords = (aboutRelation[k].substring(28,aboutRelation[k].length) == 'true') ? true : false 
					}
					else if (utils.stringPosition(aboutRelation[k], 'deleteRelatedRecords:', 0, 1) == 1) {
						var deleteRelatedRecords = (aboutRelation[k].substring(21,aboutRelation[k].length) == 'true') ? true : false 
					}
					else if (utils.stringPosition(aboutRelation[k], 'allowParentDeleteWhenHavingRelatedRecords:', 0, 1) == 1) {
						var allowParentDelete = (aboutRelation[k].substring(42,aboutRelation[k].length) == 'true') ? true : false 
					}
					else if (utils.stringPosition(aboutRelation[k], 'joinType:', 0, 1) == 1) {
						var joinTypes = aboutRelation[k].substring(9,aboutRelation[k].length)
					}
					else if (utils.stringPosition(aboutRelation[k], 'initialSort:"', 0, 1) == 1) {
						var sortOptions = aboutRelation[k].substring(13,aboutRelation[k].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'foreignDataSource:', 0, 1) == 1) {
						var sections = aboutRelation[k].split('/')
						
						var foreignServer = sections[1]
						var foreignTable = sections[2].substring(0,sections[2].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'primaryDataSource:', 0, 1) == 1) {
						var sections = aboutRelation[k].split('/')
						
						var priServer = sections[1]
						var priTable = sections[2].substring(0,sections[2].length - 1)
					}					
				}
				
				//check to be sure that relation has a name
				if (nameRelation != null) {
					
					//add server if not encountered before
					if (!vlReln[priServer]) {
						vlReln[priServer] = new Object()
					}
					
					//add table if not encountered before
					if (!vlReln[priServer][priTable]) {
						vlReln[priServer][priTable] = new Object()
					}
					
					//add relation
					var relationInfo = 
					vlReln[priServer][priTable][nameRelation] = 
					{
						moduleName : module.getName(),
						relation   : nameRelation,
						elementID  : relnUUID,
						source     : {
								server	: priServer,
								table	: priTable
							},
						destination: {
								server	: foreignServer,
								table	: foreignTable
							},
						options    : {
								createRelated : (createRelatedRecords) ? true : false,
								deleteRelated : (deleteRelatedRecords) ? true : false,
								parentDelete  : (allowParentDelete || allowParentDelete == null) ? true : false
							},
						joinType   : (joinTypes) ? 'left outer join' : 'inner join',
//						indexesInDB: (existsInDB) ? true : false,
						misc       : {
								sort             : (sortOptions) ? sortOptions : null //,
//								duplicateRelated : (duplicateRelatedRecords) ? true : false
							}
					}
				}	
			}
		}
	}
	
	//save it
		if (application.__parent__.solutionPrefs && solutionPrefs.repository && solutionPrefs.repository.workspace && 
			((/*nonRef &&*/ solutionPrefs.clientInfo.typeServoy == 'developer') ? true : false)
			) {
		solutionPrefs.repository.workspace = vlForm
		solutionPrefs.repository.relations = vlReln
		solutionPrefs.repository.allFormsByTable = formsByTable
	}
	
//	//set module value list
//	var modulesDistinct = new Array()
//	for (var i in solutionPrefs.repository.workspace) {
//		modulesDistinct.push(i)
//	}
//	modulesDistinct.sort()
//	
//	application.setValueListItems('NAV_modules_included', modulesDistinct)
}

/**
 *
 * @properties={typeid:24,uuid:"de7a768b-3390-49df-a841-7e0f875ea419"}
 */
function CODE_workspace_module()
{

/*
 *	TITLE    :	CODE_workspace_module
 *			  	
 *	MODULE   :	rsrc_CODE_serclipse
 *			  	
 *	ABOUT    :	read in modules included
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CODE_workspace_module()
 *			  	
 *	MODIFIED :	November 18, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

//if, by some chance, this method is run outside of the wrapper, instantiate my global baby
if (! application.__parent__.repositoryPrefs) {
	repositoryPrefs = {
			allModules: new Array(),
			allForms: new Object(),
			allFormsByTable: new Object(),
			relations: new Object()
	}
}

//the workspace
var workspace = plugins.sutra.getWorkspace().substr(5)

//what solution is open/passed in
var soln = arguments[0] || [application.getSolutionName()]

//return if nothing passed
if (!soln.length) {
	return
}

//if multiple modules, loop and process each input
outerloop:
for (var i = 0 ; i < soln.length; i++) {
	
	//loop through currently added modules, break out of recursion if this module already added
	for (var j = 0 ; j < repositoryPrefs.allModules.length; j++) {
		if (soln[i] == repositoryPrefs.allModules[j]) {
			continue outerloop
		}
	}
	
	//store parent module
	repositoryPrefs.allModules.push(soln[i])
	
	//get list of included modules
	var settingsObj = workspace + soln[i] + '/' + 'solution_settings.obj'
	
	//check if this 'solution' even has settings
	var jsFile = plugins.file.convertToJSFile(settingsObj)
	if (jsFile.exists()) {
		var solnSettings = plugins.file.readTXTFile(settingsObj)
		solnSettings = solnSettings.split('\n')
		
		var modules = null
		
		for (var k = 0; k < solnSettings.length; k++) {
			if (utils.stringPosition(solnSettings[k], 'modulesNames:"', 0, 1) == 1) {
				var modules = solnSettings[k].substring(14,solnSettings[k].length - 2)
				break
			}
		}
		
		//there are included modules, split and pass back to array
		if (modules) {
			modules = modules.split(',')
			
			//pass back modules to processoranator
			globals.CODE_workspace_module(modules)
		}
	}
}

//break out unless top-level instance
if (soln[0] != application.getSolutionName()) {
	return
}

//sort array, remove duplicates
if (repositoryPrefs.allModules.length) {
	var modules = repositoryPrefs.allModules
	modules.sort()
	
	repositoryPrefs.allModules = new Array()
	for (var i = 0 ; i < modules.length ; i++) {
		if (modules[i] != modules[i+1]) {
			repositoryPrefs.allModules.push(modules[i])
		}
	}

	//store module names into valuelist
	application.setValueListItems('NAV_modules_included', repositoryPrefs.allModules)

}
}

/**
 *
 * @properties={typeid:24,uuid:"c1c626b7-62aa-4d7f-8536-346ae9dd5fd0"}
 */
function TAB_btn_actions_list()
{

/*
 *	TITLE    :	TAB_actions_list
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	uses ACTIONS_list() from the currently selected tab
 *			  	
 *	INPUT    :	ALL inputs are optional
 *			  	1)	form name with tab panel
 *			  	2)	tab panel name
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	January 5, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
var tabPanelName = (arguments[1]) ? arguments[1] : 'tab_detail'

//if there is a tabpanel on the selected form
if (forms[formName] && forms[formName].elements[tabPanelName]) {
	var tabFormName = forms[formName].elements[tabPanelName].getTabFormNameAt(forms[formName].elements[tabPanelName].tabIndex)
	
	//if there is a form in this tab position and it has an ACTIONS_list method on it
	if (forms[tabFormName] && forms[tabFormName].ACTIONS_list) {
		var elem = forms[formName].elements[application.getMethodTriggerElementName()]
		
		//pass the actions_list sub method the element that called it
		forms[tabFormName].ACTIONS_list(elem)
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"d7d0db6e-a736-4395-a0e3-da757d161a37"}
 */
function TAB_btn_rec_new()
{

/*
 *	TITLE    :	TAB_actions_list
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	uses ACTIONS_list() from the currently selected tab
 *			  	
 *	INPUT    :	ALL inputs are optional
 *			  	1)	form name with tab panel
 *			  	2)	tab panel name
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	October 6, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
var tabPanelName = (arguments[1]) ? arguments[1] : 'tab_detail'

//if there is a tabpanel on the selected form
if (forms[formName] && forms[formName].elements[tabPanelName]) {
	var tabFormName = forms[formName].elements[tabPanelName].getTabFormNameAt(forms[formName].elements[tabPanelName].tabIndex)
	
	//if there is a form in this tab position and it has an ACTIONS_list method on it
	if (forms[tabFormName] && forms[tabFormName].REC_new) {
		//call the new record method
		forms[tabFormName].REC_new()
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"1d11e845-6036-42a2-8367-5c8d524edad3"}
 */
function TAB_change_grid()
{

/*
 *	TITLE    :	TAB_change_grid
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	change tabIndex and all associated labels
 *			  		- finds the colors of a selected/unselected tab and then goes to work
 *			  		- if tab controller label has text, but no tooltip, set tooltip with value of text
 *			  	
 *	INPUT    :	ALL inputs are optional
 *			  	1)	form name with tab panel
 *			  	2)	tab to be activated eg. 'tab_d1'
 *			  	3)	name of tab panel
 *			  	4)	prefix on all tab labels
 *			  	5)	btn_add name
 *			  	6)	btn_actions name
 *			  	7)	btn_help name
 *			  	8)	btn_divider name
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	tab panel named 'tab_detail', labels named 'tab_d'+[1,2,...n]
 *			  	
 *	MODIFIED :	August 5, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
var buttonName = (arguments[1]) ? arguments[1] : application.getMethodTriggerElementName()
var tabPanelName = (arguments[2]) ? arguments[2] : 'tab_detail'
var prefix = (arguments[3]) ? arguments[3] : 'tab_d'
var btnAdd = (arguments[4]) ? arguments[4] : 'btn_add'
var btnActions = (arguments[5]) ? arguments[5] : 'btn_actions'
var btnHelp = (arguments[6]) ? arguments[6] : 'btn_help'
var lblDivider = (arguments[7]) ? arguments[7] : 'lbl_' + tabPanelName + '_divider'

//make sure that element clicked is actually a custom tab controller
if (!utils.stringPatternCount(buttonName,prefix)) {
	return
}

//get number of tabs
var tabTotal = forms[formName].elements[tabPanelName].getMaxTabIndex()

//this tab panel doesn't have any tabs, try to still work
if (!tabTotal) {
	return
}

//get current tab
var currentTab = forms[formName].elements[tabPanelName].tabIndex

//get foreground/background color
var foreSelect = forms[formName].elements[prefix + currentTab].fgcolor
var backSelect = forms[formName].elements[prefix + currentTab].bgcolor
//if not tab 1, get from itself and previous
if (currentTab > 1) {
	var foreUnselect = forms[formName].elements[prefix + (currentTab - 1)].fgcolor
	var backUnselect = forms[formName].elements[prefix + (currentTab - 1)].bgcolor
}
//if not last tab, get from itself and next
else if (currentTab < tabTotal) {
	var foreUnselect = forms[formName].elements[prefix + (currentTab + 1)].fgcolor
	var backUnselect = forms[formName].elements[prefix + (currentTab + 1)].bgcolor
}
//only one tab, do not need unselected values
else if (currentTab == tabTotal && currentTab == 1) {
	var foreUnselect = forms[formName].elements[prefix + currentTab].fgcolor
	var backUnselect = forms[formName].elements[prefix + currentTab].bgcolor
}
//break out of method, something is not set up correctly
else {
	return
}

//get font string (font,normal/bold/italic/bolditalic,size)
if (application.__parent__.solutionPrefs) {
	//on a mac
	if (solutionPrefs.clientInfo.typeOS == 'Mac OS X') {
		var fontSelect = 'Verdana,1,10'
		var fontUnselect = 'Verdana,0,10'
	}
	//on windows, linux, etc.
	else {
		var fontSelect = 'Tahoma,1,11'
		var fontUnselect = 'Tahoma,0,11'	
	}
}
//use mac settings when not running in the shell //TODO: change to windows settings when deployed
else {
	var fontSelect = 'Verdana,1,10'
	var fontUnselect = 'Verdana,0,10'
}

//activate correct tab and flip tab buttons
for ( var i = 1 ; i <= tabTotal ; i++ ) {	
	var tabName = prefix + i
	if (buttonName == tabName) {
		forms[formName].elements[tabName].fgcolor = foreSelect
		forms[formName].elements[tabName].bgcolor = backSelect
		forms[formName].elements[tabName].setFont(fontSelect)
		
		//set tab index
		forms[formName].elements[tabPanelName].tabIndex = i
		
		//set tooltip text if element can take a tooltip, tooltip is not already set, and tab has text
		if (typeof forms[formName].elements[tabName].toolTipText != undefined && 
			!forms[formName].elements[tabName].toolTipText && 
			typeof forms[formName].elements[tabName].text != undefined && 
			forms[formName].elements[tabName].text) {
			
			forms[formName].elements[tabName].toolTipText = forms[formName].elements[tabName].text
		}
		
		//show/hide + button
		var tabFormName = forms[formName].elements[tabPanelName].getTabFormNameAt(i)
		if (forms[tabFormName]) {
			var showAdd = (forms[tabFormName].REC_new) ? true : false
			var showActions = (forms[tabFormName].ACTIONS_list) ? true : false
			var showDivider = showAdd && showActions
			var showHelp = false
			if (application.__parent__.solutionPrefs && solutionPrefs.i18n && solutionPrefs.config.language && solutionPrefs.i18n[solutionPrefs.config.language][tabFormName]) {
				showHelp = true
				
				//get the bloody tooltip
				for (var k in solutionPrefs.i18n[solutionPrefs.config.language][tabFormName]) {
					//only get the first help tip
					if (!helpTip) {
						var helpTip = solutionPrefs.i18n[solutionPrefs.config.language][tabFormName][k].toolTip
					}
				}	
			}
			
			if (forms[formName].elements[btnAdd]) {
				forms[formName].elements[btnAdd].visible = showAdd
			}
			if (forms[formName].elements[btnActions]) {
				forms[formName].elements[btnActions].visible = showActions
			}
			if (forms[formName].elements[btnHelp]) {
				forms[formName].elements[btnHelp].visible = showHelp
				
				//showHelp enabled and element can take a tooltip, set tooltip text
				if (showHelp && typeof forms[formName].elements[btnHelp].toolTipText != undefined) {
					forms[formName].elements[btnHelp].toolTipText = helpTip
				}
			}
			if (forms[formName].elements[lblDivider]) {
				forms[formName].elements[lblDivider].visible = showDivider
			}
		}
		
		/*	//TODO: what to do if there is a title header?
		//put line on tab panel if tab's form is in solution and type is table
		var tabFormName = forms[formName].elements[tabPanelName].getTabFormNameAt(i)
		if (forms[tabFormName] && forms[tabFormName].controller.view == 3) {
			forms[formName].elements[tabPanelName].setBorder('MatteBorder,1,0,0,0,#808080')
		}
		//set default border type
		else {
			forms[formName].elements[tabPanelName].setBorder('EmptyBorder,0,0,0,0')
		}
		*/
	}
	else {
		forms[formName].elements[tabName].fgcolor = foreUnselect
		forms[formName].elements[tabName].bgcolor = backUnselect
		forms[formName].elements[tabName].setFont(fontUnselect)
		
		//set tooltip text if element can take a tooltip, tooltip is not already set, and tab has text
		if (typeof forms[formName].elements[tabName].toolTipText != undefined && 
			!forms[formName].elements[tabName].toolTipText && 
			typeof forms[formName].elements[tabName].text != undefined && 
			forms[formName].elements[tabName].text) {
			
			forms[formName].elements[tabName].toolTipText = forms[formName].elements[tabName].text
		}
		
	}				
}



}

/**
 *
 * @properties={typeid:24,uuid:"54fc4dcd-e1b8-441b-8fac-a32764a63b54"}
 */
function TAB_change_grid_init()
{

/*
 *	TITLE    :	TAB_change_grid_init
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	change tabIndex and all associated labels
 *			  		-finds the colors of a selected/unselected tab and then goes to work
 *			  	
 *	INPUT    :	ALL inputs are optional
 *			  	1)	form name with tab panel
 *			  	2)	tab to be activated eg. 'tab_d1'
 *			  	3)	name of tab panel
 *			  	4)	prefix on all tab labels
 *			  	5)	btn_add name
 *			  	6)	btn_actions name
 *			  	7)	btn_help name
 *			  	8)	btn_divider name
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	October 6, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
var tabPanelName = (arguments[2]) ? arguments[2] : 'tab_detail'
var prefix = (arguments[3]) ? arguments[3] : 'tab_d'
var buttonName = (arguments[1]) ? arguments[1] : prefix + '1'
var btnAdd = (arguments[4]) ? arguments[4] : 'btn_add'
var btnActions = (arguments[5]) ? arguments[5] : 'btn_actions'
var btnHelp = (arguments[6]) ? arguments[6] : 'btn_help'
var lblDivider = (arguments[7]) ? arguments[7] : 'lbl_' + tabPanelName + '_divider'

if (forms[formName] && forms[formName].elements[tabPanelName]) {
	globals.TAB_change_grid(formName,buttonName,tabPanelName,prefix,btnAdd,btnActions,btnHelp,lblDivider)
}
}

/**
 *
 * @properties={typeid:24,uuid:"15b31c9f-f3b0-4efb-ba8f-4f3163c962b2"}
 */
function TAB_change_inline()
{

/*
 *	TITLE    :	TAB_change_inline
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	change tabIndex and all associated labels
 *			  		-finds the colors of a selected/unselected tab and then goes to work
 *			  	activates action buttons for log and detail tab panels 
 *			  	
 *	INPUT    :	ALL inputs are optional
 *			  	1)	form name with tab panel
 *			  	2)	tab to be activated eg. 'tab_d1'
 *			  	3)	name of tab panel
 *			  	4)	prefix on all tab labels
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	tab panel named 'tab_detail', labels named 'tab_d'+[1,2,...n]
 *			  	
 *	MODIFIED :	Dec 6, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
var buttonName = (arguments[1]) ? arguments[1] : application.getMethodTriggerElementName()
var tabPanelName = (arguments[2]) ? arguments[2] : 'tab_detail'
var prefix = (arguments[3]) ? arguments[3] : 'tab_d'

//get number of tabs
var tabTotal = forms[formName].elements[tabPanelName].getMaxTabIndex()

//get current tab
var currentTab = forms[formName].elements[tabPanelName].tabIndex

//get foreground/background color
var foreSelect = forms[formName].elements[prefix + currentTab].fgcolor
var backSelect = forms[formName].elements[prefix + currentTab].bgcolor
//if not tab 1, get from itself and previous
if (currentTab > 1) {
	var foreUnselect = forms[formName].elements[prefix + (currentTab - 1)].fgcolor
	var backUnselect = forms[formName].elements[prefix + (currentTab - 1)].bgcolor
}
//if not last tab, get from itself and next
else if (currentTab < tabTotal) {
	var foreUnselect = forms[formName].elements[prefix + (currentTab + 1)].fgcolor
	var backUnselect = forms[formName].elements[prefix + (currentTab + 1)].bgcolor
}
//only one tab, do not need unselected values
else if (currentTab == tabTotal && currentTab == 1) {
	var foreUnselect = forms[formName].elements[prefix + currentTab].fgcolor
	var backUnselect = forms[formName].elements[prefix + currentTab].bgcolor
}
//break out of method, something is not set up correctly
else {
	return
}

//get font string (font,normal/bold/italic/bolditalic,size)
if (application.__parent__.solutionPrefs) {
	//on a mac
	if (solutionPrefs.clientInfo.typeOS == 'Mac OS X') {
		var fontSelect = 'Verdana,1,10'
		var fontUnselect = 'Verdana,0,10'
	}
	//on windows, linux, etc.
	else {
		var fontSelect = 'Tahoma,1,11'
		var fontUnselect = 'Tahoma,0,11'	
	}
}
//use mac settings when not running in the shell //TODO: change to windows settings when deployed
else {
	var fontSelect = 'Verdana,1,10'
	var fontUnselect = 'Verdana,0,10'
}



//activate correct tab and flip tab buttons
for ( var i = 1 ; i <= tabTotal ; i++ ) {	
	var tabName = prefix + i
	if (buttonName == tabName) {
		forms[formName].elements[tabName].fgcolor = foreSelect
		forms[formName].elements[tabName].bgcolor = backSelect
		forms[formName].elements[tabName].setFont(fontSelect)
		
		//set tab index
		forms[formName].elements[tabPanelName].tabIndex = i
		
		/*	//TODO: what to do if there is a title header?
		//put line on tab panel if tab's form is in solution and type is table
		var tabFormName = forms[formName].elements[tabPanelName].getTabFormNameAt(i)
		if (forms[tabFormName] && forms[tabFormName].controller.view == 3) {
			forms[formName].elements[tabPanelName].setBorder('MatteBorder,1,0,0,0,#808080')
		}
		//set default border type
		else {
			forms[formName].elements[tabPanelName].setBorder('EmptyBorder,0,0,0,0')
		}
		*/
	}
	else {
		forms[formName].elements[tabName].fgcolor = foreUnselect
		forms[formName].elements[tabName].bgcolor = backUnselect
		forms[formName].elements[tabName].setFont(fontUnselect)
	}				
}



}

/**
 * @properties={typeid:24,uuid:"8EC7C55E-6B55-43D5-9693-897E32EA0884"}
 */
function CALLBACK_sidebar_set(newToolbar, showSidebar) {

/*
 *	TITLE    :	CALLBACK_sidebar_set
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	jumps between navigation items
 *			  	
 *	INPUT    :	1- sidebar name to jump to
 *			  		Valid inputs are the tab names as defined in the Sidebar setup configuration
 *			  	
 *	OUTPUT   :	true if toolbar changed, false if no change (toolbar already visible or input was not valid)
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CALLBACK_toolbar_set(toolbar) Navigates to the specified toolbar if it is available for the logged in user
 *			  	
 *	MODIFIED :	August 19, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs defined and frameworks not in a locked status
if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {

	var baseForm = solutionPrefs.config.formNameBase

	//only run when not in a preference
	if (!solutionPrefs.config.prefs.preferenceMode) {
		//offset will probably be different depending on help status
		var oldToolbar = solutionPrefs.panel.sidebar[forms.DATASUTRA__sidebar.elements.tab_content.tabIndex - 2].tabName

		var allToolbars = solutionPrefs.panel.sidebar

		//check to make sure that newToolbar is a valid input
		var found = false
		for (var i = 0; i < allToolbars.length; i++) {
			if (allToolbars[i].tabName == newToolbar) {
				found = true
				break
			}
		}

		//destination toolbar is valid and different than current toolbar, change
		if (newToolbar != oldToolbar && found) {
			//should this by i or i+1?
			forms.DATASUTRA__sidebar__header.TAB_popdown(i + 1)

			if (showSidebar && !solutionPrefs.screenAttrib.sidebar.status) {
				globals.DS_sidebar_toggle(true)
			}

			return true
		}
		else {

			if (showSidebar && !solutionPrefs.screenAttrib.sidebar.status) {
				globals.DS_sidebar_toggle(true)
			}

			return false
		}
	}
}

}

/**
 *
 * @properties={typeid:24,uuid:"ea705c5e-0455-46df-a703-4f445937273c"}
 */
function _1()
{

forms.CODE_P__konsole.initialize()

var	nHeight = cmdVarBin.windowSize.height
var	nWidth = cmdVarBin.windowSize.width

application.showFormInDialog(forms.CODE_P__konsole, 20, 50, nWidth, nHeight + 20, 'Servoy Konsole',  true,  false, 'KONSOLE', false)


}
