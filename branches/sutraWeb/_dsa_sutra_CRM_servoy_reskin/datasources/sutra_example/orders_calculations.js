/**
 *
 * @properties={type:6,typeid:36,uuid:"08a86d07-3228-456c-858a-ba643143a04f"}
 */
function amt_discount()
{
if(crm_orders_to_order_items && pct_discount)
{
	return crm_orders_to_order_items.sum_extended * pct_discount
}
else
{
	return 0
}
}

/**
 *
 * @properties={type:6,typeid:36,uuid:"2dae7b08-ae2f-475c-ba2f-f6e9472b84b6"}
 */
function amt_tax()
{
if(crm_orders_to_order_items && pct_tax)
{
	return crm_orders_to_order_items.sum_extended * pct_tax
}
else
{
	return 0
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"26829078-ae33-436e-99c6-d2bdd80979c2"}
 */
function bill_address_html()
{
var str = '<html>'
if(company_id) str += '<b>' + crm_orders_to_companies.company_name + '</b>'
if(contact_id) str += '\n' + crm_orders_to_contacts.name_fl

if(crm_orders_billaddr_to_addresses)
{
	str += '\n' + crm_orders_billaddr_to_addresses.address_display_calc
}

str = utils.stringReplace(str, '\n', '<br>')
return str + '</html>'
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"a5ad8ed5-3db3-439e-88b2-8120d092cb79"}
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
 * @properties={type:12,typeid:36,uuid:"15e4b4b8-1db9-4364-8668-52fd2eada4d0"}
 */
function display_order_number()
{

if (order_number) {
	return utils.numberFormat(order_number,'#')
}
else {
	return null
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"d61df72a-645f-41a0-b243-ca47f26ed543"}
 */
function display_orders()
{

if (order_id) {
	var itemName = ''
	
	if(order_number) {
		itemName = utils.numberFormat(order_number,'###,###,###,###') + ''
	}
	else {
		itemName = "ID: " + utils.numberFormat(order_id,'###,###,###,###')
	}
	
	if(crm_orders_to_companies && crm_orders_to_companies.company_name) {
		itemName += ' - ' + crm_orders_to_companies.company_name
	}
	
	var html = '<html><head><style type="text/css" media="screen"><!--'
	html += 'table { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
	html += 'td  { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding: 2px; height: 20; line-height: 20; }'
	html += '.rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }'
	html += 'td.rowSelected a { color: white; text-decoration: none; }'
	html += '--></style></head>'
	if (globals.CRM_orders_selected == order_id) {
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
 * @properties={type:12,typeid:36,uuid:"9ae6b48e-6cff-4d7d-a669-3d7d76557300"}
 */
function order_month_year_display()
{
var monthNames = new Array('January','February','March','April','May','June','July','August','September','October','November','December')
var year = order_date.getYear() + 1900

return monthNames[order_date.getMonth()] + ' ' + year
}

/**
 *
 * @properties={type:6,typeid:36,uuid:"c75881ec-0b2c-477d-a4a4-fdd96cdd39ef"}
 */
function order_subtotal()
{
if(crm_orders_to_order_items)
{
	return crm_orders_to_order_items.sum_extended
}
else
{
	return 0
}
}

/**
 *
 * @properties={type:6,typeid:36,uuid:"ee743b85-2a3a-4c2e-87b9-8e4e743bce3c"}
 */
function order_total()
{
if(crm_orders_to_order_items)
{
	return (crm_orders_to_order_items.sum_extended - amt_discount) + amt_shipping + amt_tax
}
else
{
	return 0
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"4fb74ea4-27d8-4f86-9b69-406f14a4b526"}
 */
function paid_display()
{
if(is_paid == 1)
{
	return "<HTML><table><td style='white-space: nowrap; overflow: hidden;'><font color='#009900'>PAID</font></td></table></HTML>"
}
else
{
	return "<HTML><table><td style='white-space: nowrap; overflow: hidden;'><font color='#cc0000'>PENDING</font></td></table></HTML>"
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"7aeead11-8522-43d0-8800-1a05ee7b153d"}
 */
function ship_address_html()
{
var str = '<html>'
if(company_id) str += '<b>' + crm_orders_to_companies.company_name + '</b>'
if(contact_id) str += '\n' + crm_orders_to_contacts.name_fl

if(crm_orders_shipaddr_to_addresses)
{
	str += '\n' + crm_orders_shipaddr_to_addresses.address_display_calc
}

str = utils.stringReplace(str, '\n', '<br>')
return str + '</html>'
}

/**
 *
 * @properties={type:6,typeid:36,uuid:"0572824a-29b5-4ebe-b6ad-b25c271c8710"}
 */
function subtotal_after_discount()
{
if(amt_discount > 0)
{
	return order_subtotal - amt_discount
}
else
{
	return order_subtotal
}
}
