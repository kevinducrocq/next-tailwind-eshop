import query from "@/utils/dbMysql";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const findOrderByIdApi = async (req, res) => {
  try {
    // VÉRIFICATION DE LA SESSION ET DE L'UTILISATEUR CONNECTÉ
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).send({ message: "Connectez-vous" });
    }
    const { user } = session;

    // RÉCUPÉRATION DE LA COMMANDE PAR SON ID ET L'UTILISATEUR CONNECTÉ
    const orderId = req.query.id;
    const order = await query({
      query: `
        SELECT *
        FROM orders
        WHERE id = ? AND userId = ?
      `,
      values: [orderId, user.id],
      singleResult: true,
    });

    if (!order) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    // RÉCUPÉRATION DE L'ADRESSE DE LIVRAISON
    const shippingAddress = await query({
      query: `
        SELECT *
        FROM shipping_address
        WHERE id = ?
      `,
      values: [order.shipping_address_id],
      singleResult: true,
    });

    // RÉCUPÉRATION DE L'ADRESSE DE FACTURATION
    const billingAddress = await query({
      query: `
        SELECT *
        FROM billing_address
        WHERE id = ?
      `,
      values: [order.billing_address_id],
      singleResult: true,
    });

    // RÉCUPÉRATION DES PRODUITS DE LA COMMANDE
    const orderItems = await query({
      query: `
        SELECT OI.*, P.*
        FROM order_items AS OI
        JOIN products AS P ON OI.productId = P.id
        WHERE OI.orderId = ?
      `,
      values: [orderId],
    });

    res
      .status(200)
      .json({ ...order, orderItems, shippingAddress, billingAddress });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération de la commande :",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

export default findOrderByIdApi;
