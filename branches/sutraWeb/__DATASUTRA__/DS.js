
/**
 * Increase the size of loading please wait verbage on mobile phones when viewing the desktop version of data sutra
 * 
 * @param {String} zoom String representation of bool/null value that lets us know if running on a mobile phone
 * 
 * @properties={typeid:24,uuid:"543ECEB0-3CC4-4447-9B03-8523E850DA97"}
 */
function addToHome_zoom(zoom) {
	if (eval(zoom)) {
		plugins.WebClientUtils.executeClientSideJS('$("#addToHomeScreen", window.parent.document).css("zoom","300%");')
	}
}
