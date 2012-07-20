//	Update indicator to be new style (next to login button)
function loginIndicator(delay) {
	var indicator = $('.indicator');
	var loginButton = $('.loginDS');
	
	//we have enough things loaded to actually run this method
	if (loginButton.length && loginButton.offset()) {
		//put indicator next to toolbar button
		indicator.offset({
				top: loginButton.offset().top, 
				left: loginButton.offset().left - 30
			})
	}
	//run this function again until enough loaded
	else {
		setTimeout(function(){
			loginIndicator(delay)
		},delay || 250)
		console.log('LOGIN waiting....');
	}
}

//	Center the login form
function centerForm(formName) {
	var selector = $("#form_" + formName);
	
	if (selector.length) {
		selector.css({width: '50%', margin: '0px auto'});
		console.log('CENTERED');
		
		//if running in wrapper
		if (window.parent.viewForm) {
			window.parent.viewForm(true);
		}
	}
	else {
		console.log('CENTER: Nothing found here: ' + formName);
	}
}

//  Include spinny indicator after jquery is available
(function(){
	//part 1
	setTimeout(function(){
		//load in resource
		$('head').append('<script type="text/javascript" src="/ds/js/activity-indicator.js"></script>');
		
		//remove infoPanel if present
		$('#infoPanel').remove()
	},1000)
	
	//part 2: set up indicator
	setTimeout(function(){
		$('#indicator').html('');
		$('#indicator').css('position','absolute');
		$('#indicator').css('width','20px');
		$('#indicator').css('height','20px');
		$('#indicator').css('z-index','1000');
		$('#indicator').activity({segments: 12, align: 'left', valign: 'top', steps: 3, width:2, space: 1, length: 3, color: '#030303', speed: 1.5});
		// $('#indicator').activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#252525', speed: 1.5, outside:true});
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

//  Pump in extra stylesheets at the end of head so that overwrite existing 
(function(){
	var delayTime = 3500
	
	// setTimeout(function(){
	// 	app.addPrefetchTags();
	// },delayTime)
	
	setTimeout(function(){
		$('head').append('<link rel="stylesheet" type="text/css" href="/servoy-webclient/templates/datasutra/servoy_web_client_bottom.css" />');
	},delayTime)
})();

//	Disable backspace key unless in input field (turn off backspace to navigate browser history) (http://stackoverflow.com/questions/6309693)
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

//	Hook servoy's indicator to the mouse location
(function(){
	setTimeout(function(){
			$('#servoy_page').click(function(e){
			var position = [0,0];
			position[0] = (e.pageX) ? e.pageX : 0;
			position[1] = (e.pageY) ? e.pageY : 0;
			Wicket.indicatorPosition = position;
		})
	},1500)	
})()
function busyCursor(clickPos,turnOn) {
	var selector = $("#servoy_page");
	
	//don't run on login form, we want the cursor in a specific location
	if ($('.loginDS').length) {
		return
	}
	
	//we have a jquery selector
	if (selector.length) {
		//valid mouse location passed in
		if ( clickPos ) {
			$('#indicator').css('top', clickPos[1] + 10).css('left', clickPos[0] + 10);
	
			selector.mousemove(function(event) {
				$('#indicator').css('top', event.clientY+10).css('left', event.clientX+10);
			});
			
			//force indicator on (used for programmed busy)
			if (turnOn) {
				$('#indicator').show();
			}
		}
		//no mouse location, remove listener
		else {
			selector.unbind('mousemove');
			
			//make sure that really turned off (sometimes gets stuck)
			$('#indicator').hide();
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