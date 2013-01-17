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
function FORM_on_show(firstShow) {
	//return to place where highlighter is
	switch (elements.highlighter.getLocationY()) {
		case 0:
			GO_one()
			break
		case 23:
			GO_two()
			break
		case 48:
			GO_three()
			break
		case 73:
			GO_four()
			break
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
 *	MODULE   :	_ds_NSTL_installation
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
	forms[baseForm].elements.tab_content_C.addTab(forms.NSTL_0F_solution__license,'')
	forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
}
//error mode
else {
//	forms.DATASUTRA__error.elements.tab_nav.tabIndex = 2
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
 *	MODULE   :	_ds_NSTL_installation
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
//	forms.DATASUTRA__error.elements.tab_nav.tabIndex = 2
}


}

/**
 *
 * @properties={typeid:24,uuid:"33aff1a1-8d5f-4a8a-ab35-a41682068d51"}
 */
function GO_one() {
	//add/remove tabs in frameworks layout
	if (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.formNameBase) {
		GO_generic('one','NSTL_0F_solution__license')
	}
	//error mode
	else {
	//	forms.DATASUTRA__error.elements.tab_nav.tabIndex = 2
		forms.DATASUTRA__error.elements.tab_main.tabIndex = 2
	}
}


/**
 * // TODO generated, please specify type and doc for the params
 * @param {Object} buttonName
 * @param {Object} formName
 * @param {Object} listName
 * @param {Object} listTitle
 *
 * @properties={typeid:24,uuid:"32EA48A3-9463-46E6-AFD8-BFBABF75230C"}
 */
function GO_generic(buttonName,formName,listName,listTitle) {
	var listTabForm = (application.__parent__.solutionPrefs && solutionPrefs.config.webClient) ? forms.DATASUTRA_WEB_0F__list__universal : forms.DATASUTRA_0F_solution
	
	//highlighter map
	var highlightNotree = {
			one : 0,
			two : 23,
			three : 48,
			four : 73,
			five : 98
		}
	
	//move highlighter
	elements.highlighter.setLocation(0,highlightNotree[buttonName])
	
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
	
	//set font off
	elements.btn_one.setFont(fontUnselect)
//	elements.btn_oneone.setFont(fontUnselect)
//	elements.btn_onetwo.setFont(fontUnselect)
//	elements.btn_onethree.setFont(fontUnselect)
	elements.btn_two.setFont(fontUnselect)
//	elements.btn_three.setFont(fontUnselect)
//	elements.btn_four.setFont(fontUnselect)
//	elements.btn_five.setFont(fontUnselect)
	
	//set color off
	elements.btn_one.fgcolor = '#000000'
//	elements.btn_oneone.fgcolor = '#000000'
//	elements.btn_onetwo.fgcolor = '#000000'
//	elements.btn_onethree.fgcolor = '#000000'
	elements.btn_two.fgcolor = '#000000'
//	elements.btn_three.fgcolor = '#000000'
//	elements.btn_four.fgcolor = '#000000'
//	elements.btn_five.fgcolor = '#000000'
	
	//turn font and color on for selected item
	elements['btn_' + buttonName].setFont(fontSelect)
	elements['btn_' + buttonName].fgcolor = '#FFFFFF'
	
	//running in frameworks
	if (application.__parent__.solutionPrefs) {
		var baseForm = solutionPrefs.config.formNameBase || 'DATASUTRA_0F_solution'
		
		//load list window
		if (listName) {
			if (!navigationPrefs.byNavSetName.configPanes.itemsByName[listTitle]) {
				//assign to list tab panel
				listTabForm.elements.tab_content_B.addTab(forms[listName],'')
				listTabForm.elements.tab_content_B.tabIndex = listTabForm.elements.tab_content_B.getMaxTabIndex()
				
				//save status info
				navigationPrefs.byNavSetName.configPanes.itemsByName[listTitle] = {
											listData : {
												tabNumber : listTabForm.elements.tab_content_B.tabIndex,
												dateAdded : application.getServerTimeStamp()
											}
									}
			}
			//set tab to this preference
			else {
				listTabForm.elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[listTitle].listData.tabNumber
			}
		}
		//blank list window
		else {
			listTabForm.elements.tab_content_B.tabIndex = 1
		}
		
		//web client
		if (solutionPrefs.config.webClient) {
			//load main window
			forms.DATASUTRA_WEB_0F__workflow.setForm(formName)
		}
		//smart client
		else {
			//load main window
			if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
				forms[baseForm].elements.tab_content_C.removeTabAt(1)
			}
			forms[baseForm].elements.tab_content_C.addTab(forms[formName],'')
			forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
		}
	}
}

/**
 *
 * @properties={typeid:24,uuid:"265793b8-4e3a-4fe2-9266-0ccaee323fbf"}
 */
function GO_three() {
	GO_generic('three','NSTL_0F_solution__applications')
}

/**
 *
 * @properties={typeid:24,uuid:"bca358b9-27a9-4355-8e42-b9624219fdf9"}
 */
function GO_two() {
	//add/remove tabs in frameworks layout
	if (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.formNameBase) {
		GO_generic('two','NSTL_0F_solution__static_object')
	}
	//error mode
	else {
	//	forms.DATASUTRA__error.elements.tab_nav.tabIndex = 2
		forms.DATASUTRA__error.elements.tab_main.tabIndex = 3
	}
}
