/**
 * @properties={type:12,typeid:36,uuid:"853FF14B-FAA1-41F3-8370-5AF6E437B52E"}
 */
function display_valuelist()
{
	if (id_valuelist) {
		var itemName = valuelist_name || 'UNKNOWN'
		
		var height = (solutionPrefs.config.webClient) ? '16px' : '20'
		
		var html = '<html><head><style type="text/css" media="screen"><!--'
		html += 'table.sutra { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
		html += 'table.sutra td  { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding: 2px; height: ' + height + '; line-height: ' + height + '; }'
		html += 'table.sutra .rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }'
		html += 'table.sutra td.rowSelected a { color: white; text-decoration: none; }'
		html += '--></style></head>'
		if (globals.MGR_valuelist_valuelist_selected == id_valuelist) {
			html += '<table class = "sutra"><tr>'
			html += '<td class = "rowSelected">' + itemName + '</td>'
			html += '</tr></table></html>'
		}
		else {
			html += '<table class = "sutra"><tr>'
			html += '<td>' + itemName + '</td>'
			html += '</tr></table></html>'
		}
		return html
	}
}
