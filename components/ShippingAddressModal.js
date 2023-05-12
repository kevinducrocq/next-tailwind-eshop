import saveShippingAddress from "@/domain/order/saveShippingAddress";
import { Store } from "@/utils/Store";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";

export default function ShippingAddressModal(props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const submitHandler = ({
    firstName,
    lastName,
    address,
    city,
    zip,
    country,
  }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { firstName, lastName, address, city, zip, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          firstName,
          lastName,
          address,
          zip,
          city,
          country,
        },
      })
    );
    saveShippingAddress(firstName, lastName, address, city, zip, country);
    router.push("/payment");
  };

  return (
    <>
      <button
        className='primary-button'
        type='button'
        onClick={() => setShowModal(true)}
      >
        {props.buttonText}
      </button>
      {showModal ? (
        <>
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-auto my-6 mx-auto max-w-3xl'>
              {/*content*/}
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                {/*header*/}
                <div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                  <h3 className='text-2xl font-semibold'>
                    Nouvelle adresse de livraison
                  </h3>
                  <button
                    className='p-1 text-3xl'
                    onClick={() => setShowModal(false)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
                {/*body*/}{" "}
                <form
                  className='mx-auto max-w-screen-md'
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <div className='relative p-6 flex-auto'>
                    <div className='mb-4'>
                      <label htmlFor='firstName'>Prénom</label>
                      <input
                        type='text'
                        id='firstName'
                        className='w-full'
                        autoFocus
                        {...register("firstName", {
                          required: "Entrez votre prénom",
                        })}
                      />
                      {errors.firstName && (
                        <div className='text-red-500'>
                          {errors.firstName.message}
                        </div>
                      )}
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='lastName'>Nom</label>
                      <input
                        type='text'
                        id='lastName'
                        className='w-full'
                        {...register("lastName", {
                          required: "Entrez votre nom",
                        })}
                      />
                      {errors.lastName && (
                        <div className='text-red-500'>
                          {errors.lastName.message}
                        </div>
                      )}
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='address'>Adresse</label>
                      <input
                        type='text'
                        id='address'
                        className='w-full'
                        {...register("address", {
                          required: "Entrez votre adresse",
                          minLength: {
                            value: 3,
                            message:
                              "L'adresse doit contenir au moins 3 caractères",
                          },
                        })}
                      />
                      {errors.address && (
                        <div className='text-red-500'>
                          {errors.address.message}
                        </div>
                      )}
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='zip'>Code postal</label>
                      <input
                        type='text'
                        id='zip'
                        className='w-full'
                        {...register("zip", {
                          required: "Entrez votre code postal",
                        })}
                      />
                      {errors.zip && (
                        <div className='text-red-500'>{errors.zip.message}</div>
                      )}
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='city'>Ville</label>
                      <input
                        type='text'
                        id='city'
                        className='w-full'
                        {...register("city", {
                          required: "Entrez votre ville",
                        })}
                      />
                      {errors.city && (
                        <div className='text-red-500'>
                          {errors.city.message}
                        </div>
                      )}
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='country'>Pays</label>
                      <input
                        type='text'
                        id='country'
                        className='w-full'
                        {...register("country", {
                          required: "Entrez votre pays",
                        })}
                      />
                      {errors.country && (
                        <div className='text-red-500'>
                          {errors.country.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className='primary-button mb-2 w-full'>
                    Continuer
                  </button>
                </form>
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </>
      ) : null}
    </>
  );
}
