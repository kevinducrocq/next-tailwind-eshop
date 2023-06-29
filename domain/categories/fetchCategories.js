const fetchCategories = async (callback) => {
  try {
    const response = await fetch("/api/categories/findAllCategoriesApi");
    const jsonCategories = await response.json();
    callback(jsonCategories);
  } catch (err) {
    console.error(err);
  }
};

export default fetchCategories;
