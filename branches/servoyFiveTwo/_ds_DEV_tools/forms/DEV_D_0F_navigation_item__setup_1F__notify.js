/**
 *
 * @properties={typeid:24,uuid:"1f1eda21-43c8-4e44-861c-db361270f121"}
 */
function FLD_data_change__initial_form()
{

/*
 *	TITLE    :	FLD_data_change__initial_form
 *			  	
 *	MODULE   :	ds_PREF_prefereces
 *			  	
 *	ABOUT    :	set a default label if blank
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__initial_form()
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (initial_form && (initial_form_label == null || initial_form_label == '')) {
	initial_form_label = 'Loading...'
}
}

/**
 *
 * @properties={typeid:24,uuid:"d8780198-0a58-40e3-a956-d56ab04a67e6"}
 */
function FLD_data_change__initial_record()
{

/*
 *	TITLE    :	FLD_data_change__initial_record
 *			  	
 *	MODULE   :	ds_PREF_prefereces
 *			  	
 *	ABOUT    :	set a default label if blank
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__initial_form()
 *			  	
 *	MODIFIED :	July 9, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (initial_record && (initial_record_label == null || initial_record_label == '')) {
	initial_record_label = 'Loading...'
}
}
