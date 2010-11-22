/**
 *
 * @properties={type:12,typeid:36,uuid:"0faaeae7-e61f-4da0-b1c9-e6b82fa5112a"}
 */
function address_csz()
{
var address = ''

if (city && state) {
	address += city + ', ' + state
}
else if (city && !state) {
	address += city
}
else if (state && !city) {
	address += state
}

if (zipcode) {
	address += ' ' + zipcode
}

return address
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"aca13ea6-e850-43dd-b17a-d97452b8545d"}
 */
function address_display_calc()
{
var address = null

if(line_1) address = line_1

if(line_2 && address)
{
	address += '\n' + line_2
}
else if(line_2 && !address)
{
	address = line_2
}

if(line_3 && address)
{
	address += '\n' + line_3
}
else if(line_3 && !address)
{
	address = line_3
}

if(line_4 && address)
{
	address += '\n' + line_4
}
else if(line_4 && !address)
{
	address = line_4
}

if(line_5 && address)
{
	address += '\n' + line_5
}
else if(line_5 && !address)
{
	address = line_5
}

if(city || state || zip) address += '\n' + address_csz

return address
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"6c598de4-368b-4405-9e77-a8894a8626f7"}
 */
function select_address()
{


return line_1 +' - ' + address_csz
}
