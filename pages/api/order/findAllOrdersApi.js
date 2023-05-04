import query from "@/utils/dbMysql";

//RECUPERER TOUTES LES COMMANDES
const findAllOrdersApi = (req, res) => {
  const fetchOrders = async () => {
    try {
      const result = await query({ query: "SELECT * FROM orders" });
      res.status(200).json(result);
    } catch (error) {
      console.log("error :", error);
    }
  };
  fetchOrders();
};

export default findAllOrdersApi;
