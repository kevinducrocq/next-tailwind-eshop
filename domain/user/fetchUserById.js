const fetchUserById = async (id, callback) => {
  try {
    const response = await fetch("/api/user/findUserByIdApi?id=" + id);
    const jsonUser = await response.json();
    callback(jsonUser);
  } catch (err) {
    console.error(err);
  }
};

export default fetchUserById;
