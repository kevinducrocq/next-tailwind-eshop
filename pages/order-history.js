import Layout from "@/components/Layout";
import fetchUserOrders from "@/domain/order/fetchUserOrders";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchUserOrders(setOrders);
  }, []);

  console.log(orders);

  return (
    <Layout title='Historique de commandes'>
      <h1>Historique de commandes</h1>
      {orders.map((order) => {
        return (
          <div className='card p-5' key={order.id}>
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
              <li>{order.firstName}</li>
            </ul>
          </div>
        );
      })}
    </Layout>
  );
}
