import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const getLastBillingAddressApi = async (req, res) => {
  try {
    // VÉRIFICATION DE LA SESSION ET DE L'UTILISATEUR CONNECTÉ
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).send({ message: "Connectez-vous" });
    }
    const { user } = session;

    // RÉCUPÉRER LA DERNIÈRE ADRESSE DE FACTURATION
    const result = await query({
      query:
        "SELECT * FROM billing_address WHERE userId = ? ORDER BY id DESC LIMIT 1",
      values: [user.id],
      singleResult: true,
    });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Adresse de facturation non trouvée" });
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération de l'adresse de facturation :",
      error
    );
    res
      .status(500)
      .json({
        error: "Erreur lors de la récupération de l'adresse de facturation",
      });
  }
};

export default getLastBillingAddressApi;
