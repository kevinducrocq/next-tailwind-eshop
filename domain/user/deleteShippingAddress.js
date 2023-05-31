import { toast } from "react-toastify";
import { getError } from "@/utils/error";

const deleteShippingAddress = async (id) => {
  try {
    const userResponse = await fetch("/api/user/deleteShippingAddressApi", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        id,
      }),
    });

    if (userResponse.status > 400) {
      const error = await getError(userResponse);
      toast.error(error);
      return;
    }

    return await userResponse.json();
  } catch (error) {
    console.error(error);
    toast.error(
      "Une erreur s'est produite lors de la suppression de l'adresse"
    );
  }
};

export { deleteShippingAddress };
