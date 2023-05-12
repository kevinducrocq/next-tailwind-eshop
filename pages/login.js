import React, { useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function LoginPage() {
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
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error, { autoClose: 1500 });
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title='Connexion'>
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>Connexion</h1>
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
            autoFocus
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
            autoFocus
          />
          {errors.password && (
            <div className='text-red-500'>{errors.password.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <button className='primary-button'>Connexion</button>
        </div>
        <div className='mb-4'>
          Vous n&apos;avez pas de compte ? &nbsp;
          <Link href={`/register?redirect=${redirect || "/"}`}>
            Inscrivez-vous
          </Link>
        </div>
      </form>
    </Layout>
  );
}
