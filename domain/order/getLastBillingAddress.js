const getLastBillingAddress = async (callback) => {
  try {
    const response = await fetch("/api/order/getLastBillingAddressApi");
    const jsonOrders = await response.json();
    callback(jsonOrders);
  } catch (err) {
    console.error(err);
  }
};

export default getLastBillingAddress;
