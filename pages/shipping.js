import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import ShippingAddressList from "@/components/ShippingAddressList";
import ShippingAddressModal from "@/components/ShippingAddressModal";
import fetchAddresses from "@/domain/user/fetchAddresses";

import { Store } from "@/utils/Store";
import { faForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ShippingPage() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  // const { shippingAddress } = cart;
  const router = useRouter();

  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);

  useEffect(() => {
    fetchAddresses(setShippingAddresses);
  }, []);

  const submitHandler = (e) => {
    e?.preventDefault();
    if (!selectedShippingAddress) {
      return toast.error("Choisissez une adresse");
    }
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: selectedShippingAddress,
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: selectedShippingAddress,
      })
    );
    router.push("/payment");
  };

  return (
    <Layout title='Adresse de livraison'>
      <CheckoutWizard activeStep={1} />

      <ShippingAddressList
        onChange={setSelectedShippingAddress}
        shippingAddresses={shippingAddresses}
      />

      <div className='flex justify-between'>
        {shippingAddresses.length != 0 ? (
          <ShippingAddressModal buttonText='Saisir une nouvelle adresse de livraison' />
        ) : (
          <div>
            <h2>
              Vous n&pos;avez pas encore d&apos;adresse de livraison enregistrée
            </h2>
            <ShippingAddressModal buttonText='Enregistrer une première adresse' />
          </div>
        )}

        <button
          className='primary-button'
          onClick={() => {
            submitHandler();
          }}
          // disabled={!selectedShippingAddress}
        >
          Suivant <FontAwesomeIcon icon={faForward} />
        </button>
      </div>
    </Layout>
  );
}

ShippingPage.auth = true;
