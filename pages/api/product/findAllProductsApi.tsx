import * as productService from "@/services/productService";

const findAllProductsApi = async (req, res) => {
  try {
    // Récupérer tous les produits
    const result = await productService.findAll();
    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des produits :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la récupération des produits",
      details: error.message, // Ajouter le message d'erreur détaillé
    });
  }
};

export default findAllProductsApi;
