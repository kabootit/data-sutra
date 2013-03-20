/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"75A4E59E-EF8E-410F-BC2B-BC290EFD34EE",variableType:4}
 */
var _treeStatus = 1;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"B91DABE1-2B0A-4F5F-9D0D-B7BC5022BD65"}
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
 * @properties={typeid:24,uuid:"84715f9d-41c5-4c2d-a074-c637e1f2fa64"}
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
 * @properties={typeid:24,uuid:"377112cf-f796-46ac-87f1-1fbb34123a5b"}
 */
function GO_five(event,pk) {
	GO_generic('five','AC_0F_organization','AC_0L_organization','Access & control Organizations',pk)
}

/**
 *
 * @properties={typeid:24,uuid:"9a8a6ec2-3a1a-4feb-a6b8-fc1bfbc37ed3"}
 */
function GO_four(event,pk) {
	GO_generic('four','AC_0F_solution__workflow')
}

/**
 *
 * @properties={typeid:24,uuid:"2ece98de-eb81-4a37-9308-35de70291fa9"}
 */
function GO_one(event,pk) {
	GO_generic('one','AC_0F_solution__setup')
	
	//set graphic to be of selected variety
	
	//tree is showing
	if (_treeStatus) {
		elements.lbl_tree.setImageURL('media:///row_expanded_selected.png')
		elements.lbl_tree.toolTipText = 'Collapse'
	}
	//no tree
	else {
		elements.lbl_tree.setImageURL('media:///row_collapsed_selected.png')
		elements.lbl_tree.toolTipText = 'Expand'
	}
}

/**
 *
 * @properties={typeid:24,uuid:"c8db8d00-9a43-4163-8f42-debed6632892"}
 */
function GO_three(event,pk) {
	GO_generic('three','AC_0F_user','AC_0L_user','Access & control Users',pk)
}

/**
 *
 * @properties={typeid:24,uuid:"73c74217-4d4b-4b15-87d4-988d4ef82409"}
 */
function GO_two(event,pk) {
	GO_generic('two','AC_0F_group','AC_0L_group','Access & control Groups',pk)
}

/**
 *
 * @properties={typeid:24,uuid:"8ED2FF08-C75B-4124-9985-E7BCDF81F515"}
 */
function GO_oneone(event,pk) {
	GO_generic('oneone','AC_0F_rules')
}

/**
 *
 * @properties={typeid:24,uuid:"BADF5F73-456A-4093-B564-91A9A5911D4B"}
 */
function GO_onetwo(event,pk) {
	GO_generic('onetwo','AC_0F_filter')
}

/**
 *
 * @properties={typeid:24,uuid:"F8D46015-FE74-4635-8774-5DBACB2F3E89"}
 */
function GO_onethree(event,pk) {
	GO_generic('onethree','AC_0F_organization','AC_0L_organization','Access & control Organization',pk)
}

/**
 * @properties={typeid:24,uuid:"C929C311-19CF-4FD6-912C-34CADB24A87D"}
 * @AllowToRunInFind
 */
function GO_generic(buttonName,formName,listName,listTitle,pk) {
	var listTabForm = (solutionPrefs.config.webClient) ? forms.DATASUTRA_WEB_0F__list__universal : forms.DATASUTRA_0F_solution
	
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
		elements.lbl_tree.setImageURL('media:///row_expanded.png')
		elements.lbl_tree.toolTipText = 'Collapse'
	}
	//no tree
	else {
		//move highlighter
		elements.highlighter.setLocation(0,highlightNotree[buttonName])
		
		//set toggle graphic
		elements.lbl_tree.setImageURL('media:///row_collapsed.png')
		elements.lbl_tree.toolTipText = 'Expand'
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
	elements.btn_oneone.setFont(fontUnselect)
	elements.btn_onetwo.setFont(fontUnselect)
	elements.btn_onethree.setFont(fontUnselect)
	elements.btn_two.setFont(fontUnselect)
	elements.btn_three.setFont(fontUnselect)
	elements.btn_four.setFont(fontUnselect)
//	elements.btn_five.setFont(fontUnselect)
	
	//set color off
	elements.btn_one.fgcolor = '#000000'
	elements.btn_oneone.fgcolor = '#000000'
	elements.btn_onetwo.fgcolor = '#000000'
	elements.btn_onethree.fgcolor = '#000000'
	elements.btn_two.fgcolor = '#000000'
	elements.btn_three.fgcolor = '#000000'
	elements.btn_four.fgcolor = '#000000'
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
			forms.DATASUTRA_WEB_0F__workflow.setForm(formName)
			
			//find correct record
			if (pk) {
				//valid list or workflow
				var fs = forms[listName].foundset ? forms[listName].foundset : forms[formName].foundset
				
				//try just to select requested record
				fs.selectRecord(pk)
				
				//whats the name of the pk
				var jsTable = databaseManager.getTable(forms[listName].foundset.getDataSource())
				if (!jsTable) {
					jsTable = databaseManager.getTable(forms[formName].foundset.getDataSource())
				}
				if (jsTable) {
					var pkName = jsTable.getRowIdentifierColumnNames()[0]
				}
				
				//need to do a find
				if (pkName && fs.getSelectedRecord()[pkName] != pk) {
					fs.find()
					fs[pkName] = pk
					fs.search()
				}
			}
			
			//update url with info for this preference if not already here or if not called downstream (on recSelect of something we're tracking)
			if (!listName) {
				var lastHix = globals.DATASUTRA_router[globals.DATASUTRA_router.length - 1]
				var requestedPath = lastHix.pathString
				requestedPath = requestedPath.split('/')
				var requestPath = ''
				//we do this to discard the pk
				for (var i = 0; i < requestedPath.length && i < 3; i++) {
					requestPath += '/' + requestedPath[i]
				}
				
				var lastSlot = elements['btn_' + buttonName].text || ''
				lastSlot = utils.stringReplace(lastSlot,'/','-')
				var thisPath = globals.DS_router_url(navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].path + '/' + lastSlot)
				
				if (thisPath != requestedPath) {
					scopes.DS.webURLSet(
							navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]._about_,
							globals.DS_router_url(navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].path + '/' + lastSlot,null,null,null,true),
							null,
							null,
							true
						)
				}
			}
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
