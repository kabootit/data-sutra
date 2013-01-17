/**
 *
 * @properties={typeid:24,uuid:"b41cbc06-4f50-4809-bdd8-57ea68c34231"}
 */
function FLD_data_change__nav_default()
{

/*
 *	TITLE    :	FLD_data_change__nav_default
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	set current navigation item record as only default and makes sure that it is active
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if (nav_default) {
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset)
	fsUpdater.setColumn('nav_default',0)
	fsUpdater.performUpdate()
	nav_default = 1
	nav_status = 1
}

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"96b0ea4b-50b4-47f9-aaac-df1159b323b9"}
 */
function FLD_data_change__nav_status()
{

/*
 *	TITLE    :	FLD_data_change__nav_status
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	re-set navigation sets available if running without login
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 6, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

//if currently default and not showing, make not default
if (nav_default && !nav_status) {
	nav_default = 0
	databaseManager.saveData()
}


//login disabled?
if (application.__parent__.solutionPrefs && solutionPrefs.access && solutionPrefs.access.accessControl == false) {
	//get all active navigation sets
	var maxReturnedRows = 100
	var query = 'SELECT id_navigation, nav_name, nav_status ' +
				'FROM sutra_navigation ' +
				'WHERE nav_status = 1 ' +
				'ORDER BY nav_name ASC'
	var args = null
	var dataset = databaseManager.getDataSetByQuery(controller.getServerName(), query, args, maxReturnedRows)
	
	var navigationSets = dataset.getColumnAsArray(1)
	var navSetNames = dataset.getColumnAsArray(2)
	
	//set value list
	application.setValueListItems("NAV_navigation_set", navSetNames, navigationSets)
}
}

/**
 *
 * @properties={typeid:24,uuid:"29f4bc9f-782a-4b53-9df2-b461f06784b3"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	populates global variable so that display_navigation and rec_selected calculations highlight list views
 *			  	load records into workflow area
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//turn busy on
globals.CODE_cursor_busy(true)

globals.NAV_navigation_selected = id_navigation

//load records into main pane
var formName = 'NAV_0L_navigation_item'
var relationName = 'nav_navigation_to_navigation_item__set'

forms.NAV_0F_navigation_item__inline.controller.loadRecords(forms[formName][relationName])
forms.NAV_0F_navigation_item__inline.controller.sort('node_1 asc, node_2 asc')

//refire rec_on_select for tano
forms.NAV_0L_navigation_item_1L.REC_on_select()

//turn busy off
globals.CODE_cursor_busy(false)
}
