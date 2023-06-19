import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import * as orderService from "@/services/orderService";

const payOrderApi = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Connectez-vous" });
    }

    const { user } = session;

    const { orderId, paymentData } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "ID de commande manquant" });
    }

    // Mettre à jour l'ordre dans la base de données
    const updatedOrder = await orderService.payOrder(
      orderId,
      user,
      paymentData
    );

    if (updatedOrder) {
      return res.status(200).json(updatedOrder);
    } else {
      return res
        .status(400)
        .json({ error: "Commande introuvable ou déjà payée" });
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du paiement de la commande :",
      error
    );
    return res
      .status(500)
      .json({ error: "Erreur lors du paiement de la commande" });
  }
};

export default payOrderApi;
