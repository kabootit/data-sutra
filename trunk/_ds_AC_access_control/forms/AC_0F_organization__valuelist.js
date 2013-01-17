/**
 *
 * @properties={typeid:24,uuid:"B8CD7677-7546-4415-8442-DF857D1C6893"}
 */
function ACTIONS_list_name()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Dec 7, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//grab the actions to this
var valueList = ['Create one-off','Modify existing']

//build menu
var menu = new Array
for ( var i = 0 ; i < valueList.length ; i++ ) {
    menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_name_control)
}

//set menu method arguments
var x = 0
while (menu[x]) {
    //pass arguments
    menu[x].setMethodArguments(x)
	
	//disable dividers
	if (valueList[x] == '-') {
		menu[x].setEnabled(false)
	}
    
	x++
}

//popdown popup menu
var elem = elements[application.getMethodTriggerElementName()]
if (elem != null) {
    plugins.popupmenu.showPopupMenu(elem, menu)
}
}

/**
 *
 * @properties={typeid:24,uuid:"0FD12C05-2927-4256-8BCF-BEC73CA4910F"}
 */
function ACTIONS_list_name_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	0: create
 *			  	2: delete
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Dec 14, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

var fsValuelist = forms.AC_0F_organization__valuelist_1L_valuelist__name.foundset

switch (arguments[0]) {
	case 0: //create
		var newRec = fsValuelist.getRecord(fsValuelist.newRecord(fsValuelist.getSelectedIndex() + 1,true))
		newRec.id_organization = id_organization
		newRec.order_by = 1
		
		databaseManager.saveData()
		
		//force rec on select after data saved so that it updates properly
		forms.AC_0F_organization__valuelist_1L_valuelist__name.REC_on_select()
		
		forms.AC_0F_organization__valuelist_1L_valuelist__name.elements.fld_name.requestFocus()
		break
		
	case 1:	//modify
		//find only valuelists which are not already managed
		var existingLists = databaseManager.getFoundSetDataProviderAsArray(forms.AC_0F_organization__valuelist_1L_valuelist__name.foundset, 'id_valuelist')
		
		var query = "SELECT id_valuelist FROM sutra_valuelist WHERE flag_edit = 1 AND id_valuelist IN " +
					"(SELECT min(id_valuelist) FROM sutra_valuelist GROUP BY valuelist_name)"
		var args = null
		var dataset = databaseManager.getDataSetByQuery(
				'sutra', 
				query, 
				args, 
				-1
			)
		var allLists = dataset.getColumnAsArray(1)
		
		//loop through and remove rows from dataset that are already managed
		function inHere(input) {
			return input == allLists[i]
		}
		
		var loadLists = new Array()
		
		for (var i = 0; i < allLists.length; i++) {
			//this item is already managed, remove
			if (existingLists.some(inHere)) {
				allLists.splice(i,1)
				i--
			}
			else {
				loadLists.push(allLists[i])
			}
		}
		
		//create dataset to load in
		var ds = databaseManager.convertToDataSet(loadLists)
		forms.AC_P_valuelist.controller.loadRecords(ds)
		
		//show valuelist picker to choose which valuelists to bring over
		globals.CODE_form_in_dialog(
			forms.AC_P_valuelist,
			-1,-1,250,675,
			' ',
			true,
			false,
			'accessSaaSValuelist',
			false
		)
	
		break	
}

}

/**
 *
 * @properties={typeid:24,uuid:"E9BDBE0B-2173-464C-B2A1-26F90258ACDE"}
 */
function ACTIONS_list_item()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Dec 7, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//grab the actions to this
var valueList = new Array(
					'New item',
					'New sub item',
					'-',
					'Delete all...'
				)

//build menu
var menu = new Array
for ( var i = 0 ; i < valueList.length ; i++ ) {
    menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_item_control)
}

//set menu method arguments
var x = 0
while (menu[x]) {
    //pass arguments
    menu[x].setMethodArguments(x)
	
	//disable dividers
	if (valueList[x] == '-') {
		menu[x].setEnabled(false)
	}
	
    x++
}

//popdown popup menu
var elem = elements[application.getMethodTriggerElementName()]
if (elem != null) {
    plugins.popupmenu.showPopupMenu(elem, menu)
}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"0ABDFD19-DDE4-46BD-A45B-86E7752F8146"}
 */
function REC_new_item(event) {
	var fsItems = forms.AC_0F_organization__valuelist_1L_valuelist__item.foundset
	
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
		newRec.id_organization = selectedRec.id_organization
		newRec.id_valuelist = selectedRec.id_valuelist
		newRec.valuelist_name = selectedRec.valuelist_name
		newRec.relation_1 = selectedRec.relation_1
		newRec.relation_2 = selectedRec.relation_2
		
		forms.AC_0F_organization__valuelist_1L_valuelist__item.elements.fld_visible.requestFocus()
	}
	//no valuelist selected
	else {
		globals.DIALOGS.showErrorDialog(
					'Error',
					'Select valuelist in the left pane before proceeding'
			)
	}
}

/**
 *
 * @properties={typeid:24,uuid:"C1475BA9-2776-4782-941E-900EE52499C8"}
 */
function ACTIONS_list_item_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	0: create
 *			  	2: delete
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Dec 14, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch (arguments[0]) {
	case 0:	//duplicate
		REC_new_item()
		break
	case 1: //new sub item
		forms.AC_0F_organization__valuelist_1L_valuelist__item.REC_new_sub();
		break
	case  3:	//delete all
		var input = globals.DIALOGS.showWarningDialog("Warning", "Delete all records?", "Yes", "No")
		if (input == "Yes") {	
			forms.MGR_0F_valuelist_1L.controller.deleteAllRecords()
			
			//re-fire valuelist list
			ACTION_load()
		}
		break
}

}

/**
 *
 * @properties={typeid:24,uuid:"2630A892-DB5A-4C92-A83E-243D0AC0050D"}
 */
function ACTION_load(selectVL) {
	// This query will get the records you want in your dataset
	//var query = "SELECT DISTINCT valuelist_name FROM sutra_access_valuelist WHERE id_organization = ?"
	
	// This query will return the PK's of the records you're wanting
	// which will pass to .loadRecords() below
	var queryPK = "SELECT id_access_valuelist FROM sutra_access_valuelist WHERE id_access_valuelist IN " +
	"(SELECT min(id_access_valuelist) FROM sutra_access_valuelist WHERE id_organization = ? GROUP BY valuelist_name)"
	
	var args = [id_organization]
	
//	var dataset = databaseManager.getDataSetByQuery(
//			controller.getServerName(), 
//			query, 
//			args, 
//			-1
//		)
	var datasetPK = databaseManager.getDataSetByQuery(
			controller.getServerName(), 
			queryPK, 
			args, 
			-1
		)
	var recCount = datasetPK.getMaxRowIndex()

    // Load the desired records into a form's foundset using the PK's from ds_pk
    forms.AC_0F_organization__valuelist_1L_valuelist__name.controller.loadRecords(datasetPK)
    forms.AC_0F_organization__valuelist_1L_valuelist__name.controller.sort('valuelist_name asc')
    
    //record to select passed in, select it
    if (selectVL) {
    	for (var i = 1; i <= forms.AC_0F_organization__valuelist_1L_valuelist__name.foundset.getSize(); i++) {
    		var record = forms.AC_0F_organization__valuelist_1L_valuelist__name.foundset.getRecord(i)
    		
    		if (record.valuelist_name == selectVL) {
    			forms.AC_0F_organization__valuelist_1L_valuelist__name.foundset.setSelectedIndex(i)
    			break
    		}
    	}
    }
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"4A2D5262-50A1-482A-9984-333B9E5B9516"}
 */
function REC_on_select(event) {
	//load up what should be here
	ACTION_load()
	
	//clear out items if no records
	if (!utils.hasRecords(forms.AC_0F_organization__valuelist_1L_valuelist__name.foundset)) {
		forms.AC_0F_organization__valuelist_1L_valuelist__item.foundset.clear()
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"B4E3136E-DDC2-46AE-ABF1-9D540BF74DBB"}
 */
function FORM_on_show(firstShow, event) {
	var baseForm = solutionPrefs.config.formNameBase
	
	//load list window
	var listTab = "AC_0L_organization"
	var prefName = 'Access & control Organizations'
	if (navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
		forms[baseForm].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData.tabNumber
	}
}
