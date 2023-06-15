import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import * as orderService from "@/services/orderService";
import paypal from "@paypal/checkout-server-sdk";

const payOrderApi = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Connectez-vous" });
    }

    const { user } = session;

    const { orderId, paymentData } = req.body;

    console.log("API", "orderId:", orderId, "paymentData:", paymentData);

    if (!orderId) {
      return res.status(400).json({ error: "ID de commande manquant" });
    }

    // Initialiser le SDK PayPal avec les informations d'authentification du mode sandbox
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;
    const environment = new paypal.core.SandboxEnvironment(
      clientId,
      clientSecret
    );
    const client = new paypal.core.PayPalHttpClient(environment);

    // Récupérer le paiement à partir de l'API PayPal
    const captureId = paymentData.orderID;
    const request = new paypal.orders.OrdersGetRequest(captureId);
    const response = await client.execute(request);

    // Vérifier si le paiement a été capturé avec succès
    if (response.result.status !== "COMPLETED") {
      return res
        .status(400)
        .json({ error: "Le paiement n'a pas été effectué avec succès" });
    }

    // Mettre à jour l'ordre dans la base de données
    const updatedOrder = await orderService.payOrder(orderId, user);

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
