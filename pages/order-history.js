import Carousel from "@/components/Carousel";
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
                <li>Commande n°: {order.id}</li>
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
              <div className='my-4 border'>
                <Carousel
                  items={order.orderItems.map((item) => (
                    <div key={item.id} className='flex items-center'>
                      <div className='mr-4'>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={150}
                          height={150}
                        />
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold'>{item.name}</h3>
                        <p className='mb-2'>x {item.quantity}</p>
                        <p>{item.price} &euro;</p>
                      </div>
                    </div>
                  ))}
                />
              </div>
            </div>
            <div className='flex justify-around'>
              <ul>
                <h2 className='text-xl font-semibold'>Adresse de livraison</h2>
                <li>{order.shippingFirstName}</li>
                <li>{order.shippingLastName}</li>
                <li>{order.shippingStreet}</li>
                <li>
                  {order.shippingZip} {order.shippingCity}
                </li>
              </ul>
              <ul>
                <h2 className='text-xl font-semibold'>
                  Adresse de facturation
                </h2>
                <li>{order.billingFirstName}</li>
                <li>{order.billingLastName}</li>
                <li>{order.billingStreet}</li>
                <li>
                  {order.billingZip} {order.billingCity}
                </li>
              </ul>
            </div>
          </div>
        );
      })}
    </Layout>
  );
}
