/**
 *
 * @properties={typeid:24,uuid:"838eb618-5a11-42ce-ac0a-6de73e53bebe"}
 */
function ACTIONS_list()
{


/*****
	pop the menu up instead of the default down
	uses a secondary invisible object on the layout which is behind the clicked button
	move secondary object up far enough to drop down a popup that hits the top edge
		of clicked btn
	when menu item is selected, return secondary object to original location
*****/

//get menu list from a value list
var valueList = ['Delete record']

//build menu
var menu = new Array
for ( var i = 0 ; i < valueList.length ; i++ ) {
	menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_control)
}

//set menu method arguments and check mark
var x = 0
while (menu[x]) {
	//pass arguments
	menu[x].setMethodArguments(x)
	x++
}

//move "up" button to correct location
var lineHeight = solutionPrefs.clientInfo.popupHack.lineHeight
var topShift = solutionPrefs.clientInfo.popupHack.topShift
var btnInvisible = application.getMethodTriggerElementName() + "_up"
var currentLocationX = elements[btnInvisible].getLocationX()
var currentLocationY = elements[btnInvisible].getLocationY()

elements[btnInvisible].setLocation(currentLocationX, currentLocationY - (topShift + (menu.length * lineHeight)))

//pop up the popup menu
var elem = elements[btnInvisible]
if (elem != null) {
	plugins.popupmenu.showPopupMenu(elem, menu);
}

//set invisible btn back to original location
elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
}

/**
 *
 * @properties={typeid:24,uuid:"153df6f8-c88b-454b-a7a5-f93110796761"}
 */
function ACTIONS_list_control()
{

switch (arguments[0]) {
	case 0:	//delete something
		var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')
		if (delRec == 'Yes') {
			controller.deleteRecord()
		}		
		break
}
}

/**
 *
 * @properties={typeid:24,uuid:"ee28f45b-6e10-4395-9261-967858c1feb6"}
 */
function FILTERS_list()
{
//get menu list from a value list
var dataset = application.getValueListItems("TMPLT_FILTER_example")
var valueList = dataset.getColumnAsArray(1)

valueList.unshift("<html><b>All","---")

//build menu
var menu = new Array
for ( var i = 0 ; i < valueList.length ; i++ ) {
	menu[i] = plugins.popupmenu.createCheckboxMenuItem(valueList[i] + "", FILTERS_list_control)
}

//set menu method arguments and check mark
var x = 0
while (menu[x]) {
	//pass arguments
	menu[x].setMethodArguments(menu[x].text)
	
	//set check mark
	if (globals.TMPLT_example_filter == menu[x].text) {
		menu[x].setSelected(true)
	}
	else {
		menu[x].setSelected(false)
	}
	x++
}

//move "up" button to correct location
var lineHeight = solutionPrefs.clientInfo.popupHack.lineHeight
var topShift = solutionPrefs.clientInfo.popupHack.topShift
var btnInvisible = application.getMethodTriggerElementName() + "_up"
var currentLocationX = elements[btnInvisible].getLocationX()
var currentLocationY = elements[btnInvisible].getLocationY()

elements[btnInvisible].setLocation(currentLocationX, currentLocationY - (topShift + (menu.length * lineHeight)))

//pop up the popup menu
var elem = elements[btnInvisible]
if (elem != null) {
	plugins.popupmenu.showPopupMenu(elem, menu)
}

//set invisible btn back to original location
elements[btnInvisible].setLocation(currentLocationX, currentLocationY)

}

/**
 *
 * @properties={typeid:24,uuid:"64a94272-b2a9-4033-8436-12ce61c5f8ba"}
 */
function FILTERS_list_control()
{
//filter list by passed variable

globals.TMPLT_example_filter = arguments[0]

if (arguments[0] != "<html><b>All") {

	var server = controller.getServerName()
	var maxReturnedRows = 1000
	var args = []
	
	switch (globals.TMPLT_example_filter) {
			case 'Even':
				var query = 'SELECT company_id FROM '+controller.getTableName()+' WHERE mod(company_id,2) = 0'
				var dataset = databaseManager.getDataSetByQuery(server, query, args, maxReturnedRows)
				controller.loadRecords(dataset)
			
				break
			case 'Odd':
				var query = 'SELECT company_id FROM '+controller.getTableName()+' WHERE mod(company_id,2) = 1'
				var dataset = databaseManager.getDataSetByQuery(server, query, args, maxReturnedRows)
				controller.loadRecords(dataset)	
				
				break
	}
}
else {
	controller.loadAllRecords()
}
}

/**
 *
 * @properties={typeid:24,uuid:"3be96e91-610d-44cc-bb84-7e2d2745c7c0"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_new()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

controller.newRecord(true)
databaseManager.saveData()

forms.CRM1_0F_companies.elements.fld_company_name.requestFocus()
}
