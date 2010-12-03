/**
 *
 * @properties={typeid:24,uuid:"07c83fbd-19d4-4cf7-9930-41f9c96f7027"}
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
 *	MODIFIED :	September 9, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */	

elements.btn_find.enabled = false
elements.btn_pref.enabled = false
elements.find_end.enabled = false
elements.find_mid.enabled = false
elements.fld_find.enabled = false
elements.fld_navset.enabled = false

//fake out record navigator into leaving us alone
if (application.__parent__.solutionPrefs && solutionPrefs.config) {
	solutionPrefs.config.lockStatus = true
}

application.updateUI()

//if this form is shown, it is definitely for an error, force the error screen to show
forms.PREF_0L__deployment.GO_one()
}
