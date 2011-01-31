/**
 * @properties={typeid:35,uuid:"716299f9-521c-4a7f-b7b3-4e4b40e54f10",variableType:4}
 */
var AC_configuration = 12;

/**
 * @properties={typeid:35,uuid:"ad7cb092-61d4-45ae-9f21-95469d08c88b"}
 */
var AC_filter_action_id = '';

/**
 * @properties={typeid:35,uuid:"b8ca920b-dede-438c-96af-e50e9ff8c92c"}
 */
var AC_filter_action_name = '';

/**
 * @properties={typeid:35,uuid:"0d9798dd-c0e5-4b41-8384-5d4148c21d28"}
 */
var AC_filter_description = '';

/**
 * @properties={typeid:35,uuid:"774d0d2d-381a-4efd-b4e3-46af5d7f1759",variableType:4}
 */
var AC_filter_type = 2;

/**
 * @properties={typeid:35,uuid:"e944a331-f7ef-4dd6-9cd6-053a0a92f0c5",variableType:4}
 */
var AC_filters_toggle;

/**
 * @properties={typeid:35,uuid:"3f5e36c6-d9e9-4fd3-a980-f37c6c17bc97"}
 */
var AC_group_password = 'Security Groups';

/**
 * @properties={typeid:35,uuid:"b6c87bca-7327-47da-a1e8-e700d5a4e4bd",variableType:4}
 */
var AC_group_selected;

/**
 * @properties={typeid:35,uuid:"cadfb40f-048d-43e0-ba0e-3adfe692535f"}
 */
var AC_html_blog = '';

/**
 * @properties={typeid:35,uuid:"d18fb864-3cff-4bd6-bcb9-bd0dba742865"}
 */
var AC_html_misc = '';

/**
 * @properties={typeid:35,uuid:"2afb0dfe-c864-4347-b2ef-fb5f84f87566"}
 */
var AC_html_qotd = '';

/**
 * @properties={typeid:35,uuid:"860dfd6e-2bd0-4180-80ed-52249aa5ede2",variableType:4}
 */
var AC_login_id = null;

/**
 * @properties={typeid:35,uuid:"f8ca97f8-e48f-47f3-a82f-5b16ebaaf4b7"}
 */
var AC_login_password = null;

/**
 * @properties={typeid:35,uuid:"cf17d095-8d0a-4ba3-a0c6-21e92e451875"}
 */
var AC_login_user = null;

/**
 * @properties={typeid:35,uuid:"d0842c14-93ef-472a-a1c3-4a503e2203d7"}
 */
var AC_login_uuid = null;

/**
 * @properties={typeid:35,uuid:"EF11D57D-7B66-46CE-BCC5-CD22B69F892D",variableType:4}
 */
var AC_organization_selected = null;

/**
 * @properties={typeid:35,uuid:"f8104528-20b5-4ba0-aadd-dcb2d81c4371",variableType:4}
 */
var AC_P_flag = 0;

/**
 * @properties={typeid:35,uuid:"fed299e6-6b97-40c5-a0a9-9a36548cd7a5",variableType:4}
 */
var AC_P_group = null;

/**
 * @properties={typeid:35,uuid:"818a7e8b-733e-4402-9194-ed16118660c6"}
 */
var AC_password_edit_1 = '';

/**
 * @properties={typeid:35,uuid:"b5f44e2e-b717-4948-a77c-d6000ad67c91"}
 */
var AC_password_edit_2 = '';

/**
 * @properties={typeid:35,uuid:"60B5CD9C-B8DD-4A39-ACF0-5CB8FC3363CB",variableType:4}
 */
var AC_staff_selected = null;

/**
 * @properties={typeid:35,uuid:"9ee4fdf2-12bc-4f30-ba2b-cbd3b5347df8",variableType:4}
 */
var AC_toolbar_type;

/**
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

var formName = 'AC_0F_solution__prefs_1F_rules'

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
