dataSource:"db:/sutra/sutra_report",
initialSort:"report_module asc, report_form asc, report_method asc",
items:[
{
borderType:"SpecialMatteBorder,0.0,0.0,1.0,0.0,#000000,#000000,#999999,#000000,0.0,1.0",
dataProviderID:"report_method",
displayType:2,
editable:false,
formIndex:10300,
location:"480,30",
size:"160,23",
styleClass:"tableview",
text:"Method",
typeid:4,
uuid:"1A73C5FF-9A6A-42CF-850E-990B31A28DA5",
valuelistID:"CA546426-B456-42DB-90AD-32B70CD2E1BF"
},
{
borderType:"SpecialMatteBorder,0.0,0.0,1.0,0.0,#000000,#000000,#999999,#000000,0.0,1.0",
dataProviderID:"flag_wrapper",
displayType:4,
formIndex:10800,
location:"640,30",
scrollbars:36,
selectOnEnter:true,
size:"25,23",
styleClass:"tableview",
toolTipText:"Enable wrapper (Print selected, foundset, subset)",
typeid:4,
uuid:"40EEC335-93E0-493F-B98E-A3544784A8F5",
valuelistID:"4f6370be-de55-4992-a24f-57a43c0b25c3"
},
{
borderType:"SpecialMatteBorder,0.0,0.0,1.0,0.0,#000000,#000000,#999999,#000000,0.0,1.0",
dataProviderID:"report_form",
displayType:2,
editable:false,
formIndex:10100,
location:"300,30",
onDataChangeMethodID:"F9A1717C-B492-4943-8940-54C31F2DAD48",
size:"180,23",
styleClass:"tableview",
text:"Form",
typeid:4,
uuid:"4B4C1ECD-DEF9-4A9B-B6D1-984166035DD2",
valuelistID:"473234B2-0586-44D4-91A4-1CE4691902D6"
},
{
height:60,
partType:5,
typeid:19,
uuid:"5600F4F4-3E0B-473A-8D54-8B1E29502B39"
},
{
borderType:"SpecialMatteBorder,0.0,0.0,1.0,0.0,#000000,#000000,#999999,#000000,0.0,1.0",
dataProviderID:"report_module",
displayType:2,
editable:false,
formIndex:10500,
location:"120,30",
onDataChangeMethodID:"674ACC9E-03E5-4867-87B9-E4D1CCA90E93",
size:"180,23",
styleClass:"tableview",
text:"Module",
typeid:4,
uuid:"66F9FDD4-BE2D-4271-B511-3BF184F26317",
valuelistID:"904b2c59-9117-4c15-ae56-77da4270fde0"
},
{
height:18,
partType:1,
typeid:19,
uuid:"90773AC0-2224-40D3-8221-AEC5D31D9622"
},
{
anchors:11,
borderType:"SpecialMatteBorder,0.0,0.0,1.0,0.0,#000000,#000000,#999999,#000000,0.0,1.0",
dataProviderID:"report_description",
formIndex:10200,
location:"20,30",
name:"fld_desc",
selectOnEnter:true,
size:"100,23",
styleClass:"tableview",
text:"Description",
typeid:4,
uuid:"BFF0A5FD-780F-4662-A161-0EDA0DF38983"
},
{
borderType:"SpecialMatteBorder,0.0,0.0,1.0,0.0,#000000,#000000,#999999,#000000,0.0,1.0",
formIndex:10000,
imageMediaID:"16c4d692-c1ea-4200-a078-1150b1da4d5f",
location:"680,30",
mediaOptions:1,
onActionMethodID:"1D956AD6-A86F-4C69-BBE5-78569E04CC4E",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"22,23",
toolTipText:"Delete record",
typeid:7,
uuid:"E16D1AA1-7643-4612-88EA-E885A3EBD560"
},
{
borderType:"SpecialMatteBorder,0.0,0.0,1.0,0.0,#000000,#000000,#999999,#000000,0.0,1.0",
formIndex:10400,
imageMediaID:"e838f55d-86d2-4582-9ea2-031a2143dbfa",
location:"0,30",
mediaOptions:1,
onActionMethodID:"C04E918E-DC49-4A44-992F-B4D4D4720A1C",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"20,23",
toolTipText:"Show print-preview",
typeid:7,
uuid:"E23F1AEA-AF46-4CCC-9A44-9087C6D5A06D"
},
{
anchors:11,
borderType:"MatteBorder,0,0,1,0,#323a4b",
formIndex:10600,
items:[
{
containsFormID:"4EBAD347-7CF1-443F-A231-D8DBA05BFA4C",
location:"60,0",
text:"MGR_0F_report_1L_2L__filter",
typeid:15,
uuid:"942FD11C-AD17-4EC4-AA3C-7A66072A0A79"
}
],
location:"0,0",
name:"tab_header",
printable:false,
size:"640,18",
tabOrientation:-1,
typeid:16,
uuid:"FFD3C894-B3FA-4E72-8958-B818F2686293"
}
],
name:"MGR_0F_report_1L_2L",
onRecordSelectionMethodID:"F8E754F9-5490-4B0B-B33E-FCE078C83C1C",
onShowMethodID:"674ACC9E-03E5-4867-87B9-E4D1CCA90E93",
paperPrintScale:100,
scrollbars:34,
size:"640,60",
styleName:"_DATASUTRA_",
typeid:3,
uuid:"820D994F-584F-45B9-B64E-EE99D5B7E21D",
view:3