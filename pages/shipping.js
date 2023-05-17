import BillingAddressModal from "@/components/BillingAdressModal";
import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import ShippingAddressList from "@/components/ShippingAddressList";
import ShippingAddressModal from "@/components/ShippingAddressModal";
import saveBillingAddress from "@/domain/order/saveBillingAddress";
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
  const router = useRouter();

  const [shippingAddresses, setShippingAddresses] = useState([]);

  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);

  const [billingAddressIsSame, setBillingAddressIsSame] = useState(true);

  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);

  useEffect(() => {
    fetchAddresses((foundShippingAddresses) => {
      setShippingAddresses(foundShippingAddresses);
      setSelectedShippingAddress(foundShippingAddresses[0]);
    });
  }, []);

  useEffect(() => {
    if (billingAddressIsSame) {
      setSelectedBillingAddress(selectedShippingAddress);
    }
  }, [selectedShippingAddress, billingAddressIsSame]);

  const submitHandler = async (e) => {
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
    if (!selectedBillingAddress) {
      return toast.error("Choisissez une adresse de facturation");
    }

    let newBillingAddress = selectedBillingAddress;

    if (!selectedBillingAddress.id) {
      newBillingAddress = await saveBillingAddress(
        selectedBillingAddress.firstName,
        selectedBillingAddress.lastName,
        selectedBillingAddress.address,
        selectedBillingAddress.zip,
        selectedBillingAddress.city,
        selectedBillingAddress.country
      );
    }
    dispatch({
      type: "SAVE_BILLING_ADDRESS",
      payload: newBillingAddress,
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        billingAddress: newBillingAddress,
      })
    );
    router.push("/payment");
  };


  return (
    <Layout title='Adresse de livraison'>
      <CheckoutWizard activeStep={1} />
      <div className='my-10'>
        <h2 className='text-3xl font-semibold'>Adresse de livraison</h2> <hr />
        <div className='mx-auto grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-5'>
          <ShippingAddressList
            onChange={setSelectedShippingAddress}
            shippingAddresses={shippingAddresses}
            selectedShippingAddress={selectedShippingAddress}
            isOrder={true}
          />
          <ShippingAddressModal
            onCreate={() => fetchAddresses(setShippingAddresses)}
          />
        </div>
      </div>
      <div className='my-10'>
        <h2 className='text-3xl font-semibold'>Adresse de facturation</h2>{" "}
        <hr />
        <div className='mx-auto grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-5'>
          <div>
            <label htmlFor='billingIsSame'>
              <input
                type='radio'
                id='billingIsSame'
                name='billingAddress'
                onChange={() => {
                  setBillingAddressIsSame(true);
                }}
                checked={billingAddressIsSame}
              />
              &nbsp;Identique à l&apos;adresse de livraison
            </label>

            <div className='flex'>
              <BillingAddressModal
                billingIsNotSame={() => setBillingAddressIsSame(false)}
                onCreate={(newBillingAddress) => {
                  setSelectedBillingAddress(newBillingAddress);
                }}
              />
            </div>
          </div>{" "}
          {/* {!!selectedShippingAddress?.firstName && (
            <div className='card p-5'>
              <ul>
                <li>
                  {billingAddress.firstName}&nbsp;
                  {billingAddress.lastName}
                </li>
                <li>{billingAddress.address}</li>
                <li>{billingAddress.zip}</li>
                <li>{billingAddress.city}</li>
                <li>{billingAddress.country}</li>
              </ul>
            </div>
          )} */}
        </div>
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
