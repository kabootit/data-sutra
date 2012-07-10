/**
 *
 * @properties={typeid:24,uuid:"09CC6D86-54E8-42E7-A607-A138D3271541"}
 */
function ACTIONS_list()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	wb_WEB_site
 *			  	
 *	ABOUT    :	manage web page actions
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	August 30, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */


//get menu list from a value list
var valueList = [
		'Duplicate record',
		'-',
		'Toggle open',
		'Toggle closed',
		'-',
		'Delete record'
	]

//build menu
var menu = new Array
for ( var i = 0 ; i < valueList.length ; i++ ) {
	menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_control)
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

//allow popup to approximately work even when solutionPrefs isn't defined
if (application.__parent__.solutionPrefs) {
	var lineHeight = solutionPrefs.clientInfo.popupHack.lineHeight
	var topShift = solutionPrefs.clientInfo.popupHack.topShift
}
else {
	var lineHeight = 0
	var topShift = 0
}

var btnInvisible = application.getMethodTriggerElementName() + "_up"
var currentLocationX = elements[btnInvisible].getLocationX()
var currentLocationY = elements[btnInvisible].getLocationY()

//move "up" button to correct location
elements[btnInvisible].setLocation(currentLocationX, currentLocationY - (topShift + (menu.length * lineHeight)))

//pop up the popup menu
var elem = elements[btnInvisible]
if (elem != null) {
    plugins.popupmenu.showPopupMenu(elem, menu);
}

//set invisible btn back to original location
elements[btnInvisible].setLocation(currentLocationX, currentLocationY)


}

/**
 *
 * @properties={typeid:24,uuid:"047F9AA6-CACF-4B7B-8359-A7330A61109F"}
 */
function ACTIONS_list_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	wb_WEB_site
 *			  	
 *	ABOUT    :	manage web page actions
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	August 30, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch (arguments[0]) {
	case 0: //duplicate record
		REC_duplicate()
		break

	case 2: //toggle open
		TOGGLE_nodes(1)
		break
	
	case 3: //toggle closed
		TOGGLE_nodes(0)
		break
	
	case 5:	//delete record
		REC_delete()
		break	
}
}

/**
 *
 * @properties={typeid:24,uuid:"2B09F65D-91BF-4B0C-9998-AC016B30FEBC"}
 */
function FIND_path()
{

/*
 *	TITLE    :	FIND_path
 *			  	
 *	MODULE   :	wb_WEB_site
 *			  	
 *	ABOUT    :	find the full path to a tree node
 *			  	- useful for selecting a record
 *			  	
 *	INPUT    :	a record
 *			  	
 *	OUTPUT   :	array of pks (tree down to passed in record)
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FIND_path()
 *			  	
 *	MODIFIED :	August 30, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var input = arguments[0]

if (input && input.id_documentation) {
	var thisPage = input
	var treePath = new Array()
	treePath.unshift(thisPage.id_documentation)
	
	while (utils.hasRecords(thisPage.mgr_documentation_to_documentation__parent)) {
		thisPage = thisPage.mgr_documentation_to_documentation__parent.getRecord(1)
		treePath.unshift(thisPage.id_documentation)
	}
	
	return treePath
}


}

/**
 *
 * @properties={typeid:24,uuid:"5B464FE1-B5B8-4D75-897B-7DBC378BC754"}
 * @AllowToRunInFind
 */
function FORM_on_load()
{


//remove all existing bindings
elements.bean_tree.removeAllRoots()

var beanTree = elements.bean_tree.createBinding(controller.getServerName(),controller.getTableName()) 

//name of field to show in tree
beanTree.setTextDataprovider('title') 

//relation to build tree on
beanTree.setNRelationName('mgr_documentation_to_documentation__child') 

//sorting of children
beanTree.childSortDataprovider = 'globals.MGR_help_documentation_sort'

// Method to trigger when node is selected 
beanTree.setMethodToCallOnClick(REC_on_select,'id_documentation') 

//select the root nodes (the nodes without a parent) 
if (foundset.find()) { 
	// search for null values 
	foundset.parent_id_documentation = '^=' 
	var results = foundset.search()
	
	//manage the sort of the top-level nodes
	if (results) {
		foundset.sort('order_by asc')
	}
} 

//load the foundset into the treeview 
elements.bean_tree.addRoots(foundset)

}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"14FA60CF-6A50-4CA4-BA4E-BD95735FD65A"}
 */
function FORM_on_show(firstShow, event)
{

//not really form on show, just keeping form on load a bit cleaner
if (arguments[0]) {
	// load tooltips from tooltip module
	globals.TRIGGER_tooltip_set()
	
	//set selection path
	if (utils.hasRecords(foundset)) {
		elements.bean_tree.selectionPath = [id_documentation]
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"3B27CEC2-C382-4BE8-98E6-E7F8E6B636E7"}
 */
function MOVE_down()
{

/*
 *	TITLE    :	MOVE_down
 *			  	
 *	MODULE   :	wb_WEB_site
 *			  	
 *	ABOUT    :	re order selected item
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MOVE_down()
 *			  	
 *	MODIFIED :	August 30, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

MOVE_generic('down')


}

/**
 *
 * @properties={typeid:24,uuid:"E09E60AE-1370-4A66-8080-30A735B256E1"}
 * @AllowToRunInFind
 */
function MOVE_generic()
{

/*
 *	TITLE    :	MOVE_generic
 *			  	
 *	MODULE   :	wb_WEB_site
 *			  	
 *	ABOUT    :	move an item around
 *			  	
 *	INPUT    :	direction
 *			  	- up, down, in, out
 *			  	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MOVE_generic()
 *			  	
 *	MODIFIED :	August 30, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */	//MEMO: within groupings, sort potentially breaks if there are more than 200 records
//TODO: check and see if move is valid first, before creating the codable foundset

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var input = arguments[0]

var recMove = foundset.getRecord(foundset.getSelectedIndex())

//find current syblings
var fsPeers = databaseManager.getFoundSet(controller.getServerName(),controller.getTableName())
fsPeers.find()
fsPeers.parent_id_documentation = recMove.parent_id_documentation
var results = fsPeers.search()

if (results) {
	fsPeers.sort('order_by asc')
	fsPeers.selectRecord(recMove.id_documentation)
}

switch (input) {
	case 'up':
		//only move up if there are records above selected one
		if (fsPeers.getSelectedIndex() != 1) {
			//flag to redraw tree
			if (recMove.parent_id_documentation == 0) {
				var redraw = true
			}
			
			//get previous record
			var recordPrev = fsPeers.getRecord(fsPeers.getSelectedIndex() - 1)
			
			//swap ordering
			recordPrev.order_by = recMove.order_by
			recMove.order_by --
		}
		else {
			return
		}
		break
	case 'down':
		//only move down if there are records below selected one
		if (fsPeers.getSelectedIndex() != databaseManager.getFoundSetCount(fsPeers)) {
			//flag to redraw tree
			if (recMove.parent_id_documentation == 0) {
				var redraw = true
			}
			
			//get next record
			var recordNext = fsPeers.getRecord(fsPeers.getSelectedIndex() + 1)
			
			//swap ordering
			recordNext.order_by = recMove.order_by
			recMove.order_by ++
		}
		else {
			return
		}
		break
	case 'in':
		//only move in if this record isn't the first in the group AND there are syblings
		if (fsPeers.getSelectedIndex() != 1 && fsPeers.getSize() > 1) {
			//flag to redraw tree
			if (recMove.parent_id_documentation == 0) {
				var redraw = true
			}
			
			//flag to select
			var reselect = true
			
			//find new parent
			fsPeers.setSelectedIndex(fsPeers.getSelectedIndex() - 1)
			var idParent = fsPeers.id_documentation
			
			//find new syblings
			var fsPeersNew = databaseManager.getFoundSet(controller.getServerName(),controller.getTableName())
			fsPeersNew.find()
			fsPeersNew.parent_id_documentation = idParent
			var results = fsPeersNew.search()
	
			if (results) {
				fsPeersNew.sort('order_by asc')
			}
			
			//re-order everybody below current record in old foundset
			for (var i = recMove.order_by + 1; i <= fsPeers.getSize(); i++) {
				var recReorder = fsPeers.getRecord(i)
				
				recReorder.order_by --
			}
			
			//add recMove to bottom of new foundset
			recMove.order_by = (utils.hasRecords(fsPeersNew)) ? fsPeersNew.getSize() + 1 : 1
			recMove.parent_id_documentation = idParent
			
		}
		else {
			return
		}
		break
	case 'out':
		//only move out if node level not 0
		if (recMove.parent_id_documentation != 0) {
			//find new parent
			var idParent = recMove['mgr_documentation_to_documentation__parent'].parent_id_documentation
			
			//flag to redraw tree
			if (idParent == 0) {
				var redraw = true
			}
			
			//flag to select
			var reselect = true
			
			//find new syblings
			var fsPeersNew = databaseManager.getFoundSet(controller.getServerName(),controller.getTableName())
			fsPeersNew.find()
			fsPeersNew.parent_id_documentation = idParent
			var results = fsPeersNew.search()
	
			if (results) {
				fsPeersNew.sort('order_by asc')
			}
			
			//re-order everybody below current record in old foundset
			for (var i = recMove.order_by + 1; i <= fsPeers.getSize(); i++) {
				var recReorder = fsPeers.getRecord(i)
				
				recReorder.order_by --
			}
			
			//re-order everybody below current record in new foundset
			for (var i = recMove['mgr_documentation_to_documentation__parent'].order_by + 1; i <= fsPeersNew.getSize(); i++) {
				var recReorder = fsPeersNew.getRecord(i)
				
				recReorder.order_by ++
			}
			
			//insert recMove directly below former parent in new foundset
			recMove.order_by = recMove['mgr_documentation_to_documentation__parent'].order_by + 1
			recMove.parent_id_documentation = idParent
			
		}
		else {
			return
		}		
		break
}

databaseManager.saveData()

/*
//a top level node was touched
if (redraw) {
	FORM_on_load()
}
*/
//MEMO: as it turns out, when resorting, we need to blow out the whole tree
FORM_on_load()


//need to reselect
if (reselect) {
//	elements.bean_tree.setExpandNode([recMove.parent_id_documentation],true)
	elements.bean_tree.selectionPath = FIND_path(recMove)
}


}

/**
 *
 * @properties={typeid:24,uuid:"17EA60D4-E11A-4843-90B0-5FE4A92B5FE4"}
 */
function MOVE_in()
{

/*
 *	TITLE    :	MOVE_in
 *			  	
 *	MODULE   :	wb_WEB_site
 *			  	
 *	ABOUT    :	re order selected item
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MOVE_in()
 *			  	
 *	MODIFIED :	August 30, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

MOVE_generic('in')


}

/**
 *
 * @properties={typeid:24,uuid:"92578FC8-F807-4DAE-A81E-E8C628B3AB61"}
 */
function MOVE_out()
{

/*
 *	TITLE    :	MOVE_out
 *			  	
 *	MODULE   :	wb_WEB_site
 *			  	
 *	ABOUT    :	re order selected item
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MOVE_out()
 *			  	
 *	MODIFIED :	August 30, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

MOVE_generic('out')


}

/**
 *
 * @properties={typeid:24,uuid:"0ED5D5E9-90F4-4E83-ADEA-E7ED6F425D44"}
 */
function MOVE_up()
{

/*
 *	TITLE    :	MOVE_up
 *			  	
 *	MODULE   :	wb_WEB_site
 *			  	
 *	ABOUT    :	re order selected item
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	MOVE_up()
 *			  	
 *	MODIFIED :	August 30, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

MOVE_generic('up')


}

/**
 *
 * @properties={typeid:24,uuid:"EDACC42C-357F-4DDE-B03C-2FCA88E8A606"}
 * @AllowToRunInFind
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	wb_WEB_site
 *			  	
 *	ABOUT    :	delete record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_delete()
 *			  	
 *	MODIFIED :	August 30, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (utils.hasRecords(foundset)) {
	var delRec = globals.DIALOGS.showWarningDialog(
							'Delete record',
							'Do you really want to delete this record?',
							'Yes',
							'No'
						)
	
	if (delRec == 'Yes') {
		//where do we want to end up
		var parentID = foundset.parent_id_documentation
		var orderBy = foundset.order_by
		
		//delete it
		foundset.deleteRecord(foundset.getSelectedIndex())
		
		//find current syblings
		var fsPeers = databaseManager.getFoundSet(controller.getServerName(),controller.getTableName())
		fsPeers.find()
		fsPeers.parent_id_documentation = parentID
		var results = fsPeers.search()
		
		if (results) {
			fsPeers.sort('order_by asc')
		}
		
		//re-order everybody below current record in old foundset
		for (var i = orderBy; i <= fsPeers.getSize(); i++) {
			var recReorder = fsPeers.getRecord(i)
			
			recReorder.order_by --
		}
		
		
		//go to one above current location
		if (orderBy != 1) {
			foundset.find()
			foundset.parent_id_documentation = parentID
			foundset.order_by = orderBy - 1
			var results = foundset.search()
		}
		else {
			foundset.find()
			foundset.id_documentation = parentID
			var results = foundset.search()
		}
		
		//refire rec on select to select this one
		REC_on_select(foundset.id_documentation)
		elements.bean_tree.selectionPath = FIND_path(foundset.getRecord(foundset.getSelectedIndex()))
	}
}
else {
	globals.DIALOGS.showErrorDialog(
					'Error',
					'There are no records to delete'
			)
}
}

/**
 *
 * @properties={typeid:24,uuid:"EE663758-31DB-4BEC-8BE6-5DEAE35A4D9D"}
 * @AllowToRunInFind
 */
function REC_duplicate()
{

/*
 *	TITLE    :	REC_duplicate
 *			  	
 *	MODULE   :	wb_WEB_site
 *			  	
 *	ABOUT    :	delete record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_duplicate()
 *			  	
 *	MODIFIED :	August 30, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var srcRecord = foundset.getRecord(foundset.getSelectedIndex())

//find current syblings
var fsPeers = databaseManager.getFoundSet(controller.getServerName(),controller.getTableName())
fsPeers.find()
fsPeers.parent_id_documentation = srcRecord.parent_id_documentation
var results = fsPeers.search()

if (results) {
	fsPeers.sort('order_by asc')
	fsPeers.selectRecord(srcRecord.id_documentation)
}

//re-order everybody below current record in old foundset
for (var i = srcRecord.order_by + 1; i <= fsPeers.getSize(); i++) {
	var recReorder = fsPeers.getRecord(i)
	
	recReorder.order_by ++
}

var destRecord = globals.CODE_record_duplicate(srcRecord,null,true)

destRecord.order_by ++

//rebuild our form
FORM_on_load()

//set selection path
elements.bean_tree.selectionPath = FIND_path(destRecord)

//enter title field
forms.MGR_0F_documentation.elements.fld_title.selectAll()
forms.MGR_0F_documentation.elements.fld_title.requestFocus(false)



}

/**
 *
 * @properties={typeid:24,uuid:"A483DCFF-FDBB-4475-A797-5390A5BF4D4C"}
 * @AllowToRunInFind
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	create a new page record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_new()
 *			  	
 *	MODIFIED :	August 30, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get current location in the stack
if (utils.hasRecords(foundset)) {
	var oldRecord = foundset.getRecord(foundset.getSelectedIndex())
	
	//find current syblings
	var fsPeers = databaseManager.getFoundSet(controller.getServerName(),controller.getTableName())
	fsPeers.find()
	fsPeers.parent_id_documentation = oldRecord.parent_id_documentation
	var results = fsPeers.search()
	
	if (results) {
		fsPeers.sort('order_by asc')
		fsPeers.selectRecord(oldRecord.id_documentation)
	}
	
	//re-order everybody below current record in old foundset
	for (var i = oldRecord.order_by + 1; i <= fsPeers.getSize(); i++) {
		var recReorder = fsPeers.getRecord(i)
		
		recReorder.order_by ++
	}
	
	if (oldRecord.parent_id_documentation) {
		var newRecord = foundset.getRecord(foundset.newRecord(false,true))
		
		newRecord.parent_id_documentation = oldRecord.parent_id_documentation
		newRecord.order_by = oldRecord.order_by + 1
	}
	else {
		var newRecord = foundset.getRecord(foundset.newRecord(false,true))
		
		newRecord.order_by = oldRecord.order_by + 1
		
		elements.bean_tree.removeAllRoots()
		FORM_on_load()
	}
}
else {
	var newRecord = foundset.getRecord(foundset.newRecord(false,true))
	
	newRecord.order_by = 1
	
	elements.bean_tree.removeAllRoots()
	FORM_on_load()
}

var docID = newRecord.id_documentation
elements.bean_tree.refresh()
REC_on_select(docID)
elements.bean_tree.selectionPath = FIND_path(newRecord)

//enter first field
forms.MGR_0F_documentation.elements.fld_title.requestFocus(false)


}

/**
 *
 * @properties={typeid:24,uuid:"7D471D1D-B0B7-4985-92F7-33E73A56ED44"}
 * @AllowToRunInFind
 */
function REC_on_select()
{

//record clicked
var selectedRecord = arguments[0]

//make record clicked in tree be selected on foundset also
if (selectedRecord && utils.hasRecords(foundset)) {
	//just select that pk
	foundset.selectRecord(selectedRecord)
}
else {
	foundset.loadAllRecords()
}

//that record not already loaded, find it
if (utils.hasRecords(foundset) && id_documentation != selectedRecord) {
	foundset.find()
	foundset.id_documentation = selectedRecord
	var results = foundset.search()
}

}

/**
 *
 * @properties={typeid:24,uuid:"7CB1FFA8-B369-428A-811E-8B2242162D48"}
 */
function TOGGLE_nodes()
{

FORM_on_load()

switch(arguments[0]) {
	case 1:
		//set expansion level open
		elements.bean_tree.setNodeLevelVisible(10,true)
		break
	
	case 0:
	default:
		//set expansion level closed
		elements.bean_tree.setNodeLevelVisible(1,false)
		break
}


}
