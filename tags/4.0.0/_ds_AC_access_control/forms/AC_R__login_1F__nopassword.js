/**
 *
 * @properties={typeid:24,uuid:"e5bc12ed-81d4-4ed1-a470-a42f9638d1ad"}
 */
function ACTION_continue()
{

/*
 *	TITLE    :	ACTION_continue
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	proceed to normal screen
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	April 7, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var baseForm = solutionPrefs.config.formNameBase
var navigationList = (solutionPrefs.config.webClient) ? 'NAV__navigation_tree__WEB' : 'NAV__navigation_tree'
var navTabPanel = (solutionPrefs.config.webClient) ? forms.DATASUTRA_WEB_0F__list.elements.tab_list : forms[baseForm].elements.tab_content_A

//reset loginDisabled flag so that previews will show misc and qotd areas
delete this.loginDisabled

//there are navigation records
if (application.__parent__.navigationPrefs) {
	var defaultNavSet = navigationPrefs.byNavSetID.defaultSet
	
	//no default selected, choose the first non-config layout
	if (!defaultNavSet) {
		globals.DIALOGS.showErrorDialog(
					'Error',
					'No default navigation set defined\nReport to administrator'
				)
		globals.TRIGGER_feedback_create('No default navigation set')
		
		//how to do this without a loop?
		for (var i in navigationPrefs.byNavSetID) {
			if (!defaultNavSet) {
				defaultNavSet = navigationPrefs.byNavSetID[i][0].navSetID
				break
			}
		}
	}
	
	//loop through all items in navPrefs and put each form in the main screen except for navigation preference items
	if (solutionPrefs.config.prefs.formPreload && !solutionPrefs.config.webClient) {
		
		//we are using the transparent way
		if (solutionPrefs.config.prefs.formPreloadGray) {
			
			//figure out how many nav items we are looking at
			var totalForms = 0
			for (var i in navigationPrefs.byNavItemID) {
				//selected nav item is to be preloaded
				if (navigationPrefs.byNavItemID[i].navigationItem.preloadForm) {
					var formName = navigationPrefs.byNavItemID[i].navigationItem.formToLoad
					
					//form is to be preloaded
					if (formName && forms[formName] && !navigationPrefs.byNavItemID[i].navigationItem.configType) {
						totalForms++
					}
				}
			}
			
			if (totalForms) {
				globals.TRIGGER_progressbar_start(0,'Pre-loading forms.  Please wait...')
				globals.TRIGGER_interface_lock(true,true)
			}
		}
		//non-transparent way
		else {
			globals.TRIGGER_interface_lock(true,true,true,true,'Please wait...Pre-loading')
		}
		
		var formCount = 0
		for (var i in navigationPrefs.byNavItemID) {
			//selected nav item is to be preloaded
			if (navigationPrefs.byNavItemID[i].navigationItem.preloadForm) {
				var formName = navigationPrefs.byNavItemID[i].navigationItem.formToLoad
				
				//main form
				if (formName && forms[formName] && !navigationPrefs.byNavItemID[i].navigationItem.configType) {
					formCount++
					
					//we are using the transparent way
					if (solutionPrefs.config.prefs.formPreloadGray) {
						globals.TRIGGER_progressbar_set((formCount / totalForms) * 100)
					}
					//non-transparent
					else {
						forms[baseForm].elements.gfx_curtain.text = 'Please wait...Pre-loading ' + navigationPrefs.byNavItemID[i]._about_ +'.'
					}
					
					forms[baseForm].elements.tab_content_C.addTab(forms[formName],'')
					forms[baseForm].elements.tab_content_C.tabIndex = forms[baseForm].elements.tab_content_C.getMaxTabIndex()
					
					application.updateUI()
					
					//loop over all elements, find tab panels
					for (var j in forms[formName].elements) {
						
						//this is a tabpanel
						if (forms[formName].elements[j].getElementType && forms[formName].elements[j].getElementType() == 'TABPANEL' && forms[formName].elements[j].getMaxTabIndex()) {
							
							//loop through all tabs, setting each as the active one; return to first tab when completed
							for (var k = 2; k <= forms[formName].elements[j].getMaxTabIndex(); k++) {
								forms[formName].elements[j].tabIndex = k
								application.updateUI()
							}
							
							forms[formName].elements[j].tabIndex = 1
						}
					}
				}
			}
		}
		
		//remove all the tabs just added
		forms[baseForm].elements.tab_content_C.removeAllTabs()
	}
}
else {
	globals.DIALOGS.showErrorDialog(
				'Error',
				'No navigation sets defined\nReport to administrator'
		)
	globals.TRIGGER_feedback_create('No navigation sets')
	return
}

//set check box in navigation pop-down and first navigation set
globals.DATASUTRA_navigation_set = defaultNavSet

//load navigation list in
if (solutionPrefs.config.webClient) {
	
}
else {
	if (navTabPanel.tabIndex > 0) {
		navTabPanel.removeAllTabs()
	}
}

//toolbar and sidebar load
solutionPrefs.panel = globals.DS_panel_load()
globals.DS_toolbar_load()
globals.DS_sidebar_load()

//sidebar default to on
if (solutionPrefs.screenAttrib.sidebar.status) {
	globals.DS_sidebar_toggle(true,null,true)
}

if (solutionPrefs.config.prefs.formPreload && !solutionPrefs.config.webClient) {
	//we are using the transparent way
	if (solutionPrefs.config.prefs.formPreloadGray) {
		globals.TRIGGER_progressbar_stop()
	}
	
	globals.TRIGGER_interface_lock(false)
}

//use solution model based approach for navigation item navigation pane
if (solutionPrefs.config.webClient) {
//	navTabPanel.setLeftForm(forms[navigationList])
	forms.DATASUTRA_WEB_0F__list.FORM_on_show(true)
}
else {
	navTabPanel.addTab(forms[navigationList],'')
}

//turn all disabled elements back on
solutionPrefs.config.helpMode = false
forms[baseForm + '__header'].elements.btn_navset.visible = true
forms[baseForm + '__header'].elements.btn_space_1.visible = true
forms[baseForm + '__header'].elements.btn_space_2.visible = true
forms[baseForm + '__header'].elements.btn_space_3.visible = true
forms[baseForm + '__header'].elements.btn_space_4.visible = true
forms[baseForm + '__header'].elements.btn_space_5.visible = true
forms[baseForm + '__header'].elements.btn_space_6.visible = true
forms[baseForm + '__header'].elements.btn_space_7.visible = true
forms[baseForm + '__header'].elements.btn_space_8.visible = false
forms[baseForm + '__header'].elements.btn_space_9.visible = false
forms[baseForm + '__header'].elements.btn_space_10.visible = false
forms[baseForm + '__header'].elements.btn_space_11.visible = false
forms[baseForm + '__header'].elements.btn_space_12.visible = false
forms[baseForm + '__header'].elements.btn_space_13.visible = false
forms[baseForm + '__header'].elements.btn_space_14.visible = false
forms[baseForm + '__header'].elements.btn_space_dividers.visible = true
forms[baseForm + '__header__fastfind'].elements.btn_find.visible = true
forms[baseForm + '__header__fastfind'].elements.find_mid.visible = true
forms[baseForm + '__header__fastfind'].elements.find_end.visible = true
forms[baseForm + '__header__fastfind'].elements.fld_find.visible = true
forms[baseForm + '__header'].elements.btn_pref.visible = true
forms[baseForm + '__header'].elements.btn_fw_action.visible = true
forms[baseForm + '__footer'].elements.lbl_status.visible = true

//globals.DS_router('DSHistory')

}
