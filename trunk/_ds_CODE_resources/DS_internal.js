/**
 * DS printing utilities
 *
 * @properties={typeid:35,uuid:"450C51CC-8042-4AF2-80D4-4C4D801FA43B",variableType:-4}
 */
var utils = new function() {
	/**
	 * Default location to store reports
	 * 
	 * @return {String} 
	 */
	this.getReportDir = function() {
		var allProps = plugins.sutra.getJavaProperties()
		for (var i = 0; i < allProps.length; i++) {
			var prop = allProps[i]
			if (prop[0] == 'catalina.base') {
				var serverInstall = prop[1]
				break
			}
		}
		
		return serverInstall + '/webapps/ROOT/ds/reports'
	}
	
	/**
	 * Default location to store reports
	 * 
	 * @return {String} 
	 */
	this.getUserDir = function() {
		var userDir = '/' + security.getClientID().replace(/-/g,'') + '/'
		
		//make sure user directory created
		var userTest = plugins.file.convertToJSFile(utils.getReportDir() + userDir)
		if (!userTest.exists()) {
			userTest.mkdirs()
		}
		
		return userDir
	}
}