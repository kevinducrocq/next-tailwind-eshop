import BillingAddressModal from "@/components/BillingAdressModal";
import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import ShippingAddressList from "@/components/ShippingAddressList";
import ShippingAddressModal from "@/components/ShippingAddressModal";
import Spinner from "@/components/Spinner";
import saveBillingAddress from "@/domain/order/saveBillingAddress";
import fetchAddresses from "@/domain/user/fetchAddresses";
import { Store } from "@/utils/Store";
import { getError } from "@/utils/error";
import { faForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      state;
  }
}

export default function ShippingPage() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const router = useRouter();
  const [{ loading, error }, dispatcher] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [billingAddressIsSame, setBillingAddressIsSame] = useState(true);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatcher({ type: "FETCH_REQUEST" });
        fetchAddresses((foundShippingAddresses) => {
          setShippingAddresses(foundShippingAddresses);
          setSelectedShippingAddress(foundShippingAddresses[0]);
        });
        dispatcher({
          type: "FETCH_SUCCESS",
          payload: shippingAddresses,
        });
      } catch (err) {
        dispatcher({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (billingAddressIsSame) {
      setSelectedBillingAddress({
        billingFirstName: selectedShippingAddress?.shippingFirstName,
        billingLastName: selectedShippingAddress?.shippingLastName,
        billingStreet: selectedShippingAddress?.shippingStreet,
        billingZip: selectedShippingAddress?.shippingZip,
        billingCity: selectedShippingAddress?.shippingCity,
        billingCountry: selectedShippingAddress?.shippingCountry,
      });
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

    let billingAddress = selectedBillingAddress;

    if (selectedBillingAddress) {
      billingAddress = await saveBillingAddress(
        selectedBillingAddress.billingFirstName,
        selectedBillingAddress.billingLastName,
        selectedBillingAddress.billingStreet,
        selectedBillingAddress.billingZip,
        selectedBillingAddress.billingCity,
        selectedBillingAddress.billingCountry
      );
    }
    dispatch({
      type: "SAVE_BILLING_ADDRESS",
      payload: billingAddress,
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        billingAddress: billingAddress,
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
          {loading ? (
            <Spinner align='center' />
          ) : error ? (
            <div className='alert-error'>{error}</div>
          ) : (
            <ShippingAddressList
              onChange={setSelectedShippingAddress}
              shippingAddresses={shippingAddresses}
              selectedShippingAddress={selectedShippingAddress}
              isOrder={true}
            />
          )}
          <ShippingAddressModal
            onCreate={() =>
              fetchAddresses((addresses) => {
                setShippingAddresses(addresses);
                setSelectedShippingAddress(addresses[addresses.length - 1]);
              })
            }
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
          {!!selectedBillingAddress?.billingFirstName && (
            <div className='card p-5'>
              <ul>
                <li>
                  {selectedBillingAddress.billingFirstName}&nbsp;
                  {selectedBillingAddress.billingLastName}
                </li>
                <li>{selectedBillingAddress.billingStreet}</li>
                <li>{selectedBillingAddress.billingZip}</li>
                <li>{selectedBillingAddress.billingCity}</li>
                <li>{selectedBillingAddress.billingCountry}</li>
              </ul>
            </div>
          )}
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
