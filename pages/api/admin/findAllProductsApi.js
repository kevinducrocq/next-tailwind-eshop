import * as productService from "@/services/productService";

const findAllProductsApi = async (req, res) => {
  try {
    // Récupérer tous les produits avec les catégories
    const products = await productService.findAll(["categories"]);

    if (!products) {
      return res.status(403).send({ error: "forbidden" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default findAllProductsApi;
