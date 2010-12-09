/**
 *
 * @properties={typeid:24,uuid:"48e0ed61-d66a-4c62-9fc7-1adbe5363df2"}
 */
function CHOOSE_method()
{

/*
 *	TITLE    :	CHOOSE_method
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	retrieve a method and pass it off to be colored
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CHOOSE_method()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs && forms.NAV_0F_navigation_item_1F__button.module_filter) {
	databaseManager.saveData()
	
	//in order for this to work as expected, forms must be 'stacked' appropriately (viewed inside of other navigation forms)
	var formName = forms.NAV_0F_navigation_item_1F__button.form_to_load  
	var moduleName = forms.NAV_0F_navigation_item_1F__button.module_filter 
	
	//only run when using query based way to hit repository
	if (!solutionPrefs.repository.api) {
		var rootElementID = solutionPrefs.repository.allModules[moduleName].rootElementID
		var activeRelease = solutionPrefs.repository.allModules[moduleName].activeRelease
		var parentID = solutionPrefs.repository.allForms[moduleName][formName].elementID
		var methodName = method
		//remove () at end of method
		methodName = methodName.substr(0, methodName.length - 2) 
	
		var repositoryServer = 'repository_server'
		var maxReturnedRows = 10000
	
		// this is where we get the element_id (# rows returned is how many revisions there are)
		var query = "SELECT b.element_id FROM servoy_element_properties b, servoy_elements a " +
						"WHERE b.content_id = 137 AND b.element_id = a.element_id AND b.revision = a.revision " +
						"AND a.parent_element_id = ? AND property_value = ?"
		var args = [parentID,methodName]
		var dataset = databaseManager.getDataSetByQuery(repositoryServer, query, args, maxReturnedRows)
		
		var methodElementID = dataset.getValue(1,1)
		
		//if a valid method selected //MEMO: really hard to get this to be incorrect
		if (methodElementID) {
			// this is where we get the correct revision for a given release
			query = "SELECT revision FROM servoy_releases WHERE element_id = ? AND release_number = ?"
			args = new Array(methodElementID,activeRelease)
			dataset = databaseManager.getDataSetByQuery(repositoryServer, query, args, maxReturnedRows)
			
			var methodRevision = dataset.getValue(1,1)
			
			// this is where we get the method code (sequence reqd to put long methods in correct order)
			//TODO: 138 is deprecated; see 312 and 332
			query = "SELECT property_value FROM servoy_element_properties WHERE content_id = 138 " +
						"AND element_id = ? AND revision = ? " +
						"ORDER BY sequence ASC"
			args = new Array(methodElementID,methodRevision)
			dataset = databaseManager.getDataSetByQuery(repositoryServer, query, args, maxReturnedRows)
			
			//MEMO: more recent 'fresh' repositories do not put the value of a method into one field, but rather split it among several sequenced fields
			//concatenate all rows returned for full method text
			var methodArray = dataset.getColumnAsArray(1)
			var methodCode = ''
			for (var i = 0 ; i < methodArray.length ; i++) {
				methodCode += methodArray[i]
			}
			
			method_from_form = globals.CODE_color_method(methodCode)
		}
		else {
			//give error....or not
			method_from_form = null
		}
	}
	//get from the workspace
	else if (solutionPrefs.repository.workspace) {
		
		//5.x
		if (utils.stringToNumber(application.getVersion()) >= 5) {
			var startSearch = 'func' + 'tion ' + method
			var endSearch = '/*\n * @prop' + 'erties={'		//tano thinks i'm making a new method here, so split it up
			var methodName = method
			methodName = methodName.substr(0, methodName.length - 2) 
			
			var workspace = plugins.sutra.getWorkspace().substr(5)
			var modules = plugins.file.getFolderContents(workspace, null, 2)
			
			for (var i = 0; i < modules.length; i++) {
				var module = modules[i]	
				
				//we're on the selected module
				if (module.getName() == nav_action_item_to_navigation_item.module_filter) {
					
					var theForms = plugins.file.getFolderContents(module.getAbsolutePath() + '/forms', '.js', 1)
					
					//if this 'module' has forms with methods, proceed
					if (theForms.length) {
						
						//stop on the correct form
						for (var j = 0; j < theForms.length; j++) {
							var thisForm = theForms[j]
							var nameForm = thisForm.getName()
							nameForm = nameForm.substr(0, nameForm.length - 3) 
							
							//if on the correct form, get method
							if (nameForm == nav_action_item_to_navigation_item.form_to_load) {
							
								var allMethods = plugins.file.readTXTFile(thisForm)
								
								var lastMethod = allMethods.split('}\n */\nfunc' + 'tion ')
								
								//the last method in the javascript file is the one we are code coloring
								if (lastMethod[lastMethod.length - 1] && lastMethod[lastMethod.length - 1].substr(0,methodName.length) == methodName) {
									var regex = new RegExp('[\\s\\S]*?func' + 'tion ' + methodName + '\\([\\s\\S]*?\\{[\\s]*([\\s\\S]*?)', 'gm')
								}
								//any other non-last method
								else {
									var regex = new RegExp('[\\s\\S]*?func' + 'tion ' + methodName + '\\([\\s\\S]*?\\{[\\s]*([\\s\\S]*?)/\\*\\*\\n[\\s\\S]*', 'gm')
								}
									
								var theMethod = allMethods.replace(regex,'$1')
								
								if (theMethod) {
									
									//TODO: this post-processing should live in the regex...but I'm no guru there so I'll do it here
									var cnt = theMethod.length
									while (theMethod.charAt(cnt) != '}') {
										cnt--
									}
									//check for \n preceeding the }
									if (theMethod.charAt(cnt-1) == '\n') {
										cnt--
									}
									theMethod = theMethod.slice(0,cnt)
									
									theMethod = globals.CODE_color_method(theMethod)
								}
							}
						}
					}
				}
			}
		}
		//4.x		
		else {
			var startSearch = 'func' + 'tion ' + method
			var endSearch = '/*\n * @prop' + 'erties={'		//tano thinks i'm making a new method here, so split it up
			var methodName = method
			methodName = methodName.substr(0, methodName.length - 2) 
			
			var workspace = plugins.sutra.getWorkspace().substr(5)
			var modules = plugins.file.getFolderContents(workspace, null, 2)
			
			for (var i = 0; i < modules.length; i++) {
				var module = modules[i]	
				
				//we're on the selected module
				if (module.getName() == nav_action_item_to_navigation_item.module_filter) {
					
					var theForms = plugins.file.getFolderContents(module.getAbsolutePath() + '/forms', null, 2)
					
					//if this 'module' has forms, proceed
					if (theForms.length) {
						
						//stop on the correct form
						for (var j = 0; j < theForms.length; j++) {
							var thisForm = theForms[j]
							var nameForm = thisForm.getName()
							
							//if on the correct form, get method
							if (nameForm == nav_action_item_to_navigation_item.form_to_load) {
								var methodsJS = thisForm.getAbsolutePath() + '/' + nameForm + '_methods.js'
								var jsFile = plugins.file.convertToJSFile(methodsJS)
								
								//if this form has methods
								if (jsFile.exists()) {
									
									var allMethods = plugins.file.readTXTFile(methodsJS)
									
									var lastMethod = allMethods.split('}\n */\nfunc' + 'tion ')
									
									//the last method in the javascript file is the one we are code coloring
									if (lastMethod[lastMethod.length - 1] && lastMethod[lastMethod.length - 1].substr(0,methodName.length) == methodName) {
										var regex = new RegExp('[\\s\\S]*?func' + 'tion ' + methodName + '\\(\\)[\\s\\S]*?\\{[\\s]*([\\s\\S]*?)', 'gm')
									}
									//any other non-last method
									else {
										var regex = new RegExp('[\\s\\S]*?func' + 'tion ' + methodName + '\\(\\)[\\s\\S]*?\\{[\\s]*([\\s\\S]*?)/\\*\\*\\n \\* \\@prop' + 'erties=\\{[\\s\\S]*', 'gm')
									}
										
									var theMethod = allMethods.replace(regex,'$1')
									
									if (theMethod) {
										
										//TODO: this post-processing should live in the regex...but I'm no guru there so I'll do it here
										var cnt = theMethod.length
										while (theMethod.charAt(cnt) != '}') {
											cnt--
										}
										//check for \n preceeding the }
										if (theMethod.charAt(cnt-1) == '\n') {
											cnt--
										}
										theMethod = theMethod.slice(0,cnt)
										
										theMethod = globals.CODE_color_method(theMethod)
									}
								}
							}
						}
					}
				}
			}
		}
		
		if (theMethod) {
			method_from_form = theMethod
		}
		else {
			method_from_form = null
		}
	}
	else {
		plugins.dialogs.showErrorDialog('Repository API Error','API calls not yet implemented.  This feature is unavailable')
	}
}
else if (!forms.NAV_0F_navigation_item_1F__button.module_filter) {
	plugins.dialogs.showErrorDialog('Module Filter Error', 'You must select the correct module form filter for this to work', 'OK')
}
else {
	plugins.dialogs.showErrorDialog('Solution Prefs Error', 'This will not work outside of the container module.\nRe-open solution or reinstantiate code globals.', 'OK')
}

}

/**
 * @properties={typeid:24,uuid:"940319f4-d3b4-44c4-8786-a2c830e1f841"}
 */
function FORM_on_show()
{
}
