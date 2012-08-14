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
 *	This file is for functions that are used only for the data sutra
 *	application platform when it is run in an iframe from the router/wrapper.
 */

//try to pre-render page before shown to minimize flicker as dom rewritten
function preRender(description,path,delay) {
	//if running in chrome, try to prerender page and then navigate there
	if (false) {
		$('head', window.parent.document).append('<link rel="prerender" type="text/css" href="' + path + '" />');
		window.parent.routerDelay(null,description,path,delay || 500);
	}
	//not chrome, just go there
	else {
		//called from data sutra wrapper
		if (window.top.routerDelay) {
			window.parent.routerDelay(null,description,path,250);
		}
	}
}

//break out of parent iframe and start application
function launchApp() {
	if (window.parent && window.parent.windowProxy) {
		window.parent.windowProxy.post({path:true});
	}
}