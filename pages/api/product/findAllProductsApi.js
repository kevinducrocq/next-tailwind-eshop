import query from "@/utils/dbMysql";

const findAllProductsApi = (req, res) => {
  const fetchProducts = async () => {
    //RECUPERER TOUS LES PRODUITS
    try {
      const result = await query({ query: "SELECT * FROM products" });
      res.status(200).json(result);
    } catch (error) {
      res.json(error);
      res.status(405).end();
      console.log("error :", error);
    }
  };
  fetchProducts();
};

export default findAllProductsApi;
