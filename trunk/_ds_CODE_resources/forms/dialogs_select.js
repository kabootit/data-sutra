/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3ABD8DCE-2582-4300-AEFF-A4224EA7CBFD"}
 */
var retVal = '';

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"79110A53-6384-4BE9-B69E-DD380D894D9E"}
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
 * @properties={typeid:24,uuid:"5A45A550-05F0-4C2B-AC29-B7736E5E6995"}
 */
function setupForm(_aArguments, _sIconStyle, _nDialogWidth, _nDialogHeight) {
	var _aBtn = _aArguments.slice(2, _aArguments.length),
		_oForm = setupButtons(_aBtn, false, _nDialogWidth, _nDialogHeight),
		_oLabel = _oForm.newLabel("", 15, 15, 60, 60);
	_oLabel.styleClass = _sIconStyle;
	_oLabel.mediaOptions = SM_MEDIAOPTION.REDUCE | SM_MEDIAOPTION.KEEPASPECT;

	_oLabel = _oForm.newLabel("", 90, 15, _nDialogWidth - 100, 54);
	_oLabel.styleClass = 'dialogs_message';
	_oLabel.verticalAlignment = SM_ALIGNMENT.TOP;
	_oLabel.text = '<html>' + utils.stringReplace(utils.stringReplace(utils.stringReplace(_aArguments[0], "\r\n", "<br />"), "\n", "<br />"), "\r", "<br />") + '</html>';
	controller.recreateUI();
	elements.fldValue.setLocation(90, _nDialogHeight - 81);
	elements.fldValue.setSize(_nDialogWidth - 145, 20);
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
 * @properties={typeid:24,uuid:"7B82CF74-2CFE-4BC7-B5B2-801E28F91A0F"}
 */
function onShow(firstShow, event) {
	elements.fldValue.requestFocus();
	
	//custom form setup for iOS FiD
	globals.CODE_form_in_dialog_setup_ipad()
}
