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

// set up switcheroo for initial 'Loading...' thing
(function() {
	var timeOut = 1
	
	function checkStat() {
		timeOut++;
		// console.log('CHECK STAT: ' + timeOut);
		
		// only the Please wait has loaded
		if (window.frames['wc_application'] && window.frames['wc_application'].window && window.frames['wc_application'].window.document && 
			window.frames['wc_application'].window.document.getElementsByTagName('body').length && 
			(window.frames['wc_application'].window.document.getElementsByTagName('body')[0].getAttribute('onload') == "javascript:submitform();" || 
			window.frames['wc_application'].window.document.getElementsByTagName('body')[0].getAttribute('onload') == "window.setTimeout(submitform,50);")) {
			
			window.frames['wc_application'].window.document.getElementById('loading').innerHTML = '';
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
	if (window.frames['wc_application'] && window.frames['wc_application'].window && window.frames['wc_application'].window.navigate) {
		// console.log('routerTWO: ' + input);
		window.frames['wc_application'].window.navigate()
	}
}

// center login form
function centerForm(formName) {
	//center the form (will recall this method to actually unlock the screen)
	if (window.frames['wc_application'] && window.frames['wc_application'].window && window.frames['wc_application'].window.centerForm) {
		window.frames['wc_application'].window.centerForm(formName)
	}
}

// unblock the screen
// function viewForm(toggle) {
// 	if (document.getElementById('sutra') && document.getElementById('blocker')) {
// 		//unlock the screen
// 		if (toggle) {
// 			//show the iframe
// 			document.getElementById('sutra').style.display = 'block';
// 	
// 			//unlock screen
// 			document.getElementById('blocker').style.display = 'none';
// 		}
// 		else {
// 			//lock screen
// 			document.getElementById('blocker').style.display = 'block';
// 		
// 			//hide the iframe
// 			document.getElementById('sutra').style.display = 'none';
// 		}
// 	}
// }

// call method in iframe if doesn't exist
function triggerAjaxUpdate() {
	if (window.frames['wc_application'] && window.frames['wc_application'].window && window.frames['wc_application'].window.triggerAjaxUpdate) {
		window.frames['wc_application'].window.triggerAjaxUpdate.apply(arguments)
	}
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
		var refer = document.referrer.replace(/\//g,'%09')
		
		append += 'refer/' + refer + '/';
	}
	
	// temporary logging
	// console.log(History.getState().data);
	
	// swc iframe setup
	var iframeHeaderCell = document.getElementById('sutra');
	iframeHeaderCell.innerHTML = "";
	// var dynamicURL = dsDomain + "/servoy-webclient/ss/s/__DATASUTRA__/m/DS_router/a/" + append;
	var dynamicURL = "/servoy-webclient/ss/s/__DATASUTRA__/m/DS_router/a/" + append;
	
	var iframeHeader = document.createElement('IFRAME');
	iframeHeader.id = 'wc_application';
	iframeHeader.src = dynamicURL ;
	iframeHeader.width = '100%';
	iframeHeader.height = '100%';
	iframeHeader.scrolling = 'yes';
	iframeHeader.frameBorder = 0;
	iframeHeader.seamless = 'seamless';
	
	// iframe load
	iframeHeaderCell.appendChild(iframeHeader);	
	
};

// run router first time
setTimeout(routerIframe,0);