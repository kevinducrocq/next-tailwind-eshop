const fetchSalesData = async (callback) => {
  try {
    const response = await fetch("/api/admin/salesDataApi");
    const jsonDataOrders = await response.json();
    callback(jsonDataOrders);
  } catch (err) {
    console.error(err);
  }
};

export default fetchSalesData;
