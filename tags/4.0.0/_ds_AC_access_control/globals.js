/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"0C31EF45-CF3A-494A-BD95-64CBF32B23F1",variableType:4}
 */
var AC_preference_type = 1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"716299f9-521c-4a7f-b7b3-4e4b40e54f10",variableType:4}
 */
var AC_configuration = 12;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"ad7cb092-61d4-45ae-9f21-95469d08c88b"}
 */
var AC_filter_action_id = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"b8ca920b-dede-438c-96af-e50e9ff8c92c"}
 */
var AC_filter_action_name = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"0d9798dd-c0e5-4b41-8384-5d4148c21d28"}
 */
var AC_filter_description = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"774d0d2d-381a-4efd-b4e3-46af5d7f1759",variableType:4}
 */
var AC_filter_type = 2;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"e944a331-f7ef-4dd6-9cd6-053a0a92f0c5",variableType:4}
 */
var AC_filters_toggle;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3f5e36c6-d9e9-4fd3-a980-f37c6c17bc97"}
 */
var AC_group_password = 'Security Groups';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"b6c87bca-7327-47da-a1e8-e700d5a4e4bd",variableType:4}
 */
var AC_group_selected;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"cadfb40f-048d-43e0-ba0e-3adfe692535f"}
 */
var AC_html_blog = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"d18fb864-3cff-4bd6-bcb9-bd0dba742865"}
 */
var AC_html_misc = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"2afb0dfe-c864-4347-b2ef-fb5f84f87566"}
 */
var AC_html_qotd = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"860dfd6e-2bd0-4180-80ed-52249aa5ede2",variableType:4}
 */
var AC_login_id = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"f8ca97f8-e48f-47f3-a82f-5b16ebaaf4b7"}
 */
var AC_login_password = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"cf17d095-8d0a-4ba3-a0c6-21e92e451875"}
 */
var AC_login_user = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"d0842c14-93ef-472a-a1c3-4a503e2203d7"}
 */
var AC_login_uuid = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"EF11D57D-7B66-46CE-BCC5-CD22B69F892D",variableType:4}
 */
var AC_organization_selected = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"f8104528-20b5-4ba0-aadd-dcb2d81c4371",variableType:4}
 */
var AC_P_flag = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"fed299e6-6b97-40c5-a0a9-9a36548cd7a5",variableType:4}
 */
var AC_P_group = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"818a7e8b-733e-4402-9194-ed16118660c6"}
 */
var AC_password_edit_1 = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"b5f44e2e-b717-4948-a77c-d6000ad67c91"}
 */
var AC_password_edit_2 = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"60B5CD9C-B8DD-4A39-ACF0-5CB8FC3363CB",variableType:4}
 */
var AC_staff_selected = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"9ee4fdf2-12bc-4f30-ba2b-cbd3b5347df8",variableType:4}
 */
var AC_toolbar_type;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"4a23b939-b243-4ae8-bc23-445fc5687061",variableType:4}
 */
var AC_user_selected;

/**
 *
 * @properties={typeid:24,uuid:"aadb2e6d-3508-405d-ad58-3133199c2732"}
 */
function AC_password_set()
{

/*
 *	TITLE    :	globals.AC_password_set
 *			  	
 *	MODULE   :	ds_AC_access_control
 *			  	
 *	ABOUT    :	reset password rules
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

var formName = 'AC_0F_rules'

if (forms[formName].foundset.getSize()) {
	if (! application.__parent__.solutionPrefs) {
		solutionPrefs = new Object()
	}
	
	var access = new Object()
	var password = access.password = new Object()
	
	password.daysExpire = forms[formName].expire_days
	password.expire = forms[formName].expire_flag
	password.length = forms[formName].length_flag
	password.lengthMin = forms[formName].length_min
	password.lengthMax = forms[formName].length_max
	password.alphaNum = forms[formName].alphnum_flag
	password.nonAlphaNum = forms[formName].non_alphanum_flag
	password.alphaCase = forms[formName].alpha_case_flag
	password.notUserName = forms[formName].not_user_name
	password.prevMatchCount = forms[formName].prev_match_count
	password.prevMatch = forms[formName].prev_match_flag
	
	if (! solutionPrefs.access) {
		solutionPrefs.access = access
	}
	else {
		solutionPrefs.access.password = password
	}
}

/*
	password.minutesIdle = forms[formName].idle_time
	password.idle = forms[formName].idle_flag
*/
}

/**
 * Create sample data records for CRM
 * 
 * @param {JSRecord} [org] The organization under which all records are created
 * 
 * @properties={typeid:24,uuid:"2D27600D-720B-4095-9CF1-8882A69B66EB"}
 */
function AC_sample_data(org) {
	//a specific organization requested
	if (org && org.id_organization != globals.AC_current_organization) {
		var diffOrg = true
		var oldOrg = globals.AC_current_organization
		globals.AC_current_organization = org.id_organization
	}
	
	//many rows
	var fsSample = databaseManager.getFoundSet('sutra_example','sutra_example')
	fsSample.loadAllRecords()
	
	//only create lots of records for first sign up
	if (databaseManager.getFoundSetCount(fsSample) < 9000) {
		for (var i = 1; i < 10000; i++) {
			fsSample.newRecord(false,false)
			
			//save data periodically to avoid lockup at the end
			if (i % 100 == 0) {
				databaseManager.saveData()
			}
		}
	}
	
	//products
	/** @type {JSFoundSet<db:/sutra_example/products>} */
	var fsProduct = databaseManager.getFoundSet('sutra_example','products')
	
	var newProduct1 = fsProduct.getRecord(fsProduct.newRecord(false,true))
	newProduct1.cost_each = 4.95
	newProduct1.description = '"Enter the Dragon" by Tielle St. Clare, Madison Hayes, Mlyn Hurn'
	newProduct1.image_mime_type = 'image/jpeg'
	newProduct1.image_name = 'book_enter_dragon.jpg'
//	newProduct1.image_thumbnail = 
	newProduct1.image_type = 'jpg'
	newProduct1.is_active = 1
	newProduct1.order_description = 'Book - "Enter the Dragon"'
	newProduct1.price_each = 19.95
	newProduct1.product_category = 2
//	newProduct1.product_image = 
	newProduct1.product_number = 2001
	newProduct1.product_name = 'Enter the Dragon'
	newProduct1.product_types = 3
	newProduct1.total_sold = 59.85
		
	var newProduct2 = fsProduct.getRecord(fsProduct.newRecord(false,true))
	newProduct2.cost_each = 6.65
	newProduct2.description = '"Dynamic Living:How to Take Charge of Your Health" - by Aileen Ludington, Hans Diehl'
	newProduct2.image_mime_type = 'image/jpeg'
	newProduct2.image_name = 'book_dynamic_living.jpg'
//	newProduct2.image_thumbnail = 
	newProduct2.image_type = 'jpg'
	newProduct2.is_active = 1
	newProduct2.order_description = 'Book - "Dynamic Living"'
	newProduct2.price_each = 21.95
	newProduct2.product_category = 2
//	newProduct2.product_image = 
	newProduct2.product_number = 2002
	newProduct2.product_name = 'Dynamic Living'
	newProduct2.product_types = 3
	newProduct2.total_sold = 395.1
		
	var newProduct3 = fsProduct.getRecord(fsProduct.newRecord(false,true))
	newProduct3.cost_each = 24.95
	newProduct3.description = '"Java in a Nutshell" - by by David Flanagan'
	newProduct3.image_mime_type = 'image/jpeg'
	newProduct3.image_name = 'book_java.jpg'
//	newProduct3.image_thumbnail = 
	newProduct3.image_type = 'jpg'
	newProduct3.is_active = 1
	newProduct3.order_description = 'Book - "Java in a Nutshell"'
	newProduct3.price_each = 44.95
	newProduct3.product_category = 2
//	newProduct3.product_image = 
	newProduct3.product_number = 2003
	newProduct3.product_name = 'Java In A Nutshell'
	newProduct3.product_types = 3
	newProduct3.total_sold = 399.75
		
	var newProduct4 = fsProduct.getRecord(fsProduct.newRecord(false,true))
	newProduct4.cost_each = 12.88
	newProduct4.description = 'SuperWidgets is a collection of add-in software for SuperForms Pro. This collection is specially designed for vertical markets.'
	newProduct4.is_active = 0
	newProduct4.order_description = 'Software: "SuperWidgets Add-In"'
	newProduct4.price_each = 195
	newProduct4.product_category = 3
	newProduct4.product_number = 2004
	newProduct4.product_name = 'SuperWidgets Add-In'
	newProduct4.product_types = 3
		
	var newProduct5 = fsProduct.getRecord(fsProduct.newRecord(false,true))
	newProduct5.cost_each = 48.55
	newProduct5.description = 'SuperWidgets Pro is an amazing software program that will automatically create every form you need in your business - telpathically - no programming needed.'
	newProduct5.is_active = 1
	newProduct5.order_description = 'Software - "SuperForms Pro"'
	newProduct5.price_each = 495
	newProduct5.product_category = 3
	newProduct5.product_number = 2005
	newProduct5.product_name = 'SuperForms Pro'
	newProduct5.product_types = 3
	newProduct5.total_sold = 9405
		
	var newProduct6 = fsProduct.getRecord(fsProduct.newRecord(false,true))
	newProduct6.cost_each = 2
	newProduct6.description = 'SuperWidgets Pro is an amazing software program that will allow you to create forms you can use in your business.'
	newProduct6.is_active = 1
	newProduct6.order_description = 'Software - "SuperForms Lite"'
	newProduct6.price_each = 49.95
	newProduct6.product_category = 3
	newProduct6.product_number = 2006
	newProduct6.product_name = 'SuperForms Lite'
	newProduct6.product_types = 3
	newProduct6.total_sold = 249.75
	
	//companies
	/** @type {JSFoundSet<db:/sutra_example/companies>} */
	var fsCompany = databaseManager.getFoundSet('sutra_example','companies')
	
	
	var newCompany = fsCompany.getRecord(fsCompany.newRecord(false,true))
	newCompany.company_category = 'Retail'
	newCompany.company_description = 'Rentfield is a company that rents equipment online.'
	newCompany.company_email = 'sales@rentfield.com'
	newCompany.company_industry = 'Rental Equipment'
	newCompany.company_name = 'Rentfield Enterprises'
//	newCompany.company_notes = 
	newCompany.company_type_id = 1
	newCompany.company_url = 'http://www.rentfield.com'
	newCompany.is_active = 1
		
		//addressess
		var newAddress1 = newCompany.crm_companies_to_addresses.getRecord(newCompany.crm_companies_to_addresses.newRecord(false,true))
		newAddress1.address_type_id = 3
		newAddress1.city = 'Somewhere'
		newAddress1.country = 'US'
//		newAddress1.county = 
//		newAddress1.email = 
//		newAddress1.fax = 
//		newAddress1.is_active = 
		newAddress1.line_1 = '516 Andover Street'
		newAddress1.line_2 = 'Suite 265'
//		newAddress1.line_3 = 
//		newAddress1.line_4 = 
//		newAddress1.line_5 = 
//		newAddress1.phone = 
//		newAddress1.phone_format = 
		newAddress1.select_address = '516 Andover Street - Somewhere, ME 10056'
		newAddress1.state = 'ME'
		newAddress1.zipcode = '10056'
			
		//contacts
		var newContact1 = newCompany.crm_companies_to_contacts.getRecord(newCompany.crm_companies_to_contacts.newRecord(false,true))
		newContact1.contact_notes = 'Notes on Darryl'
		newContact1.contact_type_id = 9
		newContact1.email = 'darryl.aestover@rentfield.com'
		newContact1.fax_direct = '214-598-8548'
		newContact1.is_active = 1
		newContact1.job_title = 'CEO'
		newContact1.mail_address_id = newAddress1.address_id
		newContact1.mail_use_company = 0
//		newContact1.mail_use_country = 
		newContact1.name_first = 'Darryl'
		newContact1.name_last = 'Notes on Darryl'
		newContact1.name_prefix = 'Mr.'
//		newContact1.name_suffix = 
//		newContact1.phone_cell = 
		newContact1.phone_direct = '214-555-2145'
			
		var newContact2 = newCompany.crm_companies_to_contacts.getRecord(newCompany.crm_companies_to_contacts.newRecord(false,true))
//		newContact2.contact_notes = 
		newContact2.contact_type_id = 6
		newContact2.email = 'todd.smith@rentfield.com'
		newContact2.fax_direct = '214-598-8548'
		newContact2.is_active = 1
		newContact2.job_title = 'Sales Representative'
		newContact2.mail_address_id = newAddress1.address_id
		newContact2.mail_use_company = 1
//		newContact2.mail_use_country = 
		newContact2.name_first = 'Todd'
		newContact2.name_last = 'Smith'
//		newContact2.name_prefix = 
//		newContact2.name_suffix = 
		newContact2.phone_cell = '214-598-9699'
		newContact2.phone_direct = '214-555-9658'
			
		var newContact3 = newCompany.crm_companies_to_contacts.getRecord(newCompany.crm_companies_to_contacts.newRecord(false,true))
//		newContact3.contact_notes = 
		newContact3.contact_type_id = 12
		newContact3.email = 's.rotterdam@rentfield.com'
//		newContact3.fax_direct = 
		newContact3.is_active = 1
		newContact3.job_title = 'Coordinator'
		newContact3.mail_address_id = newAddress1.address_id
		newContact3.mail_use_company = 1
//		newContact3.mail_use_country = 
		newContact3.name_first = 'Sheila'
		newContact3.name_last = 'Rotterdam'
		newContact3.name_prefix = 'Ms.'
//		newContact3.name_suffix = 
		newContact3.phone_cell = '215-969-9658'
		newContact3.phone_direct = '215-555-5554'
	
		//orders
		var newOrder = newCompany.crm_companies_to_orders.getRecord(newCompany.crm_companies_to_orders.newRecord(false,true))
		newOrder.amt_discount = 0
		newOrder.amt_shipping = 3.95
		newOrder.amt_tax = 0
		newOrder.bill_address_id = newAddress1.address_id
		newOrder.contact_id = newContact3.contact_id
		newOrder.is_active = 1
//		newOrder.is_paid = 
//		newOrder.notes = 
		newOrder.order_date = new Date()
		newOrder.order_month_year = 2106
		newOrder.order_number = 1002
		newOrder.order_subtotal = 21.95
		newOrder.order_total = 25.95
//		newOrder.paid_date = 
//		newOrder.paid_number = 
//		newOrder.pct_discount = 
//		newOrder.pct_tax = 
//		newOrder.po_number = 
		newOrder.ship_address_id = newAddress1.address_id
//		newOrder.ship_fob = 
		newOrder.ship_via = 'Ground'
		newOrder.terms = 'Due Upon Receipt'
			
			//order items
			var newOrderItem = newOrder.crm_orders_to_order_items.getRecord(newOrder.crm_orders_to_order_items.newRecord(false,true))
			newOrderItem.cost_each = 6.65
			newOrderItem.description = 'Book - "Dynamic Living"'
			newOrderItem.extended_price = 21.95
			newOrderItem.price_each = 21.95
			newOrderItem.product_id = newProduct2.product_id
			newOrderItem.quantity = 1
				
			
		var newOrder = newCompany.crm_companies_to_orders.getRecord(newCompany.crm_companies_to_orders.newRecord(false,true))
		newOrder.amt_discount = 0
		newOrder.amt_shipping = 3.95
		newOrder.amt_tax = 0
		newOrder.bill_address_id = newAddress1.address_id
		newOrder.contact_id = newContact2.contact_id
		newOrder.is_active = 0
//		newOrder.is_paid = 
		newOrder.notes = 'All items are delivered electronically only. Please download the products from our website: http://www.mysoftwarecompany.com/downloads. If you have problems downloading the software, contact Technical Support at: support@mysoftwarecompany.com.'
		newOrder.order_date = new Date()
		newOrder.order_month_year = 2106
		newOrder.order_number = 1004
		newOrder.order_subtotal = 225.55
		newOrder.order_total = 229.55
//		newOrder.paid_date = 
//		newOrder.paid_number = 
//		newOrder.pct_discount = 
//		newOrder.pct_tax = 
//		newOrder.po_number = 
		newOrder.ship_address_id = newAddress1.address_id
//		newOrder.ship_fob = 
		newOrder.ship_via = 'Ground'
		newOrder.terms = 'Net 30 Days'
			
			//order items
			var newOrderItem = newOrder.crm_orders_to_order_items.getRecord(newOrder.crm_orders_to_order_items.newRecord(false,true))
			newOrderItem.cost_each = 6.65
			newOrderItem.description = 'Book - "Dynamic Living"'
			newOrderItem.extended_price = 21.95
			newOrderItem.price_each = 21.95
			newOrderItem.product_id = newProduct2.product_id
			newOrderItem.quantity = 4
				
			var newOrderItem = newOrder.crm_orders_to_order_items.getRecord(newOrder.crm_orders_to_order_items.newRecord(false,true))
			newOrderItem.cost_each = 2
			newOrderItem.description = 'Software - "SuperForms Lite"'
			newOrderItem.extended_price = 49.95
			newOrderItem.price_each = 49.95
			newOrderItem.product_id = newProduct2.product_id
			newOrderItem.quantity = 1
				
			var newOrderItem = newOrder.crm_orders_to_order_items.getRecord(newOrder.crm_orders_to_order_items.newRecord(false,true))
			newOrderItem.cost_each = 6.65
			newOrderItem.description = 'Book - "Dynamic Living"'
			newOrderItem.extended_price = 21.95
			newOrderItem.price_each = 21.95
			newOrderItem.product_id = newProduct2.product_id
			newOrderItem.quantity = 4
			
			
		var newCompany = fsCompany.getRecord(fsCompany.newRecord(false,true))
		newCompany.company_category = 'http://forum.servoy.com/'
		newCompany.company_description = 'Awesome company - they created the software you\'re using right now!'
		newCompany.company_email = 'sales@servoy.com'
		newCompany.company_industry = 'Software'
		newCompany.company_name = 'Servoy'
		newCompany.company_notes = 'Check out http://developer.servoy.com for even more tips and tricks.'
//		newCompany.company_type_id = 
		newCompany.company_url = 'http://forum.servoy.com/'
//		newCompany.is_active = ''
			
			//addressess
			//2
			var newAddress1 = newCompany.crm_companies_to_addresses.getRecord(newCompany.crm_companies_to_addresses.newRecord(false,true))
			newAddress1.address_type_id = 3
			newAddress1.city = 'Thousand Oaks'
			newAddress1.country = 'US'
//			newAddress1.county = 
//			newAddress1.email = 
//			newAddress1.fax = 
//			newAddress1.is_active = 
			newAddress1.line_1 = '299 W. Hillcrest Drive'
			newAddress1.line_2 = 'Suite 115'
//			newAddress1.line_3 = 
//			newAddress1.line_4 = 
//			newAddress1.line_5 = 
			newAddress1.phone = '805 529-6299'
//			newAddress1.phone_format = 
			newAddress1.select_address = '299 W. Hillcrest Drive - Thousand Oaks, CA 91360'
			newAddress1.state = 'CA'
			newAddress1.zipcode = '91360'
			//3
			var newAddress2 = newCompany.crm_companies_to_addresses.getRecord(newCompany.crm_companies_to_addresses.newRecord(false,true))
			newAddress2.address_type_id = 1
			newAddress2.city = 'Amersfoort'
			newAddress2.country = 'NL'
//			newAddress2.county = 
//			newAddress2.email = 
//			newAddress2.fax = 
//			newAddress2.is_active = 
			newAddress2.line_1 = 'Algolweg 9A'
//			newAddress2.line_2 = 
//			newAddress2.line_3 = 
//			newAddress2.line_4 = 
//			newAddress2.line_5 = 
			newAddress2.phone = '+31 33 455 9877'
//			newAddress2.phone_format = 
			newAddress2.select_address = 'Algolweg 9A - Amersfoort, BG 3821'
			newAddress2.state = 'BG'
			newAddress2.zipcode = '3821'
			//25
			var newAddress3 = newCompany.crm_companies_to_addresses.getRecord(newCompany.crm_companies_to_addresses.newRecord(false,true))
			newAddress3.address_type_id = 4
			newAddress3.city = 'Thousand Oaks'
			newAddress3.country = 'US'
//			newAddress3.county = 
//			newAddress3.email = 
//			newAddress3.fax = 
//			newAddress3.is_active = 
			newAddress3.line_1 = '299 W. Hilcrest Drive'
			newAddress3.line_2 = 'Suite 115'
//			newAddress3.line_3 = 
//			newAddress3.line_4 = 
//			newAddress3.line_5 = 
//			newAddress3.phone = 
//			newAddress3.phone_format = 
			newAddress3.select_address = '299 W. Hillcrest Drive - Thousand Oaks, CA 91360'
			newAddress3.state = 'CA'
			newAddress3.zipcode = '91360'
				
			//contacts
			//38
			var newContact1 = newCompany.crm_companies_to_contacts.getRecord(newCompany.crm_companies_to_contacts.newRecord(false,true))
//			newContact1.contact_notes = 
			newContact1.contact_type_id = 5
			newContact1.email = 'bcusick@servoy.com'
//			newContact1.fax_direct = 
//			newContact1.is_active = 
			newContact1.job_title = 'USA Director'
			newContact1.mail_address_id = newAddress1.address_id
//			newContact1.mail_use_company = 
//			newContact1.mail_use_country = 
			newContact1.name_first = 'Bob'
			newContact1.name_last = 'Cusick'
//			newContact1.name_prefix = 
//			newContact1.name_suffix = 
//			newContact1.phone_cell = 
			newContact1.phone_direct = '805 624-4959'
			//39
			var newContact2 = newCompany.crm_companies_to_contacts.getRecord(newCompany.crm_companies_to_contacts.newRecord(false,true))
//			newContact2.contact_notes = 
			newContact2.contact_type_id = 6
			newContact2.email = 'yboom@servoy.com'
//			newContact2.fax_direct = 
//			newContact2.is_active = 
			newContact2.job_title = 'USA Busines Development'
			newContact2.mail_address_id = newAddress1.address_id
			newContact2.mail_use_company = 1
//			newContact2.mail_use_country = 
			newContact2.name_first = 'Yvo'
			newContact2.name_last = 'Boom'
//			newContact2.name_prefix = 
//			newContact2.name_suffix = 
			newContact2.phone_cell = '805 990-1865'
			newContact2.phone_direct = '805 624-4959'
			//45
			var newContact3 = newCompany.crm_companies_to_contacts.getRecord(newCompany.crm_companies_to_contacts.newRecord(false,true))
//			newContact3.contact_notes = 
			newContact3.contact_type_id = 6
			newContact3.email = 'arooswinkel@servoy.com'
//			newContact3.fax_direct = 
			newContact3.is_active = 1
			newContact3.job_title = 'EMEA Business Development'
			newContact3.mail_address_id = newAddress2.address_id
//			newContact3.mail_use_company = 
//			newContact3.mail_use_country = 
			newContact3.name_first = 'Andy'
			newContact3.name_last = 'Rooswinkel'
			newContact3.name_prefix = 'Mr.'
//			newContact3.name_suffix = 
//			newContact3.phone_cell = 
			newContact3.phone_direct = '+31 33 455 9877'
			//46
			var newContact4 = newCompany.crm_companies_to_contacts.getRecord(newCompany.crm_companies_to_contacts.newRecord(false,true))
//			newContact4.contact_notes = 
			newContact4.contact_type_id = 9
			newContact4.email = 'jaleman@servoy.com'
//			newContact4.fax_direct = 
			newContact4.is_active = 1
			newContact4.job_title = 'CEO'
			newContact4.mail_address_id = newAddress1.address_id
//			newContact4.mail_use_company = 
//			newContact4.mail_use_country = 
			newContact4.name_first = 'Jan'
			newContact4.name_last = 'Aleman'
//			newContact4.name_prefix = 
//			newContact4.name_suffix = 
//			newContact4.phone_cell = 
			newContact4.phone_direct = '+31 33 455 9877'
		
			//orders
			var newOrder = newCompany.crm_companies_to_orders.getRecord(newCompany.crm_companies_to_orders.newRecord(false,true))
//			newOrder.amt_discount = 
//			newOrder.amt_shipping = 
//			newOrder.amt_tax = 
			newOrder.bill_address_id = newAddress1.address_id
			newOrder.contact_id = newContact1.contact_id
//			newOrder.is_active = 
//			newOrder.is_paid = 
//			newOrder.notes = 
			newOrder.order_date = new Date()
//			newOrder.order_month_year = 
			newOrder.order_number = '1007'
			newOrder.order_subtotal = 86.85
			newOrder.order_total = 86.85
//			newOrder.paid_date = 
//			newOrder.paid_number = 
//			newOrder.pct_discount = 
//			newOrder.pct_tax = 
//			newOrder.po_number = 
			newOrder.ship_address_id = newAddress1.address_id
//			newOrder.ship_fob = 
			newOrder.ship_via = 'Ground'
//			newOrder.terms = ''
		
				//order items
				var newOrderItem = newOrder.crm_orders_to_order_items.getRecord(newOrder.crm_orders_to_order_items.newRecord(false,true))
				newOrderItem.cost_each = 24.95
				newOrderItem.description = 'Book - "Java in a Nutshell"'
				newOrderItem.extended_price = 44.95
				newOrderItem.price_each = 44.95
				newOrderItem.product_id = newProduct3.product_id
				newOrderItem.quantity = 1
					
				var newOrderItem = newOrder.crm_orders_to_order_items.getRecord(newOrder.crm_orders_to_order_items.newRecord(false,true))
				newOrderItem.cost_each = 6.65
				newOrderItem.description = 'Book - "Dynamic Living"'
				newOrderItem.extended_price = 21.95
				newOrderItem.price_each = 21.95
				newOrderItem.product_id = newProduct2.product_id
				newOrderItem.quantity = 1
					
				var newOrderItem = newOrder.crm_orders_to_order_items.getRecord(newOrder.crm_orders_to_order_items.newRecord(false,true))
				newOrderItem.cost_each = 4.95
				newOrderItem.description = 'Book - "Enter the Dragon"'
				newOrderItem.extended_price = 19.95
				newOrderItem.price_each = 19.95
				newOrderItem.product_id = newProduct1.product_id
				newOrderItem.quantity = 1
			
			var newOrder = newCompany.crm_companies_to_orders.getRecord(newCompany.crm_companies_to_orders.newRecord(false,true))
//			newOrder.amt_discount = 
//			newOrder.amt_shipping = 
//			newOrder.amt_tax = 
			newOrder.bill_address_id = newAddress1.address_id
			newOrder.contact_id = newContact4.contact_id
//			newOrder.is_active = 
			newOrder.is_paid = 1
//			newOrder.notes = 
			newOrder.order_date = new Date()
//			newOrder.order_month_year = 
			newOrder.order_number = '1009'
			newOrder.order_subtotal = 19.95
			newOrder.order_total = 19.95
//			newOrder.paid_date = 
//			newOrder.paid_number = 
//			newOrder.pct_discount = 
//			newOrder.pct_tax = 
//			newOrder.po_number = 
			newOrder.ship_address_id = newAddress3.address_id
//			newOrder.ship_fob = 
//			newOrder.ship_via = 
//			newOrder.terms = ''
		
				//order items
				var newOrderItem = newOrder.crm_orders_to_order_items.getRecord(newOrder.crm_orders_to_order_items.newRecord(false,true))
				newOrderItem.cost_each = 4.95
				newOrderItem.description = 'Book - "Enter the Dragon"'
				newOrderItem.extended_price = 19.95
				newOrderItem.price_each = 19.95
				newOrderItem.product_id = newProduct1.product_id
				newOrderItem.quantity = 1
					
		var newCompany = fsCompany.getRecord(fsCompany.newRecord(false,true))
		newCompany.company_category = 'Wholesale'
		newCompany.company_description = 'CRM Software - SaaS.'
		newCompany.company_email = 'sales@cibexcentral.com'
		newCompany.company_industry = 'Software'
		newCompany.company_name = 'Cibex Central Corp'
//		newCompany.company_notes = 
//		newCompany.company_type_id = 
		newCompany.company_url = 'http://www.cibexcentral.com'
//		newCompany.is_active = ''
			
			//addressess
			//4
			var newAddress1 = newCompany.crm_companies_to_addresses.getRecord(newCompany.crm_companies_to_addresses.newRecord(false,true))
			newAddress1.address_type_id = 1
			newAddress1.city = 'San Jose'
			newAddress1.country = 'US'
//			newAddress1.county = 
//			newAddress1.email = 
//			newAddress1.fax = 
//			newAddress1.is_active = 
			newAddress1.line_1 = '345 Park Avenue'
//			newAddress1.line_2 = 
//			newAddress1.line_3 = 
//			newAddress1.line_4 = 
//			newAddress1.line_5 = 
			newAddress1.phone = '408-536-6000'
//			newAddress1.phone_format = 
			newAddress1.select_address = '345 Park Avenue - San Jose, CA 95110-2704'
			newAddress1.state = 'CA'
			newAddress1.zipcode = '95110-2704'
			//5
			var newAddress2 = newCompany.crm_companies_to_addresses.getRecord(newCompany.crm_companies_to_addresses.newRecord(false,true))
			newAddress2.address_type_id = 3
			newAddress2.city = 'Boston'
			newAddress2.country = 'US'
//			newAddress2.county = 
//			newAddress2.email = 
//			newAddress2.fax = 
//			newAddress2.is_active = 
			newAddress2.line_1 = '275 Grove Street'
//			newAddress2.line_2 = 
//			newAddress2.line_3 = 
//			newAddress2.line_4 = 
//			newAddress2.line_5 = 
			newAddress2.phone = '617-219-2000'
//			newAddress2.phone_format = 
			newAddress2.select_address = '275 Grove Street - Boston, MA 02466'
			newAddress2.state = 'MA'
			newAddress2.zipcode = '02466'
			//6
			var newAddress3 = newCompany.crm_companies_to_addresses.getRecord(newCompany.crm_companies_to_addresses.newRecord(false,true))
			newAddress3.address_type_id = 4
			newAddress3.city = 'San Diego'
			newAddress3.country = 'US'
//			newAddress3.county = 
//			newAddress3.email = 
//			newAddress3.fax = 
//			newAddress3.is_active = 
			newAddress3.line_1 = '10590 W. Ocean Air Drive'
//			newAddress3.line_2 = 
//			newAddress3.line_3 = 
//			newAddress3.line_4 = 
//			newAddress3.line_5 = 
			newAddress3.phone = '800-358-9370'
//			newAddress3.phone_format = 
			newAddress3.select_address = '10590 W. Ocean Air Drive - San Diego, CA 92130'
			newAddress3.state = 'CA'
			newAddress3.zipcode = '92130'
			//7
			var newAddress4 = newCompany.crm_companies_to_addresses.getRecord(newCompany.crm_companies_to_addresses.newRecord(false,true))
			newAddress4.address_type_id = 4
			newAddress4.city = 'Amsterdam ZO'
			newAddress4.country = 'NL'
//			newAddress4.county = 
//			newAddress4.email = 
//			newAddress4.fax = 
//			newAddress4.is_active = 
			newAddress4.line_1 = 'Hoogoorddreef 54a'
			newAddress4.line_2 = 'Europlaza'
//			newAddress4.line_3 = 
//			newAddress4.line_4 = 
//			newAddress4.line_5 = 
			newAddress4.phone = '+31 20 65 11 200'
//			newAddress4.phone_format = 
			newAddress4.select_address = 'Hoogoorddreef 54a - Amsterdam ZO, BE 1101'
			newAddress4.state = 'BE'
			newAddress4.zipcode = '1101'
				
			//contacts
			//43
			var newContact = newCompany.crm_companies_to_contacts.getRecord(newCompany.crm_companies_to_contacts.newRecord(false,true))
//			newContact.contact_notes = 
			newContact.contact_type_id = 6
			newContact.email = 'sjohanson@cibexcentral.com'
			newContact.fax_direct = '405-555-9685'
//			newContact.is_active = 
//			newContact.job_title = 
			newContact.mail_address_id = newAddress4.address_id
			newContact.mail_use_company = 1
			newContact.mail_use_country = 1
			newContact.name_first = 'Sammy'
			newContact.name_last = 'Johanson'
			newContact.name_prefix = 'Mr.'
			newContact.name_suffix = 'Jr.'
//			newContact.phone_cell = 
//			newContact.phone_direct = ''
			//44
			var newContact2 = newCompany.crm_companies_to_contacts.getRecord(newCompany.crm_companies_to_contacts.newRecord(false,true))
//			newContact2.contact_notes = 
			newContact2.contact_type_id = 9
			newContact2.email = 'rbranson@cibexcentral.com'
//			newContact2.fax_direct = 
//			newContact2.is_active = 
			newContact2.job_title = 'CIO'
			newContact2.mail_address_id = newAddress1.address_id
//			newContact2.mail_use_company = 
//			newContact2.mail_use_country = 
			newContact2.name_first = 'Richard'
			newContact2.name_last = 'Branson'
//			newContact2.name_prefix = 
//			newContact2.name_suffix = 
//			newContact2.phone_cell = 
			newContact2.phone_direct = '415-555-8755'
		
			//orders
			var newOrder = newCompany.crm_companies_to_orders.getRecord(newCompany.crm_companies_to_orders.newRecord(false,true))
//			newOrder.amt_discount = 
//			newOrder.amt_shipping = 
//			newOrder.amt_tax = 
			newOrder.bill_address_id = newAddress2.address_id
			newOrder.contact_id = newContact2.contact_id
			newOrder.is_active = 1
//			newOrder.is_paid = 
//			newOrder.notes = 
			newOrder.order_date = new Date()
			newOrder.order_month_year = 
			newOrder.order_number = '1006'
			newOrder.order_subtotal = 779.7
			newOrder.order_total = 779.7
//			newOrder.paid_date = 
//			newOrder.paid_number = 
//			newOrder.pct_discount = 
//			newOrder.pct_tax = 
//			newOrder.po_number = 
//			newOrder.ship_address_id = newAddress4.address_id
//			newOrder.ship_fob = 
			newOrder.ship_via = 'Ground'
//			newOrder.terms = ''
		
				//order items
				var newOrderItem = newOrder.crm_orders_to_order_items.getRecord(newOrder.crm_orders_to_order_items.newRecord(false,true))
				newOrderItem.cost_each = 12.88
				newOrderItem.description = 'Software: "SuperWidgets Add-In"'
				newOrderItem.extended_price = 585
				newOrderItem.price_each = 195
				newOrderItem.product_id = newProduct4.product_id
				newOrderItem.quantity = 3
				
				var newOrderItem = newOrder.crm_orders_to_order_items.getRecord(newOrder.crm_orders_to_order_items.newRecord(false,true))
				newOrderItem.cost_each = 19.95
				newOrderItem.description = 'Book - "Enter the Dragon"'
				newOrderItem.extended_price = 59.85
				newOrderItem.price_each = 19.95
				newOrderItem.product_id = newProduct1.product_id
				newOrderItem.quantity = 3
				
				var newOrderItem = newOrder.crm_orders_to_order_items.getRecord(newOrder.crm_orders_to_order_items.newRecord(false,true))
				newOrderItem.cost_each = 24.95
				newOrderItem.description = 'Book - "Java in a Nutshell"'
				newOrderItem.extended_price = 134.85
				newOrderItem.price_each = 44.95
				newOrderItem.product_id = newProduct3.product_id
				newOrderItem.quantity = 3
					
				
		var newCompany = fsCompany.getRecord(fsCompany.newRecord(false,true))
		newCompany.company_category = 'Brains for hire'
		newCompany.company_description = 'Creators of Data Sutra and all your custom database needs'
		newCompany.company_email = 'suppport@data-mosaic.com'
		newCompany.company_industry = 'Software'
		newCompany.company_name = 'Data Mosaic'
		newCompany.company_notes = 'Our Mission at Data Mosaic is to help our clients by developing quality business applications that users like to use. In our view, the user is everything – whether it is a data entry clerk or a CEO. This view completely dictates how we develop solutions for customers. We call it "user-centric application development."'
		newCompany.company_type_id = 4
		newCompany.company_url = 'http://www.data-mosaic.com/'
		newCompany.is_active = 1
			
			//addressess
			var newAddress = newCompany.crm_companies_to_addresses.getRecord(newCompany.crm_companies_to_addresses.newRecord(false,true))
			newAddress.address_type_id = 1
			newAddress.city = 'Washington'
			newAddress.country = 'US'
//			newAddress.county = 
//			newAddress.email = 
//			newAddress.fax = 
			newAddress.is_active = 1
			newAddress.line_1 = '1600 Pennsylvania Avenue Northwest'
//			newAddress.line_2 = 
//			newAddress.line_3 = 
//			newAddress.line_4 = 
//			newAddress.line_5 = 
			newAddress.phone = '(202) 456-2121'
//			newAddress.phone_format = 
			newAddress.select_address = '1600 Pennsylvania Avenue - Washington, DC 20500'
			newAddress.state = 'DC'
			newAddress.zipcode = '20500'
				
			//contacts
			var newContact = newCompany.crm_companies_to_contacts.getRecord(newCompany.crm_companies_to_contacts.newRecord(false,true))
//			newContact.contact_notes = 
			newContact.contact_type_id = 12
			newContact.email = 'david@data-mosaic.com'
//			newContact.fax_direct = 
			newContact.is_active = 1
			newContact.job_title = 'CEO'
			newContact.mail_address_id = newAddress.address_id
			newContact.mail_use_company = 1
//			newContact.mail_use_country = 
			newContact.name_first = 'David'
			newContact.name_last = 'Workman'
//			newContact.name_prefix = 
//			newContact.name_suffix = 
//			newContact.phone_cell = 
//			newContact.phone_direct = '617.671.8300'
					
//		var newCompany = fsCompany.getRecord(fsCompany.newRecord(false,true))
//		newCompany.company_category = 
//		newCompany.company_description = 
//		newCompany.company_email = 
//		newCompany.company_industry = 
//		newCompany.company_name = 
//		newCompany.company_notes = 
//		newCompany.company_type_id = 
//		newCompany.company_url = 
//		newCompany.is_active = ''
//			
//			//addressess
//			var newAddress = newCompany.crm_companies_to_addresses.getRecord(newCompany.crm_companies_to_addresses.newRecord(false,true))
//			newAddress.address_type_id = 
//			newAddress.city = 
//			newAddress.country = 
//			newAddress.county = 
//			newAddress.email = 
//			newAddress.fax = 
//			newAddress.is_active = 
//			newAddress.line_1 = 
//			newAddress.line_2 = 
//			newAddress.line_3 = 
//			newAddress.line_4 = 
//			newAddress.line_5 = 
//			newAddress.phone = 
//			newAddress.phone_format = 
//			newAddress.select_address = 
//			newAddress.state = 
//			newAddress.zipcode = ''
//				
//			//contacts
//			var newContact = newCompany.crm_companies_to_contacts.getRecord(newCompany.crm_companies_to_contacts.newRecord(false,true))
//			newContact.contact_notes = 
//			newContact.contact_type_id = 
//			newContact.email = 
//			newContact.fax_direct = 
//			newContact.is_active = 
//			newContact.job_title = 
//			newContact.mail_address_id = 
//			newContact.mail_use_company = 
//			newContact.mail_use_country = 
//			newContact.name_first = 
//			newContact.name_last = 
//			newContact.name_prefix = 
//			newContact.name_suffix = 
//			newContact.phone_cell = 
//			newContact.phone_direct = ''
//		
//			//orders
//			var newOrder = newCompany.crm_companies_to_orders.getRecord(newCompany.crm_companies_to_orders.newRecord(false,true))
//			newOrder.amt_discount = 
//			newOrder.amt_shipping = 
//			newOrder.amt_tax = 
//			newOrder.bill_address_id = 
//			newOrder.contact_id = 
//			newOrder.is_active = 
//			newOrder.is_paid = 
//			newOrder.notes = 
//			newOrder.order_date = new Date()
//			newOrder.order_month_year = 
//			newOrder.order_number = 
//			newOrder.order_subtotal = 
//			newOrder.order_total = 
//			newOrder.paid_date = 
//			newOrder.paid_number = 
//			newOrder.pct_discount = 
//			newOrder.pct_tax = 
//			newOrder.po_number = 
//			newOrder.ship_address_id = 
//			newOrder.ship_fob = 
//			newOrder.ship_via = 
//			newOrder.terms = ''
//		
//				//order items
//				var newOrderItem = newOrder.crm_orders_to_order_items.getRecord(newOrder.crm_orders_to_order_items.newRecord(false,true))
//				newOrderItem.cost_each = 
//				newOrderItem.description = 
//				newOrderItem.extended_price = 
//				newOrderItem.price_each = 
//				newOrderItem.product_id = 
//				newOrderItem.quantity = ''
	
	databaseManager.saveData()
	
	//reset global SaaS to original value
	if (diffOrg) {
		globals.AC_current_organization = oldOrg
	}
}
