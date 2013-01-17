/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"E7B15FF4-5F48-42CF-8265-94391D91658A",variableType:-4}
 */
var _recNavToolbar = false;

/**
 *
 * @properties={typeid:24,uuid:"B2C082BE-00CB-49B2-9D6C-CBBD5FDFBD10"}
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
else {
	var recOne = false
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
	controller.setSelectedIndex(2)
}


}

/**
 *
 * @properties={typeid:24,uuid:"7EC9E6C4-372C-4663-9404-A0E2BD892639"}
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
 * @properties={typeid:24,uuid:"F3DEEA3A-D419-48A5-A3C3-A6AB9C1DC611"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	delete record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_delete()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var delRec = globals.DIALOGS.showWarningDialog('Delete record','Do you really want to delete this toolbar?','Yes','No')
if (delRec == 'Yes') {
	var recSelect = controller.getSelectedIndex()
	
	controller.deleteRecord()
		
	var loop = recSelect
	
	//decrement tab number
	while (loop <= foundset.getMaxRecordIndex()) {
		foundset.setSelectedIndex(loop)
		row_order--
		loop++
	}
	
	controller.setSelectedIndex(recSelect)
}
}

/**
 * Handle changed data.
 *
 * @param {Object} oldValue old value
 * @param {Object} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"469B31A1-7F20-4AB4-B7F2-61524CB8BCDB"}
 * @AllowToRunInFind
 */
function FLD_tab_name__data_change(oldValue, newValue, event) {
	var fsDupe = databaseManager.getFoundSet('sutra','sutra_toolbar')
	
	fsDupe.find()
	fsDupe.toolbar_type = 1
	fsDupe.tab_name = newValue
	var results = fsDupe.search()
	
	if (results > 1) {
		globals.DIALOGS.showErrorDialog(
					'Error',
					'The registry must be unique'
			)
		return false
	}
	
	return true
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"22188CA5-1DDA-4198-9D31-F877BE7FC148"}
 */
function REC_on_select(event) {
	//when 'previewing' this toolbar, disable
	if (form_name == 'TOOL_record_navigator') {	
		globals.TRIGGER_toolbar_record_navigator_set(false)
		_recNavToolbar = true
	}
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"B2BBAC2B-54BE-4752-BDE2-30B9B915DAB1"}
 */
function FORM_on_hide(event) {
	if (_recNavToolbar) {
		globals.TRIGGER_toolbar_record_navigator_set(true)
	}
}
