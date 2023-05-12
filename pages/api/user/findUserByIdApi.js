import query from "@/utils/dbMysql";

const findUserByIdApi = (req, res) => {
  return new Promise((resolve) => {
    const fetchUser = async (id) => {
      //RECUPERER UN UTILSATEUR PAR SON ID
      try {
        const result = await query({
          query: "SELECT * FROM users WHERE id = ?",
          values: [id],
        });
        res.status(200).json(result);
        resolve();
      } catch (error) {
        res.json(error);
        res.status(405).end();
        resolve();
        console.log("error :", error);
      }
    };
    fetchUser(req.query.id);
  });
};

export default findUserByIdApi;
