import saveShippingAddress from "@/domain/order/saveShippingAddress";
import { Store } from "@/utils/Store";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import React, { useContext, useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";

export default function ShippingAddressModal({ onCreate }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const submitHandler = async ({
    shippingFirstName,
    shippingLastName,
    shippingStreet,
    shippingCity,
    shippingZip,
    shippingCountry,
  }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        shippingFirstName,
        shippingLastName,
        shippingStreet,
        shippingZip,
        shippingCity,
        shippingCountry,
      },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          shippingFirstName,
          shippingLastName,
          shippingStreet,
          shippingZip,
          shippingCity,
          shippingCountry,
        },
      })
    );
    await saveShippingAddress(
      shippingFirstName,
      shippingLastName,
      shippingStreet,
      shippingZip,
      shippingCity,
      shippingCountry
    );

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
                          <label htmlFor='shippingFirstName'>Prénom</label>
                          <input
                            type='text'
                            id='shippingFirstName'
                            className='w-full'
                            autoFocus
                            {...register("shippingFirstName", {
                              required: "Entrez votre prénom",
                            })}
                          />
                          {errors.shippingFirstName && (
                            <div className='text-red-500'>
                              {errors.shippingFirstName.message}
                            </div>
                          )}
                        </div>
                        <div className='mb-4'>
                          <label htmlFor='shippingLastName'>Nom</label>
                          <input
                            type='text'
                            id='shippingLastName'
                            className='w-full'
                            {...register("shippingLastName", {
                              required: "Entrez votre nom",
                            })}
                          />
                          {errors.shippingLastName && (
                            <div className='text-red-500'>
                              {errors.shippingLastName.message}
                            </div>
                          )}
                        </div>
                        <div className='mb-4'>
                          <label htmlFor='shippingStreet'>Adresse</label>
                          <input
                            type='text'
                            id='shippingStreet'
                            className='w-full'
                            {...register("shippingStreet", {
                              required: "Entrez votre adresse",
                              minLength: {
                                value: 3,
                                message:
                                  "L'adresse doit contenir au moins 3 caractères",
                              },
                            })}
                          />
                          {errors.shippingStreet && (
                            <div className='text-red-500'>
                              {errors.shippingStreet.message}
                            </div>
                          )}
                        </div>
                        <div className='mb-4'>
                          <label htmlFor='shippingZip'>Code postal</label>
                          <input
                            type='text'
                            id='shippingZip'
                            className='w-full'
                            {...register("shippingZip", {
                              required: "Entrez votre code postal",
                            })}
                          />
                          {errors.shippingZip && (
                            <div className='text-red-500'>
                              {errors.shippingZip.message}
                            </div>
                          )}
                        </div>
                        <div className='mb-4'>
                          <label htmlFor='shippingCity'>Ville</label>
                          <input
                            type='text'
                            id='shippingCity'
                            className='w-full'
                            {...register("shippingCity", {
                              required: "Entrez votre ville",
                            })}
                          />
                          {errors.shippingCity && (
                            <div className='text-red-500'>
                              {errors.shippingCity.message}
                            </div>
                          )}
                        </div>
                        <div className='mb-4'>
                          <label htmlFor='shippingCountry'>Pays</label>
                          <input
                            type='text'
                            id='shippingCountry'
                            className='w-full'
                            {...register("shippingCountry", {
                              required: "Entrez votre pays",
                            })}
                          />
                          {errors.shippingCountry && (
                            <div className='text-red-500'>
                              {errors.shippingCountry.message}
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
