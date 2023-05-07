import query from "@/utils/dbMysql";
import { getSession } from "next-auth/react";

//ENREGISTRER UNE COMMANDE
const placeOrderApi = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send({ message: "Connectez-vous" });
  }

  const { user } = session;

  const placeOrder = async (
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  ) => {
    try {
      const result = await query({
        query:
          "INSERT INTO orders (userId, shipping_address_id, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice) VALUES(?,?,?,?,?,?,?,?)",
        values: [
          user.id,
          orderItems,
          shippingAddress,
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
    req.body.cartItems,
    req.body.shippingAddress,
    req.body.paymentMethod,
    req.body.itemsPrice,
    req.body.shippingPrice,
    req.body.taxPrice,
    req.body.totalPrice
  );
};

export default placeOrderApi;
