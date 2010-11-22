/**
 *
 * @properties={typeid:24,uuid:"4B3382BE-8878-4C34-A017-B8804C315A55"}
 */
function ACTIONS_list()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	pop the menu up instead of the default down
 *			  	uses a secondary invisible object on the layout which is behind the clicked button
 *			  	move secondary object up far enough to drop down a popup that hits the top edge
 *			  		of clicked btn
 *			  	when menu item is selected, return secondary object to original location
 *			  	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	ACTIONS_list_control()
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get menu list from a value list
var valueList = ['Rename organization','----','Delete record']

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


//hack not required
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//pop up the popup menu
	var elem = elements[application.getMethodTriggerElementName()]
	if (elem != null) {
	    plugins.popupmenu.showPopupMenu(elem, menu);
	}
}
//legacy
else {
	//allow popup to approximately work even when solutionPrefs isn't defined
	if (application.__parent__.solutionPrefs) {
		var lineHeight = solutionPrefs.clientInfo.popupHack.lineHeight
		var topShift = solutionPrefs.clientInfo.popupHack.topShift
	}
	else {
		var lineHeight = 0
		var topShift = 0
	}
	
	//move "up" button to correct location
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
}

/**
 *
 * @properties={typeid:24,uuid:"5C1783BF-1099-4053-A8FF-871F33132C75"}
 */
function ACTIONS_list_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	0: Delete record
 *			  	
 *	INPUT    :	position in array of action item
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch (arguments[0]) {
	case 0:	//rename record
		var orgName = plugins.dialogs.showInputDialog(
						'Rename SAAS organization', 
						'Enter new name:', name_organization
					)
		
		if (orgName) {
			name_organization = orgName
			databaseManager.saveData()
		}
	break
	case 2:	//delete record
		var delRec = plugins.dialogs.showWarningDialog(
							'Delete record',
							'Do you really want to delete the selected organization?',
							'Yes',
							'No'
						)
		
		if (delRec == 'Yes') {
			controller.deleteRecord()
		}
		break	
}
}

/**
 *
 * @properties={typeid:24,uuid:"6A129FF4-84F3-4CDF-B431-FA1777F26E28"}
 */
function REC_new()
{
	var input = plugins.dialogs.showInputDialog(
					'Organization',
					'What is the name of this organization?'
			)
	
	if (input) {
		controller.newRecord(false)
		name_organization = input
		databaseManager.saveData()
	}
}
