import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

//ENREGISTRER UNE ADRESSE DE LIVRAISON

const saveShippingAddressApi = async (req, res) => {
  // VERIFICATION SESSION
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  const saveShippingAddress = async (
    firstName,
    lastName,
    address,
    zip,
    city,
    country
  ) => {
    try {
      const result = await query({
        query:
          "INSERT INTO shipping_address (userId, firstName, lastName, address, zip, city, country) VALUES(?,?,?,?,?,?,?)",
        values: [user.id, firstName, lastName, address, zip, city, country],
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de l'insertion en BDD" });
      console.log("error :", error);
    }
  };

  saveShippingAddress(
    req.body.firstName,
    req.body.lastName,
    req.body.address,
    req.body.zip,
    req.body.city,
    req.body.country
  );
};

export default saveShippingAddressApi;
