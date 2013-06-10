/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"972592B3-0B0B-47D7-A674-BD6B309C9D5C",variableType:-4}
 */
var DS_web_login_running = false;

/**
 * @properties={typeid:35,uuid:"B35E0445-3ECA-4323-8C87-BF0E5E9DEAD4",variableType:-4}
 */
var CODE_continuation = null;

/**
 * @properties={typeid:35,uuid:"E2514F5F-B542-4B9E-9423-5AF5CD8C129D",variableType:-4}
 */
var CODE_continuation_value = null;

/**
 * @constructor
 *
 * @description Dialog module - https://www.servoyforge.net/projects/mod-dialog
 * @version 1.5.6
 *
 * Written by Robert J.C. Ivens and Paul Bakker
 * OS dependent button-reverse patch by Harjo Kompagnie
 * Many JSDoc (Servoy 6.0/6.1) fixes by Sanneke Aleman
 * RuntimeForm support in FIMD by Sanneke Aleman
 * 2012.Oct.14 Patch for form in dialog not creating proper form by Tom Parry
 *
 * @properties={typeid:35,uuid:"4C2A14AC-4C58-4A99-AACB-7D32D32CB0A4",variableType:-4}
 */
var DIALOGS = new function() {
	/**
	 * @type String
	 */
	var _sStyleSheet = 'ds_WEB_desktop';

	/**
	 * @type Number
	 */
	var _nDialogWidth = 500;

	/**
	 * @type Number
	 */
	var _nDialogHeight = 150;

	/*
	 * For every dialog shown a solutionModel clone of a dialogs_xxxx form is created, in order to be able to stack multiple dialogs
	 * In order to prevent a memory leak, the clones need to be cleaned up after use.
	 *
	 * Previous logic tried to accomplish this in the onHide event of the dialog i.c.w. the scheduler plugin,
	 * but this had it's flaws and required application.sleep(100) to work correctly, while also reducing the UX
	 *
	 * With the new logic the dialog calls back to markBluePrintsForCleanup() in it's onHide event.
	 * The markBluePrintsForCleanup() method stored the formName in the bluePrintStack
	 * When getting a new blueprint is requested, all clones are removed by looping through the bluePrintStack
	 */
	var bluePrintStack = []

	function markBluePrintsForCleanup(formName) {
		application.output('Marking form "' + formName + '" for cleanup', LOGGINGLEVEL.DEBUG);
		bluePrintStack.push(formName);
	}

	var terminator = (application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT ? new Continuation() : null);

	/**
	 * Method to terminate the current method execution after capturing a Continuation.
	 */
	function terminateCurrentMethodExecution() {
		terminator();
	}

	/**
	 * @private
	 *
	 * @param {String} _sFormName
	 * @param {String} _sBaseFormName
	 * @param {Number} _nWidth
	 * @param {Number} _nHeight
	 */
	function newFormBluePrint(_sFormName, _sBaseFormName, _nWidth, _nHeight) {
		//Cleanup of previously used blueprints
		/** @type {String} */
		var formName;
		for (var i = 0; i < bluePrintStack.length; i++) {
			formName = bluePrintStack[i];
			application.output('Cleaning up form "' + formName + '"', LOGGINGLEVEL.DEBUG);
			if (history.removeForm(formName)) {
				bluePrintStack.splice(i, 1);
				if (!solutionModel.removeForm(formName)) {
					application.output("Can't remove dialog form '" + formName + "'", LOGGINGLEVEL.ERROR);
				}
			} else {
				application.output("Can't remove dialog form '" + formName + "' from history", LOGGINGLEVEL.ERROR);
			}
		}

		//Create requested blueprint
		if (!forms[_sFormName]) {
			var base_form = solutionModel.getForm(_sBaseFormName);//tp assumes not null!
			var ds = base_form.dataSource;//tp
			var _oForm = solutionModel.newForm(_sFormName, ds, _sStyleSheet, false, _nWidth, _nHeight);
			_oForm.extendsForm = _sBaseFormName;

			//Store pointer to otherwise private method on the form, to be used when hiding the form
			forms[_sFormName]['bluePrintCleanupCallback'] = markBluePrintsForCleanup;
		} else {
			application.output("Form '" + _sFormName + "' already exists.", LOGGINGLEVEL.ERROR);
		}
	}

	/**
	 * @private
	 *
	 * @param {String|RuntimeForm} _sFormName
	 * @param {String} _sDlgType
	 * @param {Array} _aArguments
	 * @param {String} [_sIconStyle]
	 *
	 * @return {String}
	 */
	function showDialog(_sFormName, _sDlgType, _aArguments, _sIconStyle) {

		/** @type {Object} */
		var _aArgs = Array.prototype.slice.call(_aArguments),
			_nWidthPadding = 22,
			dialogWindow;
		var _sUniqueName = _aArgs[8] || utils.stringReplace(application.getUUID().toString(), "-", "");

		if (_aArgs[0] instanceof RuntimeForm) _aArgs[0] = _aArgs[0].controller.getName()

		if (_sDlgType == 'FIMD') {
			var win_name = "W_" + _sUniqueName;//tp
			dialogWindow = application.createWindow(win_name, JSWindow.MODAL_DIALOG);//tp
			dialogWindow.setLocation(_aArgs[1] || JSWindow.DEFAULT, _aArgs[2] || JSWindow.DEFAULT);//tp changed single | to double ||
			if (_aArgs[5]) {
				dialogWindow.title = _aArgs[5];
			} else {
				dialogWindow.title = solutionModel.getForm(_aArgs[0]).titleText
			}
			dialogWindow.resizable = (_aArgs[6] == null ? true : _aArgs[6]);
			dialogWindow.showTextToolbar(_aArgs[7] == null ? false : _aArgs[7]);
			forms[_aArgs[0]]['windowName'] = win_name;

			if (application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT) {
				var _nWidth = (_aArgs[3] == null || _aArgs[3] == JSWindow.DEFAULT) ? solutionModel.getForm(_aArgs[0]).width : _aArgs[3];
				var _nHeight = (_aArgs[4] == null || _aArgs[4] == JSWindow.DEFAULT) ? solutionModel.getForm(_aArgs[0]).getBodyPart().height : _aArgs[4];

				var _extended = 'X_' +  _sUniqueName;//tp
				newFormBluePrint(_extended, 'dialogs_fimd', _nWidth, _nHeight);//tp
				/** @type {RuntimeForm<dialogs_fimd>}*/
				var form = forms[_extended];//tp
				form.continuation = new Continuation(); // saves the current methodStack into variable x, so it can be continued later on
				form.windowName = win_name;//tp
				form.setupForm(_aArgs[0], _nWidth, _nHeight);

				// Need to add 22 pixels to the width with the original (built-in) servoy stylesheet or else you get scrollbars. You may want to adjust this value when you use a custom (override) stylesheet
				dialogWindow.setSize(_nWidth + _nWidthPadding, _nHeight);
				dialogWindow.show(form);
				terminateCurrentMethodExecution();
			} else {
				dialogWindow.setSize(_aArgs[3] || JSWindow.DEFAULT, _aArgs[4] || JSWindow.DEFAULT);
				dialogWindow.show(forms[_aArgs[0]]);
			}

		} else {
			if (application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT) {

				dialogWindow = application.createWindow(_sUniqueName, JSWindow.MODAL_DIALOG);
				dialogWindow.setInitialBounds(JSWindow.DEFAULT, JSWindow.DEFAULT, JSWindow.DEFAULT, JSWindow.DEFAULT);
				dialogWindow.title = _aArgs[0];

				dialogWindow.resizable = false;
				dialogWindow.showTextToolbar(false);

				newFormBluePrint(_sUniqueName, _sFormName, _nDialogWidth, _nDialogHeight);
				/** @type {RuntimeForm<dialogs_base>}*/
				var dialog = forms[_sUniqueName];
				dialog.continuation = new Continuation(); // saves the current methodStack into variable x, so it can be continued later on
				dialog.windowName = _sUniqueName;

				switch (_sDlgType) {
				case 'input':
					var _top = _aArgs[2];
					dialog.setupForm([_aArgs[1], i18n.getI18NMessage('servoy.button.ok'), i18n.getI18NMessage('servoy.button.cancel')], _sIconStyle, _top, _nDialogWidth, _nDialogHeight + 30);
					break;
				case 'select':
					dialog.setupForm([_aArgs[1], _aArgs[2], i18n.getI18NMessage('servoy.button.ok'), i18n.getI18NMessage('servoy.button.cancel')], _sIconStyle, _nDialogWidth, _nDialogHeight + 30);
					break;
				default:
					dialog.setupForm(_aArgs, _sIconStyle, _nDialogWidth, _nDialogHeight);
				}
				dialogWindow.show(dialog);

				terminateCurrentMethodExecution();

			} else if (application.getApplicationType() == APPLICATION_TYPES.SMART_CLIENT || application.getApplicationType() == APPLICATION_TYPES.RUNTIME_CLIENT) {

				// Turn the Arguments into a real Array
				/** @type {Array} */
				var _aArgArray = [].slice.call(_aArgs),
					_sReturnValue;

				// Process the array and make it in a string we can use in eval
				_aArgArray.forEach(parseArgumentList);

				switch (_sDlgType) {
				case 'warning':
					eval('_sReturnValue = plugins.dialogs.showWarningDialog(' + _aArgArray.join(",") + ' )');
					break;
				case 'error':
					eval('_sReturnValue = plugins.dialogs.showErrorDialog(' + _aArgArray.join(",") + ' )');
					break;
				case 'info':
					eval('_sReturnValue = plugins.dialogs.showInfoDialog(' + _aArgArray.join(",") + ' )');
					break;
				case 'question':
					eval('_sReturnValue = plugins.dialogs.showQuestionDialog(' + _aArgArray.join(",") + ' )');
					break;
				case 'input':
					eval('_sReturnValue = plugins.dialogs.showInputDialog(' + _aArgArray.join(",") + ' )');
					break;
				case 'select':
					eval('_sReturnValue = plugins.dialogs.showSelectDialog(' + _aArgArray.join(",") + ' )');
					break;
				}
				return _sReturnValue;

			}
		}

		/**
		 * @private
		 * @param {Object} _oValue
		 * @param {Number} _nIndex
		 * @param {Array} _aArray
		 */
		function parseArgumentList(_oValue, _nIndex, _aArray) {
			if (_oValue instanceof String) {
				/** @type {String} */
				var _sVal = _oValue;
				_aArray[_nIndex] = "'" + _sVal.replace(/\'/g, "\\'").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "'";
			} else if (_oValue instanceof Array) {
				/** @type {Array} */
				var _aVal = _oValue;
				_aArray[_nIndex] = "['" + _aVal.join("','") + "']";
			}
		}

		return null;
	}

	/**
	 * Set the stylesheet of the next dialog window
	 *
	 * @param {String} stylesheetName
	 */
	this.setStylesheet = function(stylesheetName) {
		_sStyleSheet = stylesheetName;
	}

	/**
	 * Set the width of the next dialog window
	 *
	 * @param {Number} width
	 */
	this.setDialogWidth = function(width) {
		// width may not be smaller than 100
		_nDialogWidth = (width < 100 ? 500 : width);
	}

	/**
	 * Set the height of the next dialog window
	 *
	 * @param {Number} height
	 */
	this.setDialogHeight = function(height) {
		// height may not be smaller than 100
		_nDialogHeight = (height < 100 ? 100 : height);
	}

	/**
	 * Reset the width/height of the next dialog window to the default values
	 */
	this.resetDialogSize = function() {
		_nDialogWidth = 500;
		_nDialogHeight = 150;
	}

	/**
	 * Get the version of the dialogs module
	 *
	 * @return {String}
	 */
	this.getVersion = function() {
		return '1.5.6';
	}

	/**
	 * Show an error dialog
	 *
	 * @param {String} title
	 * @param {String} message
	 * @param {...String} buttons
	 * @return {String}
	 */
	this.showErrorDialog = function(title, message, buttons) {
		return showDialog('dialogs_message', 'error', arguments, 'dialogs_icon_error');
	}

	/**
	 * Show a warning dialog
	 *
	 * @param {String} title
	 * @param {String} message
	 * @param {...String} buttons
	 * @return {String}
	 */
	this.showWarningDialog = function(title, message, buttons) {
		return showDialog('dialogs_message', 'warning', arguments, 'dialogs_icon_warning');
	}

	/**
	 * Show an info dialog
	 *
	 * @param {String} title
	 * @param {String} message
	 * @param {...String} buttons
	 * @return {String}
	 */
	this.showInfoDialog = function(title, message, buttons) {
		return showDialog('dialogs_message', 'info', arguments, 'dialogs_icon_info');
	}

	/**
	 * Show a question dialog
	 *
	 * @param {String} title
	 * @param {String} message
	 * @param {...String} buttons
	 * @return {String}
	 */
	this.showQuestionDialog = function(title, message, buttons) {
		return showDialog('dialogs_message', 'question', arguments, 'dialogs_icon_generic');
	}

	/**
	 * Show an input dialog
	 *
	 * @param {String} title
	 * @param {String} message
	 * @param {String} [initialValue]
	 * @return {String}
	 */
	this.showInputDialog = function(title, message, initialValue) {
		return showDialog('dialogs_input', 'input', arguments, 'dialogs_icon_generic');
	}

	/**
	 * Show a select dialog
	 *
	 * @param {String} title
	 * @param {String} message
	 * @param {...String|Array<String>} optionArray
	 * @return {String}
	 */
	this.showSelectDialog = function(title, message, optionArray) {
		return showDialog('dialogs_select', 'select', arguments, 'dialogs_icon_generic');
	}

	/**
	 * Show a Form In Modal Dialog
	 * @param {String|RuntimeForm} formName
	 * @param {Number} [left]
	 * @param {Number} [top]
	 * @param {Number} [width]
	 * @param {Number} [height]
	 * @param {String} [title]
	 * @param {Boolean} [resizable]
	 * @param {Boolean} [showTextToolbar]
	 * @param {String} [windowName]
	 */
	this.showFormInModalDialog = function(formName, left, top, width, height, title, resizable, showTextToolbar, windowName) {
		showDialog(null, 'FIMD', arguments);
	}
};

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"f30d47f9-1fbb-4c6c-abe4-fb8dd77c4c83"}
 */
var DATASUTRA_find = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"1e40b95d-c1f9-412e-af82-63b6e4b860f7"}
 */
var DATASUTRA_find_field = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"eee1d8a8-d004-43ff-b546-89ac718bfe9b"}
 */
var DATASUTRA_find_pretty = '';

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"E652B669-13C6-4D6F-A1FC-D9C32838DC5C",variableType:-4}
 */
var DS_web_cursor = false;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"830cf64e-5c88-4581-90ea-de8355fb5d08",variableType:4}
 */
var AC_current_group = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"9a2da13a-3f68-4adb-9372-0be5ab22fa21",variableType:4}
 */
var AC_current_organization = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2a06fde2-b4ec-4aee-bbc5-ae42a64d90af",variableType:4}
 */
var AC_current_staff = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"36968bfc-a7ae-4a48-bf13-89b9db2ca70a",variableType:4}
 */
var CODE_constant_1 = 1;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"0f826280-4af9-4738-a3eb-417d7e6510d8"}
 */
var CODE_ddarray_field = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"5161E97B-32BD-4147-A5B5-934EF03461E3"}
 */
var CODE_ddarray_sort = 'asc';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"1212d8f4-ea41-49b2-9bf7-be528a0b42a3",variableType:4}
 */
var CODE_hide_form = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"ed5f234f-6d84-4e88-9619-0f55d431ea33"}
 */
var CODE_text = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9d94760c-98ad-4b2d-bd75-021a7a87c5d0"}
 */
var consoleInput = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"22fe62e8-0e3c-4d34-84d2-96f15d50543b"}
 */
var consoleOutput = '';

/**
 * Set text and tooltip of fast find field.
 * 
 * @param	{String}	findText Text to display in the fast find field.
 * @param	{String}	[findTooltip] Tooltip to display on hover of the fast find field.
 * @param	{String}	[findCheck] Column name to check in the fast find field pop-up menu.
 * @param	{Boolean}	[setDefault=false] Fill default fast find value for this space
 *
 * @properties={typeid:24,uuid:"f329a2ea-8dbe-40fa-a8dd-75a01b623979"}
 */
function TRIGGER_fastfind_display_set(findText,findTooltip,findCheck,setDefault) {
	//solutionPrefs defined and frameworks not in a locked status
	if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {
	
		var findText = arguments[0]
		var findTooltip = arguments[1]
		var findCheck = arguments[2]
		var setDefault = arguments[3]
		var baseForm = solutionPrefs.config.formNameBase
		var currentNavItem = solutionPrefs.config.currentFormID
		
		if (findCheck == undefined) {
			findCheck = true
		}
		
		//reset fast find to whatever is supposed to be in there
		if (setDefault) {
			findText = ''
			findCheck = ''
			findTooltip = ''
			
			var findInitial = navigationPrefs.byNavItemID[currentNavItem].navigationItem.findDefault
			
			if (navigationPrefs.byNavItemID[currentNavItem].fastFind && navigationPrefs.byNavItemID[currentNavItem].fastFind.lastFindField) {
				findText = navigationPrefs.byNavItemID[currentNavItem].fastFind.lastFindValue
				findCheck = navigationPrefs.byNavItemID[currentNavItem].fastFind.lastFindField
				findTooltip = navigationPrefs.byNavItemID[currentNavItem].fastFind.lastFindTip
			}
			else if (findInitial) {
				findCheck = findInitial
				
				//get pretty name for chosen column
				var prettyFind = navigationPrefs.byNavItemID[currentNavItem].fastFind.filter(function(item){return item.columnName == findInitial})
				if (prettyFind.length) {
					findTooltip = 'Searching in "' + prettyFind[0].findName + '"'
				}
			}
		}
		
		//set text in fast find area
		DATASUTRA_find = findText
		
		//only show stop button if a message is passed
		if (findText) {
			//show stop button
		//	forms[solutionPrefs.config.formNameBase].elements.find_end.setImageURL('media:///find_stop.png')
		}
		//set check to appear next to column which was filtered
		if (findCheck && findCheck != true) {
			DATASUTRA_find_field = findCheck
		}
		//set check to appear next to 'Filter applied...'
		else if (findCheck) {
			DATASUTRA_find_field = 'Filtered'
		}
		//set check to some weird value so nothing will be checked
		//MEMO: do not set to null because then it will be set to 'Show all' by default
		else if (!findCheck) {
			DATASUTRA_find_field = 'NuttinHoney'
		}
		
		//save down values of last 'find'
		if (application.__parent__.solutionPrefs) {
			var formName = solutionPrefs.config.currentFormName
			var serverName = forms[formName].controller.getServerName()
			var tableName = forms[formName].controller.getTableName()
			
			//add server name if not already
			if (!solutionPrefs.fastFind.currentSearch[serverName]) {
				solutionPrefs.fastFind.currentSearch[serverName] = new Object()
			}
			//add table name if not already
			if (!solutionPrefs.fastFind.currentSearch[serverName][tableName]) {
				solutionPrefs.fastFind.currentSearch[serverName][tableName] = new Object()
			}
			//only run when data is available
			if (solutionPrefs.repository && solutionPrefs.repository.allFormsByTable && 
				solutionPrefs.repository.allFormsByTable[serverName] && 
				solutionPrefs.repository.allFormsByTable[serverName][tableName] && 
				solutionPrefs.repository.allFormsByTable[serverName][tableName][formName]) {
			
				//check if not using separateFoundset
				if (!solutionPrefs.repository.allFormsByTable[serverName][tableName][formName].useSeparateFoundset) {
					solutionPrefs.fastFind.currentSearch[serverName][tableName].lastFindValue = findText
					solutionPrefs.fastFind.currentSearch[serverName][tableName].lastFindField = (findCheck && findCheck != true) ? findCheck : null
					solutionPrefs.fastFind.currentSearch[serverName][tableName].lastFindTip = findTooltip
				}
			}
			
			//fast find is enabled, track
			if (navigationPrefs.byNavItemID[currentNavItem].fastFind) {
				navigationPrefs.byNavItemID[currentNavItem].fastFind.lastFindValue = findText
				navigationPrefs.byNavItemID[currentNavItem].fastFind.lastFindField = (findCheck && findCheck != true) ? findCheck : null
				navigationPrefs.byNavItemID[currentNavItem].fastFind.lastFindTip = findTooltip
				
				//in web client, update placeholder text to be field currently searching on
				var findField = navigationPrefs.byNavItemID[currentNavItem].fastFind.lastFindField || DATASUTRA_find_field
				var findSelected = navigationPrefs.byNavItemID[currentNavItem].fastFind.filter(function (item) {return (item.relation != 'NONE' ? item.relation + '.' + item.columnName : item.columnName) == findField})
				var findPretty = findSelected.length ? findSelected[0].findName : findField
				scopes.DS.webFindSet(findPretty)
			}
		}
		
		//set tooltip if provided
		if (findTooltip != null) {
			var findForm = (solutionPrefs.config.webClient) ? 'NAV_T_universal_list__WEB__fastfind' : baseForm + '__header__fastfind'
			
			forms[findForm].elements.fld_find.toolTipText = (solutionPrefs.config.webClient) ? null : findTooltip
		}
	}
}

/**
 * Override/Revert fast find options for selected navigation item.
 * 
 * @param	{Object[]|Boolean}	findOverride Items describing fast find possibilities. A value of false reverts to default fast find.
 * @param	{String}	[findOverride.searchForm] Overrides the form where a find begins.
 * @param	{Number}	[itemID] The navigation item whose fast find is changed.
 *
 * @example
 * 
 *	var findOV = new Array()
 *	
 *	//item 1: a sample
 *	findOV.push({
 *			//the name displayed in the fast find dropdown
 *			findName	: 'Display name',
 *			//type of column as reported from JSColumn.getTypeAsString()
 *			columnType	: 'TEXT',
 *			//name of the column in the backend
 *			columnName	: 'column_name',
 *			//relation(s) to above column
 *				//MEMO: if no relation, specify 'NONE'
 *			relation	: 'relation_name' || 'NONE',
 *			//valuelist to convert actual value in column to display value
 *			valuelist	: 'valuelist_name',
 *			//used in concert with valuelist; forces valuelist picker to display as a typeahead field instead of depending on number of elements in the value list
 *			typeahead	: 1,
 *			//displays more info about what the fast find item actually is
 *			toolTip		: 'ToolTip displayed when fast find item hovered over'
 *		})
 *	
 *	//where do we want to find on it (only needed if searching not on the main form)
 *	findOV.searchForm = 'my_form'
 *	
 *	//if record searched for that is filtered from view, allow to view it
 *	findOV.lenient = true
 *	
 *	//override fast find
 *	globals.TRIGGER_fastfind_override(findOV)
 * 
 * @example
 * 
 * 	//reset fast find to default (undoes a previous fastfind override)
 * 	globals.TRIGGER_fastfind_override(false)
 * 	
 * @properties={typeid:24,uuid:"1544c9a7-7107-4c73-8d7e-eb00586dc023"}
 */
function TRIGGER_fastfind_override(findOverride,itemID) {
	//solutionPrefs defined and frameworks not in a locked status
	if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {
	
		var findOverride = arguments[0]
		var itemID = arguments[1] || solutionPrefs.config.currentFormID
		
		var baseForm = solutionPrefs.config.formNameBase
		
		if (itemID && navigationPrefs.byNavItemID[itemID]) {
			var thisNav = navigationPrefs.byNavItemID[itemID]
			
			//find override present, override
			if (findOverride) {
				//punch default for this form down (so can roll back)
				if (!thisNav.fastFindInitial) {
					thisNav.fastFindInitial = CODE_copy_object(thisNav.fastFind)
				}
				
				//there are find items to search on
				if (findOverride.length) {
					thisNav.fastFind = findOverride
				}
				//nothing configured, but lenient mode enabled
				else if (findOverride.lenient) {
					thisNav.fastFind.lenient = true
				}
			}
			//revert to default
			else {
				if (thisNav.fastFindInitial) {
					thisNav.fastFind = CODE_copy_object(thisNav.fastFindInitial)
				}
			}
		}
	}
}

/**
 * Leave feedback in the developer feedback area.
 * 
 * @param	{String}	issue A concise name for the feedback.
 * @param	{String}	description More precise details regarding the feedback.
 * @param	{Boolean}	[screenshot=false] Take a snapshot of the main Servoy window at the time feedback is created.
 *
 * @properties={typeid:24,uuid:"c140d3ca-3af7-4bfd-871a-a601f7af59e8"}
 */
function TRIGGER_feedback_create(issue,description,screenshot) {

	var issue = arguments[0]
	var detail = arguments[1]
	var screenshot = arguments[2]
	
	//any arguments given, run method
	if (issue || detail || screenshot) {
		//get foundset
		/** @type {JSFoundSet<db:/sutra/sutra_feedback>}*/
		var fsFeedback = databaseManager.getFoundSet('sutra','sutra_feedback')
		var record = fsFeedback.getRecord(fsFeedback.newRecord(false,true))
		
		record.feedback_status = 'Pending'
		record.id_log = solutionPrefs.clientInfo.logID
		record.id_navigation = DATASUTRA_navigation_set
		record.id_navigation_item = solutionPrefs.config.currentFormID
		record.feedback_issue = issue
		record.feedback_summary = detail
		
		if (screenshot) {
			//get screensize of window
			var x = application.getWindowX()
			var y = application.getWindowY()
			var width = application.getWindowWidth()
			var height =  application.getWindowHeight()
			
			//get screenshot
			var screenShot = (new java.awt.Robot()).createScreenCapture(new java.awt.Rectangle(x,y,width,height))
			var rawData = new java.io.ByteArrayOutputStream()
			Packages.javax.imageio.ImageIO.write(screenShot,'png',rawData)
			
			record.feedback_screenshot = rawData.toByteArray()
		}
		
		if (solutionPrefs.access && solutionPrefs.access.userName) {
			record.feedback_author = solutionPrefs.access.userName
		}
	
		databaseManager.saveData(record)
	}
}

/**
 * Sets the window title and/or icon for specified window.
 * 
 * @param	{String}	windowTitle New title for window.
 * @param	{String}	windowIcon Image to use for icon. Can be url from Servoy media library ("media:///my_image.gif").
 * @param	{String}	[frameName=<top level servoy window>] Name of window to operate on.
 *
 * @properties={typeid:24,uuid:"fc168413-17ed-4d6a-b0b3-7a69b8674f9e"}
 */
function TRIGGER_frame_title_set(windowTitle, windowIcon, frameName) {
	var windowTitle = arguments[0]
	var windowIcon = arguments[1]
	var frameName = arguments[2]
	var callingForm = application.getMethodTriggerFormName()
	
	//check if in developer or client
	if (application.__parent__.solutionPrefs && solutionPrefs.clientInfo && (solutionPrefs.clientInfo.typeServoy == 'client' || solutionPrefs.clientInfo.typeServoy == 'developer')) {
		//all frames in use
		var allFrames = Packages.java.awt.Frame.getFrames()
		
		//find frame to operate on
		if (frameName) {
			
		}
		//use top level servoy window
		else {
			var frame = Packages.java.awt.Frame.getFrames()[0]
		}
		
		//set new window title
		if (windowTitle) {
			frame.setTitle(windowTitle)
		}
		
		//set new window icon
		if (windowIcon) {
			//image coming from media library
			if (utils.stringPatternCount(windowIcon,'media:///')) {
				var iconImage = new Packages.javax.swing.ImageIcon(new Packages.java.net.URL(windowIcon)).getImage()
			}
			//top-level window hack
			else if (callingForm == solutionPrefs.config.formNameBase) {
				var iconImage = new Packages.javax.swing.ImageIcon(windowIcon).getImage()
			}
			//image on disk someplace
			else {/*
				try  (
					new Packages.javax.swing.ImageIcon(windowIcon).getImage()
					//var iconImage = new Packages.java.awt.Toolkit.getDefaultToolkit().getImage(windowIcon)
				)
				catch {}
				*/
			}
			
			if (iconImage) {
				frame.setIconImage(iconImage)
			}
		}
	}
}

/**
 * Navigates to a registered form (navigation item) from within inline help.
 * 
 * @param	{Number}	itemID Registry of navigation_item to jump to.
 * @param	{Boolean}	[confirmJump] Prompt to leave current location.
 * @param	{String}	[subLanding] Sub tab panel and tab to show on arrival.
 * @param	{Boolean}	[showHelp] Show related help on arrival.
 *
 * @properties={typeid:24,uuid:"7e1bda42-9f42-4736-a207-4b324e59ec3c"}
 */
function TRIGGER_help_navigation_set(itemID, confirmJump, subLanding, showHelp) {
//TODO: check to see if group is allowed to navigate here
	
	//solutionPrefs defined and frameworks not in a locked status
	if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {
	
		var itemID = arguments[0]
		var confirm = arguments[1]
		var subLanding = arguments[2]
		var showHelp = arguments[3]
		
		var baseForm = solutionPrefs.config.formNameBase
		
	/*	var subLanding = {
						form: ,			//name of form
						tabPanel: , 	//tab panel on form
						tabNumber: ,	//tab number of tab panel
						pseudo: true,	//pseudo record navigator (form is this pseudo nav...)
						action: 		//name of method on pseudo-form
					}
		var showHelp = {
						form: ,			//name of form
						tabPanel: , 	//tab panel on form
						element: 		//name of element with tooltip to trigger
					}
	*/
		
		//loop through all available items until the specified one found (will find first occurrence)
		var navItemID = false
		for (var i in navigationPrefs.byNavItemID) {
			if (!navItemID && navigationPrefs.byNavItemID[i].navigationItem.itemId == itemID) {
				navItemID = i
			}
		}
		
		//selected navigation item is available for this user
		if (navItemID) {
			//confirm to leave current location
			if (confirm) {
				var proceed = DIALOGS.showQuestionDialog(
									'Navigate away',
									'If you continue, you will leave the screen you are currently viewing',
									'Yes',
									'No'
								)
			}
			else {
				var proceed = 'Yes'
			}
			
			if (proceed == 'Yes') {
				//close the opened help dialog box
				forms.CODE_P__konsole.ACTION_close()
				
				var navSetID = navigationPrefs.byNavItemID[navItemID].navigationItem.idNavigation
				var formNameWorkflow = navigationPrefs.byNavItemID[navItemID].navigationItem.formToLoad
				
				var lastitem = solutionPrefs.config.currentFormID
				
				//redraw list; make sure row is expanded if node2; load new item
				forms.NAV__navigation_tree__rows.LIST_expand_collapse(null,navItemID,'open',navSetID)
				
				//if from a different navigation set
				if (DATASUTRA_navigation_set != navSetID) {
					navigationPrefs.byNavSetID[DATASUTRA_navigation_set].lastNavItem = lastItem
					DATASUTRA_navigation_set = navSetID
					
					var navigationList = (solutionPrefs.config.webClient) ? 'NAV__navigation_tree__WEB' : 'NAV__navigation_tree'
					forms[navigationList].LABEL_update()
				}
				
				//move around to land on correct spot of this form
				if (subLanding) {
					//quasi-record navigator
					if (subLanding.pseudo &&
						subLanding.form && forms[subLanding.form] && subLanding.action && forms[subLanding.form][subLanding.action]) {
						
						//get there
						forms[subLanding.form][subLanding.action]()
						
						//set tab
						if (forms[baseForm].elements.tab_content_C.getTabFormNameAt(1)) {
							subLanding.form = forms[baseForm].elements.tab_content_C.getTabFormNameAt(1)
						}
					}
					
					
				}
				
				//pop-up help screen for selected element
				if (showHelp) {
					TRIGGER_tooltip_help_popup(showHelp.form,showHelp.element,showHelp.tabPanel)
				}
			}
		}
		else {
			DIALOGS.showErrorDialog(
					'Destination error',
					'The landing destination is not available.  See the administrator'
				)
			return false
		}
	}
}

/**
 * Disables all data sutra related actions.
 * 
 * @param	{Boolean}	freeze Freezes/Unfreezes everything except the main workflow area.
 * @param	{Boolean}	[freezeAll] Freezes the workflow area too.
 * @param	{Boolean}	[nonTransparent] Turn off transparency so stuff frozen also invisible.
 * @param	{Boolean}	[spinner] Put facebook spinner in center of screen.
 * @param	{String}	[nonTransparentText] Text to display over top of non-transparent box.
 * @param	{Boolean}	[oldMode] Use old mode of changing element properties instead of image overlay.
 *
 * @properties={typeid:24,uuid:"8a2db575-a9de-4646-9936-14468a01d7f4"}
 */
function TRIGGER_interface_lock(freeze,freezeAll,nonTransparent,spinner,nonTransparentText,oldMode) {
//TODO:
		//trap the state of everything on the workflow form and set it back as it was before being enabled/disabled when running in oldMode
	
	var freeze = arguments[0]
	var freezeAll = arguments[1]
	var nonTransparent = arguments[2]
	var spinner = arguments[3]
	var nonTransparentText = arguments[4]
	var oldMode = arguments[5]
	
	//check to see that solutionPrefs is defined and parameter passed
	if (application.__parent__.solutionPrefs && typeof freeze == 'boolean') {
		var baseForm = solutionPrefs.config.formNameBase
		var workflowForm = solutionPrefs.config.currentFormName
		
		var lockWorkflow = false
		var lockList = true
		var lockNavigation = true
		
		//web client	only implements freeze for now
		if (solutionPrefs.config.webClient) {
			forms.DATASUTRA_WEB_0F__main.elements.gfx_curtain.visible = freeze
			forms.DATASUTRA__sidebar.elements.gfx_curtain.visible = freeze
			
			//adjust z-index
				//MEMO: this doesn't fire the first time edit button pressed after page loaded; client-side triggered when button clicked to handle this condition
			plugins.WebClientUtils.executeClientSideJS('triggerInterfaceLock(' + freeze + ');')
		}
		//smart client
		else {
			//MEMO: 44 is offset for normal header
			var divider = 8
			
			//all gfx
			var gfxTop = forms[baseForm].elements.gfx_curtain_top
			var gfxLeftOne = forms[baseForm].elements.gfx_curtain_left_1
			var gfxLeftTwo = forms[baseForm].elements.gfx_curtain_left_2
			var gfxLeftRight = forms[baseForm].elements.gfx_curtain_leftright
			var gfxRightOne = forms[baseForm].elements.gfx_curtain_right_1
			var gfxRightTwo = forms[baseForm].elements.gfx_curtain_right_2
			var gfxCurtain = forms[baseForm].elements.gfx_curtain
			
			//turn everything off
			forms[baseForm].elements.gfx_curtain_header.visible = false
			gfxTop.visible = false
			gfxLeftOne.visible = false
			gfxLeftTwo.visible = false
			gfxLeftRight.visible = false
			gfxRightOne.visible = false
			gfxRightTwo.visible = false
			gfxCurtain.visible = false
			
			//return curtain to default state
			gfxCurtain.text = null
			gfxCurtain.transparent = true
			gfxCurtain.setImageURL('media:///curtain_5E6166.png')
			gfxCurtain.setBorder('EmptyBorder,0,0,0,0')
			gfxCurtain.text = null
			gfxCurtain.toolTipText = null
			
			//graphic 1
			var x = 0
			var y = 44
			var gfx1 = gfxCurtain
			
			//graphic 2
			var x2 = 0
			var y2 = 44
			var gfx2 = gfxLeftOne
			
			//graphic 3
			var x3 = 0
			var y3 = 44
			var gfx3 = gfxTop
			
			//if in design mode....
			if (solutionPrefs.design.statusDesign) {
				//height of design mode bar
				y += 42
				y2 += 42
				y3 += 42
			}
			
			//figure out location of curtain
			switch (solutionPrefs.config.activeSpace) {
				case 'standard':
					x += solutionPrefs.screenAttrib.spaces.standard.currentHorizontal
					y2 += solutionPrefs.screenAttrib.spaces.standard.currentVertical
					
					if (solutionPrefs.config.flexibleSpace) {
						x += divider
						y2 += divider
					}
					break
				case 'standard flip':
					x += solutionPrefs.screenAttrib.spaces.standard.currentHorizontal
					y3 += solutionPrefs.screenAttrib.spaces.standard.currentVertical
					
					if (solutionPrefs.config.flexibleSpace) {
						x += divider
						y3 += divider
					}
					
					gfx2 = gfxTop
					gfx3 = gfxLeftOne
					break
					
				case 'list':
					x += solutionPrefs.screenAttrib.spaces.list.currentHorizontal
					
					if (solutionPrefs.config.flexibleSpace) {
						x += divider
					}
					
					var nonNavigation = true
					break
				
				case 'list flip':
					x += solutionPrefs.screenAttrib.spaces.list.currentHorizontal
					
					if (solutionPrefs.config.flexibleSpace) {
						x += divider
					}
					
					var nonList = true
					
					gfx3 = gfxLeftOne
					break
					
				case 'vertical':
					x += solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne + solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo
					x2 += solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne
					
					if (solutionPrefs.config.flexibleSpace) {
						x += divider
						x2 += divider
					}
					
					gfx3 = gfxLeftTwo
					break
				case 'vertical flip':
					x += solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne + solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalTwo
					x3 += solutionPrefs.screenAttrib.spaces.vertical.currentHorizontalOne
					
					if (solutionPrefs.config.flexibleSpace) {
						x += divider
						x3 += divider
					}
					
					gfx2 = gfxLeftTwo
					gfx3 = gfxLeftOne
					break
					
				case 'centered':
					x += solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne
					x2 += application.getWindowWidth(null) - solutionPrefs.screenAttrib.spaces.centered.currentHorizontalTwo
					
					if (solutionPrefs.screenAttrib.sidebar.status) {
						x2 -= solutionPrefs.screenAttrib.sidebar.currentSize
					}
					
					if (solutionPrefs.config.flexibleSpace) {
						x += divider
						x2 += divider
					}
					
					gfx2 = gfxRightOne
					gfx3 = gfxLeftOne
					break
				case 'centered flip':
					x += solutionPrefs.screenAttrib.spaces.centered.currentHorizontalOne
					x3 += application.getWindowWidth(null) - solutionPrefs.screenAttrib.spaces.centered.currentHorizontalTwo
					
					if (solutionPrefs.screenAttrib.sidebar.status) {
						x3 -= solutionPrefs.screenAttrib.sidebar.currentSize
					}
					
					if (solutionPrefs.config.flexibleSpace) {
						x += divider
						x3 += divider
					}
					
					gfx3 = gfxRightOne
					break
					
				case 'classic':
					x += solutionPrefs.screenAttrib.spaces.classic.currentHorizontal
					x2 += solutionPrefs.screenAttrib.spaces.classic.currentHorizontal
					y += solutionPrefs.screenAttrib.spaces.classic.currentVertical
					
					if (solutionPrefs.config.flexibleSpace) {
						x += divider
						x2 += divider
						y += divider
					}
					
					gfx2 = gfxLeftRight
					gfx3 = gfxLeftOne
					break
				case 'classic flip':
					x += solutionPrefs.screenAttrib.spaces.classic.currentHorizontal
					x3 += solutionPrefs.screenAttrib.spaces.classic.currentHorizontal
					y += solutionPrefs.screenAttrib.spaces.classic.currentVertical
					
					if (solutionPrefs.config.flexibleSpace) {
						x += divider
						x3 += divider
						y += divider
					}
					
					gfx2 = gfxLeftOne
					gfx3 = gfxLeftRight
					break
					
				case 'wide':
					x2 += solutionPrefs.screenAttrib.spaces.wide.currentHorizontal
					y += solutionPrefs.screenAttrib.spaces.wide.currentVertical
					
					if (solutionPrefs.config.flexibleSpace) {
						x2 += divider
						y += divider
					}
					
					gfx2 = gfxLeftRight
					gfx3 = gfxTop
					break
				case 'wide flip':
					x3 += solutionPrefs.screenAttrib.spaces.wide.currentHorizontal
					y += solutionPrefs.screenAttrib.spaces.wide.currentVertical
					
					if (solutionPrefs.config.flexibleSpace) {
						x3 += divider
						y += divider
					}
					
					gfx2 = gfxTop
					gfx3 = gfxLeftRight
					break
					
				case 'workflow':
					if (solutionPrefs.config.activeSpace == 'workflow') {
						var nonList = true
						var nonNavigation = true
					}
					break
					
				case 'workflow flip':
					if (!lockList) {
						var nonList = true
					}
					var nonNavigation = true
					break
			}
			
			//set up spinner to show progress
			if (spinner) {
	//			forms[baseForm].elements.gfx_spinner.setSize(application.getWindowWidth(),32)
	//			forms[baseForm].elements.gfx_spinner.setLocation((application.getWindowWidth() / 2) - 16, (application.getWindowHeight() / 2) - 200)
				forms[baseForm].elements.gfx_spinner.visible = true
			}
			else {
				forms[baseForm].elements.gfx_spinner.visible = false
			}
			
			//resize curtain to cover everything and then show it
			if (freezeAll) {
				//height of normal header (44)
				var y = 0
				
				//if in design mode....
				if (solutionPrefs.design.statusDesign) {
					//height of design mode bar
					y += 42
					
					var designBar = 'DEV_0F_solution__designbar'
					
					//design bar form exists, go exploring
					if (forms[designBar]) {
						//turn off everything
						forms[designBar].controller.enabled = false
						
						//active tab
						var designTab = forms[designBar].elements.tab_action.getTabFormNameAt(forms[designBar].elements.tab_action.tabIndex)
						
						//light background in main design bar
						if (forms[designBar].elements.gfx_header) {
							forms[designBar].elements.gfx_header.enabled = true
						}
						
						//highlighter in main design bar
						if (forms[designBar].elements.highlighter) {
							forms[designBar].elements.highlighter.enabled = true
						}
						
						//design bar action form exists, go exploring
						if (forms[designTab]) {
							//light background in main design bar
							if (forms[designTab].elements.gfx_header) {
								forms[designTab].elements.gfx_header.enabled = true
							}
							
							//highlighter in main design bar
							if (forms[designTab].elements.highlighter) {
								forms[designTab].elements.highlighter.enabled = true
							}
						}
					}
					
					//just turn off the second curtain so don't get double effect
					forms[baseForm].elements.gfx_curtain_2.visible = false
				}
				
				//set location
				forms[baseForm].elements.gfx_curtain.setLocation(0,y)
				//set size
				forms[baseForm].elements.gfx_curtain.setSize(application.getWindowWidth(),application.getWindowHeight())
				
				//non-transparent, set up
				if (nonTransparent) {
					forms[baseForm].elements.gfx_curtain.transparent = false
					forms[baseForm].elements.gfx_curtain.setImageURL(null)
					forms[baseForm].elements.gfx_curtain.setBorder('MatteBorder,0,0,200,0,#323A4B')
					
					//set text
					if (nonTransparentText) {
						forms[baseForm].elements.gfx_curtain.text = nonTransparentText
					}
				}
				
				forms[baseForm].elements.gfx_curtain.enabled = true
				forms[baseForm].elements.gfx_curtain.visible = true
			}
			//lock everything
			else if (freeze) {
				//prefer to modify the status of elements
				if (oldMode) {
					//turn off everything
					forms[baseForm].controller.enabled = false
					
					//turn on grafx stuff
						//header/footer
						forms[baseForm + '__header'].elements.gfx_header.enabled = true
						forms[baseForm + '__footer'].elements.gfx_footer.enabled = true
						
						//check content panels for subheader element
						var tabPanels = ['A','B','C','D']
						for (var i = 0; i < tabPanels.length; i++) {
							var tabPanel = 'tab_content_' + tabPanels[i]
							
							//there is a form in this tab panel
							if (forms[baseForm].elements[tabPanel].tabIndex) {
								var formName = forms[baseForm].elements[tabPanel].getTabFormNameAt(forms[baseForm].elements[tabPanel].tabIndex)
								
								//if a subheader present, turn it on
								if (forms[formName] && forms[formName].elements.gfx_subheader) {
									forms[formName].elements.gfx_subheader.enabled = true
								}
							}
						}
						
						//check active toolbar for background elements
						if (forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex) {
							var formName = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.getTabFormNameAt(forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex)
							
							//if toolbar background graphics present, turn them on
							if (forms[formName].elements.gfx_tool_left) {
								forms[formName].elements.gfx_tool_left.enabled = true
							}
							if (forms[formName].elements.gfx_tool_center) {
								forms[formName].elements.gfx_tool_center.enabled = true
							}
							if (forms[formName].elements.gfx_tool_right) {
								forms[formName].elements.gfx_tool_right.enabled = true
							}
						}
					
					//set space borders to light color
					var borderDisabled = 'MatteBorder,0,0,0,1,#797778'
					for (var i = 1; i <= 14 && ((i== 1 || i == 8) ? i++ : i); i++) {
						forms[baseForm + '__header'].elements['btn_space_' + i].setBorder(borderDisabled)
					}
					
					//turn on workflow form
					forms[workflowForm].controller.enabled = true
				}
				//show graphics positioned appropriately
				else {
				//HEADER CURTAIN
					if (true) {
						forms[baseForm].elements.gfx_curtain_header.setLocation(0,0)
						forms[baseForm].elements.gfx_curtain_header.setSize(application.getWindowWidth(null),44)
						forms[baseForm].elements.gfx_curtain_header.visible = true
					}
					else {
						//turn off curtain
						forms[baseForm].elements.gfx_curtain_header.visible = false
					}
					
				//CURTAIN ONE
					if (lockWorkflow && solutionPrefs.config.activeSpace != 'workflow flip') {
						//set location
						gfx1.setLocation(x,y)
						//set size
						gfx1.setSize(
									forms[baseForm].elements.tab_content_C.getWidth(),
									forms[baseForm].elements.tab_content_C.getHeight()
								)
						
						//turn on curtain
						gfx1.visible = true
					}
					
				//CURTAIN TWO
					if (lockList && !nonList) {
						//set location
						gfx2.setLocation(x2,y2)
						//set size
						gfx2.setSize(
									forms[baseForm].elements.tab_content_B.getWidth(),
									forms[baseForm].elements.tab_content_B.getHeight()
								)
						
						//turn on curtain
						gfx2.visible = true
					}
				
				//CURTAIN THREE
					if (lockNavigation && !nonNavigation) {
						//set location
						gfx3.setLocation(x3,y3)
						//set size
						gfx3.setSize(
									forms[baseForm].elements.tab_content_A.getWidth(),
									forms[baseForm].elements.tab_content_A.getHeight()
								)
						
						//turn on curtain
						gfx3.visible = true
					}
					
				//CURTAIN SIDEBAR
					if (freeze && solutionPrefs.screenAttrib.sidebar.status) {
						//set location
						gfxRightTwo.setLocation(
									forms[baseForm].elements.tab_content_D.getLocationX(),
									forms[baseForm].elements.tab_content_D.getLocationY() + 44
								)
						//set size
						gfxRightTwo.setSize(
									forms[baseForm].elements.tab_content_D.getWidth(),
									forms[baseForm].elements.tab_content_D.getHeight() - 44
								)
						
						//turn on curtain
						gfxRightTwo.visible = true
					}
				}
			}
			//unlock everything
			else {
				//prefer to modify the status of elements
				if (oldMode) {
					//turn on everything
					forms[baseForm].controller.enabled = true
					
					//turn off curtain
					if (forms[baseForm].elements.gfx_curtain.visible) {
						forms[baseForm].elements.gfx_curtain.visible = false
					}	
	//				//return curtain to default state
	//				forms[baseForm].elements.gfx_curtain.transparent = true
	//				forms[baseForm].elements.gfx_curtain.setImageURL('media:///curtain_5E6166.png')
	//				forms[baseForm].elements.gfx_curtain.setBorder('EmptyBorder,0,0,0,0')
	//				
	//				forms[baseForm].elements.gfx_curtain.text = null
	//				forms[baseForm].elements.gfx_curtain.toolTipText = null
					
					//turn off curtain3
					if (forms[baseForm].elements.gfx_spinner.visible) {
						forms[baseForm].elements.gfx_spinner.visible = false
					}
					
					//developer was locked, return to that state
					if (solutionPrefs.design.statusLockWorkflow || solutionPrefs.design.statusLockList) {
						DEV_lock_workflow()
					}
					
					//only show active space options
					var borderEnabled = 'MatteBorder,0,0,0,1,#333333'
					var borderDisabled = 'MatteBorder,0,0,0,1,#797778'
					var spacesOK = (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID] && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].spaceSetup) ? navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].spaceSetup : new Array(true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true)
					for (var i = 1; i <= 14; i++) {
						forms[baseForm + '__header'].elements['btn_space_' + i].enabled = spacesOK[i-1]
						
						if (i != 1 && i != 8) {
							forms[baseForm + '__header'].elements['btn_space_' + i].setBorder(spacesOK[i-1] ? borderEnabled : borderDisabled)
						}
					}
				}
			}
		}
		
		//save down current locked status
		solutionPrefs.config.lockStatus = freeze
	}
}

/**
 * Logs a Data Sutra event.
 * 
 * @param	{String}	logType Type of log. Possible values:<br>
 * 						Custom,Configuration panes,Fast finds,Flexible windowing,Navigation items,<br>
 *			  			Records,UL Add,UL Actions,UL Displays,UL Filters,UL Print,UL Sorts,UL Tabs
 * @param	{String}	valueOne
 * @param	{String}	valueTwo
 * @param	{String}	valueThree
 * @param	{String}	valueFour
 * @param	{String}	valueFive
 * @param	{String}	valueSix
 * @param	{String}	valueSeven
 * @param	{String}	valueEight
 * @param	{String}	valueNine
 * 
 * @properties={typeid:24,uuid:"d905985b-6355-4c9c-9e36-d69a2cf797eb"}
 */
function TRIGGER_log_create(logType,valueOne,valueTwo,valueThree,valueFour,valueFive,valueSix,valueSeven,valueEight,valueNine) {
	
	var logType = arguments[0]
	var valueOne = arguments[1]
	var valueTwo = arguments[2]
	var valueThree = arguments[3]
	var valueFour = arguments[4]
	var valueFive = arguments[5]
	var valueSix = arguments[6]
	var valueSeven = arguments[7]
	var valueEight = arguments[8]
	var valueNine = arguments[9]
	
	//logType parameter passed in, solutionPrefs defined, analytics turned on, and logging for logType
	if (logType && application.__parent__.solutionPrefs && solutionPrefs.analytics && solutionPrefs.analytics.logging[utils.stringReplace(logType,' ','_')]) {
		//get foundset
		/** @type {JSFoundSet<db:/sutra/sutra_log>}*/
		var fsLog = databaseManager.getFoundSet('sutra','sutra_log')
		var record = fsLog.getRecord(fsLog.newRecord())
		
		//set basic log information
		record.log_type = logType
		record.id_organization = (solutionPrefs.access.organizationID) ? solutionPrefs.access.organizationID : null
		record.id_group = (solutionPrefs.access.groupID) ? solutionPrefs.access.groupID : null
		record.id_user = (solutionPrefs.access.userID) ? solutionPrefs.access.userID : null
		record.id_access_log = (solutionPrefs.clientInfo.logID) ? solutionPrefs.clientInfo.logID : null
		if (solutionPrefs.history && solutionPrefs.config.currentHistoryPosition >= 0) {
			record.id_navigation = solutionPrefs.history[solutionPrefs.config.currentHistoryPosition].navigationSetID
			record.id_navigation_item = solutionPrefs.history[solutionPrefs.config.currentHistoryPosition].navigationItemID
			record.navigation_set = solutionPrefs.history[solutionPrefs.config.currentHistoryPosition].navigationSetName
			record.navigation_item = solutionPrefs.history[solutionPrefs.config.currentHistoryPosition].navigationSetID
		}
		
		switch (logType) {
			case 'Configuration panes':
				record.config_pane = valueOne
				record.id_navigation_item = valueTwo
				record.id_navigation = valueThree
				record.navigation_set = valueFour
				record.navigation_item = valueFive
				break
			case 'Fast finds':
				record.server_name = valueOne
				record.table_name = valueTwo
				record.find_type = valueThree
				record.find_relation = valueFour
				record.find_field = valueFive
				record.find_value = valueSix
				record.find_records_found = valueSeven
				break
			case 'Flexible windowing':
				record.window_space_from = valueOne
				record.window_space_to = valueTwo
				record.window_dimension_1_then = valueThree
				record.window_dimension_2_then = valueFour
				record.window_dimension_1_now = valueFive
				record.window_dimension_2_now = valueSix
				record.window_size_x = valueSeven
				record.window_size_y = valueEight
				break
			case 'Navigation items':
				record.navigation_form = valueOne
				record.navigation_list = valueTwo
				break
			case 'Records':
				record.server_name = valueOne
				record.table_name = valueTwo
				record.record_field = valueThree
				record.record_id = valueFour
				break
			case 'UL Add':
				record.actions_method = valueOne
				record.server_name = valueTwo
				record.table_name = valueThree
				record.record_field = valueFour
				record.record_id = valueFive
				break
			case 'UL Actions':
				record.actions_item = valueOne
				record.actions_method = valueTwo
				record.server_name = valueThree
				record.table_name = valueFour
				record.record_field = valueFive
				record.record_id = valueSix
				break
			case 'UL Displays':
				record.actions_item = valueOne
				record.server_name = valueTwo
				record.table_name = valueThree
				break
			case 'UL Filters':
				record.actions_item = valueOne
				record.server_name = valueTwo
				record.table_name = valueThree
				record.record_field = valueFour
				record.record_id = valueFive
				record.find_records_found = valueSix
				break
			case 'UL Reports':
				record.id_report = valueOne
				record.actions_item = valueTwo
				record.report_form = valueThree
				record.actions_method = valueFour
				break
			case 'UL Sorts':
				record.sort_field = valueOne
				record.sort_direction = valueTwo
				record.server_name = valueThree
				record.table_name = valueFour
				record.record_field = valueFive
				record.record_id = valueSix
				break
			case 'UL Tabs':
				record.actions_item = valueOne
				record.tab_form = valueTwo
				break
			default:
			case 'Custom':
				record.custom_key = logType
				record.custom_value = valueOne
				break
		}
		
		databaseManager.saveData(record)
	}
	
	
	/*
	
				record. = valueOne
				record. = valueTwo
				record. = valueThree
				record. = valueFour
				record. = valueFive
				record. = valueSix
				record. = valueSeven
				record. = valueEight
				record. = valueNine
				record. = valueTen
				record. = valueEleven
	*/
}

/**
 * Programatically trigger a navigation item filter parameter refresh.<br>
 * Only re-filter if the filter values have changed.
 * 
 * @param	{Boolean}	[forceRefresh] Force a refresh even if filters have not been changed.<br>
 * 						Note: all finds/filters/etc will be reset.
 * @param	{Number}	[itemID] The navigation item to re-filter.
 *
 * @returns	{Boolean}	Refresh performed.
 * 
 * @properties={typeid:24,uuid:"c3da0de9-3fb6-48ba-8406-2bb1060e48f7"}
 */
function TRIGGER_navigation_filter_update(forceRefresh,itemID) {
	//solutionPrefs defined and frameworks not in a locked status
	if (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.currentFormID && !solutionPrefs.config.lockStatus) {
	
	//MEMO: need to somehow put this section in a Function of it's own
	//running in Tano...strip out jsevents for now
	if (utils.stringToNumber(application.getVersion()) >= 5) {
		//cast Arguments to array
		var Arguments = new Array()
		for (var i = 0; i < arguments.length; i++) {
			Arguments.push(arguments[i])
		}
		
		//reassign arguments without jsevents
		arguments = Arguments.filter(CODE_jsevent_remove)
	}
	
		var forceRefresh = arguments[0]
		var navItemID = arguments[1]
		
		return NAV_foundset_restrict(forceRefresh,navItemID)
	}
	else {
		return false
	}
}

/**
 * Programatically navigate to a different navigation item.<br>
 * Note: the sort of the target form will be reset to it's default state.
 * 
 * @param	{String}	[itemID] The navigation item to jump to.
 * @param	{Boolean}	[setFoundset] Modify the foundset on the new navigation item.
 * @param	{JSFoundSet|Number[]|UUID[]}	[useFoundset] Foundset or array of primary keys to restore on the destination form.
 * @param	{Number}	[idNavigationItem] The pk for the navigation item to jump to. (will override itemID)
 *
 * @returns	{Boolean}	Success of loading the foundset requested.
 * 
 * @properties={typeid:24,uuid:"e58b6503-e021-452d-b2b1-075c79e44ddd"}
 */
function TRIGGER_navigation_set(itemID, setFoundset, useFoundset, idNavigationItem) {
//TODO: when navitem filters on, record will not be preserved when new records loaded in
	
	//solutionPrefs defined and frameworks not in a locked status
	if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {
	
		var itemID = arguments[0]
		var setFoundset = arguments[1]
		var useFoundset = arguments[2]
		var idNavigationItem = arguments[3]
		
		//variable letting us know if foundset was intentionally modified
		var foundsetSet = false
		
		//navigate by registry
		if (!idNavigationItem) {
			//loop through all available items, finding everything with this registry
			var navItemID = new Array()
			for (var i in navigationPrefs.byNavItemID) {
				if (navigationPrefs.byNavItemID[i] && navigationPrefs.byNavItemID[i].navigationItem.itemId == itemID) {
					navItemID.push(i)
				}
			}
		
			//try to find navigation item from selected set
			for (var i = 0; i < navItemID.length; i++) {
				if (navigationPrefs.byNavItemID[navItemID[i]].navigationItem.idNavigation == DATASUTRA_navigation_set) {
					var found = true
					break
				}
			}
			
			//prefer navigation item from selected set
			if (found) {
				var navItem = navigationPrefs.byNavItemID[navItemID[i]].navigationItem
			}
			//take first navigation item with passed registry
			else if (navItemID.length) {
				var navItem = navigationPrefs.byNavItemID[navItemID[0]].navigationItem
			}
		}
		//navigate by id_navigation_item
		else {
			var navItem = navigationPrefs.byNavItemID[idNavigationItem].navigationItem
		}
		
	
		if (navItem) {
			var navSetID = navItem.idNavigation
			var formNameWorkflow = navItem.formToLoad
			var formNameList = navItem.listToLoad
			var stringSort = navItem.sortString
			
			var lastItem = solutionPrefs.config.currentFormID
			
			//need to change navigation items
			if (lastItem != navItem.idNavigationItem) {
				//make sure indicator is showing
				scopes.DS.webBlockerCentered()
				
				//call router to switch entire page when not called from router
				if (DATASUTRA_router_enable && !idNavigationItem) {
					DS_router(null,null,navItem.idNavigationItem)
					
					//fill global to be used on second pass through this method (after url is rewritten)
					DATASUTRA_router_payload = {
							itemID : itemID,
							setFoundset : setFoundset,
							useFoundset : (useFoundset) ? useFoundset : forms[application.getMethodTriggerFormName()].foundset
						}
					return
				}
				else {
					//if from a different navigation set
					if (DATASUTRA_navigation_set != navSetID) {
						navigationPrefs.byNavSetID[DATASUTRA_navigation_set].lastNavItem = lastItem
						DATASUTRA_navigation_set = navSetID
						
						//update text display
						var navigationList = (solutionPrefs.config.webClient) ? 'NAV__navigation_tree__WEB' : 'NAV__navigation_tree'
						forms[navigationList].LABEL_update()
					}
					
					//redraw list; make sure row is expanded if node2; load new item
					forms.NAV__navigation_tree__rows.LIST_expand_collapse(null,navItem.idNavigationItem,'open',navSetID)
				}
			}
			
			//bring foundset over
			if (setFoundset) {
				var callingFoundset = (useFoundset) ? useFoundset : (application.getMethodTriggerFormName() ? forms[application.getMethodTriggerFormName()].foundset : null)
				
				//don't have a foundset, stop trying to set it
				if (!callingFoundset) {
					return
				}
						
				//we're passed an array, convert to dataset
				if (callingFoundset instanceof Array) {
					//supposed to be uuids, convert
					function convertUUID(uuid) {return application.getUUID(uuid.substr(0,8) + '-' + uuid.substr(8,4) + '-' + uuid.substr(12,4) + '-' + uuid.substr(16,4) + '-'+ uuid.substr(20))}
					if (callingFoundset[0] && callingFoundset[0].length && convertUUID(callingFoundset[0]) instanceof UUID) {
						callingFoundset = callingFoundset.map(function(item) {return convertUUID(item)})
					}
					
					var ds = databaseManager.convertToDataSet(callingFoundset)
	
					forms[formNameWorkflow].controller.loadRecords(ds)
					
					foundsetSet = true
				}
				//working with foundset, verify that based on same table
				else {
	
					var dataSourceOne = callingFoundset.getDataSource()
					var dataSourceTwo = forms[formNameWorkflow].controller.getDataSource()
	
					var formOne = databaseManager.getDataSourceServerName(dataSourceOne) + '—' + databaseManager.getDataSourceTableName(dataSourceOne)
					var formTwo = databaseManager.getDataSourceServerName(dataSourceTwo) + '—' + databaseManager.getDataSourceTableName(dataSourceTwo)
	
					//check that the two forms are based on the same table from the same server
					if (formOne == formTwo) {
						//load related foundset
						forms[formNameWorkflow].controller.loadRecords(callingFoundset.unrelate())
						
						foundsetSet = true
					}
				}
	
				//a foundset was modified, do some more massage
				if (foundsetSet) {
					//restrict if required to
				//	NAV_foundset_restrict(true,null,true)
	
					//reset the sort
					if (stringSort && forms[formNameWorkflow].controller.getMaxRecordIndex()) {
						forms[formNameWorkflow].controller.sort(stringSort)
					}
	
					//modified foundset
					var modifiedFoundset = forms[formNameWorkflow].foundset
	
					//show that only a portion of current foundset selected
					TRIGGER_fastfind_display_set('Related subset',null,null)
					
					//using UL, refresh
					if (navItem.useFwList) {
						//serclipse 4
						if (utils.stringToNumber(solutionPrefs.clientInfo.verServoy) >= 4) {
							var formUL = navigationPrefs.byNavItemID[navItem.idNavigationItem].listData.tabFormInstance
							
							if (forms[formUL]) {
								forms[formUL].controller.loadRecords(modifiedFoundset.unrelate())
							}
						}
						//3.5
						else {
							TRIGGER_ul_refresh_all()
						}
					}
					//custom list based on the same, set it too
					else if (formNameList && forms[formNameList]) {
						var dataSourceThree = forms[formNameWorkflow].controller.getDataSource()
						var formThree = databaseManager.getDataSourceServerName(dataSourceThree) + '—' + databaseManager.getDataSourceTableName(dataSourceThree)
	
						//check that the two forms are based on the same table from the same server
						if (formTwo == formThree) {
							//load related foundset
							forms[formNameList].controller.loadRecords(modifiedFoundset.unrelate())
	
							//crazy hack for our nested unrelated panes
							if (forms[formNameList + '_1L']) {
								var dataSourceFour = forms[formNameList + '_1L'].controller.getDataSource()
								var formFour = databaseManager.getDataSourceServerName(dataSourceFour) + '—' + databaseManager.getDataSourceTableName(dataSourceFour)
								if (formThree == formFour) {
									//load related foundset
									forms[formNameList + '_1L'].controller.loadRecords(modifiedFoundset.unrelate())
								}
							}
	
							return true
						}
					}
					else {
						return false
					}
	
					return true
				}
				else {
					return false
				}
			}
			else {
				//make sure to update the fast find appropriately
				TRIGGER_fastfind_display_set(null,null,null,true)
				
				return null
			}
		}
		else {
			DIALOGS.showErrorDialog(
						'Navigation error',
						'You do not have access to this screen.  Please see administrator'
				)
			return null
		}
	}
}

/**
 * Get the status of the progress toolbar.
 * 
 * @returns	{Array}	Current status of the progrress toolbar [progressValue, explanationText, explanationText, progressMaxValue]<br>	
 * 					progressValue Current value of the progress bean (null means that indeterminate or not shown).<br>
 *					explanationText Current explanatory text.<br>
 * 					explanationText Current tooltip of explanatory text.
 * 					progressMaxValue Current maximum value of the progress bean.
 * 
 * @properties={typeid:24,uuid:"7e91ecfd-e090-4d7b-83cf-782473b41028"}
 */
function TRIGGER_progressbar_get() {
	if (application.__parent__.solutionPrefs && forms[solutionPrefs.config.formNameBase+'__header__toolbar'].elements.tab_toolbar.tabIndex == 3) {
		var formName = 'TOOL_progress_bar'
		
		//get progressbar value if showing
		if (forms[formName].elements.bean_progress.visible && !forms[formName].elements.bean_progress.indeterminate) {
			var progressValue = forms[formName].elements.bean_progress.value
			var progressMaxValue = forms[formName].elements.bean_progress.maximum
		}
		else {
			var progressValue = null
		}
		
		//get text
		if (forms[formName].elements.lbl_progress_text.visible && forms[formName].elements.lbl_progress_text.text) {
			var explanationText = forms[formName].elements.lbl_progress_text.text
		}
		else {
			var explanationText = null
		}
		
		//get toolTip
		if (forms[formName].elements.lbl_progress_text.visible && forms[formName].elements.lbl_progress_text.toolTipText) {
			var explanationToolTip = forms[formName].elements.lbl_progress_text.toolTipText
		}
		else if (explanationToolTip) {
			var explanationToolTip = null
		}
		
		return [progressValue,explanationText,explanationToolTip,progressMaxValue]
	}
}

/**
 * Set the status of the progress toolbar.
 * 
 * @param	{Number}	[progressValue] Value for progress bean.
 * @param	{String}	[explanationText] Explanatory text (null clears existing text, empty will not change existing value, non-empty will set new value).
 * @param	{String}	[explanationToolTip] Tooltip for explanatory text.
 * 
 * @properties={typeid:24,uuid:"13108d13-f698-45c1-a3d7-0b1c4547e37f"}
 */
function TRIGGER_progressbar_set(progressValue,explanationText,explanationToolTip) {
	if (application.__parent__.solutionPrefs) {
	
		var formName = 'TOOL_progress_bar'
		
		var progressValue = arguments[0]
		var explanationText = arguments[1]
		var explanationToolTip = arguments[2]
		
		//set new progress value
		if (typeof progressValue == 'number') {
			forms[formName].elements.bean_progress.value = progressValue
			forms[formName].elements.bean_progress.updateUI()
		}
		
		//set text
		if (explanationText == null && typeof explanationText == 'object') {
			forms[formName].elements.lbl_progress_text.text = null
		}
		else if (explanationText) {
			forms[formName].elements.lbl_progress_text.text = explanationText
		}
		
		//set toolTip
		if (explanationToolTip == null && typeof explanationToolTip == 'object') {
			forms[formName].elements.lbl_progress_text.toolTipText = null
		}
		else if (explanationToolTip) {
			forms[formName].elements.lbl_progress_text.toolTipText = explanationToolTip
		}
		
		application.updateUI()
	}
}

/**
 * Show and set the initial status of the progress toolbar.
 * 
 * @param	{Number}	progressValue Value for progress bean (usually 0; null will show indeterminate progressbar; -273 will show animated gif).
 * @param	{String}	[explanationText] Explanatory text (empty string will hide element).
 * @param	{String}	[explanationToolTip] Tooltip for explanatory text.
 * @param	{Number}	[minimum=0] Minimum value for progress bean.
 * @param	{Number}	[maximum=100] Maximum value for progress bean.
 * 
 * @properties={typeid:24,uuid:"99d4d8c5-a92a-4793-a10a-04bb647a2d68"}
 */
function TRIGGER_progressbar_start(progressValue,explanationText,explanationToolTip,minimum,maximum) {
	if (application.__parent__.solutionPrefs) {
	
		var formName = 'TOOL_progress_bar'
		var baseForm = solutionPrefs.config.formNameBase
		
		var progressValue = arguments[0]
		var explanationText = arguments[1]
		var explanationToolTip = arguments[2]
		var minimum = (typeof arguments[3] == 'number') ? arguments[3] : 0
		var maximum = (typeof arguments[4] == 'number') ? arguments[4] : 100
		
		//hide bean stuff to make sure the passed values are obeyed
		forms[formName].elements.lbl_progress_text.visible = false
		forms[formName].elements.bean_progress.indeterminate = false
		forms[formName].elements.bean_progress.value = 0
		forms[formName].elements.bean_progress.visible = false
		forms[formName].elements.gfx_progress.visible = false
		
		//only run if progressbar not selected
		if (forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex != 3) {
			//save down active toolbar to restore
			solutionPrefs.config.lastSelectedToolbar = forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex
			
			//load progressbar tab
			forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex = 3
			
			//hide toolbar controls
			forms[baseForm + '__header__toolbar'].elements.toolbar_navigator.visible = false
			
			//set color of toolbar to toolbar white
			forms[baseForm + '__header__toolbar'].elements.lbl_color.bgcolor = '#ffffff'
		}
		
		//turn on progressbar elements
		forms[formName].elements.bean_progress.visible = true
		forms[formName].elements.lbl_progress_text.visible = (explanationText) ? true : false
		forms[formName].elements.gfx_progress.visible = false
		
		//indeterminate gif
		if (progressValue == -273) {
			forms[formName].elements.bean_progress.visible = false
			forms[formName].elements.gfx_progress.visible = true
		}
		//indeterminate progressbar
		else if (progressValue == null && typeof progressValue == 'object') {
			forms[formName].elements.bean_progress.indeterminate = true
		}
		//normal progressbar
		else {
			//initial value
			if (typeof progressValue == 'number') {
				forms[formName].elements.bean_progress.value = progressValue
			}
			else {
				forms[formName].elements.bean_progress.value = 0
			}
			
			//min/max
			forms[formName].elements.bean_progress.minimum = minimum
			forms[formName].elements.bean_progress.maximum = maximum
		}
		
		
		//set text
		if (explanationText) {
			forms[formName].elements.lbl_progress_text.text = explanationText
			forms[formName].elements.lbl_progress_text.toolTipText = explanationToolTip
		}
		
		//two updates (maybe more required)
	//	application.updateUI()
	//	application.updateUI()
		application.updateUI(50)
	}
}

/**
 * Remove progress toolbar and re-select the last toolbar the user was viewing.
 * 
 * @param	{Boolean}	[forceUpdate=false] Redraws the screen when finished.
 * 
 * @properties={typeid:24,uuid:"705d0fdd-b2f9-48a4-9495-d3762c0cb104"}
 */
function TRIGGER_progressbar_stop(forceUpdate) {
	if (application.__parent__.solutionPrefs) {
		var baseForm = solutionPrefs.config.formNameBase
		var formName = 'TOOL_progress_bar'
		
		//progress toolbar is showing, go back to last selected toolbar
		if (forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex == 3) {
			//set toolbar to preference pane when in a preference
			if (solutionPrefs.config.prefs.toolbarTabSelected) {
				forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex = 2
			}
			//set toolbar to previous if there is one
			else if (solutionPrefs.config.lastSelectedToolbar) {
				//web client
				if (solutionPrefs.config.webClient) {
					forms.DATASUTRA_WEB_0F__header__toolbar.DS_toolbar_cycle(solutionPrefs.config.lastSelectedToolbar)
				}
				//smart client
				else {
					DS_toolbar_cycle(solutionPrefs.config.lastSelectedToolbar)
				}
			}
			//go to solution title
			else {
				forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex = 1
			}
		}
		
		//clear out lastSelectedToolbar
		delete solutionPrefs.config.lastSelectedToolbar
		
		//hide bean stuff to be ready for next time
		forms[formName].elements.lbl_progress_text.visible = false
		forms[formName].elements.bean_progress.indeterminate = false
		forms[formName].elements.bean_progress.value = 0
		forms[formName].elements.bean_progress.visible = false
		forms[formName].elements.gfx_progress.visible = false
	}
	
	if (forceUpdate) {
		application.updateUI()
	}
}

/**
 * Checks if the group of the currently logged in user is permitted to perform action.
 * 
 * @param	{String}	registeredAction Registered action (configured in Access & control).
 * @param	{Boolean}	[showDialog=false] Show error dialog when action not allowed.
 * 
 * @returns	{Boolean}	Action authorized status.
 * 
 * @properties={typeid:24,uuid:"32c5064f-1136-410e-8f08-900c0872fc96"}
 * @AllowToRunInFind
 */
function TRIGGER_registered_action_authenticate(registeredAction,showDialog) {
	//default to not show dialogs
	if (typeof showDialog != 'boolean') {
		showDialog = false
	}
	
	/**
	 * Show dialog popup indicating why failed.
	 * 
	 * @param {String} actionName
	 */
	function alert(actionName) {
		if (showDialog) {
			DIALOGS.showErrorDialog('Error','You do not have permission to:\n' + actionName)
		}
	}
	
	//check to see that solutionPrefs is defined
	if (application.__parent__.solutionPrefs) {
		//check to see that access and control is enabled
		if (solutionPrefs.access && solutionPrefs.access.groupID) {
			var registeredAction = arguments[0]
			
			/** @type {JSFoundSet<db:/sutra/sutra_access_action>}*/
			var allActions = databaseManager.getFoundSet('sutra', 'sutra_access_action')
			allActions.clear()
			
			allActions.find()
			allActions.action_id = registeredAction
			var results = allActions.search()
			
			//the specified action does exist
			if (results) {
				var actionID = allActions.id_action
				
				/** @type {JSFoundSet<db:/sutra/sutra_access_group_action>}*/
				var groupActions = databaseManager.getFoundSet('sutra', 'sutra_access_group_action')
				groupActions.clear()
				
				groupActions.find()
				groupActions.id_action = actionID
				groupActions.id_group = solutionPrefs.access.groupID
				groupActions.flag_enabled = 1
				results = groupActions.search()
				
				//action allowed
				if (results) {
					return true
				}
				//action disallowed
				else {
					alert(allActions.description || allActions.action_id)
					return false
				}
			}
			//the specified action does not exist
			else {
				//possible should state that this action doesn't exist...
				alert(registeredAction)
				return false
			}
		}
		//solutionPrefs access and control is turned off, allow action
		else {
			return true
		}
	}
	//solutionPrefs not defined, therefore running in standalone module; allow action
	else {
		return true
	}
}

/**
 * Makes the specified space active.
 * 
 * @param	{String}	spaceName Space name to jump to. Valid inputs are:<br>
 * 						'standard','list','vertical','centered','classic','wide','workflow',<br>
 *						'standard flip','list flip','vertical flip','centered flip','classic flip','wide flip','workflow flip'
 * @param	{Boolean}	[alwaysFire] Go to requested space even if already there.
 * @param	{Boolean}	[skipUI] Do not application.updateUI() as the method runs.
 * 
 * @returns	{Boolean}	Space was changed.
 * 
 * @properties={typeid:24,uuid:"16e4b4b2-b0ef-4af5-81e5-4a1fb2c76a84"}
 */
function TRIGGER_spaces_set(spaceName,alwaysFire,skipUI) {
//TODO: only allow spaces enabled for navItem to be navigable
	
	//solutionPrefs defined and frameworks not in a locked status
	if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {
		var oldSpace = solutionPrefs.config.activeSpace
		var newSpace = arguments[0]
		var alwaysFire = arguments[1]
		var skipUI = arguments[2]
		
		var spaceNames = [	'standard','list','vertical','centered','classic','wide','workflow',
							'standard flip','list flip','vertical flip','centered flip','classic flip','wide flip','workflow flip']
		
		//check to make sure that newSpace is a valid input
		var found = false
		for (var i = 0; i < spaceNames.length && !found; i++) {
			if (spaceNames[i] == newSpace) {
				found = true
			}
		}
		
		//destination space is valid and different than current space
		if ((newSpace != oldSpace || alwaysFire) && found) {
			var baseForm = solutionPrefs.config.formNameBase
			
			if (!solutionPrefs.config.webClient) {
				//hide complement and show current
				if (i < 8) {
					var complement = i + 7
				}
				else {
					var complement = i - 7
				}
				forms[baseForm + '__header'].elements['btn_space_'+i].visible = true
				forms[baseForm + '__header'].elements['btn_space_'+complement].visible = false
			}
			
			//fire space changer
			var spaceMethod = solutionPrefs.config.webClient ? forms.DATASUTRA_WEB_0F__header.ACTION_space_change : DS_space_change
			spaceMethod('btn_space_'+i,true,alwaysFire,skipUI)
			
			return true
		}
		else {
			return false
		}
	}
}

/**
 * Starts/stops a timer used for debugging. Elapsed time displayed in status area of main window.
 * 
 * @param	{String}	startStop Command to "start" or "stop" the timer.
 * 
 * @properties={typeid:24,uuid:"388b465a-89a4-471f-9ad9-8a862a505fe3"}
 */
function TRIGGER_timer(startStop) {
	
	//MEMO: need to somehow put this section in a Function of it's own
	//running in Tano...strip out jsevents for now
	if (utils.stringToNumber(application.getVersion()) >= 5) {
		//cast Arguments to array
		var Arguments = new Array()
		for (var i = 0; i < arguments.length; i++) {
			Arguments.push(arguments[i])
		}
		
		//reassign arguments without jsevents
		arguments = Arguments.filter(CODE_jsevent_remove)
	}
	
	var startStop = arguments[0]
	
	//check for solutionPrefs
	if (!application.__parent__.solutionPrefs) {
		solutionPrefs = {config : {timer: new Object()}}
	}
	//check for config node
	else if (!solutionPrefs.config) {
		solutionPrefs.config = {timer : new Object()}
	}
	//check for timer node
	else if (!solutionPrefs.config.timer) {
		solutionPrefs.config.timer = new Object()
	}
	
	
	//start timing
	if (startStop == 'start') {
		solutionPrefs.config.timer.timeStart = new Date().getTime()
	}
	//stop timing
	else if (startStop == 'stop') {
		if (solutionPrefs.config.timer.timeStart) {
			var endTime = solutionPrefs.config.timer.timeEnd = new Date().getTime()
			
			var elapsed = solutionPrefs.config.timer.timeEnd - solutionPrefs.config.timer.timeStart
			
			//only set when trial mode not expired
			if (!solutionPrefs.config.trialModeExpired) {
				application.setStatusText('Elapsed time is: '+ elapsed +' ms.  Finished '+utils.dateFormat(endTime, 'H:MM:ss'))
			}
		}
		else {
			DIALOGS.showErrorDialog('Timer error','The timer has not been started yet')
		}
	}
}

/**
 * Update record navigator toolbar graphical objects to reflect current record.
 * 
 * @param	{Boolean}	[status] Enable/disable the record navigator.<br>
 * 						Note: if false passed, true must be specified before navigator will work on other future forms.
 * @param	{Number}	[maxWidth] Width of progress indicator (needed for webclient)
 * 
 * @properties={typeid:24,uuid:"545d621f-ead0-4ac5-99aa-7e3a05c85e41"}
 */
function TRIGGER_toolbar_record_navigator_set(status,maxWidth) {

	//solutionPrefs defined and frameworks not in a locked status
	if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {
	
	//MEMO: need to somehow put this section in a Function of it's own
	//running in Tano...strip out jsevents for now
	if (utils.stringToNumber(application.getVersion()) >= 5) {
		//cast Arguments to array
		var Arguments = new Array()
		for (var i = 0; i < arguments.length; i++) {
			Arguments.push(arguments[i])
		}
		
		//reassign arguments without jsevents
		arguments = Arguments.filter(CODE_jsevent_remove)
	}
	
		/*************
			inputs
		*************/
		
		//record navigator status
		if (typeof arguments[0] == 'boolean') {
			var rnStatus = 
			solutionPrefs.config.recordNavigatorStatus = 
				arguments[0]
		}
		else {
			//webclient, get the actual length of this bar
			if (solutionPrefs.config.webClient && (!maxWidth || typeof parseInt(maxWidth) != 'number')) {
				plugins.WebClientUtils.executeClientSideJS('var selector = $(".gfxRecNavigator"); var recNavWidth = (selector.length) ? selector.width() : 0;', TRIGGER_toolbar_record_navigator_set, [null,'recNavWidth'])
				return
			}
			
			var rnStatus = solutionPrefs.config.recordNavigatorStatus
		}
		
		//get record navigator form name
		var formNameRN	 	= 'TOOL_record_navigator'
		
		//get form name
		var formName 		= solutionPrefs.config.currentFormName
		
		//get current index
		var thisIndex 		= forms[formName].controller.getSelectedIndex()
		
		//loaded records size
		var loaded			= forms[formName].controller.getMaxRecordIndex()
		
		//get max table size
		var size 			= databaseManager.getFoundSetCount(forms[formName].foundset)
		
		//set range
		var setSize			= ""
		
		//get current id of loaded form
		var currentNavItem	= solutionPrefs.config.currentFormID
		
		//update record navigator normally
		if (rnStatus) {
			//enable elements if needed
			if (!forms[formNameRN].elements.btn_rec_left.enabled) {
				forms[formNameRN].elements.btn_rec_left.enabled = true
				forms[formNameRN].elements.btn_rec_right.enabled = true
			}
			
			
			/***************************
				universal list specific
			****************************/
			
			//using universal list, do stuff
			if (navigationPrefs.byNavItemID[currentNavItem] && navigationPrefs.byNavItemID[currentNavItem].navigationItem.useFwList) {
				navigationPrefs.byNavItemID[currentNavItem].listData.index.selected = thisIndex
					
				var limitStart = navigationPrefs.byNavItemID[currentNavItem].listData.index.start
				var limitEnd = navigationPrefs.byNavItemID[currentNavItem].listData.index.end
				
				if (limitStart && limitEnd) {
					//setSize = " List showing " + utils.numberFormat(limitStart,'###,###,###,###') + "-" + utils.numberFormat(limitEnd,'###,###,###,###') + "."
				}
			}
			
				
			/***************************
				current record display
			****************************/
			
			//figure out record object display length
			if (!maxWidth) {
				maxWidth = forms[formNameRN].elements.obj_records_max.getWidth()
			}
			
			var recordDivisor	= (thisIndex / loaded) ? thisIndex / loaded : 0
			var recordWidth		= maxWidth * recordDivisor
			
			var height = solutionPrefs.config.webClient ? 6 : 8
			
			//display record object
			forms[formNameRN].elements.obj_records.setSize(recordWidth, height)
					
			//display label
			var recDisplay = "Record " + utils.numberFormat(thisIndex,'###,###,###,###') + " of " + utils.numberFormat(loaded,'###,###,###,###')
			if (loaded == size) {
				recDisplay += " total records."
			}
			else {
				recDisplay += " loaded. " + utils.numberFormat(size,'###,###,###,###') + " total records."
			}
			recDisplay += setSize
			forms[formNameRN].elements.lbl_records.text = recDisplay
		}
		//null out value on record navigator
		else {
			forms[formNameRN].elements.obj_records.setSize(forms[formNameRN].elements.obj_records_max.getWidth(), forms[formNameRN].elements.obj_records.getHeight())
			forms[formNameRN].elements.lbl_records.text = 'Record Navigator inactive'
			
			//disable elements
			forms[formNameRN].elements.btn_rec_left.enabled = false
			forms[formNameRN].elements.btn_rec_right.enabled = false
		}
	}
}

/**
 * Navigates to the specified toolbar if it is available for the logged in user.
 * 
 * @param	{String}	toolbarName Toolbar name to jump to (defined in toolbar config "tab name").
 * 
 * @returns	{Boolean}	Toolbar able to be changed.
 * 
 * @properties={typeid:24,uuid:"900fee92-988b-4c95-aca8-0072b6277768"}
 */
function TRIGGER_toolbar_set(toolbarName) {
	//solutionPrefs defined and frameworks not in a locked status
	if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {
	
		var baseForm = solutionPrefs.config.formNameBase
		
		//only run when not in a preference
		if (!solutionPrefs.config.prefs.preferenceMode) {
			var allToolbars = solutionPrefs.panel.toolbar
			
			var newToolbar = toolbarName
			var oldToolbar = (allToolbars[forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex - 4]) ? allToolbars[forms[baseForm + '__header__toolbar'].elements.tab_toolbar.tabIndex - 4].tabName : ''
				
			//check to make sure that newToolbar is a valid input
			var found = false
			for (var i = 0; i < allToolbars.length && !found; i++) {
				var thisToolbar = allToolbars[i]
				
				if (thisToolbar.tabName == newToolbar && thisToolbar.enabled) {
					found = true
					break
				}
			}
			
			//destination toolbar is valid and different than current toolbar, change
			if (newToolbar != oldToolbar && found) {
				DS_toolbar_cycle(i + 4)
				
				return true
			}
			else {
				return false
			}
		}
	}
}

/**
 * Set the state of a toolbar
 * 
 * @param	{String}	toolbarName Name of toolbar that needs to be dis/enabled.
 * @param	{Boolean}	status Force status of toolbar.
 * 
 * @properties={typeid:24,uuid:"8A2E04BD-EE95-41A4-82CF-C0C2392FBFC6"}
 */
function TRIGGER_toolbar_toggle(toolbarName,status) {
	//solutionPrefs defined and frameworks not in a locked status
	if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {
		var baseForm = solutionPrefs.config.formNameBase
		var allToolbars = solutionPrefs.panel.toolbar
		var newToolbar = toolbarName
		
		//find requested toolbar and set enabled status appropriately
		for (var i = 0; i < allToolbars.length; i++) {
			var thisToolbar = allToolbars[i]
			                              
			if (thisToolbar.tabName == newToolbar) {
				//nothing specified, toggle
				if (typeof status != 'boolean') {
					status = !thisToolbar.enabled
				}
				
				thisToolbar.enabled = status
				break
			}
		}
	}
}

/**
 * Shows detailed view of tooltip in a FiD.
 * 
 * @param	{String}	tabPanelName Name of tab panel that has help.
 * @param	{String}	formName Name of form that has help.
 * @param	{String}	elemName Name of element that has help.
 * 
 * @properties={typeid:24,uuid:"6a193823-8789-4ec3-a7bf-45d1238dc5bd"}
 */
function TRIGGER_tooltip_help_popup(tabPanelName,formName,elemName) {
	
	//MEMO: need to somehow put this section in a Function of it's own
	//running in Tano...strip out jsevents for now
	if (utils.stringToNumber(application.getVersion()) >= 5) {
		//cast Arguments to array
		var Arguments = new Array()
		for (var i = 0; i < arguments.length; i++) {
			Arguments.push(arguments[i])
		}
		
		//reassign arguments without jsevents
		arguments = Arguments.filter(CODE_jsevent_remove)
	}
	
	var tabPanelName = arguments[0] || 'tab_detail'
	var formName = arguments[1] || application.getMethodTriggerFormName()
	var elemName = arguments[2] || application.getMethodTriggerElementName()
	
	if (application.__parent__.solutionPrefs) {
		//there is a default language configured
		if (solutionPrefs.config && solutionPrefs.config.language) {
			//special case where the additional help is located one tab level beneath the help button
			if (elemName == 'btn_help' && forms[formName].elements[tabPanelName]) {
				var tabFormName = forms[formName].elements[tabPanelName].getTabFormNameAt(forms[formName].elements[tabPanelName].tabIndex)
				var firstFound = false
				
				//loop through all inline help and get the first help one available
				for (var j in solutionPrefs.i18n[solutionPrefs.config.language][tabFormName]) {
					if (solutionPrefs.i18n[solutionPrefs.config.language][tabFormName][j].help) {
						firstFound = solutionPrefs.i18n[solutionPrefs.config.language][tabFormName][j].inlineHelp
						break
					}
				}
				
				//if help found, continue
				if (firstFound) {
					CODE_text = firstFound
					forms.CODE_P__text.elements.lbl_header.text = 'Inline help'
						
					//show window when not already showing
					if (!application.getWindow('inlineHelp')) {
						CODE_form_in_dialog(forms.CODE_P__text,-1,-1,-1,-1,' ',true,false,'inlineHelp',false)
					}
					//make sure correct field displayed
					else {
						forms.CODE_P__text.FORM_on_show()
					}
				}
			}
			//check to see that there is additional help for this element
			else if (solutionPrefs.i18n[solutionPrefs.config.language][formName] && solutionPrefs.i18n[solutionPrefs.config.language][formName][elemName] && solutionPrefs.i18n[solutionPrefs.config.language][formName][elemName].inlineHelp) {
				CODE_text = solutionPrefs.i18n[solutionPrefs.config.language][formName][elemName].inlineHelp
				forms.CODE_P__text.elements.lbl_header.text = 'Inline help'
					
				//show window when not already showing
				if (!application.getWindow('inlineHelp')) {
					CODE_form_in_dialog(forms.CODE_P__text,-1,-1,-1,-1,' ',true,false,'inlineHelp',false)
				}
				//make sure correct field displayed
				else {
					forms.CODE_P__text.FORM_on_show()
				}
			}
		}
		//no default language set up; abort
		else {
			DIALOGS.showErrorDialog(
					'Error',
					'No default language is specified'
				)
		}
	}
	else {
		DIALOGS.showErrorDialog(
				'Error',
				'Inline help/tooltips only work when in Data Sutra'
			)
	}
}

/**
 * Sets tooltips on all named elements of current form.
 * 
 * @param	{String}	[formName] Form to work on.
 * @param	{String}	[clearAll] Clear tooltips on all non-Data Sutra managed elements.
 * 
 * @properties={typeid:24,uuid:"cdd6b7fe-1a1c-496d-857e-0ab7b32088f4"}
 */
function TRIGGER_tooltip_set(formName,clearAll) {
	if (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.language) {
		//MEMO: need to somehow put this section in a Function of it's own
		//running in Tano...strip out jsevents for now
		if (utils.stringToNumber(application.getVersion()) >= 5) {
			//cast Arguments to array
			var Arguments = new Array()
			for (var i = 0; i < arguments.length; i++) {
				Arguments.push(arguments[i])
			}
			
			//reassign arguments without jsevents
			arguments = Arguments.filter(CODE_jsevent_remove)
		}
		
		var formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()
		var clearAll = (arguments[1]) ? arguments[1] : false
		var langName = solutionPrefs.config.language
		
		//check to see that default language is specified, there are values for it, the form is specified, and exists
		if (langName && solutionPrefs.i18n[langName] && formName && forms[formName]) {
			var allElements = forms[formName].elements.allnames
			
			//loop through all named elements on this form
			for (var i = 0; i < allElements.length; i++) {
				var elemName = allElements[i]
				
				//a tooltip exists for this form/element combo and the element can take a tooltip
				if (solutionPrefs.i18n[langName][formName] && solutionPrefs.i18n[langName][formName][elemName] && typeof forms[formName].elements[elemName].toolTipText != undefined) {
					//set tooltip
					forms[formName].elements[elemName].toolTipText = solutionPrefs.i18n[langName][formName][elemName].toolTip
				}
				//clear tooltip if none specified and clearAll attribute set
				else if (clearAll && typeof forms[formName].elements[elemName].toolTipText != undefined) {
					forms[formName].elements[elemName].toolTipText = null
				}
			}
		}
	}
}

/**
 * Go to the specified universal list display for selected navigation item.
 * 
 * @param	{Number}	[displayPosn] Position of UL display in the display array.
 * 
 * @properties={typeid:24,uuid:"49c0f6ce-61b1-4b64-8b4b-f6d493783dc0"}
 */
function TRIGGER_ul_display_set(displayPosn) {

	//solutionPrefs defined and frameworks not in a locked status
	if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {
	
	//MEMO: need to somehow put this section in a Function of it's own
	//running in Tano...strip out jsevents for now
	if (utils.stringToNumber(application.getVersion()) >= 5) {
		//cast Arguments to array
		var Arguments = new Array()
		for (var i = 0; i < arguments.length; i++) {
			Arguments.push(arguments[i])
		}
		
		//reassign arguments without jsevents
		arguments = Arguments.filter(CODE_jsevent_remove)
	}
		var displayPosn = arguments[0]
		
		//check that on a form that has a universal list
		if (solutionPrefs.config.currentFormID && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID] && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].navigationItem && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].navigationItem.useFwList) {
			forms[navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.tabFormInstance].DISPLAY_list(true,displayPosn)
		}
		
	}
}

/**
 * @deprecated
 * 
 * @properties={typeid:24,uuid:"80b5f03d-6fe0-4ee7-a801-7fd0c6a6238e"}
 */
function TRIGGER_ul_refresh_all()
{

/*
 *	TITLE    :	TRIGGER_ul_refresh_all
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	updates entire universal list if used on this form anywhere in the entire frameworks
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	universal list in use on current form, solutionPrefs
 *			  	
 *	MODIFIED :	Oct 26, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs & navigationPrefs defined and frameworks not in a locked status
	//and in less than 4
if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs && !solutionPrefs.config.lockStatus && 
	utils.stringToNumber(solutionPrefs.clientInfo.verServoy) < 4) {
	
	var navItemID = solutionPrefs.config.currentFormID
	
	//using universal list, do stuff
	if (navigationPrefs.byNavItemID[navItemID].navigationItem.useFwList) {
		databaseManager.saveData()
		
		var formUL = navigationPrefs.byNavItemID[navItemID].listData.tabFormInstance
		
		//only refresh if visited and UL for this nav item
		if (formUL && forms[formUL]) {
			forms[formUL].UL_sync_records()
			TRIGGER_toolbar_record_navigator_set()
		}
	}
}



}

/**
 * @deprecated
 * 
 * @properties={typeid:24,uuid:"02f4edfb-7cb2-4a99-aeda-ac167959430b"}
 */
function TRIGGER_ul_refresh_on_delete()
{
//TODO: COMING SOON!!!!
//MEMO only required for pre 4.0 servoy

/*
 *	TITLE    :	TRIGGER_ul_refresh_on_delete
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	updates universal list data after record deletion
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	universal list in use on current form, solutionPrefs, navigationPrefs
 *			  	
 *	USAGE    :	TRIGGER_ul_refresh_on_delete(displayPosition) Pass in the position of the display on the currently showing form
 *			  	
 *	MODIFIED :	August 6, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs) {
	var navItemID = solutionPrefs.config.currentFormID
	var navItemForm = solutionPrefs.config.currentFormName
	
	//using universal list, do stuff
	if (navigationPrefs.byNavItemID[navItemID].navigationItem.useFwList) {
		
		TRIGGER_ul_refresh_all()
		
		/*
		databaseManager.saveData()
		
		var formUL = navigationPrefs.byNavItemID[navItemID].listData.tabFormInstance
		
		var workflowFoundset = forms[navItemForm].foundset
		var ulFoundset = forms[formUL+'_1L'].foundset
		
		//check to see if index is different than workflow form; if it is omit selected - 1
		if (workflowFoundset.getSelectedIndex() != ulFoundset.getSelectedIndex()) {
			//TODO: add to garbage collector
			navigationPrefs.foundsetPool.recyclePKs.push(ulFoundset.getRecord(ulFoundset.getSelectedIndex() - 1).id_universal_list)
			
			//remove from foundset
			forms[formUL+'_1L'].foundset.omitRecord(ulFoundset.getSelectedIndex() - 1)
		}
		//omit selected index
		else {
			//TODO: add to garbage collector
			navigationPrefs.foundsetPool.recyclePKs.push(ulFoundset.id_universal_list)
			
			//remove from foundset
			forms[formUL+'_1L'].foundset.omitRecord(ulFoundset.getSelectedIndex())
		}
		
		//TODO: save down some state information and update the record_navigator
		
		//re-highlight the record under this index
		forms[formUL + '_1L'].REC_refresh()
		*/
	}
}
}

/**
 * @deprecated
 * 
 * @properties={typeid:24,uuid:"50d8a27a-2321-4118-b4f7-db097f8c0f0a"}
 */
function TRIGGER_ul_refresh_selected()
{

/*
 *	TITLE    :	TRIGGER_ul_refresh_selected
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	updates universal list data for currently selected record
 *			  	method may be attached to onRecSave of form used in workflow area to keep UL in sync with changes that user is making
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	universal list in use on current form, solutionPrefs
 *			  	
 *	MODIFIED :	June 17, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//solutionPrefs & navigationPrefs defined and not skipping a refresh
	//and in less than 4
if (application.__parent__.solutionPrefs && application.__parent__.navigationPrefs && 
	!application.__parent__.skipULRefreshOne && utils.stringToNumber(solutionPrefs.clientInfo.verServoy) < 4) {
	
	var navItemID = solutionPrefs.config.currentFormID
	
	//using universal list, do stuff
	if (navigationPrefs.byNavItemID[navItemID].navigationItem.useFwList) {
		databaseManager.saveData()
		
		var formUL = navigationPrefs.byNavItemID[navItemID].listData.tabFormInstance
		
		//only refresh if visited and UL for this nav item
		if (formUL && forms[formUL]) {
			forms[formUL + '_1L'].REC_refresh()
		}
	}
}
}

/**
 * Remove tab navigated to using the tab controller on the universal list and return universal list
 * 
 * @properties={typeid:24,uuid:"2eb30059-9a36-47f9-8f8b-1fac91db90c8"}
 */
function TRIGGER_ul_tab_exit() {
	//solutionPrefs defined and frameworks not in a locked status
	if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {
		forms[solutionPrefs.config.formNameBase].elements.tab_content_B.tabIndex = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.tabNumber
	}
}

/**
 *
 * @properties={typeid:24,uuid:"bee951cd-c178-4304-9676-2576a15749da"}
 */
function CODE_color_method()
{

/*
 *	TITLE    :	CODE_color_method
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	color a given method
 *			  	
 *	INPUT    :	string to be colored
 *			  	
 *	REQUIRES :	globals.CODE_color_method_fx
 *			  	
 *	OUTPUT   :	html colored string
 *			  	
 *	MODIFIED :	Oct 25, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

var method = arguments[0]
var codeType = arguments[1] || 'servoy'

function fxGetKeywords(str) {
	return '\\b' + str.replace(/ /g, '\\b|\\b') + '\\b'
}

function fxMatch(value, index, css) {
	var objReturn = new Object()
	
	objReturn.value = value
	objReturn.index = index
	objReturn.length = value.length
	objReturn.css = css
	
	return objReturn
}

function fxGetMatches(code, regex, css, func) {
	var fxMatch = func
	
	var index = 0
	var match = null
	var matches = new Array()
	
	while((match = regex.exec(code)) != null) 
		matches[matches.length] = fxMatch(match[0], match.index, css)
	
	return matches
}

//
// 1) set up for correct style
//
switch (codeType) {
	case 'servoy':
		var keywords =	'abstract boolean break byte case catch char class const continue debugger ' +
						'default delete do else enum export extends final finally float for ' +
						'Function if implements import in instanceof interface package return super switch ' +
						'this throw throws transient try typeof var void while with';
		
		var servoy =	'application controller currentcontroller databaseManager elements forms foundset ' +
						'globals history i18n plugins security ServoyException utils';
		
		var special =	'null undefined NaN';
		
		var regexList = [
			{ regex: new RegExp('/\\*[\\s\\S]*?\\*/', 'gm'),				css: 'comment' },			// multiline comments //[0]
			{ regex: new RegExp('//[^TODO,MEMO].*$', 'gm'),					css: 'comment' },			// one line comments //[1]
			{ regex: new RegExp('"(?:\\.|(\\\\\\")|[^\\""\\n])*"','g'),		css: 'string' },			// double quoted strings //[2]
			{ regex: new RegExp("'(?:\\.|(\\\\\\')|[^\\''\\n])*'", 'g'),	css: 'string' },			// single quoted strings //[3]
			{ regex: new RegExp('[(){}]', 'gm'),							css: 'string' },			// brackets () {} //[4]
			{ regex: new RegExp('\\b([\\d]+(\\.[\\d]+)?|0x[a-f0-9]+)\\b', 'gi'),	css: 'number' },	// numbers //[5]
			{ regex: new RegExp('(?:\&lt;|<)(?:=)*|(?:\&gt;|>)(?:=)*|!(?:=)*|[[]|]|(?:==)', 'gm'), css: 'keyword'},	// comparison, square [] //[6]
			{ regex: new RegExp(fxGetKeywords(keywords), 'gm'),			css: 'keyword' },			// keywords //[7]
			{ regex: new RegExp(fxGetKeywords(servoy), 'gm'),			css: 'servoy' },			// servoy words //[8]
			{ regex: new RegExp(fxGetKeywords(special), 'gm'),			css: 'special' },			// special red words //[9]
			{ regex: new RegExp('[*-]|[+]|=[^=]|[/][^/*]', 'gm'),			css: 'special' },			// operators //[10]
			{ regex: new RegExp('//[TODO,MEMO].*$', 'gm'),					css: 'devnotes' }			// todo developer notes //[11]
			];
		break
}


//
// 2) get variable filled with data
//


// a value present to be colored
if ((!(method == null || method == undefined)) ? method.length : false) { 
	var methodArray = method.split('\n')
	
	//replace each element of methodArray with an object containing the original contents
	//and an array where there is 1 letter per element
	for (var i = 0 ; i < methodArray.length ; i++) {
		var rowObject = new Object()
		rowObject.rowData = methodArray[i]
		rowObject.rowArray = new Array()
		rowObject.startRestrict = new Array()
		rowObject.endRestrict = new Array()
		//
		for (var j = 0 ; j < rowObject.rowData.length ; j++) {
			rowObject.rowArray[j] = rowObject.rowData.charAt(j)
			
			//replace tabs with spaces
			if (rowObject.rowArray[j] == '\t') {
				rowObject.rowArray[j] = '&nbsp;&nbsp;&nbsp;&nbsp;'
			}
			//replace space with space
			else if (rowObject.rowArray[j] == ' ') {
				rowObject.rowArray[j] = '&nbsp;'
			}
			//replace < with &lt;
			else if (rowObject.rowArray[j] == '<') {
				rowObject.rowArray[j] = '&lt;'
			}
		}
		methodArray[i] = rowObject //CODE_copy_object(rowObject)
	}

//
// 3) parse
//

	//positions and lengths of all multiline comments
	var posnColor = fxGetMatches(method,regexList[0].regex,regexList[0].css,fxMatch)
	
	if (posnColor.length) {
		var spanInsert = '<span class="' + posnColor[0].css + '">'
		var j = 0 //cumulative character count
		var k = 0 //array index
		
		//go through all multiline comments
		for (var i = 0 ; i < posnColor.length ; i++) {
			var indexStart = posnColor[i].index
			var indexEnd = posnColor[i].index + posnColor[i].length - 1
			
			//go to starting position
			var exitLoop = false
			//k is row in methodArray, j is number of characters in all rows up to k - 1
			while (j < indexStart && !exitLoop) {
				if (j + methodArray[k].rowArray.length < indexStart) {
					j += methodArray[k].rowArray.length + 1
					k++
				}
				else {
					exitLoop = true
				}
			}
			
			//insert begin span for multiline comment (and restriction)
			methodArray[k].rowArray[indexStart - j] = spanInsert + methodArray[k].rowArray[indexStart - j]
			methodArray[k].startRestrict[methodArray[k].startRestrict.length] = indexStart - j
			
			//go to ending position
			exitLoop = false
			//k is row in methodArray, j is number of characters in all rows up to k - 1
			while (j < indexEnd && !exitLoop) {
				if (j + methodArray[k].rowArray.length < indexEnd) {
					//insert end span and start of next span (and restrictions)
					methodArray[k].rowArray[methodArray[k].rowArray.length - 1] += '</span>'
					methodArray[k].endRestrict[methodArray[k].endRestrict.length] = methodArray[k].rowArray.length - 1
					if (methodArray[k+1].rowArray[0] == undefined) {
						methodArray[k+1].rowArray[0] = spanInsert
					}
					else {
						methodArray[k+1].rowArray[0] = spanInsert + methodArray[k+1].rowArray[0]
					}
					methodArray[k+1].startRestrict[methodArray[k+1].startRestrict.length] = 0
					
					//advance
					j += methodArray[k].rowArray.length + 1
					k++
				}
				else {
					exitLoop = true
				}
			}
			//insert end span for multiline comment (and restriction)
			methodArray[k].rowArray[indexEnd - j] += '</span>'
			methodArray[k].endRestrict[methodArray[k].endRestrict.length] = indexEnd - j
		}
	}

	for (var i = 0 ; i < methodArray.length ; i++) {
		//todo developer notes
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[11],fxGetMatches,fxMatch)
		//oneline comments
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[1],fxGetMatches,fxMatch)
		//double/single quoted strings
		//TODO: '"' contained within each other doesn't work
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[3],fxGetMatches,fxMatch)
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[2],fxGetMatches,fxMatch)
		//() {} brackets
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[4],fxGetMatches,fxMatch)
		//numbers
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[5],fxGetMatches,fxMatch)
		//comparison operators and [] brackets
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[6],fxGetMatches,fxMatch)
		//keywords
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[7],fxGetMatches,fxMatch)
		//servoy words
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[8],fxGetMatches,fxMatch)
		//special red words
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[9],fxGetMatches,fxMatch)
		//operators
		methodArray[i] = CODE_color_method_fx(methodArray[i],regexList[10],fxGetMatches,fxMatch)
	}
//
// 4) write out html
//
	var html = '<html><head>'
	
	//css
	html += '<style type="text/css" media="screen"><!--'
	html += '.syntax { font-family: "Consolas", "Courier New", Courier, mono, serif; font-size: 12pt; background-color: #E7E5DC; width: 100%; margin: 0px 0 18px 0 !important; }'
	html += '.syntax ol { background-color: #FFFFFF; margin: 0px 0px 1px 0px !important; padding: 0px; color: #5C5C5C; }'
	html += '.syntax ol li { background-color: #F8F8F8; padding: 0 3px 0 10px !important; }'
	html += '.syntax ol li.alt { background-color: #FFFFFF; }'
	html += '.syntax ol li span { color: black; font-weight: normal; }'
	
	//css servoy colors
	html += '.syntax .comment { color: #1B8A28; font-style: italic; font-weight: bold; }'
	html += '.syntax .string { color: gray; }'
	html += '.syntax .keyword { color: #4000FF; font-weight: bold; }'
	html += '.syntax .servoy { color: #00B400; font-weight: bold; }'
	html += '.syntax .special { color: #FF1300; font-weight: bold; }'
	html += '.syntax .devnotes { color: #B00D00; font-style: italic; }'
	html += '.syntax .number { color: #FF00FF; }'
	
	html += '--></style></head>'
	
	//body
	html += '<body>'
	var todayDate = new Date()
	html += '<div class="syntax">'
	html += 'The contents of this method were last refreshed on ' + utils.dateFormat(todayDate,'MM-d-yyyy') + ' at ' + utils.dateFormat(todayDate,'HH:mm:ss')
	html += '<ol>'
	
	for (var i = 0 ; i < methodArray.length ; i++) {
		if (i % 2 == 0) {
			html+= '\n<li class="alt">'
		}
		else {
			html+= '\n<li class="">'
		}
		html += '<span>' //put beginning span on the row
		for (var j = 0 ; j < methodArray[i].rowArray.length ; j++) {
			html += methodArray[i].rowArray[j]
		}
		html += '</span>' //put ending span on the row
		html += '</li>'
	}
	
	//continue alternating background color if less than ~20 rows
	if (i < 20) {
		for (i ; i < 21 ; i++) {
			if (i % 2 == 0) {
				html+= '\n<li class="alt">'
			}
			else {
				html+= '\n<li class="">'
			}
			html += '<span></span></li>' //empty row contents for row background
		}
	}
	
	//wrap up
	html += '</ol></div></body></html>'
	
	return html
}
}

/**
 *
 * @properties={typeid:24,uuid:"9034ab19-2bfb-47c2-98c2-e26612ee4ed4"}
 */
function CODE_color_method_fx()
{

/*
 *	TITLE    :	CODE_color_method_fx
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	process one line, skipping restrictions
 *			  	
 *	INPUT    :	object containing startRestrict, endRestrict, rowData, rowArray; regex; and two Functions
 *			  	
 *	OUTPUT   :	modified object
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Oct 25, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

var returnObject = arguments[0]
var regexItem = arguments[1]
var fxGetMatches = arguments[2]
var fxMatch = arguments[3]

var nonFormat = returnObject.rowData
var indexOffset

var loopEnd = returnObject.startRestrict.length

for (var j = 0 ; j <= loopEnd ; j++) { //to account for starting and ending
	//no restrictions
	if (j == 0 && loopEnd == 0) {
		var noFormat = nonFormat
		indexOffset = 0
	}
	//before first restriction
	else if (j == 0) {
		var noFormat = nonFormat.substring(0, returnObject.startRestrict[j])
		indexOffset = 0
	}
	//not the last restriction, begin with end of current restriction and go until beginning of next one
	else if (j < loopEnd) {
		var noFormat = nonFormat.substring(returnObject.endRestrict[j-1] + 1, returnObject.startRestrict[j])
		indexOffset = returnObject.endRestrict[j-1] + 1
	}
	//after last and only restriction
	else if (j == loopEnd == 1) {
		var noFormat = nonFormat.substring(returnObject.endRestrict[j-1] + 1, returnObject.rowArray.length)
		indexOffset = returnObject.endRestrict[j-1] + 1
	}
	//after last restriction
	else if (j == loopEnd) {
		var noFormat = nonFormat.substring(returnObject.endRestrict[j-1] + 1, returnObject.rowArray.length - 1)
		indexOffset = returnObject.endRestrict[j-1] + 1
	}
	//boundary conditions
	else {
		var noFormat = ''
		indexOffset = 0
	}

	var posnColor = fxGetMatches(noFormat,regexItem.regex,regexItem.css,fxMatch)
	
	//match found
	if (posnColor.length) {
		spanInsert = '<span class="' + posnColor[0].css + '">'	
		for (var k = 0 ; k < posnColor.length ; k++) {
			var indexStart = posnColor[k].index + indexOffset
			var indexEnd = posnColor[k].index + posnColor[k].length - 1 + indexOffset
			
			returnObject.rowArray[indexStart] = spanInsert + returnObject.rowArray[indexStart]
			returnObject.startRestrict[returnObject.startRestrict.length] = indexStart
			
			returnObject.rowArray[indexEnd] += '</span>'
			returnObject.endRestrict[returnObject.endRestrict.length] = indexEnd
		}
	}
}

//sort restriction arrays
returnObject.startRestrict.sort(CODE_sort_numeric)
returnObject.endRestrict.sort(CODE_sort_numeric)

return returnObject
}

/**
 *
 * @properties={typeid:24,uuid:"17abbea9-0fb1-4ba5-a20c-c3df82004085"}
 */
function CODE_copy_dataset()
{

/*
 *	TITLE    :	CODE_copy_dataset
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	creates a copy of a dataset (not a reference), and returns it
 *			  	
 *	INPUT    :	dataset
 *			  	
 *	OUTPUT   :	copy of dataset
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CODE_copy_dataset(dataset) Input a dataset to make a copy
 *			  	
 *	MODIFIED :	Jul 2008 -- David Workman, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

var original	= arguments[0]

var columns		= new Array()

for ( var i = 1 ; i <= original.getMaxColumnIndex() ; i++ ) {
	columns.push(original.getColumnName(i))
}

var copyDataset = databaseManager.createEmptyDataSet(0, columns)

for ( var i = 1 ; i <= original.getMaxRowIndex() ; i++ ) {
	copyDataset.addRow([i], columns.length)
	var row = original.getRowAsArray(i)
	for ( var j = 1 ; j <= row.length ; j++ ) {
		copyDataset.setValue(i, j, original.getValue(i, j))
	}
}

return copyDataset
}

/**
 *
 * @properties={typeid:24,uuid:"38693332-be88-4fcd-8674-2e07bfc135dd"}
 */
function CODE_copy_object()
{

/*
 *	TITLE    :	CODE_copy_object
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	creates a copy of an object (not a reference), and returns it
 *			  	
 *	INPUT    :	object
 *			  	
 *	OUTPUT   :	copy of object
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

var origObj = arguments[0]

//if passed an array, create an array
if (origObj instanceof Array) {
	var deepCopyObj = new Array(origObj.length)
}
//if passed an object, create an object
else {
	var deepCopyObj = new Object()
}

for (var i in origObj) {
	if (typeof origObj[i] == 'object' && origObj[i] != null) {
		deepCopyObj[i] = CODE_copy_object(origObj[i])
	}
	else {
		deepCopyObj[i] = origObj[i]
	}
}

return deepCopyObj
}

/**
 *
 * @properties={typeid:24,uuid:"c9c2a1ab-d81f-408b-ac1c-4a38e7e342e7"}
 */
function CODE_date_format()
{

/*
 *	TITLE    :	CODE_date_format
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	formats input date as dayOfWeek, Month day, year
 *			  	
 *	INPUT    :	1) date field
 *			  	2) how to format (optional)
 *			  		- 'full' format – Tuesday, January 1, 1970 (default)
 *			  		- 'current' format – (see Preferences for i18n format)
 *			  		- 'specify' format – (see http://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html for all options)
 *			  	3) custom format string (optional)
 *			  	4) locale to format date in (optional)
 *			  	
 *	OUTPUT   :	string
 *			  	
 *	REQUIRES :	solutionPrefs.config.language
 *			  	
 *	USAGE    :	CODE_date_format(dateField) Returns a formatted version of the date (Tuesday, January 1, 1970)
 *			  	
 *	MODIFIED :	January 16, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

var dateIn = arguments[0] || new Date()
var formatType = arguments[1]
var customFormat = arguments[2]
var customLocale = arguments[3]

//we've got a date
if (dateIn instanceof Date) {
	var dateFormatSimple = (application.__parent__.solutionPrefs && solutionPrefs.fastFind && solutionPrefs.fastFind.dateFormat) ? solutionPrefs.fastFind.dateFormat : i18n.getDefaultDateFormat()
	var dateFormatFull = 'EEEE, MMMM d, yyyy'
	
	switch (formatType) {
		case 'specify':
			var dateFormat = (customFormat) ? customFormat : dateFormatSimple
			break
		case 'current':
			var dateFormat = dateFormatSimple
			break
		case 'full':
			var dateFormat = dateFormatFull
			break
		default:
			var dateFormat = dateFormatFull
			break
	}
	
	var currentLocale = new java.util.Locale((customLocale) ? customLocale : ((application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.language) ? solutionPrefs.config.language : 'en')) 
	var formatter = new java.text.SimpleDateFormat(dateFormat, currentLocale)
	var stringOut = formatter.format(dateIn)
	
	return stringOut
}
//passed some non-date thing; abort
else {
	return dateIn
}



}

/**
 *
 * @properties={typeid:24,uuid:"02f2f179-e06e-4fbf-9fac-2fab657131c7"}
 */
function CODE_dialog_button()
{

/*
 *	TITLE    :	CODE_dialog_button
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	switches placement of ok/cancel button depending on os in use
 *			  	attach to onLoad form event and buttons ok/cancel
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	btnOK, btnCancel elements
 *			  	
 *	MODIFIED :	Sept 2007 -- Robert Ivens, ROCLASI Software Solutions
 *			  	
 */


var sOSname    = application.getOSName(), 
    sFormName  = application.getMethodTriggerFormName(), 
    nOffset    = 0


if (sOSname != 'Mac OS X') { 
     var nOKPos       = forms[sFormName].elements.btnOK.getLocationX(), 
         nCancelPos   = forms[sFormName].elements.btnCancel.getLocationX(), 
         nOKWidth     = forms[sFormName].elements.btnOK.getWidth(), 
         nCancelWidth = forms[sFormName].elements.btnCancel.getWidth()
     nOffset = Math.abs(nOKWidth - nCancelWidth)
     forms[sFormName].elements.btnOK.setLocation(nCancelPos,forms[sFormName].elements.btnOK.getLocationY())
     forms[sFormName].elements.btnCancel.setLocation(nOKPos + nOffset,forms[sFormName].elements.btnCancel.getLocationY())
} 

}

/**
 *
 * @properties={typeid:24,uuid:"1f99a295-e894-4cef-bf1b-4b2e24208a03"}
 */
function CODE_fid_hide()
{

/*
 *	TITLE    :	CODE_fid_hide
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	attach to form in dialog formOnHide method to prevent close button
 *			  		- globals.CODE_hide_form == 1, form closes
 *			  		- globals.CODE_hide_form == 0, form doesn't close
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

return (CODE_hide_form) ? true : false
}

/**
 *
 * @properties={typeid:24,uuid:"a4944da0-7962-411f-96a5-1e9e606c542e"}
 */
function CODE_file_import()
{

/*
 *	TITLE    :	CODE_file_import
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	open file in native viewer
 *			  	
 *	INPUT    :	1- foundset (optional)
 *			  	2- record (optional)
 *			  	3- file name to read in (optional)
 *			  	4- array of field names (optional)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

var fsFile = (arguments[0]) ? (arguments[0]) : forms[application.getMethodTriggerFormName()].foundset
var recordFile = (arguments[1]) ? (arguments[1]) : false
var fileName = (arguments[2]) ? (arguments[3]) : plugins.file.showFileOpenDialog(1)
var fieldNames = (arguments[3]) ? (arguments[4]) : new Array(10)

//check for custom field names
var nameFile = fieldNames[0] || 'file_name'
var nameBlob = fieldNames[1] || 'file_blob'
var nameSize = fieldNames[2] || 'file_size'
var nameExt = fieldNames[3] || 'file_ext'
var nameType = fieldNames[4] || 'file_type'
var nameWidth = fieldNames[5] || 'file_width'
var nameHeight = fieldNames[6] || 'file_height'
var namePages = fieldNames[7] || 'file_pages'
var nameThumb = fieldNames[8] || 'file_thumb'
var nameText = fieldNames[9] || 'file_text'

//if file selected, punch in
if (fileName) {
	//replace backslashes with slashes so windows or other filename and path are the same
	var qualifiedFileName = utils.stringReplace(fileName, "\\", "/")
	
	if (qualifiedFileName) {
		//name of file
		var fileName = qualifiedFileName.substr(qualifiedFileName.lastIndexOf("/")+1)
		
		//get the document size
		var fileSize = plugins.file.getFileSize(qualifiedFileName)
		
		if (fileSize > 2 * (1024 * 1024)) {
			var proceed = DIALOGS.showQuestionDialog('Large file','The file selected is over 2 mb.  Continue?','Yes','No')
		}
		else {
			var proceed = 'Yes'
		}
		
		if (proceed == 'Yes') {
			
			//get the document specifications
			var fileBlob = plugins.file.readFile(qualifiedFileName)
			var imageTemp =  plugins.images.getImage(fileBlob)
			var fileType = imageTemp.getContentType()
			
			//get extension
			var ext = fileName.split('.')
			//file has an extension
			if (ext && ext.length > 1) {
				var fileExt = ext[ext.length-1].toLowerCase()
			}
			//get extension from file type
			else if (fileType) {
				var fileExt = fileType.substr(fileType.lastIndexOf("/")+1).toLowerCase()
			}
			
			//text file
			if (!fileType && (fileExt.equalsIgnoreCase('txt') || fileExt.equalsIgnoreCase('sql') || 
				fileExt.equalsIgnoreCase('xml') || fileExt.equalsIgnoreCase('js') || fileExt.equalsIgnoreCase('servoyjs') || 
				fileExt.equalsIgnoreCase('java') || fileExt.equalsIgnoreCase('php') || fileExt.equalsIgnoreCase('css') ||
				fileExt.equalsIgnoreCase('html') || fileExt.equalsIgnoreCase('htm') || fileExt.equalsIgnoreCase('properties'))) {
				
				var textFile = true
				
				fileType = 'text'
				
				var origText = new java.lang.String(fileBlob)
				origText = origText.substring(0,1000)
				
				var textSnippet = ''
				
				//put line breaks in
				for (var i = 1; i <= 10 && i <= Math.ceil(origText.length/100); i++) {
					
					var start = (posn) ? posn : 0
					var posn = i * 100
					
					//find place to chop
					if (origText.length >= posn) {
						while (origText.charAt(posn) != ' ') {
							posn--
						}
					}
					else {
						posn = origText.length
					}
					
					textSnippet += origText.substring(start,posn) + '<br>&nbsp;&nbsp;&nbsp;' //+ origText.substring(i*100)
				}
				
				//take off final <br>
				textSnippet = textSnippet.substr(0,textSnippet.length-28)
				
			}
			//unknown file type
			else if (!fileType && fileExt) {
				fileType = fileExt
			}
			//unknown file type
			else if (!fileType) {
				fileType = "UNKNOWN"
			}
			//unknown extension
			if (!fileExt) {
				var fileExt = '???'
			}
			
			//load pdf so i can get the page dimensions if jpedal available (in lib directory)
			if (false) {	//fileType == "application/pdf" && Packages.org.jpedal.PdfDecoder) {
				var pdfDecoder = new Packages.org.jpedal.PdfDecoder
				
				pdfDecoder.openPdfArray(fileBlob)
				pdfDecoder.setPageParameters(1,1)
				
				var pageCount = pdfDecoder.getPageCount()
				var width = pdfDecoder.getPDFWidth()	
				var height = pdfDecoder.getPDFHeight()
				
				var bufferedImage = pdfDecoder.getPageAsThumbnail(1,320)
				var rawData = new java.io.ByteArrayOutputStream()
				Packages.javax.imageio.ImageIO.write(bufferedImage,'jpg',rawData)
				
				var thumb = rawData.toByteArray()
			}
			//get dimensions using image
			else if (!textFile) {
				var width = imageTemp.getWidth()
				var height = imageTemp.getHeight()
				
				//a picture and large, make a small one
				if (width > 320 || height > 320) {
					var thumb = imageTemp.resize(320,320)
				}
				//assign non-picture or small picture data
				else {
					var thumb = fileBlob
				}
			}
			
			//create the new attachment record
			if (!recordFile) {
				var record = fsFile.getRecord(fsFile.newRecord(false,true))
			}
			//attachment record specified
			else {
				var record = recordFile
			}
			
			record[nameFile] = fileName
			record[nameBlob] = fileBlob
			record[nameSize] = fileSize
			record[nameExt] = fileExt
			record[nameType] = fileType
			record[nameWidth] = width
			record[nameHeight] = height
			record[namePages] = pageCount
			record[nameThumb] = thumb
			record[nameText] = (textSnippet) ? textSnippet : null
			
			databaseManager.saveData()
		}
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"b7fdbfae-b579-4031-b240-6d82fc489016"}
 */
function CODE_file_open()
{

/*
 *	TITLE    :	CODE_file_open
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	open file in native viewer
 *			  	
 *	INPUT    :	1- file blob
 *			  	2- file name
 *			  	3- file extension
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	December 15, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: integrate Westy code when in webclient

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

var fileBlob = arguments[0]
var fileName = (arguments[1]) ? arguments[1] : 'tempfile_.pdf'
var fileExt = (arguments[2]) ? arguments[2] : 'pdf'

var tmpfile

if (fileBlob) {
	tmpfile = plugins.file.createTempFile(fileName.substring(0,fileName.length - (fileExt.length)),'.' + fileExt)
	
	//replace backslashes with forward slashes to avoid escaping problems
	tmpfile = utils.stringReplace(tmpfile,"\\", "/")
	
	plugins.file.writeFile(tmpfile,fileBlob)
	
	if (utils.stringMiddle(application.getOSName(),1,7) == "Windows") { 
	   application.executeProgram('rundll32', 'url.dll,FileProtocolHandler',tmpfile) 
	}
	else if (utils.stringMiddle(application.getOSName(),1,7) == "FreeBSD" || utils.stringMiddle(application.getOSName(),1,5) == "Linux") { 
	   application.executeProgram('mozilla', tmpfile) 
	}
	else if (utils.stringMiddle(application.getOSName(),1,6) == "Mac OS") { 
	   application.executeProgram('open', tmpfile) 
	}
}

/*	Westy's web client code
if(application.getApplicationType()==5) {
	//wc from developer needs error trapping to use different install dir
		//adrian suggested
		installdir = utils.stringReplace(installdir,'developer','application_server')
	
	var installdir = java.lang.System.getProperty("user.dir")
	installdir = utils.stringReplace(installdir,'\\','\/')
	var uuid =application.getNewUUID()
	var filename = uuid+'.pdf'
	var filepath = installdir+'/server/webapps/ROOT/'+filename
	var success = plugins.file.writeFile(filepath,mediafield)
	if (success) {
		application.showURL('/'+filename,'_self')
	}
}
*/
}

/**
 *
 * @properties={typeid:24,uuid:"422431ed-d24b-4f08-9f47-89da1d3d4c7b"}
 */
function CODE_highlight_off(formName)
{

/*
 *	TITLE    :	CODE_highlight_off
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	turn off highlighter for selected field
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	'highlighter element' on form
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	Nov 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

//get form with highlighter
formName = (arguments[0]) ? arguments[0] : application.getMethodTriggerFormName()

//hide highlighter(s) if they exist
var highlight = 'highlighter' // name of highlighter object
if (forms[formName].elements[highlight]) {
	forms[formName].elements[highlight].visible = false
}

highlight = 'highlighter2' // name of highlighter object
if (forms[formName].elements[highlight]) {
	forms[formName].elements[highlight].visible = false
}
}

/**
 *
 * @properties={typeid:24,uuid:"1cb4856c-317b-4bd0-acc5-1ffe6d18a3fc"}
 */
function CODE_highlight_on()
{

/*
 *	TITLE    :	CODE_highlight_on
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	turn on highlighter for selected field
 *			  	
 *	INPUT    :	
 *			  	
 *	REQUIRES :	calling element to be named, 'highlighter element' on form, z-axis to be set appropriately for highlighter (behind all fields, in front of all other objects)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	MODIFIED :	Nov 5, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

//get field to be surrounded
var elemName = application.getMethodTriggerElementName()
var formName = application.getMethodTriggerFormName()

//get location and size of field to be surrounded
var fldLocationX = forms[formName].elements[elemName].getLocationX()
var fldLocationY = forms[formName].elements[elemName].getLocationY()
var fldSizeX = forms[formName].elements[elemName].getWidth()
var fldSizeY = forms[formName].elements[elemName].getHeight()

//surround
var highlight = 'highlighter' // name of highlighter object
forms[formName].elements[highlight].setLocation(fldLocationX-3,fldLocationY-3)
forms[formName].elements[highlight].setSize(fldSizeX+6,fldSizeY+5)
forms[formName].elements[highlight].visible = true
highlight = 'highlighter2' // name of highlighter object
forms[formName].elements[highlight].setLocation(fldLocationX-5,fldLocationY-5)
forms[formName].elements[highlight].setSize(fldSizeX+10,fldSizeY+8)
forms[formName].elements[highlight].visible = true

//request focus of element
forms[formName].elements[elemName].requestFocus(false)
}

/**
 *
 * @properties={typeid:24,uuid:"3499217c-ddf4-42dd-8720-dbca10cfd6af"}
 */
function CODE_java_component()
{

/*
 *	TITLE    :	CODE_java_component
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	returns the java componenet for calling/passed in element
 *			  	
 *	INPUT    :	(optional) element to do deep magic on
 *			  	
 *	OUTPUT   :	java component or false if no element could be found
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CODE_java_component([elemName]) Returns the java componenet of any servoy element
 *			  	
 *	MODIFIED :	September 1, 2008 -- Matt and James, adBlocks
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

//element passed
var elem = arguments[0]

//nothing passed, try to get from where called
if (!elem) {
	var formName = application.getMethodTriggerFormName()
	var elemName = application.getMethodTriggerElementName()
	
	if (formName && elemName && forms[formName] && forms[formName].elements[elemName]) {
		var elem = forms[formName].elements[elemName]
	}
}

//we have something, Scotty, where's my flux capacitor?  hmmm, wait a minute.... 
if (elem) {
	return new Packages.java.lang.ref.SoftReference(elem).get()
}
else {
	return false
}


}

/**
 *
 * @properties={typeid:24,uuid:"b1c0974f-1864-4262-9d1b-d9ee2a9a9066"}
 */
function CODE_jsevent_remove()
{
	var item = arguments[0]

	if (item instanceof JSEvent) {
		return false
	}
	else {
		return true
	}

	//if (item &&
	//	typeof item.getElementName == 'func' + 'tion' &&
	//	typeof item.getFormName == 'func' + 'tion' &&
	//	typeof item.getModifiers == 'func' + 'tion' &&
	//	typeof item.getSource == 'func' + 'tion' &&
	//	typeof item.getTimestamp == 'func' + 'tion' &&
	//	typeof item.getType == 'func' + 'tion') {
	//	
	//	return false
	//}
	//else {
	//	return true
	//}
}

/**
 *
 * @properties={typeid:24,uuid:"add587a7-848f-4c93-ab60-9bd0bb99c33f"}
 */
function CODE_key_pressed()
{

/*
 *	TITLE    :	CODE_key_pressed
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	there are two modes of operation; the first mode is the default
 *			  		1- return the number of the last key pressed; no input
 *			  		2- return true/false if key (combination) pressed; input required
 *			  	
 *	INPUT    :	key (combination) -- valid choices are: shift, ctrl, meta, and alt; they may be strung together with a - separating them
 *			  	
 *	OUTPUT   :	true/false whether that key (combination) pressed
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: check out RDC when on a mac

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

var input = arguments[0]
var	keyPressed = application.getLastKeyModifiers()

//offset for pc/mac values
if (keyPressed >= 16) {
	keyPressed -= 16
}

//MODE 2: verify a supplied key combination was pressed
if (input) {
	var keyValue = input.split('-')
	var keyValues = new Object()
	var keys = 0
	
	//convert array to object
	for (var i = 0; i < keyValue.length; i++) {
		keyValues[keyValue[i]] = true
	}
	
	//shift key
	if (keyValues.shift) {
		keys += 1
	}
	//control key
	if (keyValues.ctrl) {
		keys += 2
	}
	//windows start / apple command / *nix meta
	if (keyValues.meta) {
		keys += 4
	}
	//windows alt / apple option
	if (keyValues.alt) {
		keys += 8
	}
	//none
	if (keys == 0) {
		keys = 'none'
	}
	
	//application.setStatusText(input + ((keys == keyPressed) ? ' was ' : ' was NOT ') + 'pressed')
	return keys == keyPressed
}
//MODE 1: return which key was pressed
else {
	//application.setStatusText('Key(s) pressed is/are: ' + keyPressed)
	return keyPressed
}






}

/**
 *
 * @properties={typeid:24,uuid:"c8e2c219-36de-45e6-aac0-44544e6420aa"}
 */
function CODE_method_rewrite()
{

/*
 *	TITLE    :	CODE_method_rewrite
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	overwrites one method with another
 *			  	WARNING: this only works in client
 *			  	NOTE: if you are creating methods on the fly, they must be created in the context where you will use them
 *			  	
 *	INPUT    :	1- old method
 *			  	2- new method
 *			  	
 *	OUTPUT   :	success boolean
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	January 7, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

var oldMethod = arguments[0]
var newMethod = arguments[1]

//method to overwrite is a Function and running in client
if (typeof newMethod == 'func' + 'tion' && application.getApplicationType() == 2) {
	var formName = oldMethod.__parent__._formname_
	var methodName = oldMethod._methodname_
	
	//overwrite old method with new
	if (formName) {
		forms[formName][methodName] = newMethod
		forms[formName][methodName]._methodname_ = methodName
	}
	else {
		globals[methodName] = newMethod
		globals[methodName]._methodname_ = methodName
	}
	
	//debugging
	//DIALOGS.showErrorDialog('Overwritten')
	return true
}
else {
	return false
}



}

/**
 *
 * @properties={typeid:24,uuid:"63e4da9e-40e3-4612-9488-7e9156b584bb"}
 */
function CODE_property_combobox(square,size,formName)
{

/*
 *	TITLE    :	CODE_property_combobox
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	modifies comboboxes on Mac Leopard
 *			  	
 *	INPUT    :	1- boolean to set square status
 *			  	2- size (regular, small, mini)
 *			  	3- form name to work on (optional)
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	October 6, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

square = (arguments[0]) ? arguments[0] : false
size = (arguments[1]) ? arguments[1] : 'small'
formName = (arguments[2]) ? arguments[2] : application.getMethodTriggerFormName()

//only modifies when running on OS X Leopard, and using the Aqua look and feel
if (application.__parent__.solutionPrefs && 
	(solutionPrefs.clientInfo.typeOS == 'Mac OS X' && solutionPrefs.clientInfo.typeLAF == 'Mac OS X' && solutionPrefs.clientInfo.verOS >= '10.5' && solutionPrefs.clientInfo.verServoy >= '3.5.7' && solutionPrefs.clientInfo.typeServoy != 'webclient') ||
	(application.getOSName() == 'Mac OS X' && application.getCurrentLookAndFeelName() == 'Mac OS X' && ((plugins.sutra) ? plugins.sutra.getOSVersion() : '0') >= '10.5' && application.getVersion() >= '3.5.7' && application.getApplicationType() != 5)) {
	
	if (forms[formName]) {
		var allElems = forms[formName].elements.allnames
		
		for (var i = 0; i < allElems.length; i++) {
			var elemType = (forms[formName].elements[allElems[i]].getElementType) ? forms[formName].elements[allElems[i]].getElementType() : ''
			
			//it's a combobox
			if (elemType == 'COMBOBOX') {
				if (square) {
					forms[formName].elements[allElems[i]].putClientProperty('JComboBox.isSquare',true)
				}
				else if (size) {
					//valid options: regular, small, mini
					forms[formName].elements[allElems[i]].putClientProperty('JComponent.sizeVariant',size)
				}
			}
		}
	}
}

//webclient also gets mini (messes up anchoring)
//if (size == 'mini' && application.__parent__.solutionPrefs && solutionPrefs.config.webClient) {
//	if (forms[formName]) {
//		var allElems = forms[formName].elements.allnames
//		
//		for (var i = 0; i < allElems.length; i++) {
//			var elemType = (forms[formName].elements[allElems[i]].getElementType) ? forms[formName].elements[allElems[i]].getElementType() : ''
//			
//			//it's a combobox
//			if (elemType == 'COMBOBOX') {
//				//valid options: regular, small, mini
//				forms[formName].elements[allElems[i]].setLocation(forms[formName].elements[allElems[i]].getLocationX(),forms[formName].elements[allElems[i]].getLocationY() + 1)
//				forms[formName].elements[allElems[i]].setSize(forms[formName].elements[allElems[i]].getWidth(),forms[formName].elements[allElems[i]].getHeight()-3)
//			}
//		}
//	}
//}


}

/**
 *
 * @properties={typeid:24,uuid:"a20c13c8-fc76-456f-ba90-cbe36521a4c6"}
 */
function CODE_record_duplicate()
{

	/*
	 *	TITLE    :	CODE_record_duplicate
	 *			  	
	 *	MODULE   :	rsrc_CODE_sutra
	 *			  	
	 *	ABOUT    :	create a duplicate of record, and optionally all children
	 *			  	
	 *	INPUT    :	1- a record from some foundset
	 *			  	2- array of relations to copy through
	 *			  	3- overwrite array (from autoenter/relations/etc) with values from copying record
	 * 					- array of arrays with info about which columns to overwrite
	 *			  	4- option to disable autosave
	 *			  	
	 *	OUTPUT   :	new parent record
	 *			  	
	 *	REQUIRES :	
	 *			  	
	 *	USAGE    :	CODE_record_duplicate(record, [relationArray], [overwrite]) Duplicates a record and (optionally) all children
	 *			  	
	 *	MODIFIED :	August 23, 2010 -- Troy Elliott, Data Mosaic
	 *			  	
	 */

	//first, create object of relations
	//under each relation, put all the child relations
	//loop through it that way

	//MEMO: need to somehow put this section in a Function of it's own
	//running in Tano...strip out jsevents for now
	if (utils.stringToNumber(application.getVersion()) >= 5) {
		//cast Arguments to array
		var Arguments = new Array()
		for (var i = 0; i < arguments.length; i++) {
			Arguments.push(arguments[i])
		}

		//reassign arguments without jsevents
		arguments = Arguments.filter(CODE_jsevent_remove)
	}

	var srcRecord = arguments[0]
	var relationArray = arguments[1]
	if (arguments[2] instanceof Array) {
		var overwriteOK = arguments[2]
		
		//ensure there are enough items in overwrite
		for (var i = overwriteOK.length; i <= relationArray.length; i++) {
			overwriteOK[i] = null
		}
	}
	else {
		var overwriteOK = new Array()

		for (var i = 0; i <= relationArray.length; i++) {
			overwriteOK[i] = (arguments[2]) ? true : false
		}
	}
	var noSave = arguments[3]

	//object to store all relations
		//tree required for construction
	var relations = 
		tree = new Object()
	var tree

	//something was passed in
	if (srcRecord) {

		//if relations, convert array into object tree
		if (relationArray && relationArray.length) {
	//		relationArray.sort()

			//split up compound relations
			for (var i = 0; i < relationArray.length; i++) {
				var item = relationArray[i]

				//multiple levels of relations
				if (utils.stringPatternCount(item,'.')) {
					item = item.split('.')
				}
				//nothing to do, skip this iteration
				else if (!item) {
					continue
				}
				//one relation
				else {
					item = new Array(item)
				}

				//add all items to tree
				for (var j = 0; j < item.length; j++) {
					//no place holder for this object yet
					if (!tree[item[j]]) {
						tree[item[j]] = {
											_relation_ : item[j]
										}

						//punch down position of this item
						if (!tree.length) {
							tree.length = 1
						}
						else {
							tree.length++
						}

						//punch down name of this position
						tree[tree.length - 1] = item[j]
					}

					//on final branch, tag on overwrite rules
					if (j + 1 == item.length) {
						tree[item[j]].overwrite = overwriteOK[i + 1]
					}				

					//set tree to newly created item
					tree = tree[item[j]]
				}

				//reset tree for next go round
				tree = relations
			}
		}



		//get foundset of source record
		var serverName = srcRecord.foundset.getServerName()
		var tableName = srcRecord.foundset.getTableName()
		var fsThis = databaseManager.getFoundSet(serverName,tableName)

		//create duplicate record and copy data
		var destRecord = fsThis.getRecord(fsThis.newRecord(false,true))
		databaseManager.copyMatchingColumns(srcRecord,destRecord,overwriteOK[0] || false)

		//go through relations and duplicate sub-records
		for (var i = 0; i < relations.length; i++) {
			//this relation has multiple levels of children
			CODE_record_duplicate_fx(srcRecord,destRecord,relations[relations[i]])
		}

		if (!noSave) {
			databaseManager.saveData()
		}
		
		return destRecord
	}
}

/**
 *
 * @properties={typeid:24,uuid:"2AA00BD2-E0CB-4016-80FB-DA1E12AF1381"}
 */
function CODE_data_export() {
	// here we call the record duplicate method with a special parameter that returns the data that would have been exported
	
}

/**
 *
 * @properties={typeid:24,uuid:"a0a3989c-ff49-49af-9e7e-55b81fc75ab1"}
 */
function CODE_record_duplicate_fx()
{

/*
 *	TITLE    :	CODE_record_duplicate_fx
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	create a duplicate of record, and optionally all children
 *			  	
 *	INPUT    :	1- source record
 *			  	2- destination record
 *			  	3- object of relations
 *			  	4- overwrite bool
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CODE_record_duplicate_fx(sourceRecord, destinationRecord, subRelationArray, objectRecord, [overwrite]) Duplicates all children
 *			  	
 *	MODIFIED :	August 23, 2010 -- Troy Elliott, Data Mosaic
 *			  	
 */

var srcRecord = arguments[0]
var destRecord = arguments[1]
var node = arguments[2]
var overwriteOK = node.overwrite || false

var serverName = srcRecord.foundset.getServerName()
var tableName = srcRecord.foundset.getTableName()

var fsSource = eval('srcRecord.' + node._relation_)
var fsDest = eval('destRecord.' + node._relation_)

if (fsSource && utils.hasRecords(fsSource)) {
	//go through children, call 
	for (var i = 1; i <= fsSource.getSize(); i++) {
		//create duplicate record
		var srcChild = fsSource.getRecord(i)
		var destChild = fsDest.getRecord(fsDest.newRecord(false,true))

		databaseManager.copyMatchingColumns(srcChild,destChild,overwriteOK)

		//re-call this Function if there are more levels beneath
		for (var j = 0; j < node.length; j++) {
			CODE_record_duplicate_fx(srcChild,destChild,node[node[j]])
		}
	}
}

}

/**
 *
 * @properties={typeid:24,uuid:"d8058130-d708-4d6a-b380-aa155713f1c8"}
 */
function CODE_record_object()
{

/*
 *	TITLE    :	CODE_record_object
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	1- a record from some foundset
 *			  	2- omit null values (optional)
 *			  	3- omit unstored calculations (optional)
 *			  	4- array of columns to omit (optional)
 *			  	
 *	OUTPUT   :	object with all info about record passed in
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CODE_record_object(record, [omitNull], [omitUnstoredCalc]) Creates an object representation of a record
 *			  	
 *	MODIFIED :	November 13, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: foundsets gotten through any other way then just from a table don't have a prototype

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

var record = arguments[0]
var omitNull = arguments[1]
var omitCalc = arguments[2]
var omitSpecify = arguments[3]

var returnObj = new Object()

//get list of calcs
if (omitCalc) {
	var omitColumns = new Object()
	
	//only run in less than 4
	if (utils.stringToNumber(application.getVersion()) < 4) {
		//hack to make omitCalc work on navigation_item and action_item tables
		if (record.foundset.__proto__ == undefined) {
			var serverName = record.foundset.getServerName()
			var tableName = record.foundset.getTableName()
			//var recordFS = databaseManager.getFoundSet(serverName, tableName)
			
			if (tableName == 'sutra_navigation_item') {
				var recordFS = forms.NAV_R_navigation_item.foundset
			}
			else if (tableName == 'sutra_action_item') {
				var recordFS = forms.NAV_R_action_item.foundset
			}
			else {
				var recordFS = {__proto__ : null}
			}
		}
		else {
			var recordFS = record.foundset
		}
		
		//does this table have calcs?
		if (recordFS.__proto__ != undefined) {
			for (var i in recordFS.foundset.__proto__) {
				omitColumns[i] = 'Calculation'
			}
			
			//get db columns
			var table = databaseManager.getTable(record.foundset.getServerName(),record.foundset.getTableName())
			var columnNames = table.getColumnNames()
			
			//remove calcs that have a column
			for (var i = 0; i < columnNames.length; i++) {
				if (omitColumns[columnNames[i]]) {
					omitColumns[columnNames[i]] = null
				}
			}
		}
	}
}

//there are more columns to omit
if (omitSpecify && omitSpecify.length) {
	if (!omitColumns) {
		var omitColumns = new Object()
	}

	for (var i = 0; i < omitSpecify.length; i++) {
		omitColumns[omitSpecify[i]] = 'User omitted'
	}
}

for (var i in record) {
	//omitNull and omitCalc options, record level functions (check if date/array so doesn't hiccup)
	if (!(omitNull && record[i] == null) && !(omitColumns && omitColumns[i]) && (record[i] instanceof Date || record[i] instanceof Array) || typeof record[i] != 'func' + 'tion') {
		var display = CODE_text_camel_caps(i,'_')
		returnObj[display] = record[i]
	}
}

return returnObj


}

/**
 * @properties={typeid:24,uuid:"e4cac4d3-9c81-4dce-b624-dcbc788c8cbf"}
 */
function CODE_row_background(index, selected, fieldType, fieldName, formName, fieldState)
{

//	//if empty, make it red
//	if (!fieldState[fieldName]) {
//		return "#FF0000"
//	}
	
	//highlight selected record
	if (CODE_row_background__highlight.status && CODE_row_background__highlight.status() && 
		CODE_row_background__highlight.form && formName == CODE_row_background__highlight.form()) {
		
		//white/tan with green highlighter
		if (selected) {
			return '#B6E6B6'
		}
		else {
			if (index % 2 == 0) {
				return '#F7F8EF'
			}
			else {
				return '#FFFFFF'
			}
		}
	}
	//normal highlighting
	else {
		//white/tan with medium blue highlighter
		if (selected) {
			return '#BED7F7'
		}
		else {
			if (index % 2 == 0) {
				return '#F7F8EF'
			}
			else {
				return '#FFFFFF'
			}
		}
	}
}

/**
 * @properties={typeid:24,uuid:"cd3e2c07-479b-423d-90e6-8f8134ec6c9c"}
 */
function CODE_row_background__filter() {
	//always bluish...even selected
	return '#A1B0CF'
}

/**
 *
 * @properties={typeid:24,uuid:"e559f8ea-8821-43d7-bfe8-8eb5d975988c"}
 */
function CODE_search_array()
{

/*
 *	TITLE    :	CODE_search_array
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	returns an array of positions where an element is found in an array
 *			  	
 *	INPUT    :	1- array
 *			  	2- value to find
 *			  	
 *	OUTPUT   :	position(s) of found element
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 18, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

var array = arguments[0]
var searchValue = arguments[1]
var returnArray = false

for (var i = 0; i < array.length; i++) {
	if (typeof(searchValue) == 'func' + 'tion') {
		if (searchValue.test(array[i])) {
			if (!returnArray) {
				returnArray = []
			}
			returnArray.push(i)
		}
	}
	else {
		if (array[i] === searchValue) {
			if (!returnArray) {
				returnArray = []
			}
			returnArray.push(i)
		}
	}
}

return returnArray

}

/**
 *
 * @properties={typeid:24,uuid:"99717390-3f56-4ec2-85b0-c76c1163c0ab"}
 */
function CODE_search_object_array()
{

/*
 *	TITLE    :	CODE_search_object_array
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	returns the position of an element (arg[1]) in an array of objects (arg[0])
 *			  	-1 means not in array
 *			  	
 *	INPUT    :	array of objects, value to find, property to search
 *			  	
 *	OUTPUT   :	position of found element
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

var arraySort = arguments[0]
var elementFind = arguments[1]
var searchIn = arguments[2]

if (elementFind) {
	for (var i = 0 ; i < arraySort.length ; i++) {
		if (arraySort[i][searchIn] == elementFind) {
			//position of element in array
			return i
		}
	}
}
else {
	//element is null
	return null
}

//element is not in array
return -1

}

/**
 *
 * @properties={typeid:24,uuid:"bd1590f7-f7f9-4f02-9545-37d98bc963ac"}
 */
function CODE_sort_dd_array()
{

/*
 *	TITLE    :	CODE_sort_dd_array
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	sorts multi-D array on the field/element of internal array
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	globals.CODE_ddarray_field to have valid property name, called as parameter to sort routine
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */	//TODO: globals.CODE_ddarray_field can be multiple fields

var a = arguments[0]
var b = arguments[1]

var fieldName = CODE_ddarray_field
var direction = new Array()
switch (CODE_ddarray_sort) {
	case 'asc':
		direction[0] = -1
		direction[1] = 1
		break
	case 'desc':
		direction[0] = 1
		direction[1] = -1
		break
}

var x = a[fieldName] //.toLowerCase()
var y = b[fieldName] //.toLowerCase()

return ((x < y) ? direction[0] : ((x > y) ? direction[1] : 0))

}

/**
 *
 * @properties={typeid:24,uuid:"52eba58a-6d15-48bf-968d-b99a5f7b7c6f"}
 */
function CODE_sort_numeric()
{

/*
 *	TITLE    :	CODE_sort_numeric
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	sorts an array in numerical order
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	called as parameter to sort routine
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

var a = arguments[0]
var b = arguments[1]

return ((a < b) ? -1 : ((a > b) ? 1 : 0))
}

/**
 *
 * @properties={typeid:24,uuid:"85d559f7-1292-49cb-ab12-7bb40e05ecd8"}
 */
function CODE_text_camel_caps()
{

/*
 *	TITLE    :	CODE_text_camel_caps
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	returns camel caps of what is passed
 *			  	
 *	INPUT    :	1) text to be operated on
 *			  	2) regex describing dividing character (optional)
 *			  	
 *	OUTPUT   :	reformatted text
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Jun 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

var stringOrig = arguments[0]
var divider = (arguments[1]) ? arguments[1] : /\s/

var reference = new Array('Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine')
var whiteSpace = divider
var stringTemp = stringOrig.split(whiteSpace)
whiteSpace = /(\S)(\S+)/

//initial word is lower case
if (stringTemp.length) {
	stringTemp[0] = stringTemp[0].toLowerCase()
}

//remaining words are upper case
for (var i = 1; i < stringTemp.length; i++) {
	var stringWord = stringTemp[i]
	
	//if string is a number, change to word representation
	if (utils.stringToNumber(stringWord.charAt(0)) == stringWord.charAt(0)) {
		stringWord = reference[utils.stringToNumber(stringWord.charAt(0))] + stringWord.slice(1)
	}
	
	whiteSpace.exec(stringWord)
	stringTemp[i] = RegExp.$1.toUpperCase() + RegExp.$2.toLowerCase()
}

return stringTemp.join('')





}

/**
 *
 * @properties={typeid:24,uuid:"befe06f8-7983-489d-94e5-000ecb067c1f"}
 */
function CODE_text_initial_caps()
{

/*
 *	TITLE    :	CODE_text_initial_caps
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	returns initial caps of what is passed
 *			  	
 *	INPUT    :	text to be operated on
 *			  	
 *	OUTPUT   :	reformatted text
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Jun 1, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

var stringOrig = arguments[0]

var whiteSpace = /\s/
var stringTemp = stringOrig.split(whiteSpace)
whiteSpace = /(\S)(\S+)/

for (var i = 0; i < stringTemp.length; i++) {
	whiteSpace.exec(stringTemp[i])
	stringTemp[i] = RegExp.$1.toUpperCase() + RegExp.$2.toLowerCase()
}

return stringTemp.join(' ')

/*
var stringTemp = stringOrig.toLowerCase()
var stringLength = stringTemp.length

if (stringLength > 0)  {
	for (var index = 0 ; index < stringLength ; index++)  {
		if (index == 0)  {
			var stringChar = stringTemp.substring(0,1).toUpperCase()
			var stringPost = stringTemp.substring(1,stringLength)
			stringTemp = stringChar + stringPost
		}
		else {
			stringChar = stringTemp.substring(index, index+1)
			if (stringChar == " " && index < (stringLength-1))  {
				stringChar = stringTemp.substring(index+1, index+2).toUpperCase()
				var stringPre = stringTemp.substring(0, index+1)
				stringPost = stringTemp.substring(index+2,stringLength)
				stringTemp = stringPre + stringChar + stringPost
			}
		}
	}
}

return stringTemp
*/





}

/**
 *
 * @properties={typeid:24,uuid:"5c99cda3-c6b3-4bc9-a0f3-230b6f949392"}
 */
function CODE_url_handler()
{

/*
 *	TITLE    :	CODE_url_handler
 *			  	
 *	MODULE   :	rsrc_CODE_sutra
 *			  	
 *	ABOUT    :	opens the first argument passed
 *			  	
 *	INPUT    :	email address or website
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CODE_url_handler(weblocation) Opens web location using the default platform viewer
 *			  	
 *	MODIFIED :	Mar 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */ 

//url to navigate to
var webloc = arguments[0]
// _top _blank, etc options
var wcOpen = arguments[1]
// open in lightbox
var lightbox = arguments[2]

if (!wcOpen) {
	wcOpen = (application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.webClient) ? '_top' : null
}

if (webloc) {
	var email = utils.stringPatternCount(webloc,'@') && !utils.stringPatternCount(webloc,'://')
	
	//email
	if (email) {
		application.showURL('mailto:'+webloc,'_self')
	}
	//http
	else {
		webloc = utils.stringPatternCount(webloc,'://') ? webloc : 'http://' + webloc
			
		//lightbox requested and minimum requirements met
		if (lightbox && application.__parent__.solutionPrefs && solutionPrefs.config && solutionPrefs.config.webClient && globals.DATASUTRA_router_enable) {
			plugins.WebClientUtils.executeClientSideJS('window.parent.urlLoad("' + webloc + '");')
		}
		else {
			if (utils.stringPatternCount(webloc,'://')) {
				application.showURL(webloc,wcOpen)
			}
			else {
				application.showURL(webloc,wcOpen)
			}
		}
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"d300a03a-be45-4966-8b02-7bf1de59b511"}
 */
function CODE_workspace_data()
{
//	 *	INPUT    :	1- true to create a unique copy (non-reference) of everything; used when creating static object

	var tano = (Math.floor(utils.stringToNumber(application.getVersion())) >= 5) ? true : false
	
	var nonRef = arguments[0]
	
	var vlForm = new Object()
	var vlReln = new Object()
	var formsByTable = new Object()
	formsByTable['No datasource'] = new Object()
	
	var workspace = plugins.sutra.getWorkspace().substr(5)
	var modules = plugins.file.getFolderContents(workspace, null, 2)
	
	
	//loop over all modules and find the currently activated one
	for (var i = 0; i < modules.length; i++) {
		var module = modules[i]
		if (module.getName() == application.getSolutionName()) {
			var parentModule = module
			
			//get child modules to loop over
			var settings = plugins.file.readTXTFile(parentModule.getAbsolutePath() + '/solution_settings.obj')
			
			settings = settings.split(',\n')
			
			for (var k = 0; k < settings.length; k++) {
				if (utils.stringPosition(settings[k], 'modulesNames:"', 0, 1) == 1) {
					var childModules = settings[k].substring(14,settings[k].length - 1)
					childModules = childModules.split(',')
					
					//tack on parent module
					childModules.unshift(parentModule.getName())
					break
				}
			}
			
			break
		}
	}
	
	for (var i = 0; i < modules.length; i++) {
		var module = modules[i]
		
		//check to make sure that we're only working with child modules
//		if (childModules && childModules.indexOf(module.getName()) == -1) {
//			continue
//		}
		
		//var contents = plugins.file.getFolderContents(module)
		
		if (tano) {
			var theForms = plugins.file.getFolderContents(module.getAbsolutePath() + '/forms', '.frm', 1)
			var theRelations = plugins.file.getFolderContents(module.getAbsolutePath() + '/relations', '.rel', 1)
		}
		else {
			var theForms = plugins.file.getFolderContents(module.getAbsolutePath() + '/forms', '.obj', 1)
			var theRelations = plugins.file.getFolderContents(module.getAbsolutePath() + '/relations', '.obj', 1)
		}
		
		//if this 'module' has forms, proceed
		if (theForms.length) {
			//create container
			vlForm[module.getName()] = new Object()
			
			//fill it
			for (var j = 0; j < theForms.length; j++) {
				var thisForm = theForms[j]
				var nameForm = thisForm.getName().substr(0,thisForm.getName().length - 4)
				
				var aboutForm = plugins.file.readTXTFile(thisForm)
				
				//get rid of sub-items
				if (tano) {
					//this is the non-js regex... items:\[.*],
					aboutForm = aboutForm.replace(/items:\[[\s\S]*],\n/,'')
				}
				
				aboutForm = aboutForm.split(',\n')
				
				var formUUID = null
				var nameServer = null
				var nameTable = null
				var sizeForm = null
				var typeForm = null
				var separateFS = null
				
				for (var k = 0; k < aboutForm.length; k++) {
					if (utils.stringPosition(aboutForm[k], 'uuid:"', 0, 1) == 1) {
						var formUUID = aboutForm[k].substring(6,aboutForm[k].length - 1)
					}
					else if (utils.stringPosition(aboutForm[k], 'serverName:"', 0, 1) == 1) {
						var nameServer = aboutForm[k].substring(12,aboutForm[k].length - 1)
					}
					else if (utils.stringPosition(aboutForm[k], 'tableName:"', 0, 1) == 1) {
						var nameTable = aboutForm[k].substring(11,aboutForm[k].length - 1)
					}
					else if (utils.stringPosition(aboutForm[k], 'size:"', 0, 1) == 1) {
						var sizeForm = aboutForm[k].substring(6,aboutForm[k].length - 1)
					}
					else if (utils.stringPosition(aboutForm[k], 'view:', 0, 1) == 1) {
						var typeForm = aboutForm[k].substring(5,aboutForm[k].length)
					}
					else if (utils.stringPosition(aboutForm[k], 'useSeparateFoundSet:', 0, 1) == 1) {
						var separateFS = (aboutForm[k].substring(20,aboutForm[k].length) == 'true') ? true : false 
					}
					else if (utils.stringPosition(aboutForm[k], 'dataSource:', 0, 1) == 1) {
						var sections = aboutForm[k].split('/')
						
						var nameServer = sections[1]
						var nameTable = sections[2].substring(0,sections[2].length - 1)
					}
				}
				
				var formInfo = {
					moduleName : module.getName(),
					formName   : nameForm,
					elementID  : formUUID,
					useSeparateFoundset : ((separateFS) ? true : false),
					serverName : nameServer,
					tableName  : nameTable,
					formType  : (typeForm) ? typeForm : 0,
					formSize  : sizeForm
				}
				
				//add form to its parent module
				vlForm[module.getName()][nameForm] = formInfo
				
				//add to table view also
				
				
				//this is a form without a table
				if (!formInfo.serverName && !formInfo.tableName) {
					//add form
					if (nonRef) {
						formsByTable['No datasource'][formInfo.formName] = CODE_copy_object(formInfo)
					}
					//only used in developer
					else {
						formsByTable['No datasource'][formInfo.formName] = formInfo
					}
				}
				//form with a table
				else {
					//add server if not encountered before
					if (!formsByTable[formInfo.serverName]) {
						formsByTable[formInfo.serverName] = new Object()
					}
					
					//add table if not encountered before
					if (!formsByTable[formInfo.serverName][formInfo.tableName]) {
						formsByTable[formInfo.serverName][formInfo.tableName] = new Object()
						
						//punch in pk info
						var jsTable = databaseManager.getTable(formInfo.serverName,formInfo.tableName)
						
						//possible to have db server offline for solutions
						if (jsTable) {
							var pkCols = jsTable.getRowIdentifierColumnNames()
							//MEMO: does not account for multiple primary keys on a table
							formsByTable[formInfo.serverName][formInfo.tableName].primaryKey = pkCols[0]
						}
					}
					
					//add form
					if (nonRef) {
						formsByTable[formInfo.serverName][formInfo.tableName][formInfo.formName] = CODE_copy_object(formInfo)
					}
					//only used in developer
					else {
						formsByTable[formInfo.serverName][formInfo.tableName][formInfo.formName] = formInfo
					}
				}
			}
			
		}
		
		//if this 'module' has relations, proceed
		if (theRelations.length) {
//			//create container if not already existing
//			if (!vlForm[module.getName()]) {
//				vlForm[module.getName()] = new Object()
//			}
			
			//fill it
			for (var j = 0; j < theRelations.length; j++) {
				var thisRelation = theRelations[j]
				var nameRelation = thisRelation.getName().substr(0,thisRelation.getName().length - 4)
				
				var aboutRelation = plugins.file.readTXTFile(thisRelation)
				aboutRelation = aboutRelation.split(',\n')
				
				var relnUUID = null
				var priServer = null
				var priTable = null
				var foreignServer = null
				var foreignTable = null
				var createRelatedRecords = null
				var deleteRelatedRecords = null
				var allowParentDelete = null
				var joinTypes = null
//				var existsInDB = null
//				var duplicateRelatedRecords = null
				var sortOptions = null
				
				for (var k = 0; k < aboutRelation.length; k++) {
					if (utils.stringPosition(aboutRelation[k], 'uuid:"', 0, 1) == 1) {
						var relnUUID = aboutRelation[k].substring(6,aboutRelation[k].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'primaryServerName:"', 0, 1) == 1) {
						var priServer = aboutRelation[k].substring(19,aboutRelation[k].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'primaryTableName:"', 0, 1) == 1) {
						var priTable = aboutRelation[k].substring(18,aboutRelation[k].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'foreignServerName:"', 0, 1) == 1) {
						var foreignServer = aboutRelation[k].substring(19,aboutRelation[k].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'foreignTableName:"', 0, 1) == 1) {
						var foreignTable = aboutRelation[k].substring(18,aboutRelation[k].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'allowCreationRelatedRecords:', 0, 1) == 1) {
						var createRelatedRecords = (aboutRelation[k].substring(28,aboutRelation[k].length) == 'true') ? true : false 
					}
					else if (utils.stringPosition(aboutRelation[k], 'deleteRelatedRecords:', 0, 1) == 1) {
						var deleteRelatedRecords = (aboutRelation[k].substring(21,aboutRelation[k].length) == 'true') ? true : false 
					}
					else if (utils.stringPosition(aboutRelation[k], 'allowParentDeleteWhenHavingRelatedRecords:', 0, 1) == 1) {
						var allowParentDelete = (aboutRelation[k].substring(42,aboutRelation[k].length) == 'true') ? true : false 
					}
					else if (utils.stringPosition(aboutRelation[k], 'joinType:', 0, 1) == 1) {
						var joinTypes = aboutRelation[k].substring(9,aboutRelation[k].length)
					}
					else if (utils.stringPosition(aboutRelation[k], 'initialSort:"', 0, 1) == 1) {
						var sortOptions = aboutRelation[k].substring(13,aboutRelation[k].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'foreignDataSource:', 0, 1) == 1) {
						var sections = aboutRelation[k].split('/')
						
						var foreignServer = sections[1]
						var foreignTable = sections[2].substring(0,sections[2].length - 1)
					}
					else if (utils.stringPosition(aboutRelation[k], 'primaryDataSource:', 0, 1) == 1) {
						var sections = aboutRelation[k].split('/')
						
						var priServer = sections[1]
						var priTable = sections[2].substring(0,sections[2].length - 1)
					}					
				}
				
				//check to be sure that relation has a name
				if (nameRelation != null) {
					
					//add server if not encountered before
					if (!vlReln[priServer]) {
						vlReln[priServer] = new Object()
					}
					
					//add table if not encountered before
					if (!vlReln[priServer][priTable]) {
						vlReln[priServer][priTable] = new Object()
					}
					
					//add relation
					var relationInfo = 
					vlReln[priServer][priTable][nameRelation] = 
					{
						moduleName : module.getName(),
						relation   : nameRelation,
						elementID  : relnUUID,
						source     : {
								server	: priServer,
								table	: priTable
							},
						destination: {
								server	: foreignServer,
								table	: foreignTable
							},
						options    : {
								createRelated : (createRelatedRecords) ? true : false,
								deleteRelated : (deleteRelatedRecords) ? true : false,
								parentDelete  : (allowParentDelete || allowParentDelete == null) ? true : false
							},
						joinType   : (joinTypes) ? 'left outer join' : 'inner join',
//						indexesInDB: (existsInDB) ? true : false,
						misc       : {
								sort             : (sortOptions) ? sortOptions : null //,
//								duplicateRelated : (duplicateRelatedRecords) ? true : false
							}
					}
				}	
			}
		}
	}
	
	//save it
		if (application.__parent__.solutionPrefs && solutionPrefs.repository && solutionPrefs.repository.workspace && 
			((/*nonRef &&*/ (solutionPrefs.clientInfo.typeServoy == 'developer' || solutionPrefs.clientInfo.typeServoy == 'web client developer')) ? true : false)
			) {
		solutionPrefs.repository.workspace = vlForm
		solutionPrefs.repository.relations = vlReln
		solutionPrefs.repository.allFormsByTable = formsByTable
	}
	
//	//set module value list
//	var modulesDistinct = new Array()
//	for (var i in solutionPrefs.repository.workspace) {
//		modulesDistinct.push(i)
//	}
//	modulesDistinct.sort()
//	
//	application.setValueListItems('NAV_modules_included', modulesDistinct)
}

/**
 *
 * @properties={typeid:24,uuid:"de7a768b-3390-49df-a841-7e0f875ea419"}
 */
function CODE_workspace_module()
{

/*
 *	TITLE    :	CODE_workspace_module
 *			  	
 *	MODULE   :	rsrc_CODE_serclipse
 *			  	
 *	ABOUT    :	read in modules included
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CODE_workspace_module()
 *			  	
 *	MODIFIED :	November 18, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(CODE_jsevent_remove)
}

//if, by some chance, this method is run outside of the wrapper, instantiate my global baby
if (! application.__parent__.repositoryPrefs) {
	repositoryPrefs = {
			allModules: new Array(),
			allForms: new Object(),
			allFormsByTable: new Object(),
			relations: new Object()
	}
}

//the workspace
var workspace = plugins.sutra.getWorkspace().substr(5)

//what solution is open/passed in
var soln = arguments[0] || [application.getSolutionName()]

//return if nothing passed
if (!soln.length) {
	return
}

//if multiple modules, loop and process each input
outerloop:
for (var i = 0 ; i < soln.length; i++) {
	
	//loop through currently added modules, break out of recursion if this module already added
	for (var j = 0 ; j < repositoryPrefs.allModules.length; j++) {
		if (soln[i] == repositoryPrefs.allModules[j]) {
			continue outerloop
		}
	}
	
	//store parent module
	repositoryPrefs.allModules.push(soln[i])
	
	//get list of included modules
	var settingsObj = workspace + soln[i] + '/' + 'solution_settings.obj'
	
	//check if this 'solution' even has settings
	var jsFile = plugins.file.convertToJSFile(settingsObj)
	if (jsFile.exists()) {
		var solnSettings = plugins.file.readTXTFile(settingsObj)
		solnSettings = solnSettings.split('\n')
		
		var modules = null
		
		for (var k = 0; k < solnSettings.length; k++) {
			if (utils.stringPosition(solnSettings[k], 'modulesNames:"', 0, 1) == 1) {
				var modules = solnSettings[k].substring(14,solnSettings[k].length - 2)
				break
			}
		}
		
		//there are included modules, split and pass back to array
		if (modules) {
			modules = modules.split(',')
			
			//pass back modules to processoranator
			CODE_workspace_module(modules)
		}
	}
}

//break out unless top-level instance
if (soln[0] != application.getSolutionName()) {
	return
}

//sort array, remove duplicates
if (repositoryPrefs.allModules.length) {
	var modules = repositoryPrefs.allModules
	modules.sort()
	
	repositoryPrefs.allModules = new Array()
	for (var i = 0 ; i < modules.length ; i++) {
		if (modules[i] != modules[i+1]) {
			repositoryPrefs.allModules.push(modules[i])
		}
	}

	//store module names into valuelist
	application.setValueListItems('NAV_modules_included', repositoryPrefs.allModules)

}
}

/**
 * Reference to new method
 * @deprecated
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"B16736CE-B7ED-42A5-AAAA-93190A841940"}
 */
function TAB_btn_actions_list(event,arg1) {
	scopes.TAB.GRID_actions(event,arg1)
}

/**
 * Reference to new method
 * @deprecated
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"96825750-E40B-4C74-A8F4-5D03F0FEC951"}
 */
function TAB_btn_help(event,arg1) {
	scopes.TAB.GRID_help(event,arg1)
}

/**
 * Reference to new method
 * @deprecated
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"FACB9D45-A3DB-4A98-B18F-C3F1236E38E7"}
 */
function TAB_btn_rec_new(event,arg1) {
	scopes.TAB.GRID_new(event,arg1)
}

/**
 * Reference to new method
 * @deprecated
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7B91A5A9-3A3F-44B7-B1E8-2FC00B2A3D97"}
 */
function TAB_change_grid(event,arg2,arg3,arg4,arg5,arg6,arg7,arg8) {
	scopes.TAB.GRID_change(event,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
}

/**
 * Reference to new method
 * @deprecated
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8756E1DB-B872-45F5-BB9B-3C5F68560C59"}
 */
function TAB_change_grid_init(event,arg2,arg3,arg4,arg5,arg6,arg7,arg8) {
	scopes.TAB.GRID_init(event,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
}

/**
 * Reference to new method
 * @deprecated
 *
 * @param {String} formName
 * @param {String} elemName
 * @param {String} tabPanel
 * @param {String} prefix
 *
 * @properties={typeid:24,uuid:"CA58A6E0-7D8F-4AAC-9093-266DA7EAC6F8"}
 */
function TAB_change_inline(formName,elemName,tabPanel,prefix) {
	scopes.TAB.INLINE_change(formName,elemName,tabPanel,prefix)
}

/**
 * Reference to new method
 * @deprecated
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"70C1A10F-80DB-4F65-9DC7-5CFA837CB9DE"}
 */
function TAB_change_set(event,arg1) {
	scopes.TAB.SET_change(event,arg1)
}

/**
 * Navigates to the specified sidebar if it is available for the logged in user.
 * 
 * @param	{String}	sidebarName Sidebar name to jump to (defined in sidebar config "tab name").
 * @param 	{Boolean} 	[showSidebar] Force sidebar open/closed.
 * 
 * @returns	{Boolean}	Sidebar able to be changed.
 * 
 * @properties={typeid:24,uuid:"8EC7C55E-6B55-43D5-9693-897E32EA0884"}
 */
function TRIGGER_sidebar_set(sidebarName, showSidebar) {
	//solutionPrefs defined and frameworks not in a locked status
	if (application.__parent__.solutionPrefs && !solutionPrefs.config.lockStatus) {
	
		//only run when not in a preference
		if (!solutionPrefs.config.prefs.preferenceMode) {
			//offset will probably be different depending on help status
			var oldToolbar = solutionPrefs.panel.sidebar[forms.DATASUTRA__sidebar.elements.tab_content.tabIndex - 2].tabName
	
			var allToolbars = solutionPrefs.panel.sidebar
	
			//check to make sure that newToolbar is a valid input
			var found = false
			for (var i = 0; i < allToolbars.length && !found; i++) {
				if (allToolbars[i].tabName == sidebarName) {
					found = true
					break
				}
			}
	
			//destination toolbar is valid and different than current toolbar, change
			if (sidebarName != oldToolbar && found) {
				//should this by i or i+1?
				forms.DATASUTRA__sidebar__header.TAB_popdown(i + 1)
				
				//show sidebar if not currently expanded
				if (showSidebar && !solutionPrefs.screenAttrib.sidebar.status) {
					DS_sidebar_toggle(true)
				}
	
				return true
			}
			else {
	
				if (showSidebar && !solutionPrefs.screenAttrib.sidebar.status) {
					DS_sidebar_toggle(true)
				}
	
				return false
			}
		}
	}
}

/**
 * Hotkey shortcut to pop open the adBlocks console in a non-modal FiD.
 * 
 * @properties={typeid:24,uuid:"ea705c5e-0455-46df-a703-4f445937273c"}
 */
function _1() {
	forms.CODE_P__konsole.initialize()
	
	var	nHeight = cmdVarBin.windowSize.height
	var	nWidth = cmdVarBin.windowSize.width
	
	CODE_form_in_dialog(forms.CODE_P__konsole, 20, 50, nWidth, nHeight + 20, 'Servoy Konsole',  true,  false, 'KONSOLE', false)
}

/**
 * Helper method to insert Data Mosaic license in all javascript files.
 * 
 * @properties={typeid:24,uuid:"43FDEA90-D609-436A-8401-3153AEA868CE"}
 */
function CODE_license_insert() {
	//prompt for a workspace directory, go through all .js files and insert a block of text with licensing info at the top
	
	//generic verbage
	var thisYear = utils.dateFormat(new Date(),'yyyy')
	
	var licenseTop = "/**\n * @properties={typeid:35,uuid:\"DA7AE05A-1C00-"
	var licenseStuffing = "\"}\n */\nvar _license_"
	var licenseEnd = " = 'Data Sutra is everything you need to build a great app. \\\n\t\t\t\t\t\t\t\t\tCopyright (C) 2006 - " + thisYear + " Data Mosaic \\\n\t\t\t\t\t\t\t\t\t\\\n\t\t\t\t\t\t\t\t\tThis program is free software: you can redistribute it and/or modify \\\n\t\t\t\t\t\t\t\t\tit under the terms of the GNU Affero General Public License as \\\n\t\t\t\t\t\t\t\t\tpublished by the Free Software Foundation, either version 3 of the \\\n\t\t\t\t\t\t\t\t\tLicense, or (at your option) any later version. \\\n\t\t\t\t\t\t\t\t \t\\\n\t\t\t\t\t\t\t\t\tThis program is distributed in the hope that it will be useful, \\\n\t\t\t\t\t\t\t\t\tbut WITHOUT ANY WARRANTY; without even the implied warranty of \\\n\t\t\t\t\t\t\t\t\tMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the \\\n\t\t\t\t\t\t\t\t\tGNU Affero General Public License for more details. \\\n\t\t\t\t\t\t\t\t\t\\\n\t\t\t\t\t\t\t\t\tYou should have received a copy of the GNU Affero General Public License \\\n\t\t\t\t\t\t\t\t\talong with this program.  If not, see <http://www.gnu.org/licenses/>.';\n\n"
	var licenseSixPlus = '/**\n *\tData Sutra is everything you need to build a great app.\n * \tCopyright (C) 2006 - ' + thisYear + ' Data Mosaic \n *\n *\tThis program is free software: you can redistribute it and/or modify\n *\tit under the terms of the GNU Affero General Public License as\n *\tpublished by the Free Software Foundation, either version 3 of the\n *\tLicense, or (at your option) any later version.\n *\n *\tThis program is distributed in the hope that it will be useful,\n *\tbut WITHOUT ANY WARRANTY; without even the implied warranty of\n *\tMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n *\tGNU Affero General Public License for more details.\n *\n *\tYou should have received a copy of the GNU Affero General Public License\n *\talong with this program.  If not, see <http://www.gnu.org/licenses/>.\n */\n\n'
	
	var cnt = 1
	var contentJS
	
	var servoyVersion = utils.stringToNumber(application.getVersion())
	
	function padLast(sequence) {
		var length = 12 - sequence.length
		var pad = ''
			
		while (length--) {
			pad += '0'
		}
		
		return pad + sequence
	}
	
	var L33T = {
			__DATASUTRA__		: 'DA7A',
			__datasutra__connector	: 'DAC0',
			__datasutra_authenticator	: 'DAA0',
			__datasutra_login		: 'DA10',
			_ds_AC_access_control	: 'AC00',
			_ds_CODE_resources		: 'C0DE',
			_ds_DEV_tools			: 'DEB0',
			_ds_MGR_resource_manager	: 'E640',
			_ds_NAV_engine		: '4AB0',
			_ds_NSTL_installation		: 'D470',
			_dsa_sutra_CRM_servoy_reskin	: 'C4E0',
			_dsa_sutra_DATE_date_picker		: 'DA1E',
			_dsa_sutra_TMPL_forms :	 '1E47',
			_dsa_sutra_TOOL_toolbar_sidebar	: '1007'
		}
	
	var workspace = plugins.file.showDirectorySelectDialog(plugins.sutra.getWorkspace().substr(5),'Choose a workspace')
	
	//workspace selected
	if (workspace) {
		var modules = plugins.file.getFolderContents(workspace, null, 2, 1)
		
		for (var i = 0; i < modules.length; i++) {
			var module = modules[i]
			var moduleName = module.getAbsolutePath().split('/').pop()
			
			var formsJS = plugins.file.getFolderContents(module.getAbsolutePath() + '/forms', '.js', 1)
			var globalJS = plugins.file.readTXTFile(module.getAbsolutePath() + '/globals.js')
			
			//if this 'module' has globals
			if (globalJS) {
				//insert license as form variable
				if (servoyVersion < 6) {
					//C0DE-1111-00000000000001
					var sequence = utils.numberFormat(cnt++,'#')
					var twenty = L33T[moduleName] + '-' + '1111' + '-' + padLast(sequence)
					
					contentJS = licenseTop + twenty + licenseStuffing + moduleName + licenseEnd + globalJS
				}
				//insert license as comment, like it should be
				else {
					contentJS = licenseSixPlus + globalJS
					cnt++
				}
				
				plugins.file.writeTXTFile(module.getAbsolutePath() + '/globals.js',contentJS)
			}
			
			//if this 'module' has forms with javascript, proceed
			if (formsJS.length) {
				//loop
				for (var j = 0; j < formsJS.length; j++) {
					var formJS = formsJS[j]
					
					//insert license as form variable
					if (servoyVersion < 6) {
						//C0DE-1111-00000000000001
						var sequence = utils.numberFormat(cnt++,'#')
						var twenty = L33T[moduleName] + '-' + '1111' + '-' + padLast(sequence)
						
						contentJS = licenseTop + twenty + licenseStuffing + moduleName + licenseEnd + plugins.file.readTXTFile(formJS)
					}
					//insert license as comment, like it should be
					else {
						contentJS = licenseSixPlus + plugins.file.readTXTFile(formJS)
						cnt++
					}
					
					plugins.file.writeTXTFile(formJS,contentJS)
				}
			}
		}
		
		if (application.isInDeveloper() && application.getApplicationType() == APPLICATION_TYPES.SMART_CLIENT) {
			plugins.dialogs.showInfoDialog('Completed','Licensing text has been inserted in all ' + cnt - 1 + '.js files.')
		}
		//bug with continuations and file plugin?
//		DIALOGS.showInfoDialog('Completed','Licensing text has been inserted in all ' + cnt - 1 + '.js files.')
	}
}

/**
 * Navigates to the specified toolbar if it is available for the logged in user.
 * 
 * @param	{JSEvent|String}	input Event from click to pop-up options or formName to work on.
 * @param	{String}	[itemName] 
 * @param	{Number}	[tabSelected]
 * 
 * @properties={typeid:24,uuid:"F02F73B3-1A9B-4398-9D7C-909247F05EB3"}
 */
function TRIGGER_ul_tab_list(input,itemName,tabSelected) {
	//only run if meta-objects defined
	if (application.__parent__.navigationPrefs && application.__parent__.solutionPrefs) {
		//grab the actions to this
		var valueList = new Array()
		var formNames = new Array()
		for (var i = 0; i < navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs.length ; i++) {
			var actionItem = navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs[i]
			valueList.push(actionItem.menuName)
			formNames.push(actionItem.formToLoad)
		}
		
		var listTabForm = (solutionPrefs.config.webClient) ? 'DATASUTRA_WEB_0F__list__universal' : 'DATASUTRA_0F_solution'
		
		//tack on the selected UL to the top of the pop-down
		valueList.unshift(navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].universalList.displays[navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].universalList.displays.displayPosn].listTitle || navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].navigationItem.fwListTitle)
		if (solutionPrefs.config.webClient) {
			formNames.unshift((navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.withButtons) ? 'NAV_T_universal_list__WEB__buttons' : 'NAV_T_universal_list__WEB__no_buttons')
		}
		else {
			formNames.unshift((navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].listData.withButtons) ? 'NAV_T_universal_list' : 'NAV_T_universal_list__no_buttons')
		}
		
		//called to depress menu
		if (input instanceof JSEvent) {
			var popForm = input.getFormName()
			var popElem = input.getElementName()
			
			//only show pop-up if there are enabled values
			if (valueList.length > 1) {
				
				//build menu, load tabs, and set menu method arguments
				var menu = new Array()
				for ( var i = 0 ; i < valueList.length ; i++ ) {
				    //set check on universal list
					if (formNames[i] == forms[listTabForm].elements.tab_content_B.getTabFormNameAt(forms[listTabForm].elements.tab_content_B.tabIndex)) {
						menu[i] = plugins.popupmenu.createCheckboxMenuItem(valueList[i] + "", TRIGGER_ul_tab_list)
						menu[i].setSelected(true)
					}
					else {
						menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", TRIGGER_ul_tab_list)
					}
					
					//pass form name as parameter if that form is currently included
					if (forms[formNames[i]]) {
						menu[i].setMethodArguments(formNames[i],valueList[i])
					}
					else {
						menu[i].setEnabled(false)
					}
					
					//disable dividers
					if (valueList[i] == '-') {
						menu[i].setEnabled(false)
					}
				}
				
				//are we using a second element to get pop up to align correctly
				var btnInvisible = popElem + "_down"
				
				//push menu down to the header line
				if (forms[popForm].elements[btnInvisible]) {
					var elem = forms[popForm].elements[btnInvisible]
					
					if (!solutionPrefs.config.webClient) {
						var currentLocationX = elem.getLocationX()
						var currentLocationY = elem.getLocationY()
						
						elem.setLocation(currentLocationX, currentLocationY + 3)
					}
				}
				else {
					var elem = forms[popForm].elements[popElem]
				}
				
				//popup menu
				if (elem != null) {
				    plugins.popupmenu.showPopupMenu(elem, menu)
				}
				
				//set invisible btn back to original location
				if (forms[popForm].elements[btnInvisible] && !solutionPrefs.config.webClient) {
					elem.setLocation(currentLocationX, currentLocationY)
				}
			}
		}
		//menu shown and item chosen
		else {
			var formName = arguments[0]
			var itemName = arguments[1]
			var tabSelected = arguments[2]
			var prefName = 'Custom tab ' + solutionPrefs.config.currentFormID + ': ' + formName
			
			if (forms[formName]) {
				//set global that end users use in their code
				NAV_universal_selected_tab = formName
				
				//if not loaded, add tab
				if (formName != 'DATASUTRA_0F_solution__blank_2' && !navigationPrefs.byNavSetName.configPanes.itemsByName[prefName]) {
					
					//assign to list tab panel
					forms[listTabForm].elements.tab_content_B.addTab(forms[formName],'',null,null,null,null)
					forms[listTabForm].elements.tab_content_B.tabIndex = forms[listTabForm].elements.tab_content_B.getMaxTabIndex()
					
					//save status info
					navigationPrefs.byNavSetName.configPanes.itemsByName[prefName] = new Object()
					navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData = {
												tabNumber : forms[listTabForm].elements.tab_content_B.tabIndex,
												dateAdded : application.getServerTimeStamp()
										}
					
				}
				//blank form, set to blank tab
				else if (formName == 'DATASUTRA_0F_solution__blank_2') {
					forms[listTabForm].elements.tab_content_B.tabIndex = 1
				}
				//set tab to this preference
				else {
					forms[listTabForm].elements.tab_content_B.tabIndex = navigationPrefs.byNavSetName.configPanes.itemsByName[prefName].listData.tabNumber
				}
				
				//using a custom tab, note which one it is
				if (tabSelected >= 0) {
					navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs.tabPosn = tabSelected
				}
				//using default list (UL or other)
				else if (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs) {
					delete navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.tabs.tabPosn
				}
				
				//LOG ul tab change
				TRIGGER_log_create('UL Tabs',
						itemName,
						formName
					)
			}
		}
	}
}

/**
 * Calls the UL action event.
 * 
 * @param	{JSEvent}	event Event from click to pop-up options.
 * 
 * @properties={typeid:24,uuid:"DD0B38BF-70F8-40CF-BE62-A7C11A322A1A"}
 */
function TRIGGER_ul_button_action(event) {
	//only run if meta-objects defined
	if (application.__parent__.navigationPrefs && application.__parent__.solutionPrefs) {
		var navForm = (solutionPrefs.config.webClient) ? 'NAV_T_universal_list__WEB__buttons' : 'NAV_T_universal_list'
		forms[navForm].ACTIONS_list(event)
	}
}

/**
 * Calls the UL add event.
 * 
 * @param	{JSEvent}	event Event from click to pop-up options.
 * 
 * @properties={typeid:24,uuid:"DB5DF8A9-9150-40FA-B0C4-B70A916CBBC3"}
 */
function TRIGGER_ul_button_add(event) {
	//only run if meta-objects defined
	if (application.__parent__.navigationPrefs && application.__parent__.solutionPrefs) {
		var navForm = (solutionPrefs.config.webClient) ? 'NAV_T_universal_list__WEB__buttons' : 'NAV_T_universal_list'
		forms[navForm].REC_new(event)
	}
}

/**
 * Calls the UL report event.
 * 
 * @param	{JSEvent}	event Event from click to pop-up options.
 * 
 * @properties={typeid:24,uuid:"FBAD991A-A258-4D77-9C55-DBDC35A471F1"}
 */
function TRIGGER_ul_button_report(event) {
	//only run if meta-objects defined
	if (application.__parent__.navigationPrefs && application.__parent__.solutionPrefs) {
		var navForm = (solutionPrefs.config.webClient) ? 'NAV_T_universal_list__WEB__buttons' : 'NAV_T_universal_list'
		forms[navForm].REPORTS_list(event)
	}
}

/**
 * Calls the UL filter event.
 * 
 * @param	{JSEvent}	event Event from click to pop-up options.
 * 
 * @properties={typeid:24,uuid:"2A613595-9E4D-4D0C-AD7F-689E1FA8CF65"}
 */
function TRIGGER_ul_button_filter(event) {
	//only run if meta-objects defined
	if (application.__parent__.navigationPrefs && application.__parent__.solutionPrefs) {
		var navForm = (solutionPrefs.config.webClient) ? 'NAV_T_universal_list__WEB__buttons' : 'NAV_T_universal_list'
		forms[navForm].FILTERS_list(event)
	}
}

/**
 * @properties={typeid:24,uuid:"7AF6A8AA-44C4-4ABE-9A0B-18D379BD269A"}
 */
function CODE_cursor_busy(busyCursor) {
	//running in webclient and logged in, commandeer servoy indicator
	if (DS_web_cursor) {
		//web client utils plugin available
		if (plugins.WebClientUtils) {
			//busy cursor requested
			if (busyCursor) {
				plugins.WebClientUtils.executeClientSideJS('busyCursor(Wicket.indicatorPosition,true);')
			}
			//busy cursor request to turn off
			else {
				plugins.WebClientUtils.executeClientSideJS('busyCursor();')
			}
		}
	}
	//data sutra plugin available
	else if (plugins.sutra) {
		//busy cursor requested and not already on
		if (busyCursor && ! plugins.sutra.busyCursor) {
			plugins.sutra.busyCursor = true
			application.updateUI()
		}
		//busy cursor enabled and request to turn off
		else if (!busyCursor && plugins.sutra.busyCursor) {
			plugins.sutra.busyCursor = false
		}
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"38E91726-3B1D-4A3F-812D-B8B71D7F6530"}
 */
function CODE_multiselect(firstShow, event) {
	var formName = event.getFormName()
	
	//turn multiselect on
	if (firstShow && formName) {
		forms[formName].foundset.multiSelect = true
		
		if (forms[formName].FORM_on_show) {
			forms[formName].FORM_on_show(firstShow, event)
		}
	}
}

/**
 * Turns on accent highlight of selected row for specified time on form.
 * 
 * @param	{String}	formName The form on which to highlight the selected row.
 * @param	{Number}	[delay=500] Amount of time to highlight selected row.
 * 
 * @properties={typeid:24,uuid:"28376429-115F-4661-8311-AE6173815A64"}
 */
function CODE_row_background__highlight(formName,delay) {
	arguments.callee.form = function() {
		return formName
	}
	
	arguments.callee.status = function() {
		return status || false
	}
	
	//turn on accent highlight
	var status = true
	
	//refresh screen so that accent seen
	application.updateUI(delay || 500)
	
	//turn accent off and refresh screen again
	status = false
	application.updateUI()
}

/** 
 * Show and set the initial status of the small dialog window.
 * 
 * @param	{Boolean}	toggle Show/hide the dialog.
 * @param	{String}	[typeForm='touch'] What style dialog is this.
 * @param	{String}	[formName] Form to load in the tab panel (all others removed).
 * @param	{Boolean}	[lockScreen] Lock screen from other interactions until hidden.
 * @param	{Number}	[positionX] X co-ordinates for tab panel.
 * @param	{Number}	[positionY] Y co-ordinates for tab panel.
 * @param	{Number}	[sizeX=formName's width] Width of dialog.
 * @param	{Number}	[sizeY=formName's height] Height of dialog.
 * @param	{String}	[saveTooltip] Tooltip to show over ok button.
 * @param	{String}	[cancelTooltip] Tooltip to show over cancel button.
 * @param	{Boolean}	[nonTransparent] Lock screen from other interactions until hidden.
 * @param	{Boolean}	[showArrow=false] Show arrow.
 * @param	{Number}	[positionArrow=center of inliner] Position of arrow.
 * 
 * @properties={typeid:24,uuid:"A3612F37-7D06-4047-A445-26B170694F6B"}
 */
function TRIGGER_dialog_small(toggle,typeForm,formName,lockScreen,positionX,positionY,sizeX,sizeY,saveTooltip,cancelTooltip,nonTransparent,showArrow,positionArrow) {
	//the tabpanel that gets moved around to do this effect
	var dialog = forms.DATASUTRA_0F_solution.elements.tab_dialog
	
	var widthOffset = 0
	var heightOffset = 0
	
	switch (typeForm || 'touch') {
		case 'touch':
			var windowing = forms.DATASUTRA__dialog_small__touch
			widthOffset = 60
			heightOffset = 100
			
			//select this look and feel
			forms.DATASUTRA__dialog_small.elements.tab_type.tabIndex = 3
			break
		case 'float':
			var windowing = forms.DATASUTRA__dialog_small__floater
			widthOffset = 40
			heightOffset = 50
			
			//select this look and feel
			forms.DATASUTRA__dialog_small.elements.tab_type.tabIndex = 1
			break
		case 'standard':
			var windowing = forms.DATASUTRA__dialog_small__standard
			
			//select this look and feel
			forms.DATASUTRA__dialog_small.elements.tab_type.tabIndex = 2
			break
	}
	
	//where the content gets stored
	var content = windowing.elements.tab_content
	
	//show dialog
	if (toggle) {
		var smForm = solutionModel.getForm(formName)
		
		if (formName && smForm) {
			//add tab
			if (content.getTabFormNameAt(content.tabIndex) != formName) {
				content.removeAllTabs()
				content.addTab(forms[formName])
			}
			//re-run form on show (form never really hidden in first place)
			else {
				if (smForm.onShow) {
					forms[formName][smForm.onShow.getName()]()
				}
			}
			
			//set size of base form
			
			//get height
			var totalHeight = 0
			for (var i in smForm.getParts()) {
				totalHeight += smForm.getParts()[i].height
			}
			
			sizeX = sizeX || (solutionModel.getForm(formName).width + widthOffset)
			sizeY = sizeY || (totalHeight + heightOffset)
		}
		
		//show arrow
		if (showArrow) {
			//adjust position of inliner to be centered
			positionX -= (sizeX / 2)
			
			windowing.elements.gfx_location.setLocation((positionArrow || (sizeX / 2)) - 8, 1)
			windowing.elements.gfx_location.visible = true
		}
		else {
			windowing.elements.gfx_location.visible = false
		}
		
		//set position
		if (positionX || positionY) {
			dialog.setLocation(positionX || 0, positionY || 0)
		}
		
		//set size
		if (sizeX || sizeY) {
			//check to see that will be entirely visible
			//TODO: when toolbars showing this gets messed up, so add in a 40-pixel fudge factor
			if (dialog.getLocationX() + sizeX > application.getWindowWidth(null)) {
				sizeX = application.getWindowWidth(null) - dialog.getLocationX()
			}
			if (dialog.getLocationY() + sizeY + 40 > application.getWindowHeight(null)) {
				sizeY = application.getWindowHeight(null) - dialog.getLocationY() - 80
			}
			
			dialog.setSize(sizeX, sizeY)
		}
		
		//set save tooltip
		if (windowing.elements.btn_ok && windowing.elements.btn_ok.toolTipText) {
			if (saveTooltip) {
				windowing.elements.btn_ok.toolTipText = saveTooltip
			}
			else {
				windowing.elements.btn_ok.toolTipText = 'Save'
			}
		}
		
		//set cancel tooltip
		if (windowing.elements.btn_cancel && windowing.elements.btn_cancel.toolTipText) {
			if (cancelTooltip) {
				windowing.elements.btn_cancel.toolTipText = cancelTooltip
			}
			else {
				windowing.elements.btn_cancel.toolTipText = 'Cancel'
			}
		}
		
		//set non-transparency
		if (nonTransparent) {
			content.transparent = false
		}
		else {
			content.transparent = true
		}
		
		//disable all actions
		if (lockScreen) {
			TRIGGER_interface_lock(true,true)
		}
		
		//turn on
		dialog.visible = true
	}
	//hide dialog
	else {
		dialog.visible = false
		TRIGGER_interface_lock(false)
	}
}

/**
 * @properties={typeid:24,uuid:"9FCCA57A-7354-4C73-96D2-A81A5C08DF4E"}
 */
function CODE_servoy_object_exists(methodName, formName) {
	//a method passed in to check
	if (methodName) {
		//a form specified
		if (formName) {
			var smForm = solutionModel.getForm(formName)
			
			//check to see if form exists
			if (smForm) {
				
				//check for method existence on given form
				if (smForm.getFormMethod(methodName)) {
					return true
				}
				else {
					return false
				}
			}
			else {
				return false
			}
		}
		//no form specified, at the global scope
		else {
			//check for global method existence
			if (solutionModel.getGlobalMethod(methodName)) {
				return true
			}
			else {
				return false
			}
		}
	}
	else {
		return false
	}
}

/**
 * Wrapper to aide in converting deprecated showFormInDialog calls
 * 
 * @param {Form} form
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [width]
 * @param {Number} [height]
 * @param {String} [title]
 * @param {Boolean} [resizable=true]
 * @param {Boolean} [showText=false]
 * @param {String} [name]
 * @param {Boolean} [modal=true]
 * 
 * @properties={typeid:24,uuid:"95177CA4-C36C-4F0D-A076-45F78F7836F4"}
 */
function CODE_form_in_dialog(form, x, y, width, height, title, resizable, showText, name, modal) {
	
	//pre-6
	if (utils.stringToNumber(application.getVersion()) < 6) {
		application.showFormInDialog(
				form,
				x,y,width,height,
				title,
				resizable,
				showText,
				name,
				modal
			)
	}
	//post-6
	else {
		//TODO: in webclient, use dialog plugin for FiDs so continuations baked in
		if (false && solutionPrefs.config.webClient) {
			DIALOGS.showFormInModalDialog(
					form.controller.getName(), 
					x,
					y,
					width,
					height, 
					title, 
					resizable, 
					showText, 
					name
				)
		}
		else {
			function getSize(value, defaultValue, noMinusOne) {
				if (typeof value == 'number' && ((noMinusOne) ? value != -1 : true)) {
					return value
				}
				else {
					return defaultValue
				}
			}
			
			var smForm = solutionModel.getForm(form.controller.getName())
			
			var autoSave = databaseManager.getAutoSave()
			
			//didn't take window size into account unless resizable enabled; manually calculate window dimensions
			if (utils.stringToNumber(utils.stringReplace(application.getVersion(),'.','')) < 605) {
				var offset = 0
				var titleBar = 0
				//windows
				if (utils.stringPatternCount(solutionPrefs.clientInfo.typeOS,'Windows')) {
					var theme = plugins.sutra.getWindowsTheme()
					
					//todo: figure out specifically
					titleBar = 30
					
					//aero
					if (utils.stringToNumber(solutionPrefs.clientInfo.verOS) > 6 && theme != 'Classic') {
						offset = 16
					}
					//luna
					else if (utils.stringPatternCount(solutionPrefs.clientInfo.verOS,'5.1') && theme == 'Luna') {
						offset = 8
					}
					//classic
					else {
						offset = 8
					}
				}
				//mac
				else {
					titleBar = 22
				}
				
				var totalWidth = smForm.width
				
				//offset for platform windowing
				totalWidth += offset
				
				var totalHeight = 0
				for (var i in smForm.getParts()) {
					totalHeight += smForm.getParts()[i].height
				}
				//offset for platform windowing
				totalHeight += titleBar + offset
			}
			//can auto-calculate height-width
			else {
				totalWidth = -1
				totalHeight = -1
			}
			
			if (typeof resizable != 'boolean') {
				resizable = true
			}
			
			if (typeof showText != 'boolean') {
				showText = false
			}
			
			if (typeof modal != 'boolean') {
				modal = true
			}
			
			var modality = modal ? JSWindow.MODAL_DIALOG : JSWindow.DIALOG
			
			//check to see if this FiD already exists and remove it
			if (application.getWindow(name)) {
				
				//run on hide method
					//MEMO: must destroy window in onhide
				if (smForm.onHide && smForm.onHide.getName() && form[smForm.onHide.getName()]) {
					form[smForm.onHide.getName()]()
					
					//on hide changed the status of autosave, reset
					if (autoSave != databaseManager.getAutoSave()) {
						databaseManager.setAutoSave(autoSave)
					}
				}
				//allow any FiDs to be hidden
				else {
					//needed for case when FiD shown and then navigated to other part of solution before closing
					CODE_hide_form = 1
					
					application.getWindow(name).destroy()
				}
			}
			
			//in webclient on an ipad, turn off indicator; fixed position is outside bounds of FiD and makes scroll bars show up
			if (application.__parent__.solutionPrefs && solutionPrefs.config.webClient && scopes.DS.deviceFactor == 'iPad') {
				//there is already an onshow
				if (smForm.onShow && smForm.onShow.getName()) {
					//check to see that not already extended, extend
					if (!(utils.stringPatternCount(smForm.onShow.code,'CODE_form_in_dialog_setup_ipad()')  || utils.stringPatternCount(smForm.onShow.code,'indicatorOff()'))) {
						//first trash the form
						solutionModel.removeForm(smForm.name)
						
						//now update the code
						smForm.onShow.code = smForm.onShow.code.substr(0,smForm.onShow.code.length - 2) + ";CODE_form_in_dialog_setup_ipad()" + smForm.onShow.code.substr(smForm.onShow.code.length - 2)
						
						//get the form again
						form = forms[smForm.name]
					}
				}
				//need new on show method
				else {
					//first trash the form
					solutionModel.removeForm(smForm.name)
					
					//now create new on show method
					smForm.onShow = smForm.newMethod("function FORM_on_show__DSWEBCLIENT(firstShow,event){CODE_form_in_dialog_setup_ipad()}")
					
					//get the form again
					form = forms[smForm.name]
				}
			}
			
			var FiD = application.createWindow(name,modality)
			FiD.setInitialBounds(
							getSize(x,-1),
							getSize(y,-1),
							getSize(width,totalWidth,true),
							getSize(height,totalHeight,true)
						)
			FiD.resizable = resizable
			FiD.showTextToolbar(showText)
			FiD.title = title
			FiD.show(form)
		}
	}
}

/**
 * Wrapper to aide in converting deprecated closeFormDialog calls
 * 
 * @param {String} [name]
 * 
 * @properties={typeid:24,uuid:"BAF7CB19-281E-49ED-B83D-E6AEF1A566F6"}
 */
function CODE_form_in_dialog_close(name) {
	//pre-6
	if (utils.stringToNumber(application.getVersion()) < 6) {
		if (application.getWindow(name) != null) {
			application.closeFormDialog(name)
		}
	}
	else {
		if (application.getWindow(name) != null) {
			application.getWindow(name).destroy()
		}
	}
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @properties={typeid:24,uuid:"9AC601EA-D133-45B4-B9D6-E38F7A81E4B3"}
 */
function CODE_row_background__list(event) {
	var renderable = event.getRenderable()
	
	//set background color
	renderable.bgcolor = '#D1D7E2'
		
	if (!solutionPrefs.config.webClient && renderable.getElementType() == 'CHECK') {
		renderable.transparent = true
	}
	//ensure that not transparent for everything except checkboxes
	else if (renderable.getElementType() != 'CHECK') {
		renderable.transparent = false
	}
}
/**
 * @properties={typeid:24,uuid:"3EDF79FA-588A-4755-9B44-CCE19BEB0143"}
 */
function CODE_appserver_get(hostName) {
//	var appURL = ''
//		
//	if (application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT) {
//		//get url using callback
//		if (!hostName) {
//			plugins.WebClientUtils.executeClientSideJS('var host = window.top.location.host;', CODE_appserver_get, ['host'])
//			var kont = new Continuation()
//			application.output(kont)
//			return kont
//		}
////		//have path, figure out where to navigate to
////		else {
////			if (CODE_continuation) {
////				var c = CODE_continuation
////				CODE_continuation = null
////				CODE_continuation_value = hostName
////				c()
////			}
////		}
////	}
//	else {
//		appURL = application.getServerURL().substr(7)
//	}
//	
//	application.output(appURL)
//	return appURL

//	another try
//application.output('hello world 1')
//
////store method stack
//CODE_continuation = new Continuation()
//
////halt
//new Continuation()()
//
//application.output('hello world 2')
//
//return
}

/**
 * Turn off ajax indicator on iPad FiD so scrollbars do not show up
 * 
 * @properties={typeid:24,uuid:"C04AB740-78A8-4C00-B6BB-31B2AB0586C8"}
 */
function CODE_form_in_dialog_setup_ipad() {
	if (application.__parent__.solutionPrefs && solutionPrefs.config.webClient && scopes.DS.deviceFactor == 'iPad') {
		plugins.WebClientUtils.executeClientSideJS('indicatorOff();')
	}
}

/**
 * Spellcheck the element assigned to the event's labelfor property.
 * 
 * @param {JSEevent} event
 * 
 * @properties={typeid:24,uuid:"D946F5F2-235C-4171-BE1B-1DA8F13470C6"}
 */
function CODE_spellcheck(event) {
	if (event) {
		var formName = event.getFormName()
		var btnName = event.getElementName()
		var elemName = forms[formName].elements[btnName].getLabelForElementName()
		
		if (formName && elemName && forms[formName].elements[elemName]) {
			plugins.spellcheck.checkTextComponent(forms[formName].elements[elemName])
		}
	}
}

/**
 * Get the mouse location within a workflow form.
 * 
 * @param {JSEvent} event
 * @param {Number[]} posn
 * @return {{x: Number, y: Number}} Coordinates
 * 
 * @properties={typeid:24,uuid:"9E4A25E9-1D33-40AD-B7A6-55FE133630F7"}
 */
function TRIGGER_mouse_get(event,posn) {
	var position = {
			x: 0,
			y: 0
		}
	
	if (solutionPrefs.config.webClient) {
		//header offset
		position.y += 44
		
		//are we in workflow space (no offset)
		if (solutionPrefs.config.activeSpace != 'workflow') {
			//all horizontals kept in sync; doesn't matter which one i grab
			position.x += solutionPrefs.screenAttrib.spaces.standard.currentHorizontal
		}
		
		//at this point, position is in the top left corner of the workflow form
		
		var context = forms[event.getFormName()].controller.getFormContext()
		
		//working on workflow form
		if (context.getValue(3,2) == 'DATASUTRA_WEB_0F__workflow') {
			for (var i = 4; i <= context.getMaxRowIndex(); i++) {
				var formContext = context.getRowAsArray(i)
				var formName = formContext[1]
				var elemName = formContext[2]
				
				//see about a title header
				var smForm = solutionModel.getForm(formName)
				if (smForm.getTitleHeaderPart() && smForm.getTitleHeaderPart().height) {
					position.y += smForm.getTitleHeaderPart().height
				}
				
				//check what element
				if (formName && elemName) {
					position.x += forms[formName].elements[elemName].getLocationX()
					position.y += forms[formName].elements[elemName].getLocationY()
				}
			}
		}
		//working on sidebar
		
		//something else
		
		
	}
	//mouse pointer plugin available
	else if (false) {
		
	}
	
//	//grab last click location from Wicket
//	if (solutionPrefs.config.webClient) {
//		//current mouse location
//		if (!posn) {
//			plugins.WebClientUtils.executeClientSideJS('var posn = Wicket.indicatorPosition;', TRIGGER_mouse_get, [null,'posn'])
//		}
//		//have cursor, resume paused method
//		else {
//			
//		}
//	}
	
	return position
}

/**
 * Programatically navigate to a different navigation item.
 * 
 * @param	{String}	[reportID] The navigation item to jump to.
 * @return {Boolean} Report found/ran successfully
 * 
 * @properties={typeid:24,uuid:"F21FE969-0EFB-42AC-A4F7-8C3F7DC47AAB"}
 * @AllowToRunInFind
 */
function TRIGGER_report_run(reportID) {
	//solutionPrefs defined
	if (application.__parent__.solutionPrefs) {
		var reportID = arguments[0]
		
		if (reportID) {
			/** @type {JSFoundSet<db:/sutra/sutra_report>} */
			var fsReport = databaseManager.getFoundSet('db:/sutra/sutra_report')
			fsReport.find()
			fsReport.report_id = reportID
			var results = fsReport.search()
			if (results == 1) {
				var reportRec = fsReport.getSelectedRecord()
				
				scopes.DS_buttons.REPORTS_list_control(reportRec.report_form,reportRec.report_method,reportRec.flag_wrapper,reportRec.source,reportRec.report_description,reportRec.id_report)
				return true				
			}
			else {
				return false
			}
		}
	}
}

/**
 * Display information about the calling method
 * 
 * @param {Function} callee
 * @param {Controller} [control] Controller called from
 * @param {Boolean} [separator=false] Show : after
 * @return {String}
 *
 * @properties={typeid:24,uuid:"06FDBEC2-156A-40EE-882E-85395FEA6D93"}
 */
function CODE_debug_context(callee,control,separator) {
	var whereAt = ''
	if (callee) {
		if (callee._scopename_) {
			if (callee._scopename_ != 'globals') {
				whereAt += 'scopes.'
			}
			whereAt += callee._scopename_ + '.'
		}
		else if (control && typeof control.getName == 'function') {
			whereAt += 'forms.' + control.getName() + '.'
		}
		
		whereAt += callee._methodname_
		
		if (separator) {
			whereAt += ': '
		}
	}
	
	return whereAt
}

/**
 * Debug appropriately in smart/web clients
 * 
 * To turn on, "run globals.CODE_debug_log.enabled = true" in konsole
 * or the same command without run from developer's command console
 * 
 * @param {String}	msg Message to output
 * @param {Number}	[level=LOGGINGLEVEL.DEBUG] Optional logging level
 * @param {JSFile}	[file] File to append this log to
 *
 * @properties={typeid:24,uuid:"98ACA3EC-2038-4C22-A6E2-302FFFC04E8C"}
 */
function CODE_debug_log(msg,level,file) {
	//no level specified, use debug
	if (!level) {
		level = LOGGINGLEVEL.DEBUG
	}
	
	function appendLog() {
		var levelMap = {
				0 : 'DEBUG',
				3 : 'ERROR',
				4 : 'FATAL',
				1 : 'INFO',
				2 : 'WARNING'
			}
		
		plugins.file.appendToTXTFile(
				file,
				globals.CODE_date_format(null,'specify','yyyy-MM-dd HH:mm:ss.SSS') + ' [' + levelMap[level] + '] ' + msg + '\n'
			)
	}
	
	//enabled or not
	if (CODE_debug_log.enabled) {
		//webclient
		if (application.__parent__.solutionPrefs && solutionPrefs.config.webClient) {
			plugins.WebClientUtils.executeClientSideJS('console.log("' + msg + '");')
		}
		//smart client (assumed)
		else {
			application.output(msg,level)
		}
		appendLog()
	}
	// always log when level specified
	else if (arguments[1]) {
		application.output(msg,level)
		appendLog()
	}
}
