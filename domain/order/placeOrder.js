const placeOrder = async (
  shipping_address_id,
  billing_address_id,
  paymentMethod,
  itemsPrice,
  shippingPrice,
  taxPrice,
  totalPrice,
  orderItems
) => {
  try {
    await fetch("/api/order/placeOrderApi", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        shipping_address_id,
        billing_address_id,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        orderItems,
      }),
    });
  } catch (err) {
    console.error(err);
  }
};

export default placeOrder;
