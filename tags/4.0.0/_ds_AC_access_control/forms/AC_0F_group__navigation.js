/**
 *
 * @properties={typeid:24,uuid:"07af1802-f052-4293-8659-f22a2e9fd54d"}
 */
function ACTION_toggle_detail()
{

/*
 *	TITLE    :	ACTION_toggle_detail
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle detail form view
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Aug 31, 2007 -- David Workman, Data Mosaic
 *			  	
 */

if (elements.btn_detail_right.visible == false) {

	//turn on detail
	elements.tab_detail.visible = true
	
	//resize list
	var x1 = elements.tab_list.getWidth()
	var x2 = elements.tab_detail.getWidth()
	var y = elements.tab_list.getHeight()
	
	elements.tab_list.setSize(x1 - x2, y)
	
	//set buttons visibility
	elements.btn_detail_right.visible = true
	elements.btn_detail_left.visible = false
	

}
else {
	
	//turn off detail
	elements.tab_detail.visible = false
	
	//resize list
	var x1 = elements.tab_list.getWidth()
	var x2 = elements.tab_detail.getWidth()
	var y = elements.tab_list.getHeight()

	elements.tab_list.setSize(x1 + x2, y)
	
	//set buttons visibility
	elements.btn_detail_right.visible = false
	elements.btn_detail_left.visible = true

}
}

/**
 *
 * @properties={typeid:24,uuid:"9b42663d-482b-45dc-b6ab-9c1c664b58b8"}
 */
function FORM_on_load()
{
ACTION_toggle_detail()
ACTION_toggle_detail()
}

/**
 *
 * @properties={typeid:24,uuid:"0116e281-95fc-4309-9c9f-c02dcc1d1a57"}
 * @AllowToRunInFind
 */
function FX_flag_invalid()
{

/*
 *	TITLE    :	REC_new_sub
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	flag navigation control sets that no longer exist in navigation sets 
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

//find configuration navigation set
var navigationSet = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation')
navigationSet.find()
navigationSet.flag_config = 1
var results = navigationSet.search()

//what is the configuration navigation set
if (results) {
	var navSetID = navigationSet.id_navigation
}
else {
	var navSetID = null
}

//grab the navigation sets available
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'select nav_name, id_navigation from sutra_navigation where id_navigation != ? order by nav_name',
                [navSetID], //12 is the id_navigation of the configuration screens
                100)
var valueList = dataset.getColumnAsArray(1)
var formList = dataset.getColumnAsArray(2)

/*
 * cycle through chosen records and flag records that are no longer valid (navigation set has been deleted)
 */

//find chosen nav sets
var selectedSet = databaseManager.getFoundSet(controller.getServerName(),'sutra_control_navigation')
selectedSet.clear()
selectedSet.find()
selectedSet.id_group = forms.AC_0F_group.id_group
selectedSet.flag_chosen = 1
var results = selectedSet.search()

//compare chosen nav sets to current existing nav sets. set flag if not found in existing
for ( var i = 0 ; i < selectedSet.getSize() ; i++ ) {
	var record = selectedSet.getRecord(i + 1)
	var matchFlag = false
		for ( var j = 0 ; j < formList.length ; j++ ) {
			if (record.id_navigation == formList[j]) {
				matchFlag = true
				break
			}
		}
	if (!matchFlag) {
		record.flag_valid = 0
		databaseManager.saveData()
	}
	else {
		matchFlag = false
	}
}

}

/**
 *
 * @properties={typeid:24,uuid:"18df2975-cc26-4ce8-9d37-16919fb3c24c"}
 * @AllowToRunInFind
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	create new navigation control for this group 
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */

//find configuration navigation set
var navigationSet = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation')
navigationSet.find()
navigationSet.flag_config = 1
var results = navigationSet.search()

//what is the configuration navigation set
if (results) {
	var navSetID = navigationSet.id_navigation
}
else {
	var navSetID = null
}

//grab the navigation sets available
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'SELECT nav_name, id_navigation FROM sutra_navigation WHERE id_navigation != ? ORDER BY order_by ASC',
                [navSetID],
                100)
var valueList = dataset.getColumnAsArray(1)
var formList = dataset.getColumnAsArray(2)


/*
 * CREATE RECORDS IN FID NOT ALREADY ASSIGNED
 * distinction is flag_chosen
*/

//find group navigation set
var navigationSet = databaseManager.getFoundSet(controller.getServerName(),'sutra_control_navigation')
navigationSet.clear()
navigationSet.find()
navigationSet.id_group = id_group
var results = navigationSet.search()

//create group nav control records if don't exist
//if (results < valueList.length) {
	for ( var i = 0 ; i < valueList.length ; i++ ) {
		var matchFlag = false
		for ( var j = 0 ; j < navigationSet.getSize() ; j++ ) {
			var record = navigationSet.getRecord(j + 1)
			if (navigationSet.getRecord(j + 1).id_navigation == formList[i]) {
				matchFlag = true
				break
			}
		}
		//if no match found, create record
		if(!matchFlag) {
			navigationSet.newRecord()
			var record = navigationSet.getRecord(1)
			record.id_navigation = formList[i]
			record.id_group = id_group
		}
		else {
			matchFlag = false
		}	
	}
//}

databaseManager.saveData()

/*
 * load FID with unassigned navigation records
 */

//find group navigation set unassigned
var navigationSet = forms.AC_P_control_navigation.foundset//databaseManager.getFoundSet(controller.getServerName(),'sutra_control_navigation')
navigationSet.clear()
navigationSet.find()
navigationSet.id_group = id_group
navigationSet.flag_chosen = '^='
var results = navigationSet.search()

//forms.AC_P_control_navigation.controller.loadRecords(navigationSet)

//temporarily turn of auto save
databaseManager.setAutoSave(false)

//show FID
globals.CODE_form_in_dialog(forms.AC_P_control_navigation,-1,-1,-1,-1,"Access",false,false,'groupNavigationSets')




}

/**
 *
 * @properties={typeid:24,uuid:"7c955ab7-5ab4-4466-8b94-c74876c89e6c"}
 */
function REC_on_select()
{
forms.AC_0F_group__navigation_1L_control_navigation.FORM_on_show()
}
