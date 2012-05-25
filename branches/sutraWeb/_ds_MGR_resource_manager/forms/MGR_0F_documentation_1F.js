/**
 *
 * @properties={typeid:24,uuid:"B55D849F-7A75-4FE6-AFE5-FF768175D037"}
 */
function FORM_on_load()
{

var divider = 700

if (application.__parent__.solutionPrefs) {
	var baseForm = solutionPrefs.config.formNameBase
	divider = forms[baseForm].elements.tab_content_C.getWidth() - 270
}

// split bean setup
elements.bean_split.leftComponent	= elements.tab_top
elements.bean_split.rightComponent	= elements.tab_bottom

elements.bean_split.orientation = 1
elements.bean_split.resizeWeight = 1
elements.bean_split.dividerLocation = divider

}
