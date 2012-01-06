/**
 *
 * @properties={typeid:24,uuid:"571502e7-de85-4858-9926-94d650908e4e"}
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
 * @properties={typeid:24,uuid:"74b36983-f75a-4be2-8212-71cc57b3f639"}
 */
function GO_five()
{

/*
 *	TITLE    :	GO_four
 *			  	
 *	MODULE   :	dev_DEV_developer
 *			  	
 *	ABOUT    :	pseudo-record navigator changes position in the preference configuration screens
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 8, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//move highlighter
elements.highlighter.setLocation(0,114)

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
elements.btn_four.setFont(fontUnselect)
elements.btn_five.setFont(fontSelect)

//set color
elements.btn_one.fgcolor = '#000000'
elements.btn_two.fgcolor = '#000000'
elements.btn_three.fgcolor = '#000000'
elements.btn_four.fgcolor = '#000000'
elements.btn_five.fgcolor = '#FFFFFF'

//add/remove tabs in frameworks layout
if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase
	
	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.DEV_0F_solution__checksum,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()

}


}

/**
 *
 * @properties={typeid:24,uuid:"bf198d2b-dcdb-4902-af31-45810a202765"}
 */
function GO_four()
{

/*
 *	TITLE    :	GO_four
 *			  	
 *	MODULE   :	rsrc_DEV_developer
 *			  	
 *	ABOUT    :	pseudo-record navigator changes position in the preference configuration screens
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 8, 2008 -- Troy Elliott, Data Mosaic
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
elements.btn_five.setFont(fontUnselect)

//set color
elements.btn_one.fgcolor = '#000000'
elements.btn_two.fgcolor = '#000000'
elements.btn_three.fgcolor = '#000000'
elements.btn_four.fgcolor = '#FFFFFF'
elements.btn_five.fgcolor = '#000000'

//add/remove tabs in frameworks layout
if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase
	
	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.DEV_0F_solution__ul_upgrade,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()

}


}

/**
 *
 * @properties={typeid:24,uuid:"38de88ec-54b2-4c1f-98ac-f589dc5e6e90"}
 */
function GO_one()
{

/*
 *	TITLE    :	GO_one
 *			  	
 *	MODULE   :	rsrc_DEV_developer
 *			  	
 *	ABOUT    :	pseudo-record navigator changes position in the preference configuration screens
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 8, 2008 -- Troy Elliott, Data Mosaic
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
elements.btn_five.setFont(fontUnselect)

//set color
elements.btn_one.fgcolor = '#FFFFFF'
elements.btn_two.fgcolor = '#000000'
elements.btn_three.fgcolor = '#000000'
elements.btn_four.fgcolor = '#000000'
elements.btn_five.fgcolor = '#000000'

//add/remove tabs in frameworks layout
if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.DEV_0F_solution__report,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()

}


}

/**
 *
 * @properties={typeid:24,uuid:"d937bd33-89e9-4b13-a0f3-fe46bc719e71"}
 */
function GO_three()
{

/*
 *	TITLE    :	GO_three
 *			  	
 *	MODULE   :	rsrc_DEV_developer
 *			  	
 *	ABOUT    :	pseudo-record navigator changes position in the preference configuration screens
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 8, 2008 -- Troy Elliott, Data Mosaic
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
elements.btn_five.setFont(fontUnselect)

//set color
elements.btn_one.fgcolor = '#000000'
elements.btn_two.fgcolor = '#000000'
elements.btn_three.fgcolor = '#FFFFFF'
elements.btn_four.fgcolor = '#000000'
elements.btn_five.fgcolor = '#000000'

//add/remove tabs in frameworks layout
if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.DATASUTRA_0F_solution__blank_1,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()

}


}

/**
 *
 * @properties={typeid:24,uuid:"b7f1ed69-357e-4dfa-ab8f-ff4edd0cb545"}
 */
function GO_two()
{

/*
 *	TITLE    :	GO_two
 *			  	
 *	MODULE   :	rsrc_DEV_developer
 *			  	
 *	ABOUT    :	pseudo-record navigator changes position in the preference configuration screens
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	July 8, 2008 -- Troy Elliott, Data Mosaic
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
elements.btn_five.setFont(fontUnselect)

//set color
elements.btn_one.fgcolor = '#000000'
elements.btn_two.fgcolor = '#FFFFFF'
elements.btn_three.fgcolor = '#000000'
elements.btn_four.fgcolor = '#000000'
elements.btn_five.fgcolor = '#000000'

//add/remove tabs in frameworks layout
if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.DEV_0F_feedback,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()

}


}
