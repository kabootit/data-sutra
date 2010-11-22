/**
 *
 * @properties={typeid:24,uuid:"ab818c49-232b-4af5-b777-ba0f55990f87"}
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
var valueList = ['Adjust status','Add image','Delete image','----','Delete record']

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
 * @properties={typeid:24,uuid:"988a7fc1-f6c7-46db-83e5-999a28e0fbc9"}
 */
function ACTIONS_list_control()
{

switch (arguments[0]) {
	case 0:	//adjust status
		var newStatus = plugins.dialogs.showSelectDialog( 'Change product status',  'Please set the correct status',  'Active', 'Inactive')
		if (newStatus == 'Active') {
			is_active = 1
		}
		else if (newStatus == 'Inactive') {
			is_active = 0
		}
		break
	case 1:	//add image
		//Shows a file open dialog, by default files and folders can be selected
		var file = plugins.file.showFileOpenDialog(0)
		
		//if they didn't "cancel" this dialog
		if(file) {
			//read in the file
			var rawData = plugins.file.readFile(file)
			
			if(rawData) {
				var fileName = file.getName()
				var ext = utils.stringRight(fileName, 3)
				var type = plugins.images.getImage(rawData)
				var contentType = type.getContentType()
				
				if(utils.stringPatternCount(contentType, 'image') > 0) {
					//it's an image we can display
					image_thumbnail = application.createJPGImage(rawData, 210, 250)
				}
				else {
					//there will be no display
					image_thumbnail = null
					//show error message!
					plugins.dialogs.showWarningDialog('<html>This is<b> NOT an image file!</b><br>Please select a different file.</html>','OK')
					return
				}
				
				image_name = fileName
				image_type = ext
				image_mime_type = contentType
				product_image = rawData
				
				forms.CRM1_0F_products.REC_on_select()
				
				databaseManager.saveData()
			}
		
		}
		break
	case 2:	//delete image
		if (product_image) {
			//show a warning dialog
			var delImage = plugins.dialogs.showWarningDialog('Delete image','Are you sure you want to delete this image?','Cancel','Delete')
			if (delImage == 'Delete') {
				image_mime_type = null
				image_name = null
				image_thumbnail = null
				image_type = null
				product_image = null
				forms.CRM1_0F_products.REC_on_select()
			}
		}
		break
	case 4:	//delete record
		var delRec = plugins.dialogs.showWarningDialog('Delete record','Do you really want to delete this record?','Yes','No')
		if (delRec == 'Yes') {
			controller.deleteRecord()
		}		
		break
}
}

/**
 *
 * @properties={typeid:24,uuid:"3a1f181f-0157-44f8-b24f-d2f37e918533"}
 */
function REC_new()
{

/*
 *	TITLE:		REC_new
 *
 *	MODULE:		DEV_TMPL_template_sutra_core
 *
 *	ABOUT:		Creates new example record
 *
 *	MODIFIED:	Aug 29, 2007 - Troy Elliott, Data Mosaic
 *
 */

controller.newRecord(true)
databaseManager.saveData()

forms.CRM1_0F_products.elements.fld_product_name.requestFocus(false)
}
