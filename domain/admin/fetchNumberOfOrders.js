const fetchNumberOfOrders = async (callback) => {
  try {
    const response = await fetch("/api/admin/countOrdersApi");
    const jsonNumOrders = await response.json();
    callback(jsonNumOrders);
  } catch (err) {
    console.error(err);
  }
};

export default fetchNumberOfOrders;
