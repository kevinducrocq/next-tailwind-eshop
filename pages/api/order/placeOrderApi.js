import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const placeOrderApi = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).send({ message: "Connectez-vous" });
    }

    const { user } = session;

    const {
      shipping_address_id,
      billing_address_id,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      orderItems,
    } = req.body;

    const orderQueryResult = await query({
      query:
        "INSERT INTO orders (userId, shipping_address_id, billing_address_id, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      values: [
        user.id,
        shipping_address_id,
        billing_address_id,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      ],
    });

    if (orderQueryResult) {
      const orderId = orderQueryResult.insertId;

      await Promise.all(
        orderItems.map((orderItem) => {
          return query({
            query:
              "INSERT INTO order_items (orderId, productId, quantity) VALUES (?, ?, ?)",
            values: [orderId, orderItem.productId, orderItem.quantity],
          });
        })
      );

      res.status(200).json({ orderItems, orderId });
    } else {
      res
        .status(400)
        .json({ message: "Erreur lors de la création de la commande" });
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création de la commande :",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la commande" });
  }
};

export default placeOrderApi;
