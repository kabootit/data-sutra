/**
 *
 * @properties={typeid:24,uuid:"e59b4ce1-2d0c-4e74-899b-b9246a707466"}
 */
function GET_next_chunk()
{

/*
 *	TITLE    :	GET_next_chunk
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	loads in next x records
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GET_next_chunk()
 *			  	
 *	MODIFIED :	August 4, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */



}

/**
 *
 * @properties={typeid:24,uuid:"5ff7cd8f-2d69-4fd5-bdda-9f3d163c436d"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	true/false add to top of set or bottom
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_new()
 *			  	
 *	MODIFIED :	June 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var addOnTop = (arguments[0]) ? true : false

//unhighlight current record
//UL_set_selected(foundset.getSelectedIndex(),true)
UL_set_selected(
		null,
		true
	)

//turn off REC_on_select
this.configured = false

//put new record on top (if specified)
var record = foundset.getRecord(foundset.newRecord(addOnTop,true))

//add this record to the black list
navigationPrefs.foundsetPool.omitPKs[navigationPrefs.foundsetPool.omitPKs.length] = record.id_universal_list

//turn on REC_on_select
this.configured = true

//get data for record under index...
REC_refresh(foundset.getSelectedIndex())
}

/**
 *
 * @properties={typeid:24,uuid:"d3cb340c-9854-43e7-b8de-2e610544402d"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	(de-)/highlight rows
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Jun 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs && this.configured) {
	
	//timed out, throw up error
	if (solutionPrefs.config.prefs.thatsAllFolks) {
		forms.DPLY_0F_solution__license.ACTION_status()
		
		plugins.dialogs.showErrorDialog(
							'Demo expired',
							'Demo time expired\n' +
							'Please restart.'
						)
	}
	
	var formName = solutionPrefs.config.currentFormName
	var currentNavItem = solutionPrefs.config.currentFormID
	
	//show busy indicator while changing record
	if (navigationPrefs.byNavItemID[currentNavItem].navigationItem.ulBusyIndicator) {
		var busyIndicator = true
		
		plugins.sutra.busyCursor = true
	}
	
	globals.CALLBACK_timer('start')
	
	var serverName = forms[formName].controller.getServerName()
	var tableName = forms[formName].controller.getTableName()
	var foundsetCount = databaseManager.getFoundSetCount(forms[formName].foundset)
	var rowSelected = foundset.getSelectedIndex()
	var lastRec = foundset.getSize()
	var logClick = (solutionPrefs.analytics && solutionPrefs.analytics.logging) ? solutionPrefs.analytics.logging.Record : false

	//LOG record navigation
	//only run when using query based way to hit repository
	if (!solutionPrefs.repository.api) {
		var pkName = solutionPrefs.repository.allFormsByTable[serverName][tableName].primaryKey
		var pkActedOn = forms[formName][pkName]
	}
	else {
		var pkName = 'repositoryAPINotImplemented'
		var pkActedOn = 0
	}
	
	//record not clicked on before, throw up busy bar and busy cursor
	var record = forms[formName].foundset.getRecord(rowSelected)
	if (navigationPrefs.byNavItemID[currentNavItem].navigationItem.initialRecord && !navigationPrefs.byNavItemID[currentNavItem].listData.visitedPKs[record[pkName]]) {
		var recNotLoaded = true
		
		//don't turn busy indicator on if it is already on
		if (!busyIndicator) {
			plugins.sutra.busyCursor = true
		}
		globals.CALLBACK_progressbar_start(-273, navigationPrefs.byNavItemID[currentNavItem].navigationItem.initialRecordLabel)
	}
	
	//log if requested
	if (logClick) {
		globals.CALLBACK_log_create('Records',
							serverName,
							tableName,
							pkName,
							pkActedOn
							)
	}
	
	//normally select record
	if (lastRec > rowSelected || rowSelected == foundsetCount) {
		//navigate to selected record on workflow form
		forms[formName].controller.setSelectedIndex(rowSelected)
		
		//save time when pk of this record last accessed
		navigationPrefs.byNavItemID[currentNavItem].listData.visitedPKs[(forms[formName][pkName] != 'repositoryAPINotImplemented') ? forms[formName][pkName] : 0] = application.getServerTimeStamp()
		
		//update highlighting
		UL_set_selected(navigationPrefs.byNavItemID[currentNavItem].listData.index.selected,rowSelected,lastRec,foundsetCount)
	}
	//need to load in next chunk of records before selecting record
		//MEMO: this is only triggered when the down arrows are clicked on
	else {		
		//navigate to selected record on workflow form
		//first time loads in next set, then selects correct record
		//forms[formName].foundset.setSelectedIndex(rowSelected+1)
		forms[formName].controller.setSelectedIndex(rowSelected)

		//save time when pk of this record last accessed
		navigationPrefs.byNavItemID[currentNavItem].listData.visitedPKs[(forms[formName][pkName] != 'repositoryAPINotImplemented') ? forms[formName][pkName] : 0] = application.getServerTimeStamp()
		
		//redraw list
		var uniList = navigationPrefs.byNavItemID[currentNavItem].listData.tabFormInstance
		forms[uniList].UL_sync_records(false,true)
	}
	
	//save currently selected index
	navigationPrefs.byNavItemID[currentNavItem].listData.index.selected = rowSelected
	
	globals.CALLBACK_toolbar_record_navigator_set()
	
	globals.CALLBACK_timer('stop')
	
	//record was not in memory, turn off busy bar and busy cursor
	if (recNotLoaded) {
		globals.CALLBACK_progressbar_stop()
		plugins.sutra.busyCursor = false	
	}
	//changing record, finished turn off busy indicatar
	else if (busyIndicator) {
		plugins.sutra.busyCursor = false	
	}

}

}

/**
 *
 * @properties={typeid:24,uuid:"43578113-dafb-44c3-9926-349652bf063a"}
 */
function REC_refresh()
{

/*
 *	TITLE    :	REC_refresh
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_refresh()
 *			  	
 *	MODIFIED :	June 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var refreshIndex = foundset.getSelectedIndex()
var formUL = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.tabFormInstance

//refresh data under currently selected index
forms[formUL].UL_fill_data(null,refreshIndex)
//application.updateUI()
}

/**
 *
 * @properties={typeid:24,uuid:"ced4a9cd-5783-4dc2-889f-ebc761061792"}
 */
function UL_set_selected()
{

/*
 *	TITLE    :	UL_set_selected
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	(de-)/highlight rows
 *			  	
 *	INPUT    :	1- index to unSelect
 *			  	2- index to Select (pass true in if you only want unhighlight the currently selected record)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	June 16, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

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

var formName = solutionPrefs.config.currentFormName
var currentNavItem = solutionPrefs.config.currentFormID
var formUL = navigationPrefs.byNavItemID[currentNavItem].listData.tabFormInstance
var rowUnselected = (arguments[0]) ? arguments[0] : navigationPrefs.byNavItemID[currentNavItem].listData.index.selected
var rowSelected = (arguments[1]) ? arguments[1] : forms[formName].foundset.getSelectedIndex()
var lastRec = (arguments[2]) ? arguments[2] : foundset.getSize()
var foundsetCount = (arguments[3]) ? arguments[3] : databaseManager.getFoundSetCount(forms[formName].foundset)

//change highlight if different rows
if (typeof rowSelected == 'boolean' || rowUnselected != rowSelected) {
	
	//unhighlight last index
	if (rowUnselected) {
		var recordOld = foundset.getRecord(rowUnselected)
		
		//data has disappeared, pump it back in
		if (!recordOld.display) {
			forms[formUL].DISPLAY_list(true)
		}
		//normal unhighlight
		else {
			if (rowUnselected <= lastRec || rowUnselected == foundsetCount) {
				recordOld.display = recordOld.display.replace(/td class="rowSelected" width/g, 'td width')
			}
			else {
				recordOld.display = recordOld.display.replace(/th class="rowSelected" width/g, 'th width')
			}
		}
	}
	
	//highlight clicked index
	if (typeof rowSelected == 'number') {
		var recordNew = foundset.getRecord(rowSelected)
		
		//data has disappeared, pump it back in
		if (!recordNew.display) {
			//REC_refresh(rowSelected)
			forms[formUL].DISPLAY_list(true)
		}
		//normal highlight
		else {
			if (rowSelected < lastRec || rowSelected == foundsetCount) {
				recordNew.display = recordNew.display.replace(/td width/g, 'td class="rowSelected" width')
			}
			else {
				recordNew.display = recordNew.display.replace(/th width/g, 'th class="rowSelected" width')
			}
		}
	}
	
	//save current status of selected row
	navigationPrefs.byNavItemID[currentNavItem].listData.index.selected = forms[formName].controller.getSelectedIndex()
	
	//set date last modified
	navigationPrefs.byNavItemID[currentNavItem].listData.dateModified = application.getServerTimeStamp()
}
	

}
