/**
 *
 * @properties={typeid:24,uuid:"e1fc3a21-478e-4048-a9d7-9d109aa06ed5"}
 */
function ADD_replace_field()
{

var pkReplace = id_column

//what is the pk for this server/table
if (forms[nav_column_to_navigation_item.form_to_load]) {
	var serverName = forms[nav_column_to_navigation_item.form_to_load].foundset.getServerName()
	var tableName = forms[nav_column_to_navigation_item.form_to_load].foundset.getTableName()
	//only run when using query based way to hit repository
	if (!solutionPrefs.repository.api && solutionPrefs.repository.allForms) {
		var pk = solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey
	}
	else {
		var pk = 'repositoryAPINotImplemented'
	}
}


//move field over and set defaults
status_replace = 1
replace_allowed = (pk != name_column) ? 1 : 0
replace_resource = 1
databaseManager.saveData()

//remove record from foundset
foundset.omitRecord()

//select record
forms.NAV_0F_navigation_item_1F__replace_2L__replace_columns.foundset.selectRecord(pkReplace)

//request focus if unnamed
if (forms.NAV_0F_navigation_item_1F__replace_2L__replace_columns.name_display == null || forms.NAV_0F_navigation_item_1F__replace_2L__replace_columns.name_display == '') {
	forms.NAV_0F_navigation_item_1F__replace_2L__replace_columns.elements.fld_name_display.requestFocus()
}

//check for uniqueness
//forms.NAV_0F_navigation_item_1F__replace_2L__replace_columns.FLD_data_change__name_display()
}

/**
 *
 * @properties={typeid:24,uuid:"21687bd3-8485-461d-869e-05a2916e53b3"}
 */
function UPDATE_replace_status()
{

for (var i = 1; i <= foundset.getSize(); i++) {
	var record = foundset.getRecord(i)
	record.status_replace = 0
}

databaseManager.saveData()
}
