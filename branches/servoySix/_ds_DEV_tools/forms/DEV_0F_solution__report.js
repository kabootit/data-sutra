/**
 *
 * @properties={typeid:24,uuid:"35ce13ed-5ac9-4a14-a688-3d6d4a37ad52"}
 */
function PRINT_feedback()
{
plugins.dialogs.showInfoDialog('Coming soon','The feedback report is coming soon...')
}

/**
 *
 * @properties={typeid:24,uuid:"6f62f1b0-c8ab-4875-a017-e848004c581b"}
 */
function PRINT_overview_detailed()
{
plugins.dialogs.showInfoDialog('Coming soon','The detailed navigation reports is coming soon...')
}

/**
 *
 * @properties={typeid:24,uuid:"4aa32ac5-1415-404a-9212-ec7c95dfdcb6"}
 */
function PRINT_overview_simple()
{

/*
 *	TITLE    :	PRINT_overview_simple
 *			  	
 *	MODULE   :	ds_DEV_developer
 *			  	
 *	ABOUT    :	get sets to operate on
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//set today string
globals.DEV_today = globals.CODE_date_format(new Date())

application.showFormInDialog(forms.DEV_P_navigation, -1, -1, -1, -1, 'Choose navigation', false, false,'printOverviewSimple')

if (globals.DEV_P_navigation) {
	var navIDs = globals.DEV_P_navigation.split('\n')
	globals.DEV_P_navigation = null
}

//sets are selected for reporting
if (navIDs && navIDs.length) {
/*
	//convert array to dataset
	var dataset = databaseManager.convertToDataSet(navIDs)
	
	//load dataset into navigation foundset
	var navSets = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation')
	navSets.clear()
	navSets.loadRecords(dataset)
*/
	//get foundset and records
	var navItems = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation_item')
	navItems.clear()
	for (var i = 0; i < navIDs.length; i++) {
		navItems.find()
		navItems.id_navigation = navIDs[i]
		
		//start from scratch on the first request
		if (i == 0 ) {
			navItems.search(true)
		}
		//extend for the rest
		else {
			navItems.search(false,false)
		}
	}
	
	if (navItems.getSize()) {
		//sort
		navItems.sort('nav_navigation_item_to_navigation.nav_name asc, node_1 asc, node_2 asc')
		
		//load records
		forms.DEV_RPT_navigation_overview_simple.controller.loadRecords(navItems)
		
		//show print preview
		forms.DEV_RPT_navigation_overview_simple.controller.showPrintPreview()
	}
	
}
else {
	plugins.dialogs.showErrorDialog('No report','No navigation sets were selected to report on')
}
}

/**
 *
 * @properties={typeid:24,uuid:"c4c1e1c7-db59-4720-a385-0f40e1039c69"}
 */
function PRINT_solution_overview()
{

/*
 *	TITLE    :	PRINT_solution_overview
 *			  	
 *	MODULE   :	ds_DEV_developer
 *			  	
 *	ABOUT    :	get sets to operate on
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//set today string
globals.DEV_today = globals.CODE_date_format(new Date())

//show print preview
forms.DEV_RPT_solution_overview.controller.showPrintPreview()
}

/**
 *
 * @properties={typeid:24,uuid:"dd6b8aad-6514-4097-94ef-defe4c395dc9"}
 */
function PRINT_spec_notes()
{

/*
 *	TITLE    :	PRINT_spec_notes
 *			  	
 *	MODULE   :	ds_DEV_developer
 *			  	
 *	ABOUT    :	get sets to operate on
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var relnNavItem = 'dev_specification_to_navigation_item'
var relnNavSet = 'nav_navigation_item_to_navigation'

//set today string
globals.DEV_today = globals.CODE_date_format(new Date())

application.showFormInDialog(forms.DEV_P_navigation, -1, -1, -1, -1, 'Choose navigation', false, false,'printOverviewSimple')

if (globals.DEV_P_navigation) {
	var navIDs = globals.DEV_P_navigation.split('\n')
	globals.DEV_P_navigation = null
}

//sets are selected for reporting
if (navIDs && navIDs.length) {
	
	var serverName = controller.getServerName()
	var query
	var maxReturnedRows = 10000
	var dataset
	
	//get all nav items
	query = 'SELECT id_navigation_item FROM sutra_navigation_item WHERE id_navigation IN ('
		for (var i = 0; i < navIDs.length; i++) {
			if (i != 0) {
				query += ','
			}
			query += '?'
		}
		query += ')'
	dataset = databaseManager.getDataSetByQuery(serverName, query, navIDs, maxReturnedRows)
	var navItemIDs = dataset.getColumnAsArray(1)
	
	//get spec data
	query = 'SELECT id_specification ' +
			'FROM sutra_specification ' +
			'WHERE notes IS NOT null AND ' +
			'id_navigation_item IN ('
		for (var i = 0; i < navItemIDs.length; i++) {
			if (i != 0) {
				query += ','
			}
			query += '?'
		}
		query += ')'
	dataset = databaseManager.getDataSetByQuery(serverName, query, navItemIDs, maxReturnedRows)
	
	//get foundset and records
	var specs = databaseManager.getFoundSet(controller.getServerName(),'sutra_specification')
	specs.clear()
	specs.loadRecords(dataset)
	
	if (specs.getSize()) {
		//sort
		specs.sort('dev_specification_to_navigation_item.id_navigation asc, dev_specification_to_navigation_item.node_1 asc, dev_specification_to_navigation_item.node_2 asc')
		
		//html header junk
		var html = '<html><head></head><body style="font-size:7px;"><table cellpadding="2" cellspacing="0" width="100%">'
		
		var set = ' '
		
		for (var i = 1; i <= specs.getSize(); i++) {
			var record = specs.getRecord(i)
			
			//actual text
			var noteMod = utils.stringReplace(record.notes,'\n','<br>')
			
			//punch down set
			if (set != record[relnNavItem][relnNavSet].nav_name) {
				set = record[relnNavItem][relnNavSet].nav_name
				html += '<tr bgcolor = "#cccccc"><td style="font-weight: bold;" colspan="3">' + set + '</td></tr>'
			}
			
			/*
			//alternating row color
			if (i % 2) {
				var color = ' bgcolor = "#eeeeee">'
			}
			else {
				var color = '>'
			}
			*/
			
			//first row has: item_name (item_id) | module | form
			html += '<tr height="20" bgcolor = "#eeeeee">' +
						'<td valign="top">' + record[relnNavItem].item_name + ((record[relnNavItem].item_id) ? (' (' + record[relnNavItem].item_id + ')') : '') + '</td>' +
						'<td valign="top">' + ((record[relnNavItem].module_filter) ? '[' + record[relnNavItem].module_filter  + ']' : '') + '</td>' +
						'<td valign="top">' + ((record[relnNavItem].form_to_load) ? 'forms.' + record[relnNavItem].form_to_load : '') + '</td></tr>' +
			//second row has: note
					'<tr height="20">' +
						'<td colspan="3">' + noteMod + '</td></tr>'
		}
		html += '</table></body></html>'
		
		globals.DEV_html_global = html
		
		//show print preview
		forms.DEV_RPT_developer_notes__spec.controller.showPrintPreview()
	}
	else {
		plugins.dialogs.showErrorDialog('No report','There are no specs for the selected navigation sets')
	}
}
else {
	plugins.dialogs.showErrorDialog('No report','No navigation sets were selected to report on')
}
}

/**
 *
 * @properties={typeid:24,uuid:"9c30be61-b37d-4489-80a7-670eae5b61ca"}
 */
function PRINT_task_notes()
{

/*
 *	TITLE    :	PRINT_task_notes
 *			  	
 *	MODULE   :	ds_DEV_developer
 *			  	
 *	ABOUT    :	get sets to operate on
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	May 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var relnNavItem = 'dev_task_to_navigation_item'
var relnNavSet = 'nav_navigation_item_to_navigation'

//set today string
globals.DEV_today = globals.CODE_date_format(new Date())

application.showFormInDialog(forms.DEV_P_navigation, -1, -1, -1, -1, 'Choose navigation', false, false,'printOverviewSimple')

if (globals.DEV_P_navigation) {
	var navIDs = globals.DEV_P_navigation.split('\n')
	globals.DEV_P_navigation = null
}

//sets are selected for reporting
if (navIDs && navIDs.length) {
	
	var serverName = controller.getServerName()
	var query
	var maxReturnedRows = 10000
	var dataset
	
	//get all nav items
	query = 'SELECT id_navigation_item FROM sutra_navigation_item WHERE id_navigation IN ('
		for (var i = 0; i < navIDs.length; i++) {
			if (i != 0) {
				query += ','
			}
			query += '?'
		}
		query += ')'
	dataset = databaseManager.getDataSetByQuery(serverName, query, navIDs, maxReturnedRows)
	var navItemIDs = dataset.getColumnAsArray(1)
	
	//get task data
	query = 'SELECT id_task ' +
			'FROM sutra_task ' +
			'WHERE notes IS NOT null AND ' +
			'id_navigation_item IN ('
		for (var i = 0; i < navItemIDs.length; i++) {
			if (i != 0) {
				query += ','
			}
			query += '?'
		}
		query += ')'
	dataset = databaseManager.getDataSetByQuery(serverName, query, navItemIDs, maxReturnedRows)
	
	//get foundset and records
	var tasks = databaseManager.getFoundSet(controller.getServerName(),'sutra_task')
	tasks.clear()
	tasks.loadRecords(dataset)
	
	if (tasks.getSize()) {
		//sort
		tasks.sort('flag_done asc, dev_task_to_navigation_item.id_navigation asc, dev_task_to_navigation_item.node_1 asc, dev_task_to_navigation_item.node_2 asc')
		
		//html header junk
		var html = '<html><head></head><body style="font-size:7px;"><table cellpadding="2" cellspacing="0" width="100%">'
		
		var set = ' '
		var status = ' '
		
		for (var i = 1; i <= tasks.getSize(); i++) {
			var record = tasks.getRecord(i)
			
			//actual text
			var noteMod = utils.stringReplace(record.notes,'\n','<br>')
			
			//punch down status
			if (status != ((record.flag_done) ? 'Closed' : 'Open')) {
				status = ((record.flag_done) ? 'Closed' : 'Open')
				html += '<tr bgcolor = "#aaaaaa"><td style="font-weight: bold; font-color: white;" colspan="4">' + 'Status: ' + status + '</td></tr>'
				
				//reset set
				set = ' '
			}
			
			//punch down set
			if (set != record[relnNavItem][relnNavSet].nav_name) {
				set = record[relnNavItem][relnNavSet].nav_name
				html += '<tr bgcolor = "#cccccc"><td style="font-weight: bold;" colspan="4">' + set + '</td></tr>'
			}
			
			/*
			//alternating row color
			if (i % 2) {
				var color = ' bgcolor = "#eeeeee">'
			}
			else {
				var color = '>'
			}
			*/
			
			//first row has: item_name (item_id) | module | form | completed status
			html += '<tr height="20" bgcolor = "#eeeeee">' +
						'<td valign="top">' + record[relnNavItem].item_name + ((record[relnNavItem].item_id) ? (' (' + record[relnNavItem].item_id + ')') : '') + '</td>' +
						'<td valign="top">' + ((record[relnNavItem].module_filter) ? '[' + record[relnNavItem].module_filter  + ']' : '') + '</td>' +
						'<td valign="top">' + ((record[relnNavItem].form_to_load) ? 'forms.' + record[relnNavItem].form_to_load : '') + '</td>' +
						'<td valign="top"' + ((record.flag_done) ? ' style="font-weight: bold;"' : '') + '>' + ((record.flag_done) ? 'Completed ' + globals.CODE_date_format(record.date_completed,'current') : 'Open') + '</td></tr>' +
			//second row has: note
					'<tr height="20">' +
						'<td colspan="4">' + noteMod + '</td></tr>'
		}
		html += '</table></body></html>'
		
		globals.DEV_html_global = html
		
		//show print preview
		forms.DEV_RPT_developer_notes__task.controller.showPrintPreview()
	}
	else {
		plugins.dialogs.showErrorDialog('No report','There are no tasks for the selected navigation sets')
	}
}
else {
	plugins.dialogs.showErrorDialog('No report','No navigation sets were selected to report on')
}
}

/**
 *
 * @properties={typeid:24,uuid:"fceb66f1-55f5-4aa3-840e-af8a2c366107"}
 */
function PRINT_tooltips()
{

if (forms.MGR_0F_tooltip && forms.MGR_0F_tooltip.PRINT_TIP_report) {
	forms.MGR_0F_tooltip.PRINT_TIP_report()
}
}
