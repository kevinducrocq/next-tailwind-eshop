import query from "@/utils/dbMysql";

export const findAll = async () => {
  try {
    const result = await query({ query: "SELECT * FROM categories" });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des catégories :",
      error
    );
    throw error;
  }
};

export const findCategoryById = async (id) => {
  try {
    const result = await query({
      query: "SELECT * FROM categories WHERE id = ?",
      values: [id],
      singleResult: true,
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération de la catégorie :",
      error
    );
    throw error;
  }
};

export const findCategoriesByProductId = async (productId) => {
  try {
    const result = await query({
      query: `
        SELECT c.*
        FROM categories c
        INNER JOIN product_categories pc ON c.id = pc.category_id
        WHERE pc.product_id = ?
      `,
      values: [productId],
      singleResult: true,
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des catégories du produit :",
      error
    );
    throw error;
  }
};

export const create = async (category) => {
  try {
    const result = await query({
      query: `
        INSERT INTO categories (name, isActive)
        VALUES (?, ?)
      `,
      values: [category.name, category.isActive],
    });

    return result.insertId;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création de la catégorie :",
      error
    );
    throw error;
  }
};

export const update = async (id, categoryFields) => {
  try {
    const fields = [];
    const values = [];
    for (const field in categoryFields) {
      fields.push(`${field} = ?`);
      values.push(categoryFields[field]);
    }

    const queryStr = `
      UPDATE categories
      SET ${fields.join(", ")}
      WHERE id = ?
    `;
    const result = await query({
      query: queryStr,
      values: [...values, id],
    });

    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la mise à jour de la catégorie :",
      error
    );
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const result = await query({
      query: "DELETE FROM categories WHERE id = ?",
      values: [id],
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression de la catégorie :",
      error
    );
    throw error;
  }
};

export const countCategories = async () => {
  try {
    const result = await query({
      query: "SELECT COUNT(*) AS count FROM categories",
      singleResult: true,
    });
    return result.count;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du comptage des catégories :",
      error
    );
    throw error;
  }
};
