/**
 *
 * @properties={typeid:24,uuid:"0d198d29-d499-42eb-bde6-9461984368ec"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	close form dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	August 8, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//loop over all records and save which ones got checked
for (var i = 1; i <= foundset.getSize(); i++) {
	var record = foundset.getRecord(i)
	
	if (record.choose_group) {
		globals.DEV_P_navigation += record.id_group + '\n'
	}
}

//more than one item
if (globals.DEV_P_navigation.length) {
	globals.DEV_P_navigation = globals.DEV_P_navigation.slice(0, globals.DEV_P_navigation.length - 1)
}

//enable closing the form
globals.CODE_hide_form = 1

globals.CODE_form_in_dialog_close('devGroupChecksum')


}

/**
 *
 * @properties={typeid:24,uuid:"cfc6a18d-3aa0-4432-b604-d19f698f542d"}
 */
function FLD_focus_gained__group_name()
{
elements.fld_constant.requestFocus(false)
}

/**
 *
 * @properties={typeid:24,uuid:"2dab1c35-44a1-459f-83b7-9560b43c5681"}
 */
function FORM_on_show()
{


//disable closing the form
globals.CODE_hide_form = 0

//clear out select all and return value
globals.DEV_P_all = null
globals.DEV_P_navigation = ''

if (utils.hasRecords(foundset)) {
	//clear out dummy calculations
	for (var i = 1; i <= foundset.getSize(); i++) {
		foundset.getRecord(i).choose_group = 0
	}
	
	foundset.setSelectedIndex(1)
}
}

/**
 *
 * @properties={typeid:24,uuid:"854deeda-789a-42ef-8644-d18866ffbdb7"}
 */
function TOGGLE_all()
{

for (var i = 1; i <= foundset.getSize(); i++) {
	foundset.getRecord(i).choose_group = globals.DEV_P_all
}


}
