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

//DS namespace
if (typeof(DS) == "undefined") {
	DS = new Object()
}
	

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
function mobileIndicator() {
	var indicator = $('#indicator');
	indicator.html('<div id="HUDcenter1"><div id="HUDcenter2"><div id="HUDalpha"><h3>Loading...</h3></div></div></div>');
	indicator.removeStyle('width');
	indicator.removeStyle('height');
	indicator.removeStyle('top');
	indicator.removeStyle('left');
	$('#HUDalpha').activity({ valign: 'top', steps: 3, segments: 12, width: 5.5, space: 5, length: 12,color: '#F2F2F2', speed: 0.75});
	$('#indicator .sutraBusy').css('margin-top','5px');
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
		indicator.activity({segments: 12, align: 'left', valign: 'top', steps: 3, width:2, space: 1, length: 3, color: '#666666', speed: 1.5});
		// indicator.activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#252525', speed: 1.5, outside:true});
		// sutraBusy is class for this indicator: $('#indicator .sutraBusy');
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

//	Extend jquery to listen to resize on elements (https://github.com/cowboy/jquery-resize)
(function($) {
	setTimeout(function(){
		//load in resource
		$('head').append('<script type="text/javascript" src="/ds/js/lib/jquery.ba-resize.min.js"></script>');
		
		//load in resource
		$('head').append('<script type="text/javascript" src="/ds/js/lib/jquery.ba-throttle-debounce.min.js"></script>');
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
		
		//8 is backspace, but allow meta-shift-backspace to dump cache when developing in chrome
		if (e.which === 8 && !e.metaKey && !e.shiftKey) {
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

//	Allow for disabling of selection
(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css({
						'user-select': 'none',
						'-moz-user-select': 'none',
						'-khtml-user-select': 'none',
						'-o-user-select': 'none',
						'-webkit-user-select': 'none'
					})
                 .on('selectstart', false);
    };
})(jQuery);

//	Hook servoy's indicator to the mouse location when running in Desktop moode (doesn't make sense on touch screens)
if (dsFactor() == 'Desktop') {
	//track location of mouse cursor
		//MEMO: used for indicator, but also for right-click in table views
	setTimeout(function(){
		function trackMouse(e) {
			var position = [0,0];
			position[0] = (e.pageX) ? e.pageX : 0;
			position[1] = (e.pageY) ? e.pageY : 0;
			
			Wicket.indicatorPosition = position;
		}
		
		$('#servoy_page').on('click contextmenu',trackMouse);
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
				function trackMouse(event,position) {
					var maxWidth = $(document).width() - 36;
					var maxHeight = $(document).height() - 36;
					
					if (event && !position) {
						position = [event.clientX,event.clientY];
					}
					
					position[0] = (position[0] <= maxWidth) ? position[0] : maxWidth;
					position[1] = (position[1] <= maxHeight) ? position[1] : maxHeight;
					
					indicator.css('top', position[1]+10).css('left', position[0]+10);
				}
				
				trackMouse(null,clickPos);
	
				selector.mousemove(trackMouse);
			
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
	return $.browser.webkit; // || $.browser.mozilla
}

//	Form factor used
function dsFactor() {
	if (window.parent != window && window.parent.dsFactor) {
		var myReturn = window.parent.dsFactor();
	}
	
	if (myReturn == 'iPad') {
		setTimeout(mobileIndicator,1500);
	}
	
	return myReturn
}

//	Turn off indicator for selected iframe
function indicatorOff() {
	setTimeout(function(){
		var selector = $("#HUDcenter1");
		
		//we have a jquery selector
		if (selector.length) {
			console.log('FiD indicator hidden');
			$("#HUDcenter1").hide();
		}
		else {
			console.log('FiD indicator not hidden');
		}
	},1500);
}

//	Adjust position of FormDialogs
function formDialogMove(formName, x, y) {
	var selector = $('#form_' + formName)
	
	//traverse up the tree two divs
	if (selector.length) {
		selector = selector.parent()
		
		if (selector.length) {
			selector = selector.parent()
			
			if (selector.length) {
				var offset = selector.offset()
				selector.offset({top: offset.top + y, left: offset.left + x})
			}
		}
	}
}

//	Event to toggle class based on element
function toggleClass(id, className, forceOn) {
	var selector = $('#' + id);

	//valid selector
	if (selector.length) {
		//check for existence of class and toggle
		if (forceOn || !selector.is('.' + className)) {
			selector.addClass(className);
		}
		//remove class
		else {
			selector.removeClass(className);
		}
	}
}

//	Inject iOS scrollbars
(function(){
	setTimeout(function(){
		$('head').append("<script src='/ds/js/lib/ftscroller.js'></script>");
	},1000)
	
	//"override" functions
	if (typeof(DS.Servoy) == "undefined") {
		DS.Servoy = new Object();
	}
	if (typeof(DS.Servoy.TableView) == "undefined") {
		DS.Servoy.TableView = new Object();
	}
	
	//this is for Servoy 6.1.3
	DS.Servoy.TableView.needToUpdateRowsBuffer = function(rowContainerBodyId,formName) {
		if (Servoy.TableView.isAppendingRows || (!Servoy.TableView.hasTopBuffer[rowContainerBodyId] && !Servoy.TableView.hasBottomBuffer[rowContainerBodyId])) {
			return 0;
		}
		var scrollTop = DS.scroller[formName].scrollTop
		var scrollDiff = scrollTop - Servoy.TableView.currentScrollTop[rowContainerBodyId];
		if (scrollDiff == 0 || (Servoy.TableView.keepLoadedRows && (scrollDiff < 0))) return 0;
		Servoy.TableView.currentScrollTop[rowContainerBodyId] = scrollTop;
		var rowContainerBodyEl = document.getElementById(rowContainerBodyId);
		var clientHeight = rowContainerBodyEl.clientHeight;
		var scrollHeight = DS.scroller[formName].scrollHeight;
		var bufferedRows = scrollHeight - scrollTop - clientHeight;
		if (scrollDiff > 0) {
			Servoy.TableView.isAppendingRows = Servoy.TableView.hasBottomBuffer[rowContainerBodyId] && (bufferedRows < clientHeight);
		} else {
			var row = $('#' + rowContainerBodyId).children('tr:first');
			var topPhHeight = 0;
			if (row.attr('id') == 'topPh') {
				topPhHeight = row.height();
			}
			Servoy.TableView.isAppendingRows = Servoy.TableView.hasTopBuffer[rowContainerBodyId] && (scrollTop - topPhHeight < clientHeight);
		}
		var secondRow = $('#' + rowContainerBodyId).children('tr').eq(1);
		var rowHeight = secondRow.height();
		var nrRows = scrollDiff / rowHeight;
		var nrRowAbs = Math.ceil(Math.abs(nrRows));
		nrRows = nrRows < 0 ? -nrRowAbs : nrRowAbs;
		return Servoy.TableView.isAppendingRows ? nrRows : 0;
	}
	
})();
function scrollbarSmall(formName,runIt) {
	//no custom scrollbar
	return;
	
	//wait until both scroller library (1st time only) and UL have been loaded; respawn every tenth of a second
	if (typeof(FTScroller) == 'undefined' || !($ && $('#form_' + formName + ' table tbody'))) {
		setTimeout(function(){scrollbarSmall(formName)},500);
		return;
	}
	//things are available now, hold off another second
	else if (!runIt) {
		//hide scrollbar from the get-go
		var selector = $('#form_' + formName + ' table tbody');
		
		if (selector.length) {
			//records
			var list = selector[selector.length - 1];
			$('#' + list.id).css('overflow-y','hidden');
		}
		
		//TODO: check to make sure that rows are actually availalble
		setTimeout(function(){scrollbarSmall(formName,true)},500);
		return;
	}
	
	//when no formName specified, try to use from previous UL
	if (!formName) {
		formName = (DS.scroller && DS.scroller._lastForm) ? DS.scroller._lastForm : 'UL__set55_item1356_CRM_0F_example';
	}
	var selector = $('#form_' + formName + ' table tbody');

	//selector now holds the column headers and the UL records
	// selector[0] selector[1] selector[n] == 1st, 2nd, nth column header

	if (selector.length) {
		//place to keep tabs on scrollers for future modification
		if (typeof(DS.scroller) == "undefined") {
			DS.scroller = new Object();
		}
		
		//track the last form run on
		DS.scroller._lastForm = formName
		
		//records
		var list = selector[selector.length - 1];
		var oldScroll = list.scrollTop;
	
		//load up scroller here
		var scroller = 
		DS.scroller[formName] = 
			new FTScroller(list, {
				//don't bounce on desktop
				// bouncing: false,
				// contentHeight: 123,
				// maxFlingDuration: 0,
				scrollingX: false
				// snapping: true,
				// snapSizeY: 20,
				// updateOnWindowResize: true
			});
		scroller.scrollTop = oldScroll;
		
		//remove right-specific padding for normal scrollbar
		$('#' + list.id).removeStyle('padding-right');
		
		//let row highlight span entire row (by expanding final 'hidden' element) run once; for all future clicks
		$('#form_' + formName + ' table tbody .ftscroller_container td[style*="display: none;"]').css({display: 'block', width: '17px'});
		//TODO: this is firing too often but doesn't matter because selector doesn't return anything
		$('#form_' + formName + ' table tbody .ftscroller_container').on('click','td',function(e) {$('#form_' + formName + ' table tbody .ftscroller_container td[style*="display: none;"]').css({display: 'block', width: '17px'})});
		
		//reattach servoy stuff
		var scrollEvent = list.onscroll.toString().split("'");
		
		//this is for Servoy 6.1.3
		function onScrollEnd() {
			var tHead = scrollEvent[1]
			var tBody = scrollEvent[3]
			var tForm = formName
			var wicketCall = scrollEvent[13]
			
			var currentScrollTop = DS.scroller[tForm].scrollTop;
			var scrollDiff = DS.Servoy.TableView.needToUpdateRowsBuffer(tBody,tForm);
			
			//destroy custom scrollbar and put contents back where servoy can find them
			if (Servoy.TableView.isAppendingRows) {
				setTimeout(function() {
					//put contents of small scrollbar div back into parent container and update scroll position so it looks the same
					var contents = DS.scroller[tForm].contentContainerNode.innerHTML;
					DS.scroller[tForm].destroy();
					$('#' + tBody + ' .ftscroller_container').remove();
					$('#' + tBody).html(contents);
					$('#' + tBody).scrollTop(currentScrollTop);
					
					//remove scrollbar while we wait for tiny scrollbars to be added
					$('#' + list.id).css('overflow-y','hidden');
					
					//recreate scrollbar and set scroll position
					setTimeout(function(){
						scrollbarSmall(formName); 
						DS.scroller[tForm].scrollTop = currentScrollTop;
					},1000);
					
					if (function() {
						onABC();
						return Wicket.$('tBody') != null;
					}.bind(this)()) {
						Wicket.showIncrementally('indicator');
					}
					var wcall = wicketAjaxGet(wicketCall + '&scrollDiff=' + scrollDiff + '&currentScrollTop=' + currentScrollTop, function() {
						hideBlocker();;
						Wicket.hideIncrementally('indicator');
					}.bind(this), function() {
						onAjaxError();;
						Wicket.hideIncrementally('indicator');
					}.bind(this), function() {
						if (!
						function() {
							onABC();
							return Wicket.$(tBody) != null;
						}.bind(this)()) {
							//maybe put recreate mini in here...

							Wicket.hideIncrementally('indicator');
						}
						onABC();
						return Wicket.$(tBody) != null;
					});
				},0)
			}
		}
		
		scroller.addEventListener('scrollend',onScrollEnd)
	}
}

//pretty up the ul
function prettifyUL(maxTimeOut,fsSize,noShow) {
	//check if successfully run or not; respawn
	var timeOut = 1
	if (!maxTimeOut) {
		maxTimeOut = 100
	}
	
	function iFeelPretty() {
		timeOut++;
		console.log('PRETTY UL: ' + timeOut);
		
		// the UL table header has loaded, the rest should be ready as well
		if ($ && $("#form_NAV_T_universal_list__WEB__list table tbody td th table").length) {
			function iAmPretty() {
				//reference colors
				var unselectRGB = ' rgb(48, 48, 48)';
				var unselectHEX = '#303030';
				var selectRGB = ' rgb(38, 38, 38)';
				var selectHEX = '#262626';
			
				//header
				$("#form_NAV_T_universal_list__WEB__list table tbody td th table").css("background-color","transparent");

				//selected row
				$('#form_NAV_T_universal_list__WEB__list td[style*="background-color:' + selectRGB + ';"] div[name*=sutra_favorite_badge], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + selectRGB + ';"], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + selectRGB + ';"] input'
				).css('background-color','transparent').addClass('gfxLeftHilite');
				$('#form_NAV_T_universal_list__WEB__list td[style*="background-color:' + selectHEX + ';"] div[name*=sutra_favorite_badge], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + selectHEX + ';"], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + selectHEX + ';"] input'
				).css('background-color','transparent').addClass('gfxLeftHilite');

				//non-selected rows
				$('#form_NAV_T_universal_list__WEB__list td[style*="background-color:' + unselectRGB + ';"] div[name*=sutra_favorite_badge], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + unselectRGB + ';"], 			#form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + unselectRGB + ';"] input'
				).css('background-color','transparent').removeClass('gfxLeftHilite');
				$('#form_NAV_T_universal_list__WEB__list td[style*="background-color:' + unselectHEX + ';"] div[name*=sutra_favorite_badge], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + unselectHEX + ';"], 			#form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + unselectHEX + ';"] input'
				).css('background-color','transparent').removeClass('gfxLeftHilite');
				
				
				//make sure UL is showing
				if (!noShow) {
					setTimeout(showUL,(fsSize - 1)*750);
				}
			}
			
			//wait ~1sec per 50 rows
			setTimeout(iAmPretty,0);
			// setTimeout(iAmPretty,(fsSize - 1)*750);
		}
		// keep running until table loaded; will timeout after 10 seconds
		else if (timeOut < maxTimeOut) {
			setTimeout(iFeelPretty,100);
		}
	}
	
	// start first time
	setTimeout(iFeelPretty,50);
}

//listen for changes in size to UL area
function lefthandListen() {
	function attache(event) {
		console.log("resized");
		hideUL();
		setTimeout(scrollbarSmall,750);
		showUL();
	}
	
	if ($.debounce && $('#form_DATASUTRA_WEB_0F__list').length && $._data($('#form_DATASUTRA_WEB_0F__list')[0],'events') && !$._data($('#form_DATASUTRA_WEB_0F__list')[0],'events').resize) {
		//make sure that event not currently bound
		$('#form_DATASUTRA_WEB_0F__list').off('resize');
	
		//(re-)attach
		console.log("listener attached");
		$('#form_DATASUTRA_WEB_0F__list').on('resize', null, $.debounce(300,attache));
	}
}

//UL hide
function hideUL() {
	var selector = $('#form_NAV_T_universal_list__WEB');
	if (selector.length) {
		selector.css('z-index', '-10');
	}
	
	//add in the spinner for the UL area
	var spinner = $('#form_DATASUTRA_WEB_0F__workflow .sutraBusy')
	if (!spinner.length) {
		var indicator = $('#form_DATASUTRA_WEB_0F__workflow');
		indicator.activity({ valign: 'top', steps: 3, segments: 12, width: 3.5, space: 4, length: 8,color: '#AAA', speed: 0.75});
		
		$('#form_DATASUTRA_WEB_0F__workflow .sutraBusy').css('margin-top',Math.floor($('#form_DATASUTRA_WEB_0F__workflow').height()/2) - 10 + 'px').css('z-index',1);
	}
	else {
		//show spinny
		$('#form_DATASUTRA_WEB_0F__workflow .sutraBusy').toggle(true);
	}
}

//UL show
function showUL() {
	//rehook up correct styling to this part of the UL, but don't call showUL again
	setTimeout(function(){
		prettifyUL(null,null,true)
		
		var selector = $('#form_NAV_T_universal_list__WEB');
		if (selector.length) {
			selector.css('z-index', 'auto');
			
			//hide spinny
			$('#form_DATASUTRA_WEB_0F__workflow .sutraBusy').toggle(false);
		}
		
		//attach listener
		lefthandListen();
	},1000);
}
