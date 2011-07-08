dataSource:"db:/sutra/sutra_solution",
items:[
{
anchors:15,
background:"#323a4b",
formIndex:12400,
location:"900,160",
mediaOptions:4,
name:"gfx_curtain",
onActionMethodID:"73261329-fc04-437b-bfd0-e9e6a1277029",
showClick:false,
showFocus:false,
size:"40,40",
styleClass:"heading1",
transparent:true,
typeid:7,
uuid:"044695de-30e5-4cff-9649-1f4f17490ea8",
verticalAlignment:0
},
{
anchors:7,
background:"#d1d7e2",
formIndex:10200,
items:[
{
containsFormID:"22B887DF-383A-4EC1-8C60-7F534BBEE259",
location:"790,230",
text:"DATASUTRA__sidebar",
typeid:15,
uuid:"c7d54224-39e4-464b-b5ed-215ea4c8a480"
}
],
location:"790,230",
name:"tab_content_D",
printable:false,
size:"50,40",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"07eff69c-256e-4a92-a755-d9a7e5fe2fbd"
},
{
formIndex:11600,
location:"730,410",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"200,80",
tabSeq:-1,
text:"<html>
  <head>

  <\/head>
  <body>
    tab_content_A = navigation<br>tab_content_B = list area
tab_content_C = workflow area
tab_content_D = sidebar
  <\/body>
<\/html>",
transparent:true,
typeid:7,
uuid:"10fa081c-ffc6-4acc-8184-9f9c50bc98c2"
},
{
anchors:3,
beanClassName:"javax.swing.JInternalFrame",
beanXML:"<?xml version=\"1.0\" encoding=\"UTF-8\"?> 
<java version=\"1.5.0_19\" class=\"java.beans.XMLDecoder\"> 
 <object class=\"javax.swing.JInternalFrame\"> 
  <void property=\"background\"> 
   <object class=\"java.awt.Color\"> 
    <int>230<\/int> 
    <int>233<\/int> 
    <int>207<\/int> 
    <int>255<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"bounds\"> 
   <object class=\"java.awt.Rectangle\"> 
    <int>701<\/int> 
    <int>0<\/int> 
    <int>80<\/int> 
    <int>80<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"name\"> 
   <string>sheetz<\/string> 
  <\/void> 
 <\/object> 
<\/java> 
",
formIndex:11500,
location:"701,0",
name:"sheetz",
size:"80,80",
typeid:12,
usesUI:true,
uuid:"125ae2a3-4b8d-4ca7-ac57-1a6f60b873cd"
},
{
anchors:11,
background:"#d1d7e2",
formIndex:11800,
items:[
{
containsFormID:"7860eecd-3ddb-4ecc-b75b-da25ba09e0cb",
location:"80,0",
text:"DATASUTRA_0F_solution__header",
typeid:15,
uuid:"b20250f2-b4b5-4e9f-9706-6d41b138a6ba"
}
],
location:"80,0",
name:"tab_header",
printable:false,
size:"620,44",
tabOrientation:-1,
typeid:16,
uuid:"19a5534d-8687-4a5f-a916-bbec6ecf69d7"
},
{
anchors:11,
formIndex:12500,
horizontalAlignment:0,
location:"940,160",
mediaOptions:1,
name:"gfx_spinner",
onActionMethodID:"73261329-fc04-437b-bfd0-e9e6a1277029",
showClick:false,
showFocus:false,
size:"40,40",
transparent:true,
typeid:7,
uuid:"1c7cc471-4100-4b89-8921-f211995b07cd"
},
{
anchors:13,
formIndex:12600,
location:"900,260",
mediaOptions:4,
name:"gfx_curtain_left_1",
onActionMethodID:"73261329-fc04-437b-bfd0-e9e6a1277029",
showClick:false,
showFocus:false,
size:"40,40",
transparent:true,
typeid:7,
uuid:"2E21A1D9-0634-43F5-8F9E-C5AB6CE1D83E"
},
{
background:"#d1d7e2",
dataProviderID:"globals.CODE_constant_1",
editable:false,
foreground:"#d1d7e2",
formIndex:10600,
location:"45,11",
name:"fld_trigger_name",
onFocusGainedMethodID:"2893a3d9-ffdc-4d8e-8ea1-12aa9f8bdd2e",
size:"15,20",
styleClass:"noborder",
tabSeq:-2,
typeid:4,
uuid:"320491c4-f709-42df-9a25-00bec079922b"
},
{
anchors:11,
formIndex:12600,
location:"900,220",
mediaOptions:4,
name:"gfx_curtain_header",
onActionMethodID:"73261329-fc04-437b-bfd0-e9e6a1277029",
showClick:false,
showFocus:false,
size:"40,40",
transparent:true,
typeid:7,
uuid:"3B5C6E6B-805A-4D4F-9A78-7C21BFAF904F"
},
{
anchors:15,
beanClassName:"javax.swing.JSplitPane",
beanXML:"<?xml version=\"1.0\" encoding=\"UTF-8\"?> 
<java version=\"1.5.0_19\" class=\"java.beans.XMLDecoder\"> 
 <object class=\"javax.swing.JSplitPane\"> 
  <int>1<\/int> 
  <void property=\"background\"> 
   <object class=\"java.awt.Color\"> 
    <int>209<\/int> 
    <int>215<\/int> 
    <int>226<\/int> 
    <int>255<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"size\"> 
   <object class=\"java.awt.Dimension\"> 
    <int>700<\/int> 
    <int>384<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"UI\"> 
   <void property=\"continuousLayout\"> 
    <boolean>true<\/boolean> 
   <\/void> 
  <\/void> 
  <void property=\"border\"> 
   <null/> 
  <\/void> 
  <void property=\"continuousLayout\"> 
   <boolean>true<\/boolean> 
  <\/void> 
  <void property=\"dividerLocation\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"dividerSize\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"focusable\"> 
   <boolean>false<\/boolean> 
  <\/void> 
  <void property=\"lastDividerLocation\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"name\"> 
   <string>bean_wrapper_1<\/string> 
  <\/void> 
  <void property=\"requestFocusEnabled\"> 
   <boolean>false<\/boolean> 
  <\/void> 
 <\/object> 
<\/java> 
",
formIndex:10700,
location:"0,0",
name:"bean_wrapper_1",
size:"700,384",
typeid:12,
usesUI:true,
uuid:"52527ac0-cbbe-4093-a292-461800440b14"
},
{
anchors:9,
background:"#d1d7e2",
formIndex:12300,
location:"910,50",
name:"tab_design_popdown",
printable:false,
size:"50,30",
tabOrientation:-1,
typeid:16,
uuid:"54054137-2f2b-43cc-a5cd-5b699cadadca"
},
{
anchors:11,
formIndex:12600,
location:"920,340",
mediaOptions:4,
name:"gfx_curtain_leftright",
onActionMethodID:"73261329-fc04-437b-bfd0-e9e6a1277029",
showClick:false,
showFocus:false,
size:"40,40",
transparent:true,
typeid:7,
uuid:"5615C1C9-2360-40F8-AFE7-A4E78702D09A"
},
{
anchors:9,
background:"#d1d7e2",
formIndex:11100,
location:"710,190",
name:"tab_content_A",
printable:false,
size:"50,40",
tabOrientation:-1,
typeid:16,
uuid:"6765cd60-01af-4e78-b740-d9b519e0e504"
},
{
anchors:3,
formIndex:13002,
items:[
{
containsFormID:"9B70D034-82C2-49B1-8A11-B144123E606E",
location:"790,60",
text:"NAV__fastfind",
typeid:15,
uuid:"F7ACD1EB-3FB9-4DF4-A21B-8DDAA7C0343A"
}
],
location:"780,50",
name:"tab_fastfind",
printable:false,
size:"110,30",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"6E64AD05-1D97-4079-9027-EC6F0F9DED78"
},
{
anchors:11,
background:"#e6e9cf",
formIndex:12900,
items:[
{
containsFormID:"9599A109-B1DA-4470-831A-500D0DFEE938",
location:"790,10",
text:"DATASUTRA__toolbar__popdown",
typeid:15,
uuid:"39C95DB1-CD99-4605-91C6-B9B8EB72E624"
}
],
location:"781,10",
name:"tab_toolbar_popdown",
printable:false,
size:"110,30",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"730c0767-fa91-4294-8a85-a8052746cd89"
},
{
formIndex:13005,
items:[
{
containsFormID:"C87117C5-6128-4A00-A015-592A334E7224",
location:"780,100",
text:"DATASUTRA__dialog_small",
typeid:15,
uuid:"92F46847-7155-4AEF-B216-CE3196528CF1"
}
],
location:"780,90",
name:"tab_dialog",
printable:false,
size:"100,60",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"82EE67AD-A830-469D-9460-69E51DDBD76A"
},
{
anchors:15,
beanClassName:"javax.swing.JSplitPane",
beanXML:"<?xml version=\"1.0\" encoding=\"UTF-8\"?> 
<java version=\"1.5.0_19\" class=\"java.beans.XMLDecoder\"> 
 <object class=\"javax.swing.JSplitPane\"> 
  <int>0<\/int> 
  <void property=\"background\"> 
   <object class=\"java.awt.Color\"> 
    <int>209<\/int> 
    <int>215<\/int> 
    <int>226<\/int> 
    <int>255<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"bounds\"> 
   <object class=\"java.awt.Rectangle\"> 
    <int>510<\/int> 
    <int>0<\/int> 
    <int>180<\/int> 
    <int>384<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"UI\"> 
   <void property=\"continuousLayout\"> 
    <boolean>true<\/boolean> 
   <\/void> 
  <\/void> 
  <void property=\"border\"> 
   <null/> 
  <\/void> 
  <void property=\"continuousLayout\"> 
   <boolean>true<\/boolean> 
  <\/void> 
  <void property=\"dividerLocation\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"dividerSize\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"focusable\"> 
   <boolean>false<\/boolean> 
  <\/void> 
  <void property=\"lastDividerLocation\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"name\"> 
   <string>bean_wrapper_2<\/string> 
  <\/void> 
  <void property=\"requestFocusEnabled\"> 
   <boolean>false<\/boolean> 
  <\/void> 
 <\/object> 
<\/java> 
",
formIndex:12700,
location:"510,0",
name:"bean_wrapper_2",
size:"180,384",
typeid:12,
usesUI:true,
uuid:"85f08e84-94e7-4b5f-8639-bbd9e4035233"
},
{
anchors:15,
beanClassName:"javax.swing.JSplitPane",
beanXML:"<?xml version=\"1.0\" encoding=\"UTF-8\"?> 
<java version=\"1.5.0_19\" class=\"java.beans.XMLDecoder\"> 
 <object class=\"javax.swing.JSplitPane\"> 
  <int>1<\/int> 
  <void property=\"background\"> 
   <object class=\"java.awt.Color\"> 
    <int>209<\/int> 
    <int>215<\/int> 
    <int>226<\/int> 
    <int>255<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"bounds\"> 
   <object class=\"java.awt.Rectangle\"> 
    <int>40<\/int> 
    <int>4<\/int> 
    <int>660<\/int> 
    <int>340<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"UI\"> 
   <void property=\"continuousLayout\"> 
    <boolean>true<\/boolean> 
   <\/void> 
  <\/void> 
  <void property=\"border\"> 
   <null/> 
  <\/void> 
  <void property=\"continuousLayout\"> 
   <boolean>true<\/boolean> 
  <\/void> 
  <void property=\"dividerLocation\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"dividerSize\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"focusable\"> 
   <boolean>false<\/boolean> 
  <\/void> 
  <void property=\"lastDividerLocation\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"name\"> 
   <string>bean_main<\/string> 
  <\/void> 
  <void property=\"requestFocusEnabled\"> 
   <boolean>false<\/boolean> 
  <\/void> 
 <\/object> 
<\/java> 
",
formIndex:11400,
location:"40,4",
name:"bean_main",
size:"660,340",
typeid:12,
usesUI:true,
uuid:"8a852a4f-467f-4983-919e-2b13caeafd99"
},
{
anchors:15,
background:"#d1d7e2",
formIndex:12100,
items:[
{
containsFormID:"25efc014-69c6-4d5c-846c-26ebc7176e3e",
location:"1040,240",
text:"AC_R__login__unlock",
typeid:15,
uuid:"495ce5bf-2c61-498d-a976-920fe8dc6e4e"
}
],
location:"1031,230",
name:"tab_lock",
printable:false,
size:"170,110",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"8ee88f72-3364-4a8a-8cd7-122c2fa09f93"
},
{
anchors:3,
beanClassName:"javax.swing.JInternalFrame",
beanXML:"<?xml version=\"1.0\" encoding=\"UTF-8\"?> 
<java version=\"1.5.0_19\" class=\"java.beans.XMLDecoder\"> 
 <object class=\"javax.swing.JInternalFrame\"> 
  <void property=\"background\"> 
   <object class=\"java.awt.Color\"> 
    <int>209<\/int> 
    <int>215<\/int> 
    <int>226<\/int> 
    <int>255<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"bounds\"> 
   <object class=\"java.awt.Rectangle\"> 
    <int>961<\/int> 
    <int>150<\/int> 
    <int>240<\/int> 
    <int>202<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"closable\"> 
   <boolean>true<\/boolean> 
  <\/void> 
  <void property=\"defaultCloseOperation\"> 
   <int>1<\/int> 
  <\/void> 
  <void property=\"name\"> 
   <string>lock<\/string> 
  <\/void> 
  <void property=\"title\"> 
   <string>Unlock<\/string> 
  <\/void> 
 <\/object> 
<\/java> 
",
formIndex:13003,
location:"991,190",
name:"lock",
size:"240,202",
typeid:12,
usesUI:true,
uuid:"949d1390-2145-4522-ad32-e61603134133"
},
{
formIndex:12600,
location:"940,220",
mediaOptions:4,
name:"gfx_curtain_top",
onActionMethodID:"73261329-fc04-437b-bfd0-e9e6a1277029",
showClick:false,
showFocus:false,
size:"40,40",
transparent:true,
typeid:7,
uuid:"98702FE6-FEF0-453E-976D-D8E8D7BCDDF4"
},
{
anchors:7,
formIndex:12600,
location:"900,300",
mediaOptions:4,
name:"gfx_curtain_right_1",
onActionMethodID:"73261329-fc04-437b-bfd0-e9e6a1277029",
showClick:false,
showFocus:false,
size:"40,40",
transparent:true,
typeid:7,
uuid:"A398BF0E-6CB6-43CD-983D-076EED995CF0"
},
{
anchors:7,
formIndex:13007,
location:"940,300",
mediaOptions:4,
name:"gfx_curtain_right_2",
onActionMethodID:"73261329-fc04-437b-bfd0-e9e6a1277029",
showClick:false,
showFocus:false,
size:"40,40",
transparent:true,
typeid:7,
uuid:"D196E786-DB9B-455E-8660-A99108E9BD66"
},
{
anchors:14,
background:"#d1d7e2",
formIndex:10800,
items:[
{
containsFormID:"fa2b0bd1-e4c2-4c15-9587-2a57ddf56340",
location:"100,381",
text:"DATASUTRA_0F_solution__footer",
typeid:15,
uuid:"c30201bf-c7d5-49cd-bd4f-0993fff99e5a"
}
],
location:"0,384",
name:"tab_footer",
printable:false,
size:"700,16",
tabOrientation:-1,
typeid:16,
uuid:"a32162d4-c731-4eb8-89eb-b19c17e9420b"
},
{
anchors:9,
beanClassName:"javax.swing.JSplitPane",
beanXML:"<?xml version=\"1.0\" encoding=\"UTF-8\"?> 
<java version=\"1.5.0_19\" class=\"java.beans.XMLDecoder\"> 
 <object class=\"javax.swing.JSplitPane\"> 
  <int>0<\/int> 
  <void property=\"background\"> 
   <object class=\"java.awt.Color\"> 
    <int>209<\/int> 
    <int>215<\/int> 
    <int>226<\/int> 
    <int>255<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"bounds\"> 
   <object class=\"java.awt.Rectangle\"> 
    <int>710<\/int> 
    <int>250<\/int> 
    <int>90<\/int> 
    <int>100<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"UI\"> 
   <void property=\"continuousLayout\"> 
    <boolean>true<\/boolean> 
   <\/void> 
  <\/void> 
  <void property=\"border\"> 
   <null/> 
  <\/void> 
  <void property=\"continuousLayout\"> 
   <boolean>true<\/boolean> 
  <\/void> 
  <void property=\"dividerLocation\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"dividerSize\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"focusable\"> 
   <boolean>false<\/boolean> 
  <\/void> 
  <void property=\"lastDividerLocation\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"name\"> 
   <string>bean_list<\/string> 
  <\/void> 
  <void property=\"requestFocusEnabled\"> 
   <boolean>false<\/boolean> 
  <\/void> 
 <\/object> 
<\/java> 
",
formIndex:10000,
location:"710,290",
name:"bean_list",
size:"90,100",
typeid:12,
usesUI:true,
uuid:"a62fb180-a157-4c60-b342-ee5ddd611e51"
},
{
anchors:11,
beanClassName:"javax.swing.JSplitPane",
beanXML:"<?xml version=\"1.0\" encoding=\"UTF-8\"?> 
<java version=\"1.5.0_19\" class=\"java.beans.XMLDecoder\"> 
 <object class=\"javax.swing.JSplitPane\"> 
  <int>0<\/int> 
  <void property=\"background\"> 
   <object class=\"java.awt.Color\"> 
    <int>209<\/int> 
    <int>215<\/int> 
    <int>226<\/int> 
    <int>255<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"size\"> 
   <object class=\"java.awt.Dimension\"> 
    <int>700<\/int> 
    <int>44<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"UI\"> 
   <void property=\"continuousLayout\"> 
    <boolean>true<\/boolean> 
   <\/void> 
  <\/void> 
  <void property=\"border\"> 
   <null/> 
  <\/void> 
  <void property=\"continuousLayout\"> 
   <boolean>true<\/boolean> 
  <\/void> 
  <void property=\"dividerLocation\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"dividerSize\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"focusable\"> 
   <boolean>false<\/boolean> 
  <\/void> 
  <void property=\"lastDividerLocation\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"name\"> 
   <string>bean_header<\/string> 
  <\/void> 
  <void property=\"requestFocusEnabled\"> 
   <boolean>false<\/boolean> 
  <\/void> 
 <\/object> 
<\/java> 
",
formIndex:11700,
location:"0,0",
name:"bean_header",
size:"700,44",
typeid:12,
usesUI:true,
uuid:"a7bd4653-e890-4356-805d-d296300d5641"
},
{
anchors:13,
formIndex:12600,
location:"940,260",
mediaOptions:4,
name:"gfx_curtain_left_2",
onActionMethodID:"73261329-fc04-437b-bfd0-e9e6a1277029",
showClick:false,
showFocus:false,
size:"40,40",
transparent:true,
typeid:7,
uuid:"a8676b76-e505-41a6-b896-2c7c01a8aacb"
},
{
anchors:15,
background:"#d1d7e2",
formIndex:13008,
location:"0,0",
mediaOptions:6,
name:"gfx_curtain_blank",
showClick:false,
showFocus:false,
size:"700,400",
tabSeq:-1,
typeid:7,
uuid:"b271295a-9cc1-49b3-a199-201b148ec005",
verticalAlignment:0
},
{
anchors:3,
background:"#d1d7e2",
formIndex:11000,
location:"790,190",
name:"tab_content_C",
printable:false,
size:"50,40",
tabOrientation:-1,
typeid:16,
uuid:"c8d1b780-de15-4142-b783-16ccba5b21a9"
},
{
anchors:11,
borderType:"MatteBorder,1,0,0,0,#000000",
formIndex:12800,
location:"0,0",
mediaOptions:14,
name:"gfx_flexible",
showClick:false,
showFocus:false,
size:"700,1",
tabSeq:-1,
transparent:true,
typeid:7,
uuid:"cfdc79d5-bcf3-4062-8246-24f03a31b4c8"
},
{
anchors:9,
background:"#d1d7e2",
formIndex:11200,
items:[
{
containsFormID:"71201bd6-f000-4ba1-aa9c-d8a8097b79a1",
location:"710,230",
text:"Blank",
typeid:15,
uuid:"1caf179e-5bf7-49b8-9761-0f47ecb46a7e"
},
{
containsFormID:"9FBDAEE4-2FCB-4984-B5B3-0DD722A7508E",
location:"720,250",
text:"UL",
typeid:15,
uuid:"CC73E571-E7E2-4CBB-9FE8-D0A18E5595F3"
},
{
containsFormID:"746CBC99-A948-473D-A020-CC8861EF03F8",
location:"730,260",
text:"UL nobuttons",
typeid:15,
uuid:"D39F9184-6525-4FB9-AF0B-5DF0509A5C33"
}
],
location:"710,230",
name:"tab_content_B",
printable:false,
size:"50,40",
tabOrientation:-1,
typeid:16,
uuid:"d20a20cb-96b2-431d-94bc-0d8c0f214b5f"
},
{
anchors:9,
background:"#d1d7e2",
formIndex:10400,
items:[
{
containsFormID:"7c061cc4-670f-4f45-b6d9-8c59da5eeca0",
location:"930,30",
text:"DEV_0F_solution__designbar",
typeid:15,
uuid:"0784c23b-353f-460f-9b54-308cf3434cb0"
}
],
location:"910,10",
name:"tab_design_bar",
printable:false,
size:"50,30",
tabOrientation:-1,
typeid:16,
uuid:"d33ed80f-8335-4c37-bced-868bdeed0871"
},
{
anchors:3,
beanClassName:"javax.swing.JSplitPane",
beanXML:"<?xml version=\"1.0\" encoding=\"UTF-8\"?> 
<java version=\"1.5.0_19\" class=\"java.beans.XMLDecoder\"> 
 <object class=\"javax.swing.JSplitPane\"> 
  <int>1<\/int> 
  <void property=\"background\"> 
   <object class=\"java.awt.Color\"> 
    <int>209<\/int> 
    <int>215<\/int> 
    <int>226<\/int> 
    <int>255<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"bounds\"> 
   <object class=\"java.awt.Rectangle\"> 
    <int>820<\/int> 
    <int>250<\/int> 
    <int>90<\/int> 
    <int>100<\/int> 
   <\/object> 
  <\/void> 
  <void property=\"UI\"> 
   <void property=\"continuousLayout\"> 
    <boolean>true<\/boolean> 
   <\/void> 
  <\/void> 
  <void property=\"border\"> 
   <null/> 
  <\/void> 
  <void property=\"continuousLayout\"> 
   <boolean>true<\/boolean> 
  <\/void> 
  <void property=\"dividerLocation\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"dividerSize\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"focusable\"> 
   <boolean>false<\/boolean> 
  <\/void> 
  <void property=\"lastDividerLocation\"> 
   <int>0<\/int> 
  <\/void> 
  <void property=\"name\"> 
   <string>bean_workflow<\/string> 
  <\/void> 
  <void property=\"requestFocusEnabled\"> 
   <boolean>false<\/boolean> 
  <\/void> 
 <\/object> 
<\/java> 
",
formIndex:10100,
location:"810,290",
name:"bean_workflow",
size:"90,100",
typeid:12,
usesUI:true,
uuid:"e955aae2-b8a3-46d7-870c-845cd943a401"
},
{
height:400,
partType:5,
typeid:19,
uuid:"fba59932-d9fc-4a6f-9d14-11224078bc90"
}
],
name:"DATASUTRA_0F_solution",
navigatorID:"-1",
onDeleteAllRecordsCmdMethodID:"-1",
onDeleteRecordCmdMethodID:"-1",
onDuplicateRecordCmdMethodID:"-1",
onFindCmdMethodID:"-1",
onInvertRecordsCmdMethodID:"-1",
onLoadMethodID:"f5f953e8-1275-4823-afd8-dfab31b6bb8f",
onNewRecordCmdMethodID:"-1",
onNextRecordCmdMethodID:"-1",
onOmitRecordCmdMethodID:"-1",
onPreviousRecordCmdMethodID:"-1",
onPrintPreviewCmdMethodID:"-1",
onSearchCmdMethodID:"-1",
onShowAllRecordsCmdMethodID:"-1",
onShowMethodID:"6f7d6e0a-d0cc-42be-9565-8ad8a387418f",
onShowOmittedRecordsCmdMethodID:"-1",
onSortCmdMethodID:"-1",
paperPrintScale:100,
showInMenu:true,
size:"700,400",
styleName:"_DATASUTRA_",
typeid:3,
uuid:"6773cbcc-5fc2-4c8d-8e72-d63d205de2a2",
view:5