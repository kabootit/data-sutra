/**
 *
 * @properties={type:4,typeid:36,uuid:"c9c9cf5a-60fc-438b-9f1f-ae83063f98c3"}
 */
function id_staff()
{

if (ac_access_log_to_access_user && ac_access_log_to_access_user.ac_access_user_to_access_staff) {
	return ac_access_log_to_access_user.ac_access_user_to_access_staff.id_staff
}
else {
	return null
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"af9f1c70-ca36-4e9f-9f20-42a787710a32"}
 */
function login_time()
{
if (date_created && date_logout) {

	//set up divisors
	var divYears = 1000 * 60 * 60 * 24 * 365.25
	var divMonths = 1000 * 60 * 60 * 24 * 30.4375
	var divDays = 1000 * 60 * 60 * 24
	var divHours = 1000 * 60 * 60
	var divMinutes = 1000 * 60
	var divSeconds = 1000
	
	//total time in milliseconds
	var totalTime = date_logout - date_created
	
	//compute each value
	var years = Math.floor((totalTime / divYears))
	var months = Math.floor((totalTime % divYears) / divMonths)
	var days = Math.floor((totalTime % divMonths) / divDays)
	var hours = Math.floor((totalTime % divDays) / divHours)	
	var minutes = Math.floor((totalTime % divHours) / divMinutes)
	var seconds = Math.floor((totalTime % divMinutes) / divSeconds)
	
	//display only values that are more than zero
	var display = (years) ? years + " years " : ''
	display += (months) ? months + " months " : ''
	display += (days) ? days + " days " : ''
	display += (hours) ? hours + " hours " : ''
	display += (minutes) ? minutes + " minutes " : ''
	display += (seconds) ? seconds + " seconds" : ''
	
	return display

}
else {
	return null
}


}
