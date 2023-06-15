import query from "@/utils/dbMysql";

export const findAll = async () => {
  try {
    const result = await query({ query: "SELECT * FROM products" });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des produits :",
      error
    );
  }
};

export const findProductById = async (id) => {
  try {
    const result = await query({
      query: "SELECT * FROM products WHERE id = ?",
      values: [id],
      singleResult: true,
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération du produit :",
      error
    );
  }
};

export const findProductBySlug = async (slug) => {
  try {
    const result = await query({
      query: "SELECT * FROM products WHERE slug = ?",
      values: [slug],
      singleResult: true,
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération du produit :",
      error
    );
  }
};

export const create = async (product) => {
  try {
    const result = await query({
      query: `
        INSERT INTO products (name, slug, image, price, brand, rating, numReviews, countInStock, description, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      values: [
        product.name,
        product.slug,
        product.image,
        product.price,
        product.brand,
        product.rating,
        product.numReviews,
        product.countInStock,
        product.description,
      ],
    });

    return result.insertId;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création du produit :",
      error
    );
  }
};

export const update = async (id, productFields) => {
  try {
    const fields = [];
    const values = [];
    for (const field in productFields) {
      fields.push(`${field} = ?`);
      values.push(productFields[field]);
    }

    const queryStr = `
      UPDATE products
      SET ${fields.join(", ")}
      WHERE id = ?
    `;
    const result = await query({
      query: queryStr,
      values: [...values, id],
    });

    // Vérifier si au moins une ligne a été modifiée dans la base de données
    if (result.affectedRows > 0) {
      return true; // La mise à jour a réussi
    } else {
      return false; // Aucune ligne n'a été modifiée (produit introuvable ou aucune modification nécessaire)
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la mise à jour du produit :",
      error
    );
    return false; // Une erreur s'est produite lors de la mise à jour
  }
};

export const remove = async (id) => {
  try {
    const result = await query({
      query: "DELETE FROM products WHERE id = ?",
      values: [id],
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression du produit :",
      error
    );
  }
};
