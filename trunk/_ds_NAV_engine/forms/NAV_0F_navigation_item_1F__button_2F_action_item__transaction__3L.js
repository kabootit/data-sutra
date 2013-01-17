/**
 *
 * @properties={typeid:24,uuid:"8F9AD81B-EBF5-455B-9219-359A5D197870"}
 */
function REC_delete()
{

var delRec = globals.DIALOGS.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')

if (delRec == 'Yes') {
	var recSelect = controller.getSelectedIndex()

	controller.deleteRecord()
		
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
 * @properties={typeid:24,uuid:"B7AA7A8B-465F-469D-83A6-275B52B5311F"}
 */
function REC_new()
{

//add [add/action/filter/tab] item

var formName = 'NAV_0F_navigation_item_1F__button'
var relnName = 'nav_navigation_item_to_action_item__add'

//only allow one child record for add method
if (forms[formName][relnName].getSize()) {
	globals.DIALOGS.showErrorDialog('Method already exists',"<html>Only one method can be assigned to the 'Add Record' button.<br>Please modify the current method or delete it and create another one.",'OK')
}
else {
	forms[formName][relnName].newRecord(false, true)
	
	var foundsetSize = forms[formName][relnName].getSize()
	
	//fill in fields
	forms[formName][relnName].order_by = foundsetSize
	databaseManager.saveData()
	
	//request focus
	application.updateUI()
	elements.fld_menu_name.requestFocus(false)
}
}

/**
 *
 * @properties={typeid:24,uuid:"7F338D60-6307-4C3C-962B-BC93A3E0E772"}
 */
function REC_saveData()
{

//grey out fields if divider created

databaseManager.saveData()
forms.NAV_R_action_item__code.REC_on_select()

}
