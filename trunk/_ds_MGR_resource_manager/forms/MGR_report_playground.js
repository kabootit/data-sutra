/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"EC72EC1D-0F64-4C87-B0E3-E948F69D0383"}
 */
var _output = null;

/**
 * Set tooltip on all labels with jsdoc.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"0375541E-CF9A-4F06-B17A-C1C70C92FDAB"}
 */
function FORM_on_load(event) {
	
}

/**
 * @param {String} text
 *
 * @properties={typeid:24,uuid:"BE6EAD12-78CC-42DE-826E-DB012F9A0BA7"}
 */
function SET_label(text) {
	elements.lbl_method.text = (text || '') + ' at ' + globals.CODE_date_format(null,'specify','h:mm a')
}

/**
 * @param {byte[]|String}	results
 * @param {String} [type='pdfByteArray'] Valid types are pdfByteArray|String|Boolean
 * @param {String} [fail='Test&nbsp;failed']
 *
 * @properties={typeid:24,uuid:"10C314FD-BBD2-45F0-98F4-1FF52FAB29C5"}
 */
function SET_output(results,type,fail) {
	if (!type) {
		type = 'pdfByteArray'
	}
	if (!fail) {
		fail = 'Test failed'
	}
	
	if (results) {
		switch (type) {
			case 'pdfByteArray':
				if (results.length) {
					_output = '[' + results.join(', ') + ']'
				}
				else {
					_output = fail
				}
				break
			case 'String':
				if (typeof results == 'string') {
					_output = results
				}
				else {
					_output = fail
				}
				break
			case 'Boolean':
				if (typeof results == 'boolean') {
					_output = results.toString()
				}
				else {
					_output = fail
				}
				break
		}
	}
	else {
		_output = fail
	}
	
	
	
}

/**
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"249D9110-D05E-4E78-8EB9-22478740F5CD"}
 */
function DS_print_preview(event) {
	var arg = 'report_example.pdf'
	SET_label('scopes.DS.print.preview("' + arg + '")')
	
	var results = scopes.DS.print.preview('test_print_preview.pdf',scopes.DS.print.utils.getPDFByteArray.fromMediaLibrary(arg))
	
	SET_output(results,'String')
}

/**
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AAE20404-F9F2-4282-BFE1-B9EFFFBE16F1"}
 */
function DS_print_download(event) {
	var arg = 'report_example.pdf'
	SET_label('scopes.DS.print.download("' + arg + '")')
	
	var results = scopes.DS.print.download('test_print_download.pdf',scopes.DS.print.utils.getPDFByteArray.fromMediaLibrary(arg))
	
	SET_output(results,'String')
}

/**
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C5617172-1913-48E7-98E1-6DB119FDED98"}
 */
function DS_print_trigger(event) {
	var arg = 'crm_sample'
	SET_label('scopes.DS.print.trigger("' + arg + '")')
	
	var results = scopes.DS.print.trigger(arg)
	
	SET_output(results,'Boolean')
}

/**
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B1510281-8670-4BC3-9192-13617BF3CBB6"}
 */
function DS_print_utils_convertToPDFByteArray_fromServoyForm(event) {
	var arg = controller.getName()
	SET_label('scopes.DS.print.utils.convertToPDFByteArray.fromServoyForm("' + arg + '")')
	
	var results = scopes.DS.print.utils.convertToPDFByteArray.fromServoyForm(arg)
	
	SET_output(results)
}

/**
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DF8F1A66-69EE-4D12-95AB-188ED809BE47"}
 */
function DS_print_utils_convertToPDFByteArray_fromHTMLData(event) {
	var arg = '<html><body><h1>hello world!</h1></body></html>'
	SET_label('scopes.DS.print.utils.convertToPDFByteArray.fromHTMLData("' + arg + '")')
	
	var results = scopes.DS.print.utils.convertToPDFByteArray.fromHTMLData(arg)
	
	SET_output(results)	
}

/**
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D0FA6A87-CD69-4CA5-ACA7-BA14BB05A9D2"}
 */
function DS_print_utils_convertToPDFByteArray_fromHTMLURL(event) {
	var arg = 'http://trojalia.com/'
	SET_label('scopes.DS.print.utils.convertToPDFByteArray.fromHTMLURL("' + arg + '")')
	
	var results = scopes.DS.print.utils.convertToPDFByteArray.fromHTMLURL(arg)
	
	SET_output(results)	
}

/**
 * Note: this test requires the file sample.pdf to be in the root of the file system on the app server
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C119832B-EE05-438E-932E-6047E1E59179"}
 */
function DS_print_utils_getPDFByteArray_fromFileSystem(event) {
	var arg = '/sample.pdf'
	SET_label('scopes.DS.print.utils.getPDFByteArray.fromFileSystem("' + arg + '")')
	
	var results = scopes.DS.print.utils.getPDFByteArray.fromFileSystem(arg)
	
	SET_output(results,null,'Test failed.\nPlease make sure "sample.pdf" exists it the root of your filesystem.')
}

/**
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"82E562EB-D489-49CF-8161-08CFFE93CA1E"}
 */
function DS_print_utils_getPDFByteArray_fromMediaLibrary(event) {
	var arg = 'report_example.pdf'
	SET_label('scopes.DS.print.utils.getPDFByteArray.fromMediaLibrary("' + arg + '")')
	
	var results = scopes.DS.print.utils.getPDFByteArray.fromMediaLibrary(arg)
	
	SET_output(results)
}