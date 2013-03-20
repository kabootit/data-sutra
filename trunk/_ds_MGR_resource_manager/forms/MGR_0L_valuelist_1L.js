/**
 * @properties={typeid:35,uuid:"4DA4ED78-0FA0-4973-A9CA-816403875849",variableType:-4}
 */
var _skipSelect = false;

/**
 *
 * @properties={typeid:24,uuid:"2277DD55-18DB-4FD8-9AA3-50B35D5428A3"}
 * @AllowToRunInFind
 */
function REC_on_select(event, vlName, pk) {
	var formName = 'MGR_0F_valuelist_1L'
	
	if (!_skipSelect) {
		globals.MGR_valuelist_valuelist_selected = id_valuelist
		forms.MGR_0F_valuelist_1L__filter.FILTER_clear(false)
		
		//when passed a pk, grab the name
		if (pk) {
			forms[formName].foundset.find()
			forms[formName].foundset.id_valuelist = pk
			var results = forms[formName].foundset.search()
			
			if (results) {
				vlName = forms[formName].foundset.valuelist_name
				
				//don't fire the next time around
				_skipSelect = true
				
				//update this row to be highlighted when navigating by url
				globals.MGR_valuelist_valuelist_selected = parseInt(pk)
				foundset.selectRecord(pk)
				
				//don't fire the next time around
				_skipSelect = true
			}
			else {
				
			}
		}
		
		if (!vlName) {
			vlName = valuelist_name
		}
		
		//load in all named
		forms[formName].foundset.find()
		
		//find all valuelist items
		if (vlName) {
			forms[formName].foundset.valuelist_name = vlName
		}
		//just created valuelist, find only itself
		else {
			forms[formName].foundset.id_valuelist = id_valuelist
			var highlight = true
		}
		results = forms[formName].foundset.search()
		
		if (results) {
			forms[formName].foundset.sort('valuelist_name asc, relation_1 asc, relation_2 asc, order_by asc')
		}
		
		if (highlight) {
			forms[formName].elements.fld_visible.requestFocus()
		}
		
		//update url with the pk for this record
		scopes.DS.webURLSet(
				navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID]._about_,
				globals.DS_router_url(
					navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].path,
					solutionPrefs.config.currentFormID,
					foundset.id_valuelist,
					foundset.getSelectedRecord()
				),
				null,
				null,
				true
			)
	}
	else {
		_skipSelect = false
	}
}

/**
 * Handle changed data.
 *
 * @param {Object} oldValue old value
 * @param {Object} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"8ED7C615-42D4-424E-B7F9-5A7D04AD9F8B"}
 */
function FLD_data_change__flag_edit(oldValue, newValue, event) {
	
	databaseManager.saveData()
	
	var fsUpdater = databaseManager.getFoundSetUpdater(forms.MGR_0F_valuelist_1L.foundset)
	fsUpdater.setColumn('flag_edit',flag_edit)
	fsUpdater.performUpdate()
	
	databaseManager.saveData()	
	
	return true
}
