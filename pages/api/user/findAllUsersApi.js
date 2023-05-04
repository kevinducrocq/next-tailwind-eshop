import query from "@/utils/dbMysql";

const findAllUsersApi = (req, res) => {
  const fetchUsers = async () => {
    //RECUPERER TOUS LES PRODUITS
    try {
      const result = await query({ query: "SELECT * FROM users" });
      res.status(200).json(result);
    } catch (error) {
      console.log("error :", error);
    }
  };
  fetchUsers();
};

export default findAllUsersApi;
