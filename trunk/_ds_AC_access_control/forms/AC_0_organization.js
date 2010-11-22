/**
 *
 * @properties={typeid:24,uuid:"89d213fa-8e41-40da-a403-cfae9882f815"}
 */
function ACTIONS_list_org()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Dec 7, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//grab the actions to this
var valueList = ['Create organization','----','Delete organization']

//build menu
var menu = new Array
for ( var i = 0 ; i < valueList.length ; i++ ) {
    menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_org_control)
}

//set menu method arguments
var x = 0
while (menu[x]) {
    //pass arguments
    menu[x].setMethodArguments(x)
	
	//disable dividers
	if (valueList[x] == '----') {
		menu[x].setEnabled(false)
	}
    
	x++
}

//popdown popup menu
var elem = elements[application.getMethodTriggerElementName()]
if (elem != null) {
    plugins.popupmenu.showPopupMenu(elem, menu)
}
}

/**
 *
 * @properties={typeid:24,uuid:"cfac41a5-daaa-4e57-b4c3-1c0853d5acb6"}
 */
function ACTIONS_list_org_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	0: create
 *			  	2: delete
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Dec 14, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch (arguments[0]) {
	case 0: //create
		controller.newRecord(false)
		forms.AC_0_organization_1L.elements.fld_name.requestFocus(false)
		break
		
	case 2:	//delete
		var delRec = plugins.dialogs.showWarningDialog('Delete organization','Do you really want to delete the selected organization and all staff?',  'Yes', 'No')
		if (delRec == 'Yes') {
			controller.deleteRecord()
			application.updateUI()
		}
		break	
}

}

/**
 *
 * @properties={typeid:24,uuid:"762309d0-266e-4d5e-8a34-2fd44f237cc6"}
 */
function ACTIONS_list_staff()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Dec 7, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//grab the actions to this
var valueList = ['Create staff','----','Delete staff']

//build menu
var menu = new Array
for ( var i = 0 ; i < valueList.length ; i++ ) {
    menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_staff_control)
}

//set menu method arguments
var x = 0
while (menu[x]) {
    //pass arguments
    menu[x].setMethodArguments(x)
	
	//disable dividers
	if (valueList[x] == '----') {
		menu[x].setEnabled(false)
	}
	
    x++
}

//popdown popup menu
var elem = elements[application.getMethodTriggerElementName()]
if (elem != null) {
    plugins.popupmenu.showPopupMenu(elem, menu)
}
}

/**
 *
 * @properties={typeid:24,uuid:"a6a969f2-d22a-45ba-9d88-6f0db5b8e404"}
 */
function ACTIONS_list_staff_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	0: create
 *			  	2: delete
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Dec 14, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch (arguments[0]) {
	case 0: //create
		ac_access_organization_to_access_staff.newRecord(false,true)
		forms.AC_0_organization_1L_staff.elements.fld_name_first.requestFocus(false)
		break
		
	case 2:	//delete
		var delRec = plugins.dialogs.showWarningDialog('Delete staff','Do you really want to delete the selected staff?',  'Yes', 'No')
		if (delRec == 'Yes') {
			ac_access_organization_to_access_staff.deleteRecord()
			application.updateUI()
		}
		break	
}

}
