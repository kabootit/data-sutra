/**
 *
 * @properties={typeid:24,uuid:"96c42f64-c640-4f16-b0af-b08eabcf8fa5"}
 */
function EDIT_toggle()
{

/*
 *	TITLE:		TAB_change
 *
 *	MODULE:		CRM_sutra_example
 *
 *	ABOUT:		'Drawn' tabs tab panel method
 *
 *	MODIFIED:	Aug 29, 2007 - Troy Elliott, Data Mosaic
 *
 */


//set formname
var formName = application.getMethodTriggerFormName();

//set the tab panel name
var tabPanelName = 'tab_html';

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
		forms[formName].elements[tab_index].bgcolor = '#A1B0CF';
		forms[formName].elements[tab_index].fgcolor = '#A1B0CF';
		forms[formName].elements[tab_name].setFont('Verdana,1,10');
		forms[formName].elements[tab_name].fgcolor = '#323A4B';
				
		//set tab index
		forms[formName].elements[tabPanelName].tabIndex = i;	
	}
	else
	{
		forms[formName].elements[tab_index].bgcolor = '#323A4B';
		forms[formName].elements[tab_index].fgcolor = '#323A4B';
		forms[formName].elements[tab_name].setFont('Verdana,1,10');
		forms[formName].elements[tab_name].fgcolor = '#ffffff';
	}				
}

//z-axis control
forms[formName].elements.border.visible = true
}
