import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const findUserOrdersApi = async (req, res) => {
  // VERIFIE LA SESSION ET L'UTILISATEUR CONNECTE
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ message: "Connectez-vous" });
  }
  const { user } = session;

  const fetchOrders = async () => {
    //RECUPERER TOUTES LES COMMANDES D'UN UTILISATEUR
    try {
      const orders = await query({
        query:
          "SELECT orders.*, order_items.*, shipping_address.*, billing_address.* FROM orders JOIN order_items ON orders.id = order_items.orderId JOIN shipping_address ON orders.shipping_address_id = shipping_address.id JOIN billing_address ON orders.billing_address_id = billing_address.id WHERE orders.userId = ?",
        values: [user.id],
      });

      if (!orders) {
        return res.status(403).send({ error: "forbidden" });
      }
      res.status(200).json({ orders });
    } catch (error) {
      res.json(error);
      res.status(405).end();

      console.log("error :", error);
    }
  };
  fetchOrders();
};
export default findUserOrdersApi;
