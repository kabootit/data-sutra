/**
 *
 * @properties={typeid:24,uuid:"6a7b88cf-807a-4d70-ae35-6ce8268574f4"}
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
	globals.CALLBACK_ul_refresh_all()
}



}

/**
 *
 * @properties={typeid:24,uuid:"27f61c33-5248-448d-83af-e6ab0b388345"}
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
globals.CALLBACK_ul_refresh_all()
}

/**
 *
 * @properties={typeid:24,uuid:"9bd3a2b7-edf2-4ff6-a424-d9ecbb8b67b3"}
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
globals.CALLBACK_ul_refresh_all()

//enter first field
elements.fld_product_name.requestFocus(false)


}

/**
 *
 * @properties={typeid:24,uuid:"8d2362f7-4fff-49f0-a276-02a60d0b34a3"}
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
