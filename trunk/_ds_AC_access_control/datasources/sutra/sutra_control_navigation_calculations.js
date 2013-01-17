/**
 *
 * @properties={type:12,typeid:36,uuid:"b796811a-e63c-4ccc-b1ee-68fc970640ee"}
 */
function nav_name()
{
if (utils.hasRecords(ac_control_navigation_to_navigation)) {
	return ac_control_navigation_to_navigation.nav_name
}
else {
	return null
}
}
