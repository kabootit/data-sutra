/**
 *
 * @properties={typeid:24,uuid:"a27cdf3e-d355-4805-af6a-c5038a0dbff8"}
 */
function ACTIONS_list()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	pop the menu up instead of the default down
 *			  	uses a secondary invisible object on the layout which is behind the clicked button
 *			  	move secondary object up far enough to drop down a popup that hits the top edge
 *			  		of clicked btn
 *			  	when menu item is selected, return secondary object to original location
 *			  	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	ACTIONS_list_control()
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get menu list from a value list
var valueList = ['Set password','Duplicate as new user','-','Delete record']

//build menu
var menu = new Array
for ( var i = 0 ; i < valueList.length ; i++ ) {
	menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_control)
}

//set menu method arguments
var x = 0
while (menu[x]) {
	//pass arguments
	menu[x].setMethodArguments(x)
	
	//disable dividers
	if (valueList[x] == '-') {
		menu[x].setEnabled(false)
	}
	
	x++
}

//hack not required
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//pop up the popup menu
	var elem = elements[application.getMethodTriggerElementName()]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menu);
	}
}
//legacy
else {
	//allow popup to approximately work even when solutionPrefs isn't defined
	if (application.__parent__.solutionPrefs) {
		var lineHeight = solutionPrefs.clientInfo.popupHack.lineHeight
		var topShift = solutionPrefs.clientInfo.popupHack.topShift
	}
	else {
		var lineHeight = 0
		var topShift = 0
	}
	
	var btnInvisible = application.getMethodTriggerElementName() + "_up"
	var currentLocationX = elements[btnInvisible].getLocationX()
	var currentLocationY = elements[btnInvisible].getLocationY()
	
	//move "up" button to correct location
	elements[btnInvisible].setLocation(currentLocationX, currentLocationY - (topShift + (menu.length * lineHeight)))
	
	//pop up the popup menu
	var elem = elements[btnInvisible]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menu);
	}
	
	//set invisible btn back to original location
	elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
}
}

/**
 *
 * @properties={typeid:24,uuid:"0405d49b-fb4d-4526-b474-32a135e34e8a"}
 */
function ACTIONS_list_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	0: Reset password
 *			  	1: Duplicate record
 *			  	3: Delete record
 *			  	
 *	INPUT    :	position in array of action item
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch (arguments[0]) {
	case 0: //set password
		forms.AC_0F_user.EDIT_password()
		break
		
	case 1:	//copy record
		forms.AC_0F_user.REC_copy()
		break		
		
	case 3:	//delete record
		forms.AC_0F_user.REC_delete()
		break	
}
}

/**
 *
 * @properties={typeid:24,uuid:"9dff1247-98d6-4a27-9a06-5b9f45a68d3d"}
 */
function REC_new()
{
forms.AC_0F_user.REC_new()
}

/**
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"31B07FF6-B304-4FA8-95FB-4B02C86C25D1"}
 */
function FORM_on_show(firstShow, event) {
	if (!firstShow) {
		forms.AC_0L_user_1L.REC_on_select()
	}
}
