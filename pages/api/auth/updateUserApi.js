import * as userService from "@/services/userService";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";

async function updateUserApi(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Connectez-vous" });
  }

  const { user } = session;

  const { firstName, lastName, email, password } = req.body;

  try {
    const updatedUser = await userService.updateUser(
      user.id,
      firstName,
      lastName,
      email,
      password
    );
    res.status(201).send({
      message: "Utilisateur Modifié ! ",
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Il y a eu un problème", err });
  }
}

export default updateUserApi;
