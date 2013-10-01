/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"92FC4CD5-D5C9-491F-8F82-35E27F291080"}
 */
var _progressOld = '<html><head><style type="text/css" media="screen"><!--table { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }td  { white-space: nowrap; overflow: hidden; border: 0px; padding: 1px; height: 15; line-height: 15; }--></style></head><body><table><tr><td align="center"><img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")>&nbsp;&nbsp;<img src = "media:///progressbar_xp.gif")></td></tr></table></body></html>';


/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"AB870783-C657-4906-9BB0-9C161C367841"}
 */
function FORM_on_load(event) {
	//in non-webclient clients, use different gif
	if (application.getApplicationType() != APPLICATION_TYPES.WEB_CLIENT) {
		elements.gfx_progress.imageURL = 'media:///progressbar.png'
	}
}
