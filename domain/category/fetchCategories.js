const fetchCategories = async (callback) => {
  try {
    const response = await fetch("/api/product/findAllCategoriessApi");
    const jsonCategories = await response.json();
    console.log(jsonCategories);
    callback(jsonCategories);
  } catch (err) {
    console.error(err);
  }
};

export default fetchCategories;
