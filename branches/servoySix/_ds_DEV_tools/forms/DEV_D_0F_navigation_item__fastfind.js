/**
 *
 * @properties={typeid:24,uuid:"2049749f-142e-4169-814e-709b49d7deb4"}
 */
function FLD_data_change__find_default()
{

/*
 *	TITLE    :	FLD_data_change__find_default
 *			  	
 *	MODULE   :	ds_NAV_engine
 *			  	
 *	ABOUT    :	set current fast find item record as only default
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__find_default()
 *			  	
 *	MODIFIED :	November 3, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//loop over all records in configured fast finds and flip them off manually
for (var i = 1; i <= forms.DEV_0L_column__fastfind.foundset.getSize() ; i++) {
	var record = forms.DEV_0L_column__fastfind.foundset.getRecord(i)
	
	record.flag_default = 0
}

//reset find valuelist
forms.DEV_0L_column__fastfind.SET_find_valuelist()
}

/**
 *
 * @properties={typeid:24,uuid:"68da13d4-0ca6-483b-94a1-dfda7df943f1"}
 */
function REC_on_select()
{

forms.DEV_0L_column__fastfind.SET_find_valuelist()
}
