/**
 *
 * @properties={typeid:24,uuid:"575A33AF-4285-40F1-8D4D-3547F38C2BCD"}
 */
function FORM_on_load()
{

var divider = 310

if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase
	divider = forms[baseForm].elements.tab_content_C.getHeight() - 270
}

// split bean setup
elements.bean_split.topComponent	= elements.tab_top
elements.bean_split.bottomComponent	= elements.tab_bottom

elements.bean_split.orientation = 0
elements.bean_split.resizeWeight = 1
elements.bean_split.dividerLocation = divider

}
