import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import * as orderService from "@/services/orderService";

const payOrderApi = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).send({ message: "Connectez-vous" });
    }

    const { user } = session;

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "ID de commande manquant" });
    }

    const updatedOrder = await orderService.payOrder(orderId, user);

    if (updatedOrder) {
      res.status(200).json(updatedOrder);
    } else {
      res.status(400).json({ error: "Commande introuvable ou déjà payée" });
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du paiement de la commande :",
      error
    );
    res.status(500).json({ error: "Erreur lors du paiement de la commande" });
  }
};

export default payOrderApi;
