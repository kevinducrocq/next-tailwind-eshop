const fetchTotalProducts = async (callback) => {
  try {
    const response = await fetch("/api/admin/totalProductsApi");
    const jsonNumOrders = await response.json();
    callback(jsonNumOrders);
  } catch (err) {
    console.error(err);
  }
};

export default fetchTotalProducts;
