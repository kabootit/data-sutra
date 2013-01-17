/**
 *
 * @properties={typeid:24,uuid:"c1b8623c-a232-432a-8c10-168df32a6534"}
 */
function REC_on_select()
{
if (utils.hasRecords(foundset)) {
	//set background
	globals.CRM_companies_selected = company_id
}

//sets record navigator to reflect current index and found set
globals.TRIGGER_toolbar_record_navigator_set()
}
