/**
 *
 * @properties={type:12,typeid:36,uuid:"aa0645da-8e02-4d87-9921-67a4306a7ccd"}
 */
function row_background()
{
//white/tan with medium blue highlighter

var index = arguments[0]
var selected = arguments[1]

if (selected) {
	if (flag_done) {
		return '#B6E6B6'
	}
	else {
		return '#BED7F7'
	}
}
else {
	if (flag_done) {
		return '#DBF5DB'
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
}
