/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"d7076139-b932-4d32-ad66-96baac0bf5a8"}
 */
function APPEND_display(event)
{
	
/*
 *	TITLE    :	APPEND_display
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	create new record and add the current field to it
 *			  	
 *	INPUT    :	boolean - false appends to cureently selected record; true (defualt) creates a new record
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	APPEND_display([createRecord]) Append current field into a new list_display_item 
 *			  	
 *	MODIFIED :	Feb 11, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var formName = 'NAV_0F_navigation_item_1F__universal_lists_2F_list_display'
var relationName = 'nav_list_display_to_list_display_item'
var listName = 'NAV_0F_navigation_item_1F__universal_lists_2F_list_display__left_3L_list_display_item'

//create a new record by default, being called with false as first argument will not create a record
if (!arguments[0]) {
	var recSelect = 1

	//make sure there is a display item
	if (!utils.hasRecords(forms.NAV_0F_navigation_item_1F__detail.nav_navigation_item_to_list_display)) {
		forms.NAV_0F_navigation_item_1F__detail.REC_new()
	}
	
	if (utils.hasRecords(forms[formName][relationName])) {
		recSelect = forms[formName][relationName].getSelectedIndex()
		
		forms[formName][relationName].newRecord(false,true)
		forms[formName][relationName].row_order = forms[formName][relationName].getSize()
		forms[formName][relationName].display_align = 'left'
		
		forms[formName][relationName].sort('row_order asc')
	}
	else {
		forms[formName][relationName].newRecord(true,true)
		forms[formName][relationName].row_order = 1
		forms[formName][relationName].display_align = 'left'
		
		forms[listName].elements.fld_display.requestFocus()
	}
}

//set sort field
if (!forms[listName].field_name) {
	forms[listName].field_name = (status_relation) ? table_or_relation + '.' + name_column : name_column
}

//set header display field
if (!forms[listName].header) {
	forms[listName].header = name_column
}

//append value of field to be displayed (if relation, prepend)
if (utils.stringToNumber(application.getVersion()) < 5) {
	forms[listName].elements.fld_display.replaceSelectedText('<<'+((status_relation) ? table_or_relation + '.' + name_column : name_column)+'>>')
}
else {
	forms[listName].display = '<<'+((status_relation) ? table_or_relation + '.' + name_column : name_column)+'>>'
}

//highlight header field
forms[listName].elements.fld_header.requestFocus()
}
