/**
 *
 * @properties={typeid:24,uuid:"a8c6215d-4b92-4260-9b96-d5956b61df6e"}
 */
function FORM_on_hide()
{

/*
 *	TITLE    :	FORM_on_hide
 *			  	
 *	MODULE   :	start_TMPL_forms
 *			  	
 *	ABOUT    :	demonstrate fast find override
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_hide()
 *			  	
 *	MODIFIED :	February 2, 2010 -- Troy Elliott, Data Mosaic
 *			  	
 */

//revert to normal fast find
globals.CALLBACK_fastfind_override(false)


}

/**
 *
 * @properties={typeid:24,uuid:"b5a3d81e-729d-4f8b-a016-9c6116fc7562"}
 */
function FORM_on_show()
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	start_TMPL_forms
 *			  	
 *	ABOUT    :	demonstrate fast find override
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	February 2, 2010 -- Troy Elliott, Data Mosaic
 *			  	
 */

//what do we want to find on?
var findOV = new Array()

//item 1: date format
findOV.push({
		findName	: 'Find date format',
		columnType	: 'TEXT',
		columnName	: 'find_dateformat',
		relation	: 'NONE',
		toolTip		: ''
	})

//item 2: license type
findOV.push({
		findName	: 'License type',
		columnType	: 'TEXT',
		columnName	: 'license_type',
		relation	: 'NONE',
		toolTip		: 'I am a tooltip, methinks'
	})

//item 3: solution name
findOV.push({
		findName	: 'Solution',
		columnType	: 'TEXT',
		columnName	: 'solution_name',
		relation	: 'NONE',
		toolTip		: ''
	})

//where do we want to find on it?
//findOV.searchForm = 'My_cool_form'

//override fast find
globals.CALLBACK_fastfind_override(findOV)
}
