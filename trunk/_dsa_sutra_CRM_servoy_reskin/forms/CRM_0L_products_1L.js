/**
 *
 * @properties={typeid:24,uuid:"7bd30b2d-fd62-4648-8095-19c2c8ca5d1c"}
 */
function REC_on_select()
{
if (utils.hasRecords(foundset)) {
	globals.CRM_products_selected = product_id
}

//sets record navigator to reflect current index and found set
globals.TRIGGER_toolbar_record_navigator_set()
}
