/**
 *
 * @properties={typeid:24,uuid:"ea904246-3624-4d4b-896e-12b99239f188"}
 */
function FORM_on_hide()
{

//if column picker still visible, close it
application.closeFormDialog('displayCols')

}

/**
 *
 * @properties={typeid:24,uuid:"53965fc0-813d-4673-926b-e3599a401ab9"}
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
 * @properties={typeid:24,uuid:"f5b8795e-ba9b-4ada-acfe-d1ca4d129dcd"}
 */
function REC_delete()
{

/*
 *	TITLE:		REC_delete
 *
 *	MODULE:		ds_NAV_navigation_standard
 *
 *	ABOUT:		Deletes current record
 *
 *	MODIFIED:	Aug 29, 2007 - Troy Elliott, Data Mosaic
 *
 */

var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this list display?','Yes','No')

var formName = 'NAV_0F_navigation_item_1F__universal_lists'
var relnName = 'nav_navigation_item_to_list_display'

var defaultDisplay = false

if (delRec == 'Yes') {
	//check if selected record is default display
	if (forms[formName][relnName].display_default) {
		defaultDisplay = true
	}
	forms[formName][relnName].deleteRecord()
}

//de-activate universal list if no displays
if (!forms[formName][relnName].getSize()) {
	use_fw_list = 0
	REC_on_select()
}
//if deleted display was the default, set the currently selected one to be the default
else if (defaultDisplay) {
	forms[formName][relnName].display_default = 1
}
}

/**
 *
 * @properties={typeid:24,uuid:"d764e632-c943-4971-bdec-a49ffcf7c4a3"}
 */
function REC_new()
{

var formName = 'NAV_0F_navigation_item_1F__universal_lists'
var relnName = 'nav_navigation_item_to_list_display'

var displayDefault = false

if (!forms[formName][relnName].getSize()) {
	displayDefault = true
}

forms[formName][relnName].newRecord(false,true)

if (displayDefault) {
	forms[formName][relnName].display_default = 1
}
forms[formName][relnName].row_order = forms[formName][relnName].getSize()

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"602264fc-a406-4e0a-a642-31199b0da4c9"}
 */
function REC_on_select()
{

//enable/disable elements

var useFWList = (use_fw_list) ? true : false

elements.btn_rec_new.enabled = useFWList
//elements.btn_rec_del.enabled = useFWList
elements.tab_list.enabled = useFWList
elements.tab_detail.enabled = useFWList


//check that total percent is less than 100

var formName = 'NAV_0F_navigation_item_1F__universal_lists_2F_list_display__left_3L_list_display_item'
if (forms[formName].total_width > 100) {
	forms[formName].elements.lbl_footer.fgcolor = '#FF0000'
}
else {
	forms[formName].elements.lbl_footer.fgcolor = '#000000'
}
}
