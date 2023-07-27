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

export const updateProduct = async (
  productId,
  name,
  slug,
  image,
  price,
  brand,
  categoryId, // Nouveau paramètre categoryId
  countInStock,
  description
) => {
  let updatedProduct = await productRepository.update(productId, {
    name,
    slug,
    image,
    price,
    brand,
    countInStock,
    description,
  });

  // Mettre à jour la catégorie du produit dans la table de liaison product_categories
  await productRepository.updateProductCategory(productId, categoryId);

  if (!updatedProduct) {
    throw new Error("Erreur lors de la modification du produit");
  }

  return updatedProduct;
};

export const addProduct = async (
  name,
  slug,
  images,
  price,
  brand,
  countInStock,
  description,
  selectedCategoryId
) => {
  let newProductId = await productRepository.create({
    name,
    slug,
    images,
    price,
    brand,
    countInStock,
    description,
  });

  console.log(newProductId);

  // Mettre à jour la catégorie du produit dans la table de liaison product_categories
  await productRepository.setProductCategory(newProductId, selectedCategoryId);

  if (!newProductId) {
    throw new Error("Erreur lors de l'ajout du produit");
  }

  return newProductId;
};
