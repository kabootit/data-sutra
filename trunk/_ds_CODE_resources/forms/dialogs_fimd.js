/**
 * @properties={typeid:24,uuid:"D81D27BA-0DFB-41A5-9251-47C3EDA9F260"}
 */
function setupForm(_sFormName, _nWidth, _nHeight) {
	elements.tplMain.setSize(_nWidth,_nHeight);
	elements.tplMain.removeAllTabs();
	elements.tplMain.addTab(forms[_sFormName]);
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"AE1807A8-0A73-4372-8668-FE583A78641B"}
 */
function onHide(event) {
	elements.tplMain.removeAllTabs(); // workaround for an issue in 5.2.8 and below. Should be fixed in 5.2.9
	return _super.onHide(event)
}
