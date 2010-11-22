/**
 *
 * @properties={typeid:24,uuid:"D3452B63-215D-43C4-BA1A-50C6EF72C2B9"}
 */
function ACTION_tooltip_actions()
{

/*
 *	TITLE    :	ACTION_tooltip_actions
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	manage tooltip list
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Mar 2008 -- David Workman, Data Mosaic
 *			  	
 */


//menu items
var menu = new Array(
	plugins.popupmenu.createMenuItem("Duplicate", REC_duplicate),
	plugins.popupmenu.createMenuItem("Create from module...", GET_tips),
	plugins.popupmenu.createMenuItem("----"),
	plugins.popupmenu.createMenuItem("Show tooltip's form", ACTION_tooltip_actions_control),
	plugins.popupmenu.createMenuItem("----"),
	plugins.popupmenu.createMenuItem("Delete all...", ACTION_tooltip_actions_control),
	plugins.popupmenu.createMenuItem("Delete selected...", ACTION_tooltip_actions_control),
	plugins.popupmenu.createMenuItem("----"),
	plugins.popupmenu.createMenuItem("Print", ACTION_tooltip_actions_control)
)

//set arguments
for ( var i = 0 ; i < menu.length ; i++ ) {
	menu[i].setMethodArguments(i)
	
	if (menu[i].text == '----') {
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
 * @properties={typeid:24,uuid:"6C29D235-C4FD-40A8-96FF-EA92BB9E772E"}
 */
function ACTION_tooltip_actions_control()
{

/*
 *	TITLE    :	ACTION_tooltip_actions_control
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	manage tooltip list
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	October 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch( arguments[0] ) {
	//show form in dialog
	case 3:	
		if (utils.hasRecords(forms.MGR_0F_tooltip_1L_2L.foundset)) {
			//TODO: maybe not needed; destroy tooltip window so can set size correctly
			if (false) {
				toolTipPreview
			}
			
			POPUP_tooltip_form()
		}
		//error message
		else {
			plugins.dialogs.showErrorDialog(
								'Tooltip error',
								'No tooltip is selected'
							)
		}
		break
	
	//delete all
	case  5:
		var input = plugins.dialogs.showWarningDialog("Warning", "Delete all records?", "Yes", "No")
		if (input == "Yes") {	
			forms.MGR_0F_tooltip_1L.controller.deleteAllRecords()
			
			//clear global selector
			globals.TIP_select_all = 0
		}
		break
		
	//delete selected records
	case 6:
		var input = plugins.dialogs.showWarningDialog("Warning", "Delete selected records?", "Yes", "No")
		if (input == "Yes") {
			for ( var i = 0 ; i < forms.MGR_0F_tooltip_1L.foundset.getSize() ; i++ ) {
			
				var record = forms.MGR_0F_tooltip_1L.foundset.getRecord(i + 1)
				if (record.selected) {
					forms.MGR_0F_tooltip_1L.foundset.deleteRecord(i + 1)
					i --
				}
			}
			//clear global selector
			globals.TIP_select_all = 0
		}
		break
		
	//print
	case 8:
		PRINT_TIP_report()
		break
}
}

/**
 *
 * @properties={typeid:24,uuid:"EDE8A0BF-C47B-4BFF-A416-3EF74E76209A"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	this is attached to onShow so won't fire when reading in all the tooltips at solution's load
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	February 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.CALLBACK_tooltip_set()


}

/**
 *
 * @properties={typeid:24,uuid:"DC4A848C-D796-4B89-9A2D-CE3891670663"}
 */
function GET_tips()
{

/*
 *	TITLE    :	GET_tips
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	prompt to chose module to get tooltips from
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GET_tips()
 *			  	
 *	MODIFIED :	February 19, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs) {

	var dataset = application.getValueListItems('NAV_modules_included')
	var displayValues = dataset.getColumnAsArray(1)
	
	var module = plugins.dialogs.showSelectDialog(
						'Choose module',
						'Select the module to retrieve all tooltips from',
						displayValues
					)
	//module selected	
	if (module) {
		if (!solutionPrefs.repository.api) {
			//loop through all forms in this module
			for (var formName in solutionPrefs.repository.allForms[module]) {
				//if valid form, get all named elements
				if (formName && forms[formName]) {
					var allElements = forms[formName].elements.allnames
					
					//loop through all elements
					for (var i = 0; i < allElements.length; i++) {
						
						//if toolTip is a valid property type for this element, add to db
						if (typeof forms[formName].elements[allElements[i]].toolTipText != undefined) {
							
							// if named ? element
							if (allElements[i].substring(0,4) == "help") {
								var record = foundset.getRecord(foundset.newRecord(false,true))
							
								record.element_name = allElements[i]
								record.form_name = formName
								record.module_filter = module
								record.tooltip = forms[formName].elements[allElements[i]].toolTipText
								record.flag_help = 1				
							}
							// if there is a tooltip
							else if (forms[formName].elements[allElements[i]].toolTipText){		
								var record = foundset.getRecord(foundset.newRecord(false,true))
							
								record.element_name = allElements[i]
								record.form_name = formName
								record.module_filter = module
								record.tooltip = forms[formName].elements[allElements[i]].toolTipText
							}
						}
					}
				}
			}
		}
		else if (solutionPrefs.repository.workspace) {
			//loop through all forms in this module
			for (var formName in solutionPrefs.repository.workspace[module]) {
				//if valid form, get all named elements
				if (formName && forms[formName]) {
					var allElements = forms[formName].elements.allnames
					
					//loop through all elements
					for (var i = 0; i < allElements.length; i++) {
						
						//if toolTip is a valid property type for this element, add to db
						if (typeof forms[formName].elements[allElements[i]].toolTipText != undefined) {
							
							// if named ? element
							if (allElements[i].substring(0,4) == "help") {
								var record = foundset.getRecord(foundset.newRecord(false,true))
							
								record.element_name = allElements[i]
								record.form_name = formName
								record.module_filter = module
								record.tooltip = forms[formName].elements[allElements[i]].toolTipText
								record.flag_help = 1				
							}
							// if there is a tooltip
							else if (forms[formName].elements[allElements[i]].toolTipText){		
								var record = foundset.getRecord(foundset.newRecord(false,true))
							
								record.element_name = allElements[i]
								record.form_name = formName
								record.module_filter = module
								record.tooltip = forms[formName].elements[allElements[i]].toolTipText
							}
						}
					}
				}
			}
		}
		
		databaseManager.saveData()
	}
	
	plugins.dialogs.showInfoDialog("Info", "Process complete", "OK")
}


}

/**
 *
 * @properties={typeid:24,uuid:"B5CED862-7748-413C-BA45-C815CA8C10E1"}
 */
function POPUP_tooltip_form()
{

/*
 *	TITLE    :	POPUP_tooltip_form
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	show tooltip's form in a FiD; must check for existence of foundset prior to calling
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	October 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = forms.MGR_0F_tooltip_1L_2L.form_name

//show if enough data is there and won't mess up the screen
if (formName && forms[formName] &&
	!(formName == 'DATASUTRA_0F_solution__header' || formName == 'DATASUTRA_0F_solution__footer' || 
	formName == 'DATASUTRA_0F_solution' || formName.substr(0,14) == 'MGR_0F_tooltip')) {
	
	//refresh tooltips on this form
	globals.CALLBACK_tooltip_set(formName,true)
	
	application.showFormInDialog(
						forms[formName],
						-1,
						-1,
						-1,
						-1,
						'Preview: ' + formName,
						true,
						false,
						'toolTipPreview',
						false
					)
}
//error message
else {
	plugins.dialogs.showErrorDialog(
						'Popup error',
						'The selected form cannot be shown'
					)
}
}

/**
 *
 * @properties={typeid:24,uuid:"DBDDC126-933F-4B96-89A6-2DE1D67F3C0B"}
 */
function PRINT_TIP_report()
{

/*
 *	TITLE    :	PRINT_TIP_report
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	PRINT_TIP_report()
 *			  	
 *	MODIFIED :	October 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//set today string
globals.TIP_today = globals.CODE_date_format(new Date())

application.showFormInDialog(forms.MGR_P__tooltip_select, -1, -1, -1, -1, 'Choose module', false, false,'printTipSimple')

if (globals.TIP_P__module) {
	var modules = globals.TIP_P__module.split('\n')
	//get rid of last empty element
	if (!modules[modules.length - 1]) {
		modules.pop()
	}
	globals.TIP_P__module = null
}

//modules are selected for reporting
if (modules && modules.length) {
	
	//get foundset and records
	var fsTips = databaseManager.getFoundSet(controller.getServerName(),'sutra_tooltip')
	fsTips.clear()
	fsTips.find()
	fsTips.module_filter = modules[0]
	for (var i = 1; i < modules.length; i++) {
		fsTips.newRecord(false,true)
		fsTips.module_filter = modules[i]
	}
	fsTips.search()
	
	if (utils.hasRecords(fsTips)) {
		//sort
		fsTips.sort('module_filter asc, form_name asc, element_name asc')
		
		//html header junk
		var html = '<html><head></head><body style="font-size:7px;"><table cellpadding="2" cellspacing="0" width="100%">'
		
		var set = ' '
		var form = ' '
		
		var alternatingColors = new Array(
								' bgcolor = "#eeeeee">',	//light gray
								'>'				//white
						)
		var colorIndex = 1
		
		for (var i = 1; i <= fsTips.getSize(); i++) {
			var record = fsTips.getRecord(i)
			
			//actual text	if non-html, put in <br>s; if nothing, set to null
			var toolTip = (record.tooltip && record.tooltip.slice(0,6) != '<html>') ? utils.stringReplace(record.tooltip,'\n','<br>') : ((record.tooltip) ? record.tooltip.slice(25,record.tooltip.length - 14) : null)
			var inlineHelp = (record.inline_help && record.inline_help.slice(0,6) != '<html>') ? utils.stringReplace(record.inline_help,'\n','<br>') : ((record.inline_help) ? record.inline_help.slice(25,record.inline_help.length - 14) : null)
			
			//punch down module
			if (set != record.module_filter) { //TODO: need to work out boundary where set is empty && !(set == 'none specified' && !record.module_filter)) {
				set = (record.module_filter) ? record.module_filter : 'none specified'
				html += '<tr bgcolor = "#b3b3b3"><td colspan="5">' + 'Module: <strong>' + set + '</strong>' + '</td></tr>'
			}
			
			//punch down form
			if (form != 'Form: <strong>' + record.form_name + '</strong>') {
				form = (record.form_name) ? 'Form: <strong>' + record.form_name + '</strong>' : 'No form specified'
				html += '<tr bgcolor = "#cccccc"><td colspan="5">' + form + '</td></tr>'
				
				//reset colorIndex
				colorIndex = 1
			}
			
			//first row has: element name | help | revisit
			html += '<tr height="20"' + alternatingColors[colorIndex] +
						'<td valign="top" colspan="3">' + ((record.element_name) ? record.element_name : 'No element specified') + '</td>' +
						'<td valign="top">' + ((record.flag_help) ? 'Flag: inline help' : 'Not flagged as help') + '</td>' +
						'<td valign="top">' + ((record.flag_revisit) ? '<strong>REVISIT</strong>' : '') + '</td></tr>'
			//quick check to see if there is a second row
			if ((toolTip && toolTip.length) || (inlineHelp && inlineHelp.length)) {
				//set color for this one
				if (colorIndex == 1) {
					colorIndex = 0
				}
				else {
					colorIndex++
				}
				
				//second row has: tooltip | inline_help
				html +=	'<tr height="20"' + alternatingColors[colorIndex] +
						'<td colspan="2">' + ((toolTip) ? toolTip : '') + '</td>' +
						'<td colspan="3">' + ((inlineHelp) ? inlineHelp : '') + '</td></tr>'
			}
			
			//prep color for next time
			if (colorIndex == 1) {
				colorIndex = 0
			}
			else {
				colorIndex++
			}
		}
		html += '</table></body></html>'
		
		globals.TIP_html = html
		
		//show print preview
		forms.MGR_RPT__tooltip.controller.showPrintPreview()
	}
	else {
		plugins.dialogs.showErrorDialog('No report','There are no valid toolTips in the selected modules')
	}
}
else {
	plugins.dialogs.showErrorDialog('No report','No modules were selected to report on')
}


}

/**
 *
 * @properties={typeid:24,uuid:"70ED0EA6-808A-4B4E-ABAF-3A7682B4253E"}
 */
function REC_duplicate()
{

/*
 *	TITLE    :	REC_duplicate
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
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
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

controller.duplicateRecord(false)
i18n_language = globals.TIP_default_language

databaseManager.saveData()


}

/**
 *
 * @properties={typeid:24,uuid:"AD43FBE4-2045-43F6-AE77-482E883FB5FE"}
 */
function REC_duplicate_all()
{

/*
 *	TITLE    :	REC_duplicate_all
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_duplicate_all()
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (foundset && foundset.getSize()) {
	var fsCount = foundset.getSize()
	
	for (var i = 1; i <= fsCount; i++) {
		foundset.duplicateRecord(i,false,true)
		foundset.i18n_language = globals.TIP_default_language
	}
	
	databaseManager.saveData()
}
}

/**
 *
 * @properties={typeid:24,uuid:"E0D97C2E-8805-4C4A-89B1-871FE1ABEF7B"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
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
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

controller.newRecord(true)

//request focus on data entry field
switch (forms.MGR_0F_tooltip_1L_2F.elements.tab_detail.tabIndex) {
	case 1:
		forms.MGR_0F_tooltip_1L_2F__edit_tooltip.elements.fld_tooltip.requestFocus(false)
		break
	case 2:
		forms.MGR_0F_tooltip_1L_2F__edit_help.elements.fld_help.requestFocus(false)
		break
}
}
