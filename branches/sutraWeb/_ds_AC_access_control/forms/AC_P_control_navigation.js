/**
 *
 * @properties={typeid:24,uuid:"0772cb1e-7a20-4c36-998d-0241bcfcbe69"}
 */
function ACTION_cancel()
{
//not already ok to close, cancel
if (!globals.CODE_hide_form) {
	//toggle off all selected values
	for ( var i = 0 ; i < foundset.getSize() ; i++ ) {
		var record = foundset.getRecord(i + 1)
		record.flag_chosen = 0
		record.order_by = null
	}
	
	//turn autosave back on
	databaseManager.setAutoSave(true)
	
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	globals.CODE_form_in_dialog_close('groupNavigationSets')
}
}

/**
 *
 * @properties={typeid:24,uuid:"f13173d3-775f-4b69-b418-0c1422ec2796"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	save navigation sets, close FiD
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

databaseManager.saveData()

//turn autosave back on
databaseManager.setAutoSave(true)

//refresh value lists
forms.AC_0F_group.REC_on_select()

//enaable closing the form
globals.CODE_hide_form = 1

globals.CODE_form_in_dialog_close('groupNavigationSets')
}

/**
 *
 * @properties={typeid:24,uuid:"276379c8-84f3-4fdb-8021-748ee63e9182"}
 */
function ACTION_toggle_flags()
{

/*
 *	TITLE    :	ACTION_toggle_flags
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle flag_chosen field in FID
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

//toggle logic
if (globals.AC_P_flag) {
	//toggle on
	for ( var i = 0 ; i < foundset.getSize() ; i++ ) {
		var record = foundset.getRecord(i + 1)
		record.flag_chosen = 1
		FLD_data_change__flag_chosen(record)
	}
}
else {
	//toggle off
	for ( var i = 0 ; i < foundset.getSize() ; i++ ) {
		var record = foundset.getRecord(i + 1)
		record.flag_chosen = 0
		FLD_data_change__flag_chosen(record)
	}
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
 * @properties={typeid:24,uuid:"bc9c5a5c-05bf-4020-8f27-c4628e257065"}
 */
function FLD_data_change__flag_chosen(oldValue, newValue, event)
{
	
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

var record = (arguments[0]) ? arguments[0] : foundset.getRecord(foundset.getSelectedIndex())

//total records selected
if (utils.hasRecords(forms.AC_0F_group__navigation_1L_control_navigation.foundset)) {
	var total = forms.AC_0F_group__navigation_1L_control_navigation.foundset.getSize()
}
else {
	var total = 0
}

if (typeof this.addSome != 'number') {
	this.addSome = 0
}

if (record.flag_chosen) {
	this.addSome++
}
else {
	this.addSome--
	var removeOrder = true
}

if (removeOrder) {
	record.order_by = null
}
else {
	record.order_by = total + this.addSome
}
}

/**
 *
 * @properties={typeid:24,uuid:"55107dde-4eba-4b73-a9d9-51c2db35654b"}
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

var state = 1

for ( var i = 0 ; i < foundset.getSize() && state ; i++ ) {
	var record = foundset.getRecord(i + 1)
	
	if (record.flag_chosen == 0 || record.flag_chosen == null) {
		state = 0
	}
}

globals.AC_P_flag = state

//sort
foundset.sort('ac_control_navigation_to_navigation.order_by asc')

//disable closing the form
globals.CODE_hide_form = 0

//form variable
this.addSome = 0

//custom form setup for iOS FiD
globals.CODE_form_in_dialog_setup_ipad()
}
