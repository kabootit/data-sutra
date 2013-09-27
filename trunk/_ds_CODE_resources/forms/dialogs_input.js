/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"97109D98-5F78-4A9E-97AF-B402668422CB"}
 */
var retVal = '';

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3B06D392-0811-453F-A67D-1E8070EA7434"}
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
 * @properties={typeid:24,uuid:"2693E5DA-09D0-4081-AB5E-4F4354D3CF6D"}
 */
function setupForm(_aArguments, _sIconStyle, _initialValue, _nDialogWidth, _nDialogHeight) {
	var _aBtn = _aArguments.slice(1, _aArguments.length),
		_oForm = setupButtons(_aBtn, false, _nDialogWidth, _nDialogHeight),
		_oLabel = _oForm.newLabel("", 15, 15, 60, 60);
	_oLabel.styleClass = _sIconStyle;
	_oLabel.mediaOptions = SM_MEDIAOPTION.REDUCE | SM_MEDIAOPTION.KEEPASPECT;
	
	_oLabel = _oForm.newLabel("", 90, 15, _nDialogWidth - 100, 53);
	_oLabel.styleClass = 'dialogs_message';
	_oLabel.verticalAlignment = SM_ALIGNMENT.TOP;
	_oLabel.text = '<html>' + utils.stringReplace(utils.stringReplace(utils.stringReplace(_aArguments[0], "\r\n", "<br />"), "\n", "<br />"), "\r", "<br />") + '</html>';
	controller.recreateUI();
	elements.fldValue.setLocation(85, _nDialogHeight - 82);
	elements.fldValue.setSize(_nDialogWidth - 120, 22);
	retVal = _initialValue;
	callbackMethod = handleButtonAction;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"337193E1-6AC6-44F6-B81D-47443EDC2283"}
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
 * @properties={typeid:24,uuid:"A01D6297-D3B3-47C0-AAFA-23CAF1CAFF8E"}
 */
function onShow(firstShow, event) {
	elements.fldValue.requestFocus();
	
	//custom form setup for iOS FiD
	globals.CODE_form_in_dialog_setup_ipad()
}
