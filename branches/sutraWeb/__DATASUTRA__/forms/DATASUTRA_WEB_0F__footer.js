/**
 *
 * @properties={typeid:24,uuid:"08A8144B-290E-44BD-936E-8B20BC3A4382"}
 */
function FORM_on_load()
{

/*
//set up listeners
elements.bean_move_it.addMouseListener(new Packages.java.awt.event.MouseAdapter({mousePressed:LISTEN_point}))
elements.bean_move_it.addMouseMotionListener(new Packages.java.awt.event.MouseMotionAdapter({mouseDragged:LISTEN_move}))


elements.bean_resize.addMouseListener(new Packages.java.awt.event.MouseAdapter({mousePressed:LISTEN_point}))
elements.bean_resize.addMouseMotionListener(new Packages.java.awt.event.MouseMotionAdapter({mouseDragged:LISTEN_resize}))
*/
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
