/**
 *
 * @properties={type:4,typeid:36,uuid:"96011b27-87be-47e1-a86c-f1bfc7373d4b"}
 */
function display_width_pixel() {
	if (display_width_pixel) {
		return display_width_pixel
	}
	//temporary hack to upgrade data
	else {
		return display_width_percent
	}
}
