const fetchTotalAmount = async (callback) => {
  try {
    const response = await fetch("/api/admin/totalAmountApi");
    const jsonAmountOrders = await response.json();
    callback(jsonAmountOrders);
  } catch (err) {
    console.error(err);
  }
};

export default fetchTotalAmount;
