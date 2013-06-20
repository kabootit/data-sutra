/**
 *
 * @properties={typeid:24,uuid:"5558f4e7-c594-47ba-80f0-c12efe948ba6"}
 */
function FORM_on_load()
{

/*
//set up listeners
elements.bean_header.addMouseListener(new Packages.java.awt.event.MouseAdapter({mousePressed:mouseListener}))
elements.bean_header.addMouseMotionListener(new Packages.java.awt.event.MouseMotionAdapter({mouseDragged:mouseMotionListener}))
*/


}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"26f9a543-7168-4de9-b16b-45bd98bf9027"}
 */
function FORM_on_show(firstShow, event)
{
	
/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	set icon image if available
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_load()
 *			  	
 *	MODIFIED :	June 29, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (arguments[0]) {
	//graphic icon
	if (foundset.solution_icon_blob && (foundset.solution_icon_type.equalsIgnoreCase('pdf') || foundset.solution_icon_type.equalsIgnoreCase('png') || foundset.solution_icon_type.equalsIgnoreCase('jpg') || 
		foundset.solution_icon_type.equalsIgnoreCase('jpeg') || foundset.solution_icon_type.equalsIgnoreCase('gif') || foundset.solution_icon_type.equalsIgnoreCase('bmp') || 
		foundset.solution_icon_type.equalsIgnoreCase('pict') || foundset.solution_icon_type.equalsIgnoreCase('tif') || foundset.solution_icon_type.equalsIgnoreCase('tiff'))) {
	
		var blobLoader =
		  	'media:///servoy_blobloader?servername=' + controller.getServerName() + 
			'&tablename=' + 'sutra_solution' +
			'&dataprovider=solution_icon_blob' +
			'&rowid1=' + id_solution +
			'&mimetype='+solution_icon_type + 
			'&filename='+solution_icon 
		
		elements.gfx_logo.setImageURL(blobLoader)
		elements.gfx_logo.visible = true
	}
	else {
		elements.gfx_logo.visible = false
		elements.gfx_logo.setImageURL('media:///none')
	}
	
	//graphic tooltip
	if (foundset.solution_icon_tooltip) {
		elements.gfx_logo.toolTipText = foundset.solution_icon_tooltip
	}
	else {
		elements.gfx_logo.toolTipText = ''
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"bce35aa6-d832-42a2-8556-0f45c8879ee1"}
 */
function mouseListener()
{


var mouseEvent = arguments[0]

origin.x = mouseEvent.getX()
origin.y = mouseEvent.getY()



}

/**
 *
 * @properties={typeid:24,uuid:"7eb6e7a6-29f5-4d67-aa1e-e70db2a48429"}
 */
function mouseMotionListener()
{


var frame = Packages.java.awt.Frame.getFrames()[0]

var mouseEvent = arguments[0]

var point = frame.getLocation()

frame.setLocation(
		point.x + mouseEvent.getX() - origin.x, 
		point.y + mouseEvent.getY() - origin.y
	)



}

/**
 *
 * @properties={typeid:24,uuid:"385b28e1-7a08-4962-8079-9ed461df9dd5"}
 */
function URL_branding()
{

/*
 *	TITLE    :	URL_branding
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	URL_branding()
 *			  	
 *	MODIFIED :	June 29, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (solution_icon_url) {
	globals.CODE_url_handler(solution_icon_url,null,true)
}
}
