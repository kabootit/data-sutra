/**
 *
 * @properties={typeid:24,uuid:"0A301967-5DF1-47C0-AEC9-2551BDE3CFF1"}
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
 * @properties={typeid:24,uuid:"F72B5769-4578-42C9-A628-BF06F4914DFE"}
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
 * @properties={typeid:24,uuid:"8900AB9E-1E9E-49BE-B190-F96BD137730E"}
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

var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this sidebar?','Yes','No')
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
