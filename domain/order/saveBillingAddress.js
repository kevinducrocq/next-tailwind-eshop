const saveBillingAddress = async (
  firstName,
  lastName,
  address,
  zip,
  city,
  country
) => {
  try {
    await fetch("/api/order/saveBillingAddressApi", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        address,
        zip,
        city,
        country,
      }),
    });
  } catch (err) {
    console.error(err);
  }
};

export default saveBillingAddress;
