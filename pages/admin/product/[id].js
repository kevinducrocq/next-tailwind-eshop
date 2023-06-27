import AdminMenu from "@/components/AdminMenu";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import fetchProductById from "@/domain/admin/fetchProductById";
import { getError } from "@/utils/error";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";

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

export default function AdminProductEditPage() {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [product, setProduct] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        fetchProductById(productId, setProduct);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: product,
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [productId, setValue]);

  useEffect(() => {
    try {
      setValue("name", product.name);
      setValue("slug", product.slug);
      setValue("image", product.image);
      setValue("price", product.price);
      setValue("brand", product.brand);
      setValue("category", product.category?.name);
      setValue("countInStock", product.countInStock);
      setValue("description", product.description);
    } catch (err) {
      getError(err);
    }
  }, [
    product.brand,
    product.countInStock,
    product.description,
    product.image,
    product.name,
    product.price,
    product.slug,
    product.category?.name,
    setValue,
  ]);

  return (
    <Layout title={`Admin - Edition produit : ${product.name}`}>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid md:grid-cols-4 md:gap5'>
          <AdminMenu />
          <div className='md:col-span-3'>
            {loading ? (
              <Spinner />
            ) : error ? (
              <div className='alert-error'>{error}</div>
            ) : (
              <form
                className='mx-auto max-w-screen-md'
                onSubmit={handleSubmit()}
              >
                <h1 className='mb-4 text-xl'>
                  Edition du produit : {product.name}
                </h1>
                <div className='mb-4 '>
                  <label htmlFor='name'>Nom</label>
                  <input
                    name='name'
                    type='text'
                    className='w-full'
                    id='name'
                    {...register("name", {
                      required: "Entrez le nom du produit",
                    })}
                  />
                  {errors.name && (
                    <div className='text-red-500'>{errors.name.message}</div>
                  )}
                </div>
                <div className='mb-4'>
                  <label htmlFor='slug'>Slug : </label>
                  <span>{product.slug}</span>
                </div>
                <div className='mb-4 '>
                  <label htmlFor='name'>Prix</label>
                  <input
                    name='price'
                    type='text'
                    className='w-full'
                    id='price'
                    {...register("price", {
                      required: "Entrez le prix du produit",
                    })}
                  />
                  {errors.price && (
                    <div className='text-red-500'>{errors.price.message}</div>
                  )}
                </div>
                <div className='mb-4 '>
                  <label htmlFor='countInStock'>Stock</label>
                  <input
                    name='countInStock'
                    type='text'
                    className='w-full'
                    id='countInStock'
                    {...register("countInStock", {
                      required: "Entrez le stock du produit",
                    })}
                  />
                  {errors.price && (
                    <div className='text-red-500'>{errors.price.message}</div>
                  )}
                </div>
                <div className='mb-4 '>
                  <label htmlFor='image'>Image</label>
                  <input
                    name='image'
                    type='text'
                    className='w-full'
                    id='image'
                    {...register("image", {
                      required: "Entrez le prix du produit",
                    })}
                  />
                  {errors.image && (
                    <div className='text-red-500'>{errors.image.message}</div>
                  )}
                </div>
                <div className='mb-4 '>
                  <label htmlFor='category'>Catégorie</label>
                  <input
                    name='category'
                    type='text'
                    className='w-full'
                    id='category'
                    {...register("category", {
                      required: "Entrez la catégorie du produit",
                    })}
                  />
                  {errors.category && (
                    <div className='text-red-500'>
                      {errors.category.message}
                    </div>
                  )}
                </div>
                <div className='mb-4 '>
                  <label htmlFor='brand'>Marque</label>
                  <input
                    name='brand'
                    type='text'
                    className='w-full'
                    id='brand'
                    {...register("brand", {
                      required: "Entrez la marque du produit",
                    })}
                  />
                  {errors.brand && (
                    <div className='text-red-500'>{errors.brand.message}</div>
                  )}
                </div>
                <div className='mb-4 '>
                  <label htmlFor='description'>Description</label>
                  <textarea
                    name='description'
                    type='text'
                    className='w-full'
                    id='description'
                    {...register("description", {
                      required: "Entrez la description du produit",
                    })}
                  />
                  {errors.description && (
                    <div className='text-red-500'>
                      {errors.description.message}
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
AdminProductEditPage.auth = { adminOnly: true };
