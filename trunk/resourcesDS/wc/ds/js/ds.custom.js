//MorrisJS includes
$('head').append('<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>');
$('head').append('<script type="text/javascript" src="//cdn.oesmith.co.uk/morris-0.4.3.min.js"></script>');

//LCMOS override for making sure close button only shows up on one form
setTimeout(function() {$('#servoy_dataform').on('mouseup',null,function () {
	// console.log("Listening...");
	// var frames = $('iframe');
	// 	//there are iframes here, may be there is a FiD showing
	// 	if (frames.length) {
	// 		//only checking first iframe because won't be more than that showing
	// 		if ($('#form_LCMOS_P_task', frames[0].contentWindow.document).length) {
	// 			console.log("Found popup form");
	// 		}
	// 	}
	
	if ($('#form_CRM_P_cart__review').length || $('#form_CRM_P_itemsonorder').length) {
		var selector = $('div.wicket-modal div.w_blue a.w_close',window.parent.document);
		
		if (selector.length && selector.style) {
			selector.style('display','inline','important');
		}
	}
})},0)