
/**
 * Sample slick-grid row-background styling
 *
 * @param {JSRecord} record
 *
 * @properties={typeid:24,uuid:"861DAFA2-43DD-4E59-B046-D87745D9B11D"}
 */
function row_background_slick(record) {
	if (record instanceof JSRecord) {
		//discontinued (green)
		if (record.line_2) {
			return 'colorRed'
		}
		//left handed (red)
		else if (record.line_1) {
			return 'colorGreen'
		}
	}
}
