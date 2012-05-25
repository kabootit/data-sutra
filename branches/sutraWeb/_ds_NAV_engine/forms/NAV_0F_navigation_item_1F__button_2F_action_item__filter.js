/**
 *
 * @properties={typeid:24,uuid:"8e098a88-3893-43ed-bc76-9063137cb60d"}
 */
function ACTIONS_list()
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
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var triggerElem = application.getMethodTriggerElementName()

//make sure that correct list is selected
switch (triggerElem) {
	case 'btn_actions_list':
		TAB_REC_select('lbl_list_main')
		var listName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L'
		break
	case 'btn_actions_sub1': 
		TAB_REC_select('lbl_list_sub1')
		var listName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L__sub1'
		break
	case 'btn_actions_sub2':
		TAB_REC_select('lbl_list_sub2')
		var listName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L__sub2'
		break
}

//actions
var valueList = ['Create standard sub-menu','Create static value list....','Create dynamic value list','-','Delete all items']

//dis-allow sub-filters on third level
if (triggerElem == 'btn_actions_sub2') {
	valueList = valueList.slice(4)
}

//build menu
var menu = new Array()
for ( var i = 0 ; i < valueList.length ; i++ ) {
    menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_control)
	
	//set method arguments
	menu[i].setMethodArguments(valueList[i])
	
	//disable first three items if there aren't any records or if the selected one already has sub items
	if (i <= 2 && (!utils.hasRecords(forms[listName].foundset) || forms[listName].filter_type)) {
		menu[i].setEnabled(false)
	}
	
	//disable dividers
	if (valueList[i] == '-') {
		menu[i].setEnabled(false)
	}
}


//popdown popup menu if enabled
var elem = elements[triggerElem]
if (elem != null && elem.enabled == true) {
    plugins.popupmenu.showPopupMenu(elem, menu)
}


}

/**
 *
 * @properties={typeid:24,uuid:"02d5c95e-8bb0-4626-b597-f3ad168d9367"}
 */
function ACTIONS_list_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	0: create
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter'
var relnMain = 'nav_action_item_to_action_item__main'
var relnSub1 = 'nav_action_item_to_action_item__sub1'
var relnSub2 = 'nav_action_item_to_action_item__sub2'

//get currently selected action-item record
switch (globals.NAV_filter_level) {
	case 1:
		var record = forms[formName][relnMain].getRecord(forms[formName][relnMain].getSelectedIndex())
		var listName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L'
		break
	case 2:
		var record = forms[formName][relnSub1].getRecord(forms[formName][relnSub1].getSelectedIndex())
		var listName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L__sub1'
		break
	case 3:
		var record = forms[formName][relnSub2].getRecord(forms[formName][relnSub2].getSelectedIndex())
		var listName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L__sub2'
		break
		
}

//no record to act on, break
if (!record) {
	plugins.dialogs.showErrorDialog('No record','You must create a record before configuring its options.')
}
//there is a record, proceed
else {
	switch (arguments[0]) {
		case 'Create standard sub-menu': //turn on standard sub filtering
			//standard
			record.filter_type = 1
			databaseManager.saveData()
			
			//enable the filter place
			forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L_action_item_filter__custom.TOGGLE_readonly(false)
			
			//trigger rec on select (pipes down correct action_item_filter onto forms
			forms[listName].REC_on_select()
			
			break
			
		case 'Create dynamic value list': //determine value list at run time
			//determined at run-time
			record.filter_type = 2
			
			var fsFilterItem = databaseManager.getFoundSet(controller.getServerName(),'sutra_action_item_filter')
			var filterItem = fsFilterItem.getRecord(fsFilterItem.newRecord(true,true))
			
			//fill defaults
			filterItem.id_action_item = record.id_action_item
			fsFilterItem.column_relation = forms.NAV_0L_navigation_item_1L.form_to_load_table
			fsFilterItem.filter_type = 'Value'
			fsFilterItem.column_operator = '='
			fsFilterItem.valuelist_type = 'Stored'
			
			databaseManager.saveData()
			
			//flip tab
			if (elements.tab_detail.tabIndex != 2) {
				elements.tab_detail.tabIndex = 2
			}
			//set up basics
			else {
				forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L_action_item_filter__derived.FLD_data_change__column_relation()
			}
			
			//trigger rec on select (pipes down correct action_item_filter onto forms
			forms[listName].REC_on_select()
			
			break
			
		case 'Create static value list....': //create records based on value list
			//standard
			record.filter_type = 1
			databaseManager.saveData()
			
			//move the list working on one to the right
			globals.NAV_filter_level++
			
			//turn autosave off
			databaseManager.setAutoSave(false)
			
			globals.CODE_form_in_dialog(forms.NAV_P_action_item__valuelist,-1,-1,-1,-1,'Valuelist',false,false,'filterValuelist')
			
			//trigger rec on select (pipes down correct action_item_filter onto forms
			forms[listName].REC_on_select()
			break
			
		case 'Delete all items':	//delete
			//get correct form based on currently selected tab
			switch (globals.NAV_filter_level) {
				case 1:
					var formName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L'
					break
				case 2:
					var formName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L__sub1'
					break
				case 3:
					var formName = 'NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L__sub2'
					break
			}
			//check that there are records to delete
			if (forms[formName].foundset.getSize()) {
				if (arguments[1] == 'Yes') {
					var delRec = 'Yes'
				} 
				else {
					var delRec = plugins.dialogs.showWarningDialog('Delete records','Do you really want to delete all filter items?',  'Yes', 'No')
				}
				
				if (delRec == 'Yes') {
					
					//this is a hack to get around the funky relation web i have going on
						//MEMO: it will leave orphans if there are action items 2 levels deep
					var serverName = controller.getServerName()
					var tableName = controller.getTableName()
					
					var sql = databaseManager.getSQL(forms[formName].foundset)
					var args = databaseManager.getSQLParameters(forms[formName].foundset)
					
					//pks so can delete child records
					var filterIDs = databaseManager.getFoundSetDataProviderAsArray(forms[formName].foundset, 'id_action_item')
					
					//modify sql to be delete statement
					sql = utils.stringReplace(sql, 'select id_action_item', 'delete')
					sql = utils.stringLeft(sql,utils.stringPosition(sql,')',0,1))
					
					var success = plugins.rawSQL.executeSQL(serverName,tableName,sql,args)
					
					//clean up and flush cache if successfully deleted
					if (success) {
						//clean up
						sql = 'DELETE from sutra_action_item_filter WHERE id_action_item IN ('
							for (var i = 0; i < filterIDs.length; i++) {
								sql += '?'
								
								//comma on all but the last element
								if (i + 1 < filterIDs.length) {
									sql += ','
								}
							}
						sql += ')'
						
						//notify servoy of action_item_filter deletions
						success = plugins.rawSQL.executeSQL(serverName,'sutra_action_item_filter',sql,filterIDs)
						
						//notify servoy of action_item deletions
						success = plugins.rawSQL.notifyDataChange(serverName, tableName,databaseManager.convertToDataSet(filterIDs),1)
						
						forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L.REC_on_select()
					}
					//log error
					else {
						
					}
					
					/*
					//deleteAllRecords should work, but I'm getting a null pointer exception
					for (var i = forms[formName].foundset.getSize(); i >= 1; i--) {
						forms[formName].foundset.deleteRecord(i)
					}
					*/
					
					elements.tab_detail.tabIndex = 4
				}
			}
			else {
				plugins.dialogs.showErrorDialog('Error','There are no records to delete')
			}
			break	
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"fa5cd1f0-8b3c-4881-9681-153452c862d9"}
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
 * @properties={typeid:24,uuid:"f2815383-f097-4c62-b850-41403a457f11"}
 */
function FORM_on_show()
{

//hide tab panels

//there are records and the first one has children
if (nav_action_item_to_action_item__main && nav_action_item_to_action_item__main.filter_type == 1) {
	elements.tab_list_sub1.enabled = true
	elements.lbl_list_sub1.enabled = true
	
	//there are records and the second one has children
	if (nav_action_item_to_action_item__sub1 && nav_action_item_to_action_item__sub1.filter_type == 1) {
		elements.tab_list_sub2.enabled = true
		elements.lbl_list_sub2.enabled = true
	}
	else {
		elements.tab_list_sub2.enabled = false
		elements.lbl_list_sub2.enabled = false
	}
}
//disable all
else {
	elements.tab_list_sub1.enabled = false
	elements.lbl_list_sub1.enabled = false
	elements.tab_list_sub2.enabled = false
	elements.lbl_list_sub2.enabled = false
}




}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"bc8a5ae2-8d03-4a07-899d-64c511fd347a"}
 */
function TAB_REC_select(event)
{
	
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

var element = (arguments[0]) ? arguments[0] : application.getMethodTriggerElementName()

switch (element) {
	case 'lbl_list_main':
		forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L.REC_on_select(true)
		break
	case 'lbl_list_sub1':
		forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L__sub1.REC_on_select(true)
		break
	case 'lbl_list_sub2':
		forms.NAV_0F_navigation_item_1F__button_2F_action_item__filter_3L__sub2.REC_on_select(true)
		break
}
}
