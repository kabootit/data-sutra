// the domain that webclient is accessible on
var sutraWC = '';	//'http://servlets:8081';

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
		// login box on web site
		if (window && window.frameElement && window.frameElement.id == 'ds_website') {
			append = 'DSLoginSmall/';
			// append += 'refer' + window.parent.location.pathname
		}
		// normal login
		else {
			append = 'DSLogin/';
		}
	}
	// login inline url requested
	else if (append == 'loginInline/') {
		append = 'DSLoginSmall/';
	}
 	// login url requested, specify what to do
	else if (append == 'logout/') {
		append = 'DSLogout/';
	}
	// redirect to pop out of inline form
	else if (append == 'launchingDS/') {
		append = 'DSHomeCall/';
	}
	// check that append has a value, otherwise show error page
	else if (!append) {
		append = 'DSError_NoURL/';
	}
	
	//tack on referrer
	if (window.parent.location) {
		// append += 'refer?' + window.parent.location.pathname.substr(1)
		// encodeURIComponent(document.referrer) + '/'
	}
	
	// temporary logging
	// console.log(History.getState().data);
	
	// swc iframe setup
	var iframeHeaderCell = document.getElementById('sutra');
	iframeHeaderCell.innerHTML = "";
	var dynamicURL = sutraWC + "/servoy-webclient/ss/s/__DATASUTRA__/m/DS_router/a/" + append;
	
	var iframeHeader = document.createElement('IFRAME');
	iframeHeader.id = 'wc';
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