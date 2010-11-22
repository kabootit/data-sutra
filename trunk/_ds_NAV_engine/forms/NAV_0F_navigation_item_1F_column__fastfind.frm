dataSource:"db:/sutra/sutra_column",
items:[
{
anchors:3,
formIndex:11200,
horizontalAlignment:0,
imageMediaID:"7A6B9C87-74DA-4FFA-884E-AA40D7E71A48",
location:"266,4",
mediaOptions:1,
name:"help_ff_default",
onActionMethodID:"6a193823-8789-4ec3-a7bf-45d1238dc5bd",
rolloverCursor:12,
rolloverImageMediaID:"54B2691A-4383-4F72-8EAA-07F5A2BFCF9B",
showClick:false,
showFocus:false,
size:"20,20",
tabSeq:-2,
transparent:true,
typeid:7,
uuid:"0093fdfa-78ed-4f8f-8d9b-f08d18386692"
},
{
anchors:7,
background:"#a1b0cf",
borderType:"MatteBorder,0,0,0,3,#ffffff",
formIndex:10400,
location:"292,85",
mediaOptions:6,
name:"nolistbar",
showClick:false,
showFocus:false,
size:"4,88",
tabSeq:-1,
typeid:7,
uuid:"0416c0f7-f6f1-49d7-a596-889f51f4c99d"
},
{
anchors:3,
formIndex:11000,
horizontalAlignment:2,
location:"295,70",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"214,18",
styleClass:"tabpanel",
tabSeq:-1,
text:"Assign columns",
transparent:true,
typeid:7,
uuid:"55b23b6a-b474-463b-9d10-6657692d1dfc"
},
{
formIndex:10700,
horizontalAlignment:2,
location:"10,70",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"105,18",
styleClass:"tabpanel",
tabSeq:-1,
text:"Fast find items",
transparent:true,
typeid:7,
uuid:"7633e79f-1786-43b4-b8c8-a33e2b8d9a43"
},
{
anchors:3,
formIndex:10800,
horizontalAlignment:0,
imageMediaID:"7A6B9C87-74DA-4FFA-884E-AA40D7E71A48",
location:"266,68",
mediaOptions:1,
name:"help_ff_list",
onActionMethodID:"6a193823-8789-4ec3-a7bf-45d1238dc5bd",
rolloverCursor:12,
rolloverImageMediaID:"54B2691A-4383-4F72-8EAA-07F5A2BFCF9B",
showClick:false,
showFocus:false,
size:"20,20",
tabSeq:-2,
transparent:true,
typeid:7,
uuid:"7f4e67b8-946b-4863-9aca-09aaf87ef9f9"
},
{
anchors:11,
formIndex:10000,
horizontalAlignment:2,
location:"10,6",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"275,18",
styleClass:"standard_table_category",
tabSeq:-1,
text:"Default find item",
transparent:true,
typeid:7,
uuid:"80c0b7ee-1e23-410c-bf9b-30ea75330cd1"
},
{
anchors:3,
dataProviderID:"globals.NAV_find_relation",
displayType:2,
editable:false,
formIndex:10500,
location:"300,25",
name:"fld_G_find_relation",
onDataChangeMethodID:"323cb69f-2260-4e64-a310-3eed4cbbe67d",
selectOnEnter:true,
size:"185,22",
tabSeq:2,
transparent:true,
typeid:4,
uuid:"83dff950-a655-4943-8094-1903d11fc86d",
valuelistID:"6a072ca4-aba5-4215-bb2a-61210de818f3"
},
{
anchors:11,
dataProviderID:"nav_column_to_navigation_item.find_default",
displayType:2,
editable:false,
formIndex:11300,
location:"10,25",
name:"fld_find_default",
onDataChangeMethodID:"57d88a78-530f-42e9-abea-34d4c88b8dd3",
selectOnEnter:true,
size:"275,22",
tabSeq:1,
transparent:true,
typeid:4,
uuid:"96ee8130-e468-4524-9fc4-e311548e75a0",
valuelistID:"0f1fa115-dfe9-413f-a01e-1ad5ebc583b9"
},
{
anchors:7,
formIndex:10200,
items:[
{
containsFormID:"97a47580-1f04-486a-8502-5e5b24d6f909",
location:"313,99",
text:"NAV_0F_navigation_item_1F_column__fastfind_2L__right",
typeid:15,
uuid:"fe29028a-6ae4-4900-8be3-abc768b0d8f6"
}
],
location:"292,85",
name:"tab_column",
printable:false,
size:"218,88",
styleClass:"grid_primary",
tabOrientation:-1,
typeid:16,
uuid:"a8a8b601-039d-4a38-8b5c-781e836efcf9"
},
{
anchors:15,
formIndex:11400,
items:[
{
containsFormID:"3e8a2a93-8dfe-4d4c-8c57-e040d32d03de",
location:"30,104",
relationName:"nav_column_to_column__find",
text:"NAV_0F_navigation_item_1F_column__fastfind_2L__left",
typeid:15,
uuid:"e27d95f1-65ab-4732-8e06-ff4eeb22163b"
}
],
location:"10,84",
name:"tab_find",
printable:false,
size:"275,89",
styleClass:"grid_primary",
tabOrientation:-1,
typeid:16,
uuid:"c44b42dd-5661-44d3-b696-4bef69c4345c"
},
{
anchors:3,
displaysTags:true,
formIndex:10600,
imageMediaID:"DCDADCC5-E04C-43B1-BA66-77463FC10468",
location:"486,26",
mediaOptions:14,
name:"btn_refresh",
onActionMethodID:"1289adc6-3c4b-40ea-b163-5bf68a16daca",
rolloverCursor:12,
rolloverImageMediaID:"34DFF273-6F16-4C8B-A8F8-8ED0C00008B2",
showClick:false,
showFocus:false,
size:"20,20",
tabSeq:-2,
toolTipText:"Refresh columns from %%globals.NAV_find_relation%%",
transparent:true,
typeid:7,
uuid:"e00ffca5-e8b7-495b-9f07-0d1f6690eed6"
},
{
anchors:3,
formIndex:10100,
horizontalAlignment:2,
location:"295,6",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"214,18",
styleClass:"standard_table_category",
tabSeq:-1,
text:"Choose table",
transparent:true,
typeid:7,
uuid:"ef50c50c-4542-49ca-a5c8-996e0fb90621"
},
{
anchors:3,
formIndex:11100,
horizontalAlignment:0,
imageMediaID:"7A6B9C87-74DA-4FFA-884E-AA40D7E71A48",
location:"491,69",
mediaOptions:1,
name:"help_ff_columns",
onActionMethodID:"6a193823-8789-4ec3-a7bf-45d1238dc5bd",
rolloverCursor:12,
rolloverImageMediaID:"54B2691A-4383-4F72-8EAA-07F5A2BFCF9B",
showClick:false,
showFocus:false,
size:"20,20",
tabSeq:-2,
transparent:true,
typeid:7,
uuid:"f05b37dd-8639-4b82-89b8-bd8d34319bb5"
},
{
anchors:3,
formIndex:10900,
horizontalAlignment:0,
imageMediaID:"7A6B9C87-74DA-4FFA-884E-AA40D7E71A48",
location:"491,4",
mediaOptions:1,
name:"help_ff_table",
onActionMethodID:"6a193823-8789-4ec3-a7bf-45d1238dc5bd",
rolloverCursor:12,
rolloverImageMediaID:"54B2691A-4383-4F72-8EAA-07F5A2BFCF9B",
showClick:false,
showFocus:false,
size:"20,20",
tabSeq:-2,
transparent:true,
typeid:7,
uuid:"f53a0e95-1792-44d7-bcd9-c95e66570ea5"
},
{
height:180,
partType:5,
typeid:19,
uuid:"fad26d2b-910f-48c0-a977-56aa49bce404"
}
],
name:"NAV_0F_navigation_item_1F_column__fastfind",
navigatorID:"-1",
onLoadMethodID:"2be4f61f-ba00-4918-b50e-44b4885fd146",
onShowMethodID:"53893904-d7b6-4b2e-9389-11e5a32f3a9f",
paperPrintScale:100,
size:"520,180",
styleName:"_DATASUTRA_",
typeid:3,
uuid:"fd5d135f-2b68-49ac-a61b-fe82c9b0ceca"