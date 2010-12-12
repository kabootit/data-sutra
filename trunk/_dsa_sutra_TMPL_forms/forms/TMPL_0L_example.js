/**
 *
 * @properties={typeid:24,uuid:"917de3a5-ff70-4d04-ab62-d487fe94ff8c"}
 */
function ACTIONS_list()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	rsrc_TMPL_template
 *			  	
 *	ABOUT    :	pop the menu up instead of the default down
 *			  	uses a secondary invisible object on the layout which is behind the clicked button
 *			  	move secondary object up far enough to drop down a popup that hits the top edge
 *			  		of clicked btn
 *			  	when menu item is selected, return secondary object to original location
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	application.getMethodTriggerElementName() and application.getMethodTriggerElementName() + _up
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */ //TODO: shift values for pc


//get menu list from a value list
var valueList = ['Action 1','Action 2','-','Delete record']

//build menu
var menu = new Array
for ( var i = 0 ; i < valueList.length ; i++ ) {
	menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_control)
}

//set menu method arguments
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
 * @properties={typeid:24,uuid:"415e1063-c03b-46d6-a707-5b7ad8c7fce3"}
 */
function ACTIONS_list_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	rsrc_TMPL_template
 *			  	
 *	ABOUT    :	do something, delete something
 *			  	
 *	INPUT    :	array index of pop-up clicked on
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch (arguments[0]) {
	case 0:	//do something
		
		break
	case 3:	//delete something
		var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')
		if (delRec == 'Yes') {
			controller.deleteRecord()
		}		
		break
}
}

/**
 *
 * @properties={typeid:24,uuid:"293e997a-d525-4df6-9827-6a8f65dd6348"}
 */
function FILTERS_list()
{

/*
 *	TITLE    :	FILTERS_list
 *			  	
 *	MODULE   :	rsrc_TMPL_template
 *			  	
 *	ABOUT    :	filters displayed data
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	TMPL_FILTER_example
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get menu list from a value list
var dataset = application.getValueListItems("TMPL_FILTER_example")
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
	if (globals.TMPL_example_filter == menu[x].text) {
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
 * @properties={typeid:24,uuid:"6cea1a83-9de1-4200-9b8c-507a090ba310"}
 */
function FILTERS_list_control()
{

/*
 *	TITLE    :	FILTERS_list_control
 *			  	
 *	MODULE   :	rsrc_TMPL_template
 *			  	
 *	ABOUT    :	filter list by passed variable
 *			  	
 *	INPUT    :	clicked option from list
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	id_framework_example field in table attached to
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TMPL_example_filter = arguments[0]

if (arguments[0] != "<html><b>All") {

	var server = controller.getServerName()
	var maxReturnedRows = 1000
	var args = []
	
	switch (globals.TMPL_example_filter) {
			case 'Even':
				var query = 'SELECT * FROM '+controller.getTableName()+' WHERE mod(id_framework_example,2) = 0;'
				var dataset = databaseManager.getDataSetByQuery(server, query, args, maxReturnedRows)
				controller.loadRecords(dataset)
			
				break
			case 'Odd':
				var query = 'SELECT * FROM '+controller.getTableName()+' WHERE mod(id_framework_example,2) = 1;'
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
 * @properties={typeid:24,uuid:"1e2ce3e0-a937-4a7b-826d-48974b98eb2e"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	rsrc_TMPL_template
 *			  	
 *	ABOUT    :	creates new example record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Aug 29, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

controller.newRecord(false)
}
