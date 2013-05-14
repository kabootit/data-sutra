
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"C9D30714-B177-4EAF-A303-EACB175DA75D"}
 */
function FIND_fields(event) {
	globals.NAV_find_fields(event)
}
/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"2F82B9AA-8D52-4DCD-8734-B744043EE275"}
 */
function FORM_on_hide(event) {
	return true
}


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"BC0555DA-21D9-4440-AD68-F6A6B936C090"}
 */
function FIND_clear(event) {
	plugins.window.closeFormPopup(false)
	
	globals.NAV_find_clear()
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"9396FD73-63FD-45EF-B3F9-D104B7AA5A46"}
 */
function FIND_normal(event) {
	globals.NAV_find_end_normal()
	
	plugins.window.closeFormPopup(false)
}


/**
 *
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"1F1B85C0-C6E6-4508-9ACB-F0E3356AA70A"}
 */
function FORM_on_show(firstShow, event) {
	_super.FORM_on_show(firstShow, event)
	
	//put a bottom line on the fast find
	plugins.WebClientUtils.executeClientSideJS('setTimeout(function(){$("#' + plugins.WebClientUtils.getElementMarkupId(elements.fld_find) + '").css("border-bottom","1px solid #E6E6E6")},0);')
	
	//attach big cursor for when find occurs
	plugins.WebClientUtils.executeClientSideJS('$(".fastFind").keydown(function(event){if(event.which == 13){bigIndicator(true,0,"Finding...");}});')
	plugins.WebClientUtils.executeClientSideJS('$(".fastFindClear").on("click",function(event) {bigIndicator(true,0,"Clearing...");});')
	
	//set placeholder find text
	globals.TRIGGER_fastfind_display_set(null,null,null,true)
				
	//enter the field
	elements.fld_find.requestFocus()
}
