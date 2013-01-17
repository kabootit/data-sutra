/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"0E4A00FE-1D8D-4E97-9C8A-0EB0DEFDC8B1"}
 */
var _mainSize = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"18FC565D-4466-4A77-A4B6-B4521B74055B",variableType:4}
 */
var _mainDivider = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"68B47445-CBC4-4D46-85F6-5A10F164466E",variableType:4}
 */
var _workflowDivider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"A63A3C7F-0B50-4E19-8678-6EA567605C61"}
 */
var _workflowSize = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"0ADC47F1-1BE7-4DFB-8FAA-4C09C6302A00",variableType:4}
 */
var _listDivider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"4B18AB47-328E-467F-8227-846B78824F56"}
 */
var _listSize = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"40B053B9-C062-41B6-B8A1-D475628E2D63"}
 */
var _headerSize = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"CE996C68-414F-41D4-999E-FC0A5D42B997",variableType:4}
 */
var _wrapperDivider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6E856AD7-FBF7-4C4E-8311-4A5AC1FC93FC"}
 */
var _wrapperSize = null;

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"AAB32261-811F-408D-961D-4F3EE7F725FA"}
 */
function FORM_on_show(firstShow, event) {
	//prefill values
	_headerSize = forms.DATASUTRA_WEB_0F__main.elements.tab_header.getWidth() + ',' + forms.DATASUTRA_WEB_0F__main.elements.tab_header.getHeight()
	
	_listDivider = forms.DATASUTRA_WEB_0F__list.elements.tab_list.dividerLocation
	_listSize = forms.DATASUTRA_WEB_0F__list.elements.tab_list.getWidth() + ',' + forms.DATASUTRA_WEB_0F__list.elements.tab_list.getHeight()
	
	_mainDivider = forms.DATASUTRA_WEB_0F__main.elements.tab_main.dividerLocation
	_mainSize = forms.DATASUTRA_WEB_0F__main.elements.tab_main.getWidth() + ',' + forms.DATASUTRA_WEB_0F__main.elements.tab_main.getHeight()
	
	_wrapperDivider = forms.DATASUTRA_WEB_0F.elements.tab_wrapper.dividerLocation
	_wrapperSize = forms.DATASUTRA_WEB_0F.elements.tab_wrapper.getWidth() + ',' + forms.DATASUTRA_WEB_0F.elements.tab_wrapper.getHeight()
	
	//custom form setup for iOS FiD
	globals.CODE_form_in_dialog_setup_ipad()
}

/**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"2A3719D1-6487-45CA-92ED-ABD0F7BCF341"}
 */
function ACTION_divider(oldValue, newValue, event) {
	switch (event.getElementName()) {
		case 'dWrapper':
			forms.DATASUTRA_WEB_0F.elements.tab_wrapper.dividerLocation = _wrapperDivider
			break
		case 'dList':
			forms.DATASUTRA_WEB_0F__list.elements.tab_list.dividerLocation = _listDivider
			break
		case 'dMain':
			forms.DATASUTRA_WEB_0F__main.elements.tab_main.dividerLocation = _mainDivider
			break
	}
}

/**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"B3377B78-7661-46E5-858F-B6B799396B74"}
 */
function ACTION_size(oldValue, newValue, event) {
	var height, width
	
	switch (event.getElementName()) {
		case 'sWorkflow':
			width = _workflowSize.split(',')[0]
			height = _workflowSize.split(',')[1]
			
			forms.DATASUTRA_WEB_0F__workflow.elements.tab_workflow.setSize(width,height)
			break
		case 'sWrapper':
			width = _wrapperSize.split(',')[0]
			height = _wrapperSize.split(',')[1]
		
			forms.DATASUTRA_WEB_0F.elements.tab_wrapper.setSize(width,height)
			break
		case 'sList':
			width = _listSize.split(',')[0]
			height = _listSize.split(',')[1]
		
			forms.DATASUTRA_WEB_0F__list.elements.tab_list.setSize(width,height)
			break
		case 'sMain':
			width = _mainSize.split(',')[0]
			height = _mainSize.split(',')[1]
			
			forms.DATASUTRA_WEB_0F__main.elements.tab_main.setSize(width,height)
			break
		case 'sHeader':
			width = _headerSize.split(',')[0]
			height = _headerSize.split(',')[1]
			
			forms.DATASUTRA_WEB_0F__main.elements.tab_header.setSize(width,height)
			break
	}
}
