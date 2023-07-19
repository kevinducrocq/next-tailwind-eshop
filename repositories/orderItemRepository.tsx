import query from "@/utils/dbMysql";

export const findAllWithProducts = async () => {
  try {
    const result = await query({
      query:
        "SELECT oi.*, p.* FROM order_items oi INNER JOIN products p ON oi.productId = p.id",
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des articles de commande :",
      error
    );
  }
};

export const findWithProductsByOrderId = async (orderId) => {
  try {
    const result = await query({
      query: `
        SELECT oi.*, p.*
        FROM order_items oi
        INNER JOIN products p ON oi.productId = p.id
        WHERE oi.orderId = ?
      `,
      values: [orderId],
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des articles de commande :",
      error
    );
  }
};

export const create = async (orderItem) => {
  try {
    const result = await query({
      query:
        "INSERT INTO order_items (orderId, productId, quantity) VALUES (?, ?, ?)",
      values: [orderItem.orderId, orderItem.productId, orderItem.quantity],
    });
    return result.insertId;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création de l'article de commande :",
      error
    );
  }
};

export const update = async (orderItemId, quantity) => {
  try {
    const result = await query({
      query: "UPDATE order_items SET quantity = ? WHERE id = ?",
      values: [quantity, orderItemId],
    });
    return result.insertId;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la mise à jour de l'article de commande :",
      error
    );
  }
};

export const remove = async (orderItemId) => {
  try {
    const result = await query({
      query: "DELETE FROM order_items WHERE id = ?",
      values: [orderItemId],
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression de l'article de commande :",
      error
    );
  }
};
