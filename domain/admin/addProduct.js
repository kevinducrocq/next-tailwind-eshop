import { getError } from "@/utils/error";

const addProduct = async (
  name,
  slug,
  images,
  price,
  brand,
  countInStock,
  description,
  selectedCategoryId
) => {
  try {
    const productResponse = await fetch("/api/admin/addProductApi", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name,
        slug,
        images,
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

    return await productResponse.json();
  } catch (err) {
    console.error(err);
  }
};

export default addProduct;
