/**
 *
 * @properties={typeid:24,uuid:"616D13C4-A6D5-42D9-AE5B-B6065C73F098"}
 */
function ACTION_cancel()
{

/*
 *	TITLE    :	ACTION_cancel
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	 
 *			  	
 *	MODIFIED :	November 1, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */
//not already ok to close, cancel
if (!globals.CODE_hide_form) {
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	//clear all globals
	globals.MGR_tooltip__module = null
	
	application.closeFormDialog('printTipSimple')
}
}

/**
 *
 * @properties={typeid:24,uuid:"4451D247-90C7-4B39-9A39-21F5A9583348"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	 
 *			  	
 *	MODIFIED :	November 1, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (globals.MGR_tooltip__module) {
	//enable closing the form
	globals.CODE_hide_form = 1
	
	application.closeFormDialog('printTipSimple')
}
else {
	plugins.dialogs.showErrorDialog('Nothing selected', 'You must choose one or more modules','OK')
}
}

/**
 *
 * @properties={typeid:24,uuid:"D9FB5826-F0A8-4C31-A316-32EB5F82939A"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	gets columns for currently selected relation, set up form based on filter_type
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	November 1, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//disable closing the form
globals.CODE_hide_form = 0

//clear all globals
globals.MGR_tooltip__module = null
globals.MGR_tooltip__module_all = null
}

/**
 *
 * @properties={typeid:24,uuid:"D7E4D2EF-C7E5-4B7A-9E08-F62B7C5E17E9"}
 */
function TOGGLE_on_off()
{

/*
 *	TITLE    :	ACTION_toggle_flags
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
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
 *	MODIFIED :	November 1, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//toggle logic
if (globals.MGR_tooltip__module_all) {
	//toggle on
	var listItems = application.getValueListArray('MGR_tooltip_modules')
	globals.MGR_tooltip__module = ''
	for (var i in listItems) {
		globals.MGR_tooltip__module += listItems[i] + '\n'
	}
}
else {
	//toggle off
	globals.MGR_tooltip__module = null
}

}
