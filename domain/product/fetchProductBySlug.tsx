const fetchProductBySlug = async (slug, callback) => {
  try {
    const response = await fetch(
      "/api/product/findProductBySlugApi?slug=" + slug
    );
    const jsonProduct = await response.json();
    callback(jsonProduct);
  } catch (err) {
    console.error(err);
  }
};

export default fetchProductBySlug;
