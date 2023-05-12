import query from "@/utils/dbMysql";

const findUserByIdApi = (req, res) => {
  const fetchUser = async (id) => {
    //RECUPERER UN UTILSATEUR PAR SON ID
    try {
      const result = await query({
        query: "SELECT * FROM users WHERE id = ?",
        values: [id],
        singleResult: true,
      });
      res.status(200).json(result);
    } catch (error) {
      res.json(error);
      res.status(405).end();
      console.log("error :", error);
    }
  };
  fetchUser(req.query.id);
};

export default findUserByIdApi;
