import * as userRepository from "@/repositories/userRepository";

export const findOneById = async (id) => {
  let user = await userRepository.findUserById(id);
  if (!user.id) {
    throw new Error("Bad user id");
  }
  return user;
};

export const createUser = async (user) => {
  let createdUser = await userRepository.create(user);

  if (!createdUser) {
    throw new Error("Erreur lors de la création de l'utilisateur");
  }

  return createdUser;
};

export const updateUser = async (
  userId,
  firstName,
  lastName,
  email,
  password
) => {
  if (!firstName || !lastName || !email) {
    throw new Error("Les champs nom, premon et email sont obligatoires");
  }

  if (!email.includes("@")) {
    throw new Error("Veuillez saisir une adresse email valide");
  }

  if (password && password.trim().length < 6) {
    throw new Error("Votre mot de passe est invalide");
  }

  let updatedUser = await userRepository.update(userId, {
    firstName,
    lastName,
    email,
    password,
  });

  if (!updatedUser) {
    throw new Error("Erreur lors de la modification de l'utilisateur");
  }

  return updatedUser;
};
