import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const findUserOrdersApi = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ message: "Connectez-vous" });
  }
  const { user } = session;

  try {
    // Récupérer les commandes de l'utilisateur
    const orders = await query({
      query:
        "SELECT O.*, BA.billingFirstName, BA.billingLastName, BA.billingStreet, BA.billingZip, BA.billingCity, BA.billingCountry, SA.shippingFirstName, SA.shippingLastName, SA.shippingStreet, SA.shippingZip, SA.shippingCity, SA.shippingCountry FROM ORDERS AS O JOIN billing_address AS BA ON O.billing_address_id = BA.id JOIN shipping_address AS SA ON O.shipping_address_id = SA.id WHERE O.userId = ?",
      values: [user.id],
    });

    // Récupérer les produits de chaque commande
    for (const order of orders) {
      const orderItems = await query({
        query:
          "SELECT OI.*, P.* FROM order_items AS OI JOIN products AS P ON OI.productId = P.id WHERE OI.orderId = ?",
        values: [order.id],
      });

      order.orderItems = orderItems;
    }

    if (!orders) {
      return res.status(403).send({ error: "forbidden" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default findUserOrdersApi;
