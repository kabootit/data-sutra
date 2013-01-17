/**
 *
 * @properties={type:12,typeid:36,uuid:"39551221-506e-4a17-94f1-4c037f9fd6ab"}
 */
function print_navigation_item()
{

if (id_navigation_item) {
	
	var html = '<html><head><style type="text/css" media="screen"><!--'
	html += 'table { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
	html += 'td  { text-indent: 20px; white-space: nowrap; overflow: hidden; border: 0px; padding: 1px; height: 20; line-height: 20; }'
	html += '.rowFill1  { background-color: #FFFFFF; }'
	html += '.rowFill2  { background-color: #FFFFFF; }'
	html += '.rowFillsub1  { background-color: #FFFFFF; text-indent: 30px;}'
	html += '.rowFillsub2  { background-color: #FFFFFF; text-indent: 30px;}'
	html += 'td.rowSelected a { color: white; text-decoration: none; }'
	html += 'td.expanded a { text-decoration: none; }'
	html += 'td.expandedSelected a { text-decoration: none; }'
	html += 'td.collapsed a { text-decoration: none; }'
	html += 'td.collapsedSelected a { text-decoration: none; }'
	html += '--></style></head>'
	
	html += '<table><tr>'
	
	//alternate node1
	
		//alternate node2
		//indent node2
	
	
	//white background
	if (node_1 && node_1 % 2 == 0) {
		//main node
		if (!node_2) {
			html += '<td class = "rowFill1">' + item_name + '</td>'
		}
		//indented node
		else {
			if (node_2 % 2 == 0) {
				html += '<td class = "rowFillsub1">' + item_name + '</td>'
			}
			else {
				html += '<td class = "rowFillsub2">' + item_name + '</td>'
			}
		}
	}
	//black background
	else {
		//main node
		if (!node_2) {
			html += '<td class = "rowFill2">' + item_name + '</td><td class = "rowFill2"></td>'
		}
		//indented node
		else {
			if (node_2 % 2 == 0) {
				html += '<td class = "rowFillsub1">' + item_name + '</td>'
			}
			else {
				html += '<td class = "rowFillsub2">' + item_name + '</td>'
			}
		}
	}
	
	html += '</tr></table></html>'
	return html
}
}
