import * as shippingAddressRepository from "@/repositories/shippingAddressRepository";

export const findAllByUser = async (userId) => {
  let addresses = await shippingAddressRepository.findShippingAddressesByUserId(
    userId
  );

  if (!addresses) {
    throw new Error("No products found");
  }

  return addresses;
};

export const createShippingAddress = async (user, shippingAddress) => {
  let createdAddress = await shippingAddressRepository.create(
    user,
    shippingAddress
  );

  if (!createdAddress) {
    throw new Error("Erreur lors de la création de l'adresse");
  }

  return createdAddress;
};
