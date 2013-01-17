
/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"7A37EFD7-CDC0-40A7-8070-124F761E604B"}
 */
function FORM_on_show(firstShow, event) {
	//create dummy sample record
	if (!utils.hasRecords(foundset)) {
		foundset.newRecord()
		
		full_text = '<h1>Welcome to Data Sutra Web Demo RC1</h1>\
			<h3>Servoy 6.1.2 | Gentoo Linux | Last update: Sept 11, 2012</h3>\
			\
			<p>Thank you for checking out Data Sutra. Your login was initialized with data specific to your login using the SaaS capabilities of Data Sutra. So feel free to play around with things.</p>\
			\
			<p>Keep in mind that this is a demo server only and is not to be used for any kind of production purposes or real data.</p>\
			\
			<p>Thanks!</p>\
			<p></p>\
			\
			<p>1. Pricing and licensing for this version of Data Sutra will be announced when we get out of beta testing. Hosting plans will also be announced at that time.</p>\
			\
			<p>2. If you would like a Servoy developer version of Data Sutra to try out, email us at <a href="mailto:info@data-mosaic.com">info@data-mosaic.com</a></p>\
			\
			<p>3- Refer to our publically viewable Trello development board to track progress:</p>\
			\
			<p><a href="https://trello.com/board/data-sutra-milestones/4fe496d1f7c9efdd548d817e">https://trello.com/board/data-sutra-milestones/4fe496d1f7c9efdd548d817e</a>\
			</p>\
			\
			<p>4- Bug reports/feature requests are much appreciated! Either email us or access our feedback screen from the Sutra actions button in the top right corner of the application.</p>\
			\
			<p>5- Host environment: </p>\
			\
			<p>- blades with Intel Xeon 5650 processors running at 2.67GHz<br>\
			- 2.5" SAS harddrives in a raid 10 config<br>\
			- 96 GB RAM per blade<br>\
			- gigabyte ethernet ports and an integrated LSI 1064e SAS controller<br>\
			- located in St Paul, Minnesota at a highly secure and redundant hosting facility<br>\
			</p>'
		
		databaseManager.saveData()
	}
}
