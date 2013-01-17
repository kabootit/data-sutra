/**
 *
 * @properties={typeid:24,uuid:"808E6C81-ECE5-42F2-A120-DC7A8E59DFAF"}
 */
function FLD_data_change__full_text()
{


if (utils.hasRecords(foundset) && full_text) {
	//starts with html, show html field
	if ('<html>'.equalsIgnoreCase(utils.stringLeft(full_text, 6))) {
		forms.MGR_0F_documentation_1F__preview_2F.elements.fld_text_html.visible = true
		forms.MGR_0F_documentation_1F__preview_2F.elements.fld_text_text.visible = false
	}
	//hide html field
	else {
		forms.MGR_0F_documentation_1F__preview_2F.elements.fld_text_html.visible = false
		forms.MGR_0F_documentation_1F__preview_2F.elements.fld_text_text.visible = true
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"6573C27C-3D78-4446-A31F-0BF41D5B1CBC"}
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

var selection = elements.fld_text.getSelectedText()
var posn = elements.fld_text.caretPosition

var replacement = '<strong>'
if (selection) {
	replacement += selection
}
replacement += '</strong>'

elements.fld_text.replaceSelectedText(replacement)

elements.fld_text.requestFocus(false)
elements.fld_text.caretPosition = posn + 8



}

/**
 *
 * @properties={typeid:24,uuid:"8BDB5AF5-5EF1-4DE7-B2CE-3ED39F5EF322"}
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

var selection = elements.fld_text.getSelectedText()
var posn = elements.fld_text.caretPosition

var replacement = '<br>'

elements.fld_text.replaceSelectedText(replacement)

elements.fld_text.requestFocus(false)
elements.fld_text.caretPosition = posn - ((selection) ? selection.length : 0) + 4



}

/**
 *
 * @properties={typeid:24,uuid:"F5892B06-EAF6-47BA-B187-DA48894C66FB"}
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

elements.fld_text.selectAll()

if ('<html>'.equalsIgnoreCase(utils.stringLeft(elements.fld_text.getSelectedText(), 6))) {
	globals.DIALOGS.showErrorDialog('Error','This field already begins with <html>')
}
else {
	var output 	= '<html><head></head><body>'
	output 		+= elements.fld_text.getSelectedText()
	output		+= '</body></html>'
	
	elements.fld_text.replaceSelectedText(output)
	
	elements.fld_text.requestFocus(false)
}
}

/**
 *
 * @properties={typeid:24,uuid:"4DB55290-19AD-4C14-9E4F-346A4BBE1BCD"}
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

var selection = elements.fld_text.getSelectedText()
var posn = elements.fld_text.caretPosition

var replacement = '<em>'
if (selection) {
	replacement += selection
}
replacement += '</em>'

elements.fld_text.replaceSelectedText(replacement)

elements.fld_text.requestFocus(false)
elements.fld_text.caretPosition = posn + 4



}

/**
 *
 * @properties={typeid:24,uuid:"295FF4EE-04BF-49E7-9ABC-BF044123E619"}
 */
function HTML_link()
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

var selection = elements.fld_text.getSelectedText()
var posn = elements.fld_text.caretPosition

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

elements.fld_text.replaceSelectedText(replacement)

elements.fld_text.requestFocus(false)
elements.fld_text.caretPosition = posn - ((selection) ? selection.length : 0) + 46 + ((offset) ? offset : 0)



}

/**
 *
 * @properties={typeid:24,uuid:"96A2D0F5-2B69-41F5-8875-81FC61CB4DD2"}
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

var input  = forms[controller.getName()][elements.fld_text.getDataProviderID()]

var output = input.replace(/<(.|\n)+?>/g, '')

forms[controller.getName()][elements.fld_text.getDataProviderID()] = output

elements.fld_text.requestFocus(false)

FLD_data_change__full_text()
}

/**
 *
 * @properties={typeid:24,uuid:"F2992612-3AE4-4277-A259-B117DE7652A0"}
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

var selection = elements.fld_text.getSelectedText()
var posn = elements.fld_text.caretPosition

var replacement = '<u>'
if (selection) {
	replacement += selection
}
replacement += '</u>'

elements.fld_text.replaceSelectedText(replacement)

elements.fld_text.requestFocus(false)
elements.fld_text.caretPosition = posn + 3



}
