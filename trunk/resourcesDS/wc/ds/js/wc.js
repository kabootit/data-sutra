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
		$('#indicator').activity({segments: 12, align: 'left', valign: 'top', steps: 3, width:2, space: 1, length: 3, color: '#030303', speed: 1.5});
		// $('#indicator').activity({segments: 12, width: 5.5, space: 6, length: 13, color: '#252525', speed: 1.5, outside:true});
		$('sutraBusy')
	},1500)
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

//  Pump in extra stylesheets at the end of head so that overwrite existing 
(function(){
	var delayTime = 5000
	
	// setTimeout(function(){
	// 	app.addPrefetchTags();
	// },delayTime)
	
	setTimeout(function(){
		$('head').append('<link rel="stylesheet" type="text/css" href="/servoy-webclient/templates/datasutra/servoy_web_client_bottom.css" />');
	},delayTime)
})();