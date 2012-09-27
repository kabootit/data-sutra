/**
 * @properties={type:12,typeid:36,uuid:"D54786BF-DB76-4AE7-B373-2453844473DF"}
 */
function url_path_tooltip() {
	if (url_path) {
		return '<html><body>Web client path: <b>' + url_path + '</b></body></html>'
	}
	else {
		return 'No web client path set'
	}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"7b7786eb-7639-4f28-b99e-fe79c86964f5"}
 */
function display_navigation()
{

if (id_navigation) {
	var itemName = (nav_name) ? nav_name : 'NO NAME'
	itemName = utils.stringReplace(itemName, '<', '&lt;')
	
	var height = (solutionPrefs.config.webClient) ? '16px' : '20'
	
	var html = '<html><head><style type="text/css" media="screen"><!--'
	html += 'table.sutra { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
	html += 'table.sutra td  { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding: 2px; height: ' + height + '; line-height: ' + height + '; }'
	html += 'table.sutra .rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }'
	html += 'table.sutra td.rowSelected a { color: white; text-decoration: none; }'
	html += '--></style></head>'
	if (globals.NAV_navigation_selected == id_navigation) {
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
