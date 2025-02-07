dataSource:"db:/sutra_example/contacts",
initialSort:"name_last asc, name_first asc",
items:[
{
anchors:11,
formIndex:10300,
imageMediaID:"50b57e9b-b95e-4188-bcfb-1f0f0936643d",
location:"0,0",
mediaOptions:6,
name:"gfx_subheader",
showClick:false,
showFocus:false,
size:"750,16",
tabSeq:-1,
typeid:7,
uuid:"1296504d-095e-4812-ac93-028beff5fd8f"
},
{
formIndex:10800,
location:"21,44",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"90,23",
styleClass:"standard_table",
tabSeq:-1,
text:"First",
transparent:true,
typeid:7,
uuid:"199e4db8-968e-4d6f-8d18-931492729380"
},
{
formIndex:12500,
location:"300,113",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"90,23",
styleClass:"standard_table_bottom",
tabSeq:-1,
text:"E-mail",
transparent:true,
typeid:7,
uuid:"29981226-5ce9-4de3-b15f-5e743e2ccc4f"
},
{
anchors:3,
borderType:"EmptyBorder,0,0,0,0",
dataProviderID:"contact_notes",
displayType:1,
formIndex:11800,
location:"513,67",
name:"fld_contact_notes",
scrollbars:33,
size:"227,92",
styleClass:"standard_table_textarea",
tabSeq:10,
transparent:true,
typeid:4,
uuid:"2b916c7b-035d-4705-95a2-5d06711c8e40"
},
{
height:400,
partType:5,
typeid:19,
uuid:"2ee5e808-264c-414c-9af7-65ce69dadf41"
},
{
dataProviderID:"name_last",
formIndex:11500,
location:"111,90",
name:"fld_name_last",
scrollbars:36,
size:"170,23",
styleClass:"standard_table",
tabSeq:3,
transparent:true,
typeid:4,
uuid:"30afe64f-f9d8-4155-b9df-21cad74b97ed"
},
{
formIndex:12300,
location:"300,67",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"90,23",
styleClass:"standard_table",
tabSeq:-1,
text:"Mobile",
transparent:true,
typeid:7,
uuid:"43ece3c6-10a3-4bf6-801a-417eac6d2555"
},
{
anchors:11,
displaysTags:true,
formIndex:10400,
location:"15,0",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"720,15",
styleClass:"header",
tabSeq:-1,
text:"CONTACT INFO - %%name_fl%%",
transparent:true,
typeid:7,
uuid:"55e83c9a-0998-4c94-9aa0-083153727197"
},
{
anchors:11,
dataProviderID:"phone_direct",
formIndex:12600,
location:"390,44",
name:"fld_phone_direct",
scrollbars:36,
size:"103,23",
styleClass:"standard_table",
tabSeq:6,
transparent:true,
typeid:4,
uuid:"5af63a9d-b0b1-4fec-96eb-e0c3c3db276e"
},
{
anchors:11,
formIndex:12000,
location:"10,21",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"730,18",
styleClass:"standard_table_category",
tabSeq:-1,
text:"Personal information",
transparent:true,
typeid:7,
uuid:"60e47ec4-5772-4d45-8bd7-fb0ab03ee41c"
},
{
formIndex:12400,
location:"300,90",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"90,23",
styleClass:"standard_table",
tabSeq:-1,
text:"FAX",
transparent:true,
typeid:7,
uuid:"60f7e828-29b3-420b-9ed0-2706a7947332"
},
{
dataProviderID:"name_middle",
formIndex:11000,
location:"111,67",
name:"fld_name_middle",
scrollbars:36,
size:"170,23",
styleClass:"standard_table",
tabSeq:2,
transparent:true,
typeid:4,
uuid:"613084a6-b51f-40e3-9bac-d78f4f98b199"
},
{
dataProviderID:"contact_type_id",
displayType:2,
editable:false,
formIndex:11700,
location:"111,136",
name:"fld_contact_type_id",
scrollbars:36,
size:"170,23",
styleClass:"standard_table_bottom",
tabSeq:5,
transparent:true,
typeid:4,
uuid:"6983bfad-4730-43f5-9ca3-5455745447a7",
valuelistID:"f300c95e-d46b-4751-9c46-676be3dd0dc8"
},
{
anchors:3,
displaysTags:true,
formIndex:12100,
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
uuid:"72527ea8-41ec-47fd-ab16-86455e92b172"
},
{
height:16,
partType:1,
typeid:19,
uuid:"7a8f2b30-8b1b-4bf5-9719-3e178b3ef441"
},
{
anchors:11,
dataProviderID:"fax_direct",
formIndex:12800,
location:"390,90",
name:"fld_fax_direct",
scrollbars:36,
size:"103,23",
styleClass:"standard_table",
tabSeq:8,
transparent:true,
typeid:4,
uuid:"7d318d57-e28b-4775-b582-fa54930a97eb"
},
{
formIndex:11100,
location:"300,44",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"90,23",
styleClass:"standard_table",
tabSeq:-1,
text:"Work",
transparent:true,
typeid:7,
uuid:"83f0480f-8652-4edf-9dfb-1be54ec11d5d"
},
{
anchors:15,
formIndex:10500,
items:[
{
containsFormID:"907a9c39-165b-4080-ac63-693ed74a5284",
location:"31,210",
relationName:"crm_contacts_to_contacts",
text:"CRM2_0F_contacts_1F",
typeid:15,
uuid:"fc1086a3-bbe2-4ff6-9715-b78cbf48eb58"
}
],
location:"11,190",
name:"tab_detail",
printable:false,
size:"729,203",
styleClass:"grid_primary",
tabOrientation:-1,
typeid:16,
uuid:"8f95bb25-7d7f-4e2d-8100-8be3c2f76d77"
},
{
anchors:11,
formIndex:10000,
location:"290,39",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"213,123",
styleClass:"color_light",
tabSeq:-1,
typeid:7,
uuid:"9aaaeb43-f6f0-485e-bdf1-8250d67b668b"
},
{
anchors:11,
dataProviderID:"phone_cell",
formIndex:12700,
location:"390,67",
name:"fld_phone_cell",
scrollbars:36,
size:"103,23",
styleClass:"standard_table",
tabSeq:7,
transparent:true,
typeid:4,
uuid:"9b71a475-9b02-4d84-b65b-225bb47cfe8f"
},
{
anchors:11,
dataProviderID:"email",
formIndex:12900,
location:"390,113",
name:"fld_email",
scrollbars:36,
size:"103,23",
styleClass:"standard_table_bottom",
tabSeq:9,
transparent:true,
typeid:4,
uuid:"a4bf35a3-b406-4e73-a003-758fe6289da2"
},
{
formIndex:11200,
location:"21,90",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"90,23",
styleClass:"standard_table",
tabSeq:-1,
text:"Last",
transparent:true,
typeid:7,
uuid:"afba6730-9e45-4e11-bc6c-1e22c1d56f9b"
},
{
formIndex:10900,
location:"21,67",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"90,23",
styleClass:"standard_table",
tabSeq:-1,
text:"Middle",
transparent:true,
typeid:7,
uuid:"b151f1d1-344c-40f8-a67b-bdacd95dd228"
},
{
formIndex:12200,
location:"14,172",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"80,18",
styleClass:"tabpanel",
tabSeq:-1,
text:"Mailing",
transparent:true,
typeid:7,
uuid:"c2695823-50db-46c1-bcd1-4b93d68f7986"
},
{
dataProviderID:"name_first",
formIndex:10700,
location:"111,44",
name:"fld_name_first",
scrollbars:36,
size:"170,23",
styleClass:"standard_table",
tabSeq:1,
transparent:true,
typeid:4,
uuid:"d413fe33-a697-4f0d-a4dd-4b8d40cf3675"
},
{
formIndex:11300,
location:"21,113",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"90,23",
styleClass:"standard_table",
tabSeq:-1,
text:"Title",
transparent:true,
typeid:7,
uuid:"d503c942-7f9a-44a4-908e-08d73c0a8c46"
},
{
anchors:3,
formIndex:11900,
location:"513,44",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"227,23",
styleClass:"standard_table",
tabSeq:-1,
text:"Notes",
transparent:true,
typeid:7,
uuid:"d958fc8c-87b4-4319-b77a-5ae254877cab"
},
{
formIndex:11400,
location:"21,136",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"90,23",
styleClass:"standard_table_bottom",
tabSeq:-1,
text:"Type",
transparent:true,
typeid:7,
uuid:"d9d50b84-52e2-45e3-aa66-08ed37c15baf"
},
{
dataProviderID:"job_title",
formIndex:11600,
location:"111,113",
name:"fld_job_title",
scrollbars:36,
size:"170,23",
styleClass:"standard_table",
tabSeq:4,
transparent:true,
typeid:4,
uuid:"fc6b2947-b650-467a-97fc-0dcaa85c63fb"
}
],
name:"CRM2_0F_contacts",
navigatorID:"-1",
onRecordSelectionMethodID:"A4B842E9-8B1F-45B2-8CBB-6F9056D897FA",
onShowMethodID:"4b9d5a7f-3696-462e-b0d6-1e0ba6248a05",
paperPrintScale:100,
size:"750,400",
styleName:"_DATASUTRA_",
typeid:3,
uuid:"bcd0cccb-5215-4a92-99a1-2d0b32e89eab"