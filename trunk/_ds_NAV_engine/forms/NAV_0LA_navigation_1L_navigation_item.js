/**
 *
 * @properties={typeid:24,uuid:"d82e492b-aefe-435c-99f0-485ad1f252dc"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	populates global var so that display_navigation_item and rec_selected calculations highlight list views
 *			  	loads correct forms into tab_list and tab_main tab panels on main layout
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	globals.FX_load_forms()
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.NAV_navigation_item_selected = id_navigation_item

//don't trigger the load form routine if navigating the history stack
if (this.skipLoadForms) {
	this.skipLoadForms = null
}
else {
	globals.FX_load_forms()
}
}

/**
 *
 * @properties={typeid:24,uuid:"fea42e4f-2794-4c5f-8d01-bf53f3c8b355"}
 */
function REC_open_close()
{

/*
 *	TITLE    :	REC_open_close
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	toggles expanded status of current navigation item
 *			  	shift expands/collapses all (opposite of what currently clicked on item is)
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	globals.CODE_key_pressed()
 *			  	
 *	MODIFIED :	Jan 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'NAV_0LA_navigation_1L_navigation_item'
var formNameReference = 'NAV_R_navigation_item'
var relationName = 'nav_navigation_item_to_navigation_item__children__all'
var currentID = id_navigation
var idNavItem = id_navigation_item
var keyPressed = globals.CODE_key_pressed()
var statusChildren = (forms[formName][relationName].getSize() > 1)

//exit if not on a triangle row
if (!(statusChildren && node_2 == 0)) {
	return
}

//shift-key held down, toggle expansion status
if (keyPressed == 1) {
	//toggle all expanded
	if (!row_status_expanded) {
		//find all nav records
		var findFoundset = forms[formNameReference].foundset
		findFoundset.clear()
		findFoundset.find()
		findFoundset.id_navigation = currentID
		var results = findFoundset.search()
		
		if (results) {
			//set status on all records
			var fsUpdater = databaseManager.getFoundSetUpdater(findFoundset)
			fsUpdater.setColumn('row_status_show', 1)
			fsUpdater.setColumn('row_status_expanded',1)
			fsUpdater.performUpdate()
			databaseManager.saveData()
			
			//perform search
			forms[formName].controller.find()
			forms[formName].row_status_show = 1
			forms[formName].id_navigation = currentID
			forms[formName].controller.search()
		}
	}
	//toggle all collapsed
	else if (row_status_expanded) {
		//find all nav records
		var findFoundset = forms[formNameReference].foundset
		findFoundset.clear()
		findFoundset.find()
		findFoundset.id_navigation = currentID
		var results = findFoundset.search()
		
		if (results) {
			//set status on all records
			var fsUpdater = databaseManager.getFoundSetUpdater(findFoundset)
			fsUpdater.setColumn('row_status_show', 0)
			fsUpdater.setColumn('row_status_expanded',0)
			fsUpdater.performUpdate()
			databaseManager.saveData()
			
			//find all node 1's
			findFoundset.find()
			findFoundset.id_navigation = currentID
			findFoundset.node_2 = 0
			var results = findFoundset.search()
			
			if (results) {
				//set node 1's to visible
				var fsUpdater = databaseManager.getFoundSetUpdater(findFoundset)
				fsUpdater.setColumn('row_status_expanded',0)
				fsUpdater.setColumn('row_status_show',1)
				fsUpdater.performUpdate()
			}
			
			//find all visible records
			forms[formName].controller.find()
			forms[formName].row_status_show = 1
			forms[formName].id_navigation = currentID
			forms[formName].controller.search()
		}
	}
}
//open/close individual subset
else {
	/******
		BEGIN COLLAPSING LOGIC
	******/
	
	//based off a new relation
	relationName = 'nav_navigation_item_to_navigation_item__children'
	
	/**********
		if expanded
		this record: expanded = 0 and show = 1
		all child records: show = 0
	***********/
	
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
