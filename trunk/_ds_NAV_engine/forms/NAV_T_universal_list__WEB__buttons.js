
/**
 * @properties={typeid:24,uuid:"8ECEBBCC-445F-4C70-817F-CFD75A33AAFA"}
 */
function BUTTONS_toggle(currentNavItem) {
	//normal hiding/showing of elements
	_super.BUTTONS_toggle(currentNavItem)
	
	//make sure tabs/display indicator far right if need to be
	
	//tabs and not display
	if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].buttons.tabs && !(navigationPrefs.byNavItemID[currentNavItem].universalList.displays && navigationPrefs.byNavItemID[currentNavItem].universalList.displays.length > 1)) {
		elements.btn_tabs_right.visible = true
		elements.btn_tabs.visible = false
	}
	else {
		elements.btn_tabs_right.visible = false
	}
	
	//attach fancy scrollbars
	scopes.DS.webULPrettify()
}
