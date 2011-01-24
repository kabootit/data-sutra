/**
 *
 * @properties={typeid:24,uuid:"627D47C1-99B5-4C55-B062-0B9049BE1969"}
 */
function ACTION_create_valuelists()
{

/*
 *	TITLE    :	ACTION_create_valuelists
 *			  	
 *	MODULE   :	rsrc_MGR_valuelist_valuelist
 *			  	
 *	ABOUT    :	hit the repository to create non-existing valuelists
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_create_valuelists()
 *			  	
 *	MODIFIED :	January 18, 2008 -- David Workman, Data Mosaic
 *			  	
 */

/*
 * gate keeper
*/

var input = plugins.dialogs.showWarningDialog(
				"Warning",
				"This method will create records in your repository.\n" +
				"This is NOT supported by Servoy. So BACK UP before running this!!!\n" +
				"Continue?",
				"Yes", "No")
				
if (input != "Yes") {

	plugins.dialogs.showInfoDialog(
				"Cancelled",
				"Action cancelled.",
				"Ok")
	return
}


/*
 * setup
*/

var dbConnection = forms.MGR_0F_valuelist.controller.getServerName()
var table = forms.MGR_0F_valuelist.controller.getTableName()
var moduleName = "rsrc_MGR_valuelist_valuelist"

/*
 * incoming data
*/

// -- get value list names from data

var dataset = databaseManager.getDataSetByQuery(
	dbConnection, 
	"select valuelist_name from sutra_valuelist group by valuelist_name",
	null,
	100)

var valueListNamesData = dataset.getColumnAsArray(1).sort()

// -- get value list names already created

var valueListNamessCurrent = application.getValueListNames().sort()

// -- get new value lists to be created
var valueListNames = new Array

for ( var i = 0 ; i < valueListNamesData.length ; i++ ) {
	for ( var j = 0 ; j < valueListNamessCurrent.length ; j++ ) {
		var flag = true
		if (valueListNamesData[i] == valueListNamessCurrent[j]) {
			flag = false
			break
		}	
	}
	if (flag) {
		valueListNames.push(valueListNamesData[i])
	}
}

// -- if no data, exit
if (!valueListNames.length) {
	plugins.dialogs.showErrorDialog(
		"Error",
		"No new value lists to add",
		"Ok")
	return
}


/*
 * get repository data
*/

// -- get next element_id

var dataset = databaseManager.getDataSetByQuery(
	"repository_server", 
	"select element_id from servoy_elements order by element_id desc",
	null,
	100)
	
var elementID = dataset.getValue(1,1) + 1

// -- get parent_element_id, root_element_id

var dataset = databaseManager.getDataSetByQuery(
	"repository_server", 
	"select root_element_id, active_release from servoy_root_elements where name = ? and object_type_id = 43",
	[moduleName],
	100)
	
var rootElementID = dataset.getValue(1,1)	
var activeRelease = dataset.getValue(1,2)	

// -- get revision

var revision = 1	

// -- get next element_property_id

var dataset = databaseManager.getDataSetByQuery(
	"repository_server", 
	"select element_property_id from servoy_element_properties order by element_property_id desc",
	null,
	100)
	
var elementPropertyID = dataset.getValue(1,1) + 1

// -- get next releaseID

var dataset = databaseManager.getDataSetByQuery(
	"repository_server", 
	"select pk_id from servoy_releases order by pk_id desc",
	null,
	100)
	
var releaseID = dataset.getValue(1,1) + 1


/*
 * delete from repository tables
*/

var inputs = [rootElementID]

var searchSQL = "SELECT element_property_id, element_id, property_value, content_id " +
				"FROM servoy_element_properties where element_id = ? " +
				"and content_id in (279,281)"
				
var dataset = databaseManager.getDataSetByQuery(
	"repository_server", 
	searchSQL,
	inputs,
	10)

var storeElementID		= dataset.getColumnAsArray(2)
var storePropertyValue	= dataset.getColumnAsArray(3)
var storeContentID		= dataset.getColumnAsArray(4)

var inputs = dataset.getColumnAsArray(1)

var deleteSQL = "delete from servoy_element_properties where element_property_id in (?,?)"
			
var success = 	plugins.rawSQL.executeSQL(
					"repository_server",
					"servoy_element_properties",
					deleteSQL,
					inputs)



/*
 * insert to repository tables
*/

for ( var j = 0 ; j < valueListNames.length ; j++ ) {

	// 1- insert servoy_releases table (one record per value list)
	
	var inputs = new Array(
					releaseID,
					activeRelease,
					rootElementID,
					elementID,
					revision,
					utils.dateFormat(application.getServerTimeStamp(),'yyyy-MM-dd HH:mm:ss')
				)
	
	var insertSQL = "insert into servoy_releases " +
				"(pk_id, release_number, root_element_id, element_id, revision, creation_date) " +
				"values " +
				"(?,?,?,?,?,?)"
				
	var success = 	plugins.rawSQL.executeSQL(
						"repository_server",
						"servoy_elements",
						insertSQL,
						inputs)
	
	
	// 2- insert servoy_elements table (one record per value list)
	
	var inputs = new Array(
					elementID,
					application.getNewUUID(),
					revision,
					rootElementID,
					34,
					rootElementID
				)
	
	var insertSQL = "insert into servoy_elements " +
				"(element_id, object_uuid, revision, parent_element_id, object_type_id, root_element_id) " +
				"values " +
				"(?,?,?,?,?,?)"
				
	var success = 	plugins.rawSQL.executeSQL(
						"repository_server",
						"servoy_elements",
						insertSQL,
						inputs)
	
	
	// 3- insert servoy_element_properties table (six properties per value list for default value list)
	//TODO: vl with stored values
	
	// -- set content ids
	var content = new Array
	content[0] 	= {content_id : 155, property_value : valueListNames[j]}
	content[1] 	= {content_id : 156, property_value : "1"}
	content[2] 	= {content_id : 159, property_value : dbConnection}
	content[3] 	= {content_id : 160, property_value : table}
	content[4] 	= {content_id : 161, property_value : "visible"}
	content[5] 	= {content_id : 164, property_value : "1"}
	content[6] 	= {content_id : 165, property_value : "1"}
	content[7] 	= {content_id : 167, property_value : "order_by asc"}
	content[8] 	= {content_id : 212, property_value : "1"}
	content[9] 	= {content_id : 268, property_value : "true"}
	
	
	for ( var i = 0 ; i < content.length ; i++ ) {
	
		var inputs = new Array(
						elementPropertyID ++,
						elementID,
						content[i].content_id,
						content[i].property_value,
						revision,
						0
					)
	
		var insertSQL = "insert into servoy_element_properties " +
					"(element_property_id, element_id, content_id, property_value, revision, sequence) " +
					"values " +
					"(?,?,?,?,?,?)"
					
		var success = 	plugins.rawSQL.executeSQL(
							"repository_server",
							"servoy_element_properties",
							insertSQL,
							inputs)
					
	}
	
	// -- increment servoy keys
	releaseID ++
	elementID ++
}

// -- insert solution type and solution password properties back on top

for ( var i = 0 ; i <= 1 ; i++ ) {

	var inputs = new Array(
					elementPropertyID ++,
					storeElementID[i],
					storeContentID[i],
					storePropertyValue[i],
					0,
					0
				)
	
	var insertSQL = "insert into servoy_element_properties " +
				"(element_property_id, element_id, content_id, property_value, revision, sequence) " +
				"values " +
				"(?,?,?,?,?,?)"
				
	var success = 	plugins.rawSQL.executeSQL(
						"repository_server",
						"servoy_element_properties",
						insertSQL,
						inputs)
						
}

// -- update server repository keys in servoy_object_types

var updateStatements = new Array(

	"update servoy_object_types set next_seq = (select max(pk_id)+1 from servoy_releases) where object_type_id = 1",
	"update servoy_object_types set next_seq = (select max(element_id)+1 from servoy_elements) where object_type_id = 13",
	"update servoy_object_types set next_seq = (select max(element_property_id)+1 from servoy_element_properties) where object_type_id = 14"
)

for ( var i = 0 ; i < updateStatements.length ; i++ ) {

	var success = 	plugins.rawSQL.executeSQL(
						"repository_server",
						"servoy_object_types",
						updateStatements[i],
						null)
						
}

/*
 * finish up
*/

plugins.dialogs.showInfoDialog(
				"Complete",
				"Action completed.\n" +
				"Restart Servoy Developer NOW!",
				"Ok")

application.exit()
}

/**
 *
 * @properties={typeid:24,uuid:"1B185CD4-86D9-4A61-9D2C-8502B0453DE9"}
 */
function ACTIONS_list()
{

/*
 *	TITLE    :	ACTION_list
 *			  	
 *	MODULE   :	rsrc_MGR_valuelist_valuelist
 *			  	
 *	ABOUT    :	manage valuelist actions
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

//menu items
var valuelist = new Array(
					'New item',
					'New sub item',
				//	'Create Servoy valuelists from data',
					'-',
					'Delete all...'
				)

//set up menu with arguments
var menu = new Array()
for ( var i = 0 ; i < valuelist.length ; i++ ) {
	menu[i] = plugins.popupmenu.createMenuItem(valuelist[i],ACTIONS_list_control)
	
	menu[i].setMethodArguments(i)
	
	if (menu[i].text == '-') {
		menu[i].setEnabled(false)
	}
}

//popup
var elem = elements[application.getMethodTriggerElementName()]
if (elem != null) {
	plugins.popupmenu.showPopupMenu(elem, menu)
}


}

/**
 *
 * @properties={typeid:24,uuid:"897A9088-CBB2-4317-8629-073344A9E97D"}
 */
function ACTIONS_list_control()
{

/*
 *	TITLE    :	ACTION_list_control
 *			  	
 *	MODULE   :	rsrc_MGR_valuelist_valuelist
 *			  	
 *	ABOUT    :	manage valuelist actions
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

switch( arguments[0] ) {
	case 0:	//duplicate
		forms.MGR_0F_valuelist_1L.REC_duplicate()
		break
	case 1: //new sub item
		forms.MGR_0F_valuelist_1L.REC_new_sub()
		break
	case 2:	//servoy valuelist with repository hit
		//ACTION_create_valuelists()
		break
	case  3: //delete all
		var input = plugins.dialogs.showWarningDialog("Warning", "Delete all records?", "Yes", "No")
		if (input == "Yes") {	
			forms.MGR_0F_valuelist_1L.controller.deleteAllRecords()
			
			//null global selectors
			forms.MGR_0F_valuelist_1L__filter.FILTER_clear()
			
			//re-fire valuelist list
			forms.MGR_0L_valuelist.ACTION_load()
		}
		break
}
}

/**
 *
 * @properties={typeid:24,uuid:"631C11D3-8331-491F-AC4C-05F51B00A5E0"}
 */
function FILTER_related_1()
{

/*
 *	TITLE    :	FILTER_related_1
 *			  	
 *	MODULE   :	rsrc_MGR_valuelist_valuelist
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FILTER_related_1()
 *			  	
 *	MODIFIED :	February, 2008 -- David Workman, Data Mosaic
 *			  	
 */

//find value list items
controller.find()
valuelist_name = globals.MGR_valuelist_value_list
relation_1 = globals.MGR_valuelist_value_list_related
controller.search()

controller.sort('valuelist_name asc, relation_1 asc, relation_2 asc, order_by asc')

forms.MGR_0F_valuelist_1L.elements.fld_value_list.requestFocus()
}

/**
 *
 * @properties={typeid:24,uuid:"AF110CCB-356F-498E-9772-A36F5DAC6D62"}
 */
function FILTER_value_list()
{

/*
 *	TITLE    :	FILTER_value_list
 *			  	
 *	MODULE   :	rsrc_MGR_valuelist_valuelist
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FILTER_value_list()
 *			  	
 *	MODIFIED :	February, 2008 -- David Workman, Data Mosaic
 *			  	
 */

//find value list items
controller.find()
valuelist_name = globals.MGR_valuelist_value_list
controller.search()

controller.sort('valuelist_name asc, relation_1 asc, relation_2 asc, order_by asc')

globals.MGR_valuelist_value_list_related = null

forms.MGR_0F_valuelist_1L.elements.fld_value_list.requestFocus()
}

/**
 *
 * @properties={typeid:24,uuid:"A69B4090-40B9-46A5-87DE-CF1F2C4A8126"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	rsrc_MGR_valuelist_valuelist
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TRIGGER_tooltip_set()
//
//REC_show_all()

}

/**
 *
 * @properties={typeid:24,uuid:"BB4132CA-0BDC-4172-B39C-7C71D98FB6CC"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	rsrc_MGR_valuelist_valuelist
 *			  	
 *	ABOUT    :	delete a record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_delete()
 *			  	
 *	MODIFIED :	April, 2010 -- Troy Elliott, Data Mosaic
 *			  	
 */

	var fsItems = forms.MGR_0F_valuelist_1L.foundset
	
	//record selected
	if (utils.hasRecords(fsItems)) {
		var selectedIndex = fsItems.getSelectedIndex()
		var selectedRec = fsItems.getRecord(selectedIndex)
		
		//re-order all items below this one
		for (var i = selectedIndex + 1; i <= fsItems.getSize(); i++) {
			var newOrder = fsItems.getRecord(i)
			
			//increment order
			if (newOrder.order_by != 1) {
				newOrder.order_by ++
			}
			//starting a sub level, break loop
			else {
				break
			}
		}
		
		//create new record
		var newRec = fsItems.getRecord(fsItems.newRecord(selectedIndex + 1,true))
		newRec.order_by = selectedRec.order_by + 1
		newRec.valuelist_name = selectedRec.valuelist_name
		newRec.relation_1 = selectedRec.relation_1
		newRec.relation_2 = selectedRec.relation_2
		
		forms.MGR_0F_valuelist_1L.elements.fld_visible.requestFocus()
	}
	//no valuelist selected
	else {
		plugins.dialogs.showErrorDialog(
					'Error',
					'Select valuelist in the left pane before proceeding'
			)
	}
}

/**
 *
 * @properties={typeid:24,uuid:"A905FF91-FE0D-471A-95FC-A0630C814424"}
 */
function REC_show_all()
{

/*
 *	TITLE    :	REC_show_all
 *			  	
 *	MODULE   :	rsrc_MGR_valuelist_valuelist
 *			  	
 *	ABOUT    :	delete a record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_show_all()
 *			  	
 *	MODIFIED :	April, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

controller.loadAllRecords()

controller.sort('valuelist_name asc, relation_1 asc, relation_2 asc, order_by asc')

globals.MGR_valuelist_value_list = null
globals.MGR_valuelist_value_list_related = null
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D96841B4-9712-4C4F-AA31-CA48F419052F"}
 */
function FORM_on_show(firstShow, event) {
	//on the valuelist pane, clear out items if no records
	if (!utils.hasRecords(forms.MGR_0L_valuelist_1L.foundset)) {
		forms.MGR_0F_valuelist_1L.foundset.clear()
	}	
}
