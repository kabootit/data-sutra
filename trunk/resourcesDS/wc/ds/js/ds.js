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

// try to pre-render page before shown to minimize flicker as dom rewritten
function preRender(data,description,path,delay) {
	//if running in chrome, try to prerender page and then navigate there
	if (false) {
		$('head', window.parent.document).append('<link rel="prerender" type="text/css" href="' + path + '" />');
		window.parent.routerDelay(data,description,path,delay || 500);
	}
	//not chrome, just go there
	else {
		//called from data sutra wrapper
		if (window.top.routerDelay) {
			window.parent.routerDelay(data,description,path,250);
		}
	}
}

// break out of parent iframe and start application
function launchApp(landingPage) {
	if (window.parent && window.parent.windowProxy) {
		var url = landingPage || true
		window.parent.windowProxy.post({path:url});
	}
}

// helper function to refresh the contents of iframe, making it hold the active connection to servoy server
function refreshOnShow() {
	setTimeout(function() {
		//reload the visible iframe
		window.parent.document.getElementById('wc_application').src = window.parent.document.getElementById('wc_application').src;
		
		//trash chatter iframe
		if (window.parent.removeChatter) {
			window.parent.removeChatter()
		}
	},10);
}

// show login inline after inline logout
function reLogin(smallForm) {
	//disconnect visibility methods
	if (window.parent.Visibility) {
		window.parent.Visibility.change(function(){});
	}
	
	//call logout method in iframe
	//get iframe to send call back to server
	var iframeHeader = window.parent.document.getElementById('wc_chatter');
	
	//iframe created already, null it out
	if (iframeHeader) {
		iframeHeader.src = 'about:blank';
	}
	//iframe not created yet, create it
	else {
		// iframe setup
		var iframeHeaderCell = window.parent.document.getElementById('sutra');
		
		var iframeHeader = window.parent.document.createElement('IFRAME');
		iframeHeader.id = 'wc_chatter';
		iframeHeader.width = 0;
		iframeHeader.height = 0;
		iframeHeader.scrolling = 'no';
		iframeHeader.frameBorder = 0;
		iframeHeader.seamless = 'seamless';
		iframeHeader.style = 'visibility:hidden';
		iframeHeader.src = "/servoy-webclient/ss/s/__DATASUTRA__/m/DS_router_logout/";
		
		// load logout in secondary iframe
		iframeHeaderCell.appendChild(iframeHeader);
	}
	
	//redirect to login page after logout has time (hopefully) to finish running
	setTimeout(function() {
		// load a blank in the main iframe
		window.parent.document.getElementById('wc_application').src = 'about:blank'
		
		//for external logout, only want to refresh that iframe
		if (smallForm) {
			//remove out the extra iframe
			window.parent.removeChatter()
					
			window.parent.document.getElementById('wc_application').src = '/ds/loginInline'
		}
		//for standalone logout, blow out the whole page
		else {
			window.top.location = '/ds'
		}
	},500);
}