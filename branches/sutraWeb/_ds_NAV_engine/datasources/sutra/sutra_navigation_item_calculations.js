/**
 *
 * @properties={type:12,typeid:36,uuid:"e838099d-5a82-4531-8753-ac24eb256ac2"}
 */
function display_item_id()
{

if (id_navigation_item) {
	var itemName = item_id
	
	var height = (solutionPrefs.config.webClient) ? '16px' : '20'
	
	var html = '<html><head><style type="text/css" media="screen"><!--'
	html += 'table.sutra { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
	html += 'table.sutra td  { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding: 2px; height: ' + height + '; line-height: ' + height + '; }'
	html += 'table.sutra .rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }'
	html += 'table.sutra td.rowSelected a { color: white; text-decoration: none; }'
	html += '--></style></head>'
	if (globals.NAV_navigation_item_selected == id_navigation_item) {
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

/**
 *
 * @properties={type:12,typeid:36,uuid:"ce19b6e3-afb6-4622-a9ca-50e7fcb2862b"}
 */
function display_navigation_item()
{

if (id_navigation_item) {
	var itemName = (item_name) ? item_name : '*Assign name in prefs*'
	itemName = utils.stringReplace(itemName, '<', '&lt;')
	
	var height = (solutionPrefs.config.webClient) ? '16px' : '20'
	
	var html = '<html><head><style type="text/css" media="screen"><!--'
	html += 'table.sutra  { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
	html += 'table.sutra td  { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding: 2px; height: ' + height + '; line-height: ' + height + '; }'
	html += 'table.sutra .rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }'
	html += 'table.sutra .rowSelectedIndent  { background-image: url("media:///row_selected.png"); width: 10px; }'
	html += 'table.sutra .rowIndent  { width: 10px; }'
	html += 'table.sutra td.rowSelected a { color: white; text-decoration: none; }'
	html += '--></style></head>'
	
	html += '<table class = "sutra"><tr>'
	
	//if row selected
	if (globals.NAV_navigation_item_selected == id_navigation_item) {
		//fill space on child records
		if (node_2 != 0) {
			html += '<td class = "rowSelectedIndent"></td>'
		}
		html += '<td class = "rowSelected">' + itemName + '</td>'
	}
	//if not selected
	else {
		//fill space on child records
		if (node_2 != 0) {
		//no children, fill space
			html += '<td class = "rowIndent"></td>'
		}
		html += '<td>' + itemName + '</td>'
	}
	html += '</tr></table></html>'
	return html
}

}

/**
 *
 * @properties={type:12,typeid:36,uuid:"a3f5db29-6db1-4aec-b946-a442ac57ef22"}
 */
function display_triangle()
{

if (id_navigation_item) {
	var itemName = ''
	
	var height = (solutionPrefs.config.webClient) ? '16px' : '20'
	
	var html = '<html><head><style type="text/css" media="screen"><!--'
	html += 'table.sutra  { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
	html += 'table.sutra td  { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding: 0px; height: ' + height + '; line-height: ' + height + '; }'
	html += 'table.sutra .rowSelectedFill  { background-image: url("media:///row_selected.png"); width: 10px; }'
	html += 'table.sutra .expanded  { background-image: url("media:///row_expanded.png"); background-repeat: no-repeat; width: 10px; }'
	html += 'table.sutra .expandedSelected  { background-image: url("media:///row_expanded_selected.png"); background-repeat: no-repeat; width: 10px; }'
	html += 'table.sutra .collapsed  { background-image: url("media:///row_collapsed.png"); background-repeat: no-repeat; width: 10px; }'
	html += 'table.sutra .collapsedSelected  { background-image: url("media:///row_collapsed_selected.png"); background-repeat: no-repeat; width: 10px; }'
	html += 'table.sutra .rowFill  { width: 10px; }'
	html += 'table.sutra td.rowSelected a { color: white; text-decoration: none; }'
	html += 'table.sutra td.expanded a { text-decoration: none; }'
	html += 'table.sutra td.expandedSelected a { text-decoration: none; }'
	html += 'table.sutra td.collapsed a { text-decoration: none; }'
	html += 'table.sutra td.collapsedSelected a { text-decoration: none; }'
	html += '--></style></head>'
	
	html += '<table class = "sutra"><tr>'
	
	//if row selected
	if (globals.NAV_navigation_item_selected == id_navigation_item) {
		//if children (show triangle)
		if (utils.hasRecords(nav_navigation_item_to_navigation_item__children__all) && node_2 == 0) {
			//if records
			if (nav_navigation_item_to_navigation_item__children__all.getSize() > 1) {
				//if expanded (triangle down)
				if (row_status_expanded) {
					html += '<td class = "expandedSelected"><a href="javascript:REC_open_close()">' + itemName + '</a></td>'
				}
				//if collapsed (triangle sideways)
				else {
					html += '<td class = "collapsedSelected"><a href="javascript:REC_open_close()">' + itemName + '</a></td>'
				}
			}
			//no children, fill space
			else {
				html += '<td class = "rowSelectedFill"></td>'
			}
		}
		//children, fill space
		else {
			html += '<td class = "rowSelectedFill"></td>'
		}
	}
	//if not selected
	else {
		//if children (show triangle)
		if (utils.hasRecords(nav_navigation_item_to_navigation_item__children__all) && node_2 == 0) {
			//if records
			if (nav_navigation_item_to_navigation_item__children__all.getSize() > 1) {
				//if expanded (triangle down)
				if (row_status_expanded) {
					html += '<td class = "expanded"><a href="javascript:REC_open_close()">' + itemName + '</a></td>'
				}
				//if collapsed (triangle sideways)
				else {
					html += '<td class = "collapsed"><a href="javascript:REC_open_close()">' + itemName + '</a></td>'
				}
			}
			//no children, fill space
			else {
				html += '<td class = "rowFill"></td>'
			}
		}
	}
	html += '</tr></table></html>'
	return html
}

}

/**
 * @properties={type:12,typeid:36,uuid:"D54786AF-DB76-4AE7-B373-2453844473DF"}
 */
function url_path_tooltip() {
	if (url_path) {
		return '<html><body>Web client path: <b>' + url_path + '</b></body></html>'
	}
	else {
		return 'No web client path set'
	}
}
