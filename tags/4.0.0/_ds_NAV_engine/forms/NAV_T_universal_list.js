/**
 *
 * @properties={typeid:24,uuid:"7A04CD35-4E33-43EA-8D2F-E6AC45FA22D3"}
 */
function BUTTONS_toggle(currentNavItem) {
	//toggle add record button
	if (navigationPrefs.byNavItemID[currentNavItem].buttons.add) {
		elements.btn_add.visible = true
		
		//show custom tooltip
		elements.btn_add.toolTipText = navigationPrefs.byNavItemID[currentNavItem].buttons.add.menuTooltip || 'Create record'
	}
	else {
		elements.btn_add.visible = false
	}
	
	//toggle actions button
	if (navigationPrefs.byNavItemID[currentNavItem].buttons.actions) {
		elements.btn_actions.visible = true
	}
	else {
		elements.btn_actions.visible = false
	}
	
	//toggle filters button
	if (navigationPrefs.byNavItemID[currentNavItem].buttons.filters) {
		elements.btn_filters.visible = true
	}
	else {
		elements.btn_filters.visible = false
	}
	
	//toggle reports button
	if (navigationPrefs.byNavItemID[currentNavItem].buttons.reports) {
		elements.btn_reports.visible = true
	}
	else {
		elements.btn_reports.visible = false
	}
	
	//toggle tabs button
	if (navigationPrefs.byNavItemID[currentNavItem].buttons.tabs) {
		elements.btn_tabs.visible = true
	}
	else {
		elements.btn_tabs.visible = false
	}
	
	//toggle display button
	if (navigationPrefs.byNavItemID[currentNavItem].universalList && navigationPrefs.byNavItemID[currentNavItem].universalList.displays && navigationPrefs.byNavItemID[currentNavItem].universalList.displays.length > 1) {
		elements.btn_display.visible = true
	}
	else {
		elements.btn_display.visible = false
	}
	
	//toggle line between add and actions
	if (navigationPrefs.byNavItemID[currentNavItem].buttons.add && navigationPrefs.byNavItemID[currentNavItem].buttons.actions) {
		elements.divider_add_action.visible = true
	}
	else {
		elements.divider_add_action.visible = false
	}
	
	//toggle line between actions and filters
	if (navigationPrefs.byNavItemID[currentNavItem].buttons.actions && navigationPrefs.byNavItemID[currentNavItem].buttons.filters) {
		elements.divider_action_filter.visible = true
	}
	else {
		elements.divider_action_filter.visible = false
	}
}
