/**
 *
 * @properties={typeid:24,uuid:"FA266360-FFE9-4EFC-A4F2-A17B530CBB2E"}
 * @AllowToRunInFind
 */
function ACTION_filter()
{

/*
 *	TITLE    :	ACTION_filter
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_filter()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = 'MGR_0F_tooltip_1L_2L'

//nulling and other clean up required by the calling element
switch (application.getMethodTriggerElementName()) {
	//clear out form, element, tooltip, and inline_help options
	case 'fld_MGR_tooltip_filter_module':
		globals.MGR_tooltip_filter_form = null
		//continue on
	//clear out element, tooltip, and inline_help options
	case 'fld_MGR_tooltip_filter_form':
		globals.MGR_tooltip_filter_element = null
		//continue on
	//clear out tooltip and inline_help options
	case 'fld_MGR_tooltip_filter_element':
		globals.MGR_tooltip_filter_tooltip = null
		globals.MGR_tooltip_filter_inline_help = null
		break
	//clear out everything except for module and help flags
	case 'fld_TIP_revisit':
		globals.MGR_tooltip_filter_selected = null
		globals.MGR_tooltip_filter_tooltip = null
		globals.MGR_tooltip_filter_inline_help = null
		globals.MGR_tooltip_filter_form = null
		globals.MGR_tooltip_filter_element = null
		break
	case 'fld_TIP_tooltip':
	case 'fld_TIP_inline_help':
		globals.MGR_tooltip_filter_module = null
		globals.MGR_tooltip_filter_form = null
		globals.MGR_tooltip_filter_element = null
}


//find on filtered values
forms[formName].controller.find()
	
	if (globals.MGR_tooltip_filter_tooltip) {forms[formName].tooltip = '%' + globals.MGR_tooltip_filter_tooltip + '%'}
	if (globals.MGR_tooltip_filter_inline_help) {forms[formName].inline_help = '%' + globals.MGR_tooltip_filter_inline_help + '%'}
	if (globals.MGR_tooltip_filter_module) {forms[formName].module_filter = globals.MGR_tooltip_filter_module}
	if (globals.MGR_tooltip_filter_form) {forms[formName].form_name = globals.MGR_tooltip_filter_form}
	if (globals.MGR_tooltip_filter_element) {forms[formName].element_name = globals.MGR_tooltip_filter_element}
	if (typeof globals.MGR_tooltip_filter_flag_help == 'number') {forms[formName].flag_help = (globals.MGR_tooltip_filter_flag_help) ? 1 : '^='}
	if (typeof globals.MGR_tooltip_filter_flag_revisit == 'number') {forms[formName].flag_revisit = (globals.MGR_tooltip_filter_flag_revisit) ? 1 : '^='}

var results = forms[formName].controller.search()

//only do anything with the selected column if it is the one that was just clicked
if (application.getMethodTriggerElementName() == 'fld_TIP_selected') {
	var pkArray = new Array()
	
	for ( var i = 1 ; i <= forms.MGR_0F_tooltip_1L_2L.foundset.getSize() ; i++ ) {
	
		var record = forms.MGR_0F_tooltip_1L_2L.foundset.getRecord(i)
		
		//if globals.MGR_tooltip_filter_selected, search for 1; else search for null or 0
		if (((globals.MGR_tooltip_filter_selected) ? (record.selected == 1) : (record.selected == null || record.selected == 0))) {
			pkArray.push(record.id_tooltip)
		}
	
	}
	
	forms.MGR_0F_tooltip_1L_2L.controller.loadRecords(databaseManager.convertToDataSet(pkArray))
	
	if (pkArray.length) {
		forms[formName].controller.sort('module_filter asc, form_name asc, element_name asc')
	}
}
//otherwise null it out
else {
	globals.MGR_tooltip_filter_selected = null
}

//sort if there are results
if (results && !pkArray) {
	forms[formName].controller.sort('module_filter asc, form_name asc, element_name asc')
}

//set value lists if required
if (application.getMethodTriggerElementName() == 'fld_MGR_tooltip_filter_module') {
	ACTION_vl_forms()
}
else if (application.getMethodTriggerElementName() == 'fld_MGR_tooltip_filter_form') {
	ACTION_vl_elements()
}


}

/**
 *
 * @properties={typeid:24,uuid:"6C2D6F82-5248-4DD1-984E-9E9CC915C282"}
 * @AllowToRunInFind
 */
function ACTION_filter_elements()
{

/*
 *	TITLE    :	ACTION_filter_elements
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_filter_elements()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// filter tooltips to selected module, form and element 
forms.MGR_0F_tooltip_1L.controller.find()
forms.MGR_0F_tooltip_1L.module_filter 	= globals.MGR_tooltip_filter_module
forms.MGR_0F_tooltip_1L.form_name		= globals.MGR_tooltip_filter_form
forms.MGR_0F_tooltip_1L.element_name	= globals.MGR_tooltip_filter_element
forms.MGR_0F_tooltip_1L.controller.search()

// clear filters
globals.MGR_tooltip_filter_inline_help	= null
globals.MGR_tooltip_filter_tooltip		= null
globals.MGR_tooltip_filter_selected		= null
}

/**
 *
 * @properties={typeid:24,uuid:"5A6F0682-3B9E-4F9B-9EBA-0064D3CF2671"}
 * @AllowToRunInFind
 */
function ACTION_filter_flag_help()
{

/*
 *	TITLE    :	ACTION_filter_flag_help
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_filter_flag_help()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// clear filters
globals.MGR_tooltip_filter_element		= null
globals.MGR_tooltip_filter_tooltip		= null
globals.MGR_tooltip_filter_selected		= null


// filter tooltips to selected module, form and element 

if (globals.MGR_tooltip_filter_flag_help) {
	forms.MGR_0F_tooltip_1L.controller.find()
	forms.MGR_0F_tooltip_1L.flag_help = globals.MGR_tooltip_filter_flag_help
	forms.MGR_0F_tooltip_1L.controller.search(false, true)
}
else {
	// filter tooltips to selected module, form and element 
	forms.MGR_0F_tooltip_1L.controller.find()
	forms.MGR_0F_tooltip_1L.module_filter 	= globals.MGR_tooltip_filter_module
	forms.MGR_0F_tooltip_1L.form_name		= globals.MGR_tooltip_filter_form
	forms.MGR_0F_tooltip_1L.element_name	= globals.MGR_tooltip_filter_element
	forms.MGR_0F_tooltip_1L.controller.search()
}



}

/**
 *
 * @properties={typeid:24,uuid:"A72AB21B-B479-4408-9BB0-E78D50E5A173"}
 * @AllowToRunInFind
 */
function ACTION_filter_inline_help()
{

/*
 *	TITLE    :	ACTION_filter_inline_help
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_filter_inline_help()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// filter tooltips on tooltip 

databaseManager.saveData()

forms.MGR_0F_tooltip_1L.controller.find()
forms.MGR_0F_tooltip_1L.inline_help			= '%' + globals.MGR_tooltip_filter_inline_help + '%'
forms.MGR_0F_tooltip_1L.controller.search()



// clear filters

globals.MGR_tooltip_filter_module		= null
globals.MGR_tooltip_filter_form			= null
globals.MGR_tooltip_filter_element		= null
globals.MGR_tooltip_filter_tooltip		= null
globals.MGR_tooltip_filter_flag_help	= null
globals.MGR_tooltip_filter_selected		= null
}

/**
 *
 * @properties={typeid:24,uuid:"875463E0-2278-4111-AC72-82817F23AB4D"}
 */
function ACTION_filter_selected()
{

/*
 *	TITLE    :	ACTION_filter_selected
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_filter_selected()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// filter tooltips by selected 

//load all records
forms.MGR_0F_tooltip_1L_2L.foundset.loadAllRecords()

var pkArray = new Array()

for ( var i = 1 ; i <= forms.MGR_0F_tooltip_1L_2L.foundset.getSize() ; i++ ) {

	var record = forms.MGR_0F_tooltip_1L_2L.foundset.getRecord(i)
	
	//if globals.MGR_tooltip_filter_selected, search for 1; else search for null or 0
	if (((globals.MGR_tooltip_filter_selected) ? (record.selected == 1) : (record.selected == null || record.selected == 0))) {
		pkArray.push(record.id_tooltip)
	}

}

forms.MGR_0F_tooltip_1L_2L.controller.loadRecords(databaseManager.convertToDataSet(pkArray))



// clear filters

globals.MGR_tooltip_filter_module		= null
globals.MGR_tooltip_filter_form			= null
globals.MGR_tooltip_filter_element		= null
globals.MGR_tooltip_filter_tooltip		= null
globals.MGR_tooltip_filter_flag_help	= null
globals.MGR_tooltip_filter_inline_help	= null


}

/**
 *
 * @properties={typeid:24,uuid:"76C85BFD-1D70-4FF0-881E-F992CED6E68F"}
 * @AllowToRunInFind
 */
function ACTION_filter_tooltip()
{

/*
 *	TITLE    :	ACTION_filter_tooltip
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_filter_tooltip()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// filter tooltips on tooltip 

databaseManager.saveData()

forms.MGR_0F_tooltip_1L.controller.find()
forms.MGR_0F_tooltip_1L.tooltip			=  '%' + globals.MGR_tooltip_filter_tooltip + '%'
var results = forms.MGR_0F_tooltip_1L.controller.search()



// clear filters

globals.MGR_tooltip_filter_module		= null
globals.MGR_tooltip_filter_form			= null
globals.MGR_tooltip_filter_element		= null
globals.MGR_tooltip_filter_inline_help	= null
globals.MGR_tooltip_filter_flag_help	= null
globals.MGR_tooltip_filter_selected		= null
}

/**
 *
 * @properties={typeid:24,uuid:"FCEBCA9C-3051-44DF-A502-8149D2A9843C"}
 */
function ACTION_select_all()
{

/*
 *	TITLE    :	ACTION_select_all
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_select_all()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// go through tooltips and set selected value to control value (0 or 1)

databaseManager.saveData()

for ( var i = 1 ; i <= forms.MGR_0F_tooltip_1L_2L.foundset.getSize() ; i++ ) {

	var record = forms.MGR_0F_tooltip_1L_2L.foundset.getRecord(i)
	record.selected = globals.MGR_tooltip_select_all

}

application.updateUI()


}

/**
 *
 * @properties={typeid:24,uuid:"48A0300B-2579-431B-83AA-8A8217D2B655"}
 * @AllowToRunInFind
 */
function ACTION_vl_elements()
{

/*
 *	TITLE    :	ACTION_vl_elements
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_vl_elements()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// assign element name value list

var sql = 	"select element_name from " +
			forms.MGR_0F_tooltip_1L.controller.getTableName() +
			" where module_filter = ? and form_name = ?"
			
var dataset = 	databaseManager.getDataSetByQuery(
				controller.getServerName(),
				sql,
				new Array(globals.MGR_tooltip_filter_module, globals.MGR_tooltip_filter_form),
				1000)
				
application.setValueListItems( "MGR_tooltip_element_names_filter", dataset)


// filter tooltips to selected module and form 
forms.MGR_0F_tooltip_1L.controller.find()
forms.MGR_0F_tooltip_1L.module_filter 	= globals.MGR_tooltip_filter_module
forms.MGR_0F_tooltip_1L.form_name		= globals.MGR_tooltip_filter_form
if (globals.MGR_tooltip_filter_flag_help) {
	forms.MGR_0F_tooltip_1L.flag_help = 1
}
forms.MGR_0F_tooltip_1L.controller.search()

// clear filters

globals.MGR_tooltip_filter_element		= null
globals.MGR_tooltip_filter_inline_help	= null
globals.MGR_tooltip_filter_tooltip		= null
}

/**
 *
 * @properties={typeid:24,uuid:"292330CB-6826-41D2-B1FB-E6FDAD33CB6A"}
 * @AllowToRunInFind
 */
function ACTION_vl_forms()
{

/*
 *	TITLE    :	ACTION_vl_forms
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	ACTION_vl_forms()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// assign form name value list

var sql = 	"select form_name from " +
			forms.MGR_0F_tooltip_1L.controller.getTableName() +
			" where module_filter = ? group by form_name"
			
var dataset = 	databaseManager.getDataSetByQuery(
				controller.getServerName(),
				sql,
				[globals.MGR_tooltip_filter_module],
				1000)
				
application.setValueListItems( "MGR_tooltip_form_names_filter", dataset)


// filter tooltips to selected module
forms.MGR_0F_tooltip_1L.controller.find()
forms.MGR_0F_tooltip_1L.module_filter 	= globals.MGR_tooltip_filter_module
if (globals.MGR_tooltip_filter_flag_help) {
	forms.MGR_0F_tooltip_1L.flag_help = 1
}
forms.MGR_0F_tooltip_1L.controller.search()


// clear filters

globals.MGR_tooltip_filter_form			= null
globals.MGR_tooltip_filter_element		= null
globals.MGR_tooltip_filter_inline_help	= null
globals.MGR_tooltip_filter_tooltip		= null

}

/**
 *
 * @properties={typeid:24,uuid:"9C9CD99B-4899-4F7B-875D-AED53AB8710F"}
 * @AllowToRunInFind
 */
function FILTER_clear()
{

/*
 *	TITLE    :	FILTER_clear
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FILTER_clear()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

// clear filters

globals.MGR_tooltip_select_all			= null
globals.MGR_tooltip_filter_tooltip		= null
globals.MGR_tooltip_filter_inline_help	= null
globals.MGR_tooltip_filter_module		= null
globals.MGR_tooltip_filter_form			= null
globals.MGR_tooltip_filter_element		= null
globals.MGR_tooltip_filter_flag_help	= null
globals.MGR_tooltip_filter_selected		= null
globals.MGR_tooltip_filter_flag_revisit	= null

forms.MGR_0F_tooltip_1L.controller.loadAllRecords()


// clear value lists
application.setValueListItems( "MGR_tooltip_form_names_filter", [])
application.setValueListItems( "MGR_tooltip_element_names_filter", [])
}

/**
 *
 * @properties={typeid:24,uuid:"17B7F3CD-64E5-43B0-9CA7-0F06AC8B62C6"}
 */
function FORM_on_show(firstShow)
{

/*
 *	TITLE    :	FORM_on_show
 *			  	
 *	MODULE   :	rsrc_TIP_tooltip
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FORM_on_show()
 *			  	
 *	MODIFIED :	March 8, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (firstShow) {
	// make sure sutra_solution record is loaded
	
	FILTER_clear()
	
	
	// assign module name value list
	
	var sql = 	"select module_filter from " +
				forms.MGR_0F_tooltip_1L.controller.getTableName() +
				" group by module_filter"
				
	var dataset = 	databaseManager.getDataSetByQuery(
					controller.getServerName(),
					sql,
					null,
					1000)
					
	application.setValueListItems( "MGR_tooltip_module_names_filter", dataset)
}
}
