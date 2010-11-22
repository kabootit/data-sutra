/**
 *
 * @properties={typeid:24,uuid:"84715f9d-41c5-4c2d-a074-c637e1f2fa64"}
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
	case 114:
		GO_five()
		break
}
}

/**
 *
 * @properties={typeid:24,uuid:"377112cf-f796-46ac-87f1-1fbb34123a5b"}
 */
function GO_five()
{

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


if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase

	//load list window
	//if not loaded, add tab
	var listTab = "AC_0L_organization"
	var prefName = 'Access & control Organizations'
	if (!navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		//assign to list tab panel
		forms[baseForm].elements.tab_content_B.addTab(forms[listTab],'',null,null,null,null)
		forms[baseForm].elements.tab_content_B.tabIndex = forms[baseForm].elements.tab_content_B.getMaxTabIndex()
		
		//save status info
		navigationPrefs.byNavSetName.configPanes.itemsByName[prefName] = {
									listData : {
										tabNumber : forms[baseForm].elements.tab_content_B.tabIndex,
										dateAdded : application.getServerTimeStamp()
									}
							}
	}
	//set tab to this preference
	else {
		forms[baseForm].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData.tabNumber
	}
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.AC_0F_organization__saas,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}
}

/**
 *
 * @properties={typeid:24,uuid:"9a8a6ec2-3a1a-4feb-a6b8-fc1bfbc37ed3"}
 */
function GO_four()
{

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


if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.AC_0F_solution__workflow,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}
}

/**
 *
 * @properties={typeid:24,uuid:"2ece98de-eb81-4a37-9308-35de70291fa9"}
 */
function GO_one()
{

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


if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase

	//load blank list window
	forms[baseForm].elements.tab_content_B.tabIndex = 1
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.AC_0F_solution__prefs,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}

}

/**
 *
 * @properties={typeid:24,uuid:"c8db8d00-9a43-4163-8f42-debed6632892"}
 */
function GO_three()
{

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


if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase

	//load list window
	//if not loaded, add tab
	var listTab = "AC_0L_user"
	var prefName = 'Access & control Users'
	if (!navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		//assign to list tab panel
		forms[baseForm].elements.tab_content_B.addTab(forms[listTab],'',null,null,null,null)
		forms[baseForm].elements.tab_content_B.tabIndex = forms[baseForm].elements.tab_content_B.getMaxTabIndex()
		
		//save status info
		navigationPrefs.byNavSetName.configPanes.itemsByName[prefName] = new Object()
		navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData = {
									tabNumber : forms[baseForm].elements.tab_content_B.tabIndex,
									dateAdded : application.getServerTimeStamp()
							}
	}
	//set tab to this preference
	else {
		forms[baseForm].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData.tabNumber
	}
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.AC_0F_user,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}
}

/**
 *
 * @properties={typeid:24,uuid:"73c74217-4d4b-4b15-87d4-988d4ef82409"}
 */
function GO_two()
{


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


if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase

	//load list window
	//if not loaded, add tab
	var listTab = "AC_0L_group"
	var prefName = 'Access & control Groups'
	if (!navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		//assign to list tab panel
		forms[baseForm].elements.tab_content_B.addTab(forms[listTab],'',null,null,null,null)
		forms[baseForm].elements.tab_content_B.tabIndex = forms[baseForm].elements.tab_content_B.getMaxTabIndex()
		
		//save status info
		navigationPrefs.byNavSetName.configPanes.itemsByName[prefName] = {
									listData : {
										tabNumber : forms[baseForm].elements.tab_content_B.tabIndex,
										dateAdded : application.getServerTimeStamp()
									}
							}
	}
	//set tab to this preference
	else {
		forms[baseForm].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData.tabNumber
	}
	
	//load main window
	if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
		forms[baseForm].elements.tab_content_C.removeTabAt(1)
	}
	forms[baseForm].elements.tab_content_C.addTab(forms.AC_0F_group,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}



}

/**
 *
 * @properties={typeid:24,uuid:"b32c6500-72cb-4e23-a462-06a19a372069"}
 */
function GOTO_foundset()
{

/*
 *	TITLE    :	GOTO_foundset
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	loads foundset from one form onto another and jumps to the same record
 *			  	
 *	INPUT    :	1) foundset object to load
 *			  	2) form to load foundset object onto
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GOTO_foundset(foundset, form) Loads foundset onto form preserving selected record
 *			  	
 *	MODIFIED :	Jan 2008 -- Troy Elliott, Data Mosaic
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

var callingFormName = application.getMethodTriggerFormName()
var currentFoundset = arguments[0]
var formName = arguments[1]

var formOne = forms[callingFormName].controller.getServerName() + '—' + forms[callingFormName].controller.getTableName()
var formTwo = forms[formName].controller.getServerName() + '—' + forms[formName].controller.getTableName()

//check that the two forms are based on the same table
if (formOne == formTwo) {
	forms[formName].controller.loadRecords(currentFoundset)
}
}
