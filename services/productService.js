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
