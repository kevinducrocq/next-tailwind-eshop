import * as productService from "@/services/productService";

const findProductByIdApi = async (req, res) => {
  try {
    const product = await productService.findById(req.query.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Produit non trouvé" });
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la recherche du produit :",
      error
    );
    res.status(500).json({ error: "Erreur lors de la recherche du produit" });
  }
};

export default findProductByIdApi;
