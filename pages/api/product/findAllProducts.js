import query from "@/utils/dbMysql";

const findAllProducts = (req, res) => {
  const fetchProducts = async () => {
    //RECUPERER TOUS LES PRODUITS
    try {
      const result = await query({ query: "SELECT * FROM products" });
      res.status(200).json(result);
    } catch (error) {
      console.log("error :", error);
    }
  };
  fetchProducts();
};

export default findAllProducts;
