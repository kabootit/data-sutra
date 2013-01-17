/**
 *
 * @properties={typeid:24,uuid:"1481dc8a-3431-497e-8c3d-729c69c5d565"}
 */
function TAB_change_shapes()
{

/*
 *	TITLE    :	TAB_change_shapes
 *			  	
 *	MODULE   :	rsrc_TMPL_template
 *			  	
 *	ABOUT    :	drawn tabs tab panel method
 *			  	
 *	INPUT    :	name of element 'clicked'
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	element labeled ==> tab_example2 (tab panel), tab_m (tab), label_# (label)
 *			  	
 *	MODIFIED :	Aug 29, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */


//set formname
var formName = application.getMethodTriggerFormName();

//set the tab panel name
var tabPanelName = 'tab_example2';

//get button that called
var btn_name = application.getMethodTriggerElementName();

//set prefix for element
var prefix = 'tab_m';

//get number of tabs
var tab_num = forms[formName].elements[tabPanelName].getMaxTabIndex();

//layer control
forms[formName].elements.border.visible = false

//activate correct tab and flip tab buttons
for ( var i = 1 ; i <= tab_num ; i++ )
{	
	var tab_name = prefix + i;
	var tab_index = 'label_' + i;
	
	if (btn_name == tab_name)
	{
		forms[formName].elements[tab_index].bgcolor = '#727b8c';
		forms[formName].elements[tab_index].fgcolor = '#727b8c';
		forms[formName].elements[tab_name].setFont('Verdana,1,10');
		forms[formName].elements[tab_name].fgcolor = '#212121';
				
		//set tab index
		forms[formName].elements[tabPanelName].tabIndex = i;	
	}
	else
	{
		forms[formName].elements[tab_index].bgcolor = '#323a4b';
		forms[formName].elements[tab_index].fgcolor = '#323a4b';
		forms[formName].elements[tab_name].setFont('Verdana,1,10');
		forms[formName].elements[tab_name].fgcolor = '#ffffff';
	}				
}

//z-axis control
forms[formName].elements.border.visible = true
}
