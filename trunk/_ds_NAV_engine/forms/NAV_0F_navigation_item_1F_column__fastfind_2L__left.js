/**
 *
 * @properties={typeid:24,uuid:"8f543c78-59b4-4c7e-a773-3ffbffff785a"}
 */
function FLD_data_change__flag_display()
{

/*
 *	TITLE    :	FLD_data_change__flag_display
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	set current fast find item record as only default
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__flag_display()
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if (flag_default) {
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset)
	fsUpdater.setColumn('flag_default',0)
	fsUpdater.performUpdate()
	
	if (!valuelist) {
		flag_default = 1
		nav_column_to_navigation_item.find_default = name_column
	}
	else {
		nav_column_to_navigation_item.find_default = null
		//show error dialog
		plugins.dialogs.showErrorDialog(
						'Default find error',
						'You can not flag this fast find item as default because there is a valuelist assigned'
					)
	}
}
else {
	nav_column_to_navigation_item.find_default = null
}

databaseManager.saveData()

//reset find valuelist
SET_find_valuelist()
}

/**
 *
 * @properties={typeid:24,uuid:"beae406d-e77a-4fed-93dd-c2fcc57c8c81"}
 */
function FLD_data_change__flag_typeahead()
{

/*
 *	TITLE    :	FLD_data_change__flag_typeahead
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	check if there is a valuelist
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__flag_display()
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if (flag_typeahead && !valuelist) {
	plugins.dialogs.showErrorDialog(
				'Typeahead error',
				'You can only use a typeahead field when specifying a valuelist'
			)
	flag_typeahead = null
}

databaseManager.saveData()

}

/**
 *
 * @properties={typeid:24,uuid:"31637872-2e49-45ce-8148-e5924ff19ddd"}
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
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var fsColumn = databaseManager.getFoundSet(controller.getServerName(),controller.getTableName())
fsColumn.clear()
fsColumn.find()
fsColumn.id_navigation_item = id_navigation_item
fsColumn.status_find = 1
var results = fsColumn.search()

//loop over current finds and make sure that there aren't any duplicates; except for empty
var unique = true
for (var i = 1; i <= fsColumn.getSize() && unique; i ++) {
	var record = fsColumn.getRecord(i)
	
	if ((record.name_display) == name_display && (record.id_column != id_column) && (name_display != '' && name_display != null)) {
		unique = false
		plugins.dialogs.showErrorDialog('Non-unique find','This display name is not unique.  Find may not work as expected if not fixed.')
		foundset.selectRecord(record.id_column)
		elements.fld_name_display.requestFocus(false)
	}
}

SET_find_valuelist()
}

/**
 *
 * @properties={typeid:24,uuid:"9235a3ab-63f8-49da-bdbc-a17f358689e3"}
 */
function FLD_data_change__valuelist()
{

/*
 *	TITLE    :	FLD_data_change__valuelist
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	set current fast find item record as only default
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__valuelist()
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if (flag_default && valuelist) {
	valuelist = null
	databaseManager.saveData()
	
	//show error dialog
	plugins.dialogs.showErrorDialog(
					'Default find error',
					'You can not assign a valuelist to the default fast find item'
				)
}

//typeahead only makes sense if there is a valuelist
if (flag_typeahead && !valuelist) {
	flag_typeahead = null
}
}

/**
 *
 * @properties={typeid:24,uuid:"349c3065-5e0b-4841-b33f-fce9d029c814"}
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
 * @properties={typeid:24,uuid:"51178050-5120-4afc-ab19-7bee93492318"}
 */
function REMOVE_find_field()
{


//remove find status
status_find = 0
databaseManager.saveData()

//refresh list of available fields
var index = forms.NAV_0F_navigation_item_1F_column__fastfind_2L__right.controller.getSelectedIndex()
forms.NAV_0F_navigation_item_1F_column__fastfind.FILTER_find_fields()
if (index <= forms.NAV_0F_navigation_item_1F_column__fastfind_2L__right.controller.getMaxRecordIndex()) {
	forms.NAV_0F_navigation_item_1F_column__fastfind_2L__right.controller.setSelectedIndex(index)
}
}

/**
 *
 * @properties={typeid:24,uuid:"7c13c79d-e024-4033-a70a-80bfabedc0c7"}
 */
function reSORT()
{

//forms.NAV_0F_navigation_item_1F_column__fastfind_2L__left.controller.sort('name_display asc')
}

/**
 *
 * @properties={typeid:24,uuid:"e54ebeed-dac1-49d7-8ca5-32e13ed6568d"}
 */
function SET_find_valuelist()
{

/*
 *	TITLE    :	SET_find_valuelist
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	loop through foundset and set up valuelist
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	SET_find_valuelist()
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var optionsDisplay = new Array()
var optionsStored = new Array()

if (utils.hasRecords(foundset)) {
	var found = false
	var textFlag = false
	var numberFlag = false
	var dateFlag = false
	
	for (var i = 1; i <= foundset.getSize(); i++) {
		var record = foundset.getRecord(i)
		
		if (record.flag_default) {
			found = record.name_column
			tooltTip = (record.name_display) ? record.name_display : record.name_column
		}
		
		if (record.type_column == 'DATETIME') {
			dateFlag = true
		}
		if (record.type_column == 'TEXT') {
			textFlag = true
		}
		if (record.type_column == 'INTEGER' || record.type_column == 'NUMBER') {
			numberFlag = true
		}
		
	}
	
	//none option
	optionsDisplay.push('None','----')
	optionsStored.push(null,null)
	
	//all dates
	if (dateFlag) {
		optionsDisplay.push('All dates')
		optionsStored.push('All dates')
	}
	//all numbers
	if (numberFlag) {
		optionsDisplay.push('All numbers')
		optionsStored.push('All numbers')
	}
	//all text
	if (textFlag) {
		optionsDisplay.push('All text')
		optionsStored.push('All text')
	}
	
	//tack on stored if needed
	if (found) {
		//add divider if last item is not stored
		if (optionsDisplay[optionsDisplay.length - 1] != '----') {
			optionsDisplay.push('----')
			optionsStored.push(null)
		}
		//stored value
		optionsDisplay.push('Column selected')
		optionsStored.push(found)
	}
	
	//remove divider if last item is divider
	if (optionsDisplay[optionsDisplay.length - 1] == '----') {
		optionsDisplay.pop()
		optionsStored.pop()
	}
}

application.setValueListItems('NAV_find_default', optionsDisplay, optionsStored)


}
