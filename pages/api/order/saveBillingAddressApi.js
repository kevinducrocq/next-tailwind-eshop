import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

//ENREGISTRER UNE ADRESSE DE FACTURATION

const saveBillingAddressApi = async (req, res) => {
  // VERIFICATION SESSION
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  const saveBillingAddress = async (
    billingFirstName,
    billingLastName,
    billingStreet,
    billingZip,
    billingCity,
    billingCountry
  ) => {
    try {
      const result = await query({
        query:
          "INSERT INTO billing_address (userId, billingFirstName, billingLastName, billingStreet, billingZip, billingCity, billingCountry) VALUES(?,?,?,?,?,?,?)",
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
      res.status(400).json({ message: "Erreur lors de l'insertion en BDD" });
      console.log("error :", error);
    }
  };

  saveBillingAddress(
    req.body.billingFirstName,
    req.body.billingLastName,
    req.body.billingStreet,
    req.body.billingZip,
    req.body.billingCity,
    req.body.billingCountry
  );
};

export default saveBillingAddressApi;
