dataSource:"db:/sutra_example/sutra_example",
items:[
{
anchors:11,
dataProviderID:"display_example",
displayType:8,
editable:false,
formIndex:10100,
location:"0,0",
scrollbars:36,
size:"120,20",
styleClass:"customlist",
transparent:true,
typeid:4,
uuid:"378fb864-486e-4bc2-b967-05da44bc4fe6"
},
{
height:20,
partType:5,
typeid:19,
uuid:"bb0a7688-b6ff-4459-91f8-6f563655f0e9"
},
{
formIndex:10200,
location:"290,70",
mediaOptions:14,
showClick:false,
showFocus:false,
size:"380,200",
tabSeq:-1,
text:"<html>
  <head>
    
  <\/head>
  <body>
    There is one html field on this layout.  It is based on a calculation that 
    must be created on each table you wish to use this list view with.  A good 
    naming practice is to name the display field display_&lt;name of table&gt;<br><br>Create 
    a global of type integer. Update your calculation to use this global, the 
    primary key of the table, and the field(s) you wish to display in the list<br><br>Attach 
    a REC_on_select() method to this form also. Modify as necessary. It sets 
    the global you just created to the value of the selected index, which, in 
    turn, is used for flipping the font on the field to be displayed and 
    highlighting the selected row<br>
  <\/body>
<\/html>",
transparent:true,
typeid:7,
uuid:"f63463e4-24c2-42ef-8d7f-8cb661a3c1e9",
verticalAlignment:1
}
],
name:"TMPL_0L_example_1L",
onRecordSelectionMethodID:"b2d6ccd4-4ef9-43f7-875b-47c397a65683",
paperPrintScale:100,
scrollbars:33,
size:"120,20",
styleClass:"list",
styleName:"_DATASUTRA_",
transparent:true,
typeid:3,
uuid:"101e3851-3ff6-4cda-8af9-5cdbe27dfa41",
view:4