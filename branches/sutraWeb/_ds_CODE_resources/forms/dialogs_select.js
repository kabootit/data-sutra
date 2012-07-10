/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"693A9CE6-C31F-4FE8-9660-86752500ECCF"}
 */
var retVal = '';

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"32655896-9275-4A11-AD27-191B22DED083"}
 */
function handleButtonAction(event) {
	if ( (elements[event.getElementName()] ? elements[event.getElementName()].text : '') == i18n.getI18NMessage('servoy.button.ok')) {
		returnValue = retVal;
	}
}

/**
 * @param {Array} _aArguments
 * @param {String} _sIconStyle
 * @param {Number} _nDialogWidth
 * @param {Number} _nDialogHeight
 *
 * @properties={typeid:24,uuid:"E6017C04-E0D4-4EDB-980F-72180959D7A4"}
 */
function setupForm(_aArguments, _sIconStyle, _nDialogWidth, _nDialogHeight) {
	var _aBtn = _aArguments.slice(2, _aArguments.length),
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
	elements.fldValue.setSize(_nDialogWidth - 120, 22);
	application.setValueListItems("dialogs_valuelist", _aArguments[1]);
	retVal = _aArguments[1][0];
	callbackMethod = handleButtonAction;
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"AD7ABB7B-2704-4C05-BEB6-440748F3C5EE"}
 */
function onShow(firstShow, event) {
	elements.fldValue.requestFocus();
}
