/**
 *
 * @properties={type:12,typeid:36,uuid:"01a63250-c583-4a2b-83ea-ae89347027d6"}
 */
function display_is_active()
{

switch (is_active) {
		case 1:
			return 'OPEN'
			break
		
		case 0:
			return 'CLOSED'
			break
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"5ae7445f-a841-474a-a72f-3d11015a1f19"}
 */
function display_products()
{

if (product_id) {
	var itemName = product_name+' ('+utils.numberFormat(product_number,'###,###,###,###')+')'
	
	var html = '<html><head><style type="text/css" media="screen"><!--'
	html += 'table { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
	html += 'td  { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding: 2px; height: 20; line-height: 20; }'
	html += '.rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }'
	html += 'td.rowSelected a { color: white; text-decoration: none; }'
	html += '--></style></head>'
	if (globals.CRM_products_selected == product_id) {
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

/**
 *
 * @properties={type:6,typeid:36,uuid:"5890b7f6-ca6d-4e72-afff-6a51eaca2b8f"}
 */
function margin()
{
if(cost_each && price_each)
{
	return price_each - cost_each
}
else
{
	return null
}
}

/**
 *
 * @properties={type:6,typeid:36,uuid:"39845e67-7265-4d02-b515-7b7086774a3e"}
 */
function margin_pct()
{
if(margin)
{
	return (margin/price_each)
}
else
{
	return null
}
}
