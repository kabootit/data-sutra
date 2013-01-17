/**
 * @type {Function}
 *
 * @properties={typeid:35,uuid:"CEA81BE6-E579-4222-92A2-2518659CC26C",variableType:-4}
 */
var bluePrintCleanupCallback;

/**
 * @type {Number}
 *
 * @private
 *
 * @properties={typeid:35,uuid:"DCD5FB3A-5CE9-49A9-B7AD-282D0A1B4069",variableType:4}
 */
var buttonCount = 0;

/**
 * @type {Function}
 * @protected
 * @properties={typeid:35,uuid:"EF3FD099-485C-4015-9592-3DF936D89721",variableType:-4}
 */
var callbackMethod = null;

/**
 * @type {Continuation}
 *
 * @properties={typeid:35,uuid:"7791D0F4-E210-4FE6-B137-8359E6BB3152",variableType:-4}
 */
var continuation;

/**
 * @type {String}
 * @properties={typeid:35,uuid:"6F681452-1E7D-4320-AC85-9CFBB4B12030"}
 */
var returnValue = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"EC0A188F-684C-4DCC-817B-AA573B9DD8FA"}
 */
var windowName = '';

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"ADA45A14-2D8B-4589-B22B-D1F22C28727E"}
 */
function onHide(event) {
	bluePrintCleanupCallback(controller.getName())
	
	//Handling continuation here only when dismissing the dialog
	//continuation variable is already set to null if a button was clicked
	if (continuation) { 
		continuation(returnValue)
	}
	return true;
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"103B0923-620F-408A-BB23-ECA2B4E245B9"}
 */
function onButtonAction(event) {
	if (callbackMethod) {
		callbackMethod(event);
	}
	
	//Get Continuation object and store it locally, before closing the dialog, to prevent the execution of the continuation from within the onHide event
	var c = continuation;
	continuation = null;
	var win = application.getWindow(windowName);
	if (win) {
		win.destroy();
	}
	c(returnValue);
}

/**
 * @param {Array} buttonArray
 * @param {Boolean} redraw
 * @param {Number} dialogWidth
 * @param {Number} dialogHeight
 *
 * @return {JSForm}
 * @properties={typeid:24,uuid:"F6D04F75-657A-4F47-B03A-97401A195681"}
 */
function setupButtons(buttonArray, redraw, dialogWidth, dialogHeight) {
	var _oForm = solutionModel.getForm(controller.getName()),
		_oMethod = solutionModel.getForm("dialogs_base").getFormMethod('onButtonAction'),
		_oBtn,
		_nBtnMinWidth = 80,
		_nBtnWidth, // = _nBtnMinWidth,
		_nBtnHeight = 30,
		_xOffset = dialogWidth - 12,
		_yOffset = dialogHeight - _nBtnHeight - 20,
		_aElement = elements.allnames,
		_nDefaultCharWidth = 5,
		_aGuesstimator = [[/[!il:;,\.]/, 3], [/\w/, 10]],
		i, j, k;

	_oForm.newPart(JSPart.BODY, dialogHeight);

	for (i = 0; i < _aElement.length; i++) {
		if (utils.stringLeft(_aElement[i], 4) == 'btn_') {
			_oForm.removeButton(_aElement[i]);
		}
	}

	if (!application.getOSName().match("Mac")) {
		buttonArray = buttonArray.reverse()
	}

	for (i = 0; i < buttonArray.length; i++) {

		// The Great Guesstimator! See if we can figure out how wide this text really is
		_nBtnWidth = 0;
		for (j = 0; j < buttonArray[i].length; j++) {
			for (k = 0; k < _aGuesstimator.length; k++) {
				if (_aGuesstimator[k][0].test(buttonArray[i][j])) {
					_nBtnWidth += _aGuesstimator[k][1];
				} else if (k == _aGuesstimator.length - 1) {
					_nBtnWidth += _nDefaultCharWidth;
				}
			}
		}
		// Add some padding and round up to the nearest 10 pixels
		_nBtnWidth = Math.ceil( ( (_nBtnWidth + 10) / 10)) * 10;
		// If the button is less than the minimum width use the minimum width instead
		_nBtnWidth = (_nBtnWidth < _nBtnMinWidth ? _nBtnMinWidth : _nBtnWidth)
		
		_oBtn = _oForm.newLabel(buttonArray[i], (_xOffset - _nBtnWidth), _yOffset, _nBtnWidth, _nBtnHeight, _oMethod);
		_oBtn.name = "btn_" + (i + 1);
		_oBtn.styleClass = 'button_web';
		_oBtn.showClick = false;
//		_oBtn.showFocus = false;
		_oBtn.rolloverCursor = SM_CURSOR.HAND_CURSOR;
		_xOffset = _xOffset - _nBtnWidth - 16;
	}

	if (! (redraw == false)) {
		controller.recreateUI();
	}
	buttonCount = buttonArray.length;
	return _oForm;
}

/**
 * Abstract method, to be overridden by childforms
 * @param {Array} _aArguments
 * @param {String} _sIconStyle
 * 
 * @SuppressWarnings('wrongparameters')
 *
 * @properties={typeid:24,uuid:"74DE135A-C68C-4CA4-B889-E77359CD9700"}
 */
function setupForm(_aArguments, _sIconStyle) { }

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B4DE3491-DFAF-4B5E-9E72-082991D5F107"}
 */
function onShow(firstShow, event) {
	if (buttonCount) {
//		elements["btn_" + (application.getOSName().match("Mac") ? 1 : buttonCount)].requestFocus();
	}
	
	//custom form setup for iOS FiD
	globals.CODE_form_in_dialog_setup_ipad()
}
