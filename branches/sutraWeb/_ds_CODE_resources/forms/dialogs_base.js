/**
 * @type {Function}
 *
 * @properties={typeid:35,uuid:"BB8E1242-F3D4-41C5-8616-24593C26F26A",variableType:-4}
 */
var bluePrintCleanupCallback;

/**
 * @type {Number}
 *
 * @private
 *
 * @properties={typeid:35,uuid:"C1D9840E-FFFF-456D-9BA0-98A8BB94660F",variableType:4}
 */
var buttonCount = 0;

/**
 * @type {Function}
 * @protected
 * @properties={typeid:35,uuid:"B544EB43-AD77-4AC6-9834-68A958497CBC",variableType:-4}
 */
var callbackMethod = null;

/**
 * @type {Continuation}
 *
 * @properties={typeid:35,uuid:"5DFCFC69-E702-4873-B779-55298091CBA3",variableType:-4}
 */
var continuation;

/**
 * @type {String}
 * @properties={typeid:35,uuid:"08A434AB-9321-4579-8C53-C10FC0EF3929"}
 */
var returnValue = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"16654D34-8A96-44EF-972D-D25FE66789C2"}
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
 * @properties={typeid:24,uuid:"26A90DE2-4775-4217-9E02-E73FDE97DB40"}
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
 * @properties={typeid:24,uuid:"23D722D8-8988-4628-995A-6DA46E61240D"}
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
 * @properties={typeid:24,uuid:"A31449A0-DF7D-4254-829A-EA9FF2EA8D83"}
 */
function setupButtons(buttonArray, redraw, dialogWidth, dialogHeight) {
	var _oForm = solutionModel.getForm(controller.getName()),
		_oMethod = solutionModel.getForm("dialogs_base").getFormMethod('onButtonAction'),
		_oBtn,
		_nBtnMinWidth = 80,
		_nBtnWidth, // = _nBtnMinWidth,
		_nBtnHeight = 20,
		_xOffset = dialogWidth - 20,
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
 * @SuppressWarnings('wrongparameters')
 *
 * @properties={typeid:24,uuid:"55CF8255-DE8E-4666-978A-CC9550EAE411"}
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
 * @properties={typeid:24,uuid:"449EAB6F-FDA9-4AC2-85E9-DAAA74503AC3"}
 */
function onShow(firstShow, event) {
	if (buttonCount) {
		elements["btn_" + (application.getOSName().match("Mac") ? 1 : buttonCount)].requestFocus();
	}
}
