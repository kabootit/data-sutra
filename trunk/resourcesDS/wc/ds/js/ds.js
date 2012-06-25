function preRender(description,path,delay) {
	//if running in chrome, try to prerender page and then navigate there
	if (false) {
		$('head', window.parent.document).append('<link rel="prerender" type="text/css" href="' + path + '" />');
		window.parent.routerDelay(null,description,path,delay || 500);
	}
	//not chrome, just go there
	else {
		window.parent.routerDelay(null,description,path,250);
	}
}