import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import * as shippingAddressService from "@/services/shippingAddressService";

const getAddressesApi = async (req, res) => {
  try {
    // VÉRIFICATION DE L'UTILISATEUR CONNECTÉ
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      // Si l'utilisateur n'est pas connecté, renvoyer une réponse d'erreur
      return res.status(401).json({ error: "Connectez-vous" });
    }
    const { user } = session;

    // RÉCUPÉRER TOUTES LES ADRESSES DE LIVRAISON DE L'UTILISATEUR CONNECTÉ
    const addresses = await shippingAddressService.findAllByUser(user.id);

    res.status(200).json(addresses);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des adresses de livraison :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la récupération des adresses de livraison",
    });
  }
};

export default getAddressesApi;
