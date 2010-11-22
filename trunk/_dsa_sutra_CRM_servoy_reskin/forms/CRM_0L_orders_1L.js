/**
 *
 * @properties={typeid:24,uuid:"ed1f9b7e-fac8-4ad6-9374-3e1e1401baa7"}
 */
function REC_on_select()
{
if (utils.hasRecords(foundset)) {
	globals.CRM_orders_selected = order_id
}

//sets record navigator to reflect current index and found set
globals.CALLBACK_toolbar_record_navigator_set()
}
