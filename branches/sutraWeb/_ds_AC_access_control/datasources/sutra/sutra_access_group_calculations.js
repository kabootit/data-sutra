/**
 *
 * @properties={type:12,typeid:36,uuid:"d0c13ea5-e3d2-4215-b5af-0e7c4207b602"}
 */
function display_group_name()
{

if (id_group) {
	var itemName = (group_name) ? group_name : 'UNKNOWN'
	
	var html = '<html><head><style type="text/css" media="screen"><!--'
	html += 'table { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
	html += 'td  { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding: 2px; height: 20; line-height: 20; }'
	html += '.rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }'
	html += 'td.rowSelected a { color: white; text-decoration: none; }'
	html += '--></style></head>'
	if (globals.AC_group_selected == id_group) {
		html += '<table><tr>'
		html += '<td class = "rowSelected">' + itemName + '</td>'
		html += '</tr></table></html>'
	}
	else {
		html += '<table><tr>'
		html += '<td>' + itemName + '</td>'
		html += '</tr></table></html>'
	}
	return html
}
}
