import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const getAddressesApi = async (req, res) => {
  // VERIFICATION DE L'UTILISATEUR CONNECTE
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send({ message: "Connectez-vous" });
  }
  const { user } = session;

  const fetchShippingAddress = async () => {
    //RECUPERER TOUTES LES ADRESSES DE LIVRAISON DE L'UTILISATEUR CONNECTE
    try {
      const result = await query({
        query:
          "SELECT * FROM shipping_address WHERE userId = ? AND isVisible=1",
        values: [user.id],
      });
      res.status(200).json(result);
    } catch (error) {
      console.log("error :", error);
    }
  };
  fetchShippingAddress();
};

export default getAddressesApi;
