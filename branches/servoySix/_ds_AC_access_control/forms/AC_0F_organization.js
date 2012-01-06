/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"98C62983-2F1C-4A0B-93A7-87E4EFB93BCB"}
 */
function FORM_on_load(event) {
	//set up bean
	elements.bean_main.dividerSize = 0
	elements.bean_main.dividerLocation = 200
	elements.bean_main.resizeWeight = 1
	elements.bean_main.topComponent = elements.tab_top
	elements.bean_main.bottomComponent = elements.tab_bottom
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"2D5AC089-23F9-4754-8AE7-45AC29E88A99"}
 */
function FORM_on_show(firstShow, event) {
	var baseForm = solutionPrefs.config.formNameBase
	
	//load list window
	var listTab = "AC_0L_organization"
	var prefName = 'Access & control Organizations'
	if (navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		forms[baseForm].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData.tabNumber
	}
}
