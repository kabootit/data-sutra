/**
 * Dummy place holder variable
 * 
 * @properties={typeid:35,uuid:"3798E296-DB4E-4BF4-82B5-215E75F2615F",variableType:-4}
 */
var _search = null;

/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"7B507E00-904D-4CED-BE2B-DE940F4392F6",variableType:-4}
 */
var _editMode = false;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"98DAD999-DBB5-4E82-8827-C708689D6189"}
 */
var _methodForm = null;

/**
 * @properties={typeid:24,uuid:"10ACAD11-A300-4189-BAA8-979B720B93A3"}
 */
function BUTTONS_toggle() {
	_methodForm = solutionPrefs.config.currentFormName
	var currentNavItem = solutionPrefs.config.currentFormID
	
	//actions
	elements.btn_create.enabled = (navigationPrefs.byNavItemID[currentNavItem].buttons.add) ? true : false
	elements.btn_actions.enabled = (navigationPrefs.byNavItemID[currentNavItem].buttons.actions) ? true : false
	elements.btn_filters.enabled = (navigationPrefs.byNavItemID[currentNavItem].buttons.filters) ? true : false
	elements.btn_reports.enabled = (navigationPrefs.byNavItemID[currentNavItem].buttons.reports) ? true : false
	
	//fastfind
	elements.btn_find.enabled = navigationPrefs.byNavItemID[currentNavItem].fastFind ? true : false
	
	//transactions
	elements.btn_edit.enabled = navigationPrefs.byNavItemID[currentNavItem].transactions ? true : false
	elements.btn_save.enabled = navigationPrefs.byNavItemID[currentNavItem].transactions ? true : false
	elements.btn_cancel.enabled = navigationPrefs.byNavItemID[currentNavItem].transactions ? true : false
	elements.edit_save_start.enabled = 
	elements.edit_save_middle.enabled = 
	elements.edit_save_end.enabled = 
		navigationPrefs.byNavItemID[currentNavItem].transactions ? true : false
	
	//leave edit mode if currently in it
	if (_editMode) {
		EDIT_cancel()
	}
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"E06B97E3-7EC1-4DA6-9840-1B87A5E5BC95"}
 */
function REC_delete(event) {
	if (forms[_methodForm] && forms[_methodForm].REC_delete) {
		forms[_methodForm].REC_delete(event)
	}
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"2736CC52-805F-4373-99E5-DD439E1208D7"}
 */
function REC_delete_right(event) {
	if (forms[_methodForm] && forms[_methodForm].REC_delete_right) {
		forms[_methodForm].REC_delete_right(event)
	}
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0314CA8F-B7AA-4621-93C4-62B19981ADA9"}
 */
function REC_new_right(event) {
	if (forms[_methodForm] && forms[_methodForm].REC_new_right) {
		forms[_methodForm].REC_new_right(event)
	}
}

/**
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"05465A31-43D3-4811-B9D8-BAC9E5C0E59F"}
 */
function ACTIONS_list_right(event) {
	if (forms[_methodForm] && forms[_methodForm].ACTIONS_list_right) {
		forms[_methodForm].ACTIONS_list_right(event)
	}
}

/**
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"1E99F05E-9BAF-4CC2-8FB3-3481E4902A04"}
 */
function FILTERS_list_right(event) {
	if (forms[_methodForm] && forms[_methodForm].FILTERS_list_right) {
		forms[_methodForm].FILTERS_list_right(event)
	}
}

/**
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"4766B7CE-695E-4BE2-B667-BAC8D375BFE0"}
 */
function REPORTS_list_right(event) {
	if (forms[_methodForm] && forms[_methodForm].REPORTS_list_right) {
		forms[_methodForm].REPORTS_list_right(event)
	}
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"51B35F72-AE6C-49E5-988B-546F5E4EB7A2"}
 */
function EDIT_begin(event) {
	scopes.DS_buttons.TRANSACTION_start(event)
	
	//update screen appropriately
	_editMode = true
	EDIT_elements()
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"414F564F-CFF5-4BA9-8FD8-D744497F8778"}
 */
function EDIT_save(event) {
	scopes.DS_buttons.TRANSACTION_save(event)
	
	//update screen appropriately
	_editMode = false
	EDIT_elements()
}

/**
 * @param {JSEvent} [event]
 *
 * @properties={typeid:24,uuid:"67C6D5AB-7DC9-4C84-9997-FF35400E8508"}
 */
function EDIT_cancel(event) {
	scopes.DS_buttons.TRANSACTION_cancel(event)
	
	//update screen appropriately
	_editMode = false
	EDIT_elements()
}

/**
 * @properties={typeid:24,uuid:"2670F1F7-F56F-4007-89D8-1EE733081CFC"}
 */
function EDIT_elements() {
	//edit related stuff
	elements.btn_edit.visible = !_editMode
	elements.edit_save_divider.visible = _editMode
	elements.btn_save.visible = _editMode
	elements.btn_cancel.visible = _editMode
	
	//other actions
	elements.btn_create.enabled = !_editMode
	elements.btn_actions.enabled = !_editMode
	elements.btn_filters.enabled = !_editMode
	elements.btn_reports.enabled = !_editMode
	elements.btn_find.enabled = !_editMode
	
	//edit mode
	if (_editMode) {
		//big button
		elements.edit_save_middle.setSize(67,elements.edit_save_middle.getHeight())
		elements.edit_save_end.setLocation(246,elements.edit_save_end.getLocationY())
	}
	else {
		//little button
		elements.edit_save_middle.setSize(67-25,elements.edit_save_middle.getHeight())
		elements.edit_save_end.setLocation(246-25,elements.edit_save_end.getLocationY())
	}
	
	globals.TRIGGER_interface_lock(_editMode)
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"EB7C403A-0777-4FEC-A0EF-54D1E74C53E6"}
 */
function ACTION_find(event) {
	plugins.window.showFormPopup(forms.DATASUTRA_WEB_0F__header__actions.elements.btn_find_popdown,forms.NAV_P__fastfind,forms.DATASUTRA_WEB_0F__header,'_search')
}

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D2908724-FCBB-4E21-8C8A-86F8A9BDED08"}
 */
function ACTION_find_right(event) {
	globals.NAV_find_fields(event)
}

/**
 * Auto-hide/show fast find data entry
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"5D86C07E-1F37-4E4E-A7D8-48A56C71F347"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow && false) {
		var elem = plugins.WebClientUtils.getElementMarkupId(elements.btn_find)
		
		var script = plugins.WebClientUtils.generateCallbackScript(ACTION_find)
		
		//rollover of fast find auto-pops up form
		plugins.WebClientUtils.executeClientSideJS("$('#" + elem + "').on('mouseover','span',function(){" + script + "});");
		
		//rollout of fast find hides form
		plugins.WebClientUtils.executeClientSideJS("$('#" + elem + "').on('mouseout','span',function(){alert('goodbye');});");
	}
}
