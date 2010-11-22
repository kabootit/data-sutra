/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"572096B9-1494-4352-A9BD-BA17777DDD39"}
 */
function REC_delete(event) {
	if (foundset.getSize() == 1) {
		var delRec = plugins.dialogs.showWarningDialog(
					'Delete valuelist',
					'This is the last valuelist item.  Do you want to delete the valuelist?',
					'Yes',
					'No'
				)
	}
	else {
		var delRec = plugins.dialogs.showWarningDialog(
					'Delete record',
					'Do you really want to delete the selected valuelist item?',
					'Yes',
					'No'
				)
	}
	
	if (delRec == 'Yes') {
		//what record selected?
		var selectedRec = foundset.getSelectedRecord()
		var selectedValue = (selectedRec.saved) ? selectedRec.saved : selectedRec.visible
		var nameVL = selectedRec.valuelist_name
		
		//re-order all items below this one
		for (var i = foundset.getSelectedIndex() + 1; i <= foundset.getSize(); i++) {
			var newOrder = foundset.getRecord(i)
			
			//decrement order
			if (newOrder.order_by != 1) {
				newOrder.order_by --
			}
			//starting a sub level, break loop
			else {
				break
			}
		}
		
		controller.deleteRecord()
		i--
		
		//continue looping through foundset and delete any child records
		for ( ; i <= foundset.getSize(); i++) {
			var thisRec = foundset.getRecord(i)
			
			if (thisRec.relation_1 == selectedValue) {
				foundset.deleteRecord(thisRec)
				i--
			}
		}
		
		//reload top level form in case it got deleted
		forms.AC_0F_organization__saas_1F__valuelist.ACTION_load(nameVL)
	}
}

/**
 * @properties={typeid:24,uuid:"E0184ABC-7CD5-4A0D-B8FC-5D8B3A60F383"}
 */
function REC_new() {

/*
 *	TITLE    :	REC_duplicate
 *			  	
 *	MODULE   :	rsrc_VL_valuelist
 *			  	
 *	ABOUT    :	delete a record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_duplicate()
 *			  	
 *	MODIFIED :	April, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */
	if (utils.hasRecords(foundset)) {
		var selectedIndex = foundset.getSelectedIndex()
		var selectedRec = foundset.getRecord(selectedIndex)
		
		//re-order all items below this one
		for (var i = selectedIndex + 1; i <= foundset.getSize(); i++) {
			var newOrder = foundset.getRecord(i)
			
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
		var newRec = foundset.getRecord(foundset.duplicateRecord(selectedIndex,selectedIndex + 1,true))
		newRec.order_by = selectedRec.order_by + 1
		
		elements.fld_visible.requestFocus()
	}
	else {
		plugins.dialogs.showErrorDialog(
					'No valuelist',
					'You must select a valuelist first'
			)
	}
}

/**
 * @properties={typeid:24,uuid:"3C0B789A-8454-44F9-81CE-8CE1B5053583"}
 */
function REC_new_sub() {
	var selectedIndex = foundset.getSelectedIndex()
	var selectedRec = foundset.getRecord(selectedIndex)
	
	//search for if there are other sub items on this value already
	var fsVL = databaseManager.getFoundSet(foundset.getDataSource())
	fsVL.find()
	fsVL.id_organization = selectedRec.id_organization
	fsVL.valuelist_name = selectedRec.valuelist_name
	fsVL.relation_1 = (selectedRec.saved) ? selectedRec.saved : selectedRec.visible
	var results = fsVL.search()
	
	//create new record
	var newRec = foundset.getRecord(foundset.newRecord(false,true))
	newRec.order_by = results + 1
	newRec.relation_1 = (selectedRec.saved) ? selectedRec.saved : selectedRec.visible
	newRec.valuelist_name = selectedRec.valuelist_name
	newRec.id_organization = selectedRec.id_organization
	newRec.id_valuelist = selectedRec.id_valuelist
	newRec.valuelist_uuid = (results) ? fsVL.valuelist_uuid : application.getUUID()
	
	elements.fld_visible.requestFocus()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"B49E6435-6E3F-400D-92B1-F2428F1A6A65"}
 */
function DIR_up(event) {
	if (utils.hasRecords(foundset)) {
		databaseManager.saveData()
		
		//if previous record has order by > then current (new sub menu) or pk is the same
		var recordPrev = foundset.getRecord(foundset.getSelectedIndex() - 1)
		if (!recordPrev || recordPrev.order_by > order_by || recordPrev.id_access_valuelist == id_access_valuelist) {
			return
		}
		
		//get pk of field started on
		var pkRecSelect = id_access_valuelist
		
		//get current record
		var recordCurr = foundset.getRecord(foundset.getSelectedIndex())
		
		//get previous record
		var recordPrev = foundset.getRecord(foundset.getSelectedIndex() - 1)
		
		if (recordCurr.order_by > 1) {
			recordCurr.order_by = recordPrev.order_by
			recordPrev.order_by ++
		}
		
		//sort lists
		foundset.sort('valuelist_name asc, relation_1 asc, relation_2 asc, order_by asc')
		
		//select record we were on at start
		foundset.selectRecord(pkRecSelect)
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"C0564EC2-73E8-4FD3-BBC7-682D10280790"}
 */
function DIR_down(event) {
	if (utils.hasRecords(foundset)) {
		databaseManager.saveData()
		
		//if next record has order by of 1 (new sub menu) or pk is the same
		var recordNext = foundset.getRecord(foundset.getSelectedIndex() + 1)
		if (recordNext.order_by == 1 || recordNext.id_access_valuelist == id_access_valuelist) {
			return
		}
		
		//get pk of field started on
		var pkRecSelect = id_access_valuelist
		
		//get current record
		var recordCurr = foundset.getRecord(foundset.getSelectedIndex())
		
		//get next record
		var recordNext = foundset.getRecord(foundset.getSelectedIndex() + 1)
		
		if (!recordNext.id_access_valuelist) {
			return
		}
		
		if (recordCurr.order_by < foundset.getSize()) {
			recordCurr.order_by = recordNext.order_by
			recordNext.order_by --
		}
		
		//sort lists
		foundset.sort('valuelist_name asc, relation_1 asc, relation_2 asc, order_by asc')
		
		//select record we were on at start
		foundset.selectRecord(pkRecSelect)
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"6E85F02F-4635-44A7-A733-8C7806570CB8"}
 */
function FORM_on_show(firstShow, event) {
	//on the valuelist pane, clear out items if no records
	if (!utils.hasRecords(forms.AC_0F_organization__saas_1F__valuelist_2L_valuelist__name.foundset)) {
		forms.AC_0F_organization__saas_1F__valuelist_2L_valuelist__item.foundset.clear()
	}	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"4E8E3E60-7C78-4ACD-B448-2CA15227D393"}
 */
function PICK_relation_1(event) {
	//fill valuelist with all "parent" options
	var fsValuelist = databaseManager.getFoundSet('sutra','sutra_access_valuelist')
	fsValuelist.loadRecords(foundset)
	
	fsValuelist.find()
	fsValuelist.relation_1 = '^='
	var results = fsValuelist.search(false,true)
	
	var parentItems = []
	if (results) {
		fsValuelist.sort('relation_1 asc, relation_2 asc, order_by asc')
		parentItems = databaseManager.getFoundSetDataProviderAsArray(fsValuelist,'visible')
		
		if (relation_1) {
			parentItems.unshift('Non-related','-')
		}
	}
	
	//menu items
	var valuelist = parentItems
//	var real = new Array()
	
	//put together pop-up menu
	if (typeof event != 'number') {
		//set up menu with arguments
		var menu = new Array()
		for ( var i = 0 ; i < valuelist.length ; i++ ) {
			if (relation_1 == valuelist[i]) {
				menu[i] = plugins.popupmenu.createCheckboxMenuItem(valuelist[i],PICK_relation_1)
				menu[i].setSelected(true)
			}
			else {
				menu[i] = plugins.popupmenu.createMenuItem(valuelist[i],PICK_relation_1)
			}
			
			menu[i].setMethodArguments(i)
			
			if (menu[i].text == '----') {
				menu[i].setEnabled(false)
			}
		}
		
		//popup
		var elem = elements[event.getElementName()]
		if (elem != null && menu.length > 1) {
			plugins.popupmenu.showPopupMenu(elem, menu)
		}
	}
	//menu shown and item chosen
	else {
		//something specific chosen
		if (event) {
			relation_1 = valuelist[event]
		}
		else {
			relation_1 = null
		}
	}
}
