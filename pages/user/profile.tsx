import Layout from "@/components/Layout";
import ShippingAddressList from "@/components/ShippingAddressList";
import ShippingAddressModal from "@/components/ShippingAddressModal";
import Spinner from "@/components/Spinner";
import fetchAddresses from "@/domain/user/fetchAddresses";
import fetchUserById from "@/domain/user/fetchUserById";
import updateUser from "@/domain/user/updateUser";
import { getError } from "@/utils/error";
import { Disclosure } from "@headlessui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
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

export default function ProfilePage() {
  const [user, setUser] = useState("");
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const { data: session } = useSession();

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      fetchUserById(session?.user.id, setUser);
      dispatch({
        type: "FETCH_SUCCESS",
        payload: user,
      });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
  }, [session?.user.id, setValue]);

  useEffect(() => {
    try {
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("email", user.email);
      fetchAddresses(setShippingAddresses);
    } catch (err) {
      getError(err);
    }
  }, [setValue, user.email, user.firstName, user.lastName]);

  if (!user) {
    return <div>Erreur</div>;
  }

  const submitHandler = async ({ firstName, lastName, email, password }) => {
    try {
      const updatedUser = await updateUser(
        firstName,
        lastName,
        email,
        password
      );

      if (updatedUser) {
        if (updatedUser.error) {
          toast.error(updatedUser.error);
        } else {
          setUser(updatedUser);
          toast.success("Informations utilisateur mises à jour avec succès !");
        }
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Profil de ${user.firstName} ${user.lastName}`}>
      <h1 className='text-3xl font-semibold'>
        Profil de {user.firstName} {user.lastName}
      </h1>
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className='alert-error'>{error}</div>
      ) : (
        <div className='mt-5'>
          <div className='my-10 p-5 border bg-light'>
            <div className='p-5 max-w-screen-md'>
              <div>
                {user.firstName} {user.lastName}
              </div>
              <div>{user.email}</div>
            </div>
            <Disclosure>
              <Disclosure.Button className='py-2'>
                <h1 className='mb-4 primary-button'>
                  Mettre à jour vos informations
                </h1>
              </Disclosure.Button>
              <Disclosure.Panel className='p-5 bg-slate-100 rounded-xl'>
                <form
                  className='max-w-screen-md'
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <div className='flex justify-between'>
                    <div className='mb-4 '>
                      <label htmlFor='firstName'>Prénom</label>
                      <input
                        type='text'
                        className='w-full'
                        id='firstName'
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
                    <div className='mb-4 '>
                      <label htmlFor='lastName'>Nom</label>
                      <input
                        type='text'
                        className='w-full'
                        id='lastName'
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
                  </div>

                  <div className='mb-4 '>
                    <label htmlFor='email'>Email</label>
                    <input
                      name='email'
                      type='email'
                      className='w-full'
                      id='email'
                      {...register("email", {
                        required: "Entrez votre email",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                          message: "Entrez une adresse email valide",
                        },
                      })}
                    />
                    {errors.email && (
                      <div className='text-red-500'>{errors.email.message}</div>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='password'>Nouveau mot de passe</label>
                    <input
                      type='password'
                      name='password'
                      {...register("password", {
                        minLength: {
                          value: 6,
                          message:
                            "Le mot de passe doit contenir au moins 6 caractères",
                        },
                      })}
                      id='password'
                      className='w-full'
                    />
                    {errors.password && (
                      <div className='text-red-500'>
                        {errors.password.message}
                      </div>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='confirmPassword'>
                      Confirmez le nouveau mot de passe
                    </label>
                    <input
                      type='password'
                      name='confirmPassword'
                      {...register("confirmPassword", {
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
                      <div className='text-red-500'>
                        {errors.confirmPassword.message}
                      </div>
                    )}
                    {errors.confirmPassword &&
                      errors.confirmPassword.type === "validate" && (
                        <div className='text-red-500'>
                          Les mots de passe ne correspondent pas
                        </div>
                      )}
                  </div>
                  <div className='mb-4'>
                    <button className='primary-button' disabled={loadingUpdate}>
                      {loadingUpdate ? (
                        <Spinner hScreen={false} size='10' />
                      ) : (
                        "Mettre à jour"
                      )}
                    </button>
                  </div>
                </form>
              </Disclosure.Panel>
            </Disclosure>
          </div>
          <div>
            <h2 className='text-2xl font-semibold'>Adresses de livraison</h2>
            <hr />
            <div className='mx-auto grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-5'>
              <ShippingAddressList
                onDelete={() => fetchAddresses(setShippingAddresses)}
                shippingAddresses={shippingAddresses}
                isOrder={false}
              />

              <ShippingAddressModal
                onCreate={() => fetchAddresses(setShippingAddresses)}
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

ProfilePage.auth = true;
