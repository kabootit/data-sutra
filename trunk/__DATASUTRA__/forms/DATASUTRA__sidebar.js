/**
 *
 * @properties={typeid:24,uuid:"0E57298B-51AD-4503-A35A-E34F8AB352B4"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	rsrc_TOOL_toolbar
 *			  	
 *	ABOUT    :	hide color label; could be used for quick color changes in the sidebar
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_load()
 *			  	
 *	MODIFIED :	September 11, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

elements.lbl_color.visible = false
elements.gfx_gradient.visible = false

//smart client, remove top border
if (!solutionPrefs.config.webClient) {
	elements.tab_content.setBorder('MatteBorder,0,0,0,1,#333333')
	elements.lbl_divider.visible = false
}

}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"84C5C726-C767-4F33-AFAA-B30DD4FC91CE"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow && solutionPrefs.config.webClient) {
		plugins.WebClientUtils.setExtraCssClass(elements.lbl_cliff, 'gfxSideCliff')
	}
	else {
		
	}
}
