//	Object to track scroll position
var DS_universalList = {
				formName : '',
				scrollPosition : 0,
				setFormName : function(formName) {
					DS_universalList.formName = formName;
				},
				scrollHijack : function(formName) {
						//formName not specified, use whatever is currently the default
						if (!formName) {
							formName = DS_universalList.formName
						}
						
						var selector = $("#form_" + formName).find("tbody[id*='id']");
						
						if (selector.length) {
							console.log('HIJACK: gotcha ' + formName);
							selector.bind('scrollstop',
								function() {
									DS_universalList.scrollPosition = selector.scrollTop();
								}
							);
						}
						else {
							console.log('HIJACK: Nothing found here: ' + formName);
						}
					},
				scrollReset : function() {
						//grab the UL div
						var selector = $("#form_" + DS_universalList.formName).find("tbody[id*='id']");
						
						if (selector.length) {
							//scroll position not correct yet
							if (selector.scrollTop() != DS_universalList.scrollPosition) {
								selector.scrollTop(DS_universalList.scrollPosition);
								setTimeout(DS_universalList.scrollReset, 750);
								console.log('RESET: Scroll at ' + selector.scrollTop());
							}
							//scroll position correct, reattach listener
							else {
								DS_universalList.scrollHijack()
								console.log('RESET: Scroll correct; re-attaching listener');
							}
						}
						else {
							console.log('RESET: Nothing found here: ' + DS_universalList.formName);
						}
					}
			};

//	Update indicator to be new style
function setIndicator() {
	//$('#indicator' ).html('')
	// 	
	// 	//remove infoPanel if present
	// 	$('#infoPanel').remove()
}


//	Center the login form
function centerForm(formName) {
	setTimeout(function(){
		var selector = $("#form_" + formName);
		
		if (selector.length) {
			selector.css({width: '50%', margin: '0px auto'});
			console.log('CENTERED');
		}
		else {
			console.log('CENTER: Nothing found here: ' + formName);
		}
	},100)
}

//	Attach listener to form name variable change
(function() {
	//allow me to watch for change state
	//https://gist.github.com/384583 http://eligrey.com
	if (!Object.prototype.watch) {
		Object.defineProperty(Object.prototype, "watch", {
			  enumerable: false
			, configurable: true
			, writable: false
			, value: function (prop, handler) {
				var
				  oldval = this[prop]
				, newval = oldval
				, getter = function () {
					return newval;
				}
				, setter = function (val) {
					oldval = newval;
					return newval = handler.call(this, prop, oldval, val);
				}
				;

				if (delete this[prop]) { // can't watch constants
					Object.defineProperty(this, prop, {
						  get: getter
						, set: setter
						, enumerable: true
						, configurable: true
					});
				}
			}
		});
	}
	
	DS_universalList.watch('formName',
			function (key, oldVal, newVal) {  
				//let me know when this function fires
				// console.log("DS_universalList." + key + " changed from " + oldVal + " to " + newVal);
				
				//assign listener to new universal list form
				setTimeout(function(){DS_universalList.scrollHijack(newVal)},1500);
				
				return newVal;
			  }
		);
})();


//  Include spinny indicator after jquery is available
(function(){
	//part 1
	setTimeout(function(){
		//load in resource
		$('head').append('<script type="text/javascript" src="../../ds/js/activity-indicator.js"></script>');
		
		//remove infoPanel if present
		$('#infoPanel').remove()
	},1000)
	
	//part 2: set up indicator
	setTimeout(function(){
		$('#indicator').html('');
		$('#indicator').activity({segments: 12, align: 'left', valign: 'top', steps: 3, width:2, space: 1, length: 3, color: '#030303', speed: 1.5});
		// $('#indicator').activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#252525', speed: 1.5, outside:true});
		$('sutraBusy')
	},1500)
})();


//	Extend jQuery to give us scrollstart / scrollstop events
(function(){
 
	var special = jQuery.event.special,
		uid1 = 'D' + (+new Date()),
		uid2 = 'D' + (+new Date() + 1);
 
	special.scrollstart = {
		setup: function() {
 
			var timer,
				handler =  function(evt) {
 
					var _self = this,
						_args = arguments;
 
					if (timer) {
						clearTimeout(timer);
					} else {
						evt.type = 'scrollstart';
						jQuery.event.handle.apply(_self, _args);
					}
 
					timer = setTimeout( function(){
						timer = null;
					}, special.scrollstop.latency);
 
				};
 
			jQuery(this).bind('scroll', handler).data(uid1, handler);
 
		},
		teardown: function(){
			jQuery(this).unbind( 'scroll', jQuery(this).data(uid1) );
		}
	};
 
	special.scrollstop = {
		latency: 300,
		setup: function() {
 
			var timer,
					handler = function(evt) {
 
					var _self = this,
						_args = arguments;
 
					if (timer) {
						clearTimeout(timer);
					}
 
					timer = setTimeout( function(){
 
						timer = null;
						evt.type = 'scrollstop';
						jQuery.event.handle.apply(_self, _args);
 
					}, special.scrollstop.latency);
 
				};
 
			jQuery(this).bind('scroll', handler).data(uid2, handler);
 
		},
		teardown: function() {
			jQuery(this).unbind( 'scroll', jQuery(this).data(uid2) );
		}
	};
 
})();

//	Extend jquery to be able to remove styles (http://stackoverflow.com/questions/2465158/possible-to-remove-inline-styles-with-jquery)
(function($)
{
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

//  Give better resize indicators for all splitpanes
(function(){
	//hopefully three seconds is long enough for web client to get itself loaded
	setTimeout(function(){
		$('head').append('<link rel="stylesheet" type="text/css" href="../servoy-webclient/templates/datasutra/servoy_web_client_bottom.css" />');
	},3000)
})();