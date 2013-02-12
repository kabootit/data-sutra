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
 *	This file is for functions that are used by the router/wrapper
 *	to maintain the history stack, configure the iframe, etc.
 */

// start listening for internal error page; help kill session if detected
(function() {
	var timeOut = 1

	function checkError() {
		var wcDoc = swcDocument();
		timeOut++;
		console.log('CHECK ERROR: ' + timeOut);
		
		// only the Please wait has loaded
		if (false) {/*wcDoc && wcDoc.getElementsByTagName('body').length && 
			(wcDoc.getElementsByTagName('body')[0].getAttribute('onload') == "javascript:submitform();" || 
			wcDoc.getElementsByTagName('body')[0].getAttribute('onload') == "window.setTimeout(submitform,50);")) {*/

			wcDoc.getElementById('loading').innerHTML = '';
		}
		// keep running for 5 seconds or until changed once
			//will not get changed if really slow network or if webclient already started
		else {
			setTimeout(checkError,2500);
		}
	}

	// start first time
	// setTimeout(checkError,1000);
})();

// set up switcheroo for initial 'Loading...' thing
(function() {
	var timeOut = 1
	
	function checkStat() {
		var wcDoc = swcDocument();
		timeOut++;
		// console.log('CHECK STAT: ' + timeOut);
		
		// only the Please wait has loaded
		if (wcDoc && wcDoc.getElementsByTagName('body').length && 
			(wcDoc.getElementsByTagName('body')[0].getAttribute('onload') == "javascript:submitform();" || 
			wcDoc.getElementsByTagName('body')[0].getAttribute('onload') == "window.setTimeout(submitform,50);")) {

			wcDoc.getElementById('loading').innerHTML = '';
		}
		// keep running for 5 seconds or until changed once
			//will not get changed if really slow network or if webclient already started
		else {
			setTimeout(checkStat,50);
		}
	}
	
	// start first time
	setTimeout(checkStat,25);
})();

// set up history handling
(function(window,undefined) {

	// prepare History.js
	var History = window.History;
	if (!History.enabled) {
		return false;
	}
	
	// functions that listen for history navigation and hard refreshes
	function stateChange() {
		// console.log('state change: ' + History.getState().url);
		router(History.getState().url);
	}
	
	function domLoad() {
		// console.log('on dom load: ' + History.getState().url);
		router(History.getState().url);
	}
	
	History.Adapter.bind(window, 'statechange', stateChange);
	History.Adapter.onDomLoad(domLoad);

})(window);

function router(input) {
	//TODO: determine if called using history buttons and turn on indicator in fixed location
	
	//navigate
	var wcWindow = swcWindow();
	if (wcWindow && wcWindow.dsNavigate) {
		// console.log('routerTWO: ' + input);
		wcWindow.dsNavigate();
	}
}

// center login form
function centerForm(formName) {
	//center the form (will recall this method to actually unlock the screen)
	var wcWindow = swcWindow();
	if (wcWindow && wcWindow.centerForm) {
		wcWindow.centerForm(formName);
	}
}

// grab servoy web client iframe document
function swcDocument() {
	//webkit (chrome, safari)
	if (window.frames['wc_application'] && window.frames['wc_application'].document) {
		return window.frames['wc_application'].document
	}
	//firefox and everybody else
	else if (window.frames['wc_application'] && window.frames['wc_application'].contentDocument) {
		return window.frames['wc_application'].contentDocument
	}
}

// grab servoy web client iframe window
function swcWindow() {
	//webkit (chrome, safari)
	if (window.frames['wc_application'] && window.frames['wc_application'].window) {
		return window.frames['wc_application'].window
	}
	//firefox and everybody else
	else if (window.frames['wc_application'] && window.frames['wc_application'].contentWindow) {
		return window.frames['wc_application'].contentWindow
	}
}

// call method in iframe if doesn't exist
function triggerAjaxUpdate() {
	var wcWindow = swcWindow();
	if (wcWindow && wcWindow.triggerAjaxUpdate) {
		wcWindow.triggerAjaxUpdate.apply(arguments)
	}
}

// delay running of router until webclient form loaded in
function routerDelay(p1,p2,p3,p4) {
	setTimeout(function(){
		History.pushState(p1,p2,p3)
		
		googleAnalytics()
	},p4);
}

function routerReplace(p1,p2,p3) {
	History.replaceState(p1,p2,p3)
	
	googleAnalytics()
}

function reloadPage() {
	setTimeout(function(){window.location.reload(true)},2500);
}

// Inform Google Analytics of page change
	//see discussion (especially comments) https://gist.github.com/balupton/854622
function googleAnalytics() {
	//old way (footer include)
	if (typeof window.pageTracker !== 'undefined') {
		window.pageTracker._trackPageview(History.getState().url.replace(History.getRootUrl(),''));
	}
	//new way (header include) steps on servoy's toes
	else if (typeof window._gaq !== 'undefined' ) {
		window._gaq.push(['_trackPageview', History.getState().url.replace(History.getRootUrl(),'')]);
	}
	
	// console.log(History.getState().url.replace(History.getRootUrl(),''));
}

// use iframe to drive servoy webclient
function routerIframe(data) {
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
		var urlElements = url.split('/').slice(1);
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
		// MEMO: special url needed so that client-side javascript can fire to get anchoring to work again
	else if (append == 'launchingDS/') {
		append = 'DSHomeCall/';
	}
	// check that append has a value, otherwise show error page
	else if (!append) {
		append = 'DSError_NoURL/';
	}
	
	//tack on referrer (as long as it isn't servoy-webclient...get around logout issue)
	if (document.referrer && (document.referrer.indexOf('servoy-webclient') == -1)) {
		//replace all slashes out with tab characters because servoy is de-encoding at some point
		// var refer = document.referrer.replace(/\//g,'%09')
		var refer = window.btoa(unescape(encodeURIComponent( document.referrer )));
		
		append += 'refer/' + refer + '/';
	}
	
	// temporary logging
	// console.log(History.getState().data);
	
	// swc iframe setup
	var iframeHeaderCell = document.getElementById('sutra');
	
	//something not right, try calling again in a second
	if (!iframeHeaderCell) {
		setTimeout(function(){routerIframe(data);},0);
		return;
	}
	
	iframeHeaderCell.innerHTML = "";
	// var dynamicURL = dsDomain + "/servoy-webclient/ss/s/__DATASUTRA__/m/DS_router/a/" + append;
	var dynamicURL = "/servoy-webclient/ss/s/__DATASUTRA__/m/DS_router/a/" + append;
	
	var iframeHeader = document.createElement('IFRAME');
	iframeHeader.id = 'wc_application';
	iframeHeader.name = 'wc_application';
	iframeHeader.src = dynamicURL ;
	iframeHeader.width = '100%';
	iframeHeader.height = '100%';
	iframeHeader.scrolling = 'yes';
	iframeHeader.frameBorder = 0;
	iframeHeader.seamless = 'seamless';
	
	// iframe load
	iframeHeaderCell.appendChild(iframeHeader);	
	
	setTimeout(function() {
		//redo UL
		var wcWindow = swcWindow();
		if (wcWindow && wcWindow.prettifyUL) {
			wcWindow.prettifyUL(20);
		}
	},1000);
};

// run router first time
setTimeout(routerIframe,0);