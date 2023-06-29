import { getError } from "@/utils/error";

const updateProduct = async (
  productId,
  name,
  slug,
  price,
  image,
  brand,
  selectedCategoryId,
  countInStock,
  description
) => {
  try {
    const productResponse = await fetch("/api/admin/updateProductApi", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        productId,
        name,
        slug,
        price,
        image,
        brand,
        selectedCategoryId,
        countInStock,
        description,
      }),
    });

    if (productResponse.status > 400) {
      getError(productResponse);
      return;
    }

    return await productResponse.json();
  } catch (err) {
    console.error(err);
  }
};

export default updateProduct;
