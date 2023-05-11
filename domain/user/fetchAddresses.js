const fetchAddresses = async (callback) => {
  try {
    const response = await fetch("/api/user/getAddressesApi");
    const jsonAdresses = await response.json();
    // console.log(jsonAdresses);
    callback(jsonAdresses);
  } catch (err) {
    console.error(err);
  }
};

export default fetchAddresses;
