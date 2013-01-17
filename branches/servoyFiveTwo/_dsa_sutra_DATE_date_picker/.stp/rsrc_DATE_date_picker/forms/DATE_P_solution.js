/**
 *
 * @properties={typeid:24,uuid:"a77e886c-450d-4af4-9432-11285e9a9d0d"}
 */
function ACTION_cancel()
{

/*
 *	TITLE    :	ACTION_cancel
 *			  	
 *	MODULE   :	rsrc_DATE_date_picker
 *			  	
 *	ABOUT    :	close form in dialog without doing anything
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Jan 2007 -- David Workman, Data Mosaic
 *			  	
 */

//clear out flag
this.FrameworksFastFind = null

//enable closing the form
globals.CODE_hide_form = 1

globals.CODE_form_in_dialog_close('datePicker')
}

/**
 *
 * @properties={typeid:24,uuid:"e7c1ea36-8747-49dd-8dd4-926f7f0d293e"}
 */
function ACTION_down()
{

/*
 *	TITLE    :	ACTION_down
 *			  	
 *	MODULE   :	rsrc_DATE_date_picker
 *			  	
 *	ABOUT    :	increment down by day, week, month, quarter or year
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	globals.DATE_date_range_type, globals.DATE_date_range_entry
 *			  	
 *	MODIFIED :	Jan 2007 -- David Workman, Data Mosaic
 *			  	
 */

var formatDate = (application.__parent__.solutionPrefs && solutionPrefs.fastFind.dateFormat) ? solutionPrefs.fastFind.dateFormat : i18n.getDefaultDateFormat()

switch( globals.DATE_date_range_type ) {

	case "Day"	:
				
				var x = new Date()

				x = utils.dateFormat(globals.DATE_date_range_entry,formatDate)
				
				var y = x.getDate()
				
				x.setDate(y - 1)
				
				globals.DATE_date_range_entry = utils.dateFormat(x,formatDate)
								
				break
				
	case "Week"	:
	
				//week
				var dayNumber = globals.DATE_date_range_track.getDay()
				
				var weekDayStart = globals.DATE_date_range_track
				weekDayStart.setDate((globals.DATE_date_range_track.getDate() - 7) -  dayNumber)
				
				var weekDayEnd = globals.DATE_date_range_track
				weekDayEnd.setDate((globals.DATE_date_range_track.getDate() - 7) + (7 - dayNumber))
				
				//set filter value
				globals.DATE_date_range_entry = utils.dateFormat(weekDayStart,formatDate) + "..." + utils.dateFormat(weekDayEnd,formatDate)
				
				//set date incrementer
				var myDate = globals.DATE_date_range_track
				myDate.setDate(globals.DATE_date_range_track.getDate() - 7)
				
				globals.DATE_date_range_track = myDate				
				
				
				break
				
	case "Month" :
	
				//start
				var monthStart = new Date(globals.DATE_date_range_track)
				monthStart.setMonth(monthStart.getMonth() - 1)
			
				//end
				var monthEnd = new Date(globals.DATE_date_range_track)
				monthEnd.setDate(monthEnd.getDate() - 1)	
				
				//set the search field
				globals.DATE_date_range_entry = utils.dateFormat(monthStart,formatDate) + "..." + utils.dateFormat(monthEnd,formatDate)
				
				//set tracker global for next up or down
				globals.DATE_date_range_track = monthStart
	
				break
				
	case "Quarter" :
				var quarterStart = new Date(globals.DATE_date_range_track)
				quarterStart.setDate(1)
				
				var quarterEnd = new Date()
				quarterEnd.setYear(quarterStart.getFullYear())
				quarterEnd.setMonth(quarterStart.getMonth())
				quarterEnd.setDate(quarterStart.getDate())
				
				var month = quarterStart.getMonth()
				
				//1st quarter
				if (month == 0 || month == 1 || month == 2) {
					quarterStart.setMonth(9)
					var year = quarterStart.getFullYear()
					quarterStart.setYear(year - 1)
					quarterEnd = new Date()
					quarterEnd.setYear(year - 1)
					quarterEnd.setMonth(11)
					quarterEnd.setDate(31)		
				}
				//2nd quarter
				else if (month == 3 || month == 4 || month == 5) {
					quarterStart.setMonth(0)
					var year = quarterStart.getFullYear()
					quarterEnd = new Date()
					quarterEnd.setYear(year)
					quarterEnd.setMonth(2)
					quarterEnd.setDate(31)	
				}
				//3rd quarter
				else if (month == 6 || month == 7 || month == 8) {
					quarterStart.setMonth(3)
					var year = quarterStart.getFullYear()
					quarterEnd = new Date()
					quarterEnd.setYear(year)
					quarterEnd.setMonth(5)
					quarterEnd.setDate(30)	
				}
				//4th quarter
				else if (month == 9 || month == 10 || month == 11) {
					quarterStart.setMonth(6)
					var year = quarterStart.getFullYear()
					quarterEnd = new Date()
					quarterEnd.setYear(year)
					quarterEnd.setMonth(8)
					quarterEnd.setDate(31)	
				}
				
				//set the field
				globals.DATE_date_range_entry = utils.dateFormat(quarterStart,formatDate) + "..." + utils.dateFormat(quarterEnd,formatDate)
				
				//set counter global
				globals.DATE_date_range_track = quarterStart	

				break

	case "Year"		:
	
				//start
				var yearStart = new Date(globals.DATE_date_range_track)
				yearStart.setMonth(0)
				yearStart.setYear(yearStart.getFullYear() - 1)
				
				//end
				var yearEnd = new Date(globals.DATE_date_range_track)
				yearEnd.setYear(yearEnd.getFullYear() - 1)
				yearEnd.setMonth(11)
				yearEnd.setDate(31)
				
				//set the field
				globals.DATE_date_range_entry = utils.dateFormat(yearStart,formatDate) + "..." + utils.dateFormat(yearEnd,formatDate)
				
				//reset counter global
				globals.DATE_date_range_track = yearStart	
				
				break

}
}

/**
 *
 * @properties={typeid:24,uuid:"a97c0952-d31d-4826-8d89-a6aac8d7e37b"}
 */
function ACTION_range_set()
{

/*
 *	TITLE    :	ACTION_range_set
 *			  	
 *	MODULE   :	rsrc_DATE_date_picker
 *			  	
 *	ABOUT    :	show/hide fields
 *			  	choose day, week, month, quarter or year to filter by
 *			  	sets globals.DATE_date_range_entry and globals.DATE_date_range_track
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Oct 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */ //TODO: implement time search params

//set visibility on elements
elements.date_range.visible = true
elements.date_range_prev.visible = true
elements.date_range_next.visible = true
elements.date_start.visible = false
elements.date_end.visible = false
elements.lbl_date_start.visible = false
elements.lbl_date_end.visible = false
elements.date_time.visible = false
elements.date_time_start.visible = false
elements.date_time_end.visible = false
elements.lbl_date_time.visible = false
elements.lbl_date_time_start.visible = false
elements.lbl_date_time_end.visible = false
elements.time_end_up.visible = false
elements.time_end_down.visible = false
elements.time_start_up.visible = false
elements.time_start_down.visible = false

var formatDate = (application.__parent__.solutionPrefs && solutionPrefs.fastFind.dateFormat) ? solutionPrefs.fastFind.dateFormat : i18n.getDefaultDateFormat()

//set starting date range
switch (globals.DATE_date_range_type) {
	case "Day" :
	
		//set tracker for previous and next
		globals.DATE_date_range_track = (globals.DATE_date_range_track) ? globals.DATE_date_range_track : new Date()
		
		globals.DATE_date_range_entry = utils.dateFormat(globals.DATE_date_range_track,formatDate) + ""
	
		break
			
	case "Week" :
	
		var today = (globals.DATE_date_range_track) ? globals.DATE_date_range_track : new Date()
//		var todayYear = today.getFullYear()
//		var todayMonth = today.getMonth()
//		var todayDay = today.getDate()
		
		var dayNumber = today.getDay()
		
		var weekDayStart = new Date()
		weekDayStart.setDate(today.getDate() - dayNumber)
		
		var weekDayEnd = new Date()
		weekDayEnd.setDate(today.getDate() + (7 - dayNumber))
		
		globals.DATE_date_range_entry = utils.dateFormat(weekDayStart,formatDate) + "..." + utils.dateFormat(weekDayEnd,formatDate)
		
		//set tracker for previous and next
		globals.DATE_date_range_track = weekDayStart
		
		break
		
	case "Month" :
		
		var monthStart = (globals.DATE_date_range_track) ? globals.DATE_date_range_track : new Date()
		monthStart.setDate(1)

		var monthEnd = new Date()
		monthEnd.setMonth(monthStart.getMonth() + 1)
		monthEnd.setDate(monthStart.getDate() - 1)
		
		//set the field
		globals.DATE_date_range_entry = utils.dateFormat(monthStart,formatDate) + "..." + utils.dateFormat(monthEnd,formatDate)
		
		//set tracker for previous and next
		globals.DATE_date_range_track = monthStart
		
		break
		
	case "Quarter" :
		
		var today = (globals.DATE_date_range_track) ? globals.DATE_date_range_track : new Date()
		
		var quarterStart = new Date()
		quarterStart.setDate(today.getDate())
		quarterStart.setDate(1)
		
		var quarterEnd = new Date()
		quarterEnd.setYear(quarterStart.getFullYear())
		quarterEnd.setMonth(quarterStart.getMonth())
		quarterEnd.setDate(quarterStart.getDate())
				
		var month = quarterStart.getMonth()
		
		//1st quarter
		if (month == 0 || month == 1 || month == 2) {
			quarterStart.setMonth(0)
			quarterEnd.setMonth(2)
			quarterEnd.setDate(31)		
		}
		//2nd quarter
		else if (month == 3 || month == 4 || month == 5) {
			quarterStart.setMonth(3)
			quarterEnd.setMonth(5)
			quarterEnd.setDate(30)	
		}
		//3rd quarter
		else if (month == 6 || month == 7 || month == 8) {
			quarterStart.setMonth(6)
			quarterEnd.setMonth(8)
			quarterEnd.setDate(31)	
		}
		//4th quarter
		else if (month == 9 || month == 10 || month == 11) {
			quarterStart.setMonth(9)
			quarterEnd.setMonth(11)
			quarterEnd.setDate(31)	
		}
		
		//set the field
		globals.DATE_date_range_entry = utils.dateFormat(quarterStart,formatDate) + "..." + utils.dateFormat(quarterEnd,formatDate)

		//set tracker for previous and next
		globals.DATE_date_range_track = quarterStart
	
		break
		
	case "Year" :

		//start
		var yearStart = (globals.DATE_date_range_track) ? globals.DATE_date_range_track : new Date()
		yearStart.setMonth(0)
		yearStart.setDate(1)
		
		//end
		var yearEnd = (globals.DATE_date_range_track) ? globals.DATE_date_range_track : new Date()
		yearEnd.setMonth(11)
		yearEnd.setDate(31)
		
		//set the field
		globals.DATE_date_range_entry = utils.dateFormat(yearStart,formatDate) + "..." + utils.dateFormat(yearEnd,formatDate)
		
		//set tracker for previous and next
		globals.DATE_date_range_track = yearStart		
		
		break
	
	case "Custom":
		elements.date_range.visible = false
		elements.date_range_prev.visible = false
		elements.date_range_next.visible = false
		elements.date_start.visible = true
		elements.date_end.visible = true
		elements.lbl_date_start.visible = true
		elements.lbl_date_end.visible = true
		
		//set the field
		if (globals.DATE_date_range_start && globals.DATE_date_range_end) {
			globals.DATE_date_range_entry = utils.dateFormat(globals.DATE_date_range_start,formatDate) + "..." + utils.dateFormat(globals.DATE_date_range_end,formatDate)
		}
		break

	case "Time":
		elements.date_range.visible = false
		elements.date_range_prev.visible = false
		elements.date_range_next.visible = false
		elements.date_time.visible = true
		elements.date_time_start.visible = true
		elements.date_time_end.visible = true
		elements.lbl_date_time.visible = true
		elements.lbl_date_time_start.visible = true
		elements.lbl_date_time_end.visible = true
		elements.time_end_up.visible = true
		elements.time_end_down.visible = true
		elements.time_start_up.visible = true
		elements.time_start_down.visible = true
		
		//set date portion
		if (globals.DATE_date_range_start) {
			if (!globals.DATE_date_range_end) {
				globals.DATE_date_range_end = globals.DATE_date_range_start
			}
			globals.DATE_date_range_end.setYear(globals.DATE_date_range_start.getFullYear())
			globals.DATE_date_range_end.setMonth(globals.DATE_date_range_start.getMonth())
			globals.DATE_date_range_end.setDate(globals.DATE_date_range_start.getDate())
		}
		
		//set the field
		if (globals.DATE_date_range_start && globals.DATE_date_range_end) {
			globals.DATE_date_range_entry = utils.dateFormat(globals.DATE_date_range_start,'hh:mm a') + "..." + utils.dateFormat(globals.DATE_date_range_end,'hh:mm a')
		}
		
		break
}

}

/**
 *
 * @properties={typeid:24,uuid:"6a5aff07-19a9-439a-99bf-3204526ced04"}
 */
function ACTION_search()
{

/*
 *	TITLE    :	ACTION_search
 *			  	
 *	MODULE   :	rsrc_DATE_date_picker
 *			  	
 *	ABOUT    :	performs date search or return to fast find
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	globals.DATE_date_range_search_form, globals.DATE_date_range_entry
 *			  	
 *	MODIFIED :	Oct 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */	

//detect how called; if by fast find, run current code; else, run standalone code
if (this.FrameworksFastFind) {
	//clear out flag
	this.FrameworksFastFind = null
	
	//enable closing the form
	globals.CODE_hide_form = 1
	
	//close FID
	globals.CODE_form_in_dialog_close('datePicker')
	
	globals.DATASUTRA_find = (globals.DATE_date_range_type == 'Day') ? '#'+globals.DATE_date_range_entry : globals.DATE_date_range_entry //trap for day
	globals.NAV_find_end_normal()

}
//non-Data Sutra calling of date picker
else {
	//clear out flag
	this.FrameworksFastFind = null
	
	//enable closing the form
	globals.CODE_hide_form = 1
	
	//close FID
	globals.CODE_form_in_dialog_close('datePicker')
	
	//copy current foundset to restore if no records are found
	var currentRecs = forms[globals.DATE_date_range_search_form].foundset.duplicateFoundSet()
	
	var searchDate = new Date()
	searchDate = globals.DATE_date_range_entry
	
	//search calling form
	forms[globals.DATE_date_range_search_form].controller.find()
	
	forms[globals.DATE_date_range_search_form][globals.DATE_date_range_field_name] = searchDate
	
	forms[globals.DATE_date_range_search_form].elements.fld_date_to_search.requestFocus()
	
	forms[globals.DATE_date_range_search_form].elements.fld_date_to_search.replaceSelectedText("")
	
	var count = forms[globals.DATE_date_range_search_form].controller.search()
	
	if (!count) {
	
		plugins.dialogs.showInfoDialog(
			"Feedback",
			"No records found. Previous foundset restored.",
			"OK")
		
		//load previous foundset
		forms[globals.DATE_date_range_search_form].controller.loadRecords(currentRecs)
			
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"7d0876c7-ccb9-4648-a0ec-10c06c6aa841"}
 */
function ACTION_time_adjust()
{

/*
 *	TITLE    :	ACTION_time_adjust
 *			  	
 *	MODULE   :	rsrc_DATE_date_picker
 *			  	
 *	ABOUT    :	increment time up or down by 30 minutes
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	May 2008 -- David Workman, Data Mosaic
 *			  	
 */
  
var buttonName = application.getMethodTriggerElementName()  
var formName = application.getMethodTriggerFormName()  
  
var fieldParts = buttonName.split("_")  

var direction = fieldParts[fieldParts.length - 1]  

switch (buttonName.slice(0,buttonName.length - direction.length - 1)) {
	case 'time_start':
		var fieldName = 'DATE_date_range_start'
		break
	case 'time_end':
		var fieldName = 'DATE_date_range_end'
		break
} 
  
//get values
if (globals[fieldName]) {
	var currentValue = utils.dateFormat(globals[fieldName], "HH:mm")
}
else {
	var temp = globals[fieldName] = new Date()
	temp.setHours(8)
	temp.setMinutes(0)
	var currentValue = utils.dateFormat(temp, "HH:mm")
}

var splitValue = currentValue.split(":")

var currentHours = Math.round(splitValue[0])
var currentMinutes = Math.round(splitValue[1])

//move up 1 hours
if (currentMinutes >= 30) {
	if (direction == "up") {
		currentHours += 1
		currentMinutes = 0
	}
	else {
		currentMinutes = 0
	}
}
else {
	if (direction == "down") {
		currentHours -= 1
		currentMinutes = 30
	}
	else {
		currentMinutes = 30
	}
}

var returnValue = utils.dateFormat(globals[fieldName], "MM-dd-yyyy") +' ' + currentHours + ":" + currentMinutes

globals[fieldName] = utils.dateFormat(returnValue, "MM-dd-yyyy HH:mm")

//check to make sure that end value is not earlier than start value
if (globals.DATE_date_range_end < globals.DATE_date_range_start) {
	
	switch (fieldName) {
		case 'DATE_date_range_start':
			var tempDate = globals.DATE_date_range_start
			globals.DATE_date_range_end = tempDate.setHours(globals.DATE_date_range_start.getHours() + 1)
			break
		case 'DATE_date_range_end':
			var tempDate = globals.DATE_date_range_end
			globals.DATE_date_range_start = tempDate.setHours(globals.DATE_date_range_end.getHours() - 1)
			break
	} 
}
 
}

/**
 *
 * @properties={typeid:24,uuid:"b6a4fe7f-b0de-421e-a4f5-4c10bedfaade"}
 */
function ACTION_up()
{

/*
 *	TITLE    :	ACTION_up
 *			  	
 *	MODULE   :	rsrc_DATE_date_picker
 *			  	
 *	ABOUT    :	increment up by day, week, month, quarter or year
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	globals.DATE_date_range_type, globals.DATE_date_range_entry
 *			  	
 *	MODIFIED :	Jan 2007 -- David Workman, Data Mosaic
 *			  	
 */

var formatDate = (application.__parent__.solutionPrefs && solutionPrefs.fastFind.dateFormat) ? solutionPrefs.fastFind.dateFormat : i18n.getDefaultDateFormat()

switch (globals.DATE_date_range_type) {

	case "Day"	:
				
				var x = new Date()

				x = utils.dateFormat(globals.DATE_date_range_entry,formatDate)
				
				var y = x.getDate()
				
				x.setDate(y + 1)
				
				globals.DATE_date_range_entry = utils.dateFormat(x,formatDate)
								
				break
				
	case "Week"	:
	
				//week
				var dayNumber = globals.DATE_date_range_track.getDay()
				
				var weekDayStart = globals.DATE_date_range_track
				weekDayStart.setDate((globals.DATE_date_range_track.getDate() + 7) -  dayNumber)
				
				var weekDayEnd = globals.DATE_date_range_track
				weekDayEnd.setDate((globals.DATE_date_range_track.getDate() + 7) + (7 - dayNumber))
				
				//set filter value
				globals.DATE_date_range_entry = utils.dateFormat(weekDayStart,formatDate) + "..." + utils.dateFormat(weekDayEnd,formatDate)
				
				//set date incrementer
				var myDate = globals.DATE_date_range_track
				myDate.setDate(globals.DATE_date_range_track.getDate() + 7)
				
				globals.DATE_date_range_track = myDate		
				
				break
				
	case "Month":
	
				//start
				var monthStart = new Date(globals.DATE_date_range_track)
				monthStart.setMonth(monthStart.getMonth() + 1)
				
				//end
				var monthEnd = new Date(globals.DATE_date_range_track)
				monthEnd.setMonth(monthStart.getMonth() + 1)
				monthEnd.setDate(monthStart.getDate() - 1)
								
				//set the search field
				globals.DATE_date_range_entry = utils.dateFormat(monthStart,formatDate) + "..." + utils.dateFormat(monthEnd,formatDate)
				
				//set tracker global to use for week prev and next
				globals.DATE_date_range_track = monthStart

				break
				
	case "Quarter" :
							
				//setup
				var quarterStart = new Date(globals.DATE_date_range_track)
				
				var quarterEnd = new Date()
				quarterEnd.setYear(quarterStart.getFullYear())
				quarterEnd.setMonth(quarterStart.getMonth())
				quarterEnd.setDate(quarterStart.getDate())
				
				var month = quarterStart.getMonth()
				
				//1st quarter
				if (month == 0 || month == 1 || month == 2) {
					quarterStart.setMonth(3)
					quarterEnd.setMonth(5)
					quarterEnd.setDate(30)		
				}
				//2nd quarter
				else if (month == 3 || month == 4 || month == 5) {
					quarterStart.setMonth(6)
					quarterEnd.setMonth(8)
					quarterEnd.setDate(31)	
				}
				//3rd quarter
				else if (month == 6 || month == 7 || month == 8) {
					quarterStart.setMonth(9)
					quarterEnd.setMonth(11)
					quarterEnd.setDate(31)	
				}
				//4th quarter
				else if (month == 9 || month == 10 || month == 11) {
					quarterStart.setMonth(0)
					var year = quarterStart.getFullYear()
					quarterStart.setYear(year + 1)
					quarterEnd.setYear(year + 1)
					quarterEnd.setMonth(2)
					quarterEnd.setDate(31)	
				}
				
				//set the field
				globals.DATE_date_range_entry = utils.dateFormat(quarterStart,formatDate) + "..." + utils.dateFormat(quarterEnd,formatDate)
				
				//set counter global
				globals.DATE_date_range_track = quarterStart				
			
				break
					
	case "Year" 	:
	
				//start
				var yearStart = new Date(globals.DATE_date_range_track)
				yearStart.setMonth(0)
				yearStart.setYear(yearStart.getFullYear() + 1)
				
				//end
				var yearEnd = new Date(globals.DATE_date_range_track)
				yearEnd.setYear(yearEnd.getFullYear() + 1)
				yearEnd.setMonth(11)
				yearEnd.setDate(31)
				
				//set the field
				globals.DATE_date_range_entry = utils.dateFormat(yearStart,formatDate) + "..." + utils.dateFormat(yearEnd,formatDate)
				
				//reset counter global
				globals.DATE_date_range_track = yearStart	

				break
}
}

/**
 *
 * @properties={typeid:24,uuid:"33cb219d-43b8-4834-8c14-f2ed7d3eb475"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	rsrc_DATE_date_picker
 *			  	
 *	ABOUT    :	instantiates default values for date picker
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	ACTION_range_set()
 *			  	
 *	MODIFIED :	Oct 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//disable closing the form
globals.CODE_hide_form = 0

globals.DATE_date_range_entry = null
globals.DATE_date_range_track = null
globals.DATE_date_range_type = "Day"
globals.DATE_date_range_start = null
globals.DATE_date_range_end = null

//set format of custom fields to be the frameworks one
var formatDate = (application.__parent__.solutionPrefs && solutionPrefs.fastFind.dateFormat) ? solutionPrefs.fastFind.dateFormat : i18n.getDefaultDateFormat()
elements.date_start.format = formatDate
elements.date_end.format = formatDate

ACTION_range_set()

}
