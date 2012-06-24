function preRender(description,path,delay) {
	// $('head', window.parent.document).append('<link rel="prerender" type="text/css" href="' + path + '" />');
	window.parent.routerDelay(null,description,path,250);//delay || 500);
	
}

