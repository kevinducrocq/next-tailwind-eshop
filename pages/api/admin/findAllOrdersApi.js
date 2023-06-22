import * as orderService from "@/services/orderService";

const findAllOrdersApi = async (req, res) => {
  try {
    // Récupérer toutes les commandes
    const orders = await orderService.findAll(["users"]);

    if (!orders) {
      return res.status(403).send({ error: "forbidden" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default findAllOrdersApi;
