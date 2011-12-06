/**
 *
 * @properties={typeid:24,uuid:"73261329-fc04-437b-bfd0-e9e6a1277029"}
 */
function CURTAIN_action()
{

/*
 *	TITLE    :	CURTAIN_action
 *			  	
 *	MODULE   :	_DATASUTRA_
 *			  	
 *	ABOUT    :	a blank method prevents things below an object from firing
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	CURTAIN_action()
 *			  	
 *	MODIFIED :	December 16, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//screen locked and quick login box not displayed already, show quick login
if (solutionPrefs.access.lockStatus && !elements.lock.visible) {
	var widthWindow = application.getWindowWidth(null)
	var heightWindow = application.getWindowHeight(null)
	
	var widthLock = elements.lock.getWidth()
	var heightLock = elements.lock.getHeight()
	
	//location x, location y, width, height
	elements.lock.reshape((widthWindow / 2 - widthLock / 2), (heightWindow / 2 - 4 * heightLock / 5),widthLock,heightLock)
	
	elements.lock.visible = true
}
}

/**
 *
 * @properties={typeid:24,uuid:"f5f953e8-1275-4823-afd8-dfab31b6bb8f"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	_DATASUTRA_
 *			  	
 *	ABOUT    :	set up split beans and tab panels
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Sept 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */	

//don't run in headless or web client (they use whatever solution is activated as context)
if (application.getApplicationType() == APPLICATION_TYPES.SMART_CLIENT || application.getApplicationType() == APPLICATION_TYPES.RUNTIME_CLIENT) {	
	if (! application.__parent__.solutionPrefs) {
		globals.DATASUTRA_open()
	}
	
	var formName = 'DATASUTRA_0F_solution'
	
	//continue setting things up if no error in login
	if (currentcontroller.getName() == formName) {
	
		//wrapper bean 1
		elements.bean_wrapper_1.leftComponent = elements.bean_wrapper_2
		elements.bean_wrapper_1.rightComponent = null
		
		//wrapper bean 2
		elements.bean_wrapper_2.topComponent = elements.bean_header
		elements.bean_wrapper_2.bottomComponent = elements.bean_main
		elements.bean_wrapper_2.dividerLocation = 44
		
		//header bean
		elements.bean_header.topComponent = null
		elements.bean_header.bottomComponent = elements.tab_header
		
		//main bean
		elements.bean_main.leftComponent = elements.bean_list
		elements.bean_main.rightComponent = elements.bean_workflow
		
		//list bean
		elements.bean_list.topComponent = elements.tab_content_A
		elements.bean_list.bottomComponent = elements.tab_content_B
		
		//workflow bean
		elements.bean_workflow.topComponent = null
		elements.bean_workflow.bottomComponent = elements.tab_content_C
		
		//unlock content
		elements.lock.contentPane = elements.tab_lock
		elements.lock.frameIcon = new Packages.javax.swing.ImageIcon(new Packages.java.net.URL('media:///toolbar_lock.png'))
		
		//hide locking curtains; set image
		elements.gfx_curtain_header.visible = false
		elements.gfx_curtain_header.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain.visible = false
		elements.gfx_curtain.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain_left_1.visible = false
		elements.gfx_curtain_left_1.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain_left_2.visible = false
		elements.gfx_curtain_left_2.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain_leftright.visible = false
		elements.gfx_curtain_leftright.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain_right_1.visible = false
		elements.gfx_curtain_right_1.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain_right_2.visible = false
		elements.gfx_curtain_right_2.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_curtain_top.visible = false
		elements.gfx_curtain_top.setImageURL('media:///curtain_5E6166.png')
		elements.gfx_spinner.setSize(32,32)
	//	application.updateUI()
	//	elements.gfx_spinner.setLocation((application.getWindowWidth() / 2) - 66, (application.getWindowHeight() / 2 - 200))
		elements.gfx_spinner.visible = false
		elements.gfx_spinner.setImageURL('media:///progressbar_facebook.gif')
		
		//hide designbar popdown
		elements.tab_design_popdown.visible = false
		
		//hide flexible spaces with sidebar showing top-border hack
		elements.gfx_flexible.visible = false
		
		//toolbar area pop-down
	//	elements.sheetz.contentPane = elements.tab_toolbar_popdown
		elements.tab_toolbar_popdown.visible = false
		
		//fastfind area pop
		elements.tab_fastfind.visible = false
		
		//floater tab panel
		elements.tab_dialog.visible = false
		
		//inliner tab panel
		elements.tab_dialog.visible = false		
		
		//turn off loading hider
		elements.gfx_curtain_blank.visible = false
		
		//tack on listener to my bean
	//	var listener = new Packages.java.beans.PropertyChangeListener({propertyChange:popUp})
	//	elements.bean_main.addPropertyChangeListener('dividerLocation',listener)
		
		/*
		//maximize workflow and show splash/login screen
		if (solutionPrefs.access && solutionPrefs.access.accessControl) {	
			//load main window
			if (elements.tab_content_C.tabIndex > 0) {
				elements.tab_content_C.removeAllTabs()
			}
			elements.tab_content_C.addTab(forms.AC_R__login,'')
			elements.tab_content_C.tabIndex = 1
			
			//re-size screen if too small
			if (application.getWindowWidth() < 950 || application.getWindowHeight() < 650) {
				application.setWindowSize(980,680)
				application.setWindowLocation(-1,-1)
			}
			
			//go to workflow maximized view
			globals.DS_space_change('btn_space_7',true)
		}
		//else when no access and control, view determined fx_load_forms
		*/
		application.updateUI()
		
		
		/*
		//maximize workflow and show splash/login screen
			
			//login
			if (solutionPrefs.access && solutionPrefs.access.accessControl) {	
				elements.tab_content_C.addTab(forms.AC_R__login,'')
			}
			//splash
			else {
				elements.tab_content_C.addTab(forms.AC_R__login,'')
			}
			elements.tab_content_C.tabIndex = 1
			
			//re-size screen if too small
			if (application.getWindowWidth() < 950 || application.getWindowHeight() < 650) {
				application.setWindowSize(980,680)
				application.setWindowLocation(-1,-1)
			}
			
			//go to workflow maximized view
			globals.DS_space_change('btn_space_7',true)
		
		application.updateUI()
		*/
	}
}
//run startup method specified in meta data for web client (for sutra cms)
else if (application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT) {
	//we need data...
	foundset.loadAllRecords()
	
	if (method_startup && solutionModel.getGlobalMethod(method_startup)) {
		globals[method_startup]()
	}
}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"6f7d6e0a-d0cc-42be-9565-8ad8a387418f"}
 */
function FORM_on_show(firstShow, event)
{
	
/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	_DATASUTRA_
 *			  	
 *	ABOUT    :	request focus on an element (trigger onFocusGainedMethod) to set solution title
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 29, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	

//don't run in headless or web client (they use whatever solution is activated as context)
if (application.getApplicationType() == APPLICATION_TYPES.SMART_CLIENT || application.getApplicationType() == APPLICATION_TYPES.RUNTIME_CLIENT) {
	//only fire first time shown
	//if (firstShow) {	//application.__parent__.solutionPrefs && 
		elements.fld_trigger_name.requestFocus(true)
	//}
}

}

/**
 *
 * @properties={typeid:24,uuid:"2893a3d9-ffdc-4d8e-8ea1-12aa9f8bdd2e"}
 */
function FRAME_rename()
{

/*
 *	TITLE    :	FRAME_rename
 *			  	
 *	MODULE   :	_DATASUTRA_
 *			  	
 *	ABOUT    :	set solution title
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	June 29, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */	

if (solution_name || solution_icon_blob) {
	globals.TRIGGER_frame_title_set(solution_name,solution_icon_blob) // + ' — Data Sutra'
}
}
