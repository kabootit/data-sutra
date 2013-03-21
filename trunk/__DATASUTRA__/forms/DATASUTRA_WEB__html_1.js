/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"7A37EFD7-CDC0-40A7-8070-124F761E604B"}
 */
function FORM_on_show(firstShow, event) {
	globals.TRIGGER_toolbar_record_navigator_set(false)

	//create dummy sample record
	if (!utils.hasRecords(foundset)) {
		foundset.newRecord()
		
		full_text = '<h1>Welcome to Data Sutra 4.0.2</h1>\
		<h3>Servoy 6.1.4i1 | Gentoo Linux | Last server update: March 21, 2013</h3>\
		<p style="font-size: 13px; font-weight: normal; line-height: 15px;">Thank you for checking out Data Sutra. Your login was initialized with data specific to your login using the SaaS capabilities of Data Sutra. So feel free to play around with things.</p>\
		<p style="font-size: 13px; font-weight: normal; line-height: 15px;">Keep in mind that this is a demo server only and is not to be used for any kind of production purposes or real data.</p>\
		<p style="font-size: 13px; font-weight: normal; line-height: 15px;"><span style="line-height: 1.22;">- Bug reports/feature requests are much appreciated! Use the feedback tab on each screen for this or file in our project system:&nbsp;</span>http://community.data-sutra.com/projects/datasutra/issues/new</p>\
		<p style="font-size: 13px; font-weight: normal; line-height: 15px;"><span style="line-height: 1.22;">- US host details:</span></p>\
		<p style="font-size: 13px; font-weight: normal; line-height: 15px;">- blades with Intel Xeon 5650 processors running at 2.67GHz<br />\
			- 2.5" SAS harddrives in a raid 10 config<br />\
			- 96 GB RAM per blade<br />\
			- gigabyte ethernet ports and an integrated LSI 1064e SAS controller<br />\
			- located in St Paul, Minnesota at a highly secure and redundant hosting facility\
		</p>'
		
		databaseManager.saveData()
	}
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"11D95A0A-7F48-4EA6-8ABF-929B54130378"}
 */
function FORM_on_hide(event) {
	globals.TRIGGER_toolbar_record_navigator_set(true)
}
