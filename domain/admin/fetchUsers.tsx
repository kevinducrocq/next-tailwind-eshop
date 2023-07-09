const fetchProducts = async (callback) => {
  try {
    const response = await fetch("/api/admin/findAllUsersApi");
    const jsonUsers = await response.json();
    callback(jsonUsers);
  } catch (err) {
    console.error(err);
  }
};

export default fetchProducts;
