import query from "@/utils/dbMysql";

const findProductBySlugApi = (req, res) => {
  return new Promise((resolve) => {
    const fetchProduct = async (slug) => {
      //RECUPERER UN PRODUIT PAR SON SLUG
      try {
        const result = await query({
          query: "SELECT * FROM products WHERE slug = ?",
          values: [slug],
        });
        res.status(200).json(result[0]);
        resolve();
      } catch (error) {
        res.json(error);
        res.status(405).end();
        resolve();
        console.log("error :", error);
      }
    };
    fetchProduct(req.query.slug);
  });
};

export default findProductBySlugApi;
