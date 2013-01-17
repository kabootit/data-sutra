/**
 *
 * @properties={typeid:24,uuid:"dadd13fb-9675-48cd-aa01-a77a80ab42f8"}
 * @AllowToRunInFind
 */
function FLD_data_change__company_id()
{

/*
 *	TITLE    :	FLD_data_change__company_id
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FLD_data_change__company_id()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//reset related datapoints
contact_id = null
bill_address_id = null
ship_address_id = null

var fsAddress = databaseManager.getFoundSet(controller.getServerName(),'addresses')

//what is the billing address
fsAddress.find()
fsAddress.company_id = company_id
fsAddress.crm_addresses_to_address_types.description = 'Billing'
var results = fsAddress.search()

if (results) {
	bill_address_id = fsAddress.address_id
}
//no billing and on the billing tab, reset
else if (elements.tab_shipping.tabIndex == 1) {
	forms.CRM2_0F_orders_1F_addresses.REC_on_select()
}

//what is the shipping address
fsAddress.find()
fsAddress.company_id = company_id
fsAddress.crm_addresses_to_address_types.description = 'Shipping'
var results = fsAddress.search()

if (results) {
	ship_address_id = fsAddress.address_id
}
//no shipping and on the shipping tab, reset
else if (elements.tab_shipping.tabIndex == 2) {
	forms.CRM2_0F_orders_1F_addresses.REC_on_select()
}
}

/**
 *
 * @properties={typeid:24,uuid:"f9487842-eab2-459f-9fd9-542bf72d2e23"}
 */
function FORM_on_show(firstShow, event)
{
	if (scopes.NT) {
		scopes.NT.sidebarSet(event)
	}
}

/**
 *
 * @properties={typeid:24,uuid:"244c6899-c80b-41d8-a664-5c93a5912e1a"}
 */
function GOTO_company()
{

/*
 *	TITLE    :	GOTO_company
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	navigate to the parent company
 *			  	NOTE: will not select correct record if more than 200 companies
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GOTO_company()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TRIGGER_navigation_set(12,true,crm_orders_to_companies) 



}

/**
 *
 * @properties={typeid:24,uuid:"3cbd45d1-c67b-45f6-8a8e-8290414ebb34"}
 */
function GOTO_contact()
{

/*
 *	TITLE    :	GOTO_contact
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	navigate to the selected contact
 *			  	NOTE: will not select correct record if more than 200 companies
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	GOTO_contact()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TRIGGER_navigation_set(13,true,crm_order_company_to_contacts)

forms.CRM2_0F_contacts.foundset.selectRecord(contact_id)
}

/**
 *
 * @properties={typeid:24,uuid:"12193b85-ab4c-487d-b7ac-98b0007dcc8e"}
 */
function REC_delete()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	prompts to delete the currently selected record
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_delete()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

var delRec = globals.DIALOGS.showWarningDialog(
				'Delete record',
				'Do you really want to delete this order?',
				'Yes',
				'No'
			)

if (delRec == 'Yes') {
	controller.deleteRecord()
	globals.TRIGGER_ul_refresh_all()
}



}

/**
 *
 * @properties={typeid:24,uuid:"87d216fd-e127-4aef-a461-17786f5fdb93"}
 */
function REC_new()
{

/*
 *	TITLE    :	REC_new
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	creates a new order record if there is an address and contact
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_new()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//make sure the company has at least ONE address & ONE contact
var addrCnt = crm_orders_company_to_addresses.getSize()
var contCnt = crm_order_company_to_contacts.getSize()

//there is an address and a contact
if (addrCnt && contCnt) {
	//new record
	controller.newRecord(true)
	
	//do the auto-enter stuff
	//set the next order number
	if (foundset.getSize() == 0) {
		//never been an order number
		order_number = 1000
	}
	else {
		//sql query to get the highest invoice number = then add 1
		var query = 'select order_number from orders order by order_number desc'
		var dataset = databaseManager.getDataSetByQuery(controller.getServerName(), query, null, 1)
		order_number = dataset.getValue(1, 1) + 1
	}
	order_date = new Date()
	is_active = 1
	
	//refresh UL
	globals.TRIGGER_ul_refresh_all()
	
	//enter first field
	elements.fld_order_number.requestFocus(false)
}
else if (addrCnt == 0) {
	//show error
	globals.DIALOGS.showErrorDialog(
					'Missing address',
					'There needs to be at least one address defined for this customer before you can create an order.',
					'OK')
}
else if (contCnt == 0) {
	//show error
	globals.DIALOGS.showErrorDialog(
					'Missing contact',
					'There needs to be at least one contact defined for this customer before you can create an order.',
					'OK')
}
}

/**
 *
 * @properties={typeid:24,uuid:"67d92206-c10a-4caf-b450-6f126e939734"}
 */
function REC_on_select(event)
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	show correct address
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_on_select()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

switch (elements.tab_shipping.tabIndex) {
	case 1:
		var relnName = 'crm_orders_billaddr_to_addresses'
		break 
	case 2:
		var relnName = 'crm_orders_shipaddr_to_addresses'
		break 
}

if (utils.hasRecords(eval(relnName))) {
	forms.CRM2_0F_orders_1F_addresses.REC_on_select()
}
else {
	globals.CRM_address_display = null
}

if (scopes.NT) {
	scopes.NT.sidebarSet(event)
}
}

/**
 *
 * @properties={typeid:24,uuid:"07700de0-3204-4cdf-bfcd-286fd6ba5f83"}
 */
function STATUS_adjust()
{

/*
 *	TITLE    :	STATUS_adjust
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	change status of selected order
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	STATUS_adjust()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

if (utils.hasRecords(foundset)) {
	var newStatus = globals.DIALOGS.showSelectDialog(
						'Change order status',
						'Please set the correct status',
						['Open',
						'Closed']
					)
	
	if (newStatus == 'Open') {
		is_active = 1
	}
	else if (newStatus == 'Closed') {
		is_active = 0
	}
}
}

/**
 *
 * @properties={typeid:24,uuid:"392a4236-8df1-4582-9514-8aacd74264c7"}
 */
function TAB_change_shipping()
{

/*
 *	TITLE    :	TAB_change_shipping
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	custom tab contrller for the shipping tab
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	TAB_change_shipping()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

globals.TAB_change_grid(null,null,'tab_shipping','tab_s')
}

/**
 *
 * @properties={typeid:24,uuid:"d5a0f1b5-4911-4e5e-8b61-223f171e1b07"}
 */
function TAB_rec_new()
{

/*
 *	TITLE    :	TAB_rec_new
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	pulls REC_new() from the currently selected tab
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	MODIFIED :	Dec 6, 2007 -- Troy Elliott, Data Mosaic
 *			  	
 */

var formName = elements.tab_detail.getTabFormNameAt(elements.tab_detail.tabIndex)

if (forms[formName] && forms[formName].REC_new) {
	forms[formName].REC_new()
}
}
