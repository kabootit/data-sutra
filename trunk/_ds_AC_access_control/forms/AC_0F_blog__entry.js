/**
 *
 * @properties={typeid:24,uuid:"b06bdf2c-26f9-43f9-9f75-e5a7c0639d52"}
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
	elements.tab_d2.visible = true
	elements.lbl_divider.visible = true
	
	//resize list
	var x1 = elements.tab_list.getWidth()
	var x2 = elements.tab_detail.getWidth() + 6
	var y = elements.tab_list.getHeight()
	
	elements.tab_list.setSize(x1 - x2, y)
	
	//set buttons visibility
	elements.btn_detail_right.visible = true
	elements.btn_detail_left.visible = false
	
	//help questions marks position and visibility
	elements.help_blog_entry_edit.visible = true
	elements.help_blog_entries.setLocation(elements.tab_list.getLocationX() + elements.tab_list.getWidth() - 18, elements.tab_list.getLocationY() - 16)
}
else {
	
	//turn off detail
	elements.tab_detail.visible = false
	
	elements.tab_d1.visible = false
	elements.tab_d2.visible = false
	elements.lbl_divider.visible = false
	
	//resize list
	var x1 = elements.tab_list.getWidth()
	var x2 = elements.tab_detail.getWidth() + 6
	var y = elements.tab_list.getHeight()

	elements.tab_list.setSize(x1 + x2, y)
	
	//set buttons visibility
	elements.btn_detail_right.visible = false
	elements.btn_detail_left.visible = true

	//help questions marks position and visibility
	elements.help_blog_entry_edit.visible = false
	elements.help_blog_entries.setLocation(elements.help_blog_entry_edit.getLocationX(),elements.help_blog_entry_edit.getLocationY())
}
}

/**
 *
 * @properties={typeid:24,uuid:"bedc7b0f-01f3-4cc9-b866-e894051a3476"}
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
 * @properties={typeid:24,uuid:"18042d95-67b3-4300-9a68-9d877c88677e"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	creates a new blog post
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

ac_blog_to_blog_entry.newRecord(false,true)
ac_blog_to_blog_entry.blog_posted = application.getServerTimeStamp()
ac_blog_to_blog_entry.blog_visible = 1
forms.AC_0F_blog__entry_1L_blog.elements.fld_blog_title.requestFocus(false)

}
