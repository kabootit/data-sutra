/**
 * @properties={typeid:35,uuid:"EDC06788-353E-443F-AF97-5CA703812218"}
 */
var valuelistItems = null;

/**
 *
 * @properties={typeid:24,uuid:"149B4F3D-98EC-4360-B0FD-EA692796235C"}
 */
function ACTION_cancel()
{
//not already ok to close, cancel
if (!globals.CODE_hide_form) {
	
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	application.closeFormDialog('accessSaaSValuelist')
}
}

/**
 *
 * @properties={typeid:24,uuid:"38B72623-DA81-4D8D-9F60-258AD23AE7B3"}
 */
function ACTION_ok(event, createLists)
{
	if (!createLists) {
		var createLists = new Array()
		
		//what valuelists are we bringing over?
		for (var i = 1; i <= foundset.getSize(); i++) {
			var thisRec = foundset.getRecord(i)
			
			if (thisRec.flag_chosen) {
				thisRec.flag_chosen = null
				
				createLists.push(thisRec.valuelist_name)
			}
		}
	}
	
	var fsList = databaseManager.getFoundSet('sutra','sutra_valuelist')
	var fsOrgList = databaseManager.getFoundSet('sutra','sutra_access_valuelist')
	for (var i = 0; i < createLists.length; i++) {
		fsList.find()
		fsList.valuelist_name = createLists[i]
		var results = fsList.search()
		
		if (results) {
			var copyList = fsOrgList.getRecord(fsOrgList.newRecord(false,true))
			
			for (var j = 1; j <= fsList.getSize(); j++) {
				var listItem = fsList.getRecord(j)
				var copyList = fsOrgList.getRecord(fsOrgList.newRecord(false,true))
				
				databaseManager.copyMatchingColumns(listItem,copyList,true)
				copyList.id_organization = forms.AC_0F_organization__saas_1F__valuelist.id_organization
			}
		}
	}
	
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	application.closeFormDialog('accessSaaSValuelist')
	
	//reload current records
	forms.AC_0F_organization__saas_1F__valuelist.ACTION_load()
	
	//force rec on select after data saved so that it updates properly
	forms.AC_0F_organization__saas_1F__valuelist_2L_valuelist__name.REC_on_select()

}

/**
 *
 * @properties={typeid:24,uuid:"BC0EEDC5-ADAF-496B-88B1-A1BB527540D4"}
 */
function ACTION_toggle_flags()
{

/*
 *	TITLE    :	ACTION_toggle_flags
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle flag_chosen field in FID
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

//toggle logic
if (globals.AC_P_flag) {
	//toggle on
	var toggle = 1
}
else {
	//toggle off
	var toggle = 0
}

for ( var i = 0 ; i < foundset.getSize() ; i++ ) {
	var record = foundset.getRecord(i + 1)
	record.flag_chosen = toggle
}

application.updateUI()
}

/**
 *
 * @properties={typeid:24,uuid:"51EC226B-A0ED-49AA-9EDB-D91C97C2C26F"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	set default status of check box
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

globals.AC_P_flag = 0

//sort
foundset.sort('valuelist_name asc')

//disable closing the form
globals.CODE_hide_form = 0

if (!utils.hasRecords(foundset)) {
	valuelistItems = null
}

}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"C82A6774-DD3D-41F0-80DE-EB35AA825C1C"}
 */
function REC_on_select(event) {
	var actualItems = new Array()
	
	var fsValuelist = databaseManager.getFoundSet('sutra','sutra_valuelist')
	
	fsValuelist.find()
	fsValuelist.valuelist_name = valuelist_name
	var results = fsValuelist.search()
	
	if (results) {
		fsValuelist.sort('relation_1 asc, relation_2 asc, order_by asc')
		
		for (var i = 1; i <= fsValuelist.getSize(); i++) {
			var listItem = fsValuelist.getRecord(i)
			
			//there's a relation, don't add it
			if (listItem.relation_1) {
				//the string we're looking for is either in the first place
				function whereIs(item) {
					return utils.stringPosition(item,listItem.relation_1,0,1) == 1
				}
				var subVL = actualItems.map(whereIs)
				var posn = subVL.indexOf(true)
				
				if (posn >= 0) {
					actualItems[posn] = '*' + actualItems[posn]
				}
			}
			//normal top level item
			else {
				var item = listItem.visible
				if (listItem.saved) {
					item += '|' + listItem.saved
				}
				
				actualItems.push(item)
			}
		}
	}
	
	valuelistItems = ''
	valuelistItems = actualItems.join('\n')
}
