/**
 *
 * @properties={typeid:24,uuid:"83A81074-359C-4BA5-A31C-1ED9B8085074"}
 */
function FLD_data_change__tooltip()
{

/*
 *	TITLE    :	FLD_data_change__tooltip
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	check to see if it needs an html or normal preview
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__tooltip()
 *			  	
 *	MODIFIED :	September 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (utils.hasRecords(foundset) && application.__parent__.solutionPrefs) {
	var globalTips = solutionPrefs.i18n
	
	databaseManager.saveData()
	
	//starts with html, show html field
	if ('<html>'.equalsIgnoreCase(utils.stringLeft(tooltip, 6))) {
		forms.MGR_0F_tooltip_1L_2F__preview_tooltip.elements.fld_tooltip_html.visible = true
		forms.MGR_0F_tooltip_1L_2F__preview_tooltip.elements.fld_tooltip_text.visible = false
	}
	//hide html field
	else {
		forms.MGR_0F_tooltip_1L_2F__preview_tooltip.elements.fld_tooltip_html.visible = false
		forms.MGR_0F_tooltip_1L_2F__preview_tooltip.elements.fld_tooltip_text.visible = true
	}
	
	//smart update tooltip registry
	var record = foundset.getRecord(foundset.getSelectedIndex())
	
	var locale = globalTips[record.i18n_language]
	
	//check that record is valid (has enough information)
	if (record.form_name) {
	
		//create new form object if doesn't already exist
		if (!locale[record.form_name]) {
			locale[record.form_name] = new Object()
		}
		
		//named element
		if (record.element_name) {
			//actual tip
			locale[record.form_name][record.element_name] = {
								toolTip : record.tooltip,
								inlineHelp : record.inline_help
							}
		}
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"FE95F1CD-6116-4EC1-BB8F-03B7D2619ABE"}
 */
function HTML_bold()
{

/*
 *	TITLE    :	HTML_bold
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	insert bold tag, around selection, if any
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var selection = elements.fld_tooltip.getSelectedText()
var posn = elements.fld_tooltip.caretPosition

var replacement = '<strong>'
if (selection) {
	replacement += selection
}
replacement += '</strong>'

elements.fld_tooltip.replaceSelectedText(replacement)

elements.fld_tooltip.requestFocus(false)
elements.fld_tooltip.caretPosition = posn + 8



}

/**
 *
 * @properties={typeid:24,uuid:"37C1B32A-4444-473B-AAB0-88D16268BE85"}
 */
function HTML_br()
{

/*
 *	TITLE    :	HTML_br
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	insert br, delete selection
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var selection = elements.fld_tooltip.getSelectedText()
var posn = elements.fld_tooltip.caretPosition

var replacement = '<br>'

elements.fld_tooltip.replaceSelectedText(replacement)

elements.fld_tooltip.requestFocus(false)
elements.fld_tooltip.caretPosition = posn - ((selection) ? selection.length : 0) + 4



}

/**
 *
 * @properties={typeid:24,uuid:"F1108C15-0C0D-4108-AF2E-A2D5A71F2FE6"}
 */
function HTML_convert()
{

/*
 *	TITLE    :	HTML_italic
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	insert html surrounding tags
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	July 2008 -- David Workman, Data Mosaic
 *			  	
 */

elements.fld_tooltip.selectAll()

if ('<html>'.equalsIgnoreCase(utils.stringLeft(elements.fld_tooltip.getSelectedText(), 6))) {
	plugins.dialogs.showErrorDialog('Error','This field already begins with <html>')
}
else {
	var output 	= '<html><head></head><body>'
	output 		+= elements.fld_tooltip.getSelectedText()
	output		+= '</body></html>'
	
	elements.fld_tooltip.replaceSelectedText(output)
	
	elements.fld_tooltip.requestFocus(false)
}
}

/**
 *
 * @properties={typeid:24,uuid:"2540F3DC-4E89-49DF-8048-38734DA1B4A1"}
 */
function HTML_italic()
{

/*
 *	TITLE    :	HTML_italic
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	insert italic tag, around selection, if any
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var selection = elements.fld_tooltip.getSelectedText()
var posn = elements.fld_tooltip.caretPosition

var replacement = '<em>'
if (selection) {
	replacement += selection
}
replacement += '</em>'

elements.fld_tooltip.replaceSelectedText(replacement)

elements.fld_tooltip.requestFocus(false)
elements.fld_tooltip.caretPosition = posn + 4



}

/**
 *
 * @properties={typeid:24,uuid:"0B2FB6A6-7807-44D8-B790-DCC77A972A74"}
 */
function HTML_strip()
{

/*
 *	TITLE    :	HTML_italic
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	strips all html tags
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	July 2008 -- David Workman, Data Mosaic
 *			  	
 */

var input  = forms[controller.getName()][elements.fld_tooltip.getDataProviderID()]

var output = input.replace(/<(.|\n)+?>/g, '')

forms[controller.getName()][elements.fld_tooltip.getDataProviderID()] = output

elements.fld_tooltip.requestFocus(false)

FLD_data_change__tooltip()
}

/**
 *
 * @properties={typeid:24,uuid:"C1FD5CD6-0030-400C-AE29-174FC6A63C0F"}
 */
function HTML_underline()
{

/*
 *	TITLE    :	HTML_underline
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	insert underline tag, around selection, if any
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var selection = elements.fld_tooltip.getSelectedText()
var posn = elements.fld_tooltip.caretPosition

var replacement = '<u>'
if (selection) {
	replacement += selection
}
replacement += '</u>'

elements.fld_tooltip.replaceSelectedText(replacement)

elements.fld_tooltip.requestFocus(false)
elements.fld_tooltip.caretPosition = posn + 3



}
