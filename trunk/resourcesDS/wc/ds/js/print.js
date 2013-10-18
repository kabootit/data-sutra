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
 *	This file is for managing the print preview and URL overlay.
 */

// close overlay frame and turn off blocker
function overlayClose() {	
	document.getElementById('blocker').style.display = 'none';
	document.getElementById('overlay').style.display = 'none';
	
	var url = document.getElementById('overlay_url')
	if (url) {
		url.style.display = 'none';
	}
	var pdf = document.getElementById('report_pdf')
	if (pdf) {
		pdf.style.display = 'none';
	}
	
	return false;
}

// show overlay frame
function overlayShow() {
	document.getElementById('blocker').style.display = 'block';
	document.getElementById('overlay').style.display = 'block';
}

// load URL
function urlLoad(input) {
	var container = document.getElementById('content');
	var url = document.getElementById('overlay_url');
	
	//has been inited, whack it
	if (url) {
		url.parentNode.removeChild(url);
	}
	
	//full-on iframe or partial page
	if (input.indexOf('://') < 10) {
		var fullIframe = true
	}
	
	//iframe to hold web stuff
	var iframeHeader = document.createElement('IFRAME');
	iframeHeader.id = 'overlay_url';
	iframeHeader.name = 'overlay_url';
	if (fullIframe) {
		iframeHeader.src = input;
	}
	else {
		iframeHeader.srcdoc = input;
	}
	iframeHeader.width = '100%';
	iframeHeader.height = '100%';
	// iframeHeader.scrolling = 'no';
	iframeHeader.frameBorder = 0;
	iframeHeader.seamless = 'seamless';
			
	// iframe load
	container.appendChild(iframeHeader);
	
	//show it
	document.getElementById('overlay_url').style.display = 'block';
	overlayShow();
}

// load dummy report to get library primed for future use
function printInit() {
	var container = document.getElementById('content');
	var report = document.getElementById('report_pdf');
	
	//has not been inited yet
	if (!report) {
		//iframe to hold pdf.js stuff
		var iframeHeader = document.createElement('IFRAME');
		iframeHeader.id = 'report_pdf';
		iframeHeader.name = 'report_pdf';
		iframeHeader.src = '/js/lib/pdf.js/viewer.html?file=/reports/blank.pdf';
		iframeHeader.width = '100%';
		iframeHeader.height = '100%';
		iframeHeader.scrolling = 'no';
		iframeHeader.frameBorder = 0;
		iframeHeader.seamless = 'seamless';
			
		// iframe load
		container.appendChild(iframeHeader);
		
		//hide it
		iframeHeader.style.display = 'none';
	}
}

// load report
function printLoad(input) {
	if (input) {
		// '<embed width="100%" height="100%" name="plugin" src="/reports/' + printFile.getName() + '" type="application/pdf">'
		
		var wcWindow = swcWindow();
		var pdfJS = true;
		
		var container = document.getElementById('content');
		var report = document.getElementById('report_pdf');
		
		// using firefox or this type of pdf renderer requested
		if (pdfJS || (wcWindow && wcWindow.$ && wcWindow.$.browser && wcWindow.$.browser.mozilla)) {
			//fill with iframe if needed
			if (!report) {
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
				container.appendChild(iframeHeader);
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
		
		document.getElementById('report_pdf').style.display = 'block';
		overlayShow();
	}
}

// load report
function printSave(input) {
	if (input) {
		//tack on token that makes it download
		input += '@download';
		
		var reportDownload = document.getElementById('download');
		
		//fill with iframe if needed
		if (reportDownload.innerHTML == "") {
			//iframe to hold pdf.js stuff
			var iframeHeader = document.createElement('IFRAME');
			iframeHeader.id = 'report_download';
			iframeHeader.name = 'report_download';
			iframeHeader.src = input;
			iframeHeader.scrolling = 'no';
			iframeHeader.frameBorder = 0;
			iframeHeader.seamless = 'seamless';
			
			// iframe load
			reportDownload.appendChild(iframeHeader);
		}
		//update the iframe to download a new file
		else {
			var iframeHeader = document.getElementById('report_download');
			iframeHeader.src = input;
		}
	}
}