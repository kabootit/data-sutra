/**
 *
 * @properties={typeid:24,uuid:"20badd1e-d351-43c2-ba48-fb9992b53509"}
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

var tblFilter = (ac_access_filter_to_access_filter__table) ? ac_access_filter_to_access_filter__table.total_active : 0

//prompt to disable filters
if (tblFilter && globals.AC_filters_toggle) {
	FLD_data_change__filter_on(1)
}

//refresh filter status
databaseManager.recalculate(ac_access_filter_to_access_filter__table)
tblFilter = (ac_access_filter_to_access_filter__table) ? ac_access_filter_to_access_filter__table.total_active : 0

//check for active dbFilters
if (globals.AC_filters_toggle && !tblFilter) {
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
 * @properties={typeid:24,uuid:"c3b6b10d-0482-42af-80d9-04d7e9836b38"}
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

if (tblFilter && filterOn) {
	var disable = plugins.dialogs.showErrorDialog('Filter error','One or more table filters are in effect. Should I turn them off?','Yes','No')
	if (disable == 'Yes') {
		for (var i = 1; i <= ac_access_filter_to_access_filter__table.getSize(); i++) {
			var record = ac_access_filter_to_access_filter__table.getRecord(i)
			record.filter_on = 0
		}
	}
	else {
		plugins.dialogs.showErrorDialog('Filter error','Table filters are enabled. Disabling selected database filter.')
		filter_on = 0
	}
}

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"29ce3432-bf2e-44f3-9f4f-dbe2e0ef62b2"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	set default status of check box
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
 * @properties={typeid:24,uuid:"118ff602-7fdc-4735-900a-16eb3915b641"}
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
 * @properties={typeid:24,uuid:"8e8498a2-3a70-4758-ba6c-8000aefab42d"}
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
filter_type = 1
databaseManager.saveData()
}
