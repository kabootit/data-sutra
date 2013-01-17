/**
 *
 * @properties={typeid:24,uuid:"780cc0a9-8c41-43fc-8395-9832b83ec8a2"}
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
var valueList = ['Adjust status','-','Delete record']

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
 * @properties={typeid:24,uuid:"f0bbe5f5-4952-4848-b8e3-d3bdce4111a3"}
 */
function ACTIONS_list_control()
{

switch (arguments[0]) {
	case 0:	//adjust status
		var newStatus = globals.DIALOGS.showSelectDialog( 'Change contact status',  'Please set the contact status',  ['Active', 'Inactive'])
		if (newStatus == 'Active') {
			is_active = 1
		}
		else if (newStatus == 'Inactive') {
			is_active = 0
		}
		break
	case 2:	//delete something
		var delRec = globals.DIALOGS.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')
		if (delRec == 'Yes') {
			controller.deleteRecord()
		}		
		break
}
}

/**
 *
 * @properties={typeid:24,uuid:"72b3ad1e-3801-4517-a663-bcf25874bf24"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	create a new contact record
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

//new record
controller.newRecord(true)
databaseManager.saveData()

//enter first field
forms.CRM1_0F_contacts.elements.fld_name_first.requestFocus(false)
}
