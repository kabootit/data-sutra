/**
 *
 * @properties={typeid:24,uuid:"f84220cd-95b7-4e9f-9e60-49aec03bc61d"}
 */
function REC_on_select()
{

/*
 *	TITLE    :	REC_on_select
 *			  	
 *	MODULE   :	start_CRM_mosaic
 *			  	
 *	ABOUT    :	
 *			  	
 *	INPUT    :	
 *			  	
 *	OUTPUT   :	
 *			  	
 *	REQUIRES :	
 *			  	
 *	USAGE    :	REC_on_select()
 *			  	
 *	MODIFIED :	Aug 24, 1995 - Bob Cusick, ClickWare
 *			  	
 */

var HTML = '<html><head></head><body>'

var maxReturedRows = 5
var query = "select oi.description , SUM(oi.price_each*oi.quantity) " +
"from order_items oi, orders o "+
"where oi.order_id = o.order_id "+
"and o.company_id = " + company_id +
" group by oi.description "+
"order by 2 desc"

//clear pieChart
for (var i =1 ; i<=5 ; i++) {
	if (elements['chart_pie'] != null) {
		// set legends of chart
		elements.chart_pie.setLegends(i-1,"")
		elements.chart_pie.setValues(i-1, 0, 0)
	}
}

var dataset = databaseManager.getDataSetByQuery(controller.getServerName(), query, null, maxReturedRows)
var maxRows = dataset.getMaxRowIndex()

if(maxRows == 0){
	//nothing sold to this customer
	HTML += '<div align="center"><b>No orders for this company.</b></div>'
	html_sales = HTML
	elements.chart_pie.visible = false
}
else {
	HTML += '<table border=0 cellpadding=1 width=100%>\n'
	HTML += '<tr bgcolor="#cccccc"><td colspan=2><b>Top 5 Products</b></td></tr>'
	
	elements.chart_pie.visible = true
	
	for (var i = 1 ; i <= maxRows ; i++ ) {
		dataset.rowIndex = i
		if (dataset[1] != null && dataset[2] != null) {
			if (elements['chart_pie'] != null) {
				elements.chart_pie.setLegends(i-1,dataset[1])// set legends of chart
				elements.chart_pie.setValues(i-1, 0, dataset[2])
			}
			HTML += '<tr><td nowrap>'+ dataset[1]+
				'</td><td nowrap align="right">'+ utils.numberFormat(dataset[2], '$###,###,###.00')+'</td></tr>'
		}
	}
	
	//put total line at bottom
	var totalLine = dataset.getColumnAsArray(2)
	totalLine = totalLine.join('+')
	totalLine = eval(totalLine)
	HTML += '<tr><td nowrap colspan=2 align="right"><b>Total: '+
		utils.numberFormat(totalLine, '$###,###,###.00') + "</b></td></tr>"
	HTML += '</table>\n'+'</body>\n' +'</html>'
	
	html_sales = HTML
}
}
