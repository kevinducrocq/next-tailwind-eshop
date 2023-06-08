import * as userService from "@/services/userService";

async function registerUserApi(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const { firstName, lastName, email, password } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 6
  ) {
    res.status(422).json({ message: "Validation error" });
    return;
  }

  try {
    const newUser = await userService.createUser(req.body);

    res.status(201).send({
      message: "Utilisateur créé ! ",
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (err) {
    if (err.toString().indexOf("ER_DUP_ENTRY")) {
      res.status(409).json({ message: "L'utilisateur existe déjà" });
    }
    res.status(500).json({ message: "Il y a eu un problème" });
  }
}

export default registerUserApi;
