import saveShippingAddress from "@/domain/order/saveShippingAddress";
import { Store } from "@/utils/Store";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";

export default function ShippingAddressModal({ isOrder, onCreate }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const router = useRouter();

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const submitHandler = async ({
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
    await saveShippingAddress(firstName, lastName, address, city, zip, country);

    if (isOrder) {
      router.push("/payment");
      return;
    }

    if (onCreate) {
      closeModal();
      onCreate();
      toast.success("Adresse ajoutée à votre profil");
    }
  };

  return (
    <>
      <div
        className='col-span-1 flex flex-col border-2 p-4 rounded-lg shadow-lg'
        role='button'
        onClick={openModal}
      >
        <h2 className='mb-2 text-sm'>Ajouter une adresse</h2>
        <hr />
        <div className='flex flex-wrap mt-auto p-3 opacity-60 justify-center'>
          <FontAwesomeIcon icon={faPlus} size='4x' />
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h2'
                    className='text-xl font-medium leading-6 text-gray-900 flex justify-between'
                  >
                    Nouvelle adresse de livraison
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-6 h-6'
                      role='button'
                      onClick={closeModal}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </Dialog.Title>
                  <div className='mt-2'>
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
                            <div className='text-red-500'>
                              {errors.zip.message}
                            </div>
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
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
