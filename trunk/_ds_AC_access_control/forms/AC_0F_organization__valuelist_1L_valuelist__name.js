/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"9B5EC813-E920-4E50-8427-ABB5A8C10988"}
 */
function REC_on_select(event,vlName) {
	if (!vlName) {
		vlName = valuelist_name
	}
	
	var formName = 'AC_0F_organization__valuelist_1L_valuelist__item'
	
	forms[formName].foundset.find()
	
	//find all valuelist items
	if (vlName) {
		forms[formName].foundset.valuelist_name = vlName
		forms[formName].foundset.id_organization = forms.AC_0F_organization__valuelist.id_organization
	}
	//just created valuelist, find only itself
	else {
		forms[formName].foundset.id_access_valuelist = id_access_valuelist
	}
	var results = forms[formName].foundset.search()
	
	if (results) {
		forms[formName].foundset.sort('valuelist_name asc, relation_1 asc, relation_2 asc, order_by asc')
	}
}

/**
 * Handle changed data.
 *
 * @param {Object} oldValue old value
 * @param {Object} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean} valid value
 *
 * @properties={typeid:24,uuid:"7E237ACB-DAD5-4E25-9680-3562470D9CE1"}
 */
function FLD_data_change__name(oldValue, newValue, event) {
	var fsValuelist = databaseManager.getFoundSet('sutra','sutra_valuelist')
	fsValuelist.find()
	fsValuelist.valuelist_name = newValue
	var results = fsValuelist.search()
	
	if (!results) {
//		//update all items
//		var fsUpdater = databaseManager.getFoundSetUpdater(forms.AC_0F_organization__valuelist_1L_valuelist__item.foundset)
//		fsUpdater.setColumn('valuelist_name',newValue)
//		fsUpdater.performUpdate()
//		
//		REC_on_select(newValue)
//		
//		//request focus on item list
//		forms.AC_0F_organization__valuelist_1L_valuelist__item.elements.fld_visible.requestFocus()
//		
		//value ok
//		return true
	}
	else {
		plugins.dialogs.showErrorDialog(
					'Error',
					'This valuelist exists solution-wide.\nIn order to override it, you must choose the option to\n"Modify existing" valuelist from the action wheel'
			)
		return false
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"5C317EB5-EA43-43C3-988A-EDF3EB982297"}
 */
function REC_delete(event) {
	var delRec = plugins.dialogs.showWarningDialog(
					'Delete valuelist',
					'Do you really want to delete the selected valuelist?\nNote: If this valuelist was modified, the original values will be used',  
					'Yes', 
					'No'
				)
	if (delRec == 'Yes') {
		forms.AC_0F_organization__valuelist_1L_valuelist__item.foundset.deleteAllRecords()
		
		forms.AC_0F_organization__valuelist.ACTION_load()
	}
}
