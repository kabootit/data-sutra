/**
 *
 * @properties={typeid:24,uuid:"166ffc65-8f3d-423b-9044-ecd63dec242c"}
 */
function FORM_on_load()
{
elements.fld_id_navigation.visible = false
elements.fld_node_1.visible = false
elements.fld_node_2.visible = false
elements.fld_show.visible = false
elements.fld_expanded.visible = false
}

/**
 *
 * @properties={typeid:24,uuid:"9a9b30cd-8ca7-48ff-ba8e-ebbe5eee9f76"}
 */
function REC_on_select()
{


/*
 *	TITLE:		REC_on_select
 *
 *	MODULE:		ds_NAV_navigation_standard
 *
 *	ABOUT:		Populates global var so that display_x and rec_selected calculations highlight list views
 *
 *	MODIFIED:	Sept 5, 2007 - Troy Elliott, Data Mosaic
 *
 */

//turn busy on
globals.CODE_cursor_busy(true)

globals.NAV_navigation_item_selected = id_navigation_item

//turn busy off
globals.CODE_cursor_busy(false)
}

/**
 *
 * @properties={typeid:24,uuid:"336a45b8-f912-4aa6-aa83-e239a38347c7"}
 */
function REC_open_close()
{


var formName = 'NAV_0L_navigation_item_1L'
var relationName = 'nav_navigation_item_to_navigation_item__children__all'
var currentID = id_navigation
var idNavItem = id_navigation_item
var keyPressed = globals.CODE_key_pressed()

//shift-key held down, toggle all expanded
if (keyPressed == 1) {
	//perform search
	forms[formName].controller.find()
	forms[formName].id_navigation = currentID
	forms[formName].controller.search()
	
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset)
	fsUpdater.setColumn('row_status_expanded',1)
	fsUpdater.setColumn('row_status_show',1)
	fsUpdater.performUpdate()
	
	//perform search
	forms[formName].controller.find()
	forms[formName].row_status_show = 1
	forms[formName].id_navigation = currentID
	forms[formName].controller.search()
}
//alt/option-key held down, toggle all collapsed
else if (keyPressed == 8) {
	//find all nav records
	forms[formName].controller.find()
	forms[formName].id_navigation = currentID
	forms[formName].controller.search()
	
	//set all to collapsed and not visible
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset)
	fsUpdater.setColumn('row_status_expanded',0)
	fsUpdater.setColumn('row_status_show',0)
	fsUpdater.performUpdate()
	
	//final all node 1's
	forms[formName].controller.find()
	forms[formName].id_navigation = currentID
	forms[formName].node_2 = 0
	forms[formName].controller.search()
	
	//set node 1's to visible
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset)
	fsUpdater.setColumn('row_status_expanded',0)
	fsUpdater.setColumn('row_status_show',1)
	fsUpdater.performUpdate()
	
	//find all visible records
	forms[formName].controller.find()
	forms[formName].row_status_show = 1
	forms[formName].id_navigation = currentID
	forms[formName].controller.search()
}
//open/close individual subset
else {
	/******
		BEGIN COLLAPSING LOGIC
	******/
	
	var status_children = (forms[formName][relationName].getSize() > 1)
	
	//exit if not on a triangle row
	if (!(status_children && node_2 == 0)) {
		return
	}
	
	/**********
		if expanded
		this record: expanded = 0 and show = 1
		all child records: show = 0
	***********/
	
	relationName = 'nav_navigation_item_to_navigation_item__children'
	if (row_status_expanded) {
	
		//set status on sub records
		var fsUpdater = databaseManager.getFoundSetUpdater(forms[formName][relationName])
		fsUpdater.setColumn('row_status_show', 0)
		fsUpdater.performUpdate()
	
	
		//set status fields on selected record
		row_status_expanded = 0
		row_status_show = 1
		controller.saveData()
	}	
		
	/**********
		if NOT expanded
		this record: expanded = 1 and show = 1
		all child records: show = 1
	***********/
	
	else {
	
		//set status on sub records
		var fsUpdater = databaseManager.getFoundSetUpdater(forms[formName][relationName])
		fsUpdater.setColumn('row_status_show', 1)
		fsUpdater.performUpdate()
	
		//set status fields on selected record
		row_status_expanded = 1
		row_status_show = 1
		controller.saveData()
	
	}
	
	
	//perform search
	//forms[formName].controller.loadAllRecords()
	forms[formName].controller.find()
	forms[formName].row_status_show = 1
	forms[formName].id_navigation = currentID
	forms[formName].controller.search()
}	

//sort and recalculate
forms[formName].controller.sort('node_1 asc, node_2 asc')

//select correct record
forms[formName].foundset.selectRecord(idNavItem)
}
