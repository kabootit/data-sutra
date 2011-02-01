/**
 *
 * @properties={typeid:24,uuid:"e18321e9-bc33-429d-a48b-6b8c87a649d9"}
 */
function FORM_on_load()
{

globals.TAB_change_grid_init()
LOAD_records()
}

/**
 *
 * @properties={typeid:24,uuid:"6b587c63-d4eb-4f69-8509-ce2ed9f325a1"}
 */
function LOAD_records()
{


//load selected records for this type of toolbar

var toolType = elements.tab_detail.tabIndex

var groupID = forms.AC_0F_group.id_group

var fsGroupTool = forms.AC_0F_group__toolbar_1L_group_toolbar.foundset

fsGroupTool.find()
fsGroupTool.id_group = groupID
fsGroupTool.toolbar_type = toolType
fsGroupTool.flag_chosen = 1
var results = fsGroupTool.search()

forms.AC_0F_group__toolbar_1L_group_toolbar.TOGGLE_order_by()


}

/**
 *
 * @properties={typeid:24,uuid:"6c33d4ab-ac83-4134-a944-d2551672926c"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	show pop up with unassigned status view widgets to display
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

// CREATE RECORDS IN FID NOT ALREADY ASSIGNED
// distinction is flag_chosen

//find all available actions
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'SELECT id_toolbar FROM sutra_toolbar WHERE row_status_show = 1',
                null,
                -1)
var allToolbars = dataset.getColumnAsArray(1)

//find group viewer merge records
var groupToolbar = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_group_toolbar')
groupToolbar.clear()
groupToolbar.find()
groupToolbar.id_group = globals.AC_group_selected
var results = groupToolbar.search()

//create group_viewer merge records if don't exist
for ( var i = 0 ; i < allToolbars.length ; i++ ) {
	var matchFlag = false
	for ( var j = 0 ; j < groupToolbar.getSize() && !matchFlag ; j++ ) {
		var record = groupToolbar.getRecord(j + 1)
		if (record.id_toolbar == allToolbars[i]) {
			matchFlag = true
		}
	}
	//if no match found, create record
	if(!matchFlag) {
		var record = groupToolbar.getRecord(groupToolbar.newRecord())
		record.id_toolbar = allToolbars[i]
		record.id_group = globals.AC_group_selected
	}
}


// load FID with unassigned toolbar records

//find toolbars of selected type that are not assigned to this group
groupToolbar.find()
groupToolbar.id_group = globals.AC_group_selected
groupToolbar.flag_chosen = '^='
groupToolbar.toolbar_type = forms.AC_0F_group__toolbar.elements.tab_detail.tabIndex
var results = groupToolbar.search()

if (results) {
	groupToolbar.sort('ac_access_group_toolbar_to_toolbar.row_order asc')
	forms.AC_P_group_toolbar.controller.loadRecords(groupToolbar)
	
	//temporarily turn of auto save
	databaseManager.setAutoSave(false)
	
	//show FID
	application.showFormInDialog(forms.AC_P_group_toolbar,-1,-1,-1,-1,"Toolbars",false,false,'accessGroupToolbars')
}
else {
	plugins.dialogs.showInfoDialog('No toolbars','There are no toolbars that are not already assigned to this group')
}



}

/**
 *
 * @properties={typeid:24,uuid:"e02316cf-6f6b-490f-923b-ff973b050480"}
 */
function TAB_change()
{

/*
 *	TITLE    :	TAB_change
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	change tab
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TAB_change_grid()

//find records
LOAD_records()
}
