const fetchTotalUsers = async (callback) => {
  try {
    const response = await fetch("/api/admin/totalUsersApi");
    const jsonNumOrders = await response.json();
    callback(jsonNumOrders);
  } catch (err) {
    console.error(err);
  }
};

export default fetchTotalUsers;
