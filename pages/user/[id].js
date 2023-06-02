import Layout from "@/components/Layout";
import ShippingAddressList from "@/components/ShippingAddressList";
import ShippingAddressModal from "@/components/ShippingAddressModal";
import fetchAddresses from "@/domain/user/fetchAddresses";
import fetchUserById from "@/domain/user/fetchUserById";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function ProductPage() {
  const { query } = useRouter();
  const { id } = query;
  const [user, setUser] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);

  useEffect(() => {
    if (id) {
      fetchUserById(id, setUser);
    }
  }, [id]);

  useEffect(() => {
    fetchAddresses(setShippingAddresses);
  }, []);

  if (!user) {
    return <div>Erreur</div>;
  }

  return (
    <Layout title={`Profil de ${user.firstName} ${user.lastName}`}>
      <h1 className='text-3xl font-semibold'>
        Profil de {user.firstName} {user.lastName}
      </h1>

      <div className='mt-5'>
        <div className='my-10'>
          <h2 className='text-2xl font-semibold'>Informations</h2>
          <hr />
          <ul>
            <li>{user.firstName}</li>
            <li>{user.lastName}</li>
            <li>{user.email}</li>
          </ul>
        </div>
        <div>
          <h2 className='text-2xl font-semibold'>Adresses de livraison</h2>
          <hr />
          <div className='mx-auto grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-5'>
            <ShippingAddressList
              onDelete={() => fetchAddresses(setShippingAddresses)}
              shippingAddresses={shippingAddresses}
              isOrder={false}
            />

            <ShippingAddressModal
              onCreate={() => fetchAddresses(setShippingAddresses)}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
