const fetchProducts = async (callback) => {
  try {
    const response = await fetch("/api/product/findAllCategories");
    const jsonProducts = await response.json();
    console.log(jsonProducts);
    callback(jsonProducts);
  } catch (err) {
    console.error(err);
  }
};

export default fetchProducts;
