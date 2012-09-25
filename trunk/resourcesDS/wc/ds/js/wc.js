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
 *	This file is for functions that are used by the data sutra
 *	application platform in standalone webclient mode or when it is
 *	run in an iframe.
 */

//	Center the login form
function centerForm(formName) {
	var selector = $("#form_" + formName);

	if (selector.length) {
		selector.css({width: '50%', margin: '0px auto'});
		// console.log('CENTERED');

		//if running in wrapper
		if (window.parent.viewForm) {
			window.parent.viewForm(true);
		}
	}
	else {
		console.log('CENTER: Nothing found here: ' + formName);
	}
}

//	Update indicator to be new style (next to login button)
function loginIndicator(signup) {
	var indicator = $('#indicator');
	
	// sign up button
	if (signup) {
		var button = $('.signupDS');
		var offsetTop = 2;
		var offsetLeft = -30;
	}
	// log in button
	else {
		var button = $('.loginDS');
		var offsetTop = 2;
		var offsetLeft = -38;
	}
	
	//we have enough things loaded to actually run this method
	if (button.length && button.offset()) {
		//put indicator next to toolbar button
		indicator.offset({
				top: button.offset().top + offsetTop, 
				left: button.offset().left + offsetLeft
			})
	}
	//run this function again until enough loaded
	else {
		setTimeout(function(){
			loginIndicator(signup)
		},500)
		// console.log('LOGIN indicator waiting....');
	}
}

//	Update indicator to be new style (in the toolbar)
function mobileIndicator(delay) {
	var indicator = $('#indicator');
	var fastfind = $("#form_DATASUTRA_WEB_0F__header__fastfind");

	//we have enough things loaded to actually run this method
	if (fastfind.length && fastfind.width()) {
		//68 is position of form from right edge, 20 is width of indicator = 215
		var offset = fastfind.width() + 60 + 20 + 'px';

		console.log('SET: ' + offset);

		//in the wrong place, readjust
		if (indicator.css('margin-right') != offset) {
			//reset left fixation
			indicator.removeStyle('margin-left');
			indicator.removeStyle('left');
			//put indicator into toolbar area
			indicator.css('right','0px');
			indicator.css('margin-right',offset);
			indicator.css('margin-top','8px');
		}
	}
	//run this function again until enough loaded
	else {
		setTimeout(function(){
			mobileIndicator(delay)
		},delay || 250)
		console.log('SET waiting....');
	}
}

//  Include spinny indicator after jquery is available
(function(){
	//part 1
	setTimeout(function(){
		//load in resource
		$('head').append('<script type="text/javascript" src="/ds/js/lib/activity-indicator.js"></script>');
		
		//remove infoPanel if present
			//this throws error with servoy code...should probably seek to remove another way
		$('#infoPanel').remove()
	},1000)
	
	//part 2: set up indicator
	setTimeout(function(){
		var indicator = $('#indicator');
		indicator.html('');
		indicator.css('position','absolute');
		indicator.css('width','20px');
		indicator.css('height','20px');
		indicator.css('z-index','1000');
		indicator.activity({segments: 12, align: 'left', valign: 'top', steps: 3, width:2, space: 1, length: 3, color: '#030303', speed: 1.5});
		// indicator.activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#252525', speed: 1.5, outside:true});
		// sutraBusy is id for this indicator: $('#sutraBusy');
	},1500)
})();

//	Extend jquery to be able to remove styles (http://stackoverflow.com/questions/2465158)
(function($) {
	$.fn.removeStyle = function(style)
	{
		var search = new RegExp(style + '[^;]+;?', 'g');

		return this.each(function()
		{
			$(this).attr('style', function(i, style)
			{
				return style.replace(search, '');
			});
		});
	};
})(jQuery);

//	Extend jquery to handle cookies (https://github.com/carhartl/jquery-cookie)
(function($) {
	setTimeout(function(){
		//load in resource
		$('head').append('<script type="text/javascript" src="/ds/js/lib/jquery.cookie.js"></script>');
	},1000)
})(jQuery);

//  Pump in extra stylesheets at the end of head so that overwrite existing 
(function(){
	var delayTime = 3500
	
	setTimeout(function(){
		//our overrides for servoy stuff
		$('head').append('<link rel="stylesheet" type="text/css" href="/servoy-webclient/templates/datasutra/servoy_web_client_bottom.css" />');
		
		//custom overrides on a client by client basis
		$('head').append('<link rel="stylesheet" type="text/css" href="/ds/css/ds.custom.css" />');
	},delayTime)
})();

//	Disable backspace key unless in text or password input fields (turn off backspace to navigate browser history) (http://stackoverflow.com/questions/6309693)
(function(){
	$(document).keydown(function(e) {
		var nodeName = e.target.nodeName.toLowerCase();

		if (e.which === 8) {
			if ((nodeName === 'input' && e.target.type === 'text') ||
				nodeName === 'textarea' || 
				(nodeName === 'input' && e.target.type === 'password')) {
				// do nothing
			}
			else {
				e.preventDefault();
			}
		}
	})
})();

//	Hook servoy's indicator to the mouse location when running in Desktop moode (doesn't make sense on touch screens)
if (dsFactor() == 'Desktop') {
	//track location of mouse cursor
	setTimeout(function(){
			$('#servoy_page').click(function(e){
			var position = [0,0];
			position[0] = (e.pageX) ? e.pageX : 0;
			position[1] = (e.pageY) ? e.pageY : 0;
			Wicket.indicatorPosition = position;
		})
	},1500)
	
	function busyCursor(clickPos,turnOn) {
		var selector = $("#servoy_page");
	
		//don't run on login form, we want the cursor in a specific location
		if ($('.loginDS').length) {
			return
		}
	
		//we have a jquery selector
		if (selector.length) {
			var indicator = $('#indicator')
			//valid mouse location passed in
			if ( clickPos ) {
				indicator.css('top', clickPos[1] + 10).css('left', clickPos[0] + 10);
	
				selector.mousemove(function(event) {
					indicator.css('top', event.clientY+10).css('left', event.clientX+10);
				});
			
				//force indicator on (used for programmed busy)
				if (turnOn) {
					indicator.show();
				}
			}
			//no mouse location, remove listener
			else {
				selector.unbind('mousemove');
			
				//make sure that really turned off (sometimes gets stuck)
				indicator.hide();
			}
		}
	}

	//	Extending Wicket...object to hold original calls
	var WicketDSExtend = new Object();

	//	Extend wicket calls to hide/show indicator so that follows mouse location
	WicketDSExtend.showIncrementally = Wicket.showIncrementally;
	Wicket.showIncrementally = function() {
		//original call
		WicketDSExtend.showIncrementally.apply(this,arguments);
	
		//override
		busyCursor(Wicket.indicatorPosition);
	}
	WicketDSExtend.hideIncrementally = Wicket.hideIncrementally;
	Wicket.hideIncrementally = function() {
		//original call
		WicketDSExtend.hideIncrementally.apply(this,arguments);
	
		//override
		busyCursor();
	}
}

//	Refresh UL list
function refreshUL(source) {
	setTimeout(function(){
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.text = source;
		$("#servoy_page").append(script);
		repaintUL();
	},250)
}

//	Dim out 1st space on first load
function dimSpace(id) {
	setTimeout(function(){
		var selector = $('#'+id);
	
		if (selector.length) {
			selector.css({
				'cursor': 'default',
				'filter': 'alpha(opacity=50)',
				'-moz-opacity': '.50',
				'opacity': '.50'
			});
		}
	},250);
}

//	Resize screen after login form
function resetBeanSizes(source) {
	setTimeout(function(){
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.text = source;
		$("#servoy_page").append(script);
		resetBeans();
	},500)
}

//	Re-fire toolbar navigator on first show so that elements are sized appropriately
function recordNavigatorFirstShow(source) {
	setTimeout(function(){
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.text = source;
		$("#servoy_page").append(script);
		recNavFirstShow();
	},500)
}

//	Fill placeholder text for one element
function setPlaceHolderText(elem,text) {
	var selector = $("#" + elem);
	
	//we have a jquery selector
	if (elem && selector.length) {
		selector.attr('placeholder', text || '');
	}
}

//	Fill placeholder texts on a form after optional delay
function setPlaceHolders(elements,texts,delay) {
	// elements = elements ? JSON.parse(elements) : new Array();
	// texts = texts ? JSON.parse(texts) : new Array();
	
	if (!elements instanceof Array) {
		elements = new Array()
	}
	if (!texts instanceof Array) {
		texts = new Array()
	}
	
	setTimeout(function(){
		for (var i = 0; i < elements.length; i++) {
			setPlaceHolderText(elements[i],texts[i]);
		}
	},delay || 0)
}

//	Callback to setup navigation
function navigateConfig(source) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.text = source;
	$("#servoy_page").append(script);
	
	//method is called navigate()
}

//	Sniff browser used and disallow login from 'bad' browsers
function browserCheck() {
	return $.browser.webkit
}

//	Form factor used
function dsFactor() {
	if (window.parent.dsFactor) {
		return window.parent.dsFactor();
	}
}