import Layout from "@/components/Layout";
import fetchOrderById from "@/domain/order/fetchOrderById";
import { Store } from "@/utils/Store";
// import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";

export default function ProductPage() {
  //   const { state, dispatch } = useContext(Store);
  //   const router = useRouter();
  const { query } = useRouter();
  const { id } = query;

  const [order, setOrder] = useState([]);

  useEffect(() => {
    fetchOrderById(id, setOrder);
  }, [id]);

  if (order.length === 0) {
    return <div>Commande non trouvée</div>;
  }

  return (
    <Layout title={id}>
      <div className='py-2'>
        <Link href='/'>Accueil</Link>
      </div>
      {/* {order.orderItems[0].map((orderItem) => {
        return <div key={orderItem[0].id}>{orderItem[0].name}</div>;
      })} */}
    </Layout>
  );
}
