import query from "@/utils/dbMysql";

const findAllUsersApi = async (req, res) => {
  try {
    const users = await fetchUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des utilisateurs :",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
};

const fetchUsers = async () => {
  try {
    // RÉCUPÉRER TOUS LES UTILISATEURS
    const result = await query({ query: "SELECT * FROM users" });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'exécution de la requête :",
      error
    );
    throw error;
  }
};

export default findAllUsersApi;
