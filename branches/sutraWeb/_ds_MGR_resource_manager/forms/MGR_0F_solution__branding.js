/**
 *
 * @properties={typeid:24,uuid:"820C3848-BB64-4905-B517-45CE9894A5A2"}
 */
function BLOG_preview()
{

/*
 *	TITLE    :	BLOG_preview
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	BLOG_preview()
 *			  	
 *	MODIFIED :	September 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (forms.AC_R__login) {
	//flag that in preview mode
	forms.AC_R__login.previewMode = true
	forms.AC_R__login.introMode = true
	
	//preview mode
	forms.AC_R__login.elements.tab_login.tabIndex = 3

	globals.CODE_form_in_dialog(forms.AC_R__login,-1,-1,-1,-1,'Splash screen preview',true,false,'blogPreview')
	
	forms.AC_R__login.previewMode = false
	forms.AC_R__login.introMode = false
}
else {
	plugins.dialogs.showErrorDialog(
				'Error',
				'Preview only available when in Data Sutra',
				'OK'
			)
}
}

/**
 *
 * @properties={typeid:24,uuid:"0D22CD2F-211F-4FFA-AA41-7B5F331E768E"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TRIGGER_tooltip_set()


}

/**
 *
 * @properties={typeid:24,uuid:"7EF79709-EE20-4A60-BF39-8E822EF4AECE"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	adjust size of preview
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	September 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//preview size
if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase
	
	var width = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getWidth()
	
	elements.gfx_header_preview.setSize(width + 60, elements.gfx_header_preview.getHeight())
	elements.tab_preview.setSize(width, elements.tab_preview.getHeight())
	
	//background graphics
	elements.gfx_tool_center.setSize(width - 12, elements.gfx_tool_center.getHeight())
	elements.gfx_tool_right.setLocation(elements.gfx_tool_center.getLocationX() + width - 12, elements.gfx_tool_right.getLocationY())
}

//show/hide icon actions and tooltips
if (solution_icon && solution_icon_blob) {
	var upload = false
	
	//blob loader preview
	if (solution_icon_type.equalsIgnoreCase('pdf') || solution_icon_type.equalsIgnoreCase('png') || solution_icon_type.equalsIgnoreCase('jpg') || 
		solution_icon_type.equalsIgnoreCase('jpeg') || solution_icon_type.equalsIgnoreCase('gif') || solution_icon_type.equalsIgnoreCase('bmp') || 
		solution_icon_type.equalsIgnoreCase('pict') || solution_icon_type.equalsIgnoreCase('tif') || solution_icon_type.equalsIgnoreCase('tiff')) {
	
		var blobLoader =
		  	'media:///servoy_blobloader?servername=' + controller.getServerName() + 
			'&tablename=' + 'sutra_solution' +
			'&dataprovider=solution_icon_blob' +
			'&rowid1=' + id_solution +
			'&mimetype='+solution_icon_type + 
			'&filename='+solution_icon 
		
		var displayIcon = '<img src="' + blobLoader + '">'
	}
	//no preview available
	else {
		var displayIcon = 'No preview for <strong>.' + solution_icon_type + '</strong> files'
	}
	
	//file size
	if (solution_icon_size) {
		var size = solution_icon_size/1024
		
		if (size < 1) {
			var displaySize = '<1 KB'
		}
		else if (size < 1024) {
			var displaySize = utils.numberFormat(size,'#,###.#') + " KB"
		}
		else if (size > 1024 && size < (1024 * 1024)) {
			var displaySize = utils.numberFormat(size/1024,'#,###.#') + ' MB'
		}
		else {
			var displaySize = utils.numberFormat(size/(1024 * 1024),'#,###.#') + ' GB'
		}
	}
	else {
		var displaySize = null
	}
	
	elements.fld_solution_icon.toolTipText = 
		'<html><head></head><body>' +
		'&#160;&#160;&#160;File type: ' + solution_icon_type + '&#160;&#160;&#160;<br>' +
		'&#160;&#160;&#160;Size: ' + displaySize + '&#160;&#160;&#160;<br>' +
		'&#160;&#160;&#160;' + displayIcon + '&#160;&#160;&#160;' +
		'</body></html>'

}
else {
	var upload = true
	
	elements.fld_solution_icon.toolTipText = 'Import an image for use in the Title toolbar and in the window header'
}

elements.btn_add_icon.visible = upload
elements.btn_del_icon.visible = !upload


}

/**
 *
 * @properties={typeid:24,uuid:"974FB0C8-32E9-4C5D-8DCD-4EFC0451999F"}
 */
function ICON_delete()
{

/*
 *	TITLE    :	ICON_delete
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	delete the icon used for the toolbar
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ICON_delete()
 *			  	
 *	MODIFIED :	October 1, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var iconDelete = plugins.dialogs.showQuestionDialog(
				'Delete?',
				'Do you really want to delete the icon used to brand this solution?',
				'Yes',
				'No'
		)

if (iconDelete == 'Yes') {
	solution_icon = null
	solution_icon_blob = null
	solution_icon_size = null
	solution_icon_type = null
	databaseManager.saveData()
	
	//show appropriate action graphic
	FORM_on_show()
	
	//update icon
	PREF_reset_icon()
}
}

/**
 *
 * @properties={typeid:24,uuid:"ED2FAE14-D664-45D8-89FD-9005F1CC3C21"}
 */
function ICON_upload()
{

/*
 *	TITLE    :	ICON_upload
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	import a new icon for use in the title toolbar and (not on mac) in the window frame header
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ICON_upload()
 *			  	
 *	MODIFIED :	October 1, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: put in some error if the file is the wrong type or too big

//show dialog for user to choose an icon
var file = plugins.file.showFileOpenDialog(1)

//if they chose a file, save it into the db
if (file) {
	//replace backslashes with slashes so windows or other filename and path are the same
	var qualifiedFileName = utils.stringReplace(file, "\\", "/")
	
	//set a variable to the file selected
	var icon = plugins.file.readFile(file)
	
	//get the filesize (in bytes)
	var iconSize = plugins.file.getFileSize(file)
	
	if (iconSize > 1 * (1024 * 1024)) {
		var proceed = plugins.dialogs.showQuestionDialog('Large file','The file selected is over 1 mb.  Continue?','Yes','No')
	}
	else {
		var proceed = 'Yes'
	}
	
	if (proceed == 'Yes') {
		//save down blob
		solution_icon_blob = icon
		solution_icon_size = iconSize
		
		//the title of the icon is the filename
		var fileName = 
		solution_icon = 
			qualifiedFileName.substr(qualifiedFileName.lastIndexOf("/")+1)
		
		//get information about the image
		var pictureTemp = plugins.images.getImage(icon)
		var width = pictureTemp.getWidth()
		var height = pictureTemp.getHeight()
		
		var iconType = pictureTemp.getContentType()
		
		//get extension
		var ext = fileName.split('.')
		//file has an extension
		if (ext && ext.length > 1) {
			var fileExt = ext[ext.length-1].toLowerCase()
		}
		//get extension from file type
		else if (iconType) {
			var fileExt = iconType.substr(iconType.lastIndexOf("/")+1).toLowerCase()
		}
		//no way to determine file type...easily :)
		else {
			var fileExt = '???'
		}
		solution_icon_type = fileExt
		
		/*
		//check for non-0 in the denominator
		if (height) {
			var ratio = width/height
			
			//image is landscape
			if (ratio > 1) {
				var wide = true
			}
			//image is portrait
			else {
				var wide = false
			}
			
			//create a small thumbnail of the image that is the same aspect ratio as the original
			if (wide) {
				thumbnail = pictureTemp.resize(200, (200*height)/width)
			}
			else {
				thumbnail = pictureTemp.resize((140*width)/height,140)
			}
		}
		*/
		
		//save data
		databaseManager.saveData()
		
		//set correct buttons to show
		FORM_on_show()
		
		//update icon
		PREF_reset_icon()
	}
}

}

/**
 *
 * @properties={typeid:24,uuid:"B57252B4-181A-4193-A7DA-67B19F7DF053"}
 */
function PREF_reset_icon()
{

/*
 *	TITLE    :	PREF_reset_icon
 *			  	
 *	MODULE   :	_ds_MGR_resource_manager
 *			  	
 *	ABOUT    :	updates interface with new icon
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	PREF_reset_icon()
 *			  	
 *	MODIFIED :	June 29, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

databaseManager.saveData()

//update title toolbar
if (forms.TOOL_title && forms.TOOL_title.FORM_on_show) {
	forms.TOOL_title.FORM_on_show(true)
}

//update frame
if (forms.DATASUTRA_0F_solution && forms.DATASUTRA_0F_solution.FRAME_rename) {
	forms.DATASUTRA_0F_solution.FRAME_rename()
}


}
