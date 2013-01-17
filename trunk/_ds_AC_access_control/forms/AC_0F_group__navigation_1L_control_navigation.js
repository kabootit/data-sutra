/**
 *
 * @properties={typeid:24,uuid:"a14d5f7b-f2a1-493d-a53e-d53603a0b0f0"}
 */
function DIR_down()
{

if (utils.hasRecords(foundset)) {
	//if max index, exit (no more records of same node-level below
	var recordLast = foundset.getRecord(foundset.getSize())
	if (order_by == recordLast.order_by) {
		return
	}
	
	//get pk of field started on
	var pkRecSelect = id_control_navigation
	
	//get current record
	var recordCurr = foundset.getRecord(foundset.getSelectedIndex())
	
	//get next record
	var recordNext = foundset.getRecord(foundset.getSelectedIndex() + 1)
	
	if (recordCurr.order_by < foundset.getSize()) {
		recordCurr.order_by = recordNext.order_by
		recordNext.order_by --
	}
	
	//sort lists
	foundset.sort('order_by asc')
	
	//select record we were on at start
	foundset.selectRecord(pkRecSelect)
}	
	

}

/**
 *
 * @properties={typeid:24,uuid:"5ffafd8c-9c8c-4ce0-b661-59e0578458ab"}
 */
function DIR_up()
{
	
if (utils.hasRecords(foundset)) {
	//if index = 1, exit (no more records of same node-level above)
	var recordFirst = foundset.getRecord(1)
	if (order_by == recordFirst.order_by) {
		globals.DIALOGS.showErrorDialog('Error','This record is at the top of the list.  It cannot move any higher')
		return
	}
	
	//get pk of field started on
	var pkRecSelect = id_control_navigation
	
	//get current record
	var recordCurr = foundset.getRecord(foundset.getSelectedIndex())
	
	//get previous record
	var recordPrev = foundset.getRecord(foundset.getSelectedIndex() - 1)
	
	if (recordCurr.order_by > 1) {
		recordCurr.order_by = recordPrev.order_by
		recordPrev.order_by ++
	}
	
	//sort lists
	foundset.sort('order_by asc')
	
	//select record we were on at start
	foundset.selectRecord(pkRecSelect)
}
}

/**
 *
 * @properties={typeid:24,uuid:"1f3670b8-1d34-4a7b-8d30-bf3ba1463b5d"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	only show order-by column if a record is missing it's order by-ness
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	September 22, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var showOrder = false

for (var i = 1; i <= foundset.getSize(); i++) {
	var record = foundset.getRecord(i)
	
	if (typeof record.order_by != 'number') {
		showOrder = true
	}
}

elements.fld_order_by.visible = showOrder
}

/**
 *
 * @properties={typeid:24,uuid:"46723238-81e7-4b8d-b120-1f85334b96e9"}
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

var delRec = globals.DIALOGS.showWarningDialog('Delete record','Do you really want to remove the selected navigation set?','Yes','No')

if (delRec == 'Yes') {
	var deletedIndex = foundset.getSelectedIndex()
	
	flag_chosen = 0
	order_by = null
	databaseManager.saveData()
	
	for (var i = foundset.getSelectedIndex(); i <= foundset.getSize() && i >= deletedIndex; i++) {
		var record = foundset.getRecord(i)
		record.order_by--
	}
	databaseManager.saveData()
	
	//refresh value list
	forms.AC_0F_group.REC_on_select()
}


}
