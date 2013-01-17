/**
 *
 * @properties={typeid:24,uuid:"e6c09847-e98f-4fb5-a2de-43438989d622"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle elements
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	March 3, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (utils.hasRecords(foundset)) {
	var toggle = (login_disabled) ? false : true
}
//no login
else {
	var toggle = false
}

elements.btn_on.visible = toggle
elements.btn_off.visible = !toggle

//on, set color to green
if (toggle) {
	elements.lbl_on.fgcolor = '#589293'
}
//off, set color to normal
else {
	elements.lbl_on.fgcolor = elements.lbl_off.fgcolor
}
}

/**
 *
 * @properties={typeid:24,uuid:"b59d7646-ad2b-47c4-8cbf-c4a279d93fa9"}
 */
function TOGGLE_access_control()
{

/*
 *	TITLE    :	TOGGLE_access_control
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle elements
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	March 3, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (utils.hasRecords(foundset)) {
	if (login_disabled) {
		login_disabled = 0
	}
	else {
		login_disabled = 1
	}
	
	databaseManager.saveData()
	
	FORM_on_show()
}
}
