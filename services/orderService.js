import * as orderRepository from "@/repositories/orderRepository";
import * as orderItemRepository from "@/repositories/orderItemRepository";
import * as shippingAddressRepository from "@/repositories/shippingAddressRepository";
import * as billingAddressRepository from "@/repositories/billingAddressRepository";

export const findOneById = async (id, user, groups = []) => {
  let order = await orderRepository.findOneById(id);

  if (order.userId !== user.id) {
    throw new Error("Bad user id");
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
      throw new Error("Bad user id");
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
