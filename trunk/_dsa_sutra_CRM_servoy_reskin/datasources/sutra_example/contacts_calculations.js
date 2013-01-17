/**
 *
 * @properties={type:12,typeid:36,uuid:"69c06955-ba8d-4436-adb3-b16b779f054b"}
 */
function display_contacts()
{

if (contact_id) {
	var itemName = (name_lf) ? name_lf : 'UNKNOWN'
	
	var html = '<html><head><style type="text/css" media="screen"><!--'
	html += 'table { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
	html += 'td  { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding: 2px; height: 20; line-height: 20; }'
	html += '.rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }'
	html += 'td.rowSelected a { color: white; text-decoration: none; }'
	html += '--></style></head>'
	if (globals.CRM_contacts_selected == contact_id) {
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
 * @properties={type:12,typeid:36,uuid:"eeaf742e-aeef-406b-b73c-96330460aa56"}
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

/**
 *
 * @properties={type:12,typeid:36,uuid:"771fb036-1361-4f49-8806-b181c60e4185"}
 */
function mail_label()
{
if(mail_address_id)
{
	var address = null
	if(crm_contacts_to_companies && crm_contacts_to_companies.company_name && mail_use_company == 1) address = crm_contacts_to_companies.company_name
	
	if(address)
	{
		address += '\n' + name_fl
	}
	else
	{
		address = name_fl
	}
	
	if(crm_contacts_to_addresses)
	{
		address += '\n' + crm_contacts_to_addresses.address_display_calc
		
		if(crm_contacts_to_addresses.country && mail_use_country == 1) address += '\n' + crm_contacts_to_addresses.country
	}
	
	
	return address
}
else
{
	return ''
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"d9a065e7-4d8f-4674-b0e1-211e57f791d6"}
 */
function name_fl()
{
if(name_first && name_last)
{
	return name_first + " " + name_last
}
else if(name_last)
{
	return name_last
}
else if(name_first)
{
	return name_first
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"4b73dd3e-b8cc-436f-b9cb-406cf8b938d4"}
 */
function name_lf()
{
if(name_first && name_last)
{
	return name_last.toUpperCase() + ", " + name_first
}
else if(name_last & !name_first)
{
	return name_last.toUpperCase()
}
else
{
	return "?, " + name_first
}
}
