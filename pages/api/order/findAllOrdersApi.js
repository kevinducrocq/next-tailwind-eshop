import query from "@/utils/dbMysql";

const findAllOrdersApi = async (req, res) => {
  try {
    // RÉCUPÉRER TOUTES LES COMMANDES
    const result = await query({ query: "SELECT * FROM orders" });
    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des commandes :",
      error
    );
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

export default findAllOrdersApi;
