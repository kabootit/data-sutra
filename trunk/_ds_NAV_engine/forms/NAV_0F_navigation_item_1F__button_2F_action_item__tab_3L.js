/**
 *
 * @properties={typeid:24,uuid:"74691362-487e-4833-a5bf-5ec5c4889630"}
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
 * @properties={typeid:24,uuid:"6296ffa1-e86d-4577-b030-77214093a9b6"}
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
 * @properties={typeid:24,uuid:"bd1ddae8-2ad8-421e-8df8-dc2afde31b2b"}
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
 * @properties={typeid:24,uuid:"d0f6b75f-d97a-4e9b-aa37-b4b1bfaf6f36"}
 */
function REC_new()
{

//add [add/action/filter/tab] item

var formName = 'NAV_0F_navigation_item_1F__button'
var tabNumber = forms[formName].elements.tab_buttons.tabIndex
var relationName = forms[formName].elements.tab_buttons.getTabRelationNameAt(tabNumber)

forms[formName][relationName].newRecord(false, true)

var foundsetSize = forms[formName][relationName].getSize()

//fill in fields
forms[formName][relationName].order_by = foundsetSize
databaseManager.saveData()

//select newly created record
foundset.setSelectedIndex(foundsetSize)

//request focus
application.updateUI()
elements.fld_menu_name.requestFocus(false)

}
