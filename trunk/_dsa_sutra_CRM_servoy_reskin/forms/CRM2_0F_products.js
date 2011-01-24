/**
 *
 * @properties={typeid:24,uuid:"1b6df4e4-d010-4748-ae4f-3396695a7b5e"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	hides the default highlighter object
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//hide field highlighter
globals.CODE_highlight_off('CRM2_0F_products')


}

/**
 *
 * @properties={typeid:24,uuid:"4ed72335-0b74-4033-82ae-60c33ef46710"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	prompts to delete the currently selected record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_delete()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var delRec = plugins.dialogs.showWarningDialog(
				'Delete record',
				'Do you really want to delete this product?',
				'Yes',
				'No')

if (delRec == 'Yes') {
	controller.deleteRecord()
	globals.TRIGGER_ul_refresh_all()
}



}

/**
 *
 * @properties={typeid:24,uuid:"2c89b3b8-0f46-46bc-b224-63fffec65933"}
 */
function REC_duplicate()
{

/*
 *	TITLE    :	REC_duplicate
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	duplicate current record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_duplicate()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

controller.duplicateRecord(false)
globals.TRIGGER_ul_refresh_all()
}

/**
 *
 * @properties={typeid:24,uuid:"55c0528f-4cee-4383-a995-01f1cf8fd70c"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	create a new contact record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_new()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//new record
controller.newRecord(true)

//refresh UL
globals.TRIGGER_ul_refresh_all()

//enter first field
elements.fld_product_number.requestFocus(false)


}

/**
 *
 * @properties={typeid:24,uuid:"5cd792d4-d344-4a3b-94ef-e93abf88e8df"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	shows image if available, otherwise a label that there isn't an image
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_on_select()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

/*if (product_image && (utils.stringPatternCount(image_mime_type, 'image') == 0 || !image_mime_type)) {
	//show that there is no preview for this item
	elements.lbl_imagePreview.text = '<html><body><center>No Preview for .' + image_type + ' files</center></body></html>'
	elements.lbl_imagePreview.visible = true
}
else*/ if (!product_image) {
	elements.lbl_imagePreview.text = 'No Image'
	elements.lbl_imagePreview.visible = true
}
else {
	elements.lbl_imagePreview.text = ''
	elements.lbl_imagePreview.visible = false
}
}
