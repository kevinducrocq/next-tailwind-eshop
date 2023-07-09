import { getTotalUsers } from "@/services/userService";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const totalProductsApi = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session || (session && !session.user?.isAdmin)) {
    return res.status(401).json({ error: "Connectez-vous" });
  }

  try {
    const result = await getTotalUsers();
    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du calcul du nombre de produits",
      error
    );
    res.status(500).json({
      error: "Une erreur s'est produite lors du calcul du nombre de produits",
      details: error.message, // Ajouter le message d'erreur détaillé
    });
  }
};

export default totalProductsApi;
