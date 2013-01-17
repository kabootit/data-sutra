/**
 *
 * @properties={typeid:24,uuid:"4AB29473-7CF6-4B7F-BD91-B58378AE57F7"}
 */
function ACTIONS_list()
{

/*
 *	TITLE    :	ACTIONS_list
 *			  	
 *	MODULE   :	rsrc_RPT_report
 *			  	
 *	ABOUT    :	report actions
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTIONS_list()
 *			  	
 *	MODIFIED :	September 18, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//menu items
var valuelist = new Array('Duplicate','Upload JasperReport to server','-','Delete all...')

//set up menu with arguments
var menu = new Array()
for ( var i = 0 ; i < valuelist.length ; i++ ) {
	menu[i] = plugins.popupmenu.createMenuItem(valuelist[i],ACTIONS_list_control)
	
	menu[i].setMethodArguments(i)
	
	if (menu[i].text == '-' || (i == 1 && !plugins.jasperPluginRMI)) {
		menu[i].setEnabled(false)
	}
}

//popup
var elem = elements[application.getMethodTriggerElementName()]
if (elem != null) {
	plugins.popupmenu.showPopupMenu(elem, menu)
}


}

/**
 *
 * @properties={typeid:24,uuid:"1162CA21-DE70-4D34-A393-FC6C6981DB97"}
 */
function ACTIONS_list_control()
{

/*
 *	TITLE    :	ACTIONS_list_control
 *			  	
 *	MODULE   :	rsrc_RPT_report
 *			  	
 *	ABOUT    :	report actions
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTIONS_list_control()
 *			  	
 *	MODIFIED :	September 18, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch( arguments[0] ) {
	case 0:	//duplicate
		REC_duplicate()
		break
	
	case 1:	//upload report
		if (plugins.jasperPluginRMI && plugins.jasperPluginRMI.reportDirectory) {
			var jasperFile = plugins.file.showFileOpenDialog(1)
			
			if (jasperFile) {
				plugins.jasperPluginRMI.writeFileToReportsDir(jasperFile.getName(), plugins.file.readFile(jasperFile))
			}
		}
		else {
			globals.DIALOGS.showErrorDialog(
					'Configuration error',
					'JasperReports is not correctly configured'
			)
		}
		break
	
	case 3:	//delete all
		var input = globals.DIALOGS.showWarningDialog("Warning", "Delete all records?", "Yes", "No")
		if (input == "Yes") {	
			forms.MGR_0F_report_1L_2L.controller.deleteAllRecords()
		}
		break
}



}

/**
 *
 * @properties={typeid:24,uuid:"957D23AA-2B37-4F23-ACC2-7E7F3774040C"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	rsrc_RPT_report
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TRIGGER_tooltip_set()


}

/**
 *
 * @properties={typeid:24,uuid:"25FD1D15-9708-4819-839C-BF8F6B8904EC"}
 */
function REC_duplicate()
{

/*
 *	TITLE    :	REC_duplicate
 *			  	
 *	MODULE   :	rsrc_RPT_report
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_duplicate()
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

controller.duplicateRecord(false)

forms.MGR_0F_report_1L_2L.elements.fld_desc.requestFocus(false)


}

/**
 *
 * @properties={typeid:24,uuid:"7C13FCA4-60F1-4C26-8E6E-DAB8B5EE9164"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	rsrc_RPT_report
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
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

controller.newRecord(true)
forms.MGR_0F_report_1L_2L.elements.fld_desc.requestFocus(false)


}
