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
      return toast.error("Choisissez une adresse de livraison");
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
      <h1 className='text-3xl font-semibold'>Adresse de livraison</h1> <hr />
      <div className='mx-auto grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-5'>
        <ShippingAddressList
          onChange={setSelectedShippingAddress}
          shippingAddresses={shippingAddresses}
          isOrder={true}
        />
        <ShippingAddressModal isOrder={true} />
      </div>
      <div className='flex justify-end'>
        <button
          className='primary-button'
          onClick={() => {
            submitHandler();
          }}
        >
          Suivant <FontAwesomeIcon icon={faForward} />
        </button>
      </div>
    </Layout>
  );
}

ShippingPage.auth = true;
