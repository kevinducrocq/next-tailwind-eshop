import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import * as orderService from "@/services/orderService";

const placeOrderApi = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).send({ message: "Connectez-vous" });
    }

    const { user } = session;

    const order = await orderService.createOrder(req.body, user);

    if (order) {
      res.status(200).json(order);
    } else {
      res
        .status(400)
        .json({ message: "Erreur lors de la création de la commande" });
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création de la commande :",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la commande" });
  }
};

export default placeOrderApi;
