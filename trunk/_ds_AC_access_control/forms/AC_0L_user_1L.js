/**
 *
 * @properties={typeid:24,uuid:"a1f90f89-d451-46ff-9f1a-1f5a23634832"}
 */
function REC_on_select() {
	globals.AC_user_selected = id_user
	
	//update url with the pk for this record
	var lastSlot = 'users'
	scopes.DS.webURLSet(
			navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]._about_,
			globals.DS_router_url(
				navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].path + '/' + lastSlot,
				solutionPrefs.config.currentFormID,
				id_user,
				foundset.getSelectedRecord()
			),
			null,
			null,
			true
		)
}
