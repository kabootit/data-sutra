/**
 *
 * @properties={typeid:24,uuid:"093BD914-A448-4CD3-9A49-5B6472351E3F"}
 */
function FLD_data_change__help()
{

/*
 *	TITLE    :	FLD_data_change__help
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
 *	USAGE    :	FLD_data_change__help()
 *			  	
 *	MODIFIED :	September 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (utils.hasRecords(foundset) && application.__parent__.solutionPrefs) {
	var globalTips = solutionPrefs.i18n
	
	databaseManager.saveData()
	
	//starts with html, show html field
	if ('<html>'.equalsIgnoreCase(utils.stringLeft(inline_help, 6))) {
		forms.MGR_0F_tooltip_1L_2F__preview_help.elements.fld_help_html.visible = true
		forms.MGR_0F_tooltip_1L_2F__preview_help.elements.fld_help_text.visible = false
	}
	//hide html field
	else {
		forms.MGR_0F_tooltip_1L_2F__preview_help.elements.fld_help_html.visible = false
		forms.MGR_0F_tooltip_1L_2F__preview_help.elements.fld_help_text.visible = true
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
 * @properties={typeid:24,uuid:"E4FFFB3B-5B4E-4451-9D35-5688FB059C6A"}
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

var selection = elements.fld_help.getSelectedText()
var posn = elements.fld_help.caretPosition

var replacement = '<strong>'
if (selection) {
	replacement += selection
}
replacement += '</strong>'

elements.fld_help.replaceSelectedText(replacement)

elements.fld_help.requestFocus(false)
elements.fld_help.caretPosition = posn + 8



}

/**
 *
 * @properties={typeid:24,uuid:"BA8278CA-9A89-474F-A3AF-D870C0E46A69"}
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

var selection = elements.fld_help.getSelectedText()
var posn = elements.fld_help.caretPosition

var replacement = '<br>'

elements.fld_help.replaceSelectedText(replacement)

elements.fld_help.requestFocus(false)
elements.fld_help.caretPosition = posn - ((selection) ? selection.length : 0) + 4



}

/**
 *
 * @properties={typeid:24,uuid:"9513814F-8702-4F23-8935-5C0211DE0EC2"}
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

elements.fld_help.selectAll()

if ('<html>'.equalsIgnoreCase(utils.stringLeft(elements.fld_help.getSelectedText(), 6))) {
	plugins.dialogs.showErrorDialog('Error','This field already begins with <html>')
	
}
else {
	var output 	= '<html><head></head><body>'
	output 		+= elements.fld_help.getSelectedText()
	output		+= '</body></html>'
	
	elements.fld_help.replaceSelectedText(output)
	
	elements.fld_help.requestFocus(false)
}
}

/**
 *
 * @properties={typeid:24,uuid:"3B21E08D-1C54-41C6-A4EB-8B275976D5E5"}
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

var selection = elements.fld_help.getSelectedText()
var posn = elements.fld_help.caretPosition

var replacement = '<em>'
if (selection) {
	replacement += selection
}
replacement += '</em>'

elements.fld_help.replaceSelectedText(replacement)

elements.fld_help.requestFocus(false)
elements.fld_help.caretPosition = posn + 4



}

/**
 *
 * @properties={typeid:24,uuid:"95180B82-2576-443F-BA84-568610548504"}
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

var input  = forms[controller.getName()][elements.fld_help.getDataProviderID()]

var output = input.replace(/<(.|\n)+?>/g, '')

forms[controller.getName()][elements.fld_help.getDataProviderID()] = output

elements.fld_help.requestFocus(false)

FLD_data_change__help()


}

/**
 *
 * @properties={typeid:24,uuid:"78E50F5E-8691-436A-953D-97E85AB7FA67"}
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

var selection = elements.fld_help.getSelectedText()
var posn = elements.fld_help.caretPosition

var replacement = '<u>'
if (selection) {
	replacement += selection
}
replacement += '</u>'

elements.fld_help.replaceSelectedText(replacement)

elements.fld_help.requestFocus(false)
elements.fld_help.caretPosition = posn + 3



}

/**
 *
 * @properties={typeid:24,uuid:"B8F8253D-88FB-4503-9EAC-8A0CC73684FF"}
 */
function HTML_url()
{

/*
 *	TITLE    :	HTML_url
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	insert html link tag, around selection, if any
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

var selection = elements.fld_help.getSelectedText()
var posn = elements.fld_help.caretPosition

var replacement = "<a href='javascript:globals.CODE_url_handler(\""

//if selected text is a web page, insert it into the code handler
if (selection.slice(0,4) == 'http') {
	replacement += selection
	var offset = selection.length
}

replacement += "\")'>"

if (selection) {
	replacement += selection
}
else {
	replacement += 'here'
}
replacement += '</a>'

elements.fld_help.replaceSelectedText(replacement)

elements.fld_help.requestFocus(false)
elements.fld_help.caretPosition = posn - ((selection) ? selection.length : 0) + 46 + ((offset) ? offset : 0)



}
