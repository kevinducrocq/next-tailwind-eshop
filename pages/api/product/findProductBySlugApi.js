import query from "@/utils/dbMysql";

const findProductBySlugApi = (req, res) => {
  const fetchProduct = async (slug) => {
    //RECUPERER UN PRODUIT PAR SON SLUG
    try {
      const result = await query({
        query: "SELECT * FROM products WHERE slug = ?",
        values: [slug],
      });
      res.status(200).json(result[0]);
    } catch (error) {
      console.log("error :", error);
    }
  };
  fetchProduct(req.query.slug);
};

export default findProductBySlugApi;
