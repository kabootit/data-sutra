/**
 *
 * @properties={typeid:24,uuid:"4ce53d21-acc6-4ab7-9e9c-0051441e135d"}
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

foundset.sort('row_order asc') //need to order by id_navigation_item and category first?

//TODO: find issue
if (recOne) {
	controller.setSelectedIndex(2)
}
}

/**
 *
 * @properties={typeid:24,uuid:"eada09a5-26b9-4e4e-8a6b-5ee3ba860439"}
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
 * @properties={typeid:24,uuid:"5a537f21-df53-4702-8960-6f9612a14907"}
 */
function FLD_data_change__percent()
{

databaseManager.saveData()

if (total_width > 100) {
	elements.lbl_footer.fgcolor = '#FF0000'
	plugins.dialogs.showErrorDialog('Error','The column width must only equal 100%.  Please adjust')
}
else {
	elements.lbl_footer.fgcolor = '#000000'
	UPDATE_display()
}

}

/**
 *
 * @properties={typeid:24,uuid:"a9caba0b-e3f9-4bda-bdbf-c57403f9c859"}
 */
function REC_delete()
{

var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')
if (delRec == 'Yes') {
	var recSelect = controller.getSelectedIndex()

	controller.deleteRecord()
		
	var loop = recSelect
	while (loop <= controller.getMaxRecordIndex()) {
		controller.setSelectedIndex(loop)
		row_order--
		loop++
	}	
	controller.sort('row_order asc')
	controller.setSelectedIndex(recSelect)
}

//flag to refresh display list
forms.NAV_0F_navigation_item_1F__universal_lists_2F_list_display.UPDATE_display()
}

/**
 *
 * @properties={typeid:24,uuid:"4b3c3442-3ff7-4fd1-bd9a-d62362e3881a"}
 */
function REC_on_select()
{

SET_valuelist()
}

/**
 *
 * @properties={typeid:24,uuid:"8d2fb6ad-c709-4324-bfe8-6dfdbd11d8b3"}
 */
function SET_valuelist()
{

//load correct valueList based on dislay mask for selected item
switch (format_mask) {
		case 'Date':
			var valueList = application.getValueListItems('NAV_format_date')
			break
		
		case 'Number':
			var valueList = application.getValueListItems('NAV_format_number')
			break
		
		case 'Text':
			var valueList = application.getValueListItems('NAV_format_text')
			break
		
		case 'Bool':
			var valueList = application.getValueListItems('NAV_format_bool')
			break
		
		case 'Valuelist':
			var valueList = new Array()
			var valueListTemp = application.getValueListNames()
			
			/*  removed....new default is to display all valuelists
			//go through all valueLists in solution and only return those that have different store/display values
			for (var i = 0 ; i < valueListTemp.length ; i++) {
				var valueListSet = application.getValueListItems(valueListTemp[i])
				
				var displayValue = valueListSet.getColumnAsArray(1)
				var storeValue = valueListSet.getColumnAsArray(2)
				var valuesEqual = true
				
				//check if valueList[i] has different display and return values
				for (j in displayValue) {
					if (displayValue[j] != storeValue[j]) {
						valuesEqual = false
					}
				}
				
				//add item that has unique store/return values to valueList
				if (!valuesEqual) {
					valueList[valueList.length] = valueListTemp[i]
				}
			}
			*/
			valueList = valueListTemp
			break

		default:
			var valueList = new Array()
			break
}

application.setValueListItems('NAV_format_display',valueList)
}

/**
 *
 * @properties={typeid:24,uuid:"8fc8f76a-5bbb-4429-ba29-8ce1f4d20ffd"}
 */
function UPDATE_display()
{


//set flag that something has changed
//display values on loaded form will be updated upon next visit if data has been changed
forms.NAV_0F_navigation_item_1F__universal_lists_2F_list_display.UPDATE_display()

//set the mask valuelist to the newly selected type of format
SET_valuelist()
}

/**
 *
 * @properties={typeid:24,uuid:"35275606-9009-42f3-a8fe-56eefda43955"}
 */
function UPDATE_display_2()
{


//set flag that something has changed
//display values on loaded form will be updated upon next visit if data has been changed
forms.NAV_0F_navigation_item_1F__universal_lists_2F_list_display.UPDATE_display()

}
