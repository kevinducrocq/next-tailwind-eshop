import * as userService from "@/services/userService";

const findAllUsersApi = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs
    const users = await userService.findAll(["orders"]);

    if (!users) {
      return res.status(403).send({ error: "forbidden" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default findAllUsersApi;
