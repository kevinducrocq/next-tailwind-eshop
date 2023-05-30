import Layout from "@/components/Layout";
import fetchUserOrders from "@/domain/order/fetchUserOrders";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchUserOrders(setOrders);
  }, []);

  return (
    <Layout title='Historique de commandes'>
      <h1>Historique de commandes</h1>
      {orders?.map((order) => {
        return (
          <div className='card p-5' key={order.id}>
            <div className='flex justify-between'>
              <ul>
                <li>N°: {order.id}</li>
                <li>Créée le : {order.createdAt.substring(0, 10)}</li>
                <li>{order.isPaid ? "Payée" : "En attente de paiement"}</li>
                <li>
                  {order.isDelivered
                    ? "Envoyée le" + order.deliveredAt.substring(0, 10)
                    : "Pas encore envoyée"}
                </li>
                <li>Total : {order.totalPrice} &euro;</li>
                <li>
                  <Link href={`/order/${order.id}`}>Détails</Link>
                </li>
              </ul>
              <ul>
                <h2>Addresse de facturation</h2>
                <li>{order.billingFirstName}</li>
                <li>{order.billingLastName}</li>
                <li>{order.billingStreet}</li>
                <li>{order.billingZip}</li>
                <li>{order.billingCity}</li>
              </ul>
              <ul>
                <h2>Addresse de livraison</h2>
                <li>{order.shippingFirstName}</li>
                <li>{order.shippingLastName}</li>
                <li>{order.shippingStreet}</li>
                <li>{order.shippingZip}</li>
                <li>{order.shippingCity}</li>
              </ul>
              <ul>
                <h2>Produits</h2>
                {order.orderItems?.map((item) => (
                  <tr key={item.id} className='border-b'>
                    <td>
                      <Link legacyBehavior href={`/product/${item.slug}`}>
                        <a className='flex items-center'>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </a>
                      </Link>
                    </td>
                    <td className=' p-5 text-right'>{item.quantity}</td>
                    <td className='p-5 text-right'>€{item.price}</td>
                    <td className='p-5 text-right'>
                      €{item.quantity * item.price}
                    </td>
                  </tr>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </Layout>
  );
}
