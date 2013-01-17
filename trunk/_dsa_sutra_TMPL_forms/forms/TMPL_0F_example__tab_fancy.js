/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"13e059ea-5cff-436b-8c81-25aa1984eb20"}
 */
function TAB_change_fancy(event)
{
	
/*
 *	TITLE    :	TAB_change_fancy
 *			  	
 *	MODULE   :	rsrc_TMPL_template
 *			  	
 *	ABOUT    :	fancy tab panel method
 *			  	
 *	INPUT    :	name of element 'clicked'
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	element labeled ==> tab_example (tab panel), tab_# (graphic), tab_lbl_# (label)
 *			  	
 *	MODIFIED :	Aug 29, 2007 -- Troy Elliott, Data Mosaic
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

//set formname
var formName = application.getMethodTriggerFormName()

//set the tab panel name
var tabPanelName = 'tab_example'

//set prefix for element
var prefix = 'tab_'

//get button that called
if (arguments[0]) {
	var btnClicked = prefix + arguments[0]
}
else {
	var btnClicked = application.getMethodTriggerElementName()
}

//get number of tabs
var tab_num = forms[formName].elements[tabPanelName].getMaxTabIndex()

var orig = btnClicked.split("_")
orig = utils.stringToNumber(orig[1])

var max = 4

var j = ""
var x = ""


//1. process unclicked buttons

for ( var i = 1; i <= max ; i++ ) {

	//figure out what graphic to load
	if ( i == 1 ) {
		switch (orig) {
			case (i) :
				x = 1
				break
			case (i + 1) :
				x = 2
				break
			default :
				x = 3
				break
		}
		j = 1
	}
	
	else if ( (i > 1) && (i < max) ) {
		switch (orig) {
			case (i) :
				x = 1
				break
			case (i - 1) :
				x = 2
				break
			case (i + 1) :
				x = 3
				break
			default :
				x = 4
				break
		}
		j = 2
	}
	
	else if ( i = max ) {
		switch (orig) {
			case (i) :
				x = 1
				break
			case (i - 1) :
				x = 2
				break
			default :
				x = 3
				break
		}
		j = 3
	}
	
	//set image URL
	elements["tab_" + i].setImageURL('media:///tab_' + j + '_' + x + '.gif')
	
	//activate correct tab and set label foreground color
	if ( i == orig ) {
		elements["tab_lbl_" + i].fgcolor = '#333333'
		
		//set tab index
		forms[formName].elements[tabPanelName].tabIndex = i;	
	}
	else {
		elements["tab_lbl_" + i].fgcolor = '#ffffff'
	}
}
}
