const fetchOrderById = async (id, callback, errorCallback) => {
  try {
    const response = await fetch("/api/order/findOrderByIdApi?id=" + id);
    const jsonOrder = await response.json();
    if (response.status >= 400) {
      errorCallback(jsonOrder);
      return;
    }
    callback(jsonOrder);
  } catch (err) {
    console.error(err);
  }
};

export default fetchOrderById;
