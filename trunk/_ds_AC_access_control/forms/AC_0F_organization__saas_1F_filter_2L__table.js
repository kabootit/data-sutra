/**
 *
 * @properties={typeid:24,uuid:"3003484e-cb33-4a4e-b34c-a2cd3821189d"}
 */
function ACTION_toggle_flags()
{

/*
 *	TITLE    :	ACTION_toggle_flags
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle filter_on field
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

var dbFilter = (ac_access_filter_to_access_filter__database) ? ac_access_filter_to_access_filter__database.total_active : 0

//prompt to disable filters
if (dbFilter && globals.AC_filters_toggle) {
	FLD_data_change__filter_on(1)
}

//refresh filter status
databaseManager.recalculate(ac_access_filter_to_access_filter__database)
dbFilter = (ac_access_filter_to_access_filter__database) ? ac_access_filter_to_access_filter__database.total_active : 0

//check for active dbFilters
if (globals.AC_filters_toggle && !dbFilter) {
	var toggle = 1
}
else {
	var toggle = 0
	globals.AC_filters_toggle = toggle
}

//toggle
for ( var i = 0 ; i < foundset.getSize() ; i++ ) {
	var record = foundset.getRecord(i + 1)
	record.filter_on = toggle
}

application.updateUI()
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
 * @properties={typeid:24,uuid:"6fe18b82-f535-42e6-9b93-78271387cb26"}
 */
function FLD_data_change__filter_on(oldValue, newValue, event)
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
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var filterOn = (arguments[0]) ? arguments[0] : filter_on

databaseManager.saveData()

var dbFilter = (ac_access_filter_to_access_filter__database) ? ac_access_filter_to_access_filter__database.total_active : 0
var tblFilter = (ac_access_filter_to_access_filter__table) ? ac_access_filter_to_access_filter__table.total_active : 0

if (dbFilter && filterOn) {
	var disable = plugins.dialogs.showErrorDialog('Filter error','A database-wide filter is in effect. Should I turn it off?','Yes','No')
	if (disable == 'Yes') {
		for (var i = 1; i <= ac_access_filter_to_access_filter__database.getSize(); i++) {
			var record = ac_access_filter_to_access_filter__database.getRecord(i)
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
 * @properties={typeid:24,uuid:"22a40747-38f2-4e52-99d9-3f808cec0d61"}
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
 * @properties={typeid:24,uuid:"1a6219bd-dee6-4cea-8156-ac0612794a18"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	populate valuelists and set default check status
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

var state = (foundset.getSize()) ? 1 : 0

for ( var i = 0 ; i < foundset.getSize() && state ; i++ ) {
	var record = foundset.getRecord(i + 1)
	
	if (record.filter_on == 0 || record.filter_on == null) {
		state = 0
	}
}

globals.AC_filters_toggle = state
}

/**
 *
 * @properties={typeid:24,uuid:"e4effa2c-b2d1-4613-a4e2-2d49624f1d11"}
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
 * @properties={typeid:24,uuid:"4f0cedc0-e4f0-41e0-b953-eac2b1e2e8ac"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	create new solution filter param
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

controller.newRecord(false)
id_group = 0
filter_type = 2
databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"162214a0-c9f8-4d12-952a-5fe7403b311d"}
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
 * @properties={typeid:24,uuid:"eaf36dc1-22df-4336-8c77-1f600d52b3e0"}
 */
function SET_columns()
{

var aColumnName = new Array()

if (foundset.getSize() && filter_database && filter_table) {   //!(filter_table == 'null' || filter_table == '')) {
	//get sorted array of columnNames from backend
	var jsTable = databaseManager.getTable(filter_database, filter_table)
	if (jsTable) {
		var aColumnName = jsTable.getColumnNames()
		aColumnName.sort()
	}
}


application.setValueListItems('AC_rules_fields',aColumnName)
}

/**
 *
 * @properties={typeid:24,uuid:"e7e0b501-84ae-45aa-9965-f96ab1f4472d"}
 */
function SET_tables()
{


if (foundset.getSize() && filter_database) {
	var tablesDisplayed = databaseManager.getTableNames(filter_database)
	var tablesStored = databaseManager.getTableNames(filter_database)
	//tablesDisplayed.unshift('All servers','----')
	//tablesStored.unshift('null','')
}
else {
	var tablesDisplayed = new Array()
	var tablesStored = new Array()
}

application.setValueListItems('AC_rules_table',tablesDisplayed)//,tablesStored)
}
