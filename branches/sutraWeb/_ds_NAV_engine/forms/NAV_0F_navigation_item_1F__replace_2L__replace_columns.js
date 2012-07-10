/**
 *
 * @properties={typeid:24,uuid:"ee9ecc0a-9577-4aaa-af01-3df8fdf392d0"}
 * @AllowToRunInFind
 */
function FLD_data_change__name_display()
{

/*
 *	TITLE    :	FLD_data_change__name_display
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	check to make sure no other active finds have the same display name
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var fsColumn = databaseManager.getFoundSet(controller.getServerName(),controller.getTableName())
fsColumn.clear()
fsColumn.find()
fsColumn.id_navigation_item = id_navigation_item
fsColumn.status_replace = 1
var results = fsColumn.search()

//loop over current finds and make sure that there aren't any duplicates
var unique = true
for (var i = 1; i <= fsColumn.getSize() && unique; i ++) {
	var record = fsColumn.getRecord(i)
	
	if ((record.name_display) == name_display && (record.id_column != id_column)) {
		unique = false
		globals.DIALOGS.showErrorDialog('Non-unique find','This display name is not unique.  Find may not work as expected if not fixed.')
		foundset.selectRecord(record.id_column)
		elements.fld_name_display.requestFocus(false)
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"3d1b34a6-96ed-4eb5-8d76-21897d5ec40b"}
 */
function FLD_data_change__replacing()
{

/*
 *	TITLE    :	FLD_data_change__replacing
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	at least one of replace_allowed and replace_resource must be checked
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var fieldName = application.getMethodTriggerElementName().substring(4)

var record = foundset.getRecord(foundset.getSelectedIndex())
databaseManager.saveData()

//make sure at least one is enabled
if (!(record.replace_allowed || record.replace_resource)) {
	record[fieldName] = 1
	databaseManager.saveData()
	globals.DIALOGS.showErrorDialog('Error','One of the two check boxes must be checked.','OK')
}

//what is the pk for this server/table
if (forms[nav_column_to_navigation_item.form_to_load]) {
	var serverName = forms[nav_column_to_navigation_item.form_to_load].foundset.getServerName()
	var tableName = forms[nav_column_to_navigation_item.form_to_load].foundset.getTableName()
	//only run if there is info about this particular node
	if (solutionPrefs.repository && solutionPrefs.repository.allFormsByTable && 
		solutionPrefs.repository.allFormsByTable[serverName] && 
		solutionPrefs.repository.allFormsByTable[serverName][tableName] && 
		solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey) {

		var pk = solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey
	}
	else {
		var pk = 'repositoryAPINotImplemented'
	}
}
//if pk, set to be false
if (pk == name_column && record.replace_allowed) {
	record.replace_allowed = 0
	databaseManager.saveData()
	globals.DIALOGS.showErrorDialog('Error','The primary key for this table cannot be modified','OK')
}
}

/**
 *
 * @properties={typeid:24,uuid:"967551e6-c465-4a0c-8b88-924568fa6d88"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	get all valuelists
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var valueList = application.getValueListNames()

application.setValueListItems('NAV_valuelist_all',valueList)
}

/**
 *
 * @properties={typeid:24,uuid:"7f070fa2-ce8a-464c-8be2-00dba3b61301"}
 */
function REMOVE_replace_field()
{


//remove find status
status_replace = 0
databaseManager.saveData()

//refresh list of available fields
var index = forms.NAV_0F_navigation_item_1F__replace_2L__all_columns.controller.getSelectedIndex()
forms.NAV_0F_navigation_item_1F__replace.FILTER_replace_columns()
if (index <= forms.NAV_0F_navigation_item_1F__replace_2L__all_columns.controller.getMaxRecordIndex()) {
	forms.NAV_0F_navigation_item_1F__replace_2L__all_columns.controller.setSelectedIndex(index)
}
}
