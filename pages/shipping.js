import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import { Store } from "@/utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ShippingPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter();

  useEffect(() => {
    setValue("firstName", shippingAddress.firstName);
    setValue("lastName", shippingAddress.lastName);
    setValue("address", shippingAddress.address);
    setValue("zip", shippingAddress.zip);
    setValue("city", shippingAddress.city);
    setValue("country", shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({
    firstName,
    lastName,
    address,
    zip,
    city,
    country,
  }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { firstName, lastName, address, zip, city, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: { firstName, lastName, address, zip, city, country },
      })
    );
    router.push("/payment");
  };

  return (
    <Layout title='Adresse de livraison'>
      <CheckoutWizard activeStep={1} />
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>Adresse de livraison</h1>
        <div className='mb-4'>
          <label htmlFor='firstName'>Prénom</label>
          <input
            type='text'
            id='firstName'
            className='w-full'
            autoFocus
            {...register("firstName", { required: "Entrez votre prénom" })}
          />
          {errors.firstName && (
            <div className='text-red-500'>{errors.firstName.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='lastName'>Nom</label>
          <input
            type='text'
            id='lastName'
            className='w-full'
            autoFocus
            {...register("lastName", { required: "Entrez votre nom" })}
          />
          {errors.lastName && (
            <div className='text-red-500'>{errors.lastName.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='address'>Adresse</label>
          <input
            type='text'
            id='address'
            className='w-full'
            autoFocus
            {...register("address", {
              required: "Entrez votre adresse",
              minLength: {
                value: 3,
                message: "L'adresse doit contenir au moins 3 caractères",
              },
            })}
          />
          {errors.address && (
            <div className='text-red-500'>{errors.address.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='zip'>Code postal</label>
          <input
            type='text'
            id='zip'
            className='w-full'
            autoFocus
            {...register("zip", { required: "Entrez votre code postal" })}
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
            autoFocus
            {...register("city", { required: "Entrez votre ville" })}
          />
          {errors.city && (
            <div className='text-red-500'>{errors.city.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='country'>Pays</label>
          <input
            type='text'
            id='country'
            className='w-full'
            autoFocus
            {...register("country", { required: "Entrez votre pays" })}
          />
          {errors.country && (
            <div className='text-red-500'>{errors.country.message}</div>
          )}
        </div>
        <div className='mb-4 flex justify-between'>
          <button className='primary-button'>Suivant</button>
        </div>
      </form>
    </Layout>
  );
}

ShippingPage.auth = true;
