/**
 *
 * @properties={typeid:24,uuid:"eed0cfc4-7f69-44a0-b0fa-2e17e9cf6763"}
 */
function FORM_on_load()
{

//set up split bean
elements.split_tool_find.leftComponent = elements.tab_toolbar
elements.split_tool_find.rightComponent = elements.tab_fastfind
elements.split_tool_find.dividerLocation = screen_width - 580 //application.getWindowWidth(null) - 580

//turn off sidebar drag related stuff
elements.bean_drag.visible = false
elements.lbl_drag.visible = false


//turn demo mode off
forms.DATASUTRA_0F_solution__header__toolbar.elements.lbl_demo_mode.visible = false



//the java drag junks!


/*
//make it global so other listener methods can access it
application.__parent__.origin = new Packages.java.awt.Point()

//set up listeners
elements.bean_header.addMouseListener(new Packages.java.awt.event.MouseAdapter({mousePressed:mouseListener}))
elements.bean_header.addMouseMotionListener(new Packages.java.awt.event.MouseMotionAdapter({mouseDragged:mouseMotionListener}))
*/


/*
 // Avoid creating a point with each mousePressed() call
  Point origin = new Point();
  frame.addMouseListener(new MouseAdapter() {
    public void mousePressed(MouseEvent e) {
      origin.x = e.getX();
      origin.y = e.getY();
    }
  });
  frame.addMouseMotionListener(new MouseMotionAdapter() {
    public void mouseDragged(MouseEvent e) {
      Point p = frame.getLocation();
      frame.setLocation(
        p.x + e.getX() - origin.x, 
        p.y + e.getY() - origin.y);
    }
  });
*/
}

/**
 *
 * @properties={typeid:24,uuid:"8f1294bb-3a0c-49bf-ba0f-53397ee5ddab"}
 */
function mouseListener()
{


var mouseEvent = arguments[0]

if (mouseEvent) {
	origin.x = mouseEvent.getX()
	origin.y = mouseEvent.getY()
}


}

/**
 *
 * @properties={typeid:24,uuid:"17d23df4-2eac-4c44-90c7-ea7b70517738"}
 */
function mouseMotionListener()
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
 * @properties={typeid:24,uuid:"673943db-ea14-418e-b3ae-6896b5d3d957"}
 */
function SIDEBAR_expand()
{
	var splitToolFind = forms.DATASUTRA_0F_solution__header.elements.split_tool_find
	var divLocation = splitToolFind.dividerLocation

	//in flexible spaces
	var flexOn = solutionPrefs.config.flexibleSpace
	
	if (flexOn) {
		globals.SPACE_flexible(null,true)
	}
	
	globals.SIDEBAR_toggle(true)
	
	if (flexOn) {
		globals.SPACE_flexible(null,true)
		application.updateUI()
		splitToolFind.dividerLocation = divLocation
	}
}
