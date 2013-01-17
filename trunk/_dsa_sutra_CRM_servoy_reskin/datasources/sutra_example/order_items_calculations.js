/**
 *
 * @properties={type:6,typeid:36,uuid:"8926a34b-1d38-48c8-a8f2-853a6b3437be"}
 */
function extended_cost()
{
if(quantity && cost_each)
{
	return cost_each * quantity
}
else
{
	return null
}
}

/**
 *
 * @properties={type:6,typeid:36,uuid:"1e396e47-ff6b-4f02-a1f3-e2ebe22c27d3"}
 */
function extended_price()
{
if(quantity && price_each)
{
	return price_each * quantity
}
else
{
	return null
}
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"1d286252-313e-49e1-b268-97ad73667dd9"}
 */
function order_number()
{
return crm_order_items_to_orders.order_number;
}
