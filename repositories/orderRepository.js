import query from "@/utils/dbMysql";

export const findAll = async () => {
  try {
    const result = await query({ query: "SELECT * FROM orders" });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des commandes :",
      error
    );
  }
};

export const findWithUsersByOrderId = async (orderId) => {
  try {
    const result = await query({
      query: `
        SELECT o.*, u.*
        FROM orders o
        INNER JOIN users u ON o.userId = u.id
        WHERE o.id = ?
      `,
      values: [orderId],
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des commandes :",
      error
    );
  }
};

export const findBy = async (searchCriterias) => {
  try {
    const criterias = [];
    const values = [];
    for (const criteriaKey in searchCriterias) {
      criterias.push(`${criteriaKey} = ?`);
      values.push(searchCriterias[criteriaKey]);
    }
    const result = await query({
      query: `SELECT * FROM orders WHERE ${criterias.join(" AND ")}`,
      values: values,
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des commandes :",
      error
    );
  }
};

export const findOneBy = async (searchCriterias) => {
  try {
    const result = await findBy(searchCriterias);
    return result[0];
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération de la commande :",
      error
    );
  }
};

export const findOneById = async (id) => {
  try {
    const result = await query({
      query: `
        SELECT *
        FROM orders
        WHERE id = ?
      `,
      values: [id],
      singleResult: true,
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des de la commande :",
      error
    );
  }
};

export const create = async (order, user) => {
  try {
    const orderQueryResult = await query({
      query:
        "INSERT INTO orders (userId, shipping_address_id, billing_address_id, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      values: [
        user.id,
        order.shipping_address_id,
        order.billing_address_id,
        order.paymentMethod,
        order.itemsPrice,
        order.shippingPrice,
        order.taxPrice,
        order.totalPrice,
      ],
    });

    return orderQueryResult.insertId;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création de la commande :",
      error
    );
  }
};

export const update = async (id, orderFields) => {
  try {
    const updates = [];
    const values = [];
    for (const fieldKey in orderFields) {
      updates.push(`${fieldKey} = ?`);
      values.push(orderFields[fieldKey]);
    }
    await query({
      query: `UPDATE orders SET ${updates.join(", ")} WHERE id = ?`,
      values: [...values, id],
    });

    return await findOneById(id);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la mise à jour de la commande :",
      error
    );
  }
};

export const remove = async (id) => {
  try {
    const result = await query({
      query: `
          DELETE
          FROM orders
          WHERE id = ?
        `,
      values: [id],
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression de la commande :",
      error
    );
  }
};

export const countOrders = async () => {
  try {
    const result = await query({
      query: "SELECT COUNT(*) AS count FROM orders",
      singleResult: true,
    });
    return result.count;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du comptage des commandes :",
      error
    );
  }
};

export const calculateTotalSales = async () => {
  try {
    const result = await query({
      query: "SELECT SUM(totalPrice) AS totalSales FROM orders",
      singleResult: true,
    });
    return result.totalSales;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du calcul du total des ventes :",
      error
    );
  }
};

export const getSalesData = async () => {
  try {
    const result = await query({
      query: `
    SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, SUM(totalPrice) AS totalSales FROM orders GROUP BY month`,
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des données de vente :",
      error
    );
  }
};
