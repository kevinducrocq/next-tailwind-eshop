import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const deleteAddressApi = async (req, res) => {
  if (req.method !== "PUT") {
    return;
  }
  // VERIFICATION DE L'UTILISATEUR CONNECTE
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ message: "Connectez-vous" });
  }
  const { user } = session;

  const shippingAddressId = req.body.id;

  const deleteShippingAddress = async () => {
    //"SUPPRIME" TOUTES UNE ADRESSE DE LIVRAISON DU PROFIL DE L'UTILISATEUR (n'est pas supprimée de la bdd, si reliée à une commande)
    try {
      const result = await query({
        query:
          "UPDATE shipping_address SET isVisible=0 WHERE id= ? AND userId = ?",
        values: [shippingAddressId, user.id],
      });
      res.status(200).json(result);
    } catch (error) {
      console.log("error :", error);
      res.status(500).json({ message: "Il y a eu un problème" });
    }
  };
  deleteShippingAddress();
};

export default deleteAddressApi;
