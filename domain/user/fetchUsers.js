const fetchUsers = async (callback) => {
  try {
    const response = await fetch("/api/user/findAllUsersApi");
    const jsonUsers = await response.json();
    console.log(jsonUsers);
    callback(jsonUsers);
  } catch (err) {
    console.error(err);
  }
};

export default fetchUsers;
