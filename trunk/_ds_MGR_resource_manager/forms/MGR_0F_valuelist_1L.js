/**
 *
 * @properties={typeid:24,uuid:"3FB57470-EAE9-4610-A2C5-49F2A0EA0E18"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
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
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

	if (foundset.getSize() == 1) {
		var delRec = globals.DIALOGS.showWarningDialog(
					'Delete valuelist',
					'This is the last valuelist item.  Do you want to delete the valuelist?',
					'Yes',
					'No'
				)
	}
	else {
		var delRec = globals.DIALOGS.showWarningDialog(
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
		
		foundset.deleteRecord(selectedRec)
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
		forms.MGR_0L_valuelist.ACTION_load(nameVL)
	}
}

/**
 * @properties={typeid:24,uuid:"4216B789-D29E-40AB-92DC-FDE743DFB730"}
 */
function REC_duplicate()
{

/*
 *	TITLE    :	REC_duplicate
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
 *	USAGE    :	REC_duplicate()
 *			  	
 *	MODIFIED :	April, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */
	
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
	
	forms.MGR_0F_valuelist_1L.elements.fld_visible.requestFocus()
}

/**
 * @properties={typeid:24,uuid:"4131AC4A-845A-4838-9541-E5893B712D80"}
 * @AllowToRunInFind
 */
function REC_new_sub() {
	var selectedIndex = foundset.getSelectedIndex()
	var selectedRec = foundset.getRecord(selectedIndex)
	
	//search for if there are other sub items on this value already
	var fsVL = databaseManager.getFoundSet(foundset.getDataSource())
	fsVL.find()
	fsVL.valuelist_name = selectedRec.valuelist_name
	fsVL.relation_1 = (selectedRec.saved) ? selectedRec.saved : selectedRec.visible
	var results = fsVL.search()
	
	//create new record
	var newRec = foundset.getRecord(foundset.newRecord(false,true))
	newRec.order_by = results + 1
	newRec.relation_1 = (selectedRec.saved) ? selectedRec.saved : selectedRec.visible
	newRec.valuelist_name = selectedRec.valuelist_name
	newRec.valuelist_uuid = (results) ? fsVL.valuelist_uuid : application.getUUID()
	
	forms.MGR_0F_valuelist_1L.elements.fld_visible.requestFocus()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"566F3173-2FED-4BA7-A3A1-A4B58C02BBC9"}
 */
function DIR_up(event) {
	if (utils.hasRecords(foundset)) {
		databaseManager.saveData()
		
		//if previous record has order by > then current (new sub menu) or pk is the same
		var recordPrev = foundset.getRecord(foundset.getSelectedIndex() - 1)
		if (!recordPrev || recordPrev.order_by > order_by || recordPrev.id_valuelist == id_valuelist) {
			return
		}
		
		//get pk of field started on
		var pkRecSelect = id_valuelist
		
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
 * @properties={typeid:24,uuid:"70CE8A09-0E1D-455A-844C-D6B8901EC4D2"}
 */
function DIR_down(event) {
	if (utils.hasRecords(foundset)) {
		databaseManager.saveData()
		
		//if next record has order by of 1 (new sub menu) or pk is the same
		var recordNext = foundset.getRecord(foundset.getSelectedIndex() + 1)
		if (recordNext.order_by == 1 || recordNext.id_valuelist == id_valuelist) {
			return
		}
		
		//get pk of field started on
		var pkRecSelect = id_valuelist
		
		//get current record
		var recordCurr = foundset.getRecord(foundset.getSelectedIndex())
		
		//get next record
		var recordNext = foundset.getRecord(foundset.getSelectedIndex() + 1)
		
		if (!recordNext.id_valuelist) {
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
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"96D7FD13-86E3-4CD7-B501-66C9E738EF9D"}
 * @AllowToRunInFind
 */
function PICK_relation_1(event) {
	//fill valuelist with all "parent" options
	var fsValuelist = databaseManager.getFoundSet('sutra','sutra_valuelist')
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
			
			if (menu[i].text == '-') {
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

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"18938107-B26E-4EF4-AD60-5140A7E18478"}
 */
function REC_on_select(event) {

}

/**
 * Perform sort.
 *
 * @param {String} dataProviderID element data provider
 * @param {Boolean} asc sort ascending [true] or descending [false]
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D6579C74-BE01-4554-BDA2-2D44CC2B8FF3"}
 */
function SORT(dataProviderID, asc, event) {
	if (dataProviderID == 'order_by' || dataProviderID == 'relation_1') {
		var sortFields = ['valuelist_name','relation_1','relation_2','order_by']
		var sortString = sortFields.map(function(item) {return item + (asc ? ' asc' : ' desc')}).join(', ')
		controller.sort(sortString)
	}
	else {
		controller.sort(dataProviderID + (asc ? ' asc' : ' desc'), false)
	}
}
