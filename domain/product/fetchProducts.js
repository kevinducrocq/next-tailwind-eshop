const fetchProducts = async (callback) => {
  try {
    const response = await fetch("/api/product/findAllProducts");
    const jsonProducts = await response.json();
    console.log(jsonProducts);
    callback(jsonProducts);
  } catch (err) {
    console.error(err);
  }
};

export default fetchProducts;
