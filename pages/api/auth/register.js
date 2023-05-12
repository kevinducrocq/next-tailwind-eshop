import query from "@/utils/dbMysql";
import bcryptjs from "bcryptjs";

async function register(req, res) {
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
    const hashedPassword = bcryptjs.hashSync(password);
    const newUser = await query({
      query:
        "INSERT INTO users (firstName, lastName, email, password, isAdmin, createdAt) VALUES(?,?,?,?,?, NOW())",
      values: [firstName, lastName, email, hashedPassword, 0],
    });
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

export default register;
