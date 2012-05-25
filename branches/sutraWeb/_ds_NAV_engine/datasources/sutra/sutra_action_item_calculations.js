/**
 *
 * @properties={type:12,typeid:36,uuid:"da1a388e-bcbe-4b37-b79c-1e7de560179b"}
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
