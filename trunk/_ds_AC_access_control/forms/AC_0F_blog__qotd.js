/**
 *
 * @properties={typeid:24,uuid:"5c59026e-59a9-4bf3-8123-b762bc5a0423"}
 */
function ACTION_toggle_detail()
{

/*
 *	TITLE    :	ACTION_toggle_detail
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	toggle detail form view
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Aug 31, 2007 -- David Workman, Data Mosaic
 *			  	
 */

if (elements.btn_detail_right.visible == false) {

	//turn on detail
	elements.tab_detail.visible = true
	
	elements.tab_d1.visible = true
	
	//resize list
	var x1 = elements.tab_list.getWidth()
	var x2 = elements.tab_detail.getWidth() + 6
	var y = elements.tab_list.getHeight()
	
	elements.tab_list.setSize(x1 - x2, y)
	
	//set buttons visibility
	elements.btn_detail_right.visible = true
	elements.btn_detail_left.visible = false
	
	//help questions marks position and visibility
	elements.help_blog_qotd_edit.visible = true
	elements.help_blog_qotd.setLocation(elements.tab_list.getLocationX() + elements.tab_list.getWidth() - 18, elements.tab_list.getLocationY() - 16)
}
else {
	
	//turn off detail
	elements.tab_detail.visible = false
	
	elements.tab_d1.visible = false
	
	//resize list
	var x1 = elements.tab_list.getWidth()
	var x2 = elements.tab_detail.getWidth() + 6
	var y = elements.tab_list.getHeight()

	elements.tab_list.setSize(x1 + x2, y)
	
	//set buttons visibility
	elements.btn_detail_right.visible = false
	elements.btn_detail_left.visible = true
	
	//help questions marks position and visibility
	elements.help_blog_qotd_edit.visible = false
	elements.help_blog_qotd.setLocation(elements.help_blog_qotd_edit.getLocationX(),elements.help_blog_qotd_edit.getLocationY())
}
}

/**
 *
 * @properties={typeid:24,uuid:"eb08c202-b5f4-4ad4-96a2-39c6a0734e91"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	sets the detail to expanded view
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

ACTION_toggle_detail()
ACTION_toggle_detail()

}

/**
 *
 * @properties={typeid:24,uuid:"9faf2df0-0954-45df-bda7-7a2699f7e410"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	creates a new quote record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_new()
 *			  	
 *	MODIFIED :	July 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

ac_blog_to_blog_quote.newRecord(true,true)
forms.AC_0F_blog__qotd_1F_blog_quote.elements.fld_quote.requestFocus(false)
}
