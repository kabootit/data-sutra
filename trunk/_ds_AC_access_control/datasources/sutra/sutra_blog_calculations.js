/**
 *
 * @properties={type:4,typeid:36,uuid:"03696f1a-bb2b-4f7b-bfb9-a5c91410a4c0"}
 */
function total_posts()
{


if (utils.hasRecords(ac_blog_to_blog_entry)) {
	return ac_blog_to_blog_entry.getSize()
}
else {
	return null
}
}
