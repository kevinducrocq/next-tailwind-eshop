const deliverOrder = async (orderId, callback) => {
  try {
    const response = await fetch(
      `/api/admin/deliverOrderApi?orderId=${orderId}`
    ); // Passer l'identifiant de la commande dans l'URL
    const jsonOrder = await response.json();
    callback(jsonOrder);
  } catch (err) {
    console.error(err);
  }
};

export default deliverOrder;
