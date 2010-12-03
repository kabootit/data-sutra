/**
 *
 * @properties={typeid:24,uuid:"7cd19fa4-9c86-48fe-8728-2d2c90a17408"}
 */
function FORM_on_show()
{


//return to place where highlighter is
switch (elements.highlighter.getLocationY()) {
	case 16:
		GO_one()
		break
	case 39:
		GO_two()
		break
	case 64:
		GO_three()
		break
	case 89:
		GO_four()
		break
}
}

/**
 *
 * @properties={typeid:24,uuid:"3290dafd-0e08-4b1e-b0d7-bcf8fec9590a"}
 */
function GO_four()
{

/*
 *	TITLE    :	GO_reports
 *			  	
 *	MODULE   :	ds_PREF_preferences
 *			  	
 *	ABOUT    :	pseudo-record navigator changes position in the preference configuration screens
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//move highlighter
elements.highlighter.setLocation(0,89)

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

//set font
elements.btn_one.setFont(fontUnselect)
elements.btn_two.setFont(fontUnselect)
elements.btn_three.setFont(fontUnselect)
elements.btn_four.setFont(fontSelect)

//set color
elements.btn_one.fgcolor = '#000000'
elements.btn_two.fgcolor = '#000000'
elements.btn_three.fgcolor = '#000000'
elements.btn_four.fgcolor = '#FFFFFF'

//add/remove tabs in frameworks layout
if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.PREF_0F_solution__license,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}


}

/**
 *
 * @properties={typeid:24,uuid:"2ffe17d1-e0f4-4e13-b552-57dd596f72f8"}
 */
function GO_one()
{

/*
 *	TITLE    :	GO_preferences
 *			  	
 *	MODULE   :	ds_PREF_preferences
 *			  	
 *	ABOUT    :	pseudo-record navigator changes position in the preference configuration screens
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//move highlighter
elements.highlighter.setLocation(0,16)

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

//set font
elements.btn_one.setFont(fontSelect)
elements.btn_two.setFont(fontUnselect)
elements.btn_three.setFont(fontUnselect)
elements.btn_four.setFont(fontUnselect)

//set color
elements.btn_one.fgcolor = '#FFFFFF'
elements.btn_two.fgcolor = '#000000'
elements.btn_three.fgcolor = '#000000'
elements.btn_four.fgcolor = '#000000'

//add/remove tabs in frameworks layout
if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.PREF_0F_solution__branding,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}


}

/**
 *
 * @properties={typeid:24,uuid:"fe046c4a-9134-490c-a70e-9be94c3e8a71"}
 */
function GO_three()
{

/*
 *	TITLE    :	GO_spaces
 *			  	
 *	MODULE   :	ds_PREF_preferences
 *			  	
 *	ABOUT    :	pseudo-record navigator changes position in the preference configuration screens
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//move highlighter
elements.highlighter.setLocation(0,64)

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

//set font
elements.btn_one.setFont(fontUnselect)
elements.btn_two.setFont(fontUnselect)
elements.btn_three.setFont(fontSelect)
elements.btn_four.setFont(fontUnselect)

//set color
elements.btn_one.fgcolor = '#000000'
elements.btn_two.fgcolor = '#000000'
elements.btn_three.fgcolor = '#FFFFFF'
elements.btn_four.fgcolor = '#000000'

//add/remove tabs in frameworks layout
if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.PREF_0F_solution__spaces,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}


}

/**
 *
 * @properties={typeid:24,uuid:"76fe83f8-cbfa-4508-b736-97ce7d570f8b"}
 */
function GO_two()
{

/*
 *	TITLE    :	GO_license
 *			  	
 *	MODULE   :	ds_PREF_preferences
 *			  	
 *	ABOUT    :	pseudo-record navigator changes position in the preference configuration screens
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//move highlighter
elements.highlighter.setLocation(0,39)

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

//set font
elements.btn_one.setFont(fontUnselect)
elements.btn_two.setFont(fontSelect)
elements.btn_three.setFont(fontUnselect)
elements.btn_four.setFont(fontUnselect)

//set color
elements.btn_one.fgcolor = '#000000'
elements.btn_two.fgcolor = '#FFFFFF'
elements.btn_three.fgcolor = '#000000'
elements.btn_four.fgcolor = '#000000'

//add/remove tabs in frameworks layout
if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.PREF_0F_solution__preferences,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}


}
