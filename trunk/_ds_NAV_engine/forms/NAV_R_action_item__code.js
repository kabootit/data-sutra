/**
 * Handle changed data.
 *
 * @param {Object} oldValue old value
 * @param {Object} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean} valid value
 *
 * @properties={typeid:24,uuid:"1234bd49-7ef1-490a-afe9-1c01a827e4db"}
 */
function FLD_data_change__method_type(oldValue, newValue, event)
{
	
//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
	//TODO WARNING: do rewrite your code to not depend on 'arguments', append them to the parameter list.
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

if (arguments[0] && typeof arguments[0] == 'object') {
	var record = arguments[0]
}
else if (utils.hasRecords(foundset)) {
	var record = foundset.getRecord(foundset.getSelectedIndex())
}

if (!record) {
	return
}

//check if it is possible to assign a method
if (!record.menu_name) {
	globals.DIALOGS.showErrorDialog(
				'Error',
				'You must create and name a menu item first',
				'OK'
			)
	record.method_type = null
}

databaseManager.saveData()

//clear out values when switching to a different execute type
if (!record.method_type) {
	record.method = null
	record.method_from_custom = null
	record.method_from_form = null
	REC_on_select()
}
else if (record.method_type == 'Custom code' && (utils.stringWordCount(record.method) == 1 && utils.stringRight(record.method,2) == '()')) {
	record.method = null
	record.method_from_custom = null
	record.method_from_form = null
}
else if (record.method_type == 'Method' && !(utils.stringWordCount(record.method) == 1 && utils.stringRight(record.method,2) == '()')) {
	record.method = null
	record.method_from_custom = null
	record.method_from_form = null
}

//set tab and enable/disable elements when run on this form
if (!(typeof arguments[0] == 'object')) {
	REC_on_select()
}


}

/**
 *
 * @properties={typeid:24,uuid:"5d41e9c3-0449-4f4a-8b9c-66f07fa8d446"}
 */
function REC_on_select() {
	function toggleCombos(toggle) {
		elements.fld_method_type.enabled = toggle
		forms.NAV_R_action_item__code__method.elements.fld_method.enabled = toggle
	}
	
	if (utils.hasRecords(foundset)) {
		
		//switch tab based on default execute type if on wrong one
		var selectedTab = elements.tab_method.tabIndex
		
		if (method_type == 'Method' && selectedTab != 1) {
			TAB_change(1)
		}
		else if (method_type == 'Custom code' && selectedTab != 2) {	
			TAB_change(2)
		}
		
		//disable adding a method to a divider
		if (menu_name == '-' || utils.stringPatternCount(menu_name, '---') > 0) {
			elements.tab_method.enabled = false
			method = null
			toggleCombos(true)
			method_type = null
			method_from_form = null
		}
		else {
			toggleCombos(true)
		}
		
		//force user to select method_type before editing
		if (method_type == null || method_type == '') {
			elements.tab_method.enabled = false
			forms.NAV_R_action_item__code__method.elements.fld_method.enabled = false
		}
		else {
			elements.tab_method.enabled = true
		}
	}
	else {
		toggleCombos(false)
	}
}

/**
 *
 * @properties={typeid:24,uuid:"17218c6a-60a9-4d3c-811a-dabbdffad475"}
 */
function TAB_change()
{

/*
 *	TITLE:		TAB_change
 *
 *	MODULE:		ds_NAV_navigation
 *
 *	ABOUT:		'Drawn' tabs tab panel method
 *
 *	MODIFIED:	Aug 29, 2007 - Troy Elliott, Data Mosaic
 *
 */

//MEMO: need to somehow put this section in a Function of it's own
//running in Tano...strip out jsevents for now
if (utils.stringToNumber(application.getVersion()) >= 5) {
	//cast Arguments to array
	var Arguments = new Array()
	for (var i = 0; i < arguments.length; i++) {
		Arguments.push(arguments[i])
	}
	
	//reassign arguments without jsevents
	arguments = Arguments.filter(globals.CODE_jsevent_remove)
}

elements.tab_method.tabIndex = arguments[0]

/*
globals.TAB_change_grid(null,(arguments[0]) ? arguments[0] : null,'tab_method','tab_m')

//set formname
var formName = application.getMethodTriggerFormName()

//set the tab panel name
var tabPanelName = 'tab_method'

//get button that called
if (!arguments[0]) {
	var btn_name = application.getMethodTriggerElementName()
}
else {
	var btn_name = arguments[0]
}

//set prefix for element
var prefix = 'tab_m'

//get number of tabs
var tab_num = elements[tabPanelName].getMaxTabIndex()

//layer control
elements.border.visible = false

//activate correct tab and flip tab buttons
for ( var i = 1 ; i <= tab_num ; i++ )
{	
	var tab_name = prefix + i
	var tab_index = 'label_' + i
	
	if (btn_name == tab_name) {
		elements[tab_index].bgcolor = '#A1B0CF'
		elements[tab_index].fgcolor = '#A1B0CF'
		elements[tab_name].setFont('Verdana,1,10')
		elements[tab_name].fgcolor = '#323A4B'
				
		//set tab index
		elements[tabPanelName].tabIndex = i
	}
	else {
		elements[tab_index].bgcolor = '#323A4B'
		elements[tab_index].fgcolor = '#323A4B'
		elements[tab_name].setFont('Verdana,1,10')
		elements[tab_name].fgcolor = '#ffffff'
	}				
}

//z-axis control
elements.border.visible = true
*/
}
