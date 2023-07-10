import * as billingAddressRepository from "@/repositories/billingAddressRepository";

export const findLastBillingAddressByUser = async (userId) => {
  let lastBillingAddress =
    await billingAddressRepository.findLastBillingAddressesByUserId(userId);

  if (!lastBillingAddress) {
    throw new Error("Pas d'adresse trouvée");
  }

  return lastBillingAddress;
};

export const createBillingAddress = async (user, billingAddress) => {
  let createdAddress = await billingAddressRepository.create(
    user,
    billingAddress
  );

  if (!createdAddress) {
    throw new Error("Erreur lors de la création de l'adresse");
  }

  return createdAddress;
};
