/**
 *
 * @properties={typeid:24,uuid:"066444e8-7ae7-4df5-9d0d-ae3e06ddcec3"}
 */
function ACTIONS_list()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	ACTIONS_list_control()
 *			  	
 *	MODIFIED :	November 6, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//actions to perform
var valueList = [
		'Toggle expand/collapse status'/*,
		'Configure favorites'*/
	]

//build menu
var menu = new Array()
for ( var i = 0 ; i < valueList.length ; i++ ) {
	//set check mark if in favorites mode
	if (this.faveMode && i == 1) {
		menu[i] = plugins.popupmenu.createCheckboxMenuItem(valueList[i] + "", ACTIONS_list_control)
		menu[i].setSelected(true)
	}
	else {
		menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_control)
	}
	
	//pass arguments
	menu[i].setMethodArguments(valueList[i])
	
	//disable dividers
	if (valueList[i] == '-') {
		menu[i].setEnabled(false)
	}
}

//pop down the popup menu
var elem = elements[application.getMethodTriggerElementName()]
if (elem != null) {
	plugins.popupmenu.showPopupMenu(elem, menu)
}


}

/**
 *
 * @properties={typeid:24,uuid:"11620fff-9c49-4e72-91b6-cea7a8d7d3e5"}
 */
function ACTIONS_list_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	0: Toggle tree status
 *			  	1: Enter favorites mode
 *			  	
 *	INPUT    :	position in array of action item
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	November 6, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch (arguments[0]) {
	case 'Toggle expand/collapse status':	//toggle tree
		LIST_toggle_all()
		break

	case 'Configure favorites':			//enter favorites mode
		MODE_favorites()
		break
}
}

/**
 *
 * @properties={typeid:24,uuid:"cf3177fb-b22d-43df-89f0-b69a8fe45634"}
 */
function DEBUG_popup()
{

/*
 *	TITLE    :	DEBUG_popup
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	DEBUG_popup()
 *			  	
 *	MODIFIED :	July 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.CODE_text = globals.NAV_list
forms.CODE_P__konsole.elements.lbl_header.text = 'Nav Item HTML global 1'
globals.CODE_form_in_dialog(forms.CODE_P__konsole,0,750,1000,300,' ',true,false,'my debugger',false)

}

/**
 *
 * @properties={typeid:24,uuid:"adbea88d-b63a-4844-98e6-6fb6e52427e0"}
 */
function DEBUG_toggle()
{

/*
 *	TITLE    :	DEBUG_toggle
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	show/hide primary/secondary html field
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	DEBUG_toggle()
 *			  	
 *	MODIFIED :	July 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

elements.fld_html.visible = !elements.fld_html.visible
elements.fld_html_2.visible = !elements.fld_html.visible

//set tooltip text
if (elements.fld_html.visible) {
	elements.btn_display.toolTipText = 'Hide top HTML field'
}
else {
	elements.btn_display.toolTipText = 'Show top HTML field'
}
}

/**
 *
 * @properties={typeid:24,uuid:"096951b0-d9f8-4d81-92a3-d3c1925819f9"}
 */
function FAVE_toggle()
{

/*
 *	TITLE    :	FAVE_toggle
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	stores flag in navigationPrefs...navigationItem.favorite
 *			  	
 *	INPUT    :	navItemID
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FAVE_toggle
 *			  	
 *	MODIFIED :	November 6, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: when children items, flag them all as favorites

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

var navItemID = arguments[0]

if (navItemID && navigationPrefs.byNavItemID[navItemID]) {
	//status of favorite on current nav item
	var status = navigationPrefs.byNavItemID[navItemID].navigationItem.favorite
	status = (typeof status == 'boolean') ? status : false
	
	//go to new nav item if not the same as currently selected one
	var reload = (navItemID != solutionPrefs.config.currentFormID) ? false : true
	
	//set the status for this item
	navigationPrefs.byNavItemID[navItemID].navigationItem.favorite = !status
	
	//this item has children
	if (false && navigationPrefs.byNavItemID[navItemID].navigationItem.nodeOne && 
		!navigationPrefs.byNavItemID[navItemID].navigationItem.nodeTwo &&
		navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1] && 
		(navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1].navigationItem.nodeOne == details.nodeOne)
		) {
		//set status on all children
	}
	
	//redraw list
	LIST_redraw(navItemID,true,reload)
}
else {
	plugins.dialogs.showErrorDialog(
						'Error',
						'Invalid ID'
				)
}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"f29557d0-c78c-4c68-9ccc-60d71dcfce8e"}
 */
function FORM_on_show(firstShow, event)
{
	
/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	only fires the first time this form is shown
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	July 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

if (arguments[0] && application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
	var navItemID = navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].lastNavItem
	
	//assign new html to list globals
	LIST_generate((navItemID) ? navItemID : null)
	globals.NAV_list_2 = globals.NAV_list
	
	//hide second global
	elements.fld_html_2.visible = false
	
	//form variable
	this.listStatus = new Object()
	this.listStatus.scrollX = elements.fld_html.getScrollX()
	this.listStatus.scrollY = elements.fld_html.getScrollY()
	
	//update label
	var displayValue = application.getValueListDisplayValue('NAV_navigation_set',globals.DATASUTRA_navigation_set)
	elements.lbl_header.text = (displayValue) ? displayValue.toUpperCase() : 'NAVIGATION'
	
	//go to selected form; notify load forms routine that this is the first one loaded
	globals.NAV_workflow_load(
						(navItemID) ? navItemID : navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[0].navigationItem.idNavigationItem,
						null,
						null,
						true
					)
	
	//move focus gained trigger off of the screen
	elements.fld_constant.setLocation(5121,0) //one pixel larger than a dual 30" cinema rig can display :)
}
}

/**
 *
 * @properties={typeid:24,uuid:"3d4361a1-c0b1-4b37-bfff-b202c892a925"}
 */
function LIST_expand_collapse()
{

/*
 *	TITLE    :	LIST_expand_collapse
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	toggles expanded status of current navigation item
 *			  	
 *	INPUT    :	1- id_navigation_item
 *			  	2- open/close force
 *			  	3- id_navigation
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	LIST_expand_collapse()
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

var idNavItem = arguments[0]
var forceToggle = arguments[1]
var idNavSet = (arguments[2]) ? arguments[2] : globals.DATASUTRA_navigation_set

if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
	
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
			LIST_redraw(idNavItem,true)
		}
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"ec0da837-19b5-4340-b021-9b7f600d6853"}
 */
function LIST_generate()
{

/*
 *	TITLE    :	LIST_generate
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	generates the html navigation item field
 *			  	
 *	INPUT    :	1) navigation item id to select (optional)
 *			  	
 *	OUTPUT   :	html string
 *			  	
 *	REQUIRES :	globals.NAV_universal_list_header_generate()
 *			  	
 *	USAGE    :	LIST_generate(selectedIndex) Returns a clickable html field 'list view' of navigation item records with the selectedIndex highlighted
 *			  	
 *	MODIFIED :	July 21, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
	
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
	
	//get things to display
	var navigationSet = new Array()
	
	//configure faves?
	var faveConfigure = this.faveMode
	
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
		}
	}
	
	//if navigation items, build it; otherwise clear it
	if (navigationSet.length) {
		//which one to select		
		var selected = (arguments[0]) ? arguments[0] : navigationSet[0].navItemID
		
		//header info
		var html = '<html><head>' +
			'<style type="text/css" media="screen"><!--\n' +
			'table { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }\n' +
			'td  { text-indent: 2px; white-space: nowrap; overflow: hidden; border: 0px; padding: 1px; height: 20; line-height: 20; }\n' +
			'.rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }\n' +
			'.rowIndent  { padding: 0px 0px 0px 10px; }\n' +
			'.rowSelectedIndent  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); padding: 0px 0px 0px 10px; }\n' +
			'\n' +
			'.rowFill  { width: 10px; }\n' +
			'.rowSelectedFill  { background-image: url("media:///row_selected.png"); width: 10px; }\n' +
			'.expanded  { background-image: url("media:///row_expanded.png"); background-repeat: no-repeat; width: 10px; }\n' +
			'.expandedSelected  { background-image: url("media:///row_expanded_selected.png"); background-repeat: no-repeat; width: 10px; }\n' +
			'.collapsed  { background-image: url("media:///row_collapsed.png"); background-repeat: no-repeat; width: 10px; }\n' +
			'.collapsedSelected  { background-image: url("media:///row_collapsed_selected.png"); background-repeat: no-repeat; width: 10px; }\n' +
			'\n' +
			'a { color: black; text-decoration: none; }\n' +
			'td.expanded a { text-decoration: none; }\n' +
			'td.expandedSelected a { text-decoration: none; }\n' +
			'td.collapsed a { text-decoration: none; }\n' +
			'td.collapsedSelected a { text-decoration: none; }\n' +
			'\n' +
			'--></style></head>'
		
		//begin
		html += '<body><table>'
				
		//loop through range of records and build html list
		for ( var i = 0 ; i < navigationSet.length ; i++ ) {
			//nav item that has all data
			var details = navigationSet[i]
			
			var rowDisplay = details.navItemName
			
			//replace < with html compatible version
			rowDisplay = utils.stringReplace(rowDisplay, '<', '&lt;')
			
			//output html row
			html += '<tr>' //put a \n before it somehow
			
			//row selected, highlight
			if (details.navItemID == selected) {
				//TRIANGLE
				//parent expanded
				if (details.expanded && !details.nodeTwo && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1] && (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1].navigationItem.nodeOne == details.nodeOne)) {
					html += '<td class = "expandedSelected"><a href="javascript:LIST_expand_collapse(' + details.navItemID + ')"><img height="12" width="11" border="0" src="media:///spacer.gif"></a></td>'
				}
				//parent collapsed (not expanded with children)
				else if (!details.nodeTwo && !details.expanded && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1] && (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1].navigationItem.nodeOne == details.nodeOne)) {
					html += '<td class = "collapsedSelected"><a href="javascript:LIST_expand_collapse(' + details.navItemID + ')"><img height="12" width="11" border="0" src="media:///spacer.gif"></a></td>'
				}
				//child or parent with no children
				else {
					html += '<td class = "rowSelectedFill"><img height="12" width="11" border="0" src="media:///spacer.gif"></td>'
				}
				
				//FAVORITES mode
				if (faveConfigure) {
					if (details.fave) {
						if (solutionPrefs.clientInfo.typeOS == 'Mac OS X' && solutionPrefs.clientInfo.typeLAF == 'Mac OS X') {
							html += '<td class = "rowSelectedFill"><a href="javascript:FAVE_toggle(' + details.navItemID + ')"><img border="0" src="media:///ballot_mac_select_check.png"></a></td>'
						}
						else {
							html += '<td class = "rowSelectedFill"><a href="javascript:FAVE_toggle(' + details.navItemID + ')"><img border="0" src="media:///ballot_generic_check.png"></a></td>'
						}
					}
					else {
						if (solutionPrefs.clientInfo.typeOS == 'Mac OS X' && solutionPrefs.clientInfo.typeLAF == 'Mac OS X') {
							html += '<td class = "rowSelectedFill"><a href="javascript:FAVE_toggle(' + details.navItemID + ')"><img border="0" src="media:///ballot_mac_select_blank.png"></a></td>'
						}
						else {
							html += '<td class = "rowSelectedFill"><a href="javascript:FAVE_toggle(' + details.navItemID + ')"><img border="0" src="media:///ballot_generic_blank.png"></a></td>'
						}
					}
				}
				
				//DATA
				if (details.nodeTwo) {
					html += '<td class="rowSelectedIndent">'+rowDisplay+'</td>'
				}
				else {
					html += '<td class="rowSelected">'+rowDisplay+'</td>'
				}
				
				//extra column makes sure that background row image covers entire possible row
				//html += '<td class="selected"></td>'
			}
			//non-selected row
			else {
				//TRIANGLE
				//parent expanded
				if (details.expanded && !details.nodeTwo && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1] && (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1].navigationItem.nodeOne == details.nodeOne)) {
					html += '<td class = "expanded"><a href="javascript:LIST_expand_collapse(' + details.navItemID + ')"><img height="12" width="11" border="0" src="media:///spacer.gif"></a></td>'
				}
				//parent collapsed (not expanded with children)
				else if (!details.nodeTwo && !details.expanded && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1] && (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[details.arrayPosn+1].navigationItem.nodeOne == details.nodeOne)) {
					html += '<td class = "collapsed"><a href="javascript:LIST_expand_collapse(' + details.navItemID + ')"><img height="12" width="11" border="0" src="media:///spacer.gif"></a></td>'
				}
				//child or parent with no children
				else {
					html += '<td class = "rowFill"><a href="javascript:LIST_redraw(' + details.navItemID + ',true)"><img height="12" width="11" border="0" src="media:///spacer.gif"></a></td>'
				}
				
				//FAVORITES mode
				if (faveConfigure) {
					if (details.fave) {
						if (solutionPrefs.clientInfo.typeOS == 'Mac OS X' && solutionPrefs.clientInfo.typeLAF == 'Mac OS X') {
							html += '<td class = "rowFill"><a href="javascript:FAVE_toggle(' + details.navItemID + ')"><img border="0" src="media:///ballot_mac_unselect_check.png"></a></td>'
						}
						else {
							html += '<td class = "rowFill"><a href="javascript:FAVE_toggle(' + details.navItemID + ')"><img border="0" src="media:///ballot_generic_check.png"></a></td>'
						}
					}
					else {
						if (solutionPrefs.clientInfo.typeOS == 'Mac OS X' && solutionPrefs.clientInfo.typeLAF == 'Mac OS X') {
							html += '<td class = "rowFill"><a href="javascript:FAVE_toggle(' + details.navItemID + ')"><img border="0" src="media:///ballot_mac_unselect_blank.png"></a></td>'
						}
						else {
							html += '<td class = "rowFill"><a href="javascript:FAVE_toggle(' + details.navItemID + ')"><img border="0" src="media:///ballot_generic_blank.png"></a></td>'
						}
					}
				}
				
				//DATA
				if (details.nodeTwo) {
					html += '<td class="rowIndent"><a href="javascript:LIST_redraw(' + details.navItemID + ',true)">'+rowDisplay+'<img height="12" width="400" border="0" src="media:///spacer.gif"></a></td>'
				}
				else {
					html += '<td><a href="javascript:LIST_redraw(' + details.navItemID + ',true)">'+rowDisplay+'<img height="12" width="400" border="0" src="media:///spacer.gif"></a></td>'
				}
				//html += '<a href="javascript:REC_row_selected(' + i + ',' + startRec + ',null,true)">'+rowDisplayFormat[m].rowDisplay+'</a></td>'
				
				//extra column makes sure that background row image covers entire possible row
				//html += '<td></td>'
			}
			html +=	'</tr>'
		}
		
		//wrap up
		html += '</table></body></html>'
		
		globals.NAV_list = html
		
		//return selected
	}
	//no records, so clear list
	else {
		globals.NAV_list = globals.NAV_list_2 = null
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"833264cf-0dc9-43da-830e-9fc6a1875873"}
 */
function LIST_redraw()
{

/*
 *	TITLE    :	LIST_redraw
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	redraws
 *			  	
 *	INPUT    :	1- navigation Item ID to select
 *			  	2- rescroll
 *			  	2- skip the loading of forms
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs navigationPrefs
 *			  	
 *	USAGE    :	LIST_redraw()
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

var itemID = arguments[0]
var reScroll = arguments[1]
var skipLoadForms = arguments[2]

if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {

	//get current scroll position
	var scrollX = elements.fld_html.getScrollX()
	var scrollY = elements.fld_html.getScrollY()
	
	//bring second html field to foreground to mask flicker
	elements.fld_html_2.setScroll(0, scrollY)
	elements.fld_html_2.visible = true
	
	//hide original html field while being changed
	elements.fld_html.visible = false
	
	//assign new html to list global
	LIST_generate(itemID)
	
	//if rescroll requested, rescroll
	if (reScroll) {
		LIST_rescroll('NAV_0L_solution','fld_html',itemID)
	}
	
	//save current status of list to formName
	this.listStatus.scrollX = elements.fld_html.getScrollX()
	this.listStatus.scrollY = elements.fld_html.getScrollY()
	
	//LIST_redraw_continued method sets scrollbar and makes element visible
	elements.fld_constant.requestFocus(true)
	
	//go to selected form
	if (!skipLoadForms) {
		globals.NAV_workflow_load(itemID)
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"f06867b3-dae6-45a2-b5e4-e2abb2d89d22"}
 */
function LIST_redraw_continued()
{

/*
 *	TITLE    :	LIST_redraw_continued
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	continues redraw
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs navigationPrefs
 *			  	
 *	USAGE    :	LIST_redraw()
 *			  	
 *	MODIFIED :	July 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {
	var scrollX = (this.listStatus.scrollX) ? this.listStatus.scrollX : 0
	var scrollY = (this.listStatus.scrollY) ? this.listStatus.scrollY : 0
		
	//return to original scroll position
	elements.fld_html.setScroll(0, scrollY)
	
	//show/hide correct html field
	elements.fld_html.visible = true
	elements.fld_html_2.visible = false
	
	//refresh screen so redraw is faster
	application.updateUI()
	
	//prefill second global for next time
	globals.NAV_list_2 = globals.NAV_list
}



}

/**
 *
 * @properties={typeid:24,uuid:"37b653d1-2b6a-4667-8cdd-a2f00b0150c5"}
 */
function LIST_rescroll()
{

/*
 *	TITLE    :	LIST_rescroll
 *			  	
 *	ABOUT    :	adjusts scroll position of an html field so that the selected 'record' is visible
 *			  	
 *			  	most of solution refers to universal list by selectedIndex scoped to the foundset;
 *			  	this method scopes 'selectedIndex' within the currently displayed subset
 *			  	
 *	INPUT    :	1) form name of element being set
 *			  	2) element name to scroll
 *			  	3) navItemID
 *			  	
 *	OUTPUT   :	true if scrolled, false if nothing scrolled
 *			  	
 *	REQUIRES :	solutionPrefs, the scoped element to exist in the solution
 *			  	
 *	MODIFIED :	July 18, 2008 -- Troy Elliott, Data Mosaic
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

//arguments
var formName = arguments[0]
var elem = arguments[1]
var idNavItem = arguments[2]

//if navigation items in this set, do the appropriate toggle
if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set] && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder && navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length) {
	//find position in array
	var selected = -1
	var indexStart = 1
	var indexEnd = 0
	
	for (var i = 0; i < navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length; i++) {
		//this item is visible
		if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.rowStatusShow) {
			//this is the selected
			if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.idNavigationItem == idNavItem) {
				selected = indexEnd
			}
			indexEnd++
		}
	}
}

//information about scroll field
var heightHTML = forms[formName].elements[elem].getHeight()
var rowHeight = 20 //this is set in the css for the html field...may be overridden in top level style sheet
var clickSize = Math.floor(heightHTML / 10) //the amount of one downward click in the scroll bar
var rowScroll = heightHTML / rowHeight //Math.floor() gives the number of rows that can be displayed without scrolling
var maxScroll = (rowHeight * (indexEnd - indexStart + 1)) - heightHTML
var currentScroll = forms[formName].elements[elem].getScrollY()
var currentTop = (currentScroll) ? Math.ceil(currentScroll / rowHeight) + 1 : 1 //index of record at top of scroll (add 1 to account for parital records)
var currentBottom = currentTop + Math.floor(rowScroll) - 1 //subtract 1 to account for partial records, 1 for selected offset (in defintion of selected)

//selected item in loaded set
if (indexStart <= selected && selected <= indexEnd) {
	//scroll up
	if (selected < currentTop) {
		//can fit without scroll
		if (selected <= Math.floor(rowScroll)) {
			forms[formName].elements[elem].setScroll(0,0)
			return true
		}
		//set to be a few down
		else {
			var scrollY = ((selected - 1) * 20) //-1 to get the bottom of the prior record (in other words, the top of the record we want)
			//if there is room, set the scroll position to be slightly above the selected record
			if (Math.floor(rowScroll) > 4) {
				scrollY -= 40
			}
			forms[formName].elements[elem].setScroll(0,scrollY)
			return true
		}
	}
	//scroll down
	else if (selected > currentBottom) {
		//can fit with scroll all the way to the bottom
		if ((indexEnd - Math.floor(rowScroll) < selected) && (selected < indexEnd)) {
			forms[formName].elements[elem].setScroll(0,maxScroll)
			return true
		}
		//set to be a few up
		else {
			var scrollY = ((selected - 1) * 20) //-1 to get the bottom of the prior record (in other words, the top of the record we want)
			//if there is room, set the scroll position to be slightly above the selected record
			if (Math.floor(rowScroll) > 4) {
				scrollY -= 60
			}
			forms[formName].elements[elem].setScroll(0,scrollY)
			return true
		}
	
	}
	//otherwise selected item in viewable area; no action necessary
}

//if no scrolling took place, return false
return false
}

/**
 *
 * @properties={typeid:24,uuid:"2cfb69df-b9a9-42f0-8473-69dcf879032a"}
 */
function LIST_toggle_all()
{

/*
 *	TITLE    :	LIST_toggle_all
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	expands/collapses all (opposite of what currently clicked on item is)
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	LIST_toggle_all()
 *			  	
 *	MODIFIED :	July 21, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
	var idNavItem = solutionPrefs.config.currentFormID
	
	//if navigation items in this set, toggle
	if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length) {
		//find position in array
		var found = -1
		for (var i = 0; i < navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length && !(found >= 0); i++) {
			if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.idNavigationItem == idNavItem) {
				found = i
			}
		}
		
		if (found >= 0) {
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
				var found = -1
				for (var i = navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder.length - 1; i >= 0  && !(found >= 0); i--) {
					if (navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.idNavigationItem == idNavItem) {
						found = i
					}
				}
				
				//find parent
				var escape = false
				for (var i = found; i >= 0  && !escape; i--) {
					if (!navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.nodeTwo) {
						LIST_redraw(navigationPrefs.byNavSetID[globals.DATASUTRA_navigation_set].itemsByOrder[i].navigationItem.idNavigationItem,true)
						escape = true
					}
				}
			}
			//expanded, so stay on parent
			else {
				LIST_redraw(idNavItem,true)
			}
		}
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"e9f89a6e-8423-44dc-af91-a30e3a496a5b"}
 */
function MODE_favorites()
{

/*
 *	TITLE    :	MODE_favorites
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	enter favorites config mode
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MODE_favorites()
 *			  	
 *	MODIFIED :	November 6, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//what is the current status of faves
var enabled = (typeof this.faveMode == 'boolean') ? this.faveMode : false

//set to be opposite of current state
this.faveMode = !enabled

//sync favorites records for current user with changes just made
if (!this.faveMode) {
	
}

//redraw list
LIST_redraw(solutionPrefs.config.currentFormID,true,true)
}
