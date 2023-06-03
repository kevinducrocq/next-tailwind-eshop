import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const deleteAddressApi = async (req, res) => {
  if (req.method !== "PUT") {
    // Vérifier si la méthode de la requête est PUT
    return res.status(400).json({ error: "Mauvaise méthode de requête" });
  }

  // VÉRIFICATION DE L'UTILISATEUR CONNECTÉ
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Connectez-vous" });
  }
  const { user } = session;

  const shippingAddressId = req.body.id;

  try {
    //"SUPPRIME" TOUTES UNE ADRESSE DE LIVRAISON DU PROFIL DE L'UTILISATEUR (n'est pas supprimée de la bdd, si reliée à une commande)
    const result = await query({
      query:
        "UPDATE shipping_address SET isVisible = 0 WHERE id = ? AND userId = ?",
      values: [shippingAddressId, user.id],
    });

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Adresse de livraison non trouvée" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression de l'adresse de livraison :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la suppression de l'adresse de livraison",
    });
  }
};

export default deleteAddressApi;
