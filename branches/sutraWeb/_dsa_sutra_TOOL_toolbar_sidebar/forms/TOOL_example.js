/**
 *
 * @properties={typeid:24,uuid:"b1b1900c-2fcb-408d-8b73-58fcf14c42c4"}
 */
function POP_toggle()
{

/*
 *	TITLE    :	POP_toggle
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
 *	USAGE    :	POP_toggle()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (! application.__parent__.dropDown) {
	dropDown = 1
}
else {
	dropDown ++
}

var formName = solutionPrefs.config.formNameBase
var tabName = 'TOOL_example__popdown'
var indent = 40
var statusStartX = forms[formName].elements.tab_toolbar.getLocationX()
var statusWidth = forms[formName].elements.tab_toolbar.getWidth()
var rollSize = 30
var numRolls = 13

//if auto-width/heigh
if (true) {
	var tabWidth = forms[tabName].elements.width.getWidth()
	var tabHeight = forms[tabName].elements.height.getHeight() + 25
	
	indent = (statusWidth-tabWidth)/2
	numRolls = Math.ceil(tabHeight/rollSize)
}

if (dropDown % 2) {
	// Gives us that "glass pane" look
	//forms[formName].controller.enabled = true
	
	forms[formName].elements.sheetz.layeredPane
	forms[formName].elements.sheetz.visible = true
	forms[formName].elements.tab_toolbar_popdown.removeAllTabs()
	forms[formName].elements.tab_toolbar_popdown.addTab(forms[tabName])
	
	//roll down (bottom fixed)
	for (var i = 1; i <= numRolls; i++) {
		forms[formName].elements.sheetz.reshape(statusStartX+indent,-(rollSize*(numRolls-i))+20,tabWidth,tabHeight)
		
		//(statusStartX+indent,(-rollSize*(13-i))+50,statusWidth-(indent*2),390)
		
		//(statusStartX+indent, -25,statusWidth-(indent*2),rollSize*i)
		//(application.getWindowWidth()/4), -25, application.getWindowWidth()/2, 30*i)
		//start x, start y, width, height
		
		application.updateUI()
	}
	
	elements.lbl_tag.text = 'Click to go up!!!'
}
else {
	//roll up (top fixed)
	for (var i = 1; i <= numRolls; i++) {
		forms[formName].elements.sheetz.reshape(statusStartX+indent,+20,tabWidth,tabHeight-(rollSize*i))
		//(statusStartX+indent,+20,statusWidth-(indent*2),390-(rollSize*i))
		application.updateUI()
	}
	
	forms[formName].elements.sheetz.visible = false;
	elements.lbl_tag.text = 'Click to go down!!!'
	//forms[formName].controller.enabled = true;
}
}
