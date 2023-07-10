import * as userService from "@/services/userService";

const findUserByIdApi = async (req, res) => {
  try {
    const user = await userService.findOneById(req.query.id);
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

export default findUserByIdApi;
