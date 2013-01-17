/**
 *
 * @properties={typeid:24,uuid:"08A8144B-290E-44BD-936E-8B20BC3A4382"}
 */
function FORM_on_load() {
	
}
/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"CD26C765-47A4-4559-8574-8CA232ACD763"}
 */
function FORM_on_show(firstShow, event) {
	if (firstShow) {
		plugins.WebClientUtils.setExtraCssClass(elements.gfx_footer, 'gfxFooter')
	}
}


/**
 *
 * @properties={typeid:24,uuid:"63EEAD46-A7A8-4602-AAB2-124441DB3199"}
 */
function LISTEN_move()
{


var frame = Packages.java.awt.Frame.getFrames()[0]

var mouseEvent = arguments[0]

var point = frame.getLocation()

frame.setLocation(
		point.x + mouseEvent.getX() - origin.x, 
		point.y + mouseEvent.getY() - origin.y
	)



}

/**
 *
 * @properties={typeid:24,uuid:"FE70F57F-D35A-47EA-97DF-3263118CB788"}
 */
function LISTEN_point()
{


var mouseEvent = arguments[0]

origin.x = mouseEvent.getX()
origin.y = mouseEvent.getY()



}

/**
 *
 * @properties={typeid:24,uuid:"D2F9CC86-A3FB-49A0-B397-AF5E5C2CA6B4"}
 */
function LISTEN_resize()
{


var frame = Packages.java.awt.Frame.getFrames()[0]

var mouseEvent = arguments[0]

var point = frame.getSize()

frame.setSize(
		point.width + mouseEvent.getX(), 
		point.height + mouseEvent.getY()
	)



}
