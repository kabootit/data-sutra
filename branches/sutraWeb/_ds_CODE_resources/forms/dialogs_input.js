/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B1675FB3-E059-41CC-8F6C-F8425D08B783"}
 */
var retVal = '';

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"033A07B5-5894-4560-AAC1-D020FFA39F10"}
 */
function handleButtonAction(event) {
	if (event.getElementName() == 'fldValue' || (elements[event.getElementName()] ? elements[event.getElementName()].text : '') == i18n.getI18NMessage('servoy.button.ok')) {
		returnValue = retVal;
	}
	// closing of the window is done by the inherited base form (dialogs_base)
}

/**
 * @param {Array} _aArguments
 * @param {String} _sIconStyle
 * @param {String} _initialValue
 * @param {Number} _nDialogWidth
 * @param {Number} _nDialogHeight
 *
 * @properties={typeid:24,uuid:"CD1EE405-A19C-425F-AF2B-208B08A1469E"}
 */
function setupForm(_aArguments, _sIconStyle, _initialValue, _nDialogWidth, _nDialogHeight) {
	var _aBtn = _aArguments.slice(1, _aArguments.length),
		_oForm = setupButtons(_aBtn, false, _nDialogWidth, _nDialogHeight),
		_oLabel = _oForm.newLabel("", 15, 15, 60, 60);
	_oLabel.styleClass = _sIconStyle;
	_oLabel.mediaOptions = SM_MEDIAOPTION.REDUCE | SM_MEDIAOPTION.KEEPASPECT;
	
	_oLabel = _oForm.newLabel("", 90, 15, _nDialogWidth - 100, 90);
	_oLabel.styleClass = 'dialogs_message';
	_oLabel.verticalAlignment = SM_ALIGNMENT.TOP;
	_oLabel.text = '<html>' + utils.stringReplace(utils.stringReplace(utils.stringReplace(_aArguments[0], "\r\n", "<br />"), "\n", "<br />"), "\r", "<br />") + '</html>';
	controller.recreateUI();
	elements.fldValue.setLocation(85, _nDialogHeight - 71);
	elements.fldValue.setSize(_nDialogWidth - 120, 20);
	retVal = _initialValue;
	callbackMethod = handleButtonAction;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"073DA07D-D2D5-45E6-9AB8-F3AC52262EC1"}
 */
function onInputAction(event) {
	_super.onButtonAction(event);
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"314BDB33-0A1E-428C-B774-77399285F847"}
 */
function onShow(firstShow, event) {
	elements.fldValue.requestFocus();
}
