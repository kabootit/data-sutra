/**
 *
 * @properties={typeid:24,uuid:"98e12677-1d67-4ea7-9b2e-a627cbdd8a46"}
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
 * @properties={typeid:24,uuid:"ef8eec13-37f2-49b8-85ba-96f75a857dbc"}
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
 * @properties={typeid:24,uuid:"7bcc59b7-2d5f-44ea-bff1-f9f2ac70d354"}
 */
function LISTEN_point()
{


var mouseEvent = arguments[0]

origin.x = mouseEvent.getX()
origin.y = mouseEvent.getY()



}

/**
 *
 * @properties={typeid:24,uuid:"8b32cfbd-b15d-4cf3-81e3-6df56cb547a4"}
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
