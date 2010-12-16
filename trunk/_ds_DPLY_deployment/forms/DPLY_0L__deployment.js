/**
 *
 * @properties={typeid:24,uuid:"067ee6eb-3fe2-47cc-96d0-f1bbb3d145d2"}
 */
function FORM_on_load()
{

}

/**
 *
 * @properties={typeid:24,uuid:"d8be63c2-2b4e-4e3b-9a1e-3822efb8b58e"}
 */
function FORM_on_show(firstShow)
{
	if (firstShow && !currentcontroller.getName() == 'DATASUTRA__error') {
		//Go to static object
		GO_two()
	}
	else {
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
			case 114:
				GO_five()
				break
		}
	}
}

/**
 *
 * @properties={typeid:24,uuid:"d7f73b63-d08b-4d3a-885e-9c253571494a"}
 */
function GO_four()
{

/*
 *	TITLE    :	GO_reports
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
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
if (application.__parent__.solutionPrefs && solutionPrefs.clientInfo) {
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
if (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.formNameBase) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.DPLY_0F_solution__license,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}
//error mode
else {
	forms.DATASUTRA__error.elements.tab_main.tabIndex = 5
}


}

/**
 *
 * @properties={typeid:24,uuid:"3b8f9b5f-7c0d-4277-8baf-21d4de5f6683"}
 */
function GO_five()
{

/*
 *	TITLE    :	GO_reports
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
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
elements.highlighter.setLocation(0,114)

//get font string (font,normal/bold/italic/bolditalic,size)
if (application.__parent__.solutionPrefs && solutionPrefs.clientInfo) {
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
if (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.formNameBase) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.MGR_0F_graphics,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}
//error mode
else {
	forms.DATASUTRA__error.elements.tab_main.tabIndex = 4
}


}

/**
 *
 * @properties={typeid:24,uuid:"33aff1a1-8d5f-4a8a-ab35-a41682068d51"}
 */
function GO_one()
{

/*
 *	TITLE    :	GO_preferences
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
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
if (application.__parent__.solutionPrefs && solutionPrefs.clientInfo) {
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
if (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.formNameBase) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.DPLY_0F_error,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}
//error mode
else {
	forms.DATASUTRA__error.elements.tab_main.tabIndex = 1
}

}

/**
 *
 * @properties={typeid:24,uuid:"265793b8-4e3a-4fe2-9266-0ccaee323fbf"}
 */
function GO_three()
{

/*
 *	TITLE    :	GO_spaces
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
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
if (application.__parent__.solutionPrefs && solutionPrefs.clientInfo) {
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
if (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.formNameBase) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.DPLY_0F_solution__import_export,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}
//error mode
else {
	forms.DATASUTRA__error.elements.tab_main.tabIndex = 3
}



}

/**
 *
 * @properties={typeid:24,uuid:"bca358b9-27a9-4355-8e42-b9624219fdf9"}
 */
function GO_two()
{

/*
 *	TITLE    :	GO_license
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
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
if (application.__parent__.solutionPrefs && solutionPrefs.clientInfo) {
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
if (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.formNameBase) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.DPLY_0F_solution__static_object,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}
//error mode
else {
	forms.DATASUTRA__error.elements.tab_main.tabIndex = 2
}


}
