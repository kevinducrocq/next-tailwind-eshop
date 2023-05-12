import Layout from "@/components/Layout";
import fetchAddresses from "@/domain/user/fetchAddresses";
import fetchUserById from "@/domain/user/fetchUserById";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function ProductPage() {
  const { query } = useRouter();
  const { id } = query;

  const [user, setUser] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);

  useEffect(() => {
    fetchUserById(id, setUser);
  }, [id]);

  useEffect(() => {
    fetchAddresses(setShippingAddresses);
  }, []);

  if (!user) {
    return <div>Erreur</div>;
  }

  return (
    <Layout title={`Profil de ${user.firstName} ${user.lastName}`}>
      <div>
        <h1 className='text-xl'>
          Profil de {user.firstName} {user.lastName}
        </h1>

        <div className='mt-3'>
          <div>
            <h2>Vos informations</h2>
            <ul>
              <li>{user.firstName}</li>
              <li>{user.lastName}</li>
              <li>{user.email}</li>
            </ul>
          </div>
          <div className='mt-3'>
            <h2>Vos addresses</h2>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
              {shippingAddresses.map((shipAd) => {
                return (
                  <div key={shipAd.id} className='card p-3'>
                    <div className='flex justify-between'>
                      <ul>
                        <li>
                          {shipAd.firstName} {shipAd.lastName}
                        </li>
                        <li>{shipAd.address}</li>
                        <li>
                          {shipAd.zip} {shipAd.city}
                        </li>
                        <li>{shipAd.country}</li>
                      </ul>
                      <div className=''>
                        <button className=''>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className=''>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
