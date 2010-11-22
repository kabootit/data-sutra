/**
 *
 * @properties={type:12,typeid:36,uuid:"30c46cfd-a395-4047-8b25-ddc7eac6bec2"}
 */
function display_position()
{



if (location_center) {
	return 'Centered'
}
else if (location_x != null && location_y != null) {
	return '(' + location_x + ', ' + location_y + ')'
}
else {
	return null
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"3bfdfb3f-3389-4905-88e6-7f9caea14af3"}
 */
function display_screen()
{


if (screen_width != null && screen_height != null) {
	return screen_width + ' x ' + screen_height
}
else {
	return null
}
}
