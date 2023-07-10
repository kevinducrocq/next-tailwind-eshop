import { getError } from "@/utils/error";

const registerUser = async (firstName, lastName, email, password) => {
  try {
    const userResponse = await fetch("/api/auth/registerUserApi", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
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

export default registerUser;
