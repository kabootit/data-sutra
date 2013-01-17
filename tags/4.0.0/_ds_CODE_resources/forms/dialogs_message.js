/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A5ACB396-0C2A-4180-8E56-D989A828259E"}
 */
function handleButtonAction(event) {
	returnValue = elements[event.getElementName()] ? elements[event.getElementName()].text : ''; // button clicked (if any)
	// closing of the window is done by the inherited base form (dialogs_base)
}

/**
 * @param {Array} _aArguments
 * @param {String} _sIconStyle
 * @param {Number} _nDialogWidth
 * @param {Number} _nDialogHeight
 *
 * @properties={typeid:24,uuid:"A5DBD403-02D5-4764-8330-D885B4C3DFAA"}
 */
function setupForm(_aArguments, _sIconStyle, _nDialogWidth, _nDialogHeight) {
	var _aBtn = _aArguments.length > 2 ?_aArguments.slice(2, _aArguments.length) : [i18n.getI18NMessage('servoy.button.ok')],
		_oForm = setupButtons(_aBtn, false, _nDialogWidth, _nDialogHeight),
		_oLabel = _oForm.newLabel("", 15, 15, 60, 60);

	_oLabel.styleClass = _sIconStyle;
	_oLabel.mediaOptions = SM_MEDIAOPTION.REDUCE | SM_MEDIAOPTION.KEEPASPECT;
	
	_oLabel = _oForm.newLabel("", 90, 15, _nDialogWidth - 100, 90);
	_oLabel.styleClass = 'dialogs_message';
	_oLabel.verticalAlignment = SM_ALIGNMENT.TOP;
	_oLabel.text = '<html>' + utils.stringReplace(utils.stringReplace(utils.stringReplace(_aArguments[1], "\r\n", "<br />"), "\n", "<br />"), "\r", "<br />") + '</html>';

	controller.recreateUI();
	callbackMethod = handleButtonAction;
}
