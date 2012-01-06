/**
 * @properties={typeid:24,uuid:"14442047-4a08-4dd8-b652-d818f0ea842c"}
 */
function ACTION_configure()
{
}

/**
 *
 * @properties={typeid:24,uuid:"c4739b5a-1c28-455f-ba57-6223f17890e8"}
 */
function ACTION_default()
{


var formName = 'DEV_D_0F_navigation_item__fastfind'

//find correct navitem
forms[formName].controller.find()
forms[formName].id_navigation_item = solutionPrefs.config.currentFormID
forms[formName].controller.search()
	
//show the popup
globals.DEV_quickedit_toggle(formName)
}
