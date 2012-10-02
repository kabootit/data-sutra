/**
 *
 * @properties={typeid:24,uuid:"a5771eb0-9105-491b-aa93-d6a71cb7c228"}
 */
function ACTION_cancel()
{

/*
 *	TITLE    :	ACTION_cancel
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	 
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//enaable closing the form
globals.CODE_hide_form = 1

//clear all globals
globals.DEV_P_navigation = null

globals.CODE_form_in_dialog_close('printOverviewSimple')
}

/**
 *
 * @properties={typeid:24,uuid:"c8f09493-b3ff-4cda-906f-d16cc7d4d5e9"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	 
 *			  	
 *	MODIFIED :	Apr 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (globals.DEV_P_navigation) {
	//enable closing the form
	globals.CODE_hide_form = 1
	
	globals.CODE_form_in_dialog_close('printOverviewSimple')
}
else {
	globals.DIALOGS.showErrorDialog('Nothing selected', 'You must choose one or more navigation sets','OK')
}
}

/**
 *
 * @properties={typeid:24,uuid:"335b9666-c25b-4155-80bf-9c6c2ee8e274"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_NAV_engine
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
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//disable closing the form
globals.CODE_hide_form = 0

//clear all globals
globals.DEV_P_navigation = null
globals.DEV_P_all = null

//custom form setup for iOS FiD
globals.CODE_form_in_dialog_setup_ipad()
}

/**
 *
 * @properties={typeid:24,uuid:"78691836-2464-462e-a3e8-7fc334896da3"}
 */
function TOGGLE_on_off()
{

/*
 *	TITLE    :	ACTION_toggle_flags
 *			  	
 *	MODULE   :	ds_NAV_engine
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
 *	MODIFIED :	June 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//toggle logic
if (globals.DEV_P_all) {
	//toggle on
	var listItems = application.getValueListArray('DEV_navigation_sets')
	globals.DEV_P_navigation = ''
	for (var i in listItems) {
		globals.DEV_P_navigation += listItems[i] + '\n'
	}
}
else {
	//toggle off
	globals.DEV_P_navigation = null
}

}
