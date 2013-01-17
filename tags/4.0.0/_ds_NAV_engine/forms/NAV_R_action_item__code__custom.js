/**
 *
 * @properties={typeid:24,uuid:"72747301-c649-4c1b-85f7-81b92faa5326"}
 */
function FORM_on_show()
{


//if custom with a method, null it out
}

/**
 *
 * @properties={typeid:24,uuid:"fed16345-2031-415e-b0cb-26b75d4de635"}
 */
function METHOD_color()
{


method_from_custom = globals.CODE_color_method(method)

elements.fld_method.visible = false
elements.fld_method_display.visible = true


elements.btn_edit.visible = true
elements.btn_save.visible = false

elements.lbl_edit_method.text = 'Edit'
//elements.lbl_edit_method.toolTipText = 'Edit custom code'

}

/**
 *
 * @properties={typeid:24,uuid:"940599b1-b2d9-4151-ada7-23e10fc33b9d"}
 */
function METHOD_edit()
{


//if one word ending in () without any . or [] in the name (aka method name)
if (!(utils.stringWordCount(method) == 1 && utils.stringRight(method,2) == '()' && !utils.stringPatternCount(method,'.') && !utils.stringPatternCount(method,'['))) {
	elements.fld_method.visible = true
	elements.fld_method_display.visible = false
	
	elements.btn_edit.visible = false
	elements.btn_save.visible = true
	
	elements.lbl_edit_method.text = 'Save'
	//elements.lbl_edit_method.toolTipText = 'View custom code'
}
//selected method name
else {
	globals.DIALOGS.showErrorDialog('Method exists', 'You may not edit the text of a method that is not custom', 'OK')
}
}

/**
 *
 * @properties={typeid:24,uuid:"1df4a5cc-97a5-4ceb-9baa-775f4658d610"}
 */
function REC_on_select()
{


//show pretty view unless editing
elements.fld_method.visible = false
elements.fld_method_display.visible = true


elements.btn_edit.visible = true
elements.btn_save.visible = false

elements.lbl_edit_method.text = 'Edit'
}
