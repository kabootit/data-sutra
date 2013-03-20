/**
 *
 * @properties={typeid:24,uuid:"C0032B10-9C96-4B42-82F7-4CC4CB26C499"}
 */
function REC_on_select() {
	globals.AC_organization_selected = id_organization
	
	//figure out where this list is being used
	var lastSlot = 'organization-people'
	if (utils.stringPatternCount(navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].path,'saas')) {
		switch (forms.AC_0L_saas.elements.highlighter.getLocationY()) {
			case 0:
				lastSlot = 'valuelists'
				break
			case 23:
				lastSlot = 'preferences'
		}
	}
	//update url with the pk for this record
	scopes.DS.webURLSet(
			navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]._about_,
			globals.DS_router_url(
				navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].path + '/' + lastSlot,
				solutionPrefs.config.currentFormID,
				id_organization,
				foundset.getSelectedRecord()
			),
			null,
			null,
			true
		)
}
