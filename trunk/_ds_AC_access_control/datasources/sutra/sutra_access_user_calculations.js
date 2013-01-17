/**
 *
 * @properties={type:12,typeid:36,uuid:"05610bdd-f149-4594-8623-9abb600f840c"}
 */
function display_login_expiration()
{
var html = '<html><head>'

//css
html += '<style type="text/css" media="screen"><!--'
html += '.red { color: red;  font-weight: bold; }'
html += '.blue { color: blue;  font-weight: bold; }'
html += '.green { color: green; }'
html += '--></style></head>'

//body
html += '<body>'

//no password
if (!user_password) {
	html += '<span class="red">BLANK PASSWORD</span>'
}
//account disabled
else if (account_disabled) {
	html += 'Account <span class="red">disabled</span>'
}
//password never expires
else if (pass_never_expires) {
	html += 'Password <span class="blue">never</span> expires'
}
//expiration in effect
else if (ac_access_user_to_access_rules.expire_flag) {
	
	var expireDays = ac_access_user_to_access_rules.expire_days
	var today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
	var startDate = (date_password_changed) ? new Date(date_password_changed.getFullYear(),date_password_changed.getMonth(),date_password_changed.getDate()) : new Date()
	var expire = expireDays - Math.floor(((today - startDate) / 864E5))
	
	if (expire > 0) {
		html += 'Password expires in <span class="green">' + expire + ' days</span>'
	}
	else {
		html += 'Password <span class="red">expired</span>'
	}

}

//close body
html += '</body></html>'

return html
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"a8080d60-b261-4c27-8c5b-06a8b1612e69"}
 */
function display_user_name()
{

if (id_user) {
	var itemName = (user_name) ? user_name : 'UNKNOWN'
	
	var height = (solutionPrefs.config.webClient) ? '16px' : '20'
	
	var html = '<html><head><style type="text/css" media="screen"><!--'
	html += 'table.sutra { table-layout: fixed; width: 100%; border-spacing: 0px; border: 0px; }'
	html += 'table.sutra td  { text-indent: 5px; white-space: nowrap; overflow: hidden; border: 0px; padding: 2px; height: ' + height + '; line-height: ' + height + '; }'
	html += '.table.sutra rowSelected  { color: white; text-decoration: none; font-weight: bold; background-image: url("media:///row_selected.png"); }'
	html += 'table.sutra td.rowSelected a { color: white; text-decoration: none; }'
	html += '--></style></head>'
	if (globals.AC_user_selected == id_user) {
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
 * @properties={type:12,typeid:36,uuid:"42ae180d-7adb-4501-8cfa-010e68c36ed5"}
 */
function row_background()
{
//white/tan with medium blue highlighter

var index = arguments[0]
var selected = arguments[1]

if (selected) {
	return '#BED7F7'
}
else {
	if (index % 2 == 0) {
		return '#F7F8EF'
	}
	else {
		return '#FFFFFF'
	}
}
}
