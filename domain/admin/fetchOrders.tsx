const fetchOrders = async (callback) => {
  try {
    const response = await fetch("/api/admin/findAllOrdersApi");
    const jsonOrders = await response.json();
    callback(jsonOrders);
  } catch (err) {
    console.error(err);
  }
};

export default fetchOrders;
