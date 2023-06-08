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
