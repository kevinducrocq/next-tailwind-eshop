import * as orderRepository from "@/repositories/orderRepository";
import * as userRepository from "@/repositories/userRepository";

export const findAll = async (groups = []) => {
  try {
    let users = await userRepository.findAll();

    for (const user of users) {
      if (!user) {
        throw new Error("No users found");
      }
      if (groups.includes("orders")) {
        const userId = user.id;
        const searchCriteria = { userId, isPaid: true };
        const userOrders = await orderRepository.findBy(searchCriteria);
        const userOrderCount = userOrders.length;
        user.orderCount = userOrderCount;
      }
    }

    return users;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des utilisateurs :",
      error
    );
    throw error;
  }
};
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

export const getTotalUsers = async () => {
  try {
    const totalProducts = await userRepository.countUsers();
    return totalProducts;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du calcul du montant des ventes :",
      error
    );
  }
};
