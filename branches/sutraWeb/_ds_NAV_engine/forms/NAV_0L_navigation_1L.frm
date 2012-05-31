dataSource:"db:/sutra/sutra_navigation",
initialSort:"order_by asc",
items:[
{
anchors:3,
dataProviderID:"flag_config",
displayType:4,
formIndex:10300,
horizontalAlignment:0,
location:"42,40",
size:"20,20",
tabSeq:-2,
toolTipText:"Config",
transparent:true,
typeid:4,
uuid:"8ff5ee3f-1df4-4041-a7d0-e37f68a67cf7"
},
{
anchors:3,
borderType:"MatteBorder,1,2,1,2,#ffffff",
dataProviderID:"id_navigation",
formIndex:10400,
location:"60,40",
size:"30,20",
styleClass:"aligncenter",
tabSeq:-2,
toolTipText:"ID",
transparent:true,
typeid:4,
uuid:"975f31d9-a004-41a9-aea2-b727ed0df84a"
},
{
anchors:11,
dataProviderID:"display_navigation",
displayType:8,
displaysTags:true,
editable:false,
formIndex:10000,
location:"0,0",
scrollbars:36,
size:"150,20",
styleClass:"customlist",
tabSeq:-2,
toolTipText:"%%url_path_tooltip%%",
transparent:true,
typeid:4,
uuid:"9bc18747-0872-45fd-b76f-b0835ab60255"
},
{
anchors:3,
dataProviderID:"nav_default",
displayType:4,
formIndex:10100,
horizontalAlignment:0,
location:"122,0",
onDataChangeMethodID:"b41cbc06-4f50-4809-bdd8-57ea68c34231",
size:"20,20",
tabSeq:3,
toolTipText:"Default navigation set",
transparent:true,
typeid:4,
uuid:"a2a0ca89-00a6-4872-9382-6f071f61b8ef"
},
{
height:20,
partType:5,
typeid:19,
uuid:"de6622f8-2d80-4c6a-895b-c559caeee102"
},
{
anchors:3,
dataProviderID:"nav_status",
displayType:4,
formIndex:10200,
horizontalAlignment:0,
location:"97,0",
onDataChangeMethodID:"96b0ea4b-50b4-47f9-aaac-df1159b323b9",
size:"20,20",
tabSeq:2,
toolTipText:"Show navigation set",
transparent:true,
typeid:4,
uuid:"ee77e87f-1561-4282-8023-b67341db8bc5"
},
{
anchors:3,
borderType:"MatteBorder,1,2,1,2,#ffffff",
dataProviderID:"order_by",
formIndex:10500,
location:"65,0",
name:"fld_order_by",
size:"30,20",
styleClass:"aligncenter",
tabSeq:1,
toolTipText:"Order",
transparent:true,
typeid:4,
uuid:"f2448c75-64fd-44a0-b061-0319367b06e3"
}
],
name:"NAV_0L_navigation_1L",
onRecordSelectionMethodID:"29f4bc9f-782a-4b53-9df2-b461f06784b3",
onRenderMethodID:"9AC601EA-D133-45B4-B9D6-E38F7A81E4B3",
paperPrintScale:100,
scrollbars:33,
size:"150,20",
styleClass:"list",
styleName:"_DATASUTRA_",
transparent:true,
typeid:3,
uuid:"a78e0e7a-f997-482b-a184-8d7e339ad2ef",
view:4