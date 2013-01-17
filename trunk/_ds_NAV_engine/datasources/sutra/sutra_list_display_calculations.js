/**
 *
 * @properties={type:12,typeid:36,uuid:"c15e21ac-a651-498d-a805-b505d6b3eb71"}
 */
function display_preview()
{
var html = ''

if (utils.hasRecords(nav_list_display_to_list_display_item)) {
	for ( var i = 1 ; i <= nav_list_display_to_list_display_item.getSize() ; i++ ) {
		var record = nav_list_display_to_list_display_item.getRecord(i)
		html += record.header
		if (i != nav_list_display_to_list_display_item.getSize()) {
			html += ' | '		
		}	
	}
}

return html

}

/**
 *
 * @properties={type:12,typeid:36,uuid:"a313262e-f07c-453c-8291-2cab9a25c61e"}
 */
function fw_list_title()
{
if (list_title) {
	return list_title
}
else {
	return nav_list_display_to_navigation_item.fw_list_title
}
}
