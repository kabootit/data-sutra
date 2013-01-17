/**
 *
 * @properties={typeid:24,uuid:"b82f3844-e070-4a43-a9e8-5c528160c8a3"}
 */
function FLD_data_change__filter_on()
{

/*
 *	TITLE    :	FLD_data_change__filter_on
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	check if database filters are on
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

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var filterOn = (arguments[0]) ? arguments[0] : filter_on
var formName = 'AC_0F_group__record'

databaseManager.saveData()

var dbFilterSolution = (ac_access_filter_to_access_filter__database) ? ac_access_filter_to_access_filter__database.total_active : 0
var tblFilterSolution = (ac_access_filter_to_access_filter__table) ? ac_access_filter_to_access_filter__table.total_active : 0

var dbFilter = (forms[formName].ac_access_group_to_access_filter__database) ? forms[formName].ac_access_group_to_access_filter__database.total_active : 0
var tblFilter = (forms[formName].ac_access_group_to_access_filter__table) ? forms[formName].ac_access_group_to_access_filter__table.total_active : 0

//if not configured correctly at solution level, break
if (dbFilterSolution && tblFilterSolution) {
	plugins.dialogs.showErrorDialog('Error','Both table and database filters are enabled at the solution level.  Turn one off before proceeding.')
	return
}
//if database filters at solution level, break
if (dbFilterSolution) {
	plugins.dialogs.showErrorDialog('Filter error','One or more solution database filters are in effect.  Turn off before proceeding.')
	return
}
//prompt to turn off table filters at group level
if (dbFilter && filterOn) {
	var disable = plugins.dialogs.showErrorDialog('Filter error','One or more group database filters are in effect. Should I turn them off?','Yes','No')
	if (disable == 'Yes') {
		for (var i = 1; i <= forms[formName].ac_access_group_to_access_filter__database.getSize(); i++) {
			var record = forms[formName].ac_access_group_to_access_filter__database.getRecord(i)
			record.filter_on = 0
		}
	}
	else {
		plugins.dialogs.showErrorDialog('Filter error','Database filters are enabled. Disabling selected table filter.')
		filter_on = 0
	}
}

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"096a6a2a-165f-429b-99a3-49ef5e49cb4f"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	populate valuelists
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

/*
//get database connections
var propDir = Packages.java.lang.System.getProperty('user.dir')
var separator = Packages.java.lang.System.getProperty('file.separator')
var propFile = propDir + separator + 'servoy.properties'
var propData = plugins.file.readTXTFile(propFile)

var servers = propData.match(/serverName=(.*)/g)

for (var i = 0; i<servers.length; i++) {
	servers[i] = servers[i].slice(11)
}
*/

var servers = databaseManager.getServerNames()
application.setValueListItems('AC_rules_database',servers)

var globalVars = globals.allvariables
application.setValueListItems('AC_rules_value',globalVars)

}

/**
 *
 * @properties={typeid:24,uuid:"6b6fec7f-4571-44eb-a00a-d126f20c4c85"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	populate valuelists
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

REC_on_select()
}

/**
 *
 * @properties={typeid:24,uuid:"c08417ac-e543-49fb-b1c3-8205544ebdf2"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	deletes record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete the selected filter?','Yes','No')

if (delRec == 'Yes') {
	controller.deleteRecord()
}


}

/**
 *
 * @properties={typeid:24,uuid:"f1feaccf-ccdf-44c8-a819-3fd31229b7dc"}
 */
function REC_on_select()
{

if (foundset.getSize()) {
	SET_tables()
	SET_columns()
}
}

/**
 *
 * @properties={typeid:24,uuid:"4e8dfb54-8d31-46ae-a011-0d0763159d56"}
 */
function SET_columns()
{

if (filter_database && filter_table) {
	//get sorted array of columnNames from backend
	var jsTable = databaseManager.getTable(filter_database, filter_table)
	var aColumnName = jsTable.getColumnNames()
	aColumnName.sort()
}
else {
	var aColumnName = new Array()	
}


application.setValueListItems('AC_rules_fields',aColumnName)
}

/**
 *
 * @properties={typeid:24,uuid:"2323065c-dc81-467a-a0b3-2ffafcb1876c"}
 */
function SET_tables()
{

if (filter_database) {
	var tables = databaseManager.getTableNames(filter_database)
}
else {
	var tables = new Array()
}

application.setValueListItems('AC_rules_table',tables)
}
