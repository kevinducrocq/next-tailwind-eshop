import query from "@/utils/dbMysql";

const findUserByIdApi = async (req, res) => {
  try {
    const userId = req.query.id;
    const user = await fetchUserById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la recherche de l'utilisateur :",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la recherche de l'utilisateur" });
  }
};

const fetchUserById = async (id) => {
  try {
    // RÉCUPÉRER UN UTILISATEUR PAR SON ID
    const result = await query({
      query: "SELECT * FROM users WHERE id = ?",
      values: [id],
      singleResult: true,
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'exécution de la requête :",
      error
    );
    throw error;
  }
};

export default findUserByIdApi;
