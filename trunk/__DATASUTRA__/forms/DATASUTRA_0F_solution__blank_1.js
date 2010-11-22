/**
 *
 * @properties={typeid:24,uuid:"445332a0-cc30-41f5-b18c-174e6e310879"}
 */
function FORM_on_hide()
{

//set record navigator to be enabled again
globals.CALLBACK_toolbar_record_navigator_set(true)

}

/**
 *
 * @properties={typeid:24,uuid:"5bfb3fef-6fb9-4bec-a4b7-540bcf85d1f3"}
 */
function FORM_on_show()
{

//set record navigator to blank
globals.CALLBACK_toolbar_record_navigator_set(false)

}
