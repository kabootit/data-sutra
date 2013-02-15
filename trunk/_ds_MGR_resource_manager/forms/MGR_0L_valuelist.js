/**
 * @properties={typeid:24,uuid:"03B32108-5D02-4980-BFC4-588E4F0E130D"}
 */
function ACTIONS_list() {
	//get menu list from a value list
	var valueList = ['Rename valuelist','-','Delete record']
	
	//build menu
	var menu = new Array
	for ( var i = 0 ; i < valueList.length ; i++ ) {
		menu[i] = plugins.popupmenu.createMenuItem(valueList[i] + "", ACTIONS_list_control)
	}
	
	//set menu method arguments
	var x = 0
	while (menu[x]) {
		//pass arguments
		menu[x].setMethodArguments(x)
		x++
	}
	
	
	//hack not required
	if (utils.stringToNumber(application.getVersion()) >= 5) {
		//pop up the popup menu
		var elem = elements[application.getMethodTriggerElementName()]
		if (elem != null) {
		    plugins.popupmenu.showPopupMenu(elem, menu);
		}
	}
	//legacy
	else {
		//allow popup to approximately work even when solutionPrefs isn't defined
		if (application.__parent__.solutionPrefs) {
			var lineHeight = solutionPrefs.clientInfo.popupHack.lineHeight
			var topShift = solutionPrefs.clientInfo.popupHack.topShift
		}
		else {
			var lineHeight = 0
			var topShift = 0
		}
		
		//move "up" button to correct location
		var btnInvisible = application.getMethodTriggerElementName() + "_up"
		var currentLocationX = elements[btnInvisible].getLocationX()
		var currentLocationY = elements[btnInvisible].getLocationY()
		
		elements[btnInvisible].setLocation(currentLocationX, currentLocationY - (topShift + (menu.length * lineHeight)))
		
		//pop up the popup menu
		var elem = elements[btnInvisible]
		if (elem != null) {
			plugins.popupmenu.showPopupMenu(elem, menu);
		}
		
		
		//set invisible btn back to original location
		elements[btnInvisible].setLocation(currentLocationX, currentLocationY)
	}
}

/**
 *
 * @properties={typeid:24,uuid:"0ACE649C-40D7-4D25-8EF8-FF1B92FB6B2B"}
 */
function ACTIONS_list_control(input) {
	switch (input) {
		case 0:	//rename record
			var newName = globals.DIALOGS.showInputDialog(
							'Rename valuelist', 
							'Enter new name:', forms.MGR_0L_valuelist_1L.valuelist_name
						)
			
			if (newName) {
				forms.MGR_0L_valuelist_1L.valuelist_name = newName
				databaseManager.saveData()
			}
			break
			
		case 2:	//delete record
			var delRec = globals.DIALOGS.showWarningDialog(
								'Delete record',
								'Do you really want to delete the selected valuelist?',
								'Yes',
								'No'
							)
			
			if (delRec == 'Yes') {
				forms.MGR_0F_valuelist_1L.controller.deleteAllRecords()
				
				ACTION_load()
			}
			break	
	}
}

/**
 * @properties={typeid:24,uuid:"211E29FF-8D93-46F0-9B74-EB48D7CA3F0C"}
 */
function ACTION_load(selectVL) {
	// This query will get the records you want in your dataset
	//var query = "SELECT DISTINCT valuelist_name FROM sutra_valuelist"

	// This query will return the PK's of the records you're wanting
	// which will pass to .loadRecords() below
	var queryPK = "SELECT id_valuelist FROM sutra_valuelist WHERE id_valuelist IN " +
	"(SELECT min(id_valuelist) FROM sutra_valuelist GROUP BY valuelist_name)"

	var args = null

//	var dataset = databaseManager.getDataSetByQuery(
//			controller.getServerName(), 
//			query, 
//			args, 
//			-1
//		)
	var datasetPK = databaseManager.getDataSetByQuery(
			forms.MGR_0L_valuelist_1L.controller.getServerName(), 
			queryPK, 
			args, 
			-1
		)
	var recCount = datasetPK.getMaxRowIndex()

    // Load the desired records into a form's foundset using the PK's from ds_pk
    forms.MGR_0L_valuelist_1L.controller.loadRecords(datasetPK)
	
    forms.MGR_0L_valuelist_1L.controller.sort('valuelist_name asc, relation_1 asc, relation_2 asc, order_by asc')
	
    //record to select passed in, select it
    if (selectVL) {
    	for (var i = 1; i <= forms.MGR_0L_valuelist_1L.foundset.getSize(); i++) {
    		var record = forms.MGR_0L_valuelist_1L.foundset.getRecord(i)
		
    		if (record.valuelist_name == selectVL) {
    			forms.MGR_0L_valuelist_1L.foundset.setSelectedIndex(i)
    			break
    		}
    	}
    }
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"431BABE5-77A4-423F-89A6-A9305DAA6D3B"}
 */
function FORM_on_load(event) {
	ACTION_load()
}

/**
 *
 * @properties={typeid:24,uuid:"FC86EAB2-901D-4FA2-BC94-CE4D92C50216"}
 */
function REC_new() {
	var input = globals.DIALOGS.showInputDialog(
					'Valuelist',
					'What is the name of this valuelist?'
			)
	
	if (input) {
		forms.MGR_0L_valuelist_1L.controller.newRecord(false)
		forms.MGR_0L_valuelist_1L.valuelist_name = input
		forms.MGR_0L_valuelist_1L.order_by = 1
		databaseManager.saveData()
		
		forms.MGR_0L_valuelist_1L.REC_on_select()
	}
}
