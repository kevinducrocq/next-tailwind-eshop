const fetchUsers = async (callback) => {
  try {
    const response = await fetch("/api/user/findAllUsers");
    const jsonProducts = await response.json();
    console.log(jsonProducts);
    callback(jsonProducts);
  } catch (err) {
    console.error(err);
  }
};

export default fetchUsers;
