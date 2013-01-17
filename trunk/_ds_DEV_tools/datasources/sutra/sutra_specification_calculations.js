/**
 *
 * @properties={type:12,typeid:36,uuid:"443fc926-554c-4bf8-9a4e-1b278b0c54b9"}
 */
function display_file_action()
{


if (flag_file) {
	return '<html><head></head><body><img src="media:///arrow_round.png"></body></html>'
}
else {
	return '<html><head></head><body><img src="media:///spacer.gif"></body></html>'
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"038de177-a334-4e90-bca5-72e4c50e3382"}
 */
function display_file_available()
{


if (flag_file) {
	return '<html><head></head><body><img src="media:///element_media.png"></body></html>'
}
else {
	return null
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"8c41e5fd-cebb-46d9-96d2-414fe45222c2"}
 */
function display_thumbnail()
{


//if valid image type
if (file_ext.equalsIgnoreCase('pdf') || file_ext.equalsIgnoreCase('png') || file_ext.equalsIgnoreCase('jpg') || 
	file_ext.equalsIgnoreCase('jpeg') || file_ext.equalsIgnoreCase('gif') || file_ext.equalsIgnoreCase('bmp') || 
	file_ext.equalsIgnoreCase('pict') || file_ext.equalsIgnoreCase('tif') || file_ext.equalsIgnoreCase('tiff') 
	/* || file_ext.equalsIgnoreCase('' || file_ext.equalsIgnoreCase('' || file_ext.equalsIgnoreCase('' || 
	file_ext.equalsIgnoreCase('' || file_ext.equalsIgnoreCase('' || file_ext.equalsIgnoreCase('' || 
	file_ext.equalsIgnoreCase(''*/) {
	
	var serverName = dev_specification_to_navigation_item.getServerName()
	
	if (serverName) {
		var blobLoader =
		  	'media:///servoy_blobloader?servername=' + serverName + 
			'&tablename=' + 'sutra_specification' +
			'&dataprovider=file_thumb' +
			'&rowid1=' + id_specification +
			'&mimetype='+file_ext + 
			'&filename='+file_name 
		
		return '<img src="' + blobLoader + '">'
	}
}
//text file
else if (utils.stringPatternCount(file_type,'text')) {
	return file_text
}
//no preview available
else {
	return 'No preview for <strong>.' + file_ext + '</strong> files'
}


}

/**
 *
 * @properties={type:12,typeid:36,uuid:"44dd0a52-6f5e-4763-a6f3-0d4ff35da10b"}
 */
function file_size_human()
{


if (file_size) {
	var size = file_size/1024
	
	if (size < 1) {
		return '<1 KB'
	}
	else if (size < 1024) {
		return utils.numberFormat(size,'#,###.#') + " KB"
	}
	else if (size > 1024 && size < (1024 * 1024)) {
		return utils.numberFormat(size/1024,'#,###.#') + ' MB'
	}
	else {
		return utils.numberFormat(size/(1024 * 1024),'#,###.#') + ' GB'
	}
}
else {
	return null
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"c7d17cdf-b936-45f9-8d47-2882854d4cb5"}
 */
function file_type_human()
{


if (file_type) {
	return file_type
}
else if (file_ext) {
	return file_ext.toUpperCase()
}
else {
	return '???'
}
}

/**
 *
 * @properties={type:4,typeid:36,uuid:"f759c3d1-871a-4769-8bba-a27b5538625b"}
 */
function flag_file()
{

if (file_blob) {
	return 1
}
else {
	return null
}
}
