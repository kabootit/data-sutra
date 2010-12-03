/**
 *
 * @properties={typeid:24,uuid:"098497ba-ea64-46a8-8c0e-b1f828894ab1"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_PREF_preferences
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.CALLBACK_tooltip_set()


}

/**
 *
 * @properties={typeid:24,uuid:"73e4f210-8537-48a3-b382-9e5b96d20808"}
 */
function STATIC_all()
{

/*
 *	TITLE    :	STATIC_all
 *			  	
 *	MODULE   :	rsrc_DEV_developer
 *			  	
 *	ABOUT    :	build a virgin repository node (of solutionPrefs), save it as json, and then set flag for clients to pull this one down
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	STATIC_all()
 *			  	
 *	MODIFIED :	August 8, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (solutionPrefs.clientInfo.typeServoy == 'developer') {
	var input = 'Yes'
}
else {
	var input = plugins.dialogs.showQuestionDialog('Restart now?','Servoy will automatically restart after creating the checksum.  Continue?','Yes','No')
	var restart = true
}


if (input == 'Yes') {
	
	//turn on feedback
	globals.CALLBACK_progressbar_start(null,'Rebuilding static object....')
	
	//repository
	STATIC_repository()
	
	/*
	//navigationPrefs when a/c disabled
	navigation_node = plugins.serialize.toJSON(globals.NAV_navigation_load(true,null,true))
	navigation_node_date = application.getServerTimeStamp()
	databaseManager.saveData()
	var abc = navigation_node
	//show popup to choose which groups to save navigationPrefs for
	application.showFormInDialog(forms.DEV_P_group,-1,-1,200,300,'Groups',false,false,'devGroupChecksum')
	
	if (globals.DEV_P_navigation) {
		var groupIDs = globals.DEV_P_navigation.split('\n')
		
		//there are groups to be processed
		if (groupIDs && groupIDs.length) {
			//get foundset
			var groups = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_group')
			groups.loadRecords(databaseManager.convertToDataSet(groupIDs))
			
			//loop through chosen gropus and build new checksum
			for (var i = 1; i <= groups.getSize(); i++) {
				STATIC_group(groups.getRecord(i))
			}
		}
	}
	*/
	
	//turn off feedback
	globals.CALLBACK_progressbar_stop()
	
	//reopen solution
	if (restart) {
		application.closeSolution(application.getSolutionName())
	}

}


}

/**
 *
 * @properties={typeid:24,uuid:"31ed4ab2-fd5f-4011-b068-6647df7f8b2d"}
 */
function STATIC_group()
{

/*
 *	TITLE    :	GROUP_checksum
 *			  	
 *	MODULE   :	rsrc_DEV_developer
 *			  	
 *	ABOUT    :	save navigationPrefs object for specified group in the group's record
 *			  	
 *	INPUT    :	group record -- group record to have navigation checksum rebuilt
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GROUP_checksum(groupID)
 *			  	
 *	MODIFIED :	August 8, 2008 -- Troy Elliott, Data Mosaic
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

var group = arguments[0]

//build virgin navigationPrefs for group
var navPrefs = globals.NAV_navigation_load(true,group.id_group,true)

//save values down
if (navPrefs) {
	group.navigation_node = navPrefs
	group.navigation_node_date = application.getServerTimeStamp()
	databaseManager.saveData()
}
//throw up warning
else {
	plugins.dialogs.showErrorDialog('Error','There has been an error with the '+group.group_name+' group')
}



}

/**
 *
 * @properties={typeid:24,uuid:"0d51e4b7-9236-4240-b59c-f13b04d02e94"}
 */
function STATIC_repository()
{

/*
 *	TITLE    :	STATIC_repository
 *			  	
 *	MODULE   :	rsrc_DEV_developer
 *			  	
 *	ABOUT    :	build a virgin repository node (of solutionPrefs), save it as json, and then set flag for clients to pull this one down
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	STATIC_repository()
 *			  	
 *	MODIFIED :	November 17, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

solutionPrefs.repository = new Object()
		
//running in serclipse using a workspace
if (solutionPrefs.clientInfo.typeServoy == 'developer' && utils.stringToNumber(solutionPrefs.clientInfo.verServoy) >= 4) {
	solutionPrefs.repository.workspace = new Object()
	
	//get everything in the workspace directory (forms and relations)
	globals.CODE_workspace_data(true)
	
	//limit to included modules
	globals.CODE_workspace_module()
	
}
//only get methods from repository in <= 3.5.x or >= 4.x client
else if (!solutionPrefs.repository.api) {
	globals.NAV_meta_module_names()
	globals.NAV_meta_form_names(true)
	globals.NAV_meta_relation_names()
}

//repository prefs
if (application.__parent__.repositoryPrefs) {
	//punch down values
	repository_checksum = utils.stringReplace(application.getNewUUID(),'-','')
	repository_checksum_date = application.getServerTimeStamp()
	repository_node = plugins.serialize.toJSON(repositoryPrefs)
	
	databaseManager.saveData()
	
	//null out temporary global var
	repositoryPrefs = undefined
}

}
