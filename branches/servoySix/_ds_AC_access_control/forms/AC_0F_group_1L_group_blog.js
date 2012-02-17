/**
 *
 * @properties={typeid:24,uuid:"dcd7f7bf-2f3d-4250-9e15-4d75f74046f1"}
 * @AllowToRunInFind
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	show pop up where non-group members are available to be added
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


//find all available blogs
var dataset = databaseManager.getDataSetByQuery(
                controller.getServerName(),
                'SELECT id_blog FROM sutra_blog',
                null,
                10000)
var allBlogs = dataset.getColumnAsArray(1)

//temporary hack until I can figure out how to merge blogs
if (utils.hasRecords(foundset) && (allBlogs && allBlogs.length && allBlogs.length <= 1)) {
	plugins.dialogs.showErrorDialog('Blog already assigned','Only one blog can be assigned to a group.')
}
//choose
else {
	// CREATE RECORDS IN FID NOT ALREADY ASSIGNED
	// distinction is flag_chosen
	
	//find group blog merge records
	var fsGroupBlog = forms.AC_P_group_blog.foundset //databaseManager.getFoundSet(controller.getServerName(),'sutra_access_group_blog')
	fsGroupBlog.clear()
	fsGroupBlog.find()
	fsGroupBlog.id_group = globals.AC_group_selected
	var results = fsGroupBlog.search()
	
	//create group_blog merge records if don't exist
	for ( var i = 0 ; i < allBlogs.length ; i++ ) {
		var matchFlag = false
		for ( var j = 0 ; j < fsGroupBlog.getSize() && !matchFlag ; j++ ) {
			var record = fsGroupBlog.getRecord(j + 1)
			if (record.id_blog == allBlogs[i]) {
				matchFlag = true
			}
		}
		//if no match found, create record
		if(!matchFlag) {
			var record = fsGroupBlog.getRecord(fsGroupBlog.newRecord())
			record.id_blog = allBlogs[i]
			record.id_group = globals.AC_group_selected
		}
	}
	
	
	// load FID with unassigned navigation records
	
	//find 'users' that are not assigned to this group
	fsGroupBlog.find()
	fsGroupBlog.id_group = globals.AC_group_selected
	fsGroupBlog.flag_chosen = '^='
	var results = fsGroupBlog.search()
	
	if (results) {
//		forms.AC_P_group_blog.controller.loadRecords(fsGroupBlog)
		
		//temporarily turn of auto save
		databaseManager.setAutoSave(false)
		
		//show FID
		globals.CODE_form_in_dialog(forms.AC_P_group_blog,-1,-1,-1,-1,"Blogs",false,false,'accessGroupBlogs')
	}
	else {
		plugins.dialogs.showInfoDialog('No blogs','There are no blogs that are not already assigned to this group')
	}
	
}	

}

/**
 *
 * @properties={typeid:24,uuid:"4e8c11de-fafe-4a9f-ad27-b35b0c3da634"}
 */
function REC_remove()
{

/*
 *	TITLE    :	REC_remove
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	remove record from chosen list
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

flag_chosen = 0
databaseManager.saveData()
}
