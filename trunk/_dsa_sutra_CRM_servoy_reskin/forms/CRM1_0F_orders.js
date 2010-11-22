/**
 *
 * @properties={typeid:24,uuid:"b8ffb1aa-3b8a-4443-8cde-4be98ae78cd6"}
 */
function DEL_order_item()
{

/*
 *	TITLE    :	REC_delete
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	prompts to delete the currently selected sub-record
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

var delRec = plugins.dialogs.showWarningDialog(
				'Delete record',
				'Do you really want to delete the selected order item?',
				'Yes',
				'No')

if (delRec == 'Yes') {
	crm_orders_to_order_items.deleteRecord()
}


}

/**
 *
 * @properties={typeid:24,uuid:"c4af2a08-f34c-4814-ae72-c6789a57f8e9"}
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
	forms.CRM1_0F_orders_1F_addresses.REC_on_select()
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
	forms.CRM1_0F_orders_1F_addresses.REC_on_select()
}
}

/**
 *
 * @properties={typeid:24,uuid:"31791ab9-510b-4316-8f39-fdceae582852"}
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

globals.CALLBACK_navigation_set(8,true,crm_orders_to_companies)



}

/**
 *
 * @properties={typeid:24,uuid:"a6ac3f5c-ea57-410a-9484-dec9780d92b1"}
 */
function GOTO_contact()
{

/*
 *	TITLE    :	GOTO_contact
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	navigate to the selected contact
 *			  	NOTE: will not select correct record if more than 200 contacts
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

globals.CALLBACK_navigation_set(9,true,crm_order_company_to_contacts)

forms.CRM1_0F_contacts.foundset.selectRecord(contact_id)

}

/**
 *
 * @properties={typeid:24,uuid:"0bbdbadf-923d-4836-be7f-76dd67f842f1"}
 */
function NEW_order_item()
{

/*
 *	TITLE    :	NEW_order_item
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	creates a new order item record and opens a FiD to edit it
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	NEW_order_item()
 *			  	
 *	MODIFIED :	July 31, 2008 -- Troy Elliott, Data Mosaic
 *			  	
 */

//create a new record
crm_orders_to_order_items.newRecord(false, true)

//edit newly created record
forms.CRM1_0F_orders_1L_order_items.EDIT_order_item()
}

/**
 *
 * @properties={typeid:24,uuid:"ceddf3fd-241d-4c54-b5b1-145bdf0dd6a4"}
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

var delRec = plugins.dialogs.showWarningDialog(
				'Delete record',
				'Do you really want to delete this order?',
				'Yes',
				'No'
			)

if (delRec == 'Yes') {
	controller.deleteRecord()
	globals.CALLBACK_ul_refresh_all()
}



}

/**
 *
 * @properties={typeid:24,uuid:"e5225e6c-bec1-447e-8422-f1bda95583e3"}
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
	globals.CALLBACK_ul_refresh_all()
	
	//enter first field
	elements.fld_order_number.requestFocus(false)
}
else if (addrCnt == 0) {
	//show error
	plugins.dialogs.showErrorDialog(
					'Missing address',
					'There needs to be at least one address defined for this customer before you can create an order.',
					'OK')
}
else if (contCnt == 0) {
	//show error
	plugins.dialogs.showErrorDialog(
					'Missing contact',
					'There needs to be at least one contact defined for this customer before you can create an order.',
					'OK')
}
}

/**
 *
 * @properties={typeid:24,uuid:"7e268a70-66c9-4a9f-a333-dc2eefbdcabd"}
 */
function REC_on_select()
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

switch (elements.tab_address.tabIndex) {
	case 1:
		var relnName = 'crm_orders_billaddr_to_addresses'
		break 
	case 2:
		var relnName = 'crm_orders_shipaddr_to_addresses'
		break 
}

if (utils.hasRecords(eval(relnName))) {
	forms.CRM1_0F_orders_1F_addresses.REC_on_select()
}
else {
	globals.CRM_address_display = null
}
}

/**
 *
 * @properties={typeid:24,uuid:"e1242148-f7e4-4e34-bb0f-d58130ccb671"}
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
	var newStatus = plugins.dialogs.showSelectDialog(
						'Change order status',
						'Please set the correct status',
						'Open',
						'Closed'
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
 * @properties={typeid:24,uuid:"dda70e92-1ff6-4cd5-b9cd-dbca2775c17c"}
 */
function TAB_change()
{

/*
 *	TITLE:		TAB_change
 *
 *	MODULE:		start_CRM_mosaic
 *
 *	ABOUT:		'Drawn' tabs tab panel method
 *
 *	MODIFIED:	Aug 29, 2007 - Troy Elliott, Data Mosaic
 *
 */


//set formname
var formName = application.getMethodTriggerFormName()

//set the tab panel name
var tabPanelName = 'tab_address'

//get button that called
var btn_name = application.getMethodTriggerElementName()

//set prefix for element
var prefix = 'tab_a'

//get number of tabs
var tab_num = forms[formName].elements[tabPanelName].getMaxTabIndex()

//layer control
forms[formName].elements.border.visible = false

//activate correct tab and flip tab buttons
for ( var i = 1 ; i <= tab_num ; i++ )
{	
	var tab_name = prefix + i;
	var tab_index = 'label_' + i;
	
	if (btn_name == tab_name)
	{
		forms[formName].elements[tab_index].bgcolor = '#D2D7E1'
		forms[formName].elements[tab_index].fgcolor = '#D2D7E1'
		forms[formName].elements[tab_name].setFont('Verdana,1,10')
		forms[formName].elements[tab_name].fgcolor = '#323A4B'
				
		//set tab index
		forms[formName].elements[tabPanelName].tabIndex = i
		
		//update display global
		forms[forms[formName].elements[tabPanelName].getTabFormNameAt(i)].REC_on_select()
	}
	else
	{
		forms[formName].elements[tab_index].bgcolor = '#323A4B'
		forms[formName].elements[tab_index].fgcolor = '#323A4B'
		forms[formName].elements[tab_name].setFont('Verdana,1,10')
		forms[formName].elements[tab_name].fgcolor = '#ffffff'
	}				
}

//z-axis control
forms[formName].elements.border.visible = true
}
