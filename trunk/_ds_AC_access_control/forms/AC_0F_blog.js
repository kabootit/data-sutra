/**
 *
 * @properties={typeid:24,uuid:"323ad558-cd55-4f98-a0ac-ed5b8df8eae6"}
 */
function ACTION_rename()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	renames blog
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

var input = globals.DIALOGS.showInputDialog('Blog title','Enter a new blog title',blog_name)

if (input) {
	blog_name = input
	databaseManager.saveData()
	globals.TRIGGER_ul_refresh_selected()
}	
}

/**
 *
 * @properties={typeid:24,uuid:"d3d84d71-3d26-445a-a8f4-22aab9774874"}
 */
function BLOG_preview()
{

/*
 *	TITLE    :	BLOG_preview
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	BLOG_preview()
 *			  	
 *	MODIFIED :	July 29, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//flag that in preview mode
forms.AC_R__login.previewMode = true
forms.AC_R__login.blogID = id_blog

//preview mode
forms.AC_R__login.elements.tab_login.tabIndex = 3

globals.CODE_form_in_dialog(forms.AC_R__login,-1,-1,-1,-1,'Blog preview',true,false,'blogPreview')

forms.AC_R__login.previewMode = false
}

/**
 *
 * @properties={typeid:24,uuid:"5b0fee81-275d-40f5-9752-cea4ead77e4c"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	ds_AC_access_control
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
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TRIGGER_tooltip_set()

globals.TAB_change_grid_init()
}

/**
 *
 * @properties={typeid:24,uuid:"06e387c1-aaf7-4a6f-ba7e-f0bf4065dcfc"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	deletes record
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

var delRec = globals.DIALOGS.showWarningDialog('Delete record','Do you really want to delete the selected blog?','Yes','No')

if (delRec == 'Yes') {
	controller.deleteRecord()
	globals.TRIGGER_ul_refresh_on_delete()
}
}

/**
 *
 * @properties={typeid:24,uuid:"fe8c2c47-b160-486b-a3d2-9cfba04d9bb9"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	creates a new blog
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

controller.newRecord(true)
ACTION_rename()

globals.TRIGGER_ul_refresh_all()
}

/**
 *
 * @properties={typeid:24,uuid:"0101eb53-a8a8-4a9e-ad8a-fced634d651a"}
 */
function SIZE_maximize()
{

/*
 *	TITLE    :	SIZE_maximize
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	resize field so all text can be seen
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	SIZE_maximize()
 *			  	
 *	MODIFIED :	September 19, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */
/*
var elem = application.getMethodTriggerElementName()
var elemBck = 'bck_' + elem.substring(4)
var field = elements[elem].getDataProviderID()
var fieldSize = foundset[field].length
var breakPoint = 100

//punch down original size to the form
	//field
	this[elem+'Width'] = elements[elem].getWidth()
	this[elem+'Height'] = elements[elem].getHeight()
	//background
	if (elements[elemBck]) {
		this[elemBck+'Width'] = elements[elemBck].getWidth()
		this[elemBck+'Height'] = elements[elemBck].getHeight()
	}

//increase size if not big enough to display
if (fieldSize > breakPoint) {
	//field
	elements[elem].setSize(this[elem+'Width'] * 1.5,((fieldSize > breakPoint * 1.5) ? elements[elem].getHeight() + Math.ceil((fieldSize - (breakPoint * 1.5)) / (breakPoint / 4) ) * 10 : elements[elem].getHeight()))
	
	//background
	if (elements[elemBck]) {
		elements[elemBck].setSize(this[elem+'Width'] * 1.5 + 70,((fieldSize > breakPoint * 1.5) ? elements[elemBck].getHeight() + Math.ceil((fieldSize - (breakPoint * 1.5)) / (breakPoint / 4) ) * 10 : elements[elemBck].getHeight()))
	}
	
	elements[elem].requestFocus(false)
}
else {
	elements[elem].requestFocus(false)
}
*/
}

/**
 *
 * @properties={typeid:24,uuid:"eab9d158-a355-4984-af1d-7df77cd0fc13"}
 */
function SIZE_minimize()
{

/*
 *	TITLE    :	SIZE_minimize
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	return field to original size
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	SIZE_minimize()
 *			  	
 *	MODIFIED :	September 19, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */
/*
var elem = application.getMethodTriggerElementName()
var elemBck = 'bck_' + elem.substring(4)

//decrease size if not still original
if (elements[elem].getWidth() != this[elem+'Width']) {
	//field
	elements[elem].setSize(this[elem+'Width'],this[elem+'Height'] )
	
	//background
	if (elements[elemBck]) {
		elements[elemBck].setSize(this[elemBck+'Width'],this[elemBck+'Height'])
	}
}
*/
}
