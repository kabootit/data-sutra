/**
 *
 * @properties={typeid:24,uuid:"31058c2d-6ade-4877-9e81-737bb44830e1"}
 */
function HTML_bold()
{

/*
 *	TITLE    :	HTML_bold
 *			  	
 *	MODULE   :	ds_AC_access_control
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

var selection = elements.blog_text.getSelectedText()
var posn = elements.blog_text.caretPosition

var replacement = '<strong>'
if (selection) {
	replacement += selection
}
replacement += '</strong>'

elements.blog_text.replaceSelectedText(replacement)

elements.blog_text.requestFocus(false)
elements.blog_text.caretPosition = posn + 8



}

/**
 *
 * @properties={typeid:24,uuid:"44376dfc-05df-43a1-aaa1-9000a57051f7"}
 */
function HTML_italic()
{

/*
 *	TITLE    :	HTML_italic
 *			  	
 *	MODULE   :	ds_AC_access_control
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

var selection = elements.blog_text.getSelectedText()
var posn = elements.blog_text.caretPosition

var replacement = '<em>'
if (selection) {
	replacement += selection
}
replacement += '</em>'

elements.blog_text.replaceSelectedText(replacement)

elements.blog_text.requestFocus(false)
elements.blog_text.caretPosition = posn + 4



}

/**
 *
 * @properties={typeid:24,uuid:"708893d1-5347-43bd-9ad0-f7238f4aa571"}
 */
function HTML_underline()
{

/*
 *	TITLE    :	HTML_underline
 *			  	
 *	MODULE   :	ds_AC_access_control
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

var selection = elements.blog_text.getSelectedText()
var posn = elements.blog_text.caretPosition

var replacement = '<u>'
if (selection) {
	replacement += selection
}
replacement += '</u>'

elements.blog_text.replaceSelectedText(replacement)

elements.blog_text.requestFocus(false)
elements.blog_text.caretPosition = posn + 3



}

/**
 *
 * @properties={typeid:24,uuid:"896d9cdf-fbc9-4ca9-a8da-b0954421fc06"}
 */
function HTML_url()
{

/*
 *	TITLE    :	HTML_url
 *			  	
 *	MODULE   :	ds_AC_access_control
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

var selection = elements.blog_text.getSelectedText()
var posn = elements.blog_text.caretPosition

var replacement = '<a href="">'
if (selection) {
	replacement += selection
}
else {
	replacement += 'here'
}
replacement += '</a>'

elements.blog_text.replaceSelectedText(replacement)

elements.blog_text.requestFocus(false)
elements.blog_text.caretPosition = posn - ((selection) ? selection.length : 0) + 9



}
