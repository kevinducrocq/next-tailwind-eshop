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
    shippingFirstName,
    shippingLastName,
    shippingStreet,
    shippingZip,
    shippingCity,
    shippingCountry
  ) => {
    try {
      const result = await query({
        query:
          "INSERT INTO shipping_address (userId, shippingFirstName, shippingLastName, shippingStreet, shippingZip, shippingCity, shippingCountry) VALUES(?,?,?,?,?,?,?)",
        values: [
          user.id,
          shippingFirstName,
          shippingLastName,
          shippingStreet,
          shippingZip,
          shippingCity,
          shippingCountry,
        ],
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de l'insertion en BDD" });
      console.log("error :", error);
    }
  };

  saveShippingAddress(
    req.body.shippingFirstName,
    req.body.shippingLastName,
    req.body.shippingStreet,
    req.body.shippingZip,
    req.body.shippingCity,
    req.body.shippingCountry
  );
};

export default saveShippingAddressApi;
