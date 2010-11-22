/**
 *
 * @properties={typeid:24,uuid:"59F55647-C3E7-4532-A49A-3A2AC02014F2"}
 */
function REC_on_select()
{


if (utils.hasRecords(foundset) && full_text) {
	//starts with html, show html field
	if ('<html>'.equalsIgnoreCase(utils.stringLeft(full_text, 6))) {
		forms.MGR_0F_documentation_1F__preview_2F.elements.fld_text_html.visible = true
		forms.MGR_0F_documentation_1F__preview_2F.elements.fld_text_text.visible = false
	}
	//hide html field
	else {
		forms.MGR_0F_documentation_1F__preview_2F.elements.fld_text_html.visible = false
		forms.MGR_0F_documentation_1F__preview_2F.elements.fld_text_text.visible = true
	}
}
}
