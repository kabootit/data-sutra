/**
 *
 * @properties={typeid:24,uuid:"ad8b876d-116a-4499-9a18-6ca4e3aa925b"}
 */
function REC_delete()
{

var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')

if (delRec == 'Yes') {
	controller.deleteRecord()
}
}

/**
 *
 * @properties={typeid:24,uuid:"460ced44-a1e4-4798-8e63-c56ae2337622"}
 */
function REC_edit()
{

/*
 *	TITLE    :	REC_edit
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	open form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	 
 *			  	
 *	MODIFIED :	Jan 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

forms.NAV_P_navigation_item_filter.controller.find()
forms.NAV_P_navigation_item_filter.id_navigation_item_filter = id_navigation_item_filter
forms.NAV_P_navigation_item_filter.controller.search()

//turn autosave off
databaseManager.setAutoSave(false)

//enable cancelling
forms.NAV_P_navigation_item_filter.elements.btn_cancel.visible = true

application.showFormInDialog(
		forms.NAV_P_navigation_item_filter,
		-1,-1,-1,-1,
		'Edit',
		false,
		false,
		'navitemFilterDetails'
	)
}

/**
 *
 * @properties={typeid:24,uuid:"5230849a-6dd2-47b7-a558-c30e3e66915e"}
 */
function REC_new()
{


//create record
var record = foundset.getRecord(foundset.newRecord(false,true))

//default location of relation is base table
record.column_relation = forms.NAV_0L_navigation_item_1L.form_to_load_table
//default is value
record.filter_type = 'Value'

//show dialog
forms.NAV_P_navigation_item_filter.controller.find()
forms.NAV_P_navigation_item_filter.id_navigation_item_filter = record.id_navigation_item_filter
forms.NAV_P_navigation_item_filter.controller.search()

//disable cancelling
forms.NAV_P_navigation_item_filter.elements.btn_cancel.visible = false

application.showFormInDialog(
			forms.NAV_P_navigation_item_filter,
			-1,-1,-1,-1,
			'New filter',
			false,
			false,
			'navitemFilterDetails'
		)



}
