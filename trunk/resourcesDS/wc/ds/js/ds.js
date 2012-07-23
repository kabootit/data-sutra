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
		//called from our wrapper, redirect to top
		else if (window.parent && window.parent.window && window.parent.window.frameElement && window.parent.window.frameElement.id == 'ds_website') {
			window.top.location = 'http://demo.data-sutra.com/ds/launchingDS'
		}
	}
}