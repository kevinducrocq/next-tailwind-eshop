import * as categoryService from "@/services/categoryService";

const findAllCategoriesApi = async (req, res) => {
  try {
    // Récupérer toutes les catégories
    const categories = await categoryService.findAll();

    if (!categories) {
      return res.status(403).send({ error: "forbidden" });
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default findAllCategoriesApi;
