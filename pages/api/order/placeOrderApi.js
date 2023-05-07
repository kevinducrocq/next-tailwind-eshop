import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

//ENREGISTRER UNE COMMANDE
const placeOrderApi = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).send({ message: "Connectez-vous" });
  }

  const { user } = session;

  const placeOrder = async (
    shipping_address_id,
    billing_address_id,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  ) => {
    try {
      const result = await query({
        query:
          "INSERT INTO orders (userId, shipping_address_id, billing_address_id, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice) VALUES(?,?,?,?,?,?,?,?)",
        values: [
          user.id,
          shipping_address_id,
          billing_address_id,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        ],
      });
      res.status(200).json(result);
    } catch (error) {
      console.log("error :", error);
    }
  };
  placeOrder(
    req.body.shipping_address_id,
    req.body.billing_address_id,
    req.body.paymentMethod,
    req.body.itemsPrice,
    req.body.shippingPrice,
    req.body.taxPrice,
    req.body.totalPrice
  );
};

export default placeOrderApi;
