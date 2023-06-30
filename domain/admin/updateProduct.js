import { getError } from "@/utils/error";

const updateProduct = async (
  productId,
  name,
  slug,
  image,
  price,
  brand,
  countInStock,
  description,
  selectedCategoryId
) => {
  try {
    const productResponse = await fetch("/api/admin/updateProductApi", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        productId,
        name,
        slug,
        image,
        price,
        brand,
        countInStock,
        description,
        selectedCategoryId,
      }),
    });

    if (productResponse.status > 400) {
      getError(productResponse);
      return;
    }
    const responseData = await productResponse.json();
    return responseData;
  } catch (err) {
    console.error(err);
  }
};

export default updateProduct;
