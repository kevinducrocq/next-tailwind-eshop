import query from "@/utils/dbMysql";

export const findAll = async () => {
  try {
    const result = await query({ query: "SELECT * FROM shipping_address" });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des adresses de livraison :",
      error
    );
  }
};

export const findShippingAddressById = async (id) => {
  try {
    const result = await query({
      query: "SELECT * FROM shipping_address WHERE id = ?",
      values: [id],
      singleResult: true,
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération de l'adresse de livraison :",
      error
    );
  }
};

export const findShippingAddressesByUserId = async (userId) => {
  try {
    const result = await query({
      query:
        "SELECT * FROM shipping_address WHERE userId = ? AND isVisible = 1",
      values: [userId],
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des adresses de livraison :",
      error
    );
  }
};

export const create = async (shippingAddress) => {
  try {
    const result = await query({
      query: `
        INSERT INTO shipping_address (userId, shippingFirstName, shippingLastName, shippingStreet, shippingZip, shippingCity, shippingCountry, isVisible)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `,
      values: [
        shippingAddress.userId,
        shippingAddress.shippingFirstName,
        shippingAddress.shippingLastName,
        shippingAddress.shippingStreet,
        shippingAddress.shippingZip,
        shippingAddress.shippingCity,
        shippingAddress.shippingCountry,
      ],
    });

    return result.insertId;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création de l'adresse de livraison :",
      error
    );
  }
};

export const update = async (id, shippingAddressFields) => {
  try {
    const fields = [];
    const values = [];
    for (const field in shippingAddressFields) {
      fields.push(`${field} = ?`);
      values.push(shippingAddressFields[field]);
    }

    const queryStr = `
      UPDATE shipping_address
      SET ${fields.join(", ")}
      WHERE id = ?
    `;
    const result = await query({
      query: queryStr,
      values: [...values, id],
    });

    return result.insertId;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la mise à jour de l'adresse de livraison :",
      error
    );
  }
};

export const remove = async (id) => {
  try {
    const result = await query({
      query: "DELETE FROM shipping_address WHERE id = ?",
      values: [id],
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression de l'adresse de livraison :",
      error
    );
  }
};
