import query from "@/utils/dbMysql";
import bcryptjs from "bcryptjs";

export const findAll = async () => {
  try {
    const result = await query({ query: "SELECT * FROM users" });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des utilisateurs :",
      error
    );
  }
};

export const findUserById = async (id) => {
  try {
    const result = await query({
      query: "SELECT * FROM users WHERE id = ?",
      values: [id],
      singleResult: true,
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération de l'utilisateur :",
      error
    );
  }
};

export const findUserByEmail = async (email) => {
  try {
    const result = await query({
      query: "SELECT * FROM users WHERE email = ?",
      values: [email],
      singleResult: true,
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération de l'utilisateur :",
      error
    );
  }
};

export const create = async (user) => {
  try {
    const hashedPassword = bcryptjs.hashSync(user.password);
    const result = await query({
      query: `
        INSERT INTO users (firstName, lastName, email, password, isAdmin, createdAt)
        VALUES (?, ?, ?, ?, ?, NOW())
      `,
      values: [user.firstName, user.lastName, user.email, hashedPassword, 0],
    });

    return result.insertId;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création de l'utilisateur :",
      error
    );
  }
};

export const update = async (id, userFields) => {
  try {
    const fields = [];
    const values = [];
    for (const field in userFields) {
      if (field === "password" && userFields[field]) {
        const hashedPassword = bcryptjs.hashSync(userFields[field]);
        fields.push(`${field} = ?`);
        values.push(hashedPassword);
      }
      if (field !== "password") {
        fields.push(`${field} = ?`);
        values.push(userFields[field]);
      }
    }

    const queryStr = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = ?
    `;
    await query({
      query: queryStr,
      values: [...values, id],
    });

    return findUserById(id);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la mise à jour de l'utilisateur :",
      error
    );
  }
};

export const remove = async (id) => {
  try {
    const result = await query({
      query: "DELETE FROM users WHERE id = ?",
      values: [id],
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression de l'utilisateur :",
      error
    );
  }
};
export const countUsers = async () => {
  try {
    const result = await query({
      query: "SELECT COUNT(*) AS count FROM users",
      singleResult: true,
    });
    return result.count;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du comptage des produits :",
      error
    );
  }
};
