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

// show reporsetTimeout(t
function printShow() {
	document.getElementById('blocker').style.display = 'block';
	document.getElementById('report').style.display = 'block';
}

// load report
function printLoad(input) {
	if (input) {
		// '<embed width="100%" height="100%" name="plugin" src="/reports/' + printFile.getName() + '" type="application/pdf">'
		
		var wcWindow = swcWindow();
		var pdfJS = false;
		
		var reportContent = document.getElementById('content');
		
		// using firefox or this type of pdf renderer requested
		if (pdfJS || (wcWindow && wcWindow.$ && wcWindow.$.browser && wcWindow.$.browser.mozilla)) {
			//fill with iframe if needed
			if (reportContent.innerHTML == "") {
				//iframe to hold pdf.js stuff
				var iframeHeader = document.createElement('IFRAME');
				iframeHeader.id = 'report_pdf';
				iframeHeader.name = 'report_pdf';
				iframeHeader.src = '/js/lib/pdf.js/viewer.html?file=' + encodeURIComponent(input);
				iframeHeader.width = '100%';
				iframeHeader.height = '100%';
				iframeHeader.scrolling = 'no';
				iframeHeader.frameBorder = 0;
				iframeHeader.seamless = 'seamless';
			
				// iframe load
				reportContent.appendChild(iframeHeader);
			}
			//update the pdf it is showing
			else {
				var pdfWindow;
				//webkit (chrome, safari)
				if (window.frames['report_pdf'] && window.frames['report_pdf'].window) {
					pdfWindow = window.frames['report_pdf'].window;
				}
				//firefox and everybody else
				else if (window.frames['report_pdf'] && window.frames['report_pdf'].contentWindow) {
					pdfWindow = window.frames['report_pdf'].contentWindow;
				}
				
				if (pdfWindow) {
					//trash existing contents quickly
					pdfWindow.PDFView.container.innerHTML = '<div id="viewer"></div>';
					
					//load new document in
					pdfWindow.PDFView.open(input);
				}
				else {
					console.log("PDF iframe unavailable");
				}
			}
		}
		// use native pdf renderer
		else {
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
		}
		
		printShow();
	}
}