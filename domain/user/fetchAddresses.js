const fetchAddresses = async (callback) => {
  try {
    const response = await fetch("/api/user/getAddressesApi");
    const jsonAdresses = await response.json();
    callback(jsonAdresses);
  } catch (err) {
    console.error(err);
  }
};

export default fetchAddresses;
