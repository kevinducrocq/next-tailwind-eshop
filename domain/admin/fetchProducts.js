const fetchProducts = async (callback) => {
  try {
    const response = await fetch("/api/admin/findAllProductsApi");
    const jsonProducts = await response.json();
    callback(jsonProducts);
  } catch (err) {
    console.error(err);
  }
};

export default fetchProducts;
