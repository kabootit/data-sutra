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
 *	This file is for functions that are used by the data sutra
 *	application platform in standalone webclient mode or when it is
 *	run in an iframe.
 */

//DS namespace
if (typeof(DS) == "undefined") {
	DS = new Object();
	DS.timer = new Object();
	DS.version = 6.1
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
		// console.log('CENTER: Nothing found here: ' + formName);
	}
}

//  Include spinny indicator after jquery is available
(function(){
	//part 1
	setTimeout(function(){
		//load in resource
		$('head').append('<script type="text/javascript" src="/ds/js/lib/activity-indicator.js"></script>');
		
		//	Extend jQuery style handling -- happens earlier than most extensions
		$('head').append('<script type="text/javascript" src="/ds/js/lib/jquery.style.js"></script>');
		
		//remove infoPanel if present
		$('#infoPanel').style('display','none','important')
	},1000)
	
	//part 2: set up indicator
	setTimeout(function(){
		//running  on ipad, large centered spinny blocker
		if (dsFactor() == 'iPad') {
			var indicator = $('#indicator');
			indicator.css({
					'position':'absolute',
					'left':'0px',
					'right':'0px',
					'z-index':1000
				});
			indicator.html('<div class="HUDcenter1"><div class="HUDcenter2"><div class="HUDalpha"><h3>Loading...</h3></div></div></div>');
			// indicator.removeStyle('top');
			// indicator.removeStyle('left');
			$('#indicator .HUDalpha').activity({ valign: 'top', steps: 3, segments: 12, width: 5.5, space: 5, length: 12,color: '#F2F2F2', speed: 0.75});
			$('#indicator .sutraBusy').css({'margin-top':'5px','margin-left':'16px'});
		}
		//small spinny blocker
		else {
			var indicator = $('#indicator');
			indicator.html('');
			indicator.css({
					'position':'absolute',
					'width':'20px',
					'height':'20px',
					'z-index':1000
				});
			indicator.activity({segments: 12, align: 'left', valign: 'top', steps: 3, width:2, space: 1, length: 3, color: '#777777', speed: 1.5});
			
			//listen for error calling server text and blow spinny cursor back in
			$("#servoy_page").on('mousemove',null,function() {
				if ($("#indicator").text() == 'Error calling server') {
					$("#indicator").html('');
					$("#indicator").activity({segments: 12, align: 'left', valign: 'top', steps: 3, width:2, space: 1, length: 3, color: '#777777', speed: 1.5});
				}
			})
		}
		
		//MEMO: sutraBusy is class for this indicator: $('#indicator .sutraBusy');
	},1500)
})();

//	Update indicator to be new style (next to login button)
function loginIndicator(signup) {
	//non-tablet only
	if (dsFactor() != 'iPad') {
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
}

//	Large centered "Loading..." indicator
function bigIndicator(toggle,delay,text) {
	// var indicator = $('#form_DATASUTRA_WEB_0F');
	var elem = '#servoy_dataform .webform:first';
	var indicator = $(elem);
	
	//default text when nothing specified
	if (!text) {
		text = 'Loading...'
	}
		
	//not enough loaded in yet, try to load up again in half a second
	if (!indicator.length || delay) {
		setTimeout(function(){bigIndicator(toggle);},delay || 500,text);
		return
	}
		
	//add in the spinner for the UL area
	var spinner = $(elem + ' .sutraBusy');
	if (!spinner.length) {
		//activity available, add spinner
		if (typeof $.fn.activity == 'function') {
			//tablet indicator
			indicator.append('<div class="HUDcenter1"><div class="HUDcenter2"><div class="HUDalpha"><h3>Loading...</h3></div></div></div>');
			$(elem + ' .HUDalpha').activity({ valign: 'top', steps: 3, segments: 12, width: 5.5, space: 5, length: 12,color: '#F2F2F2', speed: 0.75});
			$(elem + ' .sutraBusy').css('margin-top','5px').css('z-index',1);
			$(elem + ' .HUDcenter1').toggle(false);
		}
		//run whole thing again
		else {
			setTimeout(bigIndicator,25);
			return
		}
	}
			
	//toggle state not specified, toggle
	if (typeof toggle != 'boolean') {
		// toggle = !$(elem + ' .HUDcenter1').is(":visible");
		toggle = true;
	}
			
	//show
	if (toggle) {
		//list isn't currently showing, don't need to hide/show
			//MEMO: this should be called from within lefthandListen.attache, but really only concerned about spinner showing
		var selector = $('#form_NAV_T_universal_list__WEB__list');
		if (selector.length) {
			if (selector.height() == 0 || selector.width() == 0) {
				var skipMe = true
			}
		}
				
		if (!skipMe) {
			//set text
			$(elem + ' .HUDcenter1 h3').text(text);
			
			// console.log("centered: ON");
			$(elem + ' .HUDcenter1').fadeIn();
		}
	}
	//hide
	else {
		// console.log("centered: OFF");
		$(elem + ' .HUDcenter1').fadeOut();
	}
}

//	Custom stuff depending on platform
switch (dsFactor()) {
	// Hook servoy's indicator to the mouse location when running in Desktop moode
	case 'Desktop':
		//adjust report preview window to fill available screen real estate
		setTimeout(function(){
			function resizeReport() {
				//150px box-shadow, 100px space away from the edge
				var width = $(window).width() - 200;
				var height = $(window).height() - 100;
				
				var report = $('#report', window.parent.document)
				
				report.width(width)
				report.css('margin-left','-' + width / 2 + 'px')
				report.height(height)
				
				// console.log("report size: " + width + 'x' + height);
			}
			$('body').on('resize', null, $.debounce(300,resizeReport));
			resizeReport()
		},1500)
		
		//track location of mouse cursor
			//MEMO: used for indicator, but also for right-click in table views
		setTimeout(function(){
			function trackMouse(e) {
				var position = [0,0];
				position[0] = (e.pageX) ? e.pageX : 0;
				position[1] = (e.pageY) ? e.pageY : 0;
			
				Wicket[e.data.slot] = position;
			}
		
			$('#servoy_dataform').on('click contextmenu',{slot: 'clickPosition'},trackMouse);
			$('#servoy_dataform').on('mousemove',{slot: 'indicatorPosition'},trackMouse);
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
						var maxWidth = $(document).width() - 45;
						var maxHeight = $(document).height() - 45;
					
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
		break
		
	// Only show indicator when custom center blocker not showing; orientation change
	case 'iPad':
		//	Extending Wicket...object to hold original calls
		var WicketDSExtend = new Object();

		//	Extend wicket calls to hide/show indicator
		WicketDSExtend.showIncrementally = Wicket.showIncrementally;
		Wicket.showIncrementally = function() {
			//only show indicator when center blocker not already showing
			if (!$('#servoy_dataform .webform:first .HUDcenter1').is(':visible')) {
				//original call
				WicketDSExtend.showIncrementally.apply(this,arguments);
			}
		}
		
		$(window).bind('orientationchange resize', function(event) {
			if (event.orientation) {
				if (event.orientation == 'portrait') {
					orientPortrait();
				} 
				else if (event.orientation == 'landscape') {
					//small delay for resize javascript to catch up
					setTimeout(orientLandscape,250);
				}
			}
			else {
				if (window.innerHeight > window.innerWidth) {
					orientPortrait();
				} 
				else {
					//small delay for resize javascript to catch up
					setTimeout(orientLandscape,250);
				}
			}
		});
		
		break
}

//	Extensions to jQuery
(function($) {
	setTimeout(function(){
		//	SlickGrid stuff
		$('head').append('<link rel="stylesheet" type="text/css" href="/ds/js/lib/slickgrid/slick.grid.css" />');
		$('head').append('<link rel="stylesheet" type="text/css" href="/ds/js/lib/slickgrid/css/smoothness/jquery-ui-1.10.3.custom.css" />');
		$('head').append('<link rel="stylesheet" type="text/css" href="/ds/js/lib/slickgrid/controls/slick.columnpicker.css" />');
		
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/lib/jquery.event.drag-2.2.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/lib/jquery-ui-1.10.3.custom.min.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/slick.core.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/plugins/slick.autotooltips.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/plugins/slick.cellrangedecorator.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/plugins/slick.cellrangeselector.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/plugins/slick.cellselectionmodel.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/plugins/slick.checkboxselectcolumn.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/plugins/slick.rowselectionmodel.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/controls/slick.columnpicker.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/slick.formatters.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/slick.editors.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/slick.remotemodel.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/slick.grid.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/slickgrid/slick.dataview.js"></script>');
		
		//	Extend jquery to handle cookies (https://github.com/carhartl/jquery-cookie)
		$('head').append('<script type="text/javascript" src="/ds/js/lib/jquery.cookie.js"></script>');
		
		//	Extend jquery to listen to resize on elements (https://github.com/cowboy/jquery-resize)
		$('head').append('<script type="text/javascript" src="/ds/js/lib/jquery.ba-resize.min.js"></script>');
		$('head').append('<script type="text/javascript" src="/ds/js/lib/jquery.ba-throttle-debounce.min.js"></script>');
		
		//	Extend jQuery to give us scrollstart / scrollstop events (https://github.com/ssorallen/jquery-scrollstop)
		$('head').append('<script type="text/javascript" src="/ds/js/lib/jquery.scrollstop.js"></script>');
		
		//	Extend jQuery style handling -- happens earlier after first delay
		
		//	Extend jQuery to give us css4 parent selectors (https://github.com/Idered/cssParentSelector)
		$('head').append('<script type="text/javascript" src="/ds/js/lib/jQuery.cssParentSelector.min.js"></script>');
		
		//	Moment.js (http://momentjs.com/)
		$('head').append('<script type="text/javascript" src="/ds/js/lib/moment.min.js"></script>');
		
	},1250)
})(jQuery);

//  Add extra class to html tag when this is ie	
(function(){
	//should be var isIE = /*@cc_on!@*/false, but may get removed during minification
	var isIE = eval("/*@cc_on!@*/!1");
	
	if (isIE) {
		setTimeout(function(){
			$('html').addClass('ie');
		},1500)
	}
})();

//  Lazy load pdf.js library
(function(){
	setTimeout(function(){
		if (window.parent.printInit != undefined) {
			window.parent.printInit();
		}
	},90000)
})();

//  Pump in client custom css and js
(function(){
	var delayTime = 3500
	
	setTimeout(function(){
		//custom overrides on a client by client basis
		$('head').append('<link rel="stylesheet" type="text/css" href="/ds/css/ds.custom.css" />');
		
		//custom overrides on a client by client basis
		$('head').append('<script type="text/javascript" src="/ds/js/ds.custom.js"></script>');
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

//	Refresh UL list
function refreshUL(source) {
	setTimeout(function(){
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.text = source;
		$("#servoy_page").append(script);
		hideUL();
		repaintUL();
		setTimeout(showUL,0);
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
		setTimeout(resetBeans,750);
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

//	Callback to setup callback method
function callbackConfig(source,version) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.text = source;
	$("#servoy_page").append(script);
	
	if (version) {
		DS.version = Number(version);
	}
}

//	Sniff browser used and disallow login from 'bad' browsers
function browserCheck() {
	return $.browser.webkit || $.browser.mozilla || ($.browser.msie && parseInt($.browser.version, 10) >= 10); // || $.browser.opera;
}

//	Form factor used
function dsFactor() {
	if (window.parent != window && window.parent.dsFactor) {
		var myReturn = window.parent.dsFactor();
	}
	
	return myReturn
}

//	Turn off indicator for selected iframe
function indicatorOff() {
	setTimeout(function(){
		var selector = $("#indicator .HUDcenter1");
		
		//we have a jquery selector
		if (selector.length) {
			console.log('FiD indicator hidden');
			selector.fadeOut();
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

//	Run custom code whenever new records loaded in
(function() {
	//	Extending Wicket...object to hold original calls
	var ServoyDSExtend = new Object();

	//	Extend wicket calls to prettify UL
	ServoyDSExtend.needToUpdateRowsBuffer = Servoy.TableView.needToUpdateRowsBuffer;
	Servoy.TableView.needToUpdateRowsBuffer = function() {
		//override
		setTimeout(prettifyUL,500);//(null,null,true);
		
		//original call
		return ServoyDSExtend.needToUpdateRowsBuffer.apply(this,arguments);
	}
	
	//	Extend wicket calls to redo combobox styling in table views
	ServoyDSExtend.setRowStyle = Servoy.TableView.setRowStyle;
	Servoy.TableView.setRowStyle = function() {
		//override
		setTimeout(styleCSS4Parent,500);
		
		//original call
		return ServoyDSExtend.setRowStyle.apply(this,arguments);
	}
})();


//	Inject iOS scrollbars
// (function(){
// 	setTimeout(function(){
// 		$('head').append("<script src='/ds/js/lib/ftscroller.js'></script>");
// 	},1000)
// 	
// 	//"override" functions
// 	if (typeof(DS.Servoy) == "undefined") {
// 		DS.Servoy = new Object();
// 	}
// 	if (typeof(DS.Servoy.TableView) == "undefined") {
// 		DS.Servoy.TableView = new Object();
// 	}
// 	
// 	//this is for Servoy 6.1.3
// 	DS.Servoy.TableView.needToUpdateRowsBuffer = function(rowContainerBodyId,formName) {
// 		if (Servoy.TableView.isAppendingRows || (!Servoy.TableView.hasTopBuffer[rowContainerBodyId] && !Servoy.TableView.hasBottomBuffer[rowContainerBodyId])) {
// 			return 0;
// 		}
// 		var scrollTop = DS.scroller[formName].scrollTop
// 		var scrollDiff = scrollTop - Servoy.TableView.currentScrollTop[rowContainerBodyId];
// 		if (scrollDiff == 0 || (Servoy.TableView.keepLoadedRows && (scrollDiff < 0))) return 0;
// 		Servoy.TableView.currentScrollTop[rowContainerBodyId] = scrollTop;
// 		var rowContainerBodyEl = document.getElementById(rowContainerBodyId);
// 		var clientHeight = rowContainerBodyEl.clientHeight;
// 		var scrollHeight = DS.scroller[formName].scrollHeight;
// 		var bufferedRows = scrollHeight - scrollTop - clientHeight;
// 		if (scrollDiff > 0) {
// 			Servoy.TableView.isAppendingRows = Servoy.TableView.hasBottomBuffer[rowContainerBodyId] && (bufferedRows < clientHeight);
// 		} else {
// 			var row = $('#' + rowContainerBodyId).children('tr:first');
// 			var topPhHeight = 0;
// 			if (row.attr('id') == 'topPh') {
// 				topPhHeight = row.height();
// 			}
// 			Servoy.TableView.isAppendingRows = Servoy.TableView.hasTopBuffer[rowContainerBodyId] && (scrollTop - topPhHeight < clientHeight);
// 		}
// 		var secondRow = $('#' + rowContainerBodyId).children('tr').eq(1);
// 		var rowHeight = secondRow.height();
// 		var nrRows = scrollDiff / rowHeight;
// 		var nrRowAbs = Math.ceil(Math.abs(nrRows));
// 		nrRows = nrRows < 0 ? -nrRowAbs : nrRowAbs;
// 		return Servoy.TableView.isAppendingRows ? nrRows : 0;
// 	}
// 	
// })();
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
		// console.log('PRETTY UL: ' + timeOut);
		
		// the UL table header has loaded, the rest should be ready as well
		if ($ && $("#form_NAV_T_universal_list__WEB__list table tbody td th table").length) {
			function iAmPretty() {
				//reference colors
				var unselectRGB = ' rgb(48, 48, 48)';
				var unselectHEX = '#303030';
				var selectRGB = ' rgb(38, 38, 38)';
				var selectHEX = '#262626';
			
				//header
				$("#form_NAV_T_universal_list__WEB__list table tbody td th, #form_NAV_T_universal_list__WEB__list table tbody td th table").css("background-color","transparent");

				//selected row
				$('#form_NAV_T_universal_list__WEB__list td[style*="background-color:' + selectRGB + ';"] div[name*=sutra_favorite_badge], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + selectRGB + ';"], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + selectRGB + ';"] input, #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + selectRGB + ';"] div div'
				).css('background-color','transparent').addClass('gfxLeftHilite');
				$('#form_NAV_T_universal_list__WEB__list td[style*="background-color:' + selectHEX + ';"] div[name*=sutra_favorite_badge], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + selectHEX + ';"], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + selectHEX + ';"] input, #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + selectHEX + ';"] div div'
				).css('background-color','transparent').addClass('gfxLeftHilite');

				//non-selected rows
				$('#form_NAV_T_universal_list__WEB__list td[style*="background-color:' + unselectRGB + ';"] div[name*=sutra_favorite_badge], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + unselectRGB + ';"], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + unselectRGB + ';"] input, #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + unselectRGB + ';"] div div'
				).css('background-color','transparent').removeClass('gfxLeftHilite');
				$('#form_NAV_T_universal_list__WEB__list td[style*="background-color:' + unselectHEX + ';"] div[name*=sutra_favorite_badge], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + unselectHEX + ';"], #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + unselectHEX + ';"] input, #form_NAV_T_universal_list__WEB__list table tbody td[style*="background-color:' + unselectHEX + ';"] div div'
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
		//don't show UL when isn't showing
		var selector = $('#form_NAV_T_universal_list__WEB__list')
		if (selector.length && (selector.height() == 0 || selector.width() == 0) || !selector.length) {
			return;
		}
		
		// console.log("resized");
		hideUL();
		// setTimeout(scrollbarSmall,750);
		showUL();
	}
	
	//debounce is loaded
	if ($.debounce && $('#form_DATASUTRA_WEB_0F__list').length && !$._data($('#form_DATASUTRA_WEB_0F__list')[0],'events')) {
		
		//make sure that event not currently bound
		if ($._data($('#form_DATASUTRA_WEB_0F__list')[0],'events') && !$._data($('#form_DATASUTRA_WEB_0F__list')[0],'events').resize) {
			$('#form_DATASUTRA_WEB_0F__list').off('resize');
		}
		
		//(re-)attach
		// console.log("listener attached");
		$('#form_DATASUTRA_WEB_0F__list').on('resize', null, $.debounce(300,attache));
	}
}

//UL hide
function hideUL() {
	// First up: set up big indicator
	bigIndicator();
	
	//Now try and hide the UL
	var selector = $('#form_NAV_T_universal_list__WEB');
	if (selector.length) {
		//not hidden yet; need to (re)-hide
		if (selector.css('z-index') != '-10') {
			selector.css('z-index', '-10');
		}
		//css4 parent selectors (for comboboxes)
		else {
			styleCSS4Parent();
		}
	}
}

//UL show
function showUL() {
	//rehook up correct styling to this part of the UL, but don't call showUL again
	setTimeout(function(){
		var selector = $('#form_NAV_T_universal_list__WEB');
		if (selector.length) {
			//make sure we have a place to store events
			if (typeof(DS.timer.showUL) == "undefined") {
				DS.timer.showUL = new Array();
			}
			
			//attach action to fast find so that blocker shown asap when find happening
			$('.fastFind').keydown(function(event) {
				if (event.which == 13){
					bigIndicator(true,0,'Finding...');
				}
			})
			//attach action to fast find stop so that blocker shown asap when resetting find
			$('.fastFindClear').on('click',function(event) {
				bigIndicator(true,0,'Clearing...');
			});
			
			function fadeIn() {
				//check to make sure other things aren't in the queue
				if (DS.timer.showUL.length) {
					if (DS.timer.showUL.length > 1) {
						DS.timer.showUL.splice(0,1);
						// console.log("skipped " + DS.timer.showUL.length);
					}
					//last in the queue, clear for next time and run
					else {
						DS.timer.showUL.splice(0,1);

						//give an extra quarter second
						setTimeout(fadeIn,0);
					}
					return
				}
				
				// console.log("run " + DS.timer.showUL.length);
				
				//UL is hidden behind, fade back in
				if (selector.css('z-index') != 'auto') {
					selector.toggle(false);
					selector.css('z-index', 'auto');
					
					//call again to make sure super pretty!
					prettifyUL(null,null,true);
					
					selector.fadeIn();
				}
				
				//hide spinny (won't do in table mode because empty selector)
				// $('#HUDcenter1').fadeOut();
				bigIndicator(false);
				
				//css4 parent selectors (for comboboxes)
				styleCSS4Parent();
			}
			
			var tOut = setTimeout(fadeIn,450);
			
			//tracking more info than needed at this point
			DS.timer.showUL.push({timeout: tOut, timestamp: new Date()})
		}
		
		//attach listener
		lefthandListen();
	},500);
}

//Orientation change dummy functions (overridden with callbacks to servoy)
function orientPortrait() {
	// alert("portrait");
}
function orientLandscape() {
	// alert("landscape");
}

//style comboboxes
function styleCSS4Parent() {
	//do we still need to run this?
	if (DS.version < 6.16) {
		//available and ready
		if ($ && $.fn && $.fn.cssParentSelector) {
			var comboParents = $('select').parent()
		
			//no things have had their parents' styled OR
			if (!$('[class^="CPS"]').length ||
			//not all selects have been styled
				(comboParents.length != comboParents.filter(function(){return (this.className || '').search(/CPS/) != -1}).length)
				) {
					//remove existing styling
					comboParents.each(function(){$(this).removeClass(this.className)});
				
					//(re-)apply
					$().cssParentSelector();
				
					//console.log('Styled');
			}
		}
	}
}

//interface lock
function triggerInterfaceLock(toggle,delay) {
	//put z-index on top or bottom
	setTimeout(function(){
		$("#form_DATASUTRA_WEB_0F__workflow,#form_DATASUTRA_WEB_0F__header__actions").css("z-index",(toggle ? 1 : 'auto'));
	},delay || 0);
}

//slickgrid wrapper
DS.grid = function(id,data,columns,actions,options,optionOverwrite,sample) {
	//re-call method in 1.25 seconds if slickgrid not available yet
	if (!window.Slick) {
		setTimeout(function() {
			DS.grid(id,data,columns,actions,options,optionOverwrite,sample);
		},1250)
		return
	}
	
	var parentID = $("#" + id).parent().attr('id');
	var selector = $("#" + parentID);
	var isGrid = $("#" + id + '[class*="slickgrid_"]').length == 1;
	var init = '<div id="' + id + '" class="sutraSlick"></div>';
	
	var optionsBase = {
		editable: false,
		enableAddRow: false,
		enableCellNavigation: true,
		enableColumnReorder: true, 
		enableTextSelectionOnCells: true,
		forceFitColumns: true, 
		forceSyncScrolling: true,
		fullWidthRows: true, 
		multiSelect: false,
		syncColumnCellResize: true,
		rowHeight: 22,
		headerRowHeight: 22
	};
	if (!options || typeof options != 'object') {
		options = new Object()
	}
	//we're working with universal list, override wrapper
	else if (options.dsUL) {
		delete options.dsUL;
		init = '<div id="' + id + '" class="sutraSlick universalList"></div>';
	}
	
	//advanced sorting
	var currentSortCol = new Object()
	
	//actions
	var gridClick = new Array()
	var gridDoubleClick = new Array()
	var gridRightClick = new Array()
	
	//image formatter
	function imageFormatter(row, cell, value, columnDef, dataContext) {
		var myReturn = '<span class="action table" style="background: url(/servoy-webclient/resources/servoy/media?id=';
		myReturn += columnDef.field.replace(/dsImg/,'');
		myReturn += ') no-repeat center center;"></span>';
		return myReturn
	}
	
	//date formatter
    function dateFormatter(row, cell, value, columnDef, dataContext) {
		var format = columnDef.dsFormat;
		
		// convert as needed (https://docs.google.com/spreadsheet/ccc?key=0AtgZluze7WMJdDBOLUZfSFIzenIwOHNjaWZoeGFqbWc&hl=en_US#gid=0)
		format = format.replace(/y/g,'Y');
		format = format.replace(/d/g,'D');
		format = format.replace(/EEEE/gi,'dddd');
		format = format.replace(/EEE/gi,'ddd');
		format = format.replace(/aa/g,'a');
		format = format.replace(/AA/g,'A');
		
		//grab date representation
		var theDate = moment(new Date(value));
		if (theDate.isValid()) {
			return theDate.format(format);
		}
		else {
			return $.datepicker.formatDate('m-d-yy',new Date(value));
		}
    }
	
	if (selector.length) {
		//fill with sample grid -- example 2
		if (sample) {
			//demonstrating a simple formatter
			function formatter(row, cell, value, columnDef, dataContext) {
				return value;
			}
			
			//help in calculating random date in the past few years
			function randomDate(start, end) {
			    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
			}
			
			//clear out data so can take sample
			data = [];
			
			//set up columns for display
				//MEMO: Slick calls are evaled so that SlickGrid has time to load in before object instantiated
			columns = [
				{id: "title", name: "Title", field: "title", sortable: true, width: 120, cssClass: "cell-title", formatter: formatter},
				{id: "duration", name: "Duration", field: "duration", sortable: true},
				{id: "%", name: "% Complete", field: "percentComplete", sortable: true, width: 80, resizable: false, formatter: eval('Slick.Formatters.PercentCompleteBar')},
				{id: "start", name: "Start", field: "start", sortable: true, minWidth: 60},
				{id: "finish", name: "Finish", field: "finish", sortable: true, minWidth: 60},
				{id: "effort-driven", name: "Effort Driven", sortable: true, sortable: false, width: 80, minWidth: 20, maxWidth: 80, cssClass: "cell-effort-driven", field: "effortDriven", sortable: true, formatter: eval('Slick.Formatters.Checkmark')}
			];
			
			//fill with 25000 rows
			for (var i = 0; i < 25000; i++) {
				var d = (data[i] = {});

				d["title"] = "<a href='#' tabindex='0'>Task</a> " + i;
				d["duration"] = "5 days";
				d["percentComplete"] = Math.min(100, Math.round(Math.random() * 110));
				d["start"] = $.datepicker.formatDate('mm/dd/yy', randomDate(new Date(2012, 0, 1), new Date()));
				d["finish"] = $.datepicker.formatDate('mm/dd/yy', randomDate(new Date(2012, 0, 1), new Date()));
				d["effortDriven"] = (Math.round(Math.random() * 2) == 0);
			}
			
			//use default options
			optionOverwrite = false
		}
		
		//process data sutra columns into slick grid columns
		for (var i = 0; i < columns.length; i++) {
			var column = columns[i];
			
			//cast string to defined function (should probably check to see if exists first)
			if (typeof column.formatter == 'string') {
				column.formatter = eval(column.formatter);
			}
		}
		
		//try to get data from cached copy
		if (!data.length && DS.grid && DS.grid.table && DS.grid.table[id] && typeof DS.grid.table[id].getData == 'function') {
			data = DS.grid.table[id].getData().getItems();
		}
		
		//this id has not already been wrapped as a slickgrid, initialize it
		if (!isGrid || (isGrid && !(DS.grid.table && DS.grid.table[id]))) {
			//we're using the base template for a data sutra grid
			if (!optionOverwrite) {
				//add base options that haven't been overridden
				for (var i in optionsBase) {
					if (!options.hasOwnProperty(i)) {
						options[i] = optionsBase[i]
					}
				}
			}
			
			//set up requested id with framework to hang slickgrid on
				//MEMO: we are actually trashing the div where servoy puts the html area field so anything directly configured on that element in servoy designer will be lost
			$('#' + id).remove();
			$(init).appendTo(selector);
			// selector.html = init;
			
			//set up container for all grids
			if (!DS.grid.table) {
				DS.grid.table = new Object();
			}
			
			//grab selectedindex
			var index = 0;
			if (options.hasOwnProperty('dsSelectedIndex') && typeof options.dsSelectedIndex == 'number') {
				index = options.dsSelectedIndex;
				delete options.dsSelectedIndex;
			}
			
			//broker between data array and grid
			var dataView = new Slick.Data.DataView();
			
			//custom row background colors specified
			if (options.dsRowBGColor) {
				//remove flag
				delete options.dsRowBGColor
			
				dataView.getItemMetadata = function(row) {
					if (this.getItem(row) && this.getItem(row).cssClass) {
						return {
							'cssClasses': this.getItem(row).cssClass
						};
					}
				}
			}
			
			var grid = 
			DS.grid.table[id] = 
				new Slick.Grid("#" + id, dataView, columns, options);
			
			// wire up model events to drive the grid
			dataView.onRowCountChanged.subscribe(function (e, args) {
				grid.updateRowCount();
				grid.render();
			});
			dataView.onRowsChanged.subscribe(function (e, args) {
				grid.invalidateRows(args.rows);
				grid.render();
			});
			
			//feed data into dataview
			dataView.beginUpdate();
			dataView.setItems(data);
			dataView.endUpdate();
			
			//loop all events and subscribe appropriately
			for (var i in actions) {
				//column events
				if (i == 'onClick' || i == 'onDblClick' || i == 'onContextMenu') {
					for (var j in actions[i]) {
						
					}
				}
				//some nested mumbo-jumbo
				else if (actions[i] instanceof Array) {
					// for (var j = 0; j < actions[i].length; j++) {
					// 	grid[i].subscribe(actions[i][j])
					// }
				}
				//subscribe method
				else {
					function subClosure(fx,fxBody) {
						grid[fx].subscribe(function(e, args) {
							eval(fxBody);
						});
					}
					
					subClosure(i,actions[i]);
				}
			}
			
			//single click
			if (actions.onClick) {
				grid.onClick.subscribe(function(e, args) {
					var cell = args.cell;
					var row = args.rows;
					var cellID = grid.getColumns()[cell].id;
					
					for (var i in actions.onClick) {
						if (cellID == i) {
							eval(actions.onClick[i]);
							// grid.updateRow(cell.row);
							// e.stopPropagation();
						}
					}
				});
			}
			
			
			//double click (need to combine with single click so as not to run when a double)
			
			
			//right-click
			if (actions.onContextMenu) {
				grid.onContextMenu.subscribe(function(e, args) {
					var cell = args.cell;
					var row = args.rows;
					
					if (cell && grid.getColumns()[cell]) {
						var cellID = grid.getColumns()[cell].id;
					
						for (var i in actions.onContextMenu) {
							if (cellID == i) {
								eval(actions.onContextMenu[i]);
							}
						}
					}
				});
			}
			
			//show tooltips when grid width can't show entire contents
			grid.registerPlugin(new Slick.AutoTooltips({ 
				enableForHeaderCells: true 
			}));
			
			//select the selected row and make sure visible
			grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: true}));
			grid.setSelectedRows([index]);
			grid.scrollRowToTop(index-5);
		}
		//restore state of grid
			//for now, just pumping in new data and adjust so can see selected record
		else {
			var grid = DS.grid.table[id];
			
			//push in new data
			if (data instanceof Array) {
				var dataView = grid.getData();
				dataView.beginUpdate();
				dataView.setItems(data);
				dataView.endUpdate();
				dataView.syncGridSelection(grid, true);
			}
				
			//handle selectedindex (should we set the index or not?)
			var index = 0;
			if (options.hasOwnProperty('dsSelectedIndex') && typeof options.dsSelectedIndex == 'number') {
				index = options.dsSelectedIndex;
				delete options.dsSelectedIndex;
			}
			//if index different, set it
			if (grid.getSelectedRows().indexOf(index) == -1) {
				grid.resetActiveCell()
				
				grid.setSelectedRows([index]);
				// grid.scrollRowToTop(index-5);
				grid.scrollRowIntoView(index);
				
				grid.invalidate();
			}
		}
		
		//most recently painted grid
		DS.grid.table.last = id
	}
}
