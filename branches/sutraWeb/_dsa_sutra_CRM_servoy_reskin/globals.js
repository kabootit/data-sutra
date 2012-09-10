/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"fcd34555-573c-49f5-9e49-1b1e2dc6714e"}
 */
var CRM_address_display = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"36e941de-836e-4281-bd2b-5c1d35696ca8",variableType:4}
 */
var CRM_companies_selected;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8ab8d339-46bd-4023-bfda-463ca3db412a",variableType:4}
 */
var CRM_company_id;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"f85984e6-0ee4-4c86-8d04-c8f214e82e6c",variableType:4}
 */
var CRM_contact_id;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"5d802ba4-ad38-4921-bfd8-aa14864d8750",variableType:4}
 */
var CRM_contacts_selected;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"e41c034b-553a-47d7-b0a9-aca1a587eff1",variableType:4}
 */
var CRM_orders_selected;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"59afa78d-7506-4ca9-8c71-a843742ac50d",variableType:4}
 */
var CRM_products_selected;

/**
 * Callback method for when solution is opened.
 *
 * @properties={typeid:24,uuid:"A0AF7373-7BCC-469A-B839-2BC1B6700AA8"}
 */
function onSolutionOpen() {
	application.setUIProperty(APP_WEB_PROPERTY.WEBCLIENT_TEMPLATES_DIR, 'datasutra')
}
