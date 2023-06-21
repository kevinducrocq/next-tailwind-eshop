import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getSalesData } from "@/repositories/orderRepository";

const salesDataApi = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session || (session && !session.user?.isAdmin)) {
    return res.status(401).json({ error: "Connectez-vous" });
  }

  try {
    const result = await getSalesData();
    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération de données des ventes",
      error
    );
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération de données des ventes",
      details: error.message, // Ajouter le message d'erreur détaillé
    });
  }
};

export default salesDataApi;
