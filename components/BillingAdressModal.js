import { Store } from "@/utils/Store";
import Cookies from "js-cookie";
import React, { useContext, useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";

export default function BillingAddressModal({ onCreate, billingIsNotSame }) {
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
    billingFirstName,
    billingLastName,
    billingStreet,
    billingCity,
    billingZip,
    billingCountry,
  }) => {
    dispatch({
      type: "SAVE_BILLING_ADDRESS",
      payload: {
        billingFirstName,
        billingLastName,
        billingStreet,
        billingCity,
        billingZip,
        billingCountry,
      },
    });
    const billingAddress = {
      billingFirstName,
      billingLastName,
      billingStreet,
      billingCity,
      billingZip,
      billingCountry,
    };

    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        billingAddress,
      })
    );

    if (onCreate) {
      closeModal();
      onCreate(billingAddress);
    }
  };

  return (
    <>
      <label htmlFor='billingIsDifferent'>
        <input
          type='radio'
          id='billingIsDifferent'
          name='billingAddress'
          onClick={() => {
            openModal();
            billingIsNotSame();
          }}
        />
        &nbsp;Autre adresse
      </label>

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
                    Adresse
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
                          <label htmlFor='billingFirstName'>Prénom</label>
                          <input
                            type='text'
                            id='billingFirstName'
                            className='w-full'
                            autoFocus
                            {...register("billingFirstName", {
                              required: "Entrez un prénom",
                            })}
                          />
                          {errors.billingFirstName && (
                            <div className='text-red-500'>
                              {errors.billingFirstName.message}
                            </div>
                          )}
                        </div>
                        <div className='mb-4'>
                          <label htmlFor='billingLastName'>Nom</label>
                          <input
                            type='text'
                            id='billingLastName'
                            className='w-full'
                            {...register("billingLastName", {
                              required: "Entrez un nom",
                            })}
                          />
                          {errors.billingLastName && (
                            <div className='text-red-500'>
                              {errors.billingLastName.message}
                            </div>
                          )}
                        </div>
                        <div className='mb-4'>
                          <label htmlFor='billingStreet'>Adresse</label>
                          <input
                            type='text'
                            id='billingStreet'
                            className='w-full'
                            {...register("billingStreet", {
                              required: "Entrez une adresse",
                              minLength: {
                                value: 3,
                                message:
                                  "L'adresse doit contenir au moins 3 caractères",
                              },
                            })}
                          />
                          {errors.billingStreet && (
                            <div className='text-red-500'>
                              {errors.billingStreet.message}
                            </div>
                          )}
                        </div>
                        <div className='mb-4'>
                          <label htmlFor='billingZip'>Code postal</label>
                          <input
                            type='text'
                            id='billingZip'
                            className='w-full'
                            {...register("billingZip", {
                              required: "Entrez un code postal",
                            })}
                          />
                          {errors.billingZip && (
                            <div className='text-red-500'>
                              {errors.billingZip.message}
                            </div>
                          )}
                        </div>
                        <div className='mb-4'>
                          <label htmlFor='billingCity'>Ville</label>
                          <input
                            type='text'
                            id='billingCity'
                            className='w-full'
                            {...register("billingCity", {
                              required: "Entrez une ville",
                            })}
                          />
                          {errors.billingCity && (
                            <div className='text-red-500'>
                              {errors.billingCity.message}
                            </div>
                          )}
                        </div>
                        <div className='mb-4'>
                          <label htmlFor='billingCountry'>Pays</label>
                          <input
                            type='text'
                            id='billingCountry'
                            className='w-full'
                            {...register("billingCountry", {
                              required: "Entrez un pays",
                            })}
                          />
                          {errors.billingCountry && (
                            <div className='text-red-500'>
                              {errors.billingCountry.message}
                            </div>
                          )}
                        </div>
                      </div>
                      <button className='primary-button mb-2 w-full'>
                        Enregistrer
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
