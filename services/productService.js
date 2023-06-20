import * as productRepository from "@/repositories/productRepository";

export const findAll = async () => {
  let products = await productRepository.findAll();

  if (!products) {
    throw new Error("No products found");
  }

  return products;
};

export const findBySlug = async (slug) => {
  let product = await productRepository.findProductBySlug(slug);

  if (!product) {
    throw new Error("No product found");
  }

  return product;
};

export const getTotalProducts = async () => {
  try {
    const totalProducts = await productRepository.countProducts();
    return totalProducts;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du calcul du montant des ventes :",
      error
    );
  }
};
