import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const findOrderByIdApi = async (req, res) => {
  // VERIFIE LA SESSION ET L'UTILISATEUR CONNECTE
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ message: "Connectez-vous" });
  }
  const { user } = session;

  return new Promise((resolve) => {
    const fetchOrder = async (id) => {
      //RECUPERER UNE COMMANDE PAR SON ID
      try {
        const order = await query({
          query: "SELECT * FROM orders WHERE id = ? AND userId = ?",
          values: [id, user.id],
          singleResult: true,
        });

        if (!order) {
          return res.status(403).send({ error: "forbidden" });
        }

        const shippingAddress = await query({
          query: "SELECT * FROM shipping_address WHERE id = ?",
          values: [order.shipping_address_id],
          singleResult: true,
        });

        const billingAddress = await query({
          query: "SELECT * FROM billing_address WHERE userId = ?",
          values: [order.billing_address_id],
          singleResult: true,
        });

        const orderItems = await query({
          query:
            "SELECT * FROM order_items LEFT JOIN products ON order_items.productId = products.id WHERE order_items.orderId = ?",
          values: [id],
        });

        res
          .status(200)
          .json({ ...order, orderItems, shippingAddress, billingAddress });

        resolve();
      } catch (error) {
        res.json(error);
        res.status(405).end();
        resolve();
        console.log("error :", error);
      }
    };
    fetchOrder(req.query.id);
  });
};

export default findOrderByIdApi;
