/**
 *
 * @properties={typeid:24,uuid:"AA9EFFF3-F7DB-4A26-A728-CB45DF39FE3B"}
 */
function ACTION_cancel()
{

/*
 *	TITLE    :	ACTION_cancel
 *			  	
 *	MODULE   :	ds_NAV_replace_find_replace
 *			  	
 *	ABOUT    :	close form in dialog without doing anything
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	May 2008 -- David Workman, Data Mosaic
 *			  	
 */

//not already ok to close, cancel
if (!globals.CODE_hide_form) {
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	//close FiD
	globals.CODE_form_in_dialog_close('findPowerReplace')
}
}

/**
 *
 * @properties={typeid:24,uuid:"546A7745-9A6B-4312-91CE-045236C925AC"}
 */
function ACTION_replace()
{

/*
 *	TITLE    :	ACTION_replace
 *			  	
 *	MODULE   :	ds_NAV_replace_find_replace
 *			  	
 *	ABOUT    :	performs date search or return to fast find
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	solutionPrefs
 *			  	
 *	MODIFIED :	August 1, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
	
	var currentNavForm = solutionPrefs.config.currentFormName
	var currentNavItem = solutionPrefs.config.currentFormID
	
	//get foundset
	var thisFoundset = forms[currentNavForm].foundset
	
	//get field
	var aboutField = navigationPrefs.byNavItemID[currentNavItem].powerReplace[globals.NAV_replace_field]
	
	//do the replacement
	switch (globals.NAV_replace_method) {
		case 'Serial number':
			thisFoundset.setSelectedIndex(1)
			var value = globals.NAV_replace_step_start
			var fsUpdater = databaseManager.getFoundSetUpdater(thisFoundset)
			while (fsUpdater.next()) {
				fsUpdater.setColumn(aboutField.columnName,value)
				value += globals.NAV_replace_step_increment
			}
			fsUpdater.performUpdate()
			break
			
		case 'Field merge':
			var origIndex = thisFoundset.getSelectedIndex()
			
			//what is the template for this replace operation
			var replaceTemplate = globals.NAV_display_row_set_item({display:globals.NAV_replace_field_value})
			
			//loop through foundset and replace with formula from above
			for (var i = 1; i <= thisFoundset.getSize() && replaceTemplate.length; i++) {
				var replaceContents = ''
				var record = thisFoundset.getRecord(i)
				for (var j = 0; j < replaceTemplate.length; j++) {
					if (replaceTemplate[j].isField) {
						replaceContents += record[replaceTemplate[j].value]
					}
					else {
						replaceContents += replaceTemplate[j].value
					}
				}
				record[aboutField.columnName] = replaceContents
			}
			databaseManager.saveData()
			thisFoundset.setSelectedIndex(origIndex)
			break
			
		case 'Date':
			var fsUpdater = databaseManager.getFoundSetUpdater(thisFoundset)
			fsUpdater.setColumn(aboutField.columnName,globals.NAV_replace_field_value_date)
			fsUpdater.performUpdate()
			break
			
		case 'Value':
			var fsUpdater = databaseManager.getFoundSetUpdater(thisFoundset)
			fsUpdater.setColumn(aboutField.columnName,globals.NAV_replace_field_value)
			fsUpdater.performUpdate()
			break
			
		case 'Valuelist':
			//get real value for display value (preserves typeof)
			var vlItems = application.getValueListItems(aboutField.valuelist)
			var vlDisplay = vlItems.getColumnAsArray(1)
			var vlReal = vlItems.getColumnAsArray(2)
			for (var i = 0; i < vlDisplay.length && !value; i++) {
				if (vlDisplay[i] == globals.NAV_replace_field_value) {
					var value = vlReal[i]
				}
			}
			
			//perform update
			var fsUpdater = databaseManager.getFoundSetUpdater(thisFoundset)
			fsUpdater.setColumn(aboutField.columnName,value)
			fsUpdater.performUpdate()
			break
	}
	
	//update ul if used
	if (navigationPrefs.byNavItemID[currentNavItem].navigationItem.useFwList) {
		globals.TRIGGER_ul_refresh_all()
	}
	
	//enable closing the form
	globals.CODE_hide_form = 1
	
	//close FID
	globals.CODE_form_in_dialog_close('findPowerReplace')
	
}
}

/**
 *
 * @properties={typeid:24,uuid:"83EDDD80-AE31-4165-AA6C-650C0F622E84"}
 */
function FLD_data_change__replace_field()
{

/*
 *	TITLE    :	FLD_data_change__replace_field
 *			  	
 *	MODULE   :	ds_NAV_replace_find_replace
 *			  	
 *	ABOUT    :	if a valuelist, add that type to option list
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//only run when solutionPrefs defined
if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
	var values
	//only run if valid replaceValues for this form
	if (values = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].powerReplace) {
		var valueList
		//it is a valuelist
		if (valueList = values[globals.NAV_replace_field].valuelist) {
			//make this the only replacement method option
			var typeDisplay = new Array('Valuelist')
			application.setValueListItems('NAV_replace_type',typeDisplay)
			globals.NAV_replace_method = 'Valuelist'
			
			//get the valuelist items
			var dataset = application.getValueListItems(valueList)
			//MEMO: only assign display value, so can convert on backend to get typeof correct
			application.setValueListItems('NAV_replace_valuelist',dataset.getColumnAsArray(1),dataset.getColumnAsArray(1))
		}
		//it is not a valuelist
		else {
			//date field
			if (values[globals.NAV_replace_field].columnType == 'DATETIME') {
				var typeDisplay = new Array('Field merge','Date')
				if (!(globals.NAV_replace_method == 'Field merge' || globals.NAV_replace_method == 'Date')) {
					globals.NAV_replace_method = null
				}
			}
			//non-date field
			else {
				//don't show column values if there are no columns enabled on this form
				var colVals = application.getValueListItems('NAV_replace_type').getColumnAsArray(1)
				if (colVals.length) {
					var typeDisplay = new Array('Serial number','Field merge','Date','Value')
					if (!(globals.NAV_replace_method == 'Serial number' || globals.NAV_replace_method == 'Field merge' || globals.NAV_replace_method == 'Date' || globals.NAV_replace_method == 'Value')) {
						globals.NAV_replace_method = null
					}
				}
				else {
					var typeDisplay = new Array('Serial number','Date','Value')
					if (!(globals.NAV_replace_method == 'Serial number' || globals.NAV_replace_method == 'Date' || globals.NAV_replace_method == 'Value')) {
						globals.NAV_replace_method = null
					}
				}
			}
			//update valuelist
			application.setValueListItems('NAV_replace_type',typeDisplay)
		}
		
		//show/hide fields
		FLD_data_change__replace_method()
	}
	
	
}
}

/**
 *
 * @properties={typeid:24,uuid:"8A40E8ED-2A91-4106-8836-38F9639D6C37"}
 */
function FLD_data_change__replace_method()
{

/*
 *	TITLE    :	FLD_data_change__replace_method
 *			  	
 *	MODULE   :	ds_NAV_replace_find_replace
 *			  	
 *	ABOUT    :	show/hide elements
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//tare the global
globals.NAV_replace_field_value = null

//turn off everything
elements.lbl_one.visible = false
elements.lbl_two.visible = false
elements.fld_step_start.visible = false
elements.fld_step_increment.visible = false
elements.fld_field_value_options.visible = false
elements.fld_field_value__text.visible = false
elements.fld_field_value__field.visible = false
elements.fld_field_value_date.visible = false
elements.fld_field_value__vl.visible = false
elements.fld_replace_method.enabled = true

//turn on what is needed
switch (globals.NAV_replace_method) {
	case 'Serial number':
		elements.lbl_one.text = 'Starting value:'
		elements.lbl_two.text = 'Increment by:'
		elements.lbl_one.visible = true
		elements.lbl_two.visible = true
		elements.fld_step_start.visible = true
		elements.fld_step_increment.visible = true
		break
	case 'Field merge':
		elements.lbl_one.text = 'Select field value'
		elements.lbl_one.visible = true
		elements.lbl_two.text = 'Replacement merge string'
		elements.lbl_two.visible = true
		elements.fld_field_value_options.visible = true
		elements.fld_field_value__field.visible = true
		break
	case 'Date':
		elements.lbl_one.text = 'Value:'
		elements.lbl_one.visible = true
		elements.fld_field_value_date.visible = true
		break
	case 'Value':
		elements.lbl_one.text = 'Value:'
		elements.lbl_one.visible = true
		elements.fld_field_value__text.visible = true
		break
	case 'Valuelist':
		elements.lbl_one.text = 'Value:'
		elements.lbl_one.visible = true
		elements.fld_field_value__vl.visible = true
		elements.fld_replace_method.enabled = false
		break
}



}

/**
 *
 * @properties={typeid:24,uuid:"4796A83A-B82C-4BE2-9EA3-1C8219BD3920"}
 */
function FLD_data_change__value_options()
{

/*
 *	TITLE    :	FLD_data_change__value_options
 *			  	
 *	MODULE   :	ds_NAV_replace_find_replace
 *			  	
 *	ABOUT    :	add to replacement text
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */


if (application.__parent__.solutionPrefs) {
	
	var currentNavItem = solutionPrefs.config.currentFormID

	var aboutField = navigationPrefs.byNavItemID[currentNavItem].powerReplace[globals.NAV_replace_field_value_options]
	
	
	var value = '<<'+ aboutField.columnName +'>>'
	
	elements.fld_field_value__field.replaceSelectedText(value)
	
	globals.NAV_replace_field_value_options = null
	elements.fld_field_value__field.requestFocus(false)
}
}

/**
 *
 * @properties={typeid:24,uuid:"21B3CA1A-B85A-4A59-9C86-66E5AC7F8751"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_NAV_replace_find_replace
 *			  	
 *	ABOUT    :	instantiates default values for date picker
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//disable closing the form
globals.CODE_hide_form = 0

//null out globals
globals.NAV_replace_field = null
globals.NAV_replace_method = null
globals.NAV_replace_step_start = 1
globals.NAV_replace_step_increment = 1
globals.NAV_replace_field_value_options = null
globals.NAV_replace_field_value = null
globals.NAV_replace_field_value_date = null

FLD_data_change__replace_method()

//custom form setup for iOS FiD
globals.CODE_form_in_dialog_setup_ipad()
}
