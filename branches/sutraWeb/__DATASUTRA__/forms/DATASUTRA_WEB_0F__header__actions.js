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
	
	elements.btn_create.enabled = (forms[_methodForm] && forms[_methodForm].REC_new) ? true : false
	elements.btn_actions.enabled = (forms[_methodForm] && forms[_methodForm].ACTIONS_list || (navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.actions && navigationPrefs.byNavItemID[solutionPrefs.config.currentFormID].buttons.actions.length)) ? true : false
	elements.btn_delete.enabled = (forms[_methodForm] && forms[_methodForm].REC_delete) ? true : false
	
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
 * @properties={typeid:24,uuid:"03B65491-02BF-41D0-95E7-2A20C56D1E3D"}
 */
function REC_new(event) {
	if (forms[_methodForm] && forms[_methodForm].REC_new) {
		forms[_methodForm].REC_new(event)
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
 * @properties={typeid:24,uuid:"7F4C3D7F-7063-40ED-AFE0-F985484B8DC7"}
 */
function ACTIONS_list(event) {
	if (forms[_methodForm] && forms[_methodForm].ACTIONS_list) {
		forms[_methodForm].ACTIONS_list(event)
	}
	//call default actions configured for this navigation item
	else {
		//grab actions
		var menu = forms.NAV_T_universal_list__WEB__buttons.ACTIONS_list(null,true)
		
		var elem = elements[event.getElementName()]
		if (elem != null) {
		    plugins.popupmenu.showPopupMenu(elem, menu)
		}
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
 * @properties={typeid:24,uuid:"51B35F72-AE6C-49E5-988B-546F5E4EB7A2"}
 */
function EDIT_begin(event) {
	_editMode = true
	EDIT_elements()
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"414F564F-CFF5-4BA9-8FD8-D744497F8778"}
 */
function EDIT_save(event) {
	_editMode = false
	EDIT_elements()
}

/**
 * @param {JSEvent} [event]
 *
 * @properties={typeid:24,uuid:"67C6D5AB-7DC9-4C84-9997-FF35400E8508"}
 */
function EDIT_cancel(event) {
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
	elements.btn_delete.enabled = !_editMode
	
	//edit mode
	if (_editMode) {
		//big button
		elements.edit_save_middle.setSize(67,elements.edit_save_middle.getHeight())
		elements.edit_save_end.setLocation(171,elements.edit_save_end.getLocationY())
	}
	else {
		//little button
		elements.edit_save_middle.setSize(67-25,elements.edit_save_middle.getHeight())
		elements.edit_save_end.setLocation(171-25,elements.edit_save_end.getLocationY())
	}
	
	globals.TRIGGER_interface_lock(_editMode)
}