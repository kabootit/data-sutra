/**
 * @properties={typeid:24,uuid:"F5D06A25-7971-4412-BA78-ABADB84E4807"}
 */
function DATASUTRA_authenticate() {
	var groupName = 'Data Sutra Security'
	var computerName = application.getHostName()
	
	//create a user for this computer (will not create if already exists)
	var uid = security.createUser(computerName, computerName)
	
	//test if user was created
	if (uid) {
		// Get all the groups
		var set = security.getGroups()
		
		//create data sutra default security group
		var group = security.createGroup(groupName)
		
		//add this computer to our security group
		security.addUserToGroup(uid, groupName)
	}
	//get existing user
	else {
		uid = security.getUserUID(computerName)
	}
	
	var success = security.login(computerName,uid,[groupName])
	
	return success
}
