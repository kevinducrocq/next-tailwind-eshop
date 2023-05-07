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
          "INSERT INTO billing_address (userId, firstName, lastName, address, zip, city, country) VALUES(?,?,?,?,?,?,?)",
        values: [user.id, firstName, lastName, address, zip, city, country],
      });
      res.status(200).json(result);
    } catch (error) {
      console.log("error :", error);
    }
  };

  saveBillingAddress(
    req.body.firstName,
    req.body.lastName,
    req.body.address,
    req.body.zip,
    req.body.city,
    req.body.country
  );
};

export default saveBillingAddressApi;
