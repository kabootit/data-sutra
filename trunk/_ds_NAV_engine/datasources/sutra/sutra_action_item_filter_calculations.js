/**
 *
 * @properties={type:12,typeid:36,uuid:"e63177c9-1827-4817-89f7-ca578b1db990"}
 */
function display_column_value()
{

switch (filter_type) {
	case 'Value':
		return column_value
		break
	case 'Function':
		return method_name + '(' + column_value + ')'
		break
	default:
		return null
		break
}
}
