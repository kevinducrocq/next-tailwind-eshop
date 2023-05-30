import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

//RECUPERER LA DERNIERE BILLING ADDRESS POUR UNE COMMANDE
const getLastBillingAddressApi = async (req, res) => {
  // VERIFIE LA SESSION ET L'UTILISATEUR CONNECTE
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ message: "Connectez-vous" });
  }
  const { user } = session;

  const fetchBillingAddress = async () => {
    try {
      const result = await query({
        query:
          "SELECT * FROM billing_address WHERE userId = ? ORDER BY id DESC LIMIT 1",
        values: [user.id],
        singleResult: true,
      });
      res.status(200).json(result);
    } catch (error) {
      console.log("error :", error);
    }
  };
  fetchBillingAddress();
};

export default getLastBillingAddressApi;
