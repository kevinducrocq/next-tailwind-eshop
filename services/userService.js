import * as userRepository from "@/repositories/userRepository";

export const findOneById = async (id) => {
  let user = await userRepository.findUserById(id);
  if (!user.id) {
    throw new Error("Bad user id");
  }
  return user;
};
