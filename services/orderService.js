import * as orderRepository from "@/repositories/orderRepository";
import * as orderItemRepository from "@/repositories/orderItemRepository";
import * as productRepository from "@/repositories/productRepository";
import * as shippingAddressRepository from "@/repositories/shippingAddressRepository";
import * as billingAddressRepository from "@/repositories/billingAddressRepository";
import paypal from "@paypal/checkout-server-sdk";

export const findOneById = async (id, user, groups = []) => {
  let order = await orderRepository.findOneById(id);

  if (order.userId !== user.id) {
    throw new Error("Mauvais identifiant d'utilisateur");
  }

  if (groups.includes("orderItems")) {
    order.orderItems = await orderItemRepository.findWithProductsByOrderId(
      order.id
    );
  }

  if (groups.includes("addresses")) {
    order.shippingAddress =
      await shippingAddressRepository.findShippingAddressById(
        order.shipping_address_id
      );
    order.billingAddress =
      await billingAddressRepository.findBillingAddressById(
        order.billing_address_id
      );
  }
  return order;
};

export const findAllByUser = async (user, groups = []) => {
  let orders = await orderRepository.findBy({ userId: user.id });
  for (const order of orders) {
    if (order.userId !== user.id) {
      throw new Error("Mauvais identifiant d'utilisateur");
    }

    if (groups.includes("orderItems")) {
      order.orderItems = await orderItemRepository.findWithProductsByOrderId(
        order.id
      );
    }

    if (groups.includes("addresses")) {
      order.shippingAddress =
        await shippingAddressRepository.findShippingAddressById(
          order.shipping_address_id
        );
      order.billingAddress =
        await billingAddressRepository.findBillingAddressById(
          order.billing_address_id
        );
    }
  }
  return orders;
};

export const createOrder = async (order, user) => {
  let createdOrderId = await orderRepository.create(order, user);

  if (!createdOrderId) {
    throw new Error("Erreur lors de la création de la commande");
  }

  await Promise.all(
    order.orderItems.map((orderItem) => {
      const item = { ...orderItem, orderId: createdOrderId };
      return orderItemRepository.create(item);
    })
  );
  const newOrder = await findOneById(createdOrderId, user);

  return newOrder;
};

export const payOrder = async (orderId, user, paymentData) => {
  const order = await orderRepository.findOneById(orderId, user);

  if (!order) {
    throw new Error("Commande introuvable");
  }

  if (order.isPaid) {
    throw new Error("La commande a déjà été payée");
  }

  // Initialiser le SDK PayPal avec les informations d'authentification du mode sandbox
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const environment = new paypal.core.SandboxEnvironment(
    clientId,
    clientSecret
  );
  const client = new paypal.core.PayPalHttpClient(environment);

  // Récupérer le paiement à partir de l'API PayPal
  const captureId = paymentData.orderID;
  const request = new paypal.orders.OrdersGetRequest(captureId);
  const response = await client.execute(request);

  // Vérifier si le paiement a été capturé avec succès
  if (response.result.status !== "COMPLETED") {
    throw new Error("Le paiement n'a pas été effectué avec succès");
  }

  const updatedOrder = await orderRepository.update(orderId, {
    isPaid: true,
    paidAt: new Date(),
  });

  if (!updatedOrder) {
    throw new Error("Erreur lors du paiement de la commande");
  }

  const orderItems = await orderItemRepository.findWithProductsByOrderId(
    orderId
  );

  for (const orderItem of orderItems) {
    const { productId, quantity } = orderItem;

    // Récupérer le produit correspondant
    const product = await productRepository.findProductById(productId);

    if (!product) {
      throw new Error("Produit introuvable");
    }

    // Vérifier si la quantité en stock est suffisante
    if (product.stock < quantity) {
      throw new Error("Stock insuffisant pour le produit");
    }

    // Mettre à jour la quantité en stock
    const updatedProduct = await productRepository.update(productId, {
      countInStock: product.countInStock - quantity,
    });

    if (!updatedProduct) {
      throw new Error("Erreur lors de la mise à jour du stock du produit");
    }
  }

  return updatedOrder;
};

export const getTotalOrders = async () => {
  try {
    const totalOrders = await orderRepository.countOrders();
    return totalOrders;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du calcul du nombre total de commandes :",
      error
    );
  }
};
export const getTotalAmount = async () => {
  try {
    const totalOrders = await orderRepository.calculateTotalSales();
    return totalOrders;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du calcul du montant des ventes :",
      error
    );
  }
};
export const getSalesData = async () => {
  try {
    const totalOrders = await orderRepository.getSalesData();
    return totalOrders;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du calcul du montant des ventes :",
      error
    );
  }
};
