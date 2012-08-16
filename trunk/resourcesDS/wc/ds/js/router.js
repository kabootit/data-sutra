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
 *	This file is for functions that are used by the router/wrapper
 *	to maintain the history stack, configure the iframe, etc.
 */


// the domain that webclient is accessible on (same as the one this wrapper is served from)
var dsDomain = '';	//'http://servlets:8081';

// the parent domain that the small login page is served from
var dsLoginDomain = 'http://localhost:8081'

// porthole so able to speak with any parent iframe
var windowProxy;
window.onload=function(){ 
	// Porthole.trace("onload"); 
	
	// Create a proxy window to send to and receive message from the iframe
	windowProxy = new Porthole.WindowProxy(dsLoginDomain + '/ds/external/proxy.html');
};

// alert when window's focus gained/lost
function handleVisibilityChange() {
	//get iframe to send call back to server
	var iframeHeader = document.getElementById('wc_chatter');
	
	//start call
	var dynamicURL = dsDomain + "/servoy-webclient/ss/s/__DATASUTRA__/m/DS_router_visibility/a/";
	
	//alert server that this tab no longer has focus
	if (document.webkitHidden) {
		dynamicURL += 'true/';
		// console.log('hidden at: ' + new Date());
	}
	//poll server to get an active connection again
	else {
		dynamicURL += 'false/';
		// console.log('shown at: ' + new Date());
	}
	
	//iframe created, null it out
	if (iframeHeader) {
		iframeHeader.src = '';
	}
	//iframe not created yet, create it
	else {
		// iframe setup
		var iframeHeaderCell = document.getElementById('sutra');
		
		var iframeHeader = document.createElement('IFRAME');
		iframeHeader.id = 'wc_chatter';
		iframeHeader.width = 0;
		iframeHeader.height = 0;
		iframeHeader.scrolling = 'no';
		iframeHeader.frameBorder = 0;
		iframeHeader.style = 'visibility:hidden';
	
		// iframe load
		iframeHeaderCell.appendChild(iframeHeader);
	}
	
	//tack on pathname
	if (window.location.pathname) {
		//replace all slashes out with backspace characters because servoy is de-encoding at some point
		var path = window.location.pathname.replace(/\//g,'%09');
		
		dynamicURL += 'path/' + path + '/';
	}
	
	//when switching tabs, the show of the one you're going to fires before the hide of the one you left...try to get this firing in the right order...actually not, breakpoints were throwing me off
	// fire hide event now
	if (document.webkitHidden) {
		iframeHeader.src = dynamicURL;
	}
	//fire show event in the future
	else {
		setTimeout(function() {
			iframeHeader.src = dynamicURL;
		},100);
	}
	// iframeHeader.src = dynamicURL;
}
document.addEventListener("webkitvisibilitychange", handleVisibilityChange, false);

// clean up function to remove additional 'chatter' iframe
function removeChatter() {
	//get iframe used to send call back to server
	var iframeHeader = document.getElementById('wc_chatter');
	
	//delete it
	if (iframeHeader) {
		iframeHeader.parentNode.removeChild(iframeHeader);
	}
}

// set up switcheroo for initial 'Loading...' thing
(function() {
	var timeOut = 1
	
	function checkStat() {
		timeOut++;
		// console.log('CHECK STAT: ' + timeOut);
		
		// only the Please wait has loaded
		if (window.frames['wc'] && window.frames['wc'].window && window.frames['wc'].window.document && 
			window.frames['wc'].window.document.getElementsByTagName('body').length && 
			(window.frames['wc'].window.document.getElementsByTagName('body')[0].getAttribute('onload') == "javascript:submitform();" || 
			window.frames['wc'].window.document.getElementsByTagName('body')[0].getAttribute('onload') == "window.setTimeout(submitform,50);")) {
			
			window.frames['wc'].window.document.getElementById('loading').innerHTML = '';
		}
		// keep running for 5 seconds or until changed once
			//will not get changed if really slow network or if webclient already started
		else if (timeOut < 100) {
			setTimeout(checkStat,50);
		}
	}
	
	// start first time
	setTimeout(checkStat,25);
})();

// set up history handling
(function(window,undefined) {

	// Prepare
	var History = window.History;
	if ( !History.enabled ) {
		return false;
	}

	// listener for using browser back/forward buttons
	History.Adapter.bind(window,'statechange',function(){ 
		var State = History.getState();
		// History.log(State.data, State.title, State.url);
		if (!State.data.server) {
			// run the router with history data instead of url
			router(State.data.url);
		}
	});

})(window);

// center login form
function centerForm(formName) {
	//center the form (will recall this method to actually unlock the screen)
	window.frames['wc'].window.centerForm(formName)
}

// center login form
function viewForm(toggle) {
	if (document.getElementById('sutra') && document.getElementById('blocker')) {
		//unlock the screen
		if (toggle) {
			//show the iframe
			document.getElementById('sutra').style.display = 'block';
	
			//unlock screen
			document.getElementById('blocker').style.display = 'none';
		}
		else {
			//lock screen
			document.getElementById('blocker').style.display = 'block';
		
			//hide the iframe
			document.getElementById('sutra').style.display = 'none';
		}
	}
}

// call method in iframe if doesn't exist
function triggerAjaxUpdate() {
	window.frames['wc'].window.triggerAjaxUpdate(arguments[0],arguments[1],arguments[2],arguments[3])
}


// delay running of router until webclient form loaded in
function routerDelay(p1,p2,p3,p4) {
	setTimeout(function(){
		History.pushState(p1,p2,p3)
	},p4);
}

function routerReplace(p1,p2,p3) {
	History.replaceState(p1,p2,p3)
}

function reloadPage() {
	setTimeout(function(){window.location.reload(true)},2500);
}

function router(data) {
	// handle params
	var append = "";
	
	// params passed in
	if (data) {
		append = data;
	}
	// params in URL
	else {
		var iframeEl 	= document.getElementById('sutra');
		var url 		= window.location.pathname;
		
		// strip trailing slash
		url 			= ( url.charAt(url.length - 1) === "/" ) ? url.substr(0, url.length - 1) : url;
		var urlElements = url.split('/').slice(2);
		for (var x = 0; x < urlElements.length; x++) {
			append += urlElements[x] + "/";
			if ( x != urlElements.length - 1 ) {
				append += "p" + (x + 1) + "/";
			}
		}
	}
	
	// login url requested
	if (append == 'login/') {
		append = 'DSLogin/';
	}
	// login inline url requested
	else if (append == 'loginInline/') {
		append = 'DSLoginSmall/';
	}
 	// logout url requested
	else if (append == 'logout/') {
		append = 'DSLogout/';
	}
	// redirect to pop out of inline form
		// special url needed so that client-side javascript can fire to get anchoring to work again
	else if (append == 'launchingDS/') {
		append = 'DSHomeCall/';
	}
	// check that append has a value, otherwise show error page
	else if (!append) {
		append = 'DSError_NoURL/';
	}
	
	//tack on referrer
	if (document.referrer) {
		//replace all slashes out with backspace characters because servoy is de-encoding at some point
		var refer = document.referrer.replace(/\//g,'%09')
		
		append += 'refer/' + refer + '/';
	}
	
	// temporary logging
	// console.log(History.getState().data);
	
	// swc iframe setup
	var iframeHeaderCell = document.getElementById('sutra');
	iframeHeaderCell.innerHTML = "";
	var dynamicURL = dsDomain + "/servoy-webclient/ss/s/__DATASUTRA__/m/DS_router/a/" + append;
	
	var iframeHeader = document.createElement('IFRAME');
	iframeHeader.id = 'wc_application';
	iframeHeader.src = dynamicURL ;
	iframeHeader.width = '100%';
	iframeHeader.height = '100%';
	iframeHeader.scrolling = 'yes';
	iframeHeader.frameBorder = 0;
	
	// iframe load
	iframeHeaderCell.appendChild(iframeHeader);	
	
};

// run router first time
setTimeout(router,0);