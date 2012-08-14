/**
 * 	Copyright (C) 2006 - 2012 Data Mosaic
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
 *	This file is to be included in the login block to data sutra from an external website
 */

// this function includes all necessary js files for the application
function include(file) {
	var script	= document.createElement('script');
	script.src	= file;
	script.type = 'text/javascript';
	script.defer = true;
 
	document.getElementsByTagName('head').item(0).appendChild(script);
}
include('/ds/js/porthole.min.js');

// login completed, bust out of current page
function dsLogin(path) {
	// if specific url not passed in, shoot to default location
	var url = path || (dsLoginDomain + '/ds/launchingDS');
	
	// navigate current page to new url
	window.top.location = url;
}

// the parent domain that the small login page is served from
function getDomain() {
	var url = window.location.href;
	var arr = url.split("/");
	var result = arr[0] + "//" + arr[2];
	return result;
}

// the iframe domain where data sutra web is actually running
var dsLoginDomain = 'http://servlets:8081'

// porthole so able to speak with any parent iframe
var windowProxy;

function onMessage(messageEvent) {  
	// Porthole.trace("onMessage");
	
	if (messageEvent.origin == dsLoginDomain) {
		if (messageEvent.data["path"]) {
			//actual path given
			if (typeof messageEvent.data.path == 'string') {
				dsLogin(messageEvent.data["path"]);
			}
			//no path specified, go to default location
			else {
				dsLogin();
			}
		}
	}
}

window.onload = function() { 
	// Porthole.trace("onload"); 
	
	// Create a proxy window to send to and receive message from the iframe
	windowProxy = new Porthole.WindowProxy(getDomain() + '/ds/external/proxy.html', 'ds_website');
	windowProxy.addEventListener(onMessage);
};
