import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const saveBillingAddressApi = async (req, res) => {
  try {
    // Vérification de la session
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }

    const { user } = session;

    const {
      billingFirstName,
      billingLastName,
      billingStreet,
      billingZip,
      billingCity,
      billingCountry,
    } = req.body;

    // Enregistrer l'adresse de facturation
    const result = await query({
      query:
        "INSERT INTO billing_address (userId, billingFirstName, billingLastName, billingStreet, billingZip, billingCity, billingCountry) VALUES (?, ?, ?, ?, ?, ?, ?)",
      values: [
        user.id,
        billingFirstName,
        billingLastName,
        billingStreet,
        billingZip,
        billingCity,
        billingCountry,
      ],
    });

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
