/**
 *
 * @properties={typeid:24,uuid:"eb3482fb-58b3-4144-b7ec-9c1962215d74"}
 */
function ACTION_toggle_detail()
{

/*
 *	TITLE    :	ACTION_toggle_detail
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	toggle detail form view
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Aug 31, 2007 -- David Workman, Data Mosaic
 *			  	
 */

if (elements.btn_detail_right.visible == false) {

	//turn on detail
	elements.tab_detail.visible = true
	elements.lbl_detail.visible = true
	elements.lbl_detail_popout.visible = true
	
	//resize list
	var x1 = elements.tab_list.getWidth()
	var x2 = elements.tab_detail.getWidth() - 3
	var y = elements.tab_list.getHeight()
	
	elements.tab_list.setSize(x1 - x2, y)
	
	//set buttons visibility
	elements.btn_detail_right.visible = true
	elements.btn_detail_left.visible = false
	
	//help questions marks position and visibility
	elements.help_ul_fields.visible = true
	elements.help_ul_details.setLocation(elements.tab_list.getLocationX() + elements.tab_list.getWidth() - 24, elements.tab_list.getLocationY() - 16)

}
else {
	
	//turn off detail
	elements.tab_detail.visible = false
	elements.lbl_detail.visible = false
	elements.lbl_detail_popout.visible = false
	
	//resize list
	var x1 = elements.tab_list.getWidth()
	var x2 = elements.tab_detail.getWidth() - 3
	var y = elements.tab_list.getHeight()

	elements.tab_list.setSize(x1 + x2, y)
	
	//set buttons visibility
	elements.btn_detail_right.visible = false
	elements.btn_detail_left.visible = true
	
	//help questions marks position and visibility
	elements.help_ul_fields.visible = false
	elements.help_ul_details.setLocation(elements.help_ul_fields.getLocationX(),elements.help_ul_details.getLocationY())

}
}

/**
 *
 * @properties={typeid:24,uuid:"3cce2ea1-d726-43f2-8f43-221122fc3cb9"}
 */
function FILTER_find_fields()
{

/*
 *	TITLE    :	FILTER_find_fields
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	shows fields for currently selected table/relation
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
 */	//TODO: results (line 29) need to be on whole set, not just the non-used ones
	//TODO: put refresh ability back in

var formName = 'NAV_0F_navigation_item_1F__universal_lists_2F_list_display__right_3L_column'
var navItem = forms.NAV_0F_navigation_item.id_navigation_item

elements.fld_G_column_relation.toolTipText = globals.NAV_column_relation

//find all other columns based on selected relation
forms[formName].controller.find()
forms[formName].id_navigation_item = navItem
forms[formName].table_or_relation = globals.NAV_column_relation
var results = forms[formName].controller.search()

//resort list on FIND layout
if (forms[formName].controller.getMaxRecordIndex()) {
	forms[formName].controller.sort('name_column asc')
	forms[formName].controller.setSelectedIndex(1)
}

//if popup inited, fill
if (forms.NAV_P_column) {
	forms.NAV_P_column.controller.loadRecords(forms[formName].foundset)
}


}

/**
 *
 * @properties={typeid:24,uuid:"7aef6630-3de6-4089-93a4-4c2abab44121"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	form setup
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	September 15, 2008 -- David Workman, Data Mosaic
 *			  	
 */


// load tooltips from tooltip module
globals.CALLBACK_tooltip_set()


// troy's stuff. looks like a hack to me!
ACTION_toggle_detail()
ACTION_toggle_detail()
}

/**
 *
 * @properties={typeid:24,uuid:"636de3d2-d122-467c-a8a8-70f723c7253d"}
 */
function FORM_on_show()
{
forms.NAV_0F_navigation_item_1F__universal_lists_2F_list_display__right.FILTER_find_fields()

}

/**
 *
 * @properties={typeid:24,uuid:"7a5e97ca-a959-4f0f-8459-50b01befb8dd"}
 */
function POPUP_field_chooser()
{

//show column names in modal dialog for choosing
var windowName = 'NAV_P_column'// + Math.random()
var newForm = application.createNewFormInstance('NAV_0F_navigation_item_1F__universal_lists_2F_list_display__right_3L_column', windowName)

forms[windowName].controller.find()
forms[windowName].id_navigation_item = id_navigation_item
forms[windowName].table_or_relation = globals.NAV_column_relation
forms[windowName].controller.search()

application.showFormInDialog(forms[windowName], -1, -1, 200, 720 + 20,'Click to add column',true, false,'displayCols',false)


}

/**
 *
 * @properties={typeid:24,uuid:"1b497292-d91e-49db-9eac-b0c42f0badb7"}
 */
function REC_del_child()
{
/*
var formName = application.getMethodTriggerFormName()
var relationName = 'nav_list_display_to_list_display_item'


var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')
if (delRec == 'Yes') {
	var recSelect = forms[formName][relationName].getSelectedIndex()

	forms[formName][relationName].deleteRecord()
		
	var loop = recSelect
	while (loop <= forms[formName][relationName].getSize()) {
		forms[formName][relationName].setSelectedIndex(loop)
		forms[formName][relationName].row_order--
		loop++
	}	
	forms[formName][relationName].sort('row_order asc')
	forms[formName][relationName].setSelectedIndex(recSelect)
}
*/



var formName = 'NAV_0F_navigation_item_1F__universal_lists_2F_list_display__left_3L_list_display_item'

var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')
if (delRec == 'Yes') {
	var recSelect = forms[formName].controller.getSelectedIndex()

	forms[formName].controller.deleteRecord()
		
	var loop = recSelect
	while (loop <= forms[formName].controller.getMaxRecordIndex()) {
		forms[formName].controller.setSelectedIndex(loop)
		forms[formName].row_order--
		loop++
	}	
	forms[formName].controller.sort('row_order asc')
	forms[formName].controller.setSelectedIndex(recSelect)
}

//flag to refresh display list
UPDATE_display()
}

/**
 *
 * @properties={typeid:24,uuid:"3e9acba9-755f-4263-a636-7d4248edc0d3"}
 */
function REC_new_child()
{

var formName = 'NAV_0F_navigation_item_1F__universal_lists_2F_list_display'
var relationName = 'nav_list_display_to_list_display_item'
var listName = 'NAV_0F_navigation_item_1F__universal_lists_2F_list_display__left_3L_list_display_item'

var recSelect = 1

//make sure there is a display item
if (!utils.hasRecords(forms.NAV_0F_navigation_item_1F__detail.nav_navigation_item_to_list_display)) {
	forms.NAV_0F_navigation_item_1F__detail.REC_new()
}

if (utils.hasRecords(forms[formName][relationName])) {
	recSelect = forms[formName][relationName].getSelectedIndex()
	
	forms[formName][relationName].newRecord(true,true)
	forms[formName][relationName].row_order = recSelect + 1
	forms[formName][relationName].display_align = 'left'
	
	forms[formName][relationName].setSelectedIndex(recSelect + 2)
	
	if (forms[formName][relationName].getSelectedIndex() != 1) {
		var loop = recSelect + 2
		while (loop <= forms[formName][relationName].getSize()) {
			forms[formName][relationName].row_order++
			loop++
		}
	}
	
	forms[formName][relationName].sort('row_order asc')
	
	forms[formName][relationName].setSelectedIndex(recSelect + 1)
	forms[listName].elements.fld_display.requestFocus()
}
else {
	forms[formName][relationName].newRecord(true,true)
	forms[formName][relationName].row_order = 1
	forms[formName][relationName].display_align = 'left'
	
	forms[listName].elements.fld_display.requestFocus()
}
}

/**
 *
 * @properties={typeid:24,uuid:"ef05c919-781f-4f00-8aa9-97364c31aedb"}
 */
function REFRESH_columns()
{

/*
 *	TITLE    :	REFRESH_columns
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	refresh columns for selected dataprovider
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
 */	//TODO: results (line 29) need to be on whole set, not just the non-used ones
	//TODO: put refresh ability back in

var formName = 'NAV_0L_navigation_item_1L'
var relnName = 'nav_navigation_item_to_column'
var colFormName = 'NAV_0F_navigation_item_1F__universal_lists_2F_list_display__right_3L_column'
var navItem = forms[formName].id_navigation_item

if (globals.NAV_column_relation != '-') {
	
	//find all columns based on selected relation/table and navItem
	forms[colFormName].foundset.clear()
	forms[colFormName].controller.find()
	forms[colFormName].id_navigation_item = navItem
	forms[colFormName].table_or_relation = globals.NAV_column_relation
	var results = forms[colFormName].controller.search(true)
	
	//ask to refresh if records already exist
	if (results) {
		var newRecs = plugins.dialogs.showQuestionDialog('Get columns','Do you want to refresh the columns','Yes','No')
	}
	else {
		var newRecs = 'Yes'
	}
	
	//refresh or create new records
	if (newRecs == 'Yes') {
		var formLoad = forms[formName].form_to_load
		var tableReln = globals.NAV_column_relation
		var statusReln = (tableReln != forms[formName].form_to_load_table) ? 1 : 0
		
		//check if form_to_load is a valid entry
		if (!forms[formLoad]) {
			plugins.dialogs.showErrorDialog('Form missing','The selected form to load does not exist in this solution','OK')
			return
		}
		else {
			//base table
			if (tableReln == forms[formName].form_to_load_table) {
				var tableName = forms[formLoad].controller.getTableName()
				var serverName = forms[formLoad].controller.getServerName()
			}
			//relation
			else {
				var tableName = forms[formLoad][tableReln].getTableName()
				var serverName = forms[formLoad][tableReln].getServerName()
			}
			
			//
			//check for new column names
			//
			
			//get sorted array of columnNames from backend
			var jsTable = databaseManager.getTable(serverName, tableName)
			var aColumnName = jsTable.getColumnNames()
			var columnNames = new Array()
				
			for ( var i = 0 ; i < aColumnName.length ; i++ ) {
				var jsColumn = jsTable.getColumn(aColumnName[i])
				var columnInfo = new Object()
				
				columnInfo['nameColumn'] = jsColumn.getSQLName().toLowerCase() //format as lower case
				columnInfo['typeColumn'] = jsColumn.getTypeAsString().toUpperCase() //format as upper case
				
				columnNames[i] = columnInfo
			}
			globals.CODE_ddarray_field = 'nameColumn'
			columnNames.sort(globals.CODE_sort_dd_array)
			
			//get sorted array of columnNames from last refresh
			var columnNamesStored = new Array()
			
			//check to see if there are already some records
			var results = forms[colFormName].controller.getMaxRecordIndex()
			if (results) {
				for (var i = 0 ; i < forms[colFormName].controller.getMaxRecordIndex() ; i++) {
					var columnInfo = new Object()
					
					var record = forms[colFormName].foundset.getRecord(i+1)
					
					columnInfo['nameColumn'] = record.name_column
					columnInfo['idColumn'] = record.id_column
					columnInfo['typeColumn'] = record.type_column
					
					columnNamesStored[i] = columnInfo
				}
				//field to sort on
				globals.CODE_ddarray_field = 'nameColumn'
				columnNamesStored.sort(globals.CODE_sort_dd_array)
			}
	
			//
			//add new columns and delete ones that no longer exist (j is actual, k is what frameworks has)
			//
			
			var k = 0
			for (var j = 0 ; j < columnNames.length ; j++) {
				
				//when end of column values that frameworks has is reached, set to null so will always prompt an addition of record
				if (columnNamesStored.length <= k) {
					var columnValue = null
					var columnType = null
				}
				else {
					var columnValue = columnNamesStored[k].nameColumn
					var columnType = columnNamesStored[k].typeColumn
				}
				
				//if same columnName AND columnType in both sets, advance
				if ((columnNames[j].nameColumn == columnValue) && (columnNames[j].typeColumn == columnType)) {
					k++
				}
				//"smart update" column names; adds new columns and deletes those no longer present
				else {
					//position of columnValue in columnNames
					var posn = globals.CODE_search_object_array(columnNames,columnValue,'nameColumn')
					
					//if columnName not in columnNames, delete from sutra_column	
					if (posn == -1) {		
						forms[colFormName].foundset.selectRecord(columnNamesStored[k].idColumn)
						forms[colFormName].foundset.deleteRecord(forms[colFormName].foundset.getSelectedIndex())
						
						//leave j on same counter (after auto-increment) so that it will be triggered again
						j--
						
						//advance k to next value
						k++
					}
					//add all items in between current position and next backend column present to sutra_column
					else if (posn && columnType && (columnNames[j].nameColumn != columnValue)) {
						var skippedColumns = posn - j
						
						for (var m = 0 ; m < skippedColumns ; m++) {		
							var colName = columnNames[j+m].nameColumn
							var colType = columnNames[j+m].typeColumn
							
							forms[colFormName].controller.newRecord(false,true)
							forms[colFormName].name_column = colName
							forms[colFormName].type_column = colType
							forms[colFormName].id_navigation_item = navItem
							forms[colFormName].table_or_relation = tableReln
							forms[colFormName].status_relation = statusReln
						}
						if (skippedColumns == 1) {
							j += 0
						}
						else {
							j += m - 1
						}
					}
					//update existing frameworks column information with new from backend
					else {
						var posn = globals.CODE_search_object_array(columnNamesStored,columnNames[j].nameColumn,'nameColumn')
						var colName = columnNames[j].nameColumn
						var colType = columnNames[j].typeColumn
						
						//columnType is different, update
						if (posn != -1) {
							forms[colFormName].foundset.selectRecord(columnNamesStored[k].idColumn)
							forms[colFormName].type_column = colType
							
							//advance k to next value
							k++
						}
						//columnName not in columnNameStored, so add to sutra_column
						else {
							forms[colFormName].controller.newRecord(false,true)
							forms[colFormName].name_column = colName
							forms[colFormName].type_column = colType
							forms[colFormName].id_navigation_item = navItem
							forms[colFormName].table_or_relation = tableReln
							forms[colFormName].status_relation = statusReln
						}
					}
				} //end "smart update"
			} //end processing of columns
			
			//if remaining records in find_item that have not been processed already, delete
			while (k < columnNamesStored.length) {
				forms[colFormName].selectRecord(columnNamesStored[k].idColumn)
				forms[colFormName].deleteRecord()
				
				//advance k to next value
				k++
			}
			
			databaseManager.saveData()
	
			//find all non-assigned columns based on selected relation/table
			forms[colFormName].controller.find()
			forms[colFormName].id_navigation_item = navItem
			forms[colFormName].status_find = '<1'
			forms[colFormName].table_or_relation = globals.NAV_column_relation
			var results = forms[colFormName].controller.search()
	
			//resort available columns list
			if (results) {
				forms[colFormName].controller.sort('name_column asc')
				forms[colFormName].controller.setSelectedIndex(1)
			}
		}
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"4e5873f6-c16b-43f6-a2d9-f14823eefba1"}
 */
function UPDATE_display()
{

item_updated = 1

}
