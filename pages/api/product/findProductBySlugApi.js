import query from "@/utils/dbMysql";

const findProductBySlugApi = async (req, res) => {
  try {
    const slug = req.query.slug;
    const product = await fetchProduct(slug);
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

const fetchProduct = async (slug) => {
  try {
    // RÉCUPÉRER UN PRODUIT PAR SON SLUG
    const result = await query({
      query: "SELECT * FROM products WHERE slug = ?",
      values: [slug],
    });
    return result[0];
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'exécution de la requête :",
      error
    );
    throw error;
  }
};

export default findProductBySlugApi;
