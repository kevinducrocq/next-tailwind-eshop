const fetchOrderById = async (id, callback) => {
  try {
    const response = await fetch("/api/order/findOrderByIdApi?id=" + id);
    const jsonOrder = await response.json();
    callback(jsonOrder);
  } catch (err) {
    console.error(err);
  }
};

export default fetchOrderById;
