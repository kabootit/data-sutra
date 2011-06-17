/**
 *
 * @properties={typeid:24,uuid:"a336f590-1b93-4e91-887c-75823a942e15"}
 */
function FORM_on_load()
{

/*
 *	TITLE    :	FORM_on_load
 *			  	
 *	MODULE   :	_ds_NSTL_installation
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TRIGGER_tooltip_set()


}

/**
 *
 * @properties={typeid:24,uuid:"c3dfd968-c1e9-43db-87b3-71758d2ef216"}
 */
function UTIL_convert_button_method()
{

var answer = plugins.dialogs.showQuestionDialog(
				'Update Buttons?',
				'<html>Do you want to update all buttons to the new naming convention?<br>' +
				'NOTE: This only needs to be done once.',
				'Yes',
				'No'
		)

if (answer == 'Yes') {
	//busy on
	globals.CODE_cursor_busy(true)
	
	var formName = 'NAV_0L_navigation'
	var relnItem = 'nav_navigation_to_navigation_item__all'
	var relnAdd = 'nav_navigation_item_to_action_item__add'
	var relnAction = 'nav_navigation_item_to_action_item__action'
	
	//show the config set
	forms[formName].TOGGLE_config_set(true)
	
	for (var i = 1; i <= forms[formName].foundset.getSize(); i++) {
		var record = forms[formName].foundset.getRecord(i)
		
		for (var j = 1; j <= record[relnItem].getSize(); j++) {
			var record2 = record[relnItem].getRecord(j)
			
			//add
			if (utils.hasRecords(record2[relnAdd])) {
				for (var k = 1; k <= record2[relnAdd].getSize(); k++) {
					var record3 = record2[relnAdd].getRecord(k)
					if (record3.method_type == 'Method name') {
						record3.method_type = 'Method'
					}
				}
			}
			
			//actions
			if (utils.hasRecords(record2[relnAction])) {
				for (var k = 1; k <= record2[relnAction].getSize(); k++) {
					var record3 = record2[relnAction].getRecord(k)
					if (record3.method_type == 'Method name') {
						record3.method_type = 'Method'
					}
				}
			}
		}
	}
	
	databaseManager.saveData()
	
	//hide the config set
	forms[formName].TOGGLE_config_set(false)
	
	//busy off
	globals.CODE_cursor_busy(false)
	
	plugins.dialogs.showInfoDialog('Finished Button conversion','All your buttons have been updated.','OK')
}
}

/**
 *
 * @properties={typeid:24,uuid:"44d183bb-402a-4c65-8672-a3e20fbd37ff"}
 */
function UTIL_convert_ul_to_percent()
{

var answer = plugins.dialogs.showQuestionDialog(
					'Update all ULs?',
					'<html>Do you want to update all ULs to the new percentage based model?<br>' +
					'NOTE: This only needs to be done once.',
					'Yes',
					'No'
			)

if (answer == 'Yes') {
	var formName = 'NAV_0L_navigation'
	
	for (var i = 1; i <= forms[formName].foundset.getSize(); i++) {
		forms[formName].foundset.setSelectedIndex(i)
		forms[formName].UTIL_convert_to_percent()
	}
	
	plugins.dialogs.showInfoDialog('Finished UL conversion','All your ULs have been updated.','OK')
}
}

/**
 *
 * @properties={typeid:24,uuid:"59ae038a-c9cb-463d-bbf0-acc7061103aa"}
 */
function UTIL_generate_uuid()
{

var answer = plugins.dialogs.showQuestionDialog(
				'Generate UUIDs?',
				'<html>If no UUIDs have been assigned to the Data Sutra <br>' +
				'meta data, they will be auto-generated.  Proceed?<br><br>' +
				'NOTE: This only needs to be performed once.',
				'Yes',
				'No'
		)

if (answer == 'Yes') {
	
	//busy on
	globals.CODE_cursor_busy(true)
	
	
	//NAVIGATION ENGINE
		
		var formName = 'NAV_0L_navigation'
		var relnItem = 'nav_navigation_to_navigation_item__all'
		
		//hide the config set
		forms[formName].TOGGLE_config_set(false)
		
		for (var i = 1; i <= forms[formName].foundset.getSize(); i++) {
			var record = forms[formName].foundset.getRecord(i)
			
			for (var j = 1; j <= record[relnItem].getSize(); j++) {
				var record2 = record[relnItem].getRecord(j)
				
			}
		}
		
		databaseManager.saveData()
	
	
	
	//busy off
	globals.CODE_cursor_busy(false)
	
	plugins.dialogs.showInfoDialog('Find defaults set','The default find column has been set to "' + defaultFind + '".','OK')
}


}

/**
 *
 * @properties={typeid:24,uuid:"09c48726-fe0d-49a2-b643-90f2a476081d"}
 */
function UTIL_overwrite_find_default()
{

var answer = plugins.dialogs.showQuestionDialog(
				'Set find default?',
				'<html>Do you want to overwrite the default find field for <br>' +
				'all navigation items or only navigation items with no default find field?',
				'Overwrite all',
				'No default'
		)

if (answer) {
	
	var defaultFind = plugins.dialogs.showQuestionDialog(
				'Default type',
				'What should the default find type be?',
				'All text',
				'All numbers',
				'All dates'
		)
	
	//busy on
	globals.CODE_cursor_busy(true)
	
	var formName = 'NAV_0L_navigation'
	var relnItem = 'nav_navigation_to_navigation_item__all'
	
	//hide the config set
	forms[formName].TOGGLE_config_set(false)
	
	for (var i = 1; i <= forms[formName].foundset.getSize(); i++) {
		var record = forms[formName].foundset.getRecord(i)
		
		for (var j = 1; j <= record[relnItem].getSize(); j++) {
			var record2 = record[relnItem].getRecord(j)
			
			switch (answer) {
				case 'Overwrite all':
					record2.find_default = defaultFind
					//TODO: null out the flag_default on related columns
					break
				case 'No default':
					if (!record2.find_default) {
						record2.find_default = defaultFind
					}
					break
			}
		}
	}
	
	databaseManager.saveData()
	
	//busy off
	globals.CODE_cursor_busy(false)
	
	plugins.dialogs.showInfoDialog('Find defaults set','The default find column has been set to "' + defaultFind + '".','OK')
}


}

/**
 *
 * @properties={typeid:24,uuid:"503ccb01-9d1b-46ab-96a5-91452a337ded"}
 */
function UTIL_toolbar_upgrade()
{

var answer = plugins.dialogs.showQuestionDialog(
				'Upgrade toolbars?',
				'<html>Do you want to upgrade all existing toolbars <br>' +
				'to be of type toolbar?',
				'Yes',
				'No'
		)

if (answer == 'Yes') {
	
	//busy on
	globals.CODE_cursor_busy(true)
	
	var formName = 'MGR_0F_toolbar'
	forms[formName].controller.loadAllRecords()
	
	for (var i = 1; i <= forms[formName].foundset.getSize(); i++) {
		var record = forms[formName].foundset.getRecord(i)
		
		record.toolbar_type = 1
	}
	
	databaseManager.saveData()
	
	//busy off
	globals.CODE_cursor_busy(false)
	
	plugins.dialogs.showInfoDialog('Toolbars upgraded','All toolbars have been upgraded to support sidebars','OK')
}


}
