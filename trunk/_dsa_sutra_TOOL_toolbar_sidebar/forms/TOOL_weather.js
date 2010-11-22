/**
 *
 * @properties={typeid:24,uuid:"9c6e4441-96f1-48e7-a27f-9b0faad9bc6c"}
 */
function ACTION_refresh()
{

/*
 *	TITLE    :	ACTION_refresh
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	get the weather
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_refresh()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs must be valid
if (application.__parent__.solutionPrefs) {
	if (solutionPrefs.clientInfo.externalIP == 'UNKNOWN') {
		globals.TOOL_weather_temp = 'No internet connection'
	}
	else if (globals.TOOL_weather_zip && globals.TOOL_weather_scale) {
		
		var pageString = "http://m.wund.com/cgi-bin/findweather/getForecast?brand=mobile_"
		
		switch (globals.TOOL_weather_scale) {
				case 'C':
					pageString += 'metric'
					break
				case 'F':
					pageString += 'english'
					break
		}
		
		var comma = utils.stringPosition(globals.TOOL_weather_zip,',',0,1)
		//if city,state or city,country
		if (comma) {
			var citycountry = utils.stringReplace(globals.TOOL_weather_zip,' ','%20')
			citycountry = utils.stringReplace(citycountry,',','')
			
			pageString += '&query=' + citycountry
		}
		//if zipcode
		else {
			pageString += '&query=' + globals.TOOL_weather_zip
		}
		
		var pageData = plugins.http.getPageData(pageString)
		
		if (pageData) {
			var pageItems = new Object()
			
			//city and state
			var posnStart = utils.stringPosition(pageData, '<h2>', 0, 1) + 4
			var posnStop = utils.stringPosition(pageData, '</h2>', 0, 1)
			if (posnStop >= 0 && posnStart >= 0) {
				var cityState = utils.stringMiddle(pageData,posnStart, posnStop - posnStart)
				cityState = cityState.split(', ')
			}
			else {
				var city = utils.stringLeft(globals.TOOL_weather_zip,comma-1)
				var state = utils.stringRight(globals.TOOL_weather_zip,globals.TOOL_weather_zip.length - comma-1)
				var cityState = [city,state]
			}
			globals.TOOL_weather_city = cityState[0]
			globals.TOOL_weather_state = cityState[1]
			
			//table with info
			var posnStart = utils.stringPosition(pageData, '<center>', 0, 1) + 27
			var posnStop = utils.stringPosition(pageData, '</center>', 0, 1)
			
			var tableInfo = pageItems.tableInfo = globals.TOOL_weather_table = '<html><table '+ utils.stringMiddle(pageData,posnStart, posnStop - posnStart)
			
			//get temp
			var posnStart = utils.stringPosition(tableInfo, '<td>Temperature</td>', 0, 1) + 54
			var posnStop = utils.stringPosition(tableInfo, '</b>', 0, 3)
			globals.TOOL_weather_temp = 'Currently ' + utils.stringMiddle(tableInfo,posnStart, posnStop - posnStart)
			globals.TOOL_weather_temp += '&#176; '+ globals.TOOL_weather_scale
		}
	}
	else {
		globals.TOOL_weather_temp = 'Weather not configured'
	}
}
else {
	globals.TOOL_weather_temp = 'Weather not available'
}
}

/**
 *
 * @properties={typeid:24,uuid:"84714112-f1a9-4d38-bf9e-1922c61758de"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	gets the weather
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	July 24, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

ACTION_refresh()
}

/**
 *
 * @properties={typeid:24,uuid:"14e21c4a-2820-4c66-a8cd-e7944e41a225"}
 */
function GOTO_wunderground()
{
var pageString = "http://www.wunderground.com/cgi-bin/findweather/getForecast?query="

var comma = utils.stringPosition(globals.TOOL_weather_zip,',',0,1)

//if city,state or city,country
if (comma) {
	var citycountry = utils.stringReplace(globals.TOOL_weather_zip,' ','%20')
	citycountry = utils.stringReplace(citycountry,',','')
	
	pageString += citycountry
}

//if zipcode
else {
	pageString += globals.TOOL_weather_zip
}

globals.CODE_url_handler(pageString)

}
