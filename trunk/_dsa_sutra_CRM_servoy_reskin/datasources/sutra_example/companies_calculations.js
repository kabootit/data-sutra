/**
 *
 * @properties={type:12,typeid:36,uuid:"0fb8ace9-ec72-4993-8b8d-ecf18d353204"}
 */
function display_companies()
{

if (company_id) {
	var itemName = (company_name) ? company_name : 'UNKNOWN'
	
	var html = '<html><head><style type="text/css" media="screen"><!--'
	html += 'table.sutra { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
	html += 'table.sutra td  { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding: 2px; height: 20; line-height: 20; }'
	html += 'table.sutra .rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }'
	html += 'table.sutra td.rowSelected a { color: white; text-decoration: none; }'
	html += '--></style></head>'
	if (globals.CRM_companies_selected == company_id) {
		html += '<table class="sutra"><tr>'
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
 * @properties={type:12,typeid:36,uuid:"3312bbbe-f9a0-4507-b95e-12a3982c8227"}
 */
function display_is_active()
{

switch (is_active) {
		case 1:
			return 'ACTIVE'
			break
		
		case 0:
			return 'INACTIVE'
			break
}
}
