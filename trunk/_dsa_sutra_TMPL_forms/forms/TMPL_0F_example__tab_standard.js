/**
 *
 * @properties={typeid:24,uuid:"bb2ecae8-b2e5-4834-9f2d-f98d76ac2140"}
 */
function TAB_change()
{

/*
 *	TITLE    :	TAB_change
 *			  	
 *	MODULE   :	rsrc_TMPL_template
 *			  	
 *	ABOUT    :	standard tab panel method
 *			  	
 *	INPUT    :	name of element 'clicked'
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	element labeled ==> tab_example3 (tab panel), tab_# (graphic), tab_lbl_# (label), tab_toggle (on/off)
 *			  	
 *	MODIFIED :	Aug 29, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get enable/disable status
var enable = (elements.tab_toggle.text == 'Disable tabs') ? true : false

if (!enable) {
	return
}

//set formname
var formName = application.getMethodTriggerFormName();

//set the tab panel name
var tabPanelName = 'tab_example3';

//get button that called
var btn_name = application.getMethodTriggerElementName();

//set prefix for element
var prefix = 'tab_';

//get number of tabs
var tab_num = forms[formName].elements[tabPanelName].getMaxTabIndex();

//activate correct tab and flip tab buttons
for ( var i = 1 ; i <= tab_num ; i++ )
{	
	var tab_name = prefix + i;
	var tab_index = 'tab_lbl_' + i;
	
	if (btn_name == tab_name) {
		forms[formName].elements[tab_index].setFont('Verdana,1,11');
		elements["tab_" + i].setImageURL('media:///tab_light.png')
				
		//set tab index
		forms[formName].elements[tabPanelName].tabIndex = i;	
	}
	else {
		forms[formName].elements[tab_index].setFont('Verdana,0,11');
		elements["tab_" + i].setImageURL('media:///tab_medium.png')
	}				
}

}

/**
 *
 * @properties={typeid:24,uuid:"47a79783-461e-4364-927c-7f1be9f30fe5"}
 */
function TAB_toggle()
{

/*
 *	TITLE    :	TAB_toggle
 *			  	
 *	MODULE   :	rsrc_TMPL_template
 *			  	
 *	ABOUT    :	tab enable/disable toggle for standard tabs
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	element labeled ==> tab_example3 (tab panel), tab_# (tab), tab_lbl_ (label), tab_toggle (on/off control)
 *			  	
 *	MODIFIED :	Aug 29, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */


//set status
var enable = (elements.tab_toggle.text == 'Disable tabs') ? false : true
if (!enable) {
	elements.tab_toggle.text = 'Enable tabs'
} else {
	elements.tab_toggle.text = 'Disable tabs'
}

//set formname
var formName = application.getMethodTriggerFormName()

//set the tab panel name
var tabPanelName = 'tab_example3'

//set prefix for element
var prefix = 'tab_'

//get number of tabs
var tab_num = forms[formName].elements[tabPanelName].getMaxTabIndex()

//activate correct tab and flip tab buttons
var tabIndex = elements.tab_example3.tabIndex
	
for ( var i = 1 ; i <= tab_num ; i++ ) {	
	var tab_name = prefix + i
	var tab_index = 'tab_lbl_' + i
	
	if (enable == true) {
		if (tabIndex == i) {
			forms[formName].elements[tab_index].setFont('Verdana,1,11')
			elements["tab_" + i].setImageURL('media:///tab_light.png')
		}
		else {
			forms[formName].elements[tab_index].setFont('Verdana,0,11')
			elements["tab_" + i].setImageURL('media:///tab_medium.png')
		}
	}
	else {
		forms[formName].elements[tab_index].setFont('Verdana,0,11')
		elements["tab_" + i].setImageURL('media:///tab_dark.png')
	}				
}

}
