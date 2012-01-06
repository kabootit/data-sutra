/**
 *
 * @properties={typeid:24,uuid:"96549fe7-ad4a-49c2-ba96-c2f1eb1f4914"}
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
var valueList = ['Change status of order','-','Delete record']

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
 * @properties={typeid:24,uuid:"aaf82a7e-8caf-416f-8105-9a0087c8c7e0"}
 */
function ACTIONS_list_control()
{

switch (arguments[0]) {
	case 0:	//toggle status
		var newStatus = plugins.dialogs.showSelectDialog( 'Change order status',  'Please set the order status',  'Open', 'Closed')
		if (newStatus == 'Open') {
			is_active = 1
		}
		else if (newStatus == 'Closed') {
			is_active = 0
		}		
		break
	case 2:	//delete something
		var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')
		if (delRec == 'Yes') {
			controller.deleteRecord()
		}		
		break
}
}

/**
 *
 * @properties={typeid:24,uuid:"1874679e-6913-420b-876f-50bf18e4c721"}
 */
function FILTERS_list()
{
//get menu list from a value list
var valueList = new Array ('Open', 'Closed')

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
 * @properties={typeid:24,uuid:"a45a964f-8e21-4c03-a68d-c8267d84e824"}
 */
function FILTERS_list_control()
{
//filter list by passed variable

var filterValue = arguments[0]
globals.TMPL_example_filter = arguments[0]

if (filterValue != "<html><b>All") {
	
	switch (filterValue) {
			case 'Open':
				controller.find()
				is_active = 1
				controller.search()
				break
			case 'Closed':
				controller.find()
				is_active = 0
				controller.search()
				break
	}
	
	//update display with new record filter
	globals.TRIGGER_fastfind_display_set('Status filter: ' + filterValue,null,'is_active')
}
else {
	controller.loadAllRecords()
	
	//update display with new record filter
	globals.DATASUTRA_find = null
	globals.DATASUTRA_find_field = 'Show all'
}
}

/**
 *
 * @properties={typeid:24,uuid:"4aaac5f5-8426-4c51-910c-87024a5d2c03"}
 */
function REC_new()
{

/*
 *	TITLE:		REC_new
 *
 *	MODULE:		CRM_sutra_example
 *
 *	ABOUT:		Creates new example record
 *
 *	MODIFIED:	Aug 29, 2007 - Troy Elliott, Data Mosaic
 *
 */



//make sure the company has at least ONE address & ONE contact
var addrCnt = crm_orders_company_to_addresses.getSize()
var contCnt = crm_order_company_to_contacts.getSize()

if (addrCnt && contCnt) {
	controller.newRecord(false)
	
	//do the auto-enter stuff
	//set the next order number
	if (databaseManager.getFoundSetCount(foundset) == 0) {
		//never been an order number
		order_number = 1000
	}
	else {
		//sql query to get the highest invoice number = then add 1
		var query = 'select order_number from orders order by order_number desc'
		var dataset = databaseManager.getDataSetByQuery(controller.getServerName(), query, null, 1)
		order_number = dataset.getValue(1, 1) + 1
	}
	order_date = new Date()
	is_active = 1
	
	databaseManager.saveData()
	globals.TRIGGER_ul_refresh_all()
	
	forms.CRM1_0F_orders.elements.fld_order_number.requestFocus(false)
}
else if(addrCnt == 0) {
	//show error
	plugins.dialogs.showErrorDialog('Missing address','There needs to be at least one address defined for this customer before you can create an order.',  'OK')
}
else if(contCnt == 0) {
	//show error
	plugins.dialogs.showErrorDialog('Missing contact','There needs to be at least one contact defined for this customer before you can create an order.',  'OK')
}
}
