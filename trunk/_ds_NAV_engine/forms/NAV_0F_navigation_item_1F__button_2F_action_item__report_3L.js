/**
 *
 * @properties={typeid:24,uuid:"68d5417d-78a9-48b1-a96f-ecb40011ad35"}
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
 * @properties={typeid:24,uuid:"9a7bcfac-6159-4518-9d9f-41400c9b437f"}
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
 * @properties={typeid:24,uuid:"fb992a35-40ea-4808-b0fe-7c7f081bdb0f"}
 */
function FORM_on_load()
{

/*
 *	TITLE:		FORM_on_load
 *
 *	MODULE:		ds_NAV_engine
 *
 *	ABOUT:		set valuelist with non-empty reports
 *
 *	MODIFIED:	Mar 10, 2008 - Troy Elliott, Data Mosaic
 *
 */

var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'select id_report, report_description, report_form, report_method from sutra_report ' +
					'order by report_form asc, report_method asc',
               	null,
                500)
var valueListStored = dataset.getColumnAsArray(1)
var valueListDisplay = new Array()
var reportDesc = dataset.getColumnAsArray(2)
var reportForm = dataset.getColumnAsArray(3)
var reportMethod = dataset.getColumnAsArray(4)

var loopCount = valueListStored.length
var loopOffset = 0

for (var i = 0; i < loopCount; i++) {
	var display = ''
	if (reportForm[i]) {
		display += 'forms.'+reportForm[i]
		if (reportMethod[i]) {
			display += '.' + reportMethod[i] + '() '
		}
		else {
			display += ' '
		}
	}
	//display += reportDesc[i]
	
	//check to see if it is empty
	if (display == '') {
		valueListStored.splice(i-loopOffset,1)
		loopOffset++
	}
	//add to display array if not empty
	else {
		valueListDisplay[valueListDisplay.length] = display
	}
}

//TODO:? loop through stored array and change all number to integers?

application.setValueListItems('NAV_report__all',valueListDisplay,valueListStored)
}

/**
 *
 * @properties={typeid:24,uuid:"712c23cd-21b3-48bb-b461-f4a06cc8b929"}
 */
function REC_delete()
{

var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')

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
