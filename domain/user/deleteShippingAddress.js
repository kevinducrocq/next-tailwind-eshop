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
      getError(userResponse);
      return;
    }

    return await userResponse.json();
  } catch (err) {
    console.error(err);
  }
};

export default deleteShippingAddress;
