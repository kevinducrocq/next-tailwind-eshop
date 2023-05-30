const fetchUserOrders = async (callback) => {
  try {
    const response = await fetch("/api/order/findUserOrdersApi");
    const jsonUserOrders = await response.json();
    callback(jsonUserOrders);
  } catch (err) {
    console.error(err);
  }
};

export default fetchUserOrders;
