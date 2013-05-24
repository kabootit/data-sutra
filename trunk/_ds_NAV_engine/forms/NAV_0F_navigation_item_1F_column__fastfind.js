/**
 *
 * @properties={typeid:24,uuid:"323cb69f-2260-4e64-a310-3eed4cbbe67d"}
 * @AllowToRunInFind
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

var formName = 'NAV_0F_navigation_item_1F_column__fastfind_2L__right'
var navItem = forms.NAV_0F_navigation_item.id_navigation_item
var selected = forms[formName].controller.getSelectedIndex()
var oldMax = forms[formName].controller.getMaxRecordIndex()

elements.fld_G_find_relation.toolTipText = globals.NAV_find_relation

//find all other columns based on selected relation
forms[formName].controller.loadAllRecords()
forms[formName].controller.find()
forms[formName].id_navigation_item = navItem
forms[formName].status_find = '<1'
forms[formName].table_or_relation = globals.NAV_find_relation
var results = forms[formName].controller.search()

//resort list on FIND layout
if (forms[formName].controller.getMaxRecordIndex()) {
	forms[formName].controller.sort('name_column asc')
	
	if (oldMax == forms[formName].controller.getMaxRecordIndex()) {
		forms[formName].controller.setSelectedIndex(selected)
	}
	else {
		forms[formName].controller.setSelectedIndex(1)
	}
}

}

/**
 *
 * @properties={typeid:24,uuid:"57d88a78-530f-42e9-abea-34d4c88b8dd3"}
 */
function FLD_data_change__find_default()
{

/*
 *	TITLE    :	FLD_data_change__find_default
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	set current fast find item record as only default
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__find_default()
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

var fsUpdater = databaseManager.getFoundSetUpdater(forms.NAV_0F_navigation_item_1F_column__fastfind_2L__left.foundset)
fsUpdater.setColumn('flag_default',0)
fsUpdater.performUpdate()

databaseManager.saveData()

//reset find valuelist
forms.NAV_0F_navigation_item_1F_column__fastfind_2L__left.SET_find_valuelist()
}

/**
 *
 * @properties={typeid:24,uuid:"2be4f61f-ba00-4918-b50e-44b4885fd146"}
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
globals.TRIGGER_tooltip_set()
}

/**
 *
 * @properties={typeid:24,uuid:"53893904-d7b6-4b2e-9389-11e5a32f3a9f"}
 */
function FORM_on_show()
{
FILTER_find_fields()
}

/**
 *
 * @properties={typeid:24,uuid:"1289adc6-3c4b-40ea-b163-5bf68a16daca"}
 * @AllowToRunInFind
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
var colFormName = 'NAV_0F_navigation_item_1F_column__fastfind_2L__right'
var navItem = forms.NAV_0F_navigation_item.id_navigation_item

//hard refresh of columns
if (globals.CODE_key_pressed('shift')) {
	forms[colFormName].foundset.find()
	forms[colFormName].foundset.id_navigation_item = navItem
	var results = forms[colFormName].foundset.search()
	
	if (results) {
		var input = globals.DIALOGS.showQuestionDialog(
					'Delete all columns?',
					'Do you need to do a hard refresh?\nYou will need to reconfigure fast finds and power replaces.',
					'Yes',
					'No'
			)
		
		if (input == 'Yes') {
			forms[colFormName].foundset.deleteAllRecords()
			var hardRefresh = true
		}
	}
}

if (globals.NAV_find_relation != '-') {
	
	//find all columns based on selected relation/table and navItem
	forms[colFormName].foundset.clear()
	forms[colFormName].controller.find()
	forms[colFormName].id_navigation_item = navItem
	forms[colFormName].table_or_relation = globals.NAV_find_relation
	var results = forms[colFormName].controller.search(true)
	
	//ask to refresh if records already exist
	if (results) {
		var newRecs = globals.DIALOGS.showQuestionDialog('Get columns','Do you want to refresh the columns','Yes','No')
	}
	else {
		var newRecs = 'Yes'
	}
	
	//refresh or create new records
	if (newRecs == 'Yes') {
		var formLoad = forms[formName].form_to_load
		var tableReln = globals.NAV_find_relation
		var statusReln = (tableReln != forms[formName].form_to_load_table) ? 1 : 0
		
		//check if form_to_load is a valid entry
		if (!forms[formLoad]) {
			globals.DIALOGS.showErrorDialog('Form missing','The selected form to load does not exist in this solution','OK')
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
			globals.CODE_ddarray_sort = 'asc'
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
				globals.CODE_ddarray_sort = 'asc'
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
							forms[colFormName].controller.newRecord(false)
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
			forms[colFormName].table_or_relation = globals.NAV_find_relation
			var results = forms[colFormName].controller.search()
	
			//resort available columns list
			if (results) {
				forms[colFormName].controller.sort('name_column asc')
				forms[colFormName].controller.setSelectedIndex(1)
			}
			
			if (hardRefresh) {
				globals.DIALOGS.showInfoDialog('Hard refresh','Columns have been deleted.\nPlease reconfigure fast finds now.')
			}
		}
	}
}
}
