import React, { useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import registerUser from "@/domain/user/registerUser";

export default function RegisterPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [redirect, router, session]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm();

  const submitHandler = async ({ firstName, lastName, email, password }) => {
    try {
      const newUser = await registerUser(firstName, lastName, email, password);
      if (newUser) {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result.error) {
          toast.error(result.error);
        }
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title='Inscription'>
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>Inscription</h1>
        <div className='mb-4'>
          <label htmlFor='firstName'>Prénom</label>
          <input
            type='firstName'
            name='firstName'
            {...register("firstName", {
              required: "Entrez votre prénom",
            })}
            id='firstName'
            className='w-full'
          />
          {errors.firstName && (
            <div className='text-red-500'>{errors.firstName.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='lastName'>Nom</label>
          <input
            type='lastName'
            name='lastName'
            {...register("lastName", {
              required: "Entrez votre Nom",
            })}
            id='lastName'
            className='w-full'
            autoFocus
          />
          {errors.lastName && (
            <div className='text-red-500'>{errors.lastName.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='firstName'>Prénom</label>
          <input
            type='firstName'
            name='firstName'
            {...register("firstName", {
              required: "Entrez votre prénom",
            })}
            id='firstName'
            className='w-full'
          />
          {errors.firstName && (
            <div className='text-red-500'>{errors.firstName.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            name='email'
            {...register("email", {
              required: "Entrez votre email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Entrez une adresse email valide",
              },
            })}
            id='email'
            className='w-full'
          />
          {errors.email && (
            <div className='text-red-500'>{errors.email.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='password'>Mot de passe</label>
          <input
            type='password'
            name='password'
            {...register("password", {
              required: "Entrez votre mot de passe",
              minLength: {
                value: 6,
                message: "Le mot de passe doit contenir au moins 6 caractères",
              },
            })}
            id='password'
            className='w-full'
          />
          {errors.password && (
            <div className='text-red-500'>{errors.password.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='confirmPassword'>Confirmez le mot de passe</label>
          <input
            type='password'
            name='confirmPassword'
            {...register("confirmPassword", {
              required: "Entrez votre mot de passe",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "doit contenir au moins 6 caractères",
              },
            })}
            id='confirmPassword'
            className='w-full'
          />
          {errors.confirmPassword && (
            <div className='text-red-500'>{errors.confirmPassword.message}</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className='text-red-500'>
                Les mots de passe ne correspondent pas
              </div>
            )}
        </div>
        <div className='mb-4'>
          <button className='primary-button'>Inscription</button>
        </div>
        <div className='mb-4'>
          Vous avez déjà un compte ? &nbsp;
          <Link href='/login'>Connectez-vous</Link>
        </div>
      </form>
    </Layout>
  );
}
