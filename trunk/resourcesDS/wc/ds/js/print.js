/**
 * 	Copyright (C) 2006 - 2013 Data Mosaic
 *	http://www.data-mosaic.com
 *	All rights reserved 
 *
 *	The copyright of the computer program(s) herein is 
 *	the property of Data Mosaic. The program(s) may be used/copied 
 *	only with the written permission of the owner or in 
 *	accordance with the terms and conditions stipulated in 
 *	the agreement/contract under which the program(s) have 
 *	been supplied.
 */

/*
 *	This file is for managing print preview.
 */

// close report frame and turn off blocker
function printClose() {	
	document.getElementById('blocker').style.display = 'none';
	document.getElementById('report').style.display = 'none';
	return false;
}

// show report
function printShow() {
	document.getElementById('blocker').style.display = 'block';
	document.getElementById('report').style.display = 'block';
}

// load report
function printLoad(input) {
	if (input) {
		// '<embed width="100%" height="100%" name="plugin" src="/reports/' + printFile.getName() + '" type="application/pdf">'
		
		// setup embed for pdf
		var reportContent = document.getElementById('content');
		reportContent.innerHTML = "";
		
		var reportPDF = document.createElement('EMBED');
		reportPDF.id = 'content_pdf';
		reportPDF.width = '100%';
		reportPDF.height = '100%';
		reportPDF.name = 'plugin';
		reportPDF.src = input;
		reportPDF.type = 'application/pdf';
		
		// iframe load
		reportContent.appendChild(reportPDF);	
		
		printShow();
	}
}