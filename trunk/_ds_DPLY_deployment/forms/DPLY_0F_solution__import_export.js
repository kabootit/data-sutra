/**
 *
 * @properties={typeid:24,uuid:"68266641-8fc8-48f2-9aa5-7fcc3c69e2fe"}
 */
function FORM_on_show()
{
/*
elements.bean_progress.value = 0
elements.bean_progress.visible = false
elements.lbl_progress.visible = false

application.updateUI()

*/
}

/**
 *
 * @properties={typeid:24,uuid:"bf9740d3-5868-48da-b75b-0c25d995f6da"}
 */
function FW_export()
{


//get the mapping
var mapping = FW_mapping()


//prompt for which areas to do
//hardcoded to nav engine
var areas = ['navEngine']

//loop
for (var i = 0; i < areas.length; i++) {	
	
	//what kind of area are we doing
	switch (areas[i]) {
		case 'navEngine':
			//foundset
			var fsExport = databaseManager.getFoundSet(controller.getServerName(),'sutra_navigation')
			
			//prompt for which records in selected area to do
			var records = [1]
			
			fsExport.loadRecords(databaseManager.convertToDataSet(records))
			
			break
		default:
			//test
			
	}
	
	//loop
	for (var j = 1; j <= fsExport.getSize(); j++) {	
		//pass in record to export and how to export it
		FW_inout_process(fsExport.getRecord(j),mapping[areas[i]])
	}
	
}

/*

//create duplicate of selected record
var destRecord = globals.CODE_record_duplicate(
							srcRecord,
							new Array(
								'prj_quote_to_quote_version',
								'prj_quote_to_quote_version.prj_quote_version_to_building_item',
								'prj_quote_to_quote_version.prj_quote_version_to_quote_version_item',
								'prj_quote_to_quote_version.prj_quote_version_to_quote_version_item.prj_quote_version_item_to_quote_version_product_item'
							)
						)

*/


}

/**
 * @properties={typeid:24,uuid:"e340350f-c538-4833-a8d9-7017dfa260ee"}
 */
function FW_import()
{
}

/**
 *
 * @properties={typeid:24,uuid:"ffb9f8c4-eb66-49a8-8588-a7fcf01805ca"}
 */
function FW_inout_process()
{

/*
 *	TITLE    :	FW_inout_process
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	process passed in mapping
 *			  	
 *	INPUT    :	1- array of records from some foundset
 *			  	2- object of relations to copy through
 *			  		- includes which fields, and their mappings
 *			  	
 *	OUTPUT   :	new parent record
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FW_inout_process(record, [relationArray]) Create an XML
 *			  	
 *	MODIFIED :	July 17, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//first, create object of relations
//under each relation, put all the child relations
//loop through it that way

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

var srcRecord = arguments[0]
var relationArray = arguments[1]
var overwriteOK = (arguments[2]) ? true : false

//object to store all relations
	//tree required for construction
var relations = 
	tree = new Object()
var tree

//something was passed in
if (srcRecord) {
	
	//if relations, convert array into object tree
	if (relationArray && relationArray.length) {
		relationArray.sort()
		
		//split up compound relations
		for (var i = 0; i < relationArray.length; i++) {
			var item = relationArray[i]
			
			//multiple levels of relations
			if (utils.stringPatternCount(item,'.')) {
				item = item.split('.')
			}
			//nothing to do, skip this iteration
			else if (!item) {
				continue
			}
			//one relation
			else {
				item = new Array(item)
			}
			
			//add all items to tree
			for (var j = 0; j < item.length; j++) {
				//no place holder for this object yet
				if (!tree[item[j]]) {
					tree[item[j]] = {
										_relation_ : item[j]
									}
					
					//punch down position of this item
					if (!tree.length) {
						tree.length = 1
					}
					else {
						tree.length++
					}
					
					//punch down name of this position
					tree[tree.length - 1] = item[j]
				}
				
				//set tree to newly created item
				tree = tree[item[j]]
			}
			
			//reset tree for next go round
			tree = relations
		}
	}
	
	
	
	//get foundset of source record
	var serverName = srcRecord.foundset.getServerName()
	var tableName = srcRecord.foundset.getTableName()
	var fsThis = databaseManager.getFoundSet(serverName,tableName)
	
	//create duplicate record and copy data
	var destRecord = fsThis.getRecord(fsThis.newRecord(false,true))
	databaseManager.copyMatchingColumns(srcRecord,destRecord,overwriteOK)
	
	//go through relations and duplicate sub-records
	for (var i = 0; i < relations.length; i++) {
		//this relation has multiple levels of children
		globals.CODE_record_duplicate_fx(srcRecord,destRecord,relations[relations[i]],overwriteOK)
	}
	
	databaseManager.saveData()
	
	return destRecord
}



}

/**
 *
 * @properties={typeid:24,uuid:"0ee50426-105b-424d-9e4f-87f590047b97"}
 */
function FW_inout_process_fx()
{

/*
 *	TITLE    :	FW_inout_process_fx
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	create a duplicate of record, and optionally all children
 *			  	
 *	INPUT    :	1- source record
 *			  	2- destination record
 *			  	3- object of relations
 *			  	4- overwrite bool
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FW_inout_process_fx(sourceRecord, destinationRecord, subRelationArray, objectRecord, [overwrite]) Duplicates all children
 *			  	
 *	MODIFIED :	June 24, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

var srcRecord = arguments[0]
var destRecord = arguments[1]
var node = arguments[2]
var overwriteOK = (arguments[3]) ? true : false

var serverName = srcRecord.foundset.getServerName()
var tableName = srcRecord.foundset.getTableName()

var fsSource = eval('srcRecord.' + node._relation_)
var fsDest = eval('destRecord.' + node._relation_)

if (fsSource && utils.hasRecords(fsSource)) {
	//go through children, call 
	for (var i = 1; i <= fsSource.getSize(); i++) {
		//create duplicate record
		var srcChild = fsSource.getRecord(i)
		var destChild = fsDest.getRecord(fsDest.newRecord(false,true))
		
		databaseManager.copyMatchingColumns(srcChild,destChild,overwriteOK)
		
		//re-call this Function if there are more levels beneath
		for (var j = 0; j < node.length; j++) {
			globals.CODE_record_duplicate_fx(srcChild,destChild,node[node[j]],overwriteOK)
		}
	}
}


}

/**
 *
 * @properties={typeid:24,uuid:"dda2a213-ca88-4a7f-8bde-6068fde7bb58"}
 */
function FW_mapping()
{

/*
 *	TITLE    :	FW_mapping
 *			  	
 *	MODULE   :	_ds_DPLY_deployment
 *			  	
 *	ABOUT    :	mapping for import/export
 *			  		- an object
 *			  		- divvied up by areas
 *			  		- pairings:
 *			  			- relationName = nodeName
 *			  			- columnName = textNode
 *			  	
 *			  	//MEMO: when no _relnName specified, take columns from same source as parent
 *			  	//container
 *			  	someContainer = {
 *				  		//name of node
 *				  		nodeName		: 'nameOfIndividualItems',
 *				  		//relation to parent (optional)
 *				  		_relnName		: 'nameOfRelation',
 *			  			
 *			  			//columns
 *			  			real_column_name	: 'xmlExportPrettyName',
 *			  			
 *			  			//xml child nodes
 *			  			_nodeChildren	: {
 *			  					//container
 *			  					someContainer	: {
 *			  							//repeat
 *			  						}
 *			  				}
 *			  		}
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	mapping of relations, with their nodes
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	FW_mapping()
 *			  	
 *	MODIFIED :	July 21, 2009 -- Troy Elliott, Data Mosaic
 *			  	
 */

//relations
var relnGroupAction = 'ac_access_group_to_access_group_action'
var relnGroupActionAction = 'ac_access_group_action_to_access_action'
var relnGroupToolbar = 'ac_access_group_to_access_group_toolbar'
var relnGroupToolbarToolbar = 'ac_access_group_toolbar_to_toolbar'
var relnGroupUser = 'ac_access_group_to_access_user_group__selected'
var relnGroupNav = 'ac_access_group_to_control_navigation'
var relnGroupNavSet = 'ac_control_navigation_to_navigation'
var relnGroupBlog = 'ac_access_group_to_access_group_blog__selected'
var relnGroupBlogBlog = 'ac_access_group_blog_to_blog'
var relnBlogEntry = 'ac_blog_to_blog_entry'
var relnBlogQuote = 'ac_blog_to_blog_quote'
var relnStaff = 'ac_access_organization_to_access_staff'

var relnNav = 'nav_navigation_to_navigation_item__all'
var relnNavColumn = 'nav_navigation_item_to_column'
var relnNavDisplay = 'nav_navigation_item_to_list_display'
var relnNavDisplayItem = 'nav_list_display_to_list_display_item'
var relnNavAction = 'nav_navigation_item_to_action_item'
var relnNavActionFilter = 'nav_action_item_to_action_item_filter'
var relnNavDevSpec = 'nav_navigation_item_to_specification'
var relnNavDevTask = 'nav_navigation_item_to_task'

//mapernator
var theMapping = {
		accessControl	:	new Object(),
		blog			:	new Object(),
		navEngine		:	new Object(),
		reportRegistry	:	new Object(),
		solConfig		:	new Object(),
		toolbar			:	new Object(),
		tooltip			:	new Object(),
		valuelist		:	new Object()
	}

//Access and control
theMapping.accessControl = {
		
	}


//Blog
theMapping.blog = {
		
	}


//Navigation engine
theMapping.navEngine = {
		//name of node
		_nodeName		: 'navigationSet',
		
		//columns
		id_navigation	: 'navigationID',
		nav_uuid		: 'navUUID',
		nav_name		: 'name',
		nav_status		: 'status',
		nav_description	: 'description',
		nav_default		: 'default',
		flag_default	: 'flagConfig',
		
		//child relation(s)
		_nodeChildren	: {
				//navigation item container
				navigationItems	: {
						//name of node
						_nodeName	: 'navigationItem',
						//relation to parent
						_relnName	: relnNav,
						
						//columns
						id_navigation		: 'navigationID',
						id_navigation_item	: 'navigationItemID',
						config_type			: 'configType',
						item_name			: 'itemName',
						item_id				: 'itemID',
						module_filter		: 'moduleFilter',
						form_to_load		: 'formLoad',
						list_to_load		: 'listLoad',
						form_to_load_table	: 'formLoadTable',
						description			: 'description',
						node_1				: 'nodeOne',
						node_2				: 'nodeTwo',
						row_status_show		: 'rowStatus',
						row_status_expanded	: 'rowNodeExpanded',
						use_fw_list			: 'useUL',
						fw_list_title		: 'titleUL',
						sort_string			: 'sortString',
						
						initial_form		: 'statusInitialForm',
						initial_form_label	: 'statusInitialFormLabel',
						initial_record		: 'statusInitialRecord',
						initial_record_label: 'statusInitialRecordLabel',
						ul_busy_cursor		: 'busyCursor',
						space_available		: 'spaces',
						space_default		: 'spaceDefault',
						space_flip			: 'spaceFlip',
						space_method		: 'spaceChangeMethod',
						
						bar_item_add		: 'actionULAdd',
						bar_item_action		: 'actionULAction',
						bar_item_filter		: 'actionULFilter',
						bar_item_report		: 'actionULPrint',
						bar_item_tab		: 'actionULTab',
						
						
						//child relation(s)
						_nodeChildren	:	{
								//help container
								help : {
										//name of node
										_nodeName		: 'help',
										
										//columns
										help_available			: 'enabled',
										help_module_filter		: 'moduleFilter',
										help_form_to_load		: 'formLoad',
										help_list_to_load		: 'listLoad',
										help_description		: 'description',
										help_color_text			: 'textColor',
										help_color_background	: 'textBackground'
										
									},
								
								//developer notes
								developerNotes : {
										//xml child nodes
										_nodeChildren	: {
												//spec notes
												specNotes : {
														//name of node
														_nodeName		: 'specification',
														//relation to parent
														_relnName		: relnNavDevSpec,
													
														//columns
														notes			: 'details',
														date_created	: 'creationDate',
														date_modified	: 'modificationDate',
														file_blob		: 'attachmentData',
														file_ext		: 'attachmentExtension',
														file_height		: 'attachmentHeight',
														file_name		: 'attachmentName',
														file_size		: 'attachmentSize',
														file_text		: 'attachmentDescription',
														file_thumb		: 'attachmentThumbnail',
														file_type		: 'attachmentType',
														file_width		: 'attachmentWidth',
														flag_image		: 'someFlag'
													},
												
												
												//tasks
												taskNotes : {
														//name of node
														_nodeName		: 'task',
														//relation to parent
														_relnName		: relnNavDevTask,
													
														//columns
														notes			: 'details',
														date_created	: 'creationDate',
														date_modified	: 'modificationDate',
														date_completed	: 'completionDate',
														flag_done		: 'complete'
													}
											}
									},
								
								//column container
								columnInfo	:	{
										//name of node
										_nodeName		: 'column',
										//relation to parent
										_relnName		: relnNavColumn,
									
										//columns
										id_column			: 'columnID',
										id_navigation_item	: 'navigationItemID',
										status_relation		: 'statusRelation',
										table_or_relation	: 'tableOrRelation',
										name_column			: 'columnName',
										type_column			: 'columnType',
										name_display		: 'prettyName',
										status_find			: 'statusFind',
										status_named		: 'statusNamed',
										valuelist			: 'valueList'
									},
								
								//universal lists
								universalList	:	{
										//name of node
										_nodeName		: 'display',
										//relation to parent
										_relnName		: relnNavDisplay,
									
										//columns
										id_navigation_item	: 'navigationItemID',
										id_list_display		: 'listDisplayID',
										list_title			: 'ulTitleOverride',
										display_default		: 'defaultDisplay',
										row_order			: 'rowOrder',
									
										//xml child nodes
										_nodeChildren	: {
												//universal list columns
												displayConfig	: {
														//name of node
														_nodeName		: 'displayItem',
														//relation to parent
														_relnName		: relnNavDisplayItem,
													
														//columns
														id_list_display			: 'listDisplayID',
														id_list_display_item	: 'listDisplayItemID',
														row_order				: 'rowOrder',
														display					: 'renderValue',
														header					: 'header',
														field_name				: 'sortBy',
														display_width_percent	: 'width',
														display_align			: 'align',
														
														//xml child nodes
														_nodeChildren	: {
																//formatting of an item
																format	: {
																		//columns
																		display_format	: 'type',
																		format_mask		: 'mask'
																	}
															}
													}
											}
									},
								
								//TODO: we need logic here; creating multiple branches from one relation
								//buttons
								buttons	: {
										//relation to parent
										_relnName	: relnNavAction,
										
										//xml child nodes
										_nodeChildren	: {
												//add
												add	: {
														//columns
														menu_name			: 'menuName',
														method_type			: 'methodType',
														method				: 'method',
														method_from_form	: 'displayMethod',
														method_from_custom	: 'displayCustom'
													},
												
												//actions
												actions	: {
														//name of node
														_nodeName		: 'action',
													
														//columns
														menu_name			: 'menuName',
														method_type			: 'methodType',
														method				: 'method',
														method_from_form	: 'displayMethod',
														method_from_custom	: 'displayCustom',
														order_by			: 'order'
													},
												
												//filters
												filters	: {
														//name of node
														_nodeName		: 'filter',
													
														//columns
														menu_name		: 'menuName',
														order_by		: 'order',
														filter_sort		: 'sort',
														filter_limit		: 'limit',
														filter_method		: 'method',
														filter_type		: 'subFilterType',
													
														//xml child nodes
														_nodeChildren	: {
																//filter specs
																filterConfig	: {
																		//name of node
																		_nodeName		: 'filterItem',
																		//relation to parent
																		_relnName		: relnNavActionFilter,
																	
																		//columns
																		filter_type		: 'filterType',
																		method_name		: 'method',
																		column_relation	: 'relation',
																		column_name		: 'columnName',
																		column_operator	: 'columnOperator',
																		column_value	: 'columnValue',
																													
																		valuelist		: 'valuelist',
																		valuelist_type	: 'valuelistType'
																	}
															}
													},
												
												//reports
												reports	: {
														//name of node
														_nodeName		: 'print',
													
														//columns
														menu_name		: 'menuName',
														order_by		: 'order',
														id_report		: 'reportID'
													},
												
												//tabs
												tabs	: {
														//name of node
														_nodeName		: 'tab',
													
														//columns
														menu_name		: 'menuName',
														order_by		: 'order',
														form_to_load		: 'formLoad'
													}
												
											}
									}
							}
					}
			}
	}

										

//Report registry
theMapping.reportRegistry = {
		
	}


//solution configuration (sutra_solution)
theMapping.solConfig = {
		
	}


//Toolbars
theMapping.toolbar = {
		
	}


//Tooltips
theMapping.tooltip = {
		
	}
	

//Valuelist
theMapping.valuelist = {
		
	}


return theMapping


}

/**
 *
 * @properties={typeid:24,uuid:"3212dd32-a6c8-4d5f-878c-0ad1e8c52004"}
 */
function NAV_export()
{

plugins.sutra.busyCursor = true

forms.NAV_0L_navigation.EXPORT_engine()

plugins.sutra.busyCursor = false
}

/**
 *
 * @properties={typeid:24,uuid:"dedd2da8-63af-4f45-82cb-b30c2df0c4b4"}
 */
function NAV_import()
{
/*
elements.bean_progress.value = 0
elements.bean_progress.visible = true
elements.lbl_progress.text = 'Importing...'
elements.lbl_progress.visible = true

application.updateUI()
*/

plugins.sutra.busyCursor = true

forms.NAV_0L_navigation.IMPORT_engine()

plugins.sutra.busyCursor = false

/*
elements.bean_progress.visible = false
elements.lbl_progress.visible = false

application.updateUI()
*/


}
