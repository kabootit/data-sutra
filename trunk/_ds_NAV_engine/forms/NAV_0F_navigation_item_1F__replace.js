/**
 *
 * @properties={typeid:24,uuid:"bcf23384-d587-42b4-b391-5caa949e0fe3"}
 * @AllowToRunInFind
 */
function FILTER_replace_columns()
{

/*
 *	TITLE    :	FILTER_replace_columns
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
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'NAV_0F_navigation_item_1F__replace_2L__all_columns'
var navItem = id_navigation_item
var selected = forms[formName].controller.getSelectedIndex()
var oldMax = forms[formName].controller.getMaxRecordIndex()

//find all other columns based on selected relation
forms[formName].controller.loadAllRecords()
forms[formName].controller.find()
forms[formName].id_navigation_item = navItem
forms[formName].status_replace = '<1'
forms[formName].table_or_relation = form_to_load_table
var results = forms[formName].controller.search()

/*
//omit the pk so that it cannot be changed
if (results && forms[form_to_load]) {
	var jsTable = databaseManager.getTable(forms[form_to_load].controller.getServerName(),form_to_load_table)
	var pkCols = jsTable.getRowIdentifierColumnNames()
	
	//MEMO: does not account for multiple primary keys on a table
	var primaryKey = pkCols[0]
	
	for (var i = 1; i <= forms[formName].foundset.getSize(); i++) {
		var record = forms[formName].foundset.getRecord(i)
		if (record.name_column == primaryKey) {
			forms[formName].foundset.omitRecord(i)
			i--
		}
	}
}
*/

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
 * @properties={typeid:24,uuid:"8f21aebf-9c50-4d82-931e-433fdd57ddd7"}
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
 * @properties={typeid:24,uuid:"6756d458-7ae4-4110-8cf6-cd82bbd2be33"}
 */
function FORM_on_show()
{

FILTER_replace_columns()
}
