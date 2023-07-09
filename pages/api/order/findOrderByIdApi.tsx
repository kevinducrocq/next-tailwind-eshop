import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import * as orderService from "@/services/orderService";

const findOrderByIdApi = async (req, res) => {
  try {
    // VÉRIFICATION DE LA SESSION ET DE L'UTILISATEUR CONNECTÉ
    const session = await getServerSession(req, res, authOptions);
    if (!session || (session && !session.user?.isAdmin)) {
      return res.status(401).json({ error: "Connectez-vous" });
    }

    const { user } = session;

    // RÉCUPÉRATION DE LA COMMANDE PAR SON ID ET L'UTILISATEUR CONNECTÉ
    const orderId = req.query.id;
    const order = await orderService.findOneById(orderId, user, [
      "addresses",
      "orderItems",
    ]);

    res.status(200).json(order);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération de la commande :",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

export default findOrderByIdApi;
