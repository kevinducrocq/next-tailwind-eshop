const registerUser = async (firstName, lastName, email, password) => {
  try {
    const userResponse = await fetch("/api/auth/register", {
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
    return userResponse.json();
  } catch (err) {
    console.error(err);
  }
};

export default registerUser;
