/**
 *
 * @properties={typeid:24,uuid:"a1044e4c-691a-4547-99b2-6a712497be13"}
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
recordCurr.order_by = recordNext.order_by
recordNext.order_by --

foundset.sort('order_by asc') //need to order by id_navigation_item and category first?

//TODO: find issue
if (recOne) {
	controller.setSelectedIndex(2)
}
}

/**
 *
 * @properties={typeid:24,uuid:"59aab1a6-0f50-4422-bcd5-904b0de2c0b5"}
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
recordCurr.order_by = recordPrev.order_by
recordPrev.order_by ++

foundset.sort('order_by asc')
}

/**
 *
 * @properties={typeid:24,uuid:"218e597b-0de9-438a-bf35-fb1b827fbccf"}
 */
function REC_delete()
{

var delRec = globals.DIALOGS.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')

if (delRec == 'Yes') {
	
	var recSelect = foundset.getSelectedIndex()

	foundset.deleteRecord()
		
	var loop = recSelect
	while (loop <= foundset.getMaxRecordIndex()) {
		foundset.setSelectedIndex(loop)
		foundset.order_by --
		loop++
	}	
	foundset.sort('order_by asc')
	foundset.setSelectedIndex(recSelect)
}
}

/**
 *
 * @properties={typeid:24,uuid:"47ab9ab5-52dd-45f0-b402-cc77079d168b"}
 */
function REC_new()
{


//add [add/action/filter/tab] item

elements.fld_menu_name.requestFocus(false)

var formName = 'NAV_0F_navigation_item_1F__button'
var tabNumber = forms[formName].elements.tab_buttons.tabIndex
var relationName = forms[formName].elements.tab_buttons.getTabRelationNameAt(tabNumber)

forms[formName][relationName].newRecord(false, true)

var foundsetSize = forms[formName][relationName].getSize()

//fill in fields
forms[formName][relationName].order_by = foundsetSize
databaseManager.saveData()

//select newly created record
controller.setSelectedIndex(foundsetSize)

//request focus
application.updateUI()
elements.fld_menu_name.requestFocus(false)

}

/**
 *
 * @properties={typeid:24,uuid:"84bfd0a8-7d6c-4136-9c97-3b932c2d3aaa"}
 */
function REC_saveData()
{

//grey out fields if divider created
databaseManager.saveData()
forms.NAV_R_action_item__code.REC_on_select()

}
