/**
 *
 * @properties={type:12,typeid:36,uuid:"e2aa3822-4466-484b-8fa5-7eecd91d4d0d"}
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
