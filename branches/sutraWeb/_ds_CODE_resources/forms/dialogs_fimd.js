/**
 * @properties={typeid:24,uuid:"D0A17BEB-5CBE-4383-A008-F428CABCA540"}
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
 * @properties={typeid:24,uuid:"BB33B284-123A-4790-A0D5-C721174FEBDE"}
 */
function onHide(event) {
	elements.tplMain.removeAllTabs(); // workaround for an issue in 5.2.8 and below. Should be fixed in 5.2.9
	return _super.onHide(event)
}
