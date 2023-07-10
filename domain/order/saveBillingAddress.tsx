const saveBillingAddress = async (
  billingFirstName,
  billingLastName,
  billingStreet,
  billingZip,
  billingCity,
  billingCountry
) => {
  try {
    await fetch("/api/order/saveBillingAddressApi", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        billingFirstName,
        billingLastName,
        billingStreet,
        billingZip,
        billingCity,
        billingCountry,
      }),
    });
  } catch (err) {
    console.error(err);
  }
};

export default saveBillingAddress;
