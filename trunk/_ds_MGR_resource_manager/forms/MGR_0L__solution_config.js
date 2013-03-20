/**
 *
 * @properties={typeid:24,uuid:"0AAD30A7-8CE7-4E64-A5F1-3F2EA6B93AA7"}
 */
function FORM_on_show(){
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
 * @properties={typeid:24,uuid:"1CBBEBE3-A7BA-433A-90DF-A91B2405464E"}
 */
function GO_four(){
	GO_generic('four','')
}

/**
 *
 * @properties={typeid:24,uuid:"09DC390C-34A7-4F33-8EE6-46B23CDD4C38"}
 */
function GO_one() {
	GO_generic('one','MGR_0F_solution__branding')	
}

/**
 *
 * @properties={typeid:24,uuid:"85A57DFF-BC2A-4835-8C12-5FF235A20B9C"}
 */
function GO_three() {
	GO_generic('three','MGR_0F_solution__spaces')

}

/**
 *
 * @properties={typeid:24,uuid:"89FC9E18-8C65-4021-9574-D1D96BFECD31"}
 */
function GO_two() {
	GO_generic('two','MGR_0F_solution__preferences')	
}

/**
 * // TODO generated, please specify type and doc for the params
 * @param {Object} buttonName
 * @param {Object} formName
 * @param {Object} listName
 * @param {Object} listTitle
 *
 * @properties={typeid:24,uuid:"D67C5541-01A8-469C-A356-C0D5EE002364"}
 */
function GO_generic(buttonName,formName,listName,listTitle) {
	var listTabForm = (solutionPrefs.config.webClient) ? forms.DATASUTRA_WEB_0F__list__universal : forms.DATASUTRA_0F_solution
	
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
		var baseForm = solutionPrefs.config.formNameBase
		
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
			
			//update url
			var lastSlot = elements['btn_' + buttonName].text || ''
			scopes.DS.webURLSet(
					navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]._about_,
					globals.DS_router_url(navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].path + '/' + lastSlot),
					null,
					null,
					true
				)
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
