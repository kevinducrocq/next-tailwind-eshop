import query from "@/utils/dbMysql";

//RECUPERER TOUTES LES CATEGORIES
const findAllCategories = (req, res) => {
  const fetchCategories = async () => {
    try {
      const result = await query({ query: "SELECT * FROM categories" });
      res.status(200).json(result);
    } catch (error) {
      console.log("error :", error);
    }
  };
  fetchCategories();
};

export default findAllCategories;
