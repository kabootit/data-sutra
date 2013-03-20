/**
 *
 * @properties={typeid:24,uuid:"b8b6060b-4850-496e-a5b7-8e6754a330b7"}
 */
function REC_on_select() {
	globals.AC_group_selected = id_group
	
	//update url with the pk for this record
	var lastSlot = 'groups'
	scopes.DS.webURLSet(
			navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]._about_,
			globals.DS_router_url(
				navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].path + '/' + lastSlot,
				solutionPrefs.config.currentFormID,
				id_group,
				foundset.getSelectedRecord()
			),
			null,
			null,
			true
		)
}
