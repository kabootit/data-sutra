/**
 *
 * @properties={typeid:24,uuid:"e421e58a-3ca9-4d2a-9ee5-4e3bb5da0432"}
 */
function FORM_on_show(firstShow)
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	initialize blog, get qotd
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'AC_R__login'

var fsGroup = databaseManager.getFoundSet(controller.getServerName(),'sutra_access_group')
var fsBlog = databaseManager.getFoundSet(controller.getServerName(),'sutra_blog')
var fsQuote = databaseManager.getFoundSet(controller.getServerName(),'sutra_blog_quote')
var fsPrefs = databaseManager.getFoundSet(controller.getServerName(),'sutra_solution')
fsPrefs.loadAllRecords()

var rlnBlogEntry = 'ac_blog_to_blog_entry'

var preview = this.previewMode
var staticIntro = this.introMode
var noPassword = this.loginDisabled

//set date element with today
elements.lbl_date.text = globals.CODE_date_format(new Date())

//hide mosaic elements used for nice footer		//TODO: possibly provide a hook into this
elements.lbl_footer.visible = false
elements.lbl_footer_left.visible = false
elements.lbl_footer_right.visible = false

//which group was the last one to log in
var groupID = application.getUserProperty('sutra' + application.getServerURL().substr(7) + 'Group')
var userID = application.getUserProperty('sutra' + application.getServerURL().substr(7) + 'User')

//running in preview mode
if (preview && this.blogID) {
	fsBlog.find()
	fsBlog.id_blog = this.blogID
	var results = fsBlog.search()
	
	if (results) {
		var blogRecord = fsBlog.getRecord(1)
	}
}
//select the group record
else if (groupID) {
	fsGroup.find()
	fsGroup.id_group = groupID
	var results = fsGroup.search()
	
	//select blog record
	if (results && utils.hasRecords(fsGroup.ac_access_group_to_access_group_blog__selected)) {	//TODO
		fsBlog.find()
		fsBlog.id_blog = fsGroup.ac_access_group_to_access_group_blog__selected.id_blog
		var results = fsBlog.search()
		
		if (results) {
			var blogRecord = fsBlog.getRecord(1)
		}
	}
}


//use intro splash screen
if (staticIntro || (preview && !blogRecord) || ((!blogRecord || !fsPrefs.blog_enable) && !preview)) {
	//set banner text
	elements.lbl_banner.text = fsPrefs.initial_splash_header
	
	//show footer
	if (fsPrefs.initial_splash_header == 'Welcome to Data Sutra!') {
		elements.lbl_footer_left.text = 'Data Sutra'
		elements.lbl_footer_right.text = '<html><head></head><body>Data Mosaic &#8212; Copyright &#169; 2006-2012</body></html>'
		
		elements.lbl_footer.visible = true
		elements.lbl_footer_left.visible = true
		elements.lbl_footer_right.visible = true
		
		if (firstShow) {
			elements.fld_blog.setSize(elements.fld_blog.getWidth(), elements.fld_blog.getHeight() - 23)
		}
	}
	else if (fsPrefs.initial_splash_header == 'Welcome to Sutra CMS!') {
		elements.lbl_footer_left.text = 'Sutra CMS'
		elements.lbl_footer_right.text = '<html><head></head><body>Data Mosaic &#8212; Copyright &#169; 2011-2012, MIT Licensed</body></html>'
		
		elements.lbl_footer.visible = true
		elements.lbl_footer_left.visible = true
		elements.lbl_footer_right.visible = true
		
		if (firstShow) {
			elements.fld_blog.setSize(elements.fld_blog.getWidth(), elements.fld_blog.getHeight() - 23)
		}
	}
	
	var html = fsPrefs.initial_splash_screen
}
//use fixed blog for this blog
else if (blogRecord && !blogRecord.blog_fixed_always) {
	//set banner text
	elements.lbl_banner.text = blogRecord.blog_banner
	
	//how many posts to display => default to 10 if none specified
	var posts = (blogRecord.blog_posts) ? blogRecord.blog_posts : 10
	
	//html header stuff
	var html = '<html>'
	html += '<head>'
	html += '<style type="text/css" media="screen"><!--'
	html += 'body { margin: 0px 0px 0px 0px; background-color: #FFFFFF; }'
	html += 'p { text-indent: 1cm; padding: 0px 10px 0px 10px; }'
	html += 'p.noindent { text-indent: 0cm; padding: 0px 10px 0px 10px; }'
	html += '.header { padding: 10px; color: black; text-decoration: none; font-weight: normal; font-size: 100%; background-color: #E8ECF1; }'
	html += '.footer { padding: 10px 10px 0px 10px; color: black; text-decoration: none; font-weight: normal; font-size: 100%; background-color: #E8ECF1; position: fixed; bottom: 2000px; }'
	html += 'table { table-layout: auto; width: 100%; border-spacing: 0px; border: 0px; }'
	html += 'td  { text-indent: 0px; border: 0px; padding: 0px 5px 0px 5px; height: 20; line-height: 20;}'
	html += 'td.blogtitle  {text-align: left; color: white; text-decoration: none; font-weight: bold; font-size: 110%; background-color: gray; }'
	html += 'td.posted  { text-align: right; color: white; text-decoration: none; font-weight: bold; font-size: 100%; background-color: gray; }'
	html += '.poster { font-style: italic; }'
	html += '--></style>'
	html += '</head>'
	html += '<body>'
	
	//get header
	html += (blogRecord.blog_header) ? (blogRecord.blog_header) : '<div class="header">Welcome to '+blogRecord.name_organization + '</div>'
	
	//sort posts reverse chrono
	if (blogRecord[rlnBlogEntry].getSize()) {
		blogRecord[rlnBlogEntry].sort('blog_posted desc')
	}
	
	//get all posts, per post preference
	for (var i = 1; i <= blogRecord[rlnBlogEntry].getSize() && i <= posts; i++) {
		var blogPost = blogRecord[rlnBlogEntry].getRecord(i)
		
		//post header information
		html += '<table>'
		html += '<tr>'
		html += '<td class="blogtitle">'
			html += (blogPost.blog_title) ? blogPost.blog_title : 'Post #' + blogPost.id_blog
		html += '</td>'
		html += '<td class="posted">'
		//TODO: get pretty name if available, else use user name
			html += (blogPost.blog_posted && !blogRecord.blog_date_hide) ? utils.dateFormat(blogPost.blog_posted,((application.__parent__.solutionPrefs && solutionPrefs.fastFind && solutionPrefs.fastFind.dateFormat) ? solutionPrefs.fastFind.dateFormat : i18n.getDefaultDateFormat())) : '' 
			html += (blogPost.blog_author && !blogRecord.blog_author_hide) ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by <span class="poster">' + ((true) ? 'Coming soon...' : blogPost.blog_author) + '</span>' : ''
		html += '</td>'
		html += '</tr>'
		html += '</table>'
		
		//post
		if (blogPost.blog_message) {
			var blogMessage = blogPost.blog_message
			blogMessage = utils.stringReplace(blogMessage,'\n','<br>')
			var usedP = utils.stringPosition(blogMessage,'<p>',0,1)
			if (usedP == -1) {
				blogMessage = '<p class="noindent">'+blogMessage
			}
		}
		else {
			var blogMessage = '<p>No blog post</p>'
		}
		html += blogMessage
		html += '<br><br>'
		
	}
	
	//get footer
	html += (blogRecord.blog_footer) ? (blogRecord.blog_footer) : ''//'<div class="footer">Copyright '+blogRecord.name_organization + '</div>'
	html += '</body>'
	html += '</html>'
}

//use fixed splash for this organization if specified
else if (blogRecord && blogRecord.blog_fixed_always) {
	//set banner text
	elements.lbl_banner.text = ''
	
	//set html
	var html = blogRecord.blog_fixed
}

//set blog global
globals.AC_html_blog = html

//set quote of the day

//check for auto-quote and internet
var autoQuote = (blogRecord && blogRecord.quote_auto != null) ? blogRecord.quote_auto : 1

if (autoQuote && application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.internetAllowed) {
	var pageData = plugins.http.getPageData('http://www.quoteworld.org/quote/quote.php?action=quote_of_the_day');
	var pageItems = pageData.split("'")
	var qotd = pageItems[1]
	var author = pageData.split('">')
	if (author && author[1]) {
		//get location for more author quotes
		var webloc = author[0].split('href="')
		
		if (webloc && webloc[1]) {
			webloc = "'" + webloc[1] + "'"
		}
		
		//get author
		author = author[1].substring(0,author[1].indexOf('<',0))
		
//		//make clickable		//MEMO: turned off because our quote site sucks...could be cool if it didn't
//		if (typeof webloc == 'string') {
//			author = '<a title="More quotes by ' + author + '" href="javascript:globals.CODE_url_handler(' + webloc + ')">' + author + '</a>'
//		}
	}
	else {
		author = 'Anonymous'
	}
	qotd = utils.stringReplace(qotd,"`","'")
}
//try to find quote if there is a blog
else if (blogRecord) {
	//find quote for today
	fsQuote.find()
	fsQuote.id_blog = blogRecord.id_blog
	fsQuote.quote_active = 1
	fsQuote.date_display = utils.dateFormat(new Date(), 'M-d-yyyy')+'|M-d-yyyy'
	var results = fsQuote.search()
	
	//set today quote
	if (results) {
		var qotd = fsQuote.quote
		var author = fsQuote.quote_author
	}
	//nothing for today, find default
	else {
		fsQuote.find()
		fsQuote.id_blog = blogRecord.id_blog
		fsQuote.quote_active = 1
		fsQuote.quote_default = 1
		results = fsQuote.search()
		
		//set default quote
		if (results) {
			var qotd = fsQuote.quote
			var author = fsQuote.quote_author
		}
		//no default, set to be empty
		else {
			var qotd = ''
			var author = ''
		}
	}
}
else {
	var qotd = ''
	var author = ''
}

var qotdHtml =	'<html><head>' +
				'<style type="text/css" media="screen"><!-- ' +
				'body { margin: 0; }' +
				'p { padding: 0px 10px 0px 10px; margin-top: 5px; }' +
				'td { font-style: italic; }' +
				'--></style></head>' +
				'<body>' +
				'<p>' + qotd + '</p>' +
				'<br>' +
				'<table width="85%"><tr><td align="right">' +
				((author) ? '&#151; ' : '') + author +
				'</td></tr></table>' +
				'</body></html>'

globals.AC_html_qotd = qotdHtml

//set misc html area for fixed
if ((preview && !groupID) || (!groupID || !fsPrefs.blog_enable && !preview)) {
	globals.AC_html_misc = fsPrefs.initial_splash_misc
}
//set misc html area for subsequent logins with blog enabled
else if (blogRecord && blogRecord.blog_misc) {
	globals.AC_html_misc = blogRecord.blog_misc
}
//set misc html area to null
else {
	globals.AC_html_misc = null
}

//when no password mode, hide misc and qotd
if (noPassword) {
	elements.box_qotd.visible = false
	elements.lbl_qotd.visible = false
	elements.fld_qotd.visible = false
	
	elements.box_misc.visible = false
	elements.lbl_misc.visible = false
	elements.fld_misc.visible = false
}
//show them
else {
	elements.box_qotd.visible = true
	elements.lbl_qotd.visible = true
	elements.fld_qotd.visible = true
	
	elements.box_misc.visible = true
	elements.lbl_misc.visible = true
	elements.fld_misc.visible = true
}



}
