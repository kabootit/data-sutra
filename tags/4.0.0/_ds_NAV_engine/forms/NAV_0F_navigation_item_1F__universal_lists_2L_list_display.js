/**
 *
 * @properties={typeid:24,uuid:"360de802-1a77-40c9-abfa-60ff6b527dcf"}
 */
function DIR_down()
{

/*
 *	TITLE:		DIR_down
 *
 *	MODULE:		ds_NAV_navigation_standard
 *
 *	ABOUT:		Move navigation_item down in list
 *
 *	MODIFIED:	Aug 27, 2007 - Troy Elliott, Data Mosaic
 *
 */

//if max index, exit
if (foundset.getSelectedIndex() == foundset.getSize()) {
	return
}

//if index = 1, set flag to avoid glitch recSelected
//TODO: find issue
if (foundset.getSelectedIndex() == 1) {
	var recOne = true
}

//get current record
var recordCurr = foundset.getRecord(foundset.getSelectedIndex())

//get next record
var recordNext = foundset.getRecord(foundset.getSelectedIndex() + 1)

//swap with next record
recordCurr.row_order = recordNext.row_order
recordNext.row_order --

foundset.sort('row_order asc')

//TODO: find issue
if (recOne) {
	foundset.setSelectedIndex(2)
}
}

/**
 *
 * @properties={typeid:24,uuid:"3b750d76-b821-4525-9053-e18f197a460d"}
 */
function DIR_up()
{

/*
 *	TITLE:		DIR_up
 *
 *	MODULE:		ds_NAV_navigation_standard
 *
 *	ABOUT:		Move navigation_item up in list
 *
 *	MODIFIED:	Aug 27, 2007 - Troy Elliott, Data Mosaic
 *
 */

//if index = 1, exit
if (foundset.getSelectedIndex() == 1) {
	return
}

//get current record
var recordCurr = foundset.getRecord(foundset.getSelectedIndex())

//get previous record
var recordPrev = foundset.getRecord(foundset.getSelectedIndex() - 1)

//swap with previous record
recordCurr.row_order = recordPrev.row_order
recordPrev.row_order ++

foundset.sort('row_order asc')
}

/**
 *
 * @properties={typeid:24,uuid:"b8fc7013-a832-41b4-8ef0-3408b6d90429"}
 */
function FLD_data_change__list_title()
{

/*
 *	TITLE    :	FLD_data_change__list_title
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	override the default list header for this display
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var newTitle = fw_list_title

databaseManager.saveData()

if (newTitle != nav_list_display_to_navigation_item.fw_list_title && newTitle != '') {
	list_title = newTitle
}
else {
	list_title = null
}

databaseManager.saveData()


}

/**
 *
 * @properties={typeid:24,uuid:"6383bb2e-0f71-44dc-9d4c-87f234cf1990"}
 */
function REC_delete()
{

/*
 *	TITLE:		REC_delete
 *
 *	MODULE:		ds_NAV_engine
 *
 *	ABOUT:		Deletes current record
 *
 *	MODIFIED:	Aug 29, 2007 - Troy Elliott, Data Mosaic
 *
 */

var delRec = globals.DIALOGS.showWarningDialog('Delete record','Do you really want to delete this list display?','Yes','No')

var formName = 'NAV_0F_navigation_item_1F__universal_lists'
var relnName = 'nav_navigation_item_to_list_display'

var defaultDisplay = false

if (delRec == 'Yes') {
	var recSelect = foundset.getSelectedIndex()
	
	//check if selected record is default display
	if (foundset.display_default) {
		defaultDisplay = true
	}
	
	foundset.deleteRecord()
	
	var loop = recSelect
	while (loop <= foundset.getSize()) {
		foundset.getRecord(loop).row_order--
		loop++
	}	
	foundset.setSelectedIndex(recSelect)
	
}

//de-activate universal list if no displays
if (!foundset.getSize()) {
	forms[formName].use_fw_list = 0
	forms[formName].REC_on_select()
}
//if deleted display was the default, set the currently selected one to be the default
else if (defaultDisplay) {
	foundset.display_default = 1
}


}

/**
 *
 * @properties={typeid:24,uuid:"7dd3fab3-824c-4bfb-afde-0d251bb25562"}
 */
function SET_default()
{

/*
 *	TITLE    :	SET_default
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	set current list display record as only default
 *			  	not allowed to deselect record (correct usage is to click on new default)
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

var record = foundset.getSelectedRecord()

if (record.display_default) {
	for (var i = 1; i <= foundset.getSize(); i++) {
		foundset.getRecord(i).display_default = 0
	}
	record.display_default = 1
}
//no default display selected
else if (false) {
	record.display_default = 1
	globals.DIALOGS.showErrorDialog('Missing default display', 'There must be a default display when using the universal list', 'OK')
}

databaseManager.saveData()
}
