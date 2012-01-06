/**
 *
 * @properties={typeid:24,uuid:"F6FF09F7-B5CC-4132-BD10-58448390F201"}
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
 *	MODIFIED :	Jan 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */
//not already ok to close, cancel
if (!globals.CODE_hide_form) {
	//enaable closing the form
	globals.CODE_hide_form = 1
	
	databaseManager.rollbackEditedRecords()
	databaseManager.setAutoSave(true)
	
	application.closeFormDialog('accessUserOrganization')
}
}

/**
 *
 * @properties={typeid:24,uuid:"A7DCA4BB-E82C-4858-8D5A-1D8126D95DF3"}
 */
function ACTION_ok()
{

/*
 *	TITLE    :	ACTION_ok
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	check password, save md5, close form in dialog
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */


//enaable closing the form
globals.CODE_hide_form = 1

databaseManager.saveData()
databaseManager.setAutoSave(true)

application.closeFormDialog('accessUserOrganization')
}

/**
 *
 * @properties={typeid:24,uuid:"EC345037-D126-4753-A6DE-E7A2594455C9"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	get current rules for passwords, show FiD
 *			  	
 *	INPUT    :	1) id_user for user record to be modified
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

}

/**
 *
 * @properties={typeid:24,uuid:"ad9e99a4-cbc9-4d1c-8e58-45a942208c9c"}
 */
function FORM_fid()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	get current rules for passwords, show FiD
 *			  	
 *	INPUT    :	1) id_user for user record to be modified
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

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

var userID = arguments[0]

//find correct field
controller.find()
id_user = userID
controller.search()

//show form in dialog
databaseManager.setAutoSave(false)
application.showFormInDialog(forms.AC_P_organization,-1,-1,-1,-1,' ',false,false,'accessUserOrganization')
}
