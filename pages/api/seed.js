import data from "@/utils/data";
import query from "@/utils/dbMysql";

const handler = async (req, res) => {
  try {
    // VIDER LES TABLES
    await query({
      query: "TRUNCATE shipping_address",
      force: true,
    });

    await query({
      query: "TRUNCATE billing_address",
      force: true,
    });

    await query({
      query: "TRUNCATE product_categories",
      force: true,
    });

    await query({
      query: "TRUNCATE users",
      force: true,
    });

    await query({
      query: "TRUNCATE categories",
      force: true,
    });

    await query({
      query: "TRUNCATE products",
      force: true,
    });

    await query({
      query: "TRUNCATE orders",
      force: true,
    });

    // USERS
    data.users.forEach(async (user) => {
      const result = await query({
        query:
          "INSERT INTO users(firstName, lastName, email, password, isAdmin) VALUES(?, ?, ?, ?, ?);",
        values: [
          user.firstName,
          user.lastName,
          user.email,
          user.password,
          user.isAdmin,
        ],
      });
      console.log("ttt", result);
    });

    // CATEGORIES
    data.categories.forEach(async (category) => {
      const result = await query({
        query: "INSERT INTO categories(id, name) VALUES(?, ?);",
        values: [category.id, category.name],
      });
      console.log("ttt", result);
    });

    // PRODUITS
    data.products.forEach(async (product) => {
      const result = await query({
        query:
          "INSERT INTO products(id, name, slug, image, price, brand, rating, numReviews, countInStock, description) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        values: [
          product.id,
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
      console.log("ttt", result);

      product.categories.forEach(async (category) => {
        const result = await query({
          query:
            "INSERT INTO product_categories(product_id, category_id) VALUES(?, ?);",
          values: [product.id, category],
        });
        console.log("ttt", result);
      });
      res.status(200).send({ message: "SUCCEEDED" });
    });
  } catch (error) {
    res.status(401).send({ message: "Raté" });
    console.log("error :", error);
  }
};

export default handler;
