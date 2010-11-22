/**
 *
 * @properties={typeid:24,uuid:"2bb23f97-ca3e-40dc-90ee-4ed2b77dfa45"}
 */
function REC_on_select()
{
if (utils.hasRecords(foundset)) {
	//set row background
	globals.CRM_contacts_selected = contact_id
}

//sets record navigator to reflect current index and found set
globals.CALLBACK_toolbar_record_navigator_set()
}
