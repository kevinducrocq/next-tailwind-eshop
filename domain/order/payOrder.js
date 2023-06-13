const API_URL = "/api/order/payOrderApi";
const CONTENT_TYPE = "application/json";

const payOrder = async (orderId) => {
  try {
    const orderResponse = await fetch(API_URL, {
      headers: {
        Accept: CONTENT_TYPE,
        "Content-Type": CONTENT_TYPE,
      },
      method: "POST",
      body: JSON.stringify({
        orderId,
      }),
    });

    if (!orderResponse.ok) {
      throw new Error("Échec de la requête d'API");
    }

    const updatedOrder = await orderResponse.json();
    return updatedOrder;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du paiement de la commande :",
      error
    );
    // Gérer l'erreur en conséquence (rejeter ou renvoyer une valeur par défaut)
    throw error;
  }
};

export default payOrder;
