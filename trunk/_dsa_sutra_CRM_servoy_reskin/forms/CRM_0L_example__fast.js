
/**
 * Over ride getting data into slick grid with a fallback to normal fs way.
 * 
 * @properties={typeid:24,uuid:"D660692F-28A3-4110-A7C6-99DA4FC78B75"}
 */
function zSLICK_getData() {
	var data = plugins.http.getPageData('http://demo:8870/img/sutra_example.tab')
	if (data && data.length) {
		return JSON.parse(data)
	}
	else {
		return forms[controller.getName()].SLICK_getData()
	}
}

/**
 * @properties={typeid:24,uuid:"A225FD47-DF96-439C-9E66-F1644E9F37DD"}
 */
function SLICK_saveData() {
	var file = plugins.file.convertToRemoteJSFile('/opt/servoy-mosaic-demo/deployed/application_server/sotre.tab')
	return plugins.file.writeTXTFile(file,JSON.stringify(SLICK_getData(),null,'\t'))
}