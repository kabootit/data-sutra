/**
 *
 * @properties={typeid:24,uuid:"efd9e198-e475-43d1-b719-e09f539f4c13"}
 */
function ACTION_button()
{

/*
 *	TITLE    :	ACTION_button
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_button()
 *			  	
 *	MODIFIED :	January 2, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch (elements.lbl_validate.text) {
	case 'Edit':
		ACTION_edit()
		break
	case 'Validate':
		ACTION_validate()
		break
}


}

/**
 *
 * @properties={typeid:24,uuid:"55a26a8b-a81e-4588-9bb2-23e8ecda8dac"}
 */
function ACTION_edit()
{

/*
 *	TITLE    :	ACTION_edit
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	if fields are non-editable, turn them on
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_edit()
 *			  	
 *	MODIFIED :	October 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

elements.fld_license_type.enabled = true
elements.fld_license_name.enabled = true
elements.fld_license_number.enabled = true
elements.fld_license_key.enabled = true
elements.fld_license_accept.enabled = true

elements.lbl_validate.text = 'Validate'
}

/**
 *
 * @properties={typeid:24,uuid:"9b306330-8848-458b-90e9-f4ffd4dce66a"}
 */
function ACTION_generate()
{

/*
 *	TITLE    :	ACTION_generate
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_generate()
 *			  	
 *	MODIFIED :	October 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (license_type == 'Purchased') {
	var licenseKey = LICENSE_purchased()
	
	if (!licenseKey) {
		licenseKey = ''
	}
}
else if (license_type == 'Community') {
	var licenseKey = LICENSE_community()
	
	if (!licenseKey) {
		licenseKey = ''
	}
}
else if (license_type == 'Trial') {
	plugins.dialogs.showErrorDialog(
					'Licensing error',
					'Trial mode cannot be licensed'
			)
	return
}
else if (!license_type) {
	plugins.dialogs.showErrorDialog(
					'Licensing error',
					'Only a purchased license can have a key'
			)
	return
}

//	/* for debugging
application.setClipboardContent(licenseKey[0].toString())
plugins.dialogs.showInfoDialog(
	'License code',
	license_name + ' keys: \n' + licenseKey.join('\n')
)
//	*/

//log the license generated


//send email out



}

/**
 *
 * @properties={typeid:24,uuid:"90920297-0946-400c-910f-49e1b0244ebc"}
 */
function ACTION_purchase()
{

/*
 *	TITLE    :	ACTION_purchase
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	go to our website
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_purchase()
 *			  	
 *	MODIFIED :	April 24, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.CODE_url_handler('http://www.data-sutra.com/')
}

/**
 *
 * @properties={typeid:24,uuid:"9e1fff3d-5d54-4c52-9a76-fa7cc4e56582"}
 */
function ACTION_status()
{

/*
 *	TITLE    :	ACTION_status
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	set status text with minutes until timeout
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_status()
 *			  	
 *	MODIFIED :	December 19, 2008 -- Troy Elliott, Data Mosaic
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

var trialMode = (typeof arguments[0] == 'boolean') ? arguments[0] : solutionPrefs.config.trialMode

var formName = 'DATASUTRA_0F_solution__header'

if (forms[formName] && forms[formName].elements.lbl_trial_mode) {
	var elem = forms[formName].elements.lbl_trial_mode
}

var toolTip = 'Visit http://www.data-sutra.com/ to license Data Sutra'

//TODO: remove me!!!
if (!solutionPrefs.config.prefs) {
	solutionPrefs.config.prefs = {}
}

//status text for trial operation when changed
if (trialMode) {
	var status = 'Data Sutra is running in Trial mode'
	
	application.setStatusText(
					status,
					toolTip
				)
	
	if (elem) {
		elem.toolTipText = toolTip
		elem.visible = true
	}
}
//set status text for normal trial operation
else if (solutionPrefs.config.trialMode) {
	var limit = 60
	
	var rightNow = application.getServerTimeStamp()
	var started = plugins.sutra.getStartUp()
	
	var opened = Math.ceil((rightNow - started) / (60 * 1000))
	
	//less than an hour (limit minutes)
	if (opened < limit) {
		if (opened == limit - 1) {
			var status = '1 minute remains in Trial mode'
		}
		else {
			var status = (limit - opened) + ' minutes remain in Trial mode'
		}
	}
	//more than an hour
	else {
		var status = '<html><body><font color="red">Trial time expired.  Please restart.</font></body></html>'
		
		//turn on flag for really annoying popups
		solutionPrefs.config.prefs.thatsAllFolks = true
		
		//turn on flag to not setStatusText anymore
		solutionPrefs.config.trialModeExpired = true
	}
	
	//set status text
	application.setStatusText(
				status,
				toolTip
			)
	
	if (elem) {
		elem.toolTipText = status
		elem.visible = true
	}
}
//no longer trial mode, set status text
else {
	application.setStatusText(
				'<html><body>&nbsp;</body></html>',
				null
			)
	
	
	if (elem) {
		elem.toolTipText = null
		elem.visible = false
	}
}



}

/**
 *
 * @properties={typeid:24,uuid:"3ed181d3-f97d-4b70-a04c-040b89f03e30"}
 */
function ACTION_validate()
{

/*
 *	TITLE    :	ACTION_validate
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	1- return whether licensed
 *			  	2- suppress error message
 *			  	
 *	OUTPUT   :	true = purchased; false = trial
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_validate()
 *			  	
 *	MODIFIED :	April 24, 2009 -- Troy Elliott, Data Mosaic
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

var returnValid = arguments[0]
var skipError = arguments[1]

//solutionPrefs not defined, define enough for this method to work
if (! application.__parent__.solutionPrefs) {
	solutionPrefs = {config : new Object()}
}

//there are records here, run...
if (utils.hasRecords(foundset)) {
	//reset trial mode so upcoming check will work correctly
	if (!application.__parent__.solutionPrefs) {
		application.__parent__.solutionPrefs = new Object()
	}
	if (!solutionPrefs.config) {
		solutionPrefs.config = new Object()
	}
	solutionPrefs.config.trialMode = false
	
	//a purchased license
	if (license_type == 'Purchased') {
		var licenseKey = LICENSE_purchased()
		
		//there is a license key
		if (license_key) {
			var licenseDate = LICENSE_get_date(license_key)
		}
	}
	//a community edition license
	else if (license_type == 'Community') {
		var licenseKey = LICENSE_community()
		
		//there is a license key
		if (license_key) {
			var licenseDate = LICENSE_get_date(license_key)
		}
	}
	//trial license
	else if (license_type == 'Trial') {
		solutionPrefs.config.trialMode = true
		
		if (!skipError) {
			var restart = plugins.dialogs.showInfoDialog(
							'Trial mode',
							'Running in trial mode. Timeout after 60 minutes of use.',
							'OK'
					)
		}
	}
	
//check if...
	//this client is within the max number of frameworks users
	//same company name for frameworks and servoy licenses
	//get count of clients with this solution open
	var clients = application.getActiveClientCount(true)
	
	//already validated, no need to check against concurrent logged in
	if (application.getUserProperty('sutraValid-' + application.getSolutionName() + '-' + application.getServerURL().substr(7)) == 'true') {
		var clientOK = true
	}
	
	//client has not been validated, check concurrent number against license amount
	if (!clientOK) {
		//a trial license
		if (license_type == 'Trial' || license_type == 'Community') {
			var licenses = 5
		}
		//a real license
		else if (license_type == 'Purchased') {
			var licenses = license_number
		}	
					
		//check number of clients logged in against max number
		if (clients <= licenses || !license_type || !licenses) {
			var clientOK = true
		}
	}
	
	//company names servoy is registered to
	var licenseNames = application.getLicenseNames()
	
	//non-trial
	if (license_type == 'Purchased') {
		//check if company name on servoy and frameworks licenses match
		for (var i = 0; i < licenseNames.length; i++) {
			if (licenseNames[i] == license_name) {
				var companyOK = true
				break
			}
		}
	}
	//trial or community; ignore all company-related inquiries
	else {
		var companyOK = true
	}
	
	//error with companies
	if (!companyOK) {
		//errors are not ok...enter trial mode
		if (skipError) {
			solutionPrefs.config.trialMode = true
		}
		//errors are allowed, throw up error box
		else {
			plugins.dialogs.showErrorDialog(
						'Incorrect company',
						'Company name must match the Servoy licensed company'
					)
			TOGGLE_elements(false)
		}
	}
	
	//set flag that registration is good if not already set
	if (clientOK && companyOK && application.getUserProperty('sutraValid-' + application.getSolutionName() + '-' + application.getServerURL().substr(7)) != 'true') {
		application.setUserProperty('sutraValid-' + application.getSolutionName() + '-' + application.getServerURL().substr(7),'true')
	}
	
	//update status bar with text (will clear it out)
	ACTION_status()
	
	//this client has...
		//not exceeded max allowed clients AND
		//company name matches servoy licensee OR
		//in trial mode and developer
	if (clientOK && companyOK) {
		//key matches, license accepted
		if (LICENSE_hash_compare(licenseKey,license_key) && license_accept) {
			if (returnValid) {
				return true
			}
			else {
				TOGGLE_elements(true,licenseDate)
				
				if (!skipError) {
					if (license_type == 'Purchased') {
						var restart = plugins.dialogs.showInfoDialog(
									'Success',
									'Thank you for your purchase! Support lasts for one year from date of purchase.',
									'OK'
							)
					}
					else if (license_type == 'Community') {
						var restart = plugins.dialogs.showInfoDialog(
									'Success',
									'The community license was activated to: "' + license_name + '".',
									'OK'
							)
					}
				}
			}
		}
		else {
			if (!skipError && !solutionPrefs.config.trialMode) {
				plugins.dialogs.showErrorDialog(
						'Invalid key',
						'Please check that you have entered the correct registration information'
					)
					
				//make sure in trial mode
//				solutionPrefs.config.trialMode = true
			}
			

			//show normal status message
			if (skipError) {
				ACTION_status()
			}
			//in trial mode; show
			else if (solutionPrefs.config.trialMode) {
				//show status message that in trial mode unless trial mode already expired
				if (!solutionPrefs.config.prefs.thatsAllFolks) {
					ACTION_status(true)
				}
			}
			//something wrong...set labels appropriately
			else {
				ACTION_status(false)
			}
			
			
			//make sure that running in developer if trial
			if (license_type == 'Trial' && !application.isInDeveloper()) {
				plugins.dialogs.showErrorDialog(
						'Restricted',
						'Trial mode only runs from Servoy Developer.'
					)
				
				application.exit()
			}
			
			if (returnValid) {
				return false
			}
			else {
				TOGGLE_elements(false)
			}
		}
	}
	//max clients exceeded
	else if (!clientOK) {
		plugins.dialogs.showErrorDialog(
				'User limit exceeded',
				'Client will now close.'
			)
		
		application.exit()
	}
}

//go to first screen if in frameworks and solutionPrefs not defined enough
if (restart == 'OK' && !solutionPrefs.history && forms.DATASUTRA_0F_solution) {
	delete application.__parent__.solutionPrefs
	forms.DATASUTRA_0F_solution.controller.show()
	forms.DATASUTRA_0F_solution.FORM_on_load()
	
	forms.DATASUTRA_0F_solution.elements.bean_main.dividerLocation = 0
}





/////
////
//los originales



/*

//solutionPrefs not defined, define enough for this method to work
if (! application.__parent__.solutionPrefs) {
	solutionPrefs = {config : new Object()}

	//TODO: remove this line
	//solutionPrefs.config.robotGood = (plugins.servoyguy_robot) ? plugins.servoyguy_robot.checkAccessPassword('frameworks') : false
}

//there are records here, run...
if (utils.hasRecords(foundset)) {
	//reset trial mode so upcoming check will work correctly
	solutionPrefs.config.trialMode = false
	
	//an eval license
	if (license_type == 'Evaluation') {
		var licenseKey = LICENSE_eval()
		
		//there is a license key
		if (license_key) {
			var licenseDate = LICENSE_get_date(license_key)
			var licenseExpiry = new Date(licenseDate)
			licenseExpiry.setDate(licenseExpiry.getDate() + 30)
			
			var licenseExpiry = licenseExpiry - application.getServerTimeStamp()
			if (licenseExpiry > 0) {
				licenseExpiry = new Date(licenseExpiry)
				var valid = true
			}
			else {
				var valid = false
			}
		}
		else {
			var valid = false
		}
	}
	//a real license
	else if (license_type == 'Purchased') {
		var licenseKey = LICENSE_purchased()
		
		//there is a license key
		if (license_key) {
			var licenseDate = LICENSE_get_date(license_key)
		}
	}
	//trial license
	else {
		solutionPrefs.config.trialMode = true
	}
	
	//check if...
		//this client is within the max number of frameworks users
		//same company name for frameworks and servoy licenses
	if (true) {
		//all clients connected to the server
		var clients = plugins.servoyguy_robot.getClients()
		
		//robot working
		if (clients && clients.length) {
			//loop over all clients and get user info
			for (var i = 0; i < clients.length; i++) {
				
				//find this client out of all of them
				if (clients[i].getClientId() == plugins.sutra.getClientID()) {
					//info on the currently logged in client
					var info = clients[i].getClientInfos()
					
					//has this client already been validated
					for (var j = 0; j < info.length; j++) {
						//already validated, no need to check against concurrent logged in
						if (info[j] == '<strong>Data Sutra client</strong>') {
							var clientOK = true
							break
						}
					}
				}
			}
			
			//client has not been validated, check concurrent number against license amount
			if (!clientOK) {
				//an eval license
				if (license_type == 'Evaluation') {
					var licenses = 5
				}
				//a real license
				else if (license_type == 'Purchased') {
					var licenses = license_number
				}	
							
				//check number of clients logged in against max number
				if (clients.length <= licenses) {
					var clientOK = true
				}
			}
		}
		
		//number of servoy licenses registered
		var licenseNum = plugins.sutra.getServerProperty('licenseManager.numberOfLicenses')
		
		//check if company name on servoy and frameworks licenses match
		for (var i = 0; i < licenseNum; i++) {
			var licenseName = plugins.sutra.getServerProperty('license.' + i + '.company_name')
			
			if (licenseName == license_name) {
				var companyOK = true
				break
			}
		}
	}
	
	//this client has...
		//not exceeded max allowed clients AND
		//company name matches servoy licensee OR
		//in trial mode
	if (clientOK && companyOK || solutionPrefs.config.trialMode) {
		//key matches, license accepted, if eval, then time hasn't run out on trial yet
		if (LICENSE_hash_compare(licenseKey,license_key) && license_accept && ((license_type == 'Evaluation') ? valid : true)) {
			if (returnValid) {
				return true
			}
			else {
				TOGGLE_elements(true,licenseDate)
			}
		}
		else {
			if (!skipError && !solutionPrefs.config.trialMode) {
				plugins.dialogs.showErrorDialog(
						'Invalid key',
						'Please check that you have entered the correct registration information'
					)
			}
			
			if (returnValid) {
				ACTION_status()
				return false
			}
			else {
				TOGGLE_elements(false)
			}
		}
	}
	//company name incorrect
	else if (!companyOK) {
		plugins.dialogs.showErrorDialog(
				'Licensee error',
				'The company name for the Data Sutra license entered\n' +
				'does not match the company name for your Servoy licenses.\n\n' +
				'This session will now close.'
			)
		
		application.exit()
	}
	//max clients exceeded
	else if (!clientOK) {
		plugins.dialogs.showErrorDialog(
				'Too many users',
				'You have exceeded the amount of users that can use\n' +
				'Data Sutra concurrently.\n\n' +
				'This session will now close.'
			)
		
		application.exit()
	}
}


*/

}

/**
 *
 * @properties={typeid:24,uuid:"125b96ee-0589-464e-a15c-a8582234f997"}
 */
function FLD_data_change__license_accept()
{

/*
 *	TITLE    :	FLD_data_change__license_accept
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__license_accept()
 *			  	
 *	MODIFIED :	October 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if (license_accept) {
	elements.btn_validate.enabled = true
}
else {
	elements.btn_validate.enabled = false
}


}

/**
 *
 * @properties={typeid:24,uuid:"12b69116-d84c-48e9-835f-84a70bbefdf0"}
 */
function FLD_data_change__license_key()
{

/*
 *	TITLE    :	FLD_data_change__license_key
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	format license to uppper case
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__license_key()
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

if (license_key) {
	var licenseKey = license_key.toUpperCase()
	
	if (licenseKey.length <= 18 || !utils.stringPatternCount(licenseKey,'-')) {
		licenseKey = utils.stringReplace(licenseKey, '-', '')
		licenseKey = licenseKey.substr(0,6) + '-' + licenseKey.substr(6,6) + '-' + licenseKey.substr(12,6)
	}
	
	license_key = licenseKey
	databaseManager.saveData()
}
}

/**
 *
 * @properties={typeid:24,uuid:"835a1dc4-b3e7-4a55-99f1-232c2e235d37"}
 */
function FLD_data_change__license_name()
{

/*
 *	TITLE    :	FLD_data_change__license_name
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	hide/show appropriate fields
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__license_name()
 *			  	
 *	MODIFIED :	October 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//company names servoy is registered to
var licenseNames = application.getLicenseNames()

//check if company name on servoy and frameworks licenses match
for (var i = 0; i < licenseNames.length; i++) {
	if (licenseNames[i] == license_name) {
		var companyOK = true
		break
	}
}
/*
//throw up error dialog
if (!companyOK) {
	plugins.dialogs.showErrorDialog(
					'Company error',
					'Company name must match the Servoy company name'
			)
	
	if (licenseNames.length) {
		license_name = licenseNames[0]
	}
	elements.fld_license_name.requestFocus()
}
*/
}

/**
 *
 * @properties={typeid:24,uuid:"1594e255-de2a-44f6-a1e5-5ad46983785a"}
 */
function FLD_data_change__license_type()
{

/*
 *	TITLE    :	FLD_data_change__license_type
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	hide/show appropriate fields
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__license_type()
 *			  	
 *	MODIFIED :	October 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//there is a license
if (license_type) {
	//remove 'select' as an option from licensing
	application.setValueListItems('DPLY_license_type',new Array('Trial','Community','Purchased'))
	
	//purchased
	if (license_type == 'Purchased') {
		//move key to position below license number
		elements.lbl_license_key.setLocation(elements.lbl_license_key.getLocationX(),elements.lbl_license_number.getLocationY() + 23)
		elements.fld_license_key.setLocation(elements.fld_license_key.getLocationX(),elements.fld_license_number.getLocationY() + 23)
		
		//show the rest
		elements.lbl_license_name.visible = true
		elements.fld_license_name.visible = true
		elements.lbl_license_key.visible = true
		elements.fld_license_key.visible = true
		elements.lbl_license_number.visible = true
		elements.fld_license_number.visible = true
		
		elements.btn_upgrade.visible = true
		elements.lbl_upgrade.visible = true
		
		elements.fld_license_type.setSize(130,23)
		
		//prefill
		var licenseNames = application.getLicenseNames()
		if (licenseNames.length) {
			license_name = licenseNames[0]
		}
	}
	//community
	else if (license_type == 'Community') {
		//move key to position where license number usually is
		elements.lbl_license_key.setLocation(elements.lbl_license_key.getLocationX(),elements.lbl_license_number.getLocationY())
		elements.fld_license_key.setLocation(elements.fld_license_key.getLocationX(),elements.fld_license_number.getLocationY())
		
		//show the rest
		elements.lbl_license_name.visible = true
		elements.fld_license_name.visible = true
		elements.lbl_license_key.visible = true
		elements.fld_license_key.visible = true
		
		//hide license number
		elements.lbl_license_number.visible = false
		elements.fld_license_number.visible = false
		
		elements.btn_upgrade.visible = true
		elements.lbl_upgrade.visible = true
		
		elements.fld_license_type.setSize(130,23)
		
	}
	//trial
	else if (license_type == 'Trial') {
		license_key = null
		license_name = null
		license_number = null
		
		elements.lbl_license_name.visible = false
		elements.fld_license_name.visible = false
		elements.lbl_license_number.visible = false
		elements.fld_license_number.visible = false
		elements.lbl_license_key.visible = false
		elements.fld_license_key.visible = false
		
		elements.btn_upgrade.visible = false
		elements.lbl_upgrade.visible = false
		
		elements.fld_license_type.setSize(230,23)
	}
}
//no license
else {
	elements.lbl_license_name.visible = false
	elements.fld_license_name.visible = false
	elements.lbl_license_number.visible = false
	elements.fld_license_number.visible = false
	elements.lbl_license_key.visible = false
	elements.fld_license_key.visible = false
	
	elements.btn_upgrade.visible = false
	elements.lbl_upgrade.visible = false
}


}

/**
 *
 * @properties={typeid:24,uuid:"a0a6887b-113d-46c9-98e7-e48c2320388f"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
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

//globals.TRIGGER_tooltip_set()


}

/**
 *
 * @properties={typeid:24,uuid:"9d9f2884-b0fd-4c56-83b1-7e406549899f"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	October 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//temporary hack to get tooltips until licensing removed
if (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.language && solutionPrefs.i18n && solutionPrefs.i18n[solutionPrefs.config.language]) {
	globals.TRIGGER_tooltip_set()
}

//no license entered, get valuelist and tack on 'Select' option
if (!license_type) {
	var dataset = application.getValueListItems('DPLY_license_type')
	
	var displayValue = dataset.getColumnAsArray(1)
	var realValue = dataset.getColumnAsArray(2)
	
	//check to see select isn't already entered
	if (realValue[0] != null) {
		displayValue.unshift('- Select -')
		realValue.unshift(null)
		
		application.setValueListItems('DPLY_license_type',displayValue,realValue)
	}
}

//hide/show appropriate fields
FLD_data_change__license_type()

//check keys entered
ACTION_validate(null,true)


}

/**
 *
 * @properties={typeid:24,uuid:"df9d5084-572d-4e4b-9176-54cedeab075f"}
 */
function LBL_data_change__license_accept()
{


if (elements.fld_license_accept.enabled) {
	license_accept = (license_accept) ? 0 : 1
	
	FLD_data_change__license_accept()
}
}

/**
 *
 * @properties={typeid:24,uuid:"6eb722a8-7b86-41b5-92b5-7819d181c4c6"}
 */
function LICENSE_format()
{

/*
 *	TITLE    :	LICENSE_wrapper
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	format 128-bit string to 24-bit servoy formatted license string (ex: 861833-119970-104599)
 *			  	the first two characters of every sextuplet contain the date (ex: DDxxxx-MMxxxx-YYxxxx)
 *			  		- 1 = J
 *			  		- 2 = I
 *			  		- 3 = H
 *			  		- 4 = G
 *			  		- 5 = F
 *			  		- 6 = E
 *			  		- 7 = D
 *			  		- 8 = C
 *			  		- 9 = B
 *			  		- 0 = A
 *			  	
 *	INPUT    :	md5 hash
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	LICENSE_wrapper()
 *			  	
 *	MODIFIED :	October 31, 2008 -- Troy Elliott, Data Mosaic
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

var input = arguments[0]
var today = (arguments[1]) ? arguments[1] : new Date()

var todayMap = new Array('A','J','I','H','G','F','E','D','C','B')

//SEX 1: two digits of day plus 4
var first = today.getDate()
first = (first < 10) ? '0' + first : first + ''
first = todayMap[first.substr(0,1)] + todayMap[first.substr(1,1)]

for ( var i = 0 ; i < input.length && first.length <= 6; i++ ) {
	if (i%10 == 0) {
		first += input.charAt(i)
	}
}

//SEX 2: two digits of month plus 4
var second = today.getMonth() + 1
second = (second < 10) ? '0' + second : second + ''
second = todayMap[second.substr(0,1)] + todayMap[second.substr(1,1)]

for ( ; i < input.length && second.length <= 6 ; i++ ) {
	if (i%5 == 0) {
		second += input.charAt(i + 3)
	}
}


//SEX 3: last two digits of year plus 4
var third = today.getFullYear() + ''
third = todayMap[third.substr(2,1)] + todayMap[third.substr(3,1)]

for ( ; i < input.length && third.length <= 6; i++ ) {
	if (i%3 == 0) {
		third += input.charAt(i + 5)
	}
}

return first.toUpperCase() + "-" + second.toUpperCase() + "-" + third.toUpperCase()


}

/**
 *
 * @properties={typeid:24,uuid:"9d7382cf-ae57-4a49-99f6-e93da9e6b525"}
 */
function LICENSE_get_date()
{

/*
 *	TITLE    :	LICENSE_get_date
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	pull date out of a license
 *			  	the first two characters of every sextuplet contain the date (ex: DDxxxx-MMxxxx-YYxxxx)
 *			  		- 1 = J
 *			  		- 2 = I
 *			  		- 3 = H
 *			  		- 4 = G
 *			  		- 5 = F
 *			  		- 6 = E
 *			  		- 7 = D
 *			  		- 8 = C
 *			  		- 9 = B
 *			  		- 0 = A
 *			  	
 *	INPUT    :	servoy license
 *			  	
 *	OUTPUT   :	date object
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	LICENSE_get_date()
 *			  	
 *	MODIFIED :	October 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: licensing will only work until 2099

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

var input = arguments[0].split('-')

var todayMap = {'A': 0,'J': 1,'I': 2,'H': 3,'G': 4,'F': 5,'E': 6,'D': 7,'C': 8,'B': 9}

var day = utils.stringToNumber(todayMap[input[0].substr(0,1)] + '' + todayMap[input[0].substr(1,1)])
var month = utils.stringToNumber(todayMap[input[1].substr(0,1)] + '' + todayMap[input[1].substr(1,1)]) - 1
var year = utils.stringToNumber('20' + todayMap[input[2].substr(0,1)] + '' + todayMap[input[2].substr(1,1)])

var licenseDate = new Date(year, month, day)

return licenseDate


}

/**
 *
 * @properties={typeid:24,uuid:"e4e55f40-da3b-4239-ad9d-f81c86cd4013"}
 */
function LICENSE_hash_compare()
{

/*
 *	TITLE    :	LICENSE_hash_compare
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	compares two values passed in
 *			  	
 *	INPUT    :	1- all possible license keys for given information
 *			  	2- input license key
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	LICENSE_hash_compare()
 *			  	
 *	MODIFIED :	April 24, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var inputOne = arguments[0]
var inputTwo = arguments[1]

var blacklist = new Array()
blacklist.push('AJ37A9B-AJD2B95-AB77EDF')

//values to compare
if (inputOne && inputTwo) {
	//check against blacklist
	for (var i = 0; i < blacklist.length; i++) {
		if (inputTwo == blacklist[i]) {
			return false
		}
	}

	//array of possible licenses to compare
	if (inputOne instanceof Array) {
		//loop over aray, comparing
		for (var i = 0; i < inputOne.length; i++) {

			//checks
			var checkOne = LICENSE_unformat(inputOne[i]) 
			var checkTwo = LICENSE_unformat(inputTwo)

			//match found, return true
			if (checkOne == checkTwo) {
				return true
			}
		}

		//no match found in all possiblilities
		return false
	}
	//one license to compare
	else {
		//checks
		var checkOne = LICENSE_unformat(inputOne) 
		var checkTwo = LICENSE_unformat(inputTwo)

		if (checkOne == checkTwo) {
			return true
		}
		else {
			return false
		}
	}
}
else {
	return false
}


}

/**
 *
 * @properties={typeid:24,uuid:"912eca0a-e3bb-440a-98e3-e01e87e9c6b9"}
 */
function LICENSE_md5_hash()
{

/*
 *	TITLE    :	LICENSE_md5_hash
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	return messageDigest5 hash
 *			  	
 *	INPUT    :	1- string to hash
 *			  	
 *	OUTPUT   :	hash
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	LICENSE_md5_hash()
 *			  	
 *	MODIFIED :	October 31, 2008 -- Troy Elliott, Data Mosaic
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

var stringToHash = arguments[0].toString()

//get an array of bytes from the input string
var inputArray =  Array(stringToHash.length)
var inputChar

for (var i = 0; i < stringToHash.length; i++) {
	//one inputCharacter - force to string type by the plus ''
	inputChar = stringToHash.slice(i,i+1) + '' 
	inputArray[i] = inputChar.charCodeAt(0)
}

//convert to a Byte array
var inputByteArray = new Array(inputArray.length)

for (i = 0; i < inputArray.length; i++) {
	inputByteArray[i] = Packages.java.lang.Byte(inputArray[i])
}

//instantiate the Message Digest
var messageDigest = Packages.java.security.MessageDigest.getInstance("MD5")

try {
	var messageDigest5ByteArray = messageDigest.digest(inputArray)
} 
catch (e) {
	return null
}

var messageDigest5Hash = ''
var messageDigest5Array = new Array(messageDigest5ByteArray.length)

for (i = 0; i < messageDigest5ByteArray.length; i++ ) {
	//get hex code for each
	messageDigest5Array[i] = Packages.java.lang.Integer.toHexString(messageDigest5ByteArray[i])
	
	if (messageDigest5Array[i].length > 2) {
		//take right-most 2 chars
		messageDigest5Array[i] = messageDigest5Array[i].substr(messageDigest5Array[i].length - 2, 2)
	}
	
	if ((messageDigest5ByteArray[i] >= 0 ) && (messageDigest5ByteArray[i] <= 15)) {
		//prepend a '0' since the hex to string fails to do so
		messageDigest5Array[i] = '0' + messageDigest5Array[i]
	}
	
	//concatenate
	messageDigest5Hash += messageDigest5Array[i]
} 

return messageDigest5Hash


}

/**
 *
 * @properties={typeid:24,uuid:"f15f48dd-e0ac-4394-8d6a-0b536f65ae62"}
 */
function LICENSE_purchased()
{

/*
 *	TITLE    :	LICENSE_purchased
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	generate a license for fw that is bought
 *			  	
 *	INPUT    :	1- company name
 *			  	2- number of licenses
 *			  	
 *	OUTPUT   :	when on licensing server, single code
 *			  	when in client, returns array of possible codes
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	LICENSE_purchased()
 *			  	
 *	MODIFIED :	January 24, 2011 -- Troy Elliott, Data Mosaic
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
	
	var inputCompany = ((arguments[0]) ? arguments[0] : license_name) || ''
	var numLicenses = (arguments[1]) ? arguments[1] : ((license_number) ? license_number : 1)
	var dateStart = new Date()
	
	var licenseOpt = new Array()
	
	var padNumLicenses = ''
	while (padNumLicenses.length < 10) {
		padNumLicenses += numLicenses
	}
	
	var offset = ['F','E','D','C','B','A','9','8','7','6','5','4','3','2','1',null]
	
	//keep generating new licenses until we get an original one
	for (var i = 0; i < offset.length; i++) {
		var nameCompany = inputCompany
		
		//there is something to intersperse
		if (offset[i]) {
			//intersperse the offset within the company name at every 4 characters
			for (var j = 4; j <= nameCompany.length; j += 4) {
				var k = j / 4 - 1
				nameCompany = nameCompany.substr(0,j-4 + k) + nameCompany.substr(j-4 + k,4) + offset[i] + nameCompany.substr(j+k)
			}
			//pad until at least 12 characters in length
			while (nameCompany.length < 12) {
				nameCompany += offset[i]
			}
		}
		
		//create hashes for company and licenses; merge those results to create a company/license hash
		var hashCompany = LICENSE_md5_hash(nameCompany).toString()
		var hashLicense = LICENSE_md5_hash(padNumLicenses).toString()
		var hashPseudo = hashCompany.substr(0,16) + hashLicense.substr(16,16)
		
		var uid = hashCompany.toUpperCase() + hashLicense.toUpperCase() + hashPseudo.toUpperCase()
		
		//generate license from uid and save into array of possibile licenses
		var license = LICENSE_format(uid,dateStart)
		licenseOpt.push(license)
		
		//running on licensing server, check for uniqueness
		if (false) {
			//break out of for-loop, this value is unique
			var fsSomething = databaseManager.getFoundSet(controller.getServerName(),'sutra_license')
			fsSomething.find()
			fsSomething.license_key = license
			var results = fsSomething.search()
			
			//does not exist on the licensing server
			if (!results) {
				return license
			}
		}
	}
	
	return licenseOpt



}

/**
 * @properties={typeid:24,uuid:"22E93E23-24B9-4745-9708-1A18813365FE"}
 */
function LICENSE_community() {

/*
 *	TITLE    :	LICENSE_community
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	generate a license for fw that is bought
 *			  	
 *	INPUT    :	1- company name
 *			  	
 *	OUTPUT   :	when on licensing server, single code
 *			  	when in client, returns array of possible codes
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	LICENSE_community()
 *			  	
 *	MODIFIED :	January 24, 2011 -- Troy Elliott, Data Mosaic
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
	
	var inputCompany = ((arguments[0]) ? arguments[0] : license_name) || ''
	var numLicenses = '0123456789'	//hard coded at this unique value; really means 5 client licenses
	var dateStart = new Date()
	
	var licenseOpt = new Array()
	
	var offset = ['F','E','D','C','B','A','9','8','7','6','5','4','3','2','1',null]
	
	//keep generating new licenses until we get an original one
	for (var i = 0; i < offset.length; i++) {
		var nameCompany = inputCompany
		
		//there is something to intersperse
		if (offset[i]) {
			//intersperse the offset within the company name at every 4 characters
			for (var j = 4; j <= nameCompany.length; j += 4) {
				var k = j / 4 - 1
				nameCompany = nameCompany.substr(0,j-4 + k) + nameCompany.substr(j-4 + k,4) + offset[i] + nameCompany.substr(j+k)
			}
			//pad until at least 12 characters in length
			while (nameCompany.length < 12) {
				nameCompany += offset[i]
			}
		}
		
		//create hashes for company and licenses; merge those results to create a company/license hash
		var hashCompany = LICENSE_md5_hash(nameCompany).toString()
		var hashLicense = LICENSE_md5_hash(numLicenses).toString()
		var hashPseudo = hashCompany.substr(0,16) + hashLicense.substr(16,16)
		
		var uid = hashCompany.toUpperCase() + hashLicense.toUpperCase() + hashPseudo.toUpperCase()
		
		//generate license from uid and save into array of possibile licenses
		var license = LICENSE_format(uid,dateStart)
		licenseOpt.push(license)
		
		//running on licensing server, check for uniqueness
		if (false) {
			//break out of for-loop, this value is unique
			var fsSomething = databaseManager.getFoundSet(controller.getServerName(),'sutra_license')
			fsSomething.find()
			fsSomething.license_key = license
			var results = fsSomething.search()
			
			//does not exist on the licensing server
			if (!results) {
				return license
			}
		}
	}
	
	return licenseOpt
}

/**
 *
 * @properties={typeid:24,uuid:"a1ca0d2d-696d-40c6-837c-c1e95bb71388"}
 */
function LICENSE_unformat()
{

/*
 *	TITLE    :	LICENSE_unformat
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	check company and license
 *			  	
 *	INPUT    :	license
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	LICENSE_unformat()
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
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

var input = arguments[0]

//there is something, split at the -
if (input) {
	input = input.split('-')
}
//nothing, just make an array to continue on our merry way
else {
	input = new Array()
}

var output = ''

//take off date portion of license code
for (var i = 0; i < input.length; i++) {
	input[i] = input[i].slice(2)
	output += input[i]
}

return output
}

/**
 *
 * @properties={typeid:24,uuid:"167501b7-629a-4306-ac5d-1bd3eeef3ed6"}
 */
function TOGGLE_elements()
{

/*
 *	TITLE    :	TOGGLE_elements
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	TOGGLE_elements()
 *			  	
 *	MODIFIED :	December 31, 2008 -- Troy Elliott, Data Mosaic
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

var valid = arguments[0]
var datePurchased = arguments[1]

if (license_type) {
	switch (license_type) {
		case 'Trial':
			//status explains this is trial mode
			elements.lbl_status_1.text = 'Running in Trial mode'
			elements.lbl_status_1.fgcolor = '#000000'
			elements.lbl_status_2.text = 'Timeout after 60 minutes of use'
			
			elements.lbl_status_1.visible = true
			elements.lbl_status_2.visible = true
			break
			
		case 'Community':
			//set status text for evaluation license
			if (valid) {
				elements.lbl_status_1.text = 'Valid license'
				elements.lbl_status_1.fgcolor = '#00FF00'
				elements.lbl_status_2.text = 'Five (5) clients allowed'
						//daysToExpiry + ((daysToExpiry > 1) ? ' days remaining' : ' day remaining')
			}
			else {
				elements.lbl_status_1.text = 'Invalid license'
				elements.lbl_status_1.fgcolor = '#FF0000'
				elements.lbl_status_2.text = 'Please recheck the code entered'
			}
			break
			
		case 'Purchased':
			//figure out when expires
			if (datePurchased) {
				var dateExpiry = new Date(datePurchased)
				dateExpiry.setFullYear(dateExpiry.getFullYear() + 1)
			}
			
			//set status text for valid license
			if (valid) {
				elements.lbl_status_1.text = 'Valid license'
				elements.lbl_status_1.fgcolor = '#00FF00'
				if (dateExpiry > application.getServerTimeStamp()) {
					elements.lbl_status_2.text = 'Support expires on ' + globals.CODE_date_format(dateExpiry,'current')
				}
				else {
					elements.lbl_status_2.text = 'Support expired on ' + globals.CODE_date_format(dateExpiry,'current')
				}
			}
			else {
				elements.lbl_status_1.text = 'Invalid license'
				elements.lbl_status_1.fgcolor = '#FF0000'
				elements.lbl_status_2.text = 'Please recheck the code entered'
			}
			
			elements.lbl_status_1.visible = true
			elements.lbl_status_2.visible = true
			
			application.setStatusText(elements.lbl_status_1.text, elements.lbl_status_2.text)
			
			break
	}
}
//hide status fields for when no license
else {
	elements.lbl_status_1.text = ''
	elements.lbl_status_1.fgcolor = '#000000'
	elements.lbl_status_2.visible = false
}

//not agreed, validate is not an option
if (!license_accept) {
	elements.btn_validate.enabled = false
}

//disable all elements
if (license_accept && (valid || license_type == 'Trial')) {
	elements.fld_license_type.enabled = false
	elements.fld_license_name.enabled = false
	elements.fld_license_number.enabled = false
	elements.fld_license_key.enabled = false
	elements.fld_license_accept.enabled = false
	
	elements.lbl_validate.text = 'Edit'
}
else {
	elements.fld_license_type.enabled = true
	elements.fld_license_name.enabled = true
	elements.fld_license_number.enabled = true
	elements.fld_license_key.enabled = true
	elements.fld_license_accept.enabled = true
}


}
