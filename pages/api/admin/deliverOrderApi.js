import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import * as orderService from "@/services/orderService";

const placeOrderApi = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || (session && !session.user?.isAdmin)) {
      return res.status(401).json({ error: "Connectez-vous" });
    }

    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ error: "ID de commande manquant" });
    }

    const updatedOrder = await orderService.deliverOrder(orderId);

    if (updatedOrder) {
      res.status(200).json(updatedOrder);
    } else {
      res
        .status(400)
        .json({ message: "Erreur lors de la modification de la commande" });
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la modification de la commande :",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la modification de la commande" });
  }
};

export default placeOrderApi;
