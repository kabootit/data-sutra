/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"DCD5FB3A-5CE9-49A9-B7AD-282D0A1B4069",variableType:4}
 */
var buttonCount = 0;

/**
 * @properties={typeid:35,uuid:"EF3FD099-485C-4015-9592-3DF936D89721",variableType:-4}
 */
var callbackMethod = null;

/**
 * @properties={typeid:35,uuid:"7791D0F4-E210-4FE6-B137-8359E6BB3152",variableType:-4}
 */
var continuation;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6F681452-1E7D-4320-AC85-9CFBB4B12030"}
 */
var returnValue = '';

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"ADA45A14-2D8B-4589-B22B-D1F22C28727E"}
 */
function onHide(event) {
	plugins.scheduler.removeJob(controller.getName()); // shouldn't be necessary....
	if (continuation) {
		plugins.scheduler.addJob(controller.getName(), new Date(Date.now()), forms.dialogs_base.continueAndDestroy, 0, 0, null, [controller.getName(), continuation, returnValue]);
	} else {
		plugins.scheduler.addJob(controller.getName(), new Date(Date.now()), forms.dialogs_base.destroyWindow, 0, 0, null, [controller.getName()]);
	}
	application.sleep(100);
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
	application.closeForm();
}

/**
 * @param {Array} buttonArray
 * @param {Boolean} redraw
 *
 * @return {JSForm}
 * @properties={typeid:24,uuid:"F6D04F75-657A-4F47-B03A-97401A195681"}
 */
function setupButtons(buttonArray, redraw, dialogWidth, dialogHeight) {
	var _oForm = solutionModel.getForm(controller.getName()),
		_oMethod = solutionModel.getForm("dialogs_base").getFormMethod('onButtonAction'),
		_oBtn,
		_nBtnMinWidth = 80,
		_nBtnWidth = _nBtnMinWidth,
		_nBtnHeight = 20,
		_xOffset = dialogWidth - 20,
		_yOffset = dialogHeight - _nBtnHeight - 20,
		_aElement = elements.allnames,
		_nDefaultCharWidth = 5,
		_aGuesstimator = [[/[!il:;,\.]/, 3], [/[A-Z]/, 10]],
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
					_nBtnWidth = _nBtnWidth + _aGuesstimator[k][1];
				} else if (k == _aGuesstimator.length - 1) {
					_nBtnWidth = _nBtnWidth + _nDefaultCharWidth;
				}
			}
		}
		// Add some padding and round up to the nearest 10 pixels
		_nBtnWidth = Math.ceil( ( (_nBtnWidth + 10) / 10)) * 10;
		// If the button is less than the minimum width use the minimum width instead
		_nBtnWidth = (_nBtnWidth < _nBtnMinWidth ? _nBtnMinWidth : _nBtnWidth)

		_oBtn = _oForm.newButton(buttonArray[i], (_xOffset - _nBtnWidth), _yOffset, _nBtnWidth, _nBtnHeight, _oMethod);
		_oBtn.name = "btn_" + (i + 1);
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
 * @properties={typeid:24,uuid:"74DE135A-C68C-4CA4-B889-E77359CD9700"}
 */
function setupForm(_aArguments, _sIconStyle) { }

/**
 * @param {String} _sFormName
 * @param {Continuation} _oContinuation
 * @param {String} _sReturnValue
 *
 * @properties={typeid:24,uuid:"9448FAAA-1056-4C53-AA3B-C05EDB384F79"}
 */
function continueAndDestroy(_sFormName, _oContinuation, _sReturnValue) {
	// Continue the method that triggered this dialog
	if (_oContinuation) {
		_oContinuation(_sReturnValue);
	}
	destroyWindow(_sFormName);
}

/**
 * @param {String} _sFormName
 *
 * @properties={typeid:24,uuid:"9FA34C8D-8333-49E9-81B0-8C7296F42A97"}
 */
function destroyWindow(_sFormName) {
	if (history.removeForm(_sFormName)) {
		if (!solutionModel.removeForm(_sFormName)) {
			application.output("Can't remove dialog form '" + _sFormName + "'", LOGGINGLEVEL.ERROsR);
		} else {
			// application.output("Removed dialog form '" + _sFormName + "'", LOGGINGLEVEL.DEBUG);
		}
	} else {
		application.output("Can't remove dialog form '" + _sFormName + "' from history", LOGGINGLEVEL.ERROR);
	}
}

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
		elements["btn_" + (application.getOSName().match("Mac") ? 1 : buttonCount)].requestFocus();
	}
}
