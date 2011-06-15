/**
 * @properties={typeid:35,uuid:"BB7A32A3-EC88-4FE0-A7E3-01827473FA3F",variableType:4}
 */
var _treeStatus = 0;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"EA6140C2-1249-43DD-AD4B-8AC5D8679E8B"}
 */
function ACTION_tree(event) {
	//toggle tree open or closed
	if (_treeStatus) {
		_treeStatus = 0
		var tree = false
		
		var offset = -75
		
		//set toggle graphic
		elements.lbl_tree.setImageURL('media:///row_collapsed_selected.png')
		elements.lbl_tree.toolTipText = 'Expand'
	}
	else {
		_treeStatus = 1
		var tree = true
		
		var offset = 75
		
		//set toggle graphic
		elements.lbl_tree.setImageURL('media:///row_expanded_selected.png')
		elements.lbl_tree.toolTipText = 'Collapse'
	}
	
	//show/hide elements
	elements.btn_oneone.visible = tree
	elements.btn_onetwo.visible = tree
	elements.btn_onethree.visible = tree
	
	//move elements
	elements.btn_two.setLocation(elements.btn_two.getLocationX(), elements.btn_two.getLocationY() + offset)
	elements.btn_three.setLocation(elements.btn_three.getLocationX(), elements.btn_three.getLocationY() + offset)
	elements.btn_four.setLocation(elements.btn_four.getLocationX(), elements.btn_four.getLocationY() + offset)
//	elements.btn_five.setLocation(elements.btn_five.getLocationX(), elements.btn_five.getLocationY() + offset)
	
	//select this item
	GO_one()
}

/**
 *
 * @properties={typeid:24,uuid:"EE34AA10-1C65-45EE-80F5-FDF649B5B6DB"}
 */
function FORM_on_show() {
	//return to place where highlighter is
	
	//tree is showing
	if (_treeStatus) {
		switch (elements.highlighter.getLocationY()) {
			case 0:
				GO_one()
				break
			case 23:
				GO_oneone()
				break
			case 48:
				GO_onetwo()
				break
			case 73:
				GO_onethree()
				break
			case 98:
				GO_two()
				break
			case 123:
				GO_three()
				break
			case 148:
				GO_four()
				break
			case 173:
				GO_five()
				break
		}
	}
	//no tree
	else {
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
			case 98:
				GO_five()
				break
		}
	}
}

/**
 *
 * @properties={typeid:24,uuid:"CD89E508-7362-459A-AC59-0EE87A26EA07"}
 */
function GO_five() {
	GO_generic('five','')
}

/**
 *
 * @properties={typeid:24,uuid:"23697D61-888A-456C-A0A8-F0CF6718F7F7"}
 */
function GO_four() {
	GO_generic('four','')
}

/**
 *
 * @properties={typeid:24,uuid:"1C1715FF-F3AF-4708-B8E3-142861969293"}
 */
function GO_one() {
	GO_generic('one','AC_0F_organization__valuelist','AC_0L_organization','Access & control Organization')
	
	//set graphic to be of selected variety
	
//	//tree is showing
//	if (_treeStatus) {
//		elements.lbl_tree.setImageURL('media:///row_expanded_selected.png')
//		elements.lbl_tree.toolTipText = 'Collapse'
//	}
//	//no tree
//	else {
//		elements.lbl_tree.setImageURL('media:///row_collapsed_selected.png')
//		elements.lbl_tree.toolTipText = 'Expand'
//	}
}

/**
 *
 * @properties={typeid:24,uuid:"6746FD77-2400-4762-AF19-FE9B2DE31516"}
 */
function GO_three() {
	GO_generic('three','')
}

/**
 *
 * @properties={typeid:24,uuid:"C0AD9630-68EE-4D48-80F3-7BAF194800B4"}
 */
function GO_two() {
	GO_generic('two','AC_0F_organization__preferences','AC_0L_organization','Access & control Organization')
}

/**
 *
 * @properties={typeid:24,uuid:"6DEF8D2D-6343-4C05-8202-94A686A371CD"}
 */
function GO_oneone() {
	GO_generic('oneone','')
}

/**
 *
 * @properties={typeid:24,uuid:"67DBDE64-C968-4447-A1B0-2F1D6E816ECE"}
 */
function GO_onetwo() {
	GO_generic('onetwo','')
}

/**
 *
 * @properties={typeid:24,uuid:"516D611D-7F52-4E3D-8908-EC327B44C1F7"}
 */
function GO_onethree() {
	GO_generic('onethree','')
}

/**
 * @properties={typeid:24,uuid:"045645CF-C5B8-48A5-A0F6-C620ACD684D4"}
 */
function GO_generic(buttonName,formName,listName,listTitle) {
	//highlighter map
	var highlightNotree = {
			one : 0,
			two : 23,
			three : 48,
			four : 73,
			five : 98
		}
	//highlighter map
	var highlightTree = {
			one : 0,
			oneone : 23,
			onetwo : 48,
			onethree : 73,
			two : 98,
			three : 123,
			four : 148,
			five : 173
		}
	
	//tree is showing
	if (_treeStatus) {
		//move highlighter
		elements.highlighter.setLocation(0,highlightTree[buttonName])
		
		//set toggle graphic
//		elements.lbl_tree.setImageURL('media:///row_expanded.png')
//		elements.lbl_tree.toolTipText = 'Collapse'
	}
	//no tree
	else {
		//move highlighter
		elements.highlighter.setLocation(0,highlightNotree[buttonName])
		
		//set toggle graphic
//		elements.lbl_tree.setImageURL('media:///row_collapsed.png')
//		elements.lbl_tree.toolTipText = 'Expand'
	}
	
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
				forms[baseForm].elements.tab_content_B.addTab(forms[listName],'')
				forms[baseForm].elements.tab_content_B.tabIndex = forms[baseForm].elements.tab_content_B.getMaxTabIndex()
				
				//save status info
				navigationPrefs.byNavSetName.configPanes.itemsByName[listTitle] = {
											listData : {
												tabNumber : forms[baseForm].elements.tab_content_B.tabIndex,
												dateAdded : application.getServerTimeStamp()
											}
									}
			}
			//set tab to this preference
			else {
				forms[baseForm].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[listTitle].listData.tabNumber
			}
		}
		//blank list window
		else {
			forms[baseForm].elements.tab_content_B.tabIndex = 1
		}
		
		//load main window
		if (forms[baseForm].elements.tab_content_C.tabIndex > 0) {
			forms[baseForm].elements.tab_content_C.removeTabAt(1)
		}
		forms[baseForm].elements.tab_content_C.addTab(forms[formName],'')
		forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
	}
}
