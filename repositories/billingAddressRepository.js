import query from "@/utils/dbMysql";

export const findAll = async () => {
  try {
    const result = await query({ query: "SELECT * FROM billing_address" });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des adresses de facturation :",
      error
    );
  }
};

export const findBillingAddressById = async (id) => {
  try {
    const result = await query({
      query: "SELECT * FROM billing_address WHERE id = ?",
      values: [id],
      singleResult: true,
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération de l'adresse de facturation :",
      error
    );
  }
};

export const findBillingAddressesByUserId = async (userId) => {
  try {
    const result = await query({
      query: "SELECT * FROM billing_address WHERE userId = ?",
      values: [userId],
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des adresses de facturation :",
      error
    );
  }
};

export const create = async (billingAddress) => {
  try {
    const result = await query({
      query: `
        INSERT INTO billing_address (userId, billingFirstName, billingLastName, billingStreet, billingZip, billingCity, billingCountry)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        billingAddress.userId,
        billingAddress.billingFirstName,
        billingAddress.billingLastName,
        billingAddress.billingStreet,
        billingAddress.billingZip,
        billingAddress.billingCity,
        billingAddress.billingCountry,
      ],
    });

    return result.insertId;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création de l'adresse de facturation :",
      error
    );
  }
};

export const update = async (id, billingAddressFields) => {
  try {
    const fields = [];
    const values = [];
    for (const field in billingAddressFields) {
      fields.push(`${field} = ?`);
      values.push(billingAddressFields[field]);
    }

    const queryStr = `
      UPDATE billing_address
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
      "Une erreur s'est produite lors de la mise à jour de l'adresse de facturation :",
      error
    );
  }
};

export const remove = async (id) => {
  try {
    const result = await query({
      query: "DELETE FROM billing_address WHERE id = ?",
      values: [id],
    });
    return result;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression de l'adresse de facturation :",
      error
    );
  }
};
