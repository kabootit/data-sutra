/**
 * Load in form to tab panel
 * 
 * @param {String} formName The name of the form to load
 * 
 * @properties={typeid:24,uuid:"174DC80F-945E-43EA-93AC-DB25D979C8AA"}
 */
function setForm(formName) {
	//remove main window if new one different than currently displayed one
	if (elements.tab_workflow.tabIndex > 0  && (elements.tab_workflow.getTabFormNameAt(elements.tab_workflow.tabIndex) != formName)) {
		elements.tab_workflow.removeAllTabs()
	}
	//load main window if no tab currently there
	if (!elements.tab_workflow.getMaxTabIndex()) {
		elements.tab_workflow.addTab(forms[formName],'')
		elements.tab_workflow.tabIndex = elements.tab_workflow.getMaxTabIndex()
	}
}
