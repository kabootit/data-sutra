//	Extend jquery to work with importance (http://stackoverflow.com/questions/2655925/jquery-css-applying-important-styles)
(function($) {
	var isStyleFuncSupported = CSSStyleDeclaration.prototype.getPropertyValue != null;
	if (!isStyleFuncSupported) {
	    CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
	        return this.getAttribute(a);
	    };
	    CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
	        this.setAttribute(styleName,value);
	        var priority = typeof priority != 'undefined' ? priority : '';
	        if (priority != '') {
	            // Add priority manually
	            var rule = new RegExp(RegExp.escape(styleName) + '\\s*:\\s*' + RegExp.escape(value) + '(\\s*;)?', 'gmi');
	            this.cssText = this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
	        } 
	    }
	    CSSStyleDeclaration.prototype.removeProperty = function(a) {
	        return this.removeAttribute(a);
	    }
	    CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
	        var rule = new RegExp(RegExp.escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?', 'gmi');
	        return rule.test(this.cssText) ? 'important' : '';
	    }
	}

	// Escape regex chars with \
	RegExp.escape = function(text) {
	    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	}

	// The style function
	$.fn.style = function(styleName, value, priority) {
	    // DOM node
	    var node = this.get(0);
	    // Ensure we have a DOM node 
	    if (typeof node == 'undefined') {
	        return;
	    }
	    // CSSStyleDeclaration
	    var style = this.get(0).style;
	    // Getter/Setter
	    if (typeof styleName != 'undefined') {
	        if (typeof value != 'undefined') {
	            // Set style property
	            var priority = typeof priority != 'undefined' ? priority : '';
	            style.setProperty(styleName, value, priority);
	        } else {
	            // Get style property
	            return style.getPropertyValue(styleName);
	        }
	    } else {
	        // Get CSSStyleDeclaration
	        return style;
	    }
	}
	
	//	Allow for disabling of selection
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
	}
		
	//	Extend jquery to be able to remove styles (http://stackoverflow.com/questions/2465158)
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
