/**
 *
 * @properties={typeid:24,uuid:"0df3e5ad-e88f-456f-a6ef-7029ddd769d6"}
 */
function CLEAR_item()
{

login_nav_main = null
login_nav_main_node = null
login_nav_sub = null

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"5ac14a5b-c747-470b-8d31-65adf919eda3"}
 */
function CLEAR_set()
{

login_nav_set = null
login_nav_main = null
login_nav_main_node = null
login_nav_sub = null

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"da71c1f7-6312-4ab1-a6f9-9c158069b70e"}
 */
function CLEAR_sub()
{

login_nav_sub = null

databaseManager.saveData()
}

/**
 *
 * @properties={typeid:24,uuid:"2ed387a2-61e0-4d9d-b145-285ced5fc238"}
 */
function FLD_data_change__login_nav_sub()
{

/*
 *	TITLE    :	FLD_data_change__login_nav_sub
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	save the node of the currently selected item
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var navItems = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation_item')
navItems.clear()
navItems.find()
navItems.id_navigation_item = login_nav_main
var results = navItems.search()

if (results) {
	login_nav_main_node = navItems.node_1
}

//clear sub value
login_nav_sub = null
}

/**
 *
 * @properties={typeid:24,uuid:"bf7710b8-b7e9-4e77-8234-d0342bfb984f"}
 */
function FLD_data_change_login_nav_set()
{

/*
 *	TITLE    :	FLD_data_change__login_nav_set
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	clear other values
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	
 *			  	
 *	MODIFIED :	Feb 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

login_nav_main = null
login_nav_main_node = null
login_nav_sub = null
}
