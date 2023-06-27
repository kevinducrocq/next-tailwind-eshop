import * as productRepository from "@/repositories/productRepository";
import * as categoryRepository from "@/repositories/categoryRepository";

export const findAll = async (groups = []) => {
  try {
    let products = await productRepository.findAll();

    for (const product of products) {
      if (!products) {
        throw new Error("No products found");
      }
      if (groups.includes("categories")) {
        const productId = product.id;
        product.categories = await categoryRepository.findCategoriesByProductId(
          productId
        );
      }
    }
    return products;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des produits :",
      error
    );
    throw error;
  }
};

export const findBySlug = async (slug) => {
  let product = await productRepository.findProductBySlug(slug);

  if (!product) {
    throw new Error("No product found");
  }

  return product;
};

export const findById = async (id) => {
  let product = await productRepository.findProductById(id);

  if (!product) {
    throw new Error("Pas de produit trouvé");
  }

  // Récupérer la catégorie du produit en effectuant une jointure dans la requête SQL
  const category = await categoryRepository.findCategoriesByProductId(id);

  if (!category) {
    throw new Error("No category found for the product");
  }

  // Ajouter la catégorie au produit
  product.category = category;

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
