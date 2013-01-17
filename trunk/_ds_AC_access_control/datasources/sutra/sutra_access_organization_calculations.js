/**
 * @properties={type:12,typeid:36,uuid:"3635AF2F-6047-49BE-A92A-3B6B4D4859CF"}
 */
function display_organization()
{
	if (id_organization) {
		var itemName = name_organization || 'UNKNOWN'
		
		var height = (solutionPrefs.config.webClient) ? '16px' : '20'
		
		var html = '<html><head><style type="text/css" media="screen"><!--'
		html += 'table.sutra { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
		html += 'table.sutra td  { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding: 2px; height: ' + height + '; line-height: ' + height + '; }'
		html += 'table.sutra .rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }'
		html += 'table.sutra td.rowSelected a { color: white; text-decoration: none; }'
		html += '--></style></head>'
		if (globals.AC_organization_selected == id_organization) {
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
