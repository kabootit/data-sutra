/**
 *
 * @properties={typeid:24,uuid:"971731ba-47ab-402a-90f2-755832283df1"}
 */
function ACTION_done()
{


//enaable closing the form
globals.CODE_hide_form = 1

application.closeFormDialog()
}

/**
 *
 * @properties={typeid:24,uuid:"f14b56cb-a381-4d45-b318-7e057112368d"}
 */
function FORM_on_show()
{

//disable closing the form
globals.CODE_hide_form = 0
}
