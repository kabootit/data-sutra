/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"2229C60A-70DC-4ED8-B561-A0D1A6347A73"}
 */
var _serverName = 'demo:8870'


/**
 * Over ride getting data into slick grid with a fallback to normal fs way.
 * 
 * @properties={typeid:24,uuid:"D660692F-28A3-4110-A7C6-99DA4FC78B75"}
 */
function SLICK_getData() {
	//use local file on troy's computer
	if (utils.stringPatternCount(plugins.sutra.getWorkspace(),'/Users/troj/Documents/Serclipse') != -1) {
		_serverName = 'ds:8081'
	}
	
	var data = plugins.http.getPageData('http://' + _serverName + '/img/sutra_example.tab')
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