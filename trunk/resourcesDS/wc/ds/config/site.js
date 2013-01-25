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
 *	This file is for global configuration variables.
 */

// the domain that webclient is accessible on (same as the one the /ds/ wrapper is served from)
function dsDomain() {
	return 'http://servlets:8081';
}

// the parent domain that the external login page is served from
function dsLoginDomain() {
	return 'http://localhost:8081';
}

// what kind of device are we being accessed from
function dsFactor() {
	if (navigator.userAgent.match(/iPad/i) || 
		navigator.userAgent.match(/Android.+Tablet/i) || 
		navigator.userAgent.match(/Nexus\s7/i) || navigator.userAgent.match(/Nexus\s10/i) ||
		navigator.userAgent.match(/Kindle/i) || navigator.userAgent.match(/Silk-Accelerated/i) || 
		navigator.userAgent.match(/PlayBook/i) || navigator.userAgent.match(/Xoom/i)
		) {
		
		return 'iPad';
	}
	else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || 
		navigator.userAgent.match(/Android.+Mobile/i) || navigator.userAgent.match(/Nexus\s4/i)
		) {
		
		return 'iPhone';
	}
	else {
		return 'Desktop';
	}
}