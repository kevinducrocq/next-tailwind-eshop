import * as categoryRepository from "@/repositories/categoryRepository";

export const findAll = async () => {
  let categories = await categoryRepository.findAll();
  "SERVICE", categories;
  return categories;
};
