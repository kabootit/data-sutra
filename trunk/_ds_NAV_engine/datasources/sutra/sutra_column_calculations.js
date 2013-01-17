/**
 *
 * @properties={type:12,typeid:36,uuid:"e9c5d286-edf5-4ac0-83fa-ae070ebdd2eb"}
 */
function display_name_column()
{

if (status_relation) {
	return table_or_relation+'.'+name_column
}
else {
	return name_column
}
}

/**
 *
 * @properties={type:4,typeid:36,uuid:"70e036d3-dd20-45c8-8d77-3b680045d18c"}
 */
function status_named()
{

//returns 0 if column named, otherwise 1

if (name_display == null || name_display == '') {
	return 1
}
else {
	return 0
}
}
