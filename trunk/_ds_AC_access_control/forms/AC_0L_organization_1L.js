/**
 *
 * @properties={typeid:24,uuid:"C0032B10-9C96-4B42-82F7-4CC4CB26C499"}
 */
function REC_on_select()
{
	globals.AC_organization_selected = id_organization
	
	//on the valuelist pane, clear out items if no records
	if (forms.AC_0F_organization__saas.elements.tab_saas.tabIndex == 3 && !utils.hasRecords(forms.AC_0F_organization__saas_1F__valuelist_2L_valuelist__name.foundset)) {
		forms.AC_0F_organization__saas_1F__valuelist_2L_valuelist__item.foundset.clear()
	}
}
