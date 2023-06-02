import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import * as orderService from "@/services/orderService";

const findUserOrdersApi = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ message: "Connectez-vous" });
  }
  const { user } = session;

  try {
    // Récupérer les commandes de l'utilisateur
    const orders = await orderService.findAllByUser(user, [
      "addresses",
      "orderItems",
    ]);

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
