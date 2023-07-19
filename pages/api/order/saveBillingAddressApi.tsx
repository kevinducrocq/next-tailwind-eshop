import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import * as billingAddressService from "@/services/billingAddressService";

const saveBillingAddressApi = async (req, res) => {
  try {
    // Vérification de la session
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }

    const { user } = session;

    // Enregistrer l'adresse de facturation
    const result = await billingAddressService.createBillingAddress(
      user,
      req.body
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'insertion en BDD :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de l'insertion en BDD",
      details: error.message,
    });
  }
};

export default saveBillingAddressApi;
