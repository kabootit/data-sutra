/**
 *
 * @properties={typeid:24,uuid:"26e0cc93-9c50-43fa-8cfd-94777a787a75"}
 */
function GO_back()
{

/*
 *	TITLE    :	GO_back
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	go back in history
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GO_back()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */
	
if (application.__parent__.solutionPrefs) {
	
	//do not run method if in viewer setup
	if (solutionPrefs.config.currentFormName != 'MGR_0F_toolbar') {
		var posn = solutionPrefs.config.currentHistoryPosition - 1
		HIX_list_control(posn,solutionPrefs.history[posn].navigationSetID,solutionPrefs.history[posn].navigationItemID)
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"ec31bd2b-22f8-4600-ac8b-7c9a099b1df4"}
 */
function GO_forward()
{
	
/*
 *	TITLE    :	GO_forward
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	go forward in history stack
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GO_forward()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	
	//do not run method if in viewer setup
	if (solutionPrefs.config.currentFormName != 'MGR_0F_toolbar') {
		var posn = solutionPrefs.config.currentHistoryPosition + 1
		HIX_list_control(posn,solutionPrefs.history[posn].navigationSetID,solutionPrefs.history[posn].navigationItemID)
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"cd9f004d-384b-4a3c-971f-ba340b5f8a7b"}
 */
function HIX_list()
{

/*
 *	TITLE    :	HIX_list
 *			  	
 *	MODULE   :	rsrc_TMPL_template
 *			  	
 *	ABOUT    :	shows history stack as popup
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	February 19, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	
	//do not run method if in viewer setup
	if (solutionPrefs.config.currentFormName != 'MGR_0F_toolbar') {
		
		//get menu list from history stack and build menu
		var menu = new Array()
		for (var i = solutionPrefs.history.length - 1; i >= 0 ; i--) {
			//set check mark
			if (i == solutionPrefs.config.currentHistoryPosition) {
				menu.push(plugins.popupmenu.createCheckboxMenuItem(solutionPrefs.history[i].navigationItemName, HIX_list_control))
				menu[menu.length - 1].setSelected(true)
			}
			else {
				menu.push(plugins.popupmenu.createMenuItem(solutionPrefs.history[i].navigationItemName, HIX_list_control))
			}
			
			//set menu method arguments
			menu[menu.length - 1].setMethodArguments(i,solutionPrefs.history[i].navigationSetID,solutionPrefs.history[i].navigationItemID)
			
//			//set tooltip
//			menu[menu.length - 1].setToolTipText('<html><strong>'+solutionPrefs.history[i].navigationItemName+'</strong> from '+solutionPrefs.history[i].navigationSetName+'</html>')
		}
		
		//reset history option
		if (menu.length > 1) {
			menu.push(plugins.popupmenu.createMenuItem('----', null),plugins.popupmenu.createMenuItem('Clear history', HIX_list_control))
			menu[menu.length - 2].setEnabled(false)
			menu[menu.length - 1].setMethodArguments(null,null,null,true)
		}
		
		//push menu down to the bottom of the status viewer area
		var btnInvisible = application.getMethodTriggerElementName() + "_down"
		var currentLocationX = 112  //hard coded to actual location of the element (anchors screw something up)
		var currentLocationY = elements[btnInvisible].getLocationY()
		
		elements[btnInvisible].setLocation(currentLocationX, currentLocationY + 5)
		
		//popup menu
		var elem = elements[btnInvisible]
		if (elem != null) {
		    plugins.popupmenu.showPopupMenu(elem, menu)
		}
		
		//set invisible btn back to original location
		elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"6c505cf8-0c6f-4cb7-98c8-1257bea6bef4"}
 */
function HIX_list_control()
{

/*
 *	TITLE    :	HIX_list_control
 *			  	
 *	MODULE   :	rsrc_TMPL_template
 *			  	
 *	ABOUT    :	navigate to that history item
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Nov 6, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */


var historyPosn = arguments[0]
var navigationID = arguments[1]
var navigationItemID = arguments[2]

var clearHistory = arguments[3]

//navigate to selected record
if (!clearHistory) {
	//choose correct navigation set if different than current one
	if (globals.DATASUTRA_navigation_set != navigationID) {
		globals.DATASUTRA_navigation_set = navigationID
		globals.NAV_loadset(true)
	}
	
	//regenerate navigation list
	forms.NAV_0L_solution.LIST_redraw(navigationItemID,true,true)

	//select correct navigation item
	globals.FX_load_forms(navigationItemID,historyPosn)
	
}
//clear form history
else {
	var currentHixItem = solutionPrefs.history[solutionPrefs.config.currentHistoryPosition]
	
	solutionPrefs.history = new Array(currentHixItem)
	solutionPrefs.config.currentHistoryPosition = 0
	this.labelPosition = 1
}

//update history labels and tooltip
REC_on_select()


}

/**
 *
 * @properties={typeid:24,uuid:"ccd87aeb-91bd-4054-a0b2-2f263bb7d82b"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	updates display to reflect current workflow form showing
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_on_select()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	//sets tooltip text on forward/back buttons and updates label display
	var currentHix = solutionPrefs.config.currentHistoryPosition
	
	if (typeof currentHix == 'number' && !(currentHix < 0)) {
		var toolTip = ''
		
		//back tooltip
		if (currentHix) {
			toolTip = '<html><head></head><body>Go to <strong>'+solutionPrefs.history[currentHix - 1].navigationItemName+'</strong> from '+solutionPrefs.history[currentHix - 1].navigationSetName+'</body></html>'
		}
		elements.btn_back.toolTipText = toolTip
		
		//forward tooltip
		toolTip = ''
		if (currentHix + 1 < solutionPrefs.history.length) {
			toolTip = '<html><head></head><body>Go to <strong>'+solutionPrefs.history[currentHix + 1].navigationItemName+'</strong> from '+solutionPrefs.history[currentHix + 1].navigationSetName+'</body></html>'
		}
		elements.btn_forward.toolTipText = toolTip
		
		//update current display view with information
		TOGGLE_detail(true)
		
		//enable/disable back/forward buttons
		TOGGLE_backforward()
	}
}

}

/**
 *
 * @properties={typeid:24,uuid:"01c5a84c-d5f1-4b40-8247-444aa480777a"}
 */
function TOGGLE_backforward()
{

/*
 *	TITLE    :	TOGGLE_backforward
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	turns on/off the forward/back buttons depending on where in history stack we are
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	TOGGLE_backforward()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	//toggle backward buttons
	if (solutionPrefs.config.currentHistoryPosition == 0) {
		elements.btn_back.enabled = false
	}
	else {
		elements.btn_back.enabled = true
	}
	
	//toggle forward buttons
	if (solutionPrefs.config.currentHistoryPosition == solutionPrefs.history.length - 1) {
		elements.btn_forward.enabled = false
	}
	else {
		elements.btn_forward.enabled = true
	}
}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"c607c44f-d02c-4a78-9fb6-b867753ceccf"}
 */
function TOGGLE_detail(event)
{
	
/*
 *	TITLE    :	TOGGLE_detail
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	TOGGLE_detail(notAdvance)
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

	//if updating values only, do not advance
	var notAdvance = arguments[0]
	
	if (! this.labelPosition) {
		this.labelPosition = 0
		notAdvance = false
	}
	
	var currentHix = solutionPrefs.config.currentHistoryPosition
	
	//advance for next click
	if (!notAdvance) {
		//not last item, advance
		if (this.labelPosition != 3) {
			this.labelPosition ++
		}
		//last item, loop to beginning position
		else {
			this.labelPosition = 1
		}
	}
	
	switch(this.labelPosition) {
				case 1:
					//set currently viewing text
					var label = '<html><body><center>'
					label += 'Currently viewing...<br>'
					label += '<b>' + solutionPrefs.history[currentHix].navigationItemName + '</b> '
					label += 'from ' + solutionPrefs.history[currentHix].navigationSetName
					label += '</center></body></html>'
					elements.lbl_detail.text = label
					
					break
				case 2:
					//set previous viewing text
					var label = '<html><body><center>'
					if (currentHix) {
						label += 'Going backward in the history...<br>'
						label += '<b>' + solutionPrefs.history[currentHix - 1].navigationItemName + '</b> '
						label += 'from ' + solutionPrefs.history[currentHix - 1].navigationSetName
						label += '</center></body></html>'
					}
					else {
						label += 'Beginning of history. No previous items'
						label += '</center></body></html>'
					}
					elements.lbl_detail.text = label
					
					break
				case 3:
					//set next viewing text
					var label = '<html><body><center>'
					if (currentHix + 1 < solutionPrefs.history.length) {
						label += 'Going forward in history...<br>'
						label += '<b>' + solutionPrefs.history[currentHix + 1].navigationItemName + '</b> '
						label += 'from ' + solutionPrefs.history[currentHix + 1].navigationSetName
						label += '</center></body></html>'
					}
					else {
						label += 'End of history. No following items'
						label += '</center></body></html>'
					}
					elements.lbl_detail.text = label
					
					break
	}
}	

}
