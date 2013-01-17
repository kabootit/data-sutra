/**
 *
 * @properties={type:12,typeid:36,uuid:"389ebcd4-777a-4f2a-8ab0-17a9c0ef50ef"}
 */
function blog_author()
{
/*
if (utils.hasRecords(ac_blog_to_access_staff)) {
	return ac_blog_to_access_staff.name_fl
}
else {
	return null
}
*/
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"8e9f7997-5df6-4ecb-b95a-2a9141f8cb2b"}
 */
function blog_message_html()
{
if (blog_message) {
	var blogMessage = blog_message
	blogMessage = utils.stringReplace(blogMessage,'\n','<br>')
	return '<html><body>'+blogMessage+'</body></html>'
}
else {
	return null
}
}
