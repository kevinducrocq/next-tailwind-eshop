const saveShippingAddress = async (
  shippingFirstName,
  shippingLastName,
  shippingStreet,
  shippingZip,
  shippingCity,
  shippingCountry
) => {
  try {
    await fetch("/api/order/saveShippingAddressApi", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        shippingFirstName,
        shippingLastName,
        shippingStreet,
        shippingZip,
        shippingCity,
        shippingCountry,
      }),
    });
  } catch (err) {
    console.error(err);
  }
};

export default saveShippingAddress;
