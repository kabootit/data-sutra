dataSource:"db:/sutra/sutra_solution",
items:[
{
displaysTags:true,
formIndex:2,
horizontalAlignment:4,
imageMediaID:"E69F1129-50BE-4737-B9F8-3EB856FDA50F",
location:"5,5",
mediaOptions:1,
name:"btn_find",
onActionMethodID:"7013e286-1a9a-4128-a504-750f84a2a31e",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"27,24",
toolTipText:"<html>
  <head>
    
  <\/head>
  <body>
    Perform search<br>&#160;- <strong>shift<\/strong> key restricts search<br>&#160;- 
    <strong>control<\/strong> key extends search<br>&#160;- <strong>alt/option<\/strong> 
    key omits search<br>&#160;- # at beginning is a starts-with search (<strong>#<\/strong>Data)<br>&#160;- 
    # at end is an ends-with search (osaic<strong>#<\/strong>)<br>&#160;- # at 
    beginning and end is an exact match search (<strong>#<\/strong>Servoy<strong>#<\/strong>)
  <\/body>
<\/html>",
transparent:true,
typeid:7,
uuid:"519AE879-9FF5-470F-B40B-2C60B4C2DE41"
},
{
height:35,
partType:5,
typeid:19,
uuid:"7CCF88FE-57F1-485E-B82B-161E8E09F8E6"
},
{
anchors:11,
dataProviderID:"globals.DATASUTRA_find",
displaysTags:true,
formIndex:1,
location:"7,6",
name:"fld_find",
onActionMethodID:"c4056e4b-8840-4cca-9ed5-23a08565410a",
onFocusGainedMethodID:"-1",
onFocusLostMethodID:"-1",
scrollbars:36,
selectOnEnter:true,
size:"86,23",
styleClass:"fastfind",
toolTipText:"Not searching any field",
typeid:4,
uuid:"8EF50E90-AB78-4C60-B42A-FDC752DF8010"
},
{
anchors:3,
formIndex:4,
imageMediaID:"BC77DA60-5059-4C23-9E1E-E57B4FE1A912",
location:"69,5",
mediaOptions:1,
name:"find_end",
onActionMethodID:"94b6d117-2046-4255-8994-dfc4477a34f4",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"22,25",
toolTipText:"Clear search",
transparent:true,
typeid:7,
uuid:"A77F3B5A-4938-4F7E-B33D-0FEF661F231A"
},
{
anchors:15,
background:"#191919",
location:"0,0",
name:"color_dark",
showClick:false,
showFocus:false,
size:"100,35",
typeid:7,
uuid:"FE1CF76F-B004-4861-A2C4-FF27BFF92778"
}
],
name:"NAV_T_universal_list__WEB__fastfind",
navigatorID:"-1",
onShowMethodID:"D7681810-DAC1-4099-8CE2-D19A2EA3AB3F",
scrollbars:36,
size:"100,0",
styleName:"ds_WEB_desktop",
typeid:3,
uuid:"14339DF0-0A03-4077-9BF0-30D228407FA1"