/**
 *
 * @properties={typeid:24,uuid:"b8dcfcdf-a88a-4e48-969e-760ab3b5564c"}
 */
function REC_new_report()
{

//add report item
var formName = 'NAV_0F_navigation_item_1F__button'
var tabNumber = forms[formName].elements.tab_buttons.tabIndex
var tabFormName = 'NAV_0F_navigation_item_1F__button_2F_action_item__report_3L'
var relationName = forms[formName].elements.tab_buttons.getTabRelationNameAt(tabNumber)


forms[formName][relationName].newRecord(true, true)

var foundsetSize = forms[formName][relationName].getSize()

//select newly created record
forms[formName][relationName].setSelectedIndex(1)

//fill in fields
forms[formName][relationName].order_by = foundsetSize
forms[formName][relationName].id_report = id_report
//forms[formName][relationName].menu_name = report_description

//select newly created record
databaseManager.saveData()
forms[tabFormName].controller.setSelectedIndex(foundsetSize)

//request focus
application.updateUI()
forms[tabFormName].elements.fld_menu_name.requestFocus()
}
