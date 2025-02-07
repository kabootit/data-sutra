dataSource:"db:/sutra_example/products",
initialSort:"product_name asc",
items:[
{
formIndex:11200,
location:"21,67",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"110,23",
styleClass:"standard_table",
tabSeq:-1,
text:"Product name",
transparent:true,
typeid:7,
uuid:"0536dba6-9f96-428d-ad1c-525374cef735"
},
{
anchors:11,
formIndex:10000,
location:"330,39",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"194,173",
styleClass:"color_light",
tabSeq:-1,
typeid:7,
uuid:"0be1dd44-2d8f-435a-a2c1-c6d48dd334e4"
},
{
anchors:11,
dataProviderID:"price_each",
formIndex:11400,
format:"¤###,###,###.00|#.##",
location:"430,67",
name:"fld_price_each",
scrollbars:36,
size:"84,23",
styleClass:"standard_table",
tabSeq:7,
transparent:true,
typeid:4,
uuid:"117e47f5-0701-4680-ad11-9d392ad27a9d"
},
{
anchors:3,
borderType:"EmptyBorder,0,0,0,0",
formIndex:12700,
location:"535,83",
mediaOptions:14,
name:"lbl_imagePreview",
showClick:false,
showFocus:false,
size:"205,95",
styleClass:"defaulttabunselectalt",
tabSeq:-1,
transparent:true,
typeid:7,
uuid:"2f80f1e2-5371-4420-86e7-131e3985e2f1"
},
{
formIndex:11100,
location:"21,44",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"110,23",
styleClass:"standard_table",
tabSeq:-1,
text:"Product number",
transparent:true,
typeid:7,
uuid:"34572121-9f7d-49c1-9c73-bc72f5b5a0d8"
},
{
anchors:3,
displaysTags:true,
formIndex:10900,
horizontalAlignment:4,
location:"500,22",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"230,15",
styleClass:"bold",
tabSeq:-1,
text:"<html>
  <head>
    
  <\/head>
  <body>
    <font color=\"#323a4b\">Status: <\/font><font color=\"#BD4803\">%%display_is_active%%<\/font>
  <\/body>
<\/html>",
transparent:true,
typeid:7,
uuid:"35885f68-6e89-4b30-84b9-2f1103c09cd6"
},
{
anchors:11,
displaysTags:true,
formIndex:10600,
location:"5,0",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"740,15",
styleClass:"header",
tabSeq:-1,
text:"PRODUCT INFO - %%product_name%%",
transparent:true,
typeid:7,
uuid:"398e6ffe-1298-4e47-b755-555bdcc34991"
},
{
formIndex:12000,
location:"21,113",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"110,23",
styleClass:"standard_table",
tabSeq:-1,
text:"Category",
transparent:true,
typeid:7,
uuid:"4ced93d4-dc1d-41db-a087-a467a1052591"
},
{
height:400,
partType:5,
typeid:19,
uuid:"609a6e4b-e5eb-43e1-869b-abb8449a60a1"
},
{
anchors:11,
dataProviderID:"description",
displayType:1,
formIndex:11700,
location:"430,90",
name:"fld_description",
scrollbars:33,
size:"84,116",
styleClass:"standard_table_textarea_bottom",
tabSeq:8,
transparent:true,
typeid:4,
uuid:"636ff3df-0065-4b1f-afd0-0cd7d362be62"
},
{
dataProviderID:"order_description",
formIndex:12300,
location:"131,90",
name:"fld_order_description",
scrollbars:36,
size:"190,23",
styleClass:"standard_table",
tabSeq:3,
transparent:true,
typeid:4,
uuid:"6caefb8a-3763-4819-9435-50c4af4b2ef2"
},
{
dataProviderID:"product_number",
formIndex:11000,
format:"#",
location:"131,44",
name:"fld_product_number",
scrollbars:36,
size:"190,23",
styleClass:"standard_table",
tabSeq:1,
transparent:true,
typeid:4,
uuid:"7738d529-8ac2-40b8-97d0-febef5ec3a2b"
},
{
height:16,
partType:1,
typeid:19,
uuid:"779e1463-9d86-4905-9a63-2422c0169756"
},
{
anchors:3,
borderType:"EmptyBorder,0,0,0,0",
dataProviderID:"product_image",
displayType:9,
formIndex:11900,
horizontalAlignment:0,
location:"534,44",
onDataChangeMethodID:"5cd792d4-d344-4a3b-94ef-e93abf88e8df",
scrollbars:36,
size:"206,163",
styleClass:"standard_table",
tabSeq:-2,
transparent:true,
typeid:4,
uuid:"8971b02f-5bef-4a6f-9947-fdc0c1fb6ad4"
},
{
anchors:15,
formIndex:10300,
items:[
{
containsFormID:"37ce1a8d-a9e2-4015-a4a0-c477daec0f9e",
location:"21,240",
relationName:"crm_products_to_order_items",
text:"CRM2_0F_products_1L_order_items",
typeid:15,
uuid:"29123db4-2250-4740-9183-469e5760da86"
}
],
location:"11,230",
name:"tab_detail",
printable:false,
size:"729,163",
styleClass:"grid_primary",
tabOrientation:-1,
typeid:16,
uuid:"8dffdb1a-6648-4ded-b626-d4765f6089c3"
},
{
anchors:11,
formIndex:10700,
location:"10,21",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"730,18",
styleClass:"standard_table_category",
tabSeq:-1,
text:"Product information",
transparent:true,
typeid:7,
uuid:"93bcac9f-6449-4bba-82af-598510e14807"
},
{
dataProviderID:"product_types",
displayType:4,
formIndex:12400,
location:"131,136",
name:"fld_product_types",
scrollbars:36,
size:"190,70",
styleClass:"standard_table_bottom",
tabSeq:5,
transparent:true,
typeid:4,
uuid:"9ece80fc-e93d-4e4b-8b31-783542caeae2",
valuelistID:"5bc2137e-99f7-4da3-8498-f82f69f2637c"
},
{
formIndex:10800,
horizontalAlignment:2,
location:"11,212",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"135,18",
styleClass:"tabpanel",
tabSeq:-1,
text:"Existing orders",
transparent:true,
typeid:7,
uuid:"a2057114-e584-42f8-ac99-ea80140cfdd2"
},
{
formIndex:12500,
location:"21,136",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"110,23",
styleClass:"standard_table_bottom",
tabSeq:-1,
text:"Type",
transparent:true,
typeid:7,
uuid:"a758d82f-8dd9-47a5-9013-f6948a138a52"
},
{
dataProviderID:"product_category",
displayType:2,
editable:false,
formIndex:11300,
location:"131,113",
name:"fld_product_category",
scrollbars:36,
size:"190,23",
styleClass:"standard_table",
tabSeq:4,
transparent:true,
typeid:4,
uuid:"a7981bb7-8cf9-4e0e-920a-76518eac4d47",
valuelistID:"6eb62ff9-66fc-4a1f-a3c9-80dd055f2802"
},
{
formIndex:11500,
location:"340,67",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"90,23",
styleClass:"standard_table",
tabSeq:-1,
text:"Price each",
transparent:true,
typeid:7,
uuid:"b176e61d-c4df-4b3b-bb67-93456a851869"
},
{
anchors:11,
formIndex:10500,
imageMediaID:"50b57e9b-b95e-4188-bcfb-1f0f0936643d",
location:"0,0",
mediaOptions:6,
name:"gfx_subheader",
showClick:false,
showFocus:false,
size:"750,16",
tabSeq:-1,
typeid:7,
uuid:"c0e3e32c-d555-4505-9d2c-5073a4707132"
},
{
formIndex:12200,
location:"21,90",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"110,23",
styleClass:"standard_table",
tabSeq:-1,
text:"Order description",
transparent:true,
typeid:7,
uuid:"cfb5d7ad-6068-4099-b07f-76d7f56941a9"
},
{
anchors:11,
dataProviderID:"cost_each",
formIndex:12600,
format:"¤###,###,###.00|#.##",
location:"430,44",
name:"fld_cost_each",
scrollbars:36,
size:"84,23",
styleClass:"standard_table",
tabSeq:6,
transparent:true,
typeid:4,
uuid:"d41d090e-29dd-4858-8684-fcdfc86c3515"
},
{
formIndex:11800,
location:"340,44",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"90,23",
styleClass:"standard_table",
tabSeq:-1,
text:"Cost each",
transparent:true,
typeid:7,
uuid:"dfe09d13-b18e-43b5-a754-c23b0b99b6bf"
},
{
formIndex:11600,
location:"340,90",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"90,23",
styleClass:"standard_table_bottom",
tabSeq:-1,
text:"Internal notes",
transparent:true,
typeid:7,
uuid:"eb4c108a-942a-4d64-b12f-1ae7154c8377"
},
{
dataProviderID:"product_name",
formIndex:12100,
location:"131,67",
name:"fld_product_name",
scrollbars:36,
size:"190,23",
styleClass:"standard_table",
tabSeq:2,
transparent:true,
typeid:4,
uuid:"ecfb603a-ffea-4cda-acb4-d0e49cce14f0"
}
],
name:"CRM2_0F_products",
navigatorID:"-1",
onRecordSelectionMethodID:"5cd792d4-d344-4a3b-94ef-e93abf88e8df",
onShowMethodID:"1b6df4e4-d010-4748-ae4f-3396695a7b5e",
paperPrintScale:100,
size:"750,400",
styleName:"_DATASUTRA_",
typeid:3,
uuid:"fe9b245a-7da7-48ef-bf2e-28d905d4fdd4"