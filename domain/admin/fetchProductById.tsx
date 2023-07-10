const fetchProductById = async (id, callback) => {
  try {
    const response = await fetch("/api/admin/findProductByIdApi?id=" + id);
    const jsonUser = await response.json();
    callback(jsonUser);
  } catch (err) {
    console.error(err);
  }
};

export default fetchProductById;
